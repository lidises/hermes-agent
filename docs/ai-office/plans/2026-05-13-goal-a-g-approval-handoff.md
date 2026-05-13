# Fresh-session `/goal` handoff — A-G approved, H and NAS-direct excluded

Date: 2026-05-13 15:14 KST

## Purpose

Prepare a copy/paste-safe `/goal` prompt for a fresh Hermes session.

The user approved all of the previously classified approval buckets A-G, while excluding H and permanently excluding VPS NAS mount/direct NAS credentials.

This document is a handoff/guardrail. It is not itself an instruction to execute from this session.

## Approval policy for the fresh session

Approved task-scoped buckets:

A. Dashboard worktree update + dashboard restart + private smoke
- May update only the dedicated VPS dashboard worktree: `/home/hermes/.hermes/ai-office-dashboard`.
- May restart only `hermes-agent-dashboard.service` when needed.
- May smoke private Tailscale `/office` on `100.122.57.85:8765`.
- Must not restart gateway as part of A.

B. PR commit/push/update only
- May commit/push approved local changes and update the existing PR/body as needed.
- Must not mark ready/merge unless the current task explicitly includes it and the repo/PR state confirms it is still appropriate.

C. Projection dry-run API only
- May implement/propose a private protected dry-run-only projection API/helper path.
- Must remain `dry_run=true` only.
- Must not mutate active/archive/rejected cache.
- Must return only safe metadata and constant non-echoing errors.

D. Non-dry-run projection promote
- May perform an explicitly validated safe-bundle promote after validator pass.
- Must operate only on safe projection bundle/cache paths.
- Must preserve atomicity and rollback/archive evidence.
- Must not read NAS/raw source directly.

E. Gateway/core sync + gateway restart
- May sync the VPS core/gateway checkout only when the exact target commit/branch is identified from docs/git/PR state.
- Must create/verify rollback handle before mutation.
- May restart only `hermes-gateway.service` for this bucket.
- Must verify gateway active, dashboard still active, private `/office` still 200, and no post-restart errors.

F. Kanban write
- May write to the canonical VPS `ai-office` Kanban board only for explicitly derived tasks/status from the current plan.
- Must avoid raw source leakage, topic-id exposure, accidental broad rewrites, or unrelated board mutation.

G. Cron/watcher automation
- May create/update automation only after a concrete safe design is present in the current session.
- Must include dry-run/disable/rollback behavior, rate/no-change quiet behavior, and secret-free logs.
- Must not read NAS directly or depend on NAS mounts/credentials.

Excluded:

H. Public exposure changes
- Do not add or change public IPv4/IPv6 exposure, reverse proxy, firewall openings, or public dashboard access.
- Public negative probes are allowed as read-only smoke evidence, but public exposure mutation is excluded.

Permanently excluded:

- VPS NAS mount.
- Direct NAS credentials on the VPS.
- Any structure where the VPS reads NAS/Obsidian/raw source material directly.

Use relay-generated safe bundles/projections instead.

## Mandatory first steps in the fresh session

1. Load skills:
   - `hermes-agent`
   - `ai-office-vps-operations`
   - `karpathy-coding-discipline`
   - add `kanban-orchestrator` only before actual Kanban mutation
   - add `obsidian-context-harness` only for NAS/Obsidian ledger discussion, not for runtime dependency
2. Read:
   - `docs/ai-office/NEXT.md`
   - `docs/ai-office/STATUS.md`
   - this file: `docs/ai-office/plans/2026-05-13-goal-a-g-approval-handoff.md`
   - latest relevant evidence docs referenced by NEXT/STATUS
3. Check live repo state:
   - `git status --short --branch`
   - `git log -5 --oneline --decorate`
   - `gh pr view --json number,title,state,isDraft,headRefName,url,commits` if a PR is still involved
4. Check live VPS state before any VPS mutation:
   - dashboard worktree branch/HEAD/status
   - dashboard service status
   - gateway service status if E is being considered
   - listener bind/private `/office` baseline
5. Explicitly identify the exact concrete task list being continued from current NEXT/STATUS/evidence before implementing.
   - Do not invent tasks from the A-G categories alone.
   - If NEXT/STATUS does not identify a concrete next task, stop and ask the user to choose among A-G buckets.
6. Proceed sequentially and keep each bucket isolated unless a dependency requires a different order; document any dependency-driven order change.

