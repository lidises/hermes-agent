# DeskRPG 영상 기반 AI Office 실제 구동감 반영 계획

## 배경

사용자가 공유한 영상: https://www.youtube.com/watch?v=hLh5K0IWk5E

영상의 핵심은 `에이전트를 만드는 것`보다 `여러 에이전트를 회사처럼 운영하고 관찰하는 인터페이스`가 중요하다는 점이다. DeskRPG는 2D 픽셀 오피스, 사용자/AI NPC, task 등록/보고, task board, 회의실, 회의록, 자동 보고/독촉을 통해 이 문제를 직관적으로 풀고 있다.

현재 Hermes AI Office는 이미 다음 기반을 갖고 있다.

- `/office` read-only dashboard
- safe DTO / redaction boundary
- room/node/character projection helpers
- character activity/status/motion helper
- Paperclip safe workbench projection
- manifest validator/generator tooling

따라서 당장 외부 DeskRPG를 붙이거나 픽셀 엔진을 가져오기보다, 기존 Office의 안전한 read-only projection 위에 `실제 구동감`을 점진적으로 강화하는 방향이 맞다.

## 핵심 해석

영상에서 가져올 것은 `게임 UI 전체`가 아니라 다음 UX 원리다.

1. 에이전트가 추상 로그가 아니라 `자리/역할/상태를 가진 직원`으로 보인다.
2. 작업 요청은 대화에서 자연스럽게 task로 전환된다.
3. 진행 중인 작업은 보드에 쌓이고, 사용자는 보고 요청/완료 상태를 확인한다.
4. 여러 에이전트는 회의실에서 각자 페르소나/KPI에 따라 토론한다.
5. 회의 결과는 회의록/요약으로 남는다.
6. 사용자가 없을 때도 에이전트가 일하고, 재접속 시 보고한다는 감각을 준다.

Hermes AI Office에 반영할 때는 실제 mutation/agent execution을 바로 넣지 않는다. 먼저 현재 안전 경계에 맞춰 `read-only operational theater`를 만든다.

## 제안 방향

### 1단계: Office Live Operations Layer

목표: 현재 Office 맵에 “실제로 돌아가는 팀” 느낌을 추가한다.

구현 아이디어:

- agent/card 위에 상태 배지 강화
  - 대기
  - 작업 중
  - 리뷰 중
  - 보고 대기
  - 차단됨
  - 자동화 실행 중
- 맵 안에서 character route/motion cue를 더 의미 있게 표시
  - 작업대 → 회의실
  - 자동화실 → 보고 구역
  - Paperclip shelf → workbench
- 캐릭터 클릭 시 safe inspector에 다음 표시
  - 현재 역할
  - 현재 상태
  - 연결된 work item count
  - 마지막 safe event timing bucket
  - redaction note

변경 가능 파일:

- `web/src/pages/officeView.ts`
- `web/src/pages/OfficePage.tsx`
- `web/src/pages/OfficePage.test.ts`

검증:

- `cd web && npm test -- --run OfficePage.test.ts`
- raw-leak regex check
- browser smoke for `/office`

### 2단계: Task Board를 “업무 지시/보고판”처럼 보이게 재구성

목표: DeskRPG의 task board 감각을 Hermes Office에 맞게 read-only로 반영한다.

구현 아이디어:

- 기존 `work_items`를 safe task board projection으로 변환
- 컬럼은 mutation 없는 읽기 전용:
  - 요청됨
  - 진행 중
  - 보고 대기
  - 완료/최근 완료
  - 주의 필요
- 카드에는 safe field만 표시:
  - 제목/label이 이미 안전한 경우만
  - 상태
  - 담당 agent/room
  - timing bucket
  - source tag
  - redaction note
- “등록/보고 요청/완료” 버튼은 만들지 않는다.
- 대신 비활성 설명 CTA만 둔다:
  - “실행/보고 요청은 현재 Hermes CLI/Telegram에서 수행됩니다.”

변경 가능 파일:

- `web/src/pages/officeView.ts`
- `web/src/pages/OfficePage.tsx`
- `web/src/pages/OfficePage.test.ts`

### 3단계: Meeting Room Projection

목표: 영상의 회의실 기능을 Hermes식 read-only 회의/토론 projection으로 만든다.

초기 버전은 실제 회의 실행 기능이 아니라 `회의 상태/회의록 보관함/토론 결과`를 안전하게 보여주는 projection이어야 한다.

구현 아이디어:

- Office room 중 `routing` 또는 별도 safe meeting area에 meeting projection 추가
- safe DTO 후보:
  - meeting id
  - topic label
  - participant roles/count
  - turn count
  - status: planned/running/summarized/archived/error
  - summary availability
  - redaction note
- UI:
  - 회의실 카드
  - 참가자 avatar chips
  - 최근 회의록 요약 리스트
  - “원문/전체 transcript는 브라우저에 노출하지 않음” 명시

주의:

- 회의 transcript 원문은 금지.
- prompt, tool args, raw agent messages 금지.
- 회의 실행 버튼 금지.

### 4단계: “보고하러 오는” 감각

목표: 사용자가 재접속했을 때 에이전트가 결과를 들고 오는 듯한 느낌을 만든다.

구현 아이디어:

- safe events 기반으로 `report queue projection` 추가
- 예:
  - `3건의 보고 대기`
  - `Paperclip manifest partial`
  - `자동화 1건 경고`
- 캐릭터가 사용자 desk 쪽으로 향하는 route cue를 read-only animation으로 표현
- reduced-motion에서는 텍스트 cue로 대체

변경 가능 파일:

- `officeView.ts`: projection helper
- `OfficePage.tsx`: report cue panel
- `OfficePage.test.ts`: raw field leak 방지 테스트

### 5단계: 중간관리자 Agent 컨셉

목표: 영상 결론부의 “중간 관리자급 스마트 에이전트” 개념을 Hermes Office의 정보 구조에 반영한다.

구현 아이디어:

- agent role에 `manager` 또는 기존 `operator/reviewer/router`를 활용
- Manager card는 직접 실행자가 아니라 다음을 종합 표시:
  - blocked count
  - overdue/stale count
  - review-needed count
  - source health issue count
- 실제 command는 만들지 않고 `관리자 시야`만 먼저 제공

## 하지 말아야 할 것

- DeskRPG 소스나 UI를 그대로 클론하지 않는다.
- Phaser/Pixi/Canvas 같은 새 렌더러를 바로 도입하지 않는다.
- NAS/Paperclip 원문이나 transcript를 browser DTO에 넣지 않는다.
- VPS에 NAS RW mount나 credential을 추가하지 않는다.
- task 생성/보고 요청/회의 시작 같은 mutation button을 만들지 않는다.
- 실시간 socket/broadcast를 지금 단계에서 도입하지 않는다.

## 왜 이 방향이 맞는가

현재 사용자의 Office 작업은 이미 “safe read-only dashboard”로 정교하게 진행 중이다. DeskRPG의 장점은 감성적이고 직관적인 운영감이지만, 그 핵심은 반드시 게임 엔진이 아니어도 구현 가능하다.

Hermes Office는 다음 식으로 가는 것이 더 안전하고 빠르다.

```text
실제 시스템 상태 / safe events / manifest
→ sanitized projection helpers
→ RPG-like office theater UI
→ 나중에 승인된 mutation/agent-control로 확장
```

즉, 먼저 `보이는 방식`을 바꿔서 사용자가 에이전트 팀을 운영하는 감각을 얻고, 실행 제어는 이후 별도 gate에서 추가한다.

## 첫 구현 slice 제안

다음 작업으로 가장 좋은 slice:

`feat(office): add read-only live operations layer`

범위:

- `buildOfficeLiveOperationsLayer(state)` helper 추가
- agent/work/event/source 상태를 안전하게 aggregate
- Office 맵 위에 “보고 대기 / 작업 중 / 주의 필요” cue 표시
- 캐릭터 inspector에 현재 safe activity 강화
- 테스트에서 prompt/transcript/path/token raw leak 방지

예상 파일:

- `web/src/pages/officeView.ts`
- `web/src/pages/OfficePage.tsx`
- `web/src/pages/OfficePage.test.ts`
- `docs/ai-office/plans/2026-05-11-paperclip-workbench-progress-handoff.md` 또는 별도 handoff

검증:

```bash
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
npm run build
cd /Users/lidises/dev/hermes-agent
git diff --check
```

## 판단

DeskRPG에서 지금 Hermes Office에 가장 먼저 가져올 것은 `픽셀 아트 맵`이 아니라 `에이전트 운영의 가시성`이다.

구현 우선순위는 다음과 같다.

1. Live operations/status layer
2. Read-only task/report board
3. Meeting room projection
4. Report queue / re-entry cue
5. Manager agent overview
6. 승인 후에만 actual command/mutation 연결
