# Pushwing Codex plugin

- Edit the ready-to-install files under `plugins/pushwing/` directly. Users need
  no build tools, package manager or local server.
- Preserve the portable manifests, stable names and hosted OAuth endpoint. Keep
  all five workflows self-contained, including account selection, confirmations,
  staging and verified completion.
- Bump `plugins/pushwing/plugin.json` for shipped changes. Its version is
  independent of the MCP service and Claude plugin.
- The small `validate` workflow checks package structure and creates a ZIP
  artifact. Keep developer-only tooling out of the installable package.
- Keep secrets, real account/job IDs, signed URLs and private review notes out of
  the repository. `docs/review-*.json` contains unverified generic review plans.
- Work on feature branches and use PRs. `main` requires passing CI and resolved
  conversations, including for admins. Commit, push and merge when authorized by
  the user; preserve existing licensing unless the user changes it.
