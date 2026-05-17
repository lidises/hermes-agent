# AI Office Desk RPG Projection Model 1

Status: Draft architecture/product contract
Last updated: 2026-05-14
Scope: documentation only; no code, backend schema, service, Kanban, cron, NAS, VPS, renderer dependency, or executable-control changes.

## Purpose

`Desk RPG Projection Model 1` defines what the `/office` JRPG operating room is allowed to project before more UI implementation happens.

The projection model sits between Hermes runtime/Kanban/Paperclip/projection cache facts and the visual Desk RPG surface. It makes the operating room calm, bounded, redacted, and honest: a worker avatar may move or speak only from safe projected state; GUI requests must not appear as completed runtime facts; raw prompts, logs, paths, tokens, and source bodies must not enter map-level copy.

Source evidence:
- `docs/ai-office/product/desk-rpg-product-vision.md`
- `docs/ai-office/plans/2026-05-14-desk-rpg-master-spec-review.md`
- `docs/ai-office/architecture/unified-operating-workbench.md`
- `docs/ai-office/product/unified-operating-workbench.md`
- `docs/ai-office/NEXT.md`
- `docs/ai-office/STATUS.md`

## Projection layer contract

The projection layer is a safe view-model boundary, not an authority boundary.

It may:
- summarize runtime/Kanban/Paperclip/projection-cache posture into safe visual state;
- emit role/avatar/facility status for DOM/CSS rendering;
- classify requests as pending, blocked, approval-needed, working, reviewing, or complete;
- expose safe counts, phase labels, and redacted identifiers;
- preserve last-known-good posture when source data is stale or unavailable;
- show that a mutation is requested or blocked.

It may not:
- grant authority;
- execute actions;
- create completed fact events;
- write audits;
- mutate Kanban;
- write NAS;
- promote/reject projection bundles;
- start cron/watchers;
- restart services;
- expose raw source material;
- represent unapproved intent as completed work.

## Identity model

### Role avatar

A role avatar is the persistent product character the user recognizes in the operating room.

Required MVP role avatars:
- `user_boss`
- `orchestrator`
- `search_worker`
- `reviewer`
- `wiki_writer`
- `nas_keeper`

Deferred/facility-backed role avatars:
- `kanban_keeper`
- `paperclip_curator`
- `planner`
- `ops_guard`

Role avatars are stable across sessions and should be used for layout anchoring, actor labels, and user comprehension.

### Runtime instance

A runtime instance is an ephemeral worker/process/task execution projection attached to a role avatar.

Examples:
- `search_worker:web-search`
- `search_worker:pubmed-search`
- `search_worker:internal-search`
- `reviewer:evidence-quality-pass`
- `wiki_writer:draft-pass`

Runtime instances may appear, disappear, or be capped in the visual layer. They are not separate permanent characters unless a later product decision promotes them.

### Visible actor

A visible actor is the rendered sprite/card/desk occupant derived from either a role avatar or a capped runtime instance.

Rules:
- Always show core role avatars when relevant to the current view.
- Cap visible clones for noisy roles, especially Search Worker.
- Send excess runtime instances to inspector drill-down counts, not map clutter.
- Do not expose raw runtime IDs if they contain provider names, paths, tokens, prompts, or source titles.

## Event classes

The model distinguishes three event classes.

### Runtime events

Runtime events are facts from approved backend substrate or current state sources.

Examples:
- `TaskCreated`
- `TaskAssigned`
- `WorkerSpawned`
- `SearchStarted`
- `EvidenceCollected`
- `ReviewRequested`
- `ReviewCompleted`
- `DraftStarted`
- `DraftReady`
- `ApprovalRequested`
- `SaveRequested`
- `SaveCommitted`
- `TaskCompleted`

Rules:
- Runtime events must not be invented by the browser.
- If a runtime event is synthesized from snapshot state, label it as `derived` or `snapshot_projection`.
- Completed/fact events require a trusted source; GUI intent alone cannot create them.

### Intent/request events

Intent/request events are proposed actions or user/GUI/Telegram/CLI requests that are not yet executed.

