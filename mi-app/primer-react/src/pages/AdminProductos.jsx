import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../css/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const AdminProductos = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagen: "",
    stock: "",
    activo: true,
  });

  // Cargar productos desde el backend
  useEffect(() => {
    document.title = "Administrar Productos | Huerto Hogar";
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/productos");
      setProductos(response.data || []);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError("Error al cargar los productos. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productoData = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        imagen: formData.imagen,
        stock: parseInt(formData.stock) || 0,
        activo: formData.activo,
      };

      if (editingProduct) {
        // Actualizar producto existente
        await api.put(`/api/productos/${editingProduct.id}`, productoData);
        alert("Producto actualizado exitosamente");
      } else {
        // Crear nuevo producto
        await api.post("/api/productos", productoData);
        alert("Producto creado exitosamente");
      }

      // Limpiar formulario y recargar productos
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        categoria: "",
        imagen: "",
        stock: "",
        activo: true,
      });
      setShowForm(false);
      setEditingProduct(null);
      cargarProductos();
    } catch (err) {
      console.error("Error al guardar producto:", err);
      const errorMsg = err.response?.data?.message || "Error al guardar el producto.";
      alert(errorMsg);
    }
  };

  const handleEdit = (producto) => {
    setEditingProduct(producto);
    setFormData({
      nombre: producto.nombre || "",
      descripcion: producto.descripcion || "",
      precio: producto.precio || "",
      categoria: producto.categoria || "",
      imagen: producto.imagen || "",
      stock: producto.stock || "",
      activo: producto.activo !== undefined ? producto.activo : true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    try {
      await api.delete(`/api/productos/${id}`);
      alert("Producto eliminado exitosamente");
      cargarProductos();
    } catch (err) {
      console.error("Error al eliminar producto:", err);
      alert("Error al eliminar el producto. Intenta nuevamente.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      imagen: "",
      stock: "",
      activo: true,
    });
  };

  const formatCLP = (n) => {
    if (!n) return "—";
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  };

  return (
    <div className="admin-wrapper" style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        className="sidebar"
        style={{
          width: "240px",
          background: "#2E8B57",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "1.5rem 1rem",
        }}
      >
        <div>
          <div
            className="sidebar-header"
            style={{
              fontWeight: "bold",
              fontSize: "1.3rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            🥑 Huerto Hogar
          </div>
          <nav className="nav">
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li>
                <Link to="/admin" className="nav-link">
                  <i className="fa-solid fa-house"></i> Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/productos" className="nav-link active">
                  <i className="fa-solid fa-seedling"></i> Productos
                </Link>
              </li>
              <li>
                <Link to="/admin/usuarios" className="nav-link">
                  <i className="fa-solid fa-users"></i> Usuarios
                </Link>
              </li>
              <li>
                <Link to="/admin/boletas" className="nav-link">
                  <i className="fa-solid fa-file-invoice"></i> Boletas
                </Link>
              </li>
              <li>
                <Link to="/admin/estadisticas" className="nav-link">
                  <i className="fa-solid fa-chart-line"></i> Estadísticas
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <button
          onClick={() => {
            logout();
            navigate("/unete");
          }}
          style={{
            background: "transparent",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            marginTop: "1rem",
            display: "flex",
            alignItems: "center",
            gap: ".5rem",
          }}
        >
          <i className="fa-solid fa-right-from-bracket"></i> Cerrar sesión
        </button>
      </aside>

      {/* Contenido principal */}
      <main
        className="main-content"
        style={{
          flexGrow: 1,
          background: "#f5f5f5",
          padding: "2rem",
        }}
      >
        <section
          className="hero"
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "1.5rem",
            marginBottom: "2rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ color: "#2E8B57" }}>Gestión de Productos</h1>
              <p>Administra los productos de la tienda.</p>
            </div>
            {!showForm && (
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
                style={{ padding: "0.5rem 1rem" }}
              >
                <i className="fa-solid fa-plus"></i> Nuevo Producto
              </button>
            )}
          </div>
        </section>

        {/* Formulario de creación/edición */}
        {showForm && (
          <section
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "1.5rem",
              marginBottom: "2rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h2 style={{ color: "#2E8B57", marginBottom: "1rem" }}>
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Nombre *
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Categoría
                  </label>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Precio *
                  </label>
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    URL Imagen
                  </label>
                  <input
                    type="text"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <input
                    type="checkbox"
                    name="activo"
                    checked={formData.activo}
                    onChange={handleInputChange}
                  />
                  <span>Producto activo</span>
                </label>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? "Actualizar" : "Crear"} Producto
                </button>
                <button type="button" className="btn btn-outline" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Lista de productos */}
        <section
          id="productos"
          className="catalogo"
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "1.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ color: "#2E8B57" }}>Productos Disponibles</h2>

          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : productos.length === 0 ? (
            <p>No hay productos cargados actualmente.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "1rem",
              }}
            >
              <thead
                style={{
                  background: "#e9f6ec",
                  color: "#2E8B57",
                  fontWeight: "600",
                }}
              >
                <tr>
                  <th style={{ padding: "10px" }}>ID</th>
                  <th style={{ padding: "10px" }}>Nombre</th>
                  <th style={{ padding: "10px" }}>Categoría</th>
                  <th style={{ padding: "10px" }}>Precio</th>
                  <th style={{ padding: "10px" }}>Stock</th>
                  <th style={{ padding: "10px" }}>Estado</th>
                  <th style={{ padding: "10px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "10px" }}>{p.id}</td>
                    <td style={{ padding: "10px" }}>{p.nombre}</td>
                    <td style={{ padding: "10px" }}>{p.categoria || "Sin categoría"}</td>
                    <td style={{ padding: "10px" }}>{formatCLP(p.precio)}</td>
                    <td style={{ padding: "10px" }}>{p.stock || 0}</td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          background: p.activo ? "#e6f7ea" : "#fee",
                          color: p.activo ? "#1e6b3a" : "#c00",
                        }}
                      >
                        {p.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td style={{ padding: "10px" }}>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => handleEdit(p)}
                          className="btn btn-outline"
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.9rem" }}
                        >
                          <i className="fa-solid fa-edit"></i> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn btn-outline"
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.9rem", color: "#c00" }}
                        >
                          <i className="fa-solid fa-trash"></i> Eliminar
                        </button>
                        <Link
                          to={`/productos/${p.id}`}
                          className="btn btn-outline"
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.9rem" }}
                        >
                          <i className="fa-solid fa-eye"></i> Ver
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <footer
          className="site-footer"
          style={{
            marginTop: "2rem",
            textAlign: "center",
            color: "#555",
            fontSize: ".9rem",
          }}
        >
          <div>© 2025 Huerto Hogar. Todos los derechos reservados.</div>
        </footer>
      </main>
    </div>
  );
};

export default AdminProductos;
