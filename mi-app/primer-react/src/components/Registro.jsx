// src/components/Registro.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  // Leer usuarios
  const [usuarios, setUsuarios] = useState(() => {
    return JSON.parse(localStorage.getItem("usuarios")) || [];
  });

  // Manejar cambios de input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  // Validación y registro
  const handleSubmit = (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, address, phone } = form;

    if (!username || !email || !password || !confirmPassword || !address || !phone) {
      setMsg("Por favor, complete todos los campos.");
      return;
    }
    if (password !== confirmPassword) {
      setMsg("Las contraseñas no coinciden.");
      return;
    }
    if (usuarios.some((u) => u.email === email)) {
      setMsg("El correo ya está registrado.");
      return;
    }

    const id = usuarios.length > 0 ? usuarios[usuarios.length - 1].id + 1 : 1;
    const nuevoUsuario = { id, usuario: username, email, password, address, phone, rol: "Usuario" };
    const nuevosUsuarios = [...usuarios, nuevoUsuario];
    setUsuarios(nuevosUsuarios);
    localStorage.setItem("usuarios", JSON.stringify(nuevosUsuarios));

    // Guardar sesión
    const usuarioLogueado = {
      id,
      usuario: username,
      email,
      rol: "Usuario",
      address,
      phone,
    };
    localStorage.setItem("usuarioActual", JSON.stringify(usuarioLogueado));
    localStorage.setItem("sesionActiva", "true");

    setMsg("Registro exitoso. Redirigiendo al perfil...");
    setForm({ username: "", email: "", password: "", confirmPassword: "", address: "", phone: "" });

    setTimeout(() => navigate("/perfil"), 1500);
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

        <button type="submit">Registrar</button>
        <div style={{ color: msg.includes("exitoso") ? "green" : "red", marginTop: 8 }}>{msg}</div>
      </form>
    </div>
  );
}
