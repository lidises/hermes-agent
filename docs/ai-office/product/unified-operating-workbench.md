# AI Office Unified Operating Workbench — Product Definition

Last updated: 2026-05-14 14:01 KST
Status: Phase 0 umbrella product consolidation. Documentation-only; no code, service, Kanban, cron, projection, VPS, NAS, or gateway mutation is approved by this document.

## Product name

Internal / English name:

- `AI Office Unified Operating Workbench`

Korean / user-facing name:

- `AI Office 통합 운영실`

One-sentence definition:

> VPS의 `ai-office` Kanban이 일을 관리하고, Paperclip/sourceTags가 근거를 붙이며, Projection Cache가 안전한 last-known-good 상태를 유지하고, `/office` RPG 운영실이 그것을 사람이 읽기 쉽게 보여준다.

## Product decision

The following are no longer treated as separate projects:

1. AI Office / VPS dashboard
2. VPS canonical `ai-office` Kanban board
3. Paperclip / sourceTags / Projection Pipeline
4. DeskRPG-like RPG Visualizer / dynamic Office dashboard

They are four layers of one read-only-first operating product. The product should answer:

1. What work exists and what state is it in?
2. Which canonical board owns that state?
3. What safe evidence/source context is attached?
4. What active projection cache is currently safe to display?
5. How can a human read the state quickly in the `/office` operating room?

Master Spec v0.1 refinement: `read-only-first` is the first safety posture, not the permanent product ceiling. The long-term product target remains a Desk RPG/JRPG operating room where the user avatar can issue instructions, characters can request approval, and controlled mutations may eventually flow through an explicit event/request/approval/authority model. Until that model is separately designed and approved, this document only authorizes safe display consolidation.

## Four product layers

### Layer A — Operating Board / 운영 보드

Source: VPS canonical `ai-office` Kanban board.

Purpose:

- Own work state: todo, active, blocked, review, done.
- Provide the operating source of truth for AI Office work.
- Keep Mac/WSL/Telegram as relay, status, and intake context rather than separate boards.

User-facing copy principle:

> 작업 상태의 기준은 VPS canonical `ai-office` 보드입니다. Mac/WSL/Telegram topic은 별도 보드가 아니라 relay/intake/context입니다.

### Layer B — Evidence Layer / 근거 레이어

Source: Paperclip Workbench, sourceTags, safe manifests, source-health summaries.

Purpose:

- Attach safe provenance and source posture to work.
- Show redaction, source health, safe manifest counts, and evidence freshness.
- Avoid turning Paperclip into a separate top-level product surface.

User-facing copy principle:

> 근거는 sourceTag와 안전 manifest로만 연결됩니다. 원문, transcript, prompt, tool args, task body, credential-like 값은 표시하지 않습니다.

### Layer C — Projection Cache / 안전 투영 캐시

Source: safe bundle producer, validator, VPS incoming/active/archive/rejected directories, active last-known-good cache.

Purpose:

- Keep `/office` stable when incoming projection bundles fail validation.
- Let the VPS own sanitized projection cache only, not raw source material.
- Display freshness, active bundle posture, validator posture, and rejected aggregate safely.

User-facing copy principle:

> 현재 화면은 active projection cache의 마지막 안전 스냅샷을 표시합니다. 새 raw 자료를 직접 읽지 않으며, 실패한 incoming bundle은 기존 active 화면을 깨지 않습니다.

### Layer D — RPG Room / RPG 운영실

Source: safe OfficeState/projection DTOs rendered at `/office`.

Purpose:

- Make work, evidence, projection freshness, automation/routing posture readable at a glance.
- Present rooms, characters, routes, filters, inspector, fallback rows, and reduced-motion-aware CSS motion.
- Keep the visualizer as a read-only dashboard metaphor, not an executable game.

User-facing copy principle:

> AI Office 통합 운영실은 VPS `ai-office` 보드, 안전 근거 투영, active projection cache를 하나의 RPG 운영실로 읽습니다. 이 화면은 read-only이며 raw 자료와 실행 버튼은 표시하지 않습니다.

## `/office` information architecture target

The next product/layout consolidation should move away from a long feature/HUD stack and toward this order:

1. Operating-room header
   - Product name: `AI Office 통합 운영실`
   - Canonical board: VPS `ai-office`
   - Active projection freshness
   - Private/read-only safety posture
2. RPG operating-room map
   - Characters, rooms, routes, filters, inspector, fallback rows
3. Work queue / Kanban posture
   - Safe counts and review posture only
   - No raw task body/result projection
4. Evidence / Paperclip posture
   - sourceTags, safe manifest counts, source health, redaction/provenance posture
5. Projection cache / freshness
   - relay → validator → active cache → dashboard projection
6. Worker intent routing posture
   - mediated user/character/system intents mapped to worker roles/facilities as read-only hints
   - no work assignment, request creation, enqueue, dispatch, or audit write
7. Safety inspector / diagnostics drawer
   - raw exclusions, mutation gates, private posture, reduced-motion/browser-local tracking truth

## Non-goals and approval gates

The controlled approval path now has a documentation-only contract in `docs/ai-office/architecture/approval-model-contract.md`. That contract defines action request, dry-run evidence, human decision, execution authority, and audit event shapes that must exist before any future mutation can be enabled. It does not approve implementation.

This product definition does not approve:

- `/office` code implementation
- VPS dashboard worktree mutation or service restart
- gateway/core service restart
- Kanban card creation/update/completion
- cron/watcher enablement
- projection transfer/promote
- public exposure changes
- NAS mount, direct NAS credentials, or VPS direct raw-source reads
- executable mutation controls
- Phaser, PixiJS, canvas, renderer dependency, sprite assets, or DeskRPG code/assets

Future changes should preserve the read-only-first product posture unless the user explicitly approves a bounded mutation model.

## Linked evidence and prior plans

Preserve these as supporting evidence rather than deleting or rewriting them:

- `docs/ai-office/plans/2026-05-14-desk-rpg-master-spec-review.md`
- `docs/ai-office/architecture/approval-model-contract.md`
- `docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-implementation-evidence.md`
- `docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-vps-deploy-smoke.md`
- `docs/ai-office/plans/2026-05-13-kanban-first-operating-conversion.md`
- `docs/ai-office/plans/2026-05-13-goal-c-g-execution-evidence.md`
- `docs/ai-office/plans/2026-05-13-projection-vps-manual-ingest-completion.md`
- `docs/ai-office/plans/2026-05-11-ai-office-kanban-paperclip-unified-workbench-plan.md`
- `docs/ai-office/plans/2026-05-11-paperclip-workbench-source-tag-projection-plan.md`
- `docs/ai-office/paperclip-source-tag-projection.md`
- `docs/ai-office/paperclip-safe-manifest.md`

## Recommended next product step

After `Controlled Mutation Execution Readiness Summary 1`, `Desk RPG Product Vision 1` is now documented in `docs/ai-office/product/desk-rpg-product-vision.md`: a repo-local product contract for the quiet JRPG operating room, user avatar, orchestrator-mediated instruction flow, worker characters, Kanban/Paperclip facilities, NAS Keeper boundary, MVP success scene, read-only-first safety posture, renderer non-adoption posture, and non-goals. The next separately approved work should be `Desk RPG Projection Model 1`: define role avatar vs runtime instance, runtime/intent/visual projection event separation, character/desk/board/vault state, visible worker caps, noise suppression, and raw-leak boundaries before more UI implementation, without enabling execution, granting authority, recording approvals, executing rollback, writing audit events, running dry-runs, creating or persisting proposals/requests, enabling controls, dispatching actions, assigning work, enqueueing real work, adding backend mutation routes, or changing services.
