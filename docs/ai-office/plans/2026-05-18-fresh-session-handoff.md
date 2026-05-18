# AI Office fresh-session handoff — 2026-05-18

## Purpose

This handoff lets a later `/new` session restart from durable files and live read-only checks rather than compacted chat history.

## Current repo/live state verified while preparing this handoff

- Local repo: `/Users/lidises/dev/hermes-agent`
- Branch: `main`
- Local HEAD: `e9825f29` (`docs(ai-office): record authority handoff deploy`)
- `origin/main`: `e9825f29`
- Local git status before writing this handoff: clean (`## main...origin/main`)
- Hermes CLI: `Hermes Agent v0.14.0 (2026.5.16)`, reported `Up to date`
- Canonical VPS dashboard worktree: `/home/hermes/.hermes/ai-office-dashboard`
- VPS dashboard HEAD: `e9825f29`
- VPS dashboard worktree status: clean
- VPS services: `hermes-agent-dashboard.service=active`, `hermes-gateway.service=active`
- VPS listeners: dashboard `100.122.57.85:8765`, gateway `100.122.57.85:8766`; both private/Tailscale-bound in the read-only listener check
- Canonical VPS `ai-office` Kanban board readback: 74 tasks, all `done`; 0 ready/running/blocked/todo observed in the JSON listing

## Progress assessment

### Overall state

AI Office has moved from a read-only RPG/control-room prototype into a guarded controlled-mutation workbench with a narrow, explicit Mac-relay write path. The work is no longer just planning: many backend helpers, protected API routes, frontend `/office` panels, tests, private VPS dashboard deploys, and Mac-local NAS smoke checks are implemented.

### What is solidly done

1. Operating model and product shell
   - VPS `ai-office` Kanban is established as the canonical operating board.
   - `/office` is the private human-readable dashboard/control room.
   - Paperclip/sourceTags/projection cache are treated as safe evidence/projection layers.

2. Read-only and safe projection surfaces
   - `/office` contains many read-only Desk RPG / controlled-mutation posture panels.
   - Stable `data-office-*` hooks and regression tests exist for those surfaces.
   - Raw body/path/provider/token/traceback leak checks are part of the repeated verification pattern.

3. Controlled-mutation metadata ladder
   - Request store, human decision store, dry-run result store, audit append store, authority binding contract, authority registry store, NAS preparation/evidence/path contracts and stores are implemented in small rungs.
   - Stores are local/profile-scoped JSONL with allowlisted safe DTOs, duplicate guards, safe filters, limit clamps, and malformed-line skipping.

4. NAS Keeper / Mac relay path
   - The architecture keeps real NAS writes on the Mac relay path, not on the VPS.
   - VPS direct NAS mount/credentials/write authority remain excluded.
   - Queue enqueue, claim dry-run, authorization, payload preview, execution-from-preview, execution-state recording, queue readback, frontend API bridge, guarded operator UI, prefill, inline execute+record, and fail-closed filesystem hardening are implemented.
   - Multiple harmless Mac-local NAS smoke writes verified write/readback/audit/rollback behavior.

5. Latest completed slice
   - Commit `74342ce7` added the authority metadata handoff readback helper/API/UI panel.
   - Commit `e9825f29` documented the deploy evidence.
   - VPS dashboard worktree is synced to `e9825f29`; code slice `74342ce7` was browser-smoked with the verified `web_dist` fallback.
   - Private `/office` authority handoff smoke passed in the previous completion report: HTTP 200, panel rendered, complete=true, counts 1/1/1/1/1, no forms/buttons/inputs, dispatch/binding/target mutation false, raw leak false, console JS errors 0.

## What is not done / still intentionally excluded

- No watcher/cron/dispatch daemon is active for this path.
- No real authority-adapter binding or target dispatch is implemented/enabled.
- No public dashboard exposure has been added.
- No VPS direct NAS mount, NAS credentials, raw NAS read, or direct VPS NAS write authority has been added.
- No durable production NAS Keeper queue item should be assumed executed; the real writes so far were bounded harmless Mac-local smoke notes or safe metadata checkpoints.
- The latest authority metadata handoff panel is a manual status/readback lane only; it is not automation.
- The canonical `ai-office` Kanban board currently has no live ready/running work; if further work should persist across sessions, create new explicit cards rather than relying on old completed cards.

## Current best interpretation of progress percentage

- Product/architecture foundation: high, roughly 80–90% for the current private MVP foundation.
- Safe read-only dashboard/control room: high, roughly 75–85%.
- Guarded manual write path through NAS Keeper → Mac relay: medium-high, roughly 60–70%; the main primitives and smoke checks exist, but it is still operator-driven and intentionally non-automated.
- Automated AI Office operations/dispatcher authority: low, roughly 15–25%; the safety contracts and metadata lanes exist, but actual watcher/cron/dispatcher/authority binding remain excluded.
- Public/multi-user production hardening: low; public exposure and broader operational authority have not been pursued.

