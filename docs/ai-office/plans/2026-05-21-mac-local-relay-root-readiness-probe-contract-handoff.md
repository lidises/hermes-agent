# AI Office Mac-local relay root readiness probe contract — 2026-05-21

## Scope

User approved continuing from the Mac-local relay authority configuration contract through the next recommended rung, with bounded write authority. This rung remains contract-first/read-only: it defines the exact sanitized payload shape that a future Mac-local readiness probe should return before any actual NAS write can be armed.

## Boundary

Allowed in this slice:

- Frontend display-only probe-contract panel.
- Keep `/office` RPG visualizer focused.
- Deploy private VPS dashboard and restart only `hermes-agent-dashboard.service`.

Still not done / still closed:

- Mac-local probe execution.
- Mac relay root configuration.
- Actual NAS file write.
- Mac relay write execution.
- Direct VPS NAS authority, mount, credentials, raw path, or real write.
- Credential or raw NAS path display.
- Watcher/cron/daemon activation.
- Public exposure changes.
- Gateway restart.
- Real external dispatch execution.

## Code/test changes

Code commit:

- `181d8819 feat(office): define mac relay probe contract`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Added `MacLocalRelayRootReadinessProbeContractPanel`.
  - Panel defines future sanitized proof payload fields:
    - `root_configured`
    - `root_readable`
    - `root_writable`
    - `safe_probe_ref`
    - `sanitized_root_label`
    - `redaction_policy_version`
    - `probe_errors`
    - `write_payload_included=false`
  - Stable hook: `data-office-mac-local-relay-root-readiness-probe-contract="true"`.
  - Explicit status: read-only, probe-executed=false, write-enabled=false, VPS NAS authority=false.
  - Panel is visible near the Mac-local authority preflight/config contract surfaces while technical evidence remains collapsed behind the drawer.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Added source-level placement regression.
  - Added render regression confirming sanitized proof shape only, with no root values, raw paths, credentials, or writable controls.

## Local verification

- RED:
  - Probe contract placement/render tests failed because the panel did not exist.
- GREEN:
  - Focused probe contract tests passed.
- Backend:
  - `py_compile` passed for `hermes_cli/office_controlled_mutation.py` and `hermes_cli/web_server.py`.
  - Focused NAS Keeper execution-state/readback tests passed: `8 passed`.
- Frontend:
  - `src/lib/api.test.ts` + `src/pages/OfficePage.rpg.test.tsx`: `158 passed`.
  - `npm run build` passed with existing Vite large chunk warning only.
- `git diff --check` passed.
- Added-line sentinel scan found no new raw path/token/provider sentinels.

## VPS deploy

- Synced both VPS worktrees to latest code commit `181d8819`:
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

## VPS smoke

Browser DOM at `/office?probe-contract=181d8819`:

- focusedShell=true
- visualMap=true
- mapSvg=true
- sprites=8
- evidence drawer open=false
- probe contract exists=true
- read_only=true
- probe_executed=false
- write_enabled=false
- vps_nas_authority=false
- fields=8
- root_configured/root_writable labels visible
- raw leak sentinels absent
- browser console messages/errors after smoke: 0

## Readiness estimate

Previous operational estimate for actual NAS write readiness was about 42% after config contract. This rung completes the proof-shape contract, so readiness increases modestly to about 50% operationally. The remaining blockers are still the implementation/execution gates, not the UI contract gates.

## Next recommended rung

Continue to `mac_local_relay_root_probe_implementation` / Mac-local relay root probe implementation.

This should implement a Mac-local read-only probe that returns the sanitized contract shape without executing a NAS write:

- configured/readable/writable booleans from the Mac-local runtime,
- safe probe ref,
- sanitized root label only,
- redaction policy version,
- safe enum errors only,
- no raw path, no credential, no write payload, no watcher/cron/daemon, no VPS NAS mount.

Only after that probe passes can a later rung arm/review a one-shot actual NAS write payload.

Last updated: 2026-05-21 17:47 KST
