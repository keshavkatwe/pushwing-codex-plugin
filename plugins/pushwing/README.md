# Pushwing for ChatGPT and Codex

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

## Saved brand and content workflows (prepared 0.2.0)

Brand setup, new post, continue post and review post require the workspace tools
introduced in MCP 0.14. They are prepared alongside the server feature; package
validation does not mean those tools are deployed or present in your client.
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

These source changes are not installed, published or verified in a fresh client.
