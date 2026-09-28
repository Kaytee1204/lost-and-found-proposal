// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { CURRENT_USER } from '@/data/mockData';

const AuthContext = createContext(null);

const STORAGE_KEY_USER = 'timdo_auth_user';
const STORAGE_KEY_TOKEN = 'timdo_auth_token';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY_USER);
      return savedUser ? JSON.parse(savedUser) : CURRENT_USER;
    } catch {
      return CURRENT_USER;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_TOKEN) || 'mock_jwt_token_timdo_2026';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEY_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    }
  }, [token]);

  const login = async (email, password) => {
    const mockUser = {
      ...CURRENT_USER,
      email: email || CURRENT_USER.email,
    };
    const mockToken = `mock_token_${Date.now()}`;
    setUser(mockUser);
    setToken(mockToken);
    return { success: true, user: mockUser };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => (prev ? { ...prev, ...updatedFields } : null));
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'admin' || user?.id === 'USR-ADMIN',
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
