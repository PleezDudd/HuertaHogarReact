import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../css/styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    direccion: "",
    telefono: "",
    rol: "Usuario",
    activo: true,
  });
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Cargar usuarios desde el backend
  useEffect(() => {
    document.title = "Usuarios | Huerto Hogar";
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/usuarios");
      setUsuarios(response.data || []);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar los usuarios. Intenta nuevamente.");
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
      const usuarioData = {
        username: formData.username,
        email: formData.email,
        direccion: formData.direccion,
        telefono: formData.telefono,
        rol: formData.rol,
        activo: formData.activo,
      };

      // Solo incluir password si se está creando un nuevo usuario o si se cambió
      if (!editingUser || formData.password) {
        usuarioData.password = formData.password;
      }

      if (editingUser) {
        // Actualizar usuario existente
        await api.put(`/api/usuarios/${editingUser.id}`, usuarioData);
        alert("Usuario actualizado exitosamente");
      } else {
        // Crear nuevo usuario
        await api.post("/api/usuarios", usuarioData);
        alert("Usuario creado exitosamente");
      }

      // Limpiar formulario y recargar usuarios
      setFormData({
        username: "",
        email: "",
        password: "",
        direccion: "",
        telefono: "",
        rol: "Usuario",
        activo: true,
      });
      setShowForm(false);
      setEditingUser(null);
      cargarUsuarios();
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      const errorMsg = err.response?.data?.message || err.response?.data || "Error al guardar el usuario.";
      alert(typeof errorMsg === "string" ? errorMsg : "Error al guardar el usuario.");
    }
  };

  const handleEdit = (usuario) => {
    setEditingUser(usuario);
    setFormData({
      username: usuario.username || "",
      email: usuario.email || "",
      password: "", // No mostrar password existente
      direccion: usuario.direccion || "",
      telefono: usuario.telefono || "",
      rol: usuario.rol || "Usuario",
      activo: usuario.activo !== undefined ? usuario.activo : true,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }

    try {
      await api.delete(`/api/usuarios/${id}`);
      alert("Usuario eliminado exitosamente");
      cargarUsuarios();
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      alert("Error al eliminar el usuario. Intenta nuevamente.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      password: "",
      direccion: "",
      telefono: "",
      rol: "Usuario",
      activo: true,
    });
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h1 style={{ color: "#2E8B57" }}>Lista de Usuarios</h1>
              <p>Gestiona los usuarios del sistema.</p>
            </div>
            {!showForm && (
              <button
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
                style={{ padding: "0.5rem 1rem" }}
              >
                <i className="fa-solid fa-user-plus"></i> Nuevo Usuario
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
              {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Nombre de Usuario *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Contraseña {!editingUser && "*"}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingUser}
                    placeholder={editingUser ? "Dejar vacío para mantener la actual" : ""}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                  Dirección
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "600" }}>
                    Rol
                  </label>
                  <select
                    name="rol"
                    value={formData.rol}
                    onChange={handleInputChange}
                    style={{ width: "100%", padding: "0.5rem", border: "1px solid #ddd", borderRadius: "4px" }}
                  >
                    <option value="Usuario">Usuario</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                    <input
                      type="checkbox"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleInputChange}
                    />
                    <span>Usuario activo</span>
                  </label>
                </div>
              </div>
              <div style={{ display: "flex", gap: "1rem" }}>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? "Actualizar" : "Crear"} Usuario
                </button>
                <button type="button" className="btn btn-outline" onClick={handleCancel}>
                  Cancelar
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Lista de usuarios */}
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

          {loading ? (
            <p>Cargando usuarios...</p>
          ) : error ? (
            <p style={{ color: "red" }}>{error}</p>
          ) : usuarios.length === 0 ? (
            <p>No hay usuarios registrados.</p>
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
                  <th style={{ padding: "10px" }}>Email</th>
                  <th style={{ padding: "10px" }}>Teléfono</th>
                  <th style={{ padding: "10px" }}>Rol</th>
                  <th style={{ padding: "10px" }}>Estado</th>
                  <th style={{ padding: "10px", textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: "10px" }}>{u.id}</td>
                    <td style={{ padding: "10px" }}>{u.username}</td>
                    <td style={{ padding: "10px" }}>{u.email}</td>
                    <td style={{ padding: "10px" }}>{u.telefono || "—"}</td>
                    <td style={{ padding: "10px" }}>{u.rol}</td>
                    <td style={{ padding: "10px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          background: u.activo ? "#e6f7ea" : "#fee",
                          color: u.activo ? "#1e6b3a" : "#c00",
                        }}
                      >
                        {u.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td style={{ padding: "10px", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <button
                          onClick={() => handleEdit(u)}
                          className="btn btn-outline"
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.9rem" }}
                        >
                          <i className="fa-solid fa-edit"></i> Editar
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="btn btn-outline"
                          style={{ padding: "0.25rem 0.5rem", fontSize: "0.9rem", color: "#c00" }}
                        >
                          <i className="fa-solid fa-trash"></i> Eliminar
                        </button>
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

export default AdminUsuarios;
