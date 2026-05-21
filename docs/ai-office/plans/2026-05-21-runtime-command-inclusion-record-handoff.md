# AI Office runtime command inclusion record — 2026-05-21

## Scope

User approved continuing from runtime-command preview metadata into the next bounded write rung.

This pass hardened the live `/office` placement for the protected manual runtime command inclusion record panel and exercised the existing protected runtime-command-inclusion safe body-ref/checksum-only POST/GET routes on the private VPS.

## Boundary

Allowed:

- Keep `ManualRuntimeCommandInclusionRecordStatusPanel` live-visible before the legacy diagnostic gate.
- Remove the duplicate legacy-only panel instance so the live surface has one canonical placement.
- Use the existing protected runtime command inclusion POST route against an existing bounded preview record.
- Store only safe command body refs and checksum metadata.
- Read back the stored inclusion record through the protected GET route.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Runtime command execution.
- Adapter binding or dispatch.
- Idempotency replay-store write.
- Rollback execution.
- Target mutation.
- Kanban mutation.
- NAS save/write.
- VPS file/service/git mutation beyond the approved dashboard deploy/docs sync.
- Watcher/cron/daemon activation.
- Systemd unit or cron file creation.
- Direct VPS NAS authority, mount, credentials, or write.
- Public exposure changes.
- Gateway restart.

## Code change

Commit:

- `2cedb274 feat(office): harden runtime command inclusion panel placement`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Removed the duplicate legacy-only `ManualRuntimeCommandInclusionRecordStatusPanel` placement.
  - The canonical panel remains live-visible before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES`.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert the runtime command inclusion panel has no second duplicate occurrence.

## Local verification

- Backend py_compile:
  - `hermes_cli/office_controlled_mutation.py`
  - `hermes_cli/web_server.py`
  - passed
- Focused backend tests:
  - `tests/hermes_cli/test_office_controlled_mutation_manual_approval_recording_draft.py`
  - `31 passed`
- Frontend tests in `web/`:
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

- Synced both worktrees to `2cedb274`:
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

- `http://100.122.57.85:8765/office?runtime-inclusion=2cedb274`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing preview source:

- `cmdpreview-81a6215b-live-smoke-1305`

New inclusion record ref:

- `cmd-2cedb274-live-smoke-1320`

POST `/api/office/controlled-mutation/manual-runtime-command-inclusion-record`:

- unauth=401
- stored=true
- dto.mode=`stored_manual_runtime_command_inclusion_record`
- runtime_command_preview_ref=`cmdpreview-81a6215b-live-smoke-1305`
- runtime_command_ref=`cmd-2cedb274-live-smoke-1320`
- runtime_command_included=true
- runtime_command_body_checksum_sha256 length=64
- runtime_command_executed=false
- target_mutation_created=false
- kanban_mutation_created=false
- nas_save_created=false
- real_dispatch_execution_enabled=false
- unsafe extra sentinel was not echoed
- shell command / credential fields were not included in the DTO

GET `/api/office/controlled-mutation/manual-runtime-command-inclusion-record-status?runtime_command_ref=cmd-2cedb274-live-smoke-1320`:

- unauth=401
- mode=`stored_manual_runtime_command_inclusion_records_readback`
- runtime_command_inclusion_record_count=1 for the queried ref
- latest ref=`cmd-2cedb274-live-smoke-1320`
- capabilities.runtime_command_included=true
- risky capabilities false:
  - runtime_command_execution_enabled=false
  - real_dispatch_execution_enabled=false
  - adapter_dispatch_enabled=false
  - target_mutation_enabled=false
  - kanban_mutation_enabled=false
  - nas_save_enabled=false
  - rollback_execution_enabled=false
  - credential_access_enabled=false
  - public_exposure_enabled=false
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?runtime-inclusion=2cedb274`:

- `data-office-manual-runtime-command-inclusion-record-status="true"`
  - exists=true
  - controls=0
  - count=10 global profile-scoped records
  - page body includes the safe inclusion smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual runtime command inclusion path has now crossed the bounded safe body-ref/checksum-only write rung. An inclusion record was written on the private VPS and read back. This sets `runtime_command_included=true` and stores a safe command-body reference shape plus checksum; it did not execute a runtime command, dispatch adapters, write replay-store state, rollback, mutate targets, mutate Kanban, or write NAS.

## Next recommended rung

Continue to `manual_runtime_command_execution_record` only if the next prompt keeps bounded write approval.

This next rung may set `runtime_command_executed=true` only for the approved noop probe lane and may write the idempotency replay metadata flag for that noop probe. It must still avoid adapter binding/dispatch, rollback execution, target/Kanban/NAS/VPS mutation, service/git/credential/public authority, watcher/cron, gateway restart, and direct VPS NAS authority.

Last updated: 2026-05-21 13:22 KST
