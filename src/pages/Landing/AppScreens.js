import React from 'react';

/**
 * HTML/CSS recreations of the Keeep iOS screens, built from the real
 * component structure in the Keeep-mobile repo (`components/SemiCircleProgress`,
 * `components/GroupHeaderComponents/GroupProgress`, `components/Messages/*`,
 * `screens/onboarding/PersonalGoalRecap`) and the tokens in
 * `utils/ColorsAndFonts.ts`.
 *
 * They are markup rather than screenshots so they stay crisp at any density,
 * reflow on phones, and cost a few KB instead of a megabyte of PNGs. If you
 * later want pixel-exact Figma exports, each screen is a single component —
 * swap its body for an <img> and the page layout is unaffected.
 */

/* ---------------------------------------------------------------- pace model */

/**
 * The 5-tier pace scale from DESIGN.md. Pace is `workoutsLeft / daysLeft`:
 * the lower the ratio, the more comfortable you are.
 */
export const PACE_TIERS = {
  goalReached: {
    label: 'Goal reached',
    color: 'var(--green-accent-dark)',
    bg: 'var(--green-accent-bg)',
    message: "🤩🪩 Succeeeeesss! You've reached your goal for this round 🪩🤩",
  },
  goodPace: {
    label: 'On pace',
    color: 'var(--green-accent-dark)',
    bg: 'var(--green-accent-bg)',
    message:
      "🟢 You're on pace: Aim for a workout every 2 days or so to stay on the green",
  },
  gettingTight: {
    label: 'Getting tight',
    color: 'var(--yellow-accent-dark)',
    bg: 'var(--yellow-accent-bg)',
    message:
      '🟡 Getting tight on time: Plan for a few workouts in a row to get back on pace',
  },
  noRoomForError: {
    label: 'No room for error',
    color: 'var(--orange-accent-dark)',
    bg: 'var(--orange-accent-bg)',
    message: "🚨 No room for error: Miss a day and you'll lose your pledge",
  },
  dead: {
    label: 'Out of days',
    color: 'var(--red-accent-dark)',
    bg: 'var(--red-accent-bg)',
    message: '🔴 You ran out of days for this round. Ciao ciao pledged tickets 💸',
  },
  noWorkouts: {
    label: 'Not started',
    color: 'var(--grey-600)',
    bg: 'var(--grey-100)',
    message: 'No workouts shared yet. Time to get that beautiful 🍑 moving!',
  },
};

/* ------------------------------------------------------------ semicircle arc */

/**
 * Same geometry as `SemiCircleProgress` in the app: a 180° arc swept left to
 * right, `progress` clamped to 0..1.
 */
