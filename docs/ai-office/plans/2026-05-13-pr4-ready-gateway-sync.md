# PR #4 ready + VPS gateway sync

Last updated: 2026-05-13 14:23 KST

## Scope

The user approved moving PR #4 out of draft and approved gateway-related work after the earlier dashboard-only smoke pass.

Actions performed:

- Mark PR #4 ready for review.
- Mutate only the VPS core/gateway checkout needed for the gateway runtime.
- Restart only `hermes-gateway.service`.
- Verify gateway active state and private dashboard regression smoke.

Actions not performed:

- No PR merge.
- No public exposure change.
- No NAS mount/direct credentials.
- No watcher/cron automation.
- No Kanban mutation.
- No dashboard mutation controls.
- No dashboard service restart during this gateway pass.

## PR state

Before ready:

```text
PR #4 state=OPEN
isDraft=true
headRefName=ai-office-stage16e-safe-spatial-choreography-20260510
latestCommit=5903922e docs(office): record d9ac5fae dashboard smoke
mergeStateStatus=UNKNOWN
mergeable=UNKNOWN
```

Command performed:

```text
gh pr ready 4
```

After ready:

```text
PR #4 state=OPEN
isDraft=false
headRefName=ai-office-stage16e-safe-spatial-choreography-20260510
latestCommit=5903922e docs(office): record d9ac5fae dashboard smoke
mergeStateStatus=CLEAN
mergeable=MERGEABLE
```

## VPS gateway/core preflight

Core checkout path:

```text
/home/hermes/.hermes/hermes-agent
```

Pre-sync state:

```text
branch=main
status=## main...origin/main [ahead 1, behind 112]
head=5ffc5b495 feat(image): add reference image editing tool
gateway_active=active
dashboard_active=active
gateway WorkingDirectory=/home/hermes/.hermes/hermes-agent
```

Because the core checkout had a local ahead commit, a rollback branch was created before switching the gateway runtime checkout:

```text
backup/vps-core-main-before-pr4-gateway-20260513T052142Z
```

## VPS gateway sync/restart

Commands performed in `/home/hermes/.hermes/hermes-agent`:

```text
git fetch lidises ai-office-stage16e-safe-spatial-choreography-20260510
git checkout -B ai-office-stage16e-safe-spatial-choreography-20260510 lidises/ai-office-stage16e-safe-spatial-choreography-20260510
systemctl --user restart hermes-gateway.service
```

Post-sync core/gateway state:

```text
core_head=5903922e
core_branch=ai-office-stage16e-safe-spatial-choreography-20260510
core_status_entries=0
gateway_active=active
gateway MainPID=209370
gateway WorkingDirectory=/home/hermes/.hermes/hermes-agent
dashboard_active=active
```

## Verification

Gateway post-restart:

```text
gateway_active_after_wait=active
recent_post_restart_errors=<none after 2026-05-13 05:21:46 UTC>
```

The journal contains the expected old-process termination line from the restart itself and an immediately prior auxiliary compression timeout warning from the pre-restart process; no post-restart gateway errors were found after waiting.

Dashboard regression smoke, without restarting dashboard service:

```text
dashboard_worktree_head=d9ac5fae
dashboard_worktree_status_entries=0
listener=100.122.57.85:8765
office_http=200
```

Interpretation:

- PR #4 is now ready/open, not merged.
- VPS gateway runtime is running from the PR branch at `5903922e`.
- The earlier dashboard worktree remains at the intentionally smoked code commit `d9ac5fae`; the newer PR commits after that are docs/evidence only.
- Dashboard service stayed active and was not restarted during this gateway pass.

## Rollback handles

- Core/gateway checkout rollback branch: `backup/vps-core-main-before-pr4-gateway-20260513T052142Z`.
- To roll back the gateway runtime if needed, switch `/home/hermes/.hermes/hermes-agent` back to the backup branch or another approved commit, then restart only `hermes-gateway.service`.

## Remaining approval needs

Separate explicit approval is still required for:

- Merge PR #4.
- Any public exposure/reverse proxy/firewall change.
- NAS mount/direct credentials.
- Watcher/cron automation.
- Kanban mutation.
- Dashboard mutation controls.
