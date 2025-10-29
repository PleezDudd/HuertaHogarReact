// Button.spec.js
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/Button';

describe('Button', () => {
  it('calls onClick function when clicked', () => {
    const onClick = jasmine.createSpy('onClick');
    render(<Button label="Click me" onClick={onClick} />);

    const buttonElement = screen.getByText(/Click me/i);
    fireEvent.click(buttonElement);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});


