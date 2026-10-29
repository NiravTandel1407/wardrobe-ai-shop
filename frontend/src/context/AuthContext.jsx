import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('wardrobe_token') || null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      if (!token) {
        if (mounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }
      try {
        const userData = await getCurrentUser(token);
        if (mounted) {
          setUser(userData);
        }
      } catch (err) {
        console.warn('[AuthContext] Session expired or invalid token:', err.message);
        localStorage.removeItem('wardrobe_token');
        if (mounted) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, [token]);

  const login = (newToken, userData = null) => {
    localStorage.setItem('wardrobe_token', newToken);
    setToken(newToken);
    if (userData) {
      setUser(userData);
    }
  };

  const logout = () => {
    localStorage.removeItem('wardrobe_token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAdmin: Boolean(user?.is_admin),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

