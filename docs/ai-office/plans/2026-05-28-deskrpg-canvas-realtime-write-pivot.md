# DeskRPG Canvas / Realtime / Write-Capable Pivot Plan

> **For Hermes:** This is an architecture pivot plan only. Do not implement code from this plan until the relevant phase is explicitly approved. Use strict TDD for every implementation phase. Keep gateway, public exposure, direct VPS NAS authority, cron/watchers/dispatchers, and production NAS writes closed unless a later exact approval says otherwise.

**Goal:** Move `/office` from SVG/CSS read-only DeskRPG approximation toward a closer original DeskRPG-style experience: Canvas-based tiled rendering, sprite-sheet actors, private realtime presence, and carefully bounded operator write capability.

**Architecture:** Keep `/office` as the canonical route, but introduce a staged game-client layer beside the current safe dashboard projection. First add a Canvas renderer contract and fallback with no mutation. Then add sprite/tile assets through a license-cleared asset pipeline. Then add private realtime presence/state sync. Only after those are proven, add bounded operator write flows through protected APIs and approval-gated backend contracts.

**Tech Stack Direction:** React + TypeScript + Canvas 2D or a reviewed game renderer; Vitest/browser smoke for frontend; protected backend API for authoritative state; private-only websocket/SSE channel if approved; existing Mac relay/NAS Keeper boundaries for any NAS write.

---

## 0. Decision summary

The current SVG/CSS path can produce a living office diorama, but it will not feel like the original DeskRPG multiplayer game client.

If the desired target is original DeskRPG-like, the project should intentionally reopen three previous safety/product decisions:

1. **Renderer boundary:** allow Canvas or a game renderer instead of SVG/CSS only.
2. **Realtime boundary:** allow private realtime state sync instead of read-only snapshot projection only.
3. **Write boundary:** allow an operator to create bounded write intents from the browser, while still keeping high-risk execution behind backend validation and exact approval gates.

This plan does not mean copying DeskRPG code/assets. DeskRPG-derived code/assets require separate license review. The safer route is to implement a Hermes-native DeskRPG-like client with license-cleared tiles/sprites or generated internal assets.

---

## 1. Non-negotiable safety boundaries

Even in the original-DeskRPG pivot, keep these closed unless separately approved:

- No public exposure.
- No gateway service action.
- No direct VPS NAS credentials, mounts, or production NAS authority.
- No watcher/cron/dispatcher/authority-adapter activation.
- No raw secret/token/local-path/private payload echo in UI, logs, docs, tests, or browser responses.
- No unreviewed DeskRPG code or asset copying.
- No browser control that directly executes shell/runtime/NAS/Kanban mutations without backend validation and capability checks.

Allowed in this plan after phase-specific approval:

- New Canvas renderer code.
- New license-cleared sprite/tile asset pipeline.
- Private-only realtime connection for presence/state sync.
- Browser-authenticated write-intent UI that creates validated requests, not arbitrary execution.
- Later controlled write paths for approved domains such as Kanban item update or NAS Keeper Mac-relay request creation.

---

## 2. Target experience

The target should feel closer to:

- A tile-based top-down office map.
- Small pixel sprites with walking animations.
- Agents/NPCs moving inside rooms and corridors as actual game actors.
- A private multiplayer-style presence layer: active user/operator and AI agents appear on the same map.
- Click/select actor or object to inspect status.
- Type or choose an action from an in-game panel to create a bounded request.
- Backend remains authoritative: browser asks, backend validates, state projection updates.

It should not be:

- A decorative dashboard with labels over an SVG.
- A public multiplayer game server.
- A direct execution console.
- A raw payload editor.
- A NAS file manager running from the VPS.

---

## 3. Phase ladder

### Phase A — Canvas renderer decision and compatibility shell

**Objective:** Add a Canvas-based `/office` renderer shell while keeping the current SVG/CSS implementation as fallback.

**Files likely touched:**
- `web/src/pages/OfficePage.tsx`
- `web/src/pages/OfficePage.rpg.test.tsx`
- `web/src/index.css`
- Possibly new files under `web/src/pages/officeGame/`

**RED tests:**
- `/office` exposes a `data-office-deskrpg-renderer="canvas"` shell when the new feature flag is on.
- The primary RPG surface remains first in DOM/visual hierarchy.
- Existing summary/status/detail default-visible hooks remain 0.
- No executable mutation controls exist in Phase A.
- SVG fallback still exists and can be selected when Canvas is disabled.

**GREEN implementation:**
- Add a small Canvas component with deterministic draw loop.
- Render a tiled floor, rooms, doors, and placeholder actors using Canvas primitives only.
- No dependency and no asset import yet.
- Keep state derived from existing safe `OfficeState`/scene projection.

**Verification:**
- Focused Office RPG tests.
- Combined Office tests.
- Build/lint.
- Browser smoke proving Canvas exists and fallback still works.
- Static scan for raw leak/control expansion.

