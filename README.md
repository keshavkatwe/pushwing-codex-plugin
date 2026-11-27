<div align="center">
  <img src="./.github/assets/logo.png" width="88" height="88" alt="Pushwing logo" />
  <h1>Pushwing for Codex &amp; ChatGPT</h1>
  <p>Publish anywhere from any AI.</p>
  <p>Publish and schedule your YouTube and Instagram content,<br />track uploads, and understand how your posts perform.</p>
  <p>
    <a href="https://github.com/keshavkatwe/pushwing-codex-plugin/actions/workflows/validate.yml"><img src="https://github.com/keshavkatwe/pushwing-codex-plugin/actions/workflows/validate.yml/badge.svg?branch=main" alt="Plugin validation" /></a>
    <img src="https://img.shields.io/badge/works_with-Codex%20%2B%20ChatGPT-B2C6FF?style=flat-square" alt="Works with Codex &amp; ChatGPT" />
    <img src="https://img.shields.io/badge/connection-hosted_MCP-18181B?style=flat-square" alt="Hosted MCP connection" />
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-B2C6FF?style=flat-square" alt="MIT license" /></a>
  </p>
  <p>
    <a href="https://pushwing.com">Website</a> ·
    <a href="https://app.pushwing.com/connections">Connect accounts</a> ·
    <a href="#quick-start">Quick start</a> ·
    <a href="https://github.com/keshavkatwe/pushwing-codex-plugin/issues">Get help</a>
  </p>
</div>

---

## Your content, from conversation to publication

Start with a video, image or publishing plan. Pushwing connects your AI client to
**your own YouTube channels and Instagram professional accounts** through the hosted
Pushwing service.

- **Publish** videos, Shorts, Reels, images, Stories and carousels.
- **Schedule** a release and check that its media stays valid until publication.
- **Track** uploads, processing, queued jobs and failures.
- **Report** available views, likes, comments and other supported metrics.

## Quick start

### 1. Install the plugin

```sh
codex plugin marketplace add keshavkatwe/pushwing-codex-plugin
codex plugin add pushwing@pushwing-plugins
```

No build step or local server is needed. The marketplace is `pushwing-plugins`;
the plugin is `pushwing`.

For desktop installation, run the marketplace command, open **Plugins**, select
**Pushwing** as the source and install it there.

### 2. Connect your accounts

Sign in when your client prompts you to connect Pushwing. Link YouTube or Instagram
at [app.pushwing.com/connections](https://app.pushwing.com/connections).
Registration may be waitlisted, and provider permissions and quotas apply.

### 3. Start with setup

Start a new chat and run `$pushwing:setup`, or choose **Setup** from the
skill picker. Try these requests:

> Which accounts do I have connected, and what are my publishing limits?

> Help me upload this video to YouTube as private, then check its processing.

> Compare the available performance of my latest YouTube video and Instagram post.

## Nine workflows

| Workflow | Command | What it does |
| --- | --- | --- |
| **Setup** | `$pushwing:setup` | Check accounts, permissions and publishing limits |
| **Brand setup** | `$pushwing:brand-setup` | Save channel identity, kit and playbooks |
| **New post** | `$pushwing:new-post` | Create a draft for a brand, account and post type |
| **Continue post** | `$pushwing:continue-post` | Resume, revise and save a handoff |
| **Review post** | `$pushwing:review-post` | Inspect work and record separate review decisions |
| **Publish** | `$pushwing:publish` | Upload or publish selected media now |
| **Schedule** | `$pushwing:schedule` | Plan a release or change an existing schedule |
| **Status** | `$pushwing:status` | Inspect jobs, processing and visibility |
| **Report** | `$pushwing:report` | Summarize available statistics and insights |

## You're in control

Setup, status and reports are read-only. Publishing requires your request and a
resolved destination. Public publication uses a server preview and waits for your
approval; a requested private YouTube upload can execute without a server preview.
Installing the plugin does not authorize posting.

The plugin connects to `https://mcp.pushwing.com/mcp` with host-managed OAuth.
It contains no local server, executable hooks or embedded credentials. Selected
media and metadata move to Pushwing and the destination provider when you request
publication. Staging can create a temporary public-by-link copy; returned expiry
values are authoritative. Assets expire after 24 hours and upload URLs after one
hour. If local file transfer is unavailable, use an accessible URL or staged asset.

Account permissions, publishing limits and optional analytics access depend on
the live service. Check your personal allowances and operation availability with
`pushwing_get_usage_limits`. The plugin does not persist analytics locally. See the [privacy policy](https://pushwing.com/privacy)
and [terms](https://pushwing.com/terms) for service-side handling.

## Updates and support

Keep your installed plugin current through your client's marketplace update flow.
The plugin version is independent of the hosted MCP server. Git distribution and
official directory approval are separate; check each intended client surface.

- [Report an integration issue](https://github.com/keshavkatwe/pushwing-codex-plugin/issues/new/choose)
- [Suggest an improvement](https://github.com/keshavkatwe/pushwing-codex-plugin/issues/new/choose)
- [Contribute](CONTRIBUTING.md) · [Release checklist](docs/RELEASE.md)
- [Report a security issue privately](SECURITY.md)

## License

[MIT](LICENSE) covers the files in this repository. The hosted Pushwing service
remains governed by its own [terms](https://pushwing.com/terms).

## Other clients

Use [Pushwing for Claude](https://github.com/keshavkatwe/pushwing-claude-plugin)
for the other plugin format. Both use the same hosted service and maintain their
own skills and versions.

<div align="center">
  <sub><a href="https://pushwing.com">Pushwing</a> · <a href="https://pushwing.com/privacy">Privacy</a> · <a href="https://pushwing.com/terms">Terms</a> · <a href="https://pushwing.com/support">Support</a></sub>
</div>

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
