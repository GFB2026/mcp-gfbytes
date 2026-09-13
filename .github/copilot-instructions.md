# GitHub Copilot — mcp-gfbytes

This repository is the **public web checker** for MCP OAuth Connect (TanStack Start). Live UI: https://check.gfbytes.com/. Same probe semantics as `GFB2026/mcp-oauth-connect` `diagnose.py`. MIT. Metadata-only free path.

Shop-window pin: web UI companion to `mcp-oauth-connect`. Do not treat this repo as a fleet, ops, or private-product surface.

## Safe lanes

Stay here unless a human names a different **public shop-window** task:

- Docs and comments (README, this file). No Volo/customer brand-hype vocabulary.
- Diagnose unit tests: `cd diagnose && python -m pytest tests/`
- Node local checks: `npm test`, `npm run typecheck` (Node ≥22)
- GitHub Copilot config only: this file, `.copilotignore`, `.github/workflows/copilot-setup-steps.yml`

CI already runs the diagnose probe in `.github/workflows/tests.yml`. Do not replace that workflow.

Do not commit `.vercel/`, `dist/`, or deploy artifacts. Local dev needs no secrets: with `DATABASE_URL` unset the app uses embedded PGLite.

## NEVER

- Secrets: commit `.env`, `.env.*` with real values, credential files, or `DATABASE_URL` with real credentials
- Vercel production deploy, or any live production ship from this repo
- `COPILOT_MCP` or MCP config that can reach apps, ops, or `gc-mcp`
- Fleet / `gc-mcp` work; greg-chat; gregops-plugins; gfb; private ILI / mail / money / client / intake
- Handshake creep on the free check: DCR, token mint, or `tools/list`
- Stripe live keys or checkout wiring beyond existing public product copy
- Private company internals

## Verify

```bash
npm test
npm run typecheck
cd diagnose && python -m pytest tests/
```
