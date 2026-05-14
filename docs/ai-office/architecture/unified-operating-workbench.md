# AI Office Unified Operating Workbench — Architecture

Last updated: 2026-05-14 14:01 KST
Status: Phase 0 architecture consolidation. Documentation-only; no code, runtime, service, Kanban, projection, cron, VPS, NAS, or gateway mutation is approved by this document.

## Architecture principle

AI Office 통합 운영실 is a read-only-first operating room over four safe layers:

```text
VPS canonical ai-office Kanban
  → Paperclip/sourceTags/safe evidence summaries
  → validated active Projection Cache / last-known-good bundle
  → /office RPG operating room from safe OfficeState/projection DTOs
```

The VPS dashboard is an always-on private display surface. It must not become a raw source warehouse, second Kanban database, NAS mirror, or executable control panel without a separate approval model.

Master Spec v0.1 refinement: this read-only-first architecture is the safe entry posture. The target architecture should leave room for later Desk RPG/JRPG interaction through request events, orchestrator mediation, approval gates, and authority-enforced controlled mutation. No current Phase 0 document approves those mutations; it only preserves the design path so the UI does not get locked into a passive dashboard forever.

## Layer ownership

### Layer A — Operating Board / 운영 보드

Owner:

- VPS canonical `ai-office` Kanban board.

Responsibilities:

- Own task/work state.
- Represent triage, active, blocked, review, and done posture.
- Provide safe counts and review/checkpoint posture to `/office`.

Boundaries:

- One canonical board only: VPS `ai-office`.
- Mac/WSL are relay/status clients.
- Telegram topics are intake/source metadata, not boards.
- `/office` reads board posture; it does not create, update, approve, complete, or reassign work unless a later mutation model is explicitly approved.

### Layer B — Evidence Layer / 근거 레이어

Owner:

- Paperclip Workbench, sourceTags, safe manifest tooling, source-health summaries.

Responsibilities:

- Attach provenance and context without exposing raw source bodies.
- Summarize safe sourceTags, manifest counts, source health, freshness, redaction, and provenance posture.
- Keep Paperclip inside the Office/workbench context rather than making it a separate top-level dashboard tab by default.

Browser/VPS DTO exclusions:

- raw prompts
- raw transcripts
- raw tool args
- raw task body/result
- raw worker logs
- raw cron scripts
- secrets, tokens, API keys, `auth.json`, `.env` values
- full private filesystem paths
- provider/model identity
- NAS private document body text
- raw adapter error text
- numeric Telegram topic ids unless explicitly mapped to a safe display abstraction

### Layer C — Projection Cache / 안전 투영 캐시

Owner:

- Projection producer, validator, and VPS active cache directories.

Conceptual flow:

```text
Mac/WSL/manual producer
  → safe bundle
  → VPS incoming
  → validator
  → active last-known-good cache
  → archive / rejected aggregate
  → /office safe projection view
```

Responsibilities:

- Validate safe bundles before promotion.
- Keep active last-known-good state stable when incoming bundles fail.
- Surface freshness and rejected aggregate without raw payload leakage.

Boundaries:

- VPS stores sanitized projections only.
- VPS must not gain direct NAS credentials, direct NAS mount, or direct raw-source reads as part of this model.
- Failed incoming bundles must not replace active cache.
- Watcher/cron automation remains disabled unless separately approved.

### Layer D — RPG Room / RPG 운영실

Owner:

- `/office` dashboard UI backed by safe OfficeState/projection DTOs.

Responsibilities:

- Render rooms, characters, routes, filters, inspector, fallback rows, and safe diagnostics.
- Prefer Korean-first user-facing copy while preserving useful technical identifiers where appropriate.
- Use browser-local safe deltas/events/freshness for motion/tracking truth.

Boundaries:

- DOM/CSS-first.
- No Phaser/Pixi/canvas/sprites/DeskRPG assets/code without explicit dependency/security/license approval.
- No fabricated live work: motion must come from safe deltas/events/freshness or clearly state snapshot/static posture.
- No executable mutation controls in the read-only operating room.

## Safe data contract sketch

A later implementation may derive a browser-facing view-model from existing `OfficeState` rather than changing backend schema first:

```text
OfficeUnifiedWorkbenchView
  operatingBoard
    canonicalHost
    boardSlug
    counts
    reviewPosture
    relayPosture

  evidenceLayer
    sourceTags
    safeManifestSummary
    sourceHealth
    redactionPosture
    provenancePosture

  projectionCache
    activeBundle
    freshness
    validatorPosture
    rejectedAggregate
    lastKnownGood

  rpgRoom
    rooms
    characters
    routes
    filters
    inspector
    fallbackRows

  safetyPosture
    readOnly
    privateOnly
    rawExcluded
    mutationControls
    approvalGates
    approvalModel
      actionRequest
      dryRunEvidence
      humanDecision
      auditEvent
      executionAuthority
```

