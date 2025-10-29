import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/styles.css";

const fmtCLP = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const BoletaFinal = () => {
  const [boleta, setBoleta] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate(); // ✅ ahora está correctamente definido

  useEffect(() => {
    document.title = "Boleta Final | HuertoHogar";

    // 🧾 Cargar datos de la boleta
    const data = JSON.parse(localStorage.getItem("boletaFinal"));
    if (!data) {
      alert("No hay boleta disponible. Genera una nueva compra.");
      navigate("/productos");
      return;
    }
    setBoleta(data);

    // 🗂️ Asegurar persistencia en historial para vista admin (evitar duplicados)
    try {
      const raw = localStorage.getItem("boletasHistorial");
      const historial = raw ? JSON.parse(raw) : [];
      const esArray = Array.isArray(historial) ? historial : [];

      const yaExiste = esArray.some((b) =>
        b && b.fecha === data.fecha && b.total === data.total && b.usuario === data.usuario
      );

      if (!yaExiste) {
        const nuevo = [...esArray, data];
        localStorage.setItem("boletasHistorial", JSON.stringify(nuevo));
      }
    } catch {
      localStorage.setItem("boletasHistorial", JSON.stringify([data]));
    }

    // 👤 Cargar datos del usuario actual
    const sesion = localStorage.getItem("usuarioActual");
    let usuarioData = null;
    try {
      usuarioData = JSON.parse(sesion);
    } catch {
      usuarioData = { correo: sesion };
    }
    setUsuario(usuarioData);
  }, [navigate]);

  if (!boleta) return null; // previene errores antes de que cargue

  const { direccion, comuna, region, indicacion, productos, total, fecha } =
    boleta;
  const totalDisplay = typeof total === "string" ? total : fmtCLP(total);

  return (
    <main className="container main-content" style={{ maxWidth: "850px" }}>
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        {/* Encabezado */}
        <header
          style={{
            borderBottom: "1px solid #ddd",
            marginBottom: "1.5rem",
            paddingBottom: ".5rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ color: "#2E8B57", margin: 0 }}>Boleta de compra</h2>
            <p style={{ color: "#555", marginTop: "5px" }}>
              Fecha: {fecha || new Date().toLocaleString("es-CL")}
            </p>
          </div>
          <div style={{ textAlign: "right", color: "#777" }}>
            <p style={{ margin: 0 }}>Huerto Hogar</p>
            <p style={{ margin: 0 }}>San Joaquín, Santiago</p>
          </div>
        </header>

        {/* Datos del comprador */}
        <section
          style={{
            background: "#f9fafb",
            borderRadius: "8px",
            padding: "1rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ color: "#2E8B57", marginBottom: ".5rem" }}>
            Datos del comprador
          </h3>

          {usuario && (
            <>
              {usuario.nombre && (
                <p>
                  <strong>Nombre:</strong> {usuario.nombre}
                </p>
              )}
              <p>
                <strong>Correo:</strong>{" "}
                {usuario.correo || "No se encontró el correo del usuario"}
              </p>
            </>
          )}

          <p>
            <strong>Dirección:</strong> {direccion}
          </p>
          <p>
            <strong>Comuna:</strong> {comuna}
          </p>
          <p>
            <strong>Región:</strong> {region}
          </p>
          {indicacion && (
            <p>
              <strong>Indicaciones:</strong> {indicacion}
            </p>
          )}
        </section>

        {/* Productos */}
        <section>
          <h3 style={{ color: "#2E8B57", marginBottom: ".8rem" }}>
            Resumen de productos
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginBottom: "1rem",
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
                <th style={{ padding: "10px" }}>Producto</th>
                <th style={{ padding: "10px" }}>Cantidad</th>
                <th style={{ padding: "10px", textAlign: "right" }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={{ padding: "10px" }}>{p.nombre}</td>
                  <td style={{ padding: "10px" }}>{p.cantidad}</td>
                  <td style={{ padding: "10px", textAlign: "right" }}>
                    {fmtCLP(p.subtotal)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Total */}
        <div
          style={{
            textAlign: "right",
            fontSize: "1.2rem",
            color: "#2E8B57",
            fontWeight: "600",
            borderTop: "1px solid #ddd",
            paddingTop: ".8rem",
          }}
        >
          Total pagado: {totalDisplay}
        </div>

        {/* Botones */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "1.5rem",
            gap: "1rem",
          }}
        >
          <Link to="/productos" className="btn btn-secondary">
            Volver al catálogo
          </Link>
          <button className="btn btn-primary" onClick={() => window.print()}>
            Imprimir boleta
          </button>
        </div>
      </div>
    </main>
  );
};

export default BoletaFinal;
