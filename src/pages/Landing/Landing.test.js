import React from 'react';
import { render, screen, act, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from './Landing';
import {
  SemiCircleArc,
  PACE_TIERS,
  LEADERBOARD,
  ROUNDS,
  ChatSequence,
  WORKOUT_BEATS,
  Photo,
} from './AppScreens';
import useReveal from './useReveal';
import useSequence from './useSequence';
import useParallax from './useParallax';

const renderLanding = () =>
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );

/** Swap window.matchMedia for one that answers `reduce` as given. */
function withReducedMotion(reduce, fn) {
  const original = window.matchMedia;
  window.matchMedia = (query) => ({
    matches: /prefers-reduced-motion/.test(query) ? reduce : false,
    media: query,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
  try {
    return fn();
  } finally {
    window.matchMedia = original;
  }
}

describe('Landing page', () => {
  test('leads with the value proposition, not a waitlist signup', () => {
    renderLanding();
    expect(screen.getByRole('heading', { level: 1, name: /stick to it/i })).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/enter your email/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /waitlist/i })).not.toBeInTheDocument();
  });

  test('carries no trace of the retired pledge-ticket model', () => {
    const { container } = renderLanding();
    const everything = (
      container.textContent +
      ' ' +
      Array.from(container.querySelectorAll('[aria-label]'))
        .map((el) => el.getAttribute('aria-label'))
        .join(' ')
    ).toLowerCase();
    expect(everything).not.toMatch(/pledge/);
    expect(everything).not.toMatch(/ticket/);
    expect(everything).not.toMatch(/adiós/);
    expect(everything).not.toMatch(/money where your mouth/);
    expect(everything).not.toMatch(/💸/);
  });

  test('keeps every line of supporting copy to one line', () => {
    const { container } = renderLanding();
    // Opal-grade restraint: each section is a headline plus at most one
    // short line. Anything longer than ~120 characters is a paragraph.
    const lines = Array.from(container.querySelectorAll('.k-line'));
    expect(lines.length).toBeGreaterThanOrEqual(8);
    lines.forEach((el) => {
      const text = el.textContent.trim();
      expect(text.length).toBeGreaterThan(0);
      expect(text.length).toBeLessThanOrEqual(120);
    });
  });

  test('primary CTA links to the live App Store listing', () => {
    renderLanding();
    const ctas = screen
      .getAllByRole('link')
      .filter((a) => a.getAttribute('href') === 'https://apps.apple.com/app/id6471142186');
    expect(ctas.length).toBeGreaterThanOrEqual(2);
    ctas.forEach((cta) => expect(cta).toHaveAttribute('rel', expect.stringContaining('noopener')));
  });

  test('keeps an Android path to the waitlist page', () => {
    renderLanding();
    const links = screen.getAllByRole('link', { name: /get in line for it/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute('href', '/waitlistAndroid');
  });

  test('tells the accountability story end to end', () => {
    renderLanding();
    const h2 = (re) => screen.getByRole('heading', { level: 2, name: re });
    expect(h2(/two, not so secret, ingredients/i)).toBeInTheDocument();
    expect(h2(/put it out there/i)).toBeInTheDocument();
    expect(h2(/bring someone/i)).toBeInTheDocument();
    expect(h2(/a number, a date, your name on it/i)).toBeInTheDocument();
    expect(h2(/the board doesn't lie/i)).toBeInTheDocument();
    expect(h2(/we do the data/i)).toBeInTheDocument();
    expect(h2(/best-studied levers/i)).toBeInTheDocument();
    expect(h2(/always in/i)).toBeInTheDocument();
    expect(h2(/not a fitness app/i)).toBeInTheDocument();
  });

  test('cites a source and an institution behind every study', () => {
    renderLanding();
    const list = screen.getByRole('heading', { name: /best-studied levers/i }).parentElement;
    expect(within(list).getAllByText(/\b(19|20)\d{2}\b/)).toHaveLength(3);
    const insts = screen.getByRole('list', { name: /institutions behind the cited research/i });
    expect(within(insts).getAllByRole('listitem')).toHaveLength(5);
  });

  test('describes each screen and visual for screen readers', () => {
    renderLanding();
    const phones = screen.getAllByRole('img').filter((el) => el.classList.contains('k-phone'));
    expect(phones).toHaveLength(4); // hero, share-a-workout, share-a-goal, goal setup
    phones.forEach((el) => expect(el).toHaveAccessibleName());

    expect(screen.getByRole('img', { name: /round-goal certificate/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /leaderboard: mara first/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /the pacer, cycling/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /flow through apple health/i })).toBeInTheDocument();
    expect(screen.getByRole('list', { name: /four monthly rounds/i })).toBeInTheDocument();

    const deco = document.querySelector('.k-feature__deco');
    expect(deco).toHaveAttribute('aria-hidden', 'true');
    expect(deco).toHaveAttribute('alt', '');
  });

  test('photo slots render a textured tile with a sourcing spec until a file is set', () => {
    const { container } = renderLanding();
    const empties = container.querySelectorAll('.k-photo--empty');
    expect(empties.length).toBe(4);
    empties.forEach((el) => expect(el.getAttribute('data-spec')).toMatch(/\d+px/));
    // Never an <img> with an empty src — that requests the page URL itself.
    expect(container.querySelectorAll('img[src=""]')).toHaveLength(0);
  });

  test('mentions the subscription only as a fact, never a price we do not know', () => {
    renderLanding();
    expect(screen.getByText(/simple subscription/i)).toBeInTheDocument();
    expect(screen.queryByText(/\$\d/)).not.toBeInTheDocument();
    expect(screen.queryByText(/free trial/i)).not.toBeInTheDocument();
  });
});

describe('Photo', () => {
  test('with a source it renders the image and drops the spec', () => {
    const { container } = render(<Photo slot="x" src="/images/chatGroup.png" alt="Two friends" emoji="🏃" spec="3:4" />);
    expect(screen.getByRole('img', { name: 'Two friends' })).toHaveAttribute('src', '/images/chatGroup.png');
    expect(container.querySelector('.k-photo--real')).toBeInTheDocument();
    expect(container.querySelector('[data-spec]')).not.toBeInTheDocument();
  });

  test('without a source it renders the emoji tile and keeps the alt text', () => {
    const { container } = render(<Photo slot="x" alt="Two friends" emoji="🏃" spec="3:4, 800px" />);
    expect(screen.getByRole('img', { name: 'Two friends' })).toHaveTextContent('🏃');
    expect(container.querySelector('.k-photo--empty')).toHaveAttribute('data-spec', '3:4, 800px');
    expect(container.querySelector('img')).not.toBeInTheDocument();
  });
});

describe('ChatSequence', () => {
  const items = (container) => Array.from(container.querySelectorAll('.k-seq__item'));

  test('shows beats up to the current step, and typing only while it is the step', () => {
    const { container } = render(<ChatSequence beats={WORKOUT_BEATS} step={1} />);
    const on = items(container).map((el) => el.classList.contains('is-on'));
    expect(on[0]).toBe(true); // Mara's message
    expect(on[1]).toBe(true); // Dani typing
    expect(on[2]).toBe(false); // the workout card, not yet
  });

  test('replaces the typing indicator with what it was typing', () => {
    const { container } = render(<ChatSequence beats={WORKOUT_BEATS} step={2} />);
    const on = items(container).map((el) => el.classList.contains('is-on'));
    expect(on[1]).toBe(false); // typing gone
    expect(on[2]).toBe(true); // card arrived
  });

  test('at the final step everything but typing is visible, and hidden beats are hidden from AT', () => {
    const { container } = render(<ChatSequence beats={WORKOUT_BEATS} step={WORKOUT_BEATS.length - 1} />);
    items(container).forEach((el, i) => {
      const typing = WORKOUT_BEATS[i].kind === 'typing';
      expect(el.classList.contains('is-on')).toBe(!typing);
      expect(el.getAttribute('aria-hidden')).toBe(typing ? 'true' : 'false');
    });
  });
});

describe('useSequence', () => {
  function Probe(props) {
    const step = useSequence(props);
    return <output>{step}</output>;
  }

  test('jumps to the final step immediately for reduced-motion visitors', () => {
    withReducedMotion(true, () => {
      render(<Probe steps={5} active />);
      expect(screen.getByRole('status')).toHaveTextContent('5');
    });
  });

  test('holds at zero until the section is active', () => {
    render(<Probe steps={5} active={false} />);
    expect(screen.getByRole('status')).toHaveTextContent('0');
  });

  test('steps on the timer, holds, then loops', () => {
    jest.useFakeTimers();
    try {
      render(<Probe steps={2} stepMs={100} holdMs={150} active />);
      expect(screen.getByRole('status')).toHaveTextContent('0');
      act(() => jest.advanceTimersByTime(100));
      expect(screen.getByRole('status')).toHaveTextContent('1');
      act(() => jest.advanceTimersByTime(100));
      expect(screen.getByRole('status')).toHaveTextContent('2');
      act(() => jest.advanceTimersByTime(150)); // hold
      expect(screen.getByRole('status')).toHaveTextContent('0');
      act(() => jest.advanceTimersByTime(100));
      expect(screen.getByRole('status')).toHaveTextContent('1');
    } finally {
      jest.useRealTimers();
    }
  });
});

describe('useParallax', () => {
  function Page() {
    useParallax();
    return <div data-parallax="0.2" data-testid="p" />;
  }

  test('does nothing for reduced-motion visitors', () => {
    withReducedMotion(true, () => {
      render(<Page />);
      expect(screen.getByTestId('p').style.getPropertyValue('--py')).toBe('');
    });
  });

  test('sets a drift on parallax elements otherwise', () => {
    render(<Page />);
    expect(screen.getByTestId('p').style.getPropertyValue('--py')).toMatch(/px$/);
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
  // Semicircle of radius (140-12)/2 = 64 → length π·64 ≈ 201.06.
  test('draws progress by dash offset so it can transition between states', () => {
    const { container } = render(<SemiCircleArc progress={0.5} />);
    const p = container.querySelector('.k-arc__progress');
    expect(p).toBeInTheDocument();
    expect(p.getAttribute('stroke-dasharray')).toBe('201.06');
    expect(p.getAttribute('stroke-dashoffset')).toBe('100.53');
    expect(p.getAttribute('data-progress')).toBe('0.500');
  });

  test('omits the progress arc at zero so no round-cap dot is painted', () => {
    const { container } = render(<SemiCircleArc progress={0} />);
    expect(container.querySelector('.k-arc__progress')).not.toBeInTheDocument();
    expect(container.querySelectorAll('path')).toHaveLength(1);
  });

  test('clamps progress above 1 to a full sweep', () => {
    const { container } = render(<SemiCircleArc progress={4} />);
    expect(container.querySelector('.k-arc__progress').getAttribute('stroke-dashoffset')).toBe('0.00');
  });
});

describe('useReveal', () => {
  function Probe() {
    const [ref, revealed] = useReveal();
    return <div ref={ref} data-testid="probe">{revealed ? 'revealed' : 'hidden'}</div>;
  }

  test('starts revealed when IntersectionObserver is unavailable', () => {
    expect(window.IntersectionObserver).toBeUndefined();
    render(<Probe />);
    expect(screen.getByTestId('probe')).toHaveTextContent('revealed');
  });

  test('starts hidden and reveals once observed as intersecting', () => {
    let trigger;
    const observe = jest.fn();
    const unobserve = jest.fn();
    global.IntersectionObserver = jest.fn((cb) => {
      trigger = cb;
      return { observe, unobserve, disconnect: jest.fn() };
    });
    try {
      render(<Probe />);
      expect(screen.getByTestId('probe')).toHaveTextContent('hidden');
      const target = screen.getByTestId('probe');
      act(() => trigger([{ isIntersecting: true, target }]));
      expect(screen.getByTestId('probe')).toHaveTextContent('revealed');
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
      act(() => trigger([{ isIntersecting: false, target: screen.getByTestId('probe') }]));
      expect(screen.getByTestId('probe')).toHaveTextContent('hidden');
    } finally {
      delete global.IntersectionObserver;
    }
  });
});
