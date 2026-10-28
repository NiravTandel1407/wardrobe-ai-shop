import React from 'react';
import { ShoppingBag, Search, PlusCircle } from 'lucide-react';
import Logo from './Logo';

export default function Navbar({ cartCount, onOpenCart, searchTerm, onSearchChange, onOpenAddProduct }) {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Brand with the Official WARDROBE Logo */}
        <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo size={34} variant="dark" />
        </div>

        {/* Global Search */}
        <div className="search-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search hoodies, tees, jackets, trousers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => onSearchChange('')}>
              ×
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          {/* Admin Add Product Trigger */}
          <button
            className="btn-nav-add-product"
            onClick={onOpenAddProduct}
            aria-label="Add product"
          >
            <PlusCircle size={16} />
            <span>Add Product</span>
          </button>

          {/* Cart Bag */}
          <button className="cart-btn" onClick={onOpenCart} aria-label="Shopping bag">
            <ShoppingBag size={20} />
            <span className="cart-label">Bag</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
