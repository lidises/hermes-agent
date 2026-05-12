# VPS AI Office Dashboard Release 1 Plan

> **For Hermes:** Planning-only handoff. Do not execute deployment steps until the user explicitly approves execution.

**Goal:** Deploy PR #4 head (`ai-office-stage16e-safe-spatial-choreography-20260510`) to the restricted VPS `hermes` user as an always-available, Tailscale-only AI Office dashboard service, using a separate dashboard worktree and without touching Telegram gateway/core runtime.

**Architecture:** Keep the VPS core Hermes checkout and Telegram gateway separate from the AI Office dashboard checkout. The dashboard release uses a VPS-local worktree under the restricted `hermes` user, builds the PR #4 head there, serves only on the VPS Tailscale IP, and verifies browser-rendered `/office` plus public-exposure negative checks before considering the service live.

**Tech Stack:** Hermes Agent dashboard, Git/GitHub PR #4, Node/npm frontend build, Python Hermes web server, systemd --user service, Tailscale private networking, restricted Linux `hermes` user on Hetzner VPS.

---

## Current context

- Local repo: `/Users/lidises/dev/hermes-agent`
- PR: `https://github.com/lidises/hermes-agent/pull/4`
- PR state from 2026-05-12 15:46 KST check: OPEN, Draft, mergeable, clean, no reported checks.
- PR URL: `https://github.com/lidises/hermes-agent/pull/4`
- PR head branch: `ai-office-stage16e-safe-spatial-choreography-20260510`
- PR base: `main`
- Current pushed HEAD before Office Release Hardening 1 commit: `05c99433 fix(office): use private access dashboard copy`
- Current local release hardening diff is verified but not yet pushed at plan-update time; once committed, use the new commit SHA as the release candidate.
- Key Paperclip Workbench 2 commit: `1321c136 feat: add Paperclip manifest visibility`
- Office Release Hardening 1 scope: `/office` hides mutation-capable sidebar system actions and documents browser-local timezone display policy.
- Target VPS topology from reference:
  - restricted user: `hermes`
  - core/gateway checkout: `/home/hermes/.hermes/hermes-agent`
  - dashboard worktree target: `/home/hermes/.hermes/ai-office-dashboard`
  - private dashboard URL pattern: `http://100.122.57.85:8765/office`
  - existing core status dashboard remains separate on `http://100.122.57.85:8766/`

## Non-goals and hard boundaries

This release plan does **not** approve or perform:

- VPS deployment execution before explicit user approval.
- PR merge.
- Telegram gateway restart/replacement.
- Core Hermes checkout mutation except read-only inspection.
- NAS mount, NAS credentials, broad NAS writes, or raw NAS/Paperclip material transfer.
- Watcher start/stop/config changes.
- Public internet exposure.
- Mutation controls.
- Renderer/dependency/project dependency additions.
- Paperclip Workbench 3 implementation.
- Office Source Health 3 implementation.
- Copying secrets into notes, logs, PR bodies, prompts, or plans.

## Release decision gates

### Gate A — execution approval

Before any SSH, VPS file mutation, systemd operation, build, or deployment command, get explicit user approval for:

```text
Execute VPS AI Office Dashboard Release 1 using PR #4 head, restricted hermes user, separate dashboard worktree, Tailscale-only bind, and dashboard service only. Do not touch Telegram gateway or mount NAS.
```

### Gate B — service restart approval scope

The release may restart/start only the dashboard service:

- allowed service: `hermes-agent-dashboard.service`
- not allowed unless separately approved: `hermes-gateway.service`, cron scheduler, system services, VPS reboot

### Gate C — post-smoke promotion

After VPS smoke passes, ask before:

- marking PR #4 ready for review,
- merging PR #4,
- stopping any MacBook dashboard listener,
- starting Paperclip Workbench 3,
- starting Office Source Health 3.

---

## Phase 0: Preflight from MacBook, read-only

**Objective:** Confirm the exact release candidate and access assumptions without changing VPS or local repo state.

**Commands to run after approval:**

