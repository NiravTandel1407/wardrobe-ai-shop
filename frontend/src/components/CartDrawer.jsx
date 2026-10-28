import React from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQuantity, onRemoveItem }) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + Number(item.product.base_price) * item.quantity,
    0
  );

  return (
    <div className="cart-backdrop" onClick={onClose}>
      <aside className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div className="cart-title-row">
            <ShoppingBag size={20} />
            <h2 className="cart-title">Your Bag ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</h2>
          </div>
          <button className="cart-close" onClick={onClose} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon-wrap">
              <ShoppingBag size={48} className="empty-icon" />
            </div>
            <h3>Your bag is empty</h3>
            <p>Explore our seasonal catalog and add premium wardrobe pieces to your bag.</p>
            <button className="continue-btn" onClick={onClose}>
              Explore Catalog
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={`${item.product.id}-${item.variant?.id}`} className="cart-item">
                  <img
                    src={item.product.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop'}
                    alt={item.product.name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <h4 className="cart-item-name">{item.product.name}</h4>
                      <button
                        className="item-remove-btn"
                        onClick={() => onRemoveItem(item.product.id, item.variant?.id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="cart-item-meta">
                      {item.variant && (
                        <span>Size: {item.variant.size} {item.variant.color ? `• ${item.variant.color}` : ''}</span>
                      )}
                    </div>

                    <div className="cart-item-bottom">
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.product.id, item.variant?.id, item.quantity - 1)}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => onUpdateQuantity(item.product.id, item.variant?.id, item.quantity + 1)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <span className="cart-item-price">
                        ${(Number(item.product.base_price) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Summary */}
            <div className="cart-footer">
              <div className="summary-row">
                <span>Shipping</span>
                <span className="free-shipping">Complimentary</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span className="total-amount">${subtotal.toFixed(2)}</span>
              </div>

              <button className="checkout-btn" onClick={() => alert('Checkout flow ready for Phase 3 integration!')}>
                <span>Proceed to Checkout</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
