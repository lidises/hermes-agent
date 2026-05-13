# AI Office Kanban + Paperclip Unified Workbench Implementation Plan

> **For Hermes:** This is a planning document only. Do not implement from this document unless the user explicitly approves execution. If executing later, use `subagent-driven-development` and implement task-by-task with review gates.

**Goal:** AI Office `/office` should show Kanban work state and Paperclip/source-context state together as one safe, Korean-first, read-only workbench.

**Architecture:** AI Office remains the primary surface. Kanban provides execution/workflow state; Paperclip provides safe context/evidence/source projection. The two are connected by allowlisted `sourceTags` and safe IDs, not by raw file paths, prompts, transcripts, task bodies, logs, or secrets.

**Tech Stack:** Hermes dashboard backend, existing Kanban plugin API, React/Vite AI Office frontend, TypeScript pure view helpers, Vitest, safe Office DTOs, optional future MacBook/WSL relay-generated Paperclip manifests.

---

## 0. Product mental model

Use this separation throughout the implementation:

```text
Kanban    = 해야 할 일 / 실행 상태 / 담당 agent / blocked-review 흐름
Paperclip = 붙은 근거 / 자료 묶음 / source health / provenance-redaction 상태
AI Office = 둘을 함께 보여주는 상황실
```

The final user experience should answer:

1. 지금 어떤 작업이 돌고 있는가?
2. 어떤 agent/profile이 맡고 있는가?
3. 무엇이 막혔고 무엇이 승인 대기인가?
4. 이 작업에 어떤 근거/source/context가 붙어 있는가?
5. Paperclip/NAS/source projection이 안전하게 redacted 되었는가?
6. raw prompt/path/secret 없이 provenance를 확인할 수 있는가?

---

## 1. Non-negotiable boundaries

### 1.1 Read-only first

This plan must start as read-only projection only.

Do not add:

- create task button
- update task button
- approve/retry/reassign button
- Paperclip refresh button
- NAS write button
- relay execution button
- raw file browser
- raw log/session/task viewer

Mutation-capable controls require a later explicit approval-model design.

### 1.2 Browser DTO must never expose raw private material

Keep out of browser-facing DTOs, tooltips, ARIA labels, fixtures, tests, snapshots, and console logs:

- raw prompts
- raw transcripts
- raw tool args
- raw task body/result
- raw worker logs
- raw cron scripts
- credentials/tokens/API keys
- full private filesystem paths
- provider/model identity
- `auth.json` contents
- `.env` values
- NAS private document body text

### 1.3 VPS authority must not expand

This plan must not give the VPS:

- sudo
- Docker group access
- broad NAS credentials
- direct NAS read-write mount
- arbitrary MacBook/WSL relay shell
- Paperclip secrets

MacBook/WSL relays may generate safe summaries/manifests later, but VPS/Office consumes only sanitized projection DTOs.

### 1.4 AI Office remains primary

Do not create Paperclip as a new always-visible top-level sidebar app unless a later product review explicitly says so. Keep Paperclip as an Office workbench/source projection.

---

## 2. Relationship to existing surfaces

### Existing Kanban surface

The repo already has a Kanban dashboard plugin API mounted under:

```text
/api/plugins/kanban/
```

Important existing file:

```text
plugins/kanban/dashboard/plugin_api.py
```

The plugin has rich task/run/event/comment state and may include raw-ish fields such as task body, result, comments, run summaries, error payloads, and metadata. AI Office must not blindly reuse the full plugin payload. Build a separate safe projection layer.

### Existing AI Office frontend files

Likely implementation files:

```text
web/src/pages/officeView.ts
web/src/pages/OfficePage.tsx
web/src/pages/OfficePage.test.ts
```

### Existing Paperclip direction

Existing plan/reference already says Paperclip should be:

```text
safe source/workbench projection attached to Office
not a top-level app
not a mutation surface
not raw NAS/session browser
```

This plan extends that direction by adding Kanban work-state linkage.

---

## 3. Target UI shape

### 3.1 High-level layout

AI Office `/office` should eventually have:

```text
┌────────────────────────────────────────────────────┐
│ AI Office Korean-first header / safe-mode status   │
├────────────────────────────────────────────────────┤
│ Attention Rail                                     │
│ - blocked work                                     │
│ - stale/missing sources                            │
│ - approval-gated work                              │
│ - relay/source health warnings                     │
├───────────────────────┬────────────────────────────┤
│ Live Work Lane        │ Paperclip Context Bench     │
│ Kanban projection     │ source/context projection   │
│                       │                            │
│ - running             │ - source bundles            │
│ - blocked             │ - health                    │
│ - review              │ - item/warning counts       │
│ - ready/todo/done     │ - provenance/redaction      │
├───────────────────────┴────────────────────────────┤
│ Safe Inspector                                      │
│ selected task/source/character safe detail only     │
└────────────────────────────────────────────────────┘
```

### 3.2 Kanban card badges

Each projected Kanban work item may show source badges:

```text
[진행 중] 경희사슴 어깨통증 블로그 초안
담당: blog-writer
Sources: 3  Warnings: 1  Provenance: OK
```

Badge health meanings:

```text
green  = attached sources ok
yellow = partial/stale/warnings
red    = missing/error
gray   = no attached source or unknown
```

### 3.3 Paperclip source related work

Each Paperclip source should show related safe work items:

```text
어깨통증 자료 묶음
health: partial
items: 12
warnings: 1
relay: MacBook

Related work:
- research: 어깨 관절 해부학 보강
- draft: 블로그 초안 작성
- review: 의료표현 안전 점검
```

Only safe task IDs/titles/statuses are allowed. Do not show task body or raw worker output.

### 3.4 DeskRPG/Office map projection

Later visual layer:

```text
Planning Room     = todo/ready cards
Worker Desks      = running cards by assignee/profile
Review Table      = blocked/review/approval-needed cards
Archive Shelf     = Paperclip/source bundles
Inspector Panel   = selected safe detail
```

This should remain CSS/SVG/read-only first. Do not add a game renderer or new dependency in this plan.

---

## 4. Safe DTO contracts

### 4.1 `OfficeKanbanWorkItem`

Add a frontend-safe projection type, probably in `web/src/pages/officeView.ts` first:

```ts
export type OfficeKanbanWorkStatus =
  | "triage"
  | "todo"
  | "ready"
  | "running"
  | "blocked"
  | "review"
  | "done"
  | "archived"
  | "unknown";

export type OfficeSourceHealth =
  | "ok"
  | "partial"
  | "missing"
  | "stale"
  | "unavailable"
  | "error"
  | "unknown";

export type OfficeActivityBucket =
  | "now"
  | "recent"
  | "today"
  | "old"
  | "unknown";

export type OfficeKanbanWorkItem = {
  id: string;
  title: string;
  status: OfficeKanbanWorkStatus;
  assigneeLabel: string;
  priority: "low" | "normal" | "high" | "unknown";
  parentCount: number;
  childCount: number;
  sourceTags: string[];
  sourceCount: number;
  sourceHealth: OfficeSourceHealth;
  warningCount: number;
  lastActivityBucket: OfficeActivityBucket;
  safeSummary?: string;
};
```

Allowed source fields:

- `id`
- `title`, after sanitization/truncation
- `status`
- `assigneeLabel`, sanitized profile label only
- `priority`
- parent/child counts
- allowlisted source tags
- derived source health/count/warning count
- timing bucket, not raw timestamps if unnecessary
- short safe summary only if already redacted and length-limited

### 4.2 `OfficePaperclipSource`

```ts
export type OfficePaperclipSourceType =
  | "paperclip"
  | "nas_manifest"
  | "session_tag"
  | "relay_projection"
  | "unknown";

export type OfficePaperclipRelay =
  | "MacBook"
  | "WSL"
  | "VPS"
  | "unknown";

export type OfficePaperclipSource = {
  id: string;
  label: string;
  sourceType: OfficePaperclipSourceType;
  health: OfficeSourceHealth;
  itemCount: number;
  warningCount: number;
  relay: OfficePaperclipRelay;
  tags: string[];
  relatedWorkIds: string[];
  provenanceSummary: string;
  redactionSummary: string;
  lastIndexedBucket: OfficeActivityBucket;
};
```

Allowed fields:

- safe source ID
- safe label
- source type enum
- health enum
- counts
- relay label enum
- allowlisted tags
- related safe work IDs
- short provenance/redaction summaries
- activity/indexing bucket

### 4.3 `OfficeUnifiedWorkbench`

