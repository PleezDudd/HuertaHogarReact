import React from 'react';

const ErrorMessage = ({ error }) => (
  error ? <div className="error">¡Algo salió mal!</div> : null
);

// Prueba de renderizado condicional
describe('Componente ErrorMessage', () => {
  it('debe mostrar el mensaje de error cuando haya un error', () => {
    const wrapper = shallow(<ErrorMessage error={true} />);
    expect(wrapper.text()).toBe('¡Algo salió mal!');
  });

  it('no debe mostrar el mensaje de error cuando no haya error', () => {
    const wrapper = shallow(<ErrorMessage error={false} />);
    expect(wrapper.isEmptyRender()).toBe(true); // No debe renderizar nada
  });
});