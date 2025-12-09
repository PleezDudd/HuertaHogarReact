import React from 'react';

class Formulario extends React.Component {
  state = { texto: '' };

  handleChange = (e) => {
    this.setState({ texto: e.target.value });
  };

  render() {
    return <input type="text" placeholder="Enter text" value={this.state.texto} onChange={this.handleChange} />;
  }
}

export default Formulario;