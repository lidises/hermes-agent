# AI Office RPG Visualizer Plan

> **For Hermes:** Planning-only handoff. Do not implement code from this document until the user explicitly approves an implementation slice.

**Goal:** Build a DeskRPG-like 2D office observability view where Hermes Agent activity appears as a factual company floor: agents as employees, tasks as work/quests, cron as machines, sources as archives, blockers as incidents, and reports as handoffs.

**Architecture:** Use existing protected `/api/office/state` and `/api/office/events` as the only runtime data boundary. First improve the current CSS/SVG Office map into an office-first RPG visualizer; do not add Phaser/Pixi/canvas/sprite dependencies unless later evidence and approval justify it.

**Tech Stack:** FastAPI dashboard routes in `hermes_cli/web_server.py`; read-only OfficeState adapters in `hermes_cli/office_state.py`, `hermes_cli/office_adapters.py`, `hermes_cli/office_redaction.py`; React/TypeScript UI in `web/src/pages/OfficePage.tsx`, `web/src/pages/officeView.ts`, `web/src/lib/api.ts`; Vitest tests in `web/src/pages/OfficePage.test.ts`; backend tests in `tests/hermes_cli/test_office_*.py`.

---

## 1. Product concept

### Problem solved vs normal dashboard

A normal dashboard answers “what are the numbers?” but not “where is the work stuck?” or “which part of the office is alive right now?” The RPG Visualizer should make operational state legible spatially:

- work is visible as people/objects in rooms, not only rows;
- blocked or unhealthy areas stand out immediately;
- the user can click an employee/object and understand its mission without scanning every panel;
- Kanban, sessions, cron, source health, safe events, and reports are seen as one company system instead of separate admin pages.

### What the user should understand within 5 seconds

1. Is the office calm, busy, blocked, or failing?
2. Which room needs attention?
3. Which employee/role is doing or waiting for what kind of work?
4. Is this real state or just decorative animation?
5. Where can I click to inspect the underlying safe record?

### What should feel game-like

- A top-down office floor with rooms.
- Small employee characters at desks/machines/boards.
- Status bubbles: working, waiting, blocked, failed, completed recently.
- Route/messenger movement when safe event flow exists.
- Incident corner for blockers/errors.
- Report board for completed handoffs.
- Mild CSS motion: walking, typing/working, blinking machine, pulse route.

### What must remain factual

- Every visible character/object must map to real redacted state.
- No fake speech bubbles, fake thoughts, fake autonomous “life,” or random bustle.
- First snapshot should be honest: if there are no changes, show stable posture, not fabricated movement.
- Animation labels must explain source: “safe DTO / snapshot delta / safe event,” not imply private cognition.
- If source data is missing, show “unknown/source gap,” not zero work.

---

## 2. Core metaphor mapping

| Hermes concept | RPG/office object | Factual rule |
|---|---|---|
| agent/session | employee/NPC character | Derived from safe `agents[]` or session counts only; generic role labels if identity is unsafe. |
| task/work item | quest/job card, desk work, Kanban wall item | Derived from `work_items[]` status/count/tenant/assignee allowlist. |
| running task | employee working at desk | Status must be `running`/active from OfficeState/Kanban. |
| blocked task | stuck employee + exclamation marker | Derived from blocked/needs-attention status only. |
| cron job | scheduled machine in Cron Room | Derived from `automations[]` schedule/status/next-run bucket only. |
| source health | archive/library/server shelf status | Derived from `data_sources[]`: ok/partial/missing/unavailable/error. |
| report/result | employee/report bubble at report board | Derived from recent safe completed event or done aggregate, not raw result body. |
| error | incident corner/alert marker | Derived from safe severity/error summary; no traceback/path/secrets. |
| Kanban graph | quest board / dependency string | Parent/child refs/counts only; no raw bodies/comments/logs. |
| Mac/WSL/VPS nodes | branches/relay desks | VPS is canonical office; Mac/WSL are relay/status mirrors only. |

---

## 3. MVP scope

### Smallest useful version

MVP should be read-only and boring-reliable:

- Route: existing `/office`, with the RPG office scene as the primary surface.
- 3–5 rooms visible at once.
- Character/room/object rendering using existing React + CSS/SVG first.
- Click employee/object -> side/inspector panel with exact safe underlying state reference.
- Periodic refresh using existing `getOfficeState()` and optional safe events via `getOfficeEvents()`.
- Accessibility fallback: text panels/list view remain visible and keyboard reachable.
- No multiplayer, map editing, task mutation, direct chat, gateway controls, cron controls, service controls, or public exposure.

