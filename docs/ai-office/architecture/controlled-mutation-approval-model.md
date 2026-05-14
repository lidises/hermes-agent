# AI Office Controlled Mutation & Approval Model 1

Status: Draft architecture/product contract
Last updated: 2026-05-14
Scope: documentation only; no code, UI implementation, backend schema, route/service, Kanban mutation, NAS write, audit write, dry-run execution, approval recording, VPS/service/cron change, renderer dependency, or executable-control changes.

## Purpose

`Controlled Mutation & Approval Model 1` defines how the Desk RPG operating room should think about future mutation without enabling mutation.

The model turns natural-language instructions and worker quick actions into explicit event requests; routes them through Orchestrator mediation; separates approve, hold, deny, and revise decisions; reserves final-save authority for NAS Keeper; and requires authority, dry-run, audit, rollback, and CLI confirmation posture before any future executable implementation.

Source evidence:
- `docs/ai-office/product/desk-rpg-product-vision.md`
- `docs/ai-office/architecture/desk-rpg-projection-model.md`
- `docs/ai-office/product/desk-rpg-ia-layout.md`
- `docs/ai-office/plans/2026-05-14-desk-rpg-master-spec-review.md`
- `docs/ai-office/architecture/unified-operating-workbench.md`
- `docs/ai-office/product/unified-operating-workbench.md`
- `docs/ai-office/NEXT.md`
- `docs/ai-office/STATUS.md`

## Core rule

The browser may request or display posture; it may not execute.

```text
User/GUI/worker quick action
→ intent/request event
→ Orchestrator mediation
→ approval/hold/deny/revise posture
→ authority candidate posture
→ dry-run/audit/rollback/CLI confirmation posture
→ only a later approved backend implementation may execute
```

Anything before the final backend implementation is not a completed runtime fact.

## Request classes

### 1. Natural-language instruction request

Origin:
- Boss desk / future command surface;
- Telegram or CLI relay;
- other user-facing request sources.

Canonical request event:

```text
UserInstructionSubmitted
```

Required safe fields:

```text
request_id
request_kind: user_instruction
submitted_from: boss_desk | telegram | cli | relay | unknown
safe_instruction_summary
requested_outcome_kind: research | draft | review | save | ops | unknown
orchestrator_required: true
authority_required: false | true | unknown
raw_excluded: true
```

Rules:
- raw prompt text does not go to map-level copy;
- instruction summary must be redacted/generated safe copy;
- request does not assign work directly;
- request does not create a durable Kanban task until a later approved backend pipeline exists.

### 2. Worker quick-action request

Origin:
- worker character card;
- facility badge;
- inspector read-only suggestion.

Canonical request event:

```text
WorkerActionRequested
```

Required safe fields:

```text
request_id
request_kind: worker_quick_action
source_actor_id
source_facility_id
action_family: ask_orchestrator | request_evidence | request_review | request_draft | request_save | request_ops | unknown
safe_action_summary
orchestrator_required: true
direct_worker_execution_allowed: false
raw_excluded: true
```

Rules:
- quick action is not a shortcut to execution;
- it returns to Orchestrator desk as a mediated request;
- worker assignment, enqueue, dispatch, and backend mutation remain disabled.

### 3. System attention request

Origin:
- projection cache warning;
- stale state;
- security/ops posture;
- validation/rejection aggregate.

Canonical request event:

```text
SystemAttentionRequested
```

Rules:
- system attention can ask for human attention or Orchestrator planning;
- it cannot self-approve or self-heal by executing commands;
- it must not echo raw backend errors, tracebacks, paths, tokens, provider details, or source bodies.

## Orchestrator mediation model

The Orchestrator owns the transition from intent to plan posture.

Mediation states:

```text
received
classifying
needs_clarification
plan_draft_ready
blocked_by_policy
blocked_by_missing_authority
awaiting_human_decision
approved_for_future_authority_check
denied
revised
expired
```

Mediation outputs:

```text
safe_plan_summary
request_scope
risk_class
required_roles
required_facilities
required_evidence
approval_requirement
authority_requirement
dry_run_requirement
audit_requirement
rollback_requirement
cli_confirmation_requirement
raw_excluded: true
```

