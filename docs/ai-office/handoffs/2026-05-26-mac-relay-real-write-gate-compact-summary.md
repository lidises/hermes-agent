# AI Office handoff — Mac relay real-write gate compact summary (2026-05-26T02:06Z)

## Scope

Completed the metadata-only Mac relay real-write gate rung and promoted it into the compact `/office` summary.

Code commit deployed before this docs handoff:
`89255c392 feat(office): surface Mac relay real-write gate summary`

Rung:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_real_write_gate_after_final_preflight`

## What changed

- Backend/API real-write gate route was already present and verified as protected metadata-only storage/readback.
- Frontend compact summary now prefers the live real-write gate record over final preflight and earlier write-readiness rungs.
- Added compact real-write gate DOM attrs:
  - ready
  - source verified
  - replay-store-write closed
  - real-write closed
  - VPS-authority closed
  - runtime-open closed
  - payload-echo closed
- Historical controlled-mutation details remain out of default DOM behind summary-only collapsed posture.

## Verification

Local:
- Backend focused pytest for real-write gate: `3 passed, 90 deselected`.
- Frontend focused real-write gate tests: `3 passed, 177 skipped`.
- `py_compile`: passed.
- `git diff --check`: passed.
- Source leak scan for raw path/secret/body sentinels: passed.
- Frontend lint: exit 0, existing warnings only.
- Frontend build: passed, existing Vite chunk-size warning only.

Deploy:
- Pushed code commit to `origin/main`.
- Reset both VPS worktrees to the code commit.
- Rsynced rebuilt `web_dist` to both VPS worktrees.
- Verified local/core/dashboard asset hashes matched.
- Restarted only dashboard/core dashboard services.
- Gateway service remained active but was not restarted.

Protected API smoke:
- Unauthenticated real-write gate GET returned `401`.
- Authenticated real-write gate GET returned found=true, ready=true, write_readiness_percent=99, SHA-256 length=64.
- Duplicate protected POST against the existing source replayed idempotently and skipped an additional write.
- Forbidden capability flags remained false.
- Raw leak probe remained false.

Hydrated DOM smoke:
- Compact dashboard hook found=true.
- Real-write gate ready=true.
- Source verified=true.
- Replay-store write=false.
- Real-write=false.
- VPS-authority=false.
- Runtime-open=false.
- Payload-echo=false.
- Latest boundary label: Mac relay real-write gate.
- Write-readiness displayed as 99%.
- Scoped controls/forms/inputs=0.
- Browser console JS errors=0.
- Raw leak probe=false.

## Boundaries still closed

- No real NAS production write.
- No VPS direct NAS authority or VPS NAS mount credentials.
- No watcher, cron, dispatcher, or authority-adapter activation.
- No public exposure.
- No gateway restart.
- No raw markdown, raw path, write_payload body, or secret echo.
- No real replay-store execution write.

## Next recommended rung

`fresh_request_builder_downstream_consumption_one_shot_mac_relay_approval_token_after_real_write_gate`

Proceed TDD-first with a metadata-only approval-token record sourced from the live real-write gate. Keep production NAS write and all stronger authority boundaries closed until exact later approval.
