export const productos = [
  {
    id: "FR001",
    nombre: "Manzanas Fuji",
    categoria: "Frutas Frescas",
    precio: 1200,
    descripcion: "Manzanas crujientes y dulces del Valle del Maule.",
    stock: "Stock: 150 kg.",
    imagen: "/img/Manzanas.png",
    imagenes: ["/img/Manzanas.png", "/img/Manzanas2.png"],
  },
  {
    id: "FR002",
    nombre: "Naranjas Valencia",
    categoria: "Frutas Frescas",
    precio: 1000,
    descripcion: "Jugosas y ricas en vitamina C, ideales para zumos frescos.",
    stock: "Stock: 200 kg.",
    imagen: "/img/Naranjas.png",
    imagenes: ["/img/Naranjas.png"],
  },
  {
    id: "VR001",
    nombre: "Zanahorias Orgánicas",
    categoria: "Verduras Orgánicas",
    precio: 900,
    descripcion:
      "Zanahorias crujientes cultivadas sin pesticidas en la Región de O'Higgins.",
    stock: "Stock: 100 kg.",
    imagen: "/img/Zanahorias.png",
    imagenes: ["/img/Zanahorias.png"],
  },
  {
    id: "PO001",
    nombre: "Miel Orgánica",
    categoria: "Productos Orgánicos",
    precio: 5000,
    descripcion: "Miel pura y orgánica producida por apicultores locales.",
    stock: "Stock: 50 frascos.",
    imagen: "/img/Miel.png",
    imagenes: ["/img/Miel.png"],
  },
];

// 🔹 Devuelve todos los productos
export const obtenerProductos = () => productos;

// 🔹 Busca producto por ID
export const obtenerProductoPorId = (id) =>
  productos.find((p) => p.id === id);
