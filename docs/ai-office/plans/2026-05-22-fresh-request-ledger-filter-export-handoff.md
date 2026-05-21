# AI Office fresh request ledger filtering/export — 2026-05-22

## Scope

User approved continuing from the recommended `operator_request_ledger_filtering_and_export` rung with bounded write authority. This slice adds safe readback filters and a copyable safe export to the existing fresh request-builder ledger.

## Code result

Commit:

- `9086b998 feat(office): filter and export fresh request ledger`

Implemented:

- `get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_readback(...)` now accepts:
  - `outcome`
  - `queue_status`
  - `ref_prefix`
  - `since`
  - `until`
  - `limit`
  - `export_safe`
- Protected API:
  - `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger?outcome=...&queue_status=...&ref_prefix=...&since=...&until=...&export_safe=true`
- Safe export:
  - `fresh_request_builder_safe_export_v1`
- Frontend API now requests `export_safe=true&limit=20`.
- Office display-only UI panel now renders:
  - filters applied
  - safe export status
  - copyable safe export preview
  - no executable controls

## Behavior

Safe filters:

- `outcome`
- `queue_status`
- `ref_prefix` matching safe refs only
- ISO UTC `since`/`until`

Unsafe filter values are rejected without echoing the raw unsafe value.

Safe export includes only:

- request outcome
- handoff/authorization/relay execution/execution record refs
- safe slug/title
- queue/execution status
- dry/authorization/execution timestamps
- dry-review-before-write proof
- markdown/readback SHA-256
- readback verified
- payload byte count

Safe export does not include:

- markdown body
- write payload
- raw root path
- credential value
- replay controls
- automation authority
- VPS NAS authority

## Actual bounded write performed

A Mac-local bounded write was executed for this rung:

- built: true
- dry_reviewed: true
- executed: true
- written: true
- approval_required: false
- errors: none
- safe display path: `Hermes / filter-export-actual-20260521150700-6afe3001.md`
- payload bytes: 46
- readback verified: true
- readback SHA-256: `b6901012a944bf9235a3d13eea94cddc538d704c14089b604fd7d46ac53f2e80`

Refs:

- `handoff_filter_export_actual_20260521150700_6afe3001`
- `authz_filter_export_actual_20260521150700_6afe3001`
- `relay_exec_filter_export_actual_20260521150700_6afe3001`
- `exec_record_filter_export_actual_20260521150700_6afe3001`

Filtered local safe export then found count 1 for:

- outcome: `written`
- queue_status: `mac_relay_execution_succeeded`
- ref_prefix: `handoff_filter_export_actual`
- since: `2026-05-21T15:00:00Z`
- until: `2026-05-21T15:10:00Z`

## Verification

Local:

- `PYTHONPATH=. .venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `PYTHONPATH=. .venv/bin/python -m pytest -o addopts='' tests/hermes_cli/test_office_controlled_mutation_nas_keeper_request_ledger_filter_export.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_request_ledger_readback.py`
  - 6 passed
- `cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx`
  - 115 passed
- `cd web && npm run build`
  - passed; existing Vite large chunk warning only
- `git diff --check`
  - passed
- added-line leak sentinel scan
  - no hits

VPS:

- `/home/hermes/.hermes/ai-office-dashboard` reset to `9086b998`
- `/home/hermes/.hermes/hermes-agent` reset to `9086b998`
- `web_dist` rsync complete
- restarted dashboard only
- gateway remained active and was not restarted
- private `/office` content returned
- live filtered/export API returned status 200 with `safe_export_enabled=true`
- live DOM:
  - ledger panel present true
  - controls 0
  - safe export enabled true
  - repeat replay false
  - automation false
  - VPS NAS authority false
  - markdown body included false
  - raw leak sentinels none; `sk-` occurrence was inspected and confirmed as a false positive from `desk-rpg` attribute text
  - console JS errors 0

## Preserved boundaries

- No watcher/cron/daemon activation
- No dispatcher binding
- No authority-adapter binding
- No gateway restart
- No public exposure changes
- No VPS NAS mount/write/credential authority
- No prior successful write replay
- No raw root path / markdown body / write payload / credential value exposure

## Next recommended rung

`operator_request_ledger_export_selection_review`

- Add display-only selected export summary/readback using one safe export filter profile.
- Verify export item count/checksum set before any downstream use.
- Keep actual execution manual/one-shot.
- Keep watcher/cron/dispatcher/authority-adapter/VPS NAS authority off.

## Starter prompt for next session

Continue from `docs/ai-office/plans/2026-05-22-fresh-request-ledger-filter-export-handoff.md`. Start with live read-only recheck of local git, VPS worktrees/services, and `/office`. Then implement `operator_request_ledger_export_selection_review`: display-only selected export summary/readback using one safe export filter profile and checksum/item-count verification before any downstream use. Preserve all boundaries: no watcher/cron/dispatcher/authority-adapter binding, no gateway restart, no public exposure, no VPS NAS mount/write/credential authority, no replay of prior successful writes, and no raw path/body/payload/credential exposure.
