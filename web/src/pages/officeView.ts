import type { OfficeSourceStatus, OfficeState } from "@/lib/api";

export type AttentionItem = {
  id: string;
  label: string;
  detail: string;
};

export type OfficeMapNode = {
  id: "sessions" | "work" | "automation" | "routing";
  label: string;
  detail: string;
  zone: "entry" | "workbench" | "machine" | "routing";
  count: number;
  health: "ok" | "partial" | "missing" | "error";
  x: number;
  y: number;
};

export type OfficeMapFlow = {
  from: OfficeMapNode["id"];
  to: OfficeMapNode["id"];
  label: string;
  health: OfficeMapNode["health"];
};

export type OfficeSceneObject = {
  id: string;
  roomId: OfficeMapNode["id"];
  kind: "avatar" | "desk" | "machine" | "mail" | "alert";
  label: string;
  detail: string;
  health: OfficeMapNode["health"];
  x: number;
  y: number;
};

export type OfficeSceneObjectView = {
  glyph: string;
  title: string;
  toneClass: string;
  ariaHidden: true;
  interactive: false;
};

export type OfficeSceneMotionStyle = Record<"--office-motion-x" | "--office-motion-y" | "--office-motion-duration" | "--office-motion-delay", string>;

export type OfficeSceneMotionTrack = {
  className: string;
  style: OfficeSceneMotionStyle;
  ariaLabel: string;
};

export type OfficeCharacterRole = "model" | "operator" | "worker" | "reviewer" | "automation_keeper" | "router" | "sentinel" | "alert";

export type OfficeCharacterStatus = "active" | "idle" | "working" | "reviewing" | "routing" | "scheduled" | "blocked" | "warning" | "error" | "unknown";

export type OfficeCharacter = {
  id: string;
  role: OfficeCharacterRole;
  roomId: OfficeMapNode["id"];
  label: string;
  status: OfficeCharacterStatus;
  detail: string;
  redactionNote: string;
  x: number;
  y: number;
};

export type OfficeCharacterView = {
  glyph: string;
  bodyClassName: string;
  accessoryClassName: string;
  nameplate: string;
  statusLabel: string;
  safeTitle: string;
};

export type OfficeCharacterActivityId = "thinking" | "working" | "reviewing" | "routing" | "scheduled" | "soon" | "blocked" | "warning" | "idle" | "unknown";

export type OfficeCharacterActivity = {
  id: OfficeCharacterActivityId;
  label: string;
  motion: "walk" | "idle" | "blink" | "pulse" | "none";
  tone: "normal" | "success" | "warning" | "danger" | "muted";
  reducedMotionLabel: string;
};

export type OfficeCharacterRoute = {
  id: string;
  fromRoomId: OfficeMapNode["id"];
  toRoomId: OfficeMapNode["id"];
  label: string;
  detail: string;
  tone: "normal" | "warning" | "danger";
  motion: "route" | "alert";
  changed: true;
  reducedMotionLabel: string;
};

export type OfficeCharacterInspector = {
  kind: "RPG 캐릭터";
  title: string;
  ariaLabel: string;
  fields: Array<[string, string]>;
};

export type OfficeCharacterTrackingStyle = Record<"--office-tracking-x" | "--office-tracking-y" | "--office-tracking-duration" | "--office-tracking-delay", string>;

export type OfficeCharacterTrackingCue = {
  characterId: string;
  label: string;
  detail: string;
  tone: "steady" | "alert" | "warning";
  style: OfficeCharacterTrackingStyle;
  reducedMotionLabel: string;
  ariaHidden: true;
  interactive: false;
};

export type OfficeRoomActivityLevel = "quiet" | "active" | "busy" | "changed";

