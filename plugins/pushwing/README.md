# Pushwing for Codex

Publish and schedule media, check jobs and review performance on your own YouTube
channels and Instagram professional accounts through Pushwing. This plugin uses
the hosted service at https://mcp.pushwing.com/mcp with OAuth. Approved uploads and
publication affect real accounts. Registration may be waitlisted.

| Workflow | Codex skill |
| --- | --- |
| Setup and readiness | `$pushwing:setup` |
| Saved brand setup | `$pushwing:brand-setup` |
| New saved draft | `$pushwing:new-post` |
| Resume, revise and hand off | `$pushwing:continue-post` |
| Separate content reviews | `$pushwing:review-post` |
| Immediate publishing | `$pushwing:publish` |
| Future publication | `$pushwing:schedule` |
| Job and visibility checks | `$pushwing:status` |
| Performance report | `$pushwing:report` |

Use the host's skill picker when available. Connect the bundled server and complete
OAuth when prompted. Provider account linking and permission repair happen at
https://app.pushwing.com/connections. Keep tokens out of chat and plugin files.

Run setup, status and reports as read-only smoke checks. Publishing, staging,
changes and cancellations require an explicit request. Public publication requires
approval of the server's preview. A YouTube job marked `published` still needs video
processing and visibility verification.

```sh
codex plugin marketplace add keshavkatwe/pushwing-codex-plugin
codex plugin add pushwing@pushwing-plugins
```

Start a new chat after installation. This package includes its own hosted-server
declaration and has no dependency on a pre-existing private app registration.
Its version is independent of the MCP server version. Installation, OAuth consent
and live publishing must be checked separately from package validation.

Source and release instructions:
[pushwing-codex-plugin](https://github.com/keshavkatwe/pushwing-codex-plugin).
Claude is maintained in
[pushwing-claude-plugin](https://github.com/keshavkatwe/pushwing-claude-plugin).

[Privacy](https://pushwing.com/privacy) · [Terms](https://pushwing.com/terms) · [Support](https://pushwing.com/support)

[MIT license](LICENSE) applies to this package. Hosted services retain their own terms.

## MCP 0.12.0 migration

This plugin supports MCP 0.12.0 and uses `pushwing_get_usage_limits` for personal allowances, reservations, resource budgets and account capacity. Allowances apply across your accounts; Instagram account capacity is separate. Refresh/rescan the client catalog to discover the replacement tool. OAuth reconnection is only for authentication repair or changed consent.

## Saved brand and content workflows

Brand setup, new post, continue post and review post ship from plugin 0.2.0 and
require the workspace tools introduced in MCP 0.14. The Git marketplace source
and live service are versioned separately; tool availability must be checked
in the intended client.
If they are missing, the skill explains the missing capability and leaves any
draft unsaved. Refresh the tool catalog after the server rollout; normal plugin
updates do not require OAuth reconnection.

A brand stores channel identity, structured guidance and reusable playbooks.
Content supports image, carousel, reel, story, video and short, with an exact
intended account and independent layout. Existing revisions retain pinned context;
new brand guidance is adopted only when explicitly chosen. Save-progress notes
support a fresh-chat handoff. Content reviews and publication approval are separate.
Host-side SKILL.md/HyperFrames production skills still run in the AI client;
saving a playbook does not install or execute a renderer.

Git marketplace availability, installed package versions and authenticated client
acceptance are separate. Automated checks cover packaging and controlled CLI
discovery; they do not establish that a desktop installation exposes every tool.

## Tool discovery troubleshooting

The plugin package supplies nine workflows and declares the hosted MCP connection;
the live service supplies the tools. Their versions are independent. The current
MCP 0.14.2 catalog contains **97 tools**, including publishing preview, brand save
and 56 YouTube tools.

Plugin versions before 0.2.2 used the Agent Plugins manifest, which makes Codex
silently hide tools once its schema budget is exhausted. Version 0.2.2 uses the
native Codex manifest; a fresh Codex CLI check against production exposes all
97 tools. The custom MCP connection can serve as a fallback. Verify the inventory
in a fresh desktop chat separately after updating.
Check the actual host tool inventory after installation; a server count, package
validation or reinstall alone does not prove model-facing availability. The
custom connection and packaged skills are separate: connecting the server does
not by itself install the nine skills. See [client checks](https://github.com/keshavkatwe/pushwing-codex-plugin/blob/main/docs/TESTING.md) for the
discovery checker and the distinction between automated CLI and desktop acceptance.
