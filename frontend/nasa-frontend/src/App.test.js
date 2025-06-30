jest.mock('./pages/HomePage', () => {
  return function MockedHomePage() {
    return (
      <div>
        <h1>Home</h1>
        <nav>
          <a href="/apod">APOD</a>
          <a href="/mars">Mars Rover</a>
          <a href="/neo">NEO</a>
          <a href="/epic">EPIC</a>
        </nav>
      </div>
    );
  };
});

import { render, screen } from '@testing-library/react';
import App from './App';

describe('NASA Space Explorer App', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    render(<App />);
    expect(screen.getByText(/APOD/i)).toBeInTheDocument();
    expect(screen.getByText(/Mars Rover/i)).toBeInTheDocument();
    expect(screen.getByText(/NEO/i)).toBeInTheDocument();
    expect(screen.getByText(/EPIC/i)).toBeInTheDocument();
  });
});