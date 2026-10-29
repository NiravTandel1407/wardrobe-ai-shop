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

export const API_BASE = typeof window !== 'undefined' && window.location.hostname === 'localhost'
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

  let imageUrl = apiProduct.image_url || null;
  if (imageUrl && imageUrl.startsWith('/static/')) {
    imageUrl = `http://127.0.0.1:9000${imageUrl}`;
  }

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
    image: imageUrl,
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
export function normalizeCartResponse(cartData) {
  if (!cartData || !Array.isArray(cartData.items)) {
    return { items: [], totalItems: 0, subtotal: 0 };
  }
  const items = cartData.items.map((item, idx) => {
    let imageUrl = item.image_url || null;
    if (imageUrl && imageUrl.startsWith('/static/')) {
      imageUrl = `http://127.0.0.1:9000${imageUrl}`;
    }
    return {
      id: item.id, // CartItem database ID
      cartItemId: item.id,
      variantId: item.variant_id,
      productId: item.product_id,
      name: item.product_name,
      price: parseFloat(item.unit_price) || 0,
      quantity: item.quantity,
      selectedSize: item.size,
      size: item.size,
      selectedColor: item.color,
      color: item.color,
      image: imageUrl,
      tileColor: PASTELS[idx % PASTELS.length],
      availableStock: item.available_stock,
      lineTotal: parseFloat(item.line_total) || 0,
      stockIssue: item.stock_issue,
    };
  });

  return {
    id: cartData.id,
    items,
    totalItems: cartData.total_items ?? items.reduce((acc, i) => acc + i.quantity, 0),
    subtotal: parseFloat(cartData.subtotal) || items.reduce((acc, i) => acc + i.price * i.quantity, 0),
  };
}

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

export async function updateCartItem(itemId, quantity) {
  try {
    const token = localStorage.getItem('wardrobe_token');
    const res = await fetch(`${API_BASE}/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify({ quantity }),
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Update cart item error:', err.message);
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

export async function clearCartApi() {
  try {
    const token = localStorage.getItem('wardrobe_token');
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
    });
    if (res.ok) return await res.json();
  } catch (err) {
    console.warn('[API] Clear cart error:', err.message);
  }
  return null;
}

/**
 * Auth API methods (Connected to /api/v1/auth/login & /register)
 */
export async function loginUser(email, password) {
  const formData = new URLSearchParams();
  formData.append('username', email.trim());
  formData.append('password', password);

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    let msg = errorData.detail || `Login failed (${res.status})`;
    if (Array.isArray(msg)) {
      msg = msg.map(m => m.msg).join(', ');
    }
    throw new Error(msg);
  }

  return await res.json();
}

export async function registerUser(email, password, fullName = '') {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim(),
      password: password,
      full_name: fullName.trim() || null,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    let msg = errorData.detail || `Registration failed (${res.status})`;
    if (Array.isArray(msg)) {
      msg = msg.map(m => m.msg).join(', ');
    }
    throw new Error(msg);
  }

  return await res.json();
}

export async function getCurrentUser(token) {
  const res = await fetch(`${API_BASE}/users/me`, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Auth check failed (${res.status})`);
  }

  return await res.json();
}

/**
 * Admin Product & Category methods
 */
export async function getAdminCategories() {
  const res = await fetch(`${API_BASE}/categories`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Categories HTTP ${res.status}`);
  return await res.json();
}

export async function createCategory(data, token) {
  const res = await fetch(`${API_BASE}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Category creation failed (${res.status})`);
  }

  return await res.json();
}

export async function uploadProductImage(file, token) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE}/products/images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Image upload failed (${res.status})`);
  }

  return await res.json();
}

export async function createProduct(productData, token) {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    let errMsg = errorData.detail;
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map(e => `${e.loc?.slice(-1)[0] || 'field'}: ${e.msg}`).join(', ');
    }
    throw new Error(errMsg || `Product creation failed (${res.status})`);
  }

  return await res.json();
}

export async function getAdminProducts(skip = 0, limit = 50) {
  const res = await fetch(`${API_BASE}/products?skip=${skip}&limit=${limit}`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Failed to fetch products (${res.status})`);
  return await res.json();
}

export async function deleteProduct(productId, token) {
  const res = await fetch(`${API_BASE}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || `Delete failed (${res.status})`);
  }

  return true;
}


export async function updateProduct(productId, productData, token) {
  const res = await fetch(`${API_BASE}/products/${productId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    let errMsg = errorData.detail;
    if (Array.isArray(errMsg)) {
      errMsg = errMsg.map(e => `${e.loc?.slice(-1)[0] || 'field'}: ${e.msg}`).join(', ');
    }
    throw new Error(errMsg || `Product update failed (${res.status})`);
  }

  return await res.json();
}