Examples:
- `UserInstructionSubmitted`
- `WorkerActionRequested`
- `OrchestratorPlanRequested`
- `ApprovalDecisionRequested`
- `SaveApprovalRequested`
- `OpsActionRequested`

Rules:
- Natural language enters as `UserInstructionSubmitted` to the Orchestrator.
- Worker quick actions become `WorkerActionRequested`, not direct worker execution.
- Intent/request events may be displayed as pending/blocked/needs-approval.
- Intent/request events must not be rendered as completed work.

### Visual projection events

Visual projection events are renderer-safe cues derived from runtime and intent/request posture.

Examples:
- `ActorMovedToDesk`
- `ActorSpeechCueReady`
- `BoardPhaseChanged`
- `EvidenceCountChanged`
- `VaultLockedPostureShown`
- `ApprovalBubbleShown`
- `InspectorFocusChanged`
- `WorkerNoiseSuppressed`

Rules:
- Visual projection events are UI cues only.
- They cannot imply backend mutation.
- They use safe generated copy and bounded metadata.
- They may degrade to last-known-good state when source data is unavailable.

## State model

### Character state

Each character projection should contain only safe fields:

```text
character_id
role_avatar_id
visible_actor_kind: role_avatar | runtime_instance | facility_delegate
label
status: idle | receiving_instruction | planning | working | reviewing | blocked | approval_needed | waiting | complete | unavailable
zone_id
desk_id
phase_label
safe_speech_cue
safe_summary
attention_level: calm | info | warning | blocked
source_posture: live | derived | mock | stale | unavailable
redaction_status: redacted | aggregate_only
raw_excluded: true
```

Forbidden character fields:
- raw prompt
- raw log
- provider/model secret identity
- local absolute path
- token-shaped string
- source body
- unredacted document title when sensitive
- executable command body

### Desk/facility state

Each facility projection should contain:

```text
facility_id
facility_kind: boss_desk | orchestrator_desk | worker_cluster | kanban_paperclip_board | nas_vault | security_ops_corner
label
status: available | active | blocked | locked | approval_needed | stale | unavailable
safe_summary
open_inspector_target
enabled_controls: 0
mutation_posture: none | request_only | approval_required | authority_unavailable
raw_excluded: true
```

Facility-specific posture:
- Boss desk: command/approval origin, no direct mutation in MVP.
- Orchestrator desk: mediation hub for instructions and worker requests.
- Worker cluster: role avatars plus capped runtime clones.
- Kanban/Paperclip board: task/evidence source-of-truth surface, read-only in MVP.
- NAS vault: final-save boundary, locked/approval-needed only.
- Security/ops corner: deploy/restart/permission objects visible as gated/locked posture only.

### Board/evidence state

The central board projects safe aggregate work state:

```text
project_phase
active_task_count
blocked_task_count
approval_needed_count
evidence_candidate_count
evidence_reviewed_count
draft_status
lineage_posture: none | partial | safe_manifest | stale
safe_tabs: board | evidence | log_summary | result_summary
raw_excluded: true
```

Rules:
- Board state may link to inspector tabs.
- Board state must not write Kanban.
- Evidence counts and sourceTag summaries are allowed; raw source text is not.
- Paperclip/sourceTags remain evidence lineage surface, not raw document viewer.

### NAS vault state

NAS vault projects final-save posture:

```text
vault_status: locked | approval_needed | save_requested | unavailable
nas_keeper_status
approval_ref
rollback_posture
safe_summary
enabled_controls: 0
raw_excluded: true
```

Rules:
- MVP stops at `approval_needed` or `save_requested` posture.
- `SaveCommitted` requires later authority/audit/rollback implementation.
- VPS direct NAS credentials/mounts remain excluded.

### Security/ops state

Security/ops projects sensitive operational posture:

```text
ops_object_id
ops_kind: service_restart | deploy | permission_change | projection_promote | cron_watch
status: locked | approval_required | cli_required | unavailable
safe_summary
enabled_controls: 0
raw_excluded: true
```

