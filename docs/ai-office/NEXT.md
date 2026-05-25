## NEXT — Mac relay precommit metadata compact dashboard deployed (2026-05-25T13:12Z)

Current repo/deploy state:
- Branch: `main`
- Code commit: `3cb6d0304 feat(office): surface precommit metadata in compact dashboard`
- Local/origin: synced after push.
- VPS core worktree: synced to `3cb6d0304`.
- VPS dashboard worktree: synced to `3cb6d0304`.
- `web_dist` rebuilt locally and rsynced to both VPS checkouts.
- Dashboard/core services restarted only for this code/assets deploy.
- Gateway service was not restarted and remained active.

Latest functional write-readiness rung:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_precommit_metadata_after_replay_idempotency`

What is now implemented/deployed:
- Protected Mac relay precommit metadata API already records a metadata-only checkpoint sourced from verified replay/idempotency metadata.
- This slice promoted that precommit metadata as the compact `/office` latest boundary, above replay/idempotency metadata and tmp-root smoke.
- Compact DOM hooks now expose precommit metadata readiness, source verification, replay-store-write closure, real-write closure, VPS-authority closure, runtime closure, and payload-echo closure.
- Safe DTO/DOM output only: refs, checksums, booleans, timestamps, operator label, safe stage labels; no markdown body, write_payload body, raw root path, or secret value echo.

Verified in this slice:
- Frontend RED first: new compact precommit metadata test failed while compact dashboard still preferred replay metadata.
- Backend focused pytest: `10 passed, 83 deselected`.
- Frontend focused tests: `8 passed, 169 skipped`.
- `python3 -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`: passed.
- `git diff --check`: passed.
- Production-source leak scan for raw path/secret/body markers: passed.
- `npm run build`: passed with existing Vite chunk-size warning only.
- VPS protected API smoke:
  - unauthenticated precommit metadata GET: `401`
  - source replay metadata found=true
  - precommit metadata POST stored=true
  - duplicate precommit metadata POST idempotency_replayed=true and duplicate write skipped
  - precommit metadata GET found=true; record_count=2
  - precommit metadata ready=true; source replay/idempotency metadata and duplicate-skip verified=true
  - write_readiness_percent=90
  - replay-store write, real NAS write, VPS NAS authority, runtime automation, public exposure, gateway restart, and payload echo flags stayed false
- VPS hydrated DOM smoke on `/office`:
  - compact hook found=true
  - precommit metadata ready=true
  - source verified=true
  - replay-store write=false
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
  - latest boundary label is Mac relay precommit metadata
  - scoped controls/forms/inputs=0
  - raw leak=false
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
- `fresh_request_builder_downstream_consumption_one_shot_mac_relay_precommit_manifest_after_replay_idempotency`
- Add/verify compact promotion for the metadata-only Mac relay precommit manifest, then exercise its protected API as another metadata-only record write sourced from the now-live precommit metadata.
- Keep production NAS write, VPS NAS authority, automation, gateway, public exposure, raw body/path/secret echo, and real replay-store write closed.

Suggested next-session start:
1. `git status --branch --short` and confirm `HEAD=origin/main` at the docs commit after this handoff or newer.
2. Recheck VPS core/dashboard worktree HEADs and `hermes-agent-dashboard.service`/`hermes-vps-core-dashboard.service` activity; do not restart gateway.
3. Start TDD for compact Mac relay precommit manifest promotion and protected metadata-only manifest POST smoke; do not jump to real NAS production write.
