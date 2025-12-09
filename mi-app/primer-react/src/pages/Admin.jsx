import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../css/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const Admin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    document.title = "Panel de Administrador | Huerto Hogar";
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/unete");
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
                <Link to="/admin/productos" className="nav-link">
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
              <li>
                <Link to="/admin/estadisticas" className="nav-link">
                  <i className="fa-solid fa-chart-line"></i> Estadísticas
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <button
          onClick={handleLogout}
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

      {/* Main Content */}
      <main
        className="main-content"
        style={{
          flexGrow: 1,
          background: "#f5f5f5",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Hero */}
        <section className="hero">
          <div
            className="hero-inner"
            style={{
              background: "#fff",
              padding: "2rem",
              borderRadius: "10px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <h1 style={{ color: "#2E8B57" }}>Bienvenido al Panel de Administración</h1>
            <p>Gestiona tus productos, usuarios y pedidos de manera eficiente.</p>

            {user && (
              <div
                style={{
                  marginTop: "1rem",
                  padding: "1rem",
                  background: "#e9f6ec",
                  borderRadius: "8px",
                }}
              >
                <strong>Sesión iniciada como:</strong>{" "}
                <span style={{ color: "#2E8B57" }}>
                  {user.email || user.username || user.correo}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
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

export default Admin;
