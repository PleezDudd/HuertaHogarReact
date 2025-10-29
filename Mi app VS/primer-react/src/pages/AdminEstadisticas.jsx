import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { obtenerProductos } from "../data/productos";

export const AdminEstadisticas = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalVentas: 0,
    totalBoletas: 0,
    productosDisponibles: 0,
    usuarios: 0,
    productoMasVendido: null,
  });

  useEffect(() => {
    document.title = "Estadísticas | Huerto Hogar";

    // 🔒 Verificar sesión admin
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

    // 📦 Cargar datos
    const boletas = JSON.parse(localStorage.getItem("boletasHistorial")) || [];
    const productos = obtenerProductos();
    const usuarios =
      JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

    // 💰 Calcular total de ventas
    const totalVentas = boletas.reduce((acc, b) => {
      const valor = parseInt(String(b.total).replace(/\D/g, "")) || 0;
      return acc + valor;
    }, 0);

    // 🧾 Contar producto más vendido
    const contador = {};
    boletas.forEach((b) =>
      b.productos.forEach((p) => {
        if (!contador[p.nombre]) contador[p.nombre] = 0;
        contador[p.nombre] += p.cantidad;
      })
    );
    const productoMasVendido =
      Object.keys(contador).length > 0
        ? Object.entries(contador).sort((a, b) => b[1] - a[1])[0][0]
        : "—";

    setStats({
      totalVentas,
      totalBoletas: boletas.length,
      productosDisponibles: productos.length,
      usuarios: usuarios.length,
      productoMasVendido,
    });
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
                <Link to="/admin/boletas" className="nav-link">
                  <i className="fa-solid fa-file-invoice"></i> Boletas
                </Link>
              </li>
              <li>
                <Link to="/admin/estadisticas" className="nav-link active">
                  <i className="fa-solid fa-chart-line"></i> Estadísticas
                </Link>
              </li>
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
          <h1 style={{ color: "#2E8B57" }}>Estadísticas Generales</h1>
          <p>Resumen de la actividad y desempeño del sitio.</p>
        </section>

        {/* Cards de resumen */}
        <section
          className="estadisticas"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <i className="fa-solid fa-coins" style={{ color: "#2E8B57", fontSize: "2rem" }}></i>
            <h3>Total Ventas</h3>
            <p style={{ fontSize: "1.5rem", color: "#2E8B57", fontWeight: "bold" }}>
              ${stats.totalVentas.toLocaleString("es-CL")}
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <i className="fa-solid fa-file-invoice" style={{ color: "#2E8B57", fontSize: "2rem" }}></i>
            <h3>Total Boletas</h3>
            <p style={{ fontSize: "1.5rem", color: "#2E8B57", fontWeight: "bold" }}>
              {stats.totalBoletas}
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <i className="fa-solid fa-seedling" style={{ color: "#2E8B57", fontSize: "2rem" }}></i>
            <h3>Productos Disponibles</h3>
            <p style={{ fontSize: "1.5rem", color: "#2E8B57", fontWeight: "bold" }}>
              {stats.productosDisponibles}
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <i className="fa-solid fa-users" style={{ color: "#2E8B57", fontSize: "2rem" }}></i>
            <h3>Usuarios Registrados</h3>
            <p style={{ fontSize: "1.5rem", color: "#2E8B57", fontWeight: "bold" }}>
              {stats.usuarios}
            </p>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "10px",
              padding: "1.5rem",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            <i className="fa-solid fa-star" style={{ color: "#2E8B57", fontSize: "2rem" }}></i>
            <h3>Producto más vendido</h3>
            <p style={{ fontSize: "1.2rem", color: "#2E8B57", fontWeight: "bold" }}>
              {stats.productoMasVendido}
            </p>
          </div>
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

export default AdminEstadisticas;
