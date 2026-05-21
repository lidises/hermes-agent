# AI Office NAS keeper handoff record — 2026-05-21

## Scope

User approved continuing from controlled NAS save into the next bounded write rung.

This pass hardened the live `/office` regression for the protected manual NAS keeper handoff record panel and exercised the existing protected controlled NAS-keeper/Mac-relay handoff safe-ref POST/GET routes on the private VPS.

## Boundary

Allowed:

- Keep `ManualNasKeeperHandoffRecordStatusPanel` live-visible before the legacy diagnostic gate.
- Add cumulative uniqueness regression for the NAS keeper handoff panel.
- Use the existing protected NAS keeper handoff POST route against an existing bounded NAS save record.
- Store only controlled handoff/queue metadata and safe refs.
- Append a pending NAS keeper/Mac relay handoff queue item.
- Set `nas_keeper_handoff_queued=true` only inside the controlled handoff record lane.
- Read back the stored handoff record through the protected GET route.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- NAS keeper authorization.
- Mac relay write execution.
- Direct VPS NAS authority, mount, credentials, raw path, or real write.
- Real NAS execution.
- Rollback execution.
- VPS file/service/git mutation beyond the approved dashboard deploy/docs sync.
- Watcher/cron/daemon activation.
- Systemd unit or cron file creation.
- Public exposure changes.
- Gateway restart.
- Real external dispatch execution.

## Code/test change

Commit:

- `fbb4275f test(office): harden nas keeper handoff panel placement`

Files changed:

- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert `ManualNasKeeperHandoffRecordStatusPanel` has no second duplicate occurrence.

Note: the NAS keeper handoff panel was already live-visible and unique before this slice, so the added regression passed immediately. No production source change was required for visibility.

## Local verification

- Backend py_compile:
  - `hermes_cli/office_controlled_mutation.py`
  - `hermes_cli/web_server.py`
  - passed
- Focused backend tests:
  - `tests/hermes_cli/test_office_controlled_mutation_manual_approval_recording_draft.py`
  - `31 passed`
- Frontend tests in `web/`:
  - focused placement test passed
  - `src/lib/api.test.ts`
  - `src/pages/OfficePage.rpg.test.tsx`
  - `145 passed`
- `npm run build` in `web/`:
  - passed
  - existing Vite large chunk warning only
- `git diff --check`:
  - passed
- added-line sentinel scan:
  - no newly added raw path/token/provider sentinels

## VPS deploy

- Synced both worktrees to `fbb4275f`:
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

- `http://100.122.57.85:8765/office?nas-keeper-handoff=fbb4275f`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing NAS save source:

- `nas_save_ref=nassave-c40a2620-live-smoke-1501`

New handoff refs:

- `handoff_ref=handoff:fbb4275f.live.smoke.1511`
- `relay_request_ref=relayreq:fbb4275f.safe2`
- `write_ref=write:fbb4275f.safe2`
- `package_ref=package:fbb4275f.safe2`
- `target_vault_ref=vault:ai_office_safe_notes`
- `nas_keeper_ref=keeper:manual_review`
- `relay_node_ref=relay:mac_relay_safe`

POST `/api/office/controlled-mutation/manual-nas-keeper-handoff-record`:

- unauth=401
- queued=true
- dto.mode=`manual_nas_keeper_handoff_queued`
- nas_save_ref=`nassave-c40a2620-live-smoke-1501`
- handoff_ref=`handoff:fbb4275f.live.smoke.1511`
- queue_status=`pending_nas_keeper_authorization`
- nas_save_created=true
- nas_keeper_handoff_queued=true
- direct_vps_nas_write_enabled=false
- vps_direct_nas_authority_enabled=false
- mac_relay_write_enabled=false
- actual_nas_write_enabled=false
- real_nas_execution_enabled=false
- real_dispatch_execution_enabled=false
- unsafe extra sentinel was not echoed
- raw NAS path / credential / raw markdown extras were not included in the DTO

GET `/api/office/controlled-mutation/manual-nas-keeper-handoff-record-status?handoff_ref=handoff%3Afbb4275f.live.smoke.1511`:

- unauth=401
- mode=`manual_nas_keeper_handoff_records_readback`
- nas_keeper_handoff_record_count=1 for the queried ref
- latest handoff_ref=`handoff:fbb4275f.live.smoke.1511`
- latest nas_keeper_handoff_queued=true
- latest queue_status=`pending_nas_keeper_authorization`
- capabilities.nas_keeper_handoff_enabled=true
- capabilities.queue_append_enabled=true
- risky capabilities false:
  - direct_vps_nas_write_enabled=false
  - vps_direct_nas_authority_enabled=false
  - mac_relay_write_enabled=false
  - actual_nas_write_enabled=false
  - real_nas_execution_enabled=false
  - real_dispatch_execution_enabled=false
  - watcher_enabled=false
  - cron_enabled=false
  - dispatch_enabled=false
  - authority_adapter_binding_enabled=false
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?nas-keeper-handoff=fbb4275f`:

- `data-office-manual-nas-keeper-handoff-record-status="true"`
  - exists=true
  - controls=0
  - count=3 global profile-scoped records
  - page body includes the safe handoff smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Note

The handoff queue validator rejects markdown bodies containing raw-marker language. The first smoke attempt intentionally used too-strong prose (`No real NAS execution requested`) and was rejected with `markdown_body/raw_marker_detected`; the successful smoke used a minimal safe body: `Safe handoff smoke body with refs only.`

## Result

The manual NAS keeper handoff path has now crossed the controlled safe-ref queue write rung. A NAS keeper/Mac relay handoff record and queue item were written on the private VPS and read back. This sets `nas_keeper_handoff_queued=true` only in the controlled handoff record lane; it did not authorize a keeper, execute a Mac relay write, create direct VPS NAS authority, perform a real NAS write, execute rollback, create watchers/cron, restart the gateway, or expose public authority.

## Next recommended rung

Continue to `nas_keeper_handoff_claim_dry_run` or the equivalent queue readback/claim dry-run visibility rung only if the next prompt keeps bounded authority.

This next rung should still be dry-run/readback only. NAS keeper authorization, Mac relay execution, direct VPS NAS mount/credentials, real NAS execution, public exposure, service/git/credential authority beyond the controlled record, watcher/cron, gateway restart, and real external dispatch should remain closed unless specifically approved.

Last updated: 2026-05-21 15:17 KST
