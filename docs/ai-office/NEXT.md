## NEXT — replay/idempotency metadata compact dashboard deployed (2026-05-25T11:44Z)

Current repo/deploy state:
- Branch: `main`
- Code commit: `9ce9d0416 feat(office): surface replay metadata in compact dashboard`
- Local/origin: synced after push.
- VPS core worktree: synced to `9ce9d0416`.
- VPS dashboard worktree: synced to `9ce9d041`.
- `web_dist` rebuilt locally and rsynced to both VPS checkouts.
- Dashboard/core services restarted only for this code/assets deploy.
- Gateway service was not restarted and remained active.

Latest functional write-readiness rung:
`fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_after_tmp_root_write_smoke`

What is now implemented/deployed:
- Protected replay/idempotency metadata API records a metadata-only checkpoint sourced from the verified tmp-root write smoke.
- The checkpoint records safe source smoke ref/SHA, source readback verification, idempotency-key verification, duplicate-skip posture, and closed capability flags.
- Duplicate POSTs are replayed/skipped without appending another metadata record.
- Compact `/office` summary now prefers replay/idempotency metadata above the tmp-root smoke when present.
- Safe DTO/DOM output only: refs, checksums, booleans, timestamps, operator label, safe stage labels; no markdown body, write_payload body, raw root path, or secret value echo.

Verified in this slice:
- Frontend RED first: new compact replay metadata test failed before the compact panel was promoted.
- Backend focused pytest: `8 passed, 85 deselected`.
- Frontend focused tests: `6 passed, 170 skipped`.
- `python3 -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`: passed.
- `git diff --check`: passed.
- Production-source added-line leak scan for raw path/secret/body markers: passed.
- `npm run build`: passed with existing Vite chunk-size warning only.
- VPS protected API smoke:
  - unauthenticated replay metadata GET: `401`
  - source tmp-root smoke GET found=true
  - replay metadata POST stored=true
  - duplicate replay metadata POST idempotency_replayed=true and duplicate write skipped
  - replay metadata GET found=true; record_count=2
  - replay metadata ready=true; source tmp-root smoke/readback/idempotency verified=true
  - replay-store write, real NAS write, VPS NAS authority, runtime automation, public exposure, gateway restart, and payload echo flags stayed false
- VPS hydrated DOM smoke on `/office`:
  - compact hook found=true
  - replay metadata ready=true
  - source verified=true
  - replay-store write=false
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
  - latest boundary label is replay/idempotency metadata
  - scoped controls/forms/inputs=0
  - raw leak=false
  - browser console JS errors=0
- Private dashboard probes returned 200 on both protected dashboard ports.

Still forbidden / not done:
- real NAS production write
- VPS direct NAS authority or NAS mount credentials
- watcher/cron/dispatcher/authority-adapter activation
- public exposure
- gateway restart
- raw markdown/path/secret echo
- real replay-store execution write

Recommended next safe rung:
- `fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_readback_after_tmp_root_write_smoke`
- Add a readback verifier over the replay/idempotency metadata record and compact summary, proving the metadata-only record can be recovered safely before moving to Mac relay precommit metadata.
- Keep production NAS write, VPS NAS authority, automation, gateway, public exposure, raw body/path/secret echo, and real replay-store write closed.

Suggested next-session start:
1. `git status --branch --short` and confirm `HEAD=origin/main` at the docs commit after this handoff or newer.
2. Recheck VPS core/dashboard worktree HEADs and `hermes-agent-dashboard.service`/`hermes-vps-core-dashboard.service` activity; do not restart gateway.
3. Start TDD for replay/idempotency metadata readback after tmp-root smoke; do not jump directly to precommit or real NAS production write.
