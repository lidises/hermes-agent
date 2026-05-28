# AI Office Desk RPG Product Vision 1

Status: Draft product contract
Last updated: 2026-05-28
Scope: documentation only; no code, service, Kanban, cron, NAS, VPS, renderer dependency, or executable-control changes.

## Purpose

AI Office `/office` should become a quiet but living Desk RPG/JRPG operating room for Hermes work, not a pile of dashboard strips.

The product target is an operating UI where the user appears as the boss/avatar, the Orchestrator receives and mediates instructions, worker characters show safe projected work state, Kanban/Paperclip appear as office facilities, and final save/controlled mutation remains gated by approval, authority, audit, and rollback policy.

This document turns the Master Spec v0.1 review into a repo-local product contract before more UI surfaces are added.

Source evidence:
- `docs/ai-office/plans/2026-05-14-desk-rpg-master-spec-review.md`
- `docs/ai-office/architecture/unified-operating-workbench.md`
- `docs/ai-office/product/unified-operating-workbench.md`
- 2026-05-28 user-provided DeskRPG/OpenClaw reference videos: `OpenClaw 2D 픽셀 가상 오피스 구축` and `OpenClaw 멀티에이전트 메타버스 오피스 만들기 | DeskRPG`.
- `docs/ai-office/NEXT.md`
- `docs/ai-office/STATUS.md`

## 2026-05-28 visual target recalibration

The current product target name is `DeskRPG Office World`.

The reference videos corrected the target from “RPG-styled dashboard” to “2D pixel multi-agent office game client.” The `/office` page should make work state readable from the office world itself: a tile/furniture-dense map, small agent sprites embedded among desks and meeting/lounge objects, compact in-map name/status/speech cues, and auxiliary read-only game-log/inspector panels.

Immediate Stage 13 implication:
- Prior no-refresh sprite/route/silhouette work remains a useful safe scaffold.
- The next visual priority is pixel-office density: floor tiles, desks, chairs, meeting tables, sofa/lounge, plants, monitor/whiteboard/bookcase-like objects, and sprite placement among those objects.
- Additional abstract route/patrol polish should come after the office world has enough furniture/tile context to make movement meaningful.
- Real chat input, command execution, browser mutation controls, NAS writes, gateway/public/automation authority, and renderer/dependency changes remain deferred until separate explicit approval.

## Core product sentence

AI Office 통합 운영실은 Hermes runtime, Kanban, Paperclip/sourceTags, Projection Cache, and NAS save authority into one calm JRPG office. The user is represented as the boss avatar; the Orchestrator and worker characters move according to safe projected events; the central board and evidence wall show work state, evidence, approvals, and final-save posture; all mutation remains event-requested, authority-gated, audited, and reversible.

## Read-only-first meaning

Read-only-first is the first safety posture, not the permanent product ceiling.

Correct interpretation:
- `/office` first proves safe projection, redaction, current-state comprehension, and disabled-control posture.
- Later mutation/control can only appear as bounded event requests after explicit approval, authority, audit, rollback, and backend policy contracts exist.

Incorrect interpretation:
- `/office` is forever only a passive status dashboard.
- UI controls may be added first and authority/audit can be backfilled later.

## MVP success scene

The MVP should be judged by one concrete scene:

1. The user/boss avatar submits a natural-language instruction such as “침 치료 과학적 근거 위키 글 작성”.
2. The Orchestrator receives it as an orchestrator-level instruction, not as a direct worker command.
3. The Orchestrator creates a safe projected project/request posture.
4. Search Worker runtime instances fan out in parallel, but the map shows a capped number of visible helper actors.
5. Reviewer and Wiki Writer take over once evidence is ready.
6. The central board shows phase/status and safe evidence counts.
7. The right inspector shows details using safe summaries, IDs, counts, and redacted metadata only.
8. The Orchestrator reports completion or approval-needed state to the boss avatar.
9. MVP stops at `NAS save approval requested`; real NAS write is deferred until later authority and approval gates exist.

