import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import Section from '../components/Section';
import ShirtIcon from '../components/ShirtIcon';
import ProductGrid from '../components/ProductGrid';
import { useCart } from '../context/CartContext';
import { getProductById, getProducts } from '../services/api';
import { Heart, Plus, Minus, ArrowLeft, Check, Truck, RotateCcw, ShieldCheck } from 'lucide-react';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isCartOpen, closeCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState('black');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    getProductById(id).then((data) => {
      setProduct(data);
      if (data?.sizes?.length > 0) setSelectedSize(data.sizes[0]);
      if (data?.colour) setSelectedColor(data.colour);
      setLoading(false);
    });

    getProducts(0, 4).then((list) => {
      if (list) {
        setRelated(list.filter((p) => String(p.id) !== String(id)).slice(0, 4));
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AnnouncementBar />
        <Header />
        <div className="flex-1 flex items-center justify-center py-20 text-brand-muted">
          Loading product details...
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <AnnouncementBar />
        <Header />
        <Section as="div" className="flex-1 flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-medium text-brand-ink">Product not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 inline-flex items-center gap-2 bg-brand-ink text-brand-yellow px-5 py-2.5 rounded-btn text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to shop
          </button>
        </Section>
        <Footer />
      </div>
    );
  }

  const handleAdd = () => {
    // Add product with chosen size & color and quantity
    addToCart(
      {
        ...product,
        selectedSize,
        selectedColor,
      },
      quantity,
      {
        selectedSize,
        selectedColor,
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        <Section as="div" className="py-8 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-brand-muted mb-6">
            <Link to="/" className="hover:text-brand-ink transition-colors">Home</Link>
            <span>/</span>
            <span className="capitalize">{product.category}</span>
            <span>/</span>
            <span className="text-brand-ink font-medium truncate">{product.name}</span>
          </nav>

          {/* Product Layout: 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Left: Product Image / Mockup Tile */}
            <div
              className="w-full aspect-[4/5] rounded-hero relative overflow-hidden flex items-center justify-center shadow-sm"
              style={{ backgroundColor: product.tileColor || '#FFF3B0' }}
            >
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-brand-ink text-brand-yellow text-xs font-semibold px-3 py-1 rounded-full z-10">
                  New Arrival
                </div>
              )}

              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ShirtIcon className="w-32 h-32 text-brand-ink/80" strokeWidth={1.75} />
              )}
            </div>

            {/* Right: Product Info & Actions */}
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-wider text-brand-muted font-medium mb-1.5">
                {product.category} &middot; {product.gender || 'Unisex'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-semibold text-brand-ink tracking-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-brand-ink">
                  ₹{product.price?.toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Description */}
              <p className="mt-4 text-xs sm:text-sm text-brand-muted leading-relaxed font-normal">
                {product.description ||
                  'Crafted from heavy 100% combed cotton with a relaxed streetwear cut. Reinforced collar, pre-shrunk fabric, and bold signature silhouette for everyday movement.'}
              </p>

              {/* Size Selector */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-ink">
                    Select Size
                  </span>
                  <button className="text-xs text-brand-muted underline hover:text-brand-ink">
                    Size guide
                  </button>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.sizes?.map((size) => {
                    const isSelected = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`w-11 h-11 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-brand-ink text-brand-yellow border-2 border-brand-ink'
                            : 'bg-white border border-brand-border text-brand-ink hover:border-neutral-400'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity & CTA */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                {/* Quantity Control */}
                <div className="inline-flex items-center border border-brand-border rounded-btn bg-white self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-neutral-100 text-brand-ink transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-semibold px-4 text-brand-ink min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-neutral-100 text-brand-ink transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex-1 bg-brand-ink text-brand-yellow py-3.5 px-6 rounded-btn text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add to bag &middot; ₹{(product.price * quantity).toLocaleString('en-IN')}</span>
                </button>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label="Save to wishlist"
                  className={`p-3.5 rounded-btn border transition-colors flex items-center justify-center ${
                    isWishlisted
                      ? 'border-red-400 text-red-500 bg-red-50'
                      : 'border-brand-border text-brand-ink hover:border-neutral-400 bg-white'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={isWishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Guarantees / Badges */}
              <div className="mt-8 pt-6 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-brand-muted">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-brand-ink" />
                  <span>Free shipping on ₹999+</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-brand-ink" />
                  <span>15-day easy returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-ink" />
                  <span>100% Genuine streetwear</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-brand-border/60">
              <h2 className="text-lg font-medium text-brand-ink mb-6">
                You might also like
              </h2>
              <ProductGrid
                products={related}
                aspectRatio="aspect-[4/5]"
                columns="grid-cols-2 sm:grid-cols-2 lg:grid-cols-4"
              />
            </div>
          )}
        </Section>
      </main>

      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
};

export default ProductDetail;
