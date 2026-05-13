# AI Office RPG Visualizer VPS deploy and smoke

Date: 2026-05-13 20:58 KST

## Summary

The RPG Visualizer commit `ebca3a3c` was deployed to the dedicated VPS dashboard worktree and `hermes-agent-dashboard.service` was restarted. Gateway/core runtime was not changed or restarted.

## Scope

- Dashboard worktree only: `/home/hermes/.hermes/ai-office-dashboard`.
- Target commit: `ebca3a3c feat(office): add RPG visualizer map`.
- Service restarted: `hermes-agent-dashboard.service` only.
- Service explicitly left untouched: `hermes-gateway.service`.

## Deploy steps performed

- Read-only preflight confirmed dashboard worktree, service working directory, active dashboard/gateway services, and Tailscale/private listener posture.
- Fetched `origin/main` in the dashboard worktree.
- Reset dashboard worktree to `ebca3a3c`.
- VPS does not currently expose `npm` for the restricted `hermes` user, so VPS frontend `npm test`/`npm run build` could not run there.
- Used the locally verified `hermes_cli/web_dist` build artifact fallback and synced it into the VPS dashboard worktree.
- Restarted `hermes-agent-dashboard.service` only.

## Verification

Local source verification before deploy:

```text
npm test -- --run src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx
# 2 files passed, 71 tests passed

npm run build
# passed; existing Vite large chunk warning only

npm run lint
# exit 0; existing unrelated warnings remain

git diff --check
# passed
```

VPS post-deploy verification:

```text
Dashboard worktree HEAD: ebca3a3c
Dashboard worktree status: clean on main
hermes-agent-dashboard.service: active
hermes-gateway.service: active
Private /office HTTP: 200
Private /api/status HTTP: 200
Dashboard listener: 100.122.57.85:8765
Gateway listener: 100.122.57.85:8766
Public IPv4 :8765 probe: 000 timeout/refused/unreachable
Public IPv6 :8765 probe: 000 refused/unreachable
```

Browser smoke on private `/office?v=ebca3a3c`:

```text
RPG map: true
RPG entities: 42
Fallback rows: 42
Filters: 4
Jump targets: 5
Inspector: true
Forms: 0
Mutation-capable buttons: none
Raw leak probe: false
Console/JS errors: none
```

## Safety/non-actions

- No `hermes-gateway.service` restart.
- No core checkout mutation.
- No public exposure change.
- No NAS mount/direct credentials.
- No cron/watcher automation.
- No dashboard mutation endpoint/control added.
- No backend schema/API change.
