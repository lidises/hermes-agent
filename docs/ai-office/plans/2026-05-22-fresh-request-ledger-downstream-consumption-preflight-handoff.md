# AI Office fresh request ledger downstream consumption preflight — 2026-05-22

## Scope

User approved continuing from the recommended `fresh_request_builder_downstream_consumption_preflight` rung with bounded writes/stronger authority, interpreted narrowly. This slice adds a display-only/readiness-gated consumption preflight that recognizes the existing downstream-use enablement record, but still does not perform actual downstream consumption or activate automation.

## Code commit

- `3cbaee4d feat(office): preflight downstream consumption readiness`

## Implemented

Backend:

- `hermes_cli/office_controlled_mutation.py`
  - `get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_preflight(...)`
  - consumes selected-export downstream-use preflight + safe downstream-use enablement readback
  - emits only safe refs/checksums/counts/readiness booleans

Protected API:

- `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight?profile=latest_written&limit=20`

Web UI:

- `web/src/lib/api.ts`
  - `OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflightResult`
  - `api.getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflight()`
- `web/src/pages/OfficePage.tsx`
  - `NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflightPanel`
  - display-only panel after downstream-use enablement panel
  - DOM hook: `data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight="true"`

Tests:

- `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_consumption_preflight.py`
- `web/src/pages/OfficePage.rpg.test.tsx`

## Verification

Local:

- RED first:
  - Python tests failed on missing helper/route.
  - Web tests failed on missing panel.
- `PYTHONPATH=. .venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `PYTHONPATH=. .venv/bin/python -m pytest -o addopts='' tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_consumption_preflight.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_use_enablement.py -q`
  - 6 passed
- `cd web && npm test -- --run src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx`
  - 277 passed
- `cd web && npx eslint src/pages/OfficePage.tsx src/pages/OfficePage.rpg.test.tsx src/lib/api.ts`
  - errors 0; existing Fast Refresh / set-state-in-effect warnings only
- `cd web && npm run build`
  - passed; existing Vite large chunk warning only
- `git diff --check`
  - passed
- added-line leak sentinel
  - passed

VPS:

- `/home/hermes/.hermes/ai-office-dashboard`
  - HEAD `3cbaee4d`
  - clean after reset
- `/home/hermes/.hermes/hermes-agent`
  - HEAD `3cbaee4d`
  - clean after reset
- `web_dist` rsynced from Mac local build
- relative content hash on local + both VPS worktrees:
  - `0e40f27a5b0898407ae227fcc9b382536522d20c6e6cbeb0bf8d86728a569671`
- restarted `hermes-agent-dashboard.service` only
- `hermes-gateway.service` remained active and was not restarted

Live `/office` smoke:

- `http://100.122.57.85:8765/office?dom-smoke=3cbaee4d`
- private `/office` returned 200 content and raw leak false
- protected API projected:
  - `found=true`
  - `selected_export_review_passed=true`
  - `manual_operator_review_record_present=true`
  - `downstream_use_enablement_record_present=true`
  - `consumption_preflight_passed=true`
  - `enablement_ref=enablement-20260522015130-112d9ecb`
  - `downstream_use_enabled=true`
  - `downstream_consumption_enabled=false`
  - `downstream_consumed=false`
  - `blocked_reason=actual_downstream_consumption_boundary_not_approved`
  - decision SHA length 64
  - raw leak false
- DOM smoke:
  - panel present true
  - preflight passed true
  - enablement record present true
  - downstream use enabled true
  - downstream consumption enabled false
  - downstream consumed false
  - automation enabled false
  - VPS NAS authority false
  - markdown body included false
  - controls 0
  - raw leak false
  - console JS errors 0

## Boundaries preserved

- No actual downstream consumption.
- No watcher/cron/daemon activation.
- No dispatcher binding.
- No authority-adapter binding.
- No gateway restart.
- No public exposure change.
- No VPS NAS mount/write/credential authority.
- No markdown body/write payload/raw root path/credential value exposure.

## Recommended next rung

`fresh_request_builder_downstream_consumption_enablement`

Goal:

- Add a bounded safe-ref consumption enablement record after consumption preflight.
- Record operator approval/readiness to allow a later one-shot downstream consumption boundary.

Keep off:

- actual downstream consumption
- watcher/cron/dispatcher/authority-adapter
- VPS NAS authority
- raw body/payload/path/credential exposure

## Starter prompt

Continue AI Office controlled-mutation work from `docs/ai-office/plans/2026-05-22-fresh-request-ledger-downstream-consumption-preflight-handoff.md`. Start from NEXT/STATUS and live read-only recheck. Recommended rung is `fresh_request_builder_downstream_consumption_enablement`: add a bounded safe-ref consumption enablement record that recognizes the consumption preflight, but still does not perform actual downstream consumption or activate watcher/cron/dispatcher/authority-adapter/VPS NAS authority. Use TDD, run focused Python/web tests, build, diff/leak checks, commit/push, VPS sync/restart dashboard only, live API/DOM smoke, then update NEXT/STATUS/handoff docs.
