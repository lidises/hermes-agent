# Hermes AI Office — STAGE MAP

This is the current working stage map for Hermes AI Office / Desk RPG / RPG Visualizer.

This file is now a living map, not the original pre-implementation plan. It records what has already happened, where the project is now, and what remains through Stage 14.

Current canonical product surface:
- `/office`
- RPG Visualizer-first default view
- Kanban, NAS Keeper, Paperclip, Projection Cache, controlled-mutation, diagnostics, and legacy Office shells are supporting layers/tabs/drawers, not competing top-level products.

Current live position:
- Overall stage: Stage 13 active and locked as the active work stage until the user explicitly advances; Stage 14 remains closed.
- Latest local rung: Stage 13 route-aligned sprite phase polish added inside the primary SVG RPG map: visible sprites now declare route-synced phase/target metadata, the map shows `동선 맞춤 이동`, and sprite shadows pulse with route-aligned CSS timing.
- Latest completed/deployed rung: Stage 13 walking route/path polish is deployed/smoked on the VPS dashboard from `5b92d82f0`: primary SVG RPG map has a read-only CSS-motion walking-route layer, two no-refresh pulsing route paths, and a timed browser sample proved route strokeDashoffset changed without refresh.
- Prior deployed rung: Stage 13 live sprite movement baseline is deployed/smoked on the VPS dashboard from `fd45e834e`: primary SVG RPG map has a read-only CSS-motion sprite layer, all visible characters are no-refresh idle/patrol motion sprites, CSS animation is infinite, and a timed browser sample proved sprite position changed without refresh.
- Prior deployed rung: Stage 13 actor/facility grouping cues were added inside the primary SVG RPG map and deployed/smoked on the VPS dashboard from `287021294`: all six room groups now declare visible-actor grouping, per-room facility zone, and compact Korean grouping label; grouping hooks hydrated, primary RPG map visible, controls inside visual map 0, raw leak false, console errors 0.
- Prior deployed rung: Stage 13 mobile label readability hooks were added inside the primary SVG RPG map and deployed/smoked on the VPS dashboard from `84eab5e21`: each room group now declares `mobile-readable` label stacking, per-room safe zone, max Korean label length, and protected mobile label baseline.
- Prior deployed rung: Stage 13 compact Korean facility copy was added inside the primary SVG RPG map and deployed/smoked on the VPS dashboard from `1702c0f0c`: each room now has a short map-internal Korean cue such as decision/boundary check, evidence storage, or blocked-issue review.
- Current write boundary: the one-shot Mac relay production approval remains consumed; any additional or replacement real NAS write requires a fresh explicit approval and fresh packet. VPS direct NAS authority remains closed/fail-closed.
- Prior RPG rung: mobile/small-screen RPG map layout cues added to the primary SVG RPG map: scroll-snap layout hook, pinch/pan cue, responsive SVG hook, and narrow-screen CSS.
- Prior write rung: exact-approved one-shot Mac relay production write completed from a fresh packet; one markdown file plus one audit sidecar were written through the Mac relay, readback verified, and a metadata-only completed-write receipt recorded.
- Prior RPG rung: Stage 13 Korean room labels and room/entity visual hierarchy cues were added inside the primary SVG RPG map.
- Current requested rung: continue RPG Visualizer-first Stage 13 quality with mobile label readability or room/entity hierarchy polish; do not force-replay failed_guarded or already-succeeded queue items.

## Stage 0 — Project charter and operating protocol

Status: complete / maintain.

Purpose:
- Establish project scope, context preservation, approval gates, and handoff workflow.

Durable outputs:
- `STATUS.md`
- `NEXT.md`
- `DECISIONS.md`
- `OPEN-QUESTIONS.md`
- `STAGE-MAP.md`

Current note:
- Handoff docs remain the durable project memory, but UI should not expose every stage summary by default.

## Stage 1 — Research and reference audit

Status: complete enough / reference only.

Purpose:
- Study Pixel Agents, standalone/Codex forks, Smallville/Generative Agents, and agent observability patterns.

Current note:
- The project no longer treats Pixel Agents as the product frame. The chosen product frame is AI Office RPG Visualizer.

## Stage 2 — Hermes data-source audit

Status: complete enough / maintained opportunistically.

Purpose:
- Identify what Hermes/VPS/Kanban/projection/NAS Keeper surfaces expose safely.

Current note:
- The audit evolved into read-only DTOs, protected aggregate APIs, projection cache posture, and live/private dashboard smoke discipline.

## Stage 3 — Product requirements and information architecture

