# AI Office Kanban mutation record — 2026-05-21

## Scope

User approved continuing from controlled adapter dispatch into the next bounded write rung.

This pass hardened the live `/office` regression for the protected manual Kanban mutation record panel and exercised the existing protected controlled Kanban-mutation safe-ref POST/GET routes on the private VPS.

## Boundary

Allowed:

- Keep `ManualKanbanMutationRecordStatusPanel` live-visible before the legacy diagnostic gate.
- Add cumulative uniqueness regression for the Kanban mutation panel.
- Use the existing protected Kanban mutation POST route against an existing bounded adapter dispatch record.
- Store only controlled Kanban mutation metadata and safe refs.
- Set `kanban_mutation_created=true` only inside the controlled Kanban mutation record lane.
- Read back the stored Kanban mutation record through the protected GET route.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- NAS save/write.
- Rollback execution.
- VPS file/service/git mutation beyond the approved dashboard deploy/docs sync.
- Watcher/cron/daemon activation.
- Systemd unit or cron file creation.
- Direct VPS NAS authority, mount, credentials, or write.
- Public exposure changes.
- Gateway restart.
- Real external dispatch execution.

## Code/test change

Commit:

- `2eda4ff3 test(office): harden kanban mutation panel placement`

Files changed:

- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert `ManualKanbanMutationRecordStatusPanel` has no second duplicate occurrence.

Note: the Kanban mutation panel was already live-visible and unique before this slice, so the added regression passed immediately. No production source change was required for visibility.

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

- Synced both worktrees to `2eda4ff3`:
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

- `http://100.122.57.85:8765/office?kanban-mutation=2eda4ff3`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing adapter dispatch source:

- `adapter_dispatch_ref=adapterdispatch-0f5ab02d-live-smoke-1432`

New Kanban mutation refs:

- `kanban_mutation_ref=kanbanmut-2eda4ff3-live-smoke-1444`
- `kanban_card_ref=card-2eda4ff3-safe-marker-card`

POST `/api/office/controlled-mutation/manual-kanban-mutation-record`:

- unauth=401
- stored=true
- dto.mode=`stored_manual_kanban_mutation_record`
- adapter_dispatch_ref=`adapterdispatch-0f5ab02d-live-smoke-1432`
- kanban_mutation_ref=`kanbanmut-2eda4ff3-live-smoke-1444`
- kanban_card_ref=`card-2eda4ff3-safe-marker-card`
- kanban_mutation_created=true
- kanban_mutation_result=`safe_kanban_marker_written`
- adapter_dispatch_created=true
- nas_save_created=false
- rollback_executed=false
- real_dispatch_execution_enabled=false
- unsafe extra sentinel was not echoed
- raw Kanban payload / card body / credential fields were not included in the DTO

GET `/api/office/controlled-mutation/manual-kanban-mutation-record-status?kanban_mutation_ref=kanbanmut-2eda4ff3-live-smoke-1444`:

- unauth=401
- mode=`stored_manual_kanban_mutation_records_readback`
- kanban_mutation_record_count=1 for the queried ref
- latest ref=`kanbanmut-2eda4ff3-live-smoke-1444`
- latest kanban_mutation_created=true
- capabilities.kanban_mutation_enabled=true
- risky capabilities false:
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

Browser DOM at `/office?kanban-mutation=2eda4ff3`:

- `data-office-manual-kanban-mutation-record-status="true"`
  - exists=true
  - controls=0
  - count=5 global profile-scoped records
  - page body includes the safe Kanban mutation smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual Kanban mutation path has now crossed the controlled safe-ref Kanban mutation write rung. A Kanban mutation record was written on the private VPS and read back. This sets `kanban_mutation_created=true` only in the controlled Kanban mutation record lane; it did not save/write NAS, execute rollback, create watchers/cron, restart the gateway, or expose public authority.

## Next recommended rung

Continue to `manual_nas_save_record` only if the next prompt keeps bounded write approval and accepts crossing from controlled Kanban mutation into controlled NAS-save metadata.

This next rung should still be constrained to a controlled safe-ref NAS save record. Direct VPS NAS authority/mount/credentials, public exposure, service/git/credential authority, watcher/cron, gateway restart, and real external dispatch should remain closed unless specifically approved.

Last updated: 2026-05-21 14:48 KST