Rules:
- Orchestrator can produce plan posture but not execution;
- Orchestrator cannot grant authority to itself;
- Orchestrator cannot bypass NAS Keeper for final save;
- Orchestrator cannot turn GUI intent into completed runtime facts.

## Human decision model

Future approval UI or CLI confirmation must distinguish these decisions:

```text
approve_for_planning
approve_for_dry_run
approve_for_execution
hold
request_revision
deny
expire
```

MVP/documentation posture:
- no approval recording;
- no browser approve button;
- no durable decision event write;
- show only that a decision would be required.

Important separation:
- approving planning is not approving execution;
- approving dry-run is not approving execution;
- approving execution still needs authority, audit sink, rollback point, and CLI confirmation where required.

## Authority candidate model

Authority is not a visual state and not a frontend flag. It is a backend policy decision that must be designed later.

Authority candidate fields for future implementation:

```text
authority_candidate_id
request_id
operation_family: kanban_write | projection_promote | nas_save | service_ops | file_write | external_post | unknown
risk_class: read_only | local_write | canonical_state_write | external_side_effect | credential_sensitive | service_sensitive
required_actor: orchestrator | nas_keeper | ops_guard | human
required_channel: cli | backend_policy | unavailable
policy_ref
status: not_evaluated | unavailable | blocked | eligible_after_approval | denied
raw_excluded: true
```

Rules:
- browser cannot set authority eligible;
- authority status cannot be inferred from button enablement;
- credential-sensitive and service-sensitive actions default unavailable;
- authority candidate is not dispatch.

## Risk classes

Use these risk classes before any mutation implementation:

| Risk class | Meaning | Default posture |
| --- | --- | --- |
| `read_only` | local view/filter/selection only | allowed locally |
| `intent_only` | request/plan posture with no execution | allowed as safe projection |
| `local_write` | local scratch or draft write | blocked until backend policy |
| `canonical_state_write` | Kanban/projection cache/audit state mutation | blocked until authority/audit/rollback |
| `external_side_effect` | network post, message send, repo push, public exposure | blocked; separate approval |
| `credential_sensitive` | token/secret/NAS credential use | unavailable unless separately designed |
| `service_sensitive` | restart/deploy/cron/watcher/systemd | unavailable unless separately designed |

## Dry-run model

Dry-run is a future backend operation that previews effects without mutation.

Dry-run posture fields:

```text
dry_run_required: true | false
dry_run_available: false
dry_run_status: not_available | required | blocked | future_candidate
would_change_summary
would_touch_kinds
would_require_credentials: false | true | unknown
raw_excluded: true
```

Rules:
- documentation/UI posture must not run dry-run;
- dry-run output must not echo raw source data, tokens, paths, prompts, tool logs, or provider details;
- dry-run approval is not execution approval.

## Audit sink model

Audit is required before controlled mutation can be real.

Future audit fields:

```text
audit_required: true
audit_sink_available: false
audit_event_kind
audit_subject_ref
audit_reason_summary
audit_rollback_ref
audit_redaction_status: redacted | aggregate_only
raw_excluded: true
```

Rules:
- no audit write in MVP/docs-only sequence;
- audit event cannot contain raw prompt, raw source body, local path, token, secret, or provider hidden identity;
- audit sink must exist before execution can exist.

## Rollback model

Rollback posture is mandatory for controlled mutation.

Future rollback fields:

```text
rollback_required: true
rollback_available: false
rollback_strategy: snapshot | inverse_operation | archive_restore | manual | unavailable
rollback_point_ref
rollback_verification_status: not_available | required | verified | failed
raw_excluded: true
```

Rules:
- no rollback execution in MVP/docs-only sequence;
- rollback must be verified before execution is eligible;
- irreversible actions require explicit blocked or manual-only posture.

## NAS Keeper final-save boundary

NAS Keeper is the only role that may represent final NAS save authority.

Final-save request chain:

```text
DraftReady
→ SaveApprovalRequested
→ Orchestrator mediates scope/risk
→ Human decision required
→ Authority candidate: nas_save
→ Dry-run/preview required
→ Audit sink required
→ Rollback/archive point required
→ CLI confirmation required
→ future backend execution only
```

MVP/documentation posture:
- stop at `NAS save approval requested` or `save requested / authority unavailable`;
- no browser-side save button;
- no direct NAS mount/credential assumption;
- no VPS direct NAS credentials;
- no `SaveCommitted` unless later implementation creates trusted runtime fact with audit/rollback evidence.

