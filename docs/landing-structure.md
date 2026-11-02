# Landing page — structure brief

**Status:** proposal, reviewed in session on 2026-09-17; **not yet built**.
Four decisions are still open (see the end). Build nothing until they land.
This document is the durable version of that review so any session — cloud,
local, or inside a claude.ai Project — starts from it rather than from chat
scrollback.

## Why the current page (15 sections) isn't working

1. **It's the onboarding, not a landing page.** Three explanatory beats
   (miracle drug → consistency → secret) run before the product appears.
   Onboarding has a captive user; a landing page has three seconds. Opal
   shows the app in the first frame.
2. **"Two ingredients" is a leftover from the stakes model.** Accountability
   + pledge was a real pair. Accountability + "a date" isn't — and "Bring
   someone" got wedged between the two halves.
3. **The same thing is said three times.** Secret → the two features → How
   it works → Difference all re-explain the mechanism.
4. **The people are scattered.** The product is about who's in there with
   you; on the page they're split across a chat scene, a chip list and a
   leaderboard, with no photography.

## Benchmarks

- **Opal** (opalapp.com): transitions, concise copy, quality of the iPhone
  renderings with the app on screen. The bar for polish.
- **Wiz**: per-feature sections with an animated conversation that *is* the
  feature. The pattern for our chat scenes.
- **WhatsApp**: texture and parallax; people in the imagery.

## The spine

```
JOB     When I keep meaning to work out and quietly don't,
        I want someone I like to notice, so I actually go.

CORE    A workout goal, a date, and a friend who'll notice.

PILLARS   PEOPLE        COMMITMENT       HONESTY         EFFORTLESS
          (with whom)   (a number+date)  (board+pacer)   (nothing to log)
             §2            §4               §5              §6
PROOF     science (§7)  ·  the product itself, in motion (§1, §3)
```

Order: emotion first (people), mechanism second, logic to close (science),
then action. Eight sections instead of fifteen.

## Page map

```
┌────────────────────────────────────────────────────────────┐
│ NAV   Keeep · beta                          [ Get the app ] │
├────────────────────────────────────────────────────────────┤
│ 1  HERO         "Stick to it."     phone = real main screen│
│                 people photo/video behind, purple + grain  │
├────────────────────────────────────────────────────────────┤
│ 1b STATEMENT    "Physical activity is the miracle drug.    │
│    (optional)    The hard part is consistency."   photo    │
├────────────────────────────────────────────────────────────┤
│ 2  BRING SOMEONE      side quest · 3 photos · who-chips    │
├────────────────────────────────────────────────────────────┤
│ 3  SHARE A WORKOUT    animated chat (Wiz pattern)          │
├────────────────────────────────────────────────────────────┤
│ 4  A NUMBER, A DATE   animated goal chat · badge · rounds  │
├────────────────────────────────────────────────────────────┤
│ 5  BOARD & PACER      leaderboard · live pacer             │
├────────────────────────────────────────────────────────────┤
│ 6  NOTHING TO LOG     emoji → Apple Health → chat card     │
├────────────────────────────────────────────────────────────┤
│ 7  BACKED BY SCIENCE  3 stats · institution logos   (dark) │
├────────────────────────────────────────────────────────────┤
│ 8  GET STARTED        3 steps · CTA · FAQ · sign-off       │
├────────────────────────────────────────────────────────────┤
│ FOOTER                                                     │
└────────────────────────────────────────────────────────────┘
```

Copy rule throughout: headline ≤ 6 words, one supporting line ≤ 100
characters (the test in `Landing.test.js` caps `.k-line` at 120).

## Sections

### 1 · Hero — the app, in the first frame

```
┌──────────────────────────────────────────────────────────────┐
│ ░ full-bleed photo/video: two people at the end of a run ░░░ │
│ ░ purple overlay · scribble · grain · parallax on scroll ░░░ │
│                                                              │
│  NOT A FITNESS APP                    ┌─────────────┐        │
│                                       │ ▬ island    │        │
│  Stick to it.                         │ ╭ 8/12 ╮ 9d │ header │
│                                       │ 🟢 on pace  │  (arc  │
│  A workout goal, a date, and a        │─────────────│ draws) │
│  friend who'll notice.                │ Mara: who's │        │
│                                       │  running?   │  chat  │
│  [ Get Keeep for iPhone ]             │ [Dani · run │        │
│  On Android? Get in line.             │  42min ✓ ]  │        │
│                                       │ 🔥3 👏2     │        │
│  ❤️ Syncs from Apple Health           │ You: 7am.   │        │
│  🗓️ New round every month             └─────────────┘        │
└──────────────────────────────────────────────────────────────┘
```

The phone shows the **real main screen** — progress header on top, chat
beneath — the way the app actually opens. Sections 3 and 5 are zooms into
it, so nothing repeats. The arc draws in on load; nothing else moves.
People are in the background from second one.

### 1b · Statement band (optional; replaces Premise + Problem)

```
┌──────────────────────────────────────────────────────────────┐
│ ░ photo: lacing up at a front door, grey morning ░░░░░░░░░░ │
│                                                              │
│      Physical activity is the miracle drug.                  │
│      The hard part is consistency.                           │
└──────────────────────────────────────────────────────────────┘
```