```bash
cd /Users/lidises/dev/hermes-agent
git status --short --branch
git rev-parse HEAD
git log --oneline --decorate -5
gh -R lidises/hermes-agent pr view 4 \
  --json number,title,state,isDraft,url,baseRefName,headRefName,mergeStateStatus,mergeable,statusCheckRollup
```

**Expected:**

- Branch is `ai-office-stage16e-safe-spatial-choreography-20260510`.
- Local HEAD is the committed Office Release Hardening 1 release candidate or an explicitly accepted newer PR #4 head.
- Working tree is clean before VPS deployment mutation.
- PR #4 is open/draft and head branch matches.
- No required checks are failing.

**Stop conditions:**

- Local branch dirty.
- PR head has changed unexpectedly.
- PR is closed/merged.
- Base branch or head branch differs from expected.

---

## Phase 1: VPS access and restricted-user boundary check, read-only

**Objective:** Verify access to the VPS restricted `hermes` user and confirm the intended operating boundary before mutation.

**Commands to run after approval using the known approved SSH path:**

```bash
# Example shape only; use the approved existing VPS SSH/relay path.
ssh <approved-vps-hermes-target> 'printf "user=%s host=%s home=%s\n" "$(id -un)" "$(hostname)" "$HOME"; pwd; umask'
ssh <approved-vps-hermes-target> 'test "$(id -un)" = hermes && echo restricted_user_ok'
ssh <approved-vps-hermes-target> 'test -d /home/hermes/.hermes && echo hermes_home_exists'
ssh <approved-vps-hermes-target> 'test -d /home/hermes/.hermes/hermes-agent && echo core_checkout_exists || true'
ssh <approved-vps-hermes-target> 'command -v git; command -v python3 || true; command -v node || true; command -v npm || true; command -v systemctl || true'
```

If non-interactive shells do not show Node/npm, retry with Hermes-managed path:

```bash
ssh <approved-vps-hermes-target> 'export PATH=$HOME/.hermes/node/bin:$HOME/.local/bin:$PATH; command -v node; command -v npm; node --version; npm --version'
```

**Expected:**

- User is `hermes`.
- Home is `/home/hermes`.
- Core checkout exists at `/home/hermes/.hermes/hermes-agent`.
- Git and systemd user environment are available.
- Node/npm are available either by default or with `$HOME/.hermes/node/bin` on PATH.

**Safety boundary checks:**

```bash
ssh <approved-vps-hermes-target> 'sudo -n true 2>/dev/null && echo UNEXPECTED_SUDO || echo no_sudo_ok'
ssh <approved-vps-hermes-target> 'docker ps 2>/dev/null && echo UNEXPECTED_DOCKER || echo no_docker_ok'
```

**Stop conditions:**

- User is not `hermes`.
- Access requires printing/copying secrets.
- Restricted boundary is unexpectedly expanded.
- SSH authorization is unstable or uses an unapproved route.

---

## Phase 2: Inspect current VPS dashboard/core state, read-only

**Objective:** Understand what is currently serving before changing anything.

**Commands:**

```bash
ssh <approved-vps-hermes-target> 'systemctl --user status hermes-agent-dashboard.service --no-pager || true'
ssh <approved-vps-hermes-target> 'systemctl --user is-active hermes-agent-dashboard.service || true'
ssh <approved-vps-hermes-target> 'systemctl --user is-enabled hermes-agent-dashboard.service || true'
ssh <approved-vps-hermes-target> 'systemctl --user is-active hermes-gateway.service || true'
ssh <approved-vps-hermes-target> 'ss -ltnp 2>/dev/null | grep -E ":8765|:8766" || true'
ssh <approved-vps-hermes-target> 'readlink -f /proc/$(pgrep -f "dashboard|web_server|8765" | head -1)/cwd 2>/dev/null || true'
```

**Expected:**

- Any existing dashboard listener is identified.
- Existing gateway state is recorded but not changed.
- Serving checkout/worktree path is known.

**Stop conditions:**

