# AI Office fresh one-shot request builder — 2026-05-21

## Scope

User approved continuing from the recommended rung and explicitly approved bounded write authority. This slice implemented the operator-side fresh one-shot write request builder: safe intent in, unique refs generated, dry-review first, explicit approval gate for actual write, one-shot execution through the existing fresh wrapper, readback and terminal state recorded.

## Code

Code commit:

- `aaa18a04 feat(office): build fresh one-shot write requests`

Main files:

- `hermes_cli/office_controlled_mutation.py`
- `hermes_cli/web_server.py`
- `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_fresh_request_builder.py`
- `web/src/lib/api.ts`
- `web/src/pages/OfficePage.tsx`
- `web/src/pages/OfficePage.rpg.test.tsx`

## Backend/API

New helper:

- `build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request(...)`

New protected API:

- `POST /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-one-shot-request-builder`

Flow:

1. Accept safe operator intent fields only.
2. Generate unique refs from timestamp + nonce:
   - `handoff_ref`
   - `authorization_ref`
   - `relay_execution_ref`
   - `execution_record_ref`
3. Build markdown payload and hash it.
4. Return dry-review DTO without markdown body or write payload.
5. If `approve_actual_write` is false, stop with `approval_required=true`.
6. If `approve_actual_write` is true, call the fresh one-shot operator wrapper.
7. Return safe write result metadata only.

Fail-closed behavior:

- Invalid intent fields fail with structured errors.
- Approval is required before write.
- VPS/live endpoint remains safe when Mac relay root is not configured: dry review succeeds, actual write fails closed with `mac_relay_root_not_configured`.
- Ref reuse remains blocked by the underlying fresh one-shot wrapper.

## UI

New display-only panel:

- `NasKeeperFreshOneShotRequestBuilderPanel`
- DOM hook: `data-office-nas-keeper-fresh-one-shot-request-builder="true"`

Live-visible invariants:

- dry-review required: true
- explicit approval required: true until approved
- controls: 0
- repeat replay enabled: false
- automation enabled: false
- VPS NAS authority: false
- markdown body included: false
- raw root path included: false
- credential value included: false

## Actual bounded Mac-local write

Performed from Mac-local runtime with bounded root authority, not from VPS.

Result:

- built: true
- dry_reviewed: true
- executed: true
- written: true
- approval_required: false
- errors: none
- safe display path: `Hermes / fresh-builder-actual-20260521141510-48be1301.md`
- safe_slug: `fresh-builder-actual-20260521141510-48be1301`
- payload_bytes: 47
- readback_verified: true
- readback_sha256: `610a233065a312e9e55c7f25487e72daa74dfe116b90470099f42677786c3527`
- handoff_ref: `handoff_fresh_builder_actual_20260521141510_48be1301`
- authorization_ref: `authz_fresh_builder_actual_20260521141510_48be1301`
- relay_execution_ref: `relay_exec_fresh_builder_actual_20260521141510_48be1301`
- execution_record_ref: `exec_record_fresh_builder_actual_20260521141510_48be1301`

## Verification

Local:

- `PYTHONPATH=. .venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `PYTHONPATH=. .venv/bin/python -m pytest -o addopts='' tests/hermes_cli/test_office_controlled_mutation_nas_keeper_fresh_request_builder.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_write.py`
  - 6 passed
- `cd web && npm test -- --run src/lib/api.test.ts src/pages/OfficePage.rpg.test.tsx`
  - 162 passed
- `cd web && npm run build`
  - passed, existing Vite large chunk warning only
- `git diff --check`
  - passed
- added-line leak sentinel scan
  - passed

VPS deploy:

- `/home/hermes/.hermes/ai-office-dashboard` reset to `aaa18a04`
- `/home/hermes/.hermes/hermes-agent` reset to `aaa18a04c`
- `web_dist` rsynced
- restarted: `hermes-agent-dashboard.service` only
- not restarted: `hermes-gateway.service`
- final services:
  - dashboard active
  - gateway active
- private `/office` returned content

Live smoke:

- URL: `http://100.122.57.85:8765/office?builder=aaa18a04`
- Builder API status: 200
- Expected VPS-safe result:
  - `built=true`
  - `dry_reviewed=true`
  - `executed=false`
  - `written=false`
  - `approval_required=true`
  - error: `mac_relay_root_not_configured`
- DOM:
  - panel present true
  - controls 0
  - dry-review required true
  - explicit approval required true
  - repeat replay false
  - automation false
  - VPS NAS authority false
  - raw leak sentinels none
- browser console JS errors: 0

## Boundaries preserved

- No watcher/cron/daemon activation.
- No dispatcher binding.
- No authority-adapter binding.
- No gateway restart.
- No public exposure change.
- No VPS NAS mount/write/credential authority.
- No replay of prior successful writes.
- No raw root path, markdown body, write payload, or credential value returned in API/DOM/docs.

## Next starter prompt

Continue AI Office controlled-mutation/NAS rung after `aaa18a04` and docs handoff `2026-05-21-fresh-one-shot-request-builder-handoff.md`. First recheck local/VPS git state, dashboard/gateway services, and live `/office`. Then implement the next bounded rung: operator request ledger/readback. Requirements: sanitized safe refs/checksums/status only; prove dry-review-before-write ordering; no markdown body/write payload/raw root/credential values; no watcher/cron/daemon; no dispatcher/authority-adapter binding; no VPS NAS authority; no gateway restart unless explicitly needed. Use TDD, verify with focused backend/frontend tests, build, diff/leak checks, live API/DOM smoke, then update NEXT/STATUS/handoff docs.
