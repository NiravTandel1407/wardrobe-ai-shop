import React, { useState } from 'react';
import { X, Check, ShoppingBag, ShieldCheck, Truck } from 'lucide-react';

export default function ProductModal({ product, categoryName, onClose, onAddToCart }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          <X size={20} />
        </button>

        <div className="modal-grid">
          {/* Product Image */}
          <div className="modal-image-col">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'}
              alt={product.name}
              className="modal-image"
            />
          </div>

          {/* Product Details */}
          <div className="modal-details-col">
            <div className="modal-tags">
              {product.gender && (
                <span className="badge badge-gender">{product.gender.toUpperCase()}</span>
              )}
              {categoryName && (
                <span className="badge badge-category">{categoryName}</span>
              )}
            </div>

            <h2 className="modal-title">{product.name}</h2>
            <div className="modal-price">
              ${Number(product.base_price).toFixed(2)}
            </div>

            <p className="modal-description">{product.description}</p>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="modal-variant-section">
                <div className="variant-header">
                  <span className="variant-title">Available Sizes &amp; Colors</span>
                  {selectedVariant && (
                    <span className="variant-sku">SKU: {selectedVariant.sku || 'N/A'}</span>
                  )}
                </div>

                <div className="modal-variants-list">
                  {product.variants.map((v) => (
                    <button
                      key={v.id || v.sku}
                      className={`modal-variant-card ${selectedVariant?.id === v.id ? 'active' : ''} ${v.stock <= 0 ? 'disabled' : ''}`}
                      onClick={() => setSelectedVariant(v)}
                      disabled={v.stock <= 0}
                    >
                      <div className="variant-meta">
                        <span className="variant-size-tag">{v.size}</span>
                        {v.color && <span className="variant-color-tag">{v.color}</span>}
                      </div>
                      <span className="variant-stock-tag">
                        {v.stock > 0 ? `${v.stock} in stock` : 'Sold out'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Button */}
            <button
              className={`modal-add-btn ${isAdded ? 'added' : ''}`}
              onClick={handleAdd}
              disabled={selectedVariant && selectedVariant.stock <= 0}
            >
              {isAdded ? (
                <>
                  <Check size={18} />
                  <span>Added to Your Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={18} />
                  <span>Add to Bag • ${Number(product.base_price).toFixed(2)}</span>
                </>
              )}
            </button>

            {/* Value Guarantees */}
            <div className="modal-guarantees">
              <div className="guarantee">
                <Truck size={16} />
                <span>Express dispatch within 24 hours</span>
              </div>
              <div className="guarantee">
                <ShieldCheck size={16} />
                <span>100% premium verified materials</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
