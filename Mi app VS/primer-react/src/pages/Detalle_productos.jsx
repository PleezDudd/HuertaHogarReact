import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { obtenerProductoPorId, obtenerProductos } from "../data/productos";
import "../css/styles.css";

export const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cantidad, setCantidad] = useState(1);
  const [imagenPrincipal, setImagenPrincipal] = useState("");

  const producto = obtenerProductoPorId(id);

  useEffect(() => {
    if (producto && producto.imagenes && producto.imagenes.length > 0) {
      setImagenPrincipal(producto.imagenes[0]);
    }
  }, [producto]);

  const handleCambiarImagen = (imagen) => {
    setImagenPrincipal(imagen);
  };

  const handleAgregarAlCarrito = () => {
    if (!producto) return;

    // Convertir precio a número (quita símbolos o texto)
    const precioNumerico =
      parseInt(String(producto.precio).replace(/\D/g, ""), 10) || 0;

    // Leer carrito actual
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Buscar si ya existe el producto
    const existente = carrito.find((p) => p.id === producto.id);

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: precioNumerico, // siempre numérico
        cantidad,
        img:
          producto.imagenPrincipal ||
          producto.imagen ||
          (producto.imagenes && producto.imagenes.length
            ? producto.imagenes[0]
            : ""),
      });
    }

    // Guardar carrito actualizado
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Emitir evento personalizado (para actualizar contador y vista)
    window.dispatchEvent(new Event("carritoActualizado"));

    // Confirmar al usuario
    alert(`${cantidad} ${producto.nombre}(s) agregado(s) al carrito ✅`);
  };

  const handleCambiarCantidad = (e) => {
    setCantidad(Number(e.target.value));
  };

  // Productos relacionados (todos los productos excepto el actual)
  const productosRelacionados = obtenerProductos()
    .filter((prod) => prod.id !== id)
    .slice(0, 4);

  if (!producto) {
    return (
      <main>
        <div className="container">
          <h2>Producto no encontrado</h2>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/productos")}
          >
            Volver a productos
          </button>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        <div
          className="grid-productos"
          style={{
            gridTemplateColumns: "2fr 1fr",
            gap: "32px",
            alignItems: "flex-start",
          }}
        >
          {/* Imagen principal y miniaturas */}
          <div>
            {/* Imagen principal con placeholder si no existe */}
            {imagenPrincipal && imagenPrincipal.trim() !== "" ? (
              <img
                id="main-img"
                src={imagenPrincipal}
                alt={producto.nombre}
                className="img-main"
                style={{
                  width: "100%",
                  maxWidth: "550px",
                  borderRadius: "8px",
                }}
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

            {/* Miniaturas (solo si hay más de una imagen) */}
            {producto.imagenes?.length > 1 && (
              <div
                id="miniaturas"
                style={{ display: "flex", gap: "12px", marginTop: "16px" }}
              >
                {producto.imagenes.slice(1).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${producto.nombre} ${index + 2}`}
                    onClick={() => handleCambiarImagen(img)}
                    className="img-thumb"
                    style={{
                      border:
                        imagenPrincipal === img
                          ? "2px solid #2E8B57"
                          : "2px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Info producto */}
          <div className="producto" style={{ padding: "32px" }}>
            <h2
              id="nombre-producto"
              style={{ marginBottom: "0.5rem" }}
            >
              {producto.nombre}
            </h2>
            <span
              id="precio-producto"
              style={{
                display: "block",
                color: "#2E8B57",
                fontSize: "1.5em",
                marginBottom: "0.5rem",
              }}
            >
              {producto.precio}
            </span>
            <div
              id="desc-producto"
              className="desc"
              style={{ marginBottom: "1.5rem" }}
            >
              {producto.descripcion}
            </div>
            <p style={{ marginBottom: "1rem", color: "#555" }}>
              {producto.stock}
            </p>
            <hr style={{ margin: "18px 0" }} />
            <form style={{ marginBottom: "1.5rem" }}>
              <label
                htmlFor="cantidad"
                style={{ fontWeight: "600" }}
              >
                Cantidad
              </label>
              <input
                type="number"
                id="cantidad"
                min="1"
                value={cantidad}
                onChange={handleCambiarCantidad}
                style={{
                  marginLeft: "12px",
                  width: "60px",
                  padding: "6px",
                }}
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

        {/* Productos relacionados */}
        <div style={{ marginTop: "40px" }}>
          <h3 style={{ marginBottom: "18px" }}>Productos relacionados</h3>
          <div
            id="relacionados"
            className="grid-productos"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "18px",
            }}
          >
            {productosRelacionados.map((prod) => (
              <article
                key={prod.id}
                className="producto"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/productos/${prod.id}`)}
              >
                <h4>{prod.nombre}</h4>
                {prod.imagen && prod.imagen.trim() !== "" ? (
                  <img src={prod.imagen} alt={prod.nombre} />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "150px",
                      background: "#f5f5f5",
                      color: "#777",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.9rem",
                      fontStyle: "italic",
                    }}
                  >
                    Sin imagen
                  </div>
                )}
                <p className="precio">{prod.precio}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default DetalleProducto;