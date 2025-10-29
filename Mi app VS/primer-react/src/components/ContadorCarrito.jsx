import { useEffect, useState } from "react";

export default function CarritoContador() {
  const [cantidad, setCantidad] = useState(0);

  const actualizarContador = () => {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((sum, prod) => sum + prod.cantidad, 0);
    setCantidad(total);
  };

  // Actualizar al cargar el componente
  useEffect(() => {
    actualizarContador();

    // Escuchar cambios del localStorage (cuando se modifique desde otra pestaña o componente)
    const handleStorage = (e) => {
      if (e.key === "carrito") actualizarContador();
    };
    window.addEventListener("storage", handleStorage);
    window.addEventListener("carritoActualizado", handleCustom);

    // Cleanup
    return () => window.removeEventListener("storage", handleStorage);
    window.removeEventListener("carritoActualizado", handleCustom);
  }, []);

  return (
    <span
      id="carrito-contador"
      style={{
        background: "#388e3c",
        color: "#fff",
        borderRadius: "50%",
        padding: "2px 8px",
        fontSize: "0.9em",
        marginLeft: "4px",
      }}
    >
      {cantidad}
    </span>
  );
}