import React, { createContext, useContext, useState, useEffect } from 'react';
import { isAuthenticated, getCurrentUser, getUserRole, isAdmin, logout as authLogout } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario autenticado al cargar la app
    const checkAuth = () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        setUser(currentUser);
        setIsAuth(true);
      } else {
        setUser(null);
        setIsAuth(false);
      }
      setLoading(false);
    };

    checkAuth();

    // Escuchar cambios en localStorage (por si se hace logout en otra pestaña)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'usuarioActual') {
        checkAuth();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = (userData) => {
    setUser(userData);
    setIsAuth(true);
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setIsAuth(false);
  };

  const value = {
    user,
    isAuthenticated: isAuth,
    loading,
    login,
    logout,
    isAdmin: isAdmin(),
    userRole: getUserRole(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

