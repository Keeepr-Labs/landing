import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the landing page with footer links', () => {
  render(<App />);
  expect(screen.getAllByText(/privacy policy/i).length).toBeGreaterThan(0);
});

test('shows the cookie consent banner on the landing page', () => {
  render(<App />);
  expect(
    screen.getByText(/this website uses cookies/i)
  ).toBeInTheDocument();
});
