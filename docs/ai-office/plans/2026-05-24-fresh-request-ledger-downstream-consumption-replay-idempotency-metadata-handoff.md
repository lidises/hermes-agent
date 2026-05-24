# Fresh request ledger downstream consumption — replay/idempotency metadata handoff

Updated: 2026-05-24T02:59:07Z

## Current baseline

- repo: `/Users/lidises/dev/hermes-agent`
- branch: `main`
- local/origin/VPS HEAD: `23eb3e648e1bc2c274b32814dfb2d8217e8af82f`
- latest code commit: `23eb3e648 feat(office): record replay idempotency metadata`
- local git was clean after code commit/deploy before docs update
- VPS dashboard/core worktrees synced to `23eb3e648e1bc2c274b32814dfb2d8217e8af82f`
- dashboard restarted only; gateway remained active and untouched

## Completed rung

`fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_after_tmp_root_write_smoke`

## What changed

- Added metadata-only replay/idempotency checkpoint over the latest Mac relay tmp-root write-smoke record.
- Added append/list helpers that validate the source tmp-root smoke ref/checksum and idempotency key hash before writing a safe JSONL metadata record.
- Duplicate replay/idempotency submissions are detected and skipped without appending duplicate metadata records.
- Added protected GET/POST API route.
- Added frontend API type/client, display-only panel, and DOM smoke hook.

## Protected API

- `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-idempotency-metadata`
- `POST /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-idempotency-metadata`

## UI

Panel:
- `NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayIdempotencyMetadataPanel`

DOM hook:
- `data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-idempotency-metadata="true"`

## Live smoke

- unauth GET: 401
- auth GET before write: 200
- source tmp-root write-smoke found=true
- auth POST: 200, stored=true
- replay_idempotency_metadata_ready=true
- source_tmp_root_write_smoke_verified=true
- source_tmp_root_readback_verified=true
- source_idempotency_key_verified=true
- replay_idempotency_metadata_sha256 length=64
- duplicate POST: 200, idempotency_replayed=true, idempotency_duplicate_metadata_write_skipped=true
- auth GET after write: found=true
- replay_store_write_enabled=false
- real_replay_store_written=false
- real_nas_production_write_enabled=false
- vps_nas_mount_enabled=false
- raw leak=false
- DOM found=true
- DOM ready=true
- DOM replay-store-write=false
- DOM real NAS production=false
- DOM VPS NAS authority=false
- DOM controls=0
- browser console JS errors=0

## Verification

- `py_compile` passed
- focused Python chain tests: 59 passed
- focused Office RPG tests: 158 passed
- `npm run lint` passed with existing warnings only
- `npm run build` passed with existing Vite chunk-size warning only
- `git diff --check` passed
- added-line leak sentinel passed

## Boundaries kept

- No actual downstream consumption.
- No raw markdown/body payload materialization or echo.
- No raw root path or secret echo.
- No real replay-store execution write.
- No real NAS production write.
- No VPS direct NAS authority or mount.
- No watcher/cron/dispatcher/authority-adapter activation.
- No public exposure.
- No gateway restart.

## Next recommended rung

`fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_readback_after_tmp_root_write_smoke`

Recommended next step:
- Add a protected metadata-only readback proof over the replay/idempotency metadata record.
- Prove duplicate-skip/idempotency safety from stored metadata only.
- Continue shortest safe path toward write readiness without enabling production writes, replay-store writes, dispatcher/watcher/cron, VPS NAS authority, public exposure, or gateway restart.
