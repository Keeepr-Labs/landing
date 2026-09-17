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
- Copy voice and the narrative order come from the Keeep-mobile repo:
  `docs/brand-guidelines.md`, `newUserIntro/config.tsx` and
  `screens/onboarding/*`. Design tokens mirror `utils/ColorsAndFonts.ts` and
  `DESIGN.md` (light mode only).

Two gotchas worth keeping in mind:

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
