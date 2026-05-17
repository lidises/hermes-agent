# AI Office Desk RPG Implementation Roadmap 1

> **For Hermes:** Implement this roadmap one slice at a time. For code slices, use TDD: focused RED test, minimal GREEN implementation, focused/full checks, browser smoke, docs handoff, commit. Do not skip safety boundaries.

**Goal:** Turn the completed Master Spec contracts into a small, safe implementation sequence for the Desk RPG/JRPG operating room.

**Architecture:** Start with a pure projection/view-model helper that maps existing safe Office state into a Desk RPG operating-room DTO. Then add a read-only DOM/CSS room surface using stable `data-office-*` hooks and inspector-safe copy. Mutation, approval recording, dispatch, NAS write, audit write, dry-run execution, rollback execution, backend mutation routes, service operations, and renderer replacement stay out of the roadmap until separately approved and designed.

**Tech Stack:** React, TypeScript, Vitest, Testing Library, Vite, DOM/CSS. No Phaser/Pixi/canvas renderer dependency. No backend schema/route/service change in the first implementation wave.

---

## Source contracts

This roadmap is based on the completed Master Spec contract sequence:

1. `docs/ai-office/product/desk-rpg-product-vision.md`
2. `docs/ai-office/architecture/desk-rpg-projection-model.md`
3. `docs/ai-office/product/desk-rpg-ia-layout.md`
4. `docs/ai-office/architecture/controlled-mutation-approval-model.md`

Supporting evidence and legacy context:
- `docs/ai-office/plans/2026-05-14-desk-rpg-master-spec-review.md`
- `docs/ai-office/architecture/unified-operating-workbench.md`
- `docs/ai-office/product/unified-operating-workbench.md`
- `docs/ai-office/NEXT.md`
- `docs/ai-office/STATUS.md`

## Roadmap principle

Do not jump directly to a visually rich game renderer or executable controls.

The first implementation wave should prove that the existing `/office` safe state can be projected into a calm Desk RPG room without leaking raw/private data or implying unapproved execution.

Order of work:

```text
pure projection DTO
→ read-only room surface
→ inspector/tab migration
→ request/approval posture panel
→ accessibility/reduced-motion hardening
→ only later: controlled mutation implementation design
```

## Non-negotiable boundaries

These remain forbidden in this roadmap unless a later document explicitly reopens them:

- no backend mutation route/service;
- no backend schema change for mutation;
- no work assignment;
- no request/proposal persistence;
- no enqueue;
- no dispatch;
- no execution;
- no approval recording;
- no authority grant;
- no dry-run execution;
- no audit write;
- no rollback execution;
- no NAS write;
- no direct NAS credentials/mounts;
- no VPS/service/cron/gateway/public exposure change;
- no service restart as part of local implementation;
- no renderer dependency replacement;
- no Phaser/Pixi/canvas/minimap/game-camera dependency;
- no forms/buttons/executable browser controls;
- no raw prompt/source/log/path/token projection.

## Implementation wave 1: safe Desk RPG projection and room shell

### Slice 1: Desk RPG Projection ViewModel Helper 1

**Objective:** Create a pure helper that converts existing safe Office view state into a Desk RPG projection DTO without rendering UI or adding controls.

**Files:**
- Modify: `web/src/pages/officeView.ts`
- Modify: `web/src/pages/OfficePage.test.ts`
- Docs after GREEN: `docs/ai-office/NEXT.md`, `docs/ai-office/STATUS.md`, unified architecture/product docs

**Expected public helper:**

```ts
buildOfficeDeskRpgProjectionModel(stateOrView): OfficeDeskRpgProjectionModel
```

**DTO requirements:**

```text
schemaVersion
sourcePosture
actors[]
facilities[]
boardState
evidenceState
vaultState
opsState
inspectorTargets[]
suppressedCounts
redactionSummary
safeProjectionOnly: true
enabledControls: 0
rawExcluded: true
```

**Required actors:**
- user_boss
- orchestrator
- search_worker
- reviewer
- wiki_writer
- nas_keeper

**Required facilities:**
- boss_desk
- orchestrator_desk
- worker_cluster
- central_board
- right_inspector
- nas_vault
- security_ops_corner
- calm_activity_lane

**Step 1: Write focused RED test**

Add a test named:

```text
Desk RPG Projection ViewModel Helper 1
```