```ts
export type OfficeUnifiedWorkbench = {
  workItems: OfficeKanbanWorkItem[];
  sources: OfficePaperclipSource[];
  links: OfficeWorkSourceLink[];
  attention: OfficeWorkbenchAttentionItem[];
  summary: OfficeWorkbenchSummary;
};

export type OfficeWorkSourceLink = {
  workId: string;
  sourceId: string;
  tags: string[];
  health: OfficeSourceHealth;
  warningCount: number;
};

export type OfficeWorkbenchAttentionItem = {
  id: string;
  severity: "info" | "warning" | "error";
  label: string;
  kind: "blocked_work" | "source_warning" | "missing_source" | "approval_gated" | "relay_warning";
  workId?: string;
  sourceId?: string;
};

export type OfficeWorkbenchSummary = {
  totalWork: number;
  runningWork: number;
  blockedWork: number;
  reviewWork: number;
  doneWork: number;
  totalSources: number;
  warningSources: number;
  missingSources: number;
  rawLeakGuard: "passed" | "unknown";
};
```

---

## 5. Source-tag linking model

### 5.1 Do not link by raw paths

Bad:

```text
Kanban card -> /Users/lidises/nas/Hermes/private/raw/file.md
```

Good:

```text
Kanban card -> source:koreandeer-shoulder
Paperclip source -> source:koreandeer-shoulder
```

### 5.2 Allowlisted tag syntax

Start conservative. Accept only tags matching patterns like:

```text
source:<slug>
paperclip:<slug>
nas:<slug>
session:<slug>
topic:<slug>
project:<slug>
```

Slug rule:

```text
[a-zA-Z0-9][a-zA-Z0-9_.:-]{0,80}
```

Reject/drop tags containing:

