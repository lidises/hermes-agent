# AI Office fresh request ledger downstream-use enablement — 2026-05-22

## Scope

User approved continuing from the recommended `fresh_request_builder_downstream_use_enablement` rung with bounded writes and slightly stronger authority. This slice records a safe-ref downstream-use enablement/readiness proof after manual review, but still does not perform downstream consumption or activate automation.

## Code commit

- `112d9ecb feat(office): record downstream use enablement`
- Full SHA: `112d9ecbbfc8496cc2393219caa16ffc5c1d0251`

## Implemented

Backend:

- `hermes_cli/office_controlled_mutation.py`
  - `append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_record(...)`
  - `list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_records(...)`
  - record store: `fresh_request_builder_downstream_use_enablement_records.jsonl`
  - validates selected-export preflight + matching manual review record before accepting enablement record
  - stores only safe refs/checksums/count/summary/evidence refs

Protected API:

- `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-use-enablements?limit=20`
- `POST /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-use-enablements`

Web UI:

- `web/src/lib/api.ts`
  - `OfficeNasKeeperFreshRequestBuilderLedgerDownstreamUseEnablementReadbackResult`
  - `api.getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamUseEnablement()`
- `web/src/pages/OfficePage.tsx`
  - `NasKeeperFreshRequestBuilderLedgerDownstreamUseEnablementPanel`
  - display-only readback panel after manual review panel
  - DOM hook: `data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-enablement="true"`

Tests:

- `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_use_enablement.py`
- `web/src/pages/OfficePage.rpg.test.tsx`

## Actual write smokes

Local helper write:

- enablement ref: `enablement-20260522104632-112d9ecb`
- stored: true
- readback found: true
- downstream use enabled: false
- downstream consumption enabled: false
- enablement record SHA-256: `e623676ac7ab5b5ab6dbdbde4318b8620a219bdc30c493b89325eb46f1047af5`

VPS protected API write:

- enablement ref: `enablement-20260522015130-112d9ecb`
- stored: true
- errors: none
- readback found: true
- readback count: 1
- downstream use enabled: false
- downstream consumption enabled: false
- enablement record SHA-256: `969f021ede0a64d9edc82e8170c77070c087a81f03708d3abe057456e5ecbf00`

## Verification

Local:

- `PYTHONPATH=. .venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `PYTHONPATH=. .venv/bin/python -m pytest -o addopts='' tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_use_enablement.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_manual_review_record.py`
  - 6 passed
- `cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx`
  - 119 passed
- `cd web && npm run build`
  - passed
  - existing Vite large chunk warning only
- `git diff --check`
  - passed
- added-line leak sentinel
  - passed

VPS:

- `/home/hermes/.hermes/ai-office-dashboard`
  - HEAD `112d9ecb`
  - clean after reset
- `/home/hermes/.hermes/hermes-agent`
  - HEAD `112d9ecb`
  - clean after reset
- `web_dist` rsynced from Mac local build
- dashboard restarted
- gateway remained active and was not restarted
- note: initial dashboard restart failed because rsynced `web_dist` was root-owned; fixed by `chown -R hermes:hermes` on both dashboard/hermes-agent `hermes_cli/web_dist`, then restart succeeded

Live `/office` smoke:

- `http://100.122.57.85:8765/office?enablement-postsmoke=112d9ecb`
- private `/office` returned content (`office_bytes 648`)
- DOM after Office tab load:
  - panel present: true
  - recorded: true
  - manual review verified: true
  - downstream use enabled: false
  - downstream consumption enabled: false
  - downstream consumed: false
  - automation enabled: false
  - VPS NAS authority: false
  - markdown body included: false
  - controls: 0
  - raw leak: false

## Boundaries preserved

- No downstream consumption.
- No watcher/cron/daemon activation.
- No dispatcher binding.
- No authority-adapter binding.
- No gateway restart.
- No public exposure change.
- No VPS NAS mount/write/credential authority.
- No markdown body/write payload/raw root path/credential value exposure.

## Recommended next rung

`fresh_request_builder_downstream_consumption_preflight`

Goal:

- Display-only/readiness-gated consumption preflight that recognizes the enablement record.
- Prove selected export + manual review + enablement record chain before any actual downstream consumption.

Keep off:

- actual downstream consumption
- watcher/cron/dispatcher/authority-adapter
- VPS NAS authority
- raw body/payload/path/credential exposure

## Starter prompt

Continue AI Office controlled-mutation work from `docs/ai-office/plans/2026-05-22-fresh-request-ledger-downstream-use-enablement-handoff.md`. Start from NEXT/STATUS and live read-only recheck. Recommended rung is `fresh_request_builder_downstream_consumption_preflight`: add a display-only/readiness-gated preflight that recognizes the downstream-use enablement record, but still does not consume downstream data or activate watcher/cron/dispatcher/authority-adapter/VPS NAS authority. Use TDD, run focused Python/web tests, build, diff/leak checks, commit/push, VPS sync/restart dashboard only, live API/DOM smoke, then update NEXT/STATUS/handoff docs.