- Port 8765 is used by an unexpected service.
- Current dashboard service points to the core checkout and changing it would risk gateway/core coupling without a separate plan.
- `hermes-gateway.service` is inactive unexpectedly and the user wants gateway preservation handled first.

---

## Phase 3: Prepare or update separate dashboard worktree

**Objective:** Ensure `/home/hermes/.hermes/ai-office-dashboard` exists and points at PR #4 head, without modifying the core checkout.

**Preferred pattern:** separate clone or worktree under `/home/hermes/.hermes/ai-office-dashboard`.

**Commands:**

```bash
ssh <approved-vps-hermes-target> 'set -e
export PATH=$HOME/.hermes/node/bin:$HOME/.local/bin:$PATH
cd /home/hermes/.hermes
if [ ! -d ai-office-dashboard/.git ]; then
  git clone https://github.com/lidises/hermes-agent.git ai-office-dashboard
fi
cd ai-office-dashboard
git fetch origin ai-office-stage16e-safe-spatial-choreography-20260510
git checkout ai-office-stage16e-safe-spatial-choreography-20260510
git reset --hard origin/ai-office-stage16e-safe-spatial-choreography-20260510
git status --short --branch
git rev-parse HEAD
git log --oneline --decorate -5
'
```

**Expected:**

- Worktree path is `/home/hermes/.hermes/ai-office-dashboard`.
- Branch is `ai-office-stage16e-safe-spatial-choreography-20260510`.
- HEAD is the committed Office Release Hardening 1 release candidate or the approved current PR #4 head.
- Working tree is clean.
- Core checkout `/home/hermes/.hermes/hermes-agent` is untouched.

**Stop conditions:**

- Checkout would overwrite uncommitted work.
- Fetch cannot authenticate.
- HEAD does not match PR #4 head.
- Worktree points at core checkout or another live runtime path.

---

## Phase 4: Install/build only existing declared dependencies

**Objective:** Build the dashboard from the separate worktree using existing project dependency declarations, without adding new dependencies.

**Commands:**

```bash
ssh <approved-vps-hermes-target> 'set -e
export PATH=$HOME/.hermes/node/bin:$HOME/.local/bin:$PATH
cd /home/hermes/.hermes/ai-office-dashboard/web
npm ci
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts src/App.tsx src/App.test.ts src/lib/api.ts
npm run build
'
```

If `npm ci` fails because the VPS cache/package-manager state is stale, stop and report. Do **not** switch to `npm install` unless separately approved, because that can change lockfile behavior.

Optional Python verification if venv already exists or can be created without dependency changes:

```bash
ssh <approved-vps-hermes-target> 'set -e
cd /home/hermes/.hermes/ai-office-dashboard
if [ -x .venv/bin/python ]; then
  .venv/bin/python -m pytest tests/test_paperclip_manifest_generator.py tests/test_paperclip_manifest_validator.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q -o addopts=
else
  echo "python_venv_missing_skip_python_tests"
fi
'
```

**Expected:**

- Frontend Office tests pass.
- ESLint passes or only known accepted warnings appear if using a lint command that reports warnings.
- `npm run build` passes with at most the known Vite large chunk warning.
- No dependency files are modified.

**Stop conditions:**

- `package-lock.json` changes.
- New dependency required.
- Build/test failure.
- Raw secret/path/token appears in build/test output.

---

## Phase 5: Configure dashboard service as Tailscale-only

**Objective:** Ensure systemd --user service runs from the dashboard worktree and binds only to the VPS Tailscale IP.

**Service target:**

- service: `hermes-agent-dashboard.service`
- working directory: `/home/hermes/.hermes/ai-office-dashboard`
- bind host: VPS Tailscale IP, expected current value `100.122.57.85`
- port: `8765`

**Pre-check Tailscale IP:**

```bash
ssh <approved-vps-hermes-target> 'tailscale ip -4 2>/dev/null || hostname -I'
```

**Service inspection before mutation:**

```bash
ssh <approved-vps-hermes-target> 'systemctl --user cat hermes-agent-dashboard.service || true'
```

**Mutation step, only after Gate B approval:**

Create or update the user service to run the dashboard command from the dashboard worktree and bind to the Tailscale IP. Exact command should be derived from the current Hermes CLI on VPS, but expected shape is:

```ini
[Unit]
Description=Hermes AI Office Dashboard
After=network-online.target

[Service]
Type=simple
WorkingDirectory=/home/hermes/.hermes/ai-office-dashboard
Environment=PATH=/home/hermes/.hermes/node/bin:/home/hermes/.local/bin:/usr/local/bin:/usr/bin:/bin
ExecStart=/home/hermes/.hermes/ai-office-dashboard/venv/bin/python -m hermes_cli.main dashboard --host 100.122.57.85 --port 8765 --no-open
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

If the Python path differs (`.venv/bin/python` vs `venv/bin/python`), inspect the worktree and use the existing valid venv path. Do not create or alter global Python/runtime outside the dashboard worktree without approval.

**Commands after service file update:**

```bash
ssh <approved-vps-hermes-target> 'systemctl --user daemon-reload'
ssh <approved-vps-hermes-target> 'systemctl --user enable hermes-agent-dashboard.service'
ssh <approved-vps-hermes-target> 'systemctl --user restart hermes-agent-dashboard.service'
ssh <approved-vps-hermes-target> 'systemctl --user is-active hermes-agent-dashboard.service'
ssh <approved-vps-hermes-target> 'systemctl --user is-enabled hermes-agent-dashboard.service'
ssh <approved-vps-hermes-target> 'ss -ltnp 2>/dev/null | grep :8765 || true'
```

**Expected:**

- Service active.
- Service enabled.
- Listener bound to Tailscale IP:8765, not `0.0.0.0:8765`.
- Gateway service was not restarted.

**Stop conditions:**

- Service binds to public interface or `0.0.0.0`.
- Service restart hangs in `deactivating` and cannot be recovered with the known safe dashboard-service-only procedure.
- Restart affects Telegram gateway.

---

## Phase 6: Browser smoke and API posture verification

**Objective:** Verify the dashboard renders the intended PR #4 AI Office UI from a browser and does not expose raw data.

**Primary browser smoke URL:**

```text
http://100.122.57.85:8765/office
```

**Additional smoke URLs:**

```text
http://100.122.57.85:8765/office?paperclip-workbench=2&verify=1
http://100.122.57.85:8765/office?source-health=2&verify=1
```

**Browser smoke checklist:**

- `/office` renders AI Office dashboard, not generic/default dashboard.
- `/office` sidebar shows the read-only system-action guard and does not show `게이트웨이 재시작` or `Hermes 업데이트`.
- Diagnostics drawer states the timestamp policy as browser-local timezone display.
- Paperclip workbench exists and remains folded/read-only.
- Paperclip Workbench 2 manifest visibility strip exists.
- Expected hooks exist:
  - `data-office-paperclip-manifest-visibility="true"`
  - `data-office-paperclip-manifest-card="manifests"`
  - `data-office-paperclip-manifest-card="privateDashboard"`
  - `data-office-paperclip-manifest-card="relayPosture"`
- Office Source Health compact diagnostics exist.
- Stage 16 motion/spatial UI remains safe and does not fabricate first-snapshot movement.
- Browser console has no JavaScript errors.
- Raw leak probes are false for:
  - prompt
  - transcript
  - token
  - secret
  - API key
  - password
  - raw private filesystem path
  - cron script
  - raw adapter error
  - task body

**Note:** Protected direct API calls such as `/api/office/state` may return `401`; browser-rendered `/office` is the main smoke source unless a valid dashboard session token is available.

---

## Phase 7: Public exposure negative checks

**Objective:** Prove that the service is private/Tailscale-only.

**Checks from outside the VPS/Tailscale path:**

```bash
# Use public IP only if already known from approved context; do not print/store secrets.
curl --connect-timeout 5 -I http://<vps-public-ip>:8765/office || true
curl --connect-timeout 5 -I http://<vps-public-ip>:8766/ || true
```

**Checks on VPS listener binding:**

```bash
ssh <approved-vps-hermes-target> 'ss -ltnp 2>/dev/null | grep -E ":8765|:8766" || true'
```

**Expected:**

- Public IP connection to 8765 fails/times out/refuses.
- Public IP connection to 8766 fails/times out/refuses.
- VPS listener is Tailscale IP only, not `0.0.0.0`.

**Stop conditions:**

- Public URL is reachable.
- Listener binds to all interfaces.
- Firewall/routing posture is ambiguous.

---

## Phase 8: Rollback plan

**Objective:** Restore previous VPS dashboard state quickly without touching Telegram gateway.

### Rollback data to capture before deployment mutation

Before changing the dashboard service, capture:

```bash
ssh <approved-vps-hermes-target> 'systemctl --user cat hermes-agent-dashboard.service || true'
ssh <approved-vps-hermes-target> 'systemctl --user is-active hermes-agent-dashboard.service || true'
ssh <approved-vps-hermes-target> 'systemctl --user is-enabled hermes-agent-dashboard.service || true'
ssh <approved-vps-hermes-target> 'cd /home/hermes/.hermes/ai-office-dashboard 2>/dev/null && git rev-parse HEAD && git status --short --branch || true'
```

Save the old service unit content locally in the session output, not in a secret-bearing file. If it contains secrets, do not print it; report that rollback requires restoring from systemd cat output inspected locally.

### Rollback options

1. **Service unit rollback:** restore the previous `hermes-agent-dashboard.service` content, then:

```bash
ssh <approved-vps-hermes-target> 'systemctl --user daemon-reload'
ssh <approved-vps-hermes-target> 'systemctl --user restart hermes-agent-dashboard.service'
ssh <approved-vps-hermes-target> 'systemctl --user is-active hermes-agent-dashboard.service'
```

2. **Git rollback in dashboard worktree:** reset `/home/hermes/.hermes/ai-office-dashboard` to the pre-release commit captured above:

```bash
ssh <approved-vps-hermes-target> 'set -e
cd /home/hermes/.hermes/ai-office-dashboard
git reset --hard <previous-dashboard-head>
cd web
export PATH=$HOME/.hermes/node/bin:$HOME/.local/bin:$PATH
npm ci
npm run build
systemctl --user restart hermes-agent-dashboard.service
systemctl --user is-active hermes-agent-dashboard.service
'
```

3. **Disable dashboard only:** if the dashboard release is unsafe and no previous safe service is required:

```bash
ssh <approved-vps-hermes-target> 'systemctl --user disable --now hermes-agent-dashboard.service'
```

Do not stop `hermes-gateway.service` as part of dashboard rollback.

---

## Phase 9: Post-release report

**Objective:** Report exactly what changed and what did not.

Report fields:

- Private URL: `http://100.122.57.85:8765/office` or actual Tailscale IP URL.
- Dashboard service active/enabled status.
- Serving worktree path.
- Serving branch and commit SHA.
- Browser smoke result.
- Console error result.
- Raw leak result.
- Public exposure negative check result.
- Gateway untouched status.
- Rollback handle: previous dashboard service unit/HEAD captured.

Explicitly state not done:

- No PR merge.
- No Paperclip Workbench 3.
- No Office Source Health 3.
- No NAS mount.
- No watcher changes.
- No mutation controls.
- No public exposure.
- No Telegram gateway restart.

---

## Recommended next user approval prompt

If the user wants to proceed after reviewing this plan, ask them to approve this exact execution scope:

```text
계획대로 VPS AI Office Dashboard Release 1을 실행하라. PR #4 head를 restricted hermes user의 `/home/hermes/.hermes/ai-office-dashboard` 별도 worktree에 배포하고, dashboard service만 Tailscale IP:8765에 바인딩해 검증하라. Telegram gateway, NAS mount, watcher, Paperclip Workbench 3, Office Source Health 3, mutation control, dependency/renderer 변경은 하지 마라.
```
