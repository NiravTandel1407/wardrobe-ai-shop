import React, { useState } from 'react';
import { Search, User, ShoppingBag, Menu } from 'lucide-react';
import Section from './Section';
import Logo from './Logo';
import MobileDrawer from './MobileDrawer';
import { useCart } from '../context/CartContext';

export const Header = ({ onFilterCategory, onSortChange }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { cartCount, openCart } = useCart();

  const handleNavClick = (e, targetId, sortType = null, category = null) => {
    if (sortType && onSortChange) onSortChange(sortType);
    if (category && onFilterCategory) onFilterCategory(category);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-brand-border">
        {/* Main Nav Bar */}
        <Section as="div" className="bg-white">
          <div className="h-16 flex items-center justify-between">
            {/* Mobile Layout (< 1024px) */}
            <div className="grid grid-cols-[36px_1fr_36px] items-center w-full lg:hidden">
              {/* Hamburger Icon */}
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="p-1.5 text-brand-ink hover:text-black focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded-btn flex items-center justify-center"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Centered Logo */}
              <div className="flex justify-center min-w-0">
                <Logo />
              </div>

              {/* Shopping Bag Icon with Badge */}
              <button
                type="button"
                onClick={openCart}
                className="p-1.5 relative text-brand-ink hover:text-black focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded-btn flex items-center justify-center justify-self-end"
                aria-label={`Shopping bag with ${cartCount} items`}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-yellow text-brand-ink text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* Desktop Layout (>= 1024px) */}
            <div className="hidden lg:flex items-center justify-between w-full">
              {/* Left: Logo */}
              <div className="flex-shrink-0">
                <Logo />
              </div>

              {/* Center: Nav Links */}
              <nav className="flex items-center gap-8" aria-label="Main navigation">
                <a
                  href="#new-arrivals"
                  className="relative text-sm font-medium text-brand-ink hover:text-black transition-colors py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-brand-yellow"
                >
                  New arrivals
                </a>

                <a
                  href="#catalog"
                  onClick={(e) => handleNavClick(e, 'catalog', 'trending')}
                  className="text-sm font-normal text-brand-ink hover:text-black transition-colors py-1"
                >
                  Trending
                </a>

                <a
                  href="#catalog"
                  onClick={(e) => handleNavClick(e, 'catalog', null, 'Men')}
                  className="text-sm font-normal text-brand-ink hover:text-black transition-colors py-1"
                >
                  Men
                </a>

                <a
                  href="#catalog"
                  onClick={(e) => handleNavClick(e, 'catalog', null, 'Women')}
                  className="text-sm font-normal text-brand-ink hover:text-black transition-colors py-1"
                >
                  Women
                </a>

                <a
                  href="#catalog"
                  className="text-sm font-medium text-brand-sale hover:opacity-85 transition-opacity py-1"
                >
                  Sale
                </a>
              </nav>

              {/* Right: Icon Buttons */}
              <div className="flex items-center gap-5 text-brand-ink">
                <button
                  type="button"
                  className="p-1.5 text-brand-ink hover:text-black focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded-btn transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 stroke-[1.75]" />
                </button>

                <button
                  type="button"
                  className="p-1.5 text-brand-ink hover:text-black focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded-btn transition-colors"
                  aria-label="User Account"
                >
                  <User className="w-5 h-5 stroke-[1.75]" />
                </button>

                <button
                  type="button"
                  onClick={openCart}
                  className="p-1.5 relative text-brand-ink hover:text-black focus:outline-none focus:ring-2 focus:ring-brand-yellow rounded-btn transition-colors"
                  aria-label={`Shopping bag with ${cartCount} items`}
                >
                  <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-1 bg-brand-yellow text-brand-ink text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </Section>

        {/* Mobile Horizontal Quick Filter Chip Row */}
        <div className="lg:hidden border-t border-brand-border bg-white overflow-x-auto no-scrollbar py-2.5 px-4 flex items-center gap-2">
          <a
            href="#new-arrivals"
            className="flex-shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full bg-brand-yellow text-brand-ink"
          >
            New
          </a>
          <a
            href="#catalog"
            onClick={(e) => handleNavClick(e, 'catalog', 'trending')}
            className="flex-shrink-0 text-xs font-normal px-3.5 py-1.5 rounded-full border border-brand-border text-brand-ink hover:bg-neutral-50"
          >
            Trending
          </a>
          <a
            href="#catalog"
            onClick={(e) => handleNavClick(e, 'catalog', null, 'Men')}
            className="flex-shrink-0 text-xs font-normal px-3.5 py-1.5 rounded-full border border-brand-border text-brand-ink hover:bg-neutral-50"
          >
            Men
          </a>
          <a
            href="#catalog"
            onClick={(e) => handleNavClick(e, 'catalog', null, 'Women')}
            className="flex-shrink-0 text-xs font-normal px-3.5 py-1.5 rounded-full border border-brand-border text-brand-ink hover:bg-neutral-50"
          >
            Women
          </a>
          <a
            href="#catalog"
            className="flex-shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border border-[#fbdcd2] bg-[#fff5f3] text-brand-sale hover:bg-[#ffece7]"
          >
            Sale
          </a>
        </div>
      </header>

      {/* Slide-in Mobile Drawer */}
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onFilterCategory={onFilterCategory}
        onSortChange={onSortChange}
      />
    </>
  );
};

export default Header;