### Recommended MVP room count

Use 5 logical rooms. Combine source/archive and incidents into side/corner areas if the layout is crowded.

1. Command Room
2. Agent Desks
3. Task Board / Kanban Wall
4. Cron Room
5. Source/Archive Room + Needs Attention/Incident Corner

---

## 4. Rooms and layout

### Command Room

Displays:
- overall office mode: read-only/private/canonical VPS;
- updated timestamp;
- live/manual tracking posture;
- safe event substrate status;
- currently selected employee mission summary.

Visible changes:
- heartbeat pulse when safe polling succeeds;
- warning when data is stale/unavailable;
- clear label if current view is snapshot/delta, not event stream.

### Agent Desks

Displays:
- active sessions/agents as employee characters;
- role: model/operator/worker/reviewer/router/sentinel;
- status label: idle/working/reviewing/routing/blocked/warning/error.

Visible changes:
- active employee typing/working animation;
- idle employee standing/small walk;
- blocked employee exclamation bubble;
- selected employee highlight.

### Task Board / Kanban Wall

Displays:
- work item counts by status;
- parent/child graph counts;
- assignee/tenant aggregates;
- recent completed handoff count.

Visible changes:
- running/ready/blocked columns pulse only when safe counts change;
- task-card objects appear as aggregates, not raw body cards;
- clicking board/aggregate opens safe Kanban projection panel.

### Cron Room

Displays:
- scheduled automations as machines;
- next-run timing bucket: overdue, soon, today, later, unknown;
- failed/stale machine alerts.

Visible changes:
- scheduled machines idle/blink calmly;
- soon/overdue machines pulse with warning tone;
- failed machine uses red/error tone.

### Source/Archive Room

Displays:
- source health for kanban, cron, sessions, topics, provenance, projection cache;
- relay/source posture such as Mac/WSL safe projection cache if available.

Visible changes:
- healthy shelf normal;
- partial/missing/unavailable source shows explicit warning/missing marker;
- source gaps are visible, never silently rendered as zero.

### Needs Attention / Incident Corner

Displays:
- blocked tasks count;
- failed/error automations;
- unavailable/error sources;
- approval-required/review-required queue when available.

Visible changes:
- exclamation marker for blocked;
- red alert marker for failed/error;
- click opens sorted attention list.

---

## 5. Data contract

### Existing input boundary

The repo already has this protected OfficeState shape:

```ts
export interface OfficeState {
  schema_version: number;
  generated_at: string;
  mode: "read_only";
  display_mode: string;
  capabilities: { read_only: boolean; mutations_enabled: boolean; remote_mode: string };
  data_sources: OfficeDataSource[];
  summary: Record<string, number | null | string>;
  rooms: Array<Record<string, unknown>>;
  agents: Array<Record<string, unknown>>;
  work_items: Array<Record<string, unknown>>;
  automations: Array<Record<string, unknown>>;
  topics: Array<Record<string, unknown>>;
  events: Array<Record<string, unknown>>;
  provenance: Array<Record<string, unknown>>;
  projection_cache: OfficeProjectionCache;
  redactions: { policy_version: number; redacted_field_count: number; omitted_sections: string[]; warnings: string[] };
}
```

The user prompt’s camelCase schema maps to the existing snake_case DTO:

```json
{
  "agents": [],
  "sessions": [],
  "workItems": "work_items[]",
  "cronJobs": "automations[]",
  "sources": "data_sources[]",
  "needsAttention": "summary.needs_attention_count + blocked/error aggregates",
  "recentEvents": "events[] + /api/office/events safe events",
  "updatedAt": "generated_at"
}
```

### New frontend view-model contract

Do not add a new backend endpoint first. Add a pure adapter in `officeView.ts` that builds a stable scene model from existing OfficeState:

