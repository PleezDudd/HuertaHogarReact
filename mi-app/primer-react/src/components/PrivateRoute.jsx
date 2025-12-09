import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isAuthenticated } from '../services/authService';

/**
 * Componente PrivateRoute
 * Protege rutas que requieren autenticación
 * 
 * @param {React.Component} component - Componente a renderizar si está autenticado
 * @param {boolean} requireAdmin - Si es true, solo permite acceso a administradores
 * @param {object} rest - Props adicionales para Route
 */
const PrivateRoute = ({ component: Component, requireAdmin = false, ...rest }) => {
  const { isAuthenticated: isAuth, isAdmin, loading } = useAuth();
  const hasToken = isAuthenticated();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <div>Cargando...</div>;
  }

  // Si no está autenticado, redirigir al login
  if (!hasToken || !isAuth) {
    return <Navigate to="/unete" replace />;
  }

  // Si requiere admin y el usuario no es admin, redirigir
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado (y con rol correcto si se requiere), renderizar el componente
  return <Component {...rest} />;
};

export default PrivateRoute;

