import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from './Landing';
import { SemiCircleArc } from './AppScreens';
import useReveal from './useReveal';

const renderLanding = () =>
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );

describe('Landing page', () => {
  test('leads with the value proposition, not a waitlist signup', () => {
    renderLanding();

    expect(screen.getByRole('heading', { level: 1, name: /stick to it/i })).toBeInTheDocument();
    // The page this replaced was a bare email capture; make sure we never
    // regress to that as the primary action on the home route.
    expect(screen.queryByPlaceholderText(/enter your email/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /waitlist/i })).not.toBeInTheDocument();
  });

  test('primary CTA links to the live App Store listing', () => {
    renderLanding();

    const ctas = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href') === 'https://apps.apple.com/app/id6471142186');

    expect(ctas.length).toBeGreaterThanOrEqual(2); // nav + hero + final
    ctas.forEach((cta) => {
      // Opening the store in a new tab must not hand it window.opener.
      expect(cta).toHaveAttribute('rel', expect.stringContaining('noopener'));
    });
  });

  test('keeps an Android path to the waitlist page', () => {
    renderLanding();

    const androidLinks = screen.getAllByRole('link', { name: /get in line for it/i });
    expect(androidLinks.length).toBeGreaterThan(0);
    expect(androidLinks[0]).toHaveAttribute('href', '/waitlistAndroid');
  });

  test('tells the whole accountability + stakes story', () => {
    renderLanding();

    expect(screen.getByText(/two, not so secret, ingredients/i)).toBeInTheDocument();
    expect(screen.getByText(/nowhere to hide/i)).toBeInTheDocument();
    // "keep your tickets" appears in both the stakes headline and the phone
    // screen beside it, so assert on the headline specifically.
    expect(
      screen.getByRole('heading', { name: /keep your tickets/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /you pay for the tickets you use/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /not a fitness app/i })
    ).toBeInTheDocument();
  });

  test('describes each app screen for screen readers', () => {
    renderLanding();

    // Screens are decorative markup, so each phone carries the story in its
    // accessible name rather than leaving assistive tech with empty divs.
    const phones = screen
      .getAllByRole('img')
      .filter((el) => el.classList.contains('k-phone'));

    expect(phones).toHaveLength(4); // hero, chat, pledge, goal
    phones.forEach((el) => {
      expect(el).toHaveAccessibleName();
    });

    // The commitment card floats outside a phone frame but still narrates.
    expect(
      screen.getByRole('img', { name: /commit to completing 12 total workouts/i })
    ).toBeInTheDocument();

    // Purely decorative art stays out of the accessibility tree entirely.
    const deco = document.querySelector('.k-feature__deco');
    expect(deco).toHaveAttribute('aria-hidden', 'true');
    expect(deco).toHaveAttribute('alt', '');
  });
});

describe('SemiCircleArc', () => {
  test('draws a progress arc when there is progress', () => {
    const { container } = render(<SemiCircleArc progress={0.5} />);

    const progressPath = container.querySelector('.k-arc__progress');
    expect(progressPath).toBeInTheDocument();
    // Half of a 180° sweep ends at the top of the arc: cx=70, cy - r = 6.
    expect(progressPath.getAttribute('d')).toContain('70.00 6.00');
  });

  test('omits the progress arc at zero so no stray dot is painted', () => {
    const { container } = render(<SemiCircleArc progress={0} />);

    expect(container.querySelector('.k-arc__progress')).not.toBeInTheDocument();
    // The track is always drawn.
    expect(container.querySelectorAll('path')).toHaveLength(1);
  });

  test('clamps progress above 1 to a full sweep', () => {
    const { container } = render(<SemiCircleArc progress={4} />);

    // A full 180° sweep ends on the right edge: 134, 70.
    expect(container.querySelector('.k-arc__progress').getAttribute('d')).toContain(
      '134.00 70.00'
    );
  });
});

describe('useReveal', () => {
  function Probe() {
    const [ref, revealed] = useReveal();
    return (
      <div ref={ref} data-testid="probe">
        {revealed ? 'revealed' : 'hidden'}
      </div>
    );
  }

  test('starts revealed when IntersectionObserver is unavailable', () => {
    // jsdom has no IntersectionObserver — content must not be left hidden
    // behind an observer that can never fire.
    expect(window.IntersectionObserver).toBeUndefined();

    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('revealed');
  });

  test('starts hidden and reveals once observed as intersecting', () => {
    let trigger;
    const observe = jest.fn();
    const unobserve = jest.fn();
    const disconnect = jest.fn();

    global.IntersectionObserver = jest.fn((cb) => {
      trigger = cb;
      return { observe, unobserve, disconnect };
    });

    try {
      render(<Probe />);
      expect(screen.getByTestId('probe')).toHaveTextContent('hidden');
      expect(observe).toHaveBeenCalledTimes(1);

      const target = screen.getByTestId('probe');
      act(() => {
        trigger([{ isIntersecting: true, target }]);
      });

      expect(screen.getByTestId('probe')).toHaveTextContent('revealed');
      // One-shot: it stops observing so scrolling back up does not re-animate.
      expect(unobserve).toHaveBeenCalledWith(target);
    } finally {
      delete global.IntersectionObserver;
    }
  });

  test('stays hidden while the element is out of view', () => {
    let trigger;
    global.IntersectionObserver = jest.fn((cb) => {
      trigger = cb;
      return { observe: jest.fn(), unobserve: jest.fn(), disconnect: jest.fn() };
    });

    try {
      render(<Probe />);
      act(() => {
        trigger([{ isIntersecting: false, target: screen.getByTestId('probe') }]);
      });

      expect(screen.getByTestId('probe')).toHaveTextContent('hidden');
    } finally {
      delete global.IntersectionObserver;
    }
  });
});
