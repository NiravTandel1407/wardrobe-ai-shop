import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AdminPortal from './pages/AdminPortal';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminPortal />} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