```ts
export type OfficeRpgRoomId =
  | "command"
  | "agent_desks"
  | "task_board"
  | "cron_room"
  | "source_archive"
  | "incident_corner";

export type OfficeRpgStatus =
  | "idle"
  | "working"
  | "waiting"
  | "blocked"
  | "failed"
  | "completed"
  | "warning"
  | "unknown";

export type OfficeRpgEntityKind =
  | "agent"
  | "session"
  | "work_item"
  | "cron_job"
  | "source"
  | "incident"
  | "report";

export type OfficeRpgSceneEntity = {
  id: string;
  kind: OfficeRpgEntityKind;
  label: string;
  status: OfficeRpgStatus;
  room: OfficeRpgRoomId;
  positionHint: { x: number; y: number; lane?: string };
  severity: "normal" | "info" | "warning" | "danger";
  lastEventAt: string | null;
  summary: string;
  linkTarget: {
    type: "inspector" | "filter" | "safe_ref";
    ref: string;
  };
};

export type OfficeRpgScene = {
  schemaVersion: 1;
  generatedAt: string;
  mode: "read_only";
  rooms: Array<{
    id: OfficeRpgRoomId;
    label: string;
    summary: string;
    severity: "normal" | "info" | "warning" | "danger";
    counts: Record<string, number>;
  }>;
  entities: OfficeRpgSceneEntity[];
  recentEvents: Array<{
    id: string;
    label: string;
    room: OfficeRpgRoomId;
    severity: "normal" | "info" | "warning" | "danger";
    at: string | null;
  }>;
  safety: {
    factual: true;
    readOnly: true;
    source: "OfficeState" | "OfficeState+SafeEvents";
    omittedRawSections: string[];
  };
};
```

### Minimum fields per entity

- `id`: generated safe id or safe reference; no raw path/topic numeric id.
- `label`: generated or allowlisted label; use generic Korean role if uncertain.
- `status`: normalized status enum.
- `room`: one of known room ids.
- `positionHint`: deterministic x/y; no random fake motion.
- `severity`: normal/info/warning/danger.
- `lastEventAt`: safe timestamp or null.
- `summary`: generated factual summary.
- `linkTarget`: inspector/filter/safe_ref only; no mutation target in MVP.

Forbidden fields:
- prompt, transcript, task body, raw comment, raw result, log lines, script bodies, tool args, credential paths, provider/model identity, tokens/secrets, numeric Telegram topic IDs.

---

## 6. Rendering design

### Recommended frontend approach for MVP

Use current React + CSS/SVG shell first:

- `OfficePage.tsx` owns data fetching, selection, refresh, and high-level layout.
- `officeView.ts` owns pure deterministic view-model builders.
- CSS classes in `web/src/index.css` produce pixel-like character shapes, tiles, room borders, motion, and reduced-motion fallback.
- Each visible object is a real DOM button or a decorative element with adjacent accessible text.
- Keep normal text dashboard/fallback panels below or in a diagnostics drawer.

### Canvas 2D vs Phaser comparison

Canvas 2D:
- Pros: small dependency surface, easy custom drawing, no game framework commitment.
- Cons: accessibility/focus/tooltip/click hit-testing must be rebuilt; DOM text fallback required; harder to test exact rendered semantics.

Phaser:
- Pros: strong for tile maps/sprites/animation/camera if this becomes a real game-like map.
- Cons: larger dependency and bundle impact, more lifecycle complexity inside React, accessibility fallback still required, risk of making the product feel like a toy, asset/license review required.

CSS/SVG/DOM first:
- Pros: already implemented direction in repo, testable with Vitest/DOM hooks, accessible buttons/ARIA, reduced-motion easy, no new dependency, simple browser smoke.
- Cons: less powerful for large maps or many sprites; if entity count grows, layout/density may become hard.

Recommendation:
- MVP: CSS/SVG/DOM, not Canvas/Phaser.
- Renderer decision gate after MVP evidence: if DOM/CSS cannot support readability or performance, compare Canvas vs Phaser with bundle-size/accessibility/license evidence.

---

## 7. Event/status logic

Deterministic status rules:

- idle agent: standing/slow walk only if `status=idle` or no active work count.
- active agent: typing/working animation if safe role/status is active/working/reviewing/routing.
- blocked: exclamation bubble if work item status is blocked or needs-attention aggregate increments.
- failed/error: red alert state if source/automation/work status is error/failed.
- completed recently: report bubble only from safe recent done/completion event/count.
- stale source: warning marker from `data_sources[].status in partial/missing/unavailable/error` or stale timestamp bucket.
- healthy source: calm normal shelf/server marker.
- routing movement: only if safe event category/OfficeStateDelta changed flow indicates route; never from random timer alone.
- first snapshot: may show static posture, heartbeat, or idle glow; must not show fabricated recent movement.

Animation source labels should be explicit:
- `snapshot`: static pose from current state.
- `delta`: browser-local change between refreshes.
- `safe-event`: allowlisted `/api/office/events` category.
- `manual`: user clicked refresh.

---

## 8. UX constraints

1. Visualizer must not hide critical information: blocked/failed/source-error always appears in text too.
2. Normal text dashboard fallback remains available and keyboard reachable.
3. Reduced-motion users see the same meaning through labels, badges, rails, and inspector fields.
4. The UI must avoid overtrust: include copy such as “시각화는 안전 DTO 기반 관측이며, AI가 실제로 살아 움직인다는 뜻이 아닙니다.”
5. Distinguish states with both color and text: working, waiting, blocked, failed, completed.
6. No mutation controls in MVP; communication is preview/dry-run only until approved.
7. No hidden raw API fetches from browser; only protected `/api/office/state` and `/api/office/events`.
8. Unknown/missing data is a visible state.
9. The scene must be useful at 430px narrow width and on desktop.
10. `/kanban` remains the raw board UI; `/office` remains safe observability.

---

## 9. Implementation phases

### Phase 0: Inspect current Hermes dashboard/state APIs

Status: mostly done in this planning pass.

Live files inspected:
- `hermes_cli/office_state.py`
- `hermes_cli/web_server.py`
- `web/src/lib/api.ts`
- `web/src/pages/officeView.ts`
- `web/src/pages/OfficePage.tsx`
- `web/src/pages/OfficePage.test.ts` existence
- `docs/ai-office/architecture/backend-api.md`
- `docs/ai-office/architecture/frontend-components.md`
- `docs/ai-office/architecture/pixel-renderer-adapter.md`
- `docs/ai-office/STATUS.md`
- `docs/ai-office/NEXT.md`

Finding: Hermes already has a large CSS/SVG Office map, character projection, safe events, heartbeat, spatial choreography, Kanban projection, and disabled mutation-readiness posture. The next work should consolidate this into a company-like RPG visualizer rather than add another HUD strip.

### Phase 1: Define read-only RPG scene adapter

Deliverable:
- `OfficeRpgScene`, `OfficeRpgSceneEntity`, `OfficeRpgRoomId` types in `web/src/pages/officeView.ts`.
- Pure helper: `buildOfficeRpgScene(state, safeEvents?, options?)`.
- Tests prove:
  - every entity maps to safe OfficeState data;
  - forbidden raw-looking fields are ignored;
  - missing source becomes visible unknown/warning state;
  - no fake progress on first snapshot.

### Phase 2: Static 2D map with fixture/mock data

Deliverable:
- `OfficeRpgMap` component inside `OfficePage.tsx` or split later if file size demands.
- Use existing room map primitives and CSS/SVG character classes.
- Render 3–5 rooms, employees, machines, archive shelves, incident marker.
- Text fallback/list mirrors all entities.

No new backend.
No renderer dependency.

### Phase 3: Connect real `/api/office/state` data

Deliverable:
- Use current `api.getOfficeState()` result.
- Optional: consume `api.getOfficeEvents()` only through existing safe event posture.
- Periodic refresh stays browser-local and visible.
- Show `generated_at`, source health, and read-only guard.

### Phase 4: Clickable panels and filters

Deliverable:
- Click character/object -> inspector panel.
- Inspector includes:
  - object kind;
  - safe id/ref;
  - room;
  - status;
  - severity;
  - summary;
  - last event time;
  - exact safe underlying source category.
- Filters: room, status, severity, role.
- Keyboard jump targets: map, attention, source/archive, inspector, fallback list.

### Phase 5: Polish animations and sprites

Deliverable:
- CSS-only pixel-ish shapes first.
- Motion from real state only.
- Reduced-motion CSS disables animation while preserving static labels.
- If visual evidence shows CSS/SVG is insufficient, open a renderer decision plan.

### Phase 6: Optional task actions only after read-only UI is reliable

Out of MVP.

Possible later actions:
- ask status;
- draft Kanban comment;
- request unblock clarification;
- nudge dispatcher;
- reassign request.

All must be approval-gated, preview-first, and write-through to canonical VPS `ai-office` Kanban. No direct second task DB.

---

## 10. Files likely to modify

Based on live repo inspection, likely implementation files are:

Frontend:
- Modify: `web/src/pages/officeView.ts`
  - Add RPG scene view-model types and pure builders.
  - Add deterministic mapping/status/position helpers.
  - Add redaction/forbidden-field tests through helper outputs.
- Modify: `web/src/pages/OfficePage.tsx`
  - Render the RPG visualizer as the first/primary surface.
  - Add click inspector wiring, filter controls, fallback list, smoke hooks.
  - Do not add mutation calls.
- Modify: `web/src/pages/OfficePage.test.ts`
  - Add RED/GREEN tests for scene mapping, click inspector, fallback list, raw leak avoidance.
- Modify: `web/src/index.css`
  - Add pixel-office room/character/object/motion classes and reduced-motion rules.
- Maybe modify: `web/src/lib/api.ts`
  - Only if TypeScript DTO types need a stricter `OfficeRpgScene` input bridge or safe event typing; do not add mutation methods.
