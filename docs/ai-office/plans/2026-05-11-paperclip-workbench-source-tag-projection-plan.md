# Paperclip Workbench + Source-Tag Projection Implementation Plan

> **For Hermes:** Use `subagent-driven-development` if executing this plan task-by-task. Keep every slice read-only, helper-first, tested, and separately committed.

**Goal:** Attach Paperclip/NAS/shared-context visibility to AI Office as a safe read-only workbench, using source-tag projection instead of raw file browsing or a runtime NAS queue.

**Architecture:** AI Office remains the primary UI. Paperclip appears as an Office workbench/source projection, not a new always-visible sidebar app and not a mutation surface. MacBook/WSL relays may read NAS/Paperclip material and emit safe manifests; VPS/Office consumes only sanitized source summaries and session/source tags. NAS stays the canonical ledger/evidence store, not the runtime bus.

**Tech Stack:** Hermes dashboard backend, React/Vite AI Office frontend, TypeScript pure view helpers, Vitest, existing OfficeState safe DTO, future Mac/WSL relay scripts where needed.

---

## Non-negotiable boundaries

1. Read-only first. No create/update/delete/approve/run buttons in Paperclip workbench.
2. Do not expose raw Paperclip/NAS/session material in browser DTOs:
   - prompts
   - transcripts
   - tool args
   - task body/result
   - raw logs
   - cron scripts
   - credentials/tokens
   - full private filesystem paths
   - provider/model identity
3. VPS must not get broad NAS credentials, direct NAS RW mount, Docker/sudo, or Paperclip secrets as part of this plan.
4. NAS is ledger/evidence/handoff archive. It is not a queue, lock service, or live message bus.
5. MacBook/WSL are the correct place for privacy-sensitive file reads and summary generation.
6. Every browser-facing addition must be derived from allowlisted fields only.
7. Each phase must leave the repo clean except intentional committed changes.

---

## Phase 0: Current baseline and cleanup gate

Before starting any phase, run from `/Users/lidises/dev/hermes-agent`:

```bash
git status --short --branch
git log -1 --oneline
git clean -nd
```

Expected baseline after sidebar simplification and this planning commit:

```text
## ai-office-stage16e-safe-spatial-choreography-20260510
<latest docs(office): plan Paperclip workbench projection commit>
```

If this plan has been amended, use the latest `docs(office): plan Paperclip workbench projection` commit as the planning baseline.

Cleanup rule:

- If `git clean -nd` prints nothing, there is no untracked junk to remove.
- If it prints only obvious generated junk, remove only those files with an explicit allowlist, for example:

```bash
git clean -fd -- path/to/generated.tmp path/to/old-log.txt
```

- Do not run broad `git clean -fdx` unless the user explicitly approves; it can delete local environments/caches.
- If tracked files are modified unexpectedly, inspect them with `git diff -- <file>` before restoring.

---

## Final target shape

AI Office `/office` should eventually show a “Paperclip / 공유 컨텍스트 작업대” area with:

- source/workspace label, sanitized
- source type: `paperclip`, `nas_manifest`, `session_tag`, `relay_projection`
- health: `ok`, `partial`, `missing`, `unavailable`, `error`
- item count
- warning count
- last indexed timing bucket, not exact sensitive path details
- owner/relay label: `MacBook`, `WSL`, `VPS`, or `unknown`
- allowlisted source tags
- provenance summary
- redaction summary
- inspect panel with safe fields only

It should not show raw tasks, raw documents, raw images, raw logs, full paths, or prompts.

---

## Phase 1: Define the safe Paperclip projection contract

**Objective:** Add a pure TypeScript contract and helper for a Paperclip/shared-context workbench projection, without backend integration.

**Files:**
- Modify: `web/src/pages/officeView.ts`
- Modify: `web/src/pages/OfficePage.test.ts`
- Docs: update this plan only if implementation details change

**Step 1: Add a failing test**

In `OfficePage.test.ts`, add a test near the existing Office helper tests:

```ts
it("builds a safe Paperclip workbench projection from source tags without raw content", () => {
  const state = officeFixture({
    data_sources: [
      {
        id: "paperclip:clinic-blog",
        status: "partial",
        checked_at: "2026-05-11T08:00:00Z",
        item_count: 12,
        warning_count: 1,
        error_summary: "1 stale manifest",
        source_type: "paperclip",
        relay: "MacBook",
        tags: ["source:koreandeer-shoulder", "raw prompt must not appear"],
        path: "/Users/lidises/nas/secret/raw/path",
        prompt: "raw prompt must not appear",
        transcript: "raw transcript must not appear",
      } as any,
    ],
    provenance: [
      { source: "paperclip:clinic-blog", label: "Paperclip safe manifest", detail: "raw path must not appear" } as any,
    ],
  });

  const workbench = buildOfficePaperclipWorkbench(state);

  expect(workbench.sources).toHaveLength(1);
  expect(workbench.sources[0]).toMatchObject({
    id: "paperclip:clinic-blog",
    label: "clinic-blog",
    health: "partial",
    sourceType: "paperclip",
    itemCount: 12,
    warningCount: 1,
    relay: "MacBook",
  });
  expect(workbench.sources[0].tags).toEqual(["source:koreandeer-shoulder"]);
  expect(JSON.stringify(workbench)).not.toMatch(/raw|prompt|transcript|secret|\/Users\/lidises\/nas/i);
});
```

