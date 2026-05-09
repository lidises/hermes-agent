import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  AlertTriangle,
  Bot,
  Building2,
  Clock,
  Database,
  Eye,
  Filter,
  Lock,
  MapPinned,
  RefreshCw,
  Route,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@nous-research/ui/ui/components/button";
import { Spinner } from "@nous-research/ui/ui/components/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type OfficeDataSource, type OfficeSourceStatus, type OfficeState } from "@/lib/api";
import {
  buildOfficeAttentionItems,
  buildOfficeCharacterActivity,
  buildOfficeCharacterInspector,
  buildOfficeCharacterRoutes,
  buildOfficeCharacterSceneObjects,
  buildOfficeCharacterTrackingCues,
  buildOfficeCharacterView,
  buildOfficeCharacters,
  buildOfficeEmptySourceCopyPlan,
  buildOfficeEmptyStateHints,
  buildOfficeMapDensityPlan,
  buildOfficeMapJumpTargets,
  buildOfficeMapPolishPlan,
  buildOfficeResponsiveReadabilityPlan,
  buildOfficeRoomActivityMeters,
  buildOfficeSafePulseTimeline,
  buildOfficeSafeBreadcrumbTrail,
  buildOfficeSafeRouteCompass,
  buildOfficeSafeFocusLane,
  buildOfficeSafeAttentionStrip,
  buildOfficeSafeRoomBeacons,
  buildOfficeSafeFlowPulseBands,
  buildOfficeSafeTacticalMinimap,
  buildOfficeSafeTacticalTicker,
  buildOfficeSafeMissionClock,
  buildOfficeSafeCommandDeck,
  buildOfficeSafeStatusSnapshot,
  buildOfficeSafeFloorLegend,
  buildOfficeMapFlows,
  buildOfficeMapNodes,
  buildOfficeSceneMotionTrack,
  buildOfficeSceneObjectView,
  buildOfficeSceneObjects,
  buildOfficeSourceHealthSummary,
  buildOfficeStateDelta,
  buildOfficeUsabilitySummary,
  groupByText,
  mergeOfficeRecentChanges,
  numberField,
  OFFICE_LIVE_TRACKING_BASE_INTERVAL_MS,
  resolveOfficeLiveTrackingInterval,
  textField,
  visibleRows,
  type OfficeCharacter,
  type OfficeMapDensityMode,
  type OfficeMapFlow,
  type OfficeMapNode,
  type OfficeRecentChange,
  type OfficeSceneObject,
  type OfficeStateDelta,
} from "./officeView";

const FOCUS_OPTIONS = ["overview", "work", "automation", "routing"] as const;
const LIST_LIMIT = 6;
const EVENT_LIMIT = 12;
const CHANGE_LIMIT = 6;
type FocusOption = (typeof FOCUS_OPTIONS)[number];

const FOCUS_LABEL: Record<FocusOption, string> = {
  overview: "전체",
  work: "작업",
  automation: "자동화",
  routing: "라우팅",
};

const HEALTH_LABEL: Record<OfficeMapNode["health"], string> = {
  ok: "정상",
  partial: "부분 연결",
  missing: "미연결",
  error: "오류",
};

const ZONE_LABEL: Record<OfficeMapNode["zone"], string> = {
  entry: "입구",
  workbench: "작업대",
  machine: "기계실",
  routing: "라우팅",
};

type InspectorSelection = {
  kind: string;
  title: string;
  fields: Array<[string, string]>;
};

function fmt(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") return new Date(value * 1000).toLocaleString();
  if (typeof value !== "string") return String(value);
  if (/^\d{4}-\d{2}-\d{2}T/.test(value)) return new Date(value).toLocaleString();
  return value;
}

const SOURCE_TONE: Record<OfficeSourceStatus, string> = {
  ok: "border-emerald-400/40 text-emerald-300",
  partial: "border-yellow-400/40 text-yellow-300",
  missing: "border-sky-400/40 text-sky-300",
  unavailable: "border-zinc-400/40 text-zinc-300",
  error: "border-red-400/40 text-red-300",
};

const SOURCE_LABEL: Record<OfficeSourceStatus, string> = {
  ok: "정상",
  partial: "부분 연결",
  missing: "미연결",
  unavailable: "사용 불가",
  error: "오류",
};

const EMPTY_STATE_DELTA: OfficeStateDelta = {
  hasChanges: false,
  nodeBadges: { sessions: [], work: [], automation: [], routing: [] },
  changedFlows: [],
  recentChanges: [],
};

const EMPTY_OFFICE_STATE: OfficeState = {
  schema_version: 1,
  generated_at: "",
  mode: "read_only",
  display_mode: "localhost",
  capabilities: { read_only: true, mutations_enabled: false, remote_mode: "unsupported" },
  data_sources: [],
  summary: {},
  rooms: [],
  agents: [],
  work_items: [],
  automations: [],
  topics: [],
  events: [],
  provenance: [],
  redactions: { policy_version: 1, redacted_field_count: 0, omitted_sections: [], warnings: [] },
};

