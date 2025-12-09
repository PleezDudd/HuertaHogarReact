// src/Hello.spec.jsx
import React from "react";
import { render, screen } from "@testing-library/react";

function Hello() {
  return <div>Hola Huerto Hogar</div>;
}

describe("Smoke", () => {
  it("renderiza el componente Hello", () => {
    render(<Hello />);
    expect(screen.getByText(/Hola Huerto Hogar/i)).toBeTruthy();
  });
});