Rules for any future DTO/helper:

- Derive from already-redacted safe state.
- Prefer pure helper-first implementation and focused tests.
- Add raw-leak sentinel tests before rendering new browser-facing fields.
- Keep free-form metadata as untrusted display text that must pass through the project redaction helper.
- Do not introduce backend schema/API changes until the view-model grouping proves useful.

## Target rendering order

```text
/office
  ├─ AI Office 통합 운영실 header
  │   ├─ canonical board: VPS ai-office
  │   ├─ active projection freshness
  │   └─ private/read-only posture
  ├─ RPG 운영실 map
  ├─ 운영 보드 / Kanban posture
  ├─ 근거 레이어 / Paperclip-source posture
  ├─ 안전 투영 캐시 / Projection flow and freshness
  └─ 안전 정보 / diagnostics drawer
```

This order makes the page read as one operating room rather than a chronological pile of Stage/HUD features.

## Evidence documents kept as lower-level detail

This architecture document is an index and consolidation point. It does not replace the underlying evidence:

- Desk RPG/JRPG master-spec review and recommended next contracts:
  - `docs/ai-office/plans/2026-05-14-desk-rpg-master-spec-review.md`
- Controlled approval/authority contract:
  - `docs/ai-office/architecture/approval-model-contract.md`
- RPG Visualizer implementation and private VPS smoke:
  - `docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-implementation-evidence.md`
  - `docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-vps-deploy-smoke.md`
- Kanban operating source of truth:
  - `docs/ai-office/plans/2026-05-13-kanban-first-operating-conversion.md`
- Projection ingest/cache/promote evidence:
  - `docs/ai-office/plans/2026-05-13-goal-c-g-execution-evidence.md`
  - `docs/ai-office/plans/2026-05-13-projection-vps-manual-ingest-completion.md`
- Paperclip/source-tag model:
  - `docs/ai-office/plans/2026-05-11-ai-office-kanban-paperclip-unified-workbench-plan.md`
  - `docs/ai-office/plans/2026-05-11-paperclip-workbench-source-tag-projection-plan.md`
  - `docs/ai-office/paperclip-source-tag-projection.md`
  - `docs/ai-office/paperclip-safe-manifest.md`
- Existing baseline architecture/product docs:
  - `docs/ai-office/architecture/conceptual-architecture.md`
  - `docs/ai-office/architecture/office-state-model.md`
  - `docs/ai-office/product/information-architecture.md`
  - `docs/ai-office/product/non-goals-and-mutation-boundary.md`

## Next architecture step

`Unified Workbench IA/Layout 1`, `Approval Request View 1`, `Approval Audit Timeline 1`, `Approval Execution Gate 1`, `Authority Adapter Contract 1`, `Orchestrator Mediation Queue 1`, `Worker Intent Routing 1`, `Worker Facility Readiness 1`, `Worker Assignment Candidate Gate 1`, `Worker Request Draft Preview 1`, `Worker Human Confirmation Envelope 1`, `Worker Authority Handoff Envelope 1`, `Worker Dispatch Dry-Run Envelope 1`, `Worker Audit Preview Envelope 1`, `Worker Rollback Preview Envelope 1`, `Worker Final Gate Checklist 1`, `Controlled Mutation Proposal Contract 1`, `Controlled Mutation Dry-Run Plan 1`, `Controlled Mutation Audit Sink Plan 1`, `Controlled Mutation Rollback Verification Plan 1`, `Controlled Mutation Human Approval Plan 1`, `Controlled Mutation Authority Summary 1`, and `Controlled Mutation Execution Readiness Summary 1` are locally implemented as pure safe view-model helpers plus top `/office` display-only sections. `Desk RPG Product Vision 1` is documented in `docs/ai-office/product/desk-rpg-product-vision.md`, `Desk RPG Projection Model 1` is documented in `docs/ai-office/architecture/desk-rpg-projection-model.md`, and `Desk RPG IA/Layout 1` is now documented in `docs/ai-office/product/desk-rpg-ia-layout.md`, setting the fixed central-office IA before more UI surfaces are added. The next architecture/product step should be `Controlled Mutation & Approval Model 1`:

1. Define how natural-language instructions and worker quick actions become event requests rather than direct execution.
2. Define Orchestrator mediation, approval/hold/deny routing, and worker assignment boundaries.
3. Define NAS Keeper final-save approval/write boundary, including authority, audit, rollback, dry-run, and CLI confirmation posture.
4. Preserve read-only browser posture until backend authority exists: no executable controls, backend mutation routes, Kanban writes, NAS writes, cron/watchers, service restarts, public exposure, or raw projection.
