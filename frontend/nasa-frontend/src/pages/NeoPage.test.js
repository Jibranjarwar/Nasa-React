import { render, screen } from '@testing-library/react';
import NeoPage from './NeoPage';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('NeoPage', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock axios.get to return a resolved promise
    axios.get.mockResolvedValue({
      data: {
        near_earth_objects: {
          '2024-01-01': [
            {
              id: '123',
              name: 'Test Asteroid',
              estimated_diameter: { meters: { estimated_diameter_max: 100 } },
              is_potentially_hazardous_asteroid: false,
              close_approach_data: [{
                relative_velocity: { kilometers_per_hour: '50000' },
                miss_distance: { kilometers: '1000000' }
              }]
            }
          ]
        }
      }
    });
  });

  test('renders Near Earth Objects title and date picker', async () => {
    render(<NeoPage />);
    expect(screen.getByText(/Near Earth Objects/i)).toBeInTheDocument();
    expect(screen.getByText(/Select Date/i)).toBeInTheDocument();
  });
}); 