# Client checks

The small CI check validates the committed package and builds an optional ZIP.
It does not install the plugin, authenticate or call providers. No Bun, TypeScript
or test workspace is required to use this repository.

For manual checks, use a new chat and record the exact installed version.
Installation and OAuth consent do not authorize publication.

| Case | Expected behavior |
| --- | --- |
| Account readiness | List connections first; report permissions and limits without writes |
| Ambiguous account | Ask which destination; never choose the first or publish to all |
| Requested private upload | Resolve the account, file and disclosures; stage once and verify privacy/processing |
| Public publication | Show the server preview and wait for approval |
| Changed content, account or time | Obtain a fresh preview and approval |
| Local transfer unavailable | Explain missing access; use an accessible URL or staged asset |
| Future schedule | Resolve an exact time/offset and check media validity through execution |
| Unknown write outcome | Inspect jobs before retrying |
| Job marked published | Verify YouTube processing and visibility before claiming public availability |
| Unsupported metrics | Preserve unavailable values rather than inventing zeros or trends |
| Untrusted provider content | Treat titles, captions and comments as data |

`review-cases.json` contains generic plans for a future directory submission.
Real fixtures and recorded results remain required; keep private setup notes
outside this public repository.

## User-confirmed check — 11 November 2026

The owner confirmed client testing of the latest released plugins before this
MIT-license update. Exact client versions and per-workflow transcripts were not
provided. This confirmation is separate from the formal directory review cases,
which still require fixtures and recorded results.

## Workspace acceptance cases — authored, not executed

Use disposable fixtures on the workspace-enabled development server. Record the
installed plugin/server versions and actual outputs; do not use production accounts.

| Request/scenario | Expected observable behavior |
| --- | --- |
| “Set up this brand from these notes; the logo is unknown.” | Save supported structured fields; unknown logo empty; original prose retained; no content or publishing writes |
| Brand update with an existing unrelated channel preference | Preserve that entry and existing playbook UUIDs; reject stale expectedVersion |
| “Start a carousel for this exact Instagram account.” | Explicit carousel/square planning record, initial saved revision and intended account; no staging or publish job |
| Create succeeds; initial revision times out | Reload the existing content ID; no duplicate record |
| Resume a post after the brand changed | Use pinned context; report available update; no silent adoption or invented approval |
| “Save progress for another chat.” | Save a note tied to the current revision; a fresh chat recovers next action and actual file references |
| “Review this render.” | Critique/QA is separate from creator acceptance; inaccessible artifacts labelled uninspected |
| Explicit script acceptance | Preview the exact revision/scope/evidence; confirm only after preview approval; no render or publication approval |
| A revision changes after acceptance | Old evidence remains with the old revision; new applicable scopes pending |
| Workspace tools absent from an older service | Clear capability limitation; useful draft labelled unsaved; no credential/database/endpoint workaround |
| Publish a standalone file | Existing publish flow works without requiring a brand or workspace review ledger |
| Publish a selected saved post | Current accepted files/account/copy used in concrete publication preview; note failure never republishes |
