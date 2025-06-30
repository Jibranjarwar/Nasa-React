import { render, screen } from '@testing-library/react';
import EpicPage from './EpicPage';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('EpicPage', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Mock axios.get to return resolved promises
    axios.get.mockImplementation((url) => {
      if (url.includes('epic/available')) {
        return Promise.resolve({ data: ['2024-01-01', '2024-01-02'] });
      }
      if (url.includes('epic?')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: {} });
    });
  });

  test('renders EPIC Earth Images title', async () => {
    render(<EpicPage />);
    expect(screen.getByText(/EPIC Earth Images/i)).toBeInTheDocument();
    expect(await screen.findByText(/Natural Color/i)).toBeInTheDocument();
    expect(await screen.findByText(/Enhanced Color/i)).toBeInTheDocument();
  });
}); 