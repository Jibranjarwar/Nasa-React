import '@testing-library/jest-dom';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
      media_type: 'image',
      title: 'Test APOD',
      explanation: 'Test explanation',
      url: 'https://example.com/test-image.jpg',
      date: '2024-01-01'
    }
  })),
  post: jest.fn(() => Promise.resolve({ data: {} })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
  delete: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Polyfill ResizeObserver for recharts and other components
if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}