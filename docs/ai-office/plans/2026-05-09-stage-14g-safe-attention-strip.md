# Stage 14-G — safe attention strip

Date: 2026-05-09
Branch: `ai-office-stage14-dynamic-tracking-20260509`

## Goal

Add a compact Stage 14-G attention strip to `/office` that compresses the already-safe Stage 14-E route compass and Stage 14-F focus lane into one Korean-first, read-only signal row.

The strip should answer: “which room/signal should I glance at first?” without exposing raw records, model/provider identities, task identities, prompts, transcripts, scripts, logs, or secrets.

## Scope

Frontend-only, read-only, CSS/SVG/DOM-only slice.

Implemented helper/view-model:

- `OfficeSafeAttentionStripChip`
- `OfficeSafeAttentionStrip`
- `buildOfficeSafeAttentionStrip(delta)`

UI hooks:

- `data-office-safe-attention-strip="true"`
- `data-office-safe-attention-strip-chip="focus|signal|scope"`

## Derivation rules

`buildOfficeSafeAttentionStrip(delta)` derives only from existing safe aggregates:

1. `buildOfficeSafeFocusLane(delta)`
2. `buildOfficeSafeRouteCompass(delta)`
3. Safe lane weights, active-room count, top safe room label, and compass tone.

The helper regenerates Korean labels/details and does not read raw focus-lane source labels, raw badge labels, raw flow labels, recent-change labels/details, task body, transcript, prompt, script, logs, provider/model identity, auth material, secrets, or tokens.

Expected chip shape:

- `focus`: top safe room + density, for example `작업 · 밀도 4`
- `signal`: tone-based signal, for example `주의 우선`
- `scope`: active room count + total density, for example `방 3개 · 밀도 8`

Decorative posture:

- `ariaHidden: true`
- `interactive: false`

## Safety constraints

Stage 14-G must not add:

- backend/API/schema changes
- mutation controls
- persistent browser storage
- renderer dependencies, canvas, PixiJS, Phaser, sprite assets, or copied DeskRPG code/assets
- cron/Kanban/topic/gateway/NAS/Obsidian writes
- raw prompt/transcript/task body/script/log/auth/secret/token/model/provider/task identity projection

## TDD record

RED was verified first from `web/`:

```text
TypeError: buildOfficeSafeAttentionStrip is not a function
```

GREEN helper verification:

```text
npm test -- --run OfficePage.test.ts
# 36 passed
```

## Verification target

From `web/`:

```bash
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build
```

From repo root:

```bash
source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short && git diff --check
```

Browser smoke:

- `/office?stage14g=safe-attention-strip`
- attention strip exists
- attention chips are `focus|signal|scope`
- focus lane exists
- route compass exists
- breadcrumb exists
- pulse timeline exists
- raw leak regex false
- console JS errors none

## Next candidate

After Stage 14-G, continue only if the next slice remains meaningfully different and can be derived from existing safe DTO/delta aggregates. Keep the renderer decision closed and preserve the read-only/non-persistent/no-raw-projection boundary.
