import { render, screen } from '@testing-library/react';
import MarsRoverPage from './MarsRoverPage';

describe('MarsRoverPage', () => {
  beforeEach(() => {
    // Mock fetch for rover info
    global.fetch = jest.fn((url) => {
      if (url.includes('mars-rover-info')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ 
            rover: { 
              name: 'curiosity', 
              status: 'active', 
              launch_date: '2011-11-26', 
              landing_date: '2012-08-06', 
              max_sol: 1000, 
              total_photos: 100, 
              max_date: '2024-01-01' 
            } 
          })
        });
      }
      // Mock fetch for photos
      if (url.includes('mars-rover-photos')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ photos: [] })
        });
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders Mars Rover page and rover selection', async () => {
    render(<MarsRoverPage />);
    
    // Wait for the loading to finish and rover buttons to appear
    // Look for the rover buttons specifically
    expect(await screen.findByRole('button', { name: /Curiosity/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /Perseverance/i })).toBeInTheDocument();
  });
}); 