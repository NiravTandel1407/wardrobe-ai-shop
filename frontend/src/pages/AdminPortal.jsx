import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Edit2,
  ExternalLink,
  RefreshCw,
  Plus,
  Package,
  Layers,
  ShoppingBag,
  Users,
  Percent,
  BarChart3,
  Settings,
  LayoutDashboard,
  LogOut,
  ArrowLeft,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';
import {
  getAdminCategories,
  createCategory,
  uploadProductImage,
  createProduct,
  updateProduct,
  getAdminProducts,
  deleteProduct
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import CustomSelect from '../components/CustomSelect';

export default function AdminPortal() {
  const navigate = useNavigate();
  const { user, token, isAdmin, logout } = useAuth();

  // Active Sidebar Nav Item: Default is 'dashboard' so visiting /admin opens Dashboard first
  const [activeNav, setActiveNav] = useState('dashboard');

  // Sub-view in Products: 'form' | 'all-products'
  const [productSubView, setProductSubView] = useState('form');

  // Edit Mode state (null if adding a new product, or numeric id when editing)
  const [editingProductId, setEditingProductId] = useState(null);

  // Categories & Existing Products
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // New Category Modal
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [savingCategory, setSavingCategory] = useState(false);

  // Form Fields Matching Design Mockup
  const [productName, setProductName] = useState('Boxy graphic tee');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [gender, setGender] = useState('Unisex');
  const [sellingPrice, setSellingPrice] = useState('799');
  const [mrp, setMrp] = useState('999');
  const [discount, setDiscount] = useState('20%');
  const [sku, setSku] = useState('WRD-TEE-001');
  const [stockQuantity, setStockQuantity] = useState('50');

  // Selected Variants from Design Chips & Swatches
  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const [selectedSizes, setSelectedSizes] = useState(['M', 'L']);

  const availableColours = [
    { name: 'Black', hex: '#111111' },
    { name: 'Yellow', hex: '#FFD400' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Blue', hex: '#3B82F6' },
  ];
  const [selectedColour, setSelectedColour] = useState('Black');

  // Images state
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Status & Visibility
  const [status, setStatus] = useState('Active');
  const [showInNewArrivals, setShowInNewArrivals] = useState(true);
  const [showInTrending, setShowInTrending] = useState(false);

  // Tags
  const [tags, setTags] = useState(['streetwear', 'graphic tee', 'oversized']);
  const [tagInput, setTagInput] = useState('');

  // Submit Feedback
  const [submitting, setSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(null);
  const [formError, setFormError] = useState('');

  // 1. Fetch categories & products on mount
  useEffect(() => {
    if (token) {
      loadCategories();
      loadProducts();
    }
  }, [token]);

  const loadCategories = async () => {
    try {
      const data = await getAdminCategories();
      setCategories(data);
      if (data.length > 0 && !categoryId) {
        setCategoryId(data[0].id);
      }
    } catch (err) {
      console.warn('Could not load categories:', err);
    }
  };

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await getAdminProducts(0, 100);
      setProducts(data);
    } catch (err) {
      console.warn('Could not load products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // ==============================================================
  // AUTOMATIC PRICE / MRP / DISCOUNT CALCULATOR
  // Any 2 values entered automatically calculate the 3rd!
  // ==============================================================
  const handleSellingPriceChange = (val) => {
    setSellingPrice(val);
    const sp = parseFloat(val);
    const m = parseFloat(mrp);
    const d = parseFloat(discount.replace('%', ''));

    if (!isNaN(sp) && sp > 0) {
      if (!isNaN(m) && m > 0) {
        // Calculate Discount from MRP & SP
        if (m >= sp) {
          const calcDiscount = Math.round(((m - sp) / m) * 100);
          setDiscount(`${calcDiscount}%`);
        } else {
          setDiscount('0%');
        }
      } else if (!isNaN(d) && d >= 0 && d < 100) {
        // Calculate MRP from SP & Discount
        const calcMrp = Math.round(sp / (1 - d / 100));
        setMrp(String(calcMrp));
      }
    } else if (!val) {
      setDiscount('');
    }
  };

  const handleMrpChange = (val) => {
    setMrp(val);
    const m = parseFloat(val);
    const sp = parseFloat(sellingPrice);
    const d = parseFloat(discount.replace('%', ''));

    if (!isNaN(m) && m > 0) {
      if (!isNaN(sp) && sp > 0) {
        // Calculate Discount from MRP & SP
        if (m >= sp) {
          const calcDiscount = Math.round(((m - sp) / m) * 100);
          setDiscount(`${calcDiscount}%`);
        } else {
          setDiscount('0%');
        }
      } else if (!isNaN(d) && d >= 0 && d < 100) {
        // Calculate SP from MRP & Discount
        const calcSp = Math.round(m * (1 - d / 100));
        setSellingPrice(String(calcSp));
      }
    }
  };

  const handleDiscountChange = (val) => {
    const clean = val.replace('%', '').trim();
    setDiscount(clean ? `${clean}%` : '');
    const d = parseFloat(clean);
    const m = parseFloat(mrp);
    const sp = parseFloat(sellingPrice);

    if (!isNaN(d) && d >= 0 && d < 100) {
      if (!isNaN(m) && m > 0) {
        // Calculate SP from MRP & Discount
        const calcSp = Math.round(m * (1 - d / 100));
        setSellingPrice(String(calcSp));
      } else if (!isNaN(sp) && sp > 0) {
        // Calculate MRP from SP & Discount
        const calcMrp = Math.round(sp / (1 - d / 100));
        setMrp(String(calcMrp));
      }
    }
  };

  // 2. Toggle Size Chip
  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  // 3. Handle Tag Add/Remove
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim().toLowerCase())) {
        setTags([...tags, tagInput.trim().toLowerCase()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // 4. Handle Image File Selection & Immediate Upload
  const handleImageFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    setUploadingImage(true);
    setFormError('');
    try {
      const result = await uploadProductImage(file, token);
      setUploadedImageUrl(result.image_url);
    } catch (err) {
      setFormError(`Image upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  // 5. Create Category Handler
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    setSavingCategory(true);
    try {
      const created = await createCategory({ name: newCatName.trim() }, token);
      await loadCategories();
      setCategoryId(created.id);
      setNewCatName('');
      setShowCategoryModal(false);
    } catch (err) {
      alert(`Error creating category: ${err.message}`);
    } finally {
      setSavingCategory(false);
    }
  };

  // 6. Reset / Discard Form
  const handleDiscard = () => {
    setEditingProductId(null);
    setProductName('');
    setDescription('');
    setSellingPrice('');
    setMrp('');
    setDiscount('');
    setSku('');
    setStockQuantity('');
    setSelectedSizes(['M', 'L']);
    setSelectedColour('Black');
    setImageFile(null);
    setImagePreview('');
    setUploadedImageUrl('');
    setFormSuccess(null);
    setFormError('');
  };

  // 7. Start Editing a Product
  const handleStartEdit = (product) => {
    setEditingProductId(product.id);
    setFormError('');
    setFormSuccess(null);

    setProductName(product.name || '');
    setDescription(product.description || '');
    const priceStr = product.base_price ? String(product.base_price) : '';
    setSellingPrice(priceStr);
    const spNum = parseFloat(priceStr || 0);
    const calculatedMrp = Math.round(spNum * 1.25) || 999;
    setMrp(String(calculatedMrp));
    setDiscount('20%');
    setCategoryId(product.category_id || (categories[0]?.id || ''));

    // Normalize gender
    const g = (product.gender || 'unisex').toLowerCase();
    setGender(g === 'men' ? 'Men' : g === 'women' ? 'Women' : 'Unisex');

    // Variants sizes and colors
    const variants = product.variants || [];
    const sizes = Array.from(new Set(variants.map((v) => v.size).filter(Boolean)));
    setSelectedSizes(sizes.length > 0 ? sizes : ['M', 'L']);

    const firstColor = variants.find((v) => v.color)?.color;
    setSelectedColour(firstColor || 'Black');

    const totalStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    setStockQuantity(String(totalStock || 50));
    setSku(variants[0]?.sku || `WRD-${product.id}`);

    // Image
    setUploadedImageUrl(product.image_url || '');
    setImagePreview(
      product.image_url
        ? product.image_url.startsWith('/static/')
          ? `http://127.0.0.1:9000${product.image_url}`
          : product.image_url
        : ''
    );
    setImageFile(null);

    // Switch to products form view
    setActiveNav('products');
    setProductSubView('form');
  };

  // 8. Publish or Update Product
  const handleSubmitProduct = async (e) => {
    if (e) e.preventDefault();
    setFormError('');
    setFormSuccess(null);

    if (!productName.trim()) {
      setFormError('Product name is required.');
      return;
    }
    const priceNum = parseFloat(sellingPrice);
    if (!priceNum || priceNum <= 0) {
      setFormError('Please enter a valid selling price greater than 0.');
      return;
    }
    if (selectedSizes.length === 0) {
      setFormError('Please select at least one size variant.');
      return;
    }

    setSubmitting(true);
    try {
      const baseStock = parseInt(stockQuantity, 10) || 10;
      const variants = selectedSizes.map((size) => ({
        size: size,
        color: selectedColour,
        stock: Math.max(1, Math.floor(baseStock / selectedSizes.length)),
        sku: `${sku || 'WRD'}-${size}-${selectedColour.slice(0, 3).toUpperCase()}`
      }));

      const payload = {
        name: productName.trim(),
        description: description.trim() || null,
        gender: gender.toLowerCase(),
        base_price: priceNum,
        category_id: categoryId ? Number(categoryId) : null,
        image_url: uploadedImageUrl || null,
        variants: variants
      };

      let result;
      if (editingProductId) {
        // UPDATE existing product
        result = await updateProduct(editingProductId, payload, token);
        setFormSuccess({
          ...result,
          isUpdated: true
        });
      } else {
        // CREATE new product
        result = await createProduct(payload, token);
        setFormSuccess(result);
        handleDiscard();
      }

      loadProducts();
    } catch (err) {
      setFormError(err.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  // 9. Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Delete "${name}" from store catalog?`)) return;
    try {
      await deleteProduct(id, token);
      if (editingProductId === id) {
        handleDiscard();
      }
      loadProducts();
    } catch (err) {
      alert(`Failed to delete: ${err.message}`);
    }
  };

  // If not logged in as Admin, prompt to log in
  if (!token || !isAdmin) {
    return (
      <div className="min-h-screen bg-[#F6F4EC] flex flex-col items-center justify-center p-4">
        <div className="bg-white border border-[#E7E5E0] rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <div className="w-10 h-10 bg-[#FFD400] text-[#111] font-bold rounded-lg flex items-center justify-center mx-auto mb-4 text-lg">
            W
          </div>
          <h2 className="text-xl font-bold text-[#111]">Admin Access Required</h2>
          <p className="text-xs text-[#555] mt-2 mb-6">
            You must be signed in with an administrator account to access the store management panel.
          </p>

          <Link
            to="/login"
            className="w-full py-2.5 px-4 bg-[#111] text-[#FFD400] font-medium text-sm rounded-lg hover:bg-black transition block text-center"
          >
            Sign in as Administrator
          </Link>

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#555] hover:text-[#111] mt-4 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront
          </Link>
        </div>
      </div>
    );
  }

  // Calculate dashboard stats
  const totalStockUnits = products.reduce((acc, p) => {
    return acc + (p.variants?.reduce((vSum, v) => vSum + (v.stock || 0), 0) || 0);
  }, 0);

  const avgPrice = products.length > 0
    ? Math.round(products.reduce((acc, p) => acc + parseFloat(p.base_price || 0), 0) / products.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#F6F4EC] font-sans antialiased">
      {/* ========================================================= */}
      {/* 1. FIXED STATIC SIDEBAR (Always fits screen viewport)      */}
      {/* ========================================================= */}
      <aside className="fixed top-0 left-0 bottom-0 w-[230px] h-screen bg-[#111] p-4 flex flex-col justify-between box-border z-30">
        <div className="flex flex-col gap-1.5">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2 pt-2 pb-6">
            <div className="w-7 h-7 bg-[#FFD400] rounded-[6px] flex items-center justify-center font-medium text-[15px] text-[#111]">
              W
            </div>
            <span className="tracking-[0.18em] font-medium text-sm text-white">
              WARDROBE
            </span>
          </div>

          {/* Nav Items */}
          <button
            type="button"
            onClick={() => setActiveNav('dashboard')}
            className={`flex items-center gap-3 h-11 px-3.5 rounded-lg text-sm text-left transition ${activeNav === 'dashboard'
              ? 'bg-[#FFD400] text-[#111] font-medium'
              : 'text-[#e7e5e0] hover:bg-white/10'
              }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveNav('products');
            }}
            className={`flex items-center gap-3 h-11 px-3.5 rounded-lg text-sm text-left transition ${activeNav === 'products'
              ? 'bg-[#FFD400] text-[#111] font-medium'
              : 'text-[#e7e5e0] hover:bg-white/10'
              }`}
          >
            <Package className="w-4 h-4" />
            <span>Products</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('orders')}
            className={`flex items-center gap-3 h-11 px-3.5 rounded-lg text-sm text-left transition ${activeNav === 'orders'
              ? 'bg-[#FFD400] text-[#111] font-medium'
              : 'text-[#e7e5e0] hover:bg-white/10'
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('customers')}
            className={`flex items-center gap-3 h-11 px-3.5 rounded-lg text-sm text-left transition ${activeNav === 'customers'
              ? 'bg-[#FFD400] text-[#111] font-medium'
              : 'text-[#e7e5e0] hover:bg-white/10'
              }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('discounts')}
            className={`flex items-center gap-3 h-11 px-3.5 rounded-lg text-sm text-left transition ${activeNav === 'discounts'
              ? 'bg-[#FFD400] text-[#111] font-medium'
              : 'text-[#e7e5e0] hover:bg-white/10'
              }`}
          >
            <Percent className="w-4 h-4" />
            <span>Discounts</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('analytics')}
            className={`flex items-center gap-3 h-11 px-3.5 rounded-lg text-sm text-left transition ${activeNav === 'analytics'
              ? 'bg-[#FFD400] text-[#111] font-medium'
              : 'text-[#e7e5e0] hover:bg-white/10'
              }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveNav('settings')}
            className={`flex items-center gap-3 h-11 px-3.5 rounded-lg text-sm text-left transition ${activeNav === 'settings'
              ? 'bg-[#FFD400] text-[#111] font-medium'
              : 'text-[#e7e5e0] hover:bg-white/10'
              }`}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* Sidebar Footer: Admin Profile & Back to Store */}
        <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-[#e7e5e0]/80 hover:text-white px-2 py-1 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Store</span>
          </Link>

          <div className="flex items-center justify-between px-2 pt-1 text-[#e7e5e0] text-xs">
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-8 h-8 rounded-full bg-[#FFD400] text-[#111] flex items-center justify-center font-bold text-xs flex-shrink-0">
                {(user?.full_name || user?.email || 'A')[0].toUpperCase()}
              </span>
              <div className="truncate">
                <div className="font-medium text-white truncate text-[13px]">
                  {user?.full_name || 'Admin'}
                </div>
                <div className="text-[10px] text-[#e7e5e0]/60 truncate">{user?.email}</div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              title="Logout"
              className="text-[#e7e5e0]/60 hover:text-red-400 p-1"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN CONTENT AREA (Offset by 230px, scrolls cleanly)   */}
      {/* ========================================================= */}
      <main className="ml-[230px] min-h-screen p-7 lg:px-8 lg:py-7 flex flex-col gap-5 box-border bg-[#F6F4EC]">

        {/* ======================================================= */}
        {/* VIEW 1: DASHBOARD (Appears by default when visiting /admin) */}
        {/* ======================================================= */}
        {activeNav === 'dashboard' && (
          <div className="max-w-[1040px] flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-[#555] mb-1">Overview / Dashboard</div>
                <h1 className="text-[26px] font-medium text-[#111] leading-tight">Store Dashboard</h1>
                <p className="text-xs text-[#555] mt-1">Welcome back, {user?.full_name || user?.email}! Here is your store summary.</p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    handleDiscard();
                    setActiveNav('products');
                    setProductSubView('form');
                  }}
                  className="h-11 px-5 rounded-lg bg-[#111] text-[#FFD400] text-sm font-medium hover:bg-black transition cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4 text-[#FFD400]" />
                  <span>Add Product</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('products');
                    setProductSubView('all-products');
                  }}
                  className="h-11 px-4 rounded-lg bg-white text-[#111] border border-[#111] text-sm font-medium hover:bg-neutral-50 transition cursor-pointer"
                >
                  Catalog ({products.length})
                </button>
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-[#e7e5e0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#555]">
                    <span>Total Products</span>
                    <Package className="w-4 h-4 text-[#111]" />
                  </div>
                  <div className="text-3xl font-bold text-[#111] mt-2">{products.length}</div>
                </div>
                <div className="text-[11px] text-[#555] mt-3 pt-3 border-t border-[#e7e5e0]">
                  Live in Storefront Catalog
                </div>
              </div>

              <div className="bg-white border border-[#e7e5e0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#555]">
                    <span>Total Stock Units</span>
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-[#111] mt-2">{totalStockUnits}</div>
                </div>
                <div className="text-[11px] text-[#555] mt-3 pt-3 border-t border-[#e7e5e0]">
                  Across all size &amp; color variants
                </div>
              </div>

              <div className="bg-white border border-[#e7e5e0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#555]">
                    <span>Categories</span>
                    <Tag className="w-4 h-4 text-[#FFD400]" />
                  </div>
                  <div className="text-3xl font-bold text-[#111] mt-2">{categories.length}</div>
                </div>
                <div className="text-[11px] text-[#555] mt-3 pt-3 border-t border-[#e7e5e0]">
                  Active apparel categories
                </div>
              </div>

              <div className="bg-white border border-[#e7e5e0] rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-[#555]">
                    <span>Average Price</span>
                    <span className="font-bold text-[#111]">₹</span>
                  </div>
                  <div className="text-3xl font-bold text-[#111] mt-2">₹{avgPrice}</div>
                </div>
                <div className="text-[11px] text-[#555] mt-3 pt-3 border-t border-[#e7e5e0]">
                  Per clothing item
                </div>
              </div>
            </div>

            {/* Quick Overview Table: Recent Products */}
            <div className="bg-white border border-[#e7e5e0] rounded-xl overflow-hidden shadow-xs">
              <div className="p-4 border-b border-[#e7e5e0] flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm text-[#111]">Recent Products in Store</h3>
                  <p className="text-[11px] text-[#555] mt-0.5">Quickly edit or view items in your catalog</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveNav('products');
                    setProductSubView('all-products');
                  }}
                  className="text-xs text-[#111] font-semibold hover:underline flex items-center gap-1"
                >
                  View All ({products.length}) &rarr;
                </button>
              </div>

              {products.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#555]">
                  No products in the database yet. Click "+ Add Product" to publish your first streetwear item.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FFF9DB]/40 border-b border-[#e7e5e0] text-[#555] uppercase text-[11px] tracking-wider">
                        <th className="py-3 px-4">Item</th>
                        <th className="py-3 px-4">Selling Price</th>
                        <th className="py-3 px-4">Gender</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e7e5e0]">
                      {products.slice(0, 5).map((p) => {
                        const imageUrl = p.image_url?.startsWith('/static/')
                          ? `http://127.0.0.1:9000${p.image_url}`
                          : p.image_url;

                        return (
                          <tr key={p.id} className="hover:bg-neutral-50 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {imageUrl ? (
                                  <img
                                    src={imageUrl}
                                    alt={p.name}
                                    className="w-9 h-11 object-cover rounded border border-[#e7e5e0]"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = 'https://placehold.co/80x100?text=No+Img';
                                    }}
                                  />
                                ) : (
                                  <div className="w-9 h-11 rounded bg-[#FFF3B0] border border-[#e7e5e0] flex items-center justify-center font-bold text-[#111] text-xs">
                                    W
                                  </div>
                                )}
                                <div>
                                  <div className="font-semibold text-[#111]">{p.name}</div>
                                  <div className="text-[10px] text-[#555]">ID #{p.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-bold text-[#111]">
                              ₹{parseFloat(p.base_price).toLocaleString('en-IN')}
                            </td>
                            <td className="py-3 px-4 capitalize text-[#555]">{p.gender || 'unisex'}</td>
                            <td className="py-3 px-4 text-[#555]">
                              {p.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0} units
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleStartEdit(p)}
                                className="px-2.5 py-1 bg-[#FFF9DB] border border-[#111] text-[#111] hover:bg-[#FFD400] text-xs font-semibold rounded transition inline-flex items-center gap-1"
                              >
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 2: PRODUCTS (ADD, EDIT & CATALOG)                  */}
        {/* ======================================================= */}
        {activeNav === 'products' && (
          <div className="flex flex-col gap-5 max-w-[1040px]">
            {/* Top Bar with Breadcrumbs & Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-[#555] mb-1">
                  Products / {productSubView === 'form' ? (editingProductId ? `Edit product #${editingProductId}` : 'Add product') : 'Catalog'}
                </div>
                <div className="flex items-center gap-3">
                  <h1 className="text-[26px] font-medium text-[#111] leading-tight">
                    {productSubView === 'form'
                      ? (editingProductId ? `Edit product` : 'Add product')
                      : 'Store Products'}
                  </h1>
                  {editingProductId && productSubView === 'form' && (
                    <span className="px-2.5 py-0.5 bg-[#FFF9DB] border border-[#111] text-[#111] text-xs font-bold rounded-full">
                      ID #{editingProductId}
                    </span>
                  )}
                </div>
              </div>

              {/* Sub-view switcher & Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {productSubView === 'form' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setProductSubView('all-products')}
                      className="h-11 px-4 rounded-lg bg-white text-[#111] border border-[#111] text-sm font-medium hover:bg-neutral-50 transition cursor-pointer"
                    >
                      View Catalog ({products.length})
                    </button>

                    {editingProductId ? (
                      <>
                        <button
                          type="button"
                          onClick={handleDiscard}
                          className="h-11 px-4 rounded-lg bg-white text-[#111] border border-[#111] text-sm font-medium hover:bg-neutral-50 transition cursor-pointer"
                        >
                          Cancel Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmitProduct()}
                          disabled={submitting || uploadingImage}
                          className="h-11 px-5 rounded-lg bg-[#111] text-[#FFD400] text-sm font-medium hover:bg-black transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-[#FFD400]" />
                              <span>Saving changes...</span>
                            </>
                          ) : (
                            <span>Save changes</span>
                          )}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={handleDiscard}
                          className="h-11 px-4 rounded-lg bg-white text-[#111] border border-[#111] text-sm font-medium hover:bg-neutral-50 transition cursor-pointer"
                        >
                          Discard
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSubmitProduct()}
                          disabled={submitting || uploadingImage}
                          className="h-11 px-5 rounded-lg bg-[#111] text-[#FFD400] text-sm font-medium hover:bg-black transition cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                          {submitting ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin text-[#FFD400]" />
                              <span>Publishing...</span>
                            </>
                          ) : (
                            <span>Publish product</span>
                          )}
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      handleDiscard();
                      setProductSubView('form');
                    }}
                    className="h-11 px-5 rounded-lg bg-[#111] text-[#FFD400] text-sm font-medium hover:bg-black transition cursor-pointer flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4 text-[#FFD400]" />
                    <span>Add New Product</span>
                  </button>
                )}
              </div>
            </div>

            {/* Notification Banners */}
            {formSuccess && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start justify-between gap-3 text-green-900 text-xs">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm">
                      {formSuccess.isUpdated ? 'Product updated successfully!' : 'Product published successfully!'}
                    </h4>
                    <p className="mt-0.5">
                      <strong>{formSuccess.name}</strong> is live with {formSuccess.variants?.length || 0} variant(s).
                    </p>
                    <div className="mt-2 flex items-center gap-3">
                      <Link
                        to={`/product/${formSuccess.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 font-semibold underline text-green-900"
                      >
                        View in Storefront <ExternalLink className="w-3 h-3" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => setProductSubView('all-products')}
                        className="text-green-700 hover:underline font-medium"
                      >
                        Back to Catalog
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={() => setFormSuccess(null)} className="text-green-600 hover:text-green-900">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">Error:</strong> {formError}
                </div>
              </div>
            )}

            {/* SUB-VIEW 1A: FORM VIEW (ADD / EDIT) */}
            {productSubView === 'form' && (
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5 items-start">

                {/* LEFT COLUMN: Product Details, Pricing & Inventory, Variants */}
                <div className="flex flex-col gap-5">
                  {/* Card 1: Product details */}
                  <div className="bg-white border border-[#e7e5e0] rounded-xl p-5 flex flex-col gap-4 shadow-xs">
                    <h2 className="text-[15px] font-medium text-[#111] m-0">Product details</h2>

                    <div>
                      <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="pn">
                        Product name
                      </label>
                      <input
                        id="pn"
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        placeholder="Boxy graphic tee"
                        className="w-full h-11 border border-[#b9b6aa] rounded-lg px-3.5 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="pd">
                        Description
                      </label>
                      <textarea
                        id="pd"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the fit, fabric and care"
                        className="w-full h-24 border border-[#b9b6aa] rounded-lg p-3 text-sm text-[#111] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Category */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-medium text-[#111]" htmlFor="pc">
                            Category
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowCategoryModal(true)}
                            className="text-[11px] text-[#555] hover:text-black font-semibold flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" /> New
                          </button>
                        </div>
                        <CustomSelect
                          id="pc"
                          value={categoryId}
                          onChange={(val) => setCategoryId(val)}
                          options={categories.map((cat) => ({ value: cat.id, label: cat.name }))}
                          placeholder="Select Category"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="pg">
                          Gender
                        </label>
                        <CustomSelect
                          id="pg"
                          value={gender}
                          onChange={(val) => setGender(val)}
                          options={['Unisex', 'Men', 'Women']}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Pricing & inventory with 2-way automatic price calculation */}
                  <div className="bg-white border border-[#e7e5e0] rounded-xl p-5 flex flex-col gap-4 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h2 className="text-[15px] font-medium text-[#111] m-0">Pricing &amp; inventory</h2>
                      <span className="text-[11px] text-[#555] bg-[#F6F4EC] px-2 py-0.5 rounded border border-[#e7e5e0]">
                        Auto-calculates from any 2 fields
                      </span>
                    </div>

                    {/* Row of 3: Selling Price, MRP, Discount */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Selling Price */}
                      <div>
                        <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="pp">
                          Selling price
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3 text-sm text-[#111] pointer-events-none">₹</span>
                          <input
                            id="pp"
                            type="number"
                            min="1"
                            placeholder="799"
                            value={sellingPrice}
                            onChange={(e) => handleSellingPriceChange(e.target.value)}
                            className="w-full h-11 border border-[#b9b6aa] rounded-lg pl-7 pr-3.5 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                          />
                        </div>
                      </div>

                      {/* MRP */}
                      <div>
                        <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="pm">
                          MRP
                        </label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-3 text-sm text-[#111] pointer-events-none">₹</span>
                          <input
                            id="pm"
                            type="number"
                            min="1"
                            placeholder="999"
                            value={mrp}
                            onChange={(e) => handleMrpChange(e.target.value)}
                            className="w-full h-11 border border-[#b9b6aa] rounded-lg pl-7 pr-3.5 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                          />
                        </div>
                      </div>

                      {/* Discount */}
                      <div>
                        <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="pt">
                          Discount
                        </label>
                        <div className="relative">
                          <input
                            id="pt"
                            type="text"
                            placeholder="20"
                            value={discount.replace('%', '')}
                            onChange={(e) => handleDiscountChange(e.target.value)}
                            className="w-full h-11 border border-[#b9b6aa] rounded-lg pl-3.5 pr-8 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                          />
                          <span className="absolute right-3.5 top-3 text-sm text-[#555] pointer-events-none">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Row of 2: SKU and Stock quantity */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="sk">
                          SKU
                        </label>
                        <input
                          id="sk"
                          type="text"
                          placeholder="WRD-TEE-001"
                          value={sku}
                          onChange={(e) => setSku(e.target.value)}
                          className="w-full h-11 border border-[#b9b6aa] rounded-lg px-3.5 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="st">
                          Stock quantity
                        </label>
                        <input
                          id="st"
                          type="number"
                          placeholder="50"
                          value={stockQuantity}
                          onChange={(e) => setStockQuantity(e.target.value)}
                          className="w-full h-11 border border-[#b9b6aa] rounded-lg px-3.5 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Variants */}
                  <div className="bg-white border border-[#e7e5e0] rounded-xl p-5 flex flex-col gap-4 shadow-xs">
                    <h2 className="text-[15px] font-medium text-[#111] m-0">Variants</h2>

                    {/* Sizes chips */}
                    <div>
                      <span className="block text-xs font-medium text-[#111] mb-1.5">Sizes</span>
                      <div className="flex gap-2 flex-wrap">
                        {availableSizes.map((sz) => {
                          const isSelected = selectedSizes.includes(sz);
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => toggleSize(sz)}
                              className={`h-11 min-w-[48px] px-3.5 border rounded-lg font-medium text-[13px] cursor-pointer transition ${isSelected
                                ? 'bg-[#111] text-[#FFD400] border-[#111]'
                                : 'bg-white text-[#111] border-[#b9b6aa] hover:border-black'
                                }`}
                            >
                              {sz}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Colours swatches */}
                    <div>
                      <span className="block text-xs font-medium text-[#111] mb-1.5">Colours</span>
                      <div className="flex gap-1.5 items-center">
                        {availableColours.map((c) => {
                          const isSelected = selectedColour === c.name;
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => setSelectedColour(c.name)}
                              aria-label={c.name}
                              className="w-11 h-11 border-0 bg-transparent cursor-pointer flex items-center justify-center"
                            >
                              <span
                                style={{
                                  backgroundColor: c.hex,
                                  outline: isSelected ? '2px solid #111' : 'none',
                                  outlineOffset: '3px'
                                }}
                                className="w-7 h-7 rounded-full border border-[#b9b6aa] block transition-transform"
                              />
                            </button>
                          );
                        })}
                        <span className="text-xs text-[#555] ml-2">Selected: <strong>{selectedColour}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN (340px): Product images, Status, Tags */}
                <div className="flex flex-col gap-5">
                  {/* Card: Product images */}
                  <div className="bg-white border border-[#e7e5e0] rounded-xl p-5 flex flex-col gap-4 shadow-xs">
                    <h2 className="text-[15px] font-medium text-[#111] m-0">Product images</h2>

                    {/* Drag & drop upload area matching mockup (#FFF9DB background) */}
                    <div className="h-[170px] border-[1.5px] border-dashed border-[#6d6b67] rounded-xl bg-[#FFF9DB] flex flex-col items-center justify-center gap-2 relative cursor-pointer hover:brightness-98 transition">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <span className="w-11 h-11 rounded-full bg-[#111] flex items-center justify-center shadow-xs">
                        <Upload className="w-5 h-5 text-[#FFD400]" />
                      </span>
                      <div className="text-[13px] text-[#111] text-center px-4">
                        {uploadingImage ? (
                          <span className="font-semibold text-xs flex items-center gap-1 justify-center">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Uploading image...
                          </span>
                        ) : (
                          <>
                            Drag &amp; drop images or{' '}
                            <span className="font-medium underline">browse</span>
                          </>
                        )}
                      </div>
                      <div className="text-[11px] text-[#555]">PNG, JPG or WEBP</div>
                    </div>

                    {/* Thumbnail preview grid matching mockup */}
                    <div className="grid grid-cols-4 gap-2.5">
                      {imagePreview || uploadedImageUrl ? (
                        <div className="h-16 rounded-[10px] bg-white border border-[#111] overflow-hidden relative group">
                          <img
                            src={
                              imagePreview ||
                              (uploadedImageUrl.startsWith('/static/')
                                ? `http://127.0.0.1:9000${uploadedImageUrl}`
                                : uploadedImageUrl)
                            }
                            alt="Uploaded"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview('');
                              setUploadedImageUrl('');
                              setImageFile(null);
                            }}
                            className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-16 rounded-[10px] bg-[#FFF3B0] flex items-center justify-center">
                          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M8 4 3 8l3 3 2-1.5V20h8V9.5l2 1.5 3-3-5-4c-.5 1.5-1.8 2.5-3 2.5S8.5 5.5 8 4z" />
                          </svg>
                        </div>
                      )}

                      <div className="h-16 rounded-[10px] bg-[#E8E8E8] flex items-center justify-center">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M8 4 3 8l3 3 2-1.5V20h8V9.5l2 1.5 3-3-5-4c-.5 1.5-1.8 2.5-3 2.5S8.5 5.5 8 4z" />
                        </svg>
                      </div>

                      <div className="h-16 rounded-[10px] bg-[#DDEBFF] flex items-center justify-center">
                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M8 4 3 8l3 3 2-1.5V20h8V9.5l2 1.5 3-3-5-4c-.5 1.5-1.8 2.5-3 2.5S8.5 5.5 8 4z" />
                        </svg>
                      </div>

                      <label
                        className="h-16 rounded-[10px] border-[1.5px] border-dashed border-[#6d6b67] bg-white flex items-center justify-center text-[22px] text-[#111] cursor-pointer hover:bg-neutral-50 transition"
                        title="Add image"
                      >
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                        +
                      </label>
                    </div>
                  </div>

                  {/* Card: Status & visibility */}
                  <div className="bg-white border border-[#e7e5e0] rounded-xl p-5 flex flex-col gap-4 shadow-xs">
                    <h2 className="text-[15px] font-medium text-[#111] m-0">Status &amp; visibility</h2>

                    <div>
                      <label className="block text-xs font-medium text-[#111] mb-1.5" htmlFor="ss">
                        Status
                      </label>
                      <CustomSelect
                        id="ss"
                        value={status}
                        onChange={(val) => setStatus(val)}
                        options={['Active', 'Draft']}
                      />
                    </div>

                    <label className="flex items-center gap-2.5 text-[13px] text-[#111] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showInNewArrivals}
                        onChange={(e) => setShowInNewArrivals(e.target.checked)}
                        className="w-4 h-4 accent-[#111]"
                      />
                      <span>Show in New arrivals</span>
                    </label>

                    <label className="flex items-center gap-2.5 text-[13px] text-[#111] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={showInTrending}
                        onChange={(e) => setShowInTrending(e.target.checked)}
                        className="w-4 h-4 accent-[#111]"
                      />
                      <span>Show in Trending</span>
                    </label>
                  </div>

                  {/* Card: Tags */}
                  <div className="bg-white border border-[#e7e5e0] rounded-xl p-5 flex flex-col gap-4 shadow-xs">
                    <h2 className="text-[15px] font-medium text-[#111] m-0">Tags</h2>

                    <input
                      type="text"
                      placeholder="Add a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="w-full h-11 border border-[#b9b6aa] rounded-lg px-3.5 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                    />

                    <div className="flex gap-2 flex-wrap">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-full bg-[#FFF9DB] border border-[#111] text-xs text-[#111] select-none"
                        >
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-red-600 font-bold ml-0.5 text-xs"
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 1B: ALL PRODUCTS TABLE */}
            {productSubView === 'all-products' && (
              <div className="bg-white border border-[#e7e5e0] rounded-xl overflow-hidden shadow-xs">
                <div className="p-4 border-b border-[#e7e5e0] flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm text-[#111]">Database Catalog ({products.length} Items)</h3>
                    <p className="text-[11px] text-[#555] mt-0.5">Click "Edit" on any product to modify its details, prices, or variants.</p>
                  </div>
                  <button
                    type="button"
                    onClick={loadProducts}
                    className="text-xs text-[#555] hover:text-[#111] flex items-center gap-1 font-medium"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                  </button>
                </div>

                {loadingProducts ? (
                  <div className="py-12 flex justify-center">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#FFD400]" />
                  </div>
                ) : products.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#555]">
                    No products found in the database. Use "+ Add New Product" above to publish one.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-[#FFF9DB]/40 border-b border-[#e7e5e0] text-[#555] uppercase text-[11px] tracking-wider">
                          <th className="py-3 px-4">Item</th>
                          <th className="py-3 px-4">Price</th>
                          <th className="py-3 px-4">Gender</th>
                          <th className="py-3 px-4">Variants</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e7e5e0]">
                        {products.map((p) => {
                          const imageUrl = p.image_url?.startsWith('/static/')
                            ? `http://127.0.0.1:9000${p.image_url}`
                            : p.image_url;

                          return (
                            <tr key={p.id} className="hover:bg-neutral-50 transition">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  {imageUrl ? (
                                    <img
                                      src={imageUrl}
                                      alt={p.name}
                                      className="w-10 h-12 object-cover rounded border border-[#e7e5e0]"
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://placehold.co/80x100?text=No+Img';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-10 h-12 rounded bg-[#FFF3B0] border border-[#e7e5e0] flex items-center justify-center text-xs font-bold text-[#111]">
                                      W
                                    </div>
                                  )}
                                  <div>
                                    <div className="font-semibold text-[#111]">{p.name}</div>
                                    <div className="text-[11px] text-[#555]">ID #{p.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 font-bold text-[#111]">
                                ₹{parseFloat(p.base_price).toLocaleString('en-IN')}
                              </td>
                              <td className="py-3 px-4 capitalize text-[#555]">{p.gender || 'unisex'}</td>
                              <td className="py-3 px-4">
                                <span className="font-medium text-[#111]">{p.variants?.length || 0} size(s)</span>
                                <span className="text-[10px] text-[#555] block">
                                  {p.variants?.map((v) => v.size).join(', ') || 'Standard'}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Edit Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleStartEdit(p)}
                                    className="px-2.5 py-1.5 bg-[#FFF9DB] border border-[#111] text-[#111] hover:bg-[#FFD400] text-xs font-semibold rounded-md transition flex items-center gap-1"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                    <span>Edit</span>
                                  </button>

                                  {/* View Live Storefront */}
                                  <Link
                                    to={`/product/${p.id}`}
                                    target="_blank"
                                    className="p-1.5 text-[#555] hover:text-black rounded transition"
                                    title="View on Storefront"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </Link>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProduct(p.id, p.name)}
                                    className="p-1.5 text-[#555] hover:text-red-600 rounded transition"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 3: ORDERS / OTHER TABS                             */}
        {/* ======================================================= */}
        {['orders', 'customers', 'discounts', 'analytics', 'settings'].includes(activeNav) && (
          <div className="max-w-[1040px] flex flex-col gap-5">
            <div>
              <div className="text-xs text-[#555] mb-1">Management</div>
              <h1 className="text-[26px] font-medium text-[#111] capitalize">{activeNav}</h1>
            </div>

            <div className="bg-white border border-[#e7e5e0] rounded-xl p-12 text-center text-xs text-[#555]">
              <Package className="w-10 h-10 text-[#b9b6aa] mx-auto mb-2" />
              <p className="font-medium text-[#111]">No active records under {activeNav}</p>
              <p className="mt-1">Connect your payment and fulfillment integrations in Settings.</p>
            </div>
          </div>
        )}
      </main>

      {/* QUICK ADD CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-[#e7e5e0] rounded-xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[#111]">Create New Category</h3>
              <button
                type="button"
                onClick={() => setShowCategoryModal(false)}
                className="text-[#555] hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#111] mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hoodies, Cargos"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full h-11 border border-[#b9b6aa] rounded-lg px-3.5 text-sm text-[#111] bg-white focus:outline-none focus:ring-2 focus:ring-[#FFD400]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="h-9 px-3 text-xs text-[#555] hover:text-black font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingCategory}
                  className="h-9 px-4 bg-[#111] text-[#FFD400] text-xs font-medium rounded-lg hover:bg-black transition"
                >
                  {savingCategory ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
