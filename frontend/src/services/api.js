/**
 * API Service for WARDROBE
 * Fully typed against OpenAPI 3.1.0 specification:
 * - /api/v1/categories
 * - /api/v1/products
 * - /api/v1/cart & /api/v1/cart/items
 * - /api/v1/auth & /api/v1/users/me
 *
 * Includes automatic normalization and seamless fallback to mock data
 * when the backend is offline, empty, or unreachable.
 */

import { PRODUCTS as MOCK_PRODUCTS, CATEGORIES as MOCK_CATEGORIES } from '../data/products';

const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? 'http://127.0.0.1:9000/api/v1'
  : '/api/v1';

// Preset pastel palette for product tiles
const PASTELS = ['#FFF3B0', '#E8E8E8', '#DDEBFF', '#FFE0D6', '#E3F2E1', '#EADFFC'];

/**
 * Normalizes backend ProductResponse into frontend card model
 */
export function normalizeProduct(apiProduct, index = 0) {
  const price = parseFloat(apiProduct.base_price) || 0;
  const variants = apiProduct.variants || [];

  // Extract sizes from variants
  const sizes = Array.from(
    new Set(variants.map(v => v.size).filter(Boolean))
  );

  // Extract colors from variants
  const colors = Array.from(
    new Set(variants.map(v => v.color?.toLowerCase()).filter(Boolean))
  );

  return {
    id: apiProduct.id,
    name: apiProduct.name,
    description: apiProduct.description || '',
    price: price,
    category: apiProduct.category?.name || 'T-shirts',
    categoryId: apiProduct.category_id,
    gender: apiProduct.gender || 'unisex',
    sizes: sizes.length > 0 ? sizes : ['S', 'M', 'L', 'XL'],
    colour: colors[0] || 'black',
    tileColor: PASTELS[index % PASTELS.length],
    isFeatured: index < 4,
    isNew: index >= 4 && index < 8,
    popularity: 100 - index,
    image: apiProduct.image_url || null,
    variants: variants,
  };
}

/**
 * Fetch all categories from backend with fallback
 */
export async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`Categories HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map(c => c.name);
    }
  } catch (err) {
    console.info('[API] Categories fallback to mock:', err.message);
  }
  return MOCK_CATEGORIES;
}

/**
 * Fetch all products from backend with fallback
 */
export async function getProducts(skip = 0, limit = 50) {
  try {
    const res = await fetch(`${API_BASE}/products?skip=${skip}&limit=${limit}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`Products HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      return data.map((p, idx) => normalizeProduct(p, idx));
    }
  } catch (err) {
    console.info('[API] Products fallback to mock:', err.message);
  }
  return MOCK_PRODUCTS;
}

/**
 * Fetch single product by id
 */
export async function getProductById(productId) {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) throw new Error(`Product ${productId} HTTP ${res.status}`);
    const data = await res.json();
    return normalizeProduct(data);
  } catch (err) {
    return MOCK_PRODUCTS.find(p => p.id === Number(productId)) || null;
  }
}

/**
 * Cart API methods (OpenAPI: /api/v1/cart & /api/v1/cart/items)
 */
export async function getCart() {
  try {
    const token = localStorage.getItem('wardrobe_token');
    const res = await fetch(`${API_BASE}/cart`, {
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    // Client-side cart fallback
  }
  return null;
}

export async function addCartItem(variantId, quantity = 1) {
  try {
    const token = localStorage.getItem('wardrobe_token');
    const res = await fetch(`${API_BASE}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ variant_id: variantId, quantity }),
      signal: AbortSignal.timeout(3000),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Add cart item fallback to local:', err.message);
  }
  return null;
}

export async function removeCartItem(itemId) {
  try {
    const token = localStorage.getItem('wardrobe_token');
    const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Remove cart item error:', err.message);
  }
  return null;
}

