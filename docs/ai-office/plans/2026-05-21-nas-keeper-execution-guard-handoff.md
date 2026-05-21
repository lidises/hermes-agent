# AI Office NAS keeper execution-from-preview guarded failure — 2026-05-21

## Scope

User approved continuing from Mac relay execution payload preview into the next bounded rung.

This pass added a live display-only execution-from-preview guard smoke surface. It calls the existing protected execution-from-preview bridge with safe refs only while the VPS has no Mac relay root configured. The expected result is a safe guarded failure: `executed=false`, `written=false`, `dto=null`, and `mac_relay_root_not_configured`.

## Boundary

Allowed:

- Read/use the already previewed authorized handoff refs.
- POST one bounded protected execution-from-preview request.
- Verify the route remains guarded because no Mac relay root is configured on VPS.
- Render the guarded failure live-visible with stable DOM hooks and no controls.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.

Still not done / still closed:

- Mac relay write execution.
- Actual NAS file write.
- Direct VPS NAS authority, mount, credentials, raw path, or real write.
- Real NAS execution.
- Queue state recording after write.
- Watcher/cron/daemon activation.
- Public exposure changes.
- Gateway restart.
- Real external dispatch execution.

## Code/test changes

Commit:

- `e581bc36 feat(office): surface nas keeper execution guard`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Added `NasKeeperExecutionFromPreviewGuardedFailureStatusPanel`.
  - Added state/effect to call `api.executeOfficeControlledMutationNasKeeperExecutionFromPreview` after payload preview evidence exists.
  - The effect sends safe refs only and expects the protected route to fail safely when `HERMES_AI_OFFICE_MAC_RELAY_NAS_ROOT` is not configured.
  - Rendered the panel live-visible after the payload preview panel and before legacy diagnostic lanes.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Added display-only guarded failure panel render test.
  - Extended live-visible placement/uniqueness regression to include `NasKeeperExecutionFromPreviewGuardedFailureStatusPanel`.

## Local verification

- RED:
  - focused panel test failed first because `NasKeeperExecutionFromPreviewGuardedFailureStatusPanel` was missing.
- GREEN:
  - focused panel test passed.
  - placement/uniqueness test passed.
- Backend:
  - `py_compile` passed for `hermes_cli/office_controlled_mutation.py` and `hermes_cli/web_server.py`.
  - Focused controlled-mutation backend tests passed: `31 passed`.
- Frontend:
  - combined `src/lib/api.test.ts` + `src/pages/OfficePage.rpg.test.tsx`: `152 passed`.
  - `npm run build` passed with existing Vite large chunk warning only.
- `git diff --check` passed.
- added-line sentinel scan found no new raw path/token/provider sentinels.

## VPS deploy

- Synced both VPS worktrees to latest code commit `e581bc36`:
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

- `http://100.122.57.85:8765/office?execution-guard=e581bc36`

Protected route called with `X-Hermes-Session-Token` from the SPA shell.

Payload:

- `handoff_ref=handoff:fbb4275f.live.smoke.1511`
- `relay_execution_ref=relayexec-e581bc36-live-guard-1617`
- `nas_keeper_ref=keeper:manual_review`
- `relay_node_ref=relay:mac_relay_safe`
- `relay_authorized_by=operator.ai_office`
- `relay_authorized_at=2026-05-21T07:17:00Z`

POST `/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-from-preview`:

- unauth=401
- authenticated HTTP 200
- executed=false
- written=false
- dto=null
- errors=`mac_relay_root:mac_relay_root_not_configured`
- invalid extra raw path sentinel was not echoed
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?execution-guard=e581bc36`:

- `data-office-nas-keeper-execution-from-preview-guard-status="true"`
  - exists=true
  - controls=0
  - `data-office-nas-keeper-execution-from-preview-guard-executed="false"`
  - `data-office-nas-keeper-execution-from-preview-guard-written="false"`
  - `data-office-nas-keeper-execution-from-preview-guard-root-configured="false"`
  - `data-office-nas-keeper-execution-from-preview-guard-dto-present="false"`
  - page body includes `guarded failure`
  - page body includes `mac_relay_root_not_configured`

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The execution-from-preview guarded failure rung is complete. The dashboard now proves the protected execution bridge remains closed on the VPS when no Mac relay root is configured, while surfacing the closed-boundary evidence without executable controls.

## Next recommended rung

Continue to `mac_relay_execution_state_failed_record` / guarded failure evidence record only if bounded metadata-write authority remains acceptable.

This next rung should record the failed guard result as a safe queue execution-state/evidence record (`execution_status=failed_guarded`, safe summary/evidence refs only) without Mac relay write execution, actual NAS write, VPS NAS mount/credentials, public exposure, watcher/cron/daemon processes, gateway restart, or real external dispatch.

Last updated: 2026-05-21 16:21 KST