If `OfficeDataSource` does not yet allow these metadata fields, keep the test cast local and implement the helper defensively with `Record<string, unknown>` reads.

**Step 2: Run failing test**

```bash
cd web
npm test -- --run OfficePage.test.ts
```

Expected: FAIL because `buildOfficePaperclipWorkbench` is not exported.

**Step 3: Implement minimal helper**

Add types in `officeView.ts`:

```ts
export type OfficePaperclipSourceType = "paperclip" | "nas_manifest" | "session_tag" | "relay_projection" | "unknown";

export type OfficePaperclipWorkbenchSource = {
  id: string;
  label: string;
  health: OfficeSourceStatus;
  sourceType: OfficePaperclipSourceType;
  itemCount: number;
  warningCount: number;
  relay: "MacBook" | "WSL" | "VPS" | "unknown";
  tags: string[];
  timingBucket: "fresh" | "recent" | "stale" | "unknown";
  redactionNote: string;
};

export type OfficePaperclipWorkbench = {
  stageLabel: string;
  detail: string;
  sources: OfficePaperclipWorkbenchSource[];
  redactionNote: string;
};
```

Implement `buildOfficePaperclipWorkbench(state: OfficeState): OfficePaperclipWorkbench` with these rules:

- Select only data sources whose id starts with `paperclip:` or whose defensive `source_type` is one of the allowed source types.
- Label is sanitized: strip `paperclip:` prefix, replace full paths with basename-like label, cap length to 48 chars.
- Tags are included only if they match `^source:[a-z0-9][a-z0-9_-]{1,80}$`.
- Relay is allowlisted to `MacBook`, `WSL`, `VPS`; otherwise `unknown`.
- Timing bucket can be coarse:
  - no `checked_at` => `unknown`
  - within 24h => `fresh`
  - within 7d => `recent`
  - older => `stale`
- Never read or copy `prompt`, `transcript`, `body`, `result`, `script`, `args`, `log`, `path`, `secret`, `token`.

**Step 4: Verify focused test**

```bash
cd web
npm test -- --run OfficePage.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add web/src/pages/officeView.ts web/src/pages/OfficePage.test.ts
git commit -m "feat(office): add safe Paperclip workbench projection"
```

---

## Phase 2: Render Paperclip Workbench inside AI Office

**Objective:** Surface the safe projection in `/office` without adding a new top-level sidebar route.

**Files:**
- Modify: `web/src/pages/OfficePage.tsx`
- Modify: `web/src/pages/officeView.ts` only if helper shape needs tiny adjustments
- Modify: `web/src/pages/OfficePage.test.ts` if view helper test needs coverage extension

**Step 1: Import helper and type**

In `OfficePage.tsx`, import:

```ts
buildOfficePaperclipWorkbench,
type OfficePaperclipWorkbenchSource,
```

**Step 2: Derive the workbench with `useMemo`**

Near other derived Office helper calls:

```ts
const paperclipWorkbench = useMemo(() => buildOfficePaperclipWorkbench(state), [state]);
```

**Step 3: Add a small component**

Add `PaperclipWorkbenchCard` near `SourceCard`:

```tsx
function PaperclipWorkbenchCard({ source, onInspect }: { source: OfficePaperclipWorkbenchSource; onInspect: () => void }) {
  return (
    <div className="border border-cyan-400/20 bg-cyan-950/10 p-3" data-office-paperclip-source={source.id}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{source.label}</span>
        <StatusPill status={source.health} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-midground/75">
        <div><div className="text-midground/45">항목</div><div className="text-foreground">{source.itemCount}</div></div>
        <div><div className="text-midground/45">릴레이</div><div className="text-foreground">{source.relay}</div></div>
        <div><div className="text-midground/45">종류</div><div className="text-foreground">{source.sourceType}</div></div>
        <div><div className="text-midground/45">상태 시점</div><div className="text-foreground">{source.timingBucket}</div></div>
      </div>
      {source.tags.length ? <div className="mt-3 text-xs text-cyan-200/80">{source.tags.join(" · ")}</div> : null}
      <button type="button" onClick={onInspect} className="mt-3 flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-midground/70 hover:text-foreground">
        <Eye className="h-3 w-3" /> 안전 요약 보기
      </button>
    </div>
  );
}
```

**Step 4: Render in an existing secondary column**

Add a section titled `Paperclip · 공유 컨텍스트 작업대` near existing source/provenance/read-only diagnostics. Keep it visually secondary to the Office map.

Rules:

- If no sources: show Korean empty-state copy explaining that no safe manifest/source tag is present yet.
- If sources exist: render cards capped at 4 or 6 using existing list cap conventions.
- `Inspect` should set the existing safe inspector with fields only from `OfficePaperclipWorkbenchSource`.

Inspector fields:

```ts
[
  ["종류", source.sourceType],
  ["상태", source.health],
  ["항목", String(source.itemCount)],
  ["경고", String(source.warningCount)],
  ["릴레이", source.relay],
  ["시점", source.timingBucket],
  ["태그", source.tags.join(", ") || "—"],
  ["보안", source.redactionNote],
]
```

**Step 5: Browser smoke hooks**

The rendered wrapper should include:

```tsx
data-office-paperclip-workbench
```

Each card should include:

```tsx
data-office-paperclip-source={source.id}
```

**Step 6: Verify**

```bash
cd web
npm test -- --run OfficePage.test.ts
npm run lint -- src/pages/OfficePage.tsx src/pages/officeView.ts
npm run build
```

Then browser smoke `/office`:

- Workbench section visible.
- Empty state visible if no Paperclip source exists.
- No JS console errors.
- Raw leak check in DOM text returns false for:
  - `prompt`
  - `transcript`
  - `tool args`
  - `secret`
  - `token`
  - `/Users/lidises/nas`
  - `/mnt/`

**Step 7: Commit**

```bash
git add web/src/pages/OfficePage.tsx web/src/pages/officeView.ts web/src/pages/OfficePage.test.ts
git commit -m "feat(office): render Paperclip workbench safely"
```

---

## Phase 3: Add fixture-only Paperclip source health plumbing

**Objective:** Let frontend and browser smoke exercise Paperclip workbench without connecting to real NAS/Paperclip.

**Files:**
- Inspect first: `web/src/lib/api.ts`
- Inspect backend Office DTO generator files with:
  ```bash
  rg "OfficeState|data_sources|office/state|api/office" -n .
  ```
- Modify only the existing fixture/mock path, not real adapters, unless the codebase already has a safe DTO fixture location.

**Step 1: Locate OfficeState type**

Use:

```bash
cd /Users/lidises/dev/hermes-agent
rg "export type OfficeDataSource|interface OfficeDataSource|OfficeDataSource" web/src -n
rg "data_sources" -n . --glob '!web/node_modules/**' --glob '!**/.venv/**'
```

**Step 2: Extend type only if needed**

If `OfficeDataSource` is strict and does not allow metadata, add optional safe fields only:

```ts
source_type?: "paperclip" | "nas_manifest" | "session_tag" | "relay_projection";
relay?: "MacBook" | "WSL" | "VPS" | "unknown";
tags?: string[];
```

Do not add path/prompt/transcript/body/script fields to the type.

**Step 3: Add a fixture source**

In the existing Office fixture/demo state only, add something like:

```ts
{
  id: "paperclip:demo-shared-context",
  status: "missing",
  checked_at: new Date().toISOString(),
  item_count: 0,
  warning_count: 0,
  source_type: "paperclip",
  relay: "unknown",
  tags: ["source:paperclip-demo"],
}
```

This is not real integration; it proves UI shape.

**Step 4: Verify**

```bash
cd web
npm test -- --run OfficePage.test.ts App.test.ts
npm run build
```

Browser smoke:

- `/office` shows demo source only if fixture/demo mode is active.
- Raw leak regex false.
- Console clean.

**Step 5: Commit**

```bash
git add <exact fixture/type files>
git commit -m "test(office): add safe Paperclip fixture source"
```

---

## Phase 4: Define Mac/WSL safe manifest format

**Objective:** Specify exactly what MacBook/WSL may emit from NAS/Paperclip into a safe manifest, without implementing a live watcher.

**Files:**
- Create: `docs/ai-office/paperclip-safe-manifest.md`
- Optionally create example fixture: `docs/ai-office/examples/paperclip-source.example.yaml`

**Manifest schema:**

```yaml
schema_version: 1
source_id: paperclip:clinic-blog
source_type: paperclip
relay: MacBook
label: clinic-blog
status: partial
checked_at: "2026-05-11T08:00:00Z"
item_count: 12
warning_count: 1
tags:
  - source:koreandeer-shoulder
  - source:clinic-blog-research
provenance:
  summary: "MacBook relay generated safe Paperclip projection"
  source_host: MacBook
  path_bucket: nas_hermes_paperclip
redactions:
  policy_version: 1
  omitted_sections:
    - prompts
    - transcripts
    - tool_args
    - raw_logs
    - credentials
  warnings:
    - "Raw Paperclip content intentionally omitted"
```

**Explicitly forbidden fields:**

```yaml
prompt: forbidden
transcript: forbidden
tool_args: forbidden
body: forbidden
result: forbidden
raw_log: forbidden
script: forbidden
token: forbidden
secret: forbidden
full_path: forbidden
provider: forbidden
model: forbidden
```

**Step 1: Write docs**

Document:

- purpose
- producer: MacBook/WSL relay
- consumer: AI Office safe DTO adapter
- NAS role: canonical ledger only
- no watcher/queue semantics
- no VPS NAS broad credentials
- validation rules
- sample manifest

**Step 2: Verify docs only**

```bash
git diff --check
```

**Step 3: Commit**

```bash
git add docs/ai-office/paperclip-safe-manifest.md docs/ai-office/examples/paperclip-source.example.yaml
git commit -m "docs(office): define Paperclip safe manifest"
```

---

## Phase 5: Add a local validator for safe manifests

**Objective:** Provide a small script or pure helper that rejects unsafe manifest fields before any adapter consumes them.

**Files:**
- Prefer backend-neutral script: `scripts/ai_office/validate_paperclip_manifest.py`
- Tests: `tests/test_paperclip_manifest_validator.py` or nearest existing scripts/tests pattern

**Step 1: Inspect test layout**

```bash
find tests -maxdepth 2 -type f | sort | head -80
```

**Step 2: Write failing tests**

Tests should assert:

- valid example manifest passes
- forbidden keys fail recursively
- invalid tags fail
- relay outside allowlist fails
- source_type outside allowlist fails
- full absolute private paths fail in values

**Step 3: Implement validator**

Allowed source types:

```python
{"paperclip", "nas_manifest", "session_tag", "relay_projection"}
```

Allowed relays:

```python
{"MacBook", "WSL", "VPS", "unknown"}
```

Forbidden key regex:

```python
r"(?i)(prompt|transcript|tool.?args|body|result|raw.?log|script|token|secret|password|credential|provider|model|full.?path)"
```

Forbidden value regex:

```python
r"(/Users/lidises/nas|/mnt/|BEGIN .*PRIVATE KEY|sk-[A-Za-z0-9]|xox[baprs]-|TELEGRAM_BOT_TOKEN)"
```

**Step 4: Verify**

```bash
python -m pytest tests/test_paperclip_manifest_validator.py -q -o 'addopts='
python scripts/ai_office/validate_paperclip_manifest.py docs/ai-office/examples/paperclip-source.example.yaml
```

Expected: PASS / exit 0.

**Step 5: Commit**

```bash
git add scripts/ai_office/validate_paperclip_manifest.py tests/test_paperclip_manifest_validator.py docs/ai-office/examples/paperclip-source.example.yaml
git commit -m "feat(office): validate Paperclip safe manifests"
```

---

## Phase 6: Add session/source-tag projection bridge

**Objective:** Connect safe source tags to existing session_search concepts without relying on raw transcripts in the browser.

**Files:**
- First inspect actual session/search backend paths:
  ```bash
  rg "session_search|sessions search|source" -n agent tools hermes_cli tests
  ```
- Likely docs first: `docs/ai-office/paperclip-source-tag-projection.md`
- Only implement backend code if existing OfficeState data source generation already supports source tags safely.

**Minimal implementation target:**

Add a safe DTO concept, not raw search:

```ts
sourceTags: ["source:koreandeer-shoulder", "source:clinic-blog-research"]
```

Do not send search result snippets, transcript excerpts, or messages to the browser in this phase.

**Step 1: Document mapping**

Document:

- `source:<slug>` naming rule
- how Mac/WSL manifests map tags to Office source cards
- how future session_search queries can use tags server-side
- why browser sees only tag names/counts, not transcript content

**Step 2: Optional helper test**

If adding helper in `officeView.ts`, test:

- tags are allowlisted
- raw strings filtered out
- duplicates removed
- max tags capped, e.g. 8

**Step 3: Verify**

```bash
cd web
npm test -- --run OfficePage.test.ts
npm run build
```

**Step 4: Commit**

```bash
git add <docs/helpers/tests>
git commit -m "docs(office): map Paperclip source tags to safe projections"
```

---

## Phase 7: MacBook relay dry-run generator

**Objective:** Create a MacBook-local dry-run command that scans an approved local/NAS directory and emits only safe manifest summaries. No VPS NAS access.

**Files:**
- Create: `scripts/ai_office/generate_paperclip_manifest.py`
- Tests: `tests/test_paperclip_manifest_generator.py`
- Docs: update `docs/ai-office/paperclip-safe-manifest.md`

**Safety design:**

