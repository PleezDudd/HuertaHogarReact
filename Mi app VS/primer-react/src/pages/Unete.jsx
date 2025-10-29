import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Unete = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setMensaje("⚠️ Ingresa tu correo y contraseña.");
      return;
    }

    // 🔐 Usuarios definidos
    const admin = { email: "admin@huertohogar.cl", password: "admin123", rol: "admin" };
    const usuario = { email: "usuario@huertohogar.cl", password: "usuario123", rol: "usuario" };

    let sesion = null;

    if (form.email === admin.email && form.password === admin.password) {
      sesion = admin;
    } else if (form.email === usuario.email && form.password === usuario.password) {
      sesion = usuario;
    } else {
      setMensaje("❌ Credenciales incorrectas.");
      return;
    }

    // 💾 Guardar la sesión actual
    localStorage.setItem("sesionActiva", "true");
    localStorage.setItem("usuarioActual", JSON.stringify(sesion));

    // 🚀 Redirigir según el rol
    if (sesion.rol === "admin") {
      navigate("/admin");
    } else {
      navigate("/perfil");
    }
  };

  return (
    <div id="registro-wrapper">
      <form id="loginForm" onSubmit={onSubmit}>
        <h2 className="mb-4 text-center">Iniciar Sesión</h2>

        <div className="mb-3">
          <label htmlFor="loginEmail" className="form-label">
            Correo Electrónico
          </label>
          <input
            type="email"
            className="form-control"
            id="loginEmail"
            name="email"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="loginPassword" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            className="form-control"
            id="loginPassword"
            name="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100 mb-2">
          Iniciar sesión
        </button>

        <div id="loginMensaje" className="mt-2 text-center" style={{ color: "red" }}>
          {mensaje}
        </div>

        <Link to="/registro" className="btn btn-outline w-100 mt-3">
          Si no tienes una cuenta, ¡Regístrate!
        </Link>
      </form>
    </div>
  );
};

export default Unete;
