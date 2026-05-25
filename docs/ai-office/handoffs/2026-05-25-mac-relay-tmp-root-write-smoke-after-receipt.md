# AI Office handoff — Mac relay tmp-root write smoke after manual receipt

Date: 2026-05-25T19:36Z
Commit: `9dae525ce feat(office): attach tmp-root smoke to manual receipt rung`

## Rung completed

`fresh_request_builder_downstream_consumption_one_shot_mac_relay_tmp_root_write_smoke_after_manual_receipt`

This rung moves write-readiness closer to a real write without crossing the production boundary. It uses the verified manual operator receipt as the source and performs only a bounded tmp-root Mac relay write smoke. The recorded output is metadata-only: source refs/hashes, tmp-root readback hash, audit flags, idempotency hash, and closed capability booleans.

## Safety boundaries preserved

Still closed:
- real NAS production write
- VPS direct NAS authority and NAS mount credentials
- watcher, cron, dispatcher, authority adapter
- public exposure
- gateway restart
- real replay-store execution write
- raw markdown, write_payload body, raw root path, secret echo

## Local verification

- Backend focused pytest: `8 passed, 85 deselected`
- Frontend focused tests: `4 passed, 171 skipped`
- Python compile: passed
- `git diff --check`: passed
- Added-line leak scan: passed
- Production build: passed, with only the known Vite large chunk warning

## VPS deploy / smoke

- VPS core checkout synced to `9dae525ce`
- VPS dashboard checkout synced to `9dae525ce`
- `web_dist` rsynced to both checkouts
- Dashboard/core services restarted
- Gateway remained active and was not restarted

Protected API smoke:
- unauthenticated tmp-root smoke GET: `401`
- tmp-root smoke POST: 200 and written/replayed success
- source manual operator receipt verified=true
- tmp-root filesystem write executed=true
- tmp-root readback verified=true
- duplicate POST replay=true
- GET found=true, record_count=2
- forbidden capability flags remained false
- raw leak probe empty

Hydrated `/office` DOM smoke:
- compact hook found=true
- tmp-root smoke ready=true
- tmp-root readback=true
- real-write=false
- VPS-authority=false
- runtime-open=false
- payload-echo=false
- scoped controls/forms/inputs=0
- raw leak=false
- browser console JS errors=0

## Next shortest safe rung

`fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_after_tmp_root_write_smoke`

Suggested TDD shape:
1. RED backend test: metadata-only replay/idempotency record must source the latest verified tmp-root smoke ref/SHA/readback hash.
2. GREEN implementation: append/list protected metadata record; no real replay-store write.
3. Frontend compact/API surface: show replay/idempotency metadata only; keep heavy details suppressed.
4. VPS protected API/DOM smoke: duplicate replay, false capability flags, no raw leak.

Do not advance directly to real NAS production write without exact new approval.
