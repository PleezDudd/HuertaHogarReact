import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/styles.css";

export const Productos = () => {
  const navigate = useNavigate();

  // 🔹 Estado para el filtro
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todas");

  // 🔹 Lista de productos (puedes moverla a data/productos.js si prefieres)
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

  // 🔹 Categorías únicas (más la opción "Todas")
  const categorias = ["Todas", ...new Set(listaProductos.map((p) => p.categoria))];

  // 🔹 Productos filtrados según la categoría seleccionada
  const productosFiltrados =
    categoriaSeleccionada === "Todas"
      ? listaProductos
      : listaProductos.filter((p) => p.categoria === categoriaSeleccionada);

  return (
    <main className="container">
      <h2 style={{ marginBottom: "1rem" }}>Nuestros productos</h2>

      {/* 🔹 Filtro de categorías */}
      <div
        className="grid-categorias"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {categorias.map((cat) => (
          <div
            key={cat}
            className={`categoria ${
              categoriaSeleccionada === cat ? "activa" : ""
            }`}
            onClick={() => setCategoriaSeleccionada(cat)}
            style={{
              cursor: "pointer",
              border:
                categoriaSeleccionada === cat
                  ? "2px solid #2E8B57"
                  : "1px solid #ccc",
              backgroundColor:
                categoriaSeleccionada === cat ? "#e9f6ec" : "transparent",
              padding: "10px 16px",
              borderRadius: "8px",
              transition: "0.2s",
              fontWeight:
                categoriaSeleccionada === cat ? "600" : "normal",
            }}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* 🔹 Productos filtrados */}
      <div
        className="grid-productos"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((prod) => (
            <article
              key={prod.id}
              className="producto"
              style={{
                background: "#fff",
                borderRadius: "10px",
                padding: "1rem",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                transition: "0.2s",
              }}
            >
              <h4>
                {prod.id} - {prod.nombre}
              </h4>
              <Link
                to={`/productos/${prod.id}`}
                style={{ display: "block", cursor: "pointer" }}
              >
                <img
                  src={prod.imagen}
                  alt={prod.nombre}
                  style={{
                    width: "100%",
                    borderRadius: "8px",
                    marginBottom: "0.5rem",
                  }}
                />
              </Link>
              <p className="precio" style={{ color: "#2E8B57", fontWeight: "bold" }}>
                {prod.precio}
              </p>
              <p className="stock" style={{ fontSize: "0.9rem", color: "#555" }}>
                {prod.stock}
              </p>
              <p style={{ fontSize: "0.9rem", color: "#666" }}>
                {prod.descripcion}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate(`/productos/${prod.id}`)}
                style={{
                  width: "100%",
                  marginTop: "0.5rem",
                  background: "#2E8B57",
                  border: "none",
                  padding: "8px",
                  color: "white",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Ver detalle
              </button>
            </article>
          ))
        ) : (
          <p>No hay productos en esta categoría.</p>
        )}
      </div>
    </main>
  );
};

export default Productos;