- whitespace-heavy free text
- `/Users/`, `/home/`, `/mnt/`, `C:\`
- `secret`, `token`, `auth`, `.env`, unless used as a redaction status label and not a source tag
- raw prompt/transcript-like strings

### 5.3 Link derivation

Create links by intersecting safe tags:

```text
work.sourceTags ∩ source.tags != empty
```

If no source tags exist, card still appears but shows:

```text
Sources: none attached
sourceHealth: unknown
```

---

## 6. Phase plan

## Phase 0: Baseline and no-op planning gate

**Objective:** Confirm branch state and save this plan only. No product code changes.

**Files:**

- Create: `docs/ai-office/plans/2026-05-11-ai-office-kanban-paperclip-unified-workbench-plan.md`

**Suggested verification commands later:**

```bash
cd /Users/lidises/dev/hermes-agent
git status --short --branch
git log -1 --oneline
```

**Expected:** plan file exists; no implementation files changed.

**Commit suggestion if approved later:**

```bash
git add docs/ai-office/plans/2026-05-11-ai-office-kanban-paperclip-unified-workbench-plan.md
git commit -m "docs(office): plan Kanban Paperclip unified workbench"
```

---

## Phase 1: Pure safe workbench helper contract

**Objective:** Add pure TypeScript helper types and projection logic, with no backend integration and no UI wiring beyond tests.

**Files:**

- Modify: `web/src/pages/officeView.ts`
- Modify: `web/src/pages/OfficePage.test.ts`

**Task 1.1: Add failing test for safe unified workbench projection**

Test should create an Office-like fixture containing intentionally unsafe fields:

```ts
it("builds a safe Kanban Paperclip workbench without raw content", () => {
  const state = officeFixture({
    kanban: {
      tasks: [
        {
          id: "t_safe1",
          title: "경희사슴 어깨통증 블로그 초안",
          status: "running",
          assignee: "blog-writer",
          priority: "high",
          body: "raw task body must not appear",
          result: "raw result must not appear",
          metadata: {
            sourceTags: ["source:koreandeer-shoulder", "raw prompt must not appear"],
            path: "/Users/lidises/nas/secret/raw.md",
          },
        } as any,
      ],
    } as any,
    data_sources: [
      {
        id: "paperclip:koreandeer-shoulder",
        status: "partial",
        source_type: "paperclip",
        item_count: 12,
        warning_count: 1,
        relay: "MacBook",
        tags: ["source:koreandeer-shoulder", "raw transcript must not appear"],
        prompt: "raw prompt must not appear",
        transcript: "raw transcript must not appear",
        path: "/Users/lidises/nas/private/path",
      } as any,
    ],
  });

  const workbench = buildOfficeUnifiedWorkbench(state);

  expect(workbench.workItems).toHaveLength(1);
  expect(workbench.sources).toHaveLength(1);
  expect(workbench.links).toHaveLength(1);
  expect(workbench.summary).toMatchObject({
    totalWork: 1,
    runningWork: 1,
    totalSources: 1,
    warningSources: 1,
  });
  expect(JSON.stringify(workbench)).not.toMatch(/raw|prompt|transcript|secret|\/Users\/lidises\/nas/i);
});
```

Run:

```bash
cd web
npm test -- --run OfficePage.test.ts
```

Expected failure:

```text
buildOfficeUnifiedWorkbench is not exported
```

**Task 1.2: Implement minimal helper**

In `officeView.ts`, add:

- `OfficeKanbanWorkItem`
- `OfficePaperclipSource`
- `OfficeUnifiedWorkbench`
- `buildOfficeUnifiedWorkbench(state)`
- `sanitizeOfficeSourceTags(tags)`
- `deriveOfficeWorkSourceLinks(workItems, sources)`
- `buildOfficeWorkbenchAttention(workItems, sources, links)`

Implementation rules:

- Read unknown data defensively with `Record<string, unknown>` helpers.
- Drop any tag that does not match the allowlist.
- Truncate titles/labels/summaries.
- Never copy raw body/result/prompt/transcript/path into the output.
- Prefer `unknown` enum values over throwing.

Run:

```bash
cd web
npm test -- --run OfficePage.test.ts
```

Expected:

```text
PASS
```

**Task 1.3: Add edge-case tests**

Add tests for:

- no Kanban data
- no Paperclip data
- missing source tags
- blocked work creates attention item
- missing/error source creates attention item
- unsafe tags are dropped

Run:

```bash
cd web
npm test -- --run OfficePage.test.ts
```

Expected:

```text
PASS
```

**Commit suggestion:**

```bash
git add web/src/pages/officeView.ts web/src/pages/OfficePage.test.ts
git commit -m "feat(office): add safe Kanban Paperclip workbench projection"
```

---

## Phase 2: Read-only UI sections in Office page

**Objective:** Render the unified workbench in `/office` as read-only sections.

**Files:**

- Modify: `web/src/pages/OfficePage.tsx`
- Modify: `web/src/pages/OfficePage.test.ts`
- Modify: `web/src/pages/officeView.ts` only if helper refinements are needed

**Task 2.1: Render Work Lane**

Add a section with stable smoke hook:

```text
data-office-unified-workbench
```

Within it, render:

```text
data-office-work-lane
data-office-work-card
```

Each work card should show Korean-first labels:

- 작업명
- 상태
- 담당
- 붙은 자료 count
- warning count
- source health

No action buttons.

**Task 2.2: Render Paperclip Context Bench**

Add:

```text
data-office-paperclip-bench
data-office-paperclip-source
```

Each source card should show:

- safe label
- source type
- health
- item count
- warning count
- relay label
- provenance/redaction summary
- related work count

No raw paths. No open-file buttons. No refresh buttons.

**Task 2.3: Render Attention Rail entries**

Extend existing attention rail if present, otherwise add a small section:

```text
data-office-workbench-attention
```

Entries:

- blocked work
- source warning
- missing/error source
- approval-gated placeholder only if data exists
- relay warning placeholder only if data exists

**Task 2.4: Add UI raw-leak test**

Render the page fixture with unsafe fields and assert DOM text does not contain:

```text
raw
prompt
transcript
/Users/lidises/nas
secret
```

Run:

```bash
cd web
npm test -- --run OfficePage.test.ts
npm run build
```

Expected:

```text
PASS
build succeeds
```

**Commit suggestion:**

```bash
git add web/src/pages/OfficePage.tsx web/src/pages/OfficePage.test.ts web/src/pages/officeView.ts
git commit -m "feat(office): render read-only Kanban Paperclip workbench"
```

---

## Phase 3: Safe backend projection endpoint, if needed

**Objective:** If the existing Office state endpoint cannot safely carry Kanban/Paperclip projections, add a dedicated safe projection builder server-side. This phase should be skipped if frontend can consume already-safe Office DTOs.

**Likely files:**

- Inspect before modifying:
  - `hermes_cli/web_server.py`
  - `plugins/kanban/dashboard/plugin_api.py`
  - any existing Office API/state builder files
- Add tests in the closest existing backend test file for Office/dashboard APIs

**Design rule:** Do not expose the raw Kanban plugin board payload directly to Office.

Create a safe projection function such as:

```python
def build_office_kanban_projection(raw_board: dict[str, Any]) -> dict[str, Any]:
    ...
