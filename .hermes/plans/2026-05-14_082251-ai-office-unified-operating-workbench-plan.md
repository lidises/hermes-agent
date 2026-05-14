# AI Office 통합 운영 Workbench 기획

작성: 2026-05-14 08:22 KST
범위: 기획 전용. 코드 구현, 서비스 재시작, Kanban/cron/NAS/VPS mutation 없음.

## 1. 목표

기존에 따로 불리던 다음 4개 축을 하나의 제품/프로젝트로 재정의한다.

- AI Office / VPS dashboard
- canonical VPS `ai-office` Kanban board
- Paperclip / Source-tag Workbench / Projection Pipeline
- DeskRPG-like dynamic Office dashboard / RPG Visualizer

새 이름은 임시로 다음을 권장한다.

> AI Office Unified Operating Workbench
> 한국어 표시명: AI Office 통합 운영실

핵심 정의:

> AI Office 통합 운영실은 “일을 만들고, 근거를 붙이고, 안전하게 요약하고, 진행 상태를 RPG 사무실처럼 읽는” 하나의 read-only-first 운영 화면이다.

즉 Kanban은 실행 상태, Paperclip/Projection은 근거와 안전한 소스 맥락, RPG Visualizer는 읽기 쉬운 표시 방식, VPS dashboard는 항상 켜져 있는 접근 표면이다. 네 개가 별도 프로젝트가 아니라 같은 제품의 서로 다른 레이어다.

## 2. 현재 문제

현재 문서와 대화에서는 같은 방향의 작업이 여러 이름으로 분산되어 있다.

1. AI Office dashboard
   - 사용자가 보는 화면/제품 표면.
   - `/office` private VPS dashboard가 대표.

2. Kanban-first operating conversion
   - 실제 작업 상태와 운영 흐름의 source of truth.
   - canonical board: VPS `ai-office`.

3. Paperclip / Source-tag / Projection Pipeline
   - 작업의 배경 근거, 소스, NAS/Paperclip/raw material을 안전하게 요약하는 계층.
   - raw material은 VPS/browser에 직접 노출하지 않고 safe projection/cache만 전달.

4. DeskRPG / RPG Visualizer / Dynamic tracking
   - 위 상태를 사람이 한눈에 읽는 시각화 방식.
   - DOM/CSS-only, read-only, Korean-first, reduced-motion aware.

현재 분산의 부작용:

- “AI Office가 어디까지 됐는지”가 한눈에 안 잡힘.
- Kanban, Paperclip, Projection, RPG Visualizer가 따로 노는 것처럼 보임.
- NEXT/STATUS가 stage 번호, feature track, PR/deploy evidence가 누적되어 길어짐.
- 다음 일을 고를 때 “새 기능을 더 붙일지”와 “운영실로 통합 정리할지”가 섞임.

## 3. 통합 제품 모델

### 3.1 한 문장 제품 정의

AI Office 통합 운영실은 Hermes 작업을 다음 흐름으로 보여주는 read-only-first 운영 제품이다.

```text
요청/아이디어/Telegram/CLI
  → canonical ai-office Kanban 작업 상태
  → Paperclip/sourceTags/projection으로 근거와 안전 맥락 연결
  → VPS active projection cache에서 last-known-good 상태 유지
  → /office RPG 운영실에서 사람에게 읽히는 형태로 표시
```

### 3.2 네 레이어

#### Layer A — Operating source of truth

담당: VPS canonical `ai-office` Kanban board

역할:

- 어떤 일이 존재하는가
- 누가/어떤 worker profile이 맡는가
- triage/active/blocked/done 상태는 무엇인가
- review/checkpoint가 끝났는가

원칙:

- 하나의 canonical board만 둔다: VPS `ai-office`.
- Mac/WSL은 local board가 아니라 relay/status client.
- Telegram topic은 board가 아니라 intake metadata/source topic이다.

#### Layer B — Evidence/source context

담당: Paperclip Workbench + sourceTags + manifest/projection bundle

역할:

- 작업에 어떤 근거/문맥/source가 붙어 있는가
- raw 자료가 아니라 어떤 safe tag/manifest/summary만 표시 가능한가
- source health, redaction, provenance 상태가 어떤가

원칙:

- raw NAS/Paperclip/task body/transcript/log/tool args는 browser/VPS UI로 직접 보내지 않는다.
- safe `sourceTags`, counts, status, freshness, redaction posture, validator result만 표시한다.
- Paperclip은 새 top-level tab이 아니라 Office 운영실 내부의 evidence layer다.

#### Layer C — Projection/cache pipeline

담당: Projection Pipeline / VPS active cache / validator / ingest

역할:

- Mac/WSL/manual producer가 만든 safe bundle을 검증한다.
- VPS는 last-known-good active projection을 유지한다.
- incoming 실패 시 active를 깨지 않고 stale/rejected aggregate만 보여준다.

원칙:

- VPS는 raw source warehouse가 아니다.
- VPS에는 sanitized projection bundle만 저장한다.
- active cache는 `/office`의 안정성 장치다.

#### Layer D — Human-readable operating room

담당: `/office` dashboard + RPG Visualizer

역할:

- Kanban state, source/evidence posture, projection freshness, automation/routing status를 사람이 읽기 쉽게 보여준다.
- 캐릭터/방/동선/필터/inspector/fallback row로 상태를 표현한다.

원칙:

- Korean-first.
- DOM/CSS-first, no Phaser/Pixi/canvas/sprites unless separately approved.
- read-only-first; mutation controls는 별도 게이트.
- CSS motion은 “실제 작업”을 꾸며내지 않고, safe event/delta/freshness만 표현한다.

## 4. 이름/문서 정리 제안

### 4.1 권장 명명

기술/문서상 umbrella name:

- `AI Office Unified Operating Workbench`

사용자 화면/한국어:

- `AI Office 통합 운영실`

하위 모듈명:

- `Operating Board` / `운영 보드`: Kanban source of truth
- `Evidence Layer` / `근거 레이어`: Paperclip/sourceTags
- `Projection Cache` / `안전 투영 캐시`: validator + active cache
- `RPG Room` / `RPG 운영실`: visualizer/dashboard

피해야 할 명명:

- Paperclip을 별도 제품처럼 top-level화
- Kanban을 dashboard와 별도 앱처럼 표현
- RPG Visualizer를 “게임”으로 표현해 mutation/agent autonomy 오해 유발
- Projection Pipeline을 raw sync나 NAS mirror처럼 표현

### 4.2 문서 구조 정리

현행 문서를 전부 갈아엎기보다, 상위 index/decision 문서를 하나 만든 뒤 기존 evidence 문서는 링크로 묶는다.

권장 신규 문서:

- `docs/ai-office/architecture/unified-operating-workbench.md`
- `docs/ai-office/product/unified-operating-workbench.md`
- `docs/ai-office/plans/YYYY-MM-DD-unified-operating-workbench-consolidation.md`

`NEXT.md`와 `STATUS.md`에는 길게 반복하지 말고 다음 식으로 축약한다.

```text
Current umbrella project: AI Office Unified Operating Workbench.
It combines the canonical VPS ai-office Kanban board, safe Paperclip/sourceTag evidence, Projection Cache, and the /office RPG operating room. See docs/ai-office/architecture/unified-operating-workbench.md for the source-of-truth model and docs/ai-office/product/unified-operating-workbench.md for product language.
```

## 5. 화면 정보구조 제안

`/office`를 기능 나열형 dashboard가 아니라 “운영실”로 재배치한다.

### 5.1 Top-level 화면 순서

1. 운영실 헤더
   - 현재 active projection freshness
   - canonical board: `ai-office`
   - safe/read-only/private posture
   - 마지막 검증/배포 상태

2. RPG 운영실 맵
   - 캐릭터/방/동선/상태를 먼저 보여줌
   - 필터: room, status, severity, role
   - jump targets: 지도, 작업, 근거, 소스, 안전 정보

3. Work queue / Kanban posture
   - open/active/blocked/done counts
   - current cards summary only
   - raw task body/result는 숨김
   - “이 화면은 canonical board를 읽는 표면”이라고 명확히 표시

4. Evidence / Paperclip posture
   - sourceTags
   - safe manifest count
   - redaction/provenance/freshness
   - source health compact cards

5. Projection cache / freshness
   - relay → validator → active cache → dashboard projection
   - active bundle id, age bucket, rejected aggregate
   - last-known-good 유지 여부

6. Safety inspector / diagnostics drawer
   - raw excluded classes
   - mutation controls absent/disabled posture
   - private/Tailscale posture
   - reduced-motion/browser-local tracking truth

### 5.2 핵심 UX 문구

헤더 문구 예시:

```text
AI Office 통합 운영실
VPS ai-office 보드, 안전 근거 투영, active projection cache를 하나의 RPG 운영실로 읽습니다.
이 화면은 read-only이며 raw 자료와 실행 버튼은 표시하지 않습니다.
```

Projection copy 예시:

```text
현재 화면은 active projection cache의 마지막 안전 스냅샷을 표시합니다.
새 raw 자료를 직접 읽지 않으며, 실패한 incoming bundle은 기존 active 화면을 깨지 않습니다.
```

Kanban copy 예시:

```text
작업 상태의 기준은 VPS canonical ai-office 보드입니다.
Telegram topic, Mac, WSL은 별도 보드가 아니라 intake/relay/context입니다.
```

Paperclip copy 예시:

```text
근거는 sourceTag와 안전 manifest로만 연결됩니다.
원문, transcript, prompt, tool args, task body, credential-like 값은 표시하지 않습니다.
```

## 6. 데이터/상태 모델 정리

통합 view-model은 다음 형태를 권장한다.

```text
OfficeUnifiedState
  operatingBoard
    canonicalHost
    boardSlug
    counts
    activeWorkSummary
    blockedSummary
    reviewPosture

  evidenceLayer
    sourceTags
    paperclipManifestSummary
    sourceHealth
    redactionPosture
    provenancePosture

  projectionCache
    activeBundle
    freshness
    validatorPosture
    rejectedAggregate
    lastKnownGood

  rpgRoom
    rooms
    characters
    routes
    filters
    inspector
    fallbackRows

  safetyPosture
    readOnly
    privateOnly
    rawExcluded
    mutationControls
    approvalGates
```

중요한 점:

- 이 모델은 browser-facing DTO다.
- raw adapter errors, task body, transcript, prompt, scripts, logs, secrets, provider/model identity, numeric Telegram topic ids는 넣지 않는다.
- 처음에는 기존 `OfficeState`에서 helper로 파생해도 된다.
- backend schema를 바로 바꾸지 말고, 프론트 pure helper/view-model consolidation부터 시작한다.

## 7. 단계별 실행계획

### Phase 0 — 용어/문서 통합

목표:

- “2-5번은 하나다”를 공식 project decision으로 문서화.
- NEXT/STATUS가 앞으로 이 umbrella 아래에서 설명되게 만든다.

산출물:

- `docs/ai-office/product/unified-operating-workbench.md`
- `docs/ai-office/architecture/unified-operating-workbench.md`
- `docs/ai-office/plans/YYYY-MM-DD-unified-operating-workbench-consolidation.md`
- `docs/ai-office/NEXT.md` 축약 업데이트
- `docs/ai-office/STATUS.md` 상단 summary 축약 업데이트

검증:

- 문서 내 금지어/위험 표현 점검: raw sync, NAS mirror, direct NAS, executable controls 등 오해 소지 제거.
- `git diff --check`.

승인 필요도:

- 로컬 문서 변경만이면 낮음.
- commit/push는 별도 승인 권장.

### Phase 1 — 제품 정보구조 재정의

목표:

- `/office`를 “기능 모음”이 아니라 “운영실”로 재배치하는 IA 설계.
- 어떤 섹션이 primary/secondary/drawer인지 결정.

산출물:

- product IA 문서
- 화면 섹션 우선순위
- 화면 copy 초안
- read-only/safety copy

권장 우선순위:

1. RPG 운영실 맵
2. 운영 보드 요약
3. 근거/소스 posture
4. Projection cache freshness
5. safety/diagnostics drawer

검증:

- 사용자 입장에서 “지금 어떤 일이 돌아가는지”가 첫 화면에서 10초 안에 읽히는지 체크.
- mutation/automation/NAS 권한처럼 위험한 의미가 copy에 섞이지 않는지 체크.

### Phase 2 — View-model consolidation

목표:

- 기존 `OfficeState` 파생 helper들이 흩어져 있다면, umbrella view-model helper로 묶는다.
- 구현 시에는 helper-first TDD.

예상 파일:

- `web/src/pages/officeView.ts`
- `web/src/pages/OfficePage.test.ts`
- `web/src/pages/OfficePage.tsx`

예상 helper:

```ts
export type OfficeUnifiedWorkbenchView = { ... }
export function buildOfficeUnifiedWorkbenchView(state: OfficeState): OfficeUnifiedWorkbenchView
```

원칙:

- 기존 기능을 제거하지 않고 grouping/sectioning/view-model부터 시작.
- raw-leak sentinel test 필수.
- backend/API schema 변경은 후순위.

검증:

- focused Vitest
- ESLint
- build
- raw-leak sentinel

승인 필요도:

- 코드 변경이므로 명시 승인 필요.

### Phase 3 — `/office` layout consolidation

목표:

- `/office` 상단을 AI Office 통합 운영실로 재구성.
- 기존 누적 HUD/diagnostics는 접힌 secondary drawer로 내린다.

변경 방향:

- 맵/운영 상태를 첫 화면으로 올린다.
- Paperclip/Projection/Kanban을 별도 섬이 아니라 같은 운영실의 패널로 묶는다.
- Stage 번호 대신 역할 기반 제목을 사용한다.

예상 UI 섹션:

```text
AI Office 통합 운영실
  ├─ RPG 운영실 맵
  ├─ 운영 보드
  ├─ 근거/소스
  ├─ 안전 투영 캐시
  └─ 안전 정보 / diagnostics drawer
```

검증:

- `/office?unified-workbench=1` local browser smoke
- console errors 0
- mutation controls/forms 0
- raw leak probe false
- reduced-motion posture 유지
- mobile/narrow posture smoke

승인 필요도:

- 코드 변경 승인 필요.
- VPS deploy/restart는 별도 승인.

### Phase 4 — Kanban-backed operating loop 연결

목표:

- 향후 새 AI Office 작업은 canonical `ai-office` board에 “운영실 작업”으로 등록/진행되게 한다.
- 단, dashboard에서 직접 mutation button을 누르는 구조는 아직 만들지 않는다.

권장 방식:

- CLI/Telegram/approved workflow에서만 Kanban card 생성.
- `/office`는 read-only board posture 표시.
- Mac wrapper `<local-user-bin>/ai-office-kanban`은 status query 역할 유지.

검증:

- board slug가 `ai-office`인지
- Mac/WSL local board가 생기지 않는지
- raw task body/result가 `/office`에 노출되지 않는지

승인 필요도:

- Kanban writes는 별도 승인.

### Phase 5 — Projection automation 설계

목표:

- manual safe bundle generation과 VPS active cache를 운영실 관점에서 자동화 설계로 확장.
- 단, watcher/cron 활성화는 별도 승인 전까지 하지 않는다.

설계 범위:

- Mac/WSL relay producer
- validator
- incoming/active/archive/rejected
- stale/rejected UI
- rollback strategy
- disabled-by-default watchdog

금지/보류:

- VPS NAS mount
- direct NAS credentials
- direct raw source reads on VPS
- active watcher/cron enablement without approval
- dashboard-triggered raw relay execution

검증:

- dry-run producer output validates
- failed incoming does not replace active
- `/office` shows stale/rejected aggregate only

승인 필요도:

- watcher/cron/VPS transfer/manual promote는 각각 별도 승인.

## 8. 승인 게이트

명시 승인 없이 가능한 것:

- 문서 기획
- 현재 문서 읽기
- 로컬 plan 작성
- read-only 상태 요약

사용자 승인 필요:

- 코드 변경
- commit/push/PR update
- VPS dashboard worktree 변경
- dashboard service restart
- Kanban card 생성/수정/완료
- safe bundle transfer to VPS
- non-dry-run projection promote
- cron/watcher enablement
- gateway/core checkout 변경 또는 gateway restart

항상 별도 강한 승인 필요 또는 기본 제외:

- public exposure 변경
- VPS NAS mount
- direct NAS credentials on VPS
- VPS direct raw NAS/Paperclip reads
- executable dashboard mutation controls
- Phaser/Pixi/canvas/renderer dependency 추가
- DeskRPG code/assets/sprites copy

## 9. 첫 번째 실제 작업 추천

추천 1순위는 구현이 아니라 “통합 문서와 NEXT/STATUS 정리”다.

작업명:

> AI Office Unified Operating Workbench Phase 0 — umbrella decision + docs consolidation

작업 내용:

1. `docs/ai-office/product/unified-operating-workbench.md` 작성
2. `docs/ai-office/architecture/unified-operating-workbench.md` 작성
3. 기존 evidence 문서들을 하위 링크로 묶기
4. `NEXT.md`의 Current next stage를 umbrella 기준으로 짧게 정리
5. `STATUS.md` 상단에 umbrella summary 추가
6. 오래된 lower-page immediate next action이 상단 current stage와 충돌하면 “stale historical section”으로 표시
7. `git diff --check` 및 static text review

완료 기준:

- 새 세션에서 `NEXT.md`/`STATUS.md`만 읽어도 2-5번이 하나의 제품이라는 점이 명확하다.
- 다음 구현 후보가 “무작정 새 HUD 추가”가 아니라 “통합 운영실 IA/layout consolidation”으로 보인다.
- 기존 evidence/verification은 사라지지 않고 링크로 유지된다.

## 10. 최종 권장 방향

지금 다음 개발을 바로 시작하기보다, 먼저 이름과 문서 구조를 정리하는 것이 맞다.

권장 순서:

1. Phase 0 문서 통합
2. Phase 1 IA/copy 설계
3. Phase 2 unified view-model helper
4. Phase 3 `/office` layout consolidation
5. Phase 4 Kanban-backed operating loop
6. Phase 5 projection automation 설계/승인

이렇게 하면 AI Office는 다음처럼 하나로 설명된다.

> VPS의 `ai-office` Kanban이 일을 관리하고, Paperclip/sourceTags가 근거를 붙이며, Projection Cache가 안전한 last-known-good 상태를 유지하고, `/office` RPG 운영실이 그것을 사람이 읽기 쉽게 보여준다.
