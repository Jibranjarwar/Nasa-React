import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('HomePage', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock axios.get to return a resolved promise
    axios.get.mockResolvedValue({
      data: {
        media_type: 'image',
        title: 'Test APOD',
        explanation: 'Test explanation',
        url: 'https://example.com/test-image.jpg',
        date: '2024-01-01'
      }
    });
  });

  test('renders the solar system container', async () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );
    
    // Wait for the component to render and check for planet names
    expect(screen.getByText(/SUN/i)).toBeInTheDocument();
    expect(screen.getByText(/MERCURY/i)).toBeInTheDocument();
    expect(screen.getByText(/VENUS/i)).toBeInTheDocument();
    expect(screen.getByText(/EARTH/i)).toBeInTheDocument();
    expect(screen.getByText(/MARS/i)).toBeInTheDocument();
    expect(screen.getByText(/JUPITER/i)).toBeInTheDocument();
    expect(screen.getByText(/SATURN/i)).toBeInTheDocument();
    expect(screen.getByText(/URANUS/i)).toBeInTheDocument();
    expect(screen.getByText(/NEPTUNE/i)).toBeInTheDocument();
    expect(screen.getByText(/PLUTO/i)).toBeInTheDocument();
  });
}); 