'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('whatsapp-clone-token');
    if (storedToken) {
      setToken(storedToken);
      // Set the token for all future axios requests
      axios.defaults.headers.common['x-auth-token'] = storedToken;
    }
    setLoading(false);
  }, []);

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('whatsapp-clone-token', newToken);
    axios.defaults.headers.common['x-auth-token'] = newToken;
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('whatsapp-clone-token');
    delete axios.defaults.headers.common['x-auth-token'];
  };

  const value = {
    token,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};