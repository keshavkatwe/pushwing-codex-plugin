# Client checks

CI validates the committed package, tests discovery failure detection and checks
an isolated native marketplace installation against local fixtures. It also builds
an optional ZIP. No build tool or test workspace is needed to use the plugin.

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

## Automated discovery regression

CI runs package validation, then these checks:

```sh
python3 -m unittest discover -s tests -v
python3 scripts/smoke_discovery.py --host codex
```

CI pins the test client in `.github/workflows/validate.yml`. The smoke test uses the native
marketplace installer with an isolated configuration directory. It changes only
a temporary copy's MCP URL to a loopback fixture; the committed production URL
and the user's installed packages are untouched. No user credentials are copied,
no provider handlers run and the model returns canned local responses. No paid
model request or publishing action is required.

The fixture advertises the 97 tool names recorded from MCP 0.14.2, with synthetic
deeply nested preview/brand input schemas, under 35-entry and 100-entry page
limits. Codex must expose every entry through code-mode `ALL_TOOLS` with a
callable handle. Claude Code must advertise every MCP tool to the local model
fixture with tool search disabled so deferred loading cannot hide the inventory.
Both must follow continuation cursors without executing a tool. Missing or
uncallable tools fail; the negative test specifically rejects the observed
33-tool subset. Compatible additional tools are allowed.

These are controlled CLI integration checks. They do not certify OAuth, the
desktop app's marketplace-to-model handoff, provider writes or every host/model
configuration. Keep those acceptance results separate. When the live MCP adds
tools, update `scripts/expected-tools.json` from a verified authenticated catalog;
do not lower its requirements merely to accept an incomplete client.

## Real-client catalog acceptance

Use a new conversation after installing/updating the intended package. Record
the plugin version, client/build, connection type and server version. Check
**model-facing availability**, not just the server's `tools/list` count. The
current baseline is MCP 0.14.2 with 97 tools, including
`pushwing_prepare_publish_preview`, `pushwing_save_workspace_brand` and all 56
YouTube tools.

Export one connection at a time; do not combine duplicate marketplace and custom
registrations. In a Codex code-mode host, use the matching connection prefix
(`mcp__pushwing__` for the local marketplace server, or
`mcp__codex_apps__pushwing_` for the observed custom connection), for example:

```js
text(ALL_TOOLS.filter(t => t.name.startsWith('mcp__pushwing__')).map(t => ({
  name: t.name,
  callable: typeof tools[t.name] === 'function'
})));
```

Save only the returned JSON array, then run:

```sh
python3 scripts/check_discovery.py /absolute/path/to/tool-inventory.json
```

The same checker accepts canonical names and Claude MCP names. For other hosts,
use their supported tool inventory/export surface; do not invent a tool list or
count a model's prose as discovery evidence. The check reads a local export and
does not call tools or require tokens. Keep credentials and personal data out of
reports.

If server discovery is complete but model-facing tools are missing, record both
counts and connection types. A version bump or plugin reinstall is not proof of
a refreshed catalog. The custom MCP connection to the same hosted endpoint is a
working fallback observed in Codex; it is not proof the marketplace path is fixed.
Do not reconnect OAuth unless authentication is actually broken or consent changed.

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
