// ...existing code...
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { obtenerProductoPorId, obtenerProductos } from "../data/productos";
import "../css/styles.css";

export const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const productoState = location.state?.producto;
  const [cantidad, setCantidad] = useState(1);
  const [imagenPrincipal, setImagenPrincipal] = useState("");

  const producto =
    obtenerProductoPorId(id) ||
    obtenerProductos().find(
      (p) => String(p.id).toLowerCase() === String(id).toLowerCase()
    ) ||
    productoState;

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

  const rawPrecio =
    producto?.precio ??
    producto?.price ??
    producto?.valor ??
    producto?.precio_unitario ??
    "";

  const precioNumero = parsePrecio(rawPrecio);
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

  const handleAgregarAlCarrito = () => {
    if (!producto) return;
    const precioNumerico = parseInt(String(rawPrecio).replace(/\D/g, ""), 10) || 0;
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const existente = carrito.find((p) => p.id === producto.id);
    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: precioNumerico,
        cantidad,
        img:
          producto.imagenPrincipal ||
          producto.imagen ||
          (producto.imagenes && producto.imagenes.length ? producto.imagenes[0] : ""),
      });
    }
    localStorage.setItem("carrito", JSON.stringify(carrito));
    window.dispatchEvent(new Event("carritoActualizado"));
    alert(`${cantidad} ${producto.nombre}(s) agregado(s) al carrito ✅`);
  };

  const handleCambiarCantidad = (e) => setCantidad(Number(e.target.value));

  const productosRelacionados = obtenerProductos()
    .filter((prod) => String(prod.id) !== String(id))
    .slice(0, 4);

  if (!producto) {
    return (
      <main>
        <div className="container">
          <h2>Producto no encontrado</h2>
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

        <div style={{ marginTop: "40px" }}>
          <h3 style={{ marginBottom: "18px" }}>Productos relacionados</h3>
          <div id="relacionados" className="grid-productos" style={{ gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
            {productosRelacionados.map((prod) => {
              const nombreRel = String(prod?.nombre || prod?.title || "").toLowerCase();
              const relConDescuento = descuentoKeywords.some((kw) => nombreRel.includes(kw));
              const rawRelPrecio = prod?.precio ?? prod?.price ?? prod?.valor ?? "";
              const relPrecioNum = parsePrecio(rawRelPrecio);
              const relPrecioOferta =
                relConDescuento && relPrecioNum > 0 ? Math.round(relPrecioNum * 0.85) : null;

              return (
                <article
                  key={prod.id}
                  className="producto"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/productos/${prod.id}`, { state: { producto: prod } })}
                >
                  <h4 style={{ fontSize: 14, marginBottom: 8 }}>{prod.nombre}</h4>
                  {(prod.imagen && prod.imagen.trim() !== "") || getFallbackImage ? (
                    <img
                      src={prod.imagen && prod.imagen.trim() !== "" ? prod.imagen : getFallbackImage(prod.nombre)}
                      alt={prod.nombre}
                      style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: 6 }}
                    />
                  ) : null}

                  <div style={{ marginTop: 8 }}>
                    {relConDescuento && relPrecioOferta !== null ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ textDecoration: "line-through", color: "#9aa79b", fontSize: 13 }}>
                          {formatCLP(relPrecioNum)}
                        </span>
                        <span style={{ color: "#2E8B57", fontWeight: 700 }}>
                          {formatCLP(relPrecioOferta)}
                        </span>
                        <span style={{ background: "#e6f7ea", color: "#1e6b3a", padding: "4px 6px", borderRadius: 10, fontWeight: 700, fontSize: 12 }}>
                          -15%
                        </span>
                      </div>
                    ) : (
                      <p className="precio" style={{ color: "#2E8B57", fontWeight: 700 }}>{formatCLP(relPrecioNum)}</p>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetalleProducto;
// ...existing code...