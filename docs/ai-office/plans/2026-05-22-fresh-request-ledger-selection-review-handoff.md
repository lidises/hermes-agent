# AI Office fresh request ledger selected export review — 2026-05-22

## Scope

User approved continuing from the recommended `operator_request_ledger_export_selection_review` rung with bounded write authority. This slice adds a display-only selected export review/readback for one safe export profile and verifies export item count plus checksum-set integrity before any downstream use.

## Code result

Commit:

- `07bbf95b feat(office): review selected ledger export`

Implemented:

- Helper:
  - `get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_export_selection_review(...)`
- Protected API:
  - `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-export-selection-review?profile=latest_written&limit=20`
- Supported profile:
  - `latest_written`
- Office UI:
  - `NasKeeperFreshRequestBuilderLedgerExportSelectionReviewPanel`
  - stable hook `data-office-nas-keeper-fresh-request-builder-ledger-export-selection-review="true"`

## Behavior

The selected export review:

- reads the safe ledger export for `outcome=written` and `queue_status=mac_relay_execution_succeeded`
- verifies selected export item count
- builds a checksum set from safe handoff refs + markdown/readback SHA-256 values
- computes `checksum_set_sha256`
- verifies every selected item has valid checksum shape and `readback_verified=true`
- reports `downstream_use_ready=true` only when item-count and checksum-set verification pass
- keeps `downstream_use_enabled=false`

The review does not include:

- markdown body
- write payload
- raw root path
- credential value
- replay controls
- automation authority
- VPS NAS authority

Unsupported/unsafe profile names are rejected without echoing raw values.

## Actual bounded write performed

A Mac-local bounded write was executed for this rung:

- built: true
- dry_reviewed: true
- executed: true
- written: true
- approval_required: false
- errors: none
- safe display path: `Hermes / selection-review-actual-20260521154000-7afe4101.md`
- payload bytes: 55
- readback verified: true
- readback SHA-256: `6e5d95055e6acb2dd44964b364a41a926152d903dc63502056dffd2c6ab9ff8e`

Refs:

- `handoff_selection_review_actual_20260521154000_7afe4101`
- `authz_selection_review_actual_20260521154000_7afe4101`
- `relay_exec_selection_review_actual_20260521154000_7afe4101`
- `exec_record_selection_review_actual_20260521154000_7afe4101`

Local selected export review afterwards:

- found: true
- selected item count: 5
- export item count verified: true
- checksum set verified: true
- checksum set SHA-256: `50d478bbaf5bc443c8a020fe445faea99d0c6a9f946fd289617ccda55bbb60b7`
- downstream use ready: true
- downstream use enabled: false

## Verification

Local:

- `PYTHONPATH=. .venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `PYTHONPATH=. .venv/bin/python -m pytest -o addopts='' tests/hermes_cli/test_office_controlled_mutation_nas_keeper_request_ledger_selection_review.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_request_ledger_filter_export.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_request_ledger_readback.py`
  - 9 passed
- `cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx`
  - 116 passed
- `cd web && npm run build`
  - passed; existing Vite large chunk warning only
- `git diff --check`
  - passed
- added-line leak sentinel scan
  - no hits

VPS:

- `/home/hermes/.hermes/ai-office-dashboard` reset to `07bbf95b`
- `/home/hermes/.hermes/hermes-agent` reset to `07bbf95b`
- `web_dist` rsync complete
- restarted dashboard only
- gateway remained active and was not restarted
- private `/office` content returned from local curl
- live selected export review API returned status 200 with:
  - found true
  - selected item count 1 on VPS queue state
  - export item count verified true
  - checksum set verified true
  - downstream use enabled false
- live DOM:
  - selected export review panel present true
  - controls 0
  - item-count verified true
  - checksum-set verified true
  - downstream use enabled false
  - repeat replay false
  - automation false
  - VPS NAS authority false
  - markdown body included false
  - raw leak sentinels none; `sk-` occurrence inspected and confirmed as a false positive from `desk-rpg` attribute text
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

`operator_request_ledger_downstream_use_preflight`

- Add display-only preflight proving the selected export review can be consumed only after manual operator review.
- Keep downstream use disabled by default.
- Keep actual execution manual/one-shot.
- Keep watcher/cron/dispatcher/authority-adapter/VPS NAS authority off.

## Starter prompt for next session

Continue from `docs/ai-office/plans/2026-05-22-fresh-request-ledger-selection-review-handoff.md`. Start with live read-only recheck of local git, VPS worktrees/services, and `/office`. Then implement `operator_request_ledger_downstream_use_preflight`: display-only preflight proving selected export review requires manual operator review before any downstream use. Preserve all boundaries: no watcher/cron/dispatcher/authority-adapter binding, no gateway restart, no public exposure, no VPS NAS mount/write/credential authority, no replay of prior successful writes, and no raw path/body/payload/credential exposure.
