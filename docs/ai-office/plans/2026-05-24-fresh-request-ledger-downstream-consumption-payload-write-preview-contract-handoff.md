# AI Office handoff — payload/write-payload preview contract

Updated: 2026-05-24T02:00:26Z

## Current baseline

- Repo: `/Users/lidises/dev/hermes-agent`
- Branch: `main`
- Code commit: `b3ea17331c954856c6fbba45afd342fc2fab7541`
- Commit subject: `feat(office): add payload write preview contract`
- VPS `/home/hermes/.hermes/hermes-agent`: `b3ea17331c954856c6fbba45afd342fc2fab7541`
- VPS `/home/hermes/.hermes/ai-office-dashboard`: `b3ea17331c954856c6fbba45afd342fc2fab7541`
- Dashboard restarted only: `hermes-agent-dashboard.service`, MainPID `906475`, active since `Sun 2026-05-24 01:58:38 UTC`
- Gateway remained active and untouched: MainPID `812845`, active since `Fri 2026-05-22 11:14:49 UTC`

## Completed rung

`fresh_request_builder_downstream_consumption_payload_write_preview_contract`

## What changed

- Added a protected safe-ref/checksum-only payload/write-payload preview contract API.
- Source is the verified post-review readback DTO from the previous rung.
- The contract emits stable preview refs and checksums:
  - `payload_preview_ref`
  - `write_payload_preview_ref`
  - `payload_preview_sha256`
  - `write_payload_preview_sha256`
  - `payload_write_preview_contract_sha256`
- UI adds a display-only panel and DOM hook for the preview contract.
- This moves the chain toward write readiness without materializing markdown/body payload or the actual write payload object.

## Protected API

`GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-write-preview-contract`

## UI panel

`NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadWritePreviewContractPanel`

## DOM hook

`data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-write-preview-contract="true"`

## Live smoke

- unauth GET: `401`
- auth GET: `200`
- found=true
- payload_write_preview_contract_ready=true
- write_readiness_stage=`payload_write_preview_contract`
- write_readiness_percent=72
- source_readback_verified=true
- safe_ref_chain_verified=true
- payload_preview_ref=`payloadpreview-c300e7a0876d2c32`
- write_payload_preview_ref=`writepayloadpreview-c300e7a0876d2c32`
- payload_preview_sha256 length=64
- write_payload_preview_sha256 length=64
- markdown_body_included=false
- write_payload_included=false
- write_payload_materialized=false
- actual_downstream_consumption_executed=false
- replay_store_write_enabled=false
- real_replay_store_written=false
- mac_relay_tmp_root_write_smoke_enabled=false
- real_nas_production_write_enabled=false
- vps_nas_mount_enabled=false
- raw leak=false
- DOM found=true
- DOM ready=true
- DOM controls=0
- DOM write_payload_included=false
- DOM mac_relay_tmp_root_write=false
- DOM vps_nas_authority=false
- browser console JS errors=0

## Verification

- `py_compile` passed
- focused Python chain tests: 55 passed
- focused Office RPG tests: 156 passed
- `npm run lint` passed with existing warnings only
- `npm run build` passed with existing Vite chunk-size warning only
- `git diff --check` passed
- added-line leak sentinel passed

## Boundaries kept

- No real NAS production write.
- No VPS direct NAS authority.
- No actual downstream consumption.
- No markdown/body payload materialization.
- No actual write payload object materialization.
- No real replay-store execution write.
- No watcher/cron/dispatcher/authority-adapter activation.
- No public exposure.
- Gateway was not restarted.

## Next recommended rung

`fresh_request_builder_downstream_consumption_one_shot_mac_relay_tmp_root_write_smoke_after_payload_write_preview`

## Next boundary

- Use the payload/write-payload preview contract as source.
- Add the shortest safe Mac relay tmp-root write smoke path, still bounded away from real NAS production writes.
- Keep output metadata-only and safe-ref/checksum based.
- Continue to block VPS NAS authority, watcher/cron/dispatcher/authority-adapter, public exposure, gateway restart, raw markdown/path/secret echo, and real replay-store execution writes.