Assertions:
- helper exists and returns the required actors/facilities;
- `enabledControls` is `0`;
- `safeProjectionOnly` is `true`;
- `rawExcluded` is `true`;
- worker clone cap/suppression metadata exists;
- no raw prompt, private path, token-shaped value, backend traceback, or provider hidden id leaks into the DTO.

**Step 2: Verify RED**

Run:

```bash
cd web
npm test -- --run OfficePage.test.ts -t "Desk RPG Projection ViewModel Helper 1"
```

Expected: FAIL because `buildOfficeDeskRpgProjectionModel` is not a function.

**Step 3: Implement minimal helper**

Implement only the pure helper and types in `officeView.ts`. Use deterministic safe strings and existing safe view-model data where available. Do not add React UI, browser controls, API calls, storage writes, backend routes, or dependencies.

**Step 4: Verify GREEN**

Run:

```bash
cd web
npm test -- --run OfficePage.test.ts -t "Desk RPG Projection ViewModel Helper 1"
```

Expected: PASS.

**Step 5: Focused regression checks**

Run:

```bash
cd web
npm test -- --run OfficePage.test.ts
npx eslint src/pages/officeView.ts src/pages/OfficePage.test.ts
```

Expected: PASS.

**Step 6: Docs and commit**

Update handoff docs and commit:

```bash
git diff --check
git add web/src/pages/officeView.ts web/src/pages/OfficePage.test.ts docs/ai-office/NEXT.md docs/ai-office/STATUS.md docs/ai-office/architecture/unified-operating-workbench.md docs/ai-office/product/unified-operating-workbench.md
git commit -m "Add AI Office Desk RPG projection model helper"
```

### Slice 2: Desk RPG Room Shell 1

**Objective:** Render the safe projection DTO as a read-only DOM/CSS fixed-office surface without replacing the renderer or adding executable controls.

**Files:**
- Modify: `web/src/pages/OfficePage.tsx`
- Modify: `web/src/pages/OfficePage.test.ts`
- Modify: CSS file used by `OfficePage` if required by existing structure
- Docs after GREEN: `docs/ai-office/NEXT.md`, `docs/ai-office/STATUS.md`, unified architecture/product docs

**Required DOM hooks:**

```text
data-office-desk-rpg-room
data-office-desk-rpg-global-ribbon
data-office-desk-rpg-boss-desk
data-office-desk-rpg-orchestrator-desk
data-office-desk-rpg-worker-cluster
data-office-desk-rpg-central-board
data-office-desk-rpg-right-inspector
data-office-desk-rpg-nas-vault
data-office-desk-rpg-security-ops
data-office-desk-rpg-calm-activity-lane
data-office-desk-rpg-enabled-controls
data-office-desk-rpg-safe-projection-only
```

**Step 1: Write focused RED test**

Test name:

```text
Desk RPG Room Shell 1
```

Assertions:
- room shell hook exists;
- all required zones render;
- enabled controls count is `0`;
- there are no forms;
- mutation/action button labels are absent;
- safe Korean room copy appears;
- private sentinel strings do not appear.

**Step 2: Verify RED**

Run:

```bash
cd web
npm test -- --run OfficePage.test.ts -t "Desk RPG Room Shell 1"
```

Expected: FAIL because the room shell hook does not exist.

**Step 3: Implement minimal UI**

Use the helper from Slice 1. Render a compact room surface above or in place of future strip-heavy sections according to IA/Layout. Do not delete existing verified sections unless a separate migration slice does that. Do not add buttons/forms.

**Step 4: Verify GREEN and regression**

Run:

```bash
cd web
npm test -- --run OfficePage.test.ts -t "Desk RPG Room Shell 1"
npm test -- --run OfficePage.test.ts
npm test -- --run OfficePage.rpg.test.tsx
npx eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx
npm run build
git diff --check
```

Expected: PASS except the known Vite chunk-size warning may remain.

**Step 5: Browser smoke**

Start local-only preview or reuse the approved local smoke pattern:

```bash
cd web
npm run preview -- --host 127.0.0.1 --port 4173
```

Browser smoke URL:

```text
http://127.0.0.1:4173/office?desk-rpg-room=1
```

