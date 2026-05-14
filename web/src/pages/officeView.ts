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

export type OfficePageSectionId = "sources" | "paperclip" | "work" | "automation" | "routing" | "events";

export type OfficePageSectionPlan = {
  id: OfficePageSectionId;
  label: string;
  summary: string;
  count: number;
  defaultOpen: boolean;
  ariaLabel: string;
};

export type OfficeUnifiedWorkbenchLayerId = "operatingBoard" | "evidenceLayer" | "projectionCache" | "rpgRoom";

export type OfficeUnifiedWorkbenchLayer = {
  id: OfficeUnifiedWorkbenchLayerId;
  label: string;
  source: string;
  summary: string;
  count: number;
  tone: OfficeDeltaBadge["tone"];
};

export type OfficeUnifiedWorkbenchView = {
  title: "AI Office 통합 운영실";
  subtitle: string;
  generatedAt: string;
  layers: OfficeUnifiedWorkbenchLayer[];
  safetyPosture: {
    readOnly: boolean;
    privateOnly: boolean;
    rawExcluded: true;
    approvalModel: {
      status: "display-only";
      enabledControls: 0;
      contract: "approval-model-contract";
    };
  };
  renderOrder: ["operating-room-header", "rpg-room-map", "operating-board", "evidence-layer", "projection-cache", "safety-inspector"];
};

export type OfficeSourceHealthSummary = {
  counts: Record<OfficeSourceStatus, number>;
  label: string;
  detail: string;
  totalWarningCount: number;
  missingSourceIds: string[];
  tone: OfficeDeltaBadge["tone"];
};

export type OfficeSourceHealthRailItemId = "sessions" | "kanban" | "paperclip" | "automation" | "routing" | "redaction";

export type OfficeSourceHealthRailItem = {
  id: OfficeSourceHealthRailItemId;
  label: string;
  status: OfficeSourceStatus;
  tone: OfficeDeltaBadge["tone"];
  sourceCount: number;
  itemCount: number;
  warningCount: number;
  detail: string;
  redactionNote: string;
};

export type OfficeSourceHealthRail = {
  stageLabel: "Office Source Health 1";
  detail: string;
  items: OfficeSourceHealthRailItem[];
  redactionNote: string;
};

export type OfficeSourceHealthDiagnosticCardId = "coverage" | "attention" | "readability";

export type OfficeSourceHealthDiagnosticCard = {
  id: OfficeSourceHealthDiagnosticCardId;
  title: string;
  count: number;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
};

export type OfficeSourceHealthCompactDiagnostics = {
  stageLabel: "Office Source Health 2";
  detail: string;
  cards: OfficeSourceHealthDiagnosticCard[];
  redactionNote: string;
};

export type OfficePaperclipSourceType = "paperclip" | "nas_manifest" | "session_tag" | "relay_projection" | "unknown";

export type OfficePaperclipRelay = "MacBook" | "WSL" | "VPS" | "unknown";

export type OfficePaperclipTimingBucket = "fresh" | "recent" | "stale" | "unknown";

export type OfficePaperclipWorkbenchSource = {
  id: string;
  label: string;
  health: OfficeSourceStatus;
  sourceType: OfficePaperclipSourceType;
  itemCount: number;
  warningCount: number;
  relay: OfficePaperclipRelay;
  tags: string[];
  timingBucket: OfficePaperclipTimingBucket;
  redactionNote: string;
};

export type OfficePaperclipWorkbench = {
  stageLabel: string;
  detail: string;
  sources: OfficePaperclipWorkbenchSource[];
  redactionNote: string;
};

export type OfficePaperclipInspector = {
  kind: "Paperclip 안전 작업대";
  title: string;
  fields: Array<[string, string]>;
};

export type OfficePaperclipMapSlot = {
  id: string;
  label: string;
  health: OfficeSourceStatus;
  sourceType: OfficePaperclipSourceType;
  x: number;
  y: number;
  itemCount: number;
  warningCount: number;
  ariaHidden: true;
  interactive: false;
};

export type OfficePaperclipVisibilityCard = {
  id: "manifests" | "privateDashboard" | "relayPosture";
  title: string;
  detail: string;
  count: number;
  tone: OfficeDeltaBadge["tone"];
};

export type OfficePaperclipManifestVisibility = {
  stageLabel: string;
  detail: string;
  cards: OfficePaperclipVisibilityCard[];
  redactionNote: string;
};

