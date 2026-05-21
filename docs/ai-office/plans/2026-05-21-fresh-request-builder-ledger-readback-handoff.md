# AI Office fresh request-builder ledger/readback — 2026-05-21

## Scope

User approved continuing from the recommended `operator_request_ledger_readback` rung and explicitly allowed bounded writes. This slice adds a sanitized ledger/readback layer for fresh request-builder outcomes.

## Code result

Commit:

- `52042ee7 feat(office): read back fresh request ledger`

Implemented:

- Backend helper:
  - `get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_readback(...)`
- Internal sanitizer:
  - `_safe_request_builder_ledger_item(...)`
- Protected API:
  - `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger`
- Frontend API type/call:
  - `OfficeNasKeeperFreshRequestBuilderLedgerReadbackResult`
  - `api.getOfficeControlledMutationNasKeeperFreshRequestBuilderLedger()`
- Office display-only UI panel:
  - `NasKeeperFreshRequestBuilderLedgerPanel`
  - DOM hook: `data-office-nas-keeper-fresh-request-builder-ledger="true"`

## Behavior

The ledger/readback returns recent fresh request-builder outcomes as safe display data only:

- handoff/authorization/relay execution/execution record refs
- queue/execution statuses
- safe title / safe display path
- markdown/readback SHA-256 values
- payload byte count
- dry-review-before-write ordering proof

It does not return:

- markdown body
- write payload
- raw root path
- credential value
- replay controls
- watcher/cron/dispatcher activation
- authority-adapter binding
- VPS NAS mount/write authority

## Actual bounded write performed

A Mac-local bounded write was executed for this rung:

- built: true
- dry_reviewed: true
- executed: true
- written: true
- approval_required: false
- errors: none
- safe display path: `Hermes / ledger-actual-readback-20260521144700-5afe2043.md`
- payload bytes: 48
- readback verified: true
- readback SHA-256: `2f682c885385acfeacbb9e171013038dbf9f3bf26f6f56561d90b9eee951e6d8`

Refs:

- `handoff_ledger_actual_readback_20260521144700_5afe2043`
- `authz_ledger_actual_readback_20260521144700_5afe2043`
- `relay_exec_ledger_actual_readback_20260521144700_5afe2043`
- `exec_record_ledger_actual_readback_20260521144700_5afe2043`

Local ledger readback then confirmed latest outcome `written`, `dry_review_before_write_verified=true`, and `readback_verified=true`.

## Verification

Local:

- `PYTHONPATH=. .venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `PYTHONPATH=. .venv/bin/python -m pytest -o addopts='' tests/hermes_cli/test_office_controlled_mutation_nas_keeper_request_ledger_readback.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_fresh_request_builder.py`
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

- `/home/hermes/.hermes/ai-office-dashboard` reset to `52042ee7`
- `/home/hermes/.hermes/hermes-agent` reset to `52042ee7`
- `web_dist` rsync complete
- restarted dashboard only
- gateway remained active and was not restarted
- private `/office` content returned
- live ledger API returned status 200
- live DOM:
  - ledger panel present true
  - controls 0
  - dry-before-write true
  - repeat replay false
  - automation false
  - VPS NAS authority false
  - markdown body included false
  - raw path leak sentinels none; `sk-` occurrence was inspected and confirmed as a false positive from `desk-rpg` attribute text
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

`operator_request_ledger_filtering_and_export`

- Add safe filters for outcome/status/ref prefix/time window.
- Add copyable safe ledger export containing only refs/checksums/statuses.
- Keep actual execution manual/one-shot.
- Keep watcher/cron/dispatcher/authority-adapter/VPS NAS authority off.

## Starter prompt for next session

Continue from `/Users/lidises/dev/hermes-agent/docs/ai-office/plans/2026-05-21-fresh-request-builder-ledger-readback-handoff.md`. Start with live read-only recheck of local git, VPS worktrees/services, and `/office`. Then implement `operator_request_ledger_filtering_and_export`: safe filters for ledger outcome/status/ref prefix/time window plus copyable safe export with refs/checksums/statuses only. Preserve all boundaries: no watcher/cron/dispatcher/authority-adapter binding, no gateway restart, no public exposure, no VPS NAS mount/write/credential authority, no replay of prior successful writes, and no raw path/body/payload/credential exposure.