## Copy/paste `/goal` prompt

```text
/goal Hermes AI Office 작업을 새 세션에서 승인된 범위 안에서 순서대로 진행한다. 먼저 `hermes-agent`, `ai-office-vps-operations`, `karpathy-coding-discipline` skill을 load하고, `/Users/lidises/dev/hermes-agent`에서 `docs/ai-office/NEXT.md`, `docs/ai-office/STATUS.md`, `docs/ai-office/plans/2026-05-13-goal-a-g-approval-handoff.md`, 그리고 NEXT/STATUS가 가리키는 최신 evidence 문서를 읽는다. 그다음 `git status --short --branch`, `git log -5 --oneline --decorate`, 필요 시 `gh pr view --json number,title,state,isDraft,headRefName,url,commits`로 live 상태를 확인한다.

중요: 먼저 NEXT/STATUS/evidence에서 이번에 이어갈 “정확한 concrete task list”를 식별하고 같은 순서로 나열한다. A-G는 승인된 권한 범주일 뿐, 그 자체를 새로운 작업으로 발명하지 않는다. concrete task가 불명확하면 구현/배포/자동화/Kanban mutation을 하지 말고 사용자에게 선택을 요청한다.

승인된 범위: A dashboard worktree update + dashboard service만 필요 시 restart + private Tailscale `/office` smoke, B PR commit/push/update only, C private/protected projection dry-run API/helper only, D validator-passing safe-bundle non-dry-run projection promote, E VPS core/gateway checkout sync + `hermes-gateway.service` restart only when exact target/rollback is identified, F canonical VPS `ai-office` Kanban write for explicitly derived tasks/status only, G cron/watcher automation only after concrete safe design with dry-run/disable/rollback/secret-free logs.

제외 범위: H public exposure changes는 제외한다. public IPv4/IPv6 negative probe는 read-only smoke로만 허용한다. VPS NAS mount, direct NAS credentials, VPS가 NAS/Obsidian/raw source를 직접 읽는 구조는 영구 제외한다. NAS/raw material은 Mac/WSL relay가 safe bundle/projection으로 만든 것만 VPS에 전달한다.

안전 규칙: dashboard/core/gateway/Kanban/cron 작업 범위를 섞지 말고 bucket별로 분리한다. gateway restart는 E에서만, dashboard restart는 A에서만 한다. secrets, `.env`, `auth.json`, NAS credential, raw prompts/transcripts/task bodies/logs/provider identity를 출력/저장하지 않는다. mutation 전에는 live 상태와 rollback/disable path를 확인한다. 모든 변경 후 focused tests/build/lint 또는 적절한 smoke를 수행하고, `docs/ai-office/plans/`에 evidence 문서를 남기며 `NEXT.md`/`STATUS.md`를 갱신한다. 가능한 경우 commit/push하되, mark-ready/merge/public exposure/NAS direct access는 하지 않는다. 끝에는 completed/partial/blocked/pending, changed files, git/test/smoke/service evidence, 남은 승인 필요사항을 한국어로 간결히 보고한다.
```

## Suggested execution order once concrete tasks are identified

1. Local/read-only preflight and concrete task identification.
2. Local TDD/docs/API work if C or related implementation is the chosen task.
3. Focused tests/lint/build/diff/security scan.
4. Commit/push/PR update if B applies.
5. VPS dashboard-only sync/smoke if A applies.
6. Safe projection promote only if D applies and validator evidence is fresh.
7. Gateway/core sync/restart only if E applies and target/rollback are explicit.
8. Kanban write only if F applies and task/status text is explicit.
9. Cron/watcher automation only if G applies and disable/rollback is explicit.
10. Evidence/NEXT/STATUS finalization and final Korean report.

## Current live preparation snapshot

Observed from this session before writing this handoff:

- Local checkout: `/Users/lidises/dev/hermes-agent`
- Time: 2026-05-13 15:14 KST
- Git state before this docs write: `## main...origin/main`
- HEAD before this docs write: `7246cd37 docs(office): note final dry-run dashboard sync`
- `NEXT.md` and `STATUS.md` still contain the latest AI Office handoff/evidence references, but they also include long historical sections. The fresh session must treat the top `Current next stage`/latest evidence entries as authoritative and should not follow stale lower sections without reconciling them.
