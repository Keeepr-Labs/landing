import React from 'react';
import { Link } from 'react-router-dom';
import useReveal from './useReveal';
import {
  PhoneFrame,
  ProgressScreen,
  ChatScreen,
  CommitmentCard,
  PledgeScreen,
  GoalScreen,
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
            Keeep makes it easier to stick to your workout goals — whatever they are.
            You commit to a number of workouts a month, put a pledge behind it, and
            share the whole thing with your friends.
          </p>
          <div className="k-hero__actions">
            <AppStoreButton />
            <AndroidNote />
          </div>
          <ul className="k-hero__proof">
            <li>
              <span aria-hidden="true">🎟️</span> No subscription — you pay for the
              tickets you use
            </li>
            <li>
              <span aria-hidden="true">⏱️</span> Set up a group in about a minute
            </li>
          </ul>
        </div>

        <div className="k-hero__device">
          <PhoneFrame
            tone="purple"
            label="The Keeep group header: a semicircle progress arc showing 8 of 12 workouts done, a green on-pace message, 9 days left, 2 tickets pledged, and the six people in the chat with their own progress."
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
            <h3 className="k-icard__title">Accountability to your goal</h3>
            <p className="k-icard__text">A group chat with your friends.</p>
          </div>
          <span className="k-secret__plus" aria-hidden="true">+</span>
          <div className="k-icard">
            <span className="k-icard__emoji" aria-hidden="true">🎟️</span>
            <h3 className="k-icard__title">Having something at stake</h3>
            <p className="k-icard__text">A pledge ticket. It costs real money.</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Ingredient one: the Arena. */
function Accountability() {
  return (
    <Reveal className="k-feature k-feature--accountability" aria-labelledby="k-acc-title">
      <div className="k-feature__inner">
        <div className="k-feature__copy">
          <p className="k-feature__eyebrow">Ingredient one</p>
          <h2 className="k-feature__title" id="k-acc-title">
            When everybody's progress — or lack thereof — is on display…
          </h2>
          <p className="k-feature__pull">There's nowhere to hide!</p>
          <p className="k-feature__text">
            Every workout you share lands in the chat, verified from Apple Health.
            So does every day you don't. Your friends see the same arc you do —
            which makes skipping a workout a lot harder than it used to be.
          </p>
          <ul className="k-list">
            <li>
              <span aria-hidden="true">💬</span> A group chat, built for
              accountability — not another feed
            </li>
            <li>
              <span aria-hidden="true">📊</span> Everyone's pace, side by side, all
              month
            </li>
            <li>
              <span aria-hidden="true">🤝</span> Do it with people you actually know.
              That's what makes it work
            </li>
          </ul>
        </div>
        <div className="k-feature__device">
          <PhoneFrame
            label="A Keeep group chat called Sunday Runners. Dani has shared a 42-minute outdoor run, verified from Apple Health, and the group has reacted to it."
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

/** Ingredient two: the stakes, stated without apology. */
function Stakes() {
  return (
    <Reveal className="k-feature k-feature--stakes" aria-labelledby="k-stakes-title">
      <div className="k-feature__inner k-feature__inner--reverse">
        <div className="k-feature__copy">
          <p className="k-feature__eyebrow">Ingredient two</p>
          <h2 className="k-feature__title" id="k-stakes-title">
            Stick to your goal, keep your tickets. Don't, adiós 💸
          </h2>
          <p className="k-feature__text">
            It sucks to lose your tickets. They cost you money! And that's the
            entire point — you want to have something to lose. A pledge ticket does
            nothing else. It's there to make skipping hurt a little, so your future
            self gets moving on the bad days, the busy days, the rainy days.
          </p>
          <p className="k-feature__pull">
            It's a cheat code for motivation <span aria-hidden="true">🏌️‍♀️</span>
          </p>
          <p className="k-feature__text k-feature__text--small">
            Putting your money where your mouth is gets you moving. Even a few extra
            workouts in a month and it's money well spent.
          </p>
        </div>
        {/* One phone, with the commitment card floating in front of it —
            overlapping two full phones hid the very screens this section
            exists to show. */}
        <div className="k-feature__device k-feature__device--stack">
          <PhoneFrame label="The pledge screen: two pledge tickets worth $10 each, $20 pledged this round, above the line stick to your goal, keep your tickets. Don't, adiós.">
            <PledgeScreen />
          </PhoneFrame>
          <div
            className="k-commit-float"
            role="img"
            aria-label="A metallic commitment card reading: I, ALEX, commit to completing 12 total workouts by March 31."
          >
            <CommitmentCard />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** The Personal Coach layer: honest pace feedback. */
function Coach() {
  const order = ['goodPace', 'gettingTight', 'noRoomForError', 'dead'];
  return (
    <Reveal className="k-coach" aria-labelledby="k-coach-title">
      <div className="k-coach__inner">
        <p className="k-coach__eyebrow">And a coach who keeps it real</p>
        <h2 className="k-coach__title" id="k-coach-title">
          You always know exactly where you stand
        </h2>
        <p className="k-coach__text">
          Keeep does the math on your remaining days and tells you the truth about
          your pace. No trophies for effort, no doom either — just what it'll take
          from here.
        </p>
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

/** Setup, in three steps. */
function HowItWorks() {
  const steps = [
    {
      n: '1',
      emoji: '🎯',
      title: 'Pick your pace',
      text: 'Choose how many workouts you want next month. Keeep turns it into a monthly total you can actually hit.',
    },
    {
      n: '2',
      emoji: '🎟️',
      title: 'Put a pledge behind it',
      text: "Buy pledge tickets and commit them to the round. Everyone in the group pledges — that's what keeps it fair.",
    },
    {
      n: '3',
      emoji: '💬',
      title: 'Share it with your people',
      text: 'Start the group chat and invite friends. Then just share your workouts as you do them.',
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

/** Positioning, straight from the brand guidelines. */
function Difference() {
  const rows = [
    { them: 'Fitness apps', line: 'Track your workouts and hope you stay motivated.' },
    { them: 'Habit trackers', line: 'A streak you can break with nobody noticing.' },
    { them: 'Workout apps', line: 'Great sessions to follow — if you show up.' },
    { them: 'Points and badges', line: 'Rewards that cost nothing, so they mean nothing.' },
  ];

  return (
    <Reveal className="k-diff" aria-labelledby="k-diff-title">
      <div className="k-diff__inner">
        <h2 className="k-diff__title" id="k-diff-title">
          Keeep is not a fitness app. It's an accountability system.
        </h2>
        <p className="k-diff__text">
          Willpower-based apps put the whole job on you. Keeep puts it partly on your
          friends and partly on your wallet — so consistency becomes the path of
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
              Real friends, real money, real consequences.
            </span>
          </li>
        </ul>
      </div>
    </Reveal>
  );
}

function Pricing() {
  return (
    <Reveal className="k-price" aria-labelledby="k-price-title">
      <div className="k-price__inner">
        <p className="k-price__eyebrow">No subscription</p>
        <h2 className="k-price__title" id="k-price-title">
          You pay for the tickets you use
        </h2>
        <p className="k-price__text">
          That's the whole model. No monthly fee sitting on your card whether you
          train or not. Buy a ticket, pledge it, keep it by showing up.
        </p>
        <p className="k-price__kicker">
          Even getting just a few extra workouts in — it's money well spent.
        </p>
      </div>
    </Reveal>
  );
}

function Faq() {
  const qs = [
    {
      q: 'What counts as a workout?',
      a: "Whatever you decide counts. Keeep reads workouts from Apple Health so most things log themselves, and you can add one manually — it just gets flagged as manual input so the group can see the difference.",
    },
    {
      q: 'What actually happens if I miss my goal?',
      a: "You lose the tickets you pledged for that round. That's it — no penalty spiral, no lecture. Next round you set a goal that fits your real life better.",
    },
    {
      q: 'Where does the money go?',
      a: "Lost pledges are how Keeep makes money instead of charging you a subscription. We're upfront about it: the ticket exists so that losing it stings enough to get you out the door.",
    },
    {
      q: 'Do I need friends on the app?',
      a: "It works far better with people you actually know — that's the entire accountability engine. Start a group, share the invite link, and it takes a minute.",
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
          Simple and very effective. Pick a pace, put something behind it, bring your
          friends.
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
        <Accountability />
        <Stakes />
        <Coach />
        <HowItWorks />
        <Difference />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
