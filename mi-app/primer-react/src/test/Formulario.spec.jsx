import { render, screen, fireEvent } from '@testing-library/react';
import Formulario from '../components/Formulario';

describe('Formulario', () => {
  it('updates state when user types in input', () => {
    render(<Formulario />);

    const inputElement = screen.getByPlaceholderText(/Enter text/i);
    fireEvent.change(inputElement, { target: { value: 'New text' } });

    expect(inputElement.value).toBe('New text');
  });
});