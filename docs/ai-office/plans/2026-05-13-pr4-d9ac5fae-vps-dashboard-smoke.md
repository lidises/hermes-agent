# PR #4 d9ac5fae VPS dashboard sync and private smoke

Last updated: 2026-05-13 14:09 KST

## Scope

Approved dashboard-only operational pass for PR #4 latest pushed commit `d9ac5fae` (`Stabilize recovered test hardening`) on branch `ai-office-stage16e-safe-spatial-choreography-20260510`.

Allowed scope used:

- Dedicated VPS dashboard worktree only: `/home/hermes/.hermes/ai-office-dashboard`.
- Fast-forward/update that worktree to `d9ac5fae`.
- Check dashboard service state and restart only `hermes-agent-dashboard.service` because the running dashboard process needed to pick up the updated checkout.
- Private Tailscale listener smoke at `100.122.57.85:8765`.
- Raw leak, console, basic read-only hook, and public negative exposure checks.

Explicitly not performed:

- No gateway/core checkout mutation.
- No gateway restart.
- No public exposure change.
- No NAS mount/direct credentials.
- No watcher/cron automation.
- No Kanban mutation.
- No PR mark-ready or merge.
- No dashboard mutation controls added.

## Required preflight

Local repo: `/Users/lidises/dev/hermes-agent`

- `git status --short --branch` showed the local branch tracking `origin/ai-office-stage16e-safe-spatial-choreography-20260510` with no local changes before this evidence/doc update.
- `gh pr view 4 --json number,title,state,isDraft,headRefName,url,commits` confirmed:
  - PR: `#4`
  - State: `OPEN`
  - Draft: `true`
  - Head branch: `ai-office-stage16e-safe-spatial-choreography-20260510`
  - Latest commit: `d9ac5fae7cdf7a347d345b958c74b9c2b87f598f`
  - Latest commit headline: `Stabilize recovered test hardening`

## VPS sync

SSH path used:

```text
ssh -i /Users/lidises/.ssh/id_ed25520 -o IdentitiesOnly=yes hermes@100.122.57.85
```

Pre-sync VPS facts:

```text
worktree=/home/hermes/.hermes/ai-office-dashboard
branch=ai-office-stage16e-safe-spatial-choreography-20260510
head=7c22a76e fix(mcp): keep oauth symbols patchable without sdk
dashboard_service=active
gateway_service=active
dashboard WorkingDirectory=/home/hermes/.hermes/ai-office-dashboard
listener=100.122.57.85:8765 only
```

Update performed:

```text
git fetch origin ai-office-stage16e-safe-spatial-choreography-20260510
git pull --ff-only origin ai-office-stage16e-safe-spatial-choreography-20260510
systemctl --user restart hermes-agent-dashboard.service
```

Fast-forward result:

```text
Updating 7c22a76e..d9ac5fae
Fast-forward
23 files changed, 240 insertions(+), 29 deletions(-)
head=d9ac5fae
headline=d9ac5fae Stabilize recovered test hardening
```

Only `hermes-agent-dashboard.service` was restarted. `hermes-gateway.service` was status-checked only and remained active.

## Private smoke evidence

Post-sync VPS service/worktree checks:

```text
head=d9ac5fae
branch=ai-office-stage16e-safe-spatial-choreography-20260510
worktree_status_entries=0
dashboard_active=active
gateway_active=active
listener=LISTEN 100.122.57.85:8765 users:(("python",pid=208280,fd=14))
private_office_http=200 bytes=648 time=0.002397
api_office_http=401 bytes=25
html_raw_sentinel=false
```

Browser smoke URL:

```text
http://100.122.57.85:8765/office?v=d9ac5fae
```

Browser smoke results:

```text
title=Hermes Agent - Dashboard
console_messages=0
js_errors=0
mutation_controls=[]
rawLeak=false
projection_orchestration_hook=true
paperclip_manifest_visibility_hook=true
```

Observed `/office` body contained Korean-first read-only AI Office UI, including the `/office` sidebar guard copy:

```text
오피스는 읽기 전용 화면입니다. 재시작/업데이트 작업은 다른 운영 화면에서만 실행할 수 있습니다.
```

The browser smoke did not find restart/update/delete/approve/merge/ready style mutation controls on the page.

## Public exposure negative checks

Public address discovery from the VPS:

```text
public_ipv4=178.105.83.210
public_ipv6=2a01:4f8:1c18:b821::1
```

Negative probes from the MacBook:

```text
http://178.105.83.210:8765/office -> http_code=000, timeout after ~3.0s
http://[2a01:4f8:1c18:b821::1]:8765/office -> http_code=000, connection refused/unreachable
```

Interpretation: the dashboard listener remained private/Tailscale-bound at `100.122.57.85:8765`; public port 8765 did not serve `/office` during this pass.

## Final state

- Dedicated VPS dashboard worktree is synced to `d9ac5fae` and clean.
- Dashboard service is active after a dashboard-only restart.
- Gateway service is active and was not restarted.
- Private `/office?v=d9ac5fae` returns 200 and browser smoke passed with no JS console errors.
- Raw leak probes were false.
- Mutation controls were absent on `/office`.
- Public IPv4/IPv6 negative probes did not reach a public dashboard.
- PR #4 remains draft/open; no mark-ready or merge was performed.

## Remaining approval needs

Separate explicit approval is still required for any of these:

- Mark PR #4 ready for review.
- Merge PR #4.
- Any gateway/core checkout mutation or gateway restart.
- Public exposure/reverse proxy/firewall changes.
- NAS mount/direct credentials.
- Watcher/cron automation.
- Kanban mutation.
- Adding dashboard mutation controls.
