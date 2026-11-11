# Pushwing Codex plugin

This repository owns the ChatGPT/Codex plugin and its Git marketplace. The hosted
MCP service is maintained separately. Claude is maintained in
https://github.com/keshavkatwe/pushwing-claude-plugin.

- Edit the installable files in `plugins/pushwing/` directly. Users install these
  committed files without running Bun or a build step.
- Keep `package.json` and `plugins/pushwing/plugin.json` versions aligned. Plugin
  versions are independent of the hosted MCP and Claude plugin versions.
- Keep each of the five skills self-contained, including the common account,
  confirmation, staging and completion rules. There is no automatic skill sync
  with the Claude repository.
- Keep the portable `plugin.json` and `mcp.json` schemas. Do not add a private app
  ID or a parallel MCP server per skill. Use the existing hosted OAuth endpoint.
- Run `bun run typecheck`, `bun run lint`, `bun run check`, `bun test` and
  `bun run build` after changes. `bun run validate:codex` uses the installed Codex
  reader and does not install the plugin or run provider tools.
- `tests/fixtures/tool-catalog.json` is a dated source snapshot, not evidence of
  the current deployed release. Review it against the backend when tools change.
- Keep credentials, reviewer-account details, actual job IDs, media and signed
  upload URLs out of this repository. Directory review materials remain a draft.
- Work on a feature branch. Do not commit, push, install, publish, deploy or submit
  for review unless the user requests that action. Do not merge without explicit
  approval after review. Preserve the existing licensing unless explicitly changed.
