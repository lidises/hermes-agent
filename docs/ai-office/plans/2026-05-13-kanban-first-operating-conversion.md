# AI Office Kanban-first operating conversion

Last updated: 2026-05-13 16:28 KST

## Scope

Convert the existing safe/read-only AI Office Kanban projection from a mostly historical status view into a real operating surface.

## Completed actions

1. Canonical VPS board confirmed: `ai-office`.
2. Created real operating backlog cards on the canonical board:
   - `t_83f3ff90` — `ops: AI Office Kanban operating rules v1`
   - `t_0fced671` — `report: live Kanban operating-room status`
   - `t_49757d89` — `review: Kanban-first operating conversion safety`
3. Linked the reporter/reviewer cards under the operating-rules parent so `/office` can show a real graph edge.
4. Added Mac convenience wrapper: `/Users/lidises/.local/bin/ai-office-kanban`.
   - Default command: canonical VPS `ai-office` `stats`.
   - Example: `ai-office-kanban list --json`.
   - The wrapper does not create a second local source of truth.
5. Added a read-only `/office` Kanban-first operating posture panel:
   - source of truth: VPS `ai-office`
   - open / active / blocked / done counts
   - guidance cards for intake, orchestration, review gates, and Mac relay status

## Operating rule v1

- Answer directly only for simple short replies that do not need durable tracking.
- Create a canonical Kanban card for file edits, service/runtime work, deployment, long-running work, reviewable clinic/content outputs, multi-node relay tasks, or anything that should survive `/new`.
- Route multi-role work to `ai-office-orchestrator` so it can create child graph cards.
- Use explicit block prefixes where relevant:
  - `review-required:`
  - `approval-required:`
  - `input-required:`
  - `credential-required:`
  - `blocked-by-node:`
- Keep `/office` read-only until a separate mutation-control approval/design exists.
- Do not expose secrets, raw transcripts, raw task bodies, numeric Telegram topic IDs, NAS credentials, or public routes.

## Verification

- `ai-office-kanban stats` returned canonical VPS board counts after the wrapper was installed.
- Focused frontend test passed:
  - `cd web && npm test -- --run OfficePage.test.ts`

## Deferred / still gated

- Dashboard mutation controls remain deferred.
- Active cron/watcher automation remains deferred.
- Public exposure remains excluded.
- VPS NAS mounts/direct NAS credentials/direct raw-source reads remain excluded.
