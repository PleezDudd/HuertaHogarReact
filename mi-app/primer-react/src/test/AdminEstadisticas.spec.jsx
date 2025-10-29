import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminEstadisticas from "../pages/AdminEstadisticas";

describe("AdminEstadisticas", () => {
  beforeEach(() => {
    localStorage.clear();
    spyOn(window, "alert").and.callFake(() => {});
  });

  it("redirige si no es admin", () => {
    localStorage.setItem("usuarioActual", JSON.stringify({ email: "a@a.com", rol: "usuario" }));
    // navigate se invoca dentro del componente; no lo afirmamos directamente
    render(
      <MemoryRouter initialEntries={["/admin/estadisticas"]}>
        <AdminEstadisticas />
      </MemoryRouter>
    );
    expect(window.alert).toHaveBeenCalled();
  });

  it("muestra estadísticas calculadas para admin", () => {
    localStorage.setItem("usuarioActual", JSON.stringify({ email: "admin@a.com", rol: "admin" }));
    localStorage.setItem(
      "boletasHistorial",
      JSON.stringify([
        { total: "1.000 CLP", productos: [{ nombre: "Manzana", cantidad: 2 }] },
        { total: "2.500 CLP", productos: [{ nombre: "Plátano", cantidad: 3 }] }
      ])
    );
    localStorage.setItem("usuariosRegistrados", JSON.stringify([{ id: 1 }, { id: 2 }]));

    render(
      <MemoryRouter>
        <AdminEstadisticas />
      </MemoryRouter>
    );

    expect(screen.getByText(/Total Boletas/i).nextSibling?.textContent).toMatch(/2/);
    expect(screen.getByText(/Usuarios Registrados/i).nextSibling?.textContent).toMatch(/2/);
    // Total ventas: 1000 + 2500 = 3500
    expect(screen.getByText(/Total Ventas/i).nextSibling?.textContent).toMatch(/3.500/);
    expect(screen.getByText(/Producto más vendido/i).nextSibling?.textContent || "").not.toBe("");
  });
});


