import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('learnfree_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('learnfree_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('learnfree_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification error:', err.message);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('learnfree_token', res.token);
        localStorage.setItem('learnfree_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return { success: false, error: res.error || 'Login failed' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const register = async (full_name, email, password, role = 'student') => {
    try {
      const res = await authAPI.register({ full_name, email, password, role });
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('learnfree_token', res.token);
        localStorage.setItem('learnfree_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      return { success: false, error: res.error || 'Registration failed' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('learnfree_token');
      localStorage.removeItem('learnfree_user');
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout
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
