import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

// Shembull testimi për komponentët e React
test('renders Home link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Home/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders About link', () => {
  render(<App />);
  const linkElement = screen.getByText(/About/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders Contact link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Contact/i);
  expect(linkElement).toBeInTheDocument();
});