export type OfficePaperclipMapProjection = {
  stageLabel: string;
  detail: string;
  slots: OfficePaperclipMapSlot[];
  ariaLabel: string;
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

export type OfficeLiveOperationsCueId = "working" | "reviewing" | "report-ready" | "blocked" | "automation-running";

export type OfficeLiveOperationsCue = {
  id: OfficeLiveOperationsCueId;
  label: string;
  detail: string;
  count: number;
  roomId: OfficeMapNode["id"];
  tone: OfficeDeltaBadge["tone"];
  ariaHidden: true;
  interactive: false;
};

export type OfficeLiveOperationsLayer = {
  stageLabel: string;
  summary: string;
  detail: string;
  cues: OfficeLiveOperationsCue[];
  redactionNote: string;
};

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
  viewportMode: "narrow" | "tablet" | "desktop";
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

export type OfficeSafeMotionHeartbeatItem = {
  id: "stream" | "cadence" | "motion";
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
};

export type OfficeSafeMotionHeartbeat = {
  stageLabel: string;
  mode: "safe-polling" | "local-fallback" | "checking";
  phase: "idle" | "scan" | "pulse" | "hold";
  intensity: "low" | "medium" | "high";
  summary: string;
  motionEnabled: boolean;
  items: OfficeSafeMotionHeartbeatItem[];
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeMotionHeartbeatOptions = {
  pollStatus: "idle" | "active" | "loading" | "unavailable";
  tick: number;
  failureCount: number;
  reducedMotion: boolean;
};

export type OfficeSafeSpatialChoreographyItem = {
  id: string;
  kind: "room-pulse" | "route-sweep";
  roomId: OfficeMapNode["id"];
  toRoomId?: OfficeMapNode["id"];
  label: string;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
  intensity: OfficeSafeRoomBeaconIntensity;
  x: number;
  y: number;
  x2?: number;
  y2?: number;
  className: string;
  ariaHidden: true;
  interactive: false;
};

export type OfficeSafeSpatialChoreography = {
  stageLabel: string;
  mode: "safe-spatial-motion" | "safe-spatial-idle";
  summary: string;
  items: OfficeSafeSpatialChoreographyItem[];
  ariaHidden: true;
  interactive: false;
};

export type OfficeRpgRoomId = "command" | "agent_desks" | "task_board" | "cron_room" | "source_archive" | "incident_corner";

export type OfficeRpgStatus = "idle" | "working" | "waiting" | "blocked" | "failed" | "completed" | "warning" | "unknown";

export type OfficeRpgEntityKind = "agent" | "session" | "work_item" | "cron_job" | "source" | "incident" | "report";

export type OfficeRpgSeverity = "normal" | "info" | "warning" | "danger";

export type OfficeRpgSceneEntity = {
  id: string;
  kind: OfficeRpgEntityKind;
  label: string;
  status: OfficeRpgStatus;
  room: OfficeRpgRoomId;
  positionHint: { x: number; y: number; lane?: string };
  severity: OfficeRpgSeverity;
  lastEventAt: string | null;
  summary: string;
  linkTarget: {
    type: "inspector" | "filter" | "safe_ref";
    ref: string;
  };
};

export type OfficeRpgScene = {
  schemaVersion: 1;
  generatedAt: string;
  mode: "read_only";
  rooms: Array<{
    id: OfficeRpgRoomId;
    label: string;
    summary: string;
    severity: OfficeRpgSeverity;
    counts: Record<string, number>;
  }>;
  entities: OfficeRpgSceneEntity[];
  recentEvents: Array<{
    id: string;
    label: string;
    room: OfficeRpgRoomId;
    severity: OfficeRpgSeverity;
    at: string | null;
  }>;
  safety: {
    factual: true;
    readOnly: true;
    source: "OfficeState" | "OfficeState+SafeEvents";
    omittedRawSections: string[];
  };
};

export type OfficeRpgMissionStoryboardStep = {
  id: "request" | "orchestrate" | "board" | "evidence" | "review" | "approval";
  label: string;
  room: OfficeRpgRoomId;
  detail: string;
  tone: OfficeRpgSeverity;
};

export type OfficeRpgMissionStoryboard = {
  stageLabel: "First Implementation Scene";
  title: string;
  summary: string;
  steps: OfficeRpgMissionStoryboardStep[];
  approvalBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeRpgOrchestratorDeskCard = {
  id: "intake" | "decompose" | "assign" | "evidence" | "review" | "authority";
  label: string;
  value: string;
  detail: string;
  tone: "neutral" | "info" | "warning";
};

export type OfficeRpgOrchestratorDesk = {
  stageLabel: "Orchestrator Desk 1";
  title: string;
  intent: string;
  cards: OfficeRpgOrchestratorDeskCard[];
  actionBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeRpgKanbanBoardLane = {
  id: "intake" | "active" | "blocked" | "done" | "clerk" | "boundary";
  label: string;
  value: string;
  detail: string;
  tone: "neutral" | "info" | "warning";
};

export type OfficeRpgKanbanBoardFacility = {
  stageLabel: "Kanban Board 1";
  title: string;
  sourceOfTruth: "VPS ai-office Kanban";
  lanes: OfficeRpgKanbanBoardLane[];
  writeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeRpgSourceArchiveShelf = {
  id: "evidence" | "sourceTags" | "manifests" | "validation" | "boundary" | "handoff";
  label: string;
  value: string;
  detail: string;
  tone: "neutral" | "info" | "warning";
};

export type OfficeRpgSourceArchiveFacility = {
  stageLabel: "Paperclip Source Archive 1";
  title: string;
  shelves: OfficeRpgSourceArchiveShelf[];
  rawBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeRpgReviewCornerStation = {
  id: "queue" | "blocked" | "source" | "automation" | "escalation" | "boundary";
  label: string;
  value: string;
  detail: string;
  tone: "neutral" | "info" | "warning";
};

export type OfficeRpgReviewCornerFacility = {
  stageLabel: "Review Corner 1";
  title: string;
  stations: OfficeRpgReviewCornerStation[];
  approvalBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeRpgApprovalConsoleControl = {
  id: "summary" | "human" | "dryRun" | "audit" | "boundary" | "disabled";
  label: string;
  value: string;
  detail: string;
  tone: "neutral" | "info" | "warning";
  disabled: true;
};

export type OfficeRpgApprovalConsoleFacility = {
  stageLabel: "Approval Console 1";
  title: string;
  controls: OfficeRpgApprovalConsoleControl[];
  decisionBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeApprovalActionKind =
  | "kanban_transition"
  | "kanban_comment"
  | "projection_promote"
  | "projection_reject"
  | "nas_save_request"
  | "watcher_enable_request"
  | "service_restart_request";

export type OfficeApprovalRequestRow = {
  requestRef: string;
  actionKind: OfficeApprovalActionKind;
  targetKind: "kanban_card" | "projection_bundle" | "nas_save_candidate" | "watcher" | "service";
  targetRef: string;
  reasonSummary: string;
  evidenceCount: number;
  hypothetical: true;
  orchestratorRequired: true;
  humanApprovalRequired: true;
};

export type OfficeApprovalRequestView = {
  stageLabel: "Approval Request View 1";
  title: string;
  authorityLevel: "display_only";
  enabledControls: 0;
  requests: OfficeApprovalRequestRow[];
  dryRunEvidence: {
    result: "would_succeed" | "would_fail" | "blocked" | "needs_more_evidence";
    validatorPosture: "pass" | "warning" | "fail" | "not_applicable";
    affectedSafeCounts: Record<string, number>;
    rawExcluded: true;
  };
  humanDecision: {
    status: "not_requested";
    scope: "single_action_only";
    enabled: false;
  };
  auditReadiness: {
    eventKind: "action_requested";
    resultPosture: "info" | "warning" | "blocked" | "success";
    safeSummary: string;
  };
  safeProjectionOnly: true;
};

export type OfficeApprovalAuditTimelineStep = {
  id: "request" | "dryRun" | "decision" | "execution";
  eventKind: "action_requested" | "dry_run_completed" | "human_decision_recorded" | "execution_blocked";
  status: "ready-preview" | "waiting-preview" | "blocked-preview";
  resultPosture: "info" | "warning" | "blocked" | "success";
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeApprovalAuditTimeline = {
  stageLabel: "Approval Audit Timeline 1";
  title: string;
  enabledControls: 0;
  writesAuditEvents: false;
  steps: OfficeApprovalAuditTimelineStep[];
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeApprovalExecutionGatePrerequisite = {
  id: "authority_adapter" | "audit_writer" | "rollback_plan" | "human_confirmation";
  label: string;
  status: "missing";
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeApprovalExecutionGate = {
  stageLabel: "Approval Execution Gate 1";
  title: string;
  enabledControls: 0;
  executionAllowed: false;
  browserAffordance: "none";
  requiredPrerequisites: OfficeApprovalExecutionGatePrerequisite[];
  blockedBy: OfficeApprovalAuditTimelineStep[];
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeAuthorityAdapterContractField = {
  id: "request_ref" | "dry_run_result" | "audit_sink" | "rollback_ref" | "human_confirmation_ref";
  label: string;
  required: true;
  status: "missing";
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeAuthorityAdapterContract = {
  stageLabel: "Authority Adapter Contract 1";
  title: string;
  enabledControls: 0;
  dispatchEnabled: false;
  adaptersInstalled: false;
  allowedActionKinds: OfficeApprovalActionKind[];
  requiredFields: OfficeAuthorityAdapterContractField[];
  gateSnapshot: Pick<OfficeApprovalExecutionGate, "executionAllowed" | "browserAffordance">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeOrchestratorMediationQueueItem = {
  id: "userInstruction" | "characterQuickAction" | "systemAttention";
  intentKind: "user_instruction" | "character_quick_action" | "system_attention";
  status: "waiting_for_orchestrator";
  safeSummary: string;
  orchestratorRequired: true;
  rawExcluded: true;
};

export type OfficeOrchestratorMediationQueue = {
  stageLabel: "Orchestrator Mediation Queue 1";
  title: string;
  enabledControls: 0;
  enqueueEnabled: false;
  candidatePromotionEnabled: false;
  items: OfficeOrchestratorMediationQueueItem[];
  contractSnapshot: Pick<OfficeAuthorityAdapterContract, "dispatchEnabled" | "adaptersInstalled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeWorkerIntentRoutingRoute = {
  id: "routeUserInstruction" | "routeCharacterQuickAction" | "routeSystemAttention";
  intentKind: OfficeOrchestratorMediationQueueItem["intentKind"];
  workerRole: "orchestrator" | "facility_worker" | "safety_reviewer";
  targetFacility: "orchestrator_desk" | "agent_desks" | "incident_corner";
  status: "routing_posture_only";
  assignmentStatus: "not_assigned";
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerIntentRouting = {
  stageLabel: "Worker Intent Routing 1";
  title: string;
  enabledControls: 0;
  workAssignmentEnabled: false;
  requestCreationEnabled: false;
  dispatchEnabled: false;
  routes: OfficeWorkerIntentRoutingRoute[];
  queueSnapshot: Pick<OfficeOrchestratorMediationQueue, "enqueueEnabled" | "candidatePromotionEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeWorkerFacilityReadinessPrerequisite = {
  id:
    | "orchestrator_mediation_locked"
    | "human_instruction_scope"
    | "assignment_audit_sink"
    | "worker_capacity_snapshot"
    | "request_creation_gate"
    | "dispatch_adapter_disabled"
    | "incident_review_policy"
    | "safe_attention_context"
    | "audit_write_gate";
  label: string;
  status: "missing";
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerFacilityReadinessFacility = {
  id: OfficeWorkerIntentRoutingRoute["targetFacility"];
  workerRole: OfficeWorkerIntentRoutingRoute["workerRole"];
  status: "prerequisites_missing";
  assignmentReady: false;
  routeCount: number;
  prerequisites: OfficeWorkerFacilityReadinessPrerequisite[];
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerFacilityReadiness = {
  stageLabel: "Worker Facility Readiness 1";
  title: string;
  enabledControls: 0;
  workAssignmentEnabled: false;
  requestCreationEnabled: false;
  dispatchEnabled: false;
  auditWriteEnabled: false;
  facilities: OfficeWorkerFacilityReadinessFacility[];
  routingSnapshot: Pick<OfficeWorkerIntentRouting, "workAssignmentEnabled" | "requestCreationEnabled" | "dispatchEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeWorkerAssignmentCandidateBlockedReason = {
  id: "facility_prerequisites_missing" | "approval_execution_blocked" | "authority_adapter_missing" | "audit_write_disabled" | "human_confirmation_missing";
  label: string;
  status: "blocked";
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerAssignmentCandidate = {
  id: `candidate_${OfficeWorkerFacilityReadinessFacility["id"]}`;
  facilityId: OfficeWorkerFacilityReadinessFacility["id"];
  workerRole: OfficeWorkerFacilityReadinessFacility["workerRole"];
  status: "blocked";
  assignmentReady: false;
  blockedBy: OfficeWorkerAssignmentCandidateBlockedReason[];
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerAssignmentCandidateGate = {
  stageLabel: "Worker Assignment Candidate Gate 1";
  title: string;
  enabledControls: 0;
  assignmentCandidateEnabled: false;
  workAssignmentEnabled: false;
  requestCreationEnabled: false;
  dispatchEnabled: false;
  auditWriteEnabled: false;
  candidates: OfficeWorkerAssignmentCandidate[];
  readinessSnapshot: Pick<OfficeWorkerFacilityReadiness, "workAssignmentEnabled" | "requestCreationEnabled" | "dispatchEnabled" | "auditWriteEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeWorkerRequestDraft = {
  id: `draft_${OfficeWorkerAssignmentCandidate["facilityId"]}`;
  candidateRef: OfficeWorkerAssignmentCandidate["id"];
  facilityId: OfficeWorkerAssignmentCandidate["facilityId"];
  workerRole: OfficeWorkerAssignmentCandidate["workerRole"];
  status: "not_created";
  persistenceStatus: "not_persisted";
  safeFields: Array<"candidate_ref" | "facility" | "worker_role" | "blocked_reasons">;
  blockedReasonCount: number;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerRequestDraftPreview = {
  stageLabel: "Worker Request Draft Preview 1";
  title: string;
  enabledControls: 0;
  requestCreationEnabled: false;
  requestPersistenceEnabled: false;
  workAssignmentEnabled: false;
  dispatchEnabled: false;
  auditWriteEnabled: false;
  drafts: OfficeWorkerRequestDraft[];
  candidateSnapshot: Pick<OfficeWorkerAssignmentCandidateGate, "assignmentCandidateEnabled" | "requestCreationEnabled" | "dispatchEnabled" | "auditWriteEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeWorkerHumanConfirmationEnvelopeItem = {
  id: `confirm_${OfficeWorkerRequestDraft["id"]}`;
  draftRef: OfficeWorkerRequestDraft["id"];
  facilityId: OfficeWorkerRequestDraft["facilityId"];
  workerRole: OfficeWorkerRequestDraft["workerRole"];
  status: "not_recorded";
  decisionState: "missing";
  requiredFields: Array<"draft_ref" | "human_actor_ref" | "decision" | "decision_reason" | "rollback_ack">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerHumanConfirmationEnvelope = {
  stageLabel: "Worker Human Confirmation Envelope 1";
  title: string;
  enabledControls: 0;
  decisionRecordingEnabled: false;
  requestCreationEnabled: false;
  requestPersistenceEnabled: false;
  workAssignmentEnabled: false;
  dispatchEnabled: false;
  auditWriteEnabled: false;
  envelopes: OfficeWorkerHumanConfirmationEnvelopeItem[];
  draftSnapshot: Pick<OfficeWorkerRequestDraftPreview, "requestCreationEnabled" | "requestPersistenceEnabled" | "dispatchEnabled" | "auditWriteEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeWorkerAuthorityHandoff = {
  id: `handoff_${OfficeWorkerHumanConfirmationEnvelopeItem["id"]}`;
  confirmationRef: OfficeWorkerHumanConfirmationEnvelopeItem["id"];
  facilityId: OfficeWorkerHumanConfirmationEnvelopeItem["facilityId"];
  workerRole: OfficeWorkerHumanConfirmationEnvelopeItem["workerRole"];
  status: "not_handed_off";
  adapterState: "missing";
  requiredFields: Array<"confirmation_ref" | "adapter_contract_ref" | "dry_run_result_ref" | "audit_sink_ref" | "rollback_ref">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerAuthorityHandoffEnvelope = {
  stageLabel: "Worker Authority Handoff Envelope 1";
  title: string;
  enabledControls: 0;
  adapterInstallationEnabled: false;
  dispatchEnabled: false;
  requestCreationEnabled: false;
  workAssignmentEnabled: false;
  auditWriteEnabled: false;
  handoffs: OfficeWorkerAuthorityHandoff[];
  confirmationSnapshot: Pick<OfficeWorkerHumanConfirmationEnvelope, "decisionRecordingEnabled" | "dispatchEnabled" | "auditWriteEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeWorkerDispatchDryRun = {
  id: `dryrun_${OfficeWorkerAuthorityHandoff["id"]}`;
  handoffRef: OfficeWorkerAuthorityHandoff["id"];
  facilityId: OfficeWorkerAuthorityHandoff["facilityId"];
  workerRole: OfficeWorkerAuthorityHandoff["workerRole"];
  status: "not_run";
  executionState: "blocked";
  requiredFields: Array<"handoff_ref" | "simulation_scope" | "expected_effects" | "rollback_plan" | "audit_preview_ref">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerDispatchDryRunEnvelope = {
  stageLabel: "Worker Dispatch Dry-Run Envelope 1";
  title: string;
  enabledControls: 0;
  dryRunExecutionEnabled: false;
  dispatchEnabled: false;
  adapterInstallationEnabled: false;
  requestCreationEnabled: false;
  workAssignmentEnabled: false;
  auditWriteEnabled: false;
  dryRuns: OfficeWorkerDispatchDryRun[];
  handoffSnapshot: Pick<OfficeWorkerAuthorityHandoffEnvelope, "adapterInstallationEnabled" | "dispatchEnabled" | "auditWriteEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeWorkerAuditPreview = {
  id: `audit_${OfficeWorkerDispatchDryRun["id"]}`;
  dryRunRef: OfficeWorkerDispatchDryRun["id"];
  facilityId: OfficeWorkerDispatchDryRun["facilityId"];
  workerRole: OfficeWorkerDispatchDryRun["workerRole"];
  status: "not_written";
  auditSinkState: "missing";
  requiredFields: Array<"dry_run_ref" | "audit_sink_ref" | "event_type" | "redaction_policy" | "rollback_ref">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerAuditPreviewEnvelope = {
  stageLabel: "Worker Audit Preview Envelope 1";
  title: string;
  enabledControls: 0;
  auditWriteEnabled: false;
  executionEnabled: false;
  dispatchEnabled: false;
  adapterInstallationEnabled: false;
  requestCreationEnabled: false;
  workAssignmentEnabled: false;
  previews: OfficeWorkerAuditPreview[];
  dryRunSnapshot: Pick<OfficeWorkerDispatchDryRunEnvelope, "dryRunExecutionEnabled" | "dispatchEnabled" | "auditWriteEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeWorkerRollbackPreview = {
  id: `rollback_${OfficeWorkerAuditPreview["id"]}`;
  auditPreviewRef: OfficeWorkerAuditPreview["id"];
  facilityId: OfficeWorkerAuditPreview["facilityId"];
  workerRole: OfficeWorkerAuditPreview["workerRole"];
  status: "not_prepared";
  rollbackState: "missing";
  requiredFields: Array<"audit_preview_ref" | "rollback_scope" | "restore_point_ref" | "verification_plan" | "human_reconfirm_ref">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerRollbackPreviewEnvelope = {
  stageLabel: "Worker Rollback Preview Envelope 1";
  title: string;
  enabledControls: 0;
  rollbackExecutionEnabled: false;
  auditWriteEnabled: false;
  executionEnabled: false;
  dispatchEnabled: false;
  adapterInstallationEnabled: false;
  requestCreationEnabled: false;
  workAssignmentEnabled: false;
  previews: OfficeWorkerRollbackPreview[];
  auditPreviewSnapshot: Pick<OfficeWorkerAuditPreviewEnvelope, "auditWriteEnabled" | "executionEnabled" | "dispatchEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeWorkerFinalGateId = "authority_model" | "human_confirmation" | "audit_sink" | "rollback_plan" | "adapter_contract" | "runtime_boundary";

export type OfficeWorkerFinalGate = {
  id: OfficeWorkerFinalGateId;
  label: string;
  status: "blocked";
  requiredFields: Array<"approved_authority_model" | "mutation_route_design" | "runtime_scope" | "rollback_verified">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeWorkerFinalGateChecklist = {
  stageLabel: "Worker Final Gate Checklist 1";
  title: string;
  enabledControls: 0;
  controlProposalEnabled: false;
  rollbackExecutionEnabled: false;
  auditWriteEnabled: false;
  executionEnabled: false;
  dispatchEnabled: false;
  adapterInstallationEnabled: false;
  requestCreationEnabled: false;
  workAssignmentEnabled: false;
  gates: OfficeWorkerFinalGate[];
  rollbackPreviewSnapshot: Pick<OfficeWorkerRollbackPreviewEnvelope, "rollbackExecutionEnabled" | "auditWriteEnabled" | "dispatchEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeControlledMutationProposalContractId = "proposal_identity" | "authority_reference" | "dry_run_evidence" | "audit_plan" | "rollback_plan" | "human_approval";

export type OfficeControlledMutationProposalContractItem = {
  id: OfficeControlledMutationProposalContractId;
  label: string;
  status: "not_available";
  requiredFields: Array<"proposal_ref" | "authority_ref" | "dry_run_ref" | "audit_ref" | "rollback_ref" | "human_approval_ref">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeControlledMutationProposalContract = {
  stageLabel: "Controlled Mutation Proposal Contract 1";
  title: string;
  enabledControls: 0;
  proposalCreationEnabled: false;
  proposalPersistenceEnabled: false;
  mutationRouteEnabled: false;
  controlProposalEnabled: false;
  rollbackExecutionEnabled: false;
  auditWriteEnabled: false;
  executionEnabled: false;
  dispatchEnabled: false;
  requestCreationEnabled: false;
  contracts: OfficeControlledMutationProposalContractItem[];
  finalGateSnapshot: Pick<OfficeWorkerFinalGateChecklist, "controlProposalEnabled" | "executionEnabled" | "dispatchEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeControlledMutationDryRunPlanId = "simulation_scope" | "expected_effects" | "audit_capture" | "rollback_verification" | "human_review";

export type OfficeControlledMutationDryRunPlanItem = {
  id: OfficeControlledMutationDryRunPlanId;
  label: string;
  status: "not_runnable";
  requiredFields: Array<"simulation_scope" | "expected_effects" | "audit_capture_ref" | "rollback_verification_ref" | "human_review_ref">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeControlledMutationDryRunPlan = {
  stageLabel: "Controlled Mutation Dry-Run Plan 1";
  title: string;
  enabledControls: 0;
  dryRunExecutionEnabled: false;
  proposalCreationEnabled: false;
  mutationRouteEnabled: false;
  rollbackExecutionEnabled: false;
  auditWriteEnabled: false;
  executionEnabled: false;
  dispatchEnabled: false;
  planItems: OfficeControlledMutationDryRunPlanItem[];
  proposalContractSnapshot: Pick<OfficeControlledMutationProposalContract, "proposalCreationEnabled" | "mutationRouteEnabled" | "executionEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeControlledMutationAuditSinkPlanId = "event_type" | "redaction_policy" | "sink_reference" | "retention_policy" | "failure_handling";

export type OfficeControlledMutationAuditSinkPlanItem = {
  id: OfficeControlledMutationAuditSinkPlanId;
  label: string;
  status: "not_writable";
  requiredFields: Array<"event_type" | "redaction_policy" | "sink_ref" | "retention_policy" | "failure_handling_ref">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeControlledMutationAuditSinkPlan = {
  stageLabel: "Controlled Mutation Audit Sink Plan 1";
  title: string;
  enabledControls: 0;
  auditWriteEnabled: false;
  dryRunExecutionEnabled: false;
  proposalCreationEnabled: false;
  mutationRouteEnabled: false;
  rollbackExecutionEnabled: false;
  executionEnabled: false;
  dispatchEnabled: false;
  sinkItems: OfficeControlledMutationAuditSinkPlanItem[];
  dryRunPlanSnapshot: Pick<OfficeControlledMutationDryRunPlan, "dryRunExecutionEnabled" | "auditWriteEnabled" | "executionEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeControlledMutationRollbackVerificationPlanId = "restore_point" | "reversible_scope" | "verification_probe" | "failure_fallback" | "human_recheck";

export type OfficeControlledMutationRollbackVerificationPlanItem = {
  id: OfficeControlledMutationRollbackVerificationPlanId;
  label: string;
  status: "not_verified";
  requiredFields: Array<"restore_point_ref" | "reversible_scope" | "verification_probe_ref" | "failure_fallback_ref" | "human_recheck_ref">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeControlledMutationRollbackVerificationPlan = {
  stageLabel: "Controlled Mutation Rollback Verification Plan 1";
  title: string;
  enabledControls: 0;
  rollbackExecutionEnabled: false;
  auditWriteEnabled: false;
  dryRunExecutionEnabled: false;
  proposalCreationEnabled: false;
  mutationRouteEnabled: false;
  executionEnabled: false;
  dispatchEnabled: false;
  verificationItems: OfficeControlledMutationRollbackVerificationPlanItem[];
  auditSinkPlanSnapshot: Pick<OfficeControlledMutationAuditSinkPlan, "auditWriteEnabled" | "rollbackExecutionEnabled" | "executionEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeControlledMutationHumanApprovalPlanId = "approver_identity" | "decision_envelope" | "consent_scope" | "timeout_policy" | "audit_linkage";

export type OfficeControlledMutationHumanApprovalPlanItem = {
  id: OfficeControlledMutationHumanApprovalPlanId;
  label: string;
  status: "not_recorded";
  requiredFields: Array<"approver_identity_ref" | "decision_envelope_ref" | "consent_scope" | "timeout_policy" | "audit_linkage_ref">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeControlledMutationHumanApprovalPlan = {
  stageLabel: "Controlled Mutation Human Approval Plan 1";
  title: string;
  enabledControls: 0;
  approvalRecordingEnabled: false;
  rollbackExecutionEnabled: false;
  auditWriteEnabled: false;
  dryRunExecutionEnabled: false;
  proposalCreationEnabled: false;
  mutationRouteEnabled: false;
  executionEnabled: false;
  dispatchEnabled: false;
  approvalItems: OfficeControlledMutationHumanApprovalPlanItem[];
  rollbackVerificationPlanSnapshot: Pick<OfficeControlledMutationRollbackVerificationPlan, "rollbackExecutionEnabled" | "auditWriteEnabled" | "executionEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

export type OfficeControlledMutationAuthoritySummaryId = "authority_scope" | "adapter_readiness" | "approval_linkage" | "dry_run_evidence" | "audit_rollback_linkage";

export type OfficeControlledMutationAuthoritySummaryItem = {
  id: OfficeControlledMutationAuthoritySummaryId;
  label: string;
  status: "blocked";
  requiredFields: Array<"authority_scope_ref" | "adapter_readiness_ref" | "approval_linkage_ref" | "dry_run_evidence_ref" | "audit_rollback_linkage_ref">;
  safeSummary: string;
  rawExcluded: true;
};

export type OfficeControlledMutationAuthoritySummary = {
  stageLabel: "Controlled Mutation Authority Summary 1";
  title: string;
  enabledControls: 0;
  authorityGrantEnabled: false;
  approvalRecordingEnabled: false;
  rollbackExecutionEnabled: false;
  auditWriteEnabled: false;
  dryRunExecutionEnabled: false;
  proposalCreationEnabled: false;
  mutationRouteEnabled: false;
  executionEnabled: false;
  dispatchEnabled: false;
  authorityItems: OfficeControlledMutationAuthoritySummaryItem[];
  humanApprovalPlanSnapshot: Pick<OfficeControlledMutationHumanApprovalPlan, "approvalRecordingEnabled" | "rollbackExecutionEnabled" | "executionEnabled">;
  safeBoundary: string;
  safeProjectionOnly: true;
};

const OFFICE_RPG_ROOMS: Array<{ id: OfficeRpgRoomId; label: string }> = [
  { id: "command", label: "Command Room" },
  { id: "agent_desks", label: "Agent Desks" },
  { id: "task_board", label: "Task Board" },
  { id: "cron_room", label: "Cron Room" },
  { id: "source_archive", label: "Source Archive" },
  { id: "incident_corner", label: "Incident Corner" },
];

function rpgPosition(index: number, room: OfficeRpgRoomId): OfficeRpgSceneEntity["positionHint"] {
  const anchors: Record<OfficeRpgRoomId, { x: number; y: number; lane: string }> = {
    command: { x: 14, y: 14, lane: "north" },
    agent_desks: { x: 26, y: 30, lane: "agent" },
    task_board: { x: 68, y: 30, lane: "task" },
    cron_room: { x: 26, y: 68, lane: "cron" },
    source_archive: { x: 68, y: 68, lane: "source" },
    incident_corner: { x: 86, y: 18, lane: "incident" },
  };
  const anchor = anchors[room];
  return {
    x: Math.min(92, anchor.x + (index % 3) * 6),
    y: Math.min(88, anchor.y + Math.floor(index / 3) * 7),
    lane: anchor.lane,
  };
}

function rpgSeverityRank(severity: OfficeRpgSeverity): number {
  if (severity === "danger") return 4;
  if (severity === "warning") return 3;
  if (severity === "info") return 2;
  return 1;
}

function maxRpgSeverity(values: OfficeRpgSeverity[]): OfficeRpgSeverity {
  return values.reduce<OfficeRpgSeverity>((selected, value) => (rpgSeverityRank(value) > rpgSeverityRank(selected) ? value : selected), "normal");
}

function rpgStatusFromWorkStatus(value: unknown): OfficeRpgStatus {
  const status = String(value ?? "").toLowerCase();
  if (status.includes("block")) return "blocked";
  if (status.includes("fail") || status.includes("error")) return "failed";
  if (status.includes("done") || status.includes("complete") || status.includes("archive")) return "completed";
  if (status.includes("run") || status.includes("progress") || status.includes("active")) return "working";
  if (status.includes("review") || status.includes("ready") || status.includes("todo") || status.includes("triage") || status.includes("open")) return "waiting";
  return "unknown";
}

function rpgStatusFromAutomation(row: Record<string, unknown>): OfficeRpgStatus {
  const text = `${String(row.state ?? "")} ${String(row.last_status ?? "")}`.toLowerCase();
  if (text.includes("error") || text.includes("fail")) return "failed";
  if (text.includes("run") || text.includes("active")) return "working";
  if (text.includes("sched") || text.includes("ready")) return "waiting";
  if (text.includes("done") || text.includes("complete")) return "completed";
  return "idle";
}

function rpgSeverityFromStatus(status: OfficeRpgStatus): OfficeRpgSeverity {
  if (status === "blocked" || status === "failed") return "danger";
  if (status === "warning" || status === "waiting") return "warning";
  if (status === "working" || status === "completed") return "info";
  return "normal";
}

function rpgStatusFromSourceStatus(status: OfficeSourceStatus): OfficeRpgStatus {
  if (status === "error") return "failed";
  if (status === "partial" || status === "missing" || status === "unavailable") return "warning";
  return "idle";
}

function rpgSeverityFromSourceStatus(status: OfficeSourceStatus, warningCount = 0): OfficeRpgSeverity {
  if (status === "error") return "danger";
  if (status === "partial" || status === "missing" || status === "unavailable" || warningCount > 0) return "warning";
  return "normal";
}

function rpgRoomFromEventRoom(value: unknown): OfficeRpgRoomId {
  if (value === "work" || value === "task_board") return "task_board";
  if (value === "automation" || value === "cron_room") return "cron_room";
  if (value === "routing" || value === "source_archive") return "source_archive";
  if (value === "sessions" || value === "agent_desks") return "agent_desks";
  return "command";
}

function rpgSeverityFromTone(value: unknown): OfficeRpgSeverity {
  if (value === "negative" || value === "danger" || value === "error") return "danger";
  if (value === "warning") return "warning";
  if (value === "positive" || value === "info") return "info";
  return "normal";
}

function rpgTimestamp(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 && Number.isFinite(Date.parse(value)) ? value : null;
}

export function buildOfficeRpgScene(state: OfficeState): OfficeRpgScene {
  const entities: OfficeRpgSceneEntity[] = [];
  const incidentSeverities: OfficeRpgSeverity[] = [];

  state.agents.slice(0, 12).forEach((agent, index) => {
    const statusText = String(agent.status ?? "").toLowerCase();
    const status: OfficeRpgStatus = statusText.includes("active") || statusText.includes("run") ? "working" : statusText.includes("idle") ? "idle" : statusText.length > 0 ? "waiting" : "unknown";
    entities.push({
      id: `agent-${index}`,
      kind: "agent",
      label: `직원 ${index + 1}`,
      status,
      room: "agent_desks",
      positionHint: rpgPosition(index, "agent_desks"),
      severity: rpgSeverityFromStatus(status),
      lastEventAt: null,
      summary: `세션/에이전트 안전 상태 ${status}`,
      linkTarget: { type: "inspector", ref: `agents:${index}` },
    });
  });

  state.work_items.slice(0, 12).forEach((item, index) => {
    const status = rpgStatusFromWorkStatus(item.status);
    const severity = rpgSeverityFromStatus(status);
    if (severity === "danger") incidentSeverities.push(severity);
    entities.push({
      id: `work-${index}`,
      kind: "work_item",
      label: `업무 ${index + 1}`,
      status,
      room: "task_board",
      positionHint: rpgPosition(index, "task_board"),
      severity,
      lastEventAt: rpgTimestamp(item.updated_at) ?? rpgTimestamp(item.last_heartbeat_at),
      summary: `업무 안전 상태 ${status}`,
      linkTarget: { type: "inspector", ref: `work_items:${index}` },
    });
    if (status === "completed") {
      entities.push({
        id: `report-${entities.filter((entity) => entity.kind === "report").length}`,
        kind: "report",
        label: "완료 보고",
        status: "completed",
        room: "task_board",
        positionHint: rpgPosition(index + 6, "task_board"),
        severity: "info",
        lastEventAt: rpgTimestamp(item.updated_at),
        summary: "완료 상태 업무의 안전 보고 표시",
        linkTarget: { type: "filter", ref: "work_items:completed" },
      });
    }
  });

  state.automations.slice(0, 8).forEach((job, index) => {
    const status = rpgStatusFromAutomation(job);
    const severity = rpgSeverityFromStatus(status);
    if (severity === "danger") incidentSeverities.push(severity);
    entities.push({
      id: `cron-${index}`,
      kind: "cron_job",
      label: `자동화 ${index + 1}`,
      status,
      room: "cron_room",
      positionHint: rpgPosition(index, "cron_room"),
      severity,
      lastEventAt: rpgTimestamp(job.next_run_at) ?? rpgTimestamp(job.last_run_at),
      summary: `자동화 안전 상태 ${status}`,
      linkTarget: { type: "inspector", ref: `automations:${index}` },
    });
  });

  state.data_sources.slice(0, 10).forEach((source, index) => {
    const warningCount = Math.max(0, source.warning_count ?? 0);
    const status = rpgStatusFromSourceStatus(source.status);
    const severity = rpgSeverityFromSourceStatus(source.status, warningCount);
    if (severity === "danger" || severity === "warning") incidentSeverities.push(severity);
    entities.push({
      id: `source-${index}`,
      kind: "source",
      label: `소스 ${index + 1}`,
      status,
      room: "source_archive",
      positionHint: rpgPosition(index, "source_archive"),
      severity,
      lastEventAt: rpgTimestamp(source.checked_at),
      summary: `소스 상태 ${source.status} · 경고 ${warningCount}`,
      linkTarget: { type: "safe_ref", ref: `data_sources:${index}` },
    });
  });

  const incidentCount = incidentSeverities.length;
  if (incidentCount > 0) {
    entities.push({
      id: "incident-summary",
      kind: "incident",
      label: "확인 필요",
      status: incidentSeverities.some((severity) => severity === "danger") ? "blocked" : "warning",
      room: "incident_corner",
      positionHint: rpgPosition(0, "incident_corner"),
      severity: maxRpgSeverity(incidentSeverities),
      lastEventAt: null,
      summary: `확인 필요 안전 신호 ${incidentCount}개`,
      linkTarget: { type: "filter", ref: "incidents" },
    });
  }

  const recentEvents = state.events.slice(0, 6).map((event, index) => ({
    id: `event-${index}`,
    label: "최근 안전 이벤트",
    room: rpgRoomFromEventRoom(event.room_id ?? event.roomId),
    severity: rpgSeverityFromTone(event.tone),
    at: rpgTimestamp(event.generated_at) ?? rpgTimestamp(event.created_at),
  }));

  const workStatuses = state.work_items.map((item) => rpgStatusFromWorkStatus(item.status));
  const cronStatuses = state.automations.map((job) => rpgStatusFromAutomation(job));
  const rooms: OfficeRpgScene["rooms"] = OFFICE_RPG_ROOMS.map((room): OfficeRpgScene["rooms"][number] => {
    if (room.id === "command") {
      return { id: room.id, label: room.label, summary: `${state.mode} · 안전 DTO 관측`, severity: maxRpgSeverity([...incidentSeverities, recentEvents.length > 0 ? "info" : "normal"]), counts: { entities: entities.length, events: recentEvents.length } };
    }
    if (room.id === "agent_desks") {
      return { id: room.id, label: room.label, summary: `에이전트 ${state.agents.length}개`, severity: state.agents.length > 0 ? "info" : "normal", counts: { agents: state.agents.length } };
    }
    if (room.id === "task_board") {
      const blocked = workStatuses.filter((status) => status === "blocked").length;
      const completed = workStatuses.filter((status) => status === "completed").length;
      const active = workStatuses.filter((status) => status === "working").length;
      return { id: room.id, label: room.label, summary: `작업 ${state.work_items.length}개 · 막힘 ${blocked}개`, severity: blocked > 0 ? "danger" : state.work_items.length > 0 ? "info" : "normal", counts: { work_items: state.work_items.length, active, blocked, completed } };
    }
    if (room.id === "cron_room") {
      const failed = cronStatuses.filter((status) => status === "failed").length;
      return { id: room.id, label: room.label, summary: `자동화 ${state.automations.length}개 · 실패 ${failed}개`, severity: failed > 0 ? "danger" : state.automations.length > 0 ? "info" : "normal", counts: { automations: state.automations.length, failed } };
    }
    if (room.id === "source_archive") {
      const warnings = state.data_sources.filter((source) => rpgSeverityFromSourceStatus(source.status, source.warning_count ?? 0) !== "normal").length;
      return { id: room.id, label: room.label, summary: `소스 ${state.data_sources.length}개 · 확인 ${warnings}개`, severity: warnings > 0 ? "warning" : state.data_sources.length > 0 ? "info" : "normal", counts: { sources: state.data_sources.length, warnings } };
    }
    return { id: room.id, label: room.label, summary: `확인 필요 ${incidentCount}개`, severity: incidentCount > 0 ? maxRpgSeverity(incidentSeverities) : "normal", counts: { incidents: incidentCount } };
  });

  return {
    schemaVersion: 1,
    generatedAt: state.generated_at,
    mode: "read_only",
    rooms,
    entities,
    recentEvents,
    safety: {
      factual: true,
      readOnly: true,
      source: "OfficeState",
      omittedRawSections: state.redactions.omitted_sections.filter((section) => typeof section === "string" && section.length > 0).map((_, index) => `omitted-${index + 1}`),
    },
  };
}

function rpgRoomCount(scene: OfficeRpgScene, roomId: OfficeRpgRoomId, key: string): number {
  const value = scene.rooms.find((room) => room.id === roomId)?.counts[key];
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : 0;
}

function rpgStoryboardTone(count: number, fallback: OfficeRpgSeverity = "info"): OfficeRpgSeverity {
  return count > 0 ? fallback : "normal";
}

export function buildOfficeRpgMissionStoryboard(scene: OfficeRpgScene): OfficeRpgMissionStoryboard {
  const agentCount = rpgRoomCount(scene, "agent_desks", "agents");
  const workCount = rpgRoomCount(scene, "task_board", "work_items");
  const blockedCount = rpgRoomCount(scene, "task_board", "blocked");
  const sourceCount = rpgRoomCount(scene, "source_archive", "sources");
  const sourceWarningCount = rpgRoomCount(scene, "source_archive", "warnings");

  return {
    stageLabel: "First Implementation Scene",
    title: "지식위키 요청 → 통합 운영실 처리 흐름",
    summary: "사용자 요청이 오케스트레이터, 운영 보드, 근거 레이어, 리뷰/승인 경계로 흘러가는 첫 실제 화면입니다",
    approvalBoundary: "최종 저장/NAS 반영은 사용자 승인 전까지 UI에서 실행하지 않습니다",
    safeProjectionOnly: true,
    steps: [
      {
        id: "request",
        label: "요청 접수",
        room: "command",
        detail: "사용자가 지식위키 글 작성을 요청하면 운영실은 읽기 전용 흐름으로 먼저 표시합니다",
        tone: "info",
      },
      {
        id: "orchestrate",
        label: "오케스트레이터 분해",
        room: "agent_desks",
        detail: `직원 ${agentCount}개 안전 상태를 바탕으로 역할 분담을 보여줍니다`,
        tone: rpgStoryboardTone(agentCount),
      },
      {
        id: "board",
        label: "운영 보드 배치",
        room: "task_board",
        detail: `작업 카드 ${workCount}개 · 막힘 ${blockedCount}개를 안전 집계로 표시합니다`,
        tone: blockedCount > 0 ? "warning" : rpgStoryboardTone(workCount),
      },
      {
        id: "evidence",
        label: "근거 수집",
        room: "source_archive",
        detail: `Paperclip/sourceTags 소스 ${sourceCount}개 · 확인 ${sourceWarningCount}개를 원문 없이 연결합니다`,
        tone: sourceWarningCount > 0 ? "warning" : rpgStoryboardTone(sourceCount),
      },
      {
        id: "review",
        label: "검토 대기",
        room: "incident_corner",
        detail: blockedCount > 0 ? "리뷰/승인이 필요한 항목을 주의 구역으로 올립니다" : "검토 구역은 승인 필요 신호가 생길 때 강조됩니다",
        tone: blockedCount > 0 ? "warning" : "normal",
      },
      {
        id: "approval",
        label: "승인 후 저장",
        room: "command",
        detail: "NAS Keeper 역할은 나중에 승인된 저장 요청만 실행하도록 분리합니다",
        tone: "normal",
      },
    ],
  };
}

export function buildOfficeRpgOrchestratorDesk(scene: OfficeRpgScene): OfficeRpgOrchestratorDesk {
  const agentCount = rpgRoomCount(scene, "agent_desks", "agents");
  const workCount = rpgRoomCount(scene, "task_board", "work_items");
  const blockedCount = rpgRoomCount(scene, "task_board", "blocked");
  const sourceCount = rpgRoomCount(scene, "source_archive", "sources");
  const sourceWarningCount = rpgRoomCount(scene, "source_archive", "warnings");
  const incidentCount = rpgRoomCount(scene, "incident_corner", "incidents");

  return {
    stageLabel: "Orchestrator Desk 1",
    title: "오케스트레이터 데스크 · 안전 분해 미리보기",
    intent: "사용자 지시를 실행이 아니라 운영 가능한 요청 흐름으로 정리합니다",
    actionBoundary: "이 데스크는 UserInstructionSubmitted/ActionRequested 같은 요청 형태만 보여주며 실행 이벤트를 만들지 않습니다",
    safeProjectionOnly: true,
    cards: [
      {
        id: "intake",
        label: "지시 접수",
        value: "요청 1건",
        detail: "자연어 지시는 항상 오케스트레이터 수준 요청으로 들어옵니다",
        tone: "neutral",
      },
      {
        id: "decompose",
        label: "작업 분해",
        value: `작업 ${workCount}개`,
        detail: workCount > 0 ? "운영 보드에 놓일 단위를 안전 집계로 미리 보여줍니다" : "작업 단위가 생기면 운영 보드로 분해됩니다",
        tone: rpgStoryboardTone(workCount, "info") === "normal" ? "neutral" : "info",
      },
      {
        id: "assign",
        label: "역할 배치",
        value: `직원 ${agentCount}명`,
        detail: "검색 worker, Reviewer, Wiki Writer 후보를 실행 없이 배치 상태로만 표시합니다",
        tone: rpgStoryboardTone(agentCount, "info") === "normal" ? "neutral" : "info",
      },
      {
        id: "evidence",
        label: "근거 요구",
        value: `소스 ${sourceCount}개`,
        detail: "Paperclip/sourceTags 근거 필요 여부를 원문 없이 신호화합니다",
        tone: sourceWarningCount > 0 ? "warning" : sourceCount > 0 ? "info" : "neutral",
      },
      {
        id: "review",
        label: "리뷰 게이트",
        value: `막힘 ${blockedCount}개`,
        detail: incidentCount > 0 || blockedCount > 0 ? "검토/승인 필요 신호를 실행 전 게이트로 올립니다" : "리뷰 신호가 생기면 승인 흐름으로 연결됩니다",
        tone: blockedCount > 0 || incidentCount > 0 ? "warning" : "neutral",
      },
      {
        id: "authority",
        label: "권한 경계",
        value: "실행 없음",
        detail: "저장, 배포, Kanban write, watcher는 별도 승인 전까지 발생하지 않습니다",
        tone: "neutral",
      },
    ],
  };
}

export function buildOfficeRpgKanbanBoardFacility(scene: OfficeRpgScene): OfficeRpgKanbanBoardFacility {
  const workCount = rpgRoomCount(scene, "task_board", "work_items");
  const activeCount = rpgRoomCount(scene, "task_board", "active");
  const blockedCount = rpgRoomCount(scene, "task_board", "blocked");
  const doneCount = rpgRoomCount(scene, "task_board", "completed");
  const intakeCount = Math.max(0, workCount - activeCount - blockedCount - doneCount);

  return {
    stageLabel: "Kanban Board 1",
    title: "운영 보드 · 안전 작업판 미리보기",
    sourceOfTruth: "VPS ai-office Kanban",
    writeBoundary: "이 보드는 작업 상태를 안전 투영으로만 보여주며 Kanban write/transition을 실행하지 않습니다",
    safeProjectionOnly: true,
    lanes: [
      {
        id: "intake",
        label: "접수",
        value: `${intakeCount}개`,
        detail: "새 요청이 작업 카드 후보가 되는 위치입니다",
        tone: intakeCount > 0 ? "info" : "neutral",
      },
      {
        id: "active",
        label: "진행",
        value: `${activeCount}개`,
        detail: "진행 중인 작업 수만 안전 집계로 표시합니다",
        tone: activeCount > 0 ? "info" : "neutral",
      },
      {
        id: "blocked",
        label: "검토 필요",
        value: `${blockedCount}개`,
        detail: "오케스트레이터/Reviewer 확인이 필요한 카드 수입니다",
        tone: blockedCount > 0 ? "warning" : "neutral",
      },
      {
        id: "done",
        label: "완료",
        value: `${doneCount}개`,
        detail: "완료된 카드도 원문 없이 수량만 유지합니다",
        tone: "neutral",
      },
      {
        id: "clerk",
        label: "Board Clerk",
        value: "정리 담당",
        detail: "상태 설명 역할만 표시하며 작업 변경 권한은 없습니다",
        tone: "neutral",
      },
      {
        id: "boundary",
        label: "전환 경계",
        value: "쓰기 없음",
        detail: "drag/drop, 상태 전환, 카드 생성은 별도 승인된 mutation 모델 이후입니다",
        tone: "neutral",
      },
    ],
  };
}

export function buildOfficeRpgSourceArchiveFacility(scene: OfficeRpgScene): OfficeRpgSourceArchiveFacility {
  const sourceCount = rpgRoomCount(scene, "source_archive", "sources");
  const warningCount = rpgRoomCount(scene, "source_archive", "warnings");
  const workCount = rpgRoomCount(scene, "task_board", "work_items");

  return {
    stageLabel: "Paperclip Source Archive 1",
    title: "근거 자료실 · 안전 근거 선반 미리보기",
    rawBoundary: "이 자료실은 safe sourceTag/manifest posture만 보여주며 원문, 경로, 본문, projection transfer/promote를 실행하지 않습니다",
    safeProjectionOnly: true,
    shelves: [
      {
        id: "evidence",
        label: "근거 선반",
        value: `소스 ${sourceCount}개`,
        detail: "Paperclip/source archive 항목을 원문 없이 수량과 상태로만 정리합니다",
        tone: sourceCount > 0 ? "info" : "neutral",
      },
      {
        id: "sourceTags",
        label: "sourceTags",
        value: "태그 자세",
        detail: warningCount > 0 ? "확인 필요한 태그/소스 신호가 있어 리뷰 게이트로 연결합니다" : "태그 이름 대신 안전 자세만 표시합니다",
        tone: warningCount > 0 ? "warning" : "info",
      },
      {
        id: "manifests",
        label: "안전 manifest",
        value: `후보 ${sourceCount}개`,
        detail: "검증된 safe manifest 후보 수만 보여주고 bundle id/path는 숨깁니다",
        tone: sourceCount > 0 ? "info" : "neutral",
      },
      {
        id: "validation",
        label: "검증 선반",
        value: warningCount > 0 ? `확인 ${warningCount}개` : "정상",
        detail: "validator 결과는 pass/warning 수준의 posture로만 이어집니다",
        tone: warningCount > 0 ? "warning" : "neutral",
      },
      {
        id: "boundary",
        label: "원문 경계",
        value: "원문 없음",
        detail: "경로, 본문, 토큰, 프롬프트, 로그는 자료실 카드에 들어오지 않습니다",
        tone: "neutral",
      },
      {
        id: "handoff",
        label: "리뷰 연결",
        value: `작업 ${workCount}개`,
        detail: "운영 보드 작업과 리뷰 코너를 safe ref 수준에서만 이어줍니다",
        tone: workCount > 0 ? "info" : "neutral",
      },
    ],
  };
}

export function buildOfficeRpgReviewCornerFacility(scene: OfficeRpgScene): OfficeRpgReviewCornerFacility {
  const workCount = rpgRoomCount(scene, "task_board", "work_items");
  const blockedCount = rpgRoomCount(scene, "task_board", "blocked");
  const sourceCount = rpgRoomCount(scene, "source_archive", "sources");
  const sourceWarningCount = rpgRoomCount(scene, "source_archive", "warnings");
  const failedAutomationCount = rpgRoomCount(scene, "cron_room", "failed");
  const incidentCount = rpgRoomCount(scene, "incident_corner", "incidents");

  return {
    stageLabel: "Review Corner 1",
    title: "리뷰 코너 · 안전 승인 대기 미리보기",
    approvalBoundary: "이 리뷰 코너는 승인 필요 posture만 보여주며 approve/reject, Kanban transition, 저장, 전송, 서비스 작업을 실행하지 않습니다",
    safeProjectionOnly: true,
    stations: [
      {
        id: "queue",
        label: "검토 큐",
        value: `작업 ${workCount}개`,
        detail: "운영 보드의 작업 수를 승인 전 대기열 posture로만 보여줍니다",
        tone: workCount > 0 ? "info" : "neutral",
      },
      {
        id: "blocked",
        label: "막힘",
        value: `${blockedCount}개`,
        detail: "막힌 작업은 원문 없이 확인 필요 수량으로만 표시합니다",
        tone: blockedCount > 0 ? "warning" : "neutral",
      },
      {
        id: "source",
        label: "근거 확인",
        value: `소스 ${sourceCount}개`,
        detail: sourceWarningCount > 0 ? "Paperclip/source 경고가 리뷰 확인 대상으로 연결됩니다" : "근거 레이어는 safe source posture만 전달합니다",
        tone: sourceWarningCount > 0 ? "warning" : sourceCount > 0 ? "info" : "neutral",
      },
      {
        id: "automation",
        label: "자동화 확인",
        value: `실패 ${failedAutomationCount}개`,
        detail: "자동화 실패 여부만 집계하고 스크립트/로그는 표시하지 않습니다",
        tone: failedAutomationCount > 0 ? "warning" : "neutral",
      },
      {
        id: "escalation",
        label: "에스컬레이션",
        value: `신호 ${incidentCount}개`,
        detail: "리뷰가 필요한 안전 신호를 승인 콘솔 이전 단계로 모읍니다",
        tone: incidentCount > 0 ? "warning" : "neutral",
      },
      {
        id: "boundary",
        label: "권한 경계",
        value: "실행 없음",
        detail: "승인, 거절, 저장, 전송, 상태 전환은 다음 별도 권한 모델 전까지 비활성입니다",
        tone: "neutral",
      },
    ],
  };
}

export function buildOfficeRpgApprovalConsoleFacility(scene: OfficeRpgScene): OfficeRpgApprovalConsoleFacility {
  const blockedCount = rpgRoomCount(scene, "task_board", "blocked");
  const sourceWarningCount = rpgRoomCount(scene, "source_archive", "warnings");
  const failedAutomationCount = rpgRoomCount(scene, "cron_room", "failed");
  const approvalSignalCount = blockedCount + sourceWarningCount;
  const auditSignalCount = sourceWarningCount + failedAutomationCount;

  return {
    stageLabel: "Approval Console 1",
    title: "승인 콘솔 · 비실행 승인 자세 미리보기",
    decisionBoundary: "이 콘솔은 승인 자세와 감사 handoff만 보여주며 approve/reject, 저장, 전송, Kanban transition, projection promote를 실행하지 않습니다",
    safeProjectionOnly: true,
    controls: [
      {
        id: "summary",
        label: "승인 필요",
        value: `신호 ${approvalSignalCount}개`,
        detail: "막힘/리뷰 신호를 사람 승인 전 posture로만 요약합니다",
        tone: approvalSignalCount > 0 ? "warning" : "neutral",
        disabled: true,
      },
      {
        id: "human",
        label: "사람 결정",
        value: "대기",
        detail: "최종 판단은 UI 자동 실행이 아니라 별도 사용자 승인으로만 넘어갑니다",
        tone: approvalSignalCount > 0 ? "info" : "neutral",
        disabled: true,
      },
      {
        id: "dryRun",
        label: "dry-run only",
        value: "비활성",
        detail: "dry-run 결과를 설명할 수는 있지만 여기서 promote/저장을 실행하지 않습니다",
        tone: "neutral",
        disabled: true,
      },
      {
        id: "audit",
        label: "감사 handoff",
        value: `확인 ${auditSignalCount}개`,
        detail: "근거/자동화 확인 신호를 감사 메모 수준으로만 넘깁니다",
        tone: auditSignalCount > 0 ? "warning" : "neutral",
        disabled: true,
      },
      {
        id: "boundary",
        label: "권한 모델",
        value: "분리됨",
        detail: "mutation authority는 별도 설계/승인 전까지 이 화면에 존재하지 않습니다",
        tone: "neutral",
        disabled: true,
      },
      {
        id: "disabled",
        label: "실행 버튼",
        value: "없음",
        detail: "approve/reject/save/send/transition 버튼을 렌더링하지 않습니다",
        tone: "neutral",
        disabled: true,
      },
    ],
  };
}

function approvalValidatorPosture(warningCount: number, failureCount: number): OfficeApprovalRequestView["dryRunEvidence"]["validatorPosture"] {
  if (failureCount > 0) return "fail";
  if (warningCount > 0) return "warning";
  return "pass";
}

export function buildOfficeApprovalRequestView(state: OfficeState): OfficeApprovalRequestView {
  const blockedWorkCount = state.work_items.filter((item) => textField(item, "status") === "blocked").length;
  const reviewWorkCount = state.work_items.filter((item) => textField(item, "status") === "review").length;
  const sourceWarningCount = state.data_sources.filter((source) => source.status !== "ok" || safeWorkbenchCount(source.warning_count) > 0).length;
  const failedAutomationCount = state.automations.filter((automation) => {
    const text = `${textField(automation, "state")} ${textField(automation, "last_status")}`.toLowerCase();
    return text.includes("error") || text.includes("fail");
  }).length;
  const projectionRejectedCount = safeWorkbenchCount(state.projection_cache?.rejected?.count);
  const projectionValidator = String(state.projection_cache?.active?.validator?.result ?? "").toLowerCase();
  const projectionNeedsReview = Boolean(state.projection_cache?.active) && (projectionRejectedCount > 0 || projectionValidator === "warning" || projectionValidator === "fail");
  const requests: OfficeApprovalRequestRow[] = [];

  if (blockedWorkCount > 0) {
    requests.push({
      requestRef: "request:kanban-transition-preview",
      actionKind: "kanban_transition",
      targetKind: "kanban_card",
      targetRef: `kanban-card:blocked-${blockedWorkCount}`,
      reasonSummary: `blocked work ${blockedWorkCount}개를 safe transition 후보로만 표시`,
      evidenceCount: blockedWorkCount + sourceWarningCount,
      hypothetical: true,
      orchestratorRequired: true,
      humanApprovalRequired: true,
    });
  }

  if (projectionNeedsReview) {
    requests.push({
      requestRef: "request:projection-promote-preview",
      actionKind: "projection_promote",
      targetKind: "projection_bundle",
      targetRef: "projection-bundle:active",
      reasonSummary: `projection review ${projectionRejectedCount + sourceWarningCount}개를 safe dry-run 후보로만 표시`,
      evidenceCount: Math.max(1, projectionRejectedCount + sourceWarningCount),
      hypothetical: true,
      orchestratorRequired: true,
      humanApprovalRequired: true,
    });
  }

  if (failedAutomationCount > 0) {
    requests.push({
      requestRef: "request:watcher-enable-preview",
      actionKind: "watcher_enable_request",
      targetKind: "watcher",
      targetRef: `watcher:safe-${failedAutomationCount}`,
      reasonSummary: `automation failure ${failedAutomationCount}개를 watcher request 후보로만 표시`,
      evidenceCount: failedAutomationCount,
      hypothetical: true,
      orchestratorRequired: true,
      humanApprovalRequired: true,
    });
  }

  const warningCount = sourceWarningCount + projectionRejectedCount + reviewWorkCount;
  const failureCount = failedAutomationCount;
  const validatorPosture = approvalValidatorPosture(warningCount, failureCount);

  return {
    stageLabel: "Approval Request View 1",
    title: "승인 요청 자세 · 읽기 전용 미리보기",
    authorityLevel: "display_only",
    enabledControls: 0,
    requests,
    dryRunEvidence: {
      result: requests.length > 0 ? "needs_more_evidence" : "blocked",
      validatorPosture,
      affectedSafeCounts: {
        blockedWork: blockedWorkCount,
        reviewWork: reviewWorkCount,
        sourceWarnings: sourceWarningCount,
        failedAutomations: failedAutomationCount,
        projectionRejected: projectionRejectedCount,
      },
      rawExcluded: true,
    },
    humanDecision: {
      status: "not_requested",
      scope: "single_action_only",
      enabled: false,
    },
    auditReadiness: {
      eventKind: "action_requested",
      resultPosture: requests.length > 0 ? "warning" : "info",
      safeSummary: `request posture only · hypothetical ${requests.length}개 · execution disabled`,
    },
    safeProjectionOnly: true,
  };
}

export function buildOfficeApprovalAuditTimeline(requestView: OfficeApprovalRequestView): OfficeApprovalAuditTimeline {
  const requestCount = requestView.requests.length;
  const dryRunPosture = requestView.dryRunEvidence.validatorPosture === "fail" ? "blocked" : requestView.dryRunEvidence.validatorPosture === "warning" ? "warning" : "info";
  return {
    stageLabel: "Approval Audit Timeline 1",
    title: "승인 감사 타임라인 · 읽기 전용 미리보기",
    enabledControls: 0,
    writesAuditEvents: false,
    safeBoundary: "timeline posture only · no audit write · no request creation · execution disabled",
    safeProjectionOnly: true,
    steps: [
      {
        id: "request",
        eventKind: "action_requested",
        status: requestCount > 0 ? "ready-preview" : "waiting-preview",
        resultPosture: requestCount > 0 ? "warning" : "info",
        safeSummary: `hypothetical request ${requestCount}개 · no event write`,
        rawExcluded: true,
      },
      {
        id: "dryRun",
        eventKind: "dry_run_completed",
        status: requestCount > 0 ? "waiting-preview" : "blocked-preview",
        resultPosture: dryRunPosture,
        safeSummary: `dry-run evidence ${requestView.dryRunEvidence.result} · validator ${requestView.dryRunEvidence.validatorPosture}`,
        rawExcluded: true,
      },
      {
        id: "decision",
        eventKind: "human_decision_recorded",
        status: "waiting-preview",
        resultPosture: "info",
        safeSummary: `${requestView.humanDecision.status} · ${requestView.humanDecision.scope} · disabled`,
        rawExcluded: true,
      },
      {
        id: "execution",
        eventKind: "execution_blocked",
        status: "blocked-preview",
        resultPosture: "blocked",
        safeSummary: "execution remains blocked until a separate approved authority adapter exists",
        rawExcluded: true,
      },
    ],
  };
}

export function buildOfficeApprovalExecutionGate(timeline: OfficeApprovalAuditTimeline): OfficeApprovalExecutionGate {
  const blockedBy = timeline.steps.filter((step) => step.eventKind === "execution_blocked");
  return {
    stageLabel: "Approval Execution Gate 1",
    title: "승인 실행 게이트 · 실행 권한 없음",
    enabledControls: 0,
    executionAllowed: false,
    browserAffordance: "none",
    blockedBy,
    safeBoundary: "no execution authority · prerequisite posture only · no controls · no writes",
    safeProjectionOnly: true,
    requiredPrerequisites: [
      {
        id: "authority_adapter",
        label: "권한 어댑터",
        status: "missing",
        safeSummary: "separate approved authority adapter required before any execution",
        rawExcluded: true,
      },
      {
        id: "audit_writer",
        label: "감사 이벤트 기록기",
        status: "missing",
        safeSummary: "durable audit writer required before state-changing flow",
        rawExcluded: true,
      },
      {
        id: "rollback_plan",
        label: "롤백 계획",
        status: "missing",
        safeSummary: "rollback evidence and revert path required before action dispatch",
        rawExcluded: true,
      },
      {
        id: "human_confirmation",
        label: "사용자 최종 확인",
        status: "missing",
        safeSummary: "human single-action confirmation required at dispatch time",
        rawExcluded: true,
      },
    ],
  };
}

export function buildOfficeAuthorityAdapterContract(gate: OfficeApprovalExecutionGate): OfficeAuthorityAdapterContract {
  return {
    stageLabel: "Authority Adapter Contract 1",
    title: "권한 어댑터 계약 · 비활성 명세",
    enabledControls: 0,
    dispatchEnabled: false,
    adaptersInstalled: false,
    allowedActionKinds: ["kanban_transition", "projection_promote", "nas_save_request", "watcher_enable_request", "service_restart_request"],
    gateSnapshot: {
      executionAllowed: gate.executionAllowed,
      browserAffordance: gate.browserAffordance,
    },
    safeBoundary: "contract only · disabled adapter · no dispatch · no audit write · no browser control",
    safeProjectionOnly: true,
    requiredFields: [
      {
        id: "request_ref",
        label: "요청 참조",
        required: true,
        status: "missing",
        safeSummary: "stable request reference required before dispatch contract can be satisfied",
        rawExcluded: true,
      },
      {
        id: "dry_run_result",
        label: "드라이런 결과",
        required: true,
        status: "missing",
        safeSummary: "validated dry-run result required before execution planning",
        rawExcluded: true,
      },
      {
        id: "audit_sink",
        label: "감사 기록 대상",
        required: true,
        status: "missing",
        safeSummary: "durable audit sink required before any state-changing adapter",
        rawExcluded: true,
      },
      {
        id: "rollback_ref",
        label: "롤백 참조",
        required: true,
        status: "missing",
        safeSummary: "rollback reference required before dispatch contract can be activated",
        rawExcluded: true,
      },
      {
        id: "human_confirmation_ref",
        label: "사용자 확인 참조",
        required: true,
        status: "missing",
        safeSummary: "single-action human confirmation reference required at execution boundary",
        rawExcluded: true,
      },
    ],
  };
}

export function buildOfficeOrchestratorMediationQueue(contract: OfficeAuthorityAdapterContract): OfficeOrchestratorMediationQueue {
  return {
    stageLabel: "Orchestrator Mediation Queue 1",
    title: "오케스트레이터 중재 대기열 · 읽기 전용",
    enabledControls: 0,
    enqueueEnabled: false,
    candidatePromotionEnabled: false,
    contractSnapshot: {
      dispatchEnabled: contract.dispatchEnabled,
      adaptersInstalled: contract.adaptersInstalled,
    },
    safeBoundary: "queue posture only · no enqueue · no request creation · no adapter promotion · no dispatch",
    safeProjectionOnly: true,
    items: [
      {
        id: "userInstruction",
        intentKind: "user_instruction",
        status: "waiting_for_orchestrator",
        safeSummary: "user natural-language intent would be mediated by the orchestrator before request posture",
        orchestratorRequired: true,
        rawExcluded: true,
      },
      {
        id: "characterQuickAction",
        intentKind: "character_quick_action",
        status: "waiting_for_orchestrator",
        safeSummary: "character quick action remains a mediated intent, not direct execution",
        orchestratorRequired: true,
        rawExcluded: true,
      },
      {
        id: "systemAttention",
        intentKind: "system_attention",
        status: "waiting_for_orchestrator",
        safeSummary: "system attention signal can suggest work but cannot promote itself",
        orchestratorRequired: true,
        rawExcluded: true,
      },
    ],
  };
}

export function buildOfficeWorkerIntentRouting(queue: OfficeOrchestratorMediationQueue): OfficeWorkerIntentRouting {
  return {
    stageLabel: "Worker Intent Routing 1",
    title: "작업자 의도 라우팅 · 배정 없음",
    enabledControls: 0,
    workAssignmentEnabled: false,
    requestCreationEnabled: false,
    dispatchEnabled: false,
    queueSnapshot: {
      enqueueEnabled: queue.enqueueEnabled,
      candidatePromotionEnabled: queue.candidatePromotionEnabled,
    },
    safeBoundary: "routing posture only · no work assignment · no request creation · no enqueue · no dispatch",
    safeProjectionOnly: true,
    routes: [
      {
        id: "routeUserInstruction",
        intentKind: "user_instruction",
        workerRole: "orchestrator",
        targetFacility: "orchestrator_desk",
        status: "routing_posture_only",
        assignmentStatus: "not_assigned",
        safeSummary: "user instruction would route to the orchestrator desk for mediation before any worker task exists",
        rawExcluded: true,
      },
      {
        id: "routeCharacterQuickAction",
        intentKind: "character_quick_action",
        workerRole: "facility_worker",
        targetFacility: "agent_desks",
        status: "routing_posture_only",
        assignmentStatus: "not_assigned",
        safeSummary: "character quick action would map toward worker desks only as a visible routing hint",
        rawExcluded: true,
      },
      {
        id: "routeSystemAttention",
        intentKind: "system_attention",
        workerRole: "safety_reviewer",
        targetFacility: "incident_corner",
        status: "routing_posture_only",
        assignmentStatus: "not_assigned",
        safeSummary: "system attention would surface at the incident corner before any assignment or request creation",
        rawExcluded: true,
      },
    ],
  };
}

export function buildOfficeWorkerFacilityReadiness(routing: OfficeWorkerIntentRouting): OfficeWorkerFacilityReadiness {
  const prerequisiteMap: Record<OfficeWorkerIntentRoutingRoute["targetFacility"], OfficeWorkerFacilityReadinessPrerequisite[]> = {
    orchestrator_desk: [
      {
        id: "orchestrator_mediation_locked",
        label: "오케스트레이터 중재 고정",
        status: "missing",
        safeSummary: "mediated intent must be locked before it can become an assignment candidate",
        rawExcluded: true,
      },
      {
        id: "human_instruction_scope",
        label: "사용자 지시 범위",
        status: "missing",
        safeSummary: "explicit human scope is required before the desk can prepare work",
        rawExcluded: true,
      },
      {
        id: "assignment_audit_sink",
        label: "배정 감사 싱크",
        status: "missing",
        safeSummary: "durable audit sink is required before assignment readiness",
        rawExcluded: true,
      },
    ],
    agent_desks: [
      {
        id: "worker_capacity_snapshot",
        label: "작업자 수용량 스냅샷",
        status: "missing",
        safeSummary: "safe worker capacity posture is required before any work assignment",
        rawExcluded: true,
      },
      {
        id: "request_creation_gate",
        label: "요청 생성 게이트",
        status: "missing",
        safeSummary: "request creation remains blocked until an approved gate exists",
        rawExcluded: true,
      },
      {
        id: "dispatch_adapter_disabled",
        label: "디스패치 어댑터 비활성",
        status: "missing",
        safeSummary: "dispatch adapter is intentionally absent, so the facility is display-only",
        rawExcluded: true,
      },
    ],
    incident_corner: [
      {
        id: "incident_review_policy",
        label: "사고 검토 정책",
        status: "missing",
        safeSummary: "incident review policy is required before safety review work can be assigned",
        rawExcluded: true,
      },
      {
        id: "safe_attention_context",
        label: "안전 주의 컨텍스트",
        status: "missing",
        safeSummary: "attention signals must stay safe and bounded before review routing",
        rawExcluded: true,
      },
      {
        id: "audit_write_gate",
        label: "감사 기록 쓰기 게이트",
        status: "missing",
        safeSummary: "audit writes remain disabled until a separate authority model exists",
        rawExcluded: true,
      },
    ],
  };

  return {
    stageLabel: "Worker Facility Readiness 1",
    title: "작업자 시설 준비도 · 선행조건만 표시",
    enabledControls: 0,
    workAssignmentEnabled: false,
    requestCreationEnabled: false,
    dispatchEnabled: false,
    auditWriteEnabled: false,
    routingSnapshot: {
      workAssignmentEnabled: routing.workAssignmentEnabled,
      requestCreationEnabled: routing.requestCreationEnabled,
      dispatchEnabled: routing.dispatchEnabled,
    },
    safeBoundary: "facility readiness only · no assignment · no request creation · no dispatch · no audit write",
    safeProjectionOnly: true,
    facilities: routing.routes.map((route) => ({
      id: route.targetFacility,
      workerRole: route.workerRole,
      status: "prerequisites_missing",
      assignmentReady: false,
      routeCount: 1,
      prerequisites: prerequisiteMap[route.targetFacility],
      safeSummary: `${route.targetFacility} stays visible as a readiness posture only before any ${route.workerRole} assignment exists`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeWorkerAssignmentCandidateGate(readiness: OfficeWorkerFacilityReadiness): OfficeWorkerAssignmentCandidateGate {
  const blockedBy: OfficeWorkerAssignmentCandidateBlockedReason[] = [
    {
      id: "facility_prerequisites_missing",
      label: "시설 선행조건 미충족",
      status: "blocked",
      safeSummary: "facility readiness prerequisites must be satisfied before assignment candidacy",
      rawExcluded: true,
    },
    {
      id: "approval_execution_blocked",
      label: "승인 실행 게이트 차단",
      status: "blocked",
      safeSummary: "approval execution gate still blocks executable authority",
      rawExcluded: true,
    },
    {
      id: "authority_adapter_missing",
      label: "권한 어댑터 없음",
      status: "blocked",
      safeSummary: "authority adapter contract is not installed for dispatch or state change",
      rawExcluded: true,
    },
    {
      id: "audit_write_disabled",
      label: "감사 쓰기 비활성",
      status: "blocked",
      safeSummary: "audit writes remain disabled until a durable sink is approved",
      rawExcluded: true,
    },
    {
      id: "human_confirmation_missing",
      label: "사용자 확인 없음",
      status: "blocked",
      safeSummary: "human confirmation reference is required before any candidate can advance",
      rawExcluded: true,
    },
  ];

  return {
    stageLabel: "Worker Assignment Candidate Gate 1",
    title: "작업 배정 후보 게이트 · 전부 차단",
    enabledControls: 0,
    assignmentCandidateEnabled: false,
    workAssignmentEnabled: false,
    requestCreationEnabled: false,
    dispatchEnabled: false,
    auditWriteEnabled: false,
    readinessSnapshot: {
      workAssignmentEnabled: readiness.workAssignmentEnabled,
      requestCreationEnabled: readiness.requestCreationEnabled,
      dispatchEnabled: readiness.dispatchEnabled,
      auditWriteEnabled: readiness.auditWriteEnabled,
    },
    safeBoundary: "candidate gate only · no assignment candidate promotion · no request creation · no dispatch · no audit write",
    safeProjectionOnly: true,
    candidates: readiness.facilities.map((facility) => ({
      id: `candidate_${facility.id}`,
      facilityId: facility.id,
      workerRole: facility.workerRole,
      status: "blocked",
      assignmentReady: false,
      blockedBy,
      safeSummary: `${facility.id} cannot become an assignment candidate until readiness, approval, audit, human confirmation, and authority gates exist`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeWorkerRequestDraftPreview(candidateGate: OfficeWorkerAssignmentCandidateGate): OfficeWorkerRequestDraftPreview {
  return {
    stageLabel: "Worker Request Draft Preview 1",
    title: "작업 요청 초안 미리보기 · 생성 없음",
    enabledControls: 0,
    requestCreationEnabled: false,
    requestPersistenceEnabled: false,
    workAssignmentEnabled: false,
    dispatchEnabled: false,
    auditWriteEnabled: false,
    candidateSnapshot: {
      assignmentCandidateEnabled: candidateGate.assignmentCandidateEnabled,
      requestCreationEnabled: candidateGate.requestCreationEnabled,
      dispatchEnabled: candidateGate.dispatchEnabled,
      auditWriteEnabled: candidateGate.auditWriteEnabled,
    },
    safeBoundary: "request draft preview only · no request creation · no persistence · no assignment · no dispatch · no audit write",
    safeProjectionOnly: true,
    drafts: candidateGate.candidates.map((candidate) => ({
      id: `draft_${candidate.facilityId}`,
      candidateRef: candidate.id,
      facilityId: candidate.facilityId,
      workerRole: candidate.workerRole,
      status: "not_created",
      persistenceStatus: "not_persisted",
      safeFields: ["candidate_ref", "facility", "worker_role", "blocked_reasons"],
      blockedReasonCount: candidate.blockedBy.length,
      safeSummary: `${candidate.facilityId} request draft is a safe preview only; no request record exists`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeWorkerHumanConfirmationEnvelope(draftPreview: OfficeWorkerRequestDraftPreview): OfficeWorkerHumanConfirmationEnvelope {
  return {
    stageLabel: "Worker Human Confirmation Envelope 1",
    title: "사람 확인 봉투 · 결정 기록 없음",
    enabledControls: 0,
    decisionRecordingEnabled: false,
    requestCreationEnabled: false,
    requestPersistenceEnabled: false,
    workAssignmentEnabled: false,
    dispatchEnabled: false,
    auditWriteEnabled: false,
    draftSnapshot: {
      requestCreationEnabled: draftPreview.requestCreationEnabled,
      requestPersistenceEnabled: draftPreview.requestPersistenceEnabled,
      dispatchEnabled: draftPreview.dispatchEnabled,
      auditWriteEnabled: draftPreview.auditWriteEnabled,
    },
    safeBoundary: "confirmation envelope only · no decision recording · no request creation · no persistence · no assignment · no dispatch · no audit write",
    safeProjectionOnly: true,
    envelopes: draftPreview.drafts.map((draft) => ({
      id: `confirm_${draft.id}`,
      draftRef: draft.id,
      facilityId: draft.facilityId,
      workerRole: draft.workerRole,
      status: "not_recorded",
      decisionState: "missing",
      requiredFields: ["draft_ref", "human_actor_ref", "decision", "decision_reason", "rollback_ack"],
      safeSummary: `${draft.id} requires an explicit human confirmation envelope before any request can become actionable`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeWorkerAuthorityHandoffEnvelope(confirmationEnvelope: OfficeWorkerHumanConfirmationEnvelope): OfficeWorkerAuthorityHandoffEnvelope {
  return {
    stageLabel: "Worker Authority Handoff Envelope 1",
    title: "권한 인계 봉투 · 어댑터/디스패치 없음",
    enabledControls: 0,
    adapterInstallationEnabled: false,
    dispatchEnabled: false,
    requestCreationEnabled: false,
    workAssignmentEnabled: false,
    auditWriteEnabled: false,
    confirmationSnapshot: {
      decisionRecordingEnabled: confirmationEnvelope.decisionRecordingEnabled,
      dispatchEnabled: confirmationEnvelope.dispatchEnabled,
      auditWriteEnabled: confirmationEnvelope.auditWriteEnabled,
    },
    safeBoundary: "authority handoff envelope only · no adapter installation · no dispatch · no request creation · no assignment · no audit write",
    safeProjectionOnly: true,
    handoffs: confirmationEnvelope.envelopes.map((envelope) => ({
      id: `handoff_${envelope.id}`,
      confirmationRef: envelope.id,
      facilityId: envelope.facilityId,
      workerRole: envelope.workerRole,
      status: "not_handed_off",
      adapterState: "missing",
      requiredFields: ["confirmation_ref", "adapter_contract_ref", "dry_run_result_ref", "audit_sink_ref", "rollback_ref"],
      safeSummary: `${envelope.id} cannot hand off to authority until adapter, dry-run, audit, and rollback references exist`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeWorkerDispatchDryRunEnvelope(authorityHandoff: OfficeWorkerAuthorityHandoffEnvelope): OfficeWorkerDispatchDryRunEnvelope {
  return {
    stageLabel: "Worker Dispatch Dry-Run Envelope 1",
    title: "디스패치 드라이런 봉투 · 실행 없음",
    enabledControls: 0,
    dryRunExecutionEnabled: false,
    dispatchEnabled: false,
    adapterInstallationEnabled: false,
    requestCreationEnabled: false,
    workAssignmentEnabled: false,
    auditWriteEnabled: false,
    handoffSnapshot: {
      adapterInstallationEnabled: authorityHandoff.adapterInstallationEnabled,
      dispatchEnabled: authorityHandoff.dispatchEnabled,
      auditWriteEnabled: authorityHandoff.auditWriteEnabled,
    },
    safeBoundary: "dispatch dry-run envelope only · no dry-run execution · no real dispatch · no adapter installation · no request creation · no assignment · no audit write",
    safeProjectionOnly: true,
    dryRuns: authorityHandoff.handoffs.map((handoff) => ({
      id: `dryrun_${handoff.id}`,
      handoffRef: handoff.id,
      facilityId: handoff.facilityId,
      workerRole: handoff.workerRole,
      status: "not_run",
      executionState: "blocked",
      requiredFields: ["handoff_ref", "simulation_scope", "expected_effects", "rollback_plan", "audit_preview_ref"],
      safeSummary: `${handoff.id} requires a non-executing dry-run envelope before any dispatch can be considered`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeWorkerAuditPreviewEnvelope(dryRunEnvelope: OfficeWorkerDispatchDryRunEnvelope): OfficeWorkerAuditPreviewEnvelope {
  return {
    stageLabel: "Worker Audit Preview Envelope 1",
    title: "감사 프리뷰 봉투 · 이벤트 쓰기 없음",
    enabledControls: 0,
    auditWriteEnabled: false,
    executionEnabled: false,
    dispatchEnabled: false,
    adapterInstallationEnabled: false,
    requestCreationEnabled: false,
    workAssignmentEnabled: false,
    dryRunSnapshot: {
      dryRunExecutionEnabled: dryRunEnvelope.dryRunExecutionEnabled,
      dispatchEnabled: dryRunEnvelope.dispatchEnabled,
      auditWriteEnabled: dryRunEnvelope.auditWriteEnabled,
    },
    safeBoundary: "audit preview envelope only · no audit write · no execution · no dispatch · no adapter installation · no request creation · no assignment",
    safeProjectionOnly: true,
    previews: dryRunEnvelope.dryRuns.map((dryRun) => ({
      id: `audit_${dryRun.id}`,
      dryRunRef: dryRun.id,
      facilityId: dryRun.facilityId,
      workerRole: dryRun.workerRole,
      status: "not_written",
      auditSinkState: "missing",
      requiredFields: ["dry_run_ref", "audit_sink_ref", "event_type", "redaction_policy", "rollback_ref"],
      safeSummary: `${dryRun.id} requires an audit preview envelope before any audit event can be written`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeWorkerRollbackPreviewEnvelope(auditPreviewEnvelope: OfficeWorkerAuditPreviewEnvelope): OfficeWorkerRollbackPreviewEnvelope {
  return {
    stageLabel: "Worker Rollback Preview Envelope 1",
    title: "롤백 프리뷰 봉투 · 롤백 실행 없음",
    enabledControls: 0,
    rollbackExecutionEnabled: false,
    auditWriteEnabled: false,
    executionEnabled: false,
    dispatchEnabled: false,
    adapterInstallationEnabled: false,
    requestCreationEnabled: false,
    workAssignmentEnabled: false,
    auditPreviewSnapshot: {
      auditWriteEnabled: auditPreviewEnvelope.auditWriteEnabled,
      executionEnabled: auditPreviewEnvelope.executionEnabled,
      dispatchEnabled: auditPreviewEnvelope.dispatchEnabled,
    },
    safeBoundary: "rollback preview envelope only · no rollback execution · no audit write · no execution · no dispatch · no adapter installation · no request creation · no assignment",
    safeProjectionOnly: true,
    previews: auditPreviewEnvelope.previews.map((preview) => ({
      id: `rollback_${preview.id}`,
      auditPreviewRef: preview.id,
      facilityId: preview.facilityId,
      workerRole: preview.workerRole,
      status: "not_prepared",
      rollbackState: "missing",
      requiredFields: ["audit_preview_ref", "rollback_scope", "restore_point_ref", "verification_plan", "human_reconfirm_ref"],
      safeSummary: `${preview.id} requires a rollback preview envelope before any reversible execution can be considered`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeWorkerFinalGateChecklist(rollbackPreview: OfficeWorkerRollbackPreviewEnvelope): OfficeWorkerFinalGateChecklist {
  const requiredFields: OfficeWorkerFinalGate["requiredFields"] = ["approved_authority_model", "mutation_route_design", "runtime_scope", "rollback_verified"];
  const gates: Array<{ id: OfficeWorkerFinalGateId; label: string }> = [
    { id: "authority_model", label: "Authority model" },
    { id: "human_confirmation", label: "Human confirmation" },
    { id: "audit_sink", label: "Audit sink" },
    { id: "rollback_plan", label: "Rollback plan" },
    { id: "adapter_contract", label: "Adapter contract" },
    { id: "runtime_boundary", label: "Runtime boundary" },
  ];
  return {
    stageLabel: "Worker Final Gate Checklist 1",
    title: "최종 게이트 체크리스트 · 컨트롤 비활성",
    enabledControls: 0,
    controlProposalEnabled: false,
    rollbackExecutionEnabled: false,
    auditWriteEnabled: false,
    executionEnabled: false,
    dispatchEnabled: false,
    adapterInstallationEnabled: false,
    requestCreationEnabled: false,
    workAssignmentEnabled: false,
    rollbackPreviewSnapshot: {
      rollbackExecutionEnabled: rollbackPreview.rollbackExecutionEnabled,
      auditWriteEnabled: rollbackPreview.auditWriteEnabled,
      dispatchEnabled: rollbackPreview.dispatchEnabled,
    },
    safeBoundary: "final gate checklist only · no controls enabled · no rollback execution · no audit write · no execution · no dispatch · no adapter installation · no request creation · no assignment",
    safeProjectionOnly: true,
    gates: gates.map((gate) => ({
      id: gate.id,
      label: gate.label,
      status: "blocked",
      requiredFields,
      safeSummary: `${gate.label} remains blocked until explicit controlled-mutation authority exists`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeControlledMutationProposalContract(finalGateChecklist: OfficeWorkerFinalGateChecklist): OfficeControlledMutationProposalContract {
  const requiredFields: OfficeControlledMutationProposalContractItem["requiredFields"] = ["proposal_ref", "authority_ref", "dry_run_ref", "audit_ref", "rollback_ref", "human_approval_ref"];
  const contracts: Array<{ id: OfficeControlledMutationProposalContractId; label: string }> = [
    { id: "proposal_identity", label: "Proposal identity" },
    { id: "authority_reference", label: "Authority reference" },
    { id: "dry_run_evidence", label: "Dry-run evidence" },
    { id: "audit_plan", label: "Audit plan" },
    { id: "rollback_plan", label: "Rollback plan" },
    { id: "human_approval", label: "Human approval" },
  ];
  return {
    stageLabel: "Controlled Mutation Proposal Contract 1",
    title: "제어형 변경 제안 계약 · 생성 없음",
    enabledControls: 0,
    proposalCreationEnabled: false,
    proposalPersistenceEnabled: false,
    mutationRouteEnabled: false,
    controlProposalEnabled: false,
    rollbackExecutionEnabled: false,
    auditWriteEnabled: false,
    executionEnabled: false,
    dispatchEnabled: false,
    requestCreationEnabled: false,
    finalGateSnapshot: {
      controlProposalEnabled: finalGateChecklist.controlProposalEnabled,
      executionEnabled: finalGateChecklist.executionEnabled,
      dispatchEnabled: finalGateChecklist.dispatchEnabled,
    },
    safeBoundary: "proposal contract only · no proposal creation · no persistence · no mutation route · no executable controls",
    safeProjectionOnly: true,
    contracts: contracts.map((contract) => ({
      id: contract.id,
      label: contract.label,
      status: "not_available",
      requiredFields,
      safeSummary: `${contract.label} is a required future proposal field, not a created proposal`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeControlledMutationDryRunPlan(proposalContract: OfficeControlledMutationProposalContract): OfficeControlledMutationDryRunPlan {
  const requiredFields: OfficeControlledMutationDryRunPlanItem["requiredFields"] = ["simulation_scope", "expected_effects", "audit_capture_ref", "rollback_verification_ref", "human_review_ref"];
  const planItems: Array<{ id: OfficeControlledMutationDryRunPlanId; label: string }> = [
    { id: "simulation_scope", label: "Simulation scope" },
    { id: "expected_effects", label: "Expected effects" },
    { id: "audit_capture", label: "Audit capture" },
    { id: "rollback_verification", label: "Rollback verification" },
    { id: "human_review", label: "Human review" },
  ];
  return {
    stageLabel: "Controlled Mutation Dry-Run Plan 1",
    title: "제어형 변경 드라이런 계획 · 실행 없음",
    enabledControls: 0,
    dryRunExecutionEnabled: false,
    proposalCreationEnabled: false,
    mutationRouteEnabled: false,
    rollbackExecutionEnabled: false,
    auditWriteEnabled: false,
    executionEnabled: false,
    dispatchEnabled: false,
    proposalContractSnapshot: {
      proposalCreationEnabled: proposalContract.proposalCreationEnabled,
      mutationRouteEnabled: proposalContract.mutationRouteEnabled,
      executionEnabled: proposalContract.executionEnabled,
    },
    safeBoundary: "dry-run plan only · no dry-run execution · no proposal creation · no mutation route · no executable controls",
    safeProjectionOnly: true,
    planItems: planItems.map((item) => ({
      id: item.id,
      label: item.label,
      status: "not_runnable",
      requiredFields,
      safeSummary: `${item.label} is required before any future dry-run can be executed`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeControlledMutationAuditSinkPlan(dryRunPlan: OfficeControlledMutationDryRunPlan): OfficeControlledMutationAuditSinkPlan {
  const requiredFields: OfficeControlledMutationAuditSinkPlanItem["requiredFields"] = ["event_type", "redaction_policy", "sink_ref", "retention_policy", "failure_handling_ref"];
  const sinkItems: Array<{ id: OfficeControlledMutationAuditSinkPlanId; label: string }> = [
    { id: "event_type", label: "Event type" },
    { id: "redaction_policy", label: "Redaction policy" },
    { id: "sink_reference", label: "Sink reference" },
    { id: "retention_policy", label: "Retention policy" },
    { id: "failure_handling", label: "Failure handling" },
  ];
  return {
    stageLabel: "Controlled Mutation Audit Sink Plan 1",
    title: "제어형 변경 감사 싱크 계획 · 쓰기 없음",
    enabledControls: 0,
    auditWriteEnabled: false,
    dryRunExecutionEnabled: false,
    proposalCreationEnabled: false,
    mutationRouteEnabled: false,
    rollbackExecutionEnabled: false,
    executionEnabled: false,
    dispatchEnabled: false,
    dryRunPlanSnapshot: {
      dryRunExecutionEnabled: dryRunPlan.dryRunExecutionEnabled,
      auditWriteEnabled: dryRunPlan.auditWriteEnabled,
      executionEnabled: dryRunPlan.executionEnabled,
    },
    safeBoundary: "audit sink plan only · no audit write · no dry-run execution · no proposal creation · no mutation route · no executable controls",
    safeProjectionOnly: true,
    sinkItems: sinkItems.map((item) => ({
      id: item.id,
      label: item.label,
      status: "not_writable",
      requiredFields,
      safeSummary: `${item.label} is required before any future audit event can be written`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeControlledMutationRollbackVerificationPlan(auditSinkPlan: OfficeControlledMutationAuditSinkPlan): OfficeControlledMutationRollbackVerificationPlan {
  const requiredFields: OfficeControlledMutationRollbackVerificationPlanItem["requiredFields"] = ["restore_point_ref", "reversible_scope", "verification_probe_ref", "failure_fallback_ref", "human_recheck_ref"];
  const verificationItems: Array<{ id: OfficeControlledMutationRollbackVerificationPlanId; label: string }> = [
    { id: "restore_point", label: "Restore point" },
    { id: "reversible_scope", label: "Reversible scope" },
    { id: "verification_probe", label: "Verification probe" },
    { id: "failure_fallback", label: "Failure fallback" },
    { id: "human_recheck", label: "Human recheck" },
  ];
  return {
    stageLabel: "Controlled Mutation Rollback Verification Plan 1",
    title: "제어형 변경 롤백 검증 계획 · 롤백 실행 없음",
    enabledControls: 0,
    rollbackExecutionEnabled: false,
    auditWriteEnabled: false,
    dryRunExecutionEnabled: false,
    proposalCreationEnabled: false,
    mutationRouteEnabled: false,
    executionEnabled: false,
    dispatchEnabled: false,
    auditSinkPlanSnapshot: {
      auditWriteEnabled: auditSinkPlan.auditWriteEnabled,
      rollbackExecutionEnabled: auditSinkPlan.rollbackExecutionEnabled,
      executionEnabled: auditSinkPlan.executionEnabled,
    },
    safeBoundary: "rollback verification plan only · no rollback execution · no audit write · no dry-run execution · no proposal creation · no mutation route · no executable controls",
    safeProjectionOnly: true,
    verificationItems: verificationItems.map((item) => ({
      id: item.id,
      label: item.label,
      status: "not_verified",
      requiredFields,
      safeSummary: `${item.label} is required before any future rollback path can be verified`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeControlledMutationHumanApprovalPlan(rollbackVerificationPlan: OfficeControlledMutationRollbackVerificationPlan): OfficeControlledMutationHumanApprovalPlan {
  const requiredFields: OfficeControlledMutationHumanApprovalPlanItem["requiredFields"] = ["approver_identity_ref", "decision_envelope_ref", "consent_scope", "timeout_policy", "audit_linkage_ref"];
  const approvalItems: Array<{ id: OfficeControlledMutationHumanApprovalPlanId; label: string }> = [
    { id: "approver_identity", label: "Approver identity" },
    { id: "decision_envelope", label: "Decision envelope" },
    { id: "consent_scope", label: "Consent scope" },
    { id: "timeout_policy", label: "Timeout policy" },
    { id: "audit_linkage", label: "Audit linkage" },
  ];
  return {
    stageLabel: "Controlled Mutation Human Approval Plan 1",
    title: "제어형 변경 인간 승인 계획 · 승인 기록 없음",
    enabledControls: 0,
    approvalRecordingEnabled: false,
    rollbackExecutionEnabled: false,
    auditWriteEnabled: false,
    dryRunExecutionEnabled: false,
    proposalCreationEnabled: false,
    mutationRouteEnabled: false,
    executionEnabled: false,
    dispatchEnabled: false,
    rollbackVerificationPlanSnapshot: {
      rollbackExecutionEnabled: rollbackVerificationPlan.rollbackExecutionEnabled,
      auditWriteEnabled: rollbackVerificationPlan.auditWriteEnabled,
      executionEnabled: rollbackVerificationPlan.executionEnabled,
    },
    safeBoundary: "human approval plan only · no approval recording · no rollback execution · no audit write · no dry-run execution · no proposal creation · no mutation route · no executable controls",
    safeProjectionOnly: true,
    approvalItems: approvalItems.map((item) => ({
      id: item.id,
      label: item.label,
      status: "not_recorded",
      requiredFields,
      safeSummary: `${item.label} is required before any future approval decision can be recorded`,
      rawExcluded: true,
    })),
  };
}

export function buildOfficeControlledMutationAuthoritySummary(humanApprovalPlan: OfficeControlledMutationHumanApprovalPlan): OfficeControlledMutationAuthoritySummary {
  const requiredFields: OfficeControlledMutationAuthoritySummaryItem["requiredFields"] = ["authority_scope_ref", "adapter_readiness_ref", "approval_linkage_ref", "dry_run_evidence_ref", "audit_rollback_linkage_ref"];
  const authorityItems: Array<{ id: OfficeControlledMutationAuthoritySummaryId; label: string }> = [
    { id: "authority_scope", label: "Authority scope" },
    { id: "adapter_readiness", label: "Adapter readiness" },
    { id: "approval_linkage", label: "Approval linkage" },
    { id: "dry_run_evidence", label: "Dry-run evidence" },
    { id: "audit_rollback_linkage", label: "Audit/rollback linkage" },
  ];
  return {
    stageLabel: "Controlled Mutation Authority Summary 1",
    title: "제어형 변경 권한 요약 · 권한 부여 없음",
    enabledControls: 0,
    authorityGrantEnabled: false,
    approvalRecordingEnabled: false,
    rollbackExecutionEnabled: false,
    auditWriteEnabled: false,
    dryRunExecutionEnabled: false,
    proposalCreationEnabled: false,
    mutationRouteEnabled: false,
    executionEnabled: false,
    dispatchEnabled: false,
    humanApprovalPlanSnapshot: {
      approvalRecordingEnabled: humanApprovalPlan.approvalRecordingEnabled,
      rollbackExecutionEnabled: humanApprovalPlan.rollbackExecutionEnabled,
      executionEnabled: humanApprovalPlan.executionEnabled,
    },
    safeBoundary: "authority summary only · no authority grant · no approval recording · no rollback execution · no audit write · no dry-run execution · no proposal creation · no mutation route · no executable controls",
    safeProjectionOnly: true,
    authorityItems: authorityItems.map((item) => ({
      id: item.id,
      label: item.label,
      status: "blocked",
      requiredFields,
      safeSummary: `${item.label} is required before any executable authority can be considered`,
      rawExcluded: true,
    })),
  };
}

export function textField(row: Record<string, unknown>, key: string): string {
  const value = row[key];
  return typeof value === "string" && value.length > 0 ? value : "—";
}

export type OfficeKanbanProjectionCard = {
  id: string;
  boardId: string;
  taskRef: string;
  status: string;
  assignee: string;
  tenant: string;
  priority: number;
  latestSafeAtMs: number | null;
  parentTaskRefs: string[];
  childTaskRefs: string[];
  badges: string[];
};

export type OfficeKanbanObservabilitySummaryCard = {
  id: "workload" | "blocked" | "stale";
  label: string;
  value: number;
  detail: string;
  tone: OfficeDeltaBadge["tone"];
};

export type OfficeKanbanObservabilityBoardWorkload = {
  boardId: string;
  total: number;
  running: number;
  blocked: number;
  stale: number;
};

export type OfficeKanbanObservability = {
  stageLabel: "Kanban Observability 2";
  summaryCards: OfficeKanbanObservabilitySummaryCard[];
  workloadByBoard: OfficeKanbanObservabilityBoardWorkload[];
  attentionRefs: string[];
};

export type OfficeKanbanOperatingPosture = {
  stageLabel: "Kanban-first 운영 v1";
  sourceOfTruth: "VPS ai-office";
  openTaskCount: number;
  activeTaskCount: number;
  blockedTaskCount: number;
  doneTaskCount: number;
  guidanceCards: Array<{
    id: "intake" | "orchestrate" | "review" | "local";
    label: string;
    detail: string;
    tone: OfficeDeltaBadge["tone"];
  }>;
};

export type OfficeKanbanProjection = {
  stageLabel: "칸반 운영실";
  readOnly: true;
  redactionNote: string;
  boards: Array<{ boardId: string; displayName: string; taskCount: number; counts: Record<string, number> }>;
  assignees: Array<{ id: string; count: number }>;
  tenants: Array<{ id: string; count: number }>;
  graphEdges: Array<{ parent: string; child: string; boardId: string }>;
  cards: OfficeKanbanProjectionCard[];
  observability: OfficeKanbanObservability;
  operatingPosture: OfficeKanbanOperatingPosture;
};

function safeStringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.length > 0) : [];
}

function safeCountRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([, count]) => typeof count === "number")
      .map(([key, count]) => [key, count as number]),
  );
}

function incrementCount(map: Map<string, number>, key: string): void {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function parseKanbanTimestamp(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value < 1_000_000_000_000 ? value * 1000 : value;
  }
  if (typeof value !== "string" || value.length === 0) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isKanbanRunningStatus(status: string): boolean {
  return status === "running" || status === "in_progress" || status === "active";
}

function isKanbanBlockedCard(card: OfficeKanbanProjectionCard): boolean {
  return card.status === "blocked" || card.badges.includes("needs_attention");
}

function isKanbanStaleCard(card: OfficeKanbanProjectionCard, referenceTime: number): boolean {
  if (!isKanbanRunningStatus(card.status)) return false;
  if (card.latestSafeAtMs === null) return false;
  return referenceTime - card.latestSafeAtMs > 60 * 60 * 1000;
}

function buildOfficeKanbanObservability(state: OfficeState, boards: OfficeKanbanProjection["boards"], cards: OfficeKanbanProjectionCard[]): OfficeKanbanObservability {
  const referenceTime = parseKanbanTimestamp(state.generated_at) ?? Date.now();
  const boardWorkloads = new Map<string, OfficeKanbanObservabilityBoardWorkload>();
  const attentionRefs = new Set<string>();
  let runningCount = 0;
  let blockedCount = 0;
  let staleCount = 0;

  for (const board of boards) {
    boardWorkloads.set(board.boardId, { boardId: board.boardId, total: 0, running: 0, blocked: 0, stale: 0 });
  }

  for (const card of cards) {
    const workload = boardWorkloads.get(card.boardId) ?? { boardId: card.boardId, total: 0, running: 0, blocked: 0, stale: 0 };
    workload.total += 1;
    if (isKanbanRunningStatus(card.status)) {
      workload.running += 1;
      runningCount += 1;
    }
    if (isKanbanBlockedCard(card)) {
      workload.blocked += 1;
      blockedCount += 1;
      attentionRefs.add(card.taskRef);
    }
    if (isKanbanStaleCard(card, referenceTime)) {
      workload.stale += 1;
      staleCount += 1;
      attentionRefs.add(card.taskRef);
    }
    boardWorkloads.set(card.boardId, workload);
  }

  return {
    stageLabel: "Kanban Observability 2",
    summaryCards: [
      { id: "workload", label: "작업량", value: cards.length, detail: `보드 ${boards.length}개 · 실행 중 ${runningCount}개`, tone: "neutral" },
      { id: "blocked", label: "막힘", value: blockedCount, detail: `확인 필요 task_ref ${blockedCount}개`, tone: blockedCount > 0 ? "negative" : "positive" },
      { id: "stale", label: "정체", value: staleCount, detail: `최근 heartbeat/update 60분 초과 ${staleCount}개`, tone: staleCount > 0 ? "warning" : "positive" },
    ],
    workloadByBoard: Array.from(boardWorkloads.values()).sort((a, b) => a.boardId.localeCompare(b.boardId)),
    attentionRefs: Array.from(attentionRefs).sort((a, b) => a.localeCompare(b)).slice(0, 6),
  };
}

function buildOfficeKanbanOperatingPosture(cards: OfficeKanbanProjectionCard[]): OfficeKanbanOperatingPosture {
  const activeTaskCount = cards.filter((card) => isKanbanRunningStatus(card.status) || card.status === "ready" || card.status === "todo" || card.status === "triage").length;
  const blockedTaskCount = cards.filter((card) => isKanbanBlockedCard(card)).length;
  const doneTaskCount = cards.filter((card) => card.status === "done" || card.status === "archived").length;
  const openTaskCount = Math.max(0, cards.length - doneTaskCount);

  return {
    stageLabel: "Kanban-first 운영 v1",
    sourceOfTruth: "VPS ai-office",
    openTaskCount,
    activeTaskCount,
    blockedTaskCount,
    doneTaskCount,
    guidanceCards: [
      {
        id: "intake",
        label: "입구 통일",
        detail: "간단 답변은 직접 처리하고, 파일·서비스·장기 작업은 canonical board 카드로 보냅니다.",
        tone: openTaskCount > 0 ? "positive" : "neutral",
      },
      {
        id: "orchestrate",
        label: "오케스트레이터 우선",
        detail: "여러 역할·리뷰·승인·노드 작업은 ai-office-orchestrator가 graph로 나눕니다.",
        tone: "neutral",
      },
      {
        id: "review",
        label: "승인/리뷰 게이트",
        detail: "review-required·approval-required·input-required·credential-required·blocked-by-node prefix를 사용합니다.",
        tone: blockedTaskCount > 0 ? "warning" : "positive",
      },
      {
        id: "local",
        label: "Mac은 미러",
        detail: "Mac/WSL은 상태·릴레이 노드이고 canonical 작업 상태는 VPS ai-office board입니다.",
        tone: "neutral",
      },
    ],
  };
}

export function buildOfficeKanbanProjection(state: OfficeState): OfficeKanbanProjection {
  const boardRooms = state.rooms.filter((room) => textField(room, "source") === "kanban" && textField(room, "kind") === "kanban_board");
  const cards = state.work_items
    .filter((item) => textField(item, "source") === "kanban" && textField(item, "kind") === "kanban_task")
    .map((item): OfficeKanbanProjectionCard => ({
      id: textField(item, "id"),
      boardId: textField(item, "board_id"),
      taskRef: textField(item, "task_ref"),
      status: textField(item, "status"),
      assignee: textField(item, "assignee"),
      tenant: textField(item, "tenant"),
      priority: numberField(item, "priority") ?? 0,
      latestSafeAtMs: parseKanbanTimestamp(item.last_heartbeat_at) ?? parseKanbanTimestamp(item.updated_at),
      parentTaskRefs: safeStringList(item.parent_task_refs),
      childTaskRefs: safeStringList(item.child_task_refs),
      badges: safeStringList(item.badges),
    }));

  const boardTaskCounts = new Map<string, number>();
  const assigneeCounts = new Map<string, number>();
  const tenantCounts = new Map<string, number>();
  const graphEdges: OfficeKanbanProjection["graphEdges"] = [];
  const seenEdges = new Set<string>();

  for (const card of cards) {
    incrementCount(boardTaskCounts, card.boardId);
    if (card.assignee !== "—") incrementCount(assigneeCounts, card.assignee);
    if (card.tenant !== "—") incrementCount(tenantCounts, card.tenant);
    for (const child of card.childTaskRefs) {
      const edgeKey = `${card.taskRef}->${child}`;
      if (!seenEdges.has(edgeKey)) {
        seenEdges.add(edgeKey);
        graphEdges.push({ parent: card.taskRef, child, boardId: card.boardId });
      }
    }
  }

  const boards = boardRooms.map((room) => {
    const boardId = String(textField(room, "id")).replace(/^kanban:/, "");
    return {
      boardId,
      displayName: textField(room, "display_name"),
      taskCount: boardTaskCounts.get(boardId) ?? 0,
      counts: safeCountRecord(room.counts),
    };
  });

  for (const boardId of Array.from(boardTaskCounts.keys())) {
    if (!boards.some((board) => board.boardId === boardId)) {
      boards.push({ boardId, displayName: boardId, taskCount: boardTaskCounts.get(boardId) ?? 0, counts: {} });
    }
  }

  const observability = buildOfficeKanbanObservability(state, boards, cards);
  const operatingPosture = buildOfficeKanbanOperatingPosture(cards);

  return {
    stageLabel: "칸반 운영실",
    readOnly: true,
    redactionNote: "Kanban DB의 allowlist DTO만 사용합니다. 본문, 결과, 댓글, 로그, 프롬프트, 비밀값은 제외합니다.",
    boards,
    assignees: Array.from(assigneeCounts, ([id, count]) => ({ id, count })).sort((a, b) => a.id.localeCompare(b.id)),
    tenants: Array.from(tenantCounts, ([id, count]) => ({ id, count })).sort((a, b) => a.id.localeCompare(b.id)),
    graphEdges,
    cards,
    observability,
    operatingPosture,
  };
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

function safeHeartbeatIntensity(events: OfficeSafeEvent[]): OfficeSafeMotionHeartbeat["intensity"] {
  const weight = events.reduce((total, event) => total + event.count + (event.tone === "negative" ? 4 : event.tone === "warning" ? 2 : 0), 0);
  if (weight >= 8) return "high";
  if (weight >= 3) return "medium";
  return "low";
}

function safeHeartbeatPhase(options: OfficeSafeMotionHeartbeatOptions, mode: OfficeSafeMotionHeartbeat["mode"]): OfficeSafeMotionHeartbeat["phase"] {
  if (mode === "checking") return "scan";
  if (options.pollStatus === "unavailable") return "hold";
  if (options.tick <= 0) return "idle";
  return options.tick % 2 === 1 ? "pulse" : "scan";
}

export function buildOfficeSafeMotionHeartbeat(posture: OfficeSafeStreamPosture | OfficeSafeEventSubstrate, options: OfficeSafeMotionHeartbeatOptions): OfficeSafeMotionHeartbeat {
  const postureMode = "label" in posture ? posture.mode : posture.mode === "event-stream" ? "backend-safe-stream" : "local-fallback";
  const mode: OfficeSafeMotionHeartbeat["mode"] = options.pollStatus === "loading" || postureMode === "loading" ? "checking" : postureMode === "backend-safe-stream" && options.pollStatus === "active" ? "safe-polling" : "local-fallback";
  const eventCount = posture.events.length;
  const intensity = mode === "local-fallback" ? "low" : safeHeartbeatIntensity(posture.events);
  const phase = safeHeartbeatPhase(options, mode);
  const motionEnabled = !options.reducedMotion && phase !== "hold";
  const streamDetail = mode === "safe-polling" ? `백엔드 안전 이벤트 ${eventCount}개` : mode === "checking" ? "안전 endpoint 확인 중" : `로컬 안전 투영 ${eventCount}개`;
  const cadenceDetail = options.failureCount > 0 ? `poll 보류 ${options.failureCount}회 · fallback 유지` : `tick ${Math.max(0, options.tick)} · ${phase}`;
  const motionDetail = motionEnabled ? `${intensity} heartbeat · CSS safe motion` : "정지/감속 · reduced/fallback posture";
  return {
    stageLabel: "Stage 16-D 안전 motion heartbeat",
    mode,
    phase,
    intensity,
    summary: `${streamDetail} · ${cadenceDetail} · ${motionEnabled ? "움직임 켜짐" : "움직임 제한"}`,
    motionEnabled,
    items: [
      { id: "stream", label: "스트림", detail: streamDetail, tone: mode === "safe-polling" ? "positive" : mode === "checking" ? "warning" : "neutral" },
      { id: "cadence", label: "박자", detail: cadenceDetail, tone: options.failureCount > 0 ? "warning" : "positive" },
      { id: "motion", label: "움직임", detail: motionDetail, tone: intensity === "high" ? "negative" : intensity === "medium" ? "warning" : "neutral" },
    ],
    ariaHidden: true,
    interactive: false,
  };
}

function spatialChoreographyIntensity(event: OfficeSafeEvent, heartbeat: OfficeSafeMotionHeartbeat): OfficeSafeRoomBeaconIntensity {
  if (!heartbeat.motionEnabled) return "idle";
  if (heartbeat.intensity === "high" || event.tone === "negative" || event.count >= 4) return "high";
  if (heartbeat.intensity === "medium" || event.tone === "warning" || event.count >= 2) return "medium";
  return "low";
}

export function buildOfficeSafeSpatialChoreography(events: OfficeSafeEvent[], heartbeat: OfficeSafeMotionHeartbeat): OfficeSafeSpatialChoreography {
  const items = events
    .filter((event) => event.category !== "snapshot_static")
    .slice(0, 6)
    .map((event): OfficeSafeSpatialChoreographyItem => {
      const from = ROOM_BEACON_POSITION[event.roomId];
      const to = event.toRoomId ? ROOM_BEACON_POSITION[event.toRoomId] : undefined;
      const intensity = spatialChoreographyIntensity(event, heartbeat);
      if (event.category === "flow_changed" && event.toRoomId && to) {
        return {
          id: `spatial-${event.id}`,
          kind: "route-sweep",
          roomId: event.roomId,
          toRoomId: event.toRoomId,
          label: "안전 route sweep",
          detail: `${CHARACTER_ROOM_LABEL[event.roomId]}에서 ${CHARACTER_ROOM_LABEL[event.toRoomId]}로 · 안전 흐름`,
          tone: event.tone,
          intensity,
          x: from.x,
          y: from.y,
          x2: to.x,
          y2: to.y,
          className: `office-safe-spatial-choreography__item office-safe-spatial-choreography__item--route office-safe-spatial-choreography__item--${intensity}`,
          ariaHidden: true,
          interactive: false,
        };
      }
      return {
        id: `spatial-${event.id}`,
        kind: "room-pulse",
        roomId: event.roomId,
        label: `${CHARACTER_ROOM_LABEL[event.roomId]} 안전 pulse`,
        detail: `${safeEventToneLabel(event.tone)} · 안전 이벤트 ${event.count}개`,
        tone: event.tone,
        intensity,
        x: from.x,
        y: from.y,
        className: `office-safe-spatial-choreography__item office-safe-spatial-choreography__item--room office-safe-spatial-choreography__item--${intensity}`,
        ariaHidden: true,
        interactive: false,
      };
    });
  return {
    stageLabel: "Stage 16-E 안전 spatial choreography",
    mode: items.length > 0 && heartbeat.motionEnabled ? "safe-spatial-motion" : "safe-spatial-idle",
    summary: items.length > 0 ? `안전 공간 움직임 ${items.length}개 · ${heartbeat.phase}` : "안전 공간 움직임 대기 · 정적 posture",
    items,
    ariaHidden: true,
    interactive: false,
  };
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

export function buildOfficeTimeDisplayPolicy() {
  return {
    label: "시간 표시",
    value: "브라우저 로컬 시간대",
    detail: "브라우저 locale/timezone 기준으로 표시합니다. KST 고정 변환은 하지 않습니다.",
  };
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

const SOURCE_HEALTH_STATUS_WEIGHT: Record<OfficeSourceStatus, number> = { ok: 0, missing: 1, unavailable: 2, partial: 3, error: 4 };
const SOURCE_HEALTH_STATUS_LABEL: Record<OfficeSourceStatus, string> = {
  ok: "정상",
  partial: "부분 연결",
  missing: "미보고",
  unavailable: "사용 불가",
  error: "오류",
};

function worstSourceStatus(sources: OfficeState["data_sources"]): OfficeSourceStatus {
  return sources.reduce<OfficeSourceStatus>((worst, source) => (SOURCE_HEALTH_STATUS_WEIGHT[source.status] > SOURCE_HEALTH_STATUS_WEIGHT[worst] ? source.status : worst), "ok");
}

function sourceStatusTone(status: OfficeSourceStatus, warningCount = 0): OfficeDeltaBadge["tone"] {
  if (status === "error") return "negative";
  if (status === "partial" || warningCount > 0) return "warning";
  if (status === "missing" || status === "unavailable") return "neutral";
  return "positive";
}

function sourceCount(sources: OfficeState["data_sources"], field: "item_count" | "warning_count"): number {
  return sources.reduce((total, source) => total + Math.max(0, typeof source[field] === "number" ? source[field] ?? 0 : 0), 0);
}

function isPaperclipSource(source: OfficeState["data_sources"][number]): boolean {
  const row = source as unknown as Record<string, unknown>;
  return source.id.startsWith("paperclip:") || PAPERCLIP_SOURCE_TYPES.has(safePaperclipSourceType(row.source_type));
}

function buildSourceHealthRailItem(
  id: OfficeSourceHealthRailItemId,
  label: string,
  sources: OfficeState["data_sources"],
  fallbackStatus: OfficeSourceStatus = "missing",
): OfficeSourceHealthRailItem {
  const status = sources.length > 0 ? worstSourceStatus(sources) : fallbackStatus;
  const itemCount = sourceCount(sources, "item_count");
  const warningCount = sourceCount(sources, "warning_count");
  return {
    id,
    label,
    status,
    tone: sourceStatusTone(status, warningCount),
    sourceCount: sources.length,
    itemCount,
    warningCount,
    detail: sources.length > 0 ? `소스 ${sources.length} · 항목 ${itemCount} · 경고 ${warningCount} · 상태 ${SOURCE_HEALTH_STATUS_LABEL[status]}` : `보고 없음 · 상태 ${SOURCE_HEALTH_STATUS_LABEL[status]}`,
    redactionNote: "상태·개수·경고 합계만 표시하며 원문·경로·로그·토큰은 제외합니다.",
  };
}

export function buildOfficeSourceHealthRail(state: OfficeState): OfficeSourceHealthRail {
  const paperclipSources = state.data_sources.filter(isPaperclipSource);
  const byId = (ids: string[]) => state.data_sources.filter((source) => ids.includes(source.id));
  const redactionWarningCount = Math.max(0, state.redactions.redacted_field_count ?? 0, state.redactions.warnings.length);
  const redactionStatus: OfficeSourceStatus = redactionWarningCount > 0 || state.redactions.omitted_sections.length > 0 ? "partial" : "ok";
  const items: OfficeSourceHealthRailItem[] = [
    buildSourceHealthRailItem("sessions", "세션", byId(["sessions"])),
    buildSourceHealthRailItem("kanban", "Kanban", byId(["kanban"])),
    buildSourceHealthRailItem("paperclip", "Paperclip", paperclipSources),
    buildSourceHealthRailItem("automation", "자동화", byId(["cron"])),
    buildSourceHealthRailItem("routing", "라우팅", byId(["topics", "provenance"])),
    {
      id: "redaction",
      label: "가림",
      status: redactionStatus,
      tone: sourceStatusTone(redactionStatus, redactionWarningCount),
      sourceCount: 1,
      itemCount: state.redactions.omitted_sections.length,
      warningCount: redactionWarningCount,
      detail: `가림 ${redactionWarningCount} · 생략 섹션 ${state.redactions.omitted_sections.length} · 상태 ${SOURCE_HEALTH_STATUS_LABEL[redactionStatus]}`,
      redactionNote: "가림 정책 개수만 표시하며 생략된 원문 이름이나 경고 본문은 표시하지 않습니다.",
    },
  ];
  const attentionCount = items.filter((item) => item.status === "partial" || item.status === "error" || item.warningCount > 0).length;
  const gapCount = items.filter((item) => item.status === "missing" || item.status === "unavailable").length;
  return {
    stageLabel: "Office Source Health 1",
    detail: `확인 필요 ${attentionCount} · 공백/미연결 ${gapCount} · 통합 소스 ${items.length}`,
    items,
    redactionNote: "Kanban/Paperclip/자동화/라우팅/가림 상태를 safe DTO 집계만으로 통합합니다.",
  };
}

export function buildOfficeSourceHealthCompactDiagnostics(state: OfficeState): OfficeSourceHealthCompactDiagnostics {
  const rail = buildOfficeSourceHealthRail(state);
  const attentionItems = rail.items.filter((item) => item.status === "partial" || item.status === "error" || item.warningCount > 0);
  const gapItems = rail.items.filter((item) => item.status === "missing" || item.status === "unavailable");
  const errorCount = rail.items.filter((item) => item.status === "error").length;
  const warningTotal = rail.items.reduce((total, item) => total + item.warningCount, 0);
  const connectedCount = rail.items.length - gapItems.length;

  return {
    stageLabel: "Office Source Health 2",
    detail: `상단 3장 요약 · 연결 ${connectedCount}/${rail.items.length} · 확인 ${attentionItems.length} · 경고 ${warningTotal}`,
    cards: [
      {
        id: "coverage",
        title: "소스 커버리지",
        count: rail.items.length,
        detail: `연결 ${connectedCount} · 공백/미연결 ${gapItems.length}`,
        tone: gapItems.length > 0 ? "warning" : "positive",
      },
      {
        id: "attention",
        title: "확인 필요",
        count: attentionItems.length,
        detail: `오류 ${errorCount} · 경고 합계 ${warningTotal}`,
        tone: errorCount > 0 ? "negative" : attentionItems.length > 0 ? "warning" : "positive",
      },
      {
        id: "readability",
        title: "읽기 밀도",
        count: 3,
        detail: "세부 소스 카드는 접고 커버리지·확인·읽기 밀도만 먼저 봅니다.",
        tone: attentionItems.length > 0 || gapItems.length > 0 ? "warning" : "positive",
      },
    ],
    redactionNote: "Source Health 2는 Source Health 1의 safe 집계만 재요약하며 원문·경로·로그·토큰을 표시하지 않습니다.",
  };
}

const PAPERCLIP_SOURCE_TYPES = new Set<OfficePaperclipSourceType>(["paperclip", "nas_manifest", "session_tag", "relay_projection"]);
const PAPERCLIP_RELAYS = new Set<OfficePaperclipRelay>(["MacBook", "WSL", "VPS"]);
const PAPERCLIP_TAG_PATTERN = /^source:[a-z0-9][a-z0-9_-]{1,80}$/;

function safePaperclipSourceType(value: unknown): OfficePaperclipSourceType {
  return typeof value === "string" && PAPERCLIP_SOURCE_TYPES.has(value as OfficePaperclipSourceType) ? (value as OfficePaperclipSourceType) : "unknown";
}

function safePaperclipRelay(value: unknown): OfficePaperclipRelay {
  return typeof value === "string" && PAPERCLIP_RELAYS.has(value as OfficePaperclipRelay) ? (value as OfficePaperclipRelay) : "unknown";
}

function safePaperclipLabel(id: string): string {
  const withoutPrefix = id.replace(/^paperclip:/, "");
  const basename = withoutPrefix.split(/[\\/]/).filter(Boolean).pop() ?? withoutPrefix;
  const safe = basename.replace(/[^a-zA-Z0-9가-힣._:-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
  return (safe || "paperclip-source").slice(0, 48);
}

function safePaperclipTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(new Set(value.filter((tag): tag is string => typeof tag === "string" && PAPERCLIP_TAG_PATTERN.test(tag)))).slice(0, 8);
}

function buildPaperclipTimingBucket(checkedAt: string | undefined, generatedAt: string): OfficePaperclipTimingBucket {
  if (!checkedAt) return "unknown";
  const checked = Date.parse(checkedAt);
  const reference = Date.parse(generatedAt);
  if (!Number.isFinite(checked) || !Number.isFinite(reference)) return "unknown";
  const ageMs = Math.max(reference - checked, 0);
  if (ageMs <= 24 * 60 * 60 * 1000) return "fresh";
  if (ageMs <= 7 * 24 * 60 * 60 * 1000) return "recent";
  return "stale";
}

function workbenchToneFromCount(count: number, warningCount = 0): OfficeDeltaBadge["tone"] {
  if (warningCount > 0) return "warning";
  return count > 0 ? "positive" : "neutral";
}

function safeWorkbenchCount(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.trunc(value)) : 0;
}

function safeProjectionCacheStatus(status: unknown): "active" | "missing" | "stale" | "rejected" | "unknown" {
  return status === "active" || status === "missing" || status === "stale" || status === "rejected" ? status : "unknown";
}

export function buildOfficeUnifiedWorkbenchView(state: OfficeState): OfficeUnifiedWorkbenchView {
  const paperclipWorkbench = buildOfficePaperclipWorkbench(state);
  const rpgScene = buildOfficeRpgScene(state);
  const mutationReadiness = buildOfficeMutationControlReadiness(state);
  const kanbanSource = state.data_sources.find((source) => source.id === "kanban");
  const kanbanItemCount = safeWorkbenchCount(kanbanSource?.item_count);
  const boardCount = kanbanItemCount + state.work_items.length;
  const blockedCount = state.work_items.filter((item) => textField(item, "status") === "blocked").length;
  const projectionStatus = safeProjectionCacheStatus(state.projection_cache?.status ?? "missing");
  const projectionRejectedCount = safeWorkbenchCount(state.projection_cache?.rejected?.count);
  const activeProjectionCount = state.projection_cache?.active ? 1 : 0;
  const warningSourceCount = state.data_sources.filter((source) => source.status !== "ok" || safeWorkbenchCount(source.warning_count) > 0).length;

  return {
    title: "AI Office 통합 운영실",
    subtitle: "VPS 운영 보드, 안전 근거, projection cache, RPG 운영실을 하나의 읽기 전용 화면으로 묶습니다.",
    generatedAt: state.generated_at,
    layers: [
      {
        id: "operatingBoard",
        label: "운영 보드",
        source: "VPS canonical ai-office Kanban",
        summary: `작업 ${state.work_items.length}개 · 보드 집계 ${kanbanItemCount}개 · blocked ${blockedCount}개`,
        count: boardCount,
        tone: blockedCount > 0 ? "warning" : workbenchToneFromCount(boardCount),
      },
      {
        id: "evidenceLayer",
        label: "근거 레이어",
        source: "Paperclip/sourceTags safe manifests",
        summary: `Paperclip/sourceTags ${paperclipWorkbench.sources.length}개 · source 경고 ${warningSourceCount}개 · raw 제외`,
        count: paperclipWorkbench.sources.length,
        tone: workbenchToneFromCount(paperclipWorkbench.sources.length, warningSourceCount),
      },
      {
        id: "projectionCache",
        label: "안전 투영 캐시",
        source: "validated active projection cache",
        summary: `projection ${projectionStatus} · active ${activeProjectionCount}개 · rejected aggregate ${projectionRejectedCount}개`,
        count: activeProjectionCount + projectionRejectedCount,
        tone: projectionRejectedCount > 0 ? "warning" : workbenchToneFromCount(activeProjectionCount),
      },
      {
        id: "rpgRoom",
        label: "RPG 운영실",
        source: "safe OfficeState RPG scene",
        summary: `RPG 운영실 rooms ${rpgScene.rooms.length}개 · entities ${rpgScene.entities.length}개 · disabled approval posture`,
        count: rpgScene.rooms.length + rpgScene.entities.length,
        tone: mutationReadiness.status === "blocked-read-only" ? "neutral" : "warning",
      },
    ],
    safetyPosture: {
      readOnly: state.capabilities.read_only !== false,
      privateOnly: state.display_mode !== "remote",
      rawExcluded: true,
      approvalModel: {
        status: "display-only",
        enabledControls: 0,
        contract: "approval-model-contract",
      },
    },
    renderOrder: ["operating-room-header", "rpg-room-map", "operating-board", "evidence-layer", "projection-cache", "safety-inspector"],
  };
}

export function buildOfficePageSectionPlan(state: OfficeState): OfficePageSectionPlan[] {
  const paperclipSourceCount = buildOfficePaperclipWorkbench(state).sources.length;
  const sourceIssueCount = state.data_sources.filter((source) => source.status !== "ok" || (source.warning_count ?? 0) > 0).length;
  const workAttentionCount = state.work_items.filter((item) => textField(item, "status") === "blocked").length;
  const automationIssueCount = state.automations.filter((job) => textField(job, "last_status") === "error" || textField(job, "state") === "error").length;

  return [
    {
      id: "sources",
      label: "소스 상태",
      summary: `소스 ${state.data_sources.length}개 · 확인 필요 ${sourceIssueCount}개`,
      count: state.data_sources.length,
      defaultOpen: false,
      ariaLabel: "소스 상태 상세 접기/펼치기",
    },
    {
      id: "paperclip",
      label: "Paperclip 작업대",
      summary: `출처 ${paperclipSourceCount}개 · 안전 source-tag 투영`,
      count: paperclipSourceCount,
      defaultOpen: false,
      ariaLabel: "Paperclip 작업대 상세 접기/펼치기",
    },
    {
      id: "work",
      label: "작업·세션",
      summary: `세션 ${state.agents.length}개 · 작업 ${state.work_items.length}개 · 확인 필요 ${workAttentionCount}개`,
      count: state.agents.length + state.work_items.length,
      defaultOpen: false,
      ariaLabel: "작업과 세션 상세 접기/펼치기",
    },
    {
      id: "automation",
      label: "자동화",
      summary: `자동화 ${state.automations.length}개 · 확인 필요 ${automationIssueCount}개 · 상태별 묶음`,
      count: state.automations.length,
      defaultOpen: false,
      ariaLabel: "자동화 상세 접기/펼치기",
    },
    {
      id: "routing",
      label: "라우팅·가림",
      summary: `토픽 ${state.topics.length}개 · 출처 기록 ${state.provenance.length}개 · 가림 ${state.redactions.redacted_field_count}개`,
      count: state.topics.length + state.provenance.length,
      defaultOpen: false,
      ariaLabel: "라우팅과 가림 처리 상세 접기/펼치기",
    },
    {
      id: "events",
      label: "최근 이벤트",
      summary: `이벤트 ${state.events.length}개 · 안전 메타데이터`,
      count: state.events.length,
      defaultOpen: false,
      ariaLabel: "최근 이벤트 상세 접기/펼치기",
    },
  ];
}

export function buildOfficePaperclipWorkbench(state: OfficeState): OfficePaperclipWorkbench {
  const sources = state.data_sources
    .filter((source) => source.id.startsWith("paperclip:") || PAPERCLIP_SOURCE_TYPES.has(safePaperclipSourceType((source as unknown as Record<string, unknown>).source_type)))
    .map<OfficePaperclipWorkbenchSource>((source) => {
      const row = source as unknown as Record<string, unknown>;
      return {
        id: source.id,
        label: safePaperclipLabel(source.id),
        health: source.status,
        sourceType: source.id.startsWith("paperclip:") ? "paperclip" : safePaperclipSourceType(row.source_type),
        itemCount: typeof source.item_count === "number" ? Math.max(0, source.item_count) : 0,
        warningCount: typeof source.warning_count === "number" ? Math.max(0, source.warning_count) : 0,
        relay: safePaperclipRelay(row.relay),
        tags: safePaperclipTags(row.tags),
        timingBucket: buildPaperclipTimingBucket(source.checked_at, state.generated_at),
        redactionNote: "민감 원문·실행 인자·로그·경로·비밀값은 Paperclip 작업대 DTO에 포함하지 않습니다.",
      };
    });

  return {
    stageLabel: "Paperclip / 공유 컨텍스트 작업대",
    detail: sources.length > 0 ? `안전 source-tag 투영 ${sources.length}개` : "연결된 Paperclip/source-tag 투영이 아직 없습니다.",
    sources,
    redactionNote: "브라우저에는 source id, 안전 태그, 개수, 건강도, 릴레이 allowlist, coarse timing bucket만 표시합니다.",
  };
}

export function buildOfficePaperclipManifestVisibility(state: OfficeState): OfficePaperclipManifestVisibility {
  const workbench = buildOfficePaperclipWorkbench(state);
  const manifestCount = workbench.sources.length;
  const warningCount = workbench.sources.reduce((sum, source) => sum + source.warningCount, 0);
  const needsAttention = workbench.sources.filter((source) => source.health !== "ok" || source.warningCount > 0).length;
  const vpsVisibleCount = workbench.sources.filter((source) => source.relay === "VPS").length;
  const relayCount = new Set(workbench.sources.map((source) => source.relay).filter((relay) => relay !== "unknown")).size;

  return {
    stageLabel: "Paperclip Workbench 2",
    detail:
      manifestCount > 0
        ? `validator-passing safe manifest ${manifestCount}개 · 확인 필요 ${needsAttention}개 · VPS 표시 ${vpsVisibleCount}개`
        : "validator-passing safe manifest가 아직 이 Hermes 인스턴스에 보고되지 않았습니다.",
    cards: [
      {
        id: "manifests",
        title: "안전 manifest",
        count: manifestCount,
        detail: warningCount > 0 ? `경고 집계 ${warningCount}개 · 원문 본문 없음` : "validator-passing manifest 집계",
        tone: needsAttention > 0 ? "warning" : manifestCount > 0 ? "positive" : "neutral",
      },
      {
        id: "privateDashboard",
        title: "VPS 표시",
        count: vpsVisibleCount,
        detail: vpsVisibleCount > 0 ? "VPS-local safe projection 감지" : "VPS에는 복사된 safe projection만 표시",
        tone: vpsVisibleCount > 0 ? "positive" : "neutral",
      },
      {
        id: "relayPosture",
        title: "릴레이 생산",
        count: relayCount,
        detail: relayCount > 0 ? "MacBook/WSL/VPS allowlist 릴레이 집계" : "릴레이 정보 없음",
        tone: "neutral",
      },
    ],
    redactionNote: "safe manifest 개수·상태·릴레이 allowlist만 표시하며 원문 NAS/Paperclip 자료, 경로, 토큰, 로그, 프롬프트는 표시하지 않습니다.",
  };
}

export function buildOfficePaperclipInspector(source: OfficePaperclipWorkbenchSource): OfficePaperclipInspector {
  return {
    kind: "Paperclip 안전 작업대",
    title: source.label,
    fields: [
      ["id", source.id],
      ["종류", source.sourceType],
      ["상태", source.health],
      ["항목", String(source.itemCount)],
      ["경고", String(source.warningCount)],
      ["릴레이", source.relay],
      ["상태 시점", source.timingBucket],
      ["태그", source.tags.length === 0 ? "—" : source.tags.join(" · ")],
      ["가림", source.redactionNote],
    ],
  };
}

export function buildOfficePaperclipMapProjection(sources: OfficePaperclipWorkbenchSource[]): OfficePaperclipMapProjection {
  const slots = sources.slice(0, 8).map<OfficePaperclipMapSlot>((source, index) => ({
    id: source.id,
    label: source.label,
    health: source.health,
    sourceType: source.sourceType,
    x: 18 + (index % 4) * 21,
    y: 50 + Math.floor(index / 4) * 24,
    itemCount: source.itemCount,
    warningCount: source.warningCount,
    ariaHidden: true,
    interactive: false,
  }));

  return {
    stageLabel: "Paperclip archive shelf",
    detail: slots.length > 0 ? `CSS/SVG 보관함 슬롯 ${slots.length}개` : "표시할 안전 source 슬롯이 없습니다.",
    slots,
    ariaLabel: "안전 Paperclip source-tag 보관함 투영",
  };
}

function liveWorkStatus(value: unknown): OfficeLiveOperationsCueId | "done" | "unknown" {
  const text = typeof value === "string" ? value.toLowerCase() : "";
  if (text.includes("block")) return "blocked";
  if (text.includes("report") || text.includes("summary") || text.includes("done")) return "report-ready";
  if (text.includes("review")) return "reviewing";
  if (text.includes("run") || text.includes("progress") || text.includes("active") || text.includes("ready") || text.includes("todo") || text.includes("triage")) return "working";
  if (text.includes("archive")) return "done";
  return "unknown";
}

function liveAutomationActive(job: Record<string, unknown>): boolean {
  const state = String(job.state ?? "").toLowerCase();
  const lastStatus = String(job.last_status ?? "").toLowerCase();
  const scheduledOrRunning = state.includes("run") || state.includes("sched") || state.includes("active");
  return scheduledOrRunning || ((lastStatus.includes("run") || lastStatus.includes("active")) && !state.includes("done") && !state.includes("idle"));
}

export function buildOfficeLiveOperationsLayer(state: OfficeState): OfficeLiveOperationsLayer {
  const counts: Record<OfficeLiveOperationsCueId, number> = {
    working: 0,
    reviewing: 0,
    "report-ready": 0,
    blocked: 0,
    "automation-running": 0,
  };

  state.work_items.forEach((item) => {
    const status = liveWorkStatus(item.status);
    if (status === "working" || status === "reviewing" || status === "report-ready" || status === "blocked") counts[status] += 1;
  });
  counts["automation-running"] = state.automations.filter((job) => liveAutomationActive(job)).length;

  const cueSpecs: Array<Omit<OfficeLiveOperationsCue, "count" | "ariaHidden" | "interactive">> = [
    { id: "working", label: "작업 중", detail: "safe work item 상태 집계", roomId: "work", tone: "positive" },
    { id: "reviewing", label: "리뷰 중", detail: "review 상태 항목 집계", roomId: "work", tone: "neutral" },
    { id: "report-ready", label: "보고 대기", detail: "보고/요약 준비 상태 집계", roomId: "work", tone: "positive" },
    { id: "blocked", label: "주의 필요", detail: "차단된 work item 집계", roomId: "work", tone: "negative" },
    { id: "automation-running", label: "자동화", detail: "예약/실행 중 자동화 집계", roomId: "automation", tone: "neutral" },
  ];
  const cues = cueSpecs
    .map<OfficeLiveOperationsCue>((cue) => ({ ...cue, count: counts[cue.id], ariaHidden: true, interactive: false }))
    .filter((cue) => cue.count > 0);

  return {
    stageLabel: "Live operations layer",
    summary: `작업 중 ${counts.working} · 리뷰 ${counts.reviewing} · 보고 ${counts["report-ready"]} · 주의 ${counts.blocked} · 자동화 ${counts["automation-running"]}`,
    detail: "safe DTO의 상태 문자열을 allowlist 집계로 바꿔 오피스 운영감을 표시합니다.",
    cues,
    redactionNote: "원문 업무 제목·본문·프롬프트·로그·경로·비밀값은 live operations layer에 포함하지 않습니다.",
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
  const isTablet = typeof options.viewportWidth === "number" && options.viewportWidth >= 640 && options.viewportWidth < 1024;
  const viewportMode: OfficeResponsiveReadabilityPlan["viewportMode"] = isNarrow ? "narrow" : isTablet ? "tablet" : "desktop";
  return {
    stageLabel: "Stage 12-A 반응형",
    viewportMode,
    recommendedDensityMode: isNarrow ? "summary" : isTablet ? "standard" : densityPlan.mode,
    mapClassName: `office-map--responsive${isNarrow ? " office-map--mobile-readable" : isTablet ? " office-map--tablet-readable" : ""}`,
    railClassName: isNarrow ? "office-map-rail--mobile-stack" : isTablet ? "office-map-rail--tablet-stack" : "office-map-rail--desktop",
    notes: isNarrow
      ? ["좁은 화면에서는 요약 모드 권장", "맵 rail은 세로 흐름으로 읽힘"]
      : isTablet
        ? ["태블릿 화면에서는 표준 모드 권장", "rail은 접힘 없이 세로 보조 영역으로 읽힘"]
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

export type OfficeProjectionCacheCard = {
  id: "active" | "freshness" | "rejected";
  title: string;
  value: string;
  detail: string;
  tone: "positive" | "warning" | "neutral";
};

export type OfficeProjectionCacheSummary = {
  stageLabel: string;
  status: string;
  detail: string;
  cards: OfficeProjectionCacheCard[];
};

export type OfficeProjectionOrchestrationNode = {
  id: "relay" | "validator" | "cache" | "dashboard";
  label: string;
  value: string;
  detail: string;
  tone: "positive" | "warning" | "neutral";
  motion: "active" | "waiting" | "blocked";
};

export type OfficeProjectionOrchestrationFlow = {
  id: "relay-validator" | "validator-cache" | "cache-dashboard";
  from: OfficeProjectionOrchestrationNode["id"];
  to: OfficeProjectionOrchestrationNode["id"];
  label: string;
  detail: string;
  tone: "positive" | "warning" | "neutral";
  active: boolean;
};

export type OfficeProjectionOrchestration = {
  stageLabel: string;
  status: string;
  detail: string;
  safetyNote: string;
  nodes: OfficeProjectionOrchestrationNode[];
  flows: OfficeProjectionOrchestrationFlow[];
};


export type OfficeMutationControlId = "kanban" | "automation" | "service" | "projection";

export type OfficeMutationControlReadinessControl = {
  id: OfficeMutationControlId;
  label: string;
  detail: string;
  requires: string[];
  enabled: false;
  posture: "design-gated" | "approval-gated" | "runtime-unwired";
  risk: "low" | "medium" | "high";
  recommendedOrder: number;
  dryRunOnly: boolean;
};

export type OfficeMutationControlGate = {
  id: "session" | "dryRun" | "audit" | "rollback";
  label: string;
  detail: string;
  satisfied: false;
};

export type OfficeMutationControlReadiness = {
  stageLabel: string;
  status: "blocked-read-only" | "armed-review-only";
  summary: string;
  safetyNote: string;
  gates: OfficeMutationControlGate[];
  controls: OfficeMutationControlReadinessControl[];
};

export function buildOfficeMutationControlReadiness(state: OfficeState): OfficeMutationControlReadiness {
  const approvedByCapability = state.capabilities.mutations_enabled === true && state.capabilities.read_only === false;
  const status: OfficeMutationControlReadiness["status"] = approvedByCapability ? "armed-review-only" : "blocked-read-only";
  const sharedRequires = ["explicit user approval", "audited backend endpoint", "confirmation UX", "safe audit trail"];
  return {
    stageLabel: "Mutation Control Readiness 2",
    status,
    summary: approvedByCapability
      ? "가장 낮은 위험 후보는 safe projection dry-run입니다. UI는 계속 실행 불가 상태로 두고 설계·감사·롤백 게이트만 표시합니다."
      : "현재 OfficeState는 읽기 전용이므로 제어 후보는 모두 잠겨 있습니다.",
    safetyNote: "이 패널은 실행 버튼이 아니라 설계/승인/감사 조건을 표시하는 안전 게이트입니다.",
    gates: [
      {
        id: "session",
        label: "세션 승인",
        detail: "작업 단위 승인과 범위가 문서에 남아야 합니다.",
        satisfied: false,
      },
      {
        id: "dryRun",
        label: "Dry-run 우선",
        detail: "첫 mutation 후보는 캐시를 바꾸지 않는 dry-run 결과만 반환해야 합니다.",
        satisfied: false,
      },
      {
        id: "audit",
        label: "감사 기록",
        detail: "결과는 safe metadata만 남기고 raw value를 echo하지 않아야 합니다.",
        satisfied: false,
      },
      {
        id: "rollback",
        label: "롤백 핸들",
        detail: "실제 승격 전 active/archive 복구 경로가 확인되어야 합니다.",
        satisfied: false,
      },
    ],
    controls: [
      {
        id: "projection",
        label: "Projection ingest dry-run",
        detail: "validator-passing safe bundle을 실제 active cache 변경 없이 승격 가능 여부만 계산합니다.",
        requires: [...sharedRequires, "validator-passing bundle", "no raw value echo", "dry-run response first"],
        enabled: false,
        posture: "approval-gated",
        risk: "low",
        recommendedOrder: 1,
        dryRunOnly: true,
      },
      {
        id: "kanban",
        label: "Kanban 작업 제어",
        detail: "작업 생성·상태 변경·배정 후보는 별도 엔드포인트와 감사 설계 전까지 비활성입니다.",
        requires: [...sharedRequires, "kanban action allowlist"],
        enabled: false,
        posture: "design-gated",
        risk: "medium",
        recommendedOrder: 2,
        dryRunOnly: true,
      },
      {
        id: "automation",
        label: "자동화 제어",
        detail: "cron 실행·중지·일정 변경 후보는 스크립트/출력 비노출 조건 전까지 비활성입니다.",
        requires: [...sharedRequires, "cron action allowlist"],
        enabled: false,
        posture: "approval-gated",
        risk: "high",
        recommendedOrder: 3,
        dryRunOnly: true,
      },
      {
        id: "service",
        label: "서비스 제어",
        detail: "gateway/dashboard/systemd 계층은 서비스별 승인과 롤백 문서 전까지 UI에서 실행하지 않습니다.",
        requires: [...sharedRequires, "service-specific approval", "rollback handle"],
        enabled: false,
        posture: "runtime-unwired",
        risk: "high",
        recommendedOrder: 4,
        dryRunOnly: true,
      },
    ],
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

export function buildOfficeProjectionCacheSummary(state: OfficeState): OfficeProjectionCacheSummary {
  const cache = state.projection_cache;
  const active = cache?.active ?? null;
  const rejectedCount = cache?.rejected?.count ?? 0;
  const sourceTags = active?.source_tags?.slice(0, 3).join(", ") || "safe DTO 없음";
  const activeTone: OfficeProjectionCacheCard["tone"] = active ? "positive" : "neutral";
  const activeValue = active?.bundle_id || "last-known-good 없음";
  const freshnessDetail = active
    ? `${active.generated_by} · ${active.source_kind} · stale ${active.freshness?.stale_after || "미정"}`
    : "active cache가 없으면 /office는 기존 안전 DTO와 빈 projection 상태만 표시합니다.";
  const rejectionTone: OfficeProjectionCacheCard["tone"] = rejectedCount > 0 ? "warning" : "neutral";
  return {
    stageLabel: "Office Projection Pipeline 1",
    status: cache?.status ?? "missing",
    detail: active
      ? `활성 safe projection: ${activeValue} · ${sourceTags}`
      : "아직 promote된 safe projection bundle이 없습니다.",
    cards: [
      {
        id: "active",
        title: "활성 projection",
        value: activeValue,
        detail: active ? `validator ${active.validator?.result || "unknown"} · raw_excluded ${active.redaction?.raw_excluded ? "true" : "unknown"}` : "VPS active/ 비어 있음",
        tone: activeTone,
      },
      {
        id: "freshness",
        title: "신선도",
        value: active?.freshness?.stale_after || "stale 기준 없음",
        detail: freshnessDetail,
        tone: activeTone,
      },
      {
        id: "rejected",
        title: "최근 거부",
        value: `${rejectedCount}개`,
        detail: rejectedCount > 0 ? "값을 echo하지 않고 reason/path 집계만 표시" : "거부된 incoming bundle 없음",
        tone: rejectionTone,
      },
    ],
  };
}

export function buildOfficeProjectionOrchestration(state: OfficeState): OfficeProjectionOrchestration {
  const cache = state.projection_cache;
  const active = cache?.active ?? null;
  const rejectedCount = cache?.rejected?.count ?? 0;
  const liveSourceCount = state.data_sources.filter((source) => source.status === "ok" || source.status === "partial").length;
  const missingSourceCount = state.data_sources.filter((source) => source.status === "missing" || source.status === "unavailable" || source.status === "error").length;
  const validatorResult = String(active?.validator?.result ?? "waiting");
  const validatorPassed = validatorResult === "pass";
  const relayValue = active ? `${active.generated_by} · ${active.source_kind}` : `${liveSourceCount}개 safe DTO`;
  const cacheStatus = cache?.status ?? "missing";
  const hasDashboardProjection = Boolean(active) || liveSourceCount > 0;
  const validatorTone: OfficeProjectionOrchestrationNode["tone"] = validatorPassed ? "positive" : rejectedCount > 0 ? "warning" : "neutral";
  const cacheTone: OfficeProjectionOrchestrationNode["tone"] = active ? "positive" : rejectedCount > 0 ? "warning" : "neutral";
  return {
    stageLabel: "Projection Orchestration",
    status: cacheStatus,
    detail: active
      ? `실제 active cache ${active.bundle_id}를 relay → validator → active cache → /office 순서로 투사 중`
      : "active projection은 대기 중이며, 현재는 live safe DTO와 missing 상태를 그대로 표시합니다.",
    safetyNote: "직접 원천 접근이 아니라 validator-passing safe bundle과 이미 가려진 DTO만 /office에 투사합니다.",
    nodes: [
      {
        id: "relay",
        label: "Relay 생산",
        value: relayValue,
        detail: active ? "Mac/WSL/manual relay가 만든 safe bundle 후보" : "relay bundle 대기 · live DTO만 표시",
        tone: active || liveSourceCount > 0 ? "positive" : "neutral",
        motion: active ? "active" : "waiting",
      },
      {
        id: "validator",
        label: "검증 게이트",
        value: validatorPassed ? "pass" : rejectedCount > 0 ? `${rejectedCount} rejected` : "대기",
        detail: "민감값 sentinel을 통과한 요약만 허용",
        tone: validatorTone,
        motion: validatorPassed ? "active" : rejectedCount > 0 ? "blocked" : "waiting",
      },
      {
        id: "cache",
        label: "Active cache",
        value: active ? "last-known-good" : "비어 있음",
        detail: active ? `${active.generated_at} 생성 · stale ${active.freshness?.stale_after ?? "미정"}` : "promotion 전이면 기존 DTO/빈 projection posture 유지",
        tone: cacheTone,
        motion: active ? "active" : "waiting",
      },
      {
        id: "dashboard",
        label: "/office 투사",
        value: hasDashboardProjection ? "동적 표시" : "빈 상태",
        detail: `${liveSourceCount}개 연결/부분 source, ${missingSourceCount}개 missing/degraded source를 안전 집계로 표시`,
        tone: hasDashboardProjection ? "positive" : "neutral",
        motion: hasDashboardProjection ? "active" : "waiting",
      },
    ],
    flows: [
      {
        id: "relay-validator",
        from: "relay",
        to: "validator",
        label: "safe bundle 후보",
        detail: "원천 값을 직접 보여주지 않고 allowlisted manifest/payload만 이동",
        tone: active ? "positive" : "neutral",
        active: Boolean(active),
      },
      {
        id: "validator-cache",
        from: "validator",
        to: "cache",
        label: validatorPassed ? "promoted" : rejectedCount > 0 ? "rejected" : "대기",
        detail: validatorPassed ? "검증 통과 bundle만 active cache로 승격" : "검증 실패는 값 echo 없이 rejection 집계만 남김",
        tone: validatorPassed ? "positive" : rejectedCount > 0 ? "warning" : "neutral",
        active: validatorPassed,
      },
      {
        id: "cache-dashboard",
        from: "cache",
        to: "dashboard",
        label: "last-known-good 투사",
        detail: "브라우저에는 cache/source posture와 안전 count/status만 전달",
        tone: hasDashboardProjection ? "positive" : "neutral",
        active: hasDashboardProjection,
      },
    ],
  };
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
