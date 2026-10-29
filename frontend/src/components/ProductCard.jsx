import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Plus } from 'lucide-react';
import ShirtIcon from './ShirtIcon';
import { useCart } from '../context/CartContext';

export const ProductCard = ({
  product,
  aspectRatio = 'aspect-[4/5]',
  badge = null,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart(product);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsWishlisted(!isWishlisted);
  };

  const formattedPrice = `₹${product.price.toLocaleString('en-IN')}`;

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col cursor-pointer select-none"
    >
      {/* Pastel Image Tile */}
      <div
        className={`w-full ${aspectRatio} rounded-card relative overflow-hidden flex items-center justify-center transition-transform duration-200 ease-out group-hover:-translate-y-1`}
        style={{ backgroundColor: product.tileColor || '#E8E8E8' }}
      >
        {/* Optional Badge */}
        {(badge || product.isNew) && (
          <div className="absolute top-2.5 left-2.5 bg-brand-ink text-brand-yellow text-[11px] font-medium px-2 py-0.5 rounded-full z-10 pointer-events-none">
            {badge || 'New'}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2.5 right-2.5 p-1.5 rounded-full transition-all z-10 ${
            isWishlisted
              ? 'text-red-500 bg-white/80'
              : 'text-brand-muted/70 hover:text-brand-ink opacity-0 group-hover:opacity-100 sm:opacity-0 focus:opacity-100 bg-white/60 hover:bg-white'
          }`}
        >
          <Heart
            className="w-4 h-4"
            fill={isWishlisted ? 'currentColor' : 'none'}
            strokeWidth={1.8}
          />
        </button>

        {/* Centered Graphic / Photo */}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="transition-transform duration-300 group-hover:scale-110 opacity-75 group-hover:opacity-100">
            <ShirtIcon className="w-16 h-16 sm:w-20 sm:h-20 text-brand-ink/80" strokeWidth={1.75} />
          </div>
        )}

        {/* Quick Add to Cart button */}
        <div className="absolute inset-x-3 bottom-3 z-10 transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 sm:opacity-0 sm:translate-y-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-brand-ink text-brand-yellow text-xs font-medium py-2 rounded-btn flex items-center justify-center gap-1.5 hover:bg-neutral-800 transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to bag</span>
          </button>
        </div>

        {/* Mobile-only subtle add button */}
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to bag`}
          className="sm:hidden absolute bottom-2 right-2 bg-brand-ink text-brand-yellow p-1.5 rounded-full shadow-sm z-10"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Card Info */}
      <div className="mt-2.5 flex flex-col">
        <h3 className="text-xs sm:text-sm font-medium text-brand-ink truncate leading-tight group-hover:text-black">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-brand-muted mt-0.5 font-normal">
          {formattedPrice}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
