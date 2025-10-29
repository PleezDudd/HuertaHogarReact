import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { obtenerProductos } from "../data/productos"; // ✅ usamos tus productos reales

export const AdminProductos = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    document.title = "Administrar Productos | Huerto Hogar";

    // 🧩 Verificar si el usuario es admin
    const sesion = localStorage.getItem("usuarioActual");
    let user = null;
    try {
      user = JSON.parse(sesion);
    } catch {
      user = { correo: sesion };
    }

    if (!user || user.rol !== "admin") {
      alert("⚠️ Solo los administradores pueden acceder a esta página.");
      navigate("/unete");
      return;
    }

    // 📦 Cargar los productos desde tu archivo data/productos.js
    const lista = obtenerProductos();
    setProductos(lista);
  }, [navigate]);

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
                <Link to="/admin/boletas" className="nav-link active">
                <i className="fa-solid fa-file-invoice"></i> Boletas
                              </Link>
            </li>
            <Link to="/admin/estadisticas" className="nav-link active">
                  <i className="fa-solid fa-chart-line"></i> Estadísticas
                </Link>
            </ul>
          </nav>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("usuarioActual");
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
          <h1 style={{ color: "#2E8B57" }}>Gestión de Productos</h1>
          <p>Aquí puedes visualizar los productos actualmente disponibles en la tienda.</p>
        </section>

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

          {productos.length === 0 ? (
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
                  <th style={{ padding: "10px" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((p) => (
                  <tr key={p.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "10px" }}>{p.id}</td>
                    <td style={{ padding: "10px" }}>{p.nombre}</td>
                    <td style={{ padding: "10px" }}>{p.categoria || "Sin categoría"}</td>
                    <td style={{ padding: "10px" }}>{p.precio || "—"}</td>
                    <td style={{ padding: "10px" }}>{p.stock || "—"}</td>
                    <td style={{ padding: "10px" }}>
                      <Link
                        to={`/productos/${p.id}`}
                        className="btn btn-outline"
                      >
                        <i className="fa-solid fa-eye"></i> Ver
                      </Link>
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
