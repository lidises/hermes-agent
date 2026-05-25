## NEXT — Mac relay tmp-root write smoke after manual receipt deployed (2026-05-25T19:36Z)

Current repo/deploy state:
- Branch: `main`
- Code commit: `9dae525ce feat(office): attach tmp-root smoke to manual receipt rung`
- Local/origin: synced after push.
- VPS core worktree: synced to `9dae525ce`.
- VPS dashboard worktree: synced to `9dae525ce`.
- `web_dist` rebuilt locally and rsynced to both VPS checkouts.
- Dashboard/core services restarted only for this code/assets deploy.
- Gateway service was not restarted and remained active.

Latest functional write-readiness rung:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_tmp_root_write_smoke_after_manual_receipt`

What is now implemented:
- Bounded Mac relay tmp-root write smoke can attach to the verified manual operator receipt record.
- The smoke performs only an isolated tmp-root filesystem write/readback/audit and records safe metadata.
- Protected GET/POST API route remains:
  `/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-tmp-root-write-smoke`
- Duplicate POST idempotency replay/skip semantics include the manual receipt source ref in the idempotency seed.
- Compact `/office` summary now prefers the tmp-root write smoke when present, above manual receipt, with heavy ladder detail suppressed.
- Safe DTO/DOM output only: refs, hashes, booleans, timestamps, operator label, safe logical/display path; no markdown body, write_payload body, raw root path, or secret value echo.

Verified in this slice:
- Backend focused pytest: `8 passed, 85 deselected`.
- Frontend focused tests: `4 passed, 171 skipped`.
- `python3 -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`: passed.
- `git diff --check`: passed.
- Added-line leak scan for raw path/secret/body markers: passed.
- `npm run build`: passed with existing Vite chunk-size warning only.
- VPS protected API smoke:
  - unauthenticated tmp-root smoke GET: `401`
  - tmp-root smoke POST: 200 and written/replayed success
  - source manual operator receipt verified=true
  - tmp-root write executed=true and readback verified=true
  - duplicate POST replay=true
  - GET after POST found=true; record_count=2
  - real NAS write, VPS NAS authority, watcher/cron/dispatch/public/gateway, and payload echo flags stayed false
  - raw leak probe: none
- VPS hydrated DOM smoke on `/office`:
  - compact hook found=true
  - tmp-root smoke ready=true
  - tmp-root readback=true
  - real-write=false
  - VPS authority=false
  - runtime-open=false
  - payload-echo=false
  - scoped controls/forms/inputs=0
  - raw leak=false
  - browser console JS errors=0
- Private dashboard probes returned 200 on both protected dashboard ports.
- Public exposure was not enabled; public probe remained unavailable/closed from the VPS-side check.

Still forbidden / not done:
- real NAS production write
- VPS direct NAS authority or NAS mount credentials
- watcher/cron/dispatcher/authority-adapter activation
- public exposure
- gateway restart
- raw markdown/path/secret echo
- real replay-store execution write

Recommended next safe rung:
- `fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_after_tmp_root_write_smoke`
- Record only metadata over the verified tmp-root smoke: source smoke ref/SHA, readback hash, duplicate-skip/idempotency facts, and closed capability flags.
- Keep production NAS write, VPS NAS authority, automation, gateway, public exposure, raw body/path/secret echo, and real replay-store write closed.

Suggested next-session start:
1. `git status --branch --short` and confirm `HEAD=origin/main` at `9dae525ce` or newer.
2. Recheck VPS core/dashboard worktree HEADs and `hermes-agent-dashboard.service`/`hermes-vps-core-dashboard.service` activity; do not restart gateway.
3. Start TDD for replay/idempotency metadata after tmp-root smoke; do not jump directly to real NAS production write.
