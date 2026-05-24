# Fresh request ledger downstream consumption — Mac relay approval-token handoff

Timestamp: 2026-05-24T08:09:37Z

## Final repo state

- Repo: `/Users/lidises/dev/hermes-agent`
- Branch: `main`
- Local `HEAD = origin/main = a3380740dc833aa7c92436c9a04ecdc5ee8fe7e1`
- Latest code commit: `a3380740d feat(office): record Mac relay approval token gate`
- Local git was clean before docs edits.

## Completed rung

`fresh_request_builder_downstream_consumption_one_shot_mac_relay_approval_token_after_real_write_gate`

## What changed

- Added metadata-only non-secret approval-token record storage.
- Added protected approval-token GET/POST routes.
- Added Office UI read-only approval-token panel.
- Approval-token record is sourced from verified Mac relay real-write gate metadata.
- Approval token is a safe ref/checksum contract, not a secret/materialized token value.
- The stage reaches `write_readiness_percent=100` while still blocking real NAS production writes without a later explicit production approval.
- Duplicate writes replay idempotently and skip duplicate approval-token record writes.

## Protected API

- `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-approval-token`
- `POST /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-approval-token`

## UI

- Panel: `NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayApprovalTokenPanel`
- DOM hook: `data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-approval-token="true"`

## Live smoke summary

- unauth GET: `401`
- unauth POST: `401`
- auth real-write-gate GET: `200`
- auth approval-token POST: `200`
- duplicate POST: `200`, `idempotency_replayed=true`
- auth approval-token GET: `200`, `found=true`, `record_count=1`
- `mac_relay_approval_token_ready=true`
- `approval_token_is_secret=false`
- `approval_token_is_non_secret_safe_ref=true`
- `source_mac_relay_real_write_gate_verified=true`
- `approval_token_contract_verified=true`
- `safe_ref_chain_verified=true`
- `write_readiness_percent=100`
- `mac_relay_approval_token_sha256` length `64`
- `explicit_real_nas_production_approval_present=false`
- `approval_token_blocks_without_explicit_production_approval=true`
- `real_nas_production_write_enabled=false`
- `real_nas_production_write_executed=false`
- `vps_direct_nas_authority_enabled=false`
- `watcher_enabled=false`, `cron_enabled=false`, `dispatch_enabled=false`
- `authority_adapter_binding_enabled=false`, `public_exposure_enabled=false`, `gateway_restart_required=false`
- `approval_token_includes_payload_body=false`
- `approval_token_includes_write_payload=false`
- `approval_token_includes_raw_root_path=false`
- `approval_token_includes_secret_value=false`
- raw leak sentinel: `false`

## DOM smoke summary

- approval-token panel found
- ready attr `true`
- replay-store-write attr `false`
- real NAS production attr `false`
- VPS NAS authority attr `false`
- controls `0`
- raw leak `false`
- browser console JS errors `0`

## Verification

- `py_compile` passed
- focused Python chain tests: `69 passed`
- focused Office web tests: `7 passed`
- `eslint` passed with existing warnings only
- `npm run build` passed with existing Vite chunk-size warning only
- `git diff --check` passed
- added-line leak sentinel passed

## VPS state after code deploy

- `/home/hermes/.hermes/hermes-agent = a3380740dc833aa7c92436c9a04ecdc5ee8fe7e1`
- `/home/hermes/.hermes/ai-office-dashboard = a3380740dc833aa7c92436c9a04ecdc5ee8fe7e1`
- `web_dist` rsynced
- dashboard restarted only:
  - MainPID `924292`
  - ActiveEnterTimestamp `Sun 2026-05-24 08:03:01 UTC`
- gateway active/untouched:
  - MainPID `812845`
  - ActiveEnterTimestamp `Fri 2026-05-22 11:14:49 UTC`

## Boundaries preserved

- No real NAS production write.
- No VPS direct NAS authority.
- No watcher/cron/dispatcher/authority-adapter.
- No public exposure.
- No gateway restart.
- No raw markdown/path/secret echo.

## Recommended next rung

`fresh_request_builder_downstream_consumption_one_shot_mac_relay_production_write_approval_after_token`

Next step should be a protected metadata-only production-write approval boundary record sourced from this approval-token record. It should remain safe-ref/checksum-only and still not execute real NAS production write unless a future user prompt explicitly grants production-write approval.
