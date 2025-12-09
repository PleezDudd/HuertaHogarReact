import React from "react";
import { Link } from "react-router-dom";
import { obtenerProductos } from "../data/productos";

const parsePrecio = (p) => {
  if (typeof p === "number") return Math.round(p);
  if (!p) return 0;
  let s = String(p);
  const idx = s.toUpperCase().indexOf("CLP");
  if (idx !== -1) s = s.slice(0, idx);
  const m = s.match(/(\d{1,3}(?:\.\d{3})+|\d+)(?:[.,]\d+)?/);
  if (!m) return 0;
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

const getName = (p) => String(p?.nombre || p?.nombreProducto || p?.title || "");
const getImage = (p) => {
  if (p?.imagen && p.imagen.trim() !== "") return p.imagen;
  if (Array.isArray(p?.imagenes) && p.imagenes.length > 0) return p.imagenes[0];
  const n = getName(p).toLowerCase();
  if (n.includes("plátano") || n.includes("platano")) return "/img/Platanos.png";
  if (n.includes("manzana")) return "/img/Manzanas.png";
  if (n.includes("espinaca")) return "/img/Espinacas.png";
  return "/img/Platanos.png";
};

// 3 ofertas forzadas con fallbacks
const SEED_OFERTAS = [
  {
    id: "FR001",
    match: ["manzana", "fuji"],
    nombre: "Manzanas Fuji",
    precio: "$1.200 CLP",
    descripcion: "Manzanas crujientes y dulces del Valle del Maule.",
    imagen: "/img/Manzanas.png",
  },
  {
    id: "FR003",
    match: ["plátano", "platano", "cavendish"],
    nombre: "Plátanos Cavendish",
    precio: "$800 CLP",
    descripcion:
      "Plátanos maduros y dulces, perfectos para el desayuno o snacks.",
    imagen: "/img/Platanos.png",
  },
  {
    id: "VR002",
    match: ["espinaca", "espinacas"],
    nombre: "Espinacas Frescas",
    precio: "$700 CLP",
    descripcion: "Espinacas frescas y nutritivas para ensaladas y batidos.",
    imagen: "/img/Espinacas.png",
  },
];

export default function Ofertas() {
  const lista = obtenerProductos?.() || [];

  // arma exactamente 3 items de oferta
  const items = SEED_OFERTAS.map((seed) => {
    const found =
      lista.find((p) => String(p.id).toLowerCase() === seed.id.toLowerCase()) ||
      lista.find((p) =>
        seed.match.some((kw) =>
          getName(p).toLowerCase().includes(kw.toLowerCase())
        )
      );

    const merged = { ...seed, ...(found || {}) };
    const base = parsePrecio(
      merged?.precio ?? merged?.price ?? merged?.valor ?? merged?.precio_unitario ?? ""
    );

    return {
      ...merged,
      nombre: getName(merged) || seed.nombre,
      imagen: getImage(merged),
      base,
      offer: Math.round(base * 0.85),
    };
  });

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Ofertas</h2>

      <div style={styles.grid}>
        {items.map((p) => (
          <article key={p.id} style={styles.card}>
            <div style={{ position: "relative" }}>
              <img src={p.imagen} alt={p.nombre} style={styles.image} />
              <span style={styles.badge}>-15%</span>
            </div>

            <div style={styles.body}>
              <h3 style={styles.name}>{p.nombre}</h3>
              {p.descripcion && <p style={styles.desc}>{p.descripcion}</p>}

              <div style={styles.priceRow}>
                <span style={styles.original}>{formatCLP(p.base)}</span>
                <span style={styles.sale}>{formatCLP(p.offer)}</span>
              </div>

              <Link
                to={`/productos/${p.id}`}
                state={{ producto: p }}
                className="btn btn-primary"
                style={styles.btn}
              >
                Ver detalle
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: 20, background: "#f6fff7", minHeight: "100vh" },
  title: { color: "#1e6b3a", marginBottom: 16 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: 16,
  },
  card: {
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    overflow: "hidden",
    border: "1px solid rgba(30,107,58,0.06)",
    display: "flex",
    flexDirection: "column",
  },
  image: { width: "100%", height: 160, objectFit: "cover" },
  body: { padding: 12 },
  name: { margin: "8px 0 4px 0", color: "#18582f", fontSize: 16 },
  desc: { margin: 0, color: "#556b5c", fontSize: 13, minHeight: 36 },
  priceRow: { marginTop: 10, display: "flex", alignItems: "center", gap: 8 },
  original: { textDecoration: "line-through", color: "#9aa79b", fontSize: 13 },
  sale: { color: "#1e6b3a", fontWeight: 700, fontSize: 16 },
  badge: {
    position: "absolute",
    top: 10,
    left: 10,
    background: "#e6f7ea",
    color: "#1e6b3a",
    padding: "4px 8px",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 12,
    border: "1px solid rgba(30,107,58,0.12)",
  },
  btn: {
    display: "inline-block",
    marginTop: 10,
    background: "#1e6b3a",
    borderColor: "#1e6b3a",
    color: "#fff",
    padding: "8px 12px",
    borderRadius: 8,
    fontWeight: 700,
    textDecoration: "none",
  },
};