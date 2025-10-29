import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Unete from "../pages/Unete";

describe("Unete (Login)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("muestra error si faltan campos", async () => {
    render(
      <MemoryRouter>
        <Unete />
      </MemoryRouter>
    );

    const form = document.getElementById("loginForm");
    fireEvent.submit(form);

    const msg = document.getElementById("loginMensaje");
    expect((msg?.textContent || "").toLowerCase()).toContain("ingresa tu correo y contraseña");
  });

  it("muestra error con credenciales inválidas", async () => {
    render(
      <MemoryRouter>
        <Unete />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Correo Electrónico/i), "x@y.com");
    await userEvent.type(screen.getByLabelText(/Contraseña/i), "zzz");
    await userEvent.click(screen.getByRole("button", { name: /Iniciar sesión/i }));

    expect(screen.getByText(/Credenciales incorrectas/i)).toBeTruthy();
  });

  it("guarda sesión y rol admin en localStorage al loguear admin", async () => {
    render(
      <MemoryRouter>
        <Unete />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Correo Electrónico/i), "admin@huertohogar.cl");
    await userEvent.type(screen.getByLabelText(/Contraseña/i), "admin123");
    await userEvent.click(screen.getByRole("button", { name: /Iniciar sesión/i }));

    expect(localStorage.getItem("sesionActiva")).toBe("true");
    const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "null");
    expect(usuario?.rol).toBe("admin");
  });

  it("guarda sesión y rol usuario en localStorage al loguear usuario", async () => {
    render(
      <MemoryRouter>
        <Unete />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Correo Electrónico/i), "usuario@huertohogar.cl");
    await userEvent.type(screen.getByLabelText(/Contraseña/i), "usuario123");
    await userEvent.click(screen.getByRole("button", { name: /Iniciar sesión/i }));

    expect(localStorage.getItem("sesionActiva")).toBe("true");
    const usuario = JSON.parse(localStorage.getItem("usuarioActual") || "null");
    expect(usuario?.rol).toBe("usuario");
  });
});