- Maybe modify: `web/src/App.tsx`
  - Only if adding a separate `/office-rpg` route is approved. Default recommendation is to keep it in `/office`.

Backend:
- Maybe modify later: `hermes_cli/office_state.py`
  - Only if current DTO lacks safe fields required by the frontend adapter.
- Maybe modify later: `hermes_cli/office_adapters.py`
  - Only for safe allowlisted enrichment; no raw rows/comments/logs/prompts.
- Maybe modify later: `hermes_cli/web_server.py`
  - Only if adding a safe schema/summary endpoint is approved; current `/api/office/state` and `/api/office/events` should suffice for MVP.
- Backend tests if backend changes occur:
  - `tests/hermes_cli/test_office_api.py`
  - `tests/hermes_cli/test_office_state_adapters.py`
  - `tests/hermes_cli/test_office_redaction.py`

Docs:
- This plan: `docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-plan.md`
- Update after implementation approval:
  - `docs/ai-office/STATUS.md`
  - `docs/ai-office/NEXT.md`

Do not modify for MVP:
- Gateway systemd units.
- Cron scheduler state.
- Kanban DB directly except approved planning/operating cards.
- NAS mounts or credentials.
- Public exposure config.

---

## 11. Deliverables

### Product brief

AI Office RPG Visualizer is a factual office-floor observability layer for Hermes Agent. It turns real read-only operational state into a 2D company scene so the user can instantly see work, blockers, automations, sources, and reports without reading every table.

### MVP spec

- `/office` shows the RPG scene first.
- 5-room office map maximum.
- Every entity comes from OfficeState/safe events.
- Clickable objects open safe inspector.
- Text fallback mirrors scene.
- Manual refresh plus optional safe polling.
- No task mutation/actions in first version.

### Data schema

Use existing `OfficeState` and derive `OfficeRpgScene` in frontend. Add backend fields only if helper tests prove current safe DTO cannot represent required state.

### UI layout

Top:
- read-only/private/canonical banner;
- current office truth: snapshot/delta/safe event;
- 5-second summary.

Main:
- 2D office map with rooms and employees.
- Right/side selected-object mission inspector.

Below/folded:
- attention list;
- source/archive health;
- recent safe events;
- fallback list;
- diagnostics drawer.

### Implementation plan

Phase 0 through Phase 6 above. First approved implementation should be Phase 1 + small Phase 2, not renderer dependency adoption.

### Risks/tradeoffs

- Overtrust risk: mitigated by truth labels and no fake speech/progress.
- Visual clutter: mitigated by density modes, room caps, fallback list.
- Accessibility risk: mitigated by DOM buttons, ARIA labels, text fallback, reduced motion.
- Raw leakage risk: mitigated by OfficeState-only input and raw-field tests.
- Dependency risk: avoid Phaser/Pixi/canvas until evidence demands it.
- Performance risk: cap entities and aggregate counts first.
- Product drift: avoid adding more HUD strips; make office scene primary.

### Acceptance criteria

- User opens browser `/office` and sees Hermes activity as a 2D office.
- Every visible character/object corresponds to real OfficeState/safe event data.
- Clicking an object reveals the exact safe underlying task/session/source/event reference or aggregate source category.
- No fake progress, random activity, raw prompts, transcripts, task bodies, logs, scripts, tokens, provider/model identity, or numeric Telegram topic IDs are shown.
- UI remains useful as a read-only operational dashboard with animations disabled.
- First version runs locally/private dashboard without external cloud services.
- Browser smoke reports no JS console errors and raw leak probes are false.

### Optional future ideas

- Renderer decision gate: Canvas vs Phaser vs Pixi after CSS/SVG evidence.
- Original sprite pack after license review.
- Safe event stream/SSE only after read-only endpoint and redaction-before-emit tests.
- Dry-run communication preview.
- Approved Kanban write-through actions.
- Per-domain floors: clinic-growth, life-compass, data-curation, hermes-ops.
- Replay mode using safe event history only.

---

## First approval recommendation

Recommended next approved implementation slice:

```text
AI Office RPG Visualizer Phase 1만 진행해. frontend view-model/test 중심으로 `OfficeRpgScene` adapter를 만들고, UI/서비스/게이트웨이/백엔드 변경은 approval-required로 멈춰.
```

If the user wants visible progress immediately after Phase 1:

```text
Phase 1 통과 후 Phase 2의 CSS/SVG static 2D map까지 진행해. 외부 renderer dependency, sprite asset, mutation control, backend schema/API change는 approval-required로 멈춰.
```
