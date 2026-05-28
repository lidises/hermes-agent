# AI Office Stage 12-14 /goal Prompt

> Use this as the first message in a fresh Hermes CLI session. Paste the whole block after `/goal `.

## Recommended invocation

```text
/goal AI Office Stage 12-14를 RPG Visualizer-first 방향으로 끝까지 조금씩 진행한다. 먼저 /Users/lidises/dev/hermes-agent 로 이동해 git 상태와 최신 커밋을 확인하고, docs/ai-office/STAGE-MAP.md, docs/ai-office/NEXT.md, docs/ai-office/STATUS.md를 읽어 현재 경계를 확인한다. 현재 기준 커밋은 c695772ba feat(office): keep rpg visualizer as default surface 이며, Stage 12의 기본 목표는 /office가 summary/status/detail이 아니라 실제 RPG Visualizer를 먼저 보여주는 것이다.

허용된 작업 범위: local repo edits, TDD tests, build, docs update, commit/push, VPS dashboard/core worktree sync, ignored web_dist rsync, dashboard/core service restart, protected API/DOM smoke, metadata-only safe-ref JSONL record write/readback, payload/write_payload preview contract, replay/idempotency metadata, Mac relay isolated tmp-root write smoke. 각 rung은 작게 진행하고, 매 turn마다 write-readiness 또는 RPG Visualizer 운영 품질을 실제로 올려라. review/readback만 반복하지 말고 RED test -> minimal implementation -> verification -> commit/push -> deploy/smoke/handoff 순서로 닫아라.

금지된 작업 범위: 추가 real NAS production write, replacement write, actual NAS cleanup delete/move/archive/write, direct VPS NAS authority or credentials, watcher/cron/dispatcher/authority-adapter activation, public exposure, gateway restart, raw markdown/path/root/secret/token/write_payload echo, executable browser mutation controls, Kanban mutation controls, new renderer/dependency without separate approval.

우선순위:
1. Stage 12 완료: /office 기본 DOM/시각 smoke에서 RPG map이 primary이고 summary/status/detail layers가 기본 visible 0인지 로컬과 VPS에서 증명한다. 필요하면 현재 커밋을 VPS dashboard/core에 sync하고 web_dist를 rsync한 뒤 dashboard/core만 restart한다. gateway는 건드리지 않는다.
2. Stage 13로 진입: external summary를 다시 늘리지 말고 RPG map 내부의 room/entity hierarchy, Korean labels, compact in-map cues, character/facility copy, mobile/small-screen layout 중 하나를 TDD로 개선한다. read-only/inspect-only 유지.
3. Stage 14 준비: 운영 안정화는 metadata-only/safe-ref 형태로만 진행한다. 필요하면 dashboard health/retention/replay-hardening record를 작성하되 raw values와 execution authority를 만들지 않는다. production NAS/write/cleanup/dispatcher/public/gateway 경계는 계속 닫는다.

필수 방식:
- 관련 skill을 먼저 로드한다: vps-operations, test-driven-development, karpathy-coding-discipline. Hermes /goal 자체나 설정을 만지면 hermes-agent도 로드한다.
- 작업 전 live state를 확인한다: local git status/log, NEXT/STATUS/STAGE-MAP, 가능하면 VPS dashboard/core HEAD와 service state.
- 한 번에 하나의 bounded rung만 수행한다.
- 코드 변경은 테스트를 먼저 추가하거나 갱신해서 실패/기대 조건을 확인한 뒤 구현한다.
- verification은 최소 focused tests, build 또는 해당 범위 smoke, git diff --check, static raw-leak/control scan을 포함한다.
- 배포할 경우 dashboard/core sync, web_dist rsync, dashboard/core restart만 수행하고, private/Tailscale protected API/DOM smoke로 확인한다.
- 완료 시 clean commit, push, STATUS/NEXT 또는 STAGE-MAP handoff 업데이트, 다음 세션용 prompt를 남긴다.
- 1분 이상 걸리는 작업은 진행 상황을 요약한다.

성공 기준:
- 매 continuation이 최소 하나의 안전한 write-readiness/RPG-readiness artifact를 남긴다: code/docs commit, protected metadata-only record, tmp-root smoke proof, or deployed dashboard DOM/API proof.
- raw leak/control expansion 없음.
- gateway/NAS production/public/automation authority 없음.
- 마지막 응답은 수행한 rung, 검증, 커밋/배포 상태, 다음 exact safe rung을 간결히 보고한다.
```

## Shorter fallback prompt

```text
/goal AI Office Stage 12-14를 계속 진행한다. 기준 repo는 /Users/lidises/dev/hermes-agent, 기준 커밋은 c695772ba. STAGE-MAP/NEXT/STATUS를 읽고, RPG Visualizer-first /office를 유지하면서 한 번에 하나의 TDD rung만 수행한다. 허용: local edits/tests/build/docs/commit/push, VPS dashboard/core sync, web_dist rsync, dashboard/core restart, protected API/DOM smoke, metadata-only safe-ref record write/readback, payload/write_payload preview contract, replay/idempotency metadata, Mac relay isolated tmp-root write smoke. 금지: 추가 real NAS production/replacement write, actual cleanup, direct VPS NAS authority, watcher/cron/dispatcher/authority-adapter, public exposure, gateway restart, raw markdown/path/secret/token/write_payload echo, executable mutation controls. 매 rung은 review/readback 반복이 아니라 write-readiness 또는 RPG-readiness를 실제로 올리고, 검증 후 clean commit/push/handoff까지 닫아라.
```

## Notes for the next agent

- `/goal` is a standing-goal loop, not a permission bypass. The prompt above grants only the listed task-scoped permissions.
- If a step would cross a forbidden boundary, stop and ask for a fresh exact approval.
- Prefer small Stage 13 visual/read-only improvements over adding another top-level dashboard summary.
- Treat VPS dashboard/core restart as allowed only for dashboard/core deploys. Gateway restart remains forbidden.
