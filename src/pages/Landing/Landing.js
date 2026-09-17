import React from 'react';
import { Link } from 'react-router-dom';
import useReveal from './useReveal';
import useSequence from './useSequence';
import useParallax from './useParallax';
import {
  PhoneFrame,
  ProgressScreen,
  ChatScreen,
  WORKOUT_BEATS,
  GOAL_BEATS,
  GoalCertificate,
  GoalScreen,
  Leaderboard,
  PacerDemo,
  PACER_STATES,
  SyncVisual,
  RoundsStrip,
  Photo,
  Institutions,
} from './AppScreens';
import './Landing.css';

const APP_STORE_URL = 'https://apps.apple.com/app/id6471142186';
const PUB = process.env.PUBLIC_URL;

/**
 * Photography. Stock hosts were unreachable from the build environment, so
 * each slot renders an on-brand textured tile until a `src` is set here.
 * `spec` says what to source; `alt` is what a screen reader hears either way.
 * Licences that allow this without attribution: Unsplash, Pexels.
 */
const PHOTOS = {
  'problem-wide': {
    src: null,
    alt: 'A runner at a front door on a grey, wet morning',
    emoji: '🌧️',
    label: '7am. Raining.',
    spec: '16:9, ≥1600px wide. Lacing up or a wet path at dawn. Muted light; no face needed.',
    aspect: '16 / 7',
  },
  'who-1': {
    src: null,
    alt: 'Two friends mid-run, laughing',
    emoji: '🏃‍♀️',
    label: 'Running buddy',
    spec: '3:4, ≥800px. Two people running together, candid, mid-laugh.',
  },
  'who-2': {
    src: null,
    alt: 'A family walking a trail together',
    emoji: '🥾',
    label: 'Family',
    spec: '3:4, ≥800px. Family on a hike, not posed.',
  },
  'who-3': {
    src: null,
    alt: 'Cyclists at a café stop',
    emoji: '🚴',
    label: 'The café crew',
    spec: '3:4, ≥800px. Cyclists outside a café, bikes leaning, coffee in hand.',
  },
};

