# AI Office Mac-local relay root probe implementation — 2026-05-21

## Scope

User approved continuing toward actual NAS write, including stronger authority once write readiness reaches 100%. This slice implemented the next safe rung only: `mac_local_relay_root_probe_implementation`.

This is still read-only readiness probing. It does not execute an actual NAS write and does not grant VPS NAS authority.

## Code commit

- `5450deed feat(office): probe mac relay root readiness`

## Implemented

Backend:

- Added `probe_office_controlled_mutation_mac_relay_root_readiness(root_path=...)` in `hermes_cli/office_controlled_mutation.py`.
- Added authenticated dashboard route:
  - `GET /api/office/controlled-mutation/nas-runtime/mac-relay-root-readiness-probe`
- Route uses `HERMES_AI_OFFICE_MAC_RELAY_NAS_ROOT` internally but never returns the raw value.
- DTO fields:
  - `root_configured`
  - `root_readable`
  - `root_writable`
  - `safe_probe_ref`
  - `sanitized_root_label`
  - `redaction_policy_version`
  - `probe_errors`
  - `write_payload_included=false`
  - `raw_root_path_included=false`
  - `credential_value_included=false`
- Capabilities remain closed for:
  - `actual_nas_write_enabled=false`
  - `write_payload_enabled=false`
  - `vps_nas_mount_enabled=false`
  - `direct_vps_nas_write_enabled=false`
  - watcher/cron/dispatch false

Frontend:

- Added `OfficeMacRelayRootReadinessProbeResult` and API method:
  - `api.probeOfficeControlledMutationMacRelayRootReadiness()`
- Office RPG panel now consumes sanitized probe evidence.
- Panel hook remains:
  - `data-office-mac-local-relay-root-readiness-probe-contract="true"`
- New DOM attributes expose only safe booleans:
  - `probe-executed`
  - `root-configured`
  - `root-readable`
  - `root-writable`
  - `raw-root-path-included`
  - `credential-value-included`

## Verification

Local:

- RED confirmed first: new backend probe tests failed because helper did not exist.
- `py_compile` passed for:
  - `hermes_cli/office_controlled_mutation.py`
  - `hermes_cli/web_server.py`
- Backend focused tests:
  - `tests/hermes_cli/test_office_controlled_mutation_mac_relay_root_probe.py`
  - `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_execution_state_record.py`
  - `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_queue_readback.py`
  - result: `11 passed`
- Frontend focused tests:
  - `src/lib/api.test.ts`
  - `src/pages/OfficePage.rpg.test.tsx`
  - result: `159 passed`
- `npm run build` passed.
- `git diff --check` passed.
- added-line sentinel scan found no raw path/token/provider sentinel hits.

VPS:

- Both worktrees synced to:
  - `5450deed4534daec85a3ffa3d717340be2e8e472`
- Corrected `/home/hermes/.hermes/hermes-agent` remote/reset after noticing its default `origin` points to upstream NousResearch; reset it to `lidises/main`.
- Restarted only:
  - `hermes-agent-dashboard.service`
- Did not restart:
  - `hermes-gateway.service`
- Services active:
  - dashboard active
  - gateway active
- `/office?probe-impl=5450deed` HTTP 200.
- Browser DOM smoke:
  - focusedShell=true
  - mapSvg=true
  - sprites=8
  - probeContract=true
  - probeExecuted=true
  - rootConfigured=false
  - rootReadable=false
  - rootWritable=false
  - writeEnabled=false
  - vpsNasAuthority=false
  - rawRootPathIncluded=false
  - credentialValueIncluded=false
  - rawLeak=[]
  - browser console messages/errors=0

Note: direct curl to the new API endpoint returned 401 without the dashboard session token, as expected for protected API access. Browser/UI smoke verifies the endpoint through the injected session token.

## Current readiness

Operational estimate after this slice: about 58% actual NAS write readiness.

The biggest blocker remains: Mac-local relay root is not configured in the active runtime evidence (`rootConfigured=false`).

## Boundaries preserved

- No actual NAS write.
- No final write payload armed.
- No raw NAS path returned or rendered.
- No credential value returned or rendered.
- No VPS NAS mount or direct NAS authority.
- No watcher/cron/daemon activation.
- No gateway restart.
- No public exposure change.

## Next recommended rung

`mac_local_relay_root_runtime_configuration`

Purpose:

- Configure the Mac-local runtime with the intended NAS relay root without exposing it in docs/UI/logs.
- Re-run sanitized probe.
- Required evidence for continuing:
  - `root_configured=true`
  - `root_readable=true`
  - `root_writable=true`
  - `raw_root_path_included=false`
  - `credential_value_included=false`
  - `write_payload_included=false`
  - no raw leak in UI/console/log summary

Do not jump directly to write unless sanitized probe evidence reaches the above readiness gates.
