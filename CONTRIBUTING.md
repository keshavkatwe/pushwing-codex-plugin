# Contributing to Pushwing for Codex and ChatGPT

Thanks for helping improve Pushwing. This repository owns the client plugin;
the hosted service is maintained separately.

## Suggest a change

Open an issue with the workflow you're trying to complete and the client you're
using. For a bug, include the client/plugin versions, steps, expected behavior
and what actually happened. Keep credentials, private media and signed URLs out
of issues and logs. Security reports belong in [private reporting](SECURITY.md).

## Make a pull request

1. Fork the repository and create a feature branch from `main`.
2. Edit the installable files in `plugins/pushwing/`. Keep each skill self-contained.
3. Preserve the hosted endpoint and stable plugin/marketplace names. For changes
   to shipped plugin files, bump `plugins/pushwing/plugin.json` once for the release.
4. Follow the [release checks](docs/RELEASE.md). Setup/status/report checks are
   read-only; provider writes require a selected test account, media and approval.
5. Open a focused PR describing the resulting behavior and your validation.

`main` is protected: all changes go through PRs with passing `validate` checks,
up-to-date branches and resolved conversations. This applies to administrators.
Squash merging keeps the history readable. No additional approver is required
for this single-maintainer workflow; feedback and review are welcome.

The five workflows cover setup, publishing, scheduling, status and reports.
Retain account selection, confirmation previews, safe media staging and verified
completion when changing their instructions.

Contributions to this repository are licensed under [MIT](LICENSE).

## Native Codex distribution

Edit the portable source in `plugins/pushwing/`, then run
`python3 scripts/build_codex_package.py`. Commit both source and generated native
files. `--check` verifies they match. The marketplace installs the generated
`plugins/pushwing-codex/` package; its manifest has the same name, version, metadata,
MCP configuration and skills. Keep the portable root manifest out of the native
package: Codex prefers it and re-enables its Agent Plugins schema budget.

`python3 scripts/smoke_discovery.py --host codex` replays complete public tool
descriptors with long server instructions. It reproduces the portable 33-tool
control and requires all 97 tools to be callable through the native marketplace
with page sizes 35 and 100. It executes no MCP tools and uses no real model.
