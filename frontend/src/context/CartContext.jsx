import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCartApi,
  normalizeCartResponse,
} from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync cart with backend whenever user is authenticated
  const fetchBackendCart = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const data = await getCart();
      if (data) {
        const norm = normalizeCartResponse(data);
        setCartItems(norm.items);
      }
    } catch (err) {
      console.warn('[CartContext] Failed to fetch cart:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchBackendCart();
    } else {
      setCartItems([]);
    }
  }, [token, fetchBackendCart]);

  /**
   * Add item to bag
   * Connects to backend API POST /api/v1/cart/items when authenticated
   */
  const addToCart = async (product, quantity = 1, options = {}) => {
    const qty = typeof quantity === 'number' && quantity > 0 ? quantity : 1;
    const selectedSize = options.selectedSize || product.selectedSize || null;
    const selectedColor = options.selectedColor || product.selectedColor || null;

    // Resolve variant ID
    let variantId = options.variantId || product.variantId || null;
    if (!variantId && Array.isArray(product.variants) && product.variants.length > 0) {
      if (selectedSize) {
        const matched = product.variants.find(
          v => v.size?.toUpperCase() === selectedSize.toUpperCase()
        );
        if (matched) variantId = matched.id;
      }
      if (!variantId) {
        const inStock = product.variants.find(v => (v.stock || 0) > 0);
        variantId = inStock ? inStock.id : product.variants[0].id;
      }
    }

    // When logged in and variant is found, persist directly to API database
    if (token && variantId) {
      try {
        const updated = await addCartItem(variantId, qty);
        if (updated) {
          const norm = normalizeCartResponse(updated);
          setCartItems(norm.items);
          setToastMessage(`Added "${product.name}" to your bag`);
          setTimeout(() => setToastMessage(null), 2200);
          return;
        }
      } catch (err) {
        console.warn('[CartContext] addCartItem error:', err);
      }
    }

    // Local state fallback (for guests or offline state)
    setCartItems(prev => {
      const matchIdx = prev.findIndex(item =>
        (item.variantId && item.variantId === variantId) ||
        (item.productId === product.id && (!selectedSize || item.selectedSize === selectedSize))
      );
      if (matchIdx >= 0) {
        const updated = [...prev];
        updated[matchIdx] = {
          ...updated[matchIdx],
          quantity: updated[matchIdx].quantity + qty,
        };
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id || Date.now(),
          cartItemId: null,
          variantId: variantId,
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          selectedSize: selectedSize || (product.sizes ? product.sizes[0] : 'Standard'),
          size: selectedSize || (product.sizes ? product.sizes[0] : 'Standard'),
          selectedColor: selectedColor || product.colour,
          color: selectedColor || product.colour,
          image: product.image,
          tileColor: product.tileColor || '#FFF3B0',
        },
      ];
    });

    setToastMessage(`Added "${product.name}" to your bag`);
    setTimeout(() => setToastMessage(null), 2200);
  };

  /**
   * Update quantity (PATCH /api/v1/cart/items/{itemId})
   */
  const updateQuantity = async (itemId, newQty) => {
    if (newQty <= 0) {
      return removeFromCart(itemId);
    }

    // Optimistic local update
    setCartItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );

    if (token) {
      try {
        const updated = await updateCartItem(itemId, newQty);
        if (updated) {
          setCartItems(normalizeCartResponse(updated).items);
        }
      } catch (err) {
        console.warn('[CartContext] updateQuantity error:', err);
      }
    }
  };

  /**
   * Remove item (DELETE /api/v1/cart/items/{itemId})
   */
  const removeFromCart = async (itemId) => {
    // Optimistic local remove
    setCartItems(prev => prev.filter(item => item.id !== itemId));

    if (token) {
      try {
        const updated = await removeCartItem(itemId);
        if (updated) {
          setCartItems(normalizeCartResponse(updated).items);
        }
      } catch (err) {
        console.warn('[CartContext] removeFromCart error:', err);
      }
    }
  };

  /**
   * Clear all items in bag (DELETE /api/v1/cart)
   */
  const clearCart = async () => {
    setCartItems([]);
    if (token) {
      try {
        await clearCartApi();
      } catch (err) {
        console.warn('[CartContext] clearCart error:', err);
      }
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        isLoading,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        toastMessage,
        refreshCart: fetchBackendCart,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-brand-ink text-brand-yellow px-4 py-2.5 rounded-btn text-xs sm:text-sm font-medium shadow-lg animate-bounce transition-all">
          {toastMessage}
        </div>
      )}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