```

Allowed output only:

- task id
- title, truncated/sanitized
- status
- assignee label
- priority
- parent/child counts
- source tags from metadata only after allowlist filtering
- derived warning counts/diagnostic count
- activity bucket

Disallowed output:

- task body
- result
- comments body
- run summary unless explicitly redacted and length-limited
- error tracebacks
- raw event payloads
- worker PID if not needed
- metadata keys that are not allowlisted

**Backend tests should assert:**

- unsafe fields are absent
- source tags are filtered
- status/counts survive
- empty/missing DB returns empty safe projection, not 500

**Verification commands:**

```bash
python -m pytest <focused backend test> -o 'addopts=' -q
cd web && npm test -- --run OfficePage.test.ts && npm run build
```

**Commit suggestion:**

```bash
git add <backend files> <tests>
git commit -m "feat(office): expose safe Kanban work projection"
```

---

## Phase 4: Inspector integration

**Objective:** Let a user click a work item or source and see safe detail in the existing Safe Inspector.

**Files:**

- Modify: `web/src/pages/OfficePage.tsx`
- Modify: `web/src/pages/officeView.ts`
- Modify: `web/src/pages/OfficePage.test.ts`

**Task 4.1: Work item inspect state**

Add click/keyboard selection for:

```text
data-office-work-card
```

Inspector should show:

- task title
- status
- assignee
- priority
- source tags
- linked source labels
- warning count
- safe summary if present

No raw body/result/comments/logs.

**Task 4.2: Paperclip source inspect state**

Add selection for:

```text
data-office-paperclip-source
```

Inspector should show:

- source label
- source type
- health
- counts
- relay
- tags
- related work labels
- provenance/redaction summary

No raw path/document body.

**Task 4.3: Accessibility**

Cards should be keyboard focusable and have safe ARIA labels:

```text
aria-label="작업 카드: 경희사슴 어깨통증 블로그 초안, 상태 진행 중"
```

ARIA labels must not include raw source paths or unsafe metadata.

**Verification:**

```bash
cd web
npm test -- --run OfficePage.test.ts
npm run build
```

Browser smoke later:

```text
/office renders
click work card -> inspector updates
click source -> inspector updates
console has no JS errors
page text contains no raw leaked fixture strings
```

**Commit suggestion:**

```bash
git add web/src/pages/OfficePage.tsx web/src/pages/officeView.ts web/src/pages/OfficePage.test.ts
git commit -m "feat(office): inspect safe work and source details"
```

---

## Phase 5: Office map / DeskRPG projection

**Objective:** Represent Kanban and Paperclip objects on the Office map without adding a renderer dependency.

**Files:**

- Modify: `web/src/pages/officeView.ts`
- Modify: `web/src/pages/OfficePage.tsx`
- Modify: `web/src/pages/OfficePage.test.ts`

**Task 5.1: Add pure map object helper**

Create:

```ts
export type OfficeWorkbenchMapObject = {
  id: string;
  kind: "work" | "source" | "warning";
  room: "planning" | "worker_desks" | "review_table" | "archive_shelf";
  label: string;
  health: OfficeSourceHealth;
  relatedId: string;
};

