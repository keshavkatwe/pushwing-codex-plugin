# Pushwing for Codex and ChatGPT

Publish and schedule media on your own YouTube and Instagram accounts, track jobs
and review available performance statistics. This repository contains the
installable plugin, its Git marketplace and development tooling. The hosted MCP
server is maintained separately.

## Install

```sh
codex plugin marketplace add keshavkatwe/pushwing-codex-plugin
codex plugin add pushwing@pushwing-plugins
```

The committed package is ready to install. Users do not need Bun, a build step or
access to the backend repository. The marketplace is `pushwing-plugins`; the plugin
is `pushwing`. Authenticate the bundled server through the host, start a new chat
and select `$pushwing:setup` or Setup in the skill picker.

For desktop installation, add the marketplace with the first command, then open
Plugins, choose the Pushwing source and install manually. Git distribution and
the official public directory are separate; this repo does not establish directory
approval or availability on every ChatGPT surface.

Link your provider accounts through [Connections](https://app.pushwing.com/connections).
Registration may be waitlisted. Keep passwords and tokens in the host's secure
authentication flow.

## Skills

| Skill | Purpose |
| --- | --- |
| `$pushwing:setup` | Check accounts, permissions and publishing limits |
| `$pushwing:publish` | Upload or publish selected media now |
| `$pushwing:schedule` | Schedule publication or change an existing schedule |
| `$pushwing:status` | Inspect jobs and verify YouTube processing and visibility |
| `$pushwing:report` | Summarize statistics for your own accounts |

Setup, status and reports are read-only. Public publication uses a server preview
and requires approval of the destination, content, visibility and schedule. A
requested private YouTube upload can execute without a server preview. Installing
the plugin does not authorize posting.

## Connection and data

The package connects to `https://mcp.pushwing.com/mcp` using HTTP MCP and
host-managed OAuth. It contains no local server, hooks or embedded credentials.
Tool arguments go to Pushwing, which communicates with the selected provider
account. Responses can include accounts, media metadata, jobs and analytics.

Publishing transfers selected media and metadata to Pushwing and the destination
provider. Local staging needs a host that can read the file and PUT bytes to the
exact returned upload URL. An accessible media URL or an already staged asset can
be used when that is unavailable. Staging can create a temporary public-by-link
copy. Assets expire after 24 hours and direct-upload URLs after one hour; returned
expiry values are authoritative.

The plugin does not persist analytics locally. Service handling follows the
[privacy policy](https://pushwing.com/privacy) and [terms](https://pushwing.com/terms).
Provider permissions, quotas and restrictions apply. YouTube quota is shared
across the Pushwing project.

## Development

Use Bun 1.4.4 and system `zip`/`unzip`:

```sh
bun install --frozen-lockfile --ignore-scripts
bun run typecheck
bun run lint
bun run check
bun test
bun run build
```

Edit `plugins/pushwing/` directly. The build creates `dist/pushwing-openai.zip` with
one plugin at the archive root. It excludes marketplaces, tooling and review
drafts. CI runs these checks and uploads the ZIP as a workflow artifact.

With Codex CLI installed, `bun run validate:codex` checks its native package reader
without installing the plugin, starting a model or calling provider tools. It may
need access to Codex's local state directory. Package validation does not verify
fresh OAuth, model behavior or provider publishing.

```text
.agents/plugins/marketplace.json
plugins/pushwing/
  plugin.json
  mcp.json
  skills/{setup,publish,schedule,status,report}/
  assets/icon.svg
  README.md
scripts/
tests/
review/                           # Incomplete directory metadata and cases
docs/{TESTING,RELEASE}.md
```

See [testing](docs/TESTING.md) and the [release checklist](docs/RELEASE.md).
Keep `package.json` and the plugin manifest version aligned; it is independent of
the hosted MCP and Claude plugin versions. Claude is maintained in
[pushwing-claude-plugin](https://github.com/keshavkatwe/pushwing-claude-plugin).
Skills are maintained separately in the two repositories.

Refresh a configured Git marketplace snapshot with
`codex plugin marketplace upgrade pushwing-plugins`, then follow the host's plugin
update flow and verify the installed version before recording a behavioral test.

## References and support

- [Plugin packaging and marketplaces](https://developers.openai.com/plugins/build/plugins)
- [Codex CLI commands](https://learn.chatgpt.com/docs/cli/reference)
- [Pushwing support](https://pushwing.com/support)
- [Integration issues](https://github.com/keshavkatwe/pushwing-codex-plugin/issues)

Keep credentials, signed URLs, reviewer accounts and private media out of issues
and pull requests.
