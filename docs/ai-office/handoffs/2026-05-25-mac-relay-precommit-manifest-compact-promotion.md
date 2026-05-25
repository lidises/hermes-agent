# AI Office handoff — Mac relay precommit manifest compact promotion

Timestamp: 2026-05-25T14:55Z

## Scope

Advanced NAS Keeper controlled-mutation one rung closer to write readiness without crossing forbidden boundaries.

Implemented/deployed rung:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_precommit_manifest_after_replay_idempotency`

Code commit:
`6a87edf0e Surface NAS Keeper precommit manifest summary`

## What changed

- Compact `/office` controlled-mutation dashboard now prefers the latest Mac relay precommit manifest over precommit metadata, replay/idempotency metadata, and tmp-root write smoke.
- Added precommit-manifest compact DOM hooks for:
  - ready
  - source verified
  - replay-store write closed
  - real NAS write closed
  - VPS NAS authority closed
  - runtime/open automation closed
  - payload echo closed
- Added frontend regression coverage ensuring the manifest summary is display-only and does not render historical ladders, controls, raw paths, markdown bodies, write payloads, or secrets.
- Performed a protected metadata-only live VPS API write for the precommit manifest record.

## Verification

Local:
- Backend focused pytest: `12 passed, 81 deselected`.
- Frontend focused tests: `10 passed, 168 skipped`.
- Python compile: passed.
- `git diff --check`: passed.
- Production-source leak scan: passed.
- Web build: passed with known Vite chunk-size warning only.
- Lint for OfficePage path: exit 0, existing warnings only.

VPS:
- Core and dashboard worktrees reset to code commit.
- Built `web_dist` rsynced to both VPS worktrees.
- `hermes-agent-dashboard.service`: active after restart.
- `hermes-vps-core-dashboard.service`: active after restart.
- Dashboard and core root pages returned HTTP 200.
- Gateway service was not restarted.

Protected API smoke:
- unauthenticated precommit manifest GET returned `401`.
- protected precommit manifest POST returned HTTP 200 and stored=true.
- protected precommit manifest GET returned HTTP 200 and record_count=2.
- ready=true, source verified=true, write_readiness_percent=94.
- next boundary: `fresh_request_builder_downstream_consumption_one_shot_mac_relay_final_preflight_after_precommit_manifest`.
- replay-store write=false, real-write=false, VPS-authority=false, runtime-open=false, payload-echo=false.

DOM smoke:
- `/office` hydrated compact hook found=true.
- latest boundary: Mac relay precommit manifest.
- write-readiness displayed as 94%.
- scoped controls/forms/inputs=0.
- heavy archive DOM rendered=false.
- browser console JS errors=0.

## Preserved boundaries

Still not done / still forbidden:
- real NAS production write
- VPS direct NAS authority or VPS NAS mount credentials
- watcher/cron/dispatcher/authority-adapter activation
- public exposure
- gateway restart
- raw markdown/path/secret echo
- real replay-store execution write

## Next safe rung

`fresh_request_builder_downstream_consumption_one_shot_mac_relay_final_preflight_after_precommit_manifest`

Recommended next step: TDD a metadata-only Mac relay final-preflight record and compact/API/DOM surface sourced from the live precommit manifest. Keep all production write and runtime authority boundaries closed.
