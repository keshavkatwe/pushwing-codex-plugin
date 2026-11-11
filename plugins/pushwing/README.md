# Pushwing for ChatGPT and Codex

Publish and schedule media, check jobs and review performance on your own YouTube
channels and Instagram professional accounts through Pushwing. This plugin uses
the hosted service at https://mcp.pushwing.com/mcp with OAuth. Approved uploads and
publication affect real accounts. Registration may be waitlisted.

| Workflow | Codex skill |
| --- | --- |
| Setup and readiness | `$pushwing:setup` |
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
