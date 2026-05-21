# AI Office NAS keeper Mac relay payload preview — 2026-05-21

## Scope

User approved continuing from NAS Keeper authorization record into the next bounded rung.

This pass added a live display-only Mac relay execution payload preview surface for an already-authorized NAS Keeper handoff. It uses the existing protected backend preview route and previews only safe refs/checksums needed for a future Mac-local relay execution call.

## Boundary

Allowed:

- Read the already-authorized handoff queue item.
- POST one bounded protected payload preview request.
- Preview only safe refs/checksums/metadata.
- Render preview state live-visible with stable DOM hooks and no controls.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.

Still not done / still closed:

- Mac relay write execution.
- Actual NAS file write.
- Direct VPS NAS authority, mount, credentials, raw path, or real write.
- Real NAS execution.
- Queue mutation beyond prior authorization record.
- Watcher/cron/daemon activation.
- Public exposure changes.
- Gateway restart.
- Real external dispatch execution.

## Code/test changes

Commit:

- `30e67f6c feat(office): preview nas keeper relay payload`

Files changed:

- `web/src/lib/api.test.ts`
  - Added protected non-executing payload preview client test for existing `api.previewOfficeControlledMutationNasKeeperExecutionPayload`.
- `web/src/pages/OfficePage.tsx`
  - Added `NasKeeperMacRelayExecutionPayloadPreviewStatusPanel`.
  - Added state/effect to preview the authorized handoff payload after `NasKeeperHandoffAuthorizationRecordStatusPanel` evidence exists.
  - Rendered the panel live-visible after the authorization panel and before legacy diagnostic lanes.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Added display-only payload preview panel render test.
  - Extended live-visible placement/uniqueness regression to include `NasKeeperMacRelayExecutionPayloadPreviewStatusPanel`.

## Local verification

- RED:
  - focused panel test failed first because `NasKeeperMacRelayExecutionPayloadPreviewStatusPanel` was missing.
  - API client test already passed because the project already had the protected preview client and types; the test now protects that existing client contract.
- GREEN:
  - focused panel test passed.
  - placement/uniqueness test passed.
- Backend:
  - `py_compile` passed for `hermes_cli/office_controlled_mutation.py` and `hermes_cli/web_server.py`.
  - Focused controlled-mutation backend tests passed: `31 passed`.
- Frontend:
  - combined `src/lib/api.test.ts` + `src/pages/OfficePage.rpg.test.tsx`: `151 passed`.
  - `npm run build` passed with existing Vite large chunk warning only.
- `git diff --check` passed.
- added-line sentinel scan found no new raw path/token/provider sentinels.

## VPS deploy

- Synced both VPS worktrees to latest code commit `30e67f6c`:
  - `/home/hermes/.hermes/ai-office-dashboard`
  - `/home/hermes/.hermes/hermes-agent`
- Rsynced local built `hermes_cli/web_dist/` to both worktrees.
- Restarted:
  - `hermes-agent-dashboard.service`
- Did not restart:
  - `hermes-gateway.service`
- Final services:
  - dashboard active
  - gateway active

## VPS protected API smoke

URL shell:

- `http://100.122.57.85:8765/office?payload-preview=30e67f6c`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing handoff source:

- `handoff_ref=handoff:fbb4275f.live.smoke.1511`
- `authorization_ref=auth-780a0c24-live-smoke-1551`
- queue_status=`authorized_for_mac_relay_execution`

Preview ref:

- `relay_execution_ref=relayexec-30e67f6c-live-smoke-1604`

POST `/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-payload-preview`:

- unauth=401
- previewed=true
- dto.mode=`nas_keeper_mac_relay_execution_payload_preview`
- handoff_ref=`handoff:fbb4275f.live.smoke.1511`
- authorization_ref=`auth-780a0c24-live-smoke-1551`
- relay_execution_ref=`relayexec-30e67f6c-live-smoke-1604`
- queue_status=`authorized_for_mac_relay_execution`
- markdown_body_included=false
- markdown_body_sha256 length=64
- capabilities.execution_payload_preview_enabled=true
- capabilities.queue_mutation_enabled=false
- capabilities.nas_keeper_authorization_recording_enabled=false
- capabilities.mac_relay_write_enabled=false
- capabilities.actual_nas_write_enabled=false
- capabilities.vps_nas_mount_enabled=false
- capabilities.vps_credential_access_enabled=false
- capabilities.direct_vps_nas_write_enabled=false
- capabilities.watcher_enabled=false
- capabilities.cron_enabled=false
- capabilities.dispatch_enabled=false
- capabilities.authority_adapter_binding_enabled=false
- raw leak sentinels absent

GET queue readback used for source selection:

- unauth=401
- authorized handoff source read through protected queue route
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?payload-preview=30e67f6c`:

- `data-office-nas-keeper-execution-payload-preview-status="true"`
  - exists=true
  - controls=0
  - `data-office-nas-keeper-execution-payload-previewed="true"`
  - `data-office-nas-keeper-execution-payload-preview-enabled="true"`
  - `data-office-nas-keeper-execution-payload-queue-mutation="false"`
  - `data-office-nas-keeper-execution-payload-mac-relay-write="false"`
  - `data-office-nas-keeper-execution-payload-actual-write="false"`
  - `data-office-nas-keeper-execution-payload-vps-nas-mount="false"`
  - page body includes `relayexec-`
  - page body includes `payload previewed`
  - page body includes `authorized_for_mac_relay_execution`

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The Mac relay execution payload preview rung is complete. The dashboard now previews the authorized handoff execution payload while keeping Mac relay execution and every stronger NAS/automation/public/dispatch authority boundary closed.

## Next recommended rung

Continue to `mac_relay_execution_from_preview_guarded_failure` / disabled execution-from-preview guard smoke only if bounded authority remains acceptable.

This next rung should attempt the protected execution-from-preview route without a configured Mac relay root and verify it fails safely (`executed=false`, `written=false`, root not configured) while still not writing NAS files, mounting NAS on the VPS, exposing credentials, starting watcher/cron/daemon processes, restarting gateway, or exposing public authority.

Last updated: 2026-05-21 16:08 KST
