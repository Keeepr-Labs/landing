import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';

const renderPage = (Page) =>
  render(
    <MemoryRouter>
      <Page />
    </MemoryRouter>
  );

test('privacy policy names the company, covers Apple Health and drops the end-to-end encryption claim', () => {
  const { container } = renderPage(PrivacyPolicy);
  expect(screen.getAllByText(/DINOSAURFORMULA UNIPESSOAL, LDA/).length).toBeGreaterThan(0);
  expect(screen.getByRole('heading', { name: /your health data/i })).toBeInTheDocument();
  expect(container.textContent).toMatch(/not end-to-end encrypted/i);
  expect(container.textContent).not.toMatch(/employs end-to-end encryption/i);
});

test('terms cover auto-renewal, free trials and Apple refunds', () => {
  const { container } = renderPage(TermsAndConditions);
  expect(screen.getByRole('heading', { name: /memberships, free trials and billing/i })).toBeInTheDocument();
  expect(container.textContent).toMatch(/at least 24 hours before the period ends/i);
  expect(screen.getByRole('link', { name: /reportaproblem\.apple\.com/i })).toBeInTheDocument();
  expect(container.textContent).not.toMatch(/Stream's Terms/);
});
