# Fresh request ledger downstream consumption — Mac relay real-write gate handoff

Updated: 2026-05-24T07:00:46Z

## Baseline

- Repo: `/Users/lidises/dev/hermes-agent`
- Branch: `main`
- Local HEAD = origin/main = `2da9b577a2f900ab0f68d23e004b4e73f462a50f`
- Latest code commit: `2da9b577a feat(office): record Mac relay real-write gate`
- Local git clean before docs update.
- VPS `/home/hermes/.hermes/hermes-agent` = `2da9b577a2f900ab0f68d23e004b4e73f462a50f`
- VPS `/home/hermes/.hermes/ai-office-dashboard` = `2da9b577a2f900ab0f68d23e004b4e73f462a50f`
- VPS worktrees clean after code deploy.

## Completed rung

`fresh_request_builder_downstream_consumption_one_shot_mac_relay_real_write_gate_after_final_preflight`

## What changed

Added a bounded metadata-only real-write gate sourced from the verified Mac relay final preflight record.

Protected APIs:

- `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-write-gate`
- `POST /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-write-gate`

UI:

- `NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealWriteGatePanel`
- DOM hook: `data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-write-gate="true"`

## Live smoke

Protected API:

- unauth GET: `401`
- unauth POST: `401`
- auth final-preflight GET: `200`
- auth real-write-gate POST: `200`
- duplicate POST: `200`, `idempotency_replayed=true`
- auth real-write-gate GET: `200`, `found=true`, `record_count=1`
- `mac_relay_real_write_gate_ready=true`
- `source_mac_relay_final_preflight_verified=true`
- `source_final_preflight_checklist_verified=true`
- `real_write_gate_checklist_verified=true`
- `safe_ref_chain_verified=true`
- `write_readiness_percent=99`
- `mac_relay_real_write_gate_sha256` length `64`
- `explicit_real_nas_production_approval_present=false`
- `real_write_gate_blocks_without_explicit_approval=true`
- `real_nas_production_write_enabled=false`
- `real_nas_production_write_executed=false`
- `vps_direct_nas_authority_enabled=false`
- `watcher_enabled=false`
- `cron_enabled=false`
- `dispatch_enabled=false`
- `authority_adapter_binding_enabled=false`
- `public_exposure_enabled=false`
- `gateway_restart_required=false`
- `real_write_gate_includes_payload_body=false`
- `real_write_gate_includes_write_payload=false`
- `real_write_gate_includes_raw_root_path=false`
- `real_write_gate_includes_secret_value=false`
- raw leak sentinel: `false`

DOM smoke:

- panel found: `true`
- ready attr: `true`
- replay-store-write attr: `false`
- real NAS production attr: `false`
- VPS NAS authority attr: `false`
- controls: `0`
- raw leak: `false`
- browser console JS errors: `0`

## Verification

- `py_compile` passed
- focused Python chain tests: `67 passed`
- focused Office web tests: `6 passed`
- `eslint` passed with existing warnings only
- `npm run build` passed with existing Vite chunk-size warning only
- `git diff --check` passed
- added-line leak sentinel passed

## VPS deploy

- Core worktree synced to `2da9b577a2f900ab0f68d23e004b4e73f462a50f`.
- Dashboard worktree synced to `2da9b577a2f900ab0f68d23e004b4e73f462a50f`.
- `web_dist` rsynced to both worktrees.
- Dashboard restarted only:
  - MainPID `920826`
  - ActiveEnterTimestamp `Sun 2026-05-24 06:45:49 UTC`
- Gateway active and untouched:
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

`fresh_request_builder_downstream_consumption_one_shot_mac_relay_approval_token_after_real_write_gate`

Goal: protected metadata-only approval-token contract sourced from the real-write gate. Continue to keep real production NAS write disabled unless explicitly approved in a later prompt. Keep the token non-secret, checksum-bound, idempotency-safe, and free of payload body/write_payload/raw path/secret echo.
