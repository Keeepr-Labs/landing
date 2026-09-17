# Keeep landing (getkeeep.com)

React CRA app: marketing landing page plus the password-gated customer-support
inbox at `/admin/support` (Stream Chat; backend is the separate Keeep-backend
repo on Heroku, reached via the `/api/admin/support/*` proxy in
`public/_redirects` for prod and `src/setupProxy.js` for dev).

## Landing page (`/`)

`src/pages/Landing/` — a value/feature page, not a waitlist capture. The iOS
app is live, so the primary CTA is the App Store listing
(`apps.apple.com/app/id6471142186`); Android still routes to
`/waitlistAndroid`.

The business model is a **subscription**. Pledge tickets / stakes are
retired — the page must not mention pledges, tickets or money on the line
(`Landing.test.js` enforces this). Value props, in page order: accountability
as a side quest with a friend → who to bring → leaderboard + pacer + the
commitment badge (a number, a date, your name) → workouts auto-sync from
Apple Health → backed by science → recurring monthly rounds → setup.

- `Landing.js` — section composition and all marketing copy
- `AppScreens.js` — the in-app screens rebuilt in HTML/CSS (pace arc,
  leaderboard, group chat, commitment badge, goal setup) plus the auto-sync
  and rounds visuals, so they stay crisp and responsive instead of shipping
  screenshots. Swap a component body for an `<img>` if you ever get Figma
  exports. `PACE_TIERS` copy here is the source of truth for the pacer
  messages on the site; the app's `getProgressMessage` still has pledge
  wording and should be aligned.
- The four studies in `Science()` are cited from memory (this environment
  could not reach PubMed) — verify before a big push.
- `useReveal.js` — one-shot scroll reveal; falls back to "already revealed"
  when IntersectionObserver is missing so content never depends on an effect
- `useSequence.js` — steps a scene (the animated chats, the live pacer) on a
  timer once its section is revealed; returns the final step immediately
  under `prefers-reduced-motion`. `useParallax.js` drifts `[data-parallax]`
  elements on scroll; off for reduced motion and touch. Both listen to the
  body scroller via capture-phase `scroll` (see gotcha below).
- Copy budget: every supporting line carries `.k-line` and the test caps it
  at 120 characters. Headline + one line per section, like Opal.
- Photography: `PHOTOS` at the top of `Landing.js` — each slot renders an
  on-brand textured tile until a `src` is set. Stock hosts were unreachable
  from the build sandbox; Unsplash/Pexels licences allow use without credit.
- Institution logos: `INSTITUTIONS` in `AppScreens.js` renders wordmarks;
  set `logo` to an SVG path once you have permission to use the mark.
- The brand scribble (`public/images/scribble.png`, from the app's
  `goalCardBackground.png`) is handed to CSS as `--scribble` from
  `Landing.js`, because css-loader would try to bundle a root-relative
  `url()`. Its clear area carries a faint tint: use it with
  `mix-blend-mode: multiply`, never `screen`.
- Copy voice and the narrative order come from the Keeep-mobile repo:
  `docs/brand-guidelines.md`, `newUserIntro/config.tsx` and
  `screens/onboarding/*`. Design tokens mirror `utils/ColorsAndFonts.ts` and
  `DESIGN.md` (light mode only).

Two gotchas worth keeping in mind:

- Reduced-motion overrides for anything that starts at `opacity: 0` live in
  the **last** block of `Landing.css`; at equal specificity the later rule
  wins, and a chip left at 0 for a reduced-motion visitor is invisible copy.
- Element resets inside `.k-landing` are wrapped in `:where()` on purpose.
  Plain `.k-landing h2 { margin: 0 }` outranks the section classes and
  silently flattens every heading margin on the page.
- `body, html { overflow-x: hidden }` in `App.css` makes **body** the scroll
  container, so `window.scrollTo` is a no-op. Don't add `overflow-x` to
  `.k-landing` — it computes `overflow-y: auto` and nests a second scroller.

## Deploy Configuration

- Platform: netlify (project "getkeeep")
- Production URL: https://getkeeep.com
- Deploys: merging to `main` auto-deploys production; PRs get deploy previews
- No staging environment

## Testing

- Run: `CI=true npx react-scripts test --watchAll=false`
- jest needs the `moduleNameMapper` pins in package.json (react-router v7 ESM
  vs CRA jest 27) and the polyfills in `src/setupTests.js` — revisit both on
  any tooling upgrade
- When fixing a bug, add a regression test; when adding a conditional, test
  both paths

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore
- Author a backlog-ready spec/issue → invoke /spec

## gstack

The skills above come from [gstack](https://github.com/garrytan/gstack). Update
the suite with /gstack-upgrade.

### Web browsing

- Use the /browse skill for **all** web browsing.
- Never use the `mcp__claude-in-chrome__*` tools.
- In a cloud session /browse only reaches hosts the environment's network
  policy allows, so general browsing fails there — see "Cloud sessions" below.

### Available skills

Planning and review:
/office-hours, /plan-ceo-review, /plan-eng-review, /plan-design-review,
/plan-devex-review, /autoplan, /review, /devex-review, /cso

Design:
/design-consultation, /design-shotgun, /design-html, /design-review

Build and ship:
/ship, /land-and-deploy, /canary, /benchmark, /investigate, /qa, /qa-only

Browser:
/browse, /connect-chrome, /scrape, /setup-browser-cookies

Docs and process:
/document-release, /document-generate, /retro, /learn, /codex

Setup and safety:
/setup-deploy, /setup-gbrain, /careful, /freeze, /guard, /unfreeze,
/gstack-upgrade

Also installed and usable, though not in the list above: /context-save,
/context-restore and /spec (referenced by Skill routing), plus /diagram,
/health, /make-pdf, /landing-report, /pair-agent, /skillify and the /ios-*
family.

### Cloud sessions

A cloud session is a fresh clone of this repo plus the skills enabled on the
claude.ai account — nothing else. Only two scopes reach it:

- `.claude/skills/<name>/SKILL.md` committed to this repo (project scope)
- skills enabled on claude.ai

Personal-scope skills in `~/.claude/skills/` live on one machine and never
travel, so a gstack installed there works locally but is absent on the web.
Install project-scope skills with `npx skills add <owner>/<repo>`, which
vendors to `.agents/skills/` and symlinks `.claude/skills/`; `/plugin` is
terminal-only and unavailable in cloud sessions.

/browse additionally needs a working Chromium and an environment network
policy that allows the target host. Neither is guaranteed in a cloud session.

### Team mode

gstack runs in team mode: `.claude/hooks/check-gstack.sh` is a PreToolUse hook
that blocks skills when gstack is missing. It is patched against upstream to
enforce gstack only for gstack's own skills — project-scope and account-synced
skills resolve without it, and blocking them would leave cloud sessions with no
skills at all. Re-check that patch after /gstack-upgrade or a re-run of
`gstack-team-init`, either of which may revert it.

Each developer installs gstack once:

    git clone --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
    cd ~/.claude/skills/gstack && ./setup --team
