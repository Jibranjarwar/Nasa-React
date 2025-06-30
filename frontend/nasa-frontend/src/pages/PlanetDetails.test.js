import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PlanetDetails from './PlanetDetails';

// Mock fetch
global.fetch = jest.fn((url) => {
  if (url.includes('api.le-systeme-solaire.net')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        name: 'MERCURY',
        englishName: 'Mercury',
        mass: { massValue: 3.285, massExponent: 23 },
        vol: { volValue: 6.083, volExponent: 10 },
        density: 5427,
        gravity: 3.7,
        meanRadius: 2439.7,
        sideralOrbit: 87.969,
        sideralRotation: 1407.6,
        discoveredBy: '',
        discoveryDate: '',
        alternativeName: '',
        axialTilt: 0.034,
        avgTemp: 440,
        moons: null,
        massValue: 3.285,
        massExponent: 23,
        volValue: 6.083,
        volExponent: 10
      })
    });
  }
  if (url.includes('images-api.nasa.gov')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        collection: {
          items: [
            { links: [{ href: 'https://example.com/image1.jpg' }] },
            { links: [{ href: 'https://example.com/image2.jpg' }] }
          ]
        }
      })
    });
  }
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
});

describe('PlanetDetails', () => {
  test('renders Planets page and planet names', async () => {
    render(
      <MemoryRouter initialEntries={['/planet-details']}>
        <PlanetDetails />
      </MemoryRouter>
    );
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