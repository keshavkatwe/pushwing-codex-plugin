# Release checklist

The repository is the installable source. There is no build project or runtime
script to install.

1. Edit `plugins/pushwing/` on a feature branch from `main`.
2. Preserve the name `pushwing`, marketplace `pushwing-plugins`, portable schemas
   and hosted OAuth endpoint. Bump `plugins/pushwing/plugin.json` for a release.
3. Check the five skills, presentation YAML and referenced assets. Test the
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
