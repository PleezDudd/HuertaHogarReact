import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("Componente App", () => {
  it("debe renderizar el branding correcto en el header y footer", () => {
    render(<App />);
    // Verifica el texto del logo principal
    expect(screen.getByText(/Mi Tienda/i)).toBeTruthy();

    // Ahora busca todas las apariciones de "HuertoHogar"
    const coincidencias = screen.getAllByText(/HuertoHogar/i);
    expect(coincidencias.length).toBeGreaterThanOrEqual(1);
  });

  it("debe tener enlaces principales del menú", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: /Inicio/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Catálogo/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /Carrito/i })).toBeTruthy();
  });
});
