// src/components/Registro.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Registro() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phone: "",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  // Manejar cambios de input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Validación y registro
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { username, email, password, confirmPassword, address, phone } = form;

    if (!username || !email || !password || !confirmPassword || !address || !phone) {
      setMsg("Por favor, complete todos los campos.");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setMsg("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      // Registrar usuario en el backend
      const nuevoUsuario = {
        username,
        email,
        password,
        direccion: address,
        telefono: phone,
        rol: "Usuario", // Rol por defecto
      };

      const response = await api.post("/api/usuarios", nuevoUsuario);

      if (response.status === 201 || response.status === 200) {
        const usuarioCreado = response.data;
        
        // Guardar información del usuario (sin password)
        const usuarioLogueado = {
          id: usuarioCreado.id,
          username: usuarioCreado.username,
          email: usuarioCreado.email,
          rol: usuarioCreado.rol || "Usuario",
          direccion: usuarioCreado.direccion,
          telefono: usuarioCreado.telefono,
        };
        
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioLogueado));
        localStorage.setItem("sesionActiva", "true");
        
        // Actualizar contexto de autenticación
        setAuthUser(usuarioLogueado);

        setMsg("Registro exitoso. Redirigiendo al perfil...");
        setForm({ username: "", email: "", password: "", confirmPassword: "", address: "", phone: "" });

        setTimeout(() => navigate("/perfil"), 1500);
      }
    } catch (error) {
      console.error("Error en registro:", error);
      const errorMessage = error.response?.data?.message || error.response?.data || "Error al registrar usuario. Intenta nuevamente.";
      setMsg(typeof errorMessage === "string" ? errorMessage : "Error al registrar usuario. El correo puede estar en uso.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registro-wrapper">
      <form onSubmit={handleSubmit}>
        <h2>Registro de Usuario</h2>
        <label>Nombre de Usuario</label>
        <input id="username" value={form.username} onChange={handleChange} required />

        <label>Correo Electrónico</label>
        <input type="email" id="email" value={form.email} onChange={handleChange} required />

        <label>Contraseña</label>
        <input type="password" id="password" value={form.password} onChange={handleChange} required />

        <label>Confirmar Contraseña</label>
        <input type="password" id="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />

        <label>Teléfono</label>
        <input type="tel" id="phone" value={form.phone} onChange={handleChange} required />

        <label>Dirección</label>
        <input id="address" value={form.address} onChange={handleChange} required />

        <button type="submit" disabled={loading}>
          {loading ? "Registrando..." : "Registrar"}
        </button>
        <div style={{ color: msg.includes("exitoso") ? "green" : "red", marginTop: 8 }}>{msg}</div>
      </form>
    </div>
  );
}
