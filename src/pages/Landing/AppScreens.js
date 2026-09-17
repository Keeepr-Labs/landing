import React from 'react';

/**
 * HTML/CSS recreations of the Keeep iOS screens, built from the real
 * component structure in the Keeep-mobile repo (`components/SemiCircleProgress`,
 * `components/GroupHeaderComponents/GroupProgress`, `components/Messages/*`,
 * `screens/onboarding/PersonalGoalShowcase`) and the tokens in
 * `utils/ColorsAndFonts.ts`.
 *
 * Screens are markup, not screenshots: crisp at any density, reflow on
 * phones, a few KB. Every scene is driven by a `step` prop so a section can
 * play it as a short loop (see useSequence) while tests render it at rest.
 * Swap any component body for an <img> if you get Figma exports.
 */

/* ---------------------------------------------------------------- pace model */

/**
 * The 5-tier pace scale from DESIGN.md. Pace is `workoutsLeft / daysLeft`.
 * Coach voice, no money — the app's `getProgressMessage` should follow.
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
    message: "🟢 You're on pace: a workout every 2 days or so keeps you on the green",
  },
  gettingTight: {
    label: 'Getting tight',
    color: 'var(--yellow-accent-dark)',
    bg: 'var(--yellow-accent-bg)',
    message: '🟡 Getting tight: a few workouts in a row gets you back on pace',
  },
  noRoomForError: {
    label: 'No room for error',
    color: 'var(--orange-accent-dark)',
    bg: 'var(--orange-accent-bg)',
    message: '🚨 No room for error: one a day from here, or this round slips',
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
 * Same geometry as `SemiCircleProgress`: a 180° arc swept left to right.
 * Progress is drawn with stroke-dashoffset rather than a recomputed path so
 * it can *transition* between states — the live pacer morphs, the hero
 * arc draws in. Length of a semicircle of radius r is πr.
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
  const cy = size / 2;
  const startX = strokeWidth / 2;
  const length = Math.PI * radius;
  const path = `M ${startX} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`;

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
      <path d={path} fill="none" stroke={trackColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      {clamped > 0 ? (
        // At zero the path is omitted: a round cap on a zero-length dash
        // would still paint a dot.
        <path
          className="k-arc__progress"
          d={path}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={length.toFixed(2)}
          strokeDashoffset={(length * (1 - clamped)).toFixed(2)}
          data-progress={clamped.toFixed(3)}
        />
      ) : null}
    </svg>
  );
}

/* ----------------------------------------------------------------- the frame */

/**
 * iPhone chrome: Dynamic Island, side buttons, glass highlight, layered
 * shadow. `label` is what a screen reader gets in place of the decorative
 * UI inside; `tilt` adds a slight perspective for hero placement.
 */
