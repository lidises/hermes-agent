# AI Office minimal dashboard mode — 2026-05-19

## Why this exists

The current VPS `/office` dashboard had accumulated many experimental/readiness panels from prior AI Office slices. Most of those panels are not part of the user's current day-to-day operating surface. Until the proper AI Office/Desk RPG product is ready, the live dashboard should be calm and show only the important read-only status areas.

## Current display rule

Default `/office` should prioritize:

1. Unified read-only AI Office posture / safety summary.
2. Basic Hermes AI Office read-only header, refresh, and private-access posture.
3. Top-level status counts.
4. Canonical Kanban/operating posture summary.
5. Source health and attention-needed summary.
6. Existing work/automation/routing/event lists only through the normal focus filters.

Default `/office` should not show the accumulated legacy diagnostic chain by default:

- Desk RPG room/boss/worker/approval dialogue panels.
- Approval/request/event/NAS Keeper ladder panels.
- Controlled-mutation proposal/dry-run/audit/rollback/readiness panels.
- Dispatcher/target/watcher/runtime status panels.
- Character/facility completion-review strips.
- Paperclip workbench secondary surface.

Those surfaces are not deleted. They are preserved behind source constants in `web/src/pages/OfficePage.tsx` so they can be restored or selectively reintroduced when the real AI Office surface is ready:

- `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES = false`
- `SHOW_OFFICE_SECONDARY_DETAILS = false`

## Boundary

This is a temporary visual declutter change only.

- No backend route/schema/storage change.
- No gateway/core change.
- No NAS credential/mount expansion.
- No dashboard mutation authority expansion.
- No removal of existing component implementations/tests.

## Verification

Local verification run:

```bash
npm --prefix web run build
```

Result: passed. Vite chunk-size warning remains the existing large-dashboard warning, not a new functional failure.

## Reversal / next AI Office integration

When the proper AI Office surface is ready, do not simply flip all hidden lanes back on. Reintroduce only the parts that match the new product IA, ideally as 1-2 deliberate sections with clear names and zero executable controls unless separately approved.
