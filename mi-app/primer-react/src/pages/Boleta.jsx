import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../css/styles.css";

const fmtCLP = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const Boleta = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Cargar items del carrito desde el backend
  useEffect(() => {
    document.title = "Boleta | HuertoHogar";
    
    const cargarCarrito = async () => {
      if (!user || !user.id) {
        setLoading(false);
        setError("Debes iniciar sesión para ver tu carrito.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/carrito/usuario/${user.id}/items`);
        
        // Normalizar items del backend
        const itemsNormalizados = (response.data || []).map((item) => ({
          id: item.id,
          itemId: item.id,
          productoId: item.producto?.id,
          nombre: item.producto?.nombre || "Producto sin nombre",
          precio: item.producto?.precio ? parseFloat(item.producto.precio) : 0,
          cantidad: item.cantidad || 1,
          imagen: item.producto?.imagen || "/img/default.png",
        }));
        
        setItems(itemsNormalizados);
      } catch (err) {
        console.error("Error al cargar carrito:", err);
        // Si el carrito no existe (404), simplemente dejarlo vacío
        if (err.response?.status === 404) {
          setItems([]);
        } else {
          setError("Error al cargar el carrito. Intenta nuevamente.");
        }
      } finally {
        setLoading(false);
      }
    };

    cargarCarrito();
  }, [user]);

  const total = useMemo(
    () =>
      items.reduce(
        (acc, it) => acc + (it.precio || 0) * (it.cantidad || 1),
        0
      ),
    [items]
  );

  // Validar y procesar compra
  const handleFinalizarCompra = async (e) => {
    e.preventDefault();

    if (!user || !user.id) {
      alert("⚠️ Debes iniciar sesión para finalizar la compra.");
      navigate("/unete");
      return;
    }

    if (!direccion || !region || !comuna) {
      alert("⚠️ Debes completar la dirección, región y comuna antes de continuar.");
      return;
    }

    if (items.length === 0) {
      alert("⚠️ No hay productos en el carrito.");
      return;
    }

    try {
      // Crear la orden en el backend
      const ordenData = {
        usuarioId: user.id,
        direccion: direccion.trim(),
        region: region.trim(),
        comuna: comuna.trim(),
        indicacion: indicacion ? indicacion.trim() : null,
      };

      console.log("Creando orden con datos:", ordenData);

      let ordenCreada = null;
      try {
        const response = await api.post("/api/ordenes", ordenData);
        if (response.data && response.data.success) {
          ordenCreada = response.data.orden;
          console.log("Orden creada exitosamente:", ordenCreada);
        } else {
          throw new Error(response.data?.error || "Error al crear la orden");
        }
      } catch (err) {
        console.error("Error al crear orden:", err);
        const errorMessage = err.response?.data?.error || err.message || "Error al crear la orden";
        alert(`⚠️ Error al procesar la compra: ${errorMessage}`);
        return;
      }

      // Armar la boleta completa con los datos de la orden creada
      const datos = {
        ordenId: ordenCreada?.id,
        usuario: user.email || user.username || "Sin correo registrado",
        usuarioId: user.id,
        direccion,
        region,
        comuna,
        indicacion,
        total: total,
        totalFormateado: fmtCLP(total),
        fecha: ordenCreada?.fechaCreacion 
          ? new Date(ordenCreada.fechaCreacion).toLocaleString("es-CL")
          : new Date().toLocaleString("es-CL"),
        productos: items.map((i) => ({
          id: i.productoId,
          nombre: i.nombre,
          cantidad: i.cantidad || 1,
          precio: i.precio || 0,
          subtotal: (i.precio || 0) * (i.cantidad || 1),
        })),
      };

      // Guardar la boleta para mostrarla en la página final
      localStorage.setItem("boletaFinal", JSON.stringify(datos));

      // Redirigir a la boleta final
      navigate("/boleta-final");
    } catch (err) {
      console.error("Error al finalizar compra:", err);
      alert("Error al procesar la compra. Intenta nuevamente.");
    }
  };

  if (loading) {
    return (
      <main className="container main-content">
        <h2>Boleta de compra</h2>
        <p>Cargando carrito...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container main-content">
        <h2>Boleta de compra</h2>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/productos" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </main>
    );
  }

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

      {/* Datos del cliente */}
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
              required
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
              required
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
              required
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

      {/* Tabla de productos */}
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
            {items.map((it) => (
              <tr key={it.itemId} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "10px" }}>{it.nombre}</td>
                <td style={{ padding: "10px" }}>{it.cantidad || 1}</td>
                <td style={{ padding: "10px" }}>{fmtCLP(it.precio)}</td>
                <td style={{ padding: "10px", textAlign: "right" }}>
                  {fmtCLP((it.precio || 0) * (it.cantidad || 1))}
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
