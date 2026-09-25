# Keeep landing (getkeeep.com)

React CRA app: marketing landing page plus the password-gated customer-support
inbox at `/admin/support` (Stream Chat; backend is the separate Keeep-backend
repo on Heroku, reached via the `/api/admin/support/*` proxy in
`public/_redirects` for prod and `src/setupProxy.js` for dev).

Invite link previews: the `/invite` edge function
(`netlify/edge-functions/invite.ts`) personalizes the page's OG tags and points
og:image at the `/og/invite` function (`netlify/functions/og-invite/`), which
draws the invite card PNG. Shared logic lives in `netlify/lib/invite-preview.mts`.

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
- Netlify functions: `npm run test:netlify` (Node's built-in runner, Node
  22.18+ for TypeScript). After touching `netlify/functions/og-invite/` or
  upgrading satori/resvg, also run `npm run check:og-bundle`: it builds the
  deployable zip and renders a card from it, which catches runtime files
  missing from `included_files` in `netlify.toml`
- Local run: `INVITE_PREVIEW_API_URL=<mock or local backend>/api/public/invite-preview
  npx netlify-cli dev --functions netlify/functions --framework "#static" --dir build`
  (after `npm run build`). The CLI's static mode doesn't run edge functions;
  drive `invite.ts` directly with Deno for the /invite half

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
