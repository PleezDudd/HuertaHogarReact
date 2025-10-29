import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Registro from "../components/Registro";

describe("Registro", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("muestra error si las contraseñas no coinciden", async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");

    await userEvent.type(username, "Juan");
    await userEvent.type(email, "j@a.com");
    await userEvent.type(password, "123456");
    await userEvent.type(confirmPassword, "654321");
    await userEvent.type(phone, "123");
    await userEvent.type(address, "Calle 1");

    await userEvent.click(screen.getByRole("button", { name: /Registrar/i }));

    expect(screen.getByText(/Las contraseñas no coinciden/i)).toBeTruthy();
  });

  it("registra usuario y guarda sesión en localStorage", async () => {
    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");

    await userEvent.type(username, "Ana");
    await userEvent.type(email, "ana@a.com");
    await userEvent.type(password, "abc12345");
    await userEvent.type(confirmPassword, "abc12345");
    await userEvent.type(phone, "987");
    await userEvent.type(address, "Calle 2");

    await userEvent.click(screen.getByRole("button", { name: /Registrar/i }));

    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual") || "null");
    expect(Array.isArray(usuarios)).toBeTrue();
    expect(usuarios.length).toBe(1);
    expect(usuarioActual?.email).toBe("ana@a.com");
    expect(localStorage.getItem("sesionActiva")).toBe("true");
    expect(screen.getByText(/Registro exitoso/i)).toBeTruthy();
  });

  it("muestra error si el correo ya existe", async () => {
    localStorage.setItem(
      "usuarios",
      JSON.stringify([{ id: 1, usuario: "Ana", email: "ana@a.com", password: "x" }])
    );

    render(
      <MemoryRouter>
        <Registro />
      </MemoryRouter>
    );

    const username = document.getElementById("username");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const phone = document.getElementById("phone");
    const address = document.getElementById("address");

    await userEvent.type(username, "Ana");
    await userEvent.type(email, "ana@a.com");
    await userEvent.type(password, "abc12345");
    await userEvent.type(confirmPassword, "abc12345");
    await userEvent.type(phone, "987");
    await userEvent.type(address, "Calle 2");

    await userEvent.click(screen.getByRole("button", { name: /Registrar/i }));

    expect(screen.getByText(/El correo ya está registrado/i)).toBeTruthy();
  });
});


