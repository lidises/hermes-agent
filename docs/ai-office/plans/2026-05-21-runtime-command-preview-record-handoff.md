# AI Office runtime command preview record — 2026-05-21

## Scope

User approved continuing from manual dispatch-gate-open metadata into the next bounded write rung.

This pass hardened the live `/office` placement for the protected manual runtime command preview record panel and exercised the existing protected runtime-command-preview metadata/checksum-only POST/GET routes on the private VPS.

## Boundary

Allowed:

- Keep `ManualRuntimeCommandPreviewRecordStatusPanel` live-visible before the legacy diagnostic gate.
- Remove the duplicate legacy-only panel instance so the live surface has one canonical placement.
- Use the existing protected runtime command preview metadata/checksum-only POST route against an existing bounded dispatch-gate-open record.
- Read back the stored preview record through the protected GET route.
- Rebuild dashboard assets, deploy to the VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Runtime command body inclusion.
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

- `81a6215b feat(office): harden runtime command preview panel placement`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Removed the duplicate legacy-only `ManualRuntimeCommandPreviewRecordStatusPanel` placement.
  - The canonical panel remains live-visible before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES`.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert the runtime command preview panel has no second duplicate occurrence.

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

- Synced both worktrees to `81a6215b`:
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

- `http://100.122.57.85:8765/office?runtime-preview=81a6215b`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing dispatch gate source:

- `gate-8d774767-live-smoke-1255`

New preview metadata ref:

- `cmdpreview-81a6215b-live-smoke-1305`

POST `/api/office/controlled-mutation/manual-runtime-command-preview-record`:

- unauth=401
- stored=true
- dto.mode=`stored_manual_runtime_command_preview_record`
- dispatch_gate_ref=`gate-8d774767-live-smoke-1255`
- runtime_command_preview_ref=`cmdpreview-81a6215b-live-smoke-1305`
- runtime_command_preview_created=true
- runtime_command_preview_checksum_sha256 length=64
- runtime_command_included=false
- runtime_command_executed=false
- target_mutation_created=false
- kanban_mutation_created=false
- nas_save_created=false
- real_dispatch_execution_enabled=false
- unsafe extra sentinel was not echoed
- raw command fields were not included in the DTO

GET `/api/office/controlled-mutation/manual-runtime-command-preview-record-status?runtime_command_preview_ref=cmdpreview-81a6215b-live-smoke-1305`:

- unauth=401
- mode=`stored_manual_runtime_command_preview_records_readback`
- runtime_command_preview_record_count=1 for the queried ref
- latest ref=`cmdpreview-81a6215b-live-smoke-1305`
- capabilities.runtime_command_preview_enabled=true
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

Browser DOM at `/office?runtime-preview=81a6215b`:

- `data-office-manual-runtime-command-preview-record-status="true"`
  - exists=true
  - controls=0
  - count=10 global profile-scoped records
  - page body includes the safe preview smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual runtime command preview path has now crossed the bounded metadata/checksum-only write rung. A preview record was written on the private VPS and read back. This sets `runtime_command_preview_created=true` and stores a checksum only; it did not include a command body, execute a runtime command, dispatch adapters, write replay-store state, rollback, mutate targets, mutate Kanban, or write NAS.

## Next recommended rung

Continue to `manual_runtime_command_inclusion_record` only if the next prompt keeps bounded write approval.

This next rung may store a safe command-body reference record and checksum, but must still avoid shell body storage, runtime execution, adapter dispatch, replay-store write, rollback, target/Kanban/NAS/VPS mutation, service/git/credential/public authority, watcher/cron, gateway restart, and direct VPS NAS authority.

Last updated: 2026-05-21 13:08 KST
