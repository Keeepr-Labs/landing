import { useEffect, useState } from 'react';

/** True when the visitor asked the OS for less motion. Safe without matchMedia. */
export function prefersReducedMotion() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/**
 * Steps an integer from 0 to `steps` on a timer — the engine behind the
 * animated conversations and the live pacer, the pattern Wiz uses to show a
 * feature as a short looping scene rather than a paragraph.
 *
 * Returns the current step. Callers show item `i` when `step >= i`, so the
 * scene builds up one beat at a time. When `active` is false (the section
 * hasn't scrolled into view yet) it holds at 0; when the visitor prefers
 * reduced motion it returns `steps` immediately, so every beat is visible
 * and nothing ever waits on a timer to be readable.
 *
 * `stepMs` may be a number or a per-step array so a typing pause can run
 * longer than a reaction pop. After the last step it holds for `holdMs`,
 * then (if `loop`) resets to 0 and plays again.
 */
export default function useSequence({
  steps,
  stepMs = 900,
  holdMs = 3200,
  loop = true,
  active = true,
}) {
  const reduced = prefersReducedMotion();
  const [step, setStep] = useState(reduced ? steps : 0);

  useEffect(() => {
    if (reduced) {
      setStep(steps);
      return undefined;
    }
    if (!active) return undefined;

    let current = 0;
    let timer;
    setStep(0);

    const delayFor = (i) => (Array.isArray(stepMs) ? stepMs[i] ?? stepMs[stepMs.length - 1] : stepMs);

    const restart = () => {
      current = 0;
      setStep(0);
      timer = setTimeout(tick, delayFor(0));
    };

    const tick = () => {
      current += 1;
      setStep(current);
      if (current < steps) {
        timer = setTimeout(tick, delayFor(current));
      } else if (loop) {
        // The hold starts the moment the last beat lands.
        timer = setTimeout(restart, holdMs);
      }
    };

    timer = setTimeout(tick, delayFor(0));
    return () => clearTimeout(timer);
    // stepMs is intentionally read fresh via delayFor; an array literal in
    // deps would restart the scene on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, holdMs, loop, active, reduced]);

  return step;
}
