import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  User,
  ShoppingBag,
  ArrowRight,
  Package,
  Bell,
  LogOut,
  ShieldCheck,
  LogIn
} from 'lucide-react';
import Logo from './Logo';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const MobileDrawer = ({ isOpen, onClose, activeSection = 'new-arrivals' }) => {
  const { cartCount, openCart } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleCartClick = () => {
    onClose();
    const token = localStorage.getItem('wardrobe_token');
    if (!user && !token) {
      navigate('/login');
    } else {
      openCart();
    }
  };

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
      <div className="fixed inset-y-0 left-0 w-[290px] sm:w-[320px] bg-white shadow-2xl flex flex-col justify-between z-10 transition-transform duration-300 ease-out overflow-y-auto">
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

          {/* User Status Bar if logged in */}
          {user && (
            <div className="px-5 py-3 bg-brand-footer/60 border-b border-brand-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-brand-ink text-brand-yellow font-bold text-xs flex items-center justify-center">
                  {(user.full_name || user.email || 'U')[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-brand-ink truncate">{user.full_name || 'Member'}</div>
                  <div className="text-[10px] text-brand-muted truncate">{user.email}</div>
                </div>
              </div>
              {isAdmin && (
                <span className="text-[9px] font-bold uppercase tracking-wider bg-brand-yellow text-brand-ink px-1.5 py-0.5 rounded">
                  Admin
                </span>
              )}
            </div>
          )}

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
              className="text-base font-normal text-brand-ink py-1.5"
            >
              Trending
            </a>

            <a
              href="#catalog"
              onClick={onClose}
              className="text-base font-normal text-brand-ink py-1.5"
            >
              Men
            </a>

            <a
              href="#catalog"
              onClick={onClose}
              className="text-base font-normal text-brand-ink py-1.5"
            >
              Women
            </a>

            <a
              href="#catalog"
              onClick={onClose}
              className="text-base font-medium text-brand-sale py-1.5"
            >
              Sale
            </a>
          </nav>
        </div>

        {/* User Account & Actions Section */}
        <div className="p-5 border-t border-brand-border bg-brand-footer flex flex-col gap-2">
          {user ? (
            <>
              <button
                onClick={() => {
                  onClose();
                  alert(`Logged in as ${user.email} (${isAdmin ? 'Admin' : 'Customer'})`);
                }}
                className="flex items-center gap-3 text-xs font-medium text-brand-ink py-2 px-3 rounded-btn hover:bg-white text-left transition"
              >
                <User className="w-4 h-4 text-brand-muted" />
                Profile
              </button>

              <button
                onClick={() => {
                  onClose();
                  alert('No active orders. Your placed orders will appear here.');
                }}
                className="flex items-center gap-3 text-xs font-medium text-brand-ink py-2 px-3 rounded-btn hover:bg-white text-left transition"
              >
                <Package className="w-4 h-4 text-brand-muted" />
                Orders
              </button>

              <button
                onClick={() => {
                  onClose();
                  alert('Notifications: Summer drop is live!');
                }}
                className="flex items-center justify-between text-xs font-medium text-brand-ink py-2 px-3 rounded-btn hover:bg-white text-left transition"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-brand-muted" />
                  <span>Notifications</span>
                </div>
                <span className="text-[10px] bg-brand-yellow px-1.5 py-0.2 rounded-full font-bold">2</span>
              </button>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={onClose}
                  className="flex items-center justify-between text-xs font-bold text-brand-ink py-2 px-3 rounded-btn bg-brand-yellow/30 hover:bg-brand-yellow/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-brand-ink" />
                    <span>Admin Portal</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-ink" />
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  onClose();
                }}
                className="flex items-center gap-3 text-xs font-semibold text-red-600 py-2 px-3 rounded-btn hover:bg-red-50 text-left transition"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={onClose}
              className="flex items-center gap-3 text-sm font-semibold text-brand-ink py-2 px-3 rounded-btn bg-white border border-brand-border shadow-xs hover:border-black transition"
            >
              <LogIn className="w-4 h-4 text-brand-ink" />
              Sign In / Register
            </Link>
          )}

          <button
            type="button"
            onClick={handleCartClick}
            className="w-full flex items-center justify-between text-sm font-semibold text-brand-ink py-2.5 px-3 rounded-btn bg-brand-yellow hover:brightness-95 transition mt-1"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-4 h-4 text-brand-ink" />
              <span>Shopping Bag</span>
            </div>
            <span className="bg-brand-ink text-brand-yellow text-xs px-2 py-0.5 rounded-full font-bold">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileDrawer;
