# Release checklist

## Git marketplace

1. Review the installable files under `plugins/pushwing/`. Preserve plugin name
   `pushwing`, marketplace name `pushwing-plugins` and the hosted endpoint. Update
   `package.json` and `plugins/pushwing/plugin.json` together for a release.
2. Run all README checks and inspect the final ZIP for its five skills, manifests
   and assets. Exclude credentials, app bindings, marketplace files and tooling.
3. Run `bun run validate:codex` where Codex CLI is available. Record native parsing
   separately from authentication and behavioral checks.
4. With user authorization, commit and push the feature branch and open a PR.
   Merge only after review and approval. CI builds a ZIP artifact; it does not
   create GitHub releases, install plugins, submit a listing or deploy the service.
5. After an approved release reaches the branch used by the Git marketplace,
   verify discovery in a clean client. Authenticate and run read-only checks.
   Provider writes need their own selected account, media and authorization.

The existing `pushwing-local` development marketplace is a separate source. Its
cached installation is not changed by this repository's build or validation.

## Official OpenAI directory

`bun run prepare:submission` stages `dist/submission-draft/pushwing/` using `review/`.
It does not produce a final submission ZIP or upload anything. The five positive
and three negative cases remain plans until actual runs are recorded.

Submission remains on hold until reviewer access, sample media, seeded jobs/posts,
case runs, a reviewed demo recording, publisher verification, portal OAuth setup
and scans are complete. Keep credentials and real account/job IDs in secure fields
and private notes. The developer approves the final materials and completes policy
attestations before submission. Approval and publication are separate actions.

- [Submission requirements](https://developers.openai.com/plugins/deploy/submission)
- [MCP review requirements](https://developers.openai.com/plugins/deploy/app-review)
- [Plugin guidelines](https://developers.openai.com/plugins/plugin-guidelines)
