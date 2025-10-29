import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const AdminBoletas = () => {
  const [boletas, setBoletas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Boletas Generadas | Huerto Hogar";

    // 🔒 Verificar sesión de administrador
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

    // 📦 Obtener boletas del historial
    const historial = JSON.parse(localStorage.getItem("boletasHistorial")) || [];
    setBoletas(historial);
  }, [navigate]);

  const handleEliminarHistorial = () => {
    if (window.confirm("¿Seguro que deseas eliminar todas las boletas del historial?")) {
      localStorage.removeItem("boletasHistorial");
      setBoletas([]);
    }
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

      {/* Main Content */}
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
          <h1 style={{ color: "#2E8B57" }}>Boletas Generadas</h1>
          <p>Aquí puedes revisar el historial completo de compras realizadas por los usuarios.</p>
        </section>

        <section
          id="boletas"
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "1.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          {boletas.length === 0 ? (
            <p>No hay boletas registradas en el sistema.</p>
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
                  <th style={{ padding: "10px" }}>Fecha</th>
                  <th style={{ padding: "10px" }}>Correo</th>
                  <th style={{ padding: "10px" }}>Dirección</th>
                  <th style={{ padding: "10px" }}>Comuna</th>
                  <th style={{ padding: "10px" }}>Total</th>
                  <th style={{ padding: "10px" }}>Productos</th>
                </tr>
              </thead>
              <tbody>
                {boletas.map((b, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "10px" }}>{b.fecha}</td>
                    <td style={{ padding: "10px" }}>{b.usuario}</td>
                    <td style={{ padding: "10px" }}>{b.direccion}</td>
                    <td style={{ padding: "10px" }}>{b.comuna}</td>
                    <td style={{ padding: "10px" }}>{b.total}</td>
                    <td style={{ padding: "10px" }}>
                      <details>
                        <summary>Ver detalles</summary>
                        <ul style={{ margin: "8px 0 0 0", paddingLeft: "18px" }}>
                          {b.productos.map((p, i) => (
                            <li key={i}>
                              {p.nombre} × {p.cantidad} — ${p.subtotal.toLocaleString("es-CL")}
                            </li>
                          ))}
                        </ul>
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {boletas.length > 0 && (
            <div style={{ textAlign: "right", marginTop: "1rem" }}>
              <button onClick={handleEliminarHistorial} className="btn btn-outline">
                <i className="fa-solid fa-trash"></i> Limpiar Historial
              </button>
            </div>
          )}
        </section>

        <footer
          style={{
            marginTop: "2rem",
            textAlign: "center",
            color: "#555",
            fontSize: ".9rem",
          }}
        >
          © 2025 Huerto Hogar. Todos los derechos reservados.
        </footer>
      </main>
    </div>
  );
};

export default AdminBoletas;