Practical summary: the project is past prototype for private/manual guarded operation, but not yet an autonomous dispatcher. The safest next framing is “manual status-note/authority handoff lane is complete; choose whether to harden observability or design a dry-run-only dispatcher surface.”

## Important docs to read next

Start with:

- `/Users/lidises/dev/hermes-agent/docs/ai-office/NEXT.md`
- `/Users/lidises/dev/hermes-agent/docs/ai-office/STATUS.md`
- `/Users/lidises/dev/hermes-agent/docs/ai-office/product/unified-operating-workbench.md`
- `/Users/lidises/dev/hermes-agent/docs/ai-office/architecture/unified-operating-workbench.md`
- `/Users/lidises/dev/hermes-agent/docs/ai-office/plans/2026-05-14-desk-rpg-master-spec-review.md`

For the latest lane, inspect code and tests around:

- `hermes_cli/office_controlled_mutation.py`
- `hermes_cli/web_server.py`
- `tests/hermes_cli/test_office_controlled_mutation_authority_metadata_handoff.py`
- `tests/hermes_cli/test_office_controlled_mutation_authority_registry_store.py`
- `web/src/lib/api.ts`
- `web/src/lib/api.test.ts`
- `web/src/pages/OfficePage.rpg.test.tsx`
- `web/src/pages/officeView.ts`
- `web/src/pages/OfficePage.tsx`

## Safety boundaries for the next session

Default to read-only verification first. Do not mutate until explicitly approved.

Allowed without extra approval in a fresh session:

- Read repo files/status/logs.
- Read-only check VPS dashboard/gateway service state, worktree HEAD/status, listener bind, and private dashboard health.
- Read canonical `ai-office` Kanban board status.
- Summarize what is done/not done.

Require explicit approval before:

- Code edits.
- Commit/push/merge.
- VPS dashboard worktree reset/build/deploy/restart.
- Gateway/core checkout update or `hermes-gateway.service` restart.
- Kanban card creation/comment mutation.
- Any NAS write, even through Mac relay.
- Any watcher/cron/dispatch daemon or authority-adapter binding.
- Any public exposure or firewall/reverse-proxy change.
- Any VPS NAS mount/credential/direct-write work; this remains excluded by standing policy.

## Recommended next minimal options

1. Docs/status consolidation only
   - Update `NEXT.md`/`STATUS.md` if the final handoff file should be canonical.
   - Optionally commit/push this handoff and status update.
   - No code/service changes.

2. Manual status-note/authority handoff polish
   - Keep the latest authority metadata handoff lane manual/read-only.
   - Improve operator wording, empty/error states, and observability copy.
   - No dispatcher, no authority binding, no queue/NAS mutation.

3. Dry-run-only dispatcher/authority design surface
   - Add a contract/helper/UI that describes what a dispatcher would do in dry-run form only.
   - It must not dispatch, bind adapters, mutate targets, start daemons, or write NAS.
   - This is the next logical step if moving toward automation while preserving boundaries.

## Exact starter prompt for a new session

```text
AI Office/Hermes 이어서 해줘. 먼저 스킬 `hermes-agent`와 `ai-office-vps-operations`를 로드하고, 아래 handoff를 기준으로 live state를 다시 검증해줘:

- Handoff: /Users/lidises/dev/hermes-agent/docs/ai-office/plans/2026-05-18-fresh-session-handoff.md
- Repo: /Users/lidises/dev/hermes-agent
- Expected local/origin HEAD: e9825f29
- Expected VPS dashboard worktree: /home/hermes/.hermes/ai-office-dashboard at e9825f29
- Canonical VPS Kanban board: ai-office; last observed 74 done, 0 active/blocked

먼저 Mac/VPS/WSL Hermes 상태를 read-only로 확인하고, 실제로 진행되지 않은 구상/카드/문서를 요약해줘. 구현/서비스 재시작/게이트웨이 재시작/VPS 파일 변경/WSL 변경/commit/push/Kanban mutation/NAS write는 내가 승인하기 전에는 하지 마.

출력은 한국어로:
1. live 검증 결과
2. 아직 진행되지 않은 구상 목록
3. 현재 변경 파일/커밋 상태
4. 바로 승인할 수 있는 최소 다음 단계 2~3개
```

## Note on this handoff file

This file itself is newly created and not committed at creation time. A later session should decide whether to keep/commit it, update `NEXT.md`/`STATUS.md` to point here, or discard it.
