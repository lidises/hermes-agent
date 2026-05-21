# AI Office fresh request ledger downstream-use preflight — 2026-05-22

## Scope

User approved continuing from the recommended `operator_request_ledger_downstream_use_preflight` rung with bounded write authority. This slice adds a display-only preflight proving the selected safe export can only be consumed after a manual operator review record exists. It keeps downstream use disabled.

## Code result

Commit:

- `75478b3d feat(office): preflight ledger downstream use`

Implemented:

- Helper:
  - `get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight(...)`
- Protected API:
  - `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-use-preflight?profile=latest_written&limit=20`
- Supported profile:
  - `latest_written`
- Office UI:
  - `NasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightPanel`
  - stable hook `data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-preflight="true"`

## Behavior

The downstream-use preflight:

- consumes the selected export review for `latest_written`
- verifies selected export review passed
- carries item-count/checksum-set proof forward by safe checksums only
- computes `preflight_decision_sha256`
- reports manual operator review requirement
- reports `manual_operator_review_record_present=false`
- reports `downstream_use_allowed_after_manual_review=true` when selection review passed
- keeps `downstream_use_enabled=false`
- blocks with `manual_operator_review_not_recorded`

It does not include:

- markdown body
- write payload
- raw root path
- credential value
- replay controls
- automation authority
- VPS NAS authority
- downstream-use enablement
- manual review record write

Unsupported/unsafe profile names are rejected without echoing raw values.

## Actual bounded write performed

A Mac-local bounded write was executed for this rung:

- built: true
- dry_reviewed: true
- executed: true
- written: true
- approval_required: false
- errors: none
- safe display path: `Hermes / downstream-preflight-actual-20260521155500-8afe5201.md`
- payload bytes: 53
- readback verified: true
- readback SHA-256: `8df38b0777b55d987ba3574a0b928490e3ddacbecb6f5d1aedd81c2d43f229a8`

Refs:

- `handoff_downstream_preflight_actual_20260521155500_8afe5201`
- `authz_downstream_preflight_actual_20260521155500_8afe5201`
- `relay_exec_downstream_preflight_actual_20260521155500_8afe5201`
- `exec_record_downstream_preflight_actual_20260521155500_8afe5201`

Local downstream preflight afterwards:

- found: true
- selected item count: 5
- selected export review passed: true
- manual operator review required: true
- manual operator review record present: false
- downstream use allowed after manual review: true
- downstream use enabled: false
- blocked reason: `manual_operator_review_not_recorded`
- checksum set SHA-256: `4e0a5fb92cb71538e661c4e2ffe05f2acc038c7b3321afd75d4e28c0629594b9`
- preflight decision SHA-256: `2ddf09a4a34c90cf5a8c7f6a0d5d07c816c7f2315f20398c6159da79f5148ed5`

## Verification

Local:

- `PYTHONPATH=. .venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `PYTHONPATH=. .venv/bin/python -m pytest -o addopts='' tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_use_preflight.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_request_ledger_selection_review.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_request_ledger_filter_export.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_request_ledger_readback.py`
  - 12 passed
- `cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx`
  - 117 passed
- `cd web && npm run build`
  - passed; existing Vite large chunk warning only
- `git diff --check`
  - passed
- added-line leak sentinel scan
  - no hits

VPS:

- `/home/hermes/.hermes/ai-office-dashboard` reset to `75478b3d`
- `/home/hermes/.hermes/hermes-agent` reset to `75478b3d`
- `web_dist` rsync complete
- restarted dashboard only
- gateway remained active and was not restarted
- private `/office` content returned after bounded readiness retry
- live downstream-use preflight API returned status 200 with:
  - found true
  - selected item count 1 on VPS queue state
  - selected export review passed true
  - manual operator review required true
  - manual operator review record present false
  - downstream use enabled false
- live DOM:
  - downstream-use preflight panel present true
  - controls 0
  - review passed true
  - manual review required true
  - manual review record present false
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
- No downstream-use enablement
- No manual operator review record write yet

## Next recommended rung

`operator_request_ledger_manual_review_record`

- Add bounded safe-ref manual operator review record write/readback for one selected export preflight.
- Do not consume downstream yet.
- Keep downstream use disabled until a later separate downstream-use enablement boundary.
- Keep actual execution manual/one-shot.
- Keep watcher/cron/dispatcher/authority-adapter/VPS NAS authority off.

## Starter prompt for next session

Continue from `docs/ai-office/plans/2026-05-22-fresh-request-ledger-downstream-use-preflight-handoff.md`. Start with live read-only recheck of local git, VPS worktrees/services, and `/office`. Then implement `operator_request_ledger_manual_review_record`: bounded safe-ref manual operator review record write/readback for one selected export preflight. Preserve all boundaries: no downstream consumption/enablement yet, no watcher/cron/dispatcher/authority-adapter binding, no gateway restart, no public exposure, no VPS NAS mount/write/credential authority, no replay of prior successful writes, and no raw path/body/payload/credential exposure.
