import { useEffect } from 'react';
import { prefersReducedMotion } from './useSequence';

/**
 * Scroll-linked drift for every `[data-parallax]` element — the value is the
 * fraction of the element's distance from viewport centre to translate by
 * (0.12 is gentle, 0.3 is a lot). Uses getBoundingClientRect so it does not
 * care which element is the scroll container (on this site it is `body`,
 * see CLAUDE.md), and listens in the capture phase so the body's scroll
 * events reach it.
 *
 * Off entirely for reduced-motion visitors and on touch devices, where
 * scroll-jacked decoration reads as jank rather than depth.
 */
export default function useParallax() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    if (typeof window === 'undefined') return undefined;
    const coarse = typeof window.matchMedia === 'function' && window.matchMedia('(hover: none)').matches;
    if (coarse) return undefined;

    const nodes = Array.from(document.querySelectorAll('[data-parallax]'));
    if (nodes.length === 0) return undefined;

    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = window.innerHeight / 2;
      nodes.forEach((el) => {
        const factor = parseFloat(el.dataset.parallax) || 0;
        const r = el.getBoundingClientRect();
        // Skip far-offscreen work; the drift resets as it scrolls back in.
        if (r.bottom < -400 || r.top > window.innerHeight + 400) return;
        const offset = (mid - (r.top + r.height / 2)) * factor;
        el.style.setProperty('--py', `${offset.toFixed(1)}px`);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true });
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
      nodes.forEach((el) => el.style.removeProperty('--py'));
    };
  }, []);
}