## MVP actor set

Start with six product actors:

1. User Avatar / Boss
   - Represents the user’s intent and approval authority.
   - Owns explicit approve/hold decisions in later gated flows.
   - Does not directly mutate runtime state through UI in MVP.

2. Orchestrator
   - Central manager for natural-language instructions and worker action requests.
   - Turns user intent into plans, task/request posture, and worker coordination.
   - Prevents worker-level authority bypass.

3. Search Worker
   - Persistent role avatar with multiple ephemeral runtime instances.
   - Visible clones are capped to avoid visual noise.
   - Inspector can drill into safe subtask counts/status only.

4. Reviewer
   - Reviews evidence quality and draft readiness.
   - Surfaces safe review posture, blocked state, and missing evidence requirements.

5. Wiki Writer
   - Produces draft/output posture.
   - Does not perform final NAS save.
   - Shows draft status and approval-needed state through safe projection.

6. NAS Keeper
   - Sole product role allowed to represent final NAS save authority.
   - MVP shows only locked/read-only or approval-requested posture.
   - Real final NAS write requires later user approval, authority model, audit event, and rollback point.

Deferred actors:
- Planner starts as an Orchestrator capability.
- Kanban Keeper and Paperclip Curator start as facility behaviors/inspectors, then may become actors later.

## Facilities and office layout contract

The MVP office is a single central office with fixed camera and zones/desks, not multiple rooms.

Required facilities:

- Boss desk
  - User avatar home.
  - Future command console and approval dialogue origin.

- Orchestrator desk
  - Central mediation point.
  - Receives `UserInstructionSubmitted` and `WorkerActionRequested` posture before any worker execution.

- Worker desk cluster
  - Shows role avatars and capped visible runtime clones.
  - Conveys working/blocked/waiting/reviewing states via calm sprite-like DOM/CSS presentation.

- Central Kanban/Paperclip board
  - Kanban is the official task-state source-of-truth object.
  - Paperclip/sourceTags are the evidence lineage surface.
  - Board click opens safe board/evidence/log/result tabs.

- NAS vault entrance
  - Represents final-save boundary.
  - Locked/read-only in MVP.
  - Shows `approval required`, `CLI confirmation required`, or `authority unavailable` posture rather than executable buttons.

- Security/ops corner
  - Represents deploy/restart/permission-sensitive objects.
  - Must be visible as gated/locked posture, not hidden and not executable.

## Interaction principles

1. Natural-language instruction always enters as Orchestrator-level intent.
2. Worker quick actions must create a request posture for Orchestrator mediation, not direct execution.
3. Pure read-only UI actions may happen locally: open inspector, show evidence, filter view, jump to object, show report.
4. Approval uses boss avatar / Orchestrator dialogue posture plus inspector card.
5. Modal UI is reserved for explicit approval confirmation in later stages; MVP prefers right drawer inspector.
6. Map stays calm; details move to the inspector or tabs.

## Safe text and redaction

Map speech bubbles and ambient labels must use safe generated copy, not raw prompts, search terms, document titles, provider names, private paths, tokens, logs, or unredacted source text.

Allowed examples:
- “웹 근거 찾는 중…”
- “논문 후보 3개 찾음”
- “근거 검토 대기”
- “저장 승인 필요”
- “막힘: 추가 지시 필요”

Raw or detailed source material belongs only in an inspector/Paperclip tab after redaction and should still avoid local paths, tokens, secrets, full prompts, raw logs, or direct NAS/source body exposure.

## Event and projection posture

The product must distinguish three event classes:

1. Runtime events
   - Facts from actual work, worker state, Kanban, cron, projection, or approved backend substrate.

2. Intent/request events
   - User, GUI, Telegram, or CLI requests that are not yet executed.
   - GUI mutation can create only this class until authority exists.

3. Visual projection events
   - Renderer-safe cues for room/character/board/vault state.
   - Must be safe, bounded, redacted, and suitable for last-known-good projection cache behavior.

