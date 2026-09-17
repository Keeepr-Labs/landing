import { render, screen, act, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from './Landing';
import { SemiCircleArc, PACE_TIERS, LEADERBOARD, ROUNDS } from './AppScreens';
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

  test('carries no trace of the retired pledge-ticket model', () => {
    const { container } = renderLanding();

    // The business moved from pledge tickets to a subscription. Nothing on
    // the page — visible copy, aria-labels, or screen internals — may still
    // sell stakes, tickets or money on the line.
    const everything = (container.textContent + ' ' +
      Array.from(container.querySelectorAll('[aria-label]'))
        .map((el) => el.getAttribute('aria-label'))
        .join(' ')).toLowerCase();

    expect(everything).not.toMatch(/pledge/);
    expect(everything).not.toMatch(/ticket/);
    expect(everything).not.toMatch(/adiós/);
    expect(everything).not.toMatch(/money where your mouth/);
    expect(everything).not.toMatch(/💸/);
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

  test('tells the accountability story end to end', () => {
    renderLanding();

    // Section titles only — step titles (h3) reuse some of the same words.
    const heading = (re) => screen.getByRole('heading', { level: 2, name: re });
    expect(heading(/two, not so secret, ingredients/i)).toBeInTheDocument();
    expect(heading(/put it out there/i)).toBeInTheDocument();
    expect(heading(/bring someone/i)).toBeInTheDocument();
    expect(heading(/specific number, by a specific date/i)).toBeInTheDocument();
    expect(heading(/we do the work of bringing the data/i)).toBeInTheDocument();
    expect(heading(/best-studied levers/i)).toBeInTheDocument();
    expect(heading(/always committed/i)).toBeInTheDocument();
    expect(heading(/not a fitness app/i)).toBeInTheDocument();
  });

  test('cites its science with a source on every study', () => {
    renderLanding();

    const list = screen.getByRole('heading', { name: /best-studied levers/i }).parentElement;
    const cites = within(list).getAllByText(/\b(19|20)\d{2}\b/);
    // Four study cards, each ending in a year — no orphan statistics.
    expect(cites).toHaveLength(4);
  });

  test('describes each app screen and visual for screen readers', () => {
    renderLanding();

    const phones = screen
      .getAllByRole('img')
      .filter((el) => el.classList.contains('k-phone'));

    expect(phones).toHaveLength(3); // hero, chat, goal
    phones.forEach((el) => {
      expect(el).toHaveAccessibleName();
    });

    // Standalone visuals narrate themselves too.
    expect(screen.getByRole('img', { name: /commit to completing 12 total workouts/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /leaderboard: mara first/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /flow through apple health/i })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /four monthly rounds/i })).toBeInTheDocument();

    // Purely decorative art stays out of the accessibility tree entirely.
    const deco = document.querySelector('.k-feature__deco');
    expect(deco).toHaveAttribute('aria-hidden', 'true');
    expect(deco).toHaveAttribute('alt', '');
  });

  test('mentions the subscription only as a fact, never a price we do not know', () => {
    renderLanding();

    expect(screen.getByText(/simple subscription/i)).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(screen.queryByText(/free trial/i)).not.toBeInTheDocument();
  });
});

describe('pace copy', () => {
  test('never talks about money', () => {
    Object.values(PACE_TIERS).forEach((tier) => {
      expect(tier.message.toLowerCase()).not.toMatch(/pledge|ticket|money|\$|💸/);
    });
  });
});

describe('demo data', () => {
  test('leaderboard is sorted by workouts done, with the viewer marked', () => {
    const done = LEADERBOARD.map((p) => p.done);
    expect(done).toEqual([...done].sort((a, b) => b - a));
    expect(LEADERBOARD.filter((p) => p.you)).toHaveLength(1);
  });

  test('rounds show completed goals as completed and the live round in progress', () => {
    ROUNDS.filter((r) => r.state === 'done').forEach((r) => expect(r.done).toBe(r.total));
    const live = ROUNDS.find((r) => r.state === 'live');
    expect(live.done).toBeLessThan(live.total);
    expect(ROUNDS.find((r) => r.state === 'next').total).toBeNull();
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
