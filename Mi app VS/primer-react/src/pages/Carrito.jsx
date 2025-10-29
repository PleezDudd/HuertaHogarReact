import React, { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "../css/styles.css";

const fmtCLP = (n) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n || 0);

export const Carrito = () => {
  const [items, setItems] = useState([]);
  const firstRender = useRef(true);

  // ✅ Cargar carrito desde localStorage
  useEffect(() => {
    document.title = "Carrito | HuertoHogar";
    const raw = localStorage.getItem("carrito") || localStorage.getItem("cart");
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) setItems(parsed);
      else if (parsed && typeof parsed === "object")
        setItems(Object.values(parsed));
    } catch {
      setItems([]);
    }

    // 🔄 Escucha evento para actualizar carrito desde otras vistas
    const handleCustom = () => {
      const nuevo = JSON.parse(localStorage.getItem("carrito")) || [];
      setItems(nuevo);
    };
    window.addEventListener("carritoActualizado", handleCustom);
    return () => window.removeEventListener("carritoActualizado", handleCustom);
  }, []);

  // ✅ Guardar carrito cuando cambie (excepto en el primer render)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    localStorage.setItem("carrito", JSON.stringify(items));
  }, [items]);

  // ✅ Calcular total
  const total = useMemo(
    () =>
      items.reduce((acc, it) => {
        const price = it.precio ?? it.price ?? 0;
        const qty = it.cantidad ?? it.qty ?? 1;
        return acc + price * qty;
      }, 0),
    [items]
  );

  // ✅ Modificar cantidad
  const changeQty = (idx, delta) => {
    setItems((prev) =>
      prev.map((it, i) => {
        if (i !== idx) return it;
        const qty = Math.max(1, (it.cantidad ?? it.qty ?? 1) + delta);
        return { ...it, cantidad: qty, qty };
      })
    );
  };

  // ✅ Eliminar y limpiar
  const removeItem = (idx) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));
  const clearCart = () => setItems([]);

  // ✅ Render vacío
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

  // ✅ Render normal
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
        {items.map((it, idx) => {
          const nombre = it.nombre ?? it.name ?? `Producto ${idx + 1}`;
          const price = it.precio ?? it.price ?? 0;
          const qty = it.cantidad ?? it.qty ?? 1;
          const img = it.img ?? it.image ?? it.foto ?? "";

          return (
            <article
              key={idx}
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
                    onClick={() => changeQty(idx, -1)}
                  >
                    -
                  </button>
                  <span>{qty}</span>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => changeQty(idx, +1)}
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
                  onClick={() => removeItem(idx)}
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
          {items.map((it, idx) => {
            const nombre = it.nombre ?? it.name ?? `Producto ${idx + 1}`;
            const qty = it.cantidad ?? it.qty ?? 1;
            return (
              <li
                key={idx}
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