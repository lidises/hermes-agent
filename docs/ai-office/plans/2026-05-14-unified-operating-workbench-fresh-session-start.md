# AI Office 통합 운영실 — Fresh Session Start

작성: 2026-05-14
목적: 새 `/new` 세션에서 바로 시작할 수 있는 첫 메시지/가드레일/작업 범위 제공.

## Copy-paste prompt for a new session

새 세션에서 아래를 그대로 붙여넣는다.

```text
AI Office 관련해서 새로 시작한다.

이제 기존에 따로 부르던 다음 항목들은 하나의 umbrella 프로젝트로 본다.

- AI Office / VPS dashboard
- VPS canonical `ai-office` Kanban board
- Paperclip / sourceTags / Projection Pipeline
- DeskRPG-like RPG Visualizer / dynamic Office dashboard

새 umbrella 이름은 다음으로 둔다.

AI Office Unified Operating Workbench
한국어 표시명: AI Office 통합 운영실

한 문장 정의:
VPS의 `ai-office` Kanban이 일을 관리하고, Paperclip/sourceTags가 근거를 붙이며, Projection Cache가 안전한 last-known-good 상태를 유지하고, `/office` RPG 운영실이 그것을 사람이 읽기 쉽게 보여준다.

이번 세션의 목표는 구현이 아니라 Phase 0 문서 통합이다.

반드시 먼저 읽을 것:
1. `docs/ai-office/NEXT.md`
2. `docs/ai-office/STATUS.md`
3. `/Users/lidises/dev/hermes-agent/.hermes/plans/2026-05-14_082251-ai-office-unified-operating-workbench-plan.md`
4. 이 handoff 파일: `docs/ai-office/plans/2026-05-14-unified-operating-workbench-fresh-session-start.md`

현재 live git 상태도 먼저 확인할 것:
- `git status --short --branch`
- `git log -1 --oneline`

이번 세션에서 할 일:
1. `docs/ai-office/product/unified-operating-workbench.md`를 만든다.
2. `docs/ai-office/architecture/unified-operating-workbench.md`를 만든다.
3. `docs/ai-office/NEXT.md`의 상단 Current next stage를 “AI Office 통합 운영실” umbrella 기준으로 짧게 정리한다.
4. `docs/ai-office/STATUS.md` 상단에 umbrella summary를 추가한다.
5. 기존 RPG/Kanban/Paperclip/Projection evidence 문서는 삭제하지 말고 하위 근거 링크로 묶는다.
6. `NEXT.md` 아래쪽의 오래된 Immediate next action / stale stage 지시가 상단 Current next stage와 충돌하면, 삭제하지 말고 “historical/stale; do not follow over Current next stage”라고 명시한다.
7. 마지막에 `git diff --check`를 돌리고, 변경 파일과 다음 승인 필요사항을 요약한다.

이번 세션에서 하지 말 것:
- `/office` 코드 구현 금지
- VPS dashboard worktree 변경 금지
- dashboard/gateway/core service restart 금지
- Kanban card 생성/수정/완료 금지
- cron/watcher enable 금지
- safe bundle transfer/promote 금지
- NAS mount/direct NAS credential/direct raw read 금지
- public exposure 변경 금지
- executable mutation controls 추가 금지
- Phaser/Pixi/canvas/renderer dependency 추가 금지
- DeskRPG code/assets/sprites copy 금지

중요한 제품 모델:
AI Office 통합 운영실은 4개 레이어로 정리한다.

1. Operating Board / 운영 보드
   - VPS canonical `ai-office` Kanban
   - 작업 상태의 source of truth
   - Mac/WSL/Telegram은 board가 아니라 relay/intake/context

2. Evidence Layer / 근거 레이어
   - Paperclip, sourceTags, safe manifest, source health
   - raw prompt/transcript/task body/log/tool args/credential-like 값은 표시하지 않음

3. Projection Cache / 안전 투영 캐시
   - validator, incoming/active/archive/rejected, last-known-good
   - VPS는 raw warehouse가 아니라 sanitized projection cache owner

4. RPG Room / RPG 운영실
   - `/office` dashboard/RPG visualizer
   - DOM/CSS-first, Korean-first, read-only-first
   - 캐릭터/방/동선/inspector/fallback rows로 사람이 읽기 쉽게 표시

완료 기준:
- 새 세션에서 `NEXT.md`와 `STATUS.md` 상단만 읽어도 2-5번이 하나의 제품이라는 점이 분명해야 한다.
- 다음 작업이 “또 새 HUD 추가”가 아니라 “통합 운영실 IA/layout/view-model consolidation”으로 보인다.
- 기존 evidence/verification은 사라지지 않고 링크로 유지된다.
- 코드/서비스/운영 mutation은 발생하지 않는다.
```

## Recommended first response in that new session

새 세션의 assistant는 첫 답변에서 바로 다음 순서로 진행하면 된다.

1. `hermes-agent` skill과 `plan` 또는 `writing-plans` skill을 로드한다.
2. 위 필수 파일 4개를 읽는다.
3. `git status --short --branch`와 `git log -1 --oneline`을 확인한다.
4. todo를 만든다.
5. Phase 0 문서 통합 파일을 작성한다.
6. `NEXT.md`/`STATUS.md` 상단을 축약 업데이트한다.
7. `git diff --check`로 검증한다.
8. final에서 변경 파일, 검증, 승인 필요사항을 짧게 보고한다.

## Phase 0 output files

Expected new/changed files:

```text
docs/ai-office/product/unified-operating-workbench.md
docs/ai-office/architecture/unified-operating-workbench.md
docs/ai-office/NEXT.md
docs/ai-office/STATUS.md
```

Optional evidence/plan file if useful:

```text
docs/ai-office/plans/2026-05-14-unified-operating-workbench-consolidation.md
```

## Safety boundary

This is a documentation consolidation pass only.

Allowed:

- read files
- inspect git status/log
- write docs
- update NEXT/STATUS
- run `git diff --check`
- summarize next approvals

Not allowed without separate explicit approval:

- code implementation
- commit/push/PR mutation
- VPS SSH mutation
- service restart
- Kanban writes
- cron/watcher enablement
- projection transfer/promote
- public exposure
- NAS mount/direct credentials/direct raw reads

## Short Korean summary to keep in mind

기존 2-5번은 따로 노는 프로젝트가 아니라 하나의 운영실이다.

- Kanban은 일의 상태
- Paperclip/sourceTags는 근거
- Projection Cache는 안전한 표시 재료
- RPG Visualizer는 사람이 읽는 화면
- VPS `/office`는 항상 켜져 있는 운영실 표면

따라서 다음 세션은 기능 추가가 아니라 “이 하나의 제품으로 문서/상태/다음 행동을 정렬하는 작업”부터 한다.
