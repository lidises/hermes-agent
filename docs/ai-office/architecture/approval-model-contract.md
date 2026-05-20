# AI Office Approval Model Contract 1

Last updated: 2026-05-20 17:18 KST
Status: architecture contract, documentation-only. This document does not approve implementation of mutation endpoints, browser execution controls, Kanban writes, projection promote/transfer, watcher/cron enablement, service restart, public exposure, NAS mount, direct credentials, or raw-source reads.

## Purpose

`Approval Model Contract 1` defines the authority boundary that must exist before the AI Office 통합 운영실 can evolve from read-only display into controlled action requests.

It answers one question:

> When the RPG operating room shows “승인 필요”, what exact non-raw request, evidence, human decision, and audit shape would be required before any real mutation is allowed?

This is a contract for future design and tests, not a permission to execute those mutations now.

## Current state

The current `/office` implementation is still safe projection only:

- `Approval Console 1` renders disabled/non-executable approval posture cards.
- The browser has no approve/reject/save/send/transition buttons.
- The browser has no approval form inputs.
- The browser does not call mutation endpoints.
- The dashboard remains a private read-only operating room over safe `OfficeState` / projection DTOs.

## Authority levels

Every future approval-related action must declare one of these authority levels.

| Level | Name | Allowed now? | Meaning |
| --- | --- | --- | --- |
| A0 | `display_only` | yes | Read-only posture shown in `/office`. No request event is created. |
| A1 | `request_only` | no, future design only | Browser or CLI may create an action-request event, but no target system is mutated. |
| A2 | `dry_run_only` | limited existing protected use | Server validates whether an action would be possible and returns non-raw evidence. No state mutation except audit/dry-run record if separately approved. |
| A3 | `human_approved_execute` | no | A human-approved decision may execute exactly one bounded mutation through an authority adapter. |
| A4 | `break_glass_admin` | no | Emergency/admin operation. Must remain outside normal `/office` UI and require separate explicit operator action. |

The browser UI must never infer a higher level from wording. The authority level must come from a server-side capability/contract field.

## Action request contract

A future action request is an intent, not an execution.

```ts
type OfficeActionRequest = {
  schema_version: 1;
  request_ref: string;              // safe opaque ref, not a task body or file path
  requested_at: string;             // ISO timestamp
  requested_by_surface: "office_ui" | "cli" | "telegram" | "scheduler";
  orchestrator_required: true;
  authority_level_requested: "request_only" | "dry_run_only" | "human_approved_execute";
  action_kind:
    | "kanban_transition"
    | "kanban_comment"
    | "projection_promote"
    | "projection_reject"
    | "nas_save_request"
    | "watcher_enable_request"
    | "service_restart_request";
  target: OfficeActionTarget;
  reason_summary: string;           // generated safe summary only
  evidence_refs: string[];          // safe refs only
  dry_run_required: true;
  human_approval_required: true;
};
```

Rules:

- `request_ref`, `target.ref`, and `evidence_refs` are opaque safe references.
- Do not include raw task body, prompt, transcript, source text, script body, log lines, model/provider identity, local path, NAS path, API key, credential, or numeric topic id.
- Natural-language user instructions enter through the orchestrator. Worker quick actions create `WorkerActionRequested` style intents, not direct execution.
- `/office` may display request posture only after the DTO is redacted and allowlisted.

## Target contract

```ts
type OfficeActionTarget =
  | { kind: "kanban_card"; board_ref: "vps-ai-office"; card_ref: string }
  | { kind: "projection_bundle"; bundle_ref: string; validator_ref: string }
  | { kind: "nas_save_candidate"; document_ref: string; keeper_ref: "nas-keeper" }
  | { kind: "watcher"; watcher_ref: string }
  | { kind: "service"; service_ref: "dashboard" | "gateway" | "core" };
```

Rules:

- `card_ref`, `bundle_ref`, `validator_ref`, `document_ref`, and `watcher_ref` must be non-raw safe refs.
- `nas_save_candidate` is a request to NAS Keeper, not a browser or VPS direct NAS write.
- Service targets must be coarse allowlisted labels; no systemd unit args, shell commands, script bodies, or host-private paths in browser DTOs.

## Dry-run evidence contract

Every executable action kind must have a dry-run result before human-approved execution.

```ts
type OfficeDryRunEvidence = {
  schema_version: 1;
  dry_run_ref: string;
  request_ref: string;
  checked_at: string;
  result: "would_succeed" | "would_fail" | "blocked" | "needs_more_evidence";
  validator_posture: "pass" | "warning" | "fail" | "not_applicable";
  affected_safe_counts: Record<string, number>;
  required_human_checks: string[];
  redaction: {
    raw_excluded: true;
    allowlisted_fields_only: true;
  };
};
```

Rules:

- Dry-run evidence may contain counts, postures, and opaque refs only.
- Dry-run evidence must not echo rejected paths, raw validation errors, prompts, scripts, logs, credentials, or source bodies.
- `would_succeed` does not execute anything. It only allows a later human decision event to be considered.
- Existing protected projection ingest dry-run is treated as a precedent for shape and safety, not as blanket permission for broader mutation.

## Human decision contract

```ts
type OfficeHumanDecision = {
  schema_version: 1;
  decision_ref: string;
  request_ref: string;
  dry_run_ref: string;
  decided_at: string;
  decision: "approve" | "reject" | "defer";
  decided_by: "local_operator";
  approval_scope: "single_action_only";
  expires_at: string;
  comment_summary?: string;
};
```

