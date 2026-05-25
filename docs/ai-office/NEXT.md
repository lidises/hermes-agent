## NEXT — Mac relay precommit manifest compact dashboard deployed (2026-05-25T14:55Z)

Current repo/deploy state:
- Branch: `main`
- Code commit: `6a87edf0e Surface NAS Keeper precommit manifest summary`
- Local/origin: synced after push.
- VPS core worktree: synced to `6a87edf0e`.
- VPS dashboard worktree: synced to `6a87edf0e`.
- `web_dist` rebuilt locally and rsynced to both VPS checkouts.
- Dashboard/core services restarted only for this code/assets deploy.
- Gateway service was not restarted.

Latest functional write-readiness rung:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_precommit_manifest_after_replay_idempotency`

What is now implemented/deployed:
- Protected Mac relay precommit manifest API records a metadata-only checkpoint sourced from verified precommit metadata.
- This slice promoted that precommit manifest as the compact `/office` latest boundary, above precommit metadata, replay/idempotency metadata, and tmp-root smoke.
- Compact DOM hooks expose precommit manifest readiness, source verification, replay-store-write closure, real-write closure, VPS-authority closure, runtime closure, and payload-echo closure.
- Safe DTO/DOM output only: refs, checksums, booleans, timestamps, operator label, safe stage labels; no markdown body, write_payload body, raw root path, or secret value echo.

Verified in this slice:
- Frontend RED first: new compact precommit manifest test failed while compact dashboard still preferred precommit metadata.
- Backend focused pytest: `12 passed, 81 deselected`.
- Frontend focused tests: `10 passed, 168 skipped`.
- `python3 -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`: passed.
- `git diff --check`: passed.
- Production-source leak scan for raw path/secret/body markers: passed.
- `npm run build`: passed with existing Vite chunk-size warning only.
- `npm run lint -- src/pages/OfficePage.tsx`: exit 0, existing warnings only.
- VPS protected API smoke:
  - unauthenticated precommit manifest GET: `401`
  - protected precommit manifest POST: HTTP 200, stored=true
  - precommit manifest GET: HTTP 200, record_count=2
  - precommit manifest ready=true; source precommit metadata verified=true
  - write_readiness_percent=94
  - next boundary is `fresh_request_builder_downstream_consumption_one_shot_mac_relay_final_preflight_after_precommit_manifest`
  - replay-store write, real NAS write, VPS NAS authority, runtime automation, public exposure, gateway restart, and payload echo flags stayed false
- VPS hydrated DOM smoke on `/office`:
  - compact hook found=true
  - precommit manifest ready=true
  - source verified=true
  - replay-store write=false
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
  - latest boundary label is Mac relay precommit manifest
  - write-readiness displayed as 94%
  - scoped controls/forms/inputs=0
  - heavy archive DOM rendered=false
  - browser console JS errors=0

Still forbidden / not done:
- real NAS production write
- VPS direct NAS authority or NAS mount credentials
- watcher/cron/dispatcher/authority-adapter activation
- public exposure
- gateway restart
- raw markdown/path/secret echo
- real replay-store execution write

Recommended next safe rung:
- `fresh_request_builder_downstream_consumption_one_shot_mac_relay_final_preflight_after_precommit_manifest`
- Continue TDD with the shortest safe path: add/verify the final-preflight metadata-only record and compact/dashboard/API readback, sourced from the live precommit manifest.
- Keep production NAS write, VPS NAS authority, automation, gateway, public exposure, raw body/path/secret echo, and real replay-store write closed.

Suggested next-session start:
1. `git status --branch --short` and confirm `HEAD=origin/main` at the docs commit after this handoff or newer.
2. Recheck VPS core/dashboard worktree HEADs and `hermes-agent-dashboard.service`/`hermes-vps-core-dashboard.service` activity; do not restart gateway.
3. Start TDD for compact Mac relay final-preflight promotion and protected metadata-only final-preflight POST smoke; do not jump to real NAS production write.
