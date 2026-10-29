import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Package,
  Bell,
  LogOut,
  LogIn,
  ShieldCheck,
  ChevronRight,
  X,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function UserMenu() {
  const { user, token, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null); // 'profile' | 'orders' | 'notifications' | null
  const hoverTimeoutRef = useRef(null);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveModal(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  // Hover handlers with smooth close delay (so mouse transition from button to menu is fluid)
  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250);
  };

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  const openActionModal = (modalName) => {
    setIsOpen(false);
    if (!token && modalName !== 'notifications') {
      navigate('/login');
      return;
    }
    setActiveModal(modalName);
  };

  return (
    <>
      <div
        ref={menuRef}
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* User Icon Button */}
        <button
          type="button"
          onClick={handleToggle}
          className={`p-1.5 rounded-btn transition-colors relative flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-brand-yellow ${
            isOpen ? 'text-black bg-brand-footer/80 ring-1 ring-brand-yellow' : 'text-brand-ink hover:text-black hover:bg-neutral-50'
          }`}
          aria-haspopup="true"
          aria-expanded={isOpen}
          aria-label="User Account Menu"
        >
          {user ? (
            <div className="w-5 h-5 rounded-full bg-brand-ink text-brand-yellow flex items-center justify-center text-[10px] font-bold">
              {(user.full_name || user.email || 'U')[0].toUpperCase()}
            </div>
          ) : (
            <User className="w-5 h-5 stroke-[1.75]" />
          )}

          {/* Online / Active Indicator if logged in */}
          {user && (
            <span className="absolute 0 top-1 right-1 w-2 h-2 rounded-full bg-green-500 ring-2 ring-white" />
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div
            className="absolute right-0 top-full mt-2 w-72 bg-white border border-brand-border rounded-2xl shadow-xl py-2 z-50 animate-fadeIn"
            role="menu"
            aria-orientation="vertical"
          >
            {/* Header: User Info or Guest Welcome */}
            <div className="px-4 py-3 border-b border-brand-border/70 bg-brand-footer/30 rounded-t-2xl">
              {user ? (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-ink truncate max-w-[160px]">
                      {user.full_name || 'Wardrobe Member'}
                    </span>
                    {isAdmin && (
                      <span className="px-2 py-0.5 bg-brand-yellow text-brand-ink text-[10px] font-bold uppercase tracking-wider rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-brand-muted truncate mt-0.5">{user.email}</p>
                </div>
              ) : (
                <div>
                  <div className="text-xs font-bold text-brand-ink">Welcome to Wardrobe</div>
                  <p className="text-[11px] text-brand-muted mt-0.5">
                    Sign in to track orders and save favorites.
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-1.5 px-3 bg-brand-ink text-white text-xs font-semibold rounded-btn hover:bg-black text-center transition"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="py-1.5 px-3 border border-brand-border text-xs font-medium text-brand-ink rounded-btn hover:bg-white text-center transition"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Options */}
            <div className="py-1 text-xs text-brand-ink">
              {/* Profile */}
              <button
                type="button"
                onClick={() => openActionModal('profile')}
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-brand-footer transition group text-left"
                role="menuitem"
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-brand-muted group-hover:text-black transition" />
                  <span className="font-medium">Profile</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-brand-muted/60 group-hover:text-black transition" />
              </button>

              {/* Orders */}
              <button
                type="button"
                onClick={() => openActionModal('orders')}
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-brand-footer transition group text-left"
                role="menuitem"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-brand-muted group-hover:text-black transition" />
                  <span className="font-medium">My Orders</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-brand-muted/60 group-hover:text-black transition" />
              </button>

              {/* Notifications */}
              <button
                type="button"
                onClick={() => openActionModal('notifications')}
                className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-brand-footer transition group text-left"
                role="menuitem"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Bell className="w-4 h-4 text-brand-muted group-hover:text-black transition" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-brand-yellow" />
                  </div>
                  <span className="font-medium">Notifications</span>
                </div>
                <span className="px-1.5 py-0.5 bg-brand-footer text-[10px] font-semibold text-brand-ink rounded-full border border-brand-border">
                  2 new
                </span>
              </button>

              {/* Admin Portal (if admin user) */}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-brand-yellow/20 transition group text-left"
                  role="menuitem"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-brand-ink" />
                    <span className="font-bold text-brand-ink">Admin Portal</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 bg-brand-yellow text-brand-ink rounded">
                    Manage
                  </span>
                </Link>
              )}
            </div>

            {/* Bottom Actions: Logout or Login */}
            <div className="pt-1 mt-1 border-t border-brand-border/70">
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-xs text-red-600 hover:bg-red-50 transition font-medium text-left"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  <span>Log out</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-xs text-brand-ink hover:bg-brand-footer transition font-medium text-left"
                  role="menuitem"
                >
                  <LogIn className="w-4 h-4 text-brand-muted" />
                  <span>Sign In to your account</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* QUICK VIEW MODALS (Profile, Orders, Notifications)       */}
      {/* ======================================================== */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-brand-border rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-1.5 text-brand-muted hover:text-black rounded-btn transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Profile Modal */}
            {activeModal === 'profile' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-brand-ink text-brand-yellow font-bold text-lg flex items-center justify-center">
                    {(user?.full_name || user?.email || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-brand-ink">
                      {user?.full_name || 'Wardrobe Member'}
                    </h3>
                    <p className="text-xs text-brand-muted">{user?.email}</p>
                  </div>
                </div>

                <div className="p-3.5 bg-brand-footer/50 border border-brand-border rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Account ID:</span>
                    <span className="font-mono font-medium text-brand-ink">#{user?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Role:</span>
                    <span className="font-medium text-brand-ink">{isAdmin ? 'Administrator' : 'Customer'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-brand-muted">Member Since:</span>
                    <span className="font-medium text-brand-ink">2026</span>
                  </div>
                </div>

                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setActiveModal(null)}
                    className="w-full py-2.5 px-4 bg-brand-yellow text-brand-ink font-bold text-xs uppercase tracking-wider rounded-btn hover:brightness-95 flex items-center justify-center gap-2 transition"
                  >
                    <ShieldCheck className="w-4 h-4" /> Go to Admin Portal
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-xs text-red-600 font-semibold hover:underline text-center"
                >
                  Log out of this device
                </button>
              </div>
            )}

            {/* Orders Modal */}
            {activeModal === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-ink" />
                  <h3 className="font-bold text-base text-brand-ink">Order History</h3>
                </div>

                <div className="p-6 bg-brand-footer/30 border border-brand-border rounded-xl text-center space-y-2">
                  <ShoppingBag className="w-8 h-8 text-brand-muted/40 mx-auto" />
                  <p className="text-xs font-semibold text-brand-ink">No recent orders yet</p>
                  <p className="text-[11px] text-brand-muted max-w-xs mx-auto">
                    Once you check out from our streetwear collection, you can track delivery status right here.
                  </p>
                </div>

                <Link
                  to="/"
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 px-4 bg-brand-ink text-white font-semibold text-xs rounded-btn hover:bg-black flex items-center justify-center transition"
                >
                  Explore Collection
                </Link>
              </div>
            )}

            {/* Notifications Modal */}
            {activeModal === 'notifications' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-brand-ink" />
                  <h3 className="font-bold text-base text-brand-ink">Notifications</h3>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 bg-brand-yellow/10 border border-brand-yellow/40 rounded-xl flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-brand-ink mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-brand-ink">New Summer Drop is Live!</h4>
                      <p className="text-[11px] text-brand-muted mt-0.5">
                        Boxy vintage tees and oversized acid-wash hoodies are now in stock.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-brand-footer/40 border border-brand-border rounded-xl flex items-start gap-3">
                    <Package className="w-4 h-4 text-brand-muted mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-brand-ink">Welcome to WARDROBE</h4>
                      <p className="text-[11px] text-brand-muted mt-0.5">
                        Enjoy free express delivery on your first order.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2 border border-brand-border rounded-btn text-xs font-medium text-brand-ink hover:bg-brand-footer transition"
                >
                  Dismiss
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