**Commit boundary:** one code commit plus docs update.

---

### Phase B — Tile map and sprite-sheet contract

**Objective:** Replace primitive Canvas shapes with a real tile/sprite contract, without importing questionable assets.

**Files likely touched:**
- New `web/src/pages/officeGame/tileMap.ts`
- New `web/src/pages/officeGame/sprites.ts`
- New tests for map/sprite contracts.
- Asset manifest path only after license-cleared assets exist.

**RED tests:**
- Tile map has room layers, collision/walkable cells, object layers, spawn points, and actor lanes.
- Sprite manifest rejects unknown or unlicensed sources.
- Renderer never receives raw backend payload fields.
- Actor state has grid coordinates, direction, animation frame, and safe display label.

**GREEN implementation:**
- Define internal tile-map JSON/TypeScript structures.
- Define sprite manifest schema.
- Render placeholder sprite-sheet frames from generated or internal placeholder data first.
- Add asset provenance metadata but no raw private paths.

**License rule:**
- Do not copy DeskRPG repo assets/code.
- If using LPC-style assets, record exact license/provenance in repo docs and asset manifest.
- Prefer internally generated placeholder sprites for the first implementation.

---

### Phase C — Private realtime presence/state sync

**Objective:** Make the map feel alive with server-authoritative state updates.

**Transport options:**
1. SSE for one-way live state updates if browser does not need to broadcast movement yet.
2. WebSocket only when bidirectional user presence/movement is approved.

**RED tests:**
- Backend exposes private/protected realtime endpoint only after auth/session validation.
- Unauthenticated access fails closed.
- Messages are typed and safe: actor position, animation state, status ref, not raw task/body/payload content.
- Client reconnects without duplicating actors.
- No public host exposure is added.

**GREEN implementation:**
- Start with private SSE if possible.
- Add a client state store for actor positions and map events.
- Animate interpolation in Canvas.
- Keep existing `/api/office/state` as fallback snapshot.

**Deployment rule:**
- Dashboard/core only.
- Gateway untouched.
- Private/Tailscale protected smoke only.

---

### Phase D — Operator presence and local movement

**Objective:** Let the user feel present in the office without granting mutation authority yet.

**RED tests:**
- Local operator avatar appears only for authenticated session.
- Movement is bounded by collision/walkable map.
- Local movement state is session-scoped and not persisted as operational truth.
- No Kanban/NAS/runtime mutation happens from movement.

**GREEN implementation:**
- Keyboard/click-to-move local avatar.
- Optional backend presence broadcast if Phase C websocket is approved.
- Movement events contain only coordinates and ephemeral actor/session refs.

**Safety note:**
- This is presence, not work execution.

---

### Phase E — Write-intent UI, not direct execution

**Objective:** Allow the user to create bounded write requests from the game UI.

**Allowed first write domains:**
1. Local draft action: create an in-browser draft only.
2. Protected request creation: persist a safe request envelope with domain/action/ref/checksum only.
3. Kanban update request: create a pending mutation request, not direct board mutation.
4. NAS Keeper request: create a pending Mac-relay packet/request, not direct NAS write.

**RED tests:**
- UI can open a command panel from a sprite/object selection.
- Submitting creates a safe write-intent object with domain, action, target safe ref, idempotency key, and checksum.
- UI never sends raw markdown/body/path/token/secret values.
- Backend rejects unsupported domains/actions.
- Execution flags remain false unless a later exact phase approves execution.

**GREEN implementation:**
- Add command composer UI inside the game shell.
- Add protected API endpoint for write-intent creation.
- Persist only safe refs/checksums/metadata.
- Render pending requests as in-map bubbles or task queue cards.

**Important:**
- This phase still does not execute NAS writes, shell commands, gateway actions, or direct Kanban mutations.

---

### Phase F — Bounded approved execution per domain

**Objective:** Allow selected write-intents to execute only through domain-specific adapters after exact approval.

**Possible domains:**
- Kanban: update issue/card status or assignment through a typed adapter.
- NAS Keeper: create one exact Mac-relay production write packet, then require separate approval for execution.
- Dashboard metadata: append metadata-only status records.

**RED tests:**
- Each domain has a typed allowlist.
- Each domain has exact validation, idempotency, audit metadata, and replay protection.
- Raw values are never returned on validation failure.
- Direct browser controls cannot bypass approval state.
- VPS NAS authority remains false.

**GREEN implementation:**
- One domain at a time.
- One action at a time.
- One approval boundary at a time.

---

## 4. Renderer choice gate

Before adding a dependency, compare these options:

### Option 1 — Native Canvas 2D first

Pros:
- No dependency.
- Small controlled surface.
- Easier to test and secure.
- Good enough for tile/sprite baseline.

Cons:
- More custom renderer code.
- Less tooling than Phaser.

Recommended first implementation: **yes**.

### Option 2 — Phaser

Pros:
- Closest to original DeskRPG architecture.
- Tile maps, sprites, animation, camera, input are built in.

