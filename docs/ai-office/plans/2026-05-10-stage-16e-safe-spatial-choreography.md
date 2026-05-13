# Stage 16-E — Safe Spatial Choreography

Date: 2026-05-10 00:53 KST
Branch: `ai-office-stage16e-safe-spatial-choreography-20260510`
Base: `819918b9` (`feat(office): add safe motion heartbeat`)

## Why

Stage 16-D made the safe event stream visibly pulse, but the desired DeskRPG-like office still benefits from more spatial movement. Stage 16-E adds room-local safe choreography over the existing CSS/SVG map using only safe event categories, known room coordinates, tone, and counts.

## Goal

Make safe event activity visibly move across the map without exposing raw content:

- room pulse rings for safe event rooms;
- route sweep lines for safe flow events;
- beacon dots anchored to known rooms;
- intensity derived from safe count/tone only;
- reduced-motion fallback.

## Scope

1. Helper TDD
   - Add `buildOfficeSafeSpatialChoreography(events, heartbeat)`.
   - Inputs: Stage 16-C/16-D safe events and heartbeat posture.
   - Outputs: generated overlay items with room coordinates, class names, tone, intensity, aria/decorative flags.

2. UI/CSS
   - Render choreography overlay inside the office map canvas.
   - Use CSS/SVG only; no renderer dependency or assets.
   - Add stable smoke hooks.

3. Safety
   - No raw labels/details from backend payloads.
   - No task identity, provider/model, prompt, transcript, script, log, token, secret, API key, password.
   - No mutation controls, persistent browser storage, SSE/WebSocket, or service/config changes.

## Verification target

Frontend:

```bash
cd web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts src/lib/api.ts
npm run build
```

Backend:

```bash
source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short
git diff --check
```

Browser smoke:

- `/office?stage16e=safe-spatial-choreography`
- safe motion heartbeat present;
- safe spatial choreography present;
- room/route choreography hooks present;
- motion lane still present;
- raw leak false;
- console JS errors none.
