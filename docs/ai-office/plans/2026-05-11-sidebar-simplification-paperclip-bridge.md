# Stage 17-A — Sidebar simplification and Paperclip bridge planning

Date: 2026-05-11 KST
Branch: `ai-office-stage16e-safe-spatial-choreography-20260510`

## Why

AI Office is now a first-class dashboard surface. The left sidebar still exposes many flat dashboard routes at once, so the Office scene competes with navigation chrome. The sidebar should present only the main entry points immediately and fold secondary tools into a few understandable groups.

The next product question is how to attach Paperclip-style external agent/workspace context to this dashboard without turning the Office into a raw transcript/log viewer.

## Scope implemented in this slice

- Keep primary routes visible:
  - `세션`
  - `오피스`
  - `채팅` when embedded chat is enabled
- Fold secondary built-in routes into collapsible groups:
  - `운영`: analytics, models, logs, cron
  - `도구함`: skills, plugins, profiles
  - `설정 · 도움말`: config, keys, docs
  - `더 보기`: any future unknown built-in entry
- Keep plugin tabs in their existing separate plugin section so plugin visibility controls remain predictable.
- Add a pure grouping helper and focused unit test so future routes do not accidentally flatten the sidebar again.

## Paperclip bridge direction

Treat Paperclip as an attached workbench/source, not as another always-visible top-level menu by default.

Recommended first integration shape:

1. Add a safe source adapter or plugin tab that projects Paperclip sessions/tasks into the existing Office safe DTO vocabulary.
2. Show it in `/office` as a room/source card or character role only after redaction:
   - counts
   - statuses
   - source health
   - workspace/project label if explicitly allowlisted
   - last safe activity timing bucket
3. Keep the raw Paperclip material out of the browser DTO:
   - prompts
   - transcripts
   - tool args
   - task bodies/results
   - logs
   - credentials/tokens
   - provider/model identity
4. If Paperclip needs its own page, prefer a folded `도구함`/plugin entry or an Office inspector deep link, not a new permanently visible sidebar top-level item.
5. Do not add Paperclip mutation controls from Office in the first pass. Start read-only; add actions only behind a separate approval model.

## Open questions before implementation

- What is the actual Paperclip connection surface: local filesystem, API, plugin manifest, session-search source tag, or external service?
- Is the desired view “Paperclip as another agent character/workbench” or “Paperclip task queue embedded in Office inspector”?
- Which Paperclip identifiers are safe to display by default, if any?
- Should Paperclip be visible on the VPS dashboard, Mac dashboard, or both?

## Verification target for this slice

- Sidebar shows only primary routes plus folded groups by default.
- Active child routes auto-open their folded group.
- `/office` still renders as the primary Office scene.
- No Paperclip runtime integration is added yet; this is only the safe bridge plan.
