import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';

// Importar las páginas
import { Home } from './pages/Home';
import { Productos } from './pages/Productos';
import { Blog } from './pages/Blog';
import { Unete } from './pages/Unete';
import Registro from './components/Registro';
import { Profile } from './pages/Profile';
import { Nosotros } from './pages/Nosotros';
import { Carrito } from './pages/Carrito';
import { DetalleProducto } from './pages/Detalle_productos';
import Header from './components/Header';
import Footer from './components/Footer';
import Boleta from './pages/Boleta';
import BoletaFinal from './pages/BoletaFinal';
import { Admin } from "./pages/Admin";
import { AdminUsuarios } from "./pages/AdminUsuarios";
import AdminBoletas from "./pages/AdminBoletas";
import {AdminProductos} from "./pages/AdminProductos";
import AdminEstadisticas from "./pages/AdminEstadisticas";
import './css/styles.css';
import Ofertas from "./pages/ofertas";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/unete" element={<Unete />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/boleta" element={<Boleta />} />
        <Route path="/boleta-final" element={<BoletaFinal />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/productos" element={<AdminProductos />} />
        <Route path="/admin/boletas" element={<AdminBoletas />} />
        <Route path="/admin/estadisticas" element={<AdminEstadisticas />} />
        <Route path="/admin/usuarios" element={<AdminUsuarios />} />
        <Route path="/ofertas" element={<Ofertas />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
