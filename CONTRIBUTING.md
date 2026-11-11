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
