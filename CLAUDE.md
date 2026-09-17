# Keeep landing (getkeeep.com)

React CRA app: marketing landing page plus the password-gated customer-support
inbox at `/admin/support` (Stream Chat; backend is the separate Keeep-backend
repo on Heroku, reached via the `/api/admin/support/*` proxy in
`public/_redirects` for prod and `src/setupProxy.js` for dev).

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
