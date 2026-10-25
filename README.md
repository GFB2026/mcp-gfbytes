# MCP OAuth web checker

[![tests](https://github.com/GFB2026/mcp-gfbytes/actions/workflows/tests.yml/badge.svg)](https://github.com/GFB2026/mcp-gfbytes/actions/workflows/tests.yml)

**Why Connectors fail when curl works.**

Paste the HTTPS MCP URL you put in Claude, Cursor, Desktop, or Grok. This app probes the OAuth discovery path those UIs actually need — not whether `curl` got a 200.

| | |
|---|---|
| **Live checker** | [check.gfbytes.com](https://check.gfbytes.com/) |
| **Demo MCP** | `https://mcp.gfbytes.com` |

This repo is the free **web checker** (TanStack Start). **Live SoT for the check UI is https://check.gfbytes.com/** (Vercel custom domain). Do not commit `.vercel/output`.

## What this is not

- **Not a completed handshake.** Discovery metadata only. No DCR, no token, no `tools/list`.
- **Not a hosted MCP.** The demo remote is `https://mcp.gfbytes.com` (ping-only).

## Clone / run

Requires Node ≥22. No secrets needed for local dev — with `DATABASE_URL` unset, the app falls back to an embedded PGLite database automatically.

```bash
git clone https://github.com/GFB2026/mcp-gfbytes.git
cd mcp-gfbytes
npm install
npm run dev          # http://0.0.0.0:8080
npm run typecheck
npm test
```

CLI diagnose (stdlib Python, no install):

```bash
python diagnose/diagnose.py https://mcp.gfbytes.com
cd diagnose && python -m pytest tests/
```

## What it checks

Authorization-server metadata (or OIDC fallback), PKCE S256, RFC 9728 protected-resource metadata (origin and path forms), no cross-host redirect on the MCP path, unauthenticated GET/POST behavior (401/405 vs anonymous discovery), absolute `resource_metadata` HTTPS URL.

## Repo layout

```
src/           web app (Checker UI + server diagnose)
diagnose/      CLI diagnose.py + tests
screenshots/   browser smoke output
scripts/       build / env helpers
server/        Nitro / PWA middleware
```

Build output (`.vercel/`, `dist/`) is gitignored — do not commit deploy artifacts.

## For AI assistants / contributors

Safe work: docs, diagnose unit tests (`cd diagnose && python -m pytest tests/`), `npm test`, `npm run typecheck`, and the GitHub Copilot files under `.github/` plus `.copilotignore`. Do not replace `.github/workflows/tests.yml`.

The free check is discovery metadata only — do not add DCR, token mint, or `tools/list`. Do not commit secrets, `.env*` with credentials, a real `DATABASE_URL`, `.vercel/`, or `dist/`.

## License

MIT
