# AI Office repeat-safe Mac relay readback — 2026-05-21

## Scope

User asked to continue from the recommended rung through the end, with bounded write authority approved. This slice intentionally chose the repeat-safe operator-flow rung after the actual one-shot Mac-local relay write, not daemonization.

## Completed code commit

- `056b8fa3 feat(office): surface repeat-safe mac relay readback`

## Implemented

- Added safe backend readback helper/API for the last successful bounded Mac-local relay write:
  - `get_office_controlled_mutation_nas_keeper_last_successful_mac_relay_write(...)`
  - GET `/api/office/controlled-mutation/nas-runtime/nas-keeper-last-successful-mac-relay-write`
- Added regression coverage:
  - `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_last_successful_write.py`
- Added Office API type/client wiring.
- Added canonical live-visible display-only panel:
  - `NasKeeperLastSuccessfulMacRelayWriteStatusPanel`
  - DOM hook: `data-office-nas-keeper-last-successful-mac-relay-write="true"`
- The panel shows only safe refs/checksum/readback status and explicitly requires fresh handoff, authorization, and execution refs for every future write.

## Verified local

- Python focused tests:
  - 11 passed
- Web focused tests:
  - 160 passed
- `npm run build`:
  - passed
  - existing Vite large chunk warning only
- `git diff --check`:
  - passed
- added-line leak sentinel scan:
  - no hits

## VPS deploy/smoke

- Both VPS worktrees synced to code commit `056b8fa3` and clean:
  - `/home/hermes/.hermes/ai-office-dashboard`
  - `/home/hermes/.hermes/hermes-agent`
- `web_dist` rsynced.
- Restarted only:
  - `hermes-agent-dashboard.service`
- Not restarted:
  - `hermes-gateway.service`
- Final service states:
  - dashboard active
  - gateway active
- Private `/office` HTTP:
  - 200

## Live readback smoke

Because VPS and Mac-local runtime have separate private queue stores, the VPS smoke seeded a safe-ref mirror record only for readback verification. It did not perform an actual NAS write and did not add direct VPS NAS authority.

Live API/DOM smoke result:

- API status: 200
- `found=true`
- `readback_verified=true`
- `safe_display_path=Hermes / controlled-mutation-one-shot-write-20260521103124.md`
- `repeat_execution_replay_allowed=false`
- `fresh_handoff_required_per_write=true`
- panel present: true
- panel found/readback attributes: true/true
- repeat replay enabled: false
- automation enabled: false
- VPS NAS authority: false
- panel controls: 0
- raw leak sentinels: none
- browser console JS errors: 0

## Preserved boundaries

- No daemonization.
- No watcher/cron activation.
- No dispatcher or authority-adapter binding.
- No public exposure change.
- No gateway restart.
- No direct VPS NAS mount/write/credential authority.
- No replay of the successful Mac-local write.
- No raw root path or credential value rendered or stored in docs.

## Next recommended rung

Do not proceed to daemonization yet. Recommended next rung is a fresh one-shot operator flow wrapper:

- create a small display/API flow that requires a new handoff ref, new authorization ref, and new execution ref per write;
- fail closed if any ref is reused;
- expose only safe refs/checksums/readback status;
- keep watcher/cron/dispatcher/authority-adapter binding off.
