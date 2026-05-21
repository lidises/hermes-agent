# AI Office adapter dispatch record — 2026-05-21

## Scope

User approved continuing from controlled target mutation into the next bounded write rung.

This pass hardened the live `/office` regression for the protected manual adapter dispatch record panel and exercised the existing protected controlled adapter-dispatch safe-ref POST/GET routes on the private VPS.

## Boundary

Allowed:

- Keep `ManualAdapterDispatchRecordStatusPanel` live-visible before the legacy diagnostic gate.
- Add cumulative uniqueness regression for the adapter dispatch panel.
- Use the existing protected adapter dispatch POST route against an existing bounded target mutation record.
- Store only controlled adapter dispatch metadata and safe refs.
- Set `adapter_dispatch_created=true` only inside the controlled adapter dispatch record lane.
- Read back the stored adapter dispatch record through the protected GET route.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Adapter binding.
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

- `0f5ab02d test(office): harden adapter dispatch panel placement`

Files changed:

- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert `ManualAdapterDispatchRecordStatusPanel` has no second duplicate occurrence.

Note: the adapter dispatch panel was already live-visible and unique before this slice, so the added regression passed immediately. No production source change was required for visibility.

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

- Synced both worktrees to `0f5ab02d`:
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

- `http://100.122.57.85:8765/office?adapter-dispatch=0f5ab02d`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing target mutation source:

- `target_mutation_ref=targetmut-416c45fb-live-smoke-1422`

New adapter dispatch refs:

- `adapter_dispatch_ref=adapterdispatch-0f5ab02d-live-smoke-1432`
- `adapter_ref=adapter-0f5ab02d-safe-noop-adapter`

POST `/api/office/controlled-mutation/manual-adapter-dispatch-record`:

- unauth=401
- stored=true
- dto.mode=`stored_manual_adapter_dispatch_record`
- target_mutation_ref=`targetmut-416c45fb-live-smoke-1422`
- adapter_dispatch_ref=`adapterdispatch-0f5ab02d-live-smoke-1432`
- adapter_ref=`adapter-0f5ab02d-safe-noop-adapter`
- adapter_dispatch_created=true
- adapter_dispatch_result=`safe_adapter_dispatch_marker_written`
- target_mutation_created=true
- kanban_mutation_created=false
- nas_save_created=false
- rollback_executed=false
- real_dispatch_execution_enabled=false
- unsafe extra sentinel was not echoed
- raw adapter payload / credential fields were not included in the DTO

GET `/api/office/controlled-mutation/manual-adapter-dispatch-record-status?adapter_dispatch_ref=adapterdispatch-0f5ab02d-live-smoke-1432`:

- unauth=401
- mode=`stored_manual_adapter_dispatch_records_readback`
- adapter_dispatch_record_count=1 for the queried ref
- latest ref=`adapterdispatch-0f5ab02d-live-smoke-1432`
- latest adapter_dispatch_created=true
- capabilities.adapter_dispatch_enabled=true
- risky capabilities false:
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

Browser DOM at `/office?adapter-dispatch=0f5ab02d`:

- `data-office-manual-adapter-dispatch-record-status="true"`
  - exists=true
  - controls=0
  - count=6 global profile-scoped records
  - page body includes the safe adapter dispatch smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual adapter dispatch path has now crossed the controlled safe-ref adapter dispatch write rung. An adapter dispatch record was written on the private VPS and read back. This sets `adapter_dispatch_created=true` only in the controlled adapter dispatch record lane; it did not mutate Kanban, write NAS, execute rollback, create watchers/cron, restart the gateway, or expose public authority.

## Next recommended rung

Continue to `manual_kanban_mutation_record` only if the next prompt keeps bounded write approval and accepts crossing from controlled adapter dispatch into controlled Kanban-mutation metadata.

This next rung should still be constrained to a controlled safe-ref Kanban mutation record. NAS/VPS mutation beyond the controlled record, service/git/credential/public authority, watcher/cron, gateway restart, direct VPS NAS authority, and public exposure should remain closed unless specifically approved.

Last updated: 2026-05-21 14:36 KST
