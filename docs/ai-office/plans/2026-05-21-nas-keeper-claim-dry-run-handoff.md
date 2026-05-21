# AI Office NAS keeper claim dry-run — 2026-05-21

## Scope

User approved continuing from controlled NAS keeper handoff into the next bounded rung.

This pass added a live display-only NAS Keeper handoff claim dry-run surface, added a protected frontend API client for the existing dry-run route, and exercised the protected dry-run POST plus queue readback GET on the private VPS.

## Boundary

Allowed:

- Add `NasKeeperHandoffClaimDryRunStatusPanel` as a live-visible display-only panel.
- Auto-preview a claim dry-run for the latest pending NAS Keeper handoff queue item.
- POST only to the existing dry-run route.
- Read the handoff queue via protected GET.
- Keep dry-run result display-only with stable DOM hooks and no form controls.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.

Still not done / still closed:

- Queue mutation.
- NAS Keeper authorization recording.
- Mac relay write execution.
- Direct VPS NAS authority, mount, credentials, raw path, or real write.
- Real NAS execution.
- Watcher/cron/daemon activation.
- Public exposure changes.
- Gateway restart.
- Real external dispatch execution.

## Code/test change

Commit:

- `1976625b feat(office): surface nas keeper claim dry run`

Files changed:

- `web/src/lib/api.ts`
  - Added `OfficeNasKeeperHandoffClaimDryRunPayload`.
  - Added `OfficeNasKeeperHandoffClaimDryRunResult`.
  - Added `api.dryRunOfficeControlledMutationNasKeeperHandoffClaim` for protected POST to `/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-claim-dry-run`.
- `web/src/lib/api.test.ts`
  - Added protected non-mutating claim dry-run API client test.
- `web/src/pages/OfficePage.tsx`
  - Added `NasKeeperHandoffClaimDryRunStatusPanel`.
  - Added state/effect to run one dry-run preview for the latest pending handoff queue item.
  - Rendered the panel live-visible after `ManualNasKeeperHandoffRecordStatusPanel` and before legacy diagnostic lanes.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Added display-only panel render test.
  - Extended live-visible placement/uniqueness regression to include `NasKeeperHandoffClaimDryRunStatusPanel`.

## Local verification

- Backend py_compile:
  - `hermes_cli/office_controlled_mutation.py`
  - `hermes_cli/web_server.py`
  - passed
- Focused backend tests:
  - `tests/hermes_cli/test_office_controlled_mutation_manual_approval_recording_draft.py`
  - `31 passed`
- Frontend tests in `web/`:
  - focused RED test failed first because the panel was missing
  - focused GREEN panel test passed
  - focused API client test passed
  - placement/uniqueness test passed
  - combined `src/lib/api.test.ts` + `src/pages/OfficePage.rpg.test.tsx`: `147 passed`
- `npm run build` in `web/`:
  - passed
  - existing Vite large chunk warning only
- `git diff --check`:
  - passed
- added-line sentinel scan:
  - no newly added raw path/token/provider sentinels

## VPS deploy

- Synced both worktrees to `1976625b`:
  - dashboard worktree
  - core Hermes worktree
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

- `http://100.122.57.85:8765/office?claim-dry-run=1976625b`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing handoff source:

- `handoff_ref=handoff:fbb4275f.live.smoke.1511`
- `relay_node_ref=relay:mac_relay_safe`

Claim dry-run ref:

- `claim_ref=claim:1976625b.live.smoke.1526`

POST `/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-claim-dry-run`:

- unauth=401
- invalid unsupported raw extras did not echo unsafe values
- claimed=false
- dry_run=true
- dto.mode=`nas_keeper_mac_relay_handoff_claim_dry_run`
- claim_status=`would_claim`
- handoff_ref=`handoff:fbb4275f.live.smoke.1511`
- claim_ref=`claim:1976625b.live.smoke.1526`
- queue_status_before=`pending_nas_keeper_authorization`
- queue_status_after=`pending_nas_keeper_authorization`
- capabilities.queue_read_enabled=true
- capabilities.claim_dry_run_enabled=true
- queue_mutation_enabled=false
- nas_keeper_authorization_recording_enabled=false
- direct_vps_nas_write_enabled=false
- mac_relay_write_enabled=false
- actual_nas_write_enabled=false
- watcher_enabled=false
- cron_enabled=false
- dispatch_enabled=false
- authority_adapter_binding_enabled=false
- raw leak sentinels absent

GET `/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-queue?handoff_ref=handoff%3Afbb4275f.live.smoke.1511`:

- unauth=401
- listed=true
- count=1 for queried ref
- latest handoff_ref=`handoff:fbb4275f.live.smoke.1511`
- latest queue_status=`pending_nas_keeper_authorization`
- markdown_body_included=false
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?claim-dry-run=1976625b`:

- `data-office-nas-keeper-handoff-claim-dry-run-status="true"`
  - exists=true
  - controls=0
  - `data-office-nas-keeper-handoff-claim-dry-run="true"`
  - `data-office-nas-keeper-handoff-claim-claimed="false"`
  - `data-office-nas-keeper-handoff-claim-queue-mutation="false"`
  - `data-office-nas-keeper-handoff-claim-authorization-recording="false"`
  - `data-office-nas-keeper-handoff-claim-mac-relay-write="false"`
  - `data-office-nas-keeper-handoff-claim-actual-write="false"`
  - page body includes the safe handoff ref
  - page body includes `would_claim`

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The NAS Keeper handoff claim dry-run rung is complete. The dashboard now surfaces the dry-run claim envelope for the pending handoff while keeping the queue unchanged and every stronger NAS/relay/authorization/execution boundary closed.

## Next recommended rung

Continue to `nas_keeper_handoff_authorization_record` only if bounded write authority remains acceptable.

This next rung would be the first queue-mutation/authorization-recording boundary. It should still not execute Mac relay writes, write NAS files, mount NAS on the VPS, expose credentials, start watcher/cron/daemon processes, restart the gateway, or expose public authority.

Last updated: 2026-05-21 15:30 KST
