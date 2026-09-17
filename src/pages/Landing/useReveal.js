import { useEffect, useRef, useState } from 'react';

/**
 * Reveals an element the first time it scrolls into view, so sections arrive
 * with the same deliberate pacing as the in-app onboarding rather than all at
 * once.
 *
 * Degrades to "already revealed" when IntersectionObserver is unavailable
 * (jsdom under jest, older browsers). Content must never need an effect to
 * have run in order to be readable — the hook only adds motion, it never
 * gates text.
 *
 * Whether the reveal actually animates is decided in CSS, so
 * `prefers-reduced-motion: reduce` visitors get the final state instantly.
 */
export default function useReveal({
  threshold = 0.18,
  rootMargin = '0px 0px -8% 0px',
} = {}) {
  const ref = useRef(null);
  // Start revealed when we cannot observe — never hide content we can't un-hide.
  const [revealed, setRevealed] = useState(
    () => typeof IntersectionObserver === 'undefined'
  );

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return undefined;

    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setRevealed(true);
          // One-shot: sections don't re-animate on the way back up.
          observer.unobserve(entry.target);
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, revealed];
}
