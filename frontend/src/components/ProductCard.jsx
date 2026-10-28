import React, { useState } from 'react';
import { Plus, Check, Eye } from 'lucide-react';

export default function ProductCard({ product, categoryName, onQuickView, onAddToCart }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants && product.variants.length > 0 ? product.variants[0] : null
  );
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product, selectedVariant);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) ?? 0;

  return (
    <article className="product-card" onClick={() => onQuickView(product)}>
      {/* Media Container */}
      <div className="product-media">
        <img
          src={product.image_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop'}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
          }}
        />

        {/* Floating Badges */}
        <div className="product-badges">
          {product.gender && (
            <span className="badge badge-gender">{product.gender.toUpperCase()}</span>
          )}
          {categoryName && (
            <span className="badge badge-category">{categoryName}</span>
          )}
        </div>

        {/* Quick View Button */}
        <button
          className="quick-view-btn"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          aria-label="Quick preview"
        >
          <Eye size={16} />
          <span>Quick View</span>
        </button>
      </div>

      {/* Info Container */}
      <div className="product-info">
        <div className="product-header">
          <h3 className="product-title">{product.name}</h3>
          <span className="product-price">${Number(product.base_price).toFixed(2)}</span>
        </div>

        <p className="product-desc">{product.description}</p>

        {/* Size Variant Chips */}
        {product.variants && product.variants.length > 0 && (
          <div className="variants-row" onClick={(e) => e.stopPropagation()}>
            <span className="variants-label">Size:</span>
            <div className="size-chips">
              {product.variants.map((v) => (
                <button
                  key={v.id || v.sku}
                  className={`size-chip ${selectedVariant?.id === v.id ? 'selected' : ''} ${v.stock <= 0 ? 'out-of-stock' : ''}`}
                  onClick={() => setSelectedVariant(v)}
                  disabled={v.stock <= 0}
                  title={`${v.size} - ${v.color || ''} (${v.stock} in stock)`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer: Stock & Add Button */}
        <div className="product-footer">
          <span className={`stock-status ${totalStock <= 5 ? 'low-stock' : 'in-stock'}`}>
            {totalStock <= 0
              ? 'Out of stock'
              : totalStock <= 5
              ? `Low stock (${totalStock} left)`
              : 'In stock'}
          </span>

          <button
            className={`add-bag-btn ${isAdded ? 'added' : ''}`}
            onClick={handleAdd}
            disabled={totalStock <= 0}
          >
            {isAdded ? (
              <>
                <Check size={16} />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={16} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
