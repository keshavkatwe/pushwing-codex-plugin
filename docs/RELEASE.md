# Release checklist

The repository is the installable source. There is no build project or runtime
script to install.

1. Edit `plugins/pushwing/` on a feature branch from `main`.
2. Preserve the name `pushwing`, marketplace `pushwing-plugins`, portable schemas
   and hosted OAuth endpoint. Bump `plugins/pushwing/plugin.json` for a release.
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
zip -r /absolute/output/path/pushwing-openai.zip .
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
`python3 scripts/smoke_discovery.py --host codex` before release. CI runs these
checks using a pinned client. The isolated native marketplace check must expose
all 97 baseline tools with both 35- and 100-entry pages. It uses mock local
endpoints and no real credentials, models or publishing operations.

Before claiming a marketplace fix, separately run the real-client catalog check
in [TESTING.md](TESTING.md). Preserve the incomplete-catalog failure as a failed
acceptance result even when the custom-MCP fallback works. Do not infer desktop
acceptance from the controlled CLI check or package validation.