Status: implemented and superseded by RPG Visualizer-first IA.

Purpose:
- Define user stories, screens, redaction boundaries, mutation boundaries, and MVP acceptance criteria.

Current product decision:
- `/office` is the canonical surface.
- The default page should show the actual AI Office RPG Visualizer, not long status/stage/readiness summaries.
- Detailed status/readiness evidence should be hidden behind fixed-off or default-closed read-only drawers unless the user asks to inspect it.

## Stage 4 — Provenance and routing design

Status: implemented in multiple safe/read-only forms.

Purpose:
- Preserve source, delivery, and routing context without leaking raw values or granting mutation authority.

Current note:
- Provenance is represented through safe refs, checksums, sanitized source categories, protected APIs, and audit/readback metadata.
- Raw Telegram topic IDs, raw paths, secrets, raw markdown, and write payloads remain out of UI/docs/handoff summaries.

## Stage 5 — Technical architecture design

Status: complete enough / evolved through implementation.

Purpose:
- Define backend APIs, adapters, frontend components, tests, deployment, and rollout path.

Current architecture:
- VPS is the canonical AI Office core/dashboard runtime.
- Mac/WSL are relay/status/capability nodes, not competing canonical boards.
- Dashboard deploys are private/Tailscale-first and use focused tests, build, `web_dist` rsync, dashboard-only restart, and protected API/DOM smoke.

## Stage 6 — Read-only dashboard MVP implementation

Status: complete.

Delivered:
- Basic `/office` page.
- Read-only Office state projection.
- Protected/private dashboard posture.
- Redaction and raw-leak boundaries.
- Focused frontend/backend tests and browser smoke patterns.

Superseded default:
- The old broad dashboard/status-page feel should not dominate the default Office page anymore.

## Stage 7 — Provenance capture implementation

Status: largely complete for current use.

Delivered:
- Safe metadata projections.
- Source/provenance/readback cues.
- Protected aggregate state and evidence panels.
- Handoff/status docs used for durable project context.

Still gated:
- New durable provenance writes beyond approved metadata-only rungs.
- Any raw source echo.

## Stage 8 — Pixel/RPG office visualization MVP

Status: complete and actively used.

Delivered:
- AI Office RPG Visualizer map.
- Read-only room/entity/facility projections.
- Character/facility/status overlays.
- Desk RPG/AI Office operating-room model.
- Default route increasingly centered on the RPG Visualizer rather than a generic dashboard.

Current direction:
- Keep this as the primary visual surface.
- Avoid adding another renderer/dependency unless evidence shows the in-stack SVG/React visualizer cannot satisfy the need.

## Stage 9 — Browser interaction and control layer

Status: partially implemented as read-only/disabled posture only.

Delivered safely:
- Inspector interactions.
- Read-only click/keyboard inspection posture.
- Disabled approval dialogue surfaces.
- Display-only operator/readiness/status panels.

Still gated:
- Browser-side mutation controls.
- Kanban mutation controls.
- Runtime execution controls.
- NAS write controls.
- Dispatcher/adapter/authority activation.

Rule:
- Interactions may inspect or explain safe refs. They must not execute mutations without a new explicit approval boundary.

## Stage 10 — Multi-device / NAS / Obsidian integration

Status: advanced; production write boundary crossed once under exact approval.

Delivered:
- NAS Keeper ladder from safe preview/readiness to Mac relay tmp-root smokes.
- Metadata-only records and idempotent replay checks.
- One exact-approved Mac relay real NAS production write.
- Metadata-only completed-write receipt and read-only projection.

Still gated:
- Additional real NAS production writes.
- Replacement writes.
- Actual cleanup delete/move/archive/write.
- Direct VPS NAS authority or NAS credentials on VPS.

Rule:
- Any additional real or replacement write requires a fresh exact approval.

## Stage 11 — Safety/readiness rendering and long-term polish

Status: complete for NAS Keeper Step 11; continuing as polish discipline.

Delivered:
- Step 11 read-only NAS Keeper status renderer.
- Protected aggregate hydration.
- Metadata-only hydration receipt.
- Hydration replay/idempotency probe.
- Completed real-write receipt projected read-only in `/office`.
- Zero controls/raw-leak posture for Step 11 panels.

Polish direction:
- Stage/readiness detail exists for operators and tests, but should not be visible in the default user-facing Office page.
- Summary/status layers should be hidden by default or kept behind read-only drawers.

## Stage 12 — RPG Visualizer-first unified workbench consolidation

Status: complete for current default-surface acceptance; maintain.

