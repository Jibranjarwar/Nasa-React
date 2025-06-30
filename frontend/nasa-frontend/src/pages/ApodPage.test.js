import { render, screen } from '@testing-library/react';
import ApodPage from './ApodPage';

describe('ApodPage', () => {
  test('renders APOD title', () => {
    render(<ApodPage />);
    expect(screen.getByText(/Astronomy Picture of the Day/i)).toBeInTheDocument();
  });
}); 