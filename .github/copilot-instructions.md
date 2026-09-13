This repo is the web UI for the MCP OAuth checker at https://check.gfbytes.com/.

- Same probe semantics as GFB2026/mcp-oauth-connect `diagnose.py`.
- Free path reads discovery metadata only. Do not add DCR, token mint, or `tools/list`.
- Do not commit `.vercel/`, `dist/`, or deploy artifacts.
- Python tests: `cd diagnose && python -m pytest tests/`
- Node tests: `npm test` (local / typecheck). CI covers the diagnose probe.
- MIT. No secrets, no private company internals.