function StatusPill({ status }: { status: OfficeSourceStatus | string }) {
  const tone = SOURCE_TONE[status as OfficeSourceStatus] ?? "border-zinc-400/40 text-zinc-300";
  const label = SOURCE_LABEL[status as OfficeSourceStatus] ?? status;
  return (
    <span className={`whitespace-nowrap border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] ${tone}`}>
      {label}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-midground/60">{children}</div>;
}

function SourceCard({ source, onInspect }: { source: OfficeDataSource; onInspect: () => void }) {
  return (
    <div className="border border-current/15 bg-black/20 p-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{source.id}</span>
        <StatusPill status={source.status} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-midground/75">
        <div>
          <div className="text-midground/45">항목</div>
          <div className="text-foreground">{source.item_count ?? "—"}</div>
        </div>
        <div>
          <div className="text-midground/45">경고</div>
          <div className={source.warning_count ? "text-yellow-300" : "text-foreground"}>{source.warning_count ?? 0}</div>
        </div>
      </div>
      {source.error_summary ? (
        <div className="mt-3 border border-red-400/30 bg-red-950/20 p-2 text-xs text-red-300/90">{source.error_summary}</div>
      ) : null}
      <button type="button" onClick={onInspect} className="mt-3 flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-midground/70 hover:text-foreground">
        <Eye className="h-3 w-3" /> 살펴보기
      </button>
    </div>
  );
}

function EmptyLine({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="border border-dashed border-current/15 bg-black/10 p-4 text-sm text-midground/65">
      <div>가려진 OfficeState DTO에 {label} 정보가 없습니다.</div>
      {hint ? <div className="mt-2 text-xs leading-5 text-midground/50">{hint}</div> : null}
    </div>
  );
}

function StatCard({ label, value, detail, tone = "text-foreground" }: { label: string; value: unknown; detail: string; tone?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xs uppercase tracking-[0.18em] text-midground/70">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-semibold ${tone}`}>{String(value ?? 0)}</div>
        <div className="mt-2 text-xs text-midground/60">{detail}</div>
      </CardContent>
    </Card>
  );
}

function EntityRow({
  title,
  meta,
  badge,
  warning,
  onInspect,
}: {
  title: string;
  meta: string;
  badge?: string;
  warning?: string | null;
  onInspect?: () => void;
}) {
  return (
    <div className="border border-current/15 bg-black/15 p-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="font-semibold text-foreground">{title}</span>
        {badge ? <span className="shrink-0 text-xs text-midground/70">{badge}</span> : null}
      </div>
      <div className="mt-1 text-xs text-midground/70">{meta}</div>
      {warning ? <div className="mt-2 border border-red-400/30 bg-red-950/20 p-2 text-xs text-red-300">{warning}</div> : null}
      {onInspect ? (
        <button type="button" onClick={onInspect} className="mt-3 flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-midground/70 hover:text-foreground">
          <Eye className="h-3 w-3" /> 살펴보기
        </button>
      ) : null}
    </div>
  );
}

function MiniList({
  title,
  icon,
  children,
  meta,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  meta?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          {icon}
          {title}
        </CardTitle>
        {meta ? <div className="text-xs text-midground/55">{meta}</div> : null}
      </CardHeader>
      <CardContent className="space-y-3">{children}</CardContent>
    </Card>
  );
}

function mapNodeTone(health: OfficeMapNode["health"]): string {
  if (health === "ok") return "border-emerald-300/70 bg-emerald-950/70 text-emerald-50";
  if (health === "partial") return "border-yellow-300/75 bg-yellow-950/70 text-yellow-50";
  if (health === "error") return "border-red-300/80 bg-red-950/70 text-red-50";
  return "border-sky-300/65 bg-sky-950/70 text-sky-50";
}

function mapFlowTone(health: OfficeMapFlow["health"]): string {
  if (health === "ok") return "text-emerald-200/45";
  if (health === "partial") return "text-yellow-200/55";
  if (health === "error") return "text-red-200/60";
  return "text-sky-200/45";
}

function changeToneClass(tone: OfficeRecentChange["tone"]): string {
  if (tone === "positive") return "border-emerald-300/40 bg-emerald-950/40 text-emerald-200";
  if (tone === "negative") return "border-red-300/45 bg-red-950/40 text-red-200";
  if (tone === "warning") return "border-yellow-300/45 bg-yellow-950/40 text-yellow-200";
  return "border-sky-300/40 bg-sky-950/35 text-sky-200";
}

function changedFlowToneClass(tone: OfficeRecentChange["tone"]): string {
  if (tone === "positive") return "text-emerald-100 drop-shadow-[0_0_6px_rgba(110,231,183,0.8)]";
  if (tone === "negative") return "text-red-100 drop-shadow-[0_0_6px_rgba(252,165,165,0.8)]";
  if (tone === "warning") return "text-yellow-100 drop-shadow-[0_0_6px_rgba(253,224,71,0.85)]";
  return "text-sky-100 drop-shadow-[0_0_6px_rgba(125,211,252,0.75)]";
}

function routeToneClass(tone: ReturnType<typeof buildOfficeCharacterRoutes>[number]["tone"]): string {
  if (tone === "danger") return "office-route-hint--danger";
  if (tone === "warning") return "office-route-hint--warning";
  return "office-route-hint--normal";
}

function routeMotionClass(motion: ReturnType<typeof buildOfficeCharacterRoutes>[number]["motion"]): string {
  return motion === "alert" ? "office-route-hint--alert" : "office-route-hint--route";
}

function SceneObjectMarker({ object }: { object: OfficeSceneObject }) {
  const view = buildOfficeSceneObjectView(object);
  const motion = buildOfficeSceneMotionTrack(object);
  return (
    <div
      className={`pointer-events-none absolute z-20 flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center border text-[10px] font-bold shadow-md ring-1 ring-black/50 ${motion.className} ${view.toneClass}`}
      style={{ left: `${object.x}%`, top: `${object.y}%`, ...motion.style } as React.CSSProperties}
      title={`${view.title} · ${motion.ariaLabel}`}
      aria-hidden={view.ariaHidden}
      data-office-scene-marker="true"
      data-office-motion-label={motion.ariaLabel}
    >
      {view.glyph}
    </div>
  );
}

function activityToneClass(tone: ReturnType<typeof buildOfficeCharacterActivity>["tone"]): string {
  if (tone === "success") return "office-character__activity--success";
  if (tone === "warning") return "office-character__activity--warning";
  if (tone === "danger") return "office-character__activity--danger";
  if (tone === "muted") return "office-character__activity--muted";
  return "office-character__activity--normal";
}

function trackingToneClass(tone: ReturnType<typeof buildOfficeCharacterTrackingCues>[number]["tone"]): string {
  if (tone === "alert") return "office-character-tracking--alert";
  if (tone === "warning") return "office-character-tracking--warning";
  return "office-character-tracking--steady";
}

function roomActivityClass(level: ReturnType<typeof buildOfficeRoomActivityMeters>[number]["level"]): string {
  if (level === "changed") return "office-room-activity--changed";
  if (level === "busy") return "office-room-activity--busy";
  if (level === "active") return "office-room-activity--active";
  return "office-room-activity--quiet";
}

function safePulseToneClass(tone: OfficeRecentChange["tone"]): string {
  if (tone === "positive") return "office-safe-pulse-timeline__item--positive";
  if (tone === "negative") return "office-safe-pulse-timeline__item--negative";
  if (tone === "warning") return "office-safe-pulse-timeline__item--warning";
  return "office-safe-pulse-timeline__item--neutral";
}

function safeRoomBeaconIntensityClass(intensity: ReturnType<typeof buildOfficeSafeRoomBeacons>["beacons"][number]["intensity"]): string {
  if (intensity === "high") return "office-safe-room-beacon--high";
  if (intensity === "medium") return "office-safe-room-beacon--medium";
  if (intensity === "low") return "office-safe-room-beacon--low";
  return "office-safe-room-beacon--idle";
}

function RoomActivityMeter({ node, meter }: { node: OfficeMapNode; meter: ReturnType<typeof buildOfficeRoomActivityMeters>[number] }) {
  return (
    <div
      className={`office-room-activity absolute z-[24] -translate-x-1/2 ${roomActivityClass(meter.level)}`}
      style={{ left: `${node.x}%`, top: `calc(${node.y}% + 3.15rem)`, "--office-room-activity-percent": `${meter.percent}%` } as React.CSSProperties}
      title={`${meter.detail} · ${meter.reducedMotionLabel}`}
      aria-hidden={meter.ariaHidden}
      data-office-room-activity="true"
      data-office-room-activity-level={meter.level}
    >
      <span className="office-room-activity__label">{meter.label}</span>
      <span className="office-room-activity__bar"><span /></span>
    </div>
  );
}

function CharacterTrackingCue({ character, cue }: { character: OfficeCharacter; cue: ReturnType<typeof buildOfficeCharacterTrackingCues>[number] }) {
  return (
    <div
      className={`office-character-tracking absolute z-[32] -translate-x-1/2 -translate-y-1/2 ${trackingToneClass(cue.tone)}`}
      style={{ left: `${character.x}%`, top: `${character.y}%`, ...cue.style } as React.CSSProperties}
      title={`${cue.detail} · ${cue.reducedMotionLabel}`}
      aria-hidden={cue.ariaHidden}
      data-office-character-tracking="true"
      data-office-character-tracking-tone={cue.tone}
    >
      <span className="office-character-tracking__ring" />
      <span className="office-character-tracking__label">{cue.label}</span>
    </div>
  );
}

function CharacterMarker({ character, latestDelta, onInspect }: { character: OfficeCharacter; latestDelta: OfficeStateDelta; onInspect: () => void }) {
  const view = buildOfficeCharacterView(character);
  const activity = buildOfficeCharacterActivity(character, latestDelta);
  const inspector = buildOfficeCharacterInspector(character, latestDelta);
  const object = buildOfficeCharacterSceneObjects([character])[0];
  const motion = buildOfficeSceneMotionTrack(object);
  return (
    <button
      type="button"
      className={`office-character-inspect absolute z-[35] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 ${motion.className}`}
      style={{ left: `${character.x}%`, top: `${character.y}%`, ...motion.style } as React.CSSProperties}
      title={`${view.safeTitle} · ${activity.label} · ${activity.reducedMotionLabel} · ${motion.ariaLabel}`}
      aria-label={inspector.ariaLabel}
      onClick={onInspect}
      data-office-scene-marker="true"
      data-office-character-role={character.role}
      data-office-character-status={character.status}
      data-office-character-activity={activity.id}
      data-office-character-inspect="true"
      data-office-motion-label={motion.ariaLabel}
    >
      <span className={view.bodyClassName} aria-hidden="true">
        <span className="office-character__head" />
        <span className="office-character__body" />
        <span className={view.accessoryClassName}>{view.glyph}</span>
        <span className="office-character__status-light" />
      </span>
      <span className="office-character__nameplate" aria-hidden="true">
        <span>{view.nameplate}</span>
        <span className="office-character__status-text">{view.statusLabel}</span>
      </span>
      <span className={`office-character__activity ${activityToneClass(activity.tone)}`} aria-hidden="true">{activity.label}</span>
    </button>
  );
}

const OFFICE_ZONE_PANELS: Array<{ id: OfficeMapNode["id"]; label: string; className: string; style: React.CSSProperties }> = [
  { id: "sessions", label: "입구", className: "border-emerald-200/25 bg-[repeating-linear-gradient(45deg,rgba(16,185,129,0.13)_0_6px,rgba(16,185,129,0.055)_6px_12px)]", style: { left: "10%", top: "14%", width: "34%", height: "30%" } },
  { id: "work", label: "작업대", className: "border-yellow-200/25 bg-[repeating-linear-gradient(0deg,rgba(234,179,8,0.13)_0_5px,rgba(234,179,8,0.055)_5px_11px)]", style: { left: "56%", top: "14%", width: "34%", height: "30%" } },
  { id: "automation", label: "기계실", className: "border-cyan-200/25 bg-[repeating-linear-gradient(90deg,rgba(34,211,238,0.13)_0_5px,rgba(34,211,238,0.055)_5px_11px)]", style: { left: "10%", top: "54%", width: "34%", height: "25%" } },
  { id: "routing", label: "우편실", className: "border-sky-200/25 bg-[repeating-linear-gradient(135deg,rgba(125,211,252,0.13)_0_6px,rgba(125,211,252,0.055)_6px_12px)]", style: { left: "56%", top: "54%", width: "34%", height: "25%" } },
];

function OfficeMap({
  nodes,
  flows,
  characters,
  sceneObjects,
  latestDelta,
  recentChanges,
  usabilitySummary,
  densityMode,
  densityPlan,
  jumpTargets,
  responsivePlan,
  onDensityModeChange,
  onInspect,
  onInspectCharacter,
}: {
  nodes: OfficeMapNode[];
  flows: OfficeMapFlow[];
  characters: OfficeCharacter[];
  sceneObjects: OfficeSceneObject[];
  latestDelta: OfficeStateDelta;
  recentChanges: OfficeRecentChange[];
  usabilitySummary: ReturnType<typeof buildOfficeUsabilitySummary>;
  densityMode: OfficeMapDensityMode;
  densityPlan: ReturnType<typeof buildOfficeMapDensityPlan>;
  jumpTargets: ReturnType<typeof buildOfficeMapJumpTargets>;
  responsivePlan: ReturnType<typeof buildOfficeResponsiveReadabilityPlan>;
  onDensityModeChange: (mode: OfficeMapDensityMode) => void;
  onInspect: (node: OfficeMapNode) => void;
  onInspectCharacter: (character: OfficeCharacter) => void;
}) {
  const changedFlowById = new Map(latestDelta.changedFlows.map((flow) => [`${flow.from}->${flow.to}`, flow]));
  const characterRoutes = buildOfficeCharacterRoutes(latestDelta);
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const polishPlan = buildOfficeMapPolishPlan(densityPlan);
  const trackingCues = buildOfficeCharacterTrackingCues(densityPlan.visibleCharacters, latestDelta);
  const trackingCueByCharacterId = new Map(trackingCues.map((cue) => [cue.characterId, cue]));
  const roomActivityMeters = buildOfficeRoomActivityMeters(nodes, densityPlan.visibleCharacters, latestDelta);
  const roomActivityById = new Map(roomActivityMeters.map((meter) => [meter.roomId, meter]));
  const safePulseTimeline = buildOfficeSafePulseTimeline(latestDelta);
  const safeBreadcrumbTrail = buildOfficeSafeBreadcrumbTrail(latestDelta);
  const safeRouteCompass = buildOfficeSafeRouteCompass(latestDelta);
  const safeFocusLane = buildOfficeSafeFocusLane(latestDelta);
  const safeAttentionStrip = buildOfficeSafeAttentionStrip(latestDelta);
  const safeRoomBeacons = buildOfficeSafeRoomBeacons(latestDelta);
  const safeFlowPulseBands = buildOfficeSafeFlowPulseBands(latestDelta);
  const safeTacticalMinimap = buildOfficeSafeTacticalMinimap(latestDelta);
  const safeTacticalTicker = buildOfficeSafeTacticalTicker(latestDelta);
  const safeFloorLegend = buildOfficeSafeFloorLegend(latestDelta);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPinned className="h-4 w-4" /> 오피스 맵
        </CardTitle>
        <div className="text-xs text-midground/55">
          모델/에이전트가 역할별 캐릭터로 배치되는 RPG 오피스 맵입니다. 캐릭터 움직임, 액션 칩, 방 사이 흐름 표식은 안전 DTO의 상태/개수/흐름만 반영하며, 캐릭터 살펴보기도 생성된 안전 필드만 보여줍니다.
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs" data-office-density-controls="true">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-midground/45">Stage 10-G 밀도</span>
          {(["summary", "standard", "detail"] as const).map((mode) => {
            const plan = buildOfficeMapDensityPlan(mode, characters);
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onDensityModeChange(mode)}
                className={`border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${densityMode === mode ? "border-emerald-300/60 text-emerald-200" : "border-current/20 text-midground/65 hover:text-foreground"}`}
                aria-pressed={densityMode === mode}
                data-office-density-mode={mode}
              >
                {plan.label}
              </button>
            );
          })}
          <span className="text-[10px] text-midground/50">{densityPlan.detail}</span>
        </div>
        <nav className="mt-2 flex flex-wrap items-center gap-2 text-xs" aria-label="오피스 맵 빠른 이동" data-office-jump-targets="true">
          <span className="mr-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-midground/45">Stage 10-H 이동</span>
          {jumpTargets.map((target) => (
            <a
              key={target.id}
              href={`#${target.targetId}`}
              className={`border px-2 py-1 text-[10px] font-semibold tracking-[0.12em] ${target.enabled ? "border-current/20 text-midground/70 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-emerald-200/70" : "pointer-events-none border-current/10 text-midground/35"}`}
              aria-disabled={!target.enabled}
              aria-label={`${target.label} 이동, ${target.detail}`}
              data-office-jump-target={target.id}
            >
              {target.label}
            </a>
          ))}
        </nav>
      </CardHeader>
      <CardContent>
        <div
          id="office-map-canvas"
          tabIndex={-1}
          className={`relative min-h-[620px] scroll-mt-24 overflow-hidden border border-current/20 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_34%),linear-gradient(135deg,rgba(255,255,255,0.055),rgba(0,0,0,0.20))] p-4 pb-28 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 sm:min-h-[560px] ${polishPlan.mapClassName} ${responsivePlan.mapClassName}`}
          data-office-polish="true"
          data-office-polish-label-mode={polishPlan.characterLabelMode}
          data-office-polish-rail-mode={polishPlan.lowerRailMode}
          data-office-responsive="true"
          data-office-responsive-mode={responsivePlan.viewportMode}
          data-office-responsive-recommended-density={responsivePlan.recommendedDensityMode}
        >
          <svg className="pointer-events-none absolute inset-0 z-10 h-full w-full text-midground/20" role="img" aria-label="읽기 전용 오피스 흐름 연결" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <marker id="office-map-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                <path d="M0 0 L8 4 L0 8 Z" fill="currentColor" />
              </marker>
            </defs>
            <rect x="8" y="12" width="84" height="76" fill="none" stroke="currentColor" strokeWidth="0.5" />
            <path d="M50 12 V88" fill="none" stroke="currentColor" strokeWidth="0.35" opacity="0.5" />
            {flows.map((flow) => {
              const from = nodes.find((node) => node.id === flow.from);
              const to = nodes.find((node) => node.id === flow.to);
              const changedFlow = changedFlowById.get(`${flow.from}->${flow.to}`);
              if (!from || !to) return null;
              return (
                <path
                  key={`${flow.from}-${flow.to}`}
                  d={`M${from.x} ${from.y} L${to.x} ${to.y}`}
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray={flow.health === "ok" ? "" : "2 2"}
                  strokeWidth={changedFlow ? "0.95" : "0.55"}
                  markerEnd="url(#office-map-arrow)"
                  aria-label={changedFlow ? `${flow.label} 최근 흐름 변경` : flow.label}
                  className={`${mapFlowTone(flow.health)} ${changedFlow ? `${changedFlowToneClass(changedFlow.tone)} motion-safe:animate-pulse` : ""}`}
                />
              );
            })}
          </svg>
          <svg className="office-safe-flow-pulse-bands" aria-label="Stage 14-I 안전 flow pulse bands" data-office-safe-flow-pulse-bands="true" viewBox="0 0 100 100" preserveAspectRatio="none">
            {safeFlowPulseBands.bands.map((band) => (
              <line
                key={band.id}
                x1={band.x1}
                y1={band.y1}
                x2={band.x2}
                y2={band.y2}
                className={`office-safe-flow-pulse-band ${safePulseToneClass(band.tone)} ${safeRoomBeaconIntensityClass(band.intensity)}`}
                aria-hidden={band.ariaHidden}
                data-office-safe-flow-pulse-band={band.id}
                data-office-safe-flow-pulse-band-intensity={band.intensity}
              />
            ))}
          </svg>
          <div className="absolute left-4 top-4 z-40 border border-current/10 bg-black/35 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-midground/80">안전 오피스 투영</div>
          {OFFICE_ZONE_PANELS.map((zone) => (
            <div key={zone.id} className={`absolute z-0 border shadow-inner ${zone.className}`} style={zone.style} aria-hidden="true">
              <div className="absolute bottom-2 right-2 border border-current/10 bg-black/35 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.18em] text-midground/70">{zone.label}</div>
            </div>
          ))}
          {characterRoutes.map((route) => {
            const from = nodeById.get(route.fromRoomId);
            const to = nodeById.get(route.toRoomId);
            if (!from || !to) return null;
            return (
              <div
                key={route.id}
                className={`office-route-hint ${routeToneClass(route.tone)} ${routeMotionClass(route.motion)}`}
                style={{ left: `${(from.x + to.x) / 2}%`, top: `${(from.y + to.y) / 2}%` }}
                title={`${route.detail} · ${route.reducedMotionLabel}`}
                aria-hidden="true"
                data-office-character-route={route.id}
              >
                <span className="office-route-hint__dot" />
                <span className="office-route-hint__dot" />
                <span className="office-route-hint__dot" />
                <span className="office-route-hint__label">{route.label}</span>
              </div>
            );
          })}
          <div className="office-safe-room-beacons" aria-label="Stage 14-H 안전 room beacons" data-office-safe-room-beacons="true">
            {safeRoomBeacons.beacons.map((beacon) => (
              <span
                key={beacon.roomId}
                className={`office-safe-room-beacon ${safePulseToneClass(beacon.tone)} ${safeRoomBeaconIntensityClass(beacon.intensity)}`}
                style={{ left: `${beacon.x}%`, top: `${beacon.y}%`, "--office-safe-room-beacon-scale": `${Math.min(2.4, 0.8 + beacon.weight * 0.28)}` } as React.CSSProperties}
                title={`${beacon.detail} · ${beacon.reducedMotionLabel}`}
                aria-hidden={beacon.ariaHidden}
                data-office-safe-room-beacon={beacon.roomId}
                data-office-safe-room-beacon-intensity={beacon.intensity}
                data-office-safe-room-beacon-weight={beacon.weight}
              >
                <span className="office-safe-room-beacon__ring" />
                <span className="office-safe-room-beacon__core" />
                <span className="office-safe-room-beacon__label">{beacon.label}</span>
              </span>
            ))}
          </div>
          {densityPlan.visibleCharacters.length > 0
            ? densityPlan.visibleCharacters.map((character) => {
                const cue = trackingCueByCharacterId.get(character.id);
                return cue ? <CharacterTrackingCue key={`tracking-${character.id}`} character={character} cue={cue} /> : null;
              })
            : null}
          {densityPlan.visibleCharacters.length > 0
            ? densityPlan.visibleCharacters.map((character) => <CharacterMarker key={character.id} character={character} latestDelta={latestDelta} onInspect={() => onInspectCharacter(character)} />)
            : sceneObjects.map((object) => <SceneObjectMarker key={object.id} object={object} />)}
          {nodes.map((node) => {
            const meter = roomActivityById.get(node.id);
            return meter ? <RoomActivityMeter key={`room-activity-${node.id}`} node={node} meter={meter} /> : null;
          })}
          {nodes.map((node) => {
            const badges = latestDelta.nodeBadges[node.id] ?? [];
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onInspect(node)}
                aria-label={`${node.label} 오피스 맵 방, 안전 항목 ${node.count}개, 상태 ${HEALTH_LABEL[node.health]}${badges.length ? `, 최근 변화 ${badges.map((badge) => badge.label).join(" ")}` : ""}`}
                className={`absolute z-30 w-[min(9.25rem,42vw)] -translate-x-1/2 -translate-y-1/2 border p-2 text-left shadow-xl ring-1 ring-black/40 backdrop-blur-md transition hover:scale-[1.02] hover:border-current/70 focus:outline-none focus:ring-2 focus:ring-emerald-200/70 ${mapNodeTone(node.health)}`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-current/70">{ZONE_LABEL[node.zone]}</div>
                <div className="mt-1 flex items-center justify-between gap-3">
                  <span className="text-[13px] font-bold uppercase tracking-[0.14em]">{node.label}</span>
                  <span className="text-2xl font-bold">{node.count}</span>
                </div>
                {badges.length ? (
                  <div className="mt-2 flex flex-wrap gap-1" aria-label={`${node.label} 최근 변화 badge`}>
                    {badges.map((badge) => (
                      <span key={`${node.id}-${badge.label}-${badge.tone}`} className={`border px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.12em] ${changeToneClass(badge.tone)}`}>
                        {badge.label}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="mt-2 text-[11px] leading-4 text-current/85">{node.detail}</div>
                <div className="mt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-current/75">{HEALTH_LABEL[node.health]}</div>
              </button>
            );
          })}
          <div className={`${polishPlan.legendClassName} ${responsivePlan.railClassName}`} data-office-polish-legend="true" data-office-responsive-rail="true">
            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.16em]">
              <span className="text-emerald-200">{polishPlan.stageLabel}</span>
              <span className="text-sky-200">{responsivePlan.stageLabel} · {responsivePlan.viewportMode === "narrow" ? "좁은 화면" : "데스크톱"}</span>
              <span className="text-lime-200">Stage 14-A 동적 추적 · 큐 {trackingCues.length}개</span>
              <span className="text-amber-200">Stage 14-B 방 활동 · 미터 {roomActivityMeters.length}개</span>
              <span className="text-fuchsia-200">Stage 14-C pulse · {safePulseTimeline.items.length}개</span>
              <span className="text-cyan-200">Stage 14-D breadcrumb · {safeBreadcrumbTrail.segments.length}개</span>
              <span className="text-rose-200">Stage 14-E compass · {safeRouteCompass.heading}</span>
              <span className="text-violet-200">Stage 14-F focus · {safeFocusLane.items[0]?.label ?? "대기"}</span>
              <span className="text-orange-200">Stage 14-G attention · {safeAttentionStrip.heading}</span>
              <span className="text-amber-100">Stage 14-H beacons · {safeRoomBeacons.beacons.filter((beacon) => beacon.weight > 0).length}개</span>
              <span className="text-teal-100">Stage 14-I flow · {safeFlowPulseBands.bands.length}개</span>
              <span className="text-emerald-100">Stage 14-J minimap · {safeTacticalMinimap.summary}</span>
              <span className="text-lime-100">Stage 14-K ticker · {safeTacticalTicker.headline}</span>
              <span className="text-cyan-100">Stage 14-N floor · {safeFloorLegend.summary}</span>
              {flows.map((flow) => {
                const changedFlow = changedFlowById.get(`${flow.from}->${flow.to}`);
                return (
                  <span key={`${flow.from}-${flow.to}`} className={changedFlow ? changedFlowToneClass(changedFlow.tone) : mapFlowTone(flow.health)}>
                    {flow.label} · {HEALTH_LABEL[flow.health]}{changedFlow ? " · 방금 변경" : ""}
                  </span>
                );
              })}
            </div>
            <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold tracking-[0.14em] text-midground/75" aria-label="Stage 11-B CSS/SVG 정돈 메모">
              {polishPlan.notes.map((note) => <span key={note}>{note}</span>)}
            </div>
            <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold tracking-[0.14em] text-sky-100/80" aria-label="Stage 12-A 반응형 읽기 메모">
              {responsivePlan.notes.map((note) => <span key={note}>{note}</span>)}
            </div>
            <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold tracking-[0.14em] text-emerald-100/80" aria-label="Stage 14-A 동적 추적 rail" data-office-character-tracking-rail="true">
              <span>Stage 14-A 동적 추적</span>
              <span>추적 큐 {trackingCues.length}개</span>
              {trackingCues.slice(0, 4).map((cue) => (
                <span key={`tracking-rail-${cue.characterId}`} className={cue.tone === "alert" ? "text-yellow-200" : cue.tone === "warning" ? "text-orange-200" : "text-emerald-200"}>
                  {cue.label} · {cue.detail}
                </span>
              ))}
            </div>
            <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold tracking-[0.14em] text-amber-100/80" aria-label="Stage 14-B 방 활동 rail" data-office-room-activity-rail="true">
              <span>Stage 14-B 방 활동</span>
              {roomActivityMeters.map((meter) => (
                <span key={`room-activity-rail-${meter.roomId}`} className={meter.level === "changed" ? "text-yellow-200" : meter.level === "busy" ? "text-orange-200" : meter.level === "active" ? "text-emerald-200" : "text-midground/60"}>
                  {meter.label} · {meter.detail}
                </span>
              ))}
            </div>
            <div className="office-safe-pulse-timeline mb-2" aria-label="Stage 14-C 안전 pulse timeline" data-office-safe-pulse-timeline="true">
              <span className="office-safe-pulse-timeline__title">{safePulseTimeline.stageLabel}</span>
              {safePulseTimeline.items.map((item, index) => (
                <span
                  key={item.id}
                  className={`office-safe-pulse-timeline__item ${safePulseToneClass(item.tone)}`}
                  style={{ "--office-safe-pulse-delay": `${index * -0.35}s` } as React.CSSProperties}
                  title={`${item.detail} · ${item.reducedMotionLabel}`}
                  aria-hidden={item.ariaHidden}
                  data-office-safe-pulse-item={item.kind}
                >
                  <span className="office-safe-pulse-timeline__dot" />
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
            <div className="office-safe-breadcrumb mb-2" aria-label="Stage 14-D 안전 breadcrumb" data-office-safe-breadcrumb="true">
              <span className="office-safe-breadcrumb__title">{safeBreadcrumbTrail.stageLabel}</span>
              {safeBreadcrumbTrail.segments.map((segment, index) => (
                <span
                  key={segment.id}
                  className={`office-safe-breadcrumb__segment ${safePulseToneClass(segment.tone)}`}
                  title={segment.detail}
                  aria-hidden={segment.ariaHidden}
                  data-office-safe-breadcrumb-segment="true"
                >
                  <span>{segment.label}</span>
                  {index < safeBreadcrumbTrail.segments.length - 1 ? <span className="office-safe-breadcrumb__arrow">→</span> : null}
                </span>
              ))}
            </div>
            <div className={`office-safe-route-compass mb-2 ${safePulseToneClass(safeRouteCompass.tone)}`} aria-label="Stage 14-E 안전 route compass" data-office-safe-route-compass="true">
              <span className="office-safe-route-compass__title">{safeRouteCompass.stageLabel}</span>
              <span className="office-safe-route-compass__heading">{safeRouteCompass.heading}</span>
              {safeRouteCompass.points.map((point) => (
                <span
                  key={point.id}
                  className={`office-safe-route-compass__point ${safePulseToneClass(point.tone)}`}
                  title={`${point.detail} · ${safeRouteCompass.detail}`}
                  aria-hidden={point.ariaHidden}
                  data-office-safe-route-compass-point={point.id}
                >
                  <span>{point.label}</span>
                  <span>{point.detail}</span>
                </span>
              ))}
            </div>
            <div className="office-safe-focus-lane mb-2" aria-label="Stage 14-F 안전 focus lane" data-office-safe-focus-lane="true">
              <span className="office-safe-focus-lane__title">{safeFocusLane.stageLabel}</span>
              {safeFocusLane.items.map((item) => (
                <span
                  key={item.roomId}
                  className={`office-safe-focus-lane__item ${safePulseToneClass(item.tone)}`}
                  title={`${item.detail} · ${safeFocusLane.detail}`}
                  aria-hidden={item.ariaHidden}
                  data-office-safe-focus-lane-item={item.roomId}
                  data-office-safe-focus-lane-weight={item.weight}
                >
                  <span className="office-safe-focus-lane__bar" style={{ "--office-safe-focus-weight": `${Math.min(100, item.weight * 20 + 8)}%` } as React.CSSProperties} />
                  <span>{item.label}</span>
                  <span>{item.detail}</span>
                </span>
              ))}
            </div>
            <div className={`office-safe-attention-strip mb-2 ${safePulseToneClass(safeAttentionStrip.tone)}`} aria-label="Stage 14-G 안전 attention strip" data-office-safe-attention-strip="true">
              <span className="office-safe-attention-strip__title">{safeAttentionStrip.stageLabel}</span>
              <span className="office-safe-attention-strip__heading">{safeAttentionStrip.heading}</span>
              {safeAttentionStrip.chips.map((chip) => (
                <span
                  key={chip.id}
                  className={`office-safe-attention-strip__chip ${safePulseToneClass(chip.tone)}`}
                  title={`${chip.detail} · ${safeAttentionStrip.detail}`}
                  aria-hidden={chip.ariaHidden}
                  data-office-safe-attention-strip-chip={chip.id}
                >
                  <span>{chip.label}</span>
                  <span>{chip.detail}</span>
                </span>
              ))}
            </div>
            <div className="office-safe-room-beacon-rail mb-2" aria-label="Stage 14-H 안전 room beacon rail" data-office-safe-room-beacon-rail="true">
              <span className="office-safe-room-beacon-rail__title">{safeRoomBeacons.stageLabel}</span>
              {safeRoomBeacons.beacons.map((beacon) => (
                <span
                  key={`beacon-rail-${beacon.roomId}`}
                  className={`office-safe-room-beacon-rail__item ${safePulseToneClass(beacon.tone)}`}
                  title={`${beacon.detail} · ${safeRoomBeacons.detail}`}
                  aria-hidden={beacon.ariaHidden}
                  data-office-safe-room-beacon-rail-item={beacon.roomId}
                >
                  <span>{beacon.label}</span>
                  <span>{beacon.intensity} · {beacon.weight}</span>
                </span>
              ))}
            </div>
            <div className="office-safe-flow-pulse-rail mb-2" aria-label="Stage 14-I 안전 flow pulse rail" data-office-safe-flow-pulse-rail="true">
              <span className="office-safe-flow-pulse-rail__title">{safeFlowPulseBands.stageLabel}</span>
              {safeFlowPulseBands.bands.length ? safeFlowPulseBands.bands.map((band) => (
                <span
                  key={`flow-pulse-rail-${band.id}`}
                  className={`office-safe-flow-pulse-rail__item ${safePulseToneClass(band.tone)}`}
                  title={`${band.detail} · ${safeFlowPulseBands.detail}`}
                  aria-hidden={band.ariaHidden}
                  data-office-safe-flow-pulse-rail-item={band.id}
                >
                  <span>{band.label}</span>
                  <span>{band.intensity}</span>
                </span>
              )) : <span className="office-safe-flow-pulse-rail__item office-safe-pulse-timeline__item--neutral" data-office-safe-flow-pulse-rail-empty="true">대기 · 흐름 0개</span>}
            </div>
            <div className="office-safe-tactical-minimap mb-2" aria-label="Stage 14-J 안전 tactical minimap" data-office-safe-tactical-minimap="true">
              <div className="office-safe-tactical-minimap__header">
                <span className="office-safe-tactical-minimap__title">{safeTacticalMinimap.stageLabel}</span>
                <span className="office-safe-tactical-minimap__summary" data-office-safe-tactical-minimap-summary="true">{safeTacticalMinimap.summary}</span>
              </div>
              <div className="office-safe-tactical-minimap__grid" aria-hidden="true">
                {safeTacticalMinimap.cells.map((cell) => (
                  <span
                    key={`tactical-minimap-${cell.roomId}`}
                    className={`office-safe-tactical-minimap__cell ${safePulseToneClass(cell.tone)} office-safe-tactical-minimap__cell--${cell.intensity}`}
                    title={`${cell.detail} · ${safeTacticalMinimap.detail}`}
                    aria-hidden={cell.ariaHidden}
                    data-office-safe-tactical-minimap-cell={cell.roomId}
                    data-office-safe-tactical-minimap-cell-intensity={cell.intensity}
                    data-office-safe-tactical-minimap-cell-active={cell.active ? "true" : "false"}
                    data-office-safe-tactical-minimap-cell-weight={cell.weight}
                  >
                    <span className="office-safe-tactical-minimap__cell-name">{cell.label}</span>
                    <span className="office-safe-tactical-minimap__cell-detail">{cell.detail}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className={`office-safe-tactical-ticker mb-2 ${safePulseToneClass(safeTacticalTicker.tone)}`} aria-label="Stage 14-K 안전 tactical ticker" data-office-safe-tactical-ticker="true">
              <span className="office-safe-tactical-ticker__title">{safeTacticalTicker.stageLabel}</span>
              <span className="office-safe-tactical-ticker__headline" data-office-safe-tactical-ticker-headline="true">{safeTacticalTicker.headline}</span>
              {safeTacticalTicker.items.map((item) => (
                <span
                  key={`tactical-ticker-${item.id}`}
                  className={`office-safe-tactical-ticker__item ${safePulseToneClass(item.tone)}`}
                  title={`${item.detail} · ${safeTacticalTicker.detail}`}
                  aria-hidden={item.ariaHidden}
                  data-office-safe-tactical-ticker-item={item.id}
                >
                  <span>{item.label}</span>
                  <span>{item.detail}</span>
                </span>
              ))}
            </div>
            <div className={`office-safe-floor-legend mb-2 ${safePulseToneClass(safeFloorLegend.tone)}`} aria-label="Stage 14-N 안전 floor legend" data-office-safe-floor-legend="true">
              <span className="office-safe-floor-legend__title">{safeFloorLegend.stageLabel}</span>
              <span className="office-safe-floor-legend__summary" data-office-safe-floor-legend-summary="true">{safeFloorLegend.summary}</span>
              {safeFloorLegend.items.map((item) => (
                <span
                  key={`floor-legend-${item.id}`}
                  className={`office-safe-floor-legend__item ${safePulseToneClass(item.tone)}`}
                  title={`${item.detail} · ${safeFloorLegend.detail}`}
                  aria-hidden={item.ariaHidden}
                  data-office-safe-floor-legend-item={item.id}
                >
                  <span>{item.label}</span>
                  <span>{item.detail}</span>
                </span>
              ))}
            </div>
            <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-semibold tracking-[0.14em] text-midground/75" aria-label="RPG 역할 범례">
              <span>캐릭터 역할 투영</span>
              <span>모델 ◇</span>
              <span>작업자 ▤</span>
              <span>검토자 ◎</span>
              <span>자동화 ▣</span>
              <span>전달 ✉</span>
              <span>감시 ◈</span>
              <span>경보 !</span>
              <span>액션 칩: 작업 중/확인 필요</span>
              <span>흐름 표식: 방금 변경</span>
              <span>캐릭터 Enter: 안전 정보</span>
            </div>
            이 지도는 시각 인덱스입니다. 움직이는 캐릭터, 액션 칩, 방 사이 흐름 표식, 캐릭터 살펴보기는 안전 개수/상태/변화의 표시일 뿐이며 원문 프롬프트, 대화 기록, cron 스크립트, 작업 본문, 로그, 인증 정보, 비밀값은 브라우저 DTO 밖에 둡니다.
            {densityPlan.hiddenCharacterCount > 0 ? <span className="ml-2 text-sky-200">현재 {densityPlan.label} 모드에서 캐릭터 {densityPlan.hiddenCharacterCount}개는 접혀 있습니다.</span> : null}
          </div>
        </div>
        {densityPlan.showUsabilityRail ? (
          <div id="office-map-usability" tabIndex={-1} className="mt-4 scroll-mt-24 border border-current/15 bg-black/15 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-200/70" data-office-usability="true">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-midground/70">Stage 10-F 사용성 점검</div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-midground/45">안전 DTO · 로컬 표시</div>
          </div>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-5">
            {usabilitySummary.items.map((item) => (
              <div key={item.id} className={`border p-2 text-xs ${changeToneClass(item.tone)}`} data-office-usability-item={item.id}>
                <div className="font-semibold text-current">{item.label}</div>
                <div className="mt-1 text-current/70">{item.detail}</div>
              </div>
            ))}
          </div>
          </div>
        ) : null}
        {densityPlan.showRecentRail ? (
          <div id="office-map-recent" tabIndex={-1} className="mt-4 scroll-mt-24 border border-current/15 bg-black/15 p-3 focus:outline-none focus:ring-2 focus:ring-emerald-200/70">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-midground/70">최근 변화</div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-midground/45">브라우저 메모리 · 안전 delta</div>
          </div>
          {recentChanges.length === 0 ? (
            <div className="border border-dashed border-current/15 bg-black/10 p-3 text-xs text-midground/60">
              아직 비교할 이전 스냅샷이 없습니다. 새로고침 후 안전 개수와 상태 변화만 여기에 표시됩니다.
            </div>
          ) : (
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3" aria-live="polite">
              {recentChanges.map((change) => (
                <div key={change.id} className={`border p-2 text-xs ${changeToneClass(change.tone)}`}>
                  <div className="font-semibold text-current">{change.label}</div>
                  <div className="mt-1 text-current/70">{change.detail}</div>
                </div>
              ))}
            </div>
          )}
          </div>
        ) : (
          <div id="office-map-recent-collapsed" tabIndex={-1} className="mt-4 scroll-mt-24 border border-current/15 bg-black/10 p-3 text-xs text-midground/60 focus:outline-none focus:ring-2 focus:ring-emerald-200/70" data-office-recent-collapsed="true">
            요약 모드에서는 최근 변화 rail을 접습니다. 안전 delta는 브라우저 메모리에만 유지되며 표준/상세 모드에서 다시 보입니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function GroupBlock({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div className="border border-current/10 bg-black/10 p-3">
      <div className="mb-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-midground/65">
        <span>{title}</span>
        <span>{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function LimitedRows<T>({
  rows,
  limit = LIST_LIMIT,
  label,
  children,
}: {
  rows: T[];
  limit?: number;
  label: string;
  children: (row: T) => React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = visibleRows(rows, limit, expanded);
  const hidden = Math.max(rows.length - visible.length, 0);
  return (
    <>
      {visible.map((row) => children(row))}
      {rows.length > limit ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="w-full border border-dashed border-current/20 bg-black/10 px-3 py-2 text-left text-xs uppercase tracking-[0.16em] text-midground/65 hover:text-foreground"
        >
          {expanded ? `${label} 접기` : `${label} ${hidden}개 더 보기`}
        </button>
      ) : null}
    </>
  );
}

function InspectorPanel({ selection }: { selection: InspectorSelection | null }) {
  return (
    <Card id="office-safe-inspector" tabIndex={-1} className="scroll-mt-24 focus:outline-none focus:ring-2 focus:ring-emerald-200/70">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="h-4 w-4" /> 안전 정보 살펴보기
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selection ? (
          <div className="space-y-3 text-sm">
            <div>
              <SectionLabel>{selection.kind}</SectionLabel>
              <div className="mt-1 font-semibold text-foreground">{selection.title}</div>
            </div>
            <div className="grid gap-2">
              {selection.fields.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[8rem_1fr] gap-3 border border-current/10 bg-black/15 p-2 text-xs">
                  <span className="text-midground/50">{label}</span>
                  <span className="break-words text-midground/85">{value}</span>
                </div>
              ))}
            </div>
            <div className="border border-emerald-400/20 bg-emerald-950/10 p-3 text-xs leading-5 text-emerald-200/80">
              이 패널은 DTO 메타데이터만 보여줍니다. 원문 프롬프트, 대화 기록, 작업 본문, cron 스크립트, 로그, 인증 정보, 비밀값은 계속 제외됩니다.
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-current/15 bg-black/10 p-4 text-sm text-midground/65">
            소스, 방, 세션, 작업, 자동화, 토픽, 이벤트에서 살펴보기를 누르면 안전 메타데이터가 여기에 표시됩니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OfficePage() {
  const [state, setState] = useState<OfficeState | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focus, setFocus] = useState<FocusOption>("overview");
  const [selection, setSelection] = useState<InspectorSelection | null>(null);
  const [latestDelta, setLatestDelta] = useState<OfficeStateDelta>(EMPTY_STATE_DELTA);
  const [recentChanges, setRecentChanges] = useState<OfficeRecentChange[]>([]);
  const [liveTracking, setLiveTracking] = useState(false);
  const [densityMode, setDensityMode] = useState<OfficeMapDensityMode>("standard");
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [viewportWidth, setViewportWidth] = useState<number | undefined>(undefined);
  const [tabVisible, setTabVisible] = useState(true);
  const [liveFailureCount, setLiveFailureCount] = useState(0);
  const previousStateRef = useRef<OfficeState | null>(null);
  const liveFailureCountRef = useRef(0);

  const applyNextState = useCallback((next: OfficeState) => {
    const delta = buildOfficeStateDelta(previousStateRef.current, next);
    setLatestDelta(delta);
    if (delta.hasChanges) {
      setRecentChanges((current) => mergeOfficeRecentChanges(delta.recentChanges, current, CHANGE_LIMIT));
    }
    previousStateRef.current = next;
    setState(next);
  }, []);

  const load = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const next = await api.getOfficeState();
      applyNextState(next);
      return true;
    } catch (err) {
      setError(String(err));
      return false;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [applyNextState]);

  useEffect(() => {
    let cancelled = false;
    api
      .getOfficeState()
      .then((next) => {
        if (!cancelled) applyNextState(next);
      })
      .catch((err) => {
        if (!cancelled) setError(String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applyNextState]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setPrefersReducedMotion(media.matches);
    const updateViewport = () => setViewportWidth(window.innerWidth);
    const updateVisibility = () => setTabVisible(typeof document === "undefined" ? true : !document.hidden);
    updateMotion();
    updateViewport();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    window.addEventListener("resize", updateViewport);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media.removeEventListener("change", updateMotion);
      window.removeEventListener("resize", updateViewport);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!liveTracking) return undefined;
    let cancelled = false;
    let timeoutId: number | undefined;

    const schedule = () => {
      if (cancelled) return;
      const isVisible = typeof document === "undefined" ? true : !document.hidden;
      const delay = resolveOfficeLiveTrackingInterval({
        isVisible,
        consecutiveFailures: liveFailureCountRef.current,
      });
      timeoutId = window.setTimeout(() => {
        void load().then((ok) => {
          const nextFailureCount = ok ? 0 : liveFailureCountRef.current + 1;
          liveFailureCountRef.current = nextFailureCount;
          setLiveFailureCount(nextFailureCount);
          schedule();
        });
      }, delay);
    };

    const reschedule = () => {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      schedule();
    };

    schedule();
    document.addEventListener("visibilitychange", reschedule);
    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", reschedule);
    };
  }, [liveTracking, load]);

  const inspectRecord = useCallback((kind: string, title: string, fields: Array<[string, string]>) => {
    setSelection({ kind, title, fields });
  }, []);

  const needsAttention = useMemo(() => (state ? buildOfficeAttentionItems(state) : []), [state]);
  const mapNodes = useMemo(() => (state ? buildOfficeMapNodes(state) : []), [state]);
  const mapFlows = useMemo(() => buildOfficeMapFlows(mapNodes), [mapNodes]);
  const officeCharacters = useMemo(() => (state ? buildOfficeCharacters(state, mapNodes) : []), [state, mapNodes]);
  const densityPlan = useMemo(() => buildOfficeMapDensityPlan(densityMode, officeCharacters), [densityMode, officeCharacters]);
  const responsivePlan = useMemo(() => buildOfficeResponsiveReadabilityPlan(densityPlan, { viewportWidth }), [densityPlan, viewportWidth]);
  const jumpTargets = useMemo(() => buildOfficeMapJumpTargets(densityPlan), [densityPlan]);
  const fallbackSceneObjects = useMemo(() => (state ? buildOfficeSceneObjects(state, mapNodes) : []), [state, mapNodes]);
  const sceneObjects = useMemo(() => {
    const characterSceneObjects = buildOfficeCharacterSceneObjects(officeCharacters);
    return characterSceneObjects.length > 0 ? characterSceneObjects : fallbackSceneObjects;
  }, [fallbackSceneObjects, officeCharacters]);
  const sourceHealth = useMemo(() => (state ? buildOfficeSourceHealthSummary(state) : buildOfficeSourceHealthSummary({ ...EMPTY_OFFICE_STATE })), [state]);
  const usabilitySummary = useMemo(
    () => (state ? buildOfficeUsabilitySummary(state, officeCharacters, { reducedMotion: prefersReducedMotion, viewportWidth }) : buildOfficeUsabilitySummary({ ...EMPTY_OFFICE_STATE }, [], { reducedMotion: prefersReducedMotion, viewportWidth })),
    [officeCharacters, prefersReducedMotion, state, viewportWidth],
  );
  const emptyHints = useMemo(() => buildOfficeEmptyStateHints(), []);
  const emptySourceCopy = useMemo(() => buildOfficeEmptySourceCopyPlan(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const safeMissionClock = useMemo(
    () => buildOfficeSafeMissionClock({
      liveTracking,
      isVisible: tabVisible,
      consecutiveFailures: liveFailureCount,
      hasRecentChanges: latestDelta.hasChanges,
    }),
    [latestDelta.hasChanges, liveFailureCount, liveTracking, tabVisible],
  );
  const safeCommandDeck = useMemo(
    () => buildOfficeSafeCommandDeck(state ?? { ...EMPTY_OFFICE_STATE }, latestDelta, {
      liveTracking,
      isVisible: tabVisible,
      consecutiveFailures: liveFailureCount,
      hasRecentChanges: latestDelta.hasChanges,
    }),
    [latestDelta, liveFailureCount, liveTracking, state, tabVisible],
  );
  const safeStatusSnapshot = useMemo(
    () => buildOfficeSafeStatusSnapshot(state ?? { ...EMPTY_OFFICE_STATE }, latestDelta, {
      liveTracking,
      isVisible: tabVisible,
      consecutiveFailures: liveFailureCount,
      hasRecentChanges: latestDelta.hasChanges,
    }),
    [latestDelta, liveFailureCount, liveTracking, state, tabVisible],
  );

  const sourceCounts = sourceHealth.counts;

  const workGroups = useMemo(() => (state ? groupByText(state.work_items, "status", "unknown") : {}), [state]);
  const automationGroups = useMemo(() => (state ? groupByText(state.automations, "state", "unknown") : {}), [state]);

  const showOverview = focus === "overview";
  const showWork = focus === "overview" || focus === "work";
  const showAutomation = focus === "overview" || focus === "automation";
  const showRouting = focus === "overview" || focus === "routing";

  if (loading) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 border border-current/15 bg-black/10 py-24">
        <Spinner className="text-2xl text-primary" />
        <div className="text-sm uppercase tracking-[0.2em] text-midground/70">가려진 OfficeState를 불러오는 중</div>
      </div>
    );
  }

  if (error || !state) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-red-300">
            <AlertTriangle className="h-4 w-4" /> 오피스를 사용할 수 없음
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-midground/80">
          <p>{error ?? "상태가 반환되지 않았습니다"}</p>
          <p className="text-xs text-midground/55">보호된 OfficeState DTO를 읽지 못했습니다. 이 대체 화면도 원문 로그나 비밀값은 노출하지 않습니다.</p>
          <Button onClick={load} className="gap-2 uppercase">
            <RefreshCw className="h-4 w-4" /> 다시 시도
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6 normal-case">
      <div className="border border-current/20 bg-gradient-to-br from-black/35 to-black/10 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> 읽기 전용 MVP · 로컬호스트 우선
            </div>
            <h1 className="mt-3 text-3xl font-semibold uppercase tracking-wide text-foreground md:text-4xl">Hermes AI 오피스</h1>
            <p className="mt-3 text-sm leading-6 text-midground/80">
              이 Mac에서 도는 Hermes 상태를 가려서 보여주는 운영 지도입니다. 원문 세션, 프롬프트, 로그, 비밀값을 노출하지 않고 상태·건강도·출처 공백만 보여줍니다.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {FOCUS_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFocus(option)}
                  className={`border px-3 py-1 text-xs uppercase tracking-[0.16em] ${focus === option ? "border-emerald-400/50 text-emerald-300" : "border-current/20 text-midground/70 hover:text-foreground"}`}
                >
                  {FOCUS_LABEL[option]}
                </button>
              ))}
            </div>
          </div>
          <div className="min-w-64 border border-current/15 bg-black/20 p-3 text-xs text-midground/70">
            <div className="flex items-center gap-2 text-foreground">
              <Lock className="h-4 w-4 text-emerald-300" /> 안전 모드
            </div>
            <div className="mt-2 grid gap-1">
              <div>생성 시각: {fmt(state.generated_at)}</div>
              <div>표시 모드: {state.display_mode}</div>
              <div>원격 모드: {state.capabilities.remote_mode}</div>
              <div>변경 기능: {state.capabilities.mutations_enabled ? "켜짐" : "없음"}</div>
            </div>
            <div className={`office-safe-mission-clock mt-3 ${safePulseToneClass(safeMissionClock.tone)}`} aria-label="Stage 14-L 안전 mission clock" data-office-safe-mission-clock="true">
              <div className="office-safe-mission-clock__header">
                <span className="office-safe-mission-clock__title">{safeMissionClock.stageLabel}</span>
                <span className="office-safe-mission-clock__headline" data-office-safe-mission-clock-headline="true">{safeMissionClock.headline}</span>
              </div>
              <div className="office-safe-mission-clock__grid" aria-hidden="true">
                {safeMissionClock.items.map((item) => (
                  <span
                    key={`mission-clock-${item.id}`}
                    className={`office-safe-mission-clock__item ${safePulseToneClass(item.tone)}`}
                    title={`${item.detail} · ${safeMissionClock.detail}`}
                    aria-hidden={item.ariaHidden}
                    data-office-safe-mission-clock-item={item.id}
                  >
                    <span>{item.label}</span>
                    <span>{item.detail}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className={`office-safe-command-deck mt-3 ${safePulseToneClass(safeCommandDeck.tone)}`} aria-label="Stage 14-M 안전 command deck" data-office-safe-command-deck="true">
              <div className="office-safe-command-deck__header">
                <span className="office-safe-command-deck__title">{safeCommandDeck.stageLabel}</span>
                <span className="office-safe-command-deck__headline" data-office-safe-command-deck-headline="true">{safeCommandDeck.headline}</span>
              </div>
              <div className="office-safe-command-deck__grid" aria-hidden="true">
                {safeCommandDeck.cards.map((card) => (
                  <span
                    key={`command-deck-${card.id}`}
                    className={`office-safe-command-deck__card ${safePulseToneClass(card.tone)}`}
                    title={`${card.detail} · ${safeCommandDeck.detail}`}
                    aria-hidden={card.ariaHidden}
                    data-office-safe-command-deck-card={card.id}
                  >
                    <span>{card.label}</span>
                    <span>{card.detail}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className={`office-safe-status-snapshot mt-3 ${safePulseToneClass(safeStatusSnapshot.tone)}`} aria-label="Stage 14-O 안전 status snapshot" data-office-safe-status-snapshot="true">
              <div className="office-safe-status-snapshot__header">
                <span className="office-safe-status-snapshot__title">{safeStatusSnapshot.stageLabel}</span>
                <span className="office-safe-status-snapshot__headline" data-office-safe-status-snapshot-headline="true">{safeStatusSnapshot.headline}</span>
              </div>
              <div className="office-safe-status-snapshot__grid" aria-hidden="true">
                {safeStatusSnapshot.items.map((item) => (
                  <span
                    key={`status-snapshot-${item.id}`}
                    className={`office-safe-status-snapshot__item ${safePulseToneClass(item.tone)}`}
                    title={`${item.detail} · ${safeStatusSnapshot.detail}`}
                    aria-hidden={item.ariaHidden}
                    data-office-safe-status-snapshot-item={item.id}
                  >
                    <span>{item.label}</span>
                    <span>{item.detail}</span>
                  </span>
                ))}
              </div>
            </div>
            <Button onClick={load} className="mt-4 w-full gap-2 uppercase" disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> 새로고침
            </Button>
            <button
              type="button"
              onClick={() => {
                liveFailureCountRef.current = 0;
                setLiveFailureCount(0);
                setLiveTracking((value) => !value);
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 border border-current/20 px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-midground/80 hover:text-foreground"
            >
              <Activity className={`h-4 w-4 ${liveTracking ? "text-emerald-300" : "text-midground/60"}`} /> {liveTracking ? "실시간 추적 일시정지" : "실시간 추적 켜기"}
            </button>
            <div className="mt-2 text-[10px] leading-4 text-midground/50">
              {liveTracking
                ? `브라우저에서만 ${OFFICE_LIVE_TRACKING_BASE_INTERVAL_MS / 1000}초마다 안전 DTO를 다시 읽습니다. 탭이 숨겨지거나 실패가 반복되면 60–120초로 늦춥니다. cron/gateway/backend 작업은 건드리지 않습니다.`
                : "기본은 수동 새로고침입니다. 실시간 추적은 이 브라우저 탭에서만 켜집니다."}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="진행 중 작업" value={state.summary.active_work_count ?? 0} detail="승인된 어댑터가 보여준 열린 작업" />
        <StatCard label="확인 필요" value={needsAttention.length} detail="막힌 작업, 소스 경고, 실패한 자동화" tone={needsAttention.length > 0 ? "text-yellow-300" : "text-emerald-300"} />
        <StatCard label="자동화" value={state.summary.automation_count ?? state.automations.length} detail="읽기 전용 기계처럼 표시한 cron 작업" />
        <StatCard label="가림 처리" value={state.redactions.redacted_field_count} detail={`정책 v${state.redactions.policy_version}; 민감 원문 필드 제외`} />
      </div>

      {showOverview ? (
        <OfficeMap
          nodes={mapNodes}
          flows={mapFlows}
          characters={officeCharacters}
          sceneObjects={sceneObjects}
          latestDelta={latestDelta}
          recentChanges={recentChanges}
          usabilitySummary={usabilitySummary}
          densityMode={densityMode}
          densityPlan={densityPlan}
          jumpTargets={jumpTargets}
          responsivePlan={responsivePlan}
          onDensityModeChange={setDensityMode}
          onInspect={(node) => inspectRecord("오피스 맵 방", node.label, [
            ["방", node.id],
            ["구역", node.zone],
            ["안전 개수", String(node.count)],
            ["상태", node.health],
            ["설명", node.detail],
          ])}
          onInspectCharacter={(character) => {
            const inspector = buildOfficeCharacterInspector(character, latestDelta);
            inspectRecord(inspector.kind, inspector.title, inspector.fields);
          }}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" /> 소스 상태
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              <span className={`border px-2 py-1 ${changeToneClass(sourceHealth.tone)}`}>{sourceHealth.label} · {sourceHealth.detail}</span>
              {sourceHealth.missingSourceIds.length > 0 ? (
                <span className="border border-sky-400/25 px-2 py-1 text-sky-200">미보고 소스 {sourceHealth.missingSourceIds.join(" · ")}</span>
              ) : null}
            </div>
            <div className="mb-4 flex flex-wrap gap-2 text-xs">
              <span className="border border-emerald-400/30 px-2 py-1 text-emerald-300">정상 {sourceCounts.ok}</span>
              <span className="border border-yellow-400/30 px-2 py-1 text-yellow-300">부분 연결 {sourceCounts.partial}</span>
              <span className="border border-sky-400/30 px-2 py-1 text-sky-300">미연결 {sourceCounts.missing}</span>
              <span className="border border-zinc-400/30 px-2 py-1 text-zinc-300">사용 불가 {sourceCounts.unavailable}</span>
              <span className="border border-red-400/30 px-2 py-1 text-red-300">오류 {sourceCounts.error}</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {state.data_sources.length === 0 ? (
                <div className="md:col-span-2 xl:col-span-3 border border-sky-400/25 bg-sky-950/10 p-4 text-sm text-sky-100" data-office-empty-source-copy="true">
                  <div className="font-semibold text-sky-100">{emptySourceCopy.title}</div>
                  <div className="mt-2 text-xs leading-5 text-sky-100/75">{emptySourceCopy.detail}</div>
                  <div className="mt-3 grid gap-2 md:grid-cols-3">
                    {emptySourceCopy.items.map((item) => (
                      <div key={item.label} className={`border p-2 text-xs ${changeToneClass(item.tone)}`} data-office-empty-source-item={item.label}>
                        <div className="font-semibold">{item.label}</div>
                        <div className="mt-1 text-current/75">{item.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : state.data_sources.map((source) => (
                <SourceCard
                  key={source.id}
                  source={source}
                  onInspect={() => inspectRecord("데이터 소스", source.id, [
                    ["상태", SOURCE_LABEL[source.status]],
                    ["확인 시각", fmt(source.checked_at)],
                    ["항목", String(source.item_count ?? "—")],
                    ["경고", String(source.warning_count ?? 0)],
                    ["오류", source.error_summary ?? "—"],
                  ])}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4" /> 확인 필요 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            {needsAttention.length === 0 ? (
              <div className="border border-emerald-400/25 bg-emerald-950/10 p-4 text-sm text-emerald-300">
                가려진 DTO에 막힌 작업, 실패한 자동화, 소스 경고가 없습니다.
              </div>
            ) : (
              <div className="space-y-2">
                <LimitedRows rows={needsAttention} limit={LIST_LIMIT} label="확인 필요 항목">
                  {(item) => (
                    <div key={item.id} className="border border-yellow-300/30 bg-yellow-950/10 p-3 text-sm text-yellow-200">
                      <span className="font-semibold">{item.label}</span>
                      <span className="ml-2 text-xs text-yellow-100/70">{item.detail}</span>
                    </div>
                  )}
                </LimitedRows>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-6">
          {showWork ? (
            <div className="grid gap-6 xl:grid-cols-2">
              <MiniList title="방 / 작업 흐름" icon={<Building2 className="h-4 w-4" />} meta="묶어서 보기 위한 화면일 뿐, 방이 원본 데이터는 아닙니다.">
                {state.rooms.length === 0 ? (
                  <EmptyLine label="방" hint={emptyHints.rooms} />
                ) : (
                  <LimitedRows rows={state.rooms} label="방">
                    {(room) => (
                      <EntityRow
                        key={String(room.id)}
                        title={textField(room, "display_name")}
                        badge={textField(room, "kind")}
                        meta={`소스 ${textField(room, "source")} · ID ${String(room.id)}`}
                        onInspect={() => inspectRecord("방", textField(room, "display_name"), [
                          ["ID", String(room.id)],
                          ["종류", textField(room, "kind")],
                          ["소스", textField(room, "source")],
                        ])}
                      />
                    )}
                  </LimitedRows>
                )}
              </MiniList>

              <MiniList title="세션 / 에이전트" icon={<Bot className="h-4 w-4" />} meta="세션 제목과 미리보기는 별도 허용 전까지 가립니다.">
                {state.agents.length === 0 ? (
                  <EmptyLine label="세션 메타데이터" hint={emptyHints.agents} />
                ) : (
                  <LimitedRows rows={state.agents} label="세션">
                    {(agent) => (
                      <EntityRow
                        key={String(agent.id)}
                        title={textField(agent, "source_platform")}
                        badge={textField(agent, "status")}
                        meta={`메시지 ${numberField(agent, "message_count") ?? 0}개 · 제목 ${textField(agent, "title_policy")}`}
                        onInspect={() => inspectRecord("세션 / 에이전트", textField(agent, "source_platform"), [
                          ["id", String(agent.id)],
                          ["상태", textField(agent, "status")],
                          ["메시지", String(numberField(agent, "message_count") ?? 0)],
                          ["제목 정책", textField(agent, "title_policy")],
                        ])}
                      />
                    )}
                  </LimitedRows>
                )}
              </MiniList>
            </div>
          ) : null}

          {showWork ? (
            <MiniList title="작업 항목" icon={<MapPinned className="h-4 w-4" />} meta="안전 상태별로 묶어 보여줍니다. 본문/결과/댓글/로그는 제외합니다.">
              {state.work_items.length === 0 ? (
                <EmptyLine label="작업 항목" hint={emptyHints.workItems} />
              ) : Object.entries(workGroups).map(([status, items]) => (
                <GroupBlock key={status} title={status} count={items.length}>
                  <LimitedRows rows={items} label="작업 항목">
                    {(item) => (
                      <EntityRow
                        key={String(item.id)}
                        title={textField(item, "title")}
                        badge={textField(item, "status")}
                        meta={`담당 ${textField(item, "assignee")} · 우선순위 ${numberField(item, "priority") ?? 0}`}
                        onInspect={() => inspectRecord("작업 항목", textField(item, "title"), [
                          ["id", String(item.id)],
                          ["상태", textField(item, "status")],
                          ["담당", textField(item, "assignee")],
                          ["우선순위", String(numberField(item, "priority") ?? 0)],
                        ])}
                      />
                    )}
                  </LimitedRows>
                </GroupBlock>
              ))}
            </MiniList>
          ) : null}

          {showAutomation ? (
            <MiniList title="자동화" icon={<Clock className="h-4 w-4" />} meta="작업 상태별로 묶어 보여줍니다. 실행/일시정지/재개/삭제 제어는 없습니다.">
              {state.automations.length === 0 ? (
                <EmptyLine label="자동화" hint={emptyHints.automations} />
              ) : Object.entries(automationGroups).map(([jobState, jobs]) => (
                <GroupBlock key={jobState} title={jobState} count={jobs.length}>
                  <LimitedRows rows={jobs} label="자동화">
                    {(job) => (
                      <EntityRow
                        key={String(job.id)}
                        title={textField(job, "name")}
                        badge={textField(job, "state")}
                        meta={`최근 ${fmt(job.last_status)} · 다음 ${fmt(job.next_run_at)}`}
                        warning={typeof job.last_error_summary === "string" ? job.last_error_summary : null}
                        onInspect={() => inspectRecord("자동화", textField(job, "name"), [
                          ["id", String(job.id)],
                          ["상태", textField(job, "state")],
                          ["최근 상태", fmt(job.last_status)],
                          ["다음 실행", fmt(job.next_run_at)],
                          ["전달", textField(job, "delivery_policy")],
                        ])}
                      />
                    )}
                  </LimitedRows>
                </GroupBlock>
              ))}
            </MiniList>
          ) : null}

          {showRouting ? (
            <div className="grid gap-6 xl:grid-cols-2">
              <MiniList title="토픽 라우팅" icon={<Route className="h-4 w-4" />} meta="읽기 전용 라우팅 투영입니다. 모르는 출처는 그대로 명시합니다.">
                {state.topics.length === 0 ? (
                  <EmptyLine label="토픽 라우팅 기록" hint={emptyHints.topics} />
                ) : (
                  <LimitedRows rows={state.topics} label="토픽">
                    {(topic) => (
                      <EntityRow
                        key={String(topic.id)}
                        title={textField(topic, "display_name")}
                        badge={textField(topic, "platform")}
                        meta={`목적 ${textField(topic, "purpose")} · 신뢰도 ${textField(topic, "confidence")}`}
                        onInspect={() => inspectRecord("토픽", textField(topic, "display_name"), [
                          ["id", String(topic.id)],
                          ["플랫폼", textField(topic, "platform")],
                          ["목적", textField(topic, "purpose")],
                          ["신뢰도", textField(topic, "confidence")],
                          ["source", textField(topic, "source")],
                        ])}
                      />
                    )}
                  </LimitedRows>
                )}
              </MiniList>

              <MiniList title="출처 / 가림 처리" icon={<Database className="h-4 w-4" />} meta="민감 원문이 아니라 개수와 정책만 보여줍니다.">
                <div className="grid gap-3 text-sm">
                  <div className="border border-current/15 bg-black/15 p-3">
                    <SectionLabel>출처 기록</SectionLabel>
                    <div className="mt-2 text-2xl text-foreground">{state.provenance.length}</div>
                    <div className="mt-1 text-xs text-midground/65">알 수 없거나 빠진 출처는 그대로 표시하며, 민감 텍스트에서 추론하지 않습니다.</div>
                  </div>
                  <div className="border border-current/15 bg-black/15 p-3">
                    <SectionLabel>제외된 섹션</SectionLabel>
                    <div className="mt-2 text-xs text-midground/75">
                      {state.redactions.omitted_sections.length === 0 ? "—" : state.redactions.omitted_sections.join(" · ")}
                    </div>
                  </div>
                  {state.redactions.warnings.length > 0 ? (
                    <div className="border border-yellow-300/30 bg-yellow-950/10 p-3 text-xs text-yellow-200">
                      {state.redactions.warnings.join(" · ")}
                    </div>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => inspectRecord("가림 처리 보고서", `정책 v${state.redactions.policy_version}`, [
                      ["가린 필드", String(state.redactions.redacted_field_count)],
                      ["제외 섹션", state.redactions.omitted_sections.length === 0 ? "—" : state.redactions.omitted_sections.join(" · ")],
                      ["경고", state.redactions.warnings.length === 0 ? "—" : state.redactions.warnings.join(" · ")],
                    ])}
                    className="flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-midground/70 hover:text-foreground"
                  >
                    <Eye className="h-3 w-3" /> 가림 처리 보고서 보기
                  </button>
                </div>
              </MiniList>
            </div>
          ) : null}

          {showOverview ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">최근 안전 이벤트</CardTitle>
              </CardHeader>
              <CardContent>
                {state.events.length === 0 ? (
                  <EmptyLine label="이벤트" hint={emptyHints.events} />
                ) : (
                  <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
                    <LimitedRows rows={state.events} limit={EVENT_LIMIT} label="events">
                      {(event) => (
                        <button
                          type="button"
                          key={String(event.id)}
                          onClick={() => inspectRecord("이벤트", textField(event, "kind"), [
                            ["id", String(event.id)],
                            ["source", textField(event, "source")],
                            ["생성 시각", fmt(event.created_at)],
                          ])}
                          className="border border-current/15 bg-black/15 p-2 text-left text-xs hover:border-current/30"
                        >
                          <div className="font-semibold text-foreground">{textField(event, "kind")}</div>
                          <div className="mt-1 text-midground/70">{textField(event, "source")} · {fmt(event.created_at)}</div>
                        </button>
                      )}
                    </LimitedRows>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}
        </div>

        <div className="xl:sticky xl:top-4 xl:self-start">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-midground/55">
            <Filter className="h-3 w-3" /> 보기: {FOCUS_LABEL[focus]}
          </div>
          <InspectorPanel selection={selection} />
        </div>
      </div>
    </div>
  );
}
