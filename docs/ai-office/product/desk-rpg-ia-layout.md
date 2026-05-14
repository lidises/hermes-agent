# AI Office Desk RPG IA/Layout 1

Status: Draft product/IA contract
Last updated: 2026-05-14
Scope: documentation only; no UI implementation, code, backend schema, service, Kanban, cron, NAS, VPS, renderer dependency, or executable-control changes.

## Purpose

`Desk RPG IA/Layout 1` defines how the `/office` JRPG operating room should be organized before any further UI implementation happens.

The goal is to stop `/office` from becoming a pile of top-level dashboard strips. The operating room should be a single calm office scene with fixed zones, a central board, visible worker characters, a locked NAS/save boundary, a security/ops corner, and a right inspector that absorbs detail-heavy surfaces.

Source evidence:
- `docs/ai-office/product/desk-rpg-product-vision.md`
- `docs/ai-office/architecture/desk-rpg-projection-model.md`
- `docs/ai-office/plans/2026-05-14-desk-rpg-master-spec-review.md`
- `docs/ai-office/architecture/unified-operating-workbench.md`
- `docs/ai-office/product/unified-operating-workbench.md`
- `docs/ai-office/NEXT.md`
- `docs/ai-office/STATUS.md`

## Layout principle

Use one central fixed office, not a multi-room game and not another vertical dashboard stack.

Primary layout:

```text
+--------------------------------------------------------------------------------+
| Global status ribbon: source posture, stale state, read-only-first posture      |
+----------------------+-----------------------------------+---------------------+
| Boss desk            | Central Kanban/Paperclip board    | Right inspector     |
| - user_boss          | - task phase                      | - selected actor    |
| - instruction origin | - safe evidence counts            | - selected facility |
| - approval posture   | - approval/save posture           | - board/evidence    |
+----------------------+-----------------------------------+ - approval detail   |
| Orchestrator desk    | Worker desk cluster               | - safe logs/results |
| - mediation hub      | - role avatars                    | - redacted detail   |
| - pending requests   | - capped runtime helpers          |                     |
| - plan posture       | - blocked/reviewing/writing cues  |                     |
+----------------------+-----------------------------------+---------------------+
| NAS vault entrance   | Calm activity lane                | Security/ops corner |
| - locked/save gate   | - one speech bubble per zone      | - deploy/restart    |
| - NAS Keeper         | - last-known-good/stale posture   | - permission gates  |
+----------------------+-----------------------------------+---------------------+
```

This is an IA contract, not an implementation mandate for exact pixels.

## Required zones

### 1. Global status ribbon

Purpose:
- show whether the operating room is live, derived, stale, mock, or unavailable;
- show read-only-first/controlled-mutation posture;
- show safe bundle/projection state when available;
- avoid burying source trust in a hidden tab.

Allowed copy examples:
- “안전 투영 표시 중”
- “최근 안전 스냅샷 표시 중”
- “읽기 전용 운영실: 실행 권한 없음”
- “승인/권한 모델 준비 전”

Forbidden:
- backend tracebacks;
- local paths;
- provider/model secret identifiers;
- raw projection source names when sensitive;
- service control buttons.

### 2. Boss desk

Purpose:
- represent the user/boss avatar;
- anchor natural-language instruction origin;
- show later approval dialogue origin without enabling approval recording in MVP.

Contains:
- `user_boss` role avatar;
- command/request posture summary;
- approval-needed count;
- one safe speech cue at most.

MVP posture:
- no executable command form;
- no browser-side approval recording;
- instruction examples are non-executable copy until a later request pipeline exists.

### 3. Orchestrator desk

Purpose:
- make mediation visible;
- prevent direct worker-action mental model;
- show pending instruction/request routing posture.

Contains:
- `orchestrator` role avatar;
- current phase: receiving, planning, routing, blocked, waiting, approval-needed;
- safe plan summary/counts;
- mediated request queue posture.

Rules:
- natural-language instructions enter here before worker display changes imply execution;
- worker quick actions point back here as `WorkerActionRequested`, not direct work assignment;
- Orchestrator desk is the only place that should visually turn user intent into plan posture.