Two lines, big type, one screen. Keeps the brand's core belief without
three sections of chips. Recommendation: keep it — it's the only "problem"
beat and the voice needs it.

### 2 · Bring someone — PEOPLE

```
┌──────────────────────────────────────────────────────────────┐
│         SO WHAT'S THE SECRET? IT'S ACTUALLY PRETTY SIMPLE     │
│                                                              │
│                     Bring someone.                           │
│         A small side quest you keep with a friend.           │
│                                                              │
│       ┌────────┐   ┌────────┐   ┌────────┐                   │
│       │ photo  │   │ photo  │   │ photo  │  real people,     │
│       │running │   │ family │   │  café  │  fanned, three    │
│       │ buddy  │   │  hike  │   │  crew  │  parallax depths  │
│       └────────┘   └────────┘   └────────┘                   │
│                                                              │
│   (📱 the friend you keep meaning to text) (✈️ moved away)    │
│   (👯 running buddy) (👪 your sister, your dad) (☕ café crew) │
└──────────────────────────────────────────────────────────────┘
```

The onboarding's "secret" line survives as the eyebrow. This is the
emotional thesis: not the centre of your universe, a game with someone you
like.

### 3 · Share a workout — the loop

```
┌──────────────────────────────────────────────────────────────┐
│  ┌─────────────┐        THE LOOP                              │
│  │ Mara: who's │                                              │
│  │  running? 👀│        Every workout lands in the chat.      │
│  │ · · · typing│                                              │
│  │ ┌ NEW WORK- ┐│        Reactions, a bit of ribbing, and     │
│  │ │ Dani · run││        skipping becomes something people    │
│  │ │ 42min ✓AH ││        would notice.                        │
│  │ └───────────┘│                                              │
│  │ 🔥3 👏2      │        loops: typing → card → reactions →   │
│  │ Mara: one    │        reply → hold → again                 │
│  │  behind me 😏│                                              │
│  │ You: 7am.    │   💬💬 emoji bubbles, parallax               │
│  └─────────────┘                                              │
└──────────────────────────────────────────────────────────────┘
```

### 4 · A number, a date, your name on it — COMMITMENT (+ rounds)

```
┌──────────────────────────────────────────────────────────────┐
│  THE COMMITMENT             ┌─────────────┐  ┌ ROUND GOAL ─┐ │
│                             │ Priya just  │  │ I, ALEX,    │ │
│  A number, a date,          │  joined     │  │ commit to   │ │
│  your name on it.           │ · · · typing│  │    12       │ │
│                             │ ┌ ROUND GOAL┐│  │ by Mar 31   │ │
│  Post your goal. Now it's   │ │ Priya · 10││  │ 27 days     │ │
│  real. New round, new goal. │ └───────────┘│  └─────────────┘ │
│                             │ 💪4          │   certificate,   │
│                             │ Tom: mine    │   parallax, tilt │
│                             │  goes to 12  │                  │
│                             └─────────────┘                   │
│   ┌ JAN 12 ✅ ┐ ┌ FEB 8 ✅ ┐ ┌ MAR 7/10 🟢 ┐ ┌ APR ? ┐         │
│   └───────────┘ └──────────┘ └────────────┘ └───────┘         │
│   "Sometimes you're on it, sometimes you're slammed. Always in."│
└──────────────────────────────────────────────────────────────┘
```

Rounds live here because they're the same object — the badge changes every
month. The certificate is the design from the app's `PersonalGoalShowcase`
(dashed border, inner frame, "By" date chip, days until deadline) **pending
confirmation** against the onboarding-lab artifact.

### 5 · The board and the pacer — HONESTY

```
┌──────────────────────────────────────────────────────────────┐
│  KEEP YOURSELF HONEST                                        │
│  The board doesn't lie. The pacer doesn't nag.               │
│                                                              │
│  ┌ LEADERBOARD ─────────┐   ┌ YOUR PACE ──────────────┐      │
│  │ 🥇 Mara    ● 11/12   │   │        ╭─────╮          │      │
│  │ 🥈 You     ● 8/12 ◄──│   │       ( 8/12 )   arc    │      │
│  │ 🥉 Priya   ● 7/12    │   │    9 → 6 → 4 days left  │cycles│
│  │  4 Dani    ● 5/12    │   │  🟢 on pace              │green │
│  │  5 Tom     ● 2/12    │   │  🟡 getting tight        │amber │
│  │  6 Leo     ● 0/12    │   │  🚨 no room for error    │orange│
│  └──────────────────────┘   └─────────────────────────┘      │
└──────────────────────────────────────────────────────────────┘
```

### 6 · Nothing to log — EFFORTLESS