Cons:
- New dependency and larger bundle.
- More complex lifecycle inside React.
- Requires stronger accessibility/fallback strategy.
- More review needed for security and bundle impact.

Recommended first implementation: **not first**; evaluate after native Canvas baseline proves the direction.

### Option 3 — PixiJS

Pros:
- Strong 2D rendering and sprite performance.

Cons:
- Still a new renderer dependency.
- Less game-state structure than Phaser.

Recommended first implementation: **not first**.

---

## 5. Data model shift

Current model:

```text
OfficeState -> safe projection -> SVG/CSS read-only map
```

Target model:

```text
OfficeState + GamePresence + SafeWriteIntents
  -> safe game scene model
  -> Canvas renderer
  -> optional private realtime sync
  -> bounded command composer
  -> protected backend validation
  -> approved domain execution only
```

Core game model fields should be safe by construction:

```ts
type GameActor = {
  id: string;
  kind: "operator" | "agent" | "npc";
  roomId: string;
  tileX: number;
  tileY: number;
  direction: "up" | "down" | "left" | "right";
  animation: "idle" | "walk" | "work";
  label: string;
  status: "idle" | "working" | "blocked" | "review";
  safeRef?: string;
};

type WriteIntent = {
  id: string;
  domain: "local-draft" | "kanban" | "nas-keeper" | "metadata";
  action: string;
  targetRef: string;
  idempotencyKey: string;
  checksum: string;
  approvalState: "draft" | "pending" | "approved" | "rejected" | "executed";
};
```

Do not include raw body/content/path/secret/token fields in the game model.

---

## 6. TDD / verification gates

Every phase must run:

```bash
cd web
npm test -- OfficePage.rpg.test.tsx --run
npm test -- OfficePage.rpg.test.tsx OfficePage.test.ts --run
npm run build
npm run lint
git diff --check
```

Additional gates for Canvas/realtime/write phases:

- Browser smoke must prove Canvas actually rendered, not only DOM hooks.
- Timed smoke must prove animation frame/state changes without refresh.
- Realtime smoke must prove unauthenticated access fails closed and authenticated private channel works.
- Write-intent smoke must prove duplicate idempotency behavior and no raw-value echo.
- Static scan must flag accidental secret/path/payload/control expansion.
- Deployment must rsync ignored `web_dist`, verify relative hash and mtime freshness, restart dashboard/core only, and keep gateway untouched.

---

## 7. Suggested next exact rung

**Next rung: Phase A — native Canvas renderer shell, read-only.**

Why start here:
- It directly addresses the user's correction: original DeskRPG feel needs Canvas/game-client rendering, not more CSS label polish.
- It reopens the renderer boundary in the smallest possible way.
- It does not yet open realtime or write execution risk.
- It keeps the current SVG implementation as fallback, reducing rollback risk.

Acceptance criteria:
- `/office` can render a Canvas DeskRPG shell behind a feature flag or safe internal mode.
- The Canvas shell draws a tiled office map and placeholder actors derived from safe scene data.
- Existing SVG map remains available as fallback.
- No mutation UI, no backend write, no websocket, no new dependency in this rung.
- Tests/build/lint/static scan pass.
- If deployed, protected browser smoke proves Canvas rendering and gateway untouched.

---

## 8. Exact approvals needed later

Before implementing each later capability, ask for a separate exact approval:

1. **Canvas renderer implementation approval** — Phase A code only.
2. **Asset pipeline approval** — adding sprite/tile assets and provenance manifest.
3. **Renderer dependency approval** — Phaser/PixiJS or other engine, if native Canvas is insufficient.
4. **Realtime endpoint approval** — SSE/WebSocket backend endpoint and private client connection.
5. **Operator movement approval** — browser input/presence broadcast.
6. **Write-intent approval** — browser command composer and protected request creation.
7. **Domain execution approval** — Kanban/NAS/metadata execution one domain/action at a time.
8. **Production NAS write approval** — fresh exact Mac-relay packet only, never direct VPS NAS authority.

---

## 9. Rollback posture

- Keep SVG/CSS renderer as fallback until Canvas has parity and live smoke history.
- Feature-flag Canvas mode at first.
- Do not delete old tests; add Canvas-specific tests beside them.
- If Canvas smoke fails, serve SVG fallback and keep `/office` usable.
- If realtime fails, fall back to `/api/office/state` snapshot polling.
- If write-intent validation fails, reject safely without echoing raw submitted values.

---

## 10. Product conclusion

Yes: Hermes can move much closer to original DeskRPG.

The correct pivot is not more SVG/CSS polish. It is:

1. Native Canvas renderer shell.
2. Tile/sprite game scene contract.
3. License-cleared pixel assets.
4. Private realtime presence.
5. Bounded command/write-intent UI.
6. Domain-specific approved execution.

The first implementation step should be Canvas read-only, not full multiplayer/write at once.
