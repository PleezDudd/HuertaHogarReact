import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import PrivateRoute from './components/PrivateRoute';
import './css/styles.css';
import Ofertas from "./pages/ofertas";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/unete" element={<Unete />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/ofertas" element={<Ofertas />} />
        
        {/* Rutas protegidas - Requieren autenticación */}
        <Route 
          path="/perfil" 
          element={<PrivateRoute component={Profile} />} 
        />
        <Route 
          path="/carrito" 
          element={<PrivateRoute component={Carrito} />} 
        />
        <Route 
          path="/boleta" 
          element={<PrivateRoute component={Boleta} />} 
        />
        <Route 
          path="/boleta-final" 
          element={<PrivateRoute component={BoletaFinal} />} 
        />
        
        {/* Rutas protegidas - Solo para administradores */}
        <Route 
          path="/admin" 
          element={<PrivateRoute component={Admin} requireAdmin={true} />} 
        />
        <Route 
          path="/admin/productos" 
          element={<PrivateRoute component={AdminProductos} requireAdmin={true} />} 
        />
        <Route 
          path="/admin/boletas" 
          element={<PrivateRoute component={AdminBoletas} requireAdmin={true} />} 
        />
        <Route 
          path="/admin/estadisticas" 
          element={<PrivateRoute component={AdminEstadisticas} requireAdmin={true} />} 
        />
        <Route 
          path="/admin/usuarios" 
          element={<PrivateRoute component={AdminUsuarios} requireAdmin={true} />} 
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
