# AI Office fresh one-shot operator write — 2026-05-21

## Scope

User approved continuing from the recommended rung and explicitly approved a slightly stronger bounded write authority. This slice implemented and deployed a fresh-ref one-shot operator wrapper, then performed an actual Mac-local bounded write with fresh refs.

## Code commits

- `c0144357 feat(office): enforce fresh one-shot relay writes`
- `c9076db6 fix(office): report fresh write payload bytes`

Docs commit follows this handoff.

## Implemented

Backend:

- Added `execute_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_write(...)`.
- Added protected route:
  - `POST /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-one-shot-operator-write`
- Wrapper path:
  - validates payload fields;
  - checks existing queue records for reused `handoff_ref`, `authorization_ref`, `relay_execution_ref`, and `execution_record_ref`;
  - fails closed before write on ref reuse;
  - enqueues the handoff;
  - authorizes the handoff;
  - executes through the Mac-local relay preview executor;
  - records terminal execution state;
  - returns only safe refs/checksum/readback metadata.

Frontend:

- Added API client method:
  - `executeOfficeControlledMutationNasKeeperFreshOneShotOperatorWrite(...)`
- Added display-only panel:
  - `NasKeeperFreshOneShotOperatorFlowPanel`
  - DOM hook: `data-office-nas-keeper-fresh-one-shot-operator-flow="true"`
- Panel has no form/input/button controls and marks:
  - fresh handoff required;
  - fresh authorization required;
  - fresh execution ref required;
  - repeat replay disabled;
  - watcher/cron/dispatch/authority-adapter automation disabled;
  - VPS NAS authority disabled.

Tests:

- Added `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_write.py`.
- Extended Office RPG tests for wrapper panel placement and no-control display contract.

## Verification

Local focused verification passed:

- `py_compile` for touched Python modules.
- Backend focused tests:
  - `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_write.py`
  - `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_last_successful_write.py`
  - 6 passed.
- Web focused tests:
  - `src/lib/api.test.ts`
  - `src/pages/OfficePage.rpg.test.tsx`
  - 161 passed.
- `npm run build` passed with only existing large chunk warning.
- `git diff --check` passed.
- added-line leak sentinel scan passed.

## Actual write performed

Mac-local bounded write completed with fresh refs:

- safe display path:
  - `Hermes / fresh-one-shot-operator-write-20260521112456.md`
- payload_bytes:
  - 223
- readback_verified:
  - true
- readback_sha256:
  - `22f4c409bf93162bec31173c0cda54356258ee69dcd68c8dbccd753848097989`
- handoff_ref:
  - `handoff_fresh_one_shot_operator_20260521112456`
- authorization_ref:
  - `authz_fresh_one_shot_operator_20260521112456`
- relay_execution_ref:
  - `relay_exec_fresh_one_shot_operator_20260521112456`
- execution_record_ref:
  - `exec_record_fresh_one_shot_operator_20260521112456`

An earlier local attempt without an explicit Mac relay root failed safely with `mac_relay_root_not_configured`; no write occurred in that attempt.

## VPS deployment

Synced and restarted dashboard only:

- `/home/hermes/.hermes/ai-office-dashboard` HEAD `c9076db6`
- `/home/hermes/.hermes/hermes-agent` HEAD `c9076db69`
- `web_dist` rsync complete.
- Restarted user service:
  - `hermes-agent-dashboard.service`
- Did not restart gateway:
  - `hermes-gateway.service` remained active.
- Private `/office` GET returned content.

Live smoke:

- `/office?fresh-wrapper=c9076db6` loaded.
- Fresh wrapper route on VPS returned safe fail-closed result because Mac relay root is not configured on VPS:
  - status 200
  - `executed=false`
  - `written=false`
  - `fresh_refs_verified=true`
  - error: `mac_relay_root_not_configured`
- DOM panel present:
  - panel present true
  - controls 0
  - repeat replay false
  - automation false
  - VPS NAS authority false
  - raw leak sentinels none
- Browser console JS errors: 0

## Boundaries preserved

- No watcher/cron/daemon activation.
- No dispatcher binding.
- No authority-adapter binding.
- No target mutation outside the bounded Mac-local write.
- No public exposure change.
- No gateway restart.
- No VPS NAS mount/write/credential authority.
- No replay of prior successful writes.
- No raw root path or credential value returned in API/DOM/docs.

## Suggested next rung

Add a reusable operator-side request builder for fresh one-shot writes:

- generate safe unique refs from a single operator intent;
- dry-review payload first;
- require explicit operator approval for actual write;
- execute exactly once;
- immediately verify readback + terminal state;
- keep watcher/cron/dispatcher/authority-adapter binding disabled.
