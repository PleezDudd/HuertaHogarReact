import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../css/styles.css';

export default function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const linkClass = ({ isActive }) => (isActive ? '' : '');

  const handleLogout = () => {
    logout();
    navigate('/unete');
  };

  return (
    <header className="site-header">
      <div className="container header-wrap">
        <Link to="/" className="logo">Mi Tienda</Link>

        <nav aria-label="Menú principal">
          <ul className="nav">
            <li><NavLink to="/" end className={linkClass}>Inicio</NavLink></li>
            <li><NavLink to="/productos" className={linkClass}>Catálogo</NavLink></li>
            <li><NavLink to="/blog" className={linkClass}>Blog</NavLink></li>
            <li><NavLink to="/nosotros" className={linkClass}>Nosotros</NavLink></li>
            
            {/* Mostrar "Únete" solo si no está autenticado */}
            {!isAuthenticated && (
              <li><NavLink to="/unete" className={linkClass}>Únete</NavLink></li>
            )}
            
            {/* Mostrar "Perfil" solo si está autenticado */}
            {isAuthenticated && (
              <li><NavLink to="/perfil" className={linkClass}>Perfil</NavLink></li>
            )}
            
            {/* Mostrar "Carrito" solo si está autenticado */}
            {isAuthenticated && (
              <li><NavLink to="/carrito" className={linkClass}>Carrito</NavLink></li>
            )}
            
            {/* Mostrar "Admin" solo si es administrador */}
            {isAuthenticated && isAdmin && (
              <li><NavLink to="/admin" className={linkClass}>Admin</NavLink></li>
            )}
            
            <li>
              <NavLink
                to="/ofertas"
                className={({ isActive }) => (isActive ? 'active' : undefined)}
              >
                Ofertas
              </NavLink>
            </li>
          </ul>
        </nav>

        <div>
          {isAuthenticated ? (
            <>
              {/* Mostrar información del usuario y botón de logout */}
              <span style={{ marginRight: 10, color: '#fff' }}>
                {user?.username || user?.email || 'Usuario'}
              </span>
              {isAdmin && (
                <Link to="/admin" className="btn btn-outline" style={{ marginRight: 10 }}>
                  Panel Admin
                </Link>
              )}
              <button 
                onClick={handleLogout} 
                className="btn btn-outline"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              {/* Mostrar botones de login y registro solo si no está autenticado */}
              <Link to="/unete" className="btn btn-outline">Ingresar</Link>
              <Link to="/registro" className="btn btn-primary" style={{ marginLeft: 10 }}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}