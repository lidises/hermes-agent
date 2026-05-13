# Office Projection Pipeline 1 Plan

> **For Hermes:** Use this as a planning handoff only. Do not implement until the user explicitly approves the implementation scope. Use `subagent-driven-development` only after approval.

**Goal:** Define a safe projection/cache contract so the VPS can keep showing `/office` from last-known-good sanitized snapshots while MacBook and WSL relays produce/validate privacy-safe material from NAS/Paperclip/raw sources.

**Architecture:** VPS remains an always-on private read-only display core with a local projection cache. MacBook and WSL are equivalent relays that read raw/canonical sources, generate sanitized projection bundles, validate them, and deliver only safe outputs to VPS `incoming`. VPS validates again, promotes passing bundles to `active`, archives/rejects failed inputs, and renders only aggregate freshness/rejection posture in `/office`.

**Baseline:** Local branch `ai-office-stage16e-safe-spatial-choreography-20260510` at `fef4dfae93f4ba19646c282149fd5fe47c59e9cd`. PR #4 is draft/open/mergeable. As of the 2026-05-12 read-only preflight, VPS dashboard worktree `/home/hermes/.hermes/ai-office-dashboard` is clean but stale at `05c99433`; `hermes-agent-dashboard.service` is active/enabled and bound to `100.122.57.85:8765`; `hermes-gateway.service` is active and must remain untouched unless separately approved. A mutating VPS deploy command was blocked by the tool approval layer with `BLOCKED: User denied. Do NOT retry.`

---

## 1. Non-negotiable boundaries

### VPS responsibilities

- Serve `/office` as an always-on private/Tailscale-only dashboard.
- Store and display last-known-good safe projection snapshots.
- Show freshness/staleness/rejection/relay-offline state honestly.
- Validate every incoming projection before promotion.
- Render only sanitized DTOs, safe counts, statuses, source tags, freshness, validator result, and redaction posture.

### VPS non-responsibilities

- Do not read raw NAS, Paperclip, transcripts, task bodies, logs, scripts, prompts, secrets, auth files, or private source documents.
- Do not require a NAS mount for `/office` to render.
- Do not receive broad NAS credentials or full-NAS RW authority.
- Do not start watchers, mutate Kanban/Cron/Telegram, or expose public dashboard routes in Pipeline 1.
- Do not add renderer/dependency changes as part of Pipeline 1.

### MacBook / WSL relay responsibilities

- Treat MacBook and WSL as equivalent relays; WSL is not a fallback tier below Mac.
- Read NAS/Paperclip/raw material locally where raw access is authorized.
- Generate projection bundles with `raw_excluded: true` and a redaction guarantee.
- Validate locally before transfer.
- Transfer only sanitized projection bundles to the VPS.

### NAS responsibilities

- Remain canonical durable material warehouse/ledger.
- Hold raw/source material outside VPS runtime dependency.
- Continue as evidence/rationale storage, not a live dashboard dependency.

---

## 2. Proposed VPS cache layout

Target root:

```text
/home/hermes/.hermes/office/projections/
  incoming/
  active/
  archive/
  rejected/
```

Directory semantics:

- `incoming/`: relay-delivered candidate projection bundles awaiting VPS validation.
- `active/`: exactly the current last-known-good projection set consumed by `/office`.
- `archive/`: time-stamped accepted historical bundles and prior active snapshots for rollback/audit.
- `rejected/`: failed validation bundles plus safe rejection metadata. `/office` must show only aggregate rejection counts/reasons, never raw bundle contents.

Bundle naming convention:

```text
<generated_at-utc-basic>__<generated_by>__<source_kind>__<bundle_id>/
  manifest.json
  payload.json
  validator.json
```

Example:

```text
20260512T071500Z__mac__paperclip__pcwb-safe-001/
  manifest.json
  payload.json
  validator.json
```

Rules:

- Bundle IDs must be stable, short, non-secret, and path-safe.
- Do not encode raw private file paths, topic IDs, patient/user names, task titles, prompt snippets, or transcript text into filenames.
- `active/` should be updateable atomically by symlink swap or rename-only promotion after validation.

---

## 3. Projection manifest schema v1

File: `manifest.json`

Required fields:

```json
{
  "schema_version": "office_projection_manifest.v1",
  "bundle_id": "pcwb-safe-001",
  "generated_at": "2026-05-12T07:15:00Z",
  "generated_by": "mac",
  "source_kind": "paperclip",
  "source_tags": ["paperclip", "clinic-growth", "safe-manifest"],
  "freshness": {
    "valid_for_seconds": 86400,
    "stale_after": "2026-05-13T07:15:00Z",
    "hard_expire_after": "2026-05-19T07:15:00Z",
    "policy": "show-last-known-good-with-stale-label"
  },
  "redaction": {
    "guarantee": "raw_excluded_and_allowlisted_fields_only",
    "raw_excluded": true,
    "excluded_classes": [
      "prompts",
      "transcripts",
      "task_bodies",
      "task_results",
      "logs",
      "scripts",
      "tool_args",
      "full_private_paths",
      "credentials",
      "tokens",
      "provider_model_identity",
      "raw_adapter_errors"
    ]
  },
  "validator": {
    "name": "office_projection_validator",
    "version": "v1",
    "result": "pass",
    "checked_at": "2026-05-12T07:15:05Z",
    "safe_summary": "3 paperclip source-tag cards, 0 raw fields, 0 secret sentinels"
  },
  "payload": {
    "file": "payload.json",
    "content_type": "application/json",
    "summary": {
      "safe_item_count": 3,
      "attention_count": 0,
      "rooms": ["sources", "work"],
      "display_cards": ["manifests", "privateDashboard", "relayPosture"]
    }
  }
}
```

Enum values:

- `generated_by`: `mac | wsl | manual | scheduler`
- `source_kind`: `paperclip | kanban | obsidian | schedule | status`
- `validator.result`: `pass | fail | warning`

Policy rules:

- `raw_excluded` must be exactly `true`.
- Unknown `generated_by` or `source_kind` fails validation.
- `generated_at`, `checked_at`, `stale_after`, and `hard_expire_after` must be parseable UTC timestamps.
- `hard_expire_after` must be greater than or equal to `stale_after`.
- `source_tags` must be short safe labels; no path separators, URLs with credentials, raw topic IDs, or long free text.
- `safe_summary` must be bounded and must not include raw validation error bodies.

---

## 4. Projection payload schema v1

File: `payload.json`

Top-level shape:

```json
{
  "schema_version": "office_projection_payload.v1",
  "bundle_id": "pcwb-safe-001",
  "source_kind": "paperclip",
  "generated_at": "2026-05-12T07:15:00Z",
  "redacted": true,
  "items": [],
  "summary": {},
  "display": {}
}
```

Payload contract:

- Payload is display-facing DTO material only.
- Payload may include counts, statuses, freshness buckets, known room IDs, generated Korean labels, safe source tags, validator posture, and summary cards.
- Payload must not include raw material, private paths, token-shaped values, raw errors, raw task titles/bodies/results, prompts, transcripts, scripts, tool args, provider/model identity, or Telegram numeric topic IDs.

Suggested source-kind payloads:

### paperclip

- Safe source-tag cards.
- Validator-passing manifest counts.
- Redaction posture.
- Relay production posture.
- No raw Paperclip/NAS document bodies.

### kanban

- Safe task refs, board refs, status counts, stale/blocked/workload summaries.
- No task title/body/result/comments/logs.
- No raw Telegram topic IDs.

### obsidian

- Safe ledger freshness and high-level context category counts.
- No note body, private filenames if sensitive, or raw personal material.

### schedule

- Cron/job counts, next-run timing buckets, failure counts.
- No cron scripts, command bodies, env, logs, or secrets.

### status

- Service/dashboard/source posture summaries.
- No system logs, env, auth/config dumps, or process command args containing secrets.

---

## 5. VPS ingest rule

Pipeline:

```text
relay/manual places bundle in incoming/
  -> VPS validator reads manifest + payload
  -> pass: copy/rename to archive/ and atomically promote latest to active/
  -> warning: promote only if warning class is display-safe and policy allows it
  -> fail: move to rejected/ with safe rejection metadata
  -> /office displays active last-known-good plus aggregate incoming/rejected/freshness state
```

Promotion requirements:

- Never promote directly from an unvalidated incoming path.
- Promotion must be atomic from the dashboard reader perspective.
- If promotion fails, keep prior active snapshot untouched.
- If all incoming bundles fail, `/office` continues rendering the prior active snapshot with stale/rejected indicators.
- Rejection metadata must be safe and bounded:
  - allowed: source_kind, generated_by, generated_at bucket, validator rule ID, high-level reason code.
  - denied: raw validation excerpts, full file paths, raw payload snippets, secrets, prompt/script/log fragments.

Failure modes:

- No `active/`: render built-in empty safe state plus `no_last_known_good` indicator.
- Relay offline: keep last-known-good and show relay stale/offline.
- Validator unavailable: do not promote; show validator degraded state.
- Payload schema mismatch: reject bundle; keep last-known-good.
- Clock skew: reject or warn depending on skew size; never fabricate freshness.

---

## 6. Dashboard behavior

`/office` should show:

- Last-known-good snapshot first.
- Fresh/stale/degraded/offline state clearly.
- Projection source cards by `source_kind`.
- Relay state by `generated_by` without implying Mac > WSL priority.
- Aggregate rejected bundle count and safe reason buckets.
- Redaction guarantee and `raw_excluded: true` posture.

`/office` should not show:

- Raw rejection payloads.
- Raw file paths from NAS/Mac/WSL/VPS.
- Raw Paperclip/NAS/Obsidian note content.
- Task bodies/results/comments/logs/prompts/scripts/tool args.
- Secrets, tokens, auth/config dumps, or provider/model identity.
- Mutation controls in the read-only Office surface.

Suggested UI labels:

- `마지막 안전 스냅샷`
- `릴레이 상태`
- `신선도`
- `검증 결과`
- `거절된 투영`
- `원문 제외 보장`

---

## 7. Relay behavior

Initial relay mode should be manual/dry-run only until watcher automation is separately approved.

Relay steps:

1. Read raw/canonical source locally on MacBook or WSL.
2. Generate `manifest.json` and `payload.json` under a local temp/output directory.
3. Run local validator.
4. If local validation passes, transfer only the safe bundle to VPS `incoming/` through an approved path.
5. VPS runs its own validator before promotion.
6. Relay records only safe transfer status and bundle ID in local logs/handoff.

Do not implement in Pipeline 1 without separate approval:

- Continuous watchers.
- Cron/scheduler automation.
- NAS mount on VPS.
- Broad relay RW commands.
- Dashboard-triggered relay execution.
- Mutation UI.
- Raw browser/workbench mode.

---

## 8. Implementation phases after approval

Use fresh numbering for this track instead of continuing legacy Stage 16/17 labels.

### Phase 0: Baseline and safety tests

**Objective:** Add tests/fixtures for projection manifest and payload validation without changing live behavior.

Likely files:

- Create: `tests/test_office_projection_validator.py`
- Create: `tests/fixtures/office_projection/valid_bundle/manifest.json`
- Create: `tests/fixtures/office_projection/valid_bundle/payload.json`

Verification:

```bash
.venv/bin/python -m pytest tests/test_office_projection_validator.py -q -o addopts=
```

### Phase 1: Validator CLI/library

**Objective:** Implement an allowlist validator for manifest/payload bundles.

Likely files:

- Create: `scripts/ai_office/validate_office_projection.py`
- Maybe create: `hermes_cli/office_projection_validator.py`

Verification:

```bash
.venv/bin/python scripts/ai_office/validate_office_projection.py tests/fixtures/office_projection/valid_bundle
.venv/bin/python scripts/ai_office/validate_office_projection.py --json tests/fixtures/office_projection/valid_bundle
.venv/bin/python -m pytest tests/test_office_projection_validator.py -q -o addopts=
```

### Phase 2: VPS cache reader, no ingest mutation yet

**Objective:** Read only already-active safe projection snapshots and merge them into OfficeState/source DTOs.

Likely files:

- Modify: `hermes_cli/office_adapters.py`
- Modify: `tests/hermes_cli/test_office_state_adapters.py`
- Possibly modify: `hermes_cli/office_state.py`

Verification:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q -o addopts=
```

### Phase 3: Ingest/promote command, still manual

**Objective:** Add a command that validates `incoming/` bundles and promotes passing bundles to `active/` atomically.

Likely files:

- Create: `scripts/ai_office/ingest_office_projection.py`
- Create: `tests/test_office_projection_ingest.py`

Verification:

```bash
.venv/bin/python -m pytest tests/test_office_projection_ingest.py tests/test_office_projection_validator.py -q -o addopts=
```

### Phase 4: Dashboard freshness/rejection UI

**Objective:** Show last-known-good freshness, relay source, and rejected-bundle aggregates in `/office`.

Likely files:

- Modify: `web/src/pages/officeView.ts`
- Modify: `web/src/pages/OfficePage.tsx`
- Modify: `web/src/pages/OfficePage.test.ts`

Verification:

```bash
cd web
npm test -- --run OfficePage.test.ts -t "Projection Pipeline"
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build
```

### Phase 5: Mac/WSL relay dry-run producer

**Objective:** Provide a manual producer that creates safe projection bundles locally without transfer automation.

Likely files:

- Create: `scripts/ai_office/generate_office_projection.py`
- Create tests for paperclip/kanban/status dry-run payloads.

Verification:

```bash
.venv/bin/python scripts/ai_office/generate_office_projection.py --source-kind paperclip --dry-run --output /tmp/office-projection-test
.venv/bin/python scripts/ai_office/validate_office_projection.py /tmp/office-projection-test
```

### Phase 6: Approved transfer path to VPS incoming

**Objective:** Only after separate approval, copy validator-passing bundles to VPS `incoming/` and run manual ingest.

This phase requires explicit approval because it mutates VPS filesystem state.

Allowed, if approved:

- Create projection directories under `/home/hermes/.hermes/office/projections/`.
- Copy safe projection bundle to `incoming/`.
- Run manual validator/ingest.
- Restart dashboard service only if the reader requires it; prefer no restart if live read picks up active snapshots.

Not allowed without separate approval:

- NAS mount on VPS.
- Watcher/cron automation.
- Telegram gateway restart.
- Mutation controls.
- Public exposure changes.

---

## 9. Testing and safety gates

Required tests before any PR/deploy:

- Manifest schema validation.
- Payload schema validation.
- Raw sentinel rejection:
  - private paths like `/Users/...`, `/home/hermes/.hermes/auth.json`
  - token-like strings
  - prompt/transcript/task_body/script/log keys or values
  - raw adapter error text
- Atomic promotion behavior.
- Rejected-bundle safe metadata behavior.
- Dashboard renders stale/last-known-good without active relay.
- Dashboard does not crash when `incoming/`, `active/`, `archive/`, or `rejected/` are missing.
- Browser smoke raw leak probe on `/office`.

Suggested local verification bundle:

```bash
cd /Users/lidises/dev/hermes-agent
.venv/bin/python -m pytest tests/test_office_projection_validator.py tests/test_office_projection_ingest.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q -o addopts=
cd web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build
```

---

## 10. Security substitutions for deferred/non-recommended permissions

The following items are not part of the default Pipeline 1 path. If they appear necessary, prefer the replacement path first and change the product goal rather than expanding VPS authority.

| Deferred / not recommended | Why not default | Replacement path | Goal adjustment |
| --- | --- | --- | --- |
| VPS NAS mount | Expands VPS authority, adds credential exposure, and makes `/office` depend on NAS runtime health. | MacBook/WSL relays read raw NAS locally and emit validator-passing projection bundles only. | VPS shows last-known-good safe snapshots, not live raw NAS browsing. |
| Direct VPS NAS credential | Creates a durable secret on the always-on VPS and broadens compromise blast radius. | Keep credentials on approved relay machines; transfer only `raw_excluded: true` bundles. | Treat VPS as display/cache, not raw data worker. |
| Watcher/cron automation | Persistent automation can repeat bad transfers/mutations and is harder to reason about than manual promotion. | Manual relay dry-run producer plus manual VPS ingest for Pipeline 1. | Optimize for auditable correctness over freshness until the contract is proven. |
| Dashboard-triggered mutation controls | Turns `/office` from read-only display into an operations console. | Keep dashboard controls inspect-only; run approved commands from CLI with explicit scope. | `/office` remains a status surface, not a control plane. |
| Telegram gateway restart or gateway authority change | Risks interrupting the 24/7 messaging control plane and is unrelated to projection cache validation. | Do not touch gateway for Pipeline 1; use dashboard-only service actions only when separately approved. | Separate dashboard release from messaging operations. |
| Core checkout change | Changes agent/gateway runtime beyond the dashboard projection concern. | Use the dedicated dashboard worktree and local branch verification. | Release Pipeline 1 as dashboard/projection code only. |
| Public exposure change | Increases network attack surface and conflicts with private/Tailscale-only posture. | Keep listener private/Tailscale-only and verify public negative probes read-only. | Private always-on display, not public web app. |
| Renderer/dependency adoption | Adds supply-chain and bundle complexity without proving CSS/SVG cannot handle the display. | Continue dependency-free CSS/SVG projection/freshness UI. | Solve stale/last-known-good clarity before visual engine changes. |

Pipeline 1 therefore proceeds with this safer shape:

1. Local-only Phase 0-5 implementation after approval: schemas, validator, active-cache reader, manual ingest, dashboard stale/rejection UI, and relay dry-run producer.
2. VPS mutation only after separate temporary approval: create projection directories, transfer one validator-passing safe bundle, run manual ingest, and restart dashboard only if the reader requires it.
3. No persistent automation, NAS mount, direct NAS credential, public route, mutation control, gateway restart, or core checkout change.

---

## 11. Approval gates to batch later

Collect these for one later approval instead of interrupting during planning:

1. Local implementation approval for Pipeline 1 Phases 0-5.
2. Local file modification approval for validator/scripts/tests/docs/UI.
3. Commit approval after local verification.
4. Push/PR update approval for existing PR #4 or a new branch, depending on chosen release strategy.
5. VPS filesystem mutation approval for creating `/home/hermes/.hermes/office/projections/{incoming,active,archive,rejected}`.
6. Safe bundle transfer approval from Mac/WSL relay to VPS `incoming/`.
7. Manual VPS ingest command approval.
8. Dashboard service restart approval only if needed after reader/UI deployment.
9. Watcher/cron automation approval, explicitly deferred.
10. NAS mount or direct VPS NAS credential approval, explicitly not recommended for Pipeline 1 and deferred unless the user changes the authority model.

---

## 12. Current execution note — 2026-05-12

Initially completed before the small local/PR approvals, and without VPS mutation, service restart, gateway change, NAS mount, watcher, public exposure change, commit, push, or PR update:

- Added Phase 0/1 local validator baseline and first hardening pass:
  - `scripts/ai_office/validate_office_projection.py`
  - `tests/test_office_projection_validator.py`
  - `tests/fixtures/office_projection/valid_bundle/manifest.json`
  - `tests/fixtures/office_projection/valid_bundle/payload.json`
- The validator accepts a local bundle directory containing `manifest.json` and `payload.json`.
- The validator reports only field paths and error categories; it does not echo suspicious private paths or token-like values.
- The validator supports `--json` safe machine-readable pass/rejection metadata for later ingest, without printing rejected raw values.
- The validator bounds `manifest.validator.safe_summary` and `payload.items` so projection bundles remain dashboard-safe.
- The example bundle validates successfully with `OK: safe Office projection bundle`.
- Verification passed:
  - `PYTHONDONTWRITEBYTECODE=1 .venv/bin/python -m pytest tests/test_office_projection_validator.py -q -o addopts= -p no:cacheprovider` → 10 passed.

Important git note: the Phase 0 example bundle was moved to `tests/fixtures/office_projection/valid_bundle/` so it is no longer hidden by the repository's broad `examples/` ignore rule.

After small local/PR approvals, the permitted continuation scope is: local Phase 0/1 validator hardening, focused verification, local commit, and PR update. The excluded scope remains unchanged: no VPS dashboard deploy, no VPS filesystem mutation, no service restart, no gateway/core change, no NAS mount/credential, no watcher/cron automation, no public exposure change, and no dashboard mutation controls.

---

## 13. Recommended next action

Before Pipeline 1 implementation, finish the smaller safety deployment if the approval layer permits it later:

- Bring VPS dashboard worktree from `05c99433` to `fef4dfae`.
- Build/test.
- Restart only `hermes-agent-dashboard.service`.
- Smoke `/office` for hidden Office-route mutation actions and browser-local timestamp policy.

Because the latest mutation attempt was blocked by the tool approval layer, do not retry the same VPS mutation in this session unless the approval layer state changes and the user provides a new explicit approval path.

After that, start Pipeline 1 with Phase 0 tests and examples, not watcher automation or NAS/VPS mount work.
