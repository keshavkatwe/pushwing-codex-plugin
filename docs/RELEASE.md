# Release checklist

The repository is the installable source. Users need no build project or runtime
script. There is one native Codex package in `plugins/pushwing/`.

1. Edit `plugins/pushwing/` on a feature branch from `main`.
2. Preserve the name `pushwing`, marketplace `pushwing-plugins`, native Codex manifest
   and hosted OAuth endpoint. Bump `plugins/pushwing/.codex-plugin/plugin.json` for a release.
3. Check all nine skills, presentation YAML and referenced assets. Test the
   intended client with read-only setup/status/report requests; record the exact
   installed version. A write test needs a selected account, media and approval.
4. Open a PR. The `validate` check parses JSON, checks package structure and
   confirmation/account rules, and produces an optional ZIP artifact.
5. Merge after review and successful CI. `main` is protected for all contributors,
   including administrators. Refresh the Git marketplace through the host and
   verify the installed version before recording behavioral results.

For a manual ZIP, run from `plugins/pushwing/`:

```sh
zip -r /absolute/output/path/pushwing-codex.zip .
```

The archive should contain one plugin at its root and exclude marketplace files,
developer docs, credentials and review materials. The workflow artifact provides
the same installable files without requiring a local build.

## Official directory

Git distribution is separate from official directory approval. Generic metadata
and the five positive/three negative review plans are retained in
`review-details.json` and `review-cases.json` alongside this document. They are
not proof of completed tests.

Submission remains on hold until real fixtures, reviewer access, actual case runs,
a reviewed demo, publisher verification, portal OAuth setup and scans are complete.
Keep account details and credentials in secure fields and private working notes.
The developer approves the final package and attestations before submission;
approval and publication are separate actions.

- [OpenAI packaging](https://developers.openai.com/plugins/build/plugins)
- [Submission requirements](https://developers.openai.com/plugins/deploy/submission)

## Publishing guidance for MCP 0.13 and later

New publication reviews use `pushwing_prepare_publish_preview`, including private YouTube uploads, followed by the named original publishing tool after approval. Pass the resolved IANA `timezone` at the preparation root when its schema supports it. Account/usage checks remain plain reads; their display tools are for explicit requests. Future queued jobs are acknowledged without polling until their execution date; native YouTube publication schedules still require verifying the immediate upload. Older catalogs use the documented safe fallback and need a refresh after the server rollout. Plugin source updates do not deploy MCP or refresh an installed client catalog.

## Workspace workflows from plugin 0.2.0

Four additional skills cover brand-setup, new-post, continue-post and review-post.
The existing account setup remains read-only; publish/schedule can hand off a
selected saved post without requiring workspace records for standalone files.
Before release, deploy/verify the MCP workspace catalog separately, refresh it
in the intended client, and verify all nine skill entries. Preserve endpoint,
OAuth scope, app identity and installed-cache configuration. Merging source into
`main` makes it available through this Git marketplace.
Installation, server deployment, directory publication and fresh-client acceptance
remain separate actions; record their evidence separately.

## Discovery gate for 0.2.1 and later

Run package validation, `python3 -m unittest discover -s tests -v` and
`python3 scripts/smoke_discovery.py` before release. CI runs these
checks using a pinned client. The isolated native marketplace check must expose
all 97 baseline tools with both 35- and 100-entry pages. It uses mock local
endpoints and no real credentials, models or publishing operations.

Before claiming a marketplace fix, separately run the real-client catalog check
in [TESTING.md](TESTING.md). Preserve the incomplete-catalog failure as a failed
acceptance result even when the custom-MCP fallback works. Do not infer desktop
acceptance from the controlled CLI check or package validation.

## Codex marketplace compatibility from 0.2.2

The Git marketplace selects the single `plugins/pushwing/` package, containing
`.codex-plugin/plugin.json`. Do not add a root `plugin.json`: Codex would prefer
it and apply its Agent Plugins schema budget again.

Codex 0.171.0-alpha.13 silently hides Agent Plugin tools above its 64,000-byte
aggregate / 8,000-byte per-tool schema limits (OpenAI Codex issue #44308). The
regression fixture includes public input schemas and long server instructions.
A temporary old-format control reproduces 33 tools; the native package must
expose all 97 with both tested page sizes. No MCP release is required.

## Prepared: single publishing preview and scoped approval

The publishing widget is the single media/caption/schedule preview. Its valid Approve schedule click confirms the exact schedule and submits through the original publishing tool without another confirmation question. Normal host approval checks remain; rejections are explained without alternate routes or keyword workarounds. Plain text fallback remains available when the widget cannot render or the user requests it. Source changes only; installation, server deployment and native-host acceptance remain separate.
