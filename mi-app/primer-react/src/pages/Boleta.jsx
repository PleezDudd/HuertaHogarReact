import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/styles.css";

const fmtCLP = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const Boleta = () => {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const [direccion, setDireccion] = useState("");
  const [region, setRegion] = useState("");
  const [comuna, setComuna] = useState("");
  const [indicacion, setIndicacion] = useState("");

  const regiones = {
    "Región Metropolitana": [
      "San Joaquín",
      "Santiago Centro",
      "Ñuñoa",
      "La Florida",
      "Puente Alto",
    ],
    "Región de Valparaíso": ["Valparaíso", "Viña del Mar", "Quilpué", "Quillota"],
    "Región del Biobío": ["Concepción", "Los Ángeles", "Talcahuano"],
  };

  useEffect(() => {
    document.title = "Boleta | HuertoHogar";
    const raw = localStorage.getItem("carrito");
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      setItems(Array.isArray(parsed) ? parsed : []);
    } catch {
      setItems([]);
    }
  }, []);

  const total = useMemo(
    () =>
      items.reduce(
        (acc, it) =>
          acc + (it.precio ?? it.price ?? 0) * (it.cantidad ?? it.qty ?? 1),
        0
      ),
    [items]
  );

  // ✅ Validar y procesar compra
  const handleFinalizarCompra = (e) => {
    e.preventDefault();

    if (!direccion || !region || !comuna) {
      alert("⚠️ Debes completar la dirección, región y comuna antes de continuar.");
      return;
    }

    // 📦 Obtener datos del usuario actual (por si hay sesión)
    const stored = localStorage.getItem("usuarioActual");
    let usuario = null;
    try {
      usuario = JSON.parse(stored);
    } catch {
      usuario = { correo: stored }; // soporte si el correo está guardado como texto
    }

    // 🧾 Armar la boleta completa
    const datos = {
      usuario: usuario ? usuario.correo || "Sin correo registrado" : "Invitado",
      direccion,
      region,
      comuna,
      indicacion,
      total: fmtCLP(total),
      fecha: new Date().toLocaleString("es-CL"),
      productos: items.map((i) => ({
        nombre: i.nombre,
        cantidad: i.cantidad ?? i.qty,
        subtotal:
          (i.precio ?? i.price ?? 0) * (i.cantidad ?? i.qty ?? 1),
      })),
    };

    // 🧠 Guardar la boleta para mostrarla en la página final
    localStorage.setItem("boletaFinal", JSON.stringify(datos));

    // 🧹 Limpiar el carrito
    localStorage.removeItem("carrito");

    // ✅ Redirigir a la boleta final
    navigate("/boleta-final");
  };

  if (!items.length) {
    return (
      <main className="container main-content">
        <h2>Boleta de compra</h2>
        <p>No hay productos para generar la boleta.</p>
        <Link to="/productos" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="container main-content">
      <h2 style={{ marginBottom: "1rem" }}>Boleta de compra</h2>

      {/* 🧍 Datos del cliente */}
      <section
        style={{
          background: "#f5f5f5",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      >
        <h3 style={{ color: "#2E8B57", marginBottom: "1rem" }}>
          Datos de despacho
        </h3>

        <form
          onSubmit={handleFinalizarCompra}
          style={{
            display: "grid",
            gap: "1rem",
            maxWidth: "600px",
          }}
        >
          <div>
            <label htmlFor="direccion">Dirección *</label>
            <input
              id="direccion"
              type="text"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ej: Av. Vicuña Mackenna 1234"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div>
            <label htmlFor="region">Región *</label>
            <select
              id="region"
              value={region}
              onChange={(e) => {
                setRegion(e.target.value);
                setComuna("");
              }}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Selecciona una región</option>
              {Object.keys(regiones).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="comuna">Comuna *</label>
            <select
              id="comuna"
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              disabled={!region}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">
                {region ? "Selecciona una comuna" : "Primero elige una región"}
              </option>
              {region &&
                regiones[region].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="indicacion">Indicaciones extra (opcional)</label>
            <textarea
              id="indicacion"
              rows="3"
              value={indicacion}
              onChange={(e) => setIndicacion(e.target.value)}
              placeholder="Ej: Dejar el pedido en conserjería"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Finalizar compra
          </button>
        </form>
      </section>

      {/* 🧾 Tabla de productos */}
      <section
        style={{
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          overflow: "hidden",
          marginBottom: "2rem",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
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
              <th style={{ padding: "12px" }}>Producto</th>
              <th style={{ padding: "12px" }}>Cantidad</th>
              <th style={{ padding: "12px" }}>Precio Unitario</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{it.nombre}</td>
                <td style={{ padding: "10px" }}>{it.cantidad ?? it.qty ?? 1}</td>
                <td style={{ padding: "10px" }}>{fmtCLP(it.precio)}</td>
                <td style={{ padding: "10px", textAlign: "right" }}>
                  {fmtCLP(
                    (it.precio ?? it.price ?? 0) *
                      (it.cantidad ?? it.qty ?? 1)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Totales + Volver */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong style={{ color: "#2E8B57" }}>
          Total a pagar: {fmtCLP(total)}
        </strong>
        <Link to="/carrito" className="btn btn-secondary">
          Volver al carrito
        </Link>
      </div>
    </main>
  );
};

export default Boleta;
