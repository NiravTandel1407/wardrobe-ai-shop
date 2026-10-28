import React, { useState } from 'react';
import { X, Upload, Link, Plus, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { createProduct, uploadProductImage, createCategory } from '../api';

export default function AddProductModal({ isOpen, onClose, categories, onProductCreated }) {
  if (!isOpen) return null;

  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('unisex');
  const [basePrice, setBasePrice] = useState('');
  const [categoryId, setCategoryId] = useState(
    categories && categories.length > 0 ? categories[0].id : ''
  );

  // New Category inline toggle
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Image Source Mode ('upload' | 'url')
  const [imageMode, setImageMode] = useState('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  // Variants state
  const [variants, setVariants] = useState([
    { size: 'M', color: 'Midnight Black', stock: 15, sku: '' },
    { size: 'L', color: 'Midnight Black', stock: 10, sku: '' },
  ]);

  // Loading & Error States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Only JPEG, PNG or WebP images are allowed');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file is too large (max 5 MB)');
        return;
      }
      setError(null);
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
    }
  };

  // Add / Remove Variants
  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      { size: 'S', color: prev[0]?.color || '', stock: 10, sku: '' },
    ]);
  };

  const handleUpdateVariant = (index, field, value) => {
    setVariants((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveVariant = (index) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!name.trim()) {
      setError('Please provide a product name');
      return;
    }
    const priceNum = parseFloat(basePrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Please enter a valid base price (greater than $0)');
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Resolve Category (create if new)
      let finalCategoryId = categoryId ? Number(categoryId) : null;
      if (isAddingNewCategory && newCategoryName.trim()) {
        const createdCat = await createCategory({ name: newCategoryName.trim() });
        finalCategoryId = createdCat.id;
      }

      // 2. Resolve Image (upload file or use URL)
      let finalImageUrl = imageUrl.trim();
      if (imageMode === 'upload' && selectedFile) {
        finalImageUrl = await uploadProductImage(selectedFile);
      }

      // 3. Format Variants with auto-generated SKUs if blank
      const cleanSlug = name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase();
      const formattedVariants = variants.map((v, i) => ({
        size: v.size.trim().toUpperCase(),
        color: v.color.trim() || null,
        stock: parseInt(v.stock, 10) || 0,
        sku: v.sku.trim() || `${cleanSlug}-${v.size.trim().toUpperCase()}-${i + 1}-${Date.now().toString().slice(-4)}`,
      }));

      // 4. Send Create Product Payload
      const payload = {
        name: name.trim(),
        description: description.trim() || null,
        gender: gender || 'unisex',
        base_price: priceNum,
        image_url: finalImageUrl || null,
        category_id: finalCategoryId,
        variants: formattedVariants,
      };

      const createdProduct = await createProduct(payload);

      setSuccess(true);
      setTimeout(() => {
        onProductCreated(createdProduct);
        onClose();
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="add-product-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="add-product-header">
          <div>
            <span className="add-product-tag">ADMIN • INVENTORY</span>
            <h2 className="add-product-title">Add New Wardrobe Product</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="form-alert error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="form-alert success">
            <CheckCircle2 size={18} />
            <span>Product successfully created and added to catalog!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="add-product-form">
          {/* Main Grid */}
          <div className="form-grid">
            {/* Left Column: Product Info */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Heavyweight Acid Wash Hoodie"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-row-2">
                {/* Category Selection */}
                <div className="form-group">
                  <div className="label-with-action">
                    <label className="form-label">Category</label>
                    <button
                      type="button"
                      className="inline-toggle-btn"
                      onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                    >
                      {isAddingNewCategory ? 'Select Existing' : '+ New Category'}
                    </button>
                  </div>

                  {isAddingNewCategory ? (
                    <input
                      type="text"
                      placeholder="Category Name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="form-input"
                    />
                  ) : (
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="form-select"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Base Price */}
                <div className="form-group">
                  <label className="form-label">Base Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    placeholder="89.00"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Gender Segmented Tabs */}
              <div className="form-group">
                <label className="form-label">Silhouette / Gender</label>
                <div className="gender-pill-group">
                  {['unisex', 'men', 'women'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      className={`gender-pill-btn ${gender === g ? 'active' : ''}`}
                      onClick={() => setGender(g)}
                    >
                      {g.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  rows={3}
                  placeholder="Fabric composition, fit notes, hardware details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Right Column: Image Upload & Preview */}
            <div className="form-column">
              <div className="form-group">
                <div className="label-with-action">
                  <label className="form-label">Product Image</label>
                  <div className="image-tabs">
                    <button
                      type="button"
                      className={`tab-btn ${imageMode === 'upload' ? 'active' : ''}`}
                      onClick={() => setImageMode('upload')}
                    >
                      <Upload size={14} />
                      <span>Upload File</span>
                    </button>
                    <button
                      type="button"
                      className={`tab-btn ${imageMode === 'url' ? 'active' : ''}`}
                      onClick={() => setImageMode('url')}
                    >
                      <Link size={14} />
                      <span>Image URL</span>
                    </button>
                  </div>
                </div>

                {imageMode === 'upload' ? (
                  <div className="file-dropzone">
                    <input
                      type="file"
                      id="product-file-input"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="hidden-file-input"
                    />
                    <label htmlFor="product-file-input" className="dropzone-label">
                      {filePreview ? (
                        <div className="preview-wrap">
                          <img src={filePreview} alt="Preview" className="image-preview" />
                          <span className="change-photo-badge">Change Image</span>
                        </div>
                      ) : (
                        <div className="empty-dropzone">
                          <Upload size={32} className="upload-icon" />
                          <span className="drop-main-text">Click to browse or drop photo</span>
                          <span className="drop-sub-text">JPEG, PNG or WebP up to 5 MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                ) : (
                  <div className="url-input-wrap">
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="form-input"
                    />
                    {imageUrl && (
                      <div className="url-preview-wrap">
                        <img
                          src={imageUrl}
                          alt="URL Preview"
                          className="image-preview"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Variants Section */}
          <div className="variants-section">
            <div className="variants-section-header">
              <div>
                <h3 className="section-title">Size &amp; Inventory Variants</h3>
                <span className="section-subtitle">Define sizes, colorways, and initial stock quantities.</span>
              </div>
              <button
                type="button"
                className="add-variant-btn"
                onClick={handleAddVariant}
              >
                <Plus size={16} />
                <span>Add Variant</span>
              </button>
            </div>

            <div className="variants-table-wrap">
              <table className="variants-table">
                <thead>
                  <tr>
                    <th>Size (e.g. S, M, L, OS)</th>
                    <th>Colorway</th>
                    <th>Initial Stock</th>
                    <th>SKU (optional)</th>
                    <th style={{ width: '40px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, index) => (
                    <tr key={index}>
                      <td>
                        <input
                          type="text"
                          placeholder="M"
                          value={v.size}
                          onChange={(e) => handleUpdateVariant(index, 'size', e.target.value)}
                          className="table-input"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Midnight Black"
                          value={v.color}
                          onChange={(e) => handleUpdateVariant(index, 'color', e.target.value)}
                          className="table-input"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          placeholder="10"
                          value={v.stock}
                          onChange={(e) => handleUpdateVariant(index, 'stock', e.target.value)}
                          className="table-input stock-input"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Auto-generated if blank"
                          value={v.sku}
                          onChange={(e) => handleUpdateVariant(index, 'sku', e.target.value)}
                          className="table-input"
                        />
                      </td>
                      <td>
                        {variants.length > 1 && (
                          <button
                            type="button"
                            className="remove-variant-btn"
                            onClick={() => handleRemoveVariant(index)}
                            aria-label="Remove variant"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-create-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="spinner-icon" />
                  <span>Publishing Product...</span>
                </>
              ) : (
                <span>Publish Product to Catalog</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
