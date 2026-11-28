# Codex marketplace tool exposure

## Cause

Pushwing's production MCP 0.14.2 advertises 97 tools. Codex 0.171.0-alpha.13
applies extra limits to servers sourced from an Agent Plugins manifest:
8,000 bytes per model tool specification and 64,000 bytes shared across Agent
Plugin tool specifications. Overflow becomes `ToolExposure::Hidden` and cannot
be recovered by searching tools or increasing MCP page size. Custom MCP servers
and native Codex plugins do not follow this Agent Plugins budget path.

Source for the installed runtime:

- [Budget and hidden exposure](https://github.com/openai/codex/blob/rust-v0.171.0-alpha.13/codex-rs/core/src/mcp_tool_exposure.rs)
- [Namespace specification construction](https://github.com/openai/codex/blob/rust-v0.171.0-alpha.13/codex-rs/core/src/tools/handlers/mcp.rs)
- [Upstream issue #44308](https://github.com/openai/codex/issues/44308)

The per-tool serialized specification includes a namespace description derived
from server instructions, charging that description repeatedly. With Pushwing's
actual tool schemas and long instructions, 33 tools remain visible. The two large
workspace schemas are excluded as well as the later tools. Reinstallation and
paging changes do not remove these client limits.

## Package change

The Git marketplace selects the ready-to-install native package at
`plugins/pushwing-codex/`. Its `.codex-plugin/plugin.json` keeps the same plugin
name, version, interface, hosted MCP configuration and nine workflows. It is
generated from the portable source using `scripts/build_codex_package.py`.
The portable Agent Plugins package remains complete in `plugins/pushwing/` for
portable exports. Both packages contain their own required files; installation
requires no generator or local runtime. CI rejects drift between distributions.

This is a Git marketplace compatibility fix. It does not fix the upstream Codex
budget or establish acceptance of the portable public directory package.

## Verification on 28 November 2026

Codex CLI 0.171.0-alpha.13, code mode:

| Connection/package | MCP page size | Callable Pushwing tools |
| --- | --- | --- |
| Portable Agent Plugins control, complete public schemas and long instructions | 100 | 33 |
| Native Git marketplace package, same fixture | 35 | 97 |
| Native Git marketplace package, same fixture | 100 | 97 |
| Installed native 0.2.2 package, production MCP and existing OAuth | production | 97 |

The production check used a fresh ephemeral native Codex CLI run with the custom
app connection disabled and only the installed marketplace plugin selected. All
97 canonical tool names matched the expected catalog; every corresponding
callable handle existed, and no custom-connection names were counted. A canned
loopback model inspected metadata only: zero account or publishing tool calls,
no new OAuth consent, and no real model inference. The saved Git marketplace
source and production endpoint remained unchanged. This does not observe a
fresh Codex desktop chat or refresh an existing desktop chat's tool inventory.

Candidate plugin version: **0.2.2**. The Git marketplace rollout requires review
and merge of this package change.
Locally installed preview: **0.2.2** through the supported Codex plugin installer.
Public Git release: **0.2.1** until the new changes are reviewed and merged.
MCP service version: **0.14.2**, unchanged by this packaging fix.

The regression fixture contains public tool definitions and synthetic long
instructions only; it contains no credentials or user data. Refresh it alongside
`scripts/expected-tools.json` when the public server catalog changes.
