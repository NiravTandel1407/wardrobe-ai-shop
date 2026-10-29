import React, { useEffect, useState } from 'react';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import NewArrivals from '../components/NewArrivals';
import Catalog from '../components/Catalog';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { useFilters } from '../hooks/useFilters';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';

export const Home = () => {
  const [products, setProducts] = useState(null);
  const filterState = useFilters(products);
  const { isCartOpen, closeCart } = useCart();

  useEffect(() => {
    let mounted = true;
    getProducts().then((data) => {
      if (mounted && data) {
        setProducts(data);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const handleTrendingClick = () => {
    filterState.setSortBy('trending');
  };

  const handleFilterCategory = (cat) => {
    if (!filterState.selectedCategories.includes(cat)) {
      filterState.toggleCategory(cat);
    }
    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 1. Announcement bar */}
      <AnnouncementBar />

      {/* 2. Header */}
      <Header
        onFilterCategory={handleFilterCategory}
        onSortChange={filterState.setSortBy}
      />

      <main className="flex-1">
        {/* 3. Hero */}
        <Hero onTrendingClick={handleTrendingClick} />

        {/* 4. Featured products */}
        <FeaturedProducts products={products} />

        {/* 5. New arrivals */}
        <NewArrivals products={products} />

        {/* 6. Filters and product catalog */}
        <Catalog filterState={filterState} />

        {/* 7. Newsletter band */}
        <Newsletter />
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* 9. Slide-over Shopping Bag */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
};

export default Home;