export function SemiCircleArc({
  progress = 0,
  size = 140,
  strokeWidth = 12,
  progressColor = 'var(--green-accent-dark)',
  trackColor = 'var(--primary-light)',
}) {
  const clamped = Math.min(Math.max(progress, 0), 1);
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const startX = strokeWidth / 2;

  const trackPath = `M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`;

  const angle = clamped * Math.PI;
  const endX = cx - radius * Math.cos(angle);
  const endY = cy - radius * Math.sin(angle);
  const progressPath =
    clamped > 0
      ? `M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${endX.toFixed(2)} ${endY.toFixed(2)}`
      : '';

  return (
    // Height is halved: the bottom half of the box is empty by construction.
    <svg
      className="k-arc"
      width={size}
      height={size / 2 + strokeWidth / 2}
      viewBox={`0 0 ${size} ${size / 2 + strokeWidth / 2}`}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d={trackPath}
        fill="none"
        stroke={trackColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {progressPath ? (
        <path
          className="k-arc__progress"
          d={progressPath}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ) : null}
    </svg>
  );
}

/* ----------------------------------------------------------------- the frame */

/**
 * Phone chrome. `label` is what a screen reader announces in place of the
 * decorative UI inside, so the story still reads with images off.
 */
export function PhoneFrame({ label, tone = 'light', className = '', children }) {
  return (
    <div className={`k-phone k-phone--${tone} ${className}`.trim()} role="img" aria-label={label}>
      <div className="k-phone__frame">
        <div className="k-phone__notch" aria-hidden="true" />
        <div className="k-phone__screen" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- screen: you */

/** The group header — the app's signature screen. Arc + pace + stakes. */
export function ProgressScreen({
  completed = 8,
  goal = 12,
  daysLeft = 9,
  tickets = 2,
  ticketValue = '$20',
  tier = 'goodPace',
}) {
  const pace = PACE_TIERS[tier];
  return (
    <div className="k-screen k-screen--progress">
      <div className="k-screen__card k-screen__card--top">
        <p className="k-screen__eyebrow">you</p>

        <div className="k-arcwrap">
          <SemiCircleArc
            progress={goal > 0 ? completed / goal : 0}
            progressColor={pace.color}
          />
          <div className="k-arcwrap__overlay">
            <p className="k-arcwrap__count">
              <span className="k-arcwrap__done">{completed}</span>
              <span className="k-arcwrap__sep">/</span>
              <span className="k-arcwrap__goal">{goal}</span>
            </p>
            <p className="k-arcwrap__label">Workouts</p>
          </div>
        </div>

        <p className="k-pacemeter" style={{ background: pace.bg, color: pace.color }}>
          {pace.message}
        </p>

        <div className="k-counters">
          <div className="k-counter">
            <span className="k-counter__icon" aria-hidden="true">⏱</span>
            <span className="k-counter__num">{daysLeft}</span>
            <span className="k-counter__text">
              <span className="k-counter__main">days</span>
              <span className="k-counter__sub">left</span>
            </span>
          </div>
          <div className="k-counter">
            <span className="k-counter__icon" aria-hidden="true">🎟️</span>
            <span className="k-counter__num">{tickets}</span>
            <span className="k-counter__text">
              <span className="k-counter__main">tickets pledged</span>
              <span className="k-counter__sub">{ticketValue}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="k-screen__card k-screen__card--bottom">
        <p className="k-screen__eyebrow k-screen__eyebrow--dark">in this chat</p>
        <ul className="k-people">
          {[
            { name: 'You', done: 8, goal: 12, tier: 'goodPace', emoji: '🏃' },
            { name: 'Mara', done: 11, goal: 12, tier: 'goalReached', emoji: '🧘' },
            { name: 'Dani', done: 5, goal: 12, tier: 'gettingTight', emoji: '🚴' },
            { name: 'Tom', done: 2, goal: 12, tier: 'noRoomForError', emoji: '🏋️' },
            { name: 'Priya', done: 7, goal: 12, tier: 'goodPace', emoji: '🏊' },
            { name: 'Leo', done: 0, goal: 12, tier: 'dead', emoji: '🛋️' },
          ].map((p) => (
            <li className="k-person" key={p.name}>
              <span className="k-person__avatar" aria-hidden="true">{p.emoji}</span>
              <span className="k-person__name">{p.name}</span>
              <span
                className="k-person__dot"
                style={{ background: PACE_TIERS[p.tier].color }}
              />
              <span className="k-person__count">
                {p.done}/{p.goal}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- screen: chat */

/** Group chat with a shared workout — the Arena in motion. */
export function ChatScreen() {
  return (
    <div className="k-screen k-screen--chat">
      <div className="k-chat__header">
        <span className="k-chat__title">-Sunday Runners-</span>
        <span className="k-chat__meta">9 days left</span>
      </div>

      <div className="k-chat__body">
        <div className="k-msg k-msg--in">
          <span className="k-msg__who">Mara</span>
          <p className="k-msg__text">ok who's running before work tomorrow 👀</p>
        </div>

        {/* NewWorkoutMessage: image + dark overlay, overline, metrics grid */}
        <div className="k-workout">
          <div className="k-workout__overlay">
            <p className="k-workout__overline">New workout</p>
            <p className="k-workout__who">Dani</p>
          </div>
          <div className="k-workout__metrics">
            <span className="k-workout__badge">✓ Device data</span>
            <div className="k-workout__grid">
              <div>
                <p className="k-workout__label">Source</p>
                <p className="k-workout__value">Apple Health</p>
              </div>
              <div>
                <p className="k-workout__label">Duration</p>
                <p className="k-workout__value">42 min</p>
              </div>
              <div>
                <p className="k-workout__label">Type</p>
                <p className="k-workout__value">Outdoor run</p>
              </div>
              <div>
                <p className="k-workout__label">Distance</p>
                <p className="k-workout__value">6.4 km</p>
              </div>
            </div>
          </div>
          <div className="k-workout__reactions">
            <span>🔥 3</span>
            <span>👏 2</span>
          </div>
        </div>

        <div className="k-msg k-msg--out">
          <p className="k-msg__text">fine. 7am. don't make me regret this</p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- screen: commitment */

/**
 * The metallic commitment card from `PersonalGoalRecap`. DESIGN.md reserves
 * this treatment for the rare high-impact moment, so it is the one loud
 * object on the page.
 */
export function CommitmentCard({ name = 'ALEX', total = 12, date = 'March 31' }) {
  return (
    <div className="k-commit">
      <div className="k-commit__sheen" aria-hidden="true" />
      <p className="k-commit__overline">I, {name}, commit to completing:</p>
      <p className="k-commit__number">{total}</p>
      <p className="k-commit__unit">total workouts</p>
      <div className="k-commit__rule" />
      <p className="k-commit__overline k-commit__overline--by">by:</p>
      <p className="k-commit__date">
        <span aria-hidden="true">🗓️ </span>
        {date}
      </p>
    </div>
  );
}

/** The same card, framed as a full screen. */
export function CommitmentScreen(props) {
  return (
    <div className="k-screen k-screen--commit">
      <CommitmentCard {...props} />
      <p className="k-commit__caption">Signed, sealed, and visible to everyone.</p>
    </div>
  );
}

/* ------------------------------------------------------------ screen: pledge */

/**
 * Pledge tickets — the stakes, stated plainly. `ticketValue` is the worth of
 * one ticket; the round total is the sum, so the two numbers agree with the
 * "2 tickets pledged / $20" counter on the group header screen.
 */
export function PledgeScreen({ tickets = 2, ticketValue = 10, currency = '$' }) {
  return (
    <div className="k-screen k-screen--pledge">
      <p className="k-pledge__overline">Everyone has to pledge</p>

      <div className="k-tickets">
        {Array.from({ length: tickets }).map((_, i) => (
          <div className="k-ticket" key={i} style={{ '--n': i }}>
            <div className="k-ticket__stub">
              <span className="k-ticket__emoji" aria-hidden="true">🎟️</span>
            </div>
            <div className="k-ticket__body">
              <p className="k-ticket__label">Pledge ticket</p>
              <p className="k-ticket__worth">
                Worth {currency}
                {ticketValue}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="k-pledge__total">
        <span className="k-pledge__total-label">Pledged this round</span>
        <span className="k-pledge__total-value">
          {currency}
          {tickets * ticketValue}
        </span>
      </div>

      <div className="k-pledge__stakes">
        <p className="k-pledge__line">
          Stick to your goal, <strong>keep your tickets.</strong>
        </p>
        <p className="k-pledge__line k-pledge__line--muted">Don't, adiós 💸</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- screen: goal setting */

/** Pace picker from `PersonalGoalShowcase` — the 2-minute setup. */
export function GoalScreen({ perWeek = 3, total = 12 }) {
  return (
    <div className="k-screen k-screen--goal">
      <p className="k-goal__title">How does this look?</p>
      <p className="k-goal__sub">Tweak your average pace if needed</p>

      <div className="k-goal__total">
        <p className="k-goal__number">{total}</p>
        <p className="k-goal__unit">total workouts</p>
      </div>

      <div className="k-goal__pacer">
        <p className="k-goal__overline">Set your pace</p>
        <div className="k-goal__stepper">
          <span className="k-goal__btn" aria-hidden="true">−</span>
          <span className="k-goal__value">
            {perWeek}
            <span className="k-goal__per">/week</span>
          </span>
          <span className="k-goal__btn" aria-hidden="true">+</span>
        </div>
        <div className="k-goal__bars" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => (
            <span className={`k-goal__bar${i < perWeek ? ' is-on' : ''}`} key={i} />
          ))}
        </div>
      </div>

      <p className="k-goal__note">
        That's about {perWeek} workouts a week. Changed your mind? Adjust it any
        time before the round starts.
      </p>

      <div className="k-goal__button">Continue</div>
    </div>
  );
}
