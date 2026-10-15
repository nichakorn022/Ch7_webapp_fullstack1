import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the menu page with the initial food items', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /our menu/i })).toBeInTheDocument();
  expect(screen.getByText(/cake/i)).toBeInTheDocument();
  expect(screen.getByText(/bread/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /add menu/i })).toBeInTheDocument();
});