Check:
- HTTP 200 or expected unauth fallback with no raw leak;
- console/js errors absent;
- forms count `0`;
- dangerous action controls absent;
- `data-office-desk-rpg-room` visible when authenticated/mock state allows it;
- raw prompt/path/token/provider sentinels absent.

**Step 6: Docs and commit**

Update handoff docs and commit:

```bash
git add web/src/pages/OfficePage.tsx web/src/pages/officeView.ts web/src/pages/OfficePage.test.ts docs/ai-office/NEXT.md docs/ai-office/STATUS.md docs/ai-office/architecture/unified-operating-workbench.md docs/ai-office/product/unified-operating-workbench.md
git commit -m "Add AI Office Desk RPG room shell"
```

### Slice 3: Desk RPG Inspector Migration 1

**Objective:** Move one detail-heavy readiness/approval surface into the right inspector model without deleting safety evidence or adding controls.

**Candidate source family:** controlled mutation execution readiness summary.

**Rules:**
- migrate display posture only;
- preserve existing test coverage;
- add stable inspector hooks;
- no approval/dispatch/write controls;
- no raw leak.

### Slice 4: Desk RPG Board Evidence Tab 1

**Objective:** Represent Paperclip/sourceTags/evidence as central board tab posture using counts and safe summaries only.

**Rules:**
- no raw source body viewer;
- no local/NAS paths;
- no source title leak when sensitive;
- inspector gets redacted aggregate detail only.

### Slice 5: Desk RPG Request Posture 1

**Objective:** Show natural-language instruction and worker quick-action request posture as disabled/read-only model, not real request creation.

**Rules:**
- no request persistence;
- no forms/buttons;
- no enqueue/dispatch;
- no approval recording;
- `enabledControls: 0`.

### Slice 6: Desk RPG Accessibility and Reduced Motion 1

**Objective:** Harden the room surface for keyboard focus, semantic structure, text fallback, and reduced-motion posture.

**Rules:**
- no animation dependency;
- no renderer replacement;
- status must not rely on color alone;
- room remains understandable without motion.

## Deferred implementation waves

### Wave 2: controlled mutation backend design

Start only after the read-only room is stable and separately approved.

Required before any code:
- backend authority policy design;
- audit sink design;
- rollback strategy design;
- dry-run execution design;
- CLI confirmation design;
- request persistence design;
- security review.

Still forbidden until explicitly approved:
- execution route;
- approval recording;
- NAS write;
- audit write;
- dry-run execution;
- rollback execution;
- service restart/deploy controls.

### Wave 3: projection ingest/promote dry-run

If projection promotion becomes the next priority, start with dry-run-only helper/API that returns safe would-promote/would-reject metadata and performs no file writes or state changes.

### Wave 4: VPS/private deploy

Deploy only after local implementation is committed and separately approved.

Rules:
- dashboard worktree only;
- gateway untouched;
- private listener only;
- no public exposure;
- restart dashboard service only if assets/code changed and restart is approved;
- smoke `/office` with browser console/raw-leak checks.

## Acceptance criteria for this roadmap

`Implementation Roadmap 1` is complete when:

1. This repo-local roadmap exists.
2. It names the completed source contracts.
3. It chooses the first safe implementation slice: `Desk RPG Projection ViewModel Helper 1`.
4. It defines at least the first two slices with files, RED/GREEN tests, verification commands, and commit messages.
5. It preserves no-backend/no-mutation/no-renderer-dependency/no-VPS/NAS/Kanban/cron/service boundaries.
6. It defines browser smoke and raw-leak sentinel expectations before UI coding.
7. It documents deferred waves for controlled mutation backend design, projection dry-run promotion, and VPS deploy.
8. `NEXT.md`, `STATUS.md`, and unified product/architecture docs now record `Desk RPG Inspector Migration 1` completion and point to `Desk RPG Board Evidence Tab 1` as the next implementation slice.

## Next recommended slice

`Desk RPG Board Evidence Tab 1`

Purpose:
- write a focused RED test for stable `data-office-desk-rpg-board-*` hooks;
- migrate safe board/evidence posture from `buildOfficeDeskRpgProjectionModel` into a central board tab/section;
- assert aggregate-only safe fields, zero forms, zero enabled controls, no mutation/action controls, and private sentinel exclusion;
- run focused/full frontend checks, build, diff-check, static scan, and local-only browser smoke;
- update handoff docs;
- commit before request posture/accessibility migration.
