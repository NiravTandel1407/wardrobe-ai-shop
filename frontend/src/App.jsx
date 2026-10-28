import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import AddProductModal from './components/AddProductModal';
import CartDrawer from './components/CartDrawer';
import { fetchProducts, fetchCategories } from './api';
import './App.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  // Modals & Drawers
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('wardrobe_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart
  useEffect(() => {
    localStorage.setItem('wardrobe_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Load catalog data with server-side filters
  const loadCatalog = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = { limit: 100 };
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedGender !== 'all') params.gender = selectedGender;

      const [prodsData, catsData] = await Promise.all([
        fetchProducts(params),
        categories.length === 0 ? fetchCategories() : Promise.resolve(categories),
      ]);
      setProducts(prodsData);
      if (categories.length === 0) setCategories(catsData);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to connect to backend server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalog();
  }, [searchTerm, selectedCategory, selectedGender]);

  // Category map for quick lookup
  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  // Sorted Catalog
  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === 'price-asc') {
      list.sort((a, b) => Number(a.base_price) - Number(b.base_price));
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => Number(b.base_price) - Number(a.base_price));
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [products, sortBy]);


  // Cart operations
  const handleAddToCart = (product, variant) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.product.id === product.id && i.variant?.id === variant?.id
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += 1;
        return next;
      }

      return [...prev, { product, variant, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, variantId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId, variantId);
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.variant?.id === variantId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId, variantId) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.variant?.id === variantId)
      )
    );
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToCatalog = () => {
    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleShopCategory = (keyword) => {
    const matchedCategory = categories.find((c) =>
      c.name.toLowerCase().includes(keyword.toLowerCase())
    );
    if (matchedCategory) {
      setSelectedCategory(String(matchedCategory.id));
      setSearchTerm('');
    } else {
      setSearchTerm(keyword);
    }
    scrollToCatalog();
  };

  const handleProductCreated = (newProduct) => {
    // Add new product to front of list
    setProducts((prev) => [newProduct, ...prev]);
    // Refresh categories in case a new category was created
    fetchCategories().then(setCategories).catch(console.error);
    // Smooth scroll down to catalog to show the new item
    scrollToCatalog();
  };

  return (
    <div className="app-container">
      {/* Sticky Header with Logo & Add Product */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenAddProduct={() => setIsAddProductOpen(true)}
      />

      {/* Full-width Streetwear Hero */}
      <Hero
        onShopClick={scrollToCatalog}
        onCategorySelect={handleShopCategory}
      />

      <main className="main-content" id="catalog">
        <div className="catalog-heading-row">
          <h2 className="catalog-title">
            FEATURED <span>CATALOG</span>
          </h2>
        </div>

        {/* Filter & Sort Bar */}
        <FilterBar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedGender={selectedGender}
          onSelectGender={setSelectedGender}
          sortBy={sortBy}
          onSortChange={setSortBy}
          totalResults={sortedProducts.length}
        />

        {/* Main Catalog View */}
        {loading ? (
          <div className="state-loading">
            <div className="spinner"></div>
            <p>Loading wardrobe catalog...</p>
          </div>
        ) : error ? (
          <div className="state-error">
            <h3>Unable to load catalog</h3>
            <p>{error}</p>
            <button className="retry-btn" onClick={loadCatalog}>
              Retry Connection
            </button>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="state-empty">
            <h3>No wardrobe pieces match your filter</h3>
            <p>Try resetting your filters or search terms.</p>
            <button
              className="retry-btn"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedGender('all');
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryMap[product.category_id]}
                onQuickView={setQuickViewProduct}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <ProductModal
          product={quickViewProduct}
          categoryName={categoryMap[quickViewProduct.category_id]}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        categories={categories}
        onProductCreated={handleProductCreated}
      />

      {/* Cart Slide-over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
}