## CLI confirmation posture

Some high-risk actions should require CLI or out-of-band confirmation even after browser approval exists.

CLI-required families:
- NAS final save;
- service restart/deploy;
- public exposure;
- credential-sensitive operations;
- external posts/messages;
- repo push/merge if surfaced through AI Office.

Rules:
- browser may show “CLI confirmation required”;
- browser cannot fake CLI confirmation;
- CLI confirmation must be tied to request id, authority candidate, audit plan, rollback plan, and exact safe summary.

## State transition sketch

Safe non-executable request lifecycle:

```text
request_submitted
→ orchestrator_received
→ plan_posture_ready
→ human_decision_required
→ authority_candidate_created
→ dry_run_required
→ audit_sink_required
→ rollback_required
→ cli_confirmation_required
→ execution_blocked_until_backend_policy
```

Decision branches:

```text
hold → paused_no_execution
request_revision → revised_request_needed
deny → denied_no_execution
expire → expired_no_execution
```

Future executable branch, not implemented here:

```text
backend_policy_approved
→ dry_run_completed
→ audit_sink_verified
→ rollback_verified
→ cli_confirmed_if_required
→ dispatch_eligible
→ execution_started
→ execution_completed_or_failed
→ audit_written
→ rollback_available_or_manual_required
```

## Browser posture rules

Allowed browser interactions in MVP/future first UI slice:
- select actor/facility;
- inspect request posture;
- inspect approval requirement;
- inspect authority/dry-run/audit/rollback missing prerequisites;
- show read-only safe summaries.

Forbidden browser interactions until later backend authority exists:
- approve execution;
- record approval;
- dispatch worker;
- assign work;
- enqueue work;
- create/persist request;
- mutate Kanban;
- write audit;
- run dry-run;
- execute rollback;
- save to NAS;
- promote/reject projection;
- restart/deploy service;
- enable cron/watcher;
- expose public route.

## Redaction requirements

All request/approval/authority posture must exclude:
- raw prompt;
- raw source text;
- raw logs;
- local absolute paths;
- NAS paths;
- token-shaped strings;
- API keys/secrets/passwords;
- provider/model hidden identifiers;
- backend tracebacks;
- shell command bodies for sensitive operations.

Allowed display:
- safe generated summaries;
- request ids;
- aggregate counts;
- risk class;
- operation family;
- missing prerequisite names;
- redacted refs.

## Future DTO boundary sketch

Future implementation may introduce a pure helper contract shaped like this, but this document does not implement it:

```text
buildControlledMutationApprovalModel(officeState, projectionModel, options)
  -> ControlledMutationApprovalModel

ControlledMutationApprovalModel:
  schema_version
  source_posture
  requests[]
  mediation_states[]
  decision_requirements[]
  authority_candidates[]
  dry_run_requirements[]
  audit_requirements[]
  rollback_requirements[]
  cli_confirmation_requirements[]
  blocked_execution_summary
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

`Controlled Mutation & Approval Model 1` is complete when:

1. The repo contains this controlled mutation/approval model contract.
2. Natural-language instruction, worker quick-action, and system attention request classes are defined.
3. Orchestrator mediation states and outputs are defined.
4. Human decision types distinguish planning, dry-run, execution, hold, revision, deny, and expiry.
5. Authority candidate model and risk classes are defined.
6. Dry-run, audit sink, rollback, NAS Keeper, and CLI confirmation posture are defined without implementation.
7. Safe lifecycle and decision branches are documented.
8. Browser allowed/forbidden interactions are explicit.
9. Redaction and future DTO boundary sketch are documented.
10. `NEXT.md`, `STATUS.md`, and unified product/architecture docs now record that `Implementation Roadmap 1` followed this contract and point to the next recommended `Desk RPG Projection ViewModel Helper 1` slice.

## Next recommended slice

`Desk RPG Projection ViewModel Helper 1`

`Implementation Roadmap 1` is now documented in `docs/ai-office/plans/2026-05-14-desk-rpg-implementation-roadmap.md`. The next step is the first safe implementation slice: write a focused RED test for `buildOfficeDeskRpgProjectionModel`, implement the pure DTO helper only, and verify actors/facilities/read-only posture/raw-exclusion before any UI rendering.
