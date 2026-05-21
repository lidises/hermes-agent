# AI Office RPG-focused view + Mac-local relay authority preflight — 2026-05-21

## Scope

User said the Office section has accumulated too much material and that they do not need to personally see all of it. User asked to make the Office section show only the necessary parts, centered on the RPG visualizer, then continue the recommended next step with bounded write authority.

This pass did both in one bounded slice:

1. Made the `/office` page visually prioritize the RPG visualizer and collapsed the accumulated technical evidence/approval ladder into a closed details drawer.
2. Added the next recommended rung: `mac_local_relay_root_authority_preflight` / Mac-local relay authority readiness preflight, display-only and read-only.

## Boundary

Allowed:

- Frontend layout change for `/office`.
- Keep existing technical status panels available but hidden by default behind a closed details drawer.
- Add a display-only Mac-local relay root authority preflight panel.
- Build/deploy private VPS dashboard and restart only `hermes-agent-dashboard.service`.

Still not done / still closed:

- Mac relay write execution.
- Actual NAS file write.
- Direct VPS NAS authority, mount, credentials, raw path, or real write.
- Credential or raw NAS path display.
- Real NAS execution.
- Watcher/cron/daemon activation.
- Public exposure changes.
- Gateway restart.
- Real external dispatch execution.

## Code/test changes

Code commit:

- `0143b3f0 feat(office): focus rpg visualizer view`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Added `data-office-rpg-focused-shell="true"` to the main Office view shell.
  - Added `OfficeVisualizerEvidenceDrawer`, a closed-by-default details drawer for the accumulated technical evidence/approval ladder.
  - Moved the existing NAS Keeper/operator/controlled-mutation status panels into the drawer so the main page is not flooded.
  - Added `MacLocalRelayRootAuthorityPreflightPanel`, shown outside the drawer as the next relevant status.
  - The preflight panel states the Mac-side requirement: `HERMES_AI_OFFICE_MAC_RELAY_NAS_ROOT` must be configured on the Mac-local relay runtime, but no value/credential/raw path is displayed.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Added source-level regression ensuring technical evidence is collapsed behind the RPG visualizer.
  - Added preflight panel render regression ensuring read-only, no credentials, no write controls.
  - Kept graduated status panels before the legacy diagnostic gate for stable smoke hooks.

## Local verification

- RED:
  - RPG-focused drawer regression failed because the drawer did not exist.
  - Mac-local relay preflight test failed because the panel did not exist.
- GREEN:
  - Focused drawer/preflight/placement tests passed.
- Backend:
  - `py_compile` passed for `hermes_cli/office_controlled_mutation.py` and `hermes_cli/web_server.py`.
  - Focused NAS Keeper execution-state/readback tests passed: `8 passed`.
- Frontend:
  - `src/lib/api.test.ts` + `src/pages/OfficePage.rpg.test.tsx`: `156 passed`.
  - `npm run build` passed with existing Vite large chunk warning only.
- `git diff --check` passed.
- Added-line sentinel scan found no new raw path/token/provider sentinels.

## VPS deploy

- Synced both VPS worktrees to latest code commit `0143b3f0`:
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

## VPS smoke

Browser DOM at `/office?rpg-focus=0143b3f0`:

- `data-office-rpg-focused-shell="true"`: exists=true
- `data-office-rpg-visual-map="true"`: exists=true
- `data-office-rpg-map-svg="true"`: exists=true
- character sprites=8
- character bubbles=8
- `data-office-visualizer-evidence-drawer="true"`: exists=true
- evidence drawer open=false
- `data-office-mac-local-relay-root-preflight="true"`: exists=true
- preflight ready=false
- preflight read_only=true
- preflight vps_nas_authority=false
- raw leak sentinels absent
- browser console messages/errors after smoke: 0

Vision smoke:

- First screen is now centered on `AI Office RPG Visualizer`.
- Technical/evidence/approval-ladder material is no longer visually flooding the main page; it is summarized or collapsed.

Mac relay root environment smoke:

- VPS environment check showed `HERMES_AI_OFFICE_MAC_RELAY_NAS_ROOT` is not configured in the checked environment.
- Value was not echoed.

## Result

The Office page is now user-facing as an RPG visualizer-first page. The accumulated evidence ladder remains accessible for debugging/smoke but is closed by default. The next recommended Mac-local relay authority preflight rung is displayed as read-only and explicitly keeps actual writes and direct VPS NAS authority closed.

## Next recommended rung

Continue to `mac_local_relay_root_authority_config_contract` / Mac-local relay authority configuration contract.

This should define the safe contract for how the Mac-local runtime will prove the relay root exists without exposing the value. It should still be read-only/contract-first and must not create credentials, expose paths, execute a write, mount NAS on the VPS, or start watcher/cron/daemon processes.

Last updated: 2026-05-21 17:18 KST
