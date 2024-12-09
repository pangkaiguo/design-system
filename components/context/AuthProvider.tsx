'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean; // login status
  loading: boolean;         // loading status
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (document.cookie.includes('token=')) {
      const fetchAuthStatus = async () => {
        try {
          const res = await fetch('/api/auth/status', { credentials: 'include' });
          setIsAuthenticated(res.ok);
        } catch (error) {
          console.error('Failed to fetch auth status:', error);
          setIsAuthenticated(false);
        } finally {
          setLoading(false);
        }
      };

      fetchAuthStatus();
    } else {
      setIsAuthenticated(false);
      setLoading(false);
    }
  }, []);

  const login = (token: string) => {
    document.cookie = `token=${token}; path=/;`; // store token
    setIsAuthenticated(true);
  };

  const logout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;';
    setIsAuthenticated(false);
    setLoading(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};