# AI Office target mutation readiness record — 2026-05-21

## Scope

User approved continuing from runtime-command noop execution into the next bounded write rung.

This pass hardened the live `/office` regression for the protected manual target mutation readiness record panel and exercised the existing protected target-mutation-readiness metadata-only POST/GET routes on the private VPS.

## Boundary

Allowed:

- Keep `ManualTargetMutationReadinessRecordStatusPanel` live-visible before the legacy diagnostic gate.
- Add cumulative uniqueness regression for the target readiness panel.
- Use the existing protected target readiness POST route against an existing bounded noop execution record.
- Store only readiness metadata and safe refs:
  - exact target allowlist ref
  - target ref
  - dry-run evidence ref
  - rollback-disable ref
  - readiness evidence refs
- Read back the stored target readiness record through the protected GET route.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Actual target mutation.
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
- Real target dispatch execution.

## Code/test change

Commit:

- `53b14ee1 test(office): harden target mutation readiness panel placement`

Files changed:

- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert `ManualTargetMutationReadinessRecordStatusPanel` has no second duplicate occurrence.

Note: the target readiness panel was already live-visible and unique before this slice, so the added regression passed immediately. No production source change was required for visibility.

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

- Synced both worktrees to `53b14ee1`:
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

- `http://100.122.57.85:8765/office?target-ready=53b14ee1`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing noop execution source:

- `runtime_execution_ref=exec-c9c4dd43-live-smoke-1405`

New target readiness refs:

- `target_mutation_readiness_ref=targetready-53b14ee1-live-smoke-1415`
- `target_ref=target-53b14ee1-noop-probe-target`
- `exact_target_allowlist_ref=allowlist-53b14ee1-exact-target`
- `dry_run_evidence_ref=dryrun-53b14ee1-noop-evidence`
- `rollback_disable_ref=rollback-53b14ee1-disabled`

POST `/api/office/controlled-mutation/manual-target-mutation-readiness-record`:

- unauth=401
- stored=true
- dto.mode=`stored_manual_target_mutation_readiness_record`
- runtime_execution_ref=`exec-c9c4dd43-live-smoke-1405`
- target_mutation_readiness_ref=`targetready-53b14ee1-live-smoke-1415`
- target_mutation_readiness_verified=true
- exact_target_allowlist_verified=true
- rollback_disable_verified=true
- dry_run_evidence_verified=true
- runtime_command_executed=true
- target_mutation_created=false
- adapter_dispatch_created=false
- kanban_mutation_created=false
- nas_save_created=false
- real_dispatch_execution_enabled=false
- unsafe extra sentinel was not echoed
- raw target / credential fields were not included in the DTO

GET `/api/office/controlled-mutation/manual-target-mutation-readiness-record-status?target_mutation_readiness_ref=targetready-53b14ee1-live-smoke-1415`:

- unauth=401
- mode=`stored_manual_target_mutation_readiness_records_readback`
- target_mutation_readiness_record_count=1 for the queried ref
- latest ref=`targetready-53b14ee1-live-smoke-1415`
- latest target_mutation_readiness_verified=true
- capabilities.target_mutation_readiness_enabled=true
- risky capabilities false:
  - target_mutation_enabled=false
  - adapter_dispatch_enabled=false
  - adapter_binding_enabled=false
  - kanban_mutation_enabled=false
  - nas_save_enabled=false
  - rollback_execution_enabled=false
  - credential_access_enabled=false
  - public_exposure_enabled=false
  - real_dispatch_execution_enabled=false
  - service_restart_enabled=false
  - git_push_enabled=false
  - vps_file_change_enabled=false
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?target-ready=53b14ee1`:

- `data-office-manual-target-mutation-readiness-record-status="true"`
  - exists=true
  - controls=0
  - count=9 global profile-scoped records
  - page body includes the safe target readiness smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual target mutation readiness path has now crossed the bounded metadata-only write rung. A readiness record was written on the private VPS and read back. This verifies exact-target/readiness refs after noop execution, but does not mutate the target and does not dispatch adapters, rollback, mutate Kanban, or write NAS.

## Next recommended rung

Continue to `manual_target_mutation_record` only if the next prompt keeps bounded write approval and explicitly accepts crossing from readiness into target mutation metadata.

This next rung should still be constrained to a controlled safe-ref target mutation record. Adapter dispatch, Kanban/NAS/VPS mutation beyond the controlled record, service/git/credential/public authority, watcher/cron, gateway restart, and direct VPS NAS authority should remain closed unless specifically approved.

Last updated: 2026-05-21 14:18 KST
