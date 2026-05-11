# AI Office Paperclip 기반 DeskRPG형 운영감 세부 실행계획

> For Hermes: implementation은 작은 slice 단위로 진행한다. 각 slice는 read-only DTO, redaction, UI smoke, git diff check를 통과하기 전에는 다음 단계로 넘기지 않는다.

## Goal

DeskRPG 영상에서 얻은 “AI 직원들이 사무실에서 움직이고, 업무가 보드와 회의실과 보고 큐로 보이며, 사용자는 Paperclip을 보고 다음 작업을 이어갈 수 있는” 감각을 Hermes AI Office에 안전하게 반영한다.

## 현재 기준선

- Office는 `/office` read-only dashboard다.
- 브라우저 DTO는 safe/redacted projection만 받는다.
- Paperclip workbench UI는 이미 `data_sources` 중 `paperclip:*` 또는 `source_type` allowlist를 전시할 수 있다.
- Paperclip safe manifest validator/generator tooling이 있다.
- 현재 단계에서는 mutation button, 자동 실행 trigger, raw transcript, raw prompt, raw path, NAS RW mount는 금지한다.

## 핵심 운영 모델

Paperclip은 “실행 버튼”이 아니라 “작업 지휘판/출처 선반”으로 쓴다.

1. 사람이 큰 방향을 말한다.
2. Hermes가 세부 계획을 작성한다.
3. 계획을 Paperclip safe manifest로 요약한다.
4. Office Paperclip workbench가 manifest를 전시한다.
5. 다음 작업자는 Paperclip manifest와 plan 문서를 기준으로 맡은 slice를 수행한다.
6. 진행 상태가 생기면 manifest 또는 safe source projection만 갱신한다.
7. 실제 자동 실행/보고 요청/회의 시작은 별도 승인 전까지 만들지 않는다.

## 역할 체계

- Product Owner: 사용자
  - 목표 승인, 범위 변경 승인, mutation/automation gate 승인
- Hermes Planner: 현재 대화의 주 플래너
  - 요구사항 해석, phase 분해, Paperclip manifest 작성
- Office DTO Engineer
  - read-only backend projection, source adapter, redaction boundary 담당
- Office Frontend Engineer
  - `/office` UI, map, board, meeting room, inspector, reduced-motion 담당
- Safety Reviewer
  - raw leak, forbidden field, secret/path/provider/model 노출 방지 검토
- QA Runner
  - pytest, Vitest, build, browser smoke, console/raw-leak 검증
- Paperclip Curator
  - safe manifest 갱신, source tags, assignment summary 유지
- Ops Relay
  - MacBook/WSL/VPS relay 경계 검토. 현재는 read-only manifest 전달만 허용

## Phase 0: Paperclip 지휘판 연결

목표: 이번 계획 자체가 Paperclip에 보이게 만든다.

### 0.1 계획 문서 저장
- 담당: Hermes Planner
- 산출: `.hermes/plans/2026-05-11_200822-ai-office-paperclip-desk-rpg-roadmap.md`
- 검증: 파일 read-back, 단계/역할/금지사항 포함 확인

### 0.2 Paperclip safe manifest 작성
- 담당: Paperclip Curator
- 산출: Hermes home의 `office/paperclip-manifests` 아래 safe manifest
- 내용: source id, relay, status, item count, tags, redaction note, assignment summary
- 금지: raw prompt, transcript, body, filesystem path, secret, credential, command args, raw log
- 검증: `python scripts/ai_office/validate_paperclip_manifest.py <manifest>` 통과

### 0.3 OfficeState가 manifest를 읽는 adapter 추가
- 담당: Office DTO Engineer
- 변경 후보:
  - `hermes_cli/office_adapters.py`
  - `hermes_cli/office_state.py`
  - `tests/hermes_cli/test_office_state_adapters.py`
- 설계:
  - `get_hermes_home()/office/paperclip-manifests/*.yaml`만 읽는다.
  - 디렉터리가 없으면 생성하지 않고 `missing`으로 보고한다.
  - validator 통과 manifest만 반영한다.
  - invalid manifest는 값을 노출하지 않고 count/warning만 반영한다.
  - 브라우저 DTO에는 safe id/source_type/relay/tags/count/status만 보낸다.
- 검증:
  - missing adapter test
  - safe manifest projection test
  - invalid manifest redaction test

### 0.4 Office Paperclip 전시 확인
- 담당: QA Runner
- 절차:
  - OfficeState payload에 `paperclip:desk-rpg-office-runtime-roadmap` source가 들어오는지 확인
  - frontend helper `buildOfficePaperclipWorkbench`가 source를 카드로 만드는지 확인
  - `/office` browser smoke에서 Paperclip workbench가 빈 상태가 아닌지 확인
- 성공 기준:
  - Paperclip workbench 카드 1개 이상
  - source tags 표시
  - raw leak 없음

## Phase 1: Live Operations Layer

목표: 사무실 맵에서 팀이 실제로 움직이고 일하는 느낌을 만든다.

### 1.1 상태 vocabulary 확정
- 담당: Hermes Planner + Safety Reviewer
- 상태:
  - 대기
  - 작업 중
  - 리뷰 중
  - 보고 대기
  - 차단됨
  - 자동화 실행 중
- DTO 값 후보:
  - idle, working, reviewing, report_ready, blocked, automation_running
- 검증: 상태 문자열이 raw source 값이 아니라 allowlist인지 확인

### 1.2 `buildOfficeLiveOperationsLayer(state)` helper 추가
- 담당: Office DTO Engineer 또는 Frontend Engineer
- 파일:
  - `web/src/pages/officeView.ts`
  - `web/src/pages/OfficePage.test.ts`
- 입력:
  - safe OfficeState
- 출력:
  - active count
  - report ready count
  - blocked count
  - automation count
  - agent activity cue list
- 검증:
  - empty state는 zero cue
  - blocked work item이 있으면 attention cue
  - raw prompt/path/transcript 문자열이 helper output에 없음

### 1.3 맵 상단 operations strip 추가
- 담당: Office Frontend Engineer
- 파일:
  - `web/src/pages/OfficePage.tsx`
- UI:
  - “작업 중 N”
  - “보고 대기 N”
  - “주의 N”
  - “자동화 N”
- 제약:
  - 버튼 없음
  - 실행/재시도/완료 mutation 없음
- 검증:
  - Vitest snapshot 또는 DOM text query
  - reduced-motion 영향 없음

### 1.4 character inspector 강화
- 담당: Office Frontend Engineer
- 표시:
  - 현재 역할
  - 현재 상태
  - 연결된 safe work item count
  - timing bucket
  - redaction note
- 검증:
  - inspector open 시 safe fields만 표시

## Phase 2: Read-only Task/Report Board

목표: DeskRPG의 task board 감각을 Hermes Office에 맞게 읽기 전용으로 반영한다.

### 2.1 board column model 작성
- 담당: Office DTO Engineer
- 컬럼:
  - 요청됨
  - 진행 중
  - 리뷰 중
  - 보고 대기
  - 완료/최근 완료
  - 주의 필요
- 매핑:
  - kanban/status/session/cron safe state만 사용
- 검증:
  - unknown status는 “요청됨” 또는 “주의 필요”로 안전 fallback

### 2.2 `buildOfficeTaskReportBoard(state)` helper 추가
- 담당: Office DTO Engineer
- 파일:
  - `web/src/pages/officeView.ts`
- 출력:
  - columns[]
  - cards[]
  - redaction note
- 카드 safe fields:
  - title policy label
  - status
  - assigned role
  - source tag
  - timing bucket
  - warning count
- 금지:
  - task body
  - raw completion output
  - provider/model
  - private id

### 2.3 board UI 섹션 추가
- 담당: Office Frontend Engineer
- 파일:
  - `web/src/pages/OfficePage.tsx`
- UI:
  - horizontal/compact columns
  - disabled CTA: “실행/보고 요청은 현재 CLI/Telegram에서 수행”
- 검증:
  - mutation button 없음
  - POST/PATCH/DELETE UI 없음

## Phase 3: Meeting Room Projection

목표: 회의실이 “실제 회의 실행”이 아니라 safe 회의 상태/요약 보관함으로 보이게 한다.

### 3.1 meeting DTO 초안
- 담당: Hermes Planner + Safety Reviewer
- safe fields:
  - meeting id bucket
  - topic label
  - participant roles/count
  - turn count bucket
  - status: planned/running/summarized/archived/error
  - summary availability
  - redaction note
- 금지:
  - raw transcript
  - agent prompt
  - tool payload
  - private source ids

### 3.2 meeting projection helper
- 담당: Office DTO Engineer
- 파일:
  - `web/src/pages/officeView.ts`
- 검증:
  - transcript sentinel leak test
  - empty state fallback

### 3.3 회의실 UI 추가
- 담당: Office Frontend Engineer
- UI:
  - 회의실 카드
  - participant avatar chips
  - 최근 회의 요약 availability list
  - “원문은 브라우저에 노출하지 않음” 표시
- 검증:
  - raw leak regex
  - browser smoke

## Phase 4: Report Queue / Re-entry Cue

목표: 사용자가 다시 들어왔을 때 에이전트가 보고하러 오는 듯한 느낌을 준다.

### 4.1 report queue model
- 담당: Office DTO Engineer
- 입력:
  - safe events
  - work item status
  - automation warning
  - Paperclip manifest health
- 출력:
  - report count
  - warning count
  - source health count
  - cue target room

### 4.2 visual cue
- 담당: Office Frontend Engineer
- UI:
  - 캐릭터 route cue: workbench -> user desk
  - reduced-motion: 텍스트 cue만
- 검증:
  - reduced-motion class/test
  - aria label 안전성

## Phase 5: Manager Agent Overview

목표: “중간 관리자급 에이전트”를 실제 실행자가 아니라 종합 관찰자로 먼저 표현한다.

### 5.1 manager scorecard helper
- 담당: Office DTO Engineer
- 표시:
  - blocked count
  - stale/review-needed count
  - report-ready count
  - source-health issue count
- 검증:
  - source health가 warning으로 반영됨

### 5.2 manager card UI
- 담당: Office Frontend Engineer
- UI:
  - 관리자 캐릭터/자리
  - “오늘의 병목” summary
  - “다음 승인 필요” read-only list
- 금지:
  - approve/reject/start buttons

## Phase 6: Paperclip 중심 작업 진행 루프

목표: 앞으로 작업이 진행될 때 작업자가 Paperclip을 기준으로 다음 slice를 찾게 한다.

### 6.1 manifest lifecycle 정의
- 담당: Paperclip Curator
- 상태:
  - planned
  - in-progress
  - review-needed
  - verified
  - archived
- 현재 safe manifest validator의 status 값과 충돌하지 않도록 optional field로 둔다.
- 검증: optional field가 forbidden key/value를 피하는지 validator 통과

### 6.2 progress update convention
- 담당: Hermes Planner + QA Runner
- 각 slice 완료 시 갱신:
  - item_count
  - warning_count
  - checked_at
  - tags
  - assignment summary
  - safe stage marker
- 금지:
  - commit hash를 반드시 숨길 필요는 없지만, private branch/source path는 manifest에 넣지 않는다.

### 6.3 “자동으로 보고 일어나는” 경계
- 담당: Safety Reviewer + Product Owner
- 현재 허용:
  - Office가 manifest를 자동으로 읽어 전시
  - Hermes가 다음 세션에서 plan/manifest를 보고 이어가기
- 현재 금지:
  - manifest가 직접 작업을 실행
  - cron이 manifest를 보고 임의 코딩 시작
  - 브라우저 버튼이 mutation 호출
- 승인 후 후보:
  - approved queue adapter
  - explicit dry-run command
  - review-required execution gate

## Phase 7: 안전 검증/브라우저 smoke

### 7.1 backend checks
- 담당: QA Runner
- 명령 후보:
  - `.venv/bin/python -m pytest tests/hermes_cli/test_office_state_adapters.py -q`
  - `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_redaction.py -q`
  - `python scripts/ai_office/validate_paperclip_manifest.py <manifest>`

### 7.2 frontend checks
- 담당: QA Runner
- 명령 후보:
  - `cd web && npm test -- --run OfficePage.test.ts`
  - `cd web && npm run build`
- browser smoke:
  - `/office` 열기
  - Paperclip workbench 존재 확인
  - map slot 존재 확인
  - console error 없음
  - prompt/transcript/path/token raw leak 없음

### 7.3 diff checks
- 담당: Safety Reviewer
- 명령 후보:
  - `git diff --check`
  - `git status --short`
- 확인:
  - 관련 없는 리팩터 없음
  - no secrets
  - no runtime NAS dependency
  - no mutation endpoints

## Phase 8: commit/handoff

목표: 다음 세션/다음 agent가 바로 이어갈 수 있게 한다.

### 8.1 handoff 문서 갱신
- 담당: Hermes Planner
- 포함:
  - 완료한 phase
  - 변경 파일
  - 검증 결과
  - 남은 금지사항
  - 다음 추천 slice

### 8.2 commit
- 담당: Hermes Planner 또는 Product Owner 승인 하의 구현 agent
- 메시지 후보:
  - `feat(office): surface safe Paperclip manifest roadmap`
  - `docs(office): add Paperclip DeskRPG runtime roadmap`

## 우선순위 요약

1. Paperclip manifest 전시 연결
2. Live operations/status layer
3. Read-only task/report board
4. Meeting room projection
5. Report queue/re-entry cue
6. Manager agent overview
7. 승인 후에만 explicit execution gate

## 이번 turn에서 즉시 수행할 최소 완료 조건

- 세부 계획 문서 저장
- Paperclip safe manifest 생성
- OfficeState가 Hermes home Paperclip manifests를 read-only로 읽도록 adapter 추가
- 관련 backend test 추가
- manifest validator 통과
- backend focused test 통과
- OfficeState payload에 Paperclip source가 들어오는지 확인