export type OfficeRoomActivityMeter = {
  roomId: OfficeMapNode["id"];
  label: string;
  detail: string;
  level: OfficeRoomActivityLevel;
  percent: number;
  reducedMotionLabel: string;
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafePulseTimelineItem = {
  id: string;
  kind: "room" | "flow" | "recent" | "idle";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  reducedMotionLabel: string;
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafePulseTimeline = {
  stageLabel: string;
  detail: string;
  items: OfficeSafePulseTimelineItem[];
};

export type OfficeSafeBreadcrumbSegment = {
  id: string;
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeBreadcrumbTrail = {
  stageLabel: string;
  detail: string;
  segments: OfficeSafeBreadcrumbSegment[];
};

export type OfficeSafeRouteCompassPoint = {
  id: "direction" | "signal" | "summary";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeRouteCompass = {
  stageLabel: string;
  heading: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  points: OfficeSafeRouteCompassPoint[];
};

export type OfficeSafeFocusLaneItem = {
  roomId: OfficeMapNode["id"];
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  weight: number;
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeFocusLane = {
  stageLabel: string;
  detail: string;
  items: OfficeSafeFocusLaneItem[];
};

export type OfficeSafeAttentionStripChip = {
  id: "focus" | "signal" | "scope";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeAttentionStrip = {
  stageLabel: string;
  heading: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  chips: OfficeSafeAttentionStripChip[];
};

export type OfficeSafeRoomBeaconIntensity = "idle" | "low" | "medium" | "high";

export type OfficeSafeRoomBeacon = {
  roomId: OfficeMapNode["id"];
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  intensity: OfficeSafeRoomBeaconIntensity;
  weight: number;
  x: number;
  y: number;
  reducedMotionLabel: string;
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeRoomBeacons = {
  stageLabel: string;
  detail: string;
  beacons: OfficeSafeRoomBeacon[];
};

export type OfficeSafeFlowPulseBand = {
  id: string;
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  intensity: OfficeSafeRoomBeaconIntensity;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  reducedMotionLabel: string;
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeFlowPulseBands = {
  stageLabel: string;
  detail: string;
  bands: OfficeSafeFlowPulseBand[];
};

export type OfficeSafeTacticalMinimapCell = {
  roomId: OfficeMapNode["id"];
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  intensity: OfficeSafeRoomBeaconIntensity;
  active: boolean;
  weight: number;
  x: number;
  y: number;
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeTacticalMinimap = {
  stageLabel: string;
  summary: string;
  detail: string;
  cells: OfficeSafeTacticalMinimapCell[];
};

export type OfficeSafeTacticalTickerItem = {
  id: "focus" | "map" | "cells";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeTacticalTicker = {
  stageLabel: string;
  headline: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  items: OfficeSafeTacticalTickerItem[];
};

export type OfficeSafeMissionClockOptions = {
  liveTracking: boolean;
  isVisible: boolean;
  consecutiveFailures: number;
  hasRecentChanges: boolean;
};

export type OfficeSafeMissionClockItem = {
  id: "mode" | "cadence" | "safety" | "pulse";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeMissionClock = {
  stageLabel: string;
  headline: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  items: OfficeSafeMissionClockItem[];
};

export type OfficeSafeCommandDeckCard = {
  id: "mission" | "tactical" | "sources" | "safety";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeCommandDeck = {
  stageLabel: string;
  headline: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  cards: OfficeSafeCommandDeckCard[];
};

export type OfficeSafeFloorLegendItem = {
  id: "active" | "idle" | "flow" | "safety";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeFloorLegend = {
  stageLabel: string;
  summary: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  items: OfficeSafeFloorLegendItem[];
};

export type OfficeSafeStatusSnapshotItem = {
  id: "deck" | "floor" | "source" | "guard";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeStatusSnapshot = {
  stageLabel: string;
  headline: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  items: OfficeSafeStatusSnapshotItem[];
};

export type OfficeSafeScanIndexItem = {
  id: "snapshot" | "rail" | "mode";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeScanIndex = {
  stageLabel: string;
  headline: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  items: OfficeSafeScanIndexItem[];
};

export type OfficeSafeHudReadabilityPlanOptions = {
  viewportWidth?: number;
  prefersReducedMotion: boolean;
  safePanelCount: number;
  liveTracking: boolean;
};

export type OfficeSafeHudReadabilityPlanItem = {
  id: "layout" | "motion" | "density" | "tracking";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeHudReadabilityPlan = {
  stageLabel: string;
  summary: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  items: OfficeSafeHudReadabilityPlanItem[];
};

export type OfficeSafeHudHierarchyOptions = {
  statusTone: OfficeDeltaBadge["tone"];
  scanTone: OfficeDeltaBadge["tone"];
  readabilityTone: OfficeDeltaBadge["tone"];
  statusItemCount: number;
  scanItemCount: number;
  readabilityItemCount: number;
};

export type OfficeSafeHudHierarchySection = {
  id: "primary" | "secondary" | "diagnostic";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeHudHierarchy = {
  stageLabel: string;
  headline: string;
  summary: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  sections: OfficeSafeHudHierarchySection[];
};

export type OfficeDeltaBadge = {
  label: string;
  tone: "positive" | "negative" | "warning" | "neutral";
};

export type OfficeRecentChange = {
  id: string;
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
};

export type OfficeFlowChange = {
  from: OfficeMapFlow["from"];
  to: OfficeMapFlow["to"];
  label: string;
  tone: OfficeDeltaBadge["tone"];
};

export type OfficeAutomationTimingBucketId = "overdue" | "under15m" | "under1h" | "today" | "later" | "unknown";

export type OfficeAutomationTimingBucket = {
  id: OfficeAutomationTimingBucketId;
  label: string;
  tone: OfficeDeltaBadge["tone"];
};

export type OfficeAutomationTimingSummary = {
  counts: Record<OfficeAutomationTimingBucketId, number>;
  primaryBucket: OfficeAutomationTimingBucket;
};

export type OfficeStateDelta = {
  hasChanges: boolean;
  nodeBadges: Record<OfficeMapNode["id"], OfficeDeltaBadge[]>;
  changedFlows: OfficeFlowChange[];
  recentChanges: OfficeRecentChange[];
};

export type OfficeSourceHealthSummary = {
  counts: Record<OfficeSourceStatus, number>;
  label: string;
  detail: string;
  totalWarningCount: number;
  missingSourceIds: string[];
  tone: OfficeDeltaBadge["tone"];
};

export type OfficeEmptySourceCopyItem = {
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
};

export type OfficeEmptySourceCopyPlan = {
  title: string;
  detail: string;
  items: OfficeEmptySourceCopyItem[];
};

export type OfficeEmptyStateHints = Record<"rooms" | "agents" | "workItems" | "automations" | "topics" | "events", string>;

export type OfficeUsabilityItem = {
  id: "density" | "source-fallback" | "motion" | "responsive" | "korean-copy";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
};

export type OfficeUsabilitySummary = {
  items: OfficeUsabilityItem[];
};

export type OfficeMapDensityMode = "summary" | "standard" | "detail";

export type OfficeMapDensityPlan = {
  mode: OfficeMapDensityMode;
  label: string;
  detail: string;
  visibleCharacters: OfficeCharacter[];
  hiddenCharacterCount: number;
  showUsabilityRail: boolean;
  showRecentRail: boolean;
};

export type OfficeMapJumpTarget = {
  id: "map" | "usability" | "recent" | "inspector";
  label: string;
  detail: string;
  targetId: string;
  enabled: boolean;
};

export type OfficeMapPolishPlan = {
  stageLabel: string;
  characterLabelMode: "minimal" | "compact" | "full";
  lowerRailMode: "inline" | "detached";
  mapClassName: string;
  legendClassName: string;
  notes: string[];
};

export type OfficeResponsiveReadabilityPlan = {
  stageLabel: string;
  viewportMode: "narrow" | "desktop";
  recommendedDensityMode: OfficeMapDensityMode;
  mapClassName: string;
  railClassName: string;
  notes: string[];
};

export type OfficeFirstLayoutSection = {
  id: "scene" | "inspector" | "timeline" | "diagnostics";
  label: string;
  detail: string;
  priority: number;
};

export type OfficeFirstLayoutPlan = {
  stageLabel: string;
  heading: string;
  primarySurface: "scene";
  diagnosticsMode: "secondary-collapsed" | "secondary-visible";
  summary: string;
  sections: OfficeFirstLayoutSection[];
};

export type OfficeTrackingTruthPlan = {
  stageLabel: string;
  mode: "snapshot-delta" | "event-stream" | "static";
  label: string;
  detail: string;
  caveats: string[];
};

export type OfficeSelectedCharacterFocus = {
  selectedCharacterId: OfficeCharacter["id"] | null;
  title: string;
  summary: string;
  roomLabel: string;
  actionLabel: string;
  highlightSelector: string;
  fields: Array<[string, string]>;
};

export type OfficeSafeEventCategory = "snapshot_static" | "room_density_changed" | "flow_changed" | "attention_changed" | "source_health_changed" | "workload_changed";

export type OfficeSafeEvent = {
  id: string;
  category: OfficeSafeEventCategory;
  roomId: OfficeMapNode["id"];
  toRoomId?: OfficeMapNode["id"];
  tone: OfficeDeltaBadge["tone"];
  count: number;
  lane?: string;
  safeLabel: string;
  detail: string;
  redacted: true;
  rawSource: false;
};

export type OfficeSafeEventSubstrate = {
  stageLabel: string;
  mode: "static-posture" | "projected-events" | "event-stream";
  summary: string;
  events: OfficeSafeEvent[];
};

export type OfficeSafeStreamPosture = {
  stageLabel: string;
  mode: "backend-safe-stream" | "local-fallback" | "loading";
  label: string;
  summary: string;
  generatedAt?: string;
  events: OfficeSafeEvent[];
};

export type OfficeSafeStreamInput = {
  status: "idle" | "loading" | "loaded" | "unavailable";
  generated_at?: unknown;
  events?: Array<Record<string, unknown>>;
  error?: unknown;
};

export type OfficeSafeMotionCommand = {
  id: string;
  kind: "idle-glow" | "pulse-room" | "route-lane" | "attention-spark";
  roomId: OfficeMapNode["id"];
  toRoomId?: OfficeMapNode["id"];
  lane?: string;
  tone: OfficeDeltaBadge["tone"];
  count: number;
  label: string;
  detail: string;
  className: string;
  ariaHidden: true;
  interactive: false;
};

export function textField(row: Record<string, unknown>, key: string): string {
  const value = row[key];
  return typeof value === "string" && value.length > 0 ? value : "—";
}

export function buildOfficeFirstLayoutPlan(options: {
  visibleCharacterCount: number;
  diagnosticPanelCount: number;
  hasSelectedCharacter: boolean;
}): OfficeFirstLayoutPlan {
  const diagnosticsMode: OfficeFirstLayoutPlan["diagnosticsMode"] = options.diagnosticPanelCount > 4 ? "secondary-collapsed" : "secondary-visible";
  return {
    stageLabel: "Stage 16-A AI Office-first reset",
    heading: "AI Office 먼저 보기",
    primarySurface: "scene",
    diagnosticsMode,
    summary: `캐릭터 ${options.visibleCharacterCount}개 · 진단 ${options.diagnosticPanelCount}개는 보조로 정리`,
    sections: [
      {
        id: "scene",
        label: "오피스 현장",
        detail: `역할 캐릭터 ${options.visibleCharacterCount}개를 첫 화면 중심에 둡니다`,
        priority: 1,
      },
      {
        id: "inspector",
        label: "선택 정보",
        detail: options.hasSelectedCharacter ? "선택한 캐릭터의 안전 요약을 고정 표시합니다" : "캐릭터를 클릭하면 안전 요약이 이 위치에 고정됩니다",
        priority: 2,
      },
      {
        id: "timeline",
        label: "최근 변화",
        detail: "브라우저 메모리의 안전 변화만 짧게 이어서 보여줍니다",
        priority: 3,
      },
      {
        id: "diagnostics",
        label: "진단 HUD",
        detail: diagnosticsMode === "secondary-collapsed" ? "세부 진단은 보조 영역에서 접어 과밀을 줄입니다" : "세부 진단은 보조 영역에 낮은 우선순위로 둡니다",
        priority: 4,
      },
    ],
  };
}

export function buildOfficeTrackingTruthPlan(
  delta: OfficeStateDelta,
  options: { hasEventStream?: boolean; visibleCharacterCount: number },
): OfficeTrackingTruthPlan {
  const recentChangeCount = Object.values(delta.nodeBadges).reduce((total, badges) => total + badges.length, 0) + delta.changedFlows.length;
  if (options.hasEventStream) {
    return {
      stageLabel: "Stage 16-A tracking truth",
      mode: "event-stream",
      label: "안전 이벤트 기반",
      detail: `캐릭터 ${options.visibleCharacterCount}개 · 최근 안전 변화 ${recentChangeCount}개 · 안전 이벤트 스트림 사용`,
      caveats: ["이벤트는 가림 처리된 범주만 사용합니다"],
    };
  }
  return {
    stageLabel: "Stage 16-A tracking truth",
    mode: recentChangeCount > 0 ? "snapshot-delta" : "static",
    label: recentChangeCount > 0 ? "스냅샷 변화 기반" : "정적 안전 스냅샷",
    detail: `캐릭터 ${options.visibleCharacterCount}개 · 최근 안전 변화 ${recentChangeCount}개 · 실시간 이벤트 스트림 없음`,
    caveats: ["움직임은 CSS 장식입니다", "실제 작업 추적은 안전 이벤트 스트림 승인 후 분리 구현"],
  };
}

export function buildOfficeSelectedCharacterFocus(character: OfficeCharacter | null, delta: OfficeStateDelta): OfficeSelectedCharacterFocus {
  if (!character) {
    return {
      selectedCharacterId: null,
      title: "캐릭터를 선택하세요",
      summary: "오피스 캐릭터를 클릭하면 안전 요약이 고정됩니다",
      roomLabel: "미선택",
      actionLabel: "대기",
      highlightSelector: "",
      fields: [["추적", "스냅샷 변화 기반 · 원문 제외"]],
    };
  }
  const activity = buildOfficeCharacterActivity(character, delta);
  const roleLabel = CHARACTER_ROLE_LABEL[character.role];
  const roomLabel = CHARACTER_ROOM_LABEL[character.roomId];
  const statusLabel = CHARACTER_STATUS_LABEL[character.status];
  return {
    selectedCharacterId: character.id,
    title: `${roleLabel} 선택됨`,
    summary: `${roomLabel} · ${statusLabel} · ${activity.label}`,
    roomLabel,
    actionLabel: activity.label,
    highlightSelector: `[data-office-character-id="${character.id}"]`,
    fields: [
      ["역할", CHARACTER_ROLE_NAMEPLATE[character.role]],
      ["방", roomLabel],
      ["상태", statusLabel],
      ["액션", activity.label],
      ["추적", "스냅샷 변화 기반 · 원문 제외"],
    ],
  };
}

const OFFICE_SAFE_EVENT_ROOM_ORDER: OfficeMapNode["id"][] = ["sessions", "work", "automation", "routing"];

function safeEventToneRank(tone: OfficeDeltaBadge["tone"]): number {
  if (tone === "negative") return 4;
  if (tone === "warning") return 3;
  if (tone === "positive") return 2;
  return 1;
}

function safeEventToneLabel(tone: OfficeDeltaBadge["tone"]): string {
  if (tone === "negative") return "긴급";
  if (tone === "warning") return "주의";
  if (tone === "positive") return "증가";
  return "변화";
}

function safeEventDetail(roomId: OfficeMapNode["id"], tone: OfficeDeltaBadge["tone"], count: number): string {
  return `${CHARACTER_ROOM_LABEL[roomId]} · ${safeEventToneLabel(tone)} · 안전 변화 ${count}개`;
}

function parseSafeEventRoom(value: unknown): OfficeMapNode["id"] | null {
  return typeof value === "string" && OFFICE_SAFE_EVENT_ROOM_ORDER.includes(value as OfficeMapNode["id"]) ? (value as OfficeMapNode["id"]) : null;
}

function parseSafeEventTone(value: unknown): OfficeDeltaBadge["tone"] | null {
  return value === "neutral" || value === "positive" || value === "warning" || value === "negative" ? value : null;
}

function parseSafeEventCategory(value: unknown): OfficeSafeEventCategory | null {
  if (
    value === "snapshot_static" ||
    value === "room_density_changed" ||
    value === "flow_changed" ||
    value === "attention_changed" ||
    value === "source_health_changed" ||
    value === "workload_changed"
  ) {
    return value;
  }
  return null;
}

function safeEventLabel(category: OfficeSafeEventCategory, roomId: OfficeMapNode["id"]): string {
  if (category === "snapshot_static") return "정적 안전 스냅샷";
  if (category === "source_health_changed") return "소스 상태 신호";
  if (category === "workload_changed") return `${CHARACTER_ROOM_LABEL[roomId]} 작업량`;
  if (category === "flow_changed") return "방 이동 신호";
  if (category === "attention_changed") return `${CHARACTER_ROOM_LABEL[roomId]} 주의`;
  return `${CHARACTER_ROOM_LABEL[roomId]} 변화`;
}

function normalizeBackendSafeEvent(row: Record<string, unknown>, index: number): OfficeSafeEvent | null {
  if (row.redacted !== true) return null;
  const category = parseSafeEventCategory(row.category);
  const roomId = parseSafeEventRoom(row.room_id ?? row.roomId);
  const tone = parseSafeEventTone(row.tone);
  if (!category || !roomId || !tone) return null;
  const count = typeof row.count === "number" && Number.isFinite(row.count) ? Math.max(0, Math.trunc(row.count)) : 0;
  const toRoomId = parseSafeEventRoom(row.to_room_id ?? row.toRoomId) ?? undefined;
  const lane = category === "flow_changed" && toRoomId ? `${roomId}-${toRoomId}` : undefined;
  return {
    id: typeof row.id === "string" && row.id.length > 0 ? `backend-${index}` : `backend-${index}`,
    category,
    roomId,
    toRoomId,
    tone,
    count,
    lane,
    safeLabel: safeEventLabel(category, roomId),
    detail: category === "flow_changed" && toRoomId ? `${CHARACTER_ROOM_LABEL[roomId]}에서 ${CHARACTER_ROOM_LABEL[toRoomId]}로 · 백엔드 안전 이벤트` : safeEventDetail(roomId, tone, count),
    redacted: true,
    rawSource: false,
  };
}

export function buildOfficeSafeStreamPosture(input: OfficeSafeStreamInput, fallback: OfficeSafeEventSubstrate): OfficeSafeStreamPosture {
  if (input.status === "loading" || input.status === "idle") {
    return {
      stageLabel: "Stage 16-C safe event stream",
      mode: "loading",
      label: "안전 이벤트 연결 확인",
      summary: "백엔드 안전 이벤트 확인 중 · 로컬 투영 유지",
      events: fallback.events,
    };
  }
  const backendEvents = input.status === "loaded" ? (input.events ?? []).map(normalizeBackendSafeEvent).filter((event): event is OfficeSafeEvent => Boolean(event)).slice(0, 8) : [];
  if (backendEvents.length > 0) {
    const generatedAt = typeof input.generated_at === "string" ? input.generated_at : undefined;
    return {
      stageLabel: "Stage 16-C safe event stream",
      mode: "backend-safe-stream",
      label: "백엔드 안전 이벤트 연결",
      summary: `백엔드 안전 이벤트 ${backendEvents.length}개 · 원문 제외`,
      generatedAt,
      events: backendEvents,
    };
  }
  return {
    stageLabel: "Stage 16-C safe event stream",
    mode: "local-fallback",
    label: "로컬 안전 투영 유지",
    summary: `백엔드 이벤트 없음 · ${fallback.summary}`,
    events: fallback.events,
  };
}

export function buildOfficeSafeEventSubstrate(
  delta: OfficeStateDelta,
  options: { visibleCharacterCount: number; hasEventStream?: boolean },
): OfficeSafeEventSubstrate {
  const events: OfficeSafeEvent[] = [];
  for (const roomId of OFFICE_SAFE_EVENT_ROOM_ORDER) {
    const badges = delta.nodeBadges[roomId] ?? [];
    if (badges.length === 0) continue;
    const tone = badges.reduce<OfficeDeltaBadge["tone"]>((selected, badge) => (safeEventToneRank(badge.tone) > safeEventToneRank(selected) ? badge.tone : selected), "neutral");
    events.push({
      id: `room-${roomId}-${events.length}`,
      category: "room_density_changed",
      roomId,
      tone,
      count: badges.length,
      safeLabel: `${CHARACTER_ROOM_LABEL[roomId]} 변화`,
      detail: safeEventDetail(roomId, tone, badges.length),
      redacted: true,
      rawSource: false,
    });
  }

  for (const flow of delta.changedFlows) {
    const lane = `${flow.from}-${flow.to}`;
    events.push({
      id: `flow-${lane}-${events.length}`,
      category: "flow_changed",
      roomId: flow.from,
      toRoomId: flow.to,
      tone: flow.tone,
      count: 1,
      lane,
      safeLabel: "방 이동 신호",
      detail: `${CHARACTER_ROOM_LABEL[flow.from]}에서 ${CHARACTER_ROOM_LABEL[flow.to]}로 · 안전 흐름 변화`,
      redacted: true,
      rawSource: false,
    });
  }

  const attentionRooms = OFFICE_SAFE_EVENT_ROOM_ORDER.filter((roomId) => (delta.nodeBadges[roomId] ?? []).some((badge) => badge.tone === "warning" || badge.tone === "negative"));
  for (const roomId of attentionRooms) {
    const badges = delta.nodeBadges[roomId] ?? [];
    const tone = badges.some((badge) => badge.tone === "negative") ? "negative" : "warning";
    events.push({
      id: `attention-${roomId}-${events.length}`,
      category: "attention_changed",
      roomId,
      tone,
      count: badges.length || 1,
      safeLabel: `${CHARACTER_ROOM_LABEL[roomId]} 주의`,
      detail: `${CHARACTER_ROOM_LABEL[roomId]} · 주의 우선 · 원문 제외`,
      redacted: true,
      rawSource: false,
    });
  }

  if (events.length === 0) {
    return {
      stageLabel: "Stage 16-B safe event substrate",
      mode: "static-posture",
      summary: "안전 이벤트 1개 · 정적 posture",
      events: [
        {
          id: "snapshot-static",
          category: "snapshot_static",
          roomId: "sessions",
          tone: "neutral",
          count: options.visibleCharacterCount,
          safeLabel: "정적 안전 스냅샷",
          detail: `캐릭터 ${options.visibleCharacterCount}개 · fabricated movement 없음`,
          redacted: true,
          rawSource: false,
        },
      ],
    };
  }

  return {
    stageLabel: "Stage 16-B safe event substrate",
    mode: options.hasEventStream ? "event-stream" : "projected-events",
    summary: `안전 이벤트 ${events.length}개 · ${options.hasEventStream ? "event stream" : "snapshot/delta 투영"}`,
    events,
  };
}

export function buildOfficeSafeMotionCommands(events: OfficeSafeEvent[]): OfficeSafeMotionCommand[] {
  return events.map((event): OfficeSafeMotionCommand => {
    if (event.category === "snapshot_static") {
      return {
        id: `motion-${event.id}`,
        kind: "idle-glow",
        roomId: event.roomId,
        tone: "neutral",
        count: event.count,
        label: "대기 광원",
        detail: `${CHARACTER_ROOM_LABEL[event.roomId]} 정적 posture`,
        className: "office-safe-motion-command office-safe-motion-command--idle",
        ariaHidden: true,
        interactive: false,
      };
    }
    if (event.category === "flow_changed") {
      return {
        id: `motion-${event.id}`,
        kind: "route-lane",
        roomId: event.roomId,
        toRoomId: event.toRoomId,
        lane: event.lane,
        tone: event.tone,
        count: event.count,
        label: "흐름 이동",
        detail: event.toRoomId ? `${CHARACTER_ROOM_LABEL[event.roomId]}에서 ${CHARACTER_ROOM_LABEL[event.toRoomId]}로` : CHARACTER_ROOM_LABEL[event.roomId],
        className: "office-safe-motion-command office-safe-motion-command--route",
        ariaHidden: true,
        interactive: false,
      };
    }
    if (event.category === "attention_changed") {
      return {
        id: `motion-${event.id}`,
        kind: "attention-spark",
        roomId: event.roomId,
        tone: event.tone,
        count: event.count,
        label: "주의 반응",
        detail: `${CHARACTER_ROOM_LABEL[event.roomId]} attention spark`,
        className: "office-safe-motion-command office-safe-motion-command--attention",
        ariaHidden: true,
        interactive: false,
      };
    }
    return {
      id: `motion-${event.id}`,
      kind: "pulse-room",
      roomId: event.roomId,
      tone: event.tone,
      count: event.count,
      label: "방 pulse",
      detail: `${CHARACTER_ROOM_LABEL[event.roomId]} safe pulse`,
      className: "office-safe-motion-command office-safe-motion-command--pulse",
      ariaHidden: true,
      interactive: false,
    };
  });
}

export function numberField(row: Record<string, unknown>, key: string): number | null {
  const value = row[key];
  return typeof value === "number" ? value : null;
}

export function groupByText(rows: Array<Record<string, unknown>>, key: string, fallback = "unknown") {
  return rows.reduce<Record<string, Array<Record<string, unknown>>>>((acc, row) => {
    const value = textField(row, key);
    const group = value === "—" ? fallback : value;
    acc[group] = acc[group] ?? [];
    acc[group].push(row);
    return acc;
  }, {});
}

export function visibleRows<T>(rows: T[], limit: number, expanded: boolean): T[] {
  return expanded ? rows : rows.slice(0, limit);
}

const EXPECTED_OFFICE_SOURCE_IDS = ["sessions", "kanban", "cron", "topics", "provenance"] as const;

export function buildOfficeSourceHealthSummary(state: OfficeState): OfficeSourceHealthSummary {
  const counts: Record<OfficeSourceStatus, number> = { ok: 0, partial: 0, missing: 0, unavailable: 0, error: 0 };
  const seen = new Set<string>();
  let totalWarningCount = 0;

  for (const source of state.data_sources) {
    counts[source.status] += 1;
    totalWarningCount += source.warning_count ?? 0;
    seen.add(source.id);
  }

  const missingSourceIds = EXPECTED_OFFICE_SOURCE_IDS.filter((id) => !seen.has(id));
  counts.missing += missingSourceIds.length;

  const attentionCount = counts.partial + counts.error;
  const gapCount = counts.missing + counts.unavailable;
  const label = counts.error > 0 || totalWarningCount > 0 || counts.partial > 0 ? "주의 필요" : gapCount > 0 ? "소스 공백" : "정상";
  const tone: OfficeDeltaBadge["tone"] = label === "정상" ? "positive" : label === "주의 필요" ? "warning" : "neutral";

  return {
    counts,
    label,
    detail: `정상 ${counts.ok} · 주의 ${attentionCount} · 공백/미연결 ${gapCount} · 경고 ${totalWarningCount}`,
    totalWarningCount,
    missingSourceIds,
    tone,
  };
}

export function buildOfficeEmptySourceCopyPlan(state: OfficeState): OfficeEmptySourceCopyPlan {
  const sourceHealth = buildOfficeSourceHealthSummary(state);
  const missingCount = sourceHealth.missingSourceIds.length;
  const reportedCount = state.data_sources.length;
  const gapCount = sourceHealth.counts.missing + sourceHealth.counts.unavailable;

  return {
    title: reportedCount === 0 ? "아직 연결된 소스가 없습니다" : "일부 소스가 비어 있습니다",
    detail:
      reportedCount === 0
        ? "대시보드 오류가 아니라 안전 DTO가 비어 있는 상태입니다. 연결 전에도 읽기 전용 셸과 가림 정책은 유지됩니다."
        : "보고된 소스와 미보고 소스를 분리해 표시합니다. 비어 있는 영역은 민감 원문을 추론하지 않습니다.",
    items: [
      {
        label: "연결 상태",
        detail: missingCount > 0 ? `미보고 소스 ${missingCount}개 · ${sourceHealth.missingSourceIds.join(" · ")}` : `보고 소스 ${reportedCount}개`,
        tone: gapCount > 0 ? "neutral" : "positive",
      },
      {
        label: "읽기 범위",
        detail: "읽기 전용 안전 DTO의 개수·상태·시각만 사용합니다.",
        tone: "positive",
      },
      {
        label: "다음 확인",
        detail: "필요하면 어댑터 연결 상태를 확인하되 이 화면에서는 실행·수정 제어를 제공하지 않습니다.",
        tone: "neutral",
      },
    ],
  };
}

export function buildOfficeEmptyStateHints(): OfficeEmptyStateHints {
  return {
    rooms: "방 투영이 없습니다. 외부 작업이 비었다는 뜻은 아니며, 연결된 안전 DTO만 기준으로 표시합니다.",
    agents: "세션 어댑터가 안전 메타데이터를 제공하지 않았습니다. 제목/미리보기 원문은 계속 숨깁니다.",
    workItems: "승인된 어댑터가 작업 카드를 보고하지 않았습니다. 작업 본문/결과/댓글/로그는 계속 제외합니다.",
    automations: "cron 스타일 작업이 보고되지 않았습니다. 실행/일시정지 제어는 제공하지 않습니다.",
    topics: "토픽 레지스트리/투영이 연결되어 있지 않습니다. UI 오류가 아니라 알려진 소스 공백일 수 있습니다.",
    events: "안전 시간표가 생성되지 않았습니다. 원문 로그와 대화 기록은 설계상 숨깁니다.",
  };
}

export function buildOfficeUsabilitySummary(
  state: OfficeState,
  characters: OfficeCharacter[],
  options: { reducedMotion?: boolean; viewportWidth?: number } = {},
): OfficeUsabilitySummary {
  const sourceHealth = buildOfficeSourceHealthSummary(state);
  const hasDenseCharacters = characters.length >= 12 || characters.some((character) => character.label.startsWith("+"));
  const fallbackCount = sourceHealth.counts.missing + sourceHealth.counts.unavailable + sourceHealth.counts.partial;
  const isNarrow = typeof options.viewportWidth === "number" && options.viewportWidth < 640;

  return {
    items: [
      {
        id: "density",
        label: "밀도 점검",
        detail: hasDenseCharacters ? "합산 캐릭터와 +N 표식으로 겹침을 줄입니다." : "현재 캐릭터 밀도는 안정적입니다.",
        tone: hasDenseCharacters ? "warning" : "positive",
      },
      {
        id: "source-fallback",
        label: "소스 공백",
        detail: fallbackCount > 0 ? `미연결/부분 연결 소스 ${fallbackCount}개를 빈 방·보관함으로 표시합니다.` : "보고된 소스가 정상 범위입니다.",
        tone: fallbackCount > 0 ? "neutral" : "positive",
      },
      {
        id: "motion",
        label: "동작 모드",
        detail: options.reducedMotion ? "사용자 설정에 따라 애니메이션은 정지하고 정적 라벨을 유지합니다." : "CSS 전용 약한 움직임을 사용하며 원문 데이터는 쓰지 않습니다.",
        tone: "neutral",
      },
      {
        id: "responsive",
        label: isNarrow ? "좁은 화면" : "화면 배치",
        detail: isNarrow ? "좁은 화면에서는 맵·최근 변화·안전 정보가 세로 흐름으로 읽힙니다." : "데스크톱에서는 맵과 안전 정보가 분리되어 읽힙니다.",
        tone: "neutral",
      },
      {
        id: "korean-copy",
        label: "한국어 우선",
        detail: "주요 안내·범례·안전 문구는 한국어로 유지하고 안정 식별자만 그대로 둡니다.",
        tone: "positive",
      },
    ],
  };
}

const OFFICE_DENSITY_MODE_CONFIG: Record<OfficeMapDensityMode, { label: string; limit: number; showUsabilityRail: boolean; showRecentRail: boolean }> = {
  summary: { label: "요약", limit: 6, showUsabilityRail: true, showRecentRail: false },
  standard: { label: "표준", limit: 12, showUsabilityRail: true, showRecentRail: true },
  detail: { label: "상세", limit: Number.POSITIVE_INFINITY, showUsabilityRail: true, showRecentRail: true },
};

export function buildOfficeMapDensityPlan(mode: OfficeMapDensityMode, characters: OfficeCharacter[]): OfficeMapDensityPlan {
  const config = OFFICE_DENSITY_MODE_CONFIG[mode] ?? OFFICE_DENSITY_MODE_CONFIG.standard;
  const visibleCharacters = characters.slice(0, config.limit);
  const hiddenCharacterCount = Math.max(characters.length - visibleCharacters.length, 0);
  const detail =
    hiddenCharacterCount > 0
      ? `${config.label} 모드 · 캐릭터 ${visibleCharacters.length}개 표시 · ${hiddenCharacterCount}개는 안전하게 접음`
      : `${config.label} 모드 · 캐릭터 ${visibleCharacters.length}개 표시`;
  return {
    mode,
    label: config.label,
    detail,
    visibleCharacters,
    hiddenCharacterCount,
    showUsabilityRail: config.showUsabilityRail,
    showRecentRail: config.showRecentRail,
  };
}

export function buildOfficeMapJumpTargets(densityPlan: OfficeMapDensityPlan): OfficeMapJumpTarget[] {
  return [
    { id: "map", label: "지도", detail: "오피스 맵 방과 캐릭터로 이동", targetId: "office-map-canvas", enabled: true },
    { id: "usability", label: "사용성", detail: "밀도·소스·동작 점검 rail로 이동", targetId: "office-map-usability", enabled: densityPlan.showUsabilityRail },
    {
      id: "recent",
      label: densityPlan.showRecentRail ? "최근 변화" : "최근 변화 접힘",
      detail: densityPlan.showRecentRail ? "브라우저 메모리의 안전 delta rail로 이동" : "요약 모드에서 접힌 최근 변화 안내로 이동",
      targetId: densityPlan.showRecentRail ? "office-map-recent" : "office-map-recent-collapsed",
      enabled: true,
    },
    { id: "inspector", label: "안전 정보", detail: "선택한 방 또는 캐릭터의 안전 정보 패널로 이동", targetId: "office-safe-inspector", enabled: true },
  ];
}

export function buildOfficeMapPolishPlan(densityPlan: OfficeMapDensityPlan): OfficeMapPolishPlan {
  const visibleCount = densityPlan.visibleCharacters.length;
  const characterLabelMode: OfficeMapPolishPlan["characterLabelMode"] =
    densityPlan.mode === "summary" ? "minimal" : visibleCount >= 10 || densityPlan.hiddenCharacterCount > 0 ? "compact" : "full";
  const lowerRailMode: OfficeMapPolishPlan["lowerRailMode"] = visibleCount >= 6 || densityPlan.showRecentRail ? "detached" : "inline";
  const mapClasses = ["office-map--polished"];
  if (characterLabelMode === "minimal") mapClasses.push("office-map--labels-minimal");
  if (characterLabelMode === "compact") mapClasses.push("office-map--labels-compact");
  if (lowerRailMode === "detached") mapClasses.push("office-map--rail-detached");
  return {
    stageLabel: "Stage 11-B 정돈",
    characterLabelMode,
    lowerRailMode,
    mapClassName: mapClasses.join(" "),
    legendClassName: `office-map-legend${lowerRailMode === "detached" ? " office-map-legend--detached" : ""}`,
    notes: [
      characterLabelMode === "full" ? "캐릭터 이름표는 전체 표시" : "캐릭터 이름표는 역할 중심으로 압축",
      lowerRailMode === "detached" ? "하단 rail은 맵 바닥과 분리" : "하단 rail은 맵 안에서 유지",
    ],
  };
}

export function buildOfficeResponsiveReadabilityPlan(
  densityPlan: OfficeMapDensityPlan,
  options: { viewportWidth?: number } = {},
): OfficeResponsiveReadabilityPlan {
  const isNarrow = typeof options.viewportWidth === "number" && options.viewportWidth < 640;
  return {
    stageLabel: "Stage 12-A 반응형",
    viewportMode: isNarrow ? "narrow" : "desktop",
    recommendedDensityMode: isNarrow ? "summary" : densityPlan.mode,
    mapClassName: `office-map--responsive${isNarrow ? " office-map--mobile-readable" : ""}`,
    railClassName: isNarrow ? "office-map-rail--mobile-stack" : "office-map-rail--desktop",
    notes: isNarrow
      ? ["좁은 화면에서는 요약 모드 권장", "맵 rail은 세로 흐름으로 읽힘"]
      : ["데스크톱에서는 현재 밀도 모드 유지", "맵과 rail은 분리된 영역으로 읽힘"],
  };
}

export function buildOfficeMapNodes(state: OfficeState): OfficeMapNode[] {
  const sourceStatus = (id: string): OfficeMapNode["health"] => {
    const status = state.data_sources.find((source) => source.id === id)?.status;
    if (status === "error") return "error";
    if (status === "partial" || status === "unavailable") return "partial";
    if (status === "ok") return "ok";
    return "missing";
  };

  const routingHealth: OfficeMapNode["health"] = state.topics.length > 0 || state.provenance.length > 0 ? "ok" : sourceStatus("topics");

  return [
    {
      id: "sessions",
      label: "세션",
      detail: "최근 안전 세션 메타데이터",
      zone: "entry",
      count: state.agents.length,
      health: sourceStatus("sessions"),
      x: 24,
      y: 30,
    },
    {
      id: "work",
      label: "작업",
      detail: "본문 없는 칸반/작업 카드",
      zone: "workbench",
      count: state.work_items.length,
      health: sourceStatus("kanban"),
      x: 70,
      y: 30,
    },
    {
      id: "automation",
      label: "자동화",
      detail: "읽기 전용 기계로 표시한 cron 작업",
      zone: "machine",
      count: state.automations.length,
      health: sourceStatus("cron"),
      x: 24,
      y: 67,
    },
    {
      id: "routing",
      label: "라우팅",
      detail: "토픽/출처 투영",
      zone: "routing",
      count: state.topics.length + state.provenance.length,
      health: routingHealth,
      x: 70,
      y: 67,
    },
  ];
}

export function buildOfficeMapFlows(nodes: OfficeMapNode[]): OfficeMapFlow[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const flowDefs: Array<Omit<OfficeMapFlow, "health">> = [
    { from: "sessions", to: "work", label: "세션에서 작업으로" },
    { from: "work", to: "automation", label: "작업에서 자동화로" },
    { from: "automation", to: "routing", label: "자동화에서 라우팅으로" },
  ];
  const severity: Record<OfficeMapNode["health"], number> = { ok: 0, missing: 1, partial: 2, error: 3 };
  const healthBySeverity: OfficeMapNode["health"][] = ["ok", "missing", "partial", "error"];

  return flowDefs.map((flow) => {
    const from = byId.get(flow.from);
    const to = byId.get(flow.to);
    const score = Math.max(severity[from?.health ?? "missing"], severity[to?.health ?? "missing"]);
    return { ...flow, health: healthBySeverity[score] };
  });
}

const DELTA_HEALTH_LABEL: Record<OfficeMapNode["health"], string> = {
  ok: "정상",
  partial: "부분 연결",
  missing: "미연결",
  error: "오류",
};

const AUTOMATION_TIMING_BUCKETS: Record<OfficeAutomationTimingBucketId, OfficeAutomationTimingBucket> = {
  overdue: { id: "overdue", label: "기한 지남", tone: "warning" },
  under15m: { id: "under15m", label: "<15m", tone: "warning" },
  under1h: { id: "under1h", label: "<1h", tone: "warning" },
  today: { id: "today", label: "오늘", tone: "neutral" },
  later: { id: "later", label: "나중", tone: "neutral" },
  unknown: { id: "unknown", label: "알 수 없음", tone: "neutral" },
};

const AUTOMATION_TIMING_PRIORITY: OfficeAutomationTimingBucketId[] = ["overdue", "under15m", "under1h", "today", "later", "unknown"];

export const OFFICE_LIVE_TRACKING_BASE_INTERVAL_MS = 30_000;

function nowMs(now: Date | string | number = Date.now()): number {
  if (typeof now === "number") return now;
  if (now instanceof Date) return now.getTime();
  return new Date(now).getTime();
}

function automationTimingBucket(nextRunAt: unknown, now: number): OfficeAutomationTimingBucketId {
  if (typeof nextRunAt !== "string" || nextRunAt.length === 0) return "unknown";
  const runAt = new Date(nextRunAt).getTime();
  if (Number.isNaN(runAt) || Number.isNaN(now)) return "unknown";
  const deltaMs = runAt - now;
  if (deltaMs < 0) return "overdue";
  if (deltaMs < 15 * 60 * 1000) return "under15m";
  if (deltaMs < 60 * 60 * 1000) return "under1h";
  const runDate = new Date(runAt);
  const nowDate = new Date(now);
  if (runDate.getUTCFullYear() === nowDate.getUTCFullYear() && runDate.getUTCMonth() === nowDate.getUTCMonth() && runDate.getUTCDate() === nowDate.getUTCDate()) return "today";
  return "later";
}

export function buildOfficeAutomationTimingSummary(state: OfficeState, now: Date | string | number = Date.now()): OfficeAutomationTimingSummary {
  const referenceTime = nowMs(now);
  const counts: Record<OfficeAutomationTimingBucketId, number> = { overdue: 0, under15m: 0, under1h: 0, today: 0, later: 0, unknown: 0 };
  for (const automation of state.automations) {
    counts[automationTimingBucket(automation.next_run_at, referenceTime)] += 1;
  }
  const primaryId = AUTOMATION_TIMING_PRIORITY.find((bucket) => counts[bucket] > 0) ?? "unknown";
  return { counts, primaryBucket: AUTOMATION_TIMING_BUCKETS[primaryId] };
}

function timingBucketTone(previous: OfficeAutomationTimingBucketId, next: OfficeAutomationTimingBucketId): OfficeDeltaBadge["tone"] {
  const urgency: Record<OfficeAutomationTimingBucketId, number> = { overdue: 5, under15m: 4, under1h: 3, today: 2, later: 1, unknown: 0 };
  if (urgency[next] > urgency[previous]) return "warning";
  if (urgency[next] < urgency[previous]) return "positive";
  return "neutral";
}

export function resolveOfficeLiveTrackingInterval({ isVisible, consecutiveFailures }: { isVisible: boolean; consecutiveFailures: number }): number {
  const visibilityDelay = isVisible ? OFFICE_LIVE_TRACKING_BASE_INTERVAL_MS : 60_000;
  const failureDelay = consecutiveFailures >= 2 ? 120_000 : consecutiveFailures === 1 ? 60_000 : OFFICE_LIVE_TRACKING_BASE_INTERVAL_MS;
  return Math.max(visibilityDelay, failureDelay);
}

function deltaTone(value: number): OfficeDeltaBadge["tone"] {
  if (value > 0) return "positive";
  if (value < 0) return "negative";
  return "neutral";
}

function healthChangeTone(previous: OfficeMapNode["health"], next: OfficeMapNode["health"]): OfficeDeltaBadge["tone"] {
  const severity: Record<OfficeMapNode["health"], number> = { ok: 0, missing: 1, partial: 2, error: 3 };
  if (severity[next] < severity[previous]) return "positive";
  if (severity[next] > severity[previous]) return "warning";
  return "neutral";
}

function flowEndpointTone(previousNodes: OfficeMapNode[], nextNodes: OfficeMapNode[]): OfficeDeltaBadge["tone"] {
  const previousSeverityTotal = previousNodes.reduce((total, node) => total + ({ ok: 0, missing: 1, partial: 2, error: 3 }[node.health]), 0);
  const nextSeverityTotal = nextNodes.reduce((total, node) => total + ({ ok: 0, missing: 1, partial: 2, error: 3 }[node.health]), 0);
  if (nextSeverityTotal < previousSeverityTotal) return "positive";
  if (nextSeverityTotal > previousSeverityTotal) return "warning";
  return "neutral";
}

function flowChanged(previousFlow: OfficeMapFlow, nextFlow: OfficeMapFlow, previousEndpoints: OfficeMapNode[], nextEndpoints: OfficeMapNode[]): boolean {
  return (
    previousFlow.health !== nextFlow.health ||
    previousEndpoints.some((node, index) => node.health !== nextEndpoints[index]?.health || node.count !== nextEndpoints[index]?.count)
  );
}

export function buildOfficeStateDelta(
  previous: OfficeState | null | undefined,
  next: OfficeState,
  options: { now?: Date | string | number } = {},
): OfficeStateDelta {
  const nodeBadges: Record<OfficeMapNode["id"], OfficeDeltaBadge[]> = {
    sessions: [],
    work: [],
    automation: [],
    routing: [],
  };
  const recentChanges: OfficeRecentChange[] = [];
  const changedFlows: OfficeFlowChange[] = [];
  if (!previous) {
    return { hasChanges: false, nodeBadges, changedFlows, recentChanges };
  }

  const previousNodes = buildOfficeMapNodes(previous);
  const nextNodes = buildOfficeMapNodes(next);
  const previousById = new Map(previousNodes.map((node) => [node.id, node]));
  const nextById = new Map(nextNodes.map((node) => [node.id, node]));
  const previousFlows = buildOfficeMapFlows(previousNodes);
  const nextFlows = buildOfficeMapFlows(nextNodes);
  const previousFlowById = new Map(previousFlows.map((flow) => [`${flow.from}->${flow.to}`, flow]));
  const previousAttentionCount = buildOfficeAttentionItems(previous).length;
  const nextAttentionCount = buildOfficeAttentionItems(next).length;
  const previousAutomationTiming = buildOfficeAutomationTimingSummary(previous, options.now);
  const nextAutomationTiming = buildOfficeAutomationTimingSummary(next, options.now);

  for (const node of nextNodes) {
    const before = previousById.get(node.id);
    if (!before) continue;
    const countDelta = node.count - before.count;
    if (countDelta !== 0) {
      const label = `${countDelta > 0 ? "+" : ""}${countDelta}`;
      const tone = deltaTone(countDelta);
      nodeBadges[node.id].push({ label, tone });
      recentChanges.push({
        id: `${node.id}:count:${before.count}->${node.count}`,
        label: `${node.label} ${label}`,
        detail: `안전 개수 ${before.count} → ${node.count}`,
        tone,
      });
    }
    if (node.health !== before.health) {
      const tone = healthChangeTone(before.health, node.health);
      nodeBadges[node.id].push({ label: "상태 변경", tone });
      recentChanges.push({
        id: `${node.id}:health:${before.health}->${node.health}`,
        label: `${node.label} 상태 ${DELTA_HEALTH_LABEL[before.health]} → ${DELTA_HEALTH_LABEL[node.health]}`,
        detail: `${node.detail} · 상태만 비교`,
        tone,
      });
    }
  }

  for (const flow of nextFlows) {
    const before = previousFlowById.get(`${flow.from}->${flow.to}`);
    const previousFrom = previousById.get(flow.from);
    const previousTo = previousById.get(flow.to);
    const nextFrom = nextById.get(flow.from);
    const nextTo = nextById.get(flow.to);
    if (!before || !previousFrom || !previousTo || !nextFrom || !nextTo) continue;
    const previousEndpoints = [previousFrom, previousTo];
    const nextEndpoints = [nextFrom, nextTo];
    if (!flowChanged(before, flow, previousEndpoints, nextEndpoints)) continue;
    const tone = before.health !== flow.health ? healthChangeTone(before.health, flow.health) : flowEndpointTone(previousEndpoints, nextEndpoints);
    changedFlows.push({ from: flow.from, to: flow.to, label: flow.label, tone });
    recentChanges.push({
      id: `flow:${flow.from}->${flow.to}:${before.health}->${flow.health}:${previousFrom.count},${previousTo.count}->${nextFrom.count},${nextTo.count}`,
      label: `흐름 ${flow.label} 변경`,
      detail: `흐름 상태 ${DELTA_HEALTH_LABEL[before.health]} → ${DELTA_HEALTH_LABEL[flow.health]} · endpoint 개수/상태만 비교`,
      tone,
    });
  }

  if (previousAutomationTiming.primaryBucket.id !== nextAutomationTiming.primaryBucket.id) {
    const tone = timingBucketTone(previousAutomationTiming.primaryBucket.id, nextAutomationTiming.primaryBucket.id);
    nodeBadges.automation.push({ label: "일정 변경", tone });
    recentChanges.push({
      id: `automation:next-run-bucket:${previousAutomationTiming.primaryBucket.id}->${nextAutomationTiming.primaryBucket.id}`,
      label: `자동화 다음 실행 ${previousAutomationTiming.primaryBucket.label} → ${nextAutomationTiming.primaryBucket.label}`,
      detail: "next_run_at 시간대만 비교 · 프롬프트/스크립트 제외",
      tone,
    });
  }

  if (previousAttentionCount !== nextAttentionCount) {
    recentChanges.push({
      id: `attention:${previousAttentionCount}->${nextAttentionCount}`,
      label: `확인 필요 ${previousAttentionCount} → ${nextAttentionCount}`,
      detail: "막힌 작업, 실패한 자동화, 소스 경고 개수 변화",
      tone: deltaTone(nextAttentionCount - previousAttentionCount),
    });
  }

  return { hasChanges: recentChanges.length > 0, nodeBadges, changedFlows, recentChanges };
}

export function mergeOfficeRecentChanges(incoming: OfficeRecentChange[], current: OfficeRecentChange[], limit: number): OfficeRecentChange[] {
  const merged: OfficeRecentChange[] = [];
  const seen = new Set<string>();
  for (const change of [...incoming, ...current]) {
    if (seen.has(change.id)) continue;
    seen.add(change.id);
    merged.push(change);
    if (merged.length >= limit) break;
  }
  return merged;
}

const SCENE_OBJECT_LIMIT = 6;

const SCENE_SLOTS: Record<OfficeMapNode["id"], Array<[number, number]>> = {
  sessions: [[17, 22], [24, 22], [31, 22], [17, 34], [24, 34], [31, 34]],
  work: [[63, 21], [70, 21], [77, 21], [63, 34], [70, 34], [77, 34]],
  automation: [[17, 58], [24, 58], [31, 58], [17, 68], [24, 68], [31, 68]],
  routing: [[63, 58], [70, 58], [77, 58], [63, 68], [70, 68], [77, 68]],
};

const SCENE_ROOM_CONFIG: Record<OfficeMapNode["id"], { kind: OfficeSceneObject["kind"]; singular: string; plural: string; emptyLabel?: string; emptyDetail?: string }> = {
  sessions: { kind: "avatar", singular: "세션 표시", plural: "세션" },
  work: { kind: "desk", singular: "작업 책상", plural: "작업" },
  automation: { kind: "machine", singular: "자동화 기계", plural: "자동화" },
  routing: { kind: "mail", singular: "라우팅 우편", plural: "경로", emptyLabel: "미연결 보관함", emptyDetail: "토픽/출처 공백을 명시" },
};

const CHARACTER_LIMIT_PER_ROLE = 3;

const CHARACTER_ACTIVITY_LABEL: Record<OfficeCharacterActivityId, string> = {
  thinking: "생각 중",
  working: "작업 중",
  reviewing: "검토 중",
  routing: "전달 중",
  scheduled: "예약 대기",
  soon: "곧 실행",
  blocked: "막힘",
  warning: "확인 필요",
  idle: "대기",
  unknown: "확인 불가",
};

const CHARACTER_ACTIVITY_STYLE: Record<OfficeCharacterActivityId, Pick<OfficeCharacterActivity, "motion" | "tone">> = {
  thinking: { motion: "idle", tone: "normal" },
  working: { motion: "pulse", tone: "success" },
  reviewing: { motion: "idle", tone: "success" },
  routing: { motion: "walk", tone: "normal" },
  scheduled: { motion: "idle", tone: "muted" },
  soon: { motion: "blink", tone: "warning" },
  blocked: { motion: "blink", tone: "danger" },
  warning: { motion: "blink", tone: "warning" },
  idle: { motion: "none", tone: "muted" },
  unknown: { motion: "none", tone: "muted" },
};

const CHARACTER_ROLE_LABEL: Record<OfficeCharacterRole, string> = {
  model: "모델 캐릭터",
  operator: "조작자",
  worker: "작업자",
  reviewer: "검토자",
  automation_keeper: "자동화 관리인",
  router: "전달자",
  sentinel: "감시자",
  alert: "경보 담당",
};

const CHARACTER_ROLE_NAMEPLATE: Record<OfficeCharacterRole, string> = {
  model: "모델",
  operator: "조작",
  worker: "작업",
  reviewer: "검토",
  automation_keeper: "자동화",
  router: "전달",
  sentinel: "감시",
  alert: "경보",
};

const CHARACTER_ROLE_GLYPH: Record<OfficeCharacterRole, string> = {
  model: "◇",
  operator: "◆",
  worker: "▤",
  reviewer: "◎",
  automation_keeper: "▣",
  router: "✉",
  sentinel: "◈",
  alert: "!",
};

const CHARACTER_STATUS_LABEL: Record<OfficeCharacterStatus, string> = {
  active: "활성",
  idle: "대기",
  working: "활성",
  reviewing: "검토",
  routing: "전달",
  scheduled: "예약",
  blocked: "막힘",
  warning: "주의",
  error: "오류",
  unknown: "미확인",
};

const CHARACTER_ROOM_LABEL: Record<OfficeMapNode["id"], string> = {
  sessions: "세션",
  work: "작업",
  automation: "자동화",
  routing: "라우팅",
};

const CHARACTER_ROLE_ROOM: Record<OfficeCharacterRole, OfficeMapNode["id"]> = {
  model: "sessions",
  operator: "sessions",
  worker: "work",
  reviewer: "work",
  automation_keeper: "automation",
  router: "routing",
  sentinel: "routing",
  alert: "work",
};

const CHARACTER_ROLE_KIND: Record<OfficeCharacterRole, OfficeSceneObject["kind"]> = {
  model: "avatar",
  operator: "avatar",
  worker: "desk",
  reviewer: "desk",
  automation_keeper: "machine",
  router: "mail",
  sentinel: "machine",
  alert: "alert",
};

function officeCharacterHealth(status: OfficeCharacterStatus): OfficeMapNode["health"] {
  if (status === "error" || status === "blocked") return "error";
  if (status === "warning" || status === "unknown") return "partial";
  return "ok";
}

function characterStatusFromText(value: unknown): OfficeCharacterStatus {
  const text = typeof value === "string" ? value.toLowerCase() : "";
  if (text.includes("block")) return "blocked";
  if (text.includes("error") || text.includes("fail")) return "error";
  if (text.includes("idle") || text.includes("done")) return "idle";
  if (text.includes("review")) return "reviewing";
  if (text.includes("sched")) return "scheduled";
  if (text.includes("active") || text.includes("run") || text.includes("open") || text.includes("progress")) return "active";
  return "unknown";
}

function characterDetail(room: OfficeMapNode | undefined, status: OfficeCharacterStatus): string {
  const roomLabel = room?.label ?? "미확인 방";
  return `${roomLabel} 역할 투영 · 상태 ${status}`;
}

function addCharacters(
  characters: OfficeCharacter[],
  role: OfficeCharacterRole,
  count: number,
  statusForIndex: (index: number) => OfficeCharacterStatus,
  nodesById: Map<OfficeMapNode["id"], OfficeMapNode>,
) {
  if (count <= 0) return;
  const roomId = CHARACTER_ROLE_ROOM[role];
  const room = nodesById.get(roomId);
  const slots = SCENE_SLOTS[roomId];
  const visible = Math.min(count, CHARACTER_LIMIT_PER_ROLE);
  for (let index = 0; index < visible; index += 1) {
    const [x, y] = slots[index];
    const status = statusForIndex(index);
    characters.push({
      id: `${role}-${index + 1}`,
      role,
      roomId,
      label: `${CHARACTER_ROLE_LABEL[role]} ${index + 1}`,
      status,
      detail: characterDetail(room, status),
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x,
      y,
    });
  }
  if (count > CHARACTER_LIMIT_PER_ROLE) {
    const status: OfficeCharacterStatus = "warning";
    characters.push({
      id: `${role}-overflow`,
      role,
      roomId,
      label: `+${count - CHARACTER_LIMIT_PER_ROLE} ${CHARACTER_ROLE_LABEL[role]}`,
      status,
      detail: `${room?.label ?? "방"} 밀도 초과 역할 개수`,
      redactionNote: "지도 밀도 때문에 합산한 안전 개수 · 원문 제외",
      x: Math.min((room?.x ?? 78) + 12, 90),
      y: Math.min((room?.y ?? 68) + 11, 88),
    });
  }
}

export function buildOfficeCharacterView(character: OfficeCharacter): OfficeCharacterView {
  return {
    glyph: CHARACTER_ROLE_GLYPH[character.role],
    bodyClassName: `office-character office-character--${character.role} office-character--${character.status}`,
    accessoryClassName: `office-character__accessory office-character__accessory--${character.role}`,
    nameplate: CHARACTER_ROLE_NAMEPLATE[character.role],
    statusLabel: CHARACTER_STATUS_LABEL[character.status],
    safeTitle: `${CHARACTER_ROOM_LABEL[character.roomId]} · ${CHARACTER_ROLE_LABEL[character.role]} · ${CHARACTER_STATUS_LABEL[character.status]} · 안전 DTO 기반 · 원문 제외`,
  };
}

function characterRoomHasDelta(character: OfficeCharacter, delta: OfficeStateDelta): boolean {
  return delta.nodeBadges[character.roomId]?.length > 0 || delta.changedFlows.some((flow) => flow.from === character.roomId || flow.to === character.roomId);
}

function characterActivityId(character: OfficeCharacter, delta: OfficeStateDelta): OfficeCharacterActivityId {
  if (character.status === "blocked" || character.status === "error" || character.role === "alert") return "blocked";
  if (character.status === "warning") return "warning";
  if (character.status === "unknown") return "unknown";
  if (character.status === "idle") return "idle";
  if (character.role === "automation_keeper" && characterRoomHasDelta(character, delta)) return "soon";
  if (character.status === "scheduled" || character.role === "automation_keeper") return "scheduled";
  if (character.status === "reviewing" || character.role === "reviewer") return "reviewing";
  if (character.status === "routing" || character.role === "router") return "routing";
  if (character.status === "working" || character.role === "worker") return "working";
  if (character.status === "active" && (character.role === "model" || character.role === "operator")) return "thinking";
  return "idle";
}

export function buildOfficeCharacterActivity(character: OfficeCharacter, delta: OfficeStateDelta): OfficeCharacterActivity {
  const id = characterActivityId(character, delta);
  const style = CHARACTER_ACTIVITY_STYLE[id];
  const label = CHARACTER_ACTIVITY_LABEL[id];
  return {
    id,
    label,
    motion: style.motion,
    tone: style.tone,
    reducedMotionLabel: `${label} · 안전 상태/변화만 반영`,
  };
}

function routeTone(tone: OfficeFlowChange["tone"]): OfficeCharacterRoute["tone"] {
  if (tone === "negative") return "danger";
  if (tone === "warning") return "warning";
  return "normal";
}

function routeDetail(from: OfficeMapNode["id"], to: OfficeMapNode["id"]): string {
  if (from === "sessions" && to === "work") return "세션에서 작업으로 · 방금 변경";
  if (from === "work" && to === "automation") return "작업에서 자동화로 · 방금 변경";
  if (from === "automation" && to === "routing") return "자동화에서 라우팅으로 · 방금 변경";
  return `${CHARACTER_ROOM_LABEL[from]}에서 ${CHARACTER_ROOM_LABEL[to]}로 · 방금 변경`;
}

export function buildOfficeCharacterRoutes(delta: OfficeStateDelta): OfficeCharacterRoute[] {
  return delta.changedFlows.map((flow) => {
    const detail = routeDetail(flow.from, flow.to);
    const tone = routeTone(flow.tone);
    return {
      id: `route:${flow.from}->${flow.to}`,
      fromRoomId: flow.from,
      toRoomId: flow.to,
      label: "흐름 변경",
      detail,
      tone,
      motion: tone === "normal" ? "route" : "alert",
      changed: true,
      reducedMotionLabel: `${detail} · 애니메이션 없이 표시`,
    };
  });
}

function characterRecentChangeLabel(character: OfficeCharacter, delta: OfficeStateDelta): string {
  const badges = delta.nodeBadges[character.roomId] ?? [];
  const badgeText = badges.map((badge) => badge.label);
  const flowText = delta.changedFlows
    .filter((flow) => flow.from === character.roomId || flow.to === character.roomId)
    .map((flow) => routeDetail(flow.from, flow.to));
  const changes = [...badgeText, ...flowText];
  return changes.length > 0 ? changes.join(" · ") : "최근 안전 변화 없음";
}

export function buildOfficeCharacterInspector(character: OfficeCharacter, delta: OfficeStateDelta): OfficeCharacterInspector {
  const view = buildOfficeCharacterView(character);
  const activity = buildOfficeCharacterActivity(character, delta);
  const roleLabel = CHARACTER_ROLE_LABEL[character.role];
  const roomLabel = CHARACTER_ROOM_LABEL[character.roomId];
  const statusLabel = CHARACTER_STATUS_LABEL[character.status];
  return {
    kind: "RPG 캐릭터",
    title: `${roomLabel} · ${roleLabel}`,
    ariaLabel: `${roleLabel} 살펴보기, 방 ${roomLabel}, 상태 ${statusLabel}, 액션 ${activity.label}`,
    fields: [
      ["캐릭터", roleLabel],
      ["역할", view.nameplate],
      ["방", roomLabel],
      ["상태", statusLabel],
      ["액션", activity.label],
      ["최근 안전 변화", characterRecentChangeLabel(character, delta)],
      ["가림", "안전 DTO 역할/상태/개수/흐름만 반영 · 원문 제외"],
    ],
  };
}

function trackingLabelForRoom(roomId: OfficeMapNode["id"]): string {
  if (roomId === "sessions") return "세션 순찰";
  if (roomId === "work") return "작업 추적";
  if (roomId === "automation") return "자동화 감시";
  return "라우팅 확인";
}

function trackingRoomHasDelta(character: OfficeCharacter, delta: OfficeStateDelta): boolean {
  return delta.nodeBadges[character.roomId]?.length > 0 || delta.changedFlows.some((flow) => flow.from === character.roomId || flow.to === character.roomId);
}

function trackingTone(character: OfficeCharacter, hasDelta: boolean): OfficeCharacterTrackingCue["tone"] {
  if (hasDelta) return "alert";
  if (character.status === "warning" || character.status === "error" || character.status === "blocked" || character.status === "unknown") return "warning";
  return "steady";
}

export function buildOfficeCharacterTrackingCues(characters: OfficeCharacter[], delta: OfficeStateDelta): OfficeCharacterTrackingCue[] {
  return characters.map((character, index) => {
    const hasDelta = trackingRoomHasDelta(character, delta);
    const label = hasDelta ? "변화 감지" : trackingLabelForRoom(character.roomId);
    const tone = trackingTone(character, hasDelta);
    const roomLabel = CHARACTER_ROOM_LABEL[character.roomId];
    const roleLabel = CHARACTER_ROLE_LABEL[character.role];
    const offsetSeed = (index % 3) - 1;
    return {
      characterId: character.id,
      label,
      detail: `${roomLabel} · ${roleLabel} · 안전 추적 큐`,
      tone,
      style: {
        "--office-tracking-x": `${offsetSeed * 2}px`,
        "--office-tracking-y": `${((index + 1) % 3 - 1) * 2}px`,
        "--office-tracking-duration": `${5 + (index % 4)}s`,
        "--office-tracking-delay": `${-1 * (index % 5)}s`,
      },
      reducedMotionLabel: `${label} · 텍스트 rail로 의미 유지`,
      ariaHidden: true,
      interactive: false,
    };
  });
}

function roomTouchedByDelta(roomId: OfficeMapNode["id"], delta: OfficeStateDelta): boolean {
  return delta.nodeBadges[roomId]?.length > 0 || delta.changedFlows.some((flow) => flow.from === roomId || flow.to === roomId);
}

function roomActivityLevel(node: OfficeMapNode, characterCount: number, changed: boolean): OfficeRoomActivityLevel {
  if (changed) return "changed";
  if (node.count >= 5 || characterCount >= 2) return "busy";
  if (node.count > 0 || characterCount > 0) return "active";
  return "quiet";
}

const ROOM_ACTIVITY_LABEL: Record<OfficeRoomActivityLevel, string> = {
  quiet: "조용함",
  active: "활동",
  busy: "분주함",
  changed: "변화 감지",
};

export function buildOfficeRoomActivityMeters(nodes: OfficeMapNode[], characters: OfficeCharacter[], delta: OfficeStateDelta): OfficeRoomActivityMeter[] {
  return nodes.map((node) => {
    const characterCount = characters.filter((character) => character.roomId === node.id).length;
    const changed = roomTouchedByDelta(node.id, delta);
    const level = roomActivityLevel(node, characterCount, changed);
    const percent = level === "changed" ? 100 : Math.min(100, Math.max(12, node.count * 12 + characterCount * 18));
    return {
      roomId: node.id,
      label: ROOM_ACTIVITY_LABEL[level],
      detail: `${node.label} · 안전 항목 ${node.count}개 · 캐릭터 ${characterCount}개`,
      level,
      percent,
      reducedMotionLabel: `${ROOM_ACTIVITY_LABEL[level]} · 방 활동 rail로 의미 유지`,
      ariaHidden: true,
      interactive: false,
    };
  });
}

const PULSE_TONE_LABEL: Record<OfficeDeltaBadge["tone"], string> = {
  positive: "증가",
  negative: "감소",
  warning: "확인",
  neutral: "변화",
};

function pulseToneClass(tone: OfficeDeltaBadge["tone"]): OfficeDeltaBadge["tone"] {
  return tone;
}

export function buildOfficeSafePulseTimeline(delta: OfficeStateDelta): OfficeSafePulseTimeline {
  const items: OfficeSafePulseTimelineItem[] = [];
  (Object.entries(delta.nodeBadges) as Array<[OfficeMapNode["id"], OfficeDeltaBadge[]]>).forEach(([roomId, badges]) => {
    badges.slice(0, 1).forEach((badge) => {
      items.push({
        id: `room-${roomId}-${items.length}`,
        kind: "room",
        label: `${CHARACTER_ROOM_LABEL[roomId]} 변화`,
        detail: `${CHARACTER_ROOM_LABEL[roomId]} 방 안전 badge · ${PULSE_TONE_LABEL[badge.tone]}`,
        tone: pulseToneClass(badge.tone),
        reducedMotionLabel: "timeline rail 텍스트로 변화 순서 유지",
        ariaHidden: true,
        interactive: false,
      });
    });
  });

  delta.changedFlows.slice(0, 2).forEach((flow) => {
    items.push({
      id: `flow-${flow.from}-${flow.to}-${items.length}`,
      kind: "flow",
      label: `${CHARACTER_ROOM_LABEL[flow.from]} → ${CHARACTER_ROOM_LABEL[flow.to]}`,
      detail: `${CHARACTER_ROOM_LABEL[flow.from]}에서 ${CHARACTER_ROOM_LABEL[flow.to]}로 안전 흐름 변화`,
      tone: pulseToneClass(flow.tone),
      reducedMotionLabel: "timeline rail 텍스트로 흐름 변화 유지",
      ariaHidden: true,
      interactive: false,
    });
  });

  delta.recentChanges.slice(0, 3).forEach((change, index) => {
    items.push({
      id: `recent-${change.id || index}`,
      kind: "recent",
      label: `최근 안전 변화 ${index + 1}`,
      detail: `${PULSE_TONE_LABEL[change.tone]} · 브라우저 메모리 안전 delta`,
      tone: pulseToneClass(change.tone),
      reducedMotionLabel: "최근 변화 rail 텍스트로 의미 유지",
      ariaHidden: true,
      interactive: false,
    });
  });

  if (items.length === 0) {
    items.push({
      id: "idle-no-delta",
      kind: "idle",
      label: "대기",
      detail: "아직 비교할 안전 변화가 없습니다",
      tone: "neutral",
      reducedMotionLabel: "변화 없음 상태를 텍스트로 유지",
      ariaHidden: true,
      interactive: false,
    });
  }

  return {
    stageLabel: "Stage 14-C 안전 pulse timeline",
    detail: "방 badge, 흐름, 최근 변화 rail을 원문 없이 시간감 있는 pulse로 요약",
    items: items.slice(0, 6),
  };
}

export function buildOfficeSafeBreadcrumbTrail(delta: OfficeStateDelta): OfficeSafeBreadcrumbTrail {
  const firstFlow = delta.changedFlows[0];
  if (!firstFlow) {
    return {
      stageLabel: "Stage 14-D 안전 breadcrumb",
      detail: "아직 흐름 변화가 없어 현재 방 순서를 대기 상태로 표시",
      segments: [{ id: "breadcrumb-idle", label: "대기", detail: "안전 흐름 변화 없음", tone: "neutral", ariaHidden: true, interactive: false }],
    };
  }

  const roomOrder: OfficeMapNode["id"][] = [firstFlow.from, firstFlow.to];
  const toneByRoom = new Map<OfficeMapNode["id"], OfficeDeltaBadge["tone"]>([
    [firstFlow.from, firstFlow.tone],
    [firstFlow.to, firstFlow.tone],
  ]);
  delta.changedFlows.slice(1, 4).forEach((flow) => {
    if (!roomOrder.includes(flow.from)) roomOrder.push(flow.from);
    if (!roomOrder.includes(flow.to)) roomOrder.push(flow.to);
    toneByRoom.set(flow.from, flow.tone);
    toneByRoom.set(flow.to, flow.tone);
  });

  return {
    stageLabel: "Stage 14-D 안전 breadcrumb",
    detail: "최근 안전 흐름 변화의 방 이동 순서를 원문 없이 요약",
    segments: roomOrder.slice(0, 5).map((roomId, index, rooms) => ({
      id: `breadcrumb-${roomId}-${index}`,
      label: CHARACTER_ROOM_LABEL[roomId],
      detail: `${index === 0 ? "출발" : index === rooms.length - 1 ? "도착" : "경유"} 방 · 안전 흐름 변화`,
      tone: toneByRoom.get(roomId) ?? "neutral",
      ariaHidden: true,
      interactive: false,
    })),
  };
}

function routeCompassTone(delta: OfficeStateDelta): OfficeDeltaBadge["tone"] {
  const tones = [
    ...Object.values(delta.nodeBadges).flat().map((badge) => badge.tone),
    ...delta.changedFlows.map((flow) => flow.tone),
    ...delta.recentChanges.map((change) => change.tone),
  ];
  if (tones.includes("negative")) return "negative";
  if (tones.includes("warning")) return "warning";
  if (tones.includes("positive")) return "positive";
  return "neutral";
}

const ROUTE_COMPASS_HEADING: Record<OfficeDeltaBadge["tone"], string> = {
  positive: "정상 이동",
  negative: "주의 집중",
  warning: "흐름 확인",
  neutral: "대기",
};

export function buildOfficeSafeRouteCompass(delta: OfficeStateDelta): OfficeSafeRouteCompass {
  const trail = buildOfficeSafeBreadcrumbTrail(delta);
  const tone = routeCompassTone(delta);
  const activeSegments = trail.segments.filter((segment) => segment.id !== "breadcrumb-idle");
  const fromLabel = activeSegments[0]?.label ?? "대기";
  const toLabel = activeSegments[activeSegments.length - 1]?.label ?? fromLabel;
  const changeCount = Object.values(delta.nodeBadges).reduce((total, badges) => total + badges.length, 0) + delta.changedFlows.length + delta.recentChanges.length;
  const roomCount = activeSegments.length;

  return {
    stageLabel: "Stage 14-E 안전 route compass",
    heading: ROUTE_COMPASS_HEADING[tone],
    detail: "방 활동, pulse, breadcrumb를 안전 delta 기준의 짧은 방향계로 요약",
    tone,
    points: [
      { id: "direction", label: "방향", detail: `${fromLabel} → ${toLabel}`, tone, ariaHidden: true, interactive: false },
      { id: "signal", label: "신호", detail: `${PULSE_TONE_LABEL[tone]} 우선`, tone, ariaHidden: true, interactive: false },
      { id: "summary", label: "요약", detail: `안전 변화 ${changeCount}개 · 방 ${roomCount}개`, tone: "neutral", ariaHidden: true, interactive: false },
    ],
  };
}

const FOCUS_LANE_TONE_LABEL: Record<OfficeDeltaBadge["tone"], string> = {
  positive: "정상",
  negative: "주의",
  warning: "확인",
  neutral: "대기",
};

const FOCUS_LANE_TONE_RANK: Record<OfficeDeltaBadge["tone"], number> = {
  negative: 0,
  warning: 1,
  positive: 2,
  neutral: 3,
};

function focusLaneTone(roomBadges: OfficeDeltaBadge[], roomFlows: OfficeFlowChange[]): OfficeDeltaBadge["tone"] {
  if (roomBadges.length > 0) {
    const badgeTones = roomBadges.map((badge) => badge.tone);
    if (badgeTones.includes("negative")) return "negative";
    if (badgeTones.includes("warning")) return "warning";
    if (badgeTones.includes("positive")) return "positive";
    return "neutral";
  }
  const flowTones = roomFlows.map((flow) => flow.tone);
  if (flowTones.includes("negative")) return "negative";
  if (flowTones.includes("warning")) return "warning";
  if (flowTones.includes("positive")) return "positive";
  return "neutral";
}

export function buildOfficeSafeFocusLane(delta: OfficeStateDelta): OfficeSafeFocusLane {
  const roomOrder: OfficeMapNode["id"][] = ["sessions", "work", "automation", "routing"];
  const items = roomOrder.map((roomId) => {
    const roomBadges = delta.nodeBadges[roomId] ?? [];
    const roomFlows = delta.changedFlows.filter((flow) => flow.from === roomId || flow.to === roomId);
    const tone = focusLaneTone(roomBadges, roomFlows);
    const attentionBonus = tone === "negative" ? 1 : 0;
    const safeChangeCount = roomBadges.length + attentionBonus;
    const weight = safeChangeCount + roomFlows.length;
    return {
      roomId,
      label: CHARACTER_ROOM_LABEL[roomId],
      detail: `${FOCUS_LANE_TONE_LABEL[tone]} 변화 ${safeChangeCount}개 · 흐름 ${roomFlows.length}개`,
      tone,
      weight,
      ariaHidden: true as const,
      interactive: false as const,
    };
  });

  return {
    stageLabel: "Stage 14-F 안전 focus lane",
    detail: "방별 안전 변화 밀도를 원문 없이 정렬해 다음 시선 위치를 표시",
    items: items.sort((a, b) => b.weight - a.weight || FOCUS_LANE_TONE_RANK[a.tone] - FOCUS_LANE_TONE_RANK[b.tone] || roomOrder.indexOf(a.roomId) - roomOrder.indexOf(b.roomId)),
  };
}

const ATTENTION_STRIP_HEADING: Record<OfficeDeltaBadge["tone"], string> = {
  positive: "정상 변화",
  negative: "주의 방 우선",
  warning: "확인 흐름",
  neutral: "대기",
};

const ATTENTION_STRIP_SIGNAL: Record<OfficeDeltaBadge["tone"], string> = {
  positive: "정상 우선",
  negative: "주의 우선",
  warning: "확인 우선",
  neutral: "대기 우선",
};

export function buildOfficeSafeAttentionStrip(delta: OfficeStateDelta): OfficeSafeAttentionStrip {
  const lane = buildOfficeSafeFocusLane(delta);
  const compass = buildOfficeSafeRouteCompass(delta);
  const topItem = lane.items[0];
  const totalWeight = lane.items.reduce((total, item) => total + item.weight, 0);
  const activeRoomCount = lane.items.filter((item) => item.weight > 0).length;
  const tone = topItem && topItem.weight > 0 ? topItem.tone : compass.tone;
  const focusDetail = topItem && topItem.weight > 0 ? `${topItem.label} · 밀도 ${topItem.weight}` : "대기 · 밀도 0";

  return {
    stageLabel: "Stage 14-G 안전 attention strip",
    heading: ATTENTION_STRIP_HEADING[tone],
    detail: "focus lane과 route compass의 안전 집계를 상단 한 줄 신호로 압축",
    tone,
    chips: [
      { id: "focus", label: "초점", detail: focusDetail, tone, ariaHidden: true, interactive: false },
      { id: "signal", label: "신호", detail: ATTENTION_STRIP_SIGNAL[tone], tone, ariaHidden: true, interactive: false },
      { id: "scope", label: "범위", detail: `방 ${activeRoomCount}개 · 밀도 ${totalWeight}`, tone: "neutral", ariaHidden: true, interactive: false },
    ],
  };
}

const ROOM_BEACON_POSITION: Record<OfficeMapNode["id"], { x: number; y: number }> = {
  sessions: { x: 24, y: 30 },
  work: { x: 70, y: 30 },
  automation: { x: 24, y: 67 },
  routing: { x: 70, y: 67 },
};

function roomBeaconIntensity(weight: number): OfficeSafeRoomBeaconIntensity {
  if (weight >= 4) return "high";
  if (weight >= 2) return "medium";
  if (weight > 0) return "low";
  return "idle";
}

export function buildOfficeSafeRoomBeacons(delta: OfficeStateDelta): OfficeSafeRoomBeacons {
  const lane = buildOfficeSafeFocusLane(delta);
  return {
    stageLabel: "Stage 14-H 안전 room beacons",
    detail: "focus lane의 안전 밀도를 맵 위 방별 비콘으로 표시",
    beacons: lane.items.map((item) => {
      const position = ROOM_BEACON_POSITION[item.roomId];
      return {
        roomId: item.roomId,
        label: `${item.label} beacon`,
        detail: `${FOCUS_LANE_TONE_LABEL[item.tone]} · 밀도 ${item.weight} · 맵 표시`,
        tone: item.tone,
        intensity: roomBeaconIntensity(item.weight),
        weight: item.weight,
        x: position.x,
        y: position.y,
        reducedMotionLabel: `${item.label} 방 비콘 · 텍스트 rail로 밀도 유지`,
        ariaHidden: true,
        interactive: false,
      };
    }),
  };
}

function flowPulseIntensity(tone: OfficeDeltaBadge["tone"], index: number): OfficeSafeRoomBeaconIntensity {
  if (tone === "negative" || tone === "warning" || index > 0) return "high";
  return "medium";
}

export function buildOfficeSafeFlowPulseBands(delta: OfficeStateDelta): OfficeSafeFlowPulseBands {
  return {
    stageLabel: "Stage 14-I 안전 flow pulse bands",
    detail: "changedFlows의 안전 방 ID만 맵 위 흐름 pulse band로 표시",
    bands: delta.changedFlows.map((flow, index) => {
      const from = ROOM_BEACON_POSITION[flow.from];
      const to = ROOM_BEACON_POSITION[flow.to];
      return {
        id: `${flow.from}-to-${flow.to}`,
        label: `${CHARACTER_ROOM_LABEL[flow.from]} → ${CHARACTER_ROOM_LABEL[flow.to]} pulse`,
        detail: `${FOCUS_LANE_TONE_LABEL[flow.tone]} · 안전 흐름 ${index + 1}`,
        tone: flow.tone,
        intensity: flowPulseIntensity(flow.tone, index),
        x1: from.x,
        y1: from.y,
        x2: to.x,
        y2: to.y,
        reducedMotionLabel: `${CHARACTER_ROOM_LABEL[flow.from]}에서 ${CHARACTER_ROOM_LABEL[flow.to]}로 · 정적 흐름 rail 유지`,
        ariaHidden: true,
        interactive: false,
      };
    }),
  };
}

export function buildOfficeSafeTacticalMinimap(delta: OfficeStateDelta): OfficeSafeTacticalMinimap {
  const beacons = buildOfficeSafeRoomBeacons(delta);
  const flowBands = buildOfficeSafeFlowPulseBands(delta);
  const roomOrder: OfficeMapNode["id"][] = ["sessions", "work", "automation", "routing"];
  const beaconByRoom = new Map(beacons.beacons.map((beacon) => [beacon.roomId, beacon]));
  const activeRoomCount = beacons.beacons.filter((beacon) => beacon.weight > 0).length;

  return {
    stageLabel: "Stage 14-J 안전 tactical minimap",
    summary: `활성 방 ${activeRoomCount}개 · 흐름 ${flowBands.bands.length}개`,
    detail: "room beacons와 flow pulse bands의 안전 밀도를 작은 전술 지도 셀로 압축",
    cells: roomOrder.map((roomId) => {
      const beacon = beaconByRoom.get(roomId);
      const weight = beacon?.weight ?? 0;
      const position = ROOM_BEACON_POSITION[roomId];
      const tone = beacon?.tone ?? "neutral";
      return {
        roomId,
        label: CHARACTER_ROOM_LABEL[roomId],
        detail: `${FOCUS_LANE_TONE_LABEL[tone]} · 밀도 ${weight}`,
        tone,
        intensity: beacon?.intensity ?? "idle",
        active: weight > 0,
        weight,
        x: position.x,
        y: position.y,
        ariaHidden: true,
        interactive: false,
      };
    }),
  };
}

export function buildOfficeSafeTacticalTicker(delta: OfficeStateDelta): OfficeSafeTacticalTicker {
  const minimap = buildOfficeSafeTacticalMinimap(delta);
  const attention = buildOfficeSafeAttentionStrip(delta);
  const focusChip = attention.chips.find((chip) => chip.id === "focus");
  const activeCells = minimap.cells.filter((cell) => cell.active);
  const cellDetail = activeCells.length > 0 ? activeCells.map((cell) => `${cell.label} ${cell.weight}`).join(" · ") : "대기 0";
  const tone = focusChip?.tone ?? attention.tone;

  return {
    stageLabel: "Stage 14-K 안전 tactical ticker",
    headline: `${attention.heading} · ${minimap.summary}`,
    detail: "attention strip과 tactical minimap의 안전 신호를 하단 ticker로 압축",
    tone,
    items: [
      { id: "focus", label: "초점", detail: focusChip?.detail ?? "대기 · 밀도 0", tone, ariaHidden: true, interactive: false },
      { id: "map", label: "전술", detail: minimap.summary, tone: "neutral", ariaHidden: true, interactive: false },
      { id: "cells", label: "방", detail: cellDetail, tone, ariaHidden: true, interactive: false },
    ],
  };
}

export function buildOfficeSafeMissionClock(options: OfficeSafeMissionClockOptions): OfficeSafeMissionClock {
  const delay = resolveOfficeLiveTrackingInterval({ isVisible: options.isVisible, consecutiveFailures: options.consecutiveFailures });
  const seconds = Math.round(delay / 1000);
  const cadenceDetail = options.liveTracking ? `${seconds}초` : "수동 새로고침";
  const modeDetail = options.liveTracking ? "실시간 추적" : "수동 추적";
  const tabDetail = options.isVisible ? "표시 탭" : "숨김 탭";
  const pulseDetail = options.hasRecentChanges ? "최근 변화 있음" : "변화 대기";
  const cadenceTone: OfficeDeltaBadge["tone"] = options.consecutiveFailures > 0 || !options.isVisible ? "warning" : "neutral";
  const modeTone: OfficeDeltaBadge["tone"] = options.liveTracking ? "positive" : "neutral";
  const pulseTone: OfficeDeltaBadge["tone"] = options.hasRecentChanges ? "positive" : "neutral";

  return {
    stageLabel: "Stage 14-L 안전 mission clock",
    headline: options.liveTracking ? `실시간 · ${tabDetail} · ${seconds}초` : `수동 · ${tabDetail} · 대기`,
    detail: "브라우저 탭의 수동/실시간 추적 자세를 안전 작전 시계로 압축",
    tone: options.liveTracking ? cadenceTone : "neutral",
    items: [
      { id: "mode", label: "모드", detail: modeDetail, tone: modeTone, ariaHidden: true, interactive: false },
      { id: "cadence", label: "간격", detail: cadenceDetail, tone: cadenceTone, ariaHidden: true, interactive: false },
      { id: "safety", label: "안전", detail: "브라우저 로컬 · 읽기 전용", tone: "neutral", ariaHidden: true, interactive: false },
      { id: "pulse", label: "변화", detail: pulseDetail, tone: pulseTone, ariaHidden: true, interactive: false },
    ],
  };
}

export function buildOfficeSafeCommandDeck(state: OfficeState, delta: OfficeStateDelta, missionOptions: OfficeSafeMissionClockOptions): OfficeSafeCommandDeck {
  const missionClock = buildOfficeSafeMissionClock(missionOptions);
  const tacticalTicker = buildOfficeSafeTacticalTicker(delta);
  const sourceHealth = buildOfficeSourceHealthSummary(state);
  const tonePriority: Record<OfficeDeltaBadge["tone"], number> = { negative: 4, warning: 3, positive: 2, neutral: 1 };
  const cards: OfficeSafeCommandDeckCard[] = [
    { id: "mission", label: "작전 시계", detail: missionClock.headline, tone: missionClock.tone, ariaHidden: true, interactive: false },
    { id: "tactical", label: "전술 HUD", detail: tacticalTicker.headline, tone: tacticalTicker.tone, ariaHidden: true, interactive: false },
    { id: "sources", label: "소스", detail: sourceHealth.detail, tone: sourceHealth.tone, ariaHidden: true, interactive: false },
    { id: "safety", label: "안전", detail: "읽기 전용 · 로컬 표시 · 원문 제외", tone: "neutral", ariaHidden: true, interactive: false },
  ];

  return {
    stageLabel: "Stage 14-M 안전 command deck",
    headline: `${missionClock.headline} · ${sourceHealth.label}`,
    detail: "mission clock, tactical ticker, source health를 안전 command deck으로 압축",
    tone: cards.reduce<OfficeDeltaBadge["tone"]>((current, card) => (tonePriority[card.tone] > tonePriority[current] ? card.tone : current), "neutral"),
    cards,
  };
}

export function buildOfficeSafeFloorLegend(delta: OfficeStateDelta): OfficeSafeFloorLegend {
  const minimap = buildOfficeSafeTacticalMinimap(delta);
  const flowBands = buildOfficeSafeFlowPulseBands(delta);
  const activeCells = minimap.cells.filter((cell) => cell.active);
  const idleCells = minimap.cells.filter((cell) => !cell.active);
  const activeTone = activeCells.some((cell) => cell.tone === "negative") ? "negative" : activeCells.some((cell) => cell.tone === "warning") ? "warning" : activeCells.length > 0 ? "positive" : "neutral";
  const flowTone = flowBands.bands.some((band) => band.tone === "negative") ? "negative" : flowBands.bands.some((band) => band.tone === "warning") ? "warning" : flowBands.bands.length > 0 ? "positive" : "neutral";
  const tonePriority: Record<OfficeDeltaBadge["tone"], number> = { negative: 4, warning: 3, positive: 2, neutral: 1 };
  const items: OfficeSafeFloorLegendItem[] = [
    { id: "active", label: "활성 방", detail: activeCells.length > 0 ? activeCells.map((cell) => cell.label).join(" · ") : "없음", tone: activeTone, ariaHidden: true, interactive: false },
    { id: "idle", label: "대기 방", detail: idleCells.length > 0 ? idleCells.map((cell) => cell.label).join(" · ") : "없음", tone: "neutral", ariaHidden: true, interactive: false },
    { id: "flow", label: "흐름", detail: `안전 흐름 ${flowBands.bands.length}개`, tone: flowTone, ariaHidden: true, interactive: false },
    { id: "safety", label: "투영", detail: "집계 전용", tone: "neutral", ariaHidden: true, interactive: false },
  ];

  return {
    stageLabel: "Stage 14-N 안전 floor legend",
    summary: `활성 ${activeCells.length} · 대기 ${idleCells.length} · 흐름 ${flowBands.bands.length}`,
    detail: "tactical minimap과 flow bands를 바닥 범례로 압축",
    tone: items.reduce<OfficeDeltaBadge["tone"]>((current, item) => (tonePriority[item.tone] > tonePriority[current] ? item.tone : current), "neutral"),
    items,
  };
}

export function buildOfficeSafeStatusSnapshot(state: OfficeState, delta: OfficeStateDelta, missionOptions: OfficeSafeMissionClockOptions): OfficeSafeStatusSnapshot {
  const commandDeck = buildOfficeSafeCommandDeck(state, delta, missionOptions);
  const floorLegend = buildOfficeSafeFloorLegend(delta);
  const sourceHealth = buildOfficeSourceHealthSummary(state);
  const reportedSourceCount = state.data_sources.length;
  const usableSourceCount = state.data_sources.filter((source) => source.status === "ok").length;
  const reportedSourceAttention = state.data_sources.some((source) => source.status !== "ok" || (source.warning_count ?? 0) > 0);
  const sourceTone: OfficeDeltaBadge["tone"] = reportedSourceAttention ? "warning" : sourceHealth.tone;
  const sourceHeadline = sourceTone === "warning" ? "소스 주의" : sourceTone === "positive" ? "소스 정상" : "소스 공백";
  const missionDetail = missionOptions.hasRecentChanges ? commandDeck.cards[0]?.detail.replace("대기", "변화 감지") : commandDeck.cards[0]?.detail;
  const tonePriority: Record<OfficeDeltaBadge["tone"], number> = { negative: 4, warning: 3, positive: 2, neutral: 1 };
  const items: OfficeSafeStatusSnapshotItem[] = [
    { id: "deck", label: "상태판", detail: missionDetail ?? commandDeck.headline, tone: missionOptions.hasRecentChanges ? "warning" : commandDeck.tone, ariaHidden: true, interactive: false },
    { id: "floor", label: "바닥", detail: floorLegend.summary, tone: floorLegend.tone, ariaHidden: true, interactive: false },
    { id: "source", label: "소스", detail: `${reportedSourceCount}개 중 ${usableSourceCount}개 사용 가능`, tone: sourceTone, ariaHidden: true, interactive: false },
    { id: "guard", label: "가드", detail: "읽기 전용 · 원문 제외", tone: "neutral", ariaHidden: true, interactive: false },
  ];

  return {
    stageLabel: "Stage 14-O 안전 status snapshot",
    headline: `${sourceHeadline} · ${floorLegend.summary}`,
    detail: "command deck, floor legend, source health를 안전 상태 스냅샷으로 압축",
    tone: items.reduce<OfficeDeltaBadge["tone"]>((current, item) => (tonePriority[item.tone] > tonePriority[current] ? item.tone : current), "neutral"),
    items,
  };
}

export function buildOfficeSafeScanIndex(state: OfficeState, delta: OfficeStateDelta, missionOptions: OfficeSafeMissionClockOptions): OfficeSafeScanIndex {
  const snapshot = buildOfficeSafeStatusSnapshot(state, delta, missionOptions);
  const floorLegend = buildOfficeSafeFloorLegend(delta);
  const railCount = snapshot.items.length;
  const modeDetail = `${missionOptions.liveTracking ? "실시간" : "수동"} · ${missionOptions.isVisible ? "표시 탭" : "숨김 탭"}`;
  const tonePriority: Record<OfficeDeltaBadge["tone"], number> = { negative: 4, warning: 3, positive: 2, neutral: 1 };
  const items: OfficeSafeScanIndexItem[] = [
    { id: "snapshot", label: "스냅샷", detail: "상태 snapshot 참조", tone: snapshot.tone, ariaHidden: true, interactive: false },
    { id: "rail", label: "레일", detail: `${railCount}개 안전 칸`, tone: floorLegend.tone, ariaHidden: true, interactive: false },
    { id: "mode", label: "모드", detail: modeDetail, tone: missionOptions.liveTracking && missionOptions.isVisible && missionOptions.consecutiveFailures === 0 ? "positive" : "warning", ariaHidden: true, interactive: false },
  ];

  return {
    stageLabel: "Stage 14-P 안전 scan index",
    headline: `스캔 ${railCount}칸 · snapshot 기준`,
    detail: "status snapshot과 안전 rail 수를 빠른 스캔 색인으로 압축",
    tone: items.reduce<OfficeDeltaBadge["tone"]>((current, item) => (tonePriority[item.tone] > tonePriority[current] ? item.tone : current), "neutral"),
    items,
  };
}

export function buildOfficeSafeHudReadabilityPlan(options: OfficeSafeHudReadabilityPlanOptions): OfficeSafeHudReadabilityPlan {
  const viewport = options.viewportWidth ?? 0;
  const layoutDetail = viewport >= 1024 ? "넓은 HUD" : viewport >= 720 ? "중간 HUD" : "압축 HUD";
  const layoutTone: OfficeDeltaBadge["tone"] = viewport >= 1024 ? "positive" : viewport >= 720 ? "neutral" : "warning";
  const motionDetail = options.prefersReducedMotion ? "정적 모션" : "동적 모션";
  const densityTone: OfficeDeltaBadge["tone"] = options.safePanelCount >= 6 ? "warning" : "positive";
  const trackingDetail = options.liveTracking ? "실시간" : "수동";
  const tonePriority: Record<OfficeDeltaBadge["tone"], number> = { negative: 4, warning: 3, positive: 2, neutral: 1 };
  const items: OfficeSafeHudReadabilityPlanItem[] = [
    { id: "layout", label: "배치", detail: layoutDetail, tone: layoutTone, ariaHidden: true, interactive: false },
    { id: "motion", label: "모션", detail: motionDetail, tone: options.prefersReducedMotion ? "neutral" : "positive", ariaHidden: true, interactive: false },
    { id: "density", label: "밀도", detail: `${options.safePanelCount}개 패널`, tone: densityTone, ariaHidden: true, interactive: false },
    { id: "tracking", label: "추적", detail: trackingDetail, tone: options.liveTracking ? "positive" : "neutral", ariaHidden: true, interactive: false },
  ];

  return {
    stageLabel: "Stage 14-Q 안전 HUD readability",
    summary: `${layoutDetail} · ${motionDetail} · ${options.safePanelCount}개 패널`,
    detail: "브라우저 로컬 레이아웃 신호만으로 안전 HUD 가독성을 요약",
    tone: items.reduce<OfficeDeltaBadge["tone"]>((current, item) => (tonePriority[item.tone] > tonePriority[current] ? item.tone : current), "neutral"),
    items,
  };
}

export function buildOfficeSafeHudHierarchy(options: OfficeSafeHudHierarchyOptions): OfficeSafeHudHierarchy {
  const tonePriority: Record<OfficeDeltaBadge["tone"], number> = { negative: 4, warning: 3, positive: 2, neutral: 1 };
  const sections: OfficeSafeHudHierarchySection[] = [
    { id: "primary", label: "핵심", detail: "상태 snapshot 먼저", tone: options.statusTone, ariaHidden: true, interactive: false },
    { id: "secondary", label: "보조", detail: "scan index로 범위 확인", tone: options.scanTone, ariaHidden: true, interactive: false },
    { id: "diagnostic", label: "진단", detail: "HUD readability로 밀도 확인", tone: options.readabilityTone, ariaHidden: true, interactive: false },
  ];

  return {
    stageLabel: "Stage 15-A 안전 HUD hierarchy",
    headline: "먼저 볼 순서 정리",
    summary: `핵심 ${options.statusItemCount}개 · 보조 ${options.scanItemCount}개 · 진단 ${options.readabilityItemCount}개`,
    detail: "기존 안전 패널의 읽기 순서만 정리하고 새 원문 데이터는 투영하지 않음",
    tone: sections.reduce<OfficeDeltaBadge["tone"]>((current, section) => (tonePriority[section.tone] > tonePriority[current] ? section.tone : current), "neutral"),
    sections,
  };
}

export function buildOfficeCharacters(state: OfficeState, nodes: OfficeMapNode[]): OfficeCharacter[] {
  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  const characters: OfficeCharacter[] = [];
  const blockedWorkCount = state.work_items.filter((item) => characterStatusFromText(item.status) === "blocked").length;
  const failedAutomationCount = state.automations.filter((job) => characterStatusFromText(job.state) === "error" || characterStatusFromText(job.last_status) === "error").length;
  const sourceWarnings = state.data_sources.filter((source) => source.status !== "ok" || (source.warning_count ?? 0) > 0);
  const routingCount = state.topics.length + state.provenance.length;

  addCharacters(characters, "model", state.agents.length, (index) => characterStatusFromText(state.agents[index]?.status), nodesById);
  addCharacters(characters, "worker", state.work_items.length, (index) => {
    const status = characterStatusFromText(state.work_items[index]?.status);
    return status === "blocked" ? "blocked" : status === "unknown" ? "working" : "working";
  }, nodesById);
  addCharacters(characters, "automation_keeper", state.automations.length, (index) => {
    const job = state.automations[index];
    const status = characterStatusFromText(job?.state ?? job?.last_status);
    if (status === "error") return "error";
    if (status === "unknown") return "scheduled";
    return status === "active" ? "scheduled" : status;
  }, nodesById);
  addCharacters(characters, "router", Math.max(routingCount, state.data_sources.some((source) => source.id === "topics" && source.status !== "ok") ? 1 : 0), () => (routingCount > 0 ? "routing" : "unknown"), nodesById);
  addCharacters(characters, "sentinel", sourceWarnings.length, (index) => {
    const status = sourceWarnings[index]?.status;
    if (status === "error") return "error";
    if (status === "partial" || status === "unavailable" || status === "missing") return "warning";
    return "unknown";
  }, nodesById);
  addCharacters(characters, "alert", blockedWorkCount + failedAutomationCount, () => "blocked", nodesById);

  return characters;
}

export function buildOfficeCharacterSceneObjects(characters: OfficeCharacter[]): OfficeSceneObject[] {
  return characters.map((character) => ({
    id: `character:${character.id}`,
    roomId: character.roomId,
    kind: CHARACTER_ROLE_KIND[character.role],
    label: character.label,
    detail: `${character.detail} · ${character.redactionNote}`,
    health: officeCharacterHealth(character.status),
    x: character.x,
    y: character.y,
  }));
}

function roomRows(state: OfficeState, roomId: OfficeMapNode["id"]): Array<Record<string, unknown>> {
  if (roomId === "sessions") return state.agents;
  if (roomId === "work") return state.work_items;
  if (roomId === "automation") return state.automations;
  return [...state.topics, ...state.provenance];
}

function sceneObjectGlyph(kind: OfficeSceneObject["kind"]): string {
  if (kind === "avatar") return "●";
  if (kind === "desk") return "▤";
  if (kind === "machine") return "▣";
  if (kind === "mail") return "▥";
  return "!";
}

function sceneObjectTone(health: OfficeSceneObject["health"]): string {
  if (health === "ok") return "border-emerald-200/70 bg-emerald-300/25 text-emerald-50 shadow-emerald-950/40";
  if (health === "partial") return "border-yellow-200/80 bg-yellow-300/25 text-yellow-50 shadow-yellow-950/40";
  if (health === "error") return "border-red-200/80 bg-red-300/25 text-red-50 shadow-red-950/40";
  return "border-sky-200/65 bg-sky-300/20 text-sky-50 shadow-sky-950/35";
}

export function buildOfficeSceneObjectView(object: OfficeSceneObject): OfficeSceneObjectView {
  return {
    glyph: sceneObjectGlyph(object.kind),
    title: `${object.label} · ${object.detail}`,
    toneClass: sceneObjectTone(object.health),
    ariaHidden: true,
    interactive: false,
  };
}

export function buildOfficeSceneMotionTrack(object: OfficeSceneObject): OfficeSceneMotionTrack {
  const indexMatch = object.id.match(/-(\d+)$/);
  const index = indexMatch ? Number(indexMatch[1]) : 1;
  const direction = index % 2 === 0 ? -1 : 1;
  const delay = `-${(index * 0.3).toFixed(1)}s`;
  const baseStyle = {
    "--office-motion-delay": delay,
  };

  if (object.kind === "machine") {
    return {
      className: "office-scene-marker-motion office-scene-marker-blink",
      style: {
        ...baseStyle,
        "--office-motion-x": "0px",
        "--office-motion-y": "0px",
        "--office-motion-duration": `${(3.6 + (index % 3) * 0.4).toFixed(1)}s`,
      },
      ariaLabel: `${object.label} 상태등 표시 · 안전 DTO 기반`,
    };
  }

  if (object.kind === "desk") {
    return {
      className: "office-scene-marker-motion office-scene-marker-idle",
      style: {
        ...baseStyle,
        "--office-motion-x": "0px",
        "--office-motion-y": `${direction}px`,
        "--office-motion-duration": `${(5.8 + (index % 2) * 0.5).toFixed(1)}s`,
      },
      ariaLabel: `${object.label} 대기 표시 · 안전 DTO 기반`,
    };
  }

  const isAlert = object.kind === "alert";
  return {
    className: `office-scene-marker-motion ${isAlert ? "office-scene-marker-blink" : "office-scene-marker-walk"}`,
    style: {
      ...baseStyle,
      "--office-motion-x": `${isAlert ? 1 : 3 * direction}px`,
      "--office-motion-y": `${isAlert ? -1 : -2 * direction}px`,
      "--office-motion-duration": `${(4.5 + (index % 4) * 0.3).toFixed(1)}s`,
    },
    ariaLabel: `${object.label} ${isAlert ? "상태등" : "이동"} 표시 · 안전 DTO 기반`,
  };
}

export function buildOfficeSceneObjects(state: OfficeState, nodes: OfficeMapNode[]): OfficeSceneObject[] {
  return nodes.flatMap((node) => {
    const config = SCENE_ROOM_CONFIG[node.id];
    const rows = roomRows(state, node.id);
    const slots = SCENE_SLOTS[node.id];
    const visibleRows = rows.slice(0, SCENE_OBJECT_LIMIT);
    const objects = visibleRows.map<OfficeSceneObject>((_, index) => {
      const [x, y] = slots[index];
      return {
        id: `${node.id}-${config.kind}-${index + 1}`,
        roomId: node.id,
        kind: config.kind,
        label: `${config.singular} ${index + 1}`,
        detail: `${node.zone} 안전 표시`,
        health: node.health,
        x,
        y,
      };
    });

    if (rows.length === 0 && config.emptyLabel) {
      const [x, y] = slots[0];
      objects.push({
        id: `${node.id}-empty`,
        roomId: node.id,
        kind: config.kind,
        label: config.emptyLabel,
        detail: config.emptyDetail ?? `${node.zone} 빈 표시`,
        health: node.health,
        x,
        y,
      });
    }

    if (rows.length > SCENE_OBJECT_LIMIT) {
      objects.push({
        id: `${node.id}-overflow`,
        roomId: node.id,
        kind: "alert",
        label: `+${rows.length - SCENE_OBJECT_LIMIT} ${config.plural}`,
        detail: "지도 밀도 때문에 숨긴 추가 안전 개수",
        health: node.health,
        x: Math.min(node.x + 12, 90),
        y: Math.min(node.y + 11, 88),
      });
    }

    return objects;
  });
}

export function buildOfficeAttentionItems(state: OfficeState): AttentionItem[] {
  const blocked = state.work_items
    .map((item) => ({
      id: `work:${String(item.id)}`,
      label: textField(item, "title"),
      detail: `작업 항목 · ${textField(item, "status")}`,
    }))
    .filter((item) => item.detail.includes("blocked"));
  const failedAutomations = state.automations
    .filter(
      (job) => job.last_status === "error" || job.state === "error" || (Array.isArray(job.badges) && job.badges.includes("needs_attention")),
    )
    .map((job) => ({
      id: `automation:${String(job.id)}`,
      label: textField(job, "name"),
      detail: `자동화 · ${textField(job, "last_status")}`,
    }));
  const sourceWarnings = state.data_sources
    .filter((source) => source.status === "partial" || source.status === "error" || (source.warning_count ?? 0) > 0)
    .map((source) => ({
      id: `source:${source.id}`,
      label: source.id,
      detail: `source · ${source.status}${source.warning_count ? ` · ${source.warning_count} warning(s)` : ""}`,
    }));
  return [...blocked, ...failedAutomations, ...sourceWarnings];
}
