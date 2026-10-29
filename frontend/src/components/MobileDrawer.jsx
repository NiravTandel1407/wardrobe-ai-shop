import React, { useEffect } from 'react';
import { X, Search, User, ShoppingBag, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../context/CartContext';

export const MobileDrawer = ({ isOpen, onClose, activeSection = 'new-arrivals' }) => {
  const { cartCount } = useCart();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-[280px] sm:w-[320px] bg-white shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 ease-out">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
            <Logo />
            <button
              onClick={onClose}
              className="p-1.5 text-brand-ink hover:bg-neutral-100 rounded-btn transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-5 flex flex-col gap-4">
            <a
              href="#new-arrivals"
              onClick={onClose}
              className="flex items-center justify-between text-base font-medium text-brand-ink py-2 border-b-2 border-brand-yellow w-fit"
            >
              New arrivals
              <ArrowRight className="w-4 h-4 ml-2 text-brand-yellow" />
            </a>

            <a
              href="#catalog"
              onClick={onClose}
              className="text-base font-normal text-brand-ink hover:text-black py-1"
            >
              Trending
            </a>

            <a
              href="#catalog"
              onClick={onClose}
              className="text-base font-normal text-brand-ink hover:text-black py-1"
            >
              Men
            </a>

            <a
              href="#catalog"
              onClick={onClose}
              className="text-base font-normal text-brand-ink hover:text-black py-1"
            >
              Women
            </a>

            <a
              href="#catalog"
              onClick={onClose}
              className="text-base font-medium text-brand-sale hover:opacity-80 py-1"
            >
              Sale
            </a>
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 border-t border-brand-border bg-neutral-50 flex flex-col gap-3">
          <button
            onClick={onClose}
            className="flex items-center gap-3 text-sm font-medium text-brand-ink py-2 px-3 rounded-btn hover:bg-white"
          >
            <Search className="w-4 h-4 text-brand-muted" />
            Search catalog
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-3 text-sm font-medium text-brand-ink py-2 px-3 rounded-btn hover:bg-white"
          >
            <User className="w-4 h-4 text-brand-muted" />
            My Account
          </button>
          <a
            href="#catalog"
            onClick={onClose}
            className="flex items-center justify-between text-sm font-medium text-brand-ink py-2 px-3 rounded-btn bg-brand-yellow/30"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-brand-ink" />
              <span>Shopping Bag</span>
            </div>
            <span className="bg-brand-ink text-brand-yellow text-xs px-2 py-0.5 rounded-full font-bold">
              {cartCount}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;

