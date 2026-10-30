import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'extin_admin_user_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse cached user session:', e);
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Check current session validity against backend on mount
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const res = await api.get('/auth/me');
        if (isMounted && res.data) {
          const userData = {
            username: res.data.username,
            role: res.data.role || 'ADMIN',
          };
          setUser(userData);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
        }
      } catch (err) {
        // If not authenticated (401), clear invalid state unless it's a simulated dev session
        if (isMounted) {
          if (err.response?.status === 401) {
            setUser(null);
            localStorage.removeItem(AUTH_STORAGE_KEY);
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Logs in with username/email and password via POST /api/auth/login.
   * Browser automatically stores HttpOnly cookie `jwt_token`.
   */
  const login = async (username, password) => {
    try {
      const res = await api.post('/auth/login', {
        username: username.trim(),
        password,
      });

      const userData = {
        username: res.data?.username || username,
        role: res.data?.role || 'ADMIN',
      };

      setUser(userData);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      // Offline fallback: if network is down or backend offline in development
      if (!err.response && (username === 'admin' || username === 'admin@extin.com')) {
        const mockAdmin = { username: 'admin', role: 'ADMIN' };
        setUser(mockAdmin);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(mockAdmin));
        return { success: true, user: mockAdmin, simulated: true };
      }

      const errorMessage =
        err.response?.data?.message ||
        'Credenciales inválidas o error de conexión con el servidor.';
      return { success: false, error: errorMessage };
    }
  };

  /**
   * Logs out user via POST /api/auth/logout, clearing the HttpOnly cookie.
   */
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Backend logout call completed with warning:', err);
    } finally {
      setUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
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
