import React from 'react';
import { render, screen } from '@testing-library/react';
import List from '../components/List';

describe('List', () => {
  it('debe renderizar todos los elementos de la lista', () => {
    const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    render(<List items={items} />);
    
    expect(screen.getByText('Item 1')).toBeTruthy();
    expect(screen.getByText('Item 2')).toBeTruthy();
  });
});
