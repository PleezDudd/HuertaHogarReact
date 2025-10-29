import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import '../css/styles.css';

export default function Header() {
  const linkClass = ({ isActive }) => (isActive ? '' : '');

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
            <li><NavLink to="/unete" className={linkClass}>Únete</NavLink></li>
            <li><NavLink to="/perfil" className={linkClass}>Perfil</NavLink></li>
            <li><NavLink to="/carrito" className={linkClass}>Carrito</NavLink></li>
          </ul>
        </nav>

        <div>
          <Link to="/registro" className="btn btn-outline">Ingresar</Link>
          <Link to="/registro" className="btn btn-primary" style={{ marginLeft: 10 }}>
            Registrarse
          </Link>
        </div>
      </div>
    </header>
  );
}