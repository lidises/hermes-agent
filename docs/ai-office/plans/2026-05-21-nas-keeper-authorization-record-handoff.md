# AI Office NAS keeper authorization record — 2026-05-21

## Scope

User approved continuing from NAS Keeper handoff claim dry-run into the next bounded write rung.

This pass added a live display-only NAS Keeper handoff authorization record surface, added a protected frontend API client for the existing authorization route, and exercised the protected authorization POST plus queue readback GET on the private VPS.

## Boundary

Allowed:

- Record one safe-ref NAS Keeper authorization for one pending handoff queue item.
- Mutate only that queue item's safe status from `pending_nas_keeper_authorization` to `authorized_for_mac_relay_execution`.
- Store only safe refs/metadata such as authorization ref, actor ref, timestamp, queue status, and capability flags.
- Render the authorization readback live-visible with stable DOM hooks and no controls.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.

Still not done / still closed:

- Mac relay write execution.
- Actual NAS file write.
- Direct VPS NAS authority, mount, credentials, raw path, or real write.
- Real NAS execution.
- Watcher/cron/daemon activation.
- Public exposure changes.
- Gateway restart.
- Real external dispatch execution.

## Code/test changes

Commits:

- `780a0c24 feat(office): record nas keeper authorization`
- `b78f2090 fix(office): show nas keeper authorization readback`

Files changed:

- `web/src/lib/api.ts`
  - Added `OfficeNasKeeperHandoffAuthorizationPayload`.
  - Added `OfficeNasKeeperHandoffAuthorizationResult`.
  - Added `api.authorizeOfficeControlledMutationNasKeeperHandoff` for protected POST to `/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-authorize`.
- `web/src/lib/api.test.ts`
  - Added protected queue-mutation authorization API client test.
- `web/src/pages/OfficePage.tsx`
  - Added `NasKeeperHandoffAuthorizationRecordStatusPanel`.
  - Added state/effect to authorize the latest dry-run-confirmed pending handoff.
  - Added queue-readback synthesis so a fresh page load still displays the already-authorized queue item.
  - Rendered the panel live-visible after `NasKeeperHandoffClaimDryRunStatusPanel` and before legacy diagnostic lanes.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Added display-only authorization panel render test.
  - Extended live-visible placement/uniqueness regression to include `NasKeeperHandoffAuthorizationRecordStatusPanel`.

## Local verification

- RED:
  - focused panel test failed first because `NasKeeperHandoffAuthorizationRecordStatusPanel` was missing.
  - focused API test failed first because `authorizeOfficeControlledMutationNasKeeperHandoff` was missing.
- GREEN:
  - focused panel test passed.
  - focused API client test passed.
  - placement/uniqueness test passed.
- Backend:
  - `py_compile` passed for `hermes_cli/office_controlled_mutation.py` and `hermes_cli/web_server.py`.
  - Focused controlled-mutation backend tests passed: `31 passed`.
- Frontend:
  - combined `src/lib/api.test.ts` + `src/pages/OfficePage.rpg.test.tsx`: `149 passed`.
  - `npm run build` passed with existing Vite large chunk warning only.
- `git diff --check` passed.
- added-line sentinel scan found no new raw path/token/provider sentinels.

## VPS deploy

- Synced both VPS worktrees to latest code commit `b78f2090`:
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

- `http://100.122.57.85:8765/office?auth-record=b78f2090`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing handoff source:

- `handoff_ref=handoff:fbb4275f.live.smoke.1511`
- `relay_node_ref=relay:mac_relay_safe`
- `nas_keeper_ref=keeper:manual_review`

Authorization ref:

- `authorization_ref=auth-780a0c24-live-smoke-1551`

POST `/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-authorize`:

- unauth=401
- authorized=true
- dto.mode=`nas_keeper_mac_relay_handoff_authorized`
- handoff_ref=`handoff:fbb4275f.live.smoke.1511`
- authorization_ref=`auth-780a0c24-live-smoke-1551`
- queue_status_before=`pending_nas_keeper_authorization`
- queue_status_after=`authorized_for_mac_relay_execution`
- capabilities.queue_mutation_enabled=true
- capabilities.nas_keeper_authorization_recording_enabled=true
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

GET `/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-queue?handoff_ref=handoff%3Afbb4275f.live.smoke.1511`:

- unauth=401
- listed=true
- count=1 for queried ref
- latest handoff_ref=`handoff:fbb4275f.live.smoke.1511`
- latest queue_status=`authorized_for_mac_relay_execution`
- latest authorization_ref=`auth-780a0c24-live-smoke-1551`
- markdown_body_included=false
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?auth-record=b78f2090`:

- `data-office-nas-keeper-handoff-authorization-record-status="true"`
  - exists=true
  - controls=0
  - `data-office-nas-keeper-handoff-authorization-authorized="true"`
  - `data-office-nas-keeper-handoff-authorization-queue-mutation="true"`
  - `data-office-nas-keeper-handoff-authorization-recording="true"`
  - `data-office-nas-keeper-handoff-authorization-mac-relay-write="false"`
  - `data-office-nas-keeper-handoff-authorization-actual-write="false"`
  - `data-office-nas-keeper-handoff-authorization-vps-nas-mount="false"`
  - page body includes the safe authorization ref
  - page body includes `authorized_for_mac_relay_execution`

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The NAS Keeper authorization record rung is complete. The dashboard now records and surfaces one safe queue authorization while keeping Mac relay execution and every stronger NAS/automation/public/dispatch authority boundary closed.

## Next recommended rung

Continue to `mac_relay_execution_payload_preview` / `nas_keeper_mac_relay_execution_preview` only if bounded authority remains acceptable.

This next rung should read the already-authorized handoff and preview the Mac relay execution payload only. It should still not execute Mac relay writes, write NAS files, mount NAS on the VPS, expose credentials, start watcher/cron/daemon processes, restart the gateway, or expose public authority.

Last updated: 2026-05-21 15:58 KST
