# Fresh request ledger downstream consumption — Mac relay precommit metadata handoff

## Current status — Mac relay precommit metadata write-readiness (2026-05-24T03:52:29Z)

- repo: `/Users/lidises/dev/hermes-agent`
- branch: `main`
- local HEAD = origin/main = `9041b16f77013241c2da6dab58e4b80a490db15b`
- latest code commit: `9041b16f7 feat(office): record Mac relay precommit metadata`
- local git: clean after code deploy
- VPS core/dashboard worktrees: synced to `9041b16f77013241c2da6dab58e4b80a490db15b` and clean
- dashboard: active; restarted for this code deploy
- gateway: active and untouched (service `hermes-gateway.service`; no gateway restart)

Completed rung:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_precommit_metadata_after_replay_idempotency`

What changed:
- Added a protected metadata-only Mac relay precommit checkpoint backed by the stored replay/idempotency metadata record.
- Added duplicate-safe idempotency handling: duplicate precommit POSTs replay the existing record and skip duplicate metadata writes.
- Increased write-readiness to 90% while keeping real replay-store writes, real NAS production writes, VPS direct NAS authority, watcher/cron/dispatcher/authority-adapter, public exposure, and gateway restart closed.
- Added protected API GET/POST and a display-only Office UI panel/DOM smoke hook.

Protected API:
- `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-metadata`
- `POST /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-metadata`

UI panel:
- `NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitMetadataPanel`

DOM hook:
- `data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-metadata="true"`

Live smoke:
- unauth GET: 401
- authenticated GET: 200
- authenticated POST: 200
- duplicate POST: 200
- stored=true
- duplicate_replayed=true
- found=true
- mac_relay_precommit_metadata_ready=true
- source_replay_idempotency_metadata_verified=true
- source_idempotency_duplicate_skip_verified=true
- write_readiness_percent=90
- mac_relay_precommit_metadata_sha256 length=64
- replay_store_write_enabled=false
- real_replay_store_written=false
- real_nas_production_write_enabled=false
- vps_nas_mount_enabled=false
- watcher_enabled=false
- cron_enabled=false
- dispatch_enabled=false
- authority_adapter_binding_enabled=false
- public_exposure_enabled=false
- gateway_restart_required=false
- raw leak=false
- DOM found=true
- DOM controls=0
- browser console JS errors=0

Verification:
- py_compile passed
- focused Python chain tests: 61 passed
- focused Office web tests: 159 passed
- eslint passed, existing warnings only
- npm run build passed, existing Vite chunk-size warning only
- git diff --check passed
- added-line leak sentinel passed

Next recommended rung:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_precommit_manifest_after_replay_idempotency`

Next boundaries:
- Continue write-readiness by creating a metadata-only precommit manifest/checklist over safe refs/checksums.
- Do not perform real NAS production writes.
- Do not enable VPS direct NAS authority or NAS mount.
- Do not enable watcher/cron/dispatcher/authority-adapter.
- Do not expose public endpoints.
- Do not restart gateway.
- Do not echo raw markdown/body/path/secret values.
