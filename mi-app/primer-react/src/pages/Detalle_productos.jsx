import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../css/styles.css";

export const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const productoState = location.state?.producto;
  const [producto, setProducto] = useState(productoState);
  const [cantidad, setCantidad] = useState(1);
  const [imagenPrincipal, setImagenPrincipal] = useState("");
  const [loading, setLoading] = useState(!productoState);
  const [error, setError] = useState(null);

  // Cargar producto desde el backend si no viene en el state
  useEffect(() => {
    const cargarProducto = async () => {
      if (productoState) {
        setProducto(productoState);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/productos/${id}`);
        
        // Normalizar producto del backend
        const productoNormalizado = {
          id: response.data.id,
          nombre: response.data.nombre,
          descripcion: response.data.descripcion || "",
          precio: response.data.precio ? parseFloat(response.data.precio) : 0,
          categoria: response.data.categoria || "",
          imagen: response.data.imagen || "/img/default.png",
          imagenes: response.data.imagen ? [response.data.imagen] : [],
          stock: response.data.stock || 0,
        };
        
        setProducto(productoNormalizado);
      } catch (err) {
        console.error("Error al cargar producto:", err);
        setError("Error al cargar el producto. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    cargarProducto();
  }, [id, productoState]);

  // Normalización de precios
  const parsePrecio = (p) => {
    if (typeof p === "number") return Math.round(p);
    if (!p) return 0;
    let s = String(p);

    // tomar solo lo que va antes de "CLP"
    const idx = s.toUpperCase().indexOf("CLP");
    if (idx !== -1) s = s.slice(0, idx);

    // capturar el primer monto (ej: 1.200, 700, 12.345.678, con o sin decimales)
    const m = s.match(/(\d{1,3}(?:\.\d{3})+|\d+)(?:[.,]\d+)?/);
    if (!m) return 0;

    // quitar separadores de miles y descartar decimales
    const entero = m[1].replace(/\./g, "");
    return parseInt(entero, 10) || 0;
  };
  const formatCLP = (n) =>
    `${Number(Math.round(n || 0)).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })} CLP`;

  const descuentoKeywords = [
    "manzana",
    "manzanas",
    "fuji",
    "plátano",
    "platano",
    "plátanos",
    "cavendish",
    "espinaca",
    "espinacas",
  ];

  const nombreProducto = String(
    producto?.nombre || producto?.nombreProducto || producto?.title || ""
  ).toLowerCase();

  const esConDescuento =
    producto &&
    descuentoKeywords.some((kw) => nombreProducto.includes(kw));

  // El precio del backend viene como número
  const precioNumero = typeof producto?.precio === "number" 
    ? producto.precio 
    : parsePrecio(producto?.precio || producto?.price || producto?.valor || producto?.precio_unitario || "");
  const descuentoPct = esConDescuento ? 15 : 0;
  const precioOferta =
    descuentoPct && precioNumero > 0
      ? Math.round(precioNumero * (1 - descuentoPct / 100))
      : null;

  // Fallbacks de imagen
  function getFallbackImage(nombre = "") {
    const n = nombre.toLowerCase();
    if (n.includes("plátano") || n.includes("platano")) return "/img/Platanos.png";
    if (n.includes("manzana")) return "/img/Manzanas.png";
    if (n.includes("espinaca")) return "/img/Espinacas.png";
    return "/img/Platanos.png";
  }

  useEffect(() => {
    if (!producto) return;
    if (producto.imagenes?.length > 0) {
      setImagenPrincipal(producto.imagenes[0]);
    } else if (producto.imagen && producto.imagen.trim() !== "") {
      setImagenPrincipal(producto.imagen);
    } else {
      setImagenPrincipal(getFallbackImage(producto.nombre));
    }
  }, [producto]);

  const handleCambiarImagen = (imagen) => setImagenPrincipal(imagen);

  const handleAgregarAlCarrito = async () => {
    if (!producto || !user || !user.id) {
      alert("Debes iniciar sesión para agregar productos al carrito.");
      navigate("/unete");
      return;
    }

    try {
      await api.post(`/api/carrito/usuario/${user.id}/agregar`, {
        productoId: producto.id,
        cantidad: cantidad,
      });

      alert(`${cantidad} ${producto.nombre}(s) agregado(s) al carrito ✅`);
      
      // Opcional: redirigir al carrito o recargar la página del carrito
      // navigate("/carrito");
    } catch (err) {
      console.error("Error al agregar al carrito:", err);
      const errorMsg = err.response?.data?.error || err.response?.data?.message || "Error al agregar el producto al carrito.";
      alert(errorMsg);
    }
  };

  const handleCambiarCantidad = (e) => setCantidad(Number(e.target.value));

  if (loading) {
    return (
      <main>
        <div className="container">
          <h2>Cargando producto...</h2>
        </div>
      </main>
    );
  }

  if (error || !producto) {
    return (
      <main>
        <div className="container">
          <h2>{error || "Producto no encontrado"}</h2>
          <button className="btn btn-primary" onClick={() => navigate("/productos")}>
            Volver a productos
          </button>
        </div>
      </main>
    );
  }

  const priceStyles = {
    base: { color: "#2E8B57", fontWeight: 700, fontSize: "1.5em" },
    old: { textDecoration: "line-through", color: "#9aa79b", fontSize: "0.9em" },
    row: { display: "flex", alignItems: "center", gap: 8 },
    badge: {
      background: "#e6f7ea",
      color: "#1e6b3a",
      padding: "4px 8px",
      borderRadius: 12,
      fontWeight: 700,
      fontSize: "0.9em",
      border: "1px solid rgba(30,107,58,0.08)",
    },
  };

  return (
    <main>
      <div className="container">
        <div
          className="grid-productos"
          style={{ gridTemplateColumns: "2fr 1fr", gap: "32px", alignItems: "flex-start" }}
        >
          <div>
            {imagenPrincipal && imagenPrincipal.trim() !== "" ? (
              <img
                id="main-img"
                src={imagenPrincipal}
                alt={producto.nombre}
                className="img-main"
                style={{ width: "100%", maxWidth: "550px", borderRadius: "8px" }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  maxWidth: "550px",
                  height: "350px",
                  borderRadius: "8px",
                  backgroundColor: "#f5f5f5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#777",
                  fontStyle: "italic",
                }}
              >
                Sin imagen disponible
              </div>
            )}

            {producto.imagenes?.length > 1 && (
              <div id="miniaturas" style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
                {producto.imagenes.slice(1).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${producto.nombre} ${index + 2}`}
                    onClick={() => handleCambiarImagen(img)}
                    className="img-thumb"
                    style={{
                      border: imagenPrincipal === img ? "2px solid #2E8B57" : "2px solid transparent",
                      cursor: "pointer",
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="producto" style={{ padding: "32px" }}>
            <h2 id="nombre-producto" style={{ marginBottom: "0.5rem" }}>
              {producto.nombre}
            </h2>

            <span id="precio-producto" style={{ display: "block", marginBottom: "0.5rem" }}>
              {descuentoPct && precioOferta !== null ? (
                <span style={priceStyles.row}>
                  <span style={priceStyles.old}>{formatCLP(precioNumero)}</span>
                  <span style={priceStyles.base}>{formatCLP(precioOferta)}</span>
                  <span style={priceStyles.badge}>-{descuentoPct}%</span>
                </span>
              ) : (
                <span style={priceStyles.base}>{formatCLP(precioNumero)}</span>
              )}
            </span>

            <div id="desc-producto" className="desc" style={{ marginBottom: "1.5rem" }}>
              {producto.descripcion}
            </div>
            <p style={{ marginBottom: "1rem", color: "#555" }}>{producto.stock}</p>
            <hr style={{ margin: "18px 0" }} />
            <form style={{ marginBottom: "1.5rem" }}>
              <label htmlFor="cantidad" style={{ fontWeight: "600" }}>
                Cantidad
              </label>
              <input
                type="number"
                id="cantidad"
                min="1"
                value={cantidad}
                onChange={handleCambiarCantidad}
                style={{ marginLeft: "12px", width: "60px", padding: "6px" }}
              />
            </form>
            <button
              className="btn btn-primary"
              id="agregar-carrito"
              onClick={handleAgregarAlCarrito}
              style={{ width: "100%", fontSize: "1.1em" }}
            >
              Añadir al carrito
            </button>
          </div>
        </div>

      </div>
    </main>
  );
};

export default DetalleProducto;
// ...existing code...