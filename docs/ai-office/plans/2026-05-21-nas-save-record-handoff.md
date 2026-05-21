# AI Office NAS save record — 2026-05-21

## Scope

User approved continuing from controlled Kanban mutation into the next bounded write rung.

This pass hardened the live `/office` regression for the protected manual NAS save record panel and exercised the existing protected controlled NAS-save safe-ref POST/GET routes on the private VPS.

## Boundary

Allowed:

- Keep `ManualNasSaveRecordStatusPanel` live-visible before the legacy diagnostic gate.
- Add cumulative uniqueness regression for the NAS save panel.
- Use the existing protected NAS save POST route against an existing bounded Kanban mutation record.
- Store only controlled NAS save metadata and safe refs.
- Set `nas_save_created=true` only inside the controlled NAS save record lane.
- Read back the stored NAS save record through the protected GET route.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Direct VPS NAS authority, mount, credentials, path, or real write.
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

- `c40a2620 test(office): harden nas save panel placement`

Files changed:

- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert `ManualNasSaveRecordStatusPanel` has no second duplicate occurrence.

Note: the NAS save panel was already live-visible and unique before this slice, so the added regression passed immediately. No production source change was required for visibility.

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

- Synced both worktrees to `c40a2620`:
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

- `http://100.122.57.85:8765/office?nas-save=c40a2620`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing Kanban mutation source:

- `kanban_mutation_ref=kanbanmut-2eda4ff3-live-smoke-1444`

New NAS save refs:

- `nas_save_ref=nassave-c40a2620-live-smoke-1501`
- `nas_note_ref=nasnote-c40a2620-safe-note`

POST `/api/office/controlled-mutation/manual-nas-save-record`:

- unauth=401
- stored=true
- dto.mode=`stored_manual_nas_save_record`
- kanban_mutation_ref=`kanbanmut-2eda4ff3-live-smoke-1444`
- nas_save_ref=`nassave-c40a2620-live-smoke-1501`
- nas_note_ref=`nasnote-c40a2620-safe-note`
- nas_save_created=true
- nas_save_result=`safe_nas_save_marker_written`
- kanban_mutation_created=true
- vps_direct_nas_authority_enabled=false
- real_nas_execution_enabled=false
- vps_file_change_created=false
- service_restart_created=false
- git_push_created=false
- real_dispatch_execution_enabled=false
- unsafe extra sentinel was not echoed
- raw markdown body / raw NAS path / raw NAS payload / credential fields were not included in the DTO

GET `/api/office/controlled-mutation/manual-nas-save-record-status?nas_save_ref=nassave-c40a2620-live-smoke-1501`:

- unauth=401
- mode=`stored_manual_nas_save_records_readback`
- nas_save_record_count=1 for the queried ref
- latest ref=`nassave-c40a2620-live-smoke-1501`
- latest nas_save_created=true
- latest real_nas_execution_enabled=false
- capabilities.nas_save_enabled=true
- risky capabilities false:
  - vps_direct_nas_authority_enabled=false
  - real_nas_execution_enabled=false
  - rollback_execution_enabled=false
  - credential_access_enabled=false
  - public_exposure_enabled=false
  - real_dispatch_execution_enabled=false
  - service_restart_enabled=false
  - git_push_enabled=false
  - vps_file_change_enabled=false
  - watcher_or_cron_enabled=false
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?nas-save=c40a2620`:

- `data-office-manual-nas-save-record-status="true"`
  - exists=true
  - controls=0
  - count=4 global profile-scoped records
  - page body includes the safe NAS save smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual NAS save path has now crossed the controlled safe-ref NAS save write rung. A NAS save record was written on the private VPS and read back. This sets `nas_save_created=true` only in the controlled NAS save record lane; it did not create direct VPS NAS authority, perform a real NAS write, execute rollback, create watchers/cron, restart the gateway, or expose public authority.

## Next recommended rung

Continue to `manual_nas_keeper_handoff_record` only if the next prompt keeps bounded write approval and accepts crossing from controlled NAS save into NAS-keeper/Mac-relay handoff queue metadata.

This next rung should still be constrained to a controlled safe-ref handoff record and queue item. Direct VPS NAS mount/credentials, real NAS execution, public exposure, service/git/credential authority beyond the controlled record, watcher/cron, gateway restart, and real external dispatch should remain closed unless specifically approved.

Last updated: 2026-05-21 15:04 KST
