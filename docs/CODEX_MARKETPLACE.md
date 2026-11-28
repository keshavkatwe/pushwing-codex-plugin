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

The repository ships one ready-to-install Codex plugin at `plugins/pushwing/`.
Its `.codex-plugin/plugin.json` replaces the previous root Agent Plugins manifest,
keeping the same name, version, interface, hosted MCP configuration and nine
workflows. The marketplace still selects the original package directory. There
is no second distribution or package-generation step.

This fixes Git marketplace loading through Codex's supported native format; the
upstream Agent Plugins budget remains unchanged. The old-format control exists
only as a temporary fixture created by the regression test.

## Verification on 28 November 2026

Codex CLI 0.171.0-alpha.13, code mode:

| Connection/package | MCP page size | Callable Pushwing tools |
| --- | --- | --- |
| Legacy-format test control, public input schemas and long instructions | 100 | 33 |
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

The regression fixture contains public input schemas and synthetic long
instructions only; it contains no credentials or user data. Refresh it alongside
`scripts/expected-tools.json` when the public server catalog changes.
