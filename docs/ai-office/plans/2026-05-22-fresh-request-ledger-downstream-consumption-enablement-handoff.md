# AI Office fresh request ledger downstream consumption enablement — 2026-05-22

## Scope

Continued from `fresh_request_builder_downstream_consumption_preflight`. This slice records a bounded safe-ref downstream consumption enablement after the preflight chain is proven. It is an enablement/readiness record only; actual downstream consumption remains disabled and no automation/dispatcher/authority-adapter/VPS NAS authority was added.

## Code commit

- `34ab1b1b feat(office): record downstream consumption enablement`

## Implemented

Backend:

- `hermes_cli/office_controlled_mutation.py`
  - `append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_record(...)`
  - `list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_records(...)`
  - store path under Hermes home controlled-mutation JSONL ledger
  - validation ties the record to consumption preflight, selected export, manual review, downstream-use enablement, and checksum safe refs

Protected API:

- `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablements?limit=20`
- `POST /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablements`

Web UI:

- `web/src/lib/api.ts`
  - `OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablementReadbackResult`
  - `api.getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablement()`
- `web/src/pages/OfficePage.tsx`
  - `NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablementPanel`
  - display-only panel after downstream consumption preflight panel
  - DOM hook: `data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablement="true"`

Tests:

- `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_consumption_enablement.py`
- `web/src/pages/OfficePage.rpg.test.tsx`

## Actual VPS safe-ref write

- `consumption_enablement_ref=consumptionenable-20260522113200-34ab1b1b`
- `record_sha256=ecd9c9ad32abfde84dec38767f65c3542f6aa1872414b1c59c4db8efa0faea98`
- `stored=true`
- readback found true, record count 1
- downstream use enabled true
- downstream consumption enabled false
- downstream consumed false
- automation enabled false
- VPS NAS mount false

## Verification

Local:

- RED first:
  - Python tests failed on missing helper/API route.
  - Web tests failed on missing panel.
- `PYTHONPATH=. .venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `PYTHONPATH=. .venv/bin/python -m pytest -o addopts='' tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_consumption_enablement.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_consumption_preflight.py -q`
  - 6 passed
- `cd web && npm test -- --run src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx`
  - 278 passed
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
  - HEAD `34ab1b1b`
- `/home/hermes/.hermes/hermes-agent`
  - HEAD `34ab1b1b`
- `web_dist` rsynced from Mac local build
- relative content hash on local + both VPS worktrees:
  - `bddc464d6603f62aaa6f1b106b73b9ab387643ade66ebc896452a37091d8e3f6`
- restarted `hermes-agent-dashboard.service` only
- `hermes-gateway.service` remained active and was not restarted

Live `/office` smoke:

- `http://100.122.57.85:8765/office?dom-consumption-enable=34ab1b1b`
- protected API actual POST/readback:
  - preflight found true
  - preflight passed true
  - posted stored true
  - post errors []
  - readback found true
  - record count 1
  - downstream use enabled true
  - downstream consumption enabled false
  - downstream consumed false
  - automation enabled false
  - VPS NAS mount false
  - raw leak false
- DOM smoke:
  - panel present true
  - recorded true
  - preflight verified true
  - downstream use enabled true
  - downstream consumption enabled false
  - downstream consumed false
  - automation enabled false
  - VPS NAS authority false
  - markdown body included false
  - controls 0
  - secret leak false
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

`fresh_request_builder_downstream_consumption_one_shot_boundary_design`

Goal:

- Define the exact later one-shot consumption boundary contract/readiness display.
- Include safe refs, idempotency/replay guard design, rollback/disable posture, target allowlist shape, and explicit human approval boundary.

Keep off:

- actual downstream consumption
- watcher/cron/dispatcher/authority-adapter
- VPS NAS authority
- raw body/payload/path/credential exposure

## Starter prompt

Continue AI Office controlled-mutation work from `docs/ai-office/plans/2026-05-22-fresh-request-ledger-downstream-consumption-enablement-handoff.md`. Start from NEXT/STATUS and live read-only recheck. Recommended rung is `fresh_request_builder_downstream_consumption_one_shot_boundary_design`: define/display the exact later one-shot downstream consumption boundary contract using safe refs only. Do not execute actual consumption or activate watcher/cron/dispatcher/authority-adapter/VPS NAS authority. Use TDD, run focused Python/web tests, build, diff/leak checks, commit/push, VPS sync/restart dashboard only if needed, live API/DOM smoke, then update NEXT/STATUS/handoff docs.
