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
 *
 * Copy is the coach voice — real, never patronising — and, since the model
 * moved to a subscription, it talks about the round, never about money.
 * The app's `getProgressMessage` strings should be brought in line with
 * these when the pledge flow is removed there.
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
    message: '🚨 No room for error: One a day from here, or this round slips',
  },
  dead: {
    label: 'Out of days',
    color: 'var(--red-accent-dark)',
    bg: 'var(--red-accent-bg)',
    message: "🔴 Ran out of days this round. New month, new goal — let's go again",
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

/* ------------------------------------------------------------ the leaderboard */

/** The group, ranked by workouts done. `you` marks the viewer's row. */
export const LEADERBOARD = [
  { name: 'Mara', done: 11, goal: 12, tier: 'goalReached', emoji: '🧘' },
  { name: 'You', done: 8, goal: 12, tier: 'goodPace', emoji: '🏃', you: true },
  { name: 'Priya', done: 7, goal: 12, tier: 'goodPace', emoji: '🏊' },
  { name: 'Dani', done: 5, goal: 12, tier: 'gettingTight', emoji: '🚴' },
  { name: 'Tom', done: 2, goal: 12, tier: 'noRoomForError', emoji: '🏋️' },
  { name: 'Leo', done: 0, goal: 12, tier: 'dead', emoji: '🛋️' },
];

const MEDALS = ['🥇', '🥈', '🥉'];

export function Leaderboard({ rows = LEADERBOARD, compact = false }) {
  return (
    <ul className={`k-people${compact ? ' k-people--compact' : ''}`}>
      {rows.map((p, i) => (
        <li className={`k-person${p.you ? ' k-person--you' : ''}`} key={p.name}>
          <span className="k-person__rank" aria-hidden="true">
            {MEDALS[i] || i + 1}
          </span>
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
  );
}

/* ---------------------------------------------------------------- screen: you */

/** The group header — the app's signature screen. Arc + pace + leaderboard. */
export function ProgressScreen({
  completed = 8,
  goal = 12,
  daysLeft = 9,
  rank = 2,
  of = 6,
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
            <span className="k-counter__icon" aria-hidden="true">🏆</span>
            <span className="k-counter__num">#{rank}</span>
            <span className="k-counter__text">
              <span className="k-counter__main">on the board</span>
              <span className="k-counter__sub">of {of}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="k-screen__card k-screen__card--bottom">
        <p className="k-screen__eyebrow k-screen__eyebrow--dark">leaderboard</p>
        <Leaderboard compact />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- screen: chat */

/** Group chat with a shared workout — the side quest in motion. */
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

        {/* NewWorkoutMessage: image + dark overlay, overline, metrics grid.
            Synced straight from Apple Health — nobody typed this in. */}
        <div className="k-workout">
          <div className="k-workout__overlay">
            <p className="k-workout__overline">New workout</p>
            <p className="k-workout__who">Dani</p>
          </div>
          <div className="k-workout__metrics">
            <span className="k-workout__badge">✓ Apple Health</span>
            <div className="k-workout__grid">
              <div>
                <p className="k-workout__label">Type</p>
                <p className="k-workout__value">Outdoor run</p>
              </div>
              <div>
                <p className="k-workout__label">Duration</p>
                <p className="k-workout__value">42 min</p>
              </div>
              <div>
                <p className="k-workout__label">Distance</p>
                <p className="k-workout__value">6.4 km</p>
              </div>
              <div>
                <p className="k-workout__label">This round</p>
                <p className="k-workout__value">6 / 12</p>
              </div>
            </div>
          </div>
          <div className="k-workout__reactions">
            <span>🔥 3</span>
            <span>👏 2</span>
            <span>😮‍💨 1</span>
          </div>
        </div>

        <div className="k-msg k-msg--in">
          <span className="k-msg__who">Mara</span>
          <p className="k-msg__text">that puts you one behind me dani 😏</p>
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
 * The commitment badge from `PersonalGoalRecap`: a specific number, by a
 * specific date, with your name on it. DESIGN.md reserves the metallic
 * treatment for the rare high-impact moment, so it is the one loud object
 * on the page.
 */
export function CommitmentCard({ name = 'ALEX', total = 12, date = 'March 31', size = 'md' }) {
  return (
    <div className={`k-commit k-commit--${size}`}>
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

/* ------------------------------------------------------- screen: goal setting */

/** Pace picker from `PersonalGoalShowcase` — the minute-long setup. */
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

/* ------------------------------------------------------------ visual: syncing */

/** Every kind of workout, pouring through Apple Health into the chat. */
export const WORKOUT_KINDS = [
  { emoji: '🏃', name: 'Run' },
  { emoji: '🚴', name: 'Ride' },
  { emoji: '🏊', name: 'Swim' },
  { emoji: '🏋️', name: 'Lift' },
  { emoji: '🧘', name: 'Yoga' },
  { emoji: '🥾', name: 'Hike' },
  { emoji: '🥊', name: 'Box' },
  { emoji: '🚣', name: 'Row' },
  { emoji: '⛷️', name: 'Ski' },
  { emoji: '🏸', name: 'Play' },
  { emoji: '🧗', name: 'Climb' },
  { emoji: '🚶', name: 'Walk' },
];

export function SyncVisual() {
  return (
    <div
      className="k-sync"
      role="img"
      aria-label="Twelve kinds of workout — running, cycling, swimming, lifting, yoga, hiking, boxing, rowing, skiing, racket sports, climbing and walking — flow through Apple Health and land in the Keeep chat as a shared workout."
    >
      <div className="k-sync__sources" aria-hidden="true">
        {WORKOUT_KINDS.map((k, i) => (
          <span className="k-sync__chip" key={k.name} style={{ '--i': i }}>
            <span className="k-sync__emoji">{k.emoji}</span>
            {k.name}
          </span>
        ))}
      </div>

      <div className="k-sync__flow" aria-hidden="true">
        <span className="k-sync__arrow" />
        <div className="k-sync__hub">
          <span className="k-sync__heart">❤️</span>
          <span className="k-sync__hublabel">Apple Health</span>
        </div>
        <span className="k-sync__arrow" />
      </div>

      <div className="k-sync__dest" aria-hidden="true">
        <div className="k-workout k-workout--mini">
          <div className="k-workout__overlay">
            <p className="k-workout__overline">New workout</p>
            <p className="k-workout__who">You</p>
          </div>
          <div className="k-workout__metrics">
            <span className="k-workout__badge">✓ Apple Health</span>
            <div className="k-workout__grid">
              <div>
                <p className="k-workout__label">Type</p>
                <p className="k-workout__value">Strength</p>
              </div>
              <div>
                <p className="k-workout__label">Duration</p>
                <p className="k-workout__value">51 min</p>
              </div>
            </div>
          </div>
          <div className="k-workout__reactions">
            <span>💪 4</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- visual: rounds */

/** A new goal every round. Life changes; the commitment doesn't. */
export const ROUNDS = [
  { month: 'January', total: 12, done: 12, state: 'done' },
  { month: 'February', total: 8, done: 8, state: 'done', note: 'busy month, smaller goal' },
  { month: 'March', total: 10, done: 7, state: 'live', note: '3 to go, 9 days left' },
  { month: 'April', total: null, done: 0, state: 'next' },
];

export function RoundsStrip() {
  return (
    <ol
      className="k-rounds"
      aria-label="Four monthly rounds: January, 12 workouts, done. February, 8 workouts, done — a busy month, so a smaller goal. March, 7 of 10 so far, on pace. April, next round, set your goal."
    >
      {ROUNDS.map((r) => (
        <li className={`k-round k-round--${r.state}`} key={r.month} aria-hidden="true">
          <p className="k-round__month">{r.month}</p>
          {r.state === 'next' ? (
            <p className="k-round__number k-round__number--next">?</p>
          ) : (
            <p className="k-round__number">
              {r.state === 'live' ? `${r.done}/${r.total}` : r.total}
            </p>
          )}
          <p className="k-round__unit">
            {r.state === 'next' ? 'set your goal' : 'workouts'}
          </p>
          <p className="k-round__state">
            {r.state === 'done' && '✅ Done'}
            {r.state === 'live' && '🟢 On pace'}
            {r.state === 'next' && '🗓️ Next round'}
          </p>
          {r.note ? <p className="k-round__note">{r.note}</p> : null}
        </li>
      ))}
    </ol>
  );
}