- Default mode is dry-run to stdout.
- Requires explicit input directory argument.
- Rejects symlinks unless explicitly allowed later.
- Reads only filenames/extensions/mtime/counts by default, not file bodies.
- Does not print full absolute paths; uses path bucket labels.
- Writes output only if `--output` is passed.
- Output must pass validator from Phase 5.

**Example command:**

```bash
python scripts/ai_office/generate_paperclip_manifest.py \
  --source-id paperclip:clinic-blog \
  --relay MacBook \
  --tag source:clinic-blog-research \
  --path-bucket nas_hermes_paperclip \
  /Users/lidises/nas/Hermes/Paperclip \
  --dry-run
```

**Step 1: Write tests**

Use temporary directories. Assert:

- generated manifest has counts and tags
- no full temp path in output
- hidden files ignored unless explicitly allowed
- file body text containing `prompt` is not read into output
- validator accepts generated output

**Step 2: Implement**

Keep stdlib-only if possible: `argparse`, `pathlib`, `datetime`, `yaml` only if already available; otherwise JSON output may be simpler. If using YAML, check project dependencies first.

**Step 3: Verify**

```bash
python -m pytest tests/test_paperclip_manifest_generator.py tests/test_paperclip_manifest_validator.py -q -o 'addopts='
python scripts/ai_office/generate_paperclip_manifest.py --help
```

**Step 4: Commit**

```bash
git add scripts/ai_office/generate_paperclip_manifest.py tests/test_paperclip_manifest_generator.py docs/ai-office/paperclip-safe-manifest.md
git commit -m "feat(office): add Paperclip manifest dry-run generator"
```

---

## Phase 8: Optional Office backend adapter for safe manifests

**Objective:** Load validated safe manifests into OfficeState data_sources, but only from explicitly configured local paths on the machine running the dashboard.

**Do this only after Phases 1 through 7 pass.**

**Files:**
- Inspect backend first with:
  ```bash
  rg "OfficeState|data_sources|api/office/state|dashboard" -n . --glob '!web/node_modules/**'
  ```
- Add tests near existing Office backend tests.

**Config principle:**

- No hardcoded NAS path.
- No default broad scan.
- Empty config means no manifests loaded.
- Paths must be local to the current node and explicitly configured.
- VPS config should point only to VPS-local projection files, not NAS mounts.

**Step 1: Add backend test**

Test loading one valid manifest into OfficeState data_sources.

Test rejecting unsafe manifest and returning source status `error` or omitting it with redaction warning, depending on existing Office error conventions.

**Step 2: Implement minimal adapter**

- Reuse validator from Phase 5.
- Load only files from configured list or directory.
- Cap number of manifests.
- Cap tags per manifest.
- Convert to existing `OfficeDataSource` shape.

**Step 3: Verify**

```bash
python -m pytest <office-backend-tests> -q -o 'addopts='
cd web && npm test -- --run OfficePage.test.ts && npm run build
```

Browser smoke `/office` with a local fixture manifest:

- Paperclip workbench source appears.
- Inspect shows safe fields only.
- Raw leak regex false.

**Step 4: Commit**

```bash
git add <backend adapter files> <tests>
git commit -m "feat(office): load safe Paperclip manifest sources"
```

---

## Phase 9: VPS deployment posture

**Objective:** Make the work visible on VPS dashboard without violating restricted VPS boundary.

**Required checks:**

- VPS runs as restricted `hermes` user.
- No sudo/docker/NAS credentials added.
- Dashboard remains private/Tailscale-only.
- Paperclip manifests, if consumed on VPS, are copied as sanitized projection files only.

**Deployment pattern:**

1. Generate safe manifest on MacBook/WSL.
2. Validate locally.
3. Copy only the safe manifest to VPS-local projection directory if needed.
4. Restart dashboard only if the backend requires restart; otherwise refresh frontend.
5. Verify browser `/office` over private dashboard.
6. Verify public exposure negative checks.

**Do not:**

- mount NAS on VPS for this
- run a watcher on NAS from VPS
- copy raw Paperclip export directories to VPS
- copy `.env`, auth.json, credentials, session DBs, or raw logs

---

## Phase 10: Browser and raw-leak verification checklist

Run after every UI/backend phase:

```bash
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts App.test.ts
npm run build
```

If lint command is available and known in this checkout:

```bash
npm run lint -- src/pages/OfficePage.tsx src/pages/officeView.ts src/App.tsx src/appNav.ts
```

Browser smoke:

1. Start dashboard from this checkout, not `~/.hermes/hermes-agent` default checkout.
2. Open `/office`.
3. Confirm `data-office-paperclip-workbench` exists.
4. Click one Paperclip inspect control if a fixture source exists.
5. Confirm no console JS errors.
6. Run DOM text leak check for:

```text
prompt|transcript|tool args|tool_args|secret|token|credential|/Users/lidises/nas|/mnt/|raw body|raw log|script
```

Expected: no matches from Paperclip workbench text.

---

## Phase 11: PR / handoff summary

**Objective:** Close the phased work with a clean handoff before any API/full semantic retrieval expansion.

**Files:**
- Update: `docs/ai-office/STATUS.md` if present
- Update: `docs/ai-office/NEXT.md` if present
- Create: `docs/ai-office/plans/2026-05-11-paperclip-workbench-handoff.md`

Summary must include:

- chosen architecture: `3 + 4-lite`, with `1` as relay-side ledger only
- implemented phases and commit hashes
- verification commands and results
- safety boundaries still in force
- remaining next steps
- explicit non-goals:
  - no Paperclip API yet
  - no NAS runtime queue
  - no VPS NAS credentials
  - no mutation controls
  - no raw transcript/document browser

---

## Recommended execution order

Execute in this exact order unless a phase reveals a blocker:

1. Phase 0: baseline cleanup gate
2. Phase 1: pure projection helper
3. Phase 2: UI render inside `/office`
4. Phase 3: fixture-only source health plumbing
5. Phase 4: safe manifest documentation
6. Phase 5: manifest validator
7. Phase 6: source-tag projection mapping docs/helper
8. Phase 7: MacBook dry-run generator
9. Phase 8: backend adapter, only after validator/generator are stable
10. Phase 9: VPS private deployment posture
11. Phase 10: final browser/raw-leak verification
12. Phase 11: handoff/PR summary

If time is limited, stop after Phase 2 or Phase 4. Those leave the product direction clear without adding risky runtime integration.


---

## New-session continuation protocol

If a future session starts with only “이어서 진행해줘”, continue this project as follows.

### Resume discovery commands

Run these first:

```bash
cd /Users/lidises/dev/hermes-agent
git status --short --branch
git log --oneline -12
git clean -nd
test -f docs/ai-office/plans/2026-05-11-paperclip-workbench-source-tag-projection-plan.md && echo PLAN_OK
```

Then read this plan file and use the first incomplete phase from the completion markers below.

### Cleanup before continuing

1. If `git status --short` is clean and `git clean -nd` is empty, continue immediately.
2. If only this plan file or intentional phase files are modified, inspect `git diff --stat` and continue from that phase.
3. If unrelated untracked generated files exist, remove only explicit junk paths after inspecting them. Never run broad `git clean -fdx`.
4. If unrelated tracked changes exist, do not overwrite them. Inspect with `git diff -- <file>` and either preserve them or ask before restoring.
5. If a prior phase is half-done, finish its verification and commit before starting a later phase.

### Completion markers

Use this table to decide what is already done.

| Phase | Completion marker | Expected commit subject |
| --- | --- | --- |
| Phase 0 | clean baseline recorded, no junk | no code commit required |
| Phase 1 | `buildOfficePaperclipWorkbench` exported and tested | `feat(office): add safe Paperclip workbench projection` |
| Phase 2 | `/office` renders `data-office-paperclip-workbench` | `feat(office): render Paperclip workbench safely` |
| Phase 3 | safe Paperclip fixture/demo source exists | `test(office): add safe Paperclip fixture source` |
| Phase 4 | `docs/ai-office/paperclip-safe-manifest.md` exists | `docs(office): define Paperclip safe manifest` |
| Phase 5 | validator script and tests exist | `feat(office): validate Paperclip safe manifests` |
| Phase 6 | source-tag projection doc/helper exists | `docs(office): map Paperclip source tags to safe projections` |
| Phase 7 | dry-run generator and tests exist | `feat(office): add Paperclip manifest dry-run generator` |
| Phase 8 | backend adapter tests pass | `feat(office): load safe Paperclip manifest sources` |
| Phase 9 | VPS/private deployment posture verified | deployment/handoff commit or note |
| Phase 10 | browser/raw-leak checklist run after last code phase | included in latest phase note |
| Phase 11 | handoff summary written | `docs(office): summarize Paperclip workbench handoff` |

When in doubt, prefer starting from the earliest phase whose marker is absent.

### Automatic next-action rule

- If only the plan exists, start Phase 1.
- If Phase 1 exists but no UI hook exists, start Phase 2.
- If UI exists but no fixture source exists, start Phase 3.
- If fixture exists but no manifest schema doc exists, start Phase 4.
- If schema exists but no validator exists, start Phase 5.
- If validator exists but no source-tag mapping exists, start Phase 6.
- If mapping exists but no dry-run generator exists, start Phase 7.
- If generator exists but no backend adapter exists, decide whether Phase 8 is still needed. Do not implement Phase 8 until Phases 4 and 5 are stable.
- If backend adapter exists, run Phase 10 verification and then Phase 11 handoff.

### Required skills in a fresh session

Load these before executing code changes:

- `hermes-agent`
- `karpathy-coding-discipline`
- `test-driven-development` if writing code/tests
- `writing-plans` only if this plan needs material revision

### Standard verification block per code phase

Run the narrow check first, then broader checks:

```bash
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
npm test -- --run App.test.ts
npm run build
```

If the phase touches Python scripts/tests:

```bash
cd /Users/lidises/dev/hermes-agent
python -m pytest <exact-test-files> -q -o 'addopts='
```

Always finish with:

```bash
cd /Users/lidises/dev/hermes-agent
git diff --check
git status --short --branch
git clean -nd
```

### Commit rule

Commit after each completed phase. Do not bundle multiple phases unless they are purely documentation-only and obviously inseparable. Commit messages should match the completion marker table when possible.

---

## Phase-by-phase micro checklist

### Phase 0 micro checklist: baseline and junk removal

1. Run `git status --short --branch`.
2. Run `git log -1 --oneline`.
3. Run `git clean -nd`.
4. If untracked output is empty, record “no junk”.
5. If untracked output exists, classify each path:
   - keep: source/doc/test file intentionally created
   - remove: generated log/cache/temp artifact
   - ask: anything ambiguous
6. Remove only explicit generated junk paths.
7. Re-run status and clean dry-run.
8. Continue only when the working tree state is understood.

### Phase 1 micro checklist: safe projection helper

1. Open `web/src/pages/officeView.ts` and `web/src/pages/OfficePage.test.ts`.
2. Find nearby helper exports and tests so naming/style matches existing code.
3. Add failing test for `buildOfficePaperclipWorkbench`.
4. Test must include raw-looking fields (`prompt`, `transcript`, full path) and assert they do not appear in output.
5. Run `npm test -- --run OfficePage.test.ts` and confirm expected failure.
6. Add `OfficePaperclipSourceType`, `OfficePaperclipWorkbenchSource`, and `OfficePaperclipWorkbench` types.
7. Implement source selection from safe `data_sources` metadata only.
8. Implement label sanitization:
   - remove `paperclip:` prefix
   - cap length
   - do not preserve full paths
9. Implement relay allowlist: `MacBook`, `WSL`, `VPS`, fallback `unknown`.
10. Implement tag filter: only `source:<slug>`.
11. Implement timing bucket from `checked_at`.
12. Do not read/copy raw forbidden fields.
13. Re-run focused test.
14. Run `git diff --check`.
15. Commit Phase 1.

### Phase 2 micro checklist: Office UI workbench section

1. Open `web/src/pages/OfficePage.tsx`.
2. Locate existing source/provenance/safe inspector sections.
3. Import `buildOfficePaperclipWorkbench` and required type.
4. Derive `paperclipWorkbench` with `useMemo`.
5. Add a small `PaperclipWorkbenchCard` component.
6. Add wrapper hook `data-office-paperclip-workbench`.
7. Add per-source hook `data-office-paperclip-source={source.id}`.
8. Render Korean heading: `Paperclip · 공유 컨텍스트 작업대`.
9. Render Korean empty state when no safe source exists.
10. Add inspect button that uses existing inspector state.
11. Inspector fields must include only type/status/count/warnings/relay/timing/tags/redaction note.
12. Do not add route, sidebar item, mutation control, or API call.
13. Run `npm test -- --run OfficePage.test.ts`.
14. Run build.
15. Browser smoke `/office` if dashboard is available.
16. Commit Phase 2.

### Phase 3 micro checklist: fixture-only source

1. Locate OfficeState fixture/demo source generator with ripgrep.
2. Extend `OfficeDataSource` type only with safe optional metadata if needed.
3. Do not type raw fields such as `prompt`, `transcript`, `path`, `body`, `script`.
4. Add one demo source with `id: paperclip:demo-shared-context`.
5. Mark it `missing` or `unavailable` unless real safe data exists.
6. Add `source_type`, `relay`, and safe `tags`.
7. Verify UI empty/demo behavior.
8. Run `npm test -- --run OfficePage.test.ts App.test.ts`.
9. Run build.
10. Commit Phase 3.

### Phase 4 micro checklist: safe manifest spec

1. Create `docs/ai-office/paperclip-safe-manifest.md`.
2. Create `docs/ai-office/examples/paperclip-source.example.yaml` if examples directory is acceptable.
3. Document purpose and non-goals.
4. Define producer: MacBook/WSL relay.
5. Define consumer: AI Office safe DTO adapter.
6. Define NAS role: ledger/evidence only.
7. Define required fields.
8. Define optional safe fields.
9. Define forbidden keys.
10. Define forbidden value patterns.
11. Include sample valid manifest.
12. Include sample invalid manifest fragment.
13. Explain no watcher/queue semantics.
14. Run `git diff --check`.
15. Commit Phase 4.

### Phase 5 micro checklist: safe manifest validator

1. Inspect test conventions under `tests/`.
2. Create validator script path, preferably `scripts/ai_office/validate_paperclip_manifest.py`.
3. Create focused pytest file.
4. Test valid example passes.
5. Test forbidden keys fail recursively.
6. Test invalid source tag fails.
7. Test invalid relay fails.
8. Test invalid source_type fails.
9. Test full private path in values fails.
10. Test token/secret-looking values fail.
11. Implement stdlib-first parser; if YAML is needed, check dependency availability first.
12. Return non-zero exit for invalid manifest.
13. Print concise errors without echoing secret values.
14. Run pytest for validator.
15. Run validator against example manifest.
16. Commit Phase 5.

### Phase 6 micro checklist: source-tag projection bridge

1. Create or update `docs/ai-office/paperclip-source-tag-projection.md`.
2. Define `source:<slug>` naming convention.
3. Define allowed slug regex.
4. Define dedupe and cap rules.
5. Explain relation to `session_search`: server-side retrieval only, no browser transcript snippets.
6. If adding helper, write failing test for tag filtering/dedupe/cap.
7. Implement helper minimally.
8. Run focused frontend tests if helper added.
9. Run build if frontend changed.
10. Commit Phase 6.

### Phase 7 micro checklist: MacBook dry-run generator

1. Create `scripts/ai_office/generate_paperclip_manifest.py`.
2. Create `tests/test_paperclip_manifest_generator.py`.
3. Generator must require explicit input directory.
4. Default output mode should be dry-run stdout.
5. Optional `--output` writes a manifest file.
6. Ignore hidden files by default.
7. Reject symlinks by default.
8. Count files and safe extension buckets only.
9. Do not read file body content.
10. Do not print full absolute input path.
11. Accept source id, relay, tag, path bucket args.
12. Pipe generated output through validator in tests.
13. Run generator `--help`.
14. Run generator against a temp fixture in tests.
15. Commit Phase 7.

### Phase 8 micro checklist: backend adapter

1. Do not start until Phases 4 and 5 exist and pass.
2. Locate OfficeState backend generation path.
3. Add config surface only if existing config pattern is clear.
4. Default config must load no manifests.
5. Add backend tests with temp safe manifest file.
6. Test unsafe manifest is rejected or reported safely.
7. Reuse Phase 5 validator.
8. Cap number of manifests loaded.
9. Cap tags per manifest.
10. Convert manifest to `data_sources` safe fields only.
11. Do not add NAS default path.
12. Do not add watcher.
13. Run backend focused tests.
14. Run frontend Office tests/build.
15. Commit Phase 8.

### Phase 9 micro checklist: VPS posture

1. Verify deployment target remains restricted `hermes` user.
2. Verify no new sudo/docker/NAS credential requirement.
3. If transferring projection files, transfer only validator-passing safe manifests.
4. Use VPS-local projection directory only.
5. Restart only the dashboard service/process that needs restart.
6. Verify private dashboard route over Tailscale/private endpoint.
7. Verify public exposure remains negative.
8. Record exact commands and results in handoff doc.
9. Do not mount NAS on VPS.
10. Do not copy raw Paperclip export directories.

### Phase 10 micro checklist: browser/raw-leak verification

1. Start dashboard from `/Users/lidises/dev/hermes-agent`, not the default install checkout.
2. Open `/office`.
3. Confirm Office map still renders.
4. Confirm Paperclip workbench section exists.
5. If source card exists, click inspect.
6. Check browser console for JS errors.
7. Run DOM text leak regex for forbidden strings.
8. Confirm sidebar did not regain a top-level Paperclip item unless explicitly intended later.
9. Confirm no mutation controls exist in workbench.
10. Save verification commands/results in Phase 11 handoff.

### Phase 11 micro checklist: handoff

1. Create `docs/ai-office/plans/2026-05-11-paperclip-workbench-handoff.md`.
2. List completed phases with commit hashes.
3. List verification commands and pass/fail results.
4. List safety boundaries still active.
5. List files changed.
6. List non-goals still intentionally not done.
7. List next recommended phase if work is incomplete.
8. Run final `git status --short --branch`.
9. Run final `git clean -nd`.
10. Commit handoff.

---

## Definition of done for the whole Paperclip bridge

- AI Office shows Paperclip/shared-context as a workbench, not a new primary app.
- The implementation is read-only.
- UI is Korean-first.
- Safe projection helper has tests.
- Raw fields are neither typed nor rendered.
- Manifest format is documented.
- Validator rejects unsafe manifests.
- Mac/WSL generation is dry-run and safe by default.
- VPS remains restricted and does not depend on NAS runtime access.
- Browser smoke and build pass.
- Repo has no untracked junk after commits:

```bash
git status --short --branch
git clean -nd
```