The UI must never directly create fact events such as `SaveCommitted` or final mutation outcomes.

Reference vocabulary direction:

```text
UserInstructionSubmitted
→ OrchestratorPlanRequested
→ TaskCreated / TaskAssigned
→ WorkerSpawned / SearchStarted
→ EvidenceCollected
→ ReviewRequested / ReviewCompleted
→ DraftStarted / DraftReady
→ ApprovalRequested
→ SaveRequested
→ SaveCommitted
→ TaskCompleted
```

For MVP, the chain can be partially projected or mocked, but fake/mock state must be explicitly marked and must not look like authoritative completed mutation.

## Authority and NAS boundary

NAS Keeper is the only product role that may represent final NAS write authority.

MVP boundary:
- Real NAS write: excluded.
- Final save state: stop at `NAS save approval requested`.
- Most workers: scratch RW in future, NAS read-only/projection-only.
- VPS: no direct NAS mount, direct NAS credentials, or direct raw-source reads.

Future controlled save policy:

```text
ApprovalRequested
→ user approval
→ SaveRequested
→ NAS Keeper executes
→ rollback point/evidence recorded
```

This requires a later backend authority model and audit/rollback implementation. Frontend posture alone is not authority.

## Renderer and dependency posture

MVP renderer:
- React/TypeScript/Vite stays as the frontend stack.
- Use DOM/CSS fixed office and sprite-like presentation.
- Use existing helper/view-model style before adopting new renderer dependencies.
- CSS transitions/keyframes and simple state machines are enough for early stages.

MVP non-adoption:
- No Phaser/Pixi/canvas tilemap dependency yet.
- No multi-room map or minimap yet.
- No personality simulation, voice, replay theater, or sentence-level lineage yet.

Reopen renderer decision only after projection model, IA/layout, interaction, authority, accessibility, reduced-motion, bundle, browser-smoke, and raw-leak evidence show DOM/CSS is insufficient.

## Product non-goals for the next implementation wave

Do not add these while executing Desk RPG Product Vision / Projection Model / IA/Layout setup:

- executable mutation controls
- backend mutation route/service
- approval recording
- authority grant
- dry-run execution
- rollback execution
- audit write
- real NAS write
- VPS NAS mount or credentials
- public exposure
- Telegram integration
- cron/watcher automation
- service restart/deploy controls
- renderer dependency replacement
- raw prompt/log/source/NAS body display
- direct worker execution from quick actions
- Kanban state mutation from the browser
- projection promote/reject controls

## Product acceptance criteria

`Desk RPG Product Vision 1` is complete when:

1. The repo contains this product contract.
2. The contract states read-only-first as a safety posture, not the permanent ceiling.
3. The MVP success scene is explicit.
4. The actor set includes User Avatar, Orchestrator, Search Worker, Reviewer, Wiki Writer, and NAS Keeper.
5. Facilities cover boss desk, Orchestrator desk, worker cluster, Kanban/Paperclip board, NAS vault, and security/ops corner.
6. Natural-language and quick-action flows go through Orchestrator mediation.
7. NAS final save is deferred behind approval, authority, audit, and rollback.
8. Renderer dependency non-adoption is explicit for MVP.
9. Non-goals preserve the current safety boundaries.
10. `NEXT.md`, `STATUS.md`, and unified workbench product/architecture docs now record that `Desk RPG Projection Model 1`, `Desk RPG IA/Layout 1`, and `Controlled Mutation & Approval Model 1` followed this product vision and point to the next recommended `Implementation Roadmap 1` slice.

## Next recommended slice

`Desk RPG IA/Layout 1`

`Desk RPG Projection Model 1` is now documented in `docs/ai-office/architecture/desk-rpg-projection-model.md`. The next step is IA/layout: define the single central office fixed layout, place boss desk, Orchestrator desk, worker cluster, Kanban/Paperclip board, NAS vault, security/ops corner, and right inspector, and decide which existing HUD/strips move behind tabs or inspector surfaces before UI implementation.