Rules:

- A decision is scoped to one request and one dry-run result.
- Approvals expire; stale approvals cannot execute later against changed state.
- `comment_summary` is optional safe summary text, not raw pasted instructions.
- Reject/defer decisions do not mutate target systems.

## Execution authority adapter contract

A future execution adapter must enforce all gates server-side.

Before execution, the adapter must verify:

1. action kind is allowlisted;
2. target kind/ref is allowlisted and still exists;
3. dry-run result is `would_succeed` and recent enough;
4. human decision is `approve`, scoped to the same request/dry-run, not expired;
5. requested authority level is exactly `human_approved_execute`;
6. redaction contract is satisfied;
7. target-specific safety gates pass;
8. audit event can be written before and after execution.

If any check fails, the adapter must return a non-echoing blocked result.

## Audit event contract

```ts
type OfficeAuditEvent = {
  schema_version: 1;
  audit_ref: string;
  event_at: string;
  event_kind:
    | "action_requested"
    | "dry_run_completed"
    | "human_decision_recorded"
    | "execution_started"
    | "execution_completed"
    | "execution_blocked";
  request_ref?: string;
  dry_run_ref?: string;
  decision_ref?: string;
  action_kind?: OfficeActionRequest["action_kind"];
  result_posture: "info" | "warning" | "blocked" | "success";
  safe_summary: string;
};
```

Rules:

- Audit events are safe summaries only.
- Audit events must not contain raw source text, task bodies, prompts, transcripts, scripts, logs, auth material, private paths, provider/model IDs, or topic IDs.
- If audit write fails before execution, execution must not happen.

## Per-action gates

### Kanban transition

Allowed future target:

- board: VPS canonical `ai-office` only;
- card: safe `card_ref` only;
- transition: allowlisted finite state transition only.

Required gates:

- current card safe status matches dry-run status;
- no raw card body/result in browser DTO;
- transition reason is safe summary;
- no cross-board mutation.

### Projection promote/reject

Allowed future target:

- validator-passing safe bundle refs only;
- active/incoming/archive/rejected cache controlled by the projection authority adapter.

Required gates:

- safe manifest validator posture pass or explicitly reviewed warning;
- active last-known-good rollback ref exists;
- rejected aggregate remains non-raw;
- no raw Paperclip/NAS material on VPS.

### NAS save request

Allowed future target:

- `nas_save_candidate` request to NAS Keeper only.

Required gates:

- NAS Keeper is the only role allowed to perform final NAS write;
- browser and VPS dashboard do not receive direct NAS credentials;
- user approves final save separately;
- document body has been through safe generation/review contract before write.

### Watcher/cron enablement

Allowed future target:

- disabled-by-default watcher definition with safe scope.

Required gates:

- explicit enable decision;
- quiet/no-op behavior on no changes;
- bounded output with no raw source body;
- clear rollback/disable path;
- no recursive cron scheduling.

### Service restart

Allowed future target:

- coarse service ref only: dashboard, gateway, or core.

Required gates:

- affected checkout/ref recorded safely;
- health check plan exists;
- rollback ref exists;
- no shell command shown in browser DTO;
- gateway/core restart remains separately approval-gated.


## Controlled Mutation Approval Boundary 1 — current approved follow-through

As of 2026-05-20 17:18 KST, the user approved a bounded write/follow-through scope after the frontend-only controlled-mutation completion review. This approval is intentionally narrower than general mutation authority.

Approved in this boundary:

- repo documentation update for the boundary and handoff;
- read-only `/office` summary rendering for the approved scope and blocked capability classes;
- local verification: focused Office tests, lint, build, diff/safety checks, and browser smoke;
- commit/push and private VPS dashboard-only sync;
- restart of `hermes-agent-dashboard.service` only after verification.

Still explicitly not approved by this boundary:

- Kanban state mutation, assignment, transition, or queue write;
- NAS write, direct NAS raw read, NAS credential access, or direct VPS NAS authority;
- watcher, cron, daemon, or subscription activation;
- dispatcher or authority-adapter binding to real targets;
- target runtime mutation or generalized execution;
- public exposure, firewall/domain/routing change, or gateway restart.

The matching `/office` surface must remain A0/display-only: no forms, no buttons, no browser-executable controls, no storage/network side effects beyond normal dashboard read traffic, and no raw task/provider/path/source projection. Stable DOM hooks use the `data-office-controlled-mutation-approval-boundary-*` prefix so browser smoke can assert the approved and blocked classes without inspecting raw records.

## UI requirements before enabling any control

Before `/office` renders an enabled action control, a future implementation must have:

1. server-side capability flag for the exact action kind;
2. helper tests for action request DTO redaction;
3. backend tests for gate failures and non-echoing errors;
4. browser smoke confirming no raw leak and no unintended forms/buttons;
5. audit log tests;
6. explicit user approval for that bounded action kind.

Until then, `Approval Console 1` remains display-only with disabled cards.

## Recommended next slice

`Approval Request View 1` should be the next implementation-adjacent slice only if approved. It should remain read-only and render hypothetical/request DTO posture from fixtures or safe DTOs without creating requests. It should add no backend mutation route and no enabled controls.

A safer immediate next step is `Unified Workbench IA/Layout 1`: reorganize the existing safe `/office` sections under the four-layer operating-room order while preserving the disabled approval console and the authority contract above.