export function buildOfficeWorkbenchMapObjects(workbench: OfficeUnifiedWorkbench): OfficeWorkbenchMapObject[];
```

Mapping:

```text
todo/ready/triage -> planning
running            -> worker_desks
blocked/review     -> review_table
done/archived      -> archive_shelf, optional low-emphasis
paperclip sources  -> archive_shelf
source warnings    -> warning object near source or related work
```

**Task 5.2: Render CSS/SVG markers**

Use existing Office map style patterns. Add smoke hooks:

```text
data-office-workbench-map-object
data-office-workbench-map-work
data-office-workbench-map-source
```

No Phaser/Pixi/Canvas dependency.

**Task 5.3: Connect markers to inspector**

Clicking a marker selects the related safe work item/source.

**Verification:**

```bash
cd web
npm test -- --run OfficePage.test.ts
npm run build
```

Browser smoke:

```text
/office?workbench=1 renders
map markers visible
marker click updates inspector
reduced motion mode remains usable
console clean
```

**Commit suggestion:**

```bash
git add web/src/pages/officeView.ts web/src/pages/OfficePage.tsx web/src/pages/OfficePage.test.ts
git commit -m "feat(office): project workbench onto office map"
```

---

## Phase 6: Optional relay-generated Paperclip manifests

**Objective:** Later, MacBook/WSL can generate safe Paperclip manifests from NAS/Paperclip material. This phase is explicitly not required for the first UI integration.

**Boundary:** This must happen on MacBook/WSL relay, not by broadening VPS NAS access.

Possible manifest shape:

```json
{
  "id": "paperclip:koreandeer-shoulder",
  "label": "koreandeer-shoulder",
  "source_type": "paperclip",
  "health": "partial",
  "item_count": 12,
  "warning_count": 1,
  "relay": "MacBook",
  "tags": ["source:koreandeer-shoulder", "topic:shoulder-pain"],
  "provenance_summary": "MacBook relay summarized NAS/Paperclip manifest",
  "redaction_summary": "raw path/document body/prompt hidden",
  "last_indexed_bucket": "today"
}
```

Manifest must not contain:

- full paths
- raw document body
- raw OCR text
- raw prompt/transcript
- private notes
- secrets

**Later verification:**

- manifest schema validation
- raw-leak grep
- relay summary-only output
- VPS consumes manifest as read-only DTO

---

## 7. Testing strategy

### 7.1 Unit tests

Focused Vitest tests in `OfficePage.test.ts` should cover:

- safe Kanban projection
- safe Paperclip projection
- source tag filtering
- link derivation
- attention item derivation
- UI rendering
- inspector selection
- raw leak guards
- empty states

### 7.2 Backend tests, if backend changes happen

Add focused pytest coverage for:

- raw Kanban board -> safe projection
- malformed board/missing DB -> empty safe projection
- unsafe metadata dropped
- comments/body/result not included

### 7.3 Build and smoke

Minimum verification after implementation phases:

```bash
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
npm run build
```

If backend changes occur:

```bash
cd /Users/lidises/dev/hermes-agent
python -m pytest <focused backend tests> -o 'addopts=' -q
```

Browser smoke:

```text
/office renders
work lane visible
Paperclip bench visible
attention rail visible
inspector interactions work
console has no JS errors
raw leak strings absent from visible text
```

---

## 8. Open questions before execution

Answer these before implementing mutation or backend integrations:

1. Should Office initially read Kanban state from the existing plugin API, or should backend Office state include a pre-sanitized Kanban projection?
2. Where should source tags live in real Kanban tasks?
   - metadata field?
   - conventions in title/body?
   - dedicated future schema column?
3. Should Paperclip manifests be generated from:
   - session tags first,
   - NAS manifest files first,
   - Paperclip plugin/API first,
   - or relay-generated static JSON first?
4. Should Kanban work cards show `safeSummary`, or should summaries stay hidden until a stronger redaction layer exists?
5. Should done/archived cards appear in AI Office by default, or only counts?
6. Should this workbench be feature-flagged with a query param first, e.g. `/office?workbench=1`?

Recommended default answers for first implementation:

```text
1. Start frontend fixture/pure helper first; backend later only if needed.
2. Use metadata-derived sourceTags defensively, but do not require schema migration yet.
3. Start with existing Office data_sources/session tags; relay manifests later.
4. Hide summaries unless already known safe and length-limited.
5. Show done as counts, not full cards, by default.
6. Use a feature flag/query param for first browser smoke if the UI feels crowded.
```

---

## 9. Suggested implementation order summary

```text
Phase 0: save plan only
Phase 1: pure safe DTO/helper + tests
Phase 2: read-only UI sections
Phase 3: safe backend projection only if needed
Phase 4: safe inspector selection
Phase 5: CSS/SVG Office map projection
Phase 6: optional MacBook/WSL relay-generated Paperclip manifests
Phase 7: separate approval-model plan for mutations, if desired
```

---

## 10. Explicit non-goals

This plan does not implement:

- Kanban task creation/editing from AI Office
- Paperclip write/mutation controls
- direct NAS file browser
- raw transcript/log browser
- live SSE/WebSocket stream for this workbench
- Phaser/Pixi/game-engine renderer
- broad VPS NAS mount
- arbitrary relay shell
- model/provider identity display
- credential movement

---

## 11. Success criteria

The first completed read-only version is successful when:

1. `/office` shows a Korean-first Work Lane and Paperclip Context Bench.
2. Kanban work items and Paperclip sources are linked by safe source tags.
3. Attention rail highlights blocked work and source warnings.
4. Inspector shows safe details for selected work/source.
5. Unit tests prove unsafe fixture fields do not appear in projection or DOM.
6. `npm run build` passes.
7. Browser smoke shows no console errors.
8. No mutation controls are added.
9. No VPS authority or NAS access is expanded.
10. The repo has small, reviewable commits per phase.
