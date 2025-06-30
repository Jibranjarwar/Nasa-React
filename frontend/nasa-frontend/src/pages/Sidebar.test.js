import { render, screen, fireEvent } from '@testing-library/react';
import Sidebar from './Sidebar';
import { MemoryRouter } from 'react-router-dom';

describe('Sidebar', () => {
  test('renders navigation links after opening sidebar', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );
    // Click the toggle button to open the sidebar
    const toggleBtn = screen.getByRole('button');
    fireEvent.click(toggleBtn);
    
    expect(screen.getByText(/Solar System/i)).toBeInTheDocument();
    expect(screen.getByText(/APOD/i)).toBeInTheDocument();
    expect(screen.getByText(/Planets/i)).toBeInTheDocument();
    expect(screen.getByText(/Near Earth Objects/i)).toBeInTheDocument();
    expect(screen.getByText(/Mars Rover/i)).toBeInTheDocument();
    expect(screen.getByText(/EPIC/i)).toBeInTheDocument();
  });
}); 