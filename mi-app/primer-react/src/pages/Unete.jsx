import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export const Unete = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    if (!form.email || !form.password) {
      setMensaje("⚠️ Ingresa tu correo y contraseña.");
      setLoading(false);
      return;
    }

    try {
      // 🔐 Llamar al backend para autenticación con JWT
      const result = await login(form.email, form.password);

      if (result.success) {
        // Actualizar el contexto de autenticación
        setAuthUser(result.usuario);

        // 🚀 Redirigir según el rol
        const userRole = result.usuario?.rol || result.usuario?.role;
        if (userRole === "Admin" || userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/perfil");
        }
      } else {
        setMensaje(result.message || "❌ Credenciales incorrectas.");
      }
    } catch (error) {
      console.error("Error en login:", error);
      setMensaje("❌ Error al conectar con el servidor. Intenta nuevamente.");
    } finally {
      setLoading(false);
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

        <button 
          type="submit" 
          className="btn btn-primary w-100 mb-2"
          disabled={loading}
        >
          {loading ? "Iniciando sesión..." : "Iniciar sesión"}
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