Completed rungs:
1. Former Kanban/Paperclip/Projection/RPG/NAS Keeper surfaces modeled as aliases/layers of the unified workbench.
2. Legacy top shell absorbed: old `Hermes AI 오피스` hero, focus row, diagnostics HUD, and live operations layer moved into RPG detail drawers.
3. RPG sub-scenes folded behind default-closed drawers.
4. Kanban operations room absorbed into the RPG Visualizer detail/tab system.
5. Stage/status/summary/detail layers fixed hidden by default; VPS `/office` smoke proves RPG map primary and summary layers visible 0.

Maintenance rule:
- Keep `/office` default presentation on the actual RPG Visualizer first.
- Keep implementation and evidence in code/tests/protected APIs, but do not show those summaries unless explicitly re-enabled for inspection.

Acceptance criteria:
- Default DOM has the RPG visual map as the primary visible surface.
- Summary/detail drawers are fixed hidden by default.
- No visible status badge strip, stage summary, readiness ladder, Kanban operations summary, NAS Keeper summary, or diagnostic evidence grid appears in default view.
- Existing technical evidence remains available in source/tests and can be re-enabled deliberately, but remains read-only.
- No new controls, backend authority, writes, public exposure, or gateway restart.

## Stage 13 — RPG operating experience depth

Status: active; first hierarchy cue rung complete locally.

Completed rungs:
1. Added read-only room/entity hierarchy cues inside the primary SVG map: room tiers (`control`, `execution`, `evidence`), visible actor count bars/labels, and priority dots.

Purpose:
- Make the RPG Visualizer itself richer and more useful without reintroducing dashboard clutter.

Candidate rungs:
1. Improve room/entity visual hierarchy in the SVG map.
2. Improve Korean labels and role/facility copy.
3. Add compact in-map cues instead of external summaries.
4. Refine character state/bubble/inspector alignment.
5. Improve mobile and small-screen RPG map layout.
6. Add optional user-triggered inspector views that are still read-only.

Non-goals unless separately approved:
- New renderer dependency.
- Public exposure.
- Runtime mutation controls.
- NAS/Kanban writes.

## Stage 14 — Operationalization and durable runtime discipline

Status: future / approval-gated.

Purpose:
- Turn the mature RPG Visualizer-first AI Office into a stable private operating surface while preserving safety boundaries.

Candidate rungs:
1. Private deployment hardening and dashboard/core sync discipline.
2. Observability for dashboard health that does not expose raw data.
3. Retention/cleanup planning and replay hardening for metadata artifacts.
4. Optional authority designs as documents/contracts only before implementation.
5. Explicit approval workflows for any future real write, replacement write, Kanban mutation, dispatcher, watcher, or adapter path.
6. Long-term performance and bundle-size cleanup if evidence shows a real user-facing issue.

Hard gates:
- No direct VPS NAS authority unless the user separately approves a new architecture and credential boundary.
- No watcher/cron/dispatcher/authority-adapter activation without exact approval.
- No public exposure without a separate exposure/security design.
- No gateway restart as a side effect of dashboard UI work.
- No raw markdown/path/secret/write-payload echo.

## Current recommended next step

Start Stage 13 with one visual/read-only RPG-internal improvement:
1. Pick exactly one small rung: room/entity hierarchy, Korean labels/copy, compact in-map cues, character/facility copy, or mobile/small-screen layout.
2. Add RED helper/component tests first.
3. Implement only the frontend/read-only visual change; do not add external summaries.
4. Verify focused RPG tests, full Office frontend tests, build, `git diff --check`, raw-leak/control scan, and DOM smoke.
5. If deploying, sync dashboard/core assets and restart only dashboard/core services; do not restart gateway.

## Approval gates

Explicit user approval is required before:

1. Creating or mutating Kanban boards/tasks.
2. Additional real NAS production writes or replacement writes.
3. Actual NAS cleanup delete/move/archive/write.
4. Direct VPS NAS authority, mounts, credentials, or direct VPS NAS writes.
5. Adding watcher/cron/dispatcher/authority-adapter/runtime execution paths.
6. Exposing dashboard beyond private/Tailscale scope.
7. Restarting gateway.
8. Adding dependencies or replacing the renderer.
9. Rendering raw markdown, raw path/root, token/secret values, or raw write payloads.
10. Enabling browser-side mutation controls.

Approved for ordinary Stage 12 visual/read-only rungs:
- Local edits/tests/build.
- Docs updates.
- Commit/push.
- Dashboard/core sync and `web_dist` rsync.
- Dashboard/core restart and protected API/DOM smoke, when deployment is explicitly in scope.