```
┌──────────────────────────────────────────────────────────────┐
│  NOTHING TO LOG                                              │
│  You do the workout. We do the data.                         │
│                                                              │
│   🏃 🚴 🏊 🏋️ 🧘 🥾            ❤️           ┌ NEW WORKOUT ┐    │
│   🥊 🚣 ⛷️ 🏸 🧗 🚶   ───▶   Apple   ───▶  │ You · Lift  │    │
│   (drift gently)             Health        │ 51 min ✓    │    │
│                                            │ 💪4         │    │
│                                            └─────────────┘    │
│  ░ optional photo band behind: someone mid-lift ░░░░░░░░░░░ │
└──────────────────────────────────────────────────────────────┘
```

The Apple-Health-with-logos image from the onboarding artifact drops in
here when available.

### 7 · Backed by science — PROOF (dark band)

```
┌──────────────────────────────────────────────────────────────┐
│ ▓ deep purple · grain ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  BACKED BY SCIENCE                                           │
│  Accountability is one of the best-studied levers we have.   │
│                                                              │
│  ┌ 95% vs 76% ─┐  ┌ 76% vs 43% ─┐  ┌ 94 studies ─┐           │
│  │ finished,   │  │ goals hit   │  │ a when/where│           │
│  │ with friends│  │ w/ a friend │  │ plan works  │           │
│  │ · 1999      │  │ · 2015      │  │ · 2006      │           │
│  └─────────────┘  └─────────────┘  └─────────────┘           │
│  ────────────────────────────────────────────────────────── │
│  [Pitt]  [Minnesota]  [Dominican]  [NYU]  [Sheffield]  logos │
└──────────────────────────────────────────────────────────────┘
```

Citations (Wing & Jeffery 1999; Matthews 2015; Gollwitzer & Sheeran 2006)
were written from memory — PubMed is unreachable from the cloud sandbox.
**Verify before publishing.** Institution logos are trademarks; wordmarks
until permission is in hand (`INSTITUTIONS` in `AppScreens.js`).

### 8 · Let's get you started — ACTION (absorbs How-it-works + FAQ)

```
┌──────────────────────────────────────────────────────────────┐
│ ░ photo band: a group after a workout, laughing ░░░░░░░░░░░ │
│                                                              │
│                  Let's get you started                       │
│                                                              │
│   ① Pick a number and a date   ② Bring someone   ③ Go        │
│                                                              │
│                [ Get Keeep for iPhone ]                      │
│                On Android? Get in line.                      │
│                                                              │
│   ▸ What counts as a workout?     ▸ What if I miss my goal?  │
│   ▸ Do I need friends on the app? ▸ How is it priced?        │
│                                                              │
│         Have fun, it's not the olympics. We love you.        │
└──────────────────────────────────────────────────────────────┘
```

## What's cut, and where it went

| Was | Now |
|---|---|
| Premise (miracle drug chips) + Problem | one statement band (1b) |
| Secret / two ingredients | its line becomes §2's eyebrow |
| Who to bring (between the ingredients) | §2, first thing after the hero |
| Rounds (own section) | folded into §4 — same object |
| How it works | three chips inside §8 |
| Difference table | cut; "Not a fitness app" stays as the hero eyebrow |
| Leaderboard in the hero phone | hero shows the real main screen; board zooms in at §5 |

Photography in four places (hero, 1b, §2, §8), video-capable in the hero.

## Open decisions — answer before building

1. **Hero phone** — real main screen (header + chat; recommended) or the
   chat scene alone?
2. **Statement band 1b** — keep it (recommended) or go straight from hero
   to "Bring someone"?
3. **Hero media** — photo with parallax now, video slot later? Video is a
   heavier asset decision; the structure works either way.
4. **The badge** — confirm the certificate card matches the onboarding-lab
   artifact, or supply a screenshot/export to match exactly.

## Inputs and tooling status (as of 2026-11-02)

- **Connected and usable from cloud sessions now:** Figma MCP (pull
  "Keeep – Mobile UI" components), Mobbin MCP (Wiz / WhatsApp references),
  the project-scope Emil Kowalski bundle (`/impeccable`, `/emil-design-eng`,
  `/animate`, `/improve-animations`, `/review-animations`, …).
- **Local only:** gstack skills (`/office-hours`, `/design-review`, `/ship`,
  …) — personal scope on the Mac; see CLAUDE.md "Cloud sessions".
- **Blocked from the cloud sandbox:** opalapp.com, wiz.io, whatsapp.com,
  PubMed, Unsplash, Pexels. `impeccable`'s launcher binary can't download
  there either; it falls back to reading project context directly — point
  it at Keeep-mobile's `DESIGN.md` (this repo has no `DESIGN.md`/`PRODUCT.md`).
- **Not in any repo:** the onboarding-lab C6 material (`docs/onboarding-lab/`,
  `src/_c6.js`, `plans/c6/`, `THESES.md`) and its badge design — Mac-local
  under `Keeep-app`.

## Where the code stands

Branch `claude/dazzling-maxwell-5wrqr3`. Polish pass 2 (`e839447`) is live
on the branch and at the preview artifact — scenes, live pacer, texture,
parallax, concise copy, photo slots, wordmarks — but still on the **15-section**
structure this brief replaces. Reuse its components (`AppScreens.js`,
`useSequence.js`, `useParallax.js`); rebuild the composition in `Landing.js`
to the eight sections above.
