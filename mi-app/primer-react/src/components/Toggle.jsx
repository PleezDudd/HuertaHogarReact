import React from 'react';

class Toggle extends React.Component {
  state = { activado: false };

  toggleState = () => {
    this.setState(prevState => ({ activado: !prevState.activado }));
  };

  render() {
    return (
      <button onClick={this.toggleState}>
        {this.state.activado ? 'Activado' : 'Desactivado'}
      </button>
    );
  }
}

// Prueba de evento
describe('Componente Toggle', () => {
  it('debe cambiar el estado cuando se hace clic', () => {
    const wrapper = shallow(<Toggle />);
    
    expect(wrapper.text()).toBe('Desactivado');
    
    wrapper.find('button').simulate('click'); // Simula un clic en el botón
    expect(wrapper.text()).toBe('Activado'); // Verifica que el texto haya cambiado
  });
});