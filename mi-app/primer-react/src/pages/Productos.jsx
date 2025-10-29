// ...existing code...
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

// mismas helpers que en Detalle_productos.jsx
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

export const Productos = () => {
  const navigate = useNavigate();

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  // Lista local (si la tienes en data/productos, usa esa fuente)
  const listaProductos = [
    {
      id: "FR001",
      nombre: "Manzanas Fuji",
      categoria: "Frutas Frescas",
      precio: "$1.200 CLP / kg",
      stock: "Stock: 150 kg.",
      descripcion:
        "Manzanas Fuji crujientes y dulces, cultivadas en el Valle del Maule.",
      imagen: "/img/Manzanas.png",
    },
    {
      id: "FR002",
      nombre: "Naranjas Valencia",
      categoria: "Frutas Frescas",
      precio: "$1.000 CLP / kg",
      stock: "Stock: 200 kg.",
      descripcion:
        "Jugosas y ricas en vitamina C, ideales para zumos frescos.",
      imagen: "/img/Naranjas.png",
    },
    {
      id: "FR003",
      nombre: "Plátanos Cavendish",
      categoria: "Frutas Frescas",
      precio: "$800 CLP / kg",
      stock: "Stock: 250 kg.",
      descripcion:
        "Plátanos maduros y dulces, perfectos para el desayuno o como snack energético.",
      imagen: "/img/Platanos.png",
    },
    {
      id: "VR001",
      nombre: "Zanahorias Orgánicas",
      categoria: "Verduras Orgánicas",
      precio: "$900 CLP / kg",
      stock: "Stock: 100 kg.",
      descripcion:
        "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins.",
      imagen: "/img/Zanahorias.png",
    },
    {
      id: "VR002",
      nombre: "Espinacas Frescas",
      categoria: "Verduras Orgánicas",
      precio: "$700 CLP / bolsa de 500g",
      stock: "Stock: 80 bolsas.",
      descripcion:
        "Espinacas frescas y nutritivas, perfectas para ensaladas y batidos verdes.",
      imagen: "/img/Espinacas.png",
    },
    {
      id: "VR003",
      nombre: "Pimientos Tricolores",
      categoria: "Verduras Orgánicas",
      precio: "$1.500 CLP / kg",
      stock: "Stock: 120 kilos.",
      descripcion:
        "Pimientos rojos, amarillos y verdes, ideales para salteados y platos coloridos.",
      imagen: "/img/Pimientos.png",
    },
    {
      id: "PO001",
      nombre: "Miel Orgánica",
      categoria: "Productos Orgánicos",
      precio: "$5.000 CLP / frasco de 500g",
      stock: "Stock: 50 frascos.",
      descripcion: "Miel pura y orgánica producida por apicultores locales.",
      imagen: "/img/Miel.png",
    },
  ];

  const categorias = ["Todas", ...new Set(listaProductos.map((p) => p.categoria))];

  const productosFiltrados =
    categoriaSeleccionada === "Todas"
      ? listaProductos
      : listaProductos.filter((p) => p.categoria === categoriaSeleccionada);

  const priceStyles = {
    base: { color: "#2E8B57", fontWeight: 700, fontSize: 16 },
    old: { textDecoration: "line-through", color: "#9aa79b", fontSize: 13 },
    row: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8 },
    badge: {
      color: "#1e6b3a",
      fontWeight: 700,
      fontSize: 12,
      background: "#e6f7ea",
      border: "1px solid rgba(30,107,58,0.12)",
      padding: "2px 6px",
      borderRadius: 10,
    },
  };

  return (
    <main className="container">
      <h2 style={{ marginBottom: "1rem" }}>Nuestros productos</h2>

      {/* Filtro */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        {categorias.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaSeleccionada(cat)}
            style={{
              cursor: "pointer",
              border: categoriaSeleccionada === cat ? "2px solid #2E8B57" : "1px solid #ccc",
              background: categoriaSeleccionada === cat ? "#e9f6ec" : "transparent",
              padding: "8px 14px",
              borderRadius: 8,
              fontWeight: categoriaSeleccionada === cat ? 600 : 400,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grilla */}
      <div
        className="grid-productos"
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}
      >
        {productosFiltrados.map((prod) => {
          const nombre = String(prod.nombre || "").toLowerCase();
          const esOferta = descuentoKeywords.some((kw) => nombre.includes(kw));
          const base = parsePrecio(prod.precio); // normaliza
          const oferta = esOferta && base > 0 ? Math.round(base * 0.85) : null;

          return (
            <article
              key={prod.id}
              className="producto"
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                border: "1px solid rgba(30,107,58,0.06)",
                overflow: "hidden",
                padding: 12,
                position: "relative",
              }}
            >
              {esOferta && (
                <span
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    background: "#e6f7ea",
                    color: "#1e6b3a",
                    border: "1px solid rgba(30,107,58,0.12)",
                    padding: "4px 8px",
                    borderRadius: 12,
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  -15%
                </span>
              )}

              <h4 style={{ margin: "4px 0 8px", color: "#18582f" }}>
                {prod.id} - {prod.nombre}
              </h4>

              <Link to={`/productos/${prod.id}`} state={{ producto: prod }}>
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8 }}
                />
              </Link>

              {/* Precio uniforme: "$X CLP" */}
              <div style={priceStyles.row}>
                {esOferta && oferta !== null ? (
                  <>
                    <span style={priceStyles.old}>{formatCLP(base)}</span>
                    <span style={priceStyles.base}>{formatCLP(oferta)}</span>
                    <span style={priceStyles.badge}>-15%</span>
                  </>
                ) : (
                  <span style={priceStyles.base}>{formatCLP(base)}</span>
                )}
              </div>

              <p style={{ fontSize: 13, color: "#556b5c", minHeight: 34 }}>{prod.descripcion}</p>

              <button
                className="btn btn-primary"
                onClick={() => navigate(`/productos/${prod.id}`, { state: { producto: prod } })}
                style={{ width: "100%", background: "#2E8B57", border: "none", padding: 8, borderRadius: 8, fontWeight: 700 }}
              >
                Ver detalle
              </button>
            </article>
          );
        })}
      </div>
    </main>
  );
};

export default Productos;
// ...existing code...