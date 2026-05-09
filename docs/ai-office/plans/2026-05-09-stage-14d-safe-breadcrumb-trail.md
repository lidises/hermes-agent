# Stage 14-D safe breadcrumb trail

작성: 2026-05-09 16:31 KST

## 목표

`/office` DeskRPG 맵에 방 이동의 최근 안전 흐름을 breadcrumb 형태로 보여준다. 표시 데이터는 브라우저 로컬의 이미 안전한 `OfficeStateDelta.changedFlows`에서만 파생하며, 원문 레코드·프롬프트·대화·작업 본문·스크립트·로그·비밀값·토큰·개별 작업 식별자는 투영하지 않는다.

## 범위

- `OfficeSafeBreadcrumbSegment`, `OfficeSafeBreadcrumbTrail` 타입 추가.
- `buildOfficeSafeBreadcrumbTrail(delta)` helper 추가.
- 첫 changed flow를 출발/도착 방으로 삼고, 이후 changed flow의 방을 최대 5개까지 안전한 순서로 요약.
- 방 라벨과 detail은 `CHARACTER_ROOM_LABEL` 및 생성 문구만 사용.
- 변경 흐름이 없으면 `대기 · 안전 흐름 변화 없음` idle breadcrumb를 표시.
- `/office` React UI에 `data-office-safe-breadcrumb="true"` rail 및 segment hook 추가.
- CSS/SVG/DOM만 사용. renderer, canvas, sprite runtime, 신규 dependency는 추가하지 않음.

## 안전 규칙

- 읽기 전용: `/office`에 mutation control 없음.
- backend/API/schema 변경 없음.
- persistent storage 없음.
- raw flow label/detail, recent change label/detail, prompt/transcript/task body/script/secret/token 계열 문자열 미사용.
- decorative segment는 `aria-hidden` 및 `pointer-events: none`으로 비상호작용 처리.
- 한국어 우선 copy 유지.

## 테스트

RED:

- `buildOfficeSafeBreadcrumbTrail` import와 helper test를 먼저 추가.
- RED 실패 확인: `TypeError: buildOfficeSafeBreadcrumbTrail is not a function`.

GREEN:

- helper/type 구현 후 `npm test -- --run OfficePage.test.ts` 통과.

최종 검증:

- `npm test -- --run OfficePage.test.ts` -> 33 passed.
- ESLint for `OfficePage.tsx`, `officeView.ts`, `OfficePage.test.ts` -> passed.
- `npm run build` -> passed. Existing Vite large chunk warning remains. Output: JS 1,266.26 kB / gzip 369.99 kB; CSS 132.91 kB / gzip 21.41 kB.
- Backend focused office tests -> 18 passed in 1.05s.
- `git diff --check` -> passed.
- Browser smoke `/office?stage14d=safe-breadcrumb-trail`:
  - breadcrumb exists: true
  - breadcrumb segments: 1
  - Stage 14-C pulse timeline exists: true
  - pulse items: 1
  - Stage 14-A tracking cues: 11
  - Stage 14-B room activity meters: 4
  - raw leak regex: false
  - raw HTML sentinel leak: false
  - console JS errors: none

## 다음 후보

Stage 14-E 후보: breadcrumb와 pulse/room meter를 묶는 compact “safe route compass” 또는 방별 heartbeat legend. 여전히 CSS/SVG/DOM만 사용하고, 안전 DTO/delta에서 생성한 한국어 라벨만 표시한다.
