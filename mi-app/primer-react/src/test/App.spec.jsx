import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jasmine-dom"; // importante para toBeInTheDocument
import App from "../App";

describe("Componente App", () => {
  it("debe renderizar HuertoHogar correctamente", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /huertohogar/i })).toBeInTheDocument();
  });
});
