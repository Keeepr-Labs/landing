import React from 'react';
import { Link } from 'react-router-dom';
import useReveal from './useReveal';
import {
  PhoneFrame,
  ProgressScreen,
  ChatScreen,
  CommitmentCard,
  GoalScreen,
  Leaderboard,
  SyncVisual,
  RoundsStrip,
  PACE_TIERS,
} from './AppScreens';
import './Landing.css';

const APP_STORE_URL = 'https://apps.apple.com/app/id6471142186';

/** A section that fades up the first time it enters the viewport. */
function Reveal({ as: Tag = 'section', className = '', children, ...rest }) {
  const [ref, revealed] = useReveal();
  return (
    <Tag
      ref={ref}
      className={`${className} k-reveal${revealed ? ' is-in' : ''}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/** Primary call to action. The iOS app is live, so this is a download. */
function AppStoreButton({ children = 'Get Keeep for iPhone', variant = 'solid' }) {
  return (
    <a
      className={`k-cta k-cta--${variant}`}
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="k-cta__icon" aria-hidden="true"></span>
      {children}
    </a>
  );
}

function AndroidNote() {
  return (
    <p className="k-android">
      On Android?{' '}
      <Link to="/waitlistAndroid" className="k-android__link">
        Get in line for it
      </Link>
      .
    </p>
  );
}

/* ------------------------------------------------------------------- sections */

function Nav() {
  return (
    <header className="k-nav">
      <div className="k-nav__inner">
        <div className="k-nav__brand">
          <img
            src={process.env.PUBLIC_URL + '/images/LogoWhite.svg'}
            alt="Keeep"
            className="k-nav__logo"
          />
          <span className="k-nav__beta">beta</span>
        </div>
        <a
          className="k-nav__cta"
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
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
        <img
          src={process.env.PUBLIC_URL + '/images/twirlWhite.svg'}
          alt=""
          className="k-hero__twirl"
        />
      </div>

      <div className="k-hero__inner">
        <div className="k-hero__copy">
          <p className="k-hero__eyebrow">Not a fitness app</p>
          <h1 className="k-hero__title" id="k-hero-title">
            Stick to it.
          </h1>
          <p className="k-hero__lede">
            Keeep is a little side quest you keep with a friend. Pick a workout
            goal, put a date on it, and let someone you like watch you actually
            do it. Your workouts show up on their own. So does the leaderboard.
          </p>
          <div className="k-hero__actions">
            <AppStoreButton />
            <AndroidNote />
          </div>
          <ul className="k-hero__proof">
            <li>
              <span aria-hidden="true">❤️</span> Workouts sync from Apple Health —
              nothing to log
            </li>
            <li>
              <span aria-hidden="true">🗓️</span> A new round every month, a new goal
              every round
            </li>
          </ul>
        </div>

        <div className="k-hero__device">
          <PhoneFrame
            tone="purple"
            label="The Keeep group header: a semicircle progress arc showing 8 of 12 workouts done, a green on-pace message, 9 days left, second place on the board of six, and the leaderboard with everyone's progress."
          >
            <ProgressScreen />
          </PhoneFrame>
        </div>
      </div>
    </section>
  );
}

/** The premise, paced like onboarding slide 3 — one beat at a time. */
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
              <span className="k-beat__emoji" aria-hidden="true">
                {b.emoji}
              </span>
              {b.text}
            </li>
          ))}
        </ul>
        <p className="k-premise__kicker">You name it… it impacts all of it.</p>
      </div>
    </Reveal>
  );
}

/** The problem. Honest about the yo-yo, per the brand voice. */
function Problem() {
  return (
    <Reveal className="k-problem" aria-labelledby="k-problem-title">
      <div className="k-problem__inner">
        <h2 className="k-problem__title" id="k-problem-title">
          The hard part is consistency
        </h2>
        <div className="k-problem__grid">
          <p className="k-problem__text">
            Motivation shows up loud on a Sunday night. Then it's 7am, you slept
            badly, it's raining, and the run quietly becomes a tomorrow problem.
          </p>
          <p className="k-problem__text">
            In the privacy of our own head, it's easy to procrastinate. No one's
            watching. Nothing happens if you skip. So you skip.
          </p>
        </div>
        <p className="k-problem__pull">That's what Keeep is for. To make that easier.</p>
      </div>
    </Reveal>
  );
}

/** The reveal: two ingredients. */
function Secret() {
  return (
    <Reveal className="k-secret" aria-labelledby="k-secret-title">
      <div className="k-secret__inner">
        <p className="k-secret__eyebrow">So what's the secret?</p>
        <h2 className="k-secret__title" id="k-secret-title">
          Two, not so secret, ingredients
        </h2>
        <div className="k-secret__cards">
          <div className="k-icard">
            <span className="k-icard__emoji" aria-hidden="true">👀</span>
            <h3 className="k-icard__title">Someone who'll notice</h3>
            <p className="k-icard__text">
              A group chat with a friend or two. Your workouts land in it. So do
              the days you skip.
            </p>
          </div>
          <span className="k-secret__plus" aria-hidden="true">+</span>
          <div className="k-icard">
            <span className="k-icard__emoji" aria-hidden="true">🗓️</span>
            <h3 className="k-icard__title">A number and a date</h3>
            <p className="k-icard__text">
              Twelve workouts by the end of the month. Specific enough that
              "I'll get to it" stops working.
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Ingredient one: the side quest. */
function SideQuest() {
  return (
    <Reveal className="k-feature k-feature--quest" aria-labelledby="k-quest-title">
      <div className="k-feature__inner">
        <div className="k-feature__copy">
          <p className="k-feature__eyebrow">Ingredient one</p>
          <h2 className="k-feature__title" id="k-quest-title">
            Put it out there, and it stops being optional
          </h2>
          <p className="k-feature__pull">A little side quest, with a friend.</p>
          <p className="k-feature__text">
            Keeep isn't the centre of your universe. It's a small game you keep
            going with someone you like — a shared goal, a chat, a bit of healthy
            competition. The magnificent side effect is that you actually work out.
          </p>
          <ul className="k-list">
            <li>
              <span aria-hidden="true">💬</span> A group chat built for one thing —
              not another feed
            </li>
            <li>
              <span aria-hidden="true">🔥</span> Every workout you do shows up for
              everyone to react to
            </li>
            <li>
              <span aria-hidden="true">😏</span> Better together. Also: slightly
              competitive together
            </li>
          </ul>
        </div>
        <div className="k-feature__device">
          <PhoneFrame
            label="A Keeep group chat called Sunday Runners. Dani's 42-minute outdoor run has synced from Apple Health, the group has reacted with fire and clapping emoji, and Mara is teasing Dani about being one workout behind."
          >
            <ChatScreen />
          </PhoneFrame>
          <img
            className="k-feature__deco"
            src={process.env.PUBLIC_URL + '/images/chatGroup.png'}
            alt=""
            aria-hidden="true"
          />
        </div>
      </div>
    </Reveal>
  );
}

/** Who to bring — it's all about who you share with. */
function WhoToBring() {
  const people = [
    { emoji: '📱', who: 'The friend you keep meaning to text' },
    { emoji: '✈️', who: 'The one who moved away' },
    { emoji: '👯', who: 'Your running buddy' },
    { emoji: '👨‍👩‍👧', who: 'Your sister. Your dad. Your cousin' },
    { emoji: '☕', who: 'That crew from the cycling café' },
    { emoji: '🏃‍♀️', who: 'Someone from the run club' },
    { emoji: '💼', who: 'The colleague who also "should really"' },
    { emoji: '💛', who: 'Your partner' },
  ];

  return (
    <Reveal className="k-who" aria-labelledby="k-who-title">
      <div className="k-who__inner">
        <p className="k-who__eyebrow">It's all about who you share with</p>
        <h2 className="k-who__title" id="k-who-title">
          Bring someone. Anyone, really.
        </h2>
        <p className="k-who__text">
          Accountability works far better with people you actually know. It doubles
          as an excuse to stay in touch — a standing reason to check in every week
          that isn't "how are things".
        </p>
        <ul className="k-who__grid">
          {people.map((p, i) => (
            <li className="k-who__chip" key={p.who} style={{ '--i': i }}>
              <span className="k-who__emoji" aria-hidden="true">{p.emoji}</span>
              {p.who}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/** Ingredient two: keeping yourself honest — leaderboard, pacer, badge. */
function Honest() {
  const order = ['goodPace', 'gettingTight', 'noRoomForError', 'dead'];
  return (
    <Reveal className="k-honest" aria-labelledby="k-honest-title">
      <div className="k-honest__inner">
        <div className="k-honest__top">
          <div className="k-honest__copy">
            <p className="k-honest__eyebrow">Ingredient two</p>
            <h2 className="k-honest__title" id="k-honest-title">
              A specific number, by a specific date, with your name on it
            </h2>
            <p className="k-honest__text">
              You commit to a goal for the round — say twelve workouts by the 31st —
              and Keeep does the maths on the days you have left. The leaderboard
              keeps everyone honest. The pacer keeps you on track. No trophies for
              effort, no doom either: just what it'll take from here.
            </p>
          </div>

          <div className="k-honest__objects">
            <div className="k-board" role="img" aria-label="The leaderboard: Mara first with 11 of 12, you second with 8, Priya 7, Dani 5, Tom 2, Leo 0 — each with a pace-coloured dot.">
              <p className="k-board__title" aria-hidden="true">Leaderboard · 9 days left</p>
              <div aria-hidden="true">
                <Leaderboard />
              </div>
            </div>
            <div
              className="k-badge-float"
              role="img"
              aria-label="Your commitment badge for the round: I, ALEX, commit to completing 12 total workouts by March 31."
            >
              <CommitmentCard />
            </div>
          </div>
        </div>

        <p className="k-honest__sub">The pacer, in its own words</p>
        <ul className="k-tiers">
          {order.map((key) => {
            const tier = PACE_TIERS[key];
            return (
              <li className="k-tier" key={key} style={{ '--tier-color': tier.color }}>
                {/* Only the tint is set inline; the label colour lives in
                    CSS so it stays legible on every tint. */}
                <span className="k-tier__chip" style={{ background: tier.bg }}>
                  {tier.label}
                </span>
                <p className="k-tier__msg">{tier.message}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </Reveal>
  );
}

/** Auto-synced workouts: you do the work, we bring the data. */
function Sync() {
  return (
    <Reveal className="k-syncsec" aria-labelledby="k-sync-title">
      <div className="k-syncsec__inner">
        <div className="k-syncsec__copy">
          <p className="k-syncsec__eyebrow">Nothing to log</p>
          <h2 className="k-syncsec__title" id="k-sync-title">
            You do the work at the gym. We do the work of bringing the data.
          </h2>
          <p className="k-syncsec__text">
            Run, lift, swim, climb, walk the dog for an hour — whatever you're into,
            it's already in Apple Health. Keeep picks it up from there and drops it
            in the chat, with the numbers. No typing, no forgetting, no "I'll add it
            later".
          </p>
        </div>
        <SyncVisual />
      </div>
    </Reveal>
  );
}

/**
 * Backed by science. Citations are from memory and this environment could
 * not reach PubMed to double-check them — verify the four before publishing.
 */
function Science() {
  const studies = [
    {
      stat: '95% vs 76%',
      claim: 'finished the programme when they joined with friends, versus alone.',
      cite: 'Wing & Jeffery, Journal of Consulting and Clinical Psychology, 1999',
    },
    {
      stat: '2.75×',
      claim:
        'more likely to keep the results ten months on when recruited with friends (66% vs 24%).',
      cite: 'Wing & Jeffery, 1999',
    },
    {
      stat: '76% vs 43%',
      claim:
        'of goals achieved by people who wrote them down and sent a friend weekly progress, versus people who just thought about them.',
      cite: 'Matthews, Dominican University of California, 2015',
    },
    {
      stat: '94 studies',
      claim:
        'agree: deciding exactly when, where and how you\'ll act has a medium-to-large effect on actually doing it.',
      cite: 'Gollwitzer & Sheeran, Advances in Experimental Social Psychology, 2006',
    },
  ];

  return (
    <Reveal className="k-science" aria-labelledby="k-science-title">
      <div className="k-science__inner">
        <p className="k-science__eyebrow">Backed by science</p>
        <h2 className="k-science__title" id="k-science-title">
          Not a hunch. Accountability is one of the best-studied levers we have.
        </h2>
        <ul className="k-studies">
          {studies.map((s) => (
            <li className="k-study" key={s.stat + s.cite}>
              <p className="k-study__stat">{s.stat}</p>
              <p className="k-study__claim">{s.claim}</p>
              <p className="k-study__cite">{s.cite}</p>
            </li>
          ))}
        </ul>
        <p className="k-science__note">
          Two ingredients, both with decades of evidence behind them: someone
          watching, and a plan specific enough to be checked.
        </p>
      </div>
    </Reveal>
  );
}

/** Recurring rounds: life changes, the commitment doesn't. */
function Rounds() {
  return (
    <Reveal className="k-roundsec" aria-labelledby="k-rounds-title">
      <div className="k-roundsec__inner">
        <p className="k-roundsec__eyebrow">Every month, a new round</p>
        <h2 className="k-roundsec__title" id="k-rounds-title">
          Sometimes you're on it. Sometimes you're slammed. Always committed.
        </h2>
        <p className="k-roundsec__text">
          Rounds run monthly, and you set a fresh goal each time. A big one when
          life's calm, a smaller one when it isn't. The point was never the number
          — it's that there's always a next round, and you're always in it.
        </p>
        <RoundsStrip />
      </div>
    </Reveal>
  );
}

/** Setup, in three steps. */
function HowItWorks() {
  const steps = [
    {
      n: '1',
      emoji: '🎯',
      title: 'Pick a number and a date',
      text: "Choose how many workouts you want this round. Keeep turns it into a pace you can actually keep, and a badge with your name on it.",
    },
    {
      n: '2',
      emoji: '💬',
      title: 'Bring someone',
      text: 'Start the chat and send the invite. One friend is plenty. A few is a party.',
    },
    {
      n: '3',
      emoji: '❤️',
      title: 'Go work out',
      text: "That's it. Apple Health tells Keeep, Keeep tells the chat, the leaderboard updates. Next month, new round.",
    },
  ];

  return (
    <Reveal className="k-how" aria-labelledby="k-how-title">
      <div className="k-how__inner">
        <div className="k-how__head">
          <h2 className="k-how__title" id="k-how-title">
            Set up in about a minute
          </h2>
          <p className="k-how__sub">
            No workout library, no plans to follow, no macros. We don't care what you
            do — just that you do it.
          </p>
        </div>
        <div className="k-how__body">
          <ol className="k-steps">
            {steps.map((s) => (
              <li className="k-step" key={s.n}>
                <span className="k-step__n" aria-hidden="true">
                  {s.n}
                </span>
                <div>
                  <h3 className="k-step__title">
                    <span aria-hidden="true">{s.emoji} </span>
                    {s.title}
                  </h3>
                  <p className="k-step__text">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="k-how__device">
            <PhoneFrame
              label="The goal setup screen: How does this look? Twelve total workouts, at a pace of three per week."
            >
              <GoalScreen />
            </PhoneFrame>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Positioning. */
function Difference() {
  const rows = [
    { them: 'Fitness apps', line: 'Track your workouts and hope you stay motivated.' },
    { them: 'Habit trackers', line: 'A streak you can break with nobody noticing.' },
    { them: 'Workout apps', line: 'Great sessions to follow — if you show up.' },
    { them: 'Points and badges', line: 'Rewards from an app, that an app can see.' },
  ];

  return (
    <Reveal className="k-diff" aria-labelledby="k-diff-title">
      <div className="k-diff__inner">
        <h2 className="k-diff__title" id="k-diff-title">
          Keeep is not a fitness app. It's an accountability system.
        </h2>
        <p className="k-diff__text">
          Willpower-based apps put the whole job on you. Keeep puts some of it on
          a friend and some of it on a date — so consistency becomes the path of
          least resistance.
        </p>
        <ul className="k-diff__rows">
          {rows.map((r) => (
            <li className="k-diff__row" key={r.them}>
              <span className="k-diff__them">{r.them}</span>
              <span className="k-diff__line">{r.line}</span>
            </li>
          ))}
          <li className="k-diff__row k-diff__row--us">
            <span className="k-diff__them">Keeep</span>
            <span className="k-diff__line">
              A real friend, a real deadline, and a leaderboard you can't hide from.
            </span>
          </li>
        </ul>
      </div>
    </Reveal>
  );
}

function Faq() {
  const qs = [
    {
      q: 'What counts as a workout?',
      a: "Whatever you decide counts. Keeep reads workouts from Apple Health, so runs, rides, lifts, swims, yoga, long walks — anything your watch or phone records — show up on their own. You can add one by hand too; it's just marked as manual so the group can tell.",
    },
    {
      q: 'What actually happens if I miss my goal?',
      a: "Nothing dramatic. The leaderboard shows it, your friends see it, and next month there's a new round with a goal that fits your real life better. The only thing on the line is the thing that was always on the line: whether you showed up.",
    },
    {
      q: 'Do I need friends on the app?',
      a: "Yes — that's the entire mechanism. It works far better with people you actually know. Start a group, share the invite link, and it takes about a minute. One friend is plenty.",
    },
    {
      q: 'How is it priced?',
      a: 'Keeep is a simple subscription — no tiers, no add-ons. Current pricing is shown in the app.',
    },
    {
      q: 'Is it on Android?',
      a: 'Not yet. iPhone only for now, and there’s a list you can join for the Android build.',
    },
  ];

  return (
    <Reveal className="k-faq" aria-labelledby="k-faq-title">
      <div className="k-faq__inner">
        <h2 className="k-faq__title" id="k-faq-title">
          Fair questions
        </h2>
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
        <h2 className="k-final__title" id="k-final-title">
          Let's get you started
        </h2>
        <p className="k-final__text">
          Simple and very effective. Pick a number, put a date on it, bring a
          friend.
        </p>
        <div className="k-final__actions">
          <AppStoreButton variant="light" />
          <AndroidNote />
        </div>
        <p className="k-final__signoff">
          Have fun, it's not the olympics. We love you.
        </p>
      </div>
    </Reveal>
  );
}

function Footer() {
  return (
    <footer className="k-footer">
      <div className="k-footer__inner">
        <img
          src={process.env.PUBLIC_URL + '/images/LogoWhite.svg'}
          alt="Keeep"
          className="k-footer__logo"
        />
        <nav className="k-footer__links" aria-label="Legal">
          <Link to="/terms-of-service" className="k-footer__link">
            Terms and Conditions
          </Link>
          <span className="k-footer__sep" aria-hidden="true">
            |
          </span>
          <Link to="/privacy-policy" className="k-footer__link">
            Privacy Policy
          </Link>
          <span className="k-footer__sep" aria-hidden="true">
            |
          </span>
          <Link to="/feedback" className="k-footer__link">
            Feedback
          </Link>
        </nav>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------------------- page */

export default function Landing() {
  return (
    <div className="k-landing">
      <Nav />
      <main>
        <Hero />
        <Premise />
        <Problem />
        <Secret />
        <SideQuest />
        <WhoToBring />
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