/** A section that fades up the first time it enters the viewport. */
function Reveal({ as: Tag = 'section', className = '', children, ...rest }) {
  const [ref, revealed] = useReveal();
  return (
    <Tag ref={ref} className={`${className} k-reveal${revealed ? ' is-in' : ''}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}

/** A section that also plays a scene once it is on screen. */
function useScene({ steps, stepMs, holdMs }) {
  const [ref, revealed] = useReveal();
  const step = useSequence({ steps, stepMs, holdMs, active: revealed });
  return [ref, revealed, step];
}

function AppStoreButton({ children = 'Get Keeep for iPhone', variant = 'solid' }) {
  return (
    <a className={`k-cta k-cta--${variant}`} href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
      <span className="k-cta__icon" aria-hidden="true"></span>
      {children}
    </a>
  );
}

function AndroidNote() {
  return (
    <p className="k-android">
      On Android? <Link to="/waitlistAndroid" className="k-android__link">Get in line for it</Link>.
    </p>
  );
}

/** Film grain. Decorative; sits over a section at a few percent opacity. */
function Grain() {
  return <span className="k-grain" aria-hidden="true" />;
}

/* ------------------------------------------------------------------- sections */

function Nav() {
  return (
    <header className="k-nav">
      <div className="k-nav__inner">
        <div className="k-nav__brand">
          <img src={PUB + '/images/LogoWhite.svg'} alt="Keeep" className="k-nav__logo" />
          <span className="k-nav__beta">beta</span>
        </div>
        <a className="k-nav__cta" href={APP_STORE_URL} target="_blank" rel="noopener noreferrer">
          Get the app
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="k-hero" aria-labelledby="k-hero-title">
      <div className="k-hero__bg" aria-hidden="true">
        <img src={PUB + '/images/scribble.png'} alt="" className="k-hero__scribble" data-parallax="-0.06" />
      </div>
      <Grain />
      <div className="k-hero__inner">
        <div className="k-hero__copy">
          <p className="k-hero__eyebrow">Not a fitness app</p>
          <h1 className="k-hero__title" id="k-hero-title">Stick to it.</h1>
          <p className="k-hero__lede k-line">
            A workout goal, a date, and a friend who'll notice. That's the whole trick.
          </p>
          <div className="k-hero__actions">
            <AppStoreButton />
            <AndroidNote />
          </div>
          <ul className="k-hero__proof">
            <li><span aria-hidden="true">❤️</span> Syncs from Apple Health</li>
            <li><span aria-hidden="true">🗓️</span> A new round every month</li>
          </ul>
        </div>
        <div className="k-hero__device" data-parallax="0.08">
          <PhoneFrame
            tone="purple"
            tilt
            label="The Keeep group header: a semicircle progress arc showing 8 of 12 workouts done, a green on-pace message, 9 days left, second on the board of six, and the leaderboard."
          >
            <ProgressScreen />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}

function Premise() {
  const beats = [
    { emoji: '😀', text: 'Better mood' },
    { emoji: '⚡', text: 'More energy' },
    { emoji: '😴', text: 'Better sleep' },
    { emoji: '🛡️', text: 'Stronger immune system' },
    { emoji: '🧠', text: 'Sharper focus' },
    { emoji: '❤️', text: 'Healthier heart' },
  ];
  return (
    <Reveal className="k-premise" aria-labelledby="k-premise-title">
      <div className="k-premise__inner">
        <h2 className="k-premise__title" id="k-premise-title">
          Because physical activity <em>IS</em> the miracle drug
        </h2>
        <ul className="k-beats">
          {beats.map((b, i) => (
            <li className="k-beat" key={b.text} style={{ '--i': i }}>
              <span className="k-beat__emoji" aria-hidden="true">{b.emoji}</span>{b.text}
            </li>
          ))}
        </ul>
        <p className="k-premise__kicker k-line">It impacts all of it.</p>
      </div>
    </Reveal>
  );
}

function Problem() {
  return (
    <Reveal className="k-problem" aria-labelledby="k-problem-title">
      <div className="k-problem__inner">
        <h2 className="k-problem__title" id="k-problem-title">The hard part is consistency</h2>
        <p className="k-problem__text k-line">
          In the privacy of your own head, it's easy to skip. So you skip.
        </p>
        <div data-parallax="0.05">
          <Photo slot="problem-wide" {...PHOTOS['problem-wide']} className="k-problem__photo" />
        </div>
      </div>
    </Reveal>
  );
}

function Secret() {
  return (
    <Reveal className="k-secret" aria-labelledby="k-secret-title">
      <div className="k-secret__inner">
        <p className="k-secret__eyebrow">So what's the secret?</p>
        <h2 className="k-secret__title" id="k-secret-title">Two, not so secret, ingredients</h2>
        <div className="k-secret__cards">
          <div className="k-icard">
            <span className="k-icard__emoji" aria-hidden="true">👀</span>
            <h3 className="k-icard__title">Someone who'll notice</h3>
          </div>
          <span className="k-secret__plus" aria-hidden="true">+</span>
          <div className="k-icard">
            <span className="k-icard__emoji" aria-hidden="true">🗓️</span>
            <h3 className="k-icard__title">A number and a date</h3>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Ingredient one — a workout shared, live. */
function ShareWorkout() {
  const [ref, revealed, step] = useScene({
    steps: WORKOUT_BEATS.length - 1,
    stepMs: [700, 1100, 1000, 900, 1500, 1100, 900],
    holdMs: 3800,
  });
  return (
    <section ref={ref} className={`k-feature k-feature--quest k-reveal${revealed ? ' is-in' : ''}`} aria-labelledby="k-quest-title">
      <div className="k-feature__inner">
        <div className="k-feature__copy">
          <p className="k-feature__eyebrow">Ingredient one</p>
          <h2 className="k-feature__title" id="k-quest-title">Put it out there.</h2>
          <p className="k-feature__text k-line">
            A small game you keep with a friend. Side effect: you work out.
          </p>
        </div>
        <div className="k-feature__device" data-parallax="0.06">
          <PhoneFrame label="A Keeep group chat called Sunday Runners. Mara asks who's running before work; Dani's 42-minute outdoor run arrives from Apple Health and gets fire and clapping reactions; Mara teases Dani about being one behind; you reply: fine, 7am.">
            <ChatScreen beats={WORKOUT_BEATS} step={step} />
          </PhoneFrame>
          <img className="k-feature__deco" src={PUB + '/images/chatGroup.png'} alt="" aria-hidden="true" data-parallax="0.16" />
        </div>
      </div>
    </section>
  );
}

function WhoToBring() {
  const people = [
    { emoji: '📱', who: 'The friend you keep meaning to text' },
    { emoji: '✈️', who: 'The one who moved away' },
    { emoji: '👯', who: 'Your running buddy' },
    { emoji: '👪', who: 'Your sister. Your dad.' },
    { emoji: '☕', who: 'The cycling café crew' },
    { emoji: '💛', who: 'Your partner' },
  ];
  return (
    <Reveal className="k-who" aria-labelledby="k-who-title">
      <div className="k-who__inner">
        <p className="k-who__eyebrow">It's all about who you share with</p>
        <h2 className="k-who__title" id="k-who-title">Bring someone.</h2>
        <p className="k-who__text k-line">Works best with people you actually know.</p>
        <div className="k-who__photos">
          <div data-parallax="0.09"><Photo slot="who-1" {...PHOTOS['who-1']} className="k-who__photo k-who__photo--a" /></div>
          <div data-parallax="0.04"><Photo slot="who-2" {...PHOTOS['who-2']} className="k-who__photo k-who__photo--b" /></div>
          <div data-parallax="0.09"><Photo slot="who-3" {...PHOTOS['who-3']} className="k-who__photo k-who__photo--c" /></div>
        </div>
        <ul className="k-who__grid">
          {people.map((p, i) => (
            <li className="k-who__chip" key={p.who} style={{ '--i': i }}>
              <span className="k-who__emoji" aria-hidden="true">{p.emoji}</span>{p.who}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/** Ingredient two — a goal posted to the chat, live, plus the badge itself. */
function ShareGoal() {
  const [ref, revealed, step] = useScene({
    steps: GOAL_BEATS.length - 1,
    stepMs: [700, 1000, 1200, 900, 1500, 1100],
    holdMs: 3800,
  });
  return (
    <section ref={ref} className={`k-feature k-feature--goal k-reveal${revealed ? ' is-in' : ''}`} aria-labelledby="k-goal-title">
      <div className="k-feature__inner k-feature__inner--reverse">
        <div className="k-feature__copy">
          <p className="k-feature__eyebrow">Ingredient two</p>
          <h2 className="k-feature__title" id="k-goal-title">A number, a date, your name on it.</h2>
          <p className="k-feature__text k-line">Post your goal to the chat. Now it's real.</p>
        </div>
        <div className="k-feature__device k-feature__device--goal">
          <div data-parallax="0.05">
            <PhoneFrame label="A Keeep group chat. Priya joins, posts her round goal — 10 workouts by April 30 — and gets flexed-bicep reactions; Tom raises his to 12; you reply: we'll see about that.">
              <ChatScreen title="-Wednesday Club-" meta="29 days left" beats={GOAL_BEATS} step={step} />
            </PhoneFrame>
          </div>
          <div className="k-cert-float" role="img" aria-label="Your round-goal certificate: I, Alex, commit to completing 12 total workouts by March 31. 27 days until deadline." data-parallax="0.13">
            <GoalCertificate />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Keeping honest — the board and the live pacer. */
function Honest() {
  const [ref, revealed, step] = useScene({ steps: PACER_STATES.length - 1, stepMs: 2600, holdMs: 2600 });
  return (
    <section ref={ref} className={`k-honest k-reveal${revealed ? ' is-in' : ''}`} aria-labelledby="k-honest-title">
      <div className="k-honest__inner">
        <div className="k-honest__head">
          <p className="k-honest__eyebrow">Keep yourself honest</p>
          <h2 className="k-honest__title" id="k-honest-title">The board doesn't lie. The pacer doesn't nag.</h2>
          <p className="k-honest__text k-line">Everyone's progress, side by side. And what it'll take from here.</p>
        </div>
        <div className="k-honest__objects">
          <div className="k-board" role="img" aria-label="The leaderboard: Mara first with 11 of 12, you second with 8, Priya 7, Dani 5, Tom 2, Leo 0 — each with a pace-coloured dot.">
            <p className="k-board__title" aria-hidden="true">Leaderboard · 9 days left</p>
            <div aria-hidden="true"><Leaderboard /></div>
          </div>
          <div className="k-pacer-card" role="img" aria-label="The pacer, cycling through three states as days run out: on pace with 9 days left, getting tight at 6, no room for error at 4.">
            <p className="k-board__title" aria-hidden="true">Your pace</p>
            <div aria-hidden="true"><PacerDemo step={step} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Sync() {
  return (
    <Reveal className="k-syncsec" aria-labelledby="k-sync-title">
      <div className="k-syncsec__inner">
        <div className="k-syncsec__copy">
          <p className="k-syncsec__eyebrow">Nothing to log</p>
          <h2 className="k-syncsec__title" id="k-sync-title">You do the workout. We do the data.</h2>
          <p className="k-syncsec__text k-line">Anything in Apple Health lands in the chat, numbers included.</p>
        </div>
        <SyncVisual />
      </div>
    </Reveal>
  );
}

/**
 * Backed by science. Citations are from memory — PubMed was unreachable
 * from the build environment — verify the three before publishing.
 */
function Science() {
  const studies = [
    { stat: '95% vs 76%', claim: 'finished the programme when they joined with friends, versus alone.', cite: 'Wing & Jeffery · J. Consulting & Clinical Psychology · 1999' },
    { stat: '76% vs 43%', claim: 'of goals hit by people who wrote them down and sent a friend weekly progress.', cite: 'Matthews · Dominican University of California · 2015' },
    { stat: '94 studies', claim: 'agree: fixing when, where and how you\'ll act makes you far more likely to.', cite: 'Gollwitzer & Sheeran · Adv. Experimental Social Psychology · 2006' },
  ];
  return (
    <Reveal className="k-science" aria-labelledby="k-science-title">
      <Grain />
      <div className="k-science__inner">
        <p className="k-science__eyebrow">Backed by science</p>
        <h2 className="k-science__title" id="k-science-title">Accountability is one of the best-studied levers we have.</h2>
        <ul className="k-studies">
          {studies.map((s) => (
            <li className="k-study" key={s.stat}>
              <p className="k-study__stat">{s.stat}</p>
              <p className="k-study__claim">{s.claim}</p>
              <p className="k-study__cite">{s.cite}</p>
            </li>
          ))}
        </ul>
        <Institutions />
      </div>
    </Reveal>
  );
}

function Rounds() {
  return (
    <Reveal className="k-roundsec" aria-labelledby="k-rounds-title">
      <div className="k-roundsec__inner">
        <p className="k-roundsec__eyebrow">Every month, a new round</p>
        <h2 className="k-roundsec__title" id="k-rounds-title">Sometimes you're on it. Sometimes you're slammed. Always in.</h2>
        <p className="k-roundsec__text k-line">A fresh goal each month, sized to real life.</p>
        <RoundsStrip />
      </div>
    </Reveal>
  );
}

function HowItWorks() {
  const steps = [
    { n: '1', emoji: '🎯', title: 'Pick a number and a date', text: 'Keeep turns it into a pace, and a badge with your name on it.' },
    { n: '2', emoji: '💬', title: 'Bring someone', text: 'One friend is plenty.' },
    { n: '3', emoji: '❤️', title: 'Go work out', text: 'Apple Health tells the chat. Next month, new round.' },
  ];
  return (
    <Reveal className="k-how" aria-labelledby="k-how-title">
      <div className="k-how__inner">
        <div className="k-how__head">
          <h2 className="k-how__title" id="k-how-title">Set up in about a minute</h2>
          <p className="k-how__sub k-line">No plans to follow, no macros. Just show up.</p>
        </div>
        <div className="k-how__body">
          <ol className="k-steps">
            {steps.map((s) => (
              <li className="k-step" key={s.n}>
                <span className="k-step__n" aria-hidden="true">{s.n}</span>
                <div>
                  <h3 className="k-step__title"><span aria-hidden="true">{s.emoji} </span>{s.title}</h3>
                  <p className="k-step__text k-line">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="k-how__device" data-parallax="0.06">
            <PhoneFrame label="The goal setup screen: How does this look? Twelve total workouts, at a pace of three per week.">
              <GoalScreen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function Difference() {
  const rows = [
    { them: 'Fitness apps', line: 'Track, and hope.' },
    { them: 'Habit trackers', line: 'A streak nobody sees you break.' },
  ];
  return (
    <Reveal className="k-diff" aria-labelledby="k-diff-title">
      <Grain />
      <div className="k-diff__inner">
        <h2 className="k-diff__title" id="k-diff-title">Not a fitness app. An accountability system.</h2>
        <ul className="k-diff__rows">
          {rows.map((r) => (
            <li className="k-diff__row" key={r.them}>
              <span className="k-diff__them">{r.them}</span>
              <span className="k-diff__line">{r.line}</span>
            </li>
          ))}
          <li className="k-diff__row k-diff__row--us">
            <span className="k-diff__them">Keeep</span>
            <span className="k-diff__line">A friend, a date, and a board you can't hide from.</span>
          </li>
        </ul>
      </div>
    </Reveal>
  );
}

function Faq() {
  const qs = [
    { q: 'What counts as a workout?', a: 'Anything Apple Health records — runs, rides, lifts, swims, yoga, long walks. Add one by hand if you must; it\'s marked manual.' },
    { q: 'What happens if I miss my goal?', a: 'The board shows it, your friends see it, and next month there\'s a new round. That\'s the whole consequence.' },
    { q: 'Do I need friends on the app?', a: 'Yes — that\'s the mechanism. One friend is plenty. Send the invite link; it takes a minute.' },
    { q: 'How is it priced?', a: 'A simple subscription. Current pricing is shown in the app.' },
    { q: 'Is it on Android?', a: 'Not yet. iPhone for now; there\'s a list for the Android build.' },
  ];
  return (
    <Reveal className="k-faq" aria-labelledby="k-faq-title">
      <div className="k-faq__inner">
        <h2 className="k-faq__title" id="k-faq-title">Fair questions</h2>
        <div className="k-faq__list">
          {qs.map((item) => (
            <details className="k-faq__item" key={item.q}>
              <summary className="k-faq__q">{item.q}</summary>
              <p className="k-faq__a">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

function FinalCta() {
  return (
    <Reveal className="k-final" aria-labelledby="k-final-title">
      <div className="k-final__inner">
        <h2 className="k-final__title" id="k-final-title">Let's get you started</h2>
        <p className="k-final__text k-line">A number, a date, a friend.</p>
        <div className="k-final__actions">
          <AppStoreButton variant="light" />
          <AndroidNote />
        </div>
        <p className="k-final__signoff">Have fun, it's not the olympics. We love you.</p>
      </div>
    </Reveal>
  );
}

function Footer() {
  return (
    <footer className="k-footer">
      <div className="k-footer__inner">
        <img src={PUB + '/images/LogoWhite.svg'} alt="Keeep" className="k-footer__logo" />
        <nav className="k-footer__links" aria-label="Legal">
          <Link to="/terms-of-service" className="k-footer__link">Terms and Conditions</Link>
          <span className="k-footer__sep" aria-hidden="true">|</span>
          <Link to="/privacy-policy" className="k-footer__link">Privacy Policy</Link>
          <span className="k-footer__sep" aria-hidden="true">|</span>
          <Link to="/feedback" className="k-footer__link">Feedback</Link>
        </nav>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------------- page */

export default function Landing() {
  useParallax();
  return (
    // The scribble texture stays in public/ (it is 380KB, no point hashing
    // it into the bundle); css-loader would try to resolve a root-relative
    // url() in the stylesheet, so the path is handed in as a custom property.
    <div className="k-landing" style={{ '--scribble': `url(${PUB}/images/scribble.png)` }}>
      <Nav />
      <main>
        <Hero />
        <Premise />
        <Problem />
        <Secret />
        <ShareWorkout />
        <WhoToBring />
        <ShareGoal />
        <Honest />
        <Sync />
        <Science />
        <Rounds />
        <HowItWorks />
        <Difference />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
