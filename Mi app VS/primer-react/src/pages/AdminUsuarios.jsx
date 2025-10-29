import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Usuarios | Huerto Hogar";

    // Verificar si hay sesión de admin
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

    // Simulación: carga inicial de usuarios
    const usuariosGuardados =
      JSON.parse(localStorage.getItem("usuariosRegistrados")) || [];

    // Si no existen, creamos algunos de ejemplo
    if (usuariosGuardados.length === 0) {
      const ejemplo = [
        {
          id: 1,
          nombre: "María González",
          correo: "maria@huertohogar.cl",
          rol: "usuario",
        },
        {
          id: 2,
          nombre: "Pedro López",
          correo: "pedro@huertohogar.cl",
          rol: "usuario",
        },
        {
          id: 3,
          nombre: "Administrador",
          correo: "admin@huertohogar.cl",
          rol: "admin",
        },
      ];
      localStorage.setItem("usuariosRegistrados", JSON.stringify(ejemplo));
      setUsuarios(ejemplo);
    } else {
      setUsuarios(usuariosGuardados);
    }
  }, [navigate]);

  const eliminarUsuario = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    const nuevos = usuarios.filter((u) => u.id !== id);
    setUsuarios(nuevos);
    localStorage.setItem("usuariosRegistrados", JSON.stringify(nuevos));
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
                <Link to="/admin/usuarios" className="nav-link active">
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
          <h1 style={{ color: "#2E8B57" }}>Lista de Usuarios</h1>
          <p>Edita o agrega nuevos usuarios.</p>
        </section>

        <section
          id="usuarios"
          className="catalogo"
          style={{
            background: "#fff",
            borderRadius: "10px",
            padding: "1.5rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <h2 style={{ color: "#2E8B57" }}>Usuarios Registrados</h2>

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
                <th style={{ padding: "10px" }}>Correo</th>
                <th style={{ padding: "10px" }}>Rol</th>
                <th style={{ padding: "10px", textAlign: "right" }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>{u.id}</td>
                  <td style={{ padding: "10px" }}>{u.nombre}</td>
                  <td style={{ padding: "10px" }}>{u.correo}</td>
                  <td style={{ padding: "10px" }}>{u.rol}</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>
                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="btn btn-outline"
                    >
                      <i className="fa-solid fa-trash"></i> Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            className="agregar-usuario-btn"
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
            }}
          >
            <Link to="/admin/usuarios/nuevo" className="btn btn-primary">
              <i className="fa-solid fa-user-plus"></i> Agregar Nuevo Usuario
            </Link>
          </div>
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

export default AdminUsuarios;