export function PhoneFrame({ label, tone = 'light', tilt = false, className = '', children }) {
  return (
    <div
      className={`k-phone k-phone--${tone}${tilt ? ' k-phone--tilt' : ''} ${className}`.trim()}
      role="img"
      aria-label={label}
    >
      <div className="k-phone__frame">
        <span className="k-phone__btn k-phone__btn--mute" aria-hidden="true" />
        <span className="k-phone__btn k-phone__btn--vol-up" aria-hidden="true" />
        <span className="k-phone__btn k-phone__btn--vol-down" aria-hidden="true" />
        <span className="k-phone__btn k-phone__btn--power" aria-hidden="true" />
        <div className="k-phone__screen" aria-hidden="true">
          <div className="k-phone__island" />
          {children}
          <div className="k-phone__glass" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ the leaderboard */

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
          <span className="k-person__rank" aria-hidden="true">{MEDALS[i] || i + 1}</span>
          <span className="k-person__avatar" aria-hidden="true">{p.emoji}</span>
          <span className="k-person__name">{p.name}</span>
          <span className="k-person__dot" style={{ background: PACE_TIERS[p.tier].color }} />
          <span className="k-person__count">{p.done}/{p.goal}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------- screen: you */

/** The group header — arc, pace, rank, leaderboard. */
export function ProgressScreen({ completed = 8, goal = 12, daysLeft = 9, rank = 2, of = 6, tier = 'goodPace' }) {
  const pace = PACE_TIERS[tier];
  return (
    <div className="k-screen k-screen--progress">
      <div className="k-screen__card k-screen__card--top">
        <p className="k-screen__eyebrow">you</p>
        <div className="k-arcwrap">
          <SemiCircleArc progress={goal > 0 ? completed / goal : 0} progressColor={pace.color} />
          <div className="k-arcwrap__overlay">
            <p className="k-arcwrap__count">
              <span className="k-arcwrap__done">{completed}</span>
              <span className="k-arcwrap__sep">/</span>
              <span className="k-arcwrap__goal">{goal}</span>
            </p>
            <p className="k-arcwrap__label">Workouts</p>
          </div>
        </div>
        <p className="k-pacemeter" style={{ background: pace.bg, color: pace.color }}>{pace.message}</p>
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

/* ------------------------------------------------------- the goal certificate */

/**
 * The goal badge, per `PersonalGoalShowcase`: a certificate on
 * primaryLightest3 with a dashed outer border and a fine inner frame, the
 * brand scribble showing through, a date chip and the days-until line.
 */
export function GoalCertificate({ name = 'Alex', total = 12, date = 'March 31', daysUntil = 27, size = 'md' }) {
  return (
    <div className={`k-cert k-cert--${size}`}>
      <div className="k-cert__inner">
        <p className="k-cert__title">Round goal</p>
        <p className="k-cert__commit">I, {name}, commit to completing:</p>
        <p className="k-cert__number">{total}</p>
        <p className="k-cert__unit">total workouts</p>
        <div className="k-cert__rule" />
        <p className="k-cert__by">By</p>
        <p className="k-cert__date">
          <span aria-hidden="true">🗓️ </span>
          {date}
        </p>
        <p className="k-cert__days">{daysUntil} days until deadline</p>
      </div>
    </div>
  );
}

/* --------------------------------------------------------- animated chat scene */

/**
 * A conversation that plays beat by beat. Each beat is one of:
 *   in / out    — a bubble (in = friend, out = you)
 *   typing      — the three-dot indicator; shown only while it is the current step
 *   workout     — a NewWorkoutMessage card
 *   goal        — a GoalCertificate posted to the chat
 *   reactions   — a row of reactions attached under the previous card
 *   system      — a centred system line (e.g. someone joined)
 * A beat with index i is visible once `step >= i`; typing is visible only
 * while `step === i`, so it gets replaced by what it was typing.
 */
export const WORKOUT_BEATS = [
  { kind: 'in', who: 'Mara', text: "who's running before work tomorrow 👀" },
  { kind: 'typing', who: 'Dani' },
  { kind: 'workout', who: 'Dani', type: 'Outdoor run', duration: '42 min', distance: '6.4 km', round: '6 / 12' },
  { kind: 'reactions', items: ['🔥 3', '👏 2'] },
  { kind: 'in', who: 'Mara', text: 'that puts you one behind me 😏' },
  { kind: 'typing', who: 'You' },
  { kind: 'out', text: "fine. 7am. don't make me regret this" },
];

export const GOAL_BEATS = [
  { kind: 'system', text: 'Priya just joined the group chat' },
  { kind: 'typing', who: 'Priya' },
  { kind: 'goal', who: 'Priya', total: 10, date: 'April 30', daysUntil: 29 },
  { kind: 'reactions', items: ['💪 4', '🫡 1'] },
  { kind: 'in', who: 'Tom', text: '10?? ok then. mine goes up to 12' },
  { kind: 'out', text: "we'll see about that 🥉" },
];

function TypingBubble({ who }) {
  return (
    <div className="k-msg k-msg--in k-msg--typing">
      {who ? <span className="k-msg__who">{who}</span> : null}
      <span className="k-typing" aria-hidden="true">
        <i /><i /><i />
      </span>
    </div>
  );
}

function WorkoutCard({ who, type, duration, distance, round, mini = false }) {
  return (
    <div className={`k-workout${mini ? ' k-workout--mini' : ''}`}>
      <div className="k-workout__overlay">
        <p className="k-workout__overline">New workout</p>
        <p className="k-workout__who">{who}</p>
      </div>
      <div className="k-workout__metrics">
        <span className="k-workout__badge">✓ Apple Health</span>
        <div className="k-workout__grid">
          <div><p className="k-workout__label">Type</p><p className="k-workout__value">{type}</p></div>
          <div><p className="k-workout__label">Duration</p><p className="k-workout__value">{duration}</p></div>
          {distance ? <div><p className="k-workout__label">Distance</p><p className="k-workout__value">{distance}</p></div> : null}
          {round ? <div><p className="k-workout__label">This round</p><p className="k-workout__value">{round}</p></div> : null}
        </div>
      </div>
    </div>
  );
}

export function ChatSequence({ beats, step }) {
  return (
    <div className="k-seq">
      {beats.map((b, i) => {
        const visible = b.kind === 'typing' ? step === i : step >= i;
        const cls = `k-seq__item k-seq__item--${b.kind}${visible ? ' is-on' : ''}`;
        return (
          <div className={cls} key={i} aria-hidden={!visible}>
            {b.kind === 'typing' && <TypingBubble who={b.who} />}
            {b.kind === 'in' && (
              <div className="k-msg k-msg--in">
                <span className="k-msg__who">{b.who}</span>
                <p className="k-msg__text">{b.text}</p>
              </div>
            )}
            {b.kind === 'out' && (
              <div className="k-msg k-msg--out">
                <p className="k-msg__text">{b.text}</p>
              </div>
            )}
            {b.kind === 'system' && <p className="k-sys">{b.text}</p>}
            {b.kind === 'workout' && <WorkoutCard {...b} />}
            {b.kind === 'goal' && (
              <div className="k-seq__goal">
                <span className="k-msg__who">{b.who}</span>
                <GoalCertificate name={b.who} total={b.total} date={b.date} daysUntil={b.daysUntil} size="sm" />
              </div>
            )}
            {b.kind === 'reactions' && (
              <div className="k-reactions">
                {b.items.map((r) => <span key={r}>{r}</span>)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** A chat screen playing a scene. */
export function ChatScreen({ title = '-Sunday Runners-', meta = '9 days left', beats = WORKOUT_BEATS, step = beats.length }) {
  return (
    <div className="k-screen k-screen--chat">
      <div className="k-chat__header">
        <span className="k-chat__title">{title}</span>
        <span className="k-chat__meta">{meta}</span>
      </div>
      <div className="k-chat__body">
        <ChatSequence beats={beats} step={step} />
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- live pacer */

/** Three states the pacer cycles through as days run down. */
export const PACER_STATES = [
  { tier: 'goodPace', completed: 8, goal: 12, daysLeft: 9 },
  { tier: 'gettingTight', completed: 8, goal: 12, daysLeft: 6 },
  { tier: 'noRoomForError', completed: 8, goal: 12, daysLeft: 4 },
];

export function PacerDemo({ step = 0 }) {
  const s = PACER_STATES[Math.min(step, PACER_STATES.length - 1)];
  const pace = PACE_TIERS[s.tier];
  return (
    <div className="k-pacer" data-tier={s.tier}>
      <div className="k-pacer__arc">
        <SemiCircleArc progress={s.completed / s.goal} size={180} strokeWidth={14} progressColor={pace.color} trackColor="var(--primary-lightest-2)" />
        <div className="k-pacer__overlay">
          <p className="k-pacer__count"><strong>{s.completed}</strong>/{s.goal}</p>
          <p className="k-pacer__label">workouts</p>
        </div>
      </div>
      <p className="k-pacer__days">
        {/* keyed so the number re-animates when the state advances */}
        <strong className="k-pacer__num" key={s.daysLeft}>{s.daysLeft}</strong> days left
      </p>
      <p className="k-pacer__msg" style={{ background: pace.bg, color: pace.color }} key={s.tier}>
        {pace.message}
      </p>
      <ol className="k-pacer__dots" aria-hidden="true">
        {PACER_STATES.map((st, i) => (
          <li key={st.tier} className={i === Math.min(step, PACER_STATES.length - 1) ? 'is-on' : ''} style={{ '--c': PACE_TIERS[st.tier].color }} />
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------- screen: goal setting */

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
          <span className="k-goal__value">{perWeek}<span className="k-goal__per">/week</span></span>
          <span className="k-goal__btn" aria-hidden="true">+</span>
        </div>
        <div className="k-goal__bars" aria-hidden="true">
          {Array.from({ length: 7 }).map((_, i) => <span className={`k-goal__bar${i < perWeek ? ' is-on' : ''}`} key={i} />)}
        </div>
      </div>
      <p className="k-goal__note">About {perWeek} a week. Adjust any time before the round starts.</p>
      <div className="k-goal__button">Continue</div>
    </div>
  );
}

/* ------------------------------------------------------------ visual: syncing */

export const WORKOUT_KINDS = [
  { emoji: '🏃', name: 'Run' }, { emoji: '🚴', name: 'Ride' }, { emoji: '🏊', name: 'Swim' },
  { emoji: '🏋️', name: 'Lift' }, { emoji: '🧘', name: 'Yoga' }, { emoji: '🥾', name: 'Hike' },
  { emoji: '🥊', name: 'Box' }, { emoji: '🚣', name: 'Row' }, { emoji: '⛷️', name: 'Ski' },
  { emoji: '🏸', name: 'Play' }, { emoji: '🧗', name: 'Climb' }, { emoji: '🚶', name: 'Walk' },
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
            <span className="k-sync__emoji">{k.emoji}</span>{k.name}
          </span>
        ))}
      </div>
      <div className="k-sync__flow" aria-hidden="true">
        <span className="k-sync__arrow" />
        <div className="k-sync__hub"><span className="k-sync__heart">❤️</span><span className="k-sync__hublabel">Apple Health</span></div>
        <span className="k-sync__arrow" />
      </div>
      <div className="k-sync__dest" aria-hidden="true">
        <WorkoutCard who="You" type="Strength" duration="51 min" mini />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- visual: rounds */

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
          {r.state === 'next'
            ? <p className="k-round__number k-round__number--next">?</p>
            : <p className="k-round__number">{r.state === 'live' ? `${r.done}/${r.total}` : r.total}</p>}
          <p className="k-round__unit">{r.state === 'next' ? 'set your goal' : 'workouts'}</p>
          <p className="k-round__state">
            {r.state === 'done' && '✅ Done'}{r.state === 'live' && '🟢 On pace'}{r.state === 'next' && '🗓️ Next round'}
          </p>
          {r.note ? <p className="k-round__note">{r.note}</p> : null}
        </li>
      ))}
    </ol>
  );
}

/* ----------------------------------------------------------------- photography */

/**
 * A photo slot. With `src` it renders the image; without one it renders an
 * on-brand textured tile (gradient + scribble + grain + an emoji) so the
 * layout never looks broken while photography is still being chosen.
 * `spec` documents what should go there for whoever sources the images.
 */
export function Photo({ slot, src, alt, emoji, label, spec, aspect = '3 / 4', className = '' }) {
  return (
    <figure
      className={`k-photo${src ? ' k-photo--real' : ' k-photo--empty'} ${className}`.trim()}
      style={{ '--aspect': aspect }}
      data-slot={slot}
      data-spec={src ? undefined : spec}
    >
      {src ? (
        <img src={src} alt={alt} loading="lazy" decoding="async" />
      ) : (
        <>
          <span className="k-photo__emoji" role="img" aria-label={alt}>{emoji}</span>
          {label ? <figcaption className="k-photo__label" aria-hidden="true">{label}</figcaption> : null}
        </>
      )}
    </figure>
  );
}

/* --------------------------------------------------------------- institutions */

/**
 * Institutions behind the cited studies, rendered as typographic wordmarks.
 * Real logos are trademarks: drop an SVG at `logo` when you have permission
 * to use it and the wordmark is replaced.
 */
export const INSTITUTIONS = [
  { name: 'University of Pittsburgh', short: 'Pitt', logo: null },
  { name: 'University of Minnesota', short: 'UMN', logo: null },
  { name: 'Dominican University of California', short: 'Dominican', logo: null },
  { name: 'New York University', short: 'NYU', logo: null },
  { name: 'University of Sheffield', short: 'Sheffield', logo: null },
];

export function Institutions() {
  return (
    <ul className="k-insts" aria-label="Institutions behind the cited research">
      {INSTITUTIONS.map((i) => (
        <li className="k-inst" key={i.name}>
          {i.logo
            ? <img src={i.logo} alt={i.name} className="k-inst__logo" loading="lazy" />
            : <span className="k-inst__mark" title={i.name}>{i.name}</span>}
        </li>
      ))}
    </ul>
  );
}
