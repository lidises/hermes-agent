# AI Office Mac-local relay authority config contract — 2026-05-21

## Scope

User approved continuing from the RPG-focused Office view and Mac-local relay authority preflight through the next recommended rung, with bounded write authority. Per the controlled-mutation ladder, this rung is still contract-first/read-only: it defines how the Mac-local runtime should prove relay-root readiness without exposing the value.

## Boundary

Allowed in this slice:

- Frontend display-only contract panel.
- Keep the Office page RPG visualizer focused.
- Deploy private VPS dashboard and restart only `hermes-agent-dashboard.service`.

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

- `16c4ecee feat(office): define mac relay authority contract`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Added `MacLocalRelayRootAuthorityConfigContractPanel`.
  - Panel defines the safe contract fields:
    - `masked_root_present`
    - `root_kind`
    - `read_probe_required`
    - `writable_probe_required`
    - `credential_value_visible=false`
    - `raw_nas_path_visible=false`
    - `vps_nas_mount_enabled=false`
    - `direct_vps_nas_write_enabled=false`
  - Panel has stable hook `data-office-mac-local-relay-root-config-contract="true"`.
  - Panel explicitly marks read-only, root-value-visible=false, write-enabled=false, and VPS NAS authority=false.
  - Panel is shown outside the evidence drawer beside the Mac-local preflight surface, preserving the RPG-focused page.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Added source-level regression confirming the config contract panel is placed in the focused shell.
  - Added render regression confirming no root values, paths, credentials, or writable controls are projected.

## Local verification

- RED:
  - Config contract placement/render tests failed because the panel did not exist.
- GREEN:
  - Focused config contract tests passed.
- Backend:
  - `py_compile` passed for `hermes_cli/office_controlled_mutation.py` and `hermes_cli/web_server.py`.
  - Focused NAS Keeper execution-state/readback tests passed: `8 passed`.
- Frontend:
  - `src/lib/api.test.ts` + `src/pages/OfficePage.rpg.test.tsx`: `157 passed`.
  - `npm run build` passed with existing Vite large chunk warning only.
- `git diff --check` passed.
- Added-line sentinel scan found no new raw path/token/provider sentinels.

## VPS deploy

- Synced both VPS worktrees to latest code commit `16c4ecee`:
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

Browser DOM at `/office?mac-contract=16c4ecee`:

- focusedShell=true
- visualMap=true
- mapSvg=true
- sprites=8
- evidence drawer open=false
- config contract exists=true
- config contract read_only=true
- root_value_visible=false
- write_enabled=false
- vps_nas_authority=false
- contract rows=8
- raw leak sentinels absent
- browser console messages/errors after smoke: 0

## Result

The Office page now keeps the RPG visualizer as the primary user-facing view while showing the next necessary Mac-local relay authority contract as a compact read-only surface. The contract defines what future readiness proof should look like, without exposing root values, raw paths, credentials, or enabling writes.

## Next recommended rung

Continue to `mac_local_relay_root_readiness_probe_contract` / Mac-local relay root readiness probe contract.

This should define the exact sanitized proof payload shape for a future Mac-local probe, still without executing a write:

- boolean root configured/readable/writable placeholders,
- safe probe ref,
- sanitized root label only,
- redaction policy version,
- no raw path, no credential, no write payload, no watcher/cron/daemon, no VPS NAS mount.

Last updated: 2026-05-21 17:34 KST