### 4. Worker desk cluster

Purpose:
- show role avatars and capped runtime helpers without noise.

Contains:
- `search_worker` role avatar plus up to 3 visible helper clones;
- `reviewer` role avatar;
- `wiki_writer` role avatar;
- safe status badges: working, reviewing, writing, blocked, waiting, complete;
- suppressed count indicator when runtime helpers exceed cap.

Rules:
- Search Worker fan-out is visualized through capped helpers and inspector counts;
- Reviewer/Wiki Writer stay as role avatars unless future evidence justifies clones;
- map-level worker text uses safe generated copy only;
- worker cluster never displays raw prompts, search terms, document titles, provider names, tool logs, local paths, or tokens.

### 5. Central Kanban/Paperclip board

Purpose:
- unify task state and evidence lineage as the room’s main information object.

Contains:
- current project/request phase;
- active/blocked/approval-needed counts;
- evidence candidate/reviewed counts;
- draft/result status;
- safe sourceTag/lineage posture;
- board tabs that the inspector can open.

Board tabs:
- `board`: Kanban/task posture summary;
- `evidence`: safe evidence counts and sourceTag summaries;
- `log_summary`: redacted aggregate event summary;
- `result_summary`: safe result/draft posture.

Rules:
- board is read-only in MVP;
- no Kanban state mutation from browser;
- no raw Paperclip/source body viewer;
- board click opens inspector target only.

### 6. Right inspector

Purpose:
- absorb detail-heavy surfaces that currently risk becoming top-level strips;
- keep the map calm;
- provide safe drill-down into selected actor/facility/board/evidence/approval posture.

Inspector surfaces:
- selected actor detail;
- selected facility detail;
- board tab detail;
- evidence summary;
- approval/readiness posture;
- redacted log summary;
- result summary;
- suppression/noise details.

Rules:
- inspector may show more detail than map, but still redacted/aggregate only;
- no raw prompts/logs/source bodies/local paths/tokens;
- no executable mutation buttons/forms;
- disabled/read-only explanations are allowed.

### 7. NAS vault entrance

Purpose:
- represent final-save boundary and NAS Keeper authority.

Contains:
- `nas_keeper` role avatar;
- vault status: locked, approval-needed, save-requested, unavailable;
- rollback/audit/readiness posture summary;
- safe “저장 승인 필요” style cue.

Rules:
- real NAS write excluded in MVP;
- `SaveCommitted` must not appear without later authority/audit/rollback implementation;
- no direct NAS mount/credential assumption;
- no browser-side save button.

### 8. Security/ops corner

Purpose:
- keep sensitive operational boundaries visible but non-executable.

Contains:
- deploy/restart/permission/projection-promote/cron-watch posture;
- locked/approval-required/CLI-required states;
- safe summary of why unavailable.

Rules:
- do not hide security-sensitive objects completely;
- do not make them clickable actions;
- no service restart/deploy/public exposure controls;
- no cron/watcher enablement.

### 9. Calm activity lane

Purpose:
- provide ambient life without visual spam.

Contains:
- one speech bubble per zone;
- one warning posture per unavailable source;
- small movement/status changes from visual projection events;
- last-known-good/stale copy.

Rules:
- repeated event chatter collapses into board/inspector counts;
- animations are optional and must respect reduced-motion;
- activity lane cannot imply unapproved execution.

## Existing strip/HUD disposition

The current top-level `/office` surfaces should not all remain first-class vertical strips in the Desk RPG room.

Disposition categories:

```text
keep_map_visible
move_to_board_tab
move_to_inspector
move_to_global_ribbon
move_to_security_ops_corner
hide_until_selected
retire_after_contract_supersedes
```

Initial disposition guidance:

| Existing surface family | Desk RPG destination |
| --- | --- |
| Unified workbench four-layer summary | central board + global ribbon |
| Approval request/readiness views | right inspector + NAS vault + boss desk posture |
| Approval audit timeline | inspector `log_summary` tab |
| Approval execution gate | security/ops corner + inspector |
| Authority adapter contract | security/ops corner + inspector |
| Orchestrator mediation queue | Orchestrator desk + inspector |
| Worker intent routing | Orchestrator desk + worker cluster + inspector |
| Worker facility readiness | worker cluster/facility badges + inspector |
| Worker assignment/request/confirmation envelopes | inspector approval/readiness surfaces |
| Dispatch dry-run/audit/rollback/final gate strips | security/ops corner + NAS vault + inspector |
| Controlled mutation proposal/dry-run/audit/rollback/human approval/authority/execution summaries | security/ops corner + NAS vault + inspector |
| Projection/cache/source posture | global ribbon + central board + inspector |
| Paperclip/sourceTags evidence | central board evidence tab + inspector |
| Raw logs/source/source bodies | not displayed |

Design rule:
- only current room state stays map-visible;
- contract/readiness chains move into inspector/security/vault surfaces;
- evidence/task state moves into board tabs;
- global trust/source posture moves into the ribbon.

## Navigation model

Primary interactions are read-only local UI interactions:
- select actor;
- select facility;
- open board tab;
- filter visible role family;
- jump from board item to actor/facility;
- show suppressed runtime helper count;
- show redaction/source posture.

Non-MVP interactions:
- submit live instruction;
- approve mutation;
- save to NAS;
- dispatch worker;
- promote projection;
- mutate Kanban;
- restart service;
- enable cron/watchers.

Those non-MVP interactions require the later `Controlled Mutation & Approval Model 1` and implementation roadmap.

## Accessibility and reduced-motion posture

MVP layout must remain understandable without sprite animation.

Requirements for future implementation:
- DOM/CSS readable structure before animation;
- keyboard-accessible actor/facility/board/inspector focus targets;
- reduced-motion mode disables movement loops and uses status badges instead;
- map state has text fallback;
- inspector headings preserve semantic structure;
- color is not the only status channel.

## Renderer posture

MVP remains React/TypeScript/Vite with DOM/CSS fixed-office layout.

Do not add:
- Phaser;
- Pixi;
- canvas tilemap engine;
- external sprite animation runtime;
- multi-room route system;
- minimap/game camera dependency.

Renderer decision may reopen only after IA/layout, accessibility, reduced-motion, bundle, browser smoke, raw-leak, and state-density evidence show DOM/CSS is insufficient.

## Safe visual vocabulary

Allowed map-level labels:
- “지시 접수”
- “계획 정리 중”
- “근거 찾는 중”
- “검토 대기”
- “초안 준비”
- “저장 승인 필요”
- “권한 준비 전”
- “최근 안전 스냅샷”

Forbidden map-level labels:
- raw prompt text;
- exact search query;
- unredacted source title when sensitive;
- local path;
- NAS path;
- token-shaped string;
- backend traceback;
- shell command;
- provider/model secret name.

## IA acceptance criteria

`Desk RPG IA/Layout 1` is complete when:

1. The repo contains this IA/layout contract.
2. A single central fixed-office layout is defined.
3. Required zones are defined: global ribbon, boss desk, Orchestrator desk, worker cluster, central Kanban/Paperclip board, right inspector, NAS vault, security/ops corner, calm activity lane.
4. Existing strip/HUD disposition categories are defined.
5. Initial disposition guidance maps current surface families into room destinations.
6. Read-only navigation model is separated from non-MVP mutation interactions.
7. Accessibility and reduced-motion requirements are documented.
8. Renderer non-adoption posture is preserved.
9. Safe/forbidden visual vocabulary is explicit.
10. `NEXT.md`, `STATUS.md`, and unified product/architecture docs point to the next recommended `Controlled Mutation & Approval Model 1` slice.

## Next recommended slice

`Controlled Mutation & Approval Model 1`

Purpose:
- define how natural-language instructions and worker quick actions become event requests;
- define Orchestrator mediation and approval/hold/deny routing;
- define NAS Keeper final-save approval/write boundary;
- define authority, audit, rollback, dry-run, and CLI confirmation posture before any executable implementation;
- preserve read-only browser posture until backend authority exists.