Rules:
- Do not hide sensitive objects entirely; show locked posture.
- Do not render restart/deploy/permission controls as clickable browser actions in MVP.

## Visible worker cap and noise suppression

The visual office should stay calm.

Rules:
- Always show Orchestrator, User Avatar/Boss, NAS Keeper when their zones are relevant.
- Search Worker may show up to 3 visible runtime helpers.
- Reviewer and Wiki Writer normally show one role avatar each.
- More than 3 parallel search/runtime instances collapse into inspector counts.
- Repeated event chatter collapses into phase/status summaries.
- Stale or unavailable sources should show one warning posture, not repeated error bubbles.
- Map-level speech uses safe generated copy only.

Default caps:

```text
search_worker_visible_instances: 3
reviewer_visible_instances: 1
wiki_writer_visible_instances: 1
ops_visible_alerts: 1 per ops kind
speech_bubbles_per_zone: 1
```

## Last-known-good and staleness posture

Projection should prefer calm stale indicators over blank or raw failure states.

Rules:
- If current state is unavailable, preserve last-known-good visual posture if safe.
- Mark source posture as `stale` or `unavailable`.
- Show safe copy such as “최근 안전 스냅샷 표시 중”.
- Do not echo backend error bodies, traces, private paths, tokens, or provider details.
- Do not promote stale state into completed/fact events.

## Redaction and raw-leak sentinels

Projection output must be tested or reviewed against private markers before implementation.

Forbidden output categories:
- local absolute paths
- token-shaped strings
- API keys/secrets/passwords
- raw prompts
- raw tool logs
- raw source document bodies
- unredacted NAS paths
- provider/model secret identifiers
- backend tracebacks
- shell command bodies for sensitive operations

Required sentinel policy for future implementation:
- Include local-path sentinels.
- Include token-shaped sentinel strings.
- Include raw prompt/source-title sentinels.
- Assert map-level copy excludes them.
- Assert inspector only receives redacted/aggregate forms.
- Assert `raw_excluded: true` survives projection boundaries.

## DTO boundary sketch

Future implementation may introduce a pure helper contract shaped like this, but this document does not implement it:

```text
buildDeskRpgProjectionModel(officeState, options) -> DeskRpgProjectionModel

DeskRpgProjectionModel:
  schema_version
  generated_at_policy
  source_posture
  actors[]
  facilities[]
  board_state
  evidence_state
  vault_state
  ops_state
  inspector_targets[]
  suppressed_counts
  redaction_summary
  enabled_controls: 0
  raw_excluded: true
```

Implementation requirements when approved:
- pure helper first;
- focused RED test before code;
- safe fixtures with private sentinels;
- no backend route/schema change in the first helper slice;
- no UI controls;
- docs handoff updated before commit.

## Acceptance criteria

`Desk RPG Projection Model 1` is complete when:

1. The repo contains this projection model contract.
2. Role avatar, runtime instance, and visible actor are defined separately.
3. Runtime events, intent/request events, and visual projection events are defined separately.
4. Character, facility/desk, board/evidence, NAS vault, and security/ops state models are specified with safe fields.
5. Visible worker caps and noise suppression rules are explicit.
6. Last-known-good/staleness posture is explicit.
7. Redaction and raw-leak sentinel policy is explicit.
8. DTO boundary sketch is documented without implementation.
9. Non-mutation boundaries are preserved.
10. `NEXT.md`, `STATUS.md`, and unified product/architecture docs now record that `Desk RPG IA/Layout 1` and `Controlled Mutation & Approval Model 1` followed this projection model and point to the next recommended `Implementation Roadmap 1` slice.

## Next recommended slice

`Controlled Mutation & Approval Model 1`

`Desk RPG IA/Layout 1` is now documented in `docs/ai-office/product/desk-rpg-ia-layout.md`. The next step is controlled mutation/approval modeling: define how natural-language instructions and worker quick actions become event requests, how Orchestrator mediation handles approval/hold/deny routing, and how NAS Keeper final-save authority, audit, rollback, dry-run, and CLI confirmation posture works before any executable implementation.
