# AI Office target mutation record — 2026-05-21

## Scope

User approved continuing from target mutation readiness into the next bounded write rung.

This pass hardened the live `/office` regression for the protected manual target mutation record panel and exercised the existing protected controlled target-mutation safe-ref POST/GET routes on the private VPS.

## Boundary

Allowed:

- Keep `ManualTargetMutationRecordStatusPanel` live-visible before the legacy diagnostic gate.
- Add cumulative uniqueness regression for the target mutation panel.
- Use the existing protected target mutation POST route against an existing bounded target readiness record.
- Store only controlled target mutation metadata and safe refs.
- Set `target_mutation_created=true` only inside the controlled target mutation record lane.
- Read back the stored target mutation record through the protected GET route.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Adapter binding or dispatch.
- Rollback execution.
- Kanban mutation.
- NAS save/write.
- VPS file/service/git mutation beyond the approved dashboard deploy/docs sync.
- Watcher/cron/daemon activation.
- Systemd unit or cron file creation.
- Direct VPS NAS authority, mount, credentials, or write.
- Public exposure changes.
- Gateway restart.
- Real external dispatch execution.

## Code/test change

Commit:

- `416c45fb test(office): harden target mutation panel placement`

Files changed:

- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert `ManualTargetMutationRecordStatusPanel` has no second duplicate occurrence.

Note: the target mutation panel was already live-visible and unique before this slice, so the added regression passed immediately. No production source change was required for visibility.

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

- Synced both worktrees to `416c45fb`:
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

- `http://100.122.57.85:8765/office?target-mutation=416c45fb`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing target readiness source:

- `target_mutation_readiness_ref=targetready-53b14ee1-live-smoke-1415`

New target mutation ref:

- `target_mutation_ref=targetmut-416c45fb-live-smoke-1422`

POST `/api/office/controlled-mutation/manual-target-mutation-record`:

- unauth=401
- stored=true
- dto.mode=`stored_manual_target_mutation_record`
- target_mutation_readiness_ref=`targetready-53b14ee1-live-smoke-1415`
- target_mutation_ref=`targetmut-416c45fb-live-smoke-1422`
- target_mutation_created=true
- target_mutation_result=`safe_target_marker_written`
- target_mutation_readiness_verified=true
- adapter_dispatch_created=false
- kanban_mutation_created=false
- nas_save_created=false
- real_dispatch_execution_enabled=false
- unsafe extra sentinel was not echoed
- raw target / credential fields were not included in the DTO

GET `/api/office/controlled-mutation/manual-target-mutation-record-status?target_mutation_ref=targetmut-416c45fb-live-smoke-1422`:

- unauth=401
- mode=`stored_manual_target_mutation_records_readback`
- target_mutation_record_count=1 for the queried ref
- latest ref=`targetmut-416c45fb-live-smoke-1422`
- latest target_mutation_created=true
- capabilities.target_mutation_enabled=true
- risky capabilities false:
  - adapter_dispatch_enabled=false
  - adapter_binding_enabled=false
  - kanban_mutation_enabled=false
  - nas_save_enabled=false
  - nas_write_enabled=false
  - rollback_execution_enabled=false
  - credential_access_enabled=false
  - public_exposure_enabled=false
  - real_dispatch_execution_enabled=false
  - service_restart_enabled=false
  - git_push_enabled=false
  - vps_file_change_enabled=false
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?target-mutation=416c45fb`:

- `data-office-manual-target-mutation-record-status="true"`
  - exists=true
  - controls=0
  - count=7 global profile-scoped records
  - page body includes the safe target mutation smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual target mutation path has now crossed the controlled safe-ref target mutation write rung. A target mutation record was written on the private VPS and read back. This sets `target_mutation_created=true` only in the controlled target mutation record lane; it did not dispatch adapters, mutate Kanban, write NAS, execute rollback, create watchers/cron, restart the gateway, or expose public authority.

## Next recommended rung

Continue to `manual_adapter_dispatch_record` only if the next prompt keeps bounded write approval and accepts crossing from controlled target mutation into adapter-dispatch metadata.

This next rung should still be constrained to a controlled safe-ref adapter dispatch record. Kanban/NAS/VPS mutation beyond the controlled record, service/git/credential/public authority, watcher/cron, gateway restart, direct VPS NAS authority, and public exposure should remain closed unless specifically approved.

Last updated: 2026-05-21 14:25 KST
