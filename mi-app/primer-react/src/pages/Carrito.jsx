import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../css/styles.css";

const fmtCLP = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const Carrito = () => {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar carrito desde el backend
  useEffect(() => {
    const cargarCarrito = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get(`/api/carrito/usuario/${user.id}/items`);
        
        // Normalizar items del backend
        const itemsNormalizados = (response.data || []).map((item) => ({
          id: item.id,
          itemId: item.id, // ID del item en el carrito
          productoId: item.producto?.id,
          nombre: item.producto?.nombre || "Producto sin nombre",
          precio: item.producto?.precio ? parseFloat(item.producto.precio) : 0,
          cantidad: item.cantidad || 1,
          imagen: item.producto?.imagen || "/img/default.png",
          descripcion: item.producto?.descripcion || "",
        }));
        
        setItems(itemsNormalizados);
      } catch (err) {
        console.error("Error al cargar carrito:", err);
        // Si el carrito no existe (404), simplemente dejarlo vacío
        if (err.response?.status !== 404) {
          setError("Error al cargar el carrito. Intenta nuevamente.");
        }
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    cargarCarrito();
  }, [user]);

  // Calcular total
  const total = useMemo(
    () =>
      items.reduce((acc, it) => {
        const price = it.precio || 0;
        const qty = it.cantidad || 1;
        return acc + price * qty;
      }, 0),
    [items]
  );

  // Modificar cantidad
  const changeQty = async (itemId, delta) => {
    if (!user || !user.id) return;

    const item = items.find((it) => it.itemId === itemId);
    if (!item) return;

    const nuevaCantidad = Math.max(1, (item.cantidad || 1) + delta);

    try {
      const response = await api.put(`/api/carrito/usuario/${user.id}/item/${itemId}`, {
        cantidad: nuevaCantidad,
      });

      // Actualizar el item en el estado
      setItems((prev) =>
        prev.map((it) =>
          it.itemId === itemId ? { ...it, cantidad: nuevaCantidad } : it
        )
      );
    } catch (err) {
      console.error("Error al actualizar cantidad:", err);
      alert("Error al actualizar la cantidad. Intenta nuevamente.");
    }
  };

  // Eliminar item
  const removeItem = async (itemId) => {
    if (!user || !user.id) return;

    try {
      await api.delete(`/api/carrito/usuario/${user.id}/item/${itemId}`);
      
      // Remover el item del estado
      setItems((prev) => prev.filter((it) => it.itemId !== itemId));
    } catch (err) {
      console.error("Error al eliminar item:", err);
      alert("Error al eliminar el producto. Intenta nuevamente.");
    }
  };

  // Limpiar carrito
  const clearCart = async () => {
    if (!user || !user.id) return;

    if (!window.confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      return;
    }

    try {
      await api.delete(`/api/carrito/usuario/${user.id}/limpiar`);
      setItems([]);
    } catch (err) {
      console.error("Error al limpiar carrito:", err);
      alert("Error al vaciar el carrito. Intenta nuevamente.");
    }
  };

  // Render de carga
  if (loading) {
    return (
      <main className="container main-content">
        <h2>Tu carrito</h2>
        <p>Cargando carrito...</p>
      </main>
    );
  }

  // Render de error
  if (error) {
    return (
      <main className="container main-content">
        <h2>Tu carrito</h2>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/productos" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </main>
    );
  }

  // Render vacío
  if (!items.length) {
    return (
      <main className="container main-content">
        <h2>Tu carrito</h2>
        <p>No tienes productos en el carrito.</p>
        <Link to="/productos" className="btn btn-primary">
          Ir al catálogo
        </Link>
      </main>
    );
  }

  // Render normal
  return (
    <main
      className="container main-content"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 320px",
        gap: "1.5rem",
      }}
    >
      <section aria-label="Productos del carrito" id="carrito-lista">
        {items.map((it) => {
          const nombre = it.nombre || `Producto ${it.productoId}`;
          const price = it.precio || 0;
          const qty = it.cantidad || 1;
          const img = it.imagen || "";

          return (
            <article
              key={it.itemId}
              className="producto"
              style={{
                display: "grid",
                gridTemplateColumns: "96px 1fr auto",
                gap: "1rem",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: 8,
                  overflow: "hidden",
                  background: "#0b1023",
                }}
              >
                {img && img.trim() !== "" ? (
                  <img
                    src={img}
                    alt={nombre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      e.target.src = "/img/default.png";
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "#f5f5f5",
                      color: "#888",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.8rem",
                      fontStyle: "italic",
                    }}
                  >
                    Sin imagen
                  </div>
                )}
              </div>

              <div>
                <h4 style={{ margin: 0 }}>{nombre}</h4>
                <p className="precio" style={{ margin: ".25rem 0" }}>
                  {fmtCLP(price)}
                </p>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: ".5rem",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => changeQty(it.itemId, -1)}
                  >
                    -
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => changeQty(it.itemId, +1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: ".5rem",
                  justifyItems: "end",
                }}
              >
                <strong>{fmtCLP(price * qty)}</strong>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => removeItem(it.itemId)}
                >
                  Quitar
                </button>
              </div>
            </article>
          );
        })}
      </section>

      <aside
        className="carrito"
        style={{ position: "sticky", top: 20, alignSelf: "start" }}
      >
        <h3>Tu carrito</h3>
        <ul className="mini-lista">
          {items.map((it) => {
            const nombre = it.nombre || `Producto ${it.productoId}`;
            const qty = it.cantidad || 1;
            return (
              <li
                key={it.itemId}
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <span>{nombre}</span>
                <span>x{qty}</span>
              </li>
            );
          })}
        </ul>
        <div className="totales">
          <span>Total:</span>
          <strong id="carrito-total">{fmtCLP(total)}</strong>
        </div>
        <div style={{ display: "grid", gap: ".5rem" }}>
          <Link to="/productos" className="btn btn-secondary">
            Seguir comprando
          </Link>
          <button
            type="button"
            className="btn btn-outline"
            onClick={clearCart}
          >
            Vaciar carrito
          </button>
          <Link to="/boleta" className="btn btn-primary">
            Continuar compra
          </Link>
        </div>
      </aside>
    </main>
  );
};

export default Carrito;
