import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ShirtIcon from './ShirtIcon';

export const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, subtotal, cartCount, clearCart } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300"
        aria-label="Shopping Bag Drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-ink" />
            <h2 className="text-base font-semibold text-brand-ink">Your Bag</h2>
            <span className="text-xs bg-brand-yellow text-brand-ink font-bold px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-brand-muted hover:text-brand-ink hover:bg-neutral-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-brand-cream px-6 py-2.5 border-b border-brand-border/60 text-xs text-brand-ink flex items-center justify-between">
          {subtotal >= 999 ? (
            <span className="font-medium text-emerald-700">🎉 You unlocked FREE standard shipping!</span>
          ) : (
            <span>Add <strong className="text-brand-ink">₹{999 - subtotal}</strong> more for <strong>FREE shipping</strong></span>
          )}
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-brand-border">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-brand-muted">
              <ShoppingBag className="w-12 h-12 stroke-[1.25] text-neutral-300 mb-3" />
              <p className="text-sm font-medium text-brand-ink">Your bag is empty</p>
              <p className="text-xs text-brand-muted mt-1">Explore our latest drops to fill it up.</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 inline-flex items-center bg-brand-ink text-brand-yellow text-xs font-medium px-5 py-2.5 rounded-btn hover:bg-neutral-800 transition-colors"
              >
                Start shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="py-4 flex gap-4 items-center">
                {/* Tile thumbnail */}
                <div
                  className="w-16 h-20 rounded-card flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: item.tileColor || '#FFF3B0' }}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ShirtIcon className="w-8 h-8 text-brand-ink/75" strokeWidth={1.5} />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-medium text-brand-ink truncate">{item.name}</h3>
                  <p className="text-xs text-brand-muted mt-0.5">
                    ₹{item.price?.toLocaleString('en-IN')}
                    {item.selectedSize ? ` · Size: ${item.selectedSize}` : ''}
                    {item.selectedColor ? ` · ${item.selectedColor}` : ''}
                  </p>

                  {/* Quantity selector */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="inline-flex items-center border border-brand-border rounded-btn bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-neutral-100 text-brand-ink transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-medium px-2.5 text-brand-ink">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-neutral-100 text-brand-ink transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 text-brand-muted hover:text-red-500 transition-colors ml-auto"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Subtotal & Checkout */}
        {cartItems.length > 0 && (
          <div className="border-t border-brand-border px-6 py-4 bg-brand-footer flex flex-col gap-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-brand-muted font-normal">Subtotal</span>
              <span className="font-semibold text-brand-ink text-base">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="text-[11px] text-brand-muted">Taxes and shipping calculated at checkout.</p>
            <button
              type="button"
              className="w-full bg-brand-ink text-brand-yellow py-3 rounded-btn text-sm font-medium hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              onClick={() => alert(`Proceeding to checkout with ${cartCount} items (Total: ₹${subtotal.toLocaleString('en-IN')})`)}
            >
              Checkout &rarr;
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="text-center text-xs text-brand-muted hover:text-brand-ink underline"
            >
              Clear bag
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
