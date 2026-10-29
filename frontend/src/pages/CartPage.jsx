import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnnouncementBar from '../components/AnnouncementBar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Section from '../components/Section';
import ShirtIcon from '../components/ShirtIcon';
import { useCart } from '../context/CartContext';
import { Plus, Minus, Trash2, ArrowLeft, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, subtotal, cartCount, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  const shipping = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discount + shipping);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    if (!promoCode.trim()) return;

    if (promoCode.trim().toUpperCase() === 'WARDROBE10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscount(disc);
      setPromoSuccess(`Code WARDROBE10 applied! You saved ₹${disc.toLocaleString('en-IN')}`);
    } else {
      setPromoError('Invalid promo code. Try WARDROBE10');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        <Section as="div" className="py-8 sm:py-12">
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-brand-border">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-semibold text-brand-ink tracking-tight">
                Shopping Bag
              </h1>
              <span className="text-xs bg-brand-yellow text-brand-ink font-bold px-2.5 py-0.5 rounded-full">
                {cartCount} {cartCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <Link
              to="/"
              className="text-xs sm:text-sm text-brand-muted hover:text-brand-ink flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Continue shopping
            </Link>
          </div>

          {cartItems.length === 0 ? (
            /* Empty State */
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-full bg-brand-cream flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 text-brand-ink/70" />
              </div>
              <h2 className="text-lg font-semibold text-brand-ink">Your bag is currently empty</h2>
              <p className="text-xs sm:text-sm text-brand-muted mt-1 max-w-sm">
                Looks like you haven't added any streetwear items to your cart yet.
              </p>
              <button
                onClick={() => navigate('/')}
                className="mt-6 inline-flex items-center gap-2 bg-brand-ink text-brand-yellow px-6 py-3 rounded-btn text-xs sm:text-sm font-semibold hover:bg-neutral-800 transition-colors"
              >
                <span>Browse our catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Cart Grid */
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10 lg:gap-14 items-start">
              {/* Left Column: Items */}
              <div className="flex flex-col divide-y divide-brand-border">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-6 flex gap-5 items-center">
                    {/* Thumbnail */}
                    <div
                      className="w-20 h-24 rounded-card flex-shrink-0 flex items-center justify-center overflow-hidden"
                      style={{ backgroundColor: item.tileColor || '#FFF3B0' }}
                    >
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShirtIcon className="w-10 h-10 text-brand-ink/75" strokeWidth={1.75} />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-brand-ink">{item.name}</h3>
                          <p className="text-xs text-brand-muted mt-0.5">
                            {item.selectedSize ? `Size: ${item.selectedSize}` : ''}
                            {item.selectedColor ? ` &middot; Color: ${item.selectedColor}` : ''}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-brand-ink">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="inline-flex items-center border border-brand-border rounded-btn bg-white">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-neutral-100 text-brand-ink transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-semibold px-3 text-brand-ink">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-neutral-100 text-brand-ink transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-brand-muted hover:text-red-500 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex justify-between items-center">
                  <button
                    onClick={clearCart}
                    className="text-xs text-brand-muted hover:text-brand-ink underline"
                  >
                    Clear entire bag
                  </button>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="bg-brand-footer p-6 sm:p-8 rounded-card border border-brand-border flex flex-col gap-5">
                <h2 className="text-base font-semibold text-brand-ink">Order Summary</h2>

                {/* Subtotal */}
                <div className="flex flex-col gap-2.5 text-xs sm:text-sm text-brand-muted pb-4 border-b border-brand-border">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-brand-ink font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Promo Discount</span>
                      <span>-₹{discount.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className="text-brand-ink font-medium">
                      {shipping === 0 ? <span className="text-emerald-700">FREE</span> : `₹${shipping}`}
                    </span>
                  </div>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code (e.g. WARDROBE10)"
                        className="w-full bg-white border border-brand-border rounded-btn pl-8 pr-3 py-2 text-xs uppercase"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-brand-ink text-brand-yellow px-4 py-2 rounded-btn text-xs font-semibold hover:bg-neutral-800 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoSuccess && <span className="text-[11px] text-emerald-700">{promoSuccess}</span>}
                  {promoError && <span className="text-[11px] text-brand-sale">{promoError}</span>}
                </form>

                {/* Total */}
                <div className="flex items-baseline justify-between pt-2 border-t border-brand-border">
                  <span className="text-sm font-semibold text-brand-ink">Total</span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-brand-ink">
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                    <p className="text-[10px] text-brand-muted">Includes GST & taxes</p>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button
                  type="button"
                  onClick={() => alert(`Proceeding to checkout with ${cartCount} items (Total: ₹${finalTotal.toLocaleString('en-IN')})`)}
                  className="w-full bg-brand-ink text-brand-yellow py-3.5 rounded-btn text-sm font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-brand-muted pt-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Secure 256-bit SSL encrypted checkout</span>
                </div>
              </div>
            </div>
          )}
        </Section>
      </main>

      <Footer />
    </div>
  );
};

export default CartPage;

