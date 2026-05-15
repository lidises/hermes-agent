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
  Users,
} from "lucide-react";
import { Button } from "@nous-research/ui/ui/components/button";
import { Spinner } from "@nous-research/ui/ui/components/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api, type OfficeDataSource, type OfficeSafeEventsResponse, type OfficeSourceStatus, type OfficeState } from "@/lib/api";
import {
  buildOfficeAttentionItems,
  buildOfficeCharacterActivity,
  buildOfficeCharacterInspector,
  buildOfficeCharacterRoutes,
  buildOfficeCharacterSceneObjects,
  buildOfficeCharacterTrackingCues,
  buildOfficeCharacterView,
  buildOfficeCharacters,
  buildOfficeDeskRpgProjectionModel,
  buildOfficeEmptySourceCopyPlan,
  buildOfficeEmptyStateHints,
  buildOfficeMapDensityPlan,
  buildOfficePaperclipWorkbench,
  buildOfficePaperclipInspector,
  buildOfficePaperclipManifestVisibility,
  buildOfficePaperclipMapProjection,
  buildOfficeKanbanProjection,
  buildOfficePageSectionPlan,
  buildOfficeMapJumpTargets,
  buildOfficeMapPolishPlan,
  buildOfficeResponsiveReadabilityPlan,
  buildOfficeRoomActivityMeters,
  buildOfficeLiveOperationsLayer,
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
  buildOfficeSafeScanIndex,
  buildOfficeSafeHudReadabilityPlan,
  buildOfficeSafeHudHierarchy,
  buildOfficeFirstLayoutPlan,
  buildOfficeTrackingTruthPlan,
  buildOfficeSelectedCharacterFocus,
  buildOfficeSafeEventSubstrate,
  buildOfficeSafeMotionCommands,
  buildOfficeSafeStreamPosture,
  buildOfficeSafeMotionHeartbeat,
  buildOfficeSafeSpatialChoreography,
  buildOfficeSafeFloorLegend,
  buildOfficeMapFlows,
  buildOfficeMapNodes,
  buildOfficeSceneMotionTrack,
  buildOfficeSceneObjectView,
  buildOfficeSceneObjects,
  buildOfficeSourceHealthSummary,
  buildOfficeSourceHealthRail,
  buildOfficeSourceHealthCompactDiagnostics,
  buildOfficeProjectionCacheSummary,
  buildOfficeProjectionOrchestration,
  buildOfficeMutationControlReadiness,
  buildOfficeRpgMissionStoryboard,
  buildOfficeRpgOrchestratorDesk,
  buildOfficeRpgKanbanBoardFacility,
  buildOfficeRpgSourceArchiveFacility,
  buildOfficeRpgReviewCornerFacility,
  buildOfficeRpgApprovalConsoleFacility,
  buildOfficeRpgScene,
  buildOfficeUnifiedWorkbenchView,
  buildOfficeApprovalRequestView,
  buildOfficeApprovalAuditTimeline,
  buildOfficeApprovalExecutionGate,
  buildOfficeAuthorityAdapterContract,
  buildOfficeOrchestratorMediationQueue,
  buildOfficeWorkerIntentRouting,
  buildOfficeWorkerFacilityReadiness,
  buildOfficeWorkerAssignmentCandidateGate,
  buildOfficeWorkerRequestDraftPreview,
  buildOfficeWorkerHumanConfirmationEnvelope,
  buildOfficeWorkerAuthorityHandoffEnvelope,
  buildOfficeWorkerDispatchDryRunEnvelope,
  buildOfficeWorkerAuditPreviewEnvelope,
  buildOfficeWorkerRollbackPreviewEnvelope,
  buildOfficeWorkerFinalGateChecklist,
  buildOfficeControlledMutationProposalContract,
  buildOfficeControlledMutationDryRunPlan,
  buildOfficeControlledMutationAuditSinkPlan,
  buildOfficeControlledMutationRollbackVerificationPlan,
  buildOfficeControlledMutationHumanApprovalPlan,
  buildOfficeControlledMutationAuthoritySummary,
  buildOfficeControlledMutationExecutionReadinessSummary,
  buildOfficeDeskRpgWorkerRoleVisibility,
  buildOfficeDisabledApprovalDialoguePosture,
  buildOfficeReviewerWikiHandoffPosture,
  buildOfficeApprovalDialogueInspectorDetail,
  buildOfficeReviewerWikiEvidenceDetailPosture,
  buildOfficeBoardEvidenceInspectorDrilldown,
  buildOfficeBossOrchestratorRequestPostureDetail,
  buildOfficeOrchestratorRequestEnvelopeDetail,
  buildOfficeApprovalRequestRouteDetail,
  buildOfficeEventRequestContractProjection,
  buildOfficeApprovalDialogueRouteInspector,
  buildOfficeEventTimelineProjection,
  buildOfficeTimelineWorkerHandoffDrilldown,
  buildOfficeApprovalRequestDetailDeepening,
  buildOfficeStateDelta,
  buildOfficeTimeDisplayPolicy,
  buildOfficeUsabilitySummary,
  groupByText,
  mergeOfficeRecentChanges,
  numberField,
  OFFICE_LIVE_TRACKING_BASE_INTERVAL_MS,
  resolveOfficeLiveTrackingInterval,
  textField,
  visibleRows,
  type OfficeDeskRpgProjectionModel,
  type OfficeDeskRpgWorkerRoleVisibility,
  type OfficeDisabledApprovalDialoguePosture,
  type OfficeReviewerWikiHandoffPosture,
  type OfficeApprovalDialogueInspectorDetail,
  type OfficeReviewerWikiEvidenceDetailPosture,
  type OfficeBoardEvidenceInspectorDrilldown,
  type OfficeBossOrchestratorRequestPostureDetail,
  type OfficeOrchestratorRequestEnvelopeDetail,
  type OfficeApprovalRequestRouteDetail,
  type OfficeEventRequestContractProjection,
  type OfficeApprovalDialogueRouteInspector,
  type OfficeEventTimelineProjection,
  type OfficeTimelineWorkerHandoffDrilldown,
  type OfficeApprovalRequestDetailDeepening,
  type OfficeCharacter,
  type OfficeMapDensityMode,
  type OfficeMapFlow,
  type OfficeMapNode,
  type OfficePaperclipWorkbenchSource,
  type OfficePageSectionPlan,
  type OfficeRecentChange,
  type OfficeRpgScene,
  type OfficeRpgSceneEntity,
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

export function OfficeDeskRpgRoomShell({ projection }: { projection: OfficeDeskRpgProjectionModel }) {
  return (
    <section
      className="border border-emerald-200/20 bg-gradient-to-br from-slate-950 via-emerald-950/10 to-black p-4"
      data-office-desk-rpg-room-shell="true"
      data-office-desk-rpg-safe-projection-only={String(projection.safeProjectionOnly)}
      data-office-desk-rpg-enabled-controls={projection.enabledControls}
      data-office-desk-rpg-raw-excluded={String(projection.rawExcluded)}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">Desk RPG Room Shell 1</div>
          <h2 className="mt-1 text-xl font-semibold text-foreground">읽기 전용 Desk RPG 운영실</h2>
          <p className="mt-2 max-w-3xl text-xs leading-5 text-midground/70">
            Boss desk에서 시작한 의도는 Orchestrator desk를 거쳐 worker cluster, central board, inspector, NAS vault, security/ops corner로 표시만 이동합니다.
            NAS 저장은 승인 전 차단되며 이 shell은 실행·배정·요청 생성·감사 쓰기를 제공하지 않습니다.
          </p>
        </div>
        <div className="grid gap-2 text-xs text-midground/70 sm:grid-cols-3 lg:min-w-[28rem]">
          <div className="border border-current/15 bg-black/25 p-2">enabled controls: {projection.enabledControls}</div>
          <div className="border border-current/15 bg-black/25 p-2">safe projection: {projection.safeProjectionOnly ? "true" : "false"}</div>
          <div className="border border-current/15 bg-black/25 p-2">raw excluded: {projection.rawExcluded ? "true" : "false"}</div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4" data-office-desk-rpg-facilities="true">
          {projection.facilities.map((facility) => (
            <div
              key={facility.id}
              className="min-h-28 border border-current/15 bg-black/20 p-3"
              data-office-desk-rpg-facility={facility.id}
              data-office-desk-rpg-facility-posture={facility.posture}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{facility.posture}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{facility.label}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{facility.safeSummary}</div>
            </div>
          ))}
        </div>

        <div className="grid gap-2" data-office-desk-rpg-actors="true">
          {projection.actors.map((actor) => (
            <div
              key={actor.role}
              className="border border-current/15 bg-black/20 p-3"
              data-office-desk-rpg-actor={actor.role}
              data-office-desk-rpg-actor-facility={actor.facilityId}
              data-office-desk-rpg-actor-status={actor.status}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-foreground">{actor.label}</div>
                  <div className="mt-1 text-xs text-midground/55">{actor.role} · {actor.facilityId}</div>
                </div>
                <div className="font-mono text-xs text-emerald-200">x{actor.visibleInstances}</div>
              </div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{actor.safeSummary}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 grid gap-2 md:grid-cols-4" data-office-desk-rpg-posture="true">
        <div className="border border-current/15 bg-black/20 p-3" data-office-desk-rpg-board-state="true">
          <div className="text-xs font-semibold text-foreground">{projection.boardState.label}</div>
          <div className="mt-1 text-xs text-midground/65">work {projection.boardState.workItemCount} · blocked {projection.boardState.blockedCount}</div>
        </div>
        <div className="border border-current/15 bg-black/20 p-3" data-office-desk-rpg-evidence-state="true">
          <div className="text-xs font-semibold text-foreground">{projection.evidenceState.label}</div>
          <div className="mt-1 text-xs text-midground/65">sources {projection.evidenceState.sourceCount} · warnings {projection.evidenceState.warningCount}</div>
        </div>
        <div className="border border-current/15 bg-black/20 p-3" data-office-desk-rpg-vault-state="true" data-office-desk-rpg-vault-write-enabled={String(projection.vaultState.writeEnabled)}>
          <div className="text-xs font-semibold text-foreground">{projection.vaultState.label}</div>
          <div className="mt-1 text-xs text-midground/65">NAS 저장은 승인 전 차단</div>
        </div>
        <div className="border border-current/15 bg-black/20 p-3" data-office-desk-rpg-ops-state="true" data-office-desk-rpg-service-controls-enabled={String(projection.opsState.serviceControlsEnabled)}>
          <div className="text-xs font-semibold text-foreground">{projection.opsState.label}</div>
          <div className="mt-1 text-xs text-midground/65">service controls disabled</div>
        </div>
      </div>
    </section>
  );
}

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
  projection_cache: {
    schema_version: 1,
    status: "missing",
    redacted: true,
    cache_layout: { incoming: "incoming", active: "active", archive: "archive", rejected: "rejected" },
    active: null,
    rejected: { count: 0, recent: [] },
  },
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

function PaperclipWorkbenchCard({ source, onInspect }: { source: OfficePaperclipWorkbenchSource; onInspect: () => void }) {
  return (
    <div className="border border-cyan-400/20 bg-cyan-950/10 p-3" data-office-paperclip-source={source.id}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-foreground">{source.label}</span>
        <StatusPill status={source.health} />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-midground/75">
        <div>
          <div className="text-midground/45">항목</div>
          <div className="text-foreground">{source.itemCount}</div>
        </div>
        <div>
          <div className="text-midground/45">릴레이</div>
          <div className="text-foreground">{source.relay}</div>
        </div>
        <div>
          <div className="text-midground/45">종류</div>
          <div className="text-foreground">{source.sourceType}</div>
        </div>
        <div>
          <div className="text-midground/45">상태 시점</div>
          <div className="text-foreground">{source.timingBucket}</div>
        </div>
      </div>
      {source.tags.length > 0 ? <div className="mt-3 text-xs text-cyan-200/80">{source.tags.join(" · ")}</div> : null}
      <div className="mt-2 text-[10px] leading-4 text-midground/50">{source.redactionNote}</div>
      <button type="button" onClick={onInspect} className="mt-3 flex items-center gap-1 text-xs uppercase tracking-[0.16em] text-midground/70 hover:text-foreground">
        <Eye className="h-3 w-3" /> 안전 요약 보기
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

function CharacterMarker({
  character,
  latestDelta,
  selected,
  onInspect,
}: {
  character: OfficeCharacter;
  latestDelta: OfficeStateDelta;
  selected: boolean;
  onInspect: () => void;
}) {
  const view = buildOfficeCharacterView(character);
  const activity = buildOfficeCharacterActivity(character, latestDelta);
  const inspector = buildOfficeCharacterInspector(character, latestDelta);
  const object = buildOfficeCharacterSceneObjects([character])[0];
  const motion = buildOfficeSceneMotionTrack(object);
  return (
    <button
      type="button"
      className={`office-character-inspect absolute z-[35] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-0.5 ${motion.className} ${selected ? "office-character-inspect--selected" : ""}`}
      style={{ left: `${character.x}%`, top: `${character.y}%`, ...motion.style } as React.CSSProperties}
      title={`${view.nameplate} · ${view.statusLabel} · ${activity.label}`}
      aria-label={inspector.ariaLabel}
      onClick={onInspect}
      data-office-scene-marker="true"
      data-office-character-id={character.id}
      data-office-character-selected={selected ? "true" : "false"}
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
  layoutPlan,
  trackingTruth,
  selectedCharacterId,
  selectedCharacterFocus,
  safeStreamPosture,
  safeMotionHeartbeat,
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
  layoutPlan: ReturnType<typeof buildOfficeFirstLayoutPlan>;
  trackingTruth: ReturnType<typeof buildOfficeTrackingTruthPlan>;
  selectedCharacterId: string | null;
  selectedCharacterFocus: ReturnType<typeof buildOfficeSelectedCharacterFocus>;
  safeStreamPosture: ReturnType<typeof buildOfficeSafeStreamPosture>;
  safeMotionHeartbeat: ReturnType<typeof buildOfficeSafeMotionHeartbeat>;
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
  const safeEventSubstrate = buildOfficeSafeEventSubstrate(latestDelta, { visibleCharacterCount: densityPlan.visibleCharacters.length, hasEventStream: safeStreamPosture.mode === "backend-safe-stream" });
  const safeMotionCommands = buildOfficeSafeMotionCommands(safeStreamPosture.events);
  const safeSpatialChoreography = buildOfficeSafeSpatialChoreography(safeStreamPosture.events, safeMotionHeartbeat);

  return (
    <Card className="office-first-layout" data-office-first-layout="true">
      <CardHeader>
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-300">{layoutPlan.stageLabel}</div>
            <CardTitle className="mt-2 flex items-center gap-2 text-base">
              <MapPinned className="h-4 w-4" /> {layoutPlan.heading}
            </CardTitle>
            <div className="mt-2 text-xs text-midground/55">
              오피스 현장을 먼저 보고, 캐릭터 클릭으로 안전 요약을 고정합니다. 세부 HUD는 보조 진단으로 내려 과밀을 줄입니다.
            </div>
          </div>
          <div className="grid gap-1 text-[10px] uppercase tracking-[0.14em] text-midground/60 sm:grid-cols-4 xl:min-w-[30rem]" aria-label="Stage 16-A 우선순위">
            {layoutPlan.sections.map((section) => (
              <span key={section.id} className="border border-current/15 bg-black/15 px-2 py-1" data-office-first-section={section.id} title={section.detail}>
                {section.priority}. {section.label}
              </span>
            ))}
          </div>
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
        <div className="mb-4 grid gap-3 xl:grid-cols-[1fr_0.8fr]">
          <div className="border border-emerald-400/20 bg-emerald-950/10 p-3 text-xs" data-office-tracking-truth="true" data-office-tracking-truth-mode={trackingTruth.mode}>
            <div className="font-semibold text-emerald-200">{trackingTruth.label}</div>
            <div className="mt-1 text-emerald-100/75">{trackingTruth.detail}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.12em] text-emerald-100/60">
              {trackingTruth.caveats.map((caveat) => <span key={caveat}>{caveat}</span>)}
            </div>
            <div className="office-safe-event-substrate" data-office-safe-event-substrate="true" data-office-safe-event-substrate-mode={safeEventSubstrate.mode} data-office-safe-stream-status={safeStreamPosture.mode}>
              <div className="office-safe-event-substrate__title">Stage 16-C 안전 이벤트 stream</div>
              <div className="office-safe-event-substrate__summary">{safeStreamPosture.label} · {safeStreamPosture.summary}</div>
              <div className="office-safe-event-substrate__items">
                {safeStreamPosture.events.slice(0, 4).map((event) => (
                  <span key={event.id} className={`office-safe-event-substrate__item ${safePulseToneClass(event.tone)}`} data-office-safe-event-item={event.category} data-office-safe-event-room={event.roomId} title={event.detail}>
                    {event.safeLabel} · {event.count}
                  </span>
                ))}
              </div>
            </div>
            <div className="office-safe-motion-heartbeat" data-office-safe-motion-heartbeat="true" data-office-safe-motion-heartbeat-mode={safeMotionHeartbeat.mode} data-office-safe-motion-heartbeat-phase={safeMotionHeartbeat.phase} data-office-safe-motion-heartbeat-intensity={safeMotionHeartbeat.intensity} data-office-safe-motion-heartbeat-enabled={safeMotionHeartbeat.motionEnabled ? "true" : "false"} aria-hidden={safeMotionHeartbeat.ariaHidden}>
              <div className="office-safe-motion-heartbeat__pulse" />
              <div>
                <div className="office-safe-motion-heartbeat__title">Stage 16-D 안전 motion heartbeat</div>
                <div className="office-safe-motion-heartbeat__summary">{safeMotionHeartbeat.summary}</div>
              </div>
              <div className="office-safe-motion-heartbeat__items">
                {safeMotionHeartbeat.items.map((item) => (
                  <span key={item.id} className={`office-safe-motion-heartbeat__item ${safePulseToneClass(item.tone)}`} data-office-safe-motion-heartbeat-item={item.id} title={item.detail}>
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
            <div className="office-safe-motion-lane" data-office-safe-motion-lane="true" aria-label="안전 이벤트 기반 움직임 신호">
              {safeMotionCommands.slice(0, 4).map((command) => (
                <span key={command.id} className={`${command.className} ${safePulseToneClass(command.tone)}`} data-office-safe-motion-command={command.kind} data-office-safe-motion-room={command.roomId} aria-hidden={command.ariaHidden} title={command.detail}>
                  {command.label}
                </span>
              ))}
            </div>
          </div>
          <div className="border border-current/15 bg-black/20 p-3 text-xs" data-office-selected-character-panel="true">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-foreground">{selectedCharacterFocus.title}</span>
              <span className="text-[10px] uppercase tracking-[0.16em] text-midground/45">Click inspect</span>
            </div>
            <div className="mt-1 text-midground/70">{selectedCharacterFocus.summary}</div>
            <div className="mt-3 grid gap-1 sm:grid-cols-2">
              {selectedCharacterFocus.fields.map(([label, value]) => (
                <div key={label} className="border border-current/10 bg-black/15 px-2 py-1">
                  <span className="text-midground/45">{label}</span>
                  <span className="ml-2 text-foreground/85">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
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
          data-office-safe-event-motion={safeStreamPosture.mode}
          data-office-safe-motion-heartbeat-map={safeMotionHeartbeat.phase}
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
          <svg className="office-safe-spatial-choreography" aria-label="Stage 16-E 안전 spatial choreography" data-office-safe-spatial-choreography="true" data-office-safe-spatial-choreography-mode={safeSpatialChoreography.mode} viewBox="0 0 100 100" preserveAspectRatio="none">
            {safeSpatialChoreography.items.filter((item) => item.kind === "route-sweep").map((item) => (
              <line
                key={item.id}
                x1={item.x}
                y1={item.y}
                x2={item.x2}
                y2={item.y2}
                className={`${item.className} ${safePulseToneClass(item.tone)}`}
                aria-hidden={item.ariaHidden}
                data-office-safe-spatial-choreography-item={item.kind}
                data-office-safe-spatial-choreography-room={item.roomId}
                data-office-safe-spatial-choreography-intensity={item.intensity}
              />
            ))}
          </svg>
          <div className="office-safe-spatial-choreography__rooms" aria-hidden={safeSpatialChoreography.ariaHidden}>
            {safeSpatialChoreography.items.filter((item) => item.kind === "room-pulse").map((item) => (
              <span
                key={item.id}
                className={`${item.className} ${safePulseToneClass(item.tone)}`}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                title={item.detail}
                aria-hidden={item.ariaHidden}
                data-office-safe-spatial-choreography-item={item.kind}
                data-office-safe-spatial-choreography-room={item.roomId}
                data-office-safe-spatial-choreography-intensity={item.intensity}
              >
                <span className="office-safe-spatial-choreography__pulse" />
                <span className="office-safe-spatial-choreography__core" />
              </span>
            ))}
          </div>
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
            ? densityPlan.visibleCharacters.map((character) => <CharacterMarker key={character.id} character={character} latestDelta={latestDelta} selected={selectedCharacterId === character.id} onInspect={() => onInspectCharacter(character)} />)
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
            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] uppercase tracking-[0.16em]" data-office-map-compact-header="true">
              <span className="text-emerald-200">오피스 요약</span>
              <span className="text-sky-200">{responsivePlan.viewportMode === "narrow" ? "좁은 화면" : "데스크톱"} · {densityPlan.label}</span>
              <span className="text-lime-200">추적 {trackingCues.length} · 방 활동 {roomActivityMeters.length}</span>
              <span className="text-teal-100">흐름 {safeFlowPulseBands.bands.length} · 공간 {safeSpatialChoreography.items.length}</span>
            </div>
            <div className="mb-3 grid gap-2 text-xs md:grid-cols-3" data-office-map-summary="true">
              <div className="border border-emerald-400/20 bg-emerald-950/10 p-2">
                <div className="text-[10px] uppercase tracking-[0.16em] text-emerald-100/65">핵심 상태</div>
                <div className="mt-1 font-semibold text-emerald-100">{safeFloorLegend.summary}</div>
              </div>
              <div className="border border-sky-400/20 bg-sky-950/10 p-2">
                <div className="text-[10px] uppercase tracking-[0.16em] text-sky-100/65">최근 신호</div>
                <div className="mt-1 font-semibold text-sky-100">{safeTacticalTicker.headline}</div>
              </div>
              <div className="border border-blue-400/20 bg-blue-950/10 p-2">
                <div className="text-[10px] uppercase tracking-[0.16em] text-blue-100/65">공간 움직임</div>
                <div className="mt-1 font-semibold text-blue-100">{safeSpatialChoreography.summary}</div>
              </div>
            </div>
            <details className="office-map-diagnostics-drawer border border-current/15 bg-black/15 p-3 text-xs" data-office-map-diagnostics-drawer="true">
              <summary className="cursor-pointer select-none font-semibold uppercase tracking-[0.16em] text-midground/80 hover:text-foreground">
                세부 진단 열기 · Stage 14/16 rail {trackingCues.length + roomActivityMeters.length + safePulseTimeline.items.length + safeBreadcrumbTrail.segments.length + safeFocusLane.items.length + safeAttentionStrip.chips.length}개 신호
              </summary>
              <div className="mt-3 border-t border-current/10 pt-3">
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
            <div className="mt-3 border border-emerald-400/15 bg-emerald-950/10 p-2 text-[11px] leading-5 text-emerald-100/80">
              이 지도는 시각 인덱스입니다. 움직이는 캐릭터, 액션 칩, 방 사이 흐름 표식, 캐릭터 살펴보기는 안전 개수/상태/변화의 표시일 뿐이며 원문 프롬프트, 대화 기록, cron 스크립트, 작업 본문, 로그, 인증 정보, 비밀값은 브라우저 DTO 밖에 둡니다.
            </div>
              </div>
            </details>
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

function OfficeSectionDrawer({ plan, children }: { plan: OfficePageSectionPlan; children: React.ReactNode }) {
  return (
    <details
      className="border border-current/15 bg-black/10 p-3"
      data-office-section-drawer={plan.id}
      open={plan.defaultOpen}
    >
      <summary className="flex cursor-pointer list-none flex-col gap-1 outline-none focus:ring-2 focus:ring-emerald-200/70 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <span className="text-[10px] uppercase tracking-[0.18em] text-emerald-300">{plan.label}</span>
          <span className="border border-current/15 px-2 py-0.5 text-[10px] text-midground/70">{plan.count}</span>
        </span>
        <span className="text-xs text-midground/65">{plan.summary}</span>
      </summary>
      <div className="mt-4 border-t border-current/10 pt-4" aria-label={plan.ariaLabel}>{children}</div>
    </details>
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

const RPG_SEVERITY_CLASS: Record<OfficeRpgSceneEntity["severity"], string> = {
  normal: "border-cyan-200/20 text-cyan-100",
  info: "border-sky-300/35 text-sky-100",
  warning: "border-yellow-300/45 text-yellow-100",
  danger: "border-red-300/45 text-red-100",
};

const RPG_KIND_LABEL: Record<OfficeRpgSceneEntity["kind"], string> = {
  agent: "직원",
  session: "세션",
  work_item: "업무",
  cron_job: "자동화",
  source: "자료실",
  incident: "확인",
  report: "보고",
};

export function OfficeRpgMap({
  scene,
  selectedEntityId,
  onInspectEntity,
}: {
  scene: OfficeRpgScene;
  selectedEntityId: string | null;
  onInspectEntity: (entity: OfficeRpgSceneEntity) => void;
}) {
  const [roomFilter, setRoomFilter] = useState<OfficeRpgSceneEntity["room"] | "all">("all");
  const [statusFilter, setStatusFilter] = useState<OfficeRpgSceneEntity["status"] | "all">("all");
  const [severityFilter, setSeverityFilter] = useState<OfficeRpgSceneEntity["severity"] | "all">("all");
  const [roleFilter, setRoleFilter] = useState<OfficeRpgSceneEntity["kind"] | "all">("all");
  const visibleEntities = scene.entities.filter((entity) => (
    (roomFilter === "all" || entity.room === roomFilter)
    && (statusFilter === "all" || entity.status === statusFilter)
    && (severityFilter === "all" || entity.severity === severityFilter)
    && (roleFilter === "all" || entity.kind === roleFilter)
  ));
  const roomOptions = scene.rooms.map((room) => room.id);
  const statusOptions = Array.from(new Set(scene.entities.map((entity) => entity.status)));
  const severityOptions = Array.from(new Set(scene.entities.map((entity) => entity.severity)));
  const roleOptions = Array.from(new Set(scene.entities.map((entity) => entity.kind)));
  const missionStoryboard = buildOfficeRpgMissionStoryboard(scene);
  const orchestratorDesk = buildOfficeRpgOrchestratorDesk(scene);
  const kanbanBoardFacility = buildOfficeRpgKanbanBoardFacility(scene);
  const sourceArchiveFacility = buildOfficeRpgSourceArchiveFacility(scene);
  const reviewCornerFacility = buildOfficeRpgReviewCornerFacility(scene);
  const approvalConsoleFacility = buildOfficeRpgApprovalConsoleFacility(scene);

  return (
    <Card className="overflow-hidden border-emerald-300/25 bg-black/25" data-office-rpg-map="true">
      <CardHeader>
        <CardTitle className="flex flex-col gap-2 text-base sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-emerald-300" /> AI Office RPG Visualizer
          </span>
          <span className="border border-emerald-300/25 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-200">읽기 전용 · OfficeState</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 text-xs text-midground/70 sm:grid-cols-3" data-office-rpg-truth="true">
          <div>생성 시각: {fmt(scene.generatedAt)}</div>
          <div>엔티티: {scene.entities.length}개 · 표시 {visibleEntities.length}개</div>
          <div>원문 제외 섹션: {scene.safety.omittedRawSections.length}개</div>
        </div>
        <nav className="flex flex-wrap gap-2 text-xs" aria-label="RPG 지도 이동">
          {[
            ["map", "지도"],
            ["mission", "미션 흐름"],
            ["attention", "주의"],
            ["source_archive", "자료실"],
            ["approval", "승인"],
            ["inspector", "검사"],
            ["fallback", "대체 목록"],
          ].map(([id, label]) => (
            <a key={id} href={id === "inspector" ? "#office-safe-inspector" : `#office-rpg-${id}`} className="border border-current/20 px-2 py-1 text-midground/70 hover:text-foreground" data-office-rpg-jump-target={id}>{label}</a>
          ))}
        </nav>
        <section id="office-rpg-mission" className="office-rpg-mission" data-office-rpg-mission-storyboard="true" aria-label={missionStoryboard.title}>
          <div className="office-rpg-mission__header">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/70">{missionStoryboard.stageLabel}</div>
              <h3 className="text-sm font-semibold text-foreground">{missionStoryboard.title}</h3>
              <p className="mt-1 text-xs leading-5 text-midground/70">{missionStoryboard.summary}</p>
            </div>
            <div className="border border-emerald-300/25 bg-emerald-950/15 px-3 py-2 text-xs text-emerald-100" data-office-rpg-approval-boundary="true">
              {missionStoryboard.approvalBoundary}
            </div>
          </div>
          <div className="office-rpg-mission__steps">
            {missionStoryboard.steps.map((step, index) => (
              <div key={step.id} className={`office-rpg-mission__step office-rpg-mission__step--${step.tone}`} data-office-rpg-mission-step={step.id}>
                <div className="office-rpg-mission__node" aria-hidden="true">{index + 1}</div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-foreground">
                    <span>{step.label}</span>
                    <span className="text-[10px] font-normal uppercase tracking-[0.16em] text-midground/55">{step.room}</span>
                  </div>
                  <div className="mt-1 text-xs leading-5 text-midground/70">{step.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section id="office-rpg-orchestrator" className="office-rpg-orchestrator" data-office-rpg-orchestrator-desk="true" aria-label={orchestratorDesk.title}>
          <div className="office-rpg-orchestrator__header">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200/70">{orchestratorDesk.stageLabel}</div>
              <h3 className="text-sm font-semibold text-foreground">{orchestratorDesk.title}</h3>
              <p className="mt-1 text-xs leading-5 text-midground/70">{orchestratorDesk.intent}</p>
            </div>
            <div className="border border-sky-300/25 bg-sky-950/15 px-3 py-2 text-xs text-sky-100" data-office-rpg-orchestrator-boundary="true">
              {orchestratorDesk.actionBoundary}
            </div>
          </div>
          <div className="office-rpg-orchestrator__cards">
            {orchestratorDesk.cards.map((card) => (
              <div key={card.id} className={`office-rpg-orchestrator__card office-rpg-orchestrator__card--${card.tone}`} data-office-rpg-orchestrator-card={card.id}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{card.label}</div>
                <div className="mt-1 text-sm font-semibold text-foreground">{card.value}</div>
                <div className="mt-1 text-xs leading-5 text-midground/70">{card.detail}</div>
              </div>
            ))}
          </div>
        </section>
        <section id="office-rpg-kanban-board" className="office-rpg-board" data-office-rpg-kanban-board="true" aria-label={kanbanBoardFacility.title}>
          <div className="office-rpg-board__header">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-200/70">{kanbanBoardFacility.stageLabel}</div>
              <h3 className="text-sm font-semibold text-foreground">{kanbanBoardFacility.title}</h3>
              <p className="mt-1 text-xs leading-5 text-midground/70">source of truth: {kanbanBoardFacility.sourceOfTruth}</p>
            </div>
            <div className="border border-yellow-300/25 bg-yellow-950/15 px-3 py-2 text-xs text-yellow-100" data-office-rpg-kanban-boundary="true">
              {kanbanBoardFacility.writeBoundary}
            </div>
          </div>
          <div className="office-rpg-board__lanes">
            {kanbanBoardFacility.lanes.map((lane) => (
              <div key={lane.id} className={`office-rpg-board__lane office-rpg-board__lane--${lane.tone}`} data-office-rpg-kanban-lane={lane.id}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{lane.label}</div>
                <div className="mt-1 text-sm font-semibold text-foreground">{lane.value}</div>
                <div className="mt-1 text-xs leading-5 text-midground/70">{lane.detail}</div>
              </div>
            ))}
          </div>
        </section>
        <section id="office-rpg-source-archive" className="office-rpg-source-archive" data-office-rpg-source-archive="true" aria-label={sourceArchiveFacility.title}>
          <div className="office-rpg-source-archive__header">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">{sourceArchiveFacility.stageLabel}</div>
              <h3 className="text-sm font-semibold text-foreground">{sourceArchiveFacility.title}</h3>
              <p className="mt-1 text-xs leading-5 text-midground/70">Paperclip/sourceTags 근거 레이어를 원문 없이 운영실 자료실로 보여줍니다</p>
            </div>
            <div className="border border-cyan-300/25 bg-cyan-950/15 px-3 py-2 text-xs text-cyan-100" data-office-rpg-source-boundary="true">
              {sourceArchiveFacility.rawBoundary}
            </div>
          </div>
          <div className="office-rpg-source-archive__shelves">
            {sourceArchiveFacility.shelves.map((shelf) => (
              <div key={shelf.id} className={`office-rpg-source-archive__shelf office-rpg-source-archive__shelf--${shelf.tone}`} data-office-rpg-source-shelf={shelf.id}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{shelf.label}</div>
                <div className="mt-1 text-sm font-semibold text-foreground">{shelf.value}</div>
                <div className="mt-1 text-xs leading-5 text-midground/70">{shelf.detail}</div>
              </div>
            ))}
          </div>
        </section>
        <section id="office-rpg-review-corner" className="office-rpg-review-corner" data-office-rpg-review-corner="true" aria-label={reviewCornerFacility.title}>
          <div className="office-rpg-review-corner__header">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-200/70">{reviewCornerFacility.stageLabel}</div>
              <h3 className="text-sm font-semibold text-foreground">{reviewCornerFacility.title}</h3>
              <p className="mt-1 text-xs leading-5 text-midground/70">검토/승인 신호를 실행 전 안전 대기 구역으로만 모읍니다</p>
            </div>
            <div className="border border-rose-300/25 bg-rose-950/15 px-3 py-2 text-xs text-rose-100" data-office-rpg-review-boundary="true">
              {reviewCornerFacility.approvalBoundary}
            </div>
          </div>
          <div className="office-rpg-review-corner__stations">
            {reviewCornerFacility.stations.map((station) => (
              <div key={station.id} className={`office-rpg-review-corner__station office-rpg-review-corner__station--${station.tone}`} data-office-rpg-review-station={station.id}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{station.label}</div>
                <div className="mt-1 text-sm font-semibold text-foreground">{station.value}</div>
                <div className="mt-1 text-xs leading-5 text-midground/70">{station.detail}</div>
              </div>
            ))}
          </div>
        </section>
        <section id="office-rpg-approval" className="office-rpg-approval" data-office-rpg-approval-console="true" aria-label={approvalConsoleFacility.title}>
          <div className="office-rpg-approval__header">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/70">{approvalConsoleFacility.stageLabel}</div>
              <h3 className="text-sm font-semibold text-foreground">{approvalConsoleFacility.title}</h3>
              <p className="mt-1 text-xs leading-5 text-midground/70">승인/거절 실행이 아니라 사람이 판단하기 전 안전 자세만 표시합니다</p>
            </div>
            <div className="border border-violet-300/25 bg-violet-950/15 px-3 py-2 text-xs text-violet-100" data-office-rpg-approval-boundary="true">
              {approvalConsoleFacility.decisionBoundary}
            </div>
          </div>
          <div className="office-rpg-approval__controls" aria-label="비활성 승인 콘솔 컨트롤">
            {approvalConsoleFacility.controls.map((control) => (
              <div key={control.id} className={`office-rpg-approval__control office-rpg-approval__control--${control.tone}`} data-office-rpg-approval-control={control.id} aria-disabled={control.disabled}>
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{control.label}</div>
                <div className="mt-1 text-sm font-semibold text-foreground">{control.value}</div>
                <div className="mt-1 text-xs leading-5 text-midground/70">{control.detail}</div>
              </div>
            ))}
          </div>
        </section>
        <div className="grid gap-2 text-xs md:grid-cols-4" data-office-rpg-filters="true">
          <label className="grid gap-1 text-midground/65">
            <span>방</span>
            <select value={roomFilter} onChange={(event) => setRoomFilter(event.target.value as typeof roomFilter)} className="border border-current/20 bg-black/40 p-2 text-foreground" data-office-rpg-filter="room">
              <option value="all">전체</option>
              {roomOptions.map((room) => <option key={room} value={room}>{room}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-midground/65">
            <span>상태</span>
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)} className="border border-current/20 bg-black/40 p-2 text-foreground" data-office-rpg-filter="status">
              <option value="all">전체</option>
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-midground/65">
            <span>심각도</span>
            <select value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value as typeof severityFilter)} className="border border-current/20 bg-black/40 p-2 text-foreground" data-office-rpg-filter="severity">
              <option value="all">전체</option>
              {severityOptions.map((severity) => <option key={severity} value={severity}>{severity}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-midground/65">
            <span>역할</span>
            <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as typeof roleFilter)} className="border border-current/20 bg-black/40 p-2 text-foreground" data-office-rpg-filter="role">
              <option value="all">전체</option>
              {roleOptions.map((role) => <option key={role} value={role}>{RPG_KIND_LABEL[role]}</option>)}
            </select>
          </label>
        </div>
        <div id="office-rpg-map" className="office-rpg-map__floor" role="region" aria-label="읽기 전용 AI Office RPG 2D 지도">
          {scene.rooms.map((room) => {
            const roomEntities = visibleEntities.filter((entity) => entity.room === room.id);
            return (
              <section
                key={room.id}
                id={room.id === "source_archive" ? "office-rpg-source_archive" : undefined}
                className={`office-rpg-room office-rpg-room--${room.id} office-rpg-room--${room.severity}`}
                data-office-rpg-room={room.id}
                aria-label={`${room.label}: ${room.summary}`}
              >
                <div className="office-rpg-room__label">
                  <span>{room.label}</span>
                  <span>{room.summary}</span>
                </div>
                {roomEntities.map((entity) => (
                  <button
                    key={entity.id}
                    type="button"
                    className={`office-rpg-entity office-rpg-entity--${entity.kind} office-rpg-entity--${entity.severity} ${selectedEntityId === entity.id ? "office-rpg-entity--selected" : ""}`}
                    style={{ left: `${entity.positionHint.x}%`, top: `${entity.positionHint.y}%` }}
                    onClick={() => onInspectEntity(entity)}
                    data-office-rpg-entity={entity.id}
                    data-office-rpg-kind={entity.kind}
                    data-office-rpg-status={entity.status}
                    data-office-rpg-severity={entity.severity}
                    aria-label={`${RPG_KIND_LABEL[entity.kind]} ${entity.label}: ${entity.status}`}
                    title={`${entity.summary} · ${entity.linkTarget.ref}`}
                  >
                    <span className="office-rpg-entity__sprite" aria-hidden="true" />
                    <span className="office-rpg-entity__label">{entity.label}</span>
                  </button>
                ))}
              </section>
            );
          })}
        </div>
        <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
          <div id="office-rpg-fallback" className="border border-current/15 bg-black/15 p-3" data-office-rpg-fallback="true">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-midground/65">텍스트 대체 목록</div>
            <div className="grid gap-2">
              {visibleEntities.map((entity) => (
                <button
                  key={`fallback-${entity.id}`}
                  type="button"
                  className={`flex flex-col gap-1 border bg-black/15 p-2 text-left text-xs hover:bg-white/5 ${RPG_SEVERITY_CLASS[entity.severity]}`}
                  onClick={() => onInspectEntity(entity)}
                  data-office-rpg-fallback-row={entity.id}
                >
                  <span className="font-semibold">{RPG_KIND_LABEL[entity.kind]} · {entity.label}</span>
                  <span className="text-midground/65">{entity.room} · {entity.status} · {entity.summary}</span>
                </button>
              ))}
            </div>
          </div>
          <div id="office-rpg-attention" className="border border-current/15 bg-black/15 p-3" data-office-rpg-events="true">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-midground/65">최근 안전 이벤트</div>
            {scene.recentEvents.length > 0 ? (
              <div className="grid gap-2">
                {scene.recentEvents.map((event) => (
                  <div key={event.id} className={`border p-2 text-xs ${RPG_SEVERITY_CLASS[event.severity]}`} data-office-rpg-event={event.id}>
                    <div className="font-semibold">{event.label}</div>
                    <div className="text-midground/65">{event.room} · {fmt(event.at)}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-current/15 p-3 text-xs text-midground/55">최근 안전 이벤트가 없습니다. 임의 진행도나 가짜 움직임은 만들지 않습니다.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OfficeDeskRpgWorkerRoleVisibilityPanel({ visibility }: { visibility: OfficeDeskRpgWorkerRoleVisibility }) {
  return (
    <Card
      data-office-desk-rpg-worker-roles="true"
      data-office-desk-rpg-worker-roles-enabled-controls={visibility.enabledControls}
      data-office-desk-rpg-worker-roles-assignment-enabled={String(visibility.assignmentEnabled)}
      data-office-desk-rpg-worker-roles-request-creation-enabled={String(visibility.requestCreationEnabled)}
      data-office-desk-rpg-worker-roles-dispatch-enabled={String(visibility.dispatchEnabled)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" /> Worker role visibility
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-sky-300/20 bg-sky-950/10 p-3">
            <div className="font-semibold text-sky-100">역할 가시성 · assignment/dispatch disabled</div>
            <div className="mt-1 leading-5">
              Search Worker, Reviewer, Wiki Writer, NAS Keeper는 현재 읽기 전용 역할 posture로만 표시됩니다. 작업 배정, 요청 생성, adapter dispatch, NAS 저장은 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {visibility.roles.map((role) => (
              <div
                key={role.role}
                className="border border-current/15 bg-black/15 p-3"
                data-office-desk-rpg-worker-role={role.role}
                data-office-desk-rpg-worker-role-lane={role.lane}
                data-office-desk-rpg-worker-role-assignment-enabled={String(role.assignmentEnabled)}
                data-office-desk-rpg-worker-role-dispatch-enabled={String(role.dispatchEnabled)}
              >
                <div className="font-semibold text-foreground">{role.label}</div>
                <div className="mt-1 text-midground/60">{role.lane} · {role.status} · visible {role.visibleInstances}</div>
                <div className="mt-2 leading-5">{role.safeSummary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-desk-rpg-worker-roles-boundary="true">
            suppressed runtime instances: {visibility.suppressedRuntimeInstances} · enabled controls: {visibility.enabledControls} · raw excluded: {String(visibility.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DisabledApprovalDialoguePosturePanel({ dialogue }: { dialogue: OfficeDisabledApprovalDialoguePosture }) {
  return (
    <Card
      data-office-disabled-approval-dialogue="true"
      data-office-disabled-approval-dialogue-enabled-controls={dialogue.enabledControls}
      data-office-disabled-approval-dialogue-approve-enabled={String(dialogue.approveEnabled)}
      data-office-disabled-approval-dialogue-reject-enabled={String(dialogue.rejectEnabled)}
      data-office-disabled-approval-dialogue-hold-enabled={String(dialogue.holdEnabled)}
      data-office-disabled-approval-dialogue-request-creation-enabled={String(dialogue.requestCreationEnabled)}
      data-office-disabled-approval-dialogue-dispatch-enabled={String(dialogue.dispatchEnabled)}
      data-office-disabled-approval-dialogue-nas-save-enabled={String(dialogue.nasSaveEnabled)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" /> Disabled approval dialogue posture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-fuchsia-300/20 bg-fuchsia-950/10 p-3">
            <div className="font-semibold text-fuchsia-100">승인 대화 posture · controls disabled</div>
            <div className="mt-1 leading-5">
              Orchestrator가 사장 캐릭터에게 승인 대기를 보고하는 대화 형태만 표시합니다. approve/reject/hold, request creation, dispatch, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-3">
            {dialogue.dialogueLines.map((line) => (
              <div
                key={line.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-disabled-approval-dialogue-line={line.id}
                data-office-disabled-approval-dialogue-tone={line.tone}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{line.speaker}</div>
                <div className="mt-1 font-semibold text-foreground">{line.label}</div>
                <div className="mt-2 leading-5">{line.text}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-disabled-approval-dialogue-boundary="true">
            evidence {dialogue.evidenceCount} · blocked {dialogue.blockedWorkCount} · enabled controls {dialogue.enabledControls} · raw excluded {String(dialogue.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewerWikiHandoffPosturePanel({ handoff }: { handoff: OfficeReviewerWikiHandoffPosture }) {
  return (
    <Card
      data-office-reviewer-wiki-handoff="true"
      data-office-reviewer-wiki-handoff-enabled-controls={handoff.enabledControls}
      data-office-reviewer-wiki-handoff-review-enabled={String(handoff.reviewEnabled)}
      data-office-reviewer-wiki-handoff-wiki-draft-enabled={String(handoff.wikiDraftEnabled)}
      data-office-reviewer-wiki-handoff-assignment-enabled={String(handoff.assignmentEnabled)}
      data-office-reviewer-wiki-handoff-request-creation-enabled={String(handoff.requestCreationEnabled)}
      data-office-reviewer-wiki-handoff-dispatch-enabled={String(handoff.dispatchEnabled)}
      data-office-reviewer-wiki-handoff-nas-save-enabled={String(handoff.nasSaveEnabled)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" /> Reviewer/Wiki handoff posture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-emerald-300/20 bg-emerald-950/10 p-3">
            <div className="font-semibold text-emerald-100">검토 → 위키 작성 handoff · execution disabled</div>
            <div className="mt-1 leading-5">
              Search Worker가 모은 근거를 Reviewer와 Wiki Writer가 이어받는 순서만 표시합니다. review 실행, draft 생성, 작업 배정, request creation, dispatch, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {handoff.sequence.map((step) => (
              <div
                key={step.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-reviewer-wiki-handoff-step={step.id}
                data-office-reviewer-wiki-handoff-step-role={step.actorRole}
                data-office-reviewer-wiki-handoff-step-status={step.status}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{step.actorLabel}</div>
                <div className="mt-1 font-semibold text-foreground">{step.label}</div>
                <div className="mt-1 text-midground/60">facility: {step.facilityId} · {step.status}</div>
                <div className="mt-2 leading-5">{step.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-reviewer-wiki-handoff-boundary="true">
            evidence {handoff.evidenceCount} · warnings {handoff.warningCount} · blocked {handoff.blockedWorkCount} · enabled controls {handoff.enabledControls} · raw excluded {String(handoff.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ApprovalDialogueInspectorDetailPanel({ inspector }: { inspector: OfficeApprovalDialogueInspectorDetail }) {
  return (
    <Card
      data-office-approval-dialogue-inspector="true"
      data-office-approval-dialogue-inspector-enabled-controls={inspector.enabledControls}
      data-office-approval-dialogue-inspector-approve-enabled={String(inspector.approveEnabled)}
      data-office-approval-dialogue-inspector-review-enabled={String(inspector.reviewEnabled)}
      data-office-approval-dialogue-inspector-audit-write-enabled={String(inspector.auditWriteEnabled)}
      data-office-approval-dialogue-inspector-nas-save-enabled={String(inspector.nasSaveEnabled)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4" /> Approval dialogue inspector detail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-sky-300/20 bg-sky-950/10 p-3">
            <div className="font-semibold text-sky-100">승인 대화 inspector · detail only</div>
            <div className="mt-1 leading-5">
              JRPG 승인 대화와 reviewer/wiki handoff를 오른쪽 inspector 수준으로만 풀어 보여줍니다. decision, review, draft, audit write, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {inspector.cards.map((card) => (
              <div
                key={card.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-approval-dialogue-inspector-card={card.id}
                data-office-approval-dialogue-inspector-card-tone={card.tone}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{card.id}</div>
                <div className="mt-1 font-semibold text-foreground">{card.label}</div>
                <div className="mt-2 leading-5">{card.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-approval-dialogue-inspector-boundary="true">
            dialogue lines {inspector.dialogueLineCount} · handoff steps {inspector.handoffStepCount} · enabled controls {inspector.enabledControls} · raw excluded {String(inspector.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ReviewerWikiEvidenceDetailPosturePanel({ detail }: { detail: OfficeReviewerWikiEvidenceDetailPosture }) {
  return (
    <Card
      data-office-reviewer-wiki-evidence-detail="true"
      data-office-reviewer-wiki-evidence-detail-enabled-controls={detail.enabledControls}
      data-office-reviewer-wiki-evidence-detail-source-open-enabled={String(detail.sourceOpenEnabled)}
      data-office-reviewer-wiki-evidence-detail-review-enabled={String(detail.reviewEnabled)}
      data-office-reviewer-wiki-evidence-detail-wiki-draft-enabled={String(detail.wikiDraftEnabled)}
      data-office-reviewer-wiki-evidence-detail-audit-write-enabled={String(detail.auditWriteEnabled)}
      data-office-reviewer-wiki-evidence-detail-nas-save-enabled={String(detail.nasSaveEnabled)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldCheck className="h-4 w-4" /> Reviewer/Wiki evidence detail posture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-emerald-300/20 bg-emerald-950/10 p-3">
            <div className="font-semibold text-emerald-100">근거 detail posture · aggregate only</div>
            <div className="mt-1 leading-5">
              Reviewer와 Wiki Writer가 볼 근거 상태를 safe count와 경계 copy로만 표시합니다. source open, review execution, wiki draft, audit write, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {detail.cards.map((card) => (
              <div
                key={card.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-reviewer-wiki-evidence-detail-card={card.id}
                data-office-reviewer-wiki-evidence-detail-card-tone={card.tone}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{card.id}</div>
                <div className="mt-1 font-semibold text-foreground">{card.label}</div>
                <div className="mt-2 leading-5">{card.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-reviewer-wiki-evidence-detail-boundary="true">
            evidence {detail.evidenceCount} · warnings {detail.warningCount} · blocked {detail.blockedWorkCount} · handoff steps {detail.handoffStepCount} · enabled controls {detail.enabledControls} · raw excluded {String(detail.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}



export function BoardEvidenceInspectorDrilldownPanel({ drilldown }: { drilldown: OfficeBoardEvidenceInspectorDrilldown }) {
  return (
    <Card
      data-office-board-evidence-inspector-drilldown="true"
      data-office-board-evidence-inspector-drilldown-enabled-controls={drilldown.enabledControls}
      data-office-board-evidence-inspector-drilldown-board-open-enabled={String(drilldown.boardOpenEnabled)}
      data-office-board-evidence-inspector-drilldown-source-open-enabled={String(drilldown.sourceOpenEnabled)}
      data-office-board-evidence-inspector-drilldown-inspector-write-enabled={String(drilldown.inspectorWriteEnabled)}
      data-office-board-evidence-inspector-drilldown-request-creation-enabled={String(drilldown.requestCreationEnabled)}
      data-office-board-evidence-inspector-drilldown-dispatch-enabled={String(drilldown.dispatchEnabled)}
      data-office-board-evidence-inspector-drilldown-audit-write-enabled={String(drilldown.auditWriteEnabled)}
      data-office-board-evidence-inspector-drilldown-nas-save-enabled={String(drilldown.nasSaveEnabled)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="h-4 w-4" /> Board evidence-to-inspector drill-down
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-sky-300/20 bg-sky-950/10 p-3">
            <div className="font-semibold text-sky-100">중앙 board → right inspector · read-only route</div>
            <div className="mt-1 leading-5">
              중앙 board/evidence aggregate에서 right inspector detail로 이어지는 길만 보여줍니다. board open, source open, inspector write, request creation, audit write, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {drilldown.cards.map((card) => (
              <div
                key={card.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-board-evidence-inspector-drilldown-card={card.id}
                data-office-board-evidence-inspector-drilldown-card-tone={card.tone}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{card.id}</div>
                <div className="mt-1 font-semibold text-foreground">{card.label}</div>
                <div className="mt-2 leading-5">{card.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-board-evidence-inspector-drilldown-boundary="true">
            work {drilldown.boardWorkCount} · blocked {drilldown.boardBlockedCount} · evidence {drilldown.evidenceCount} · warnings {drilldown.warningCount} · inspector cards {drilldown.inspectorCardCount} · enabled controls {drilldown.enabledControls} · raw excluded {String(drilldown.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BossOrchestratorRequestPostureDetailPanel({ detail }: { detail: OfficeBossOrchestratorRequestPostureDetail }) {
  return (
    <Card
      data-office-boss-orchestrator-request-posture-detail="true"
      data-office-boss-orchestrator-request-posture-detail-enabled-controls={detail.enabledControls}
      data-office-boss-orchestrator-request-posture-detail-input-enabled={String(detail.inputEnabled)}
      data-office-boss-orchestrator-request-posture-detail-request-creation-enabled={String(detail.requestCreationEnabled)}
      data-office-boss-orchestrator-request-posture-detail-orchestrator-required={String(detail.orchestratorRequired)}
      data-office-boss-orchestrator-request-posture-detail-work-assignment-enabled={String(detail.workAssignmentEnabled)}
      data-office-boss-orchestrator-request-posture-detail-dispatch-enabled={String(detail.dispatchEnabled)}
      data-office-boss-orchestrator-request-posture-detail-audit-write-enabled={String(detail.auditWriteEnabled)}
      data-office-boss-orchestrator-request-posture-detail-nas-save-enabled={String(detail.nasSaveEnabled)}
      data-office-boss-orchestrator-request-posture-detail-safe-projection-only={String(detail.safeProjectionOnly)}
      data-office-boss-orchestrator-request-posture-detail-raw-excluded={String(detail.rawExcluded)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" /> Boss/orchestrator request posture detail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-amber-300/20 bg-amber-950/10 p-3">
            <div className="font-semibold text-amber-100">사장 instruction → Orchestrator mediation · detail posture</div>
            <div className="mt-1 leading-5">
              자연어 지시가 만들어질 자리와 Orchestrator desk로 넘어가는 request envelope만 보여줍니다. 입력, request 생성, worker 배정, dispatch, audit write, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {detail.cards.map((card) => (
              <div
                key={card.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-boss-orchestrator-request-posture-detail-card={card.id}
                data-office-boss-orchestrator-request-posture-detail-card-tone={card.tone}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{card.id}</div>
                <div className="mt-1 font-semibold text-foreground">{card.label}</div>
                <div className="mt-2 leading-5">{card.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-boss-orchestrator-request-posture-detail-boundary="true">
            speaker {detail.speakerRole} · orchestrator {detail.orchestratorRole} · target {detail.targetFacilityId} · evidence {detail.evidenceCount} · blocked {detail.blockedWorkCount} · dialogue lines {detail.dialogueLineCount} · controls {detail.enabledControls} · raw excluded {String(detail.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OrchestratorRequestEnvelopeDetailPanel({ envelope }: { envelope: OfficeOrchestratorRequestEnvelopeDetail }) {
  return (
    <Card
      data-office-orchestrator-request-envelope-detail="true"
      data-office-orchestrator-request-envelope-detail-enabled-controls={envelope.enabledControls}
      data-office-orchestrator-request-envelope-detail-envelope-creation-enabled={String(envelope.envelopeCreationEnabled)}
      data-office-orchestrator-request-envelope-detail-kanban-write-enabled={String(envelope.kanbanWriteEnabled)}
      data-office-orchestrator-request-envelope-detail-work-assignment-enabled={String(envelope.workAssignmentEnabled)}
      data-office-orchestrator-request-envelope-detail-dispatch-enabled={String(envelope.dispatchEnabled)}
      data-office-orchestrator-request-envelope-detail-audit-write-enabled={String(envelope.auditWriteEnabled)}
      data-office-orchestrator-request-envelope-detail-nas-save-enabled={String(envelope.nasSaveEnabled)}
      data-office-orchestrator-request-envelope-detail-safe-projection-only={String(envelope.safeProjectionOnly)}
      data-office-orchestrator-request-envelope-detail-raw-excluded={String(envelope.rawExcluded)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" /> Orchestrator request envelope detail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-sky-300/20 bg-sky-950/10 p-3">
            <div className="font-semibold text-sky-100">Orchestrator envelope · disabled request preview</div>
            <div className="mt-1 leading-5">
              사장 instruction posture 다음 단계의 request envelope 구조만 표시합니다. Envelope 생성, Kanban write, worker 배정, dispatch, audit write, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {envelope.cards.map((card) => (
              <div
                key={card.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-orchestrator-request-envelope-detail-card={card.id}
                data-office-orchestrator-request-envelope-detail-card-tone={card.tone}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{card.id}</div>
                <div className="mt-1 font-semibold text-foreground">{card.label}</div>
                <div className="mt-2 leading-5">{card.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-orchestrator-request-envelope-detail-boundary="true">
            source {envelope.sourcePostureKind} · state {envelope.envelopeState} · target {envelope.targetFacilityId} · evidence {envelope.evidenceCount} · blocked {envelope.blockedWorkCount} · dialogue lines {envelope.dialogueLineCount} · controls {envelope.enabledControls} · raw excluded {String(envelope.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ApprovalRequestRouteDetailPanel({ route }: { route: OfficeApprovalRequestRouteDetail }) {
  return (
    <Card
      data-office-approval-request-route-detail="true"
      data-office-approval-request-route-detail-enabled-controls={route.enabledControls}
      data-office-approval-request-route-detail-intent-event-creation-enabled={String(route.intentEventCreationEnabled)}
      data-office-approval-request-route-detail-approval-request-enabled={String(route.approvalRequestEnabled)}
      data-office-approval-request-route-detail-kanban-write-enabled={String(route.kanbanWriteEnabled)}
      data-office-approval-request-route-detail-audit-write-enabled={String(route.auditWriteEnabled)}
      data-office-approval-request-route-detail-dispatch-enabled={String(route.dispatchEnabled)}
      data-office-approval-request-route-detail-nas-save-enabled={String(route.nasSaveEnabled)}
      data-office-approval-request-route-detail-safe-projection-only={String(route.safeProjectionOnly)}
      data-office-approval-request-route-detail-raw-excluded={String(route.rawExcluded)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" /> Approval request route detail
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-violet-300/20 bg-violet-950/10 p-3">
            <div className="font-semibold text-violet-100">Intent → Orchestrator plan → Approval request · read-only route</div>
            <div className="mt-1 leading-5">
              Master Spec event route를 safe projection으로만 보여줍니다. Intent event 생성, approval request 생성, Kanban write, audit write, dispatch, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {route.cards.map((card) => (
              <div
                key={card.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-approval-request-route-detail-card={card.id}
                data-office-approval-request-route-detail-card-tone={card.tone}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{card.id}</div>
                <div className="mt-1 font-semibold text-foreground">{card.label}</div>
                <div className="mt-2 leading-5">{card.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-approval-request-route-detail-boundary="true">
            source {route.sourceEnvelopeKind} · state {route.routeState} · evidence {route.evidenceCount} · blocked {route.blockedWorkCount} · dialogue lines {route.dialogueLineCount} · controls {route.enabledControls} · raw excluded {String(route.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventRequestContractProjectionPanel({ contract }: { contract: OfficeEventRequestContractProjection }) {
  return (
    <Card
      data-office-event-request-contract-projection="true"
      data-office-event-request-contract-projection-enabled-controls={contract.enabledControls}
      data-office-event-request-contract-projection-schema-write-enabled={String(contract.schemaWriteEnabled)}
      data-office-event-request-contract-projection-event-creation-enabled={String(contract.eventCreationEnabled)}
      data-office-event-request-contract-projection-event-persistence-enabled={String(contract.eventPersistenceEnabled)}
      data-office-event-request-contract-projection-runtime-dispatch-enabled={String(contract.runtimeDispatchEnabled)}
      data-office-event-request-contract-projection-audit-write-enabled={String(contract.auditWriteEnabled)}
      data-office-event-request-contract-projection-nas-save-enabled={String(contract.nasSaveEnabled)}
      data-office-event-request-contract-projection-safe-projection-only={String(contract.safeProjectionOnly)}
      data-office-event-request-contract-projection-raw-excluded={String(contract.rawExcluded)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" /> Event request contract projection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-fuchsia-300/20 bg-fuchsia-950/10 p-3">
            <div className="font-semibold text-fuchsia-100">Future event contract · projection only</div>
            <div className="mt-1 leading-5">
              Master Spec의 request event 이름과 경계를 DTO처럼 보이게만 합니다. Schema write, event 생성/저장, runtime dispatch, audit write, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {contract.cards.map((card) => (
              <div
                key={card.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-event-request-contract-projection-card={card.id}
                data-office-event-request-contract-projection-card-tone={card.tone}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{card.id}</div>
                <div className="mt-1 font-semibold text-foreground">{card.label}</div>
                <div className="mt-2 leading-5">{card.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-event-request-contract-projection-boundary="true">
            source {contract.sourceRouteKind} · state {contract.contractState} · evidence {contract.evidenceCount} · blocked {contract.blockedWorkCount} · dialogue lines {contract.dialogueLineCount} · controls {contract.enabledControls} · raw excluded {String(contract.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ApprovalDialogueRouteInspectorPanel({ inspector }: { inspector: OfficeApprovalDialogueRouteInspector }) {
  return (
    <Card
      data-office-approval-dialogue-route-inspector="true"
      data-office-approval-dialogue-route-inspector-enabled-controls={inspector.enabledControls}
      data-office-approval-dialogue-route-inspector-approve-enabled={String(inspector.approveEnabled)}
      data-office-approval-dialogue-route-inspector-reject-enabled={String(inspector.rejectEnabled)}
      data-office-approval-dialogue-route-inspector-hold-enabled={String(inspector.holdEnabled)}
      data-office-approval-dialogue-route-inspector-request-creation-enabled={String(inspector.requestCreationEnabled)}
      data-office-approval-dialogue-route-inspector-event-creation-enabled={String(inspector.eventCreationEnabled)}
      data-office-approval-dialogue-route-inspector-event-persistence-enabled={String(inspector.eventPersistenceEnabled)}
      data-office-approval-dialogue-route-inspector-audit-write-enabled={String(inspector.auditWriteEnabled)}
      data-office-approval-dialogue-route-inspector-dispatch-enabled={String(inspector.dispatchEnabled)}
      data-office-approval-dialogue-route-inspector-nas-save-enabled={String(inspector.nasSaveEnabled)}
      data-office-approval-dialogue-route-inspector-safe-projection-only={String(inspector.safeProjectionOnly)}
      data-office-approval-dialogue-route-inspector-raw-excluded={String(inspector.rawExcluded)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" /> Approval dialogue route inspector
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-rose-300/20 bg-rose-950/10 p-3">
            <div className="font-semibold text-rose-100">Dialogue → route → event contract · inspector only</div>
            <div className="mt-1 leading-5">
              승인 대화가 어떤 read-only route와 future event contract로 이어질지만 inspect합니다. Approve/reject/hold, request/event creation, event persistence, audit write, dispatch, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {inspector.cards.map((card) => (
              <div
                key={card.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-approval-dialogue-route-inspector-card={card.id}
                data-office-approval-dialogue-route-inspector-card-tone={card.tone}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{card.id}</div>
                <div className="mt-1 font-semibold text-foreground">{card.label}</div>
                <div className="mt-2 leading-5">{card.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-approval-dialogue-route-inspector-boundary="true">
            dialogue {inspector.dialogueLineCount} · route cards {inspector.routeCardCount} · event cards {inspector.contractCardCount} · evidence {inspector.evidenceCount} · blocked {inspector.blockedWorkCount} · controls {inspector.enabledControls} · raw excluded {String(inspector.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function EventTimelineProjectionPanel({ timeline }: { timeline: OfficeEventTimelineProjection }) {
  return (
    <Card
      data-office-event-timeline-projection="true"
      data-office-event-timeline-projection-enabled-controls={timeline.enabledControls}
      data-office-event-timeline-projection-runtime-event-write-enabled={String(timeline.runtimeEventWriteEnabled)}
      data-office-event-timeline-projection-intent-event-creation-enabled={String(timeline.intentEventCreationEnabled)}
      data-office-event-timeline-projection-visual-event-creation-enabled={String(timeline.visualEventCreationEnabled)}
      data-office-event-timeline-projection-event-persistence-enabled={String(timeline.eventPersistenceEnabled)}
      data-office-event-timeline-projection-timeline-append-enabled={String(timeline.timelineAppendEnabled)}
      data-office-event-timeline-projection-audit-write-enabled={String(timeline.auditWriteEnabled)}
      data-office-event-timeline-projection-dispatch-enabled={String(timeline.dispatchEnabled)}
      data-office-event-timeline-projection-nas-save-enabled={String(timeline.nasSaveEnabled)}
      data-office-event-timeline-projection-safe-projection-only={String(timeline.safeProjectionOnly)}
      data-office-event-timeline-projection-raw-excluded={String(timeline.rawExcluded)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" /> Event timeline projection
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-cyan-300/20 bg-cyan-950/10 p-3">
            <div className="font-semibold text-cyan-100">Runtime → intent → visual projection · no event writes</div>
            <div className="mt-1 leading-5">
              Master Spec의 event 흐름을 안전한 타임라인처럼 보여주지만 runtime event write, intent/visual event creation, persistence, audit append, dispatch, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {timeline.events.map((event) => (
              <div
                key={event.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-event-timeline-projection-event={event.id}
                data-office-event-timeline-projection-event-lane={event.lane}
                data-office-event-timeline-projection-event-tone={event.tone}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{event.id}</div>
                <div className="mt-1 font-semibold text-foreground">{event.label}</div>
                <div className="mt-2 leading-5">{event.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-event-timeline-projection-boundary="true">
            state {timeline.timelineState} · source {timeline.sourceContractKind} / {timeline.sourceInspectorKind} · events {timeline.eventCount} · evidence {timeline.evidenceCount} · blocked {timeline.blockedWorkCount} · dialogue lines {timeline.dialogueLineCount} · controls {timeline.enabledControls} · raw excluded {String(timeline.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function TimelineWorkerHandoffDrilldownPanel({ drilldown }: { drilldown: OfficeTimelineWorkerHandoffDrilldown }) {
  return (
    <Card
      data-office-timeline-worker-handoff-drilldown="true"
      data-office-timeline-worker-handoff-drilldown-enabled-controls={drilldown.enabledControls}
      data-office-timeline-worker-handoff-drilldown-write-enabled={String(drilldown.drilldownWriteEnabled)}
      data-office-timeline-worker-handoff-drilldown-work-assignment-enabled={String(drilldown.workAssignmentEnabled)}
      data-office-timeline-worker-handoff-drilldown-request-creation-enabled={String(drilldown.requestCreationEnabled)}
      data-office-timeline-worker-handoff-drilldown-dispatch-enabled={String(drilldown.dispatchEnabled)}
      data-office-timeline-worker-handoff-drilldown-audit-write-enabled={String(drilldown.auditWriteEnabled)}
      data-office-timeline-worker-handoff-drilldown-nas-save-enabled={String(drilldown.nasSaveEnabled)}
      data-office-timeline-worker-handoff-drilldown-safe-projection-only={String(drilldown.safeProjectionOnly)}
      data-office-timeline-worker-handoff-drilldown-raw-excluded={String(drilldown.rawExcluded)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" /> Timeline/worker handoff drill-down
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-sky-300/20 bg-sky-950/10 p-3">
            <div className="font-semibold text-sky-100">Projected worker sequence · no assignment</div>
            <div className="mt-1 leading-5">
              Event timeline 다음에 어떤 worker lane이 등장하는지만 safe aggregate로 drill-down합니다. Work assignment, request creation, dispatch, audit write, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {drilldown.handoffSteps.map((step) => (
              <div
                key={step.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-timeline-worker-handoff-drilldown-step={step.id}
                data-office-timeline-worker-handoff-drilldown-step-lane={step.lane}
                data-office-timeline-worker-handoff-drilldown-step-tone={step.tone}
                data-office-timeline-worker-handoff-drilldown-step-assignment-enabled={String(step.assignmentEnabled)}
                data-office-timeline-worker-handoff-drilldown-step-dispatch-enabled={String(step.dispatchEnabled)}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{step.sourceEventId}</div>
                <div className="mt-1 font-semibold text-foreground">{step.label}</div>
                <div className="mt-1 text-midground/60">{step.id} · {step.facilityId}</div>
                <div className="mt-2 leading-5">{step.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-timeline-worker-handoff-drilldown-boundary="true">
            state {drilldown.handoffState} · source {drilldown.sourceTimelineKind} / {drilldown.sourceWorkerVisibilityKind} / {drilldown.sourceHandoffKind} · timeline events {drilldown.timelineEventCount} · visible workers {drilldown.visibleWorkerCount} · evidence {drilldown.evidenceCount} · blocked {drilldown.blockedWorkCount} · warnings {drilldown.warningCount} · controls {drilldown.enabledControls} · raw excluded {String(drilldown.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export function ApprovalRequestDetailDeepeningPanel({ detail }: { detail: OfficeApprovalRequestDetailDeepening }) {
  return (
    <Card
      data-office-approval-request-detail-deepening="true"
      data-office-approval-request-detail-deepening-enabled-controls={detail.enabledControls}
      data-office-approval-request-detail-deepening-approve-enabled={String(detail.approveEnabled)}
      data-office-approval-request-detail-deepening-reject-enabled={String(detail.rejectEnabled)}
      data-office-approval-request-detail-deepening-hold-enabled={String(detail.holdEnabled)}
      data-office-approval-request-detail-deepening-request-creation-enabled={String(detail.requestCreationEnabled)}
      data-office-approval-request-detail-deepening-event-creation-enabled={String(detail.eventCreationEnabled)}
      data-office-approval-request-detail-deepening-event-persistence-enabled={String(detail.eventPersistenceEnabled)}
      data-office-approval-request-detail-deepening-work-assignment-enabled={String(detail.workAssignmentEnabled)}
      data-office-approval-request-detail-deepening-dispatch-enabled={String(detail.dispatchEnabled)}
      data-office-approval-request-detail-deepening-audit-write-enabled={String(detail.auditWriteEnabled)}
      data-office-approval-request-detail-deepening-nas-save-enabled={String(detail.nasSaveEnabled)}
      data-office-approval-request-detail-deepening-safe-projection-only={String(detail.safeProjectionOnly)}
      data-office-approval-request-detail-deepening-raw-excluded={String(detail.rawExcluded)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" /> Approval-request detail deepening
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-amber-300/20 bg-amber-950/10 p-3">
            <div className="font-semibold text-amber-100">Approval request detail · projection only</div>
            <div className="mt-1 leading-5">
              Approval request를 route, event timeline, worker handoff 기준으로 한 단계 더 풀어 보여줍니다. 승인/보류, request/event 생성, worker 배정, dispatch, audit write, NAS save는 모두 비활성입니다.
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-4">
            {detail.sections.map((section) => (
              <div
                key={section.id}
                className="border border-current/15 bg-black/15 p-3"
                data-office-approval-request-detail-deepening-section={section.id}
                data-office-approval-request-detail-deepening-section-tone={section.tone}
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{section.id}</div>
                <div className="mt-1 font-semibold text-foreground">{section.label}</div>
                <div className="mt-2 leading-5">{section.summary}</div>
              </div>
            ))}
          </div>
          <div className="border border-dashed border-current/15 p-3 text-midground/60" data-office-approval-request-detail-deepening-boundary="true">
            state {detail.requestState} · source {detail.sourceRouteKind} / {detail.sourceTimelineKind} / {detail.sourceDrilldownKind} · route cards {detail.routeCardCount} · timeline events {detail.timelineEventCount} · handoff steps {detail.handoffStepCount} · evidence {detail.evidenceCount} · blocked {detail.blockedWorkCount} · warnings {detail.warningCount} · controls {detail.enabledControls} · raw excluded {String(detail.rawExcluded)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OfficeDeskRpgBossCommandConsolePanel({ projection }: { projection: OfficeDeskRpgProjectionModel }) {
  const bossActor = projection.actors.find((actor) => actor.role === "user_boss");
  const orchestratorActor = projection.actors.find((actor) => actor.role === "orchestrator");
  return (
    <Card
      data-office-desk-rpg-boss-console="true"
      data-office-desk-rpg-boss-console-safe-projection-only={String(projection.safeProjectionOnly)}
      data-office-desk-rpg-boss-console-enabled-controls={projection.enabledControls}
      data-office-desk-rpg-boss-console-request-creation-enabled="false"
      data-office-desk-rpg-boss-console-orchestrator-required="true"
      data-office-desk-rpg-boss-console-nas-save-enabled="false"
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="h-4 w-4" /> Boss command console
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-amber-300/20 bg-amber-950/10 p-3">
            <div className="font-semibold text-amber-100">사장 캐릭터 · Orchestrator-level instruction posture</div>
            <div className="mt-1 leading-5">
              자연어 지시는 이 자리에서 바로 실행되지 않고 Orchestrator에게 전달될 request posture로만 표시됩니다. 현재 slice는 입력 생성, 요청 저장, 작업 배정, NAS 저장을 모두 비활성으로 둡니다.
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="border border-current/15 bg-black/15 p-3" data-office-desk-rpg-boss-console-avatar="true">
              <div className="font-semibold text-foreground">{bossActor?.label ?? "User Avatar"}</div>
              <div className="mt-1 text-midground/60">role: user_boss · facility: {bossActor?.facilityId ?? "boss_desk"}</div>
            </div>
            <div className="border border-current/15 bg-black/15 p-3" data-office-desk-rpg-boss-console-orchestrator="true">
              <div className="font-semibold text-foreground">{orchestratorActor?.label ?? "Orchestrator"}</div>
              <div className="mt-1 text-midground/60">중복 작업과 권한 우회를 막는 중앙 mediation 경로</div>
            </div>
            <div className="border border-current/15 bg-black/15 p-3" data-office-desk-rpg-boss-console-boundary="true">
              <div className="font-semibold text-foreground">approval boundary</div>
              <div className="mt-1 text-midground/60">request creation false · NAS save false · controls 0</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OfficeDeskRpgBoardEvidencePanel({ projection }: { projection: OfficeDeskRpgProjectionModel }) {
  return (
    <Card
      data-office-desk-rpg-board="true"
      data-office-desk-rpg-board-tab="evidence"
      data-office-desk-rpg-board-safe-projection-only={String(projection.safeProjectionOnly)}
      data-office-desk-rpg-board-enabled-controls={projection.enabledControls}
      data-office-desk-rpg-board-raw-excluded={String(projection.rawExcluded)}
      data-office-desk-rpg-board-work-count={projection.boardState.workItemCount}
      data-office-desk-rpg-board-blocked-count={projection.boardState.blockedCount}
      data-office-desk-rpg-board-source-count={projection.evidenceState.sourceCount}
      data-office-desk-rpg-board-warning-count={projection.evidenceState.warningCount}
      data-office-desk-rpg-board-raw-bodies-visible={String(projection.evidenceState.rawBodiesVisible)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="h-4 w-4" /> Central board evidence tab
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-emerald-300/20 bg-emerald-950/10 p-3">
            <div className="font-semibold text-emerald-100">Desk RPG Board Evidence Tab 1 · aggregate-only</div>
            <div className="mt-1 leading-5">
              중앙 보드는 safe DTO count/posture만 묶어 보여줍니다. 작업 본문, 프롬프트, transcript, 경로, token, provider 세부값은 표시하지 않습니다.
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border border-current/15 bg-black/15 p-3" data-office-desk-rpg-board-work="true">
              <div className="font-semibold text-foreground">{projection.boardState.label}</div>
              <div className="mt-1">업무 {projection.boardState.workItemCount} · blocked {projection.boardState.blockedCount}</div>
              <div className="mt-1 text-midground/60">{projection.boardState.safeSummary}</div>
            </div>
            <div className="border border-current/15 bg-black/15 p-3" data-office-desk-rpg-board-evidence="true">
              <div className="font-semibold text-foreground">{projection.evidenceState.label}</div>
              <div className="mt-1">sources {projection.evidenceState.sourceCount} · warnings {projection.evidenceState.warningCount}</div>
              <div className="mt-1 text-midground/60">raw bodies visible: {String(projection.evidenceState.rawBodiesVisible)}</div>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3" data-office-desk-rpg-board-boundary="true">
            <div className="border border-current/15 bg-black/15 p-2">enabled controls: {projection.enabledControls}</div>
            <div className="border border-current/15 bg-black/15 p-2">safe projection: {projection.safeProjectionOnly ? "true" : "false"}</div>
            <div className="border border-current/15 bg-black/15 p-2">raw excluded: {projection.rawExcluded ? "true" : "false"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function OfficeDeskRpgInspectorPanel({ projection }: { projection: OfficeDeskRpgProjectionModel }) {
  const rightInspector = projection.facilities.find((facility) => facility.id === "right_inspector");
  return (
    <Card
      data-office-desk-rpg-inspector="true"
      data-office-desk-rpg-inspector-safe-projection-only={String(projection.safeProjectionOnly)}
      data-office-desk-rpg-inspector-enabled-controls={projection.enabledControls}
      data-office-desk-rpg-inspector-raw-excluded={String(projection.rawExcluded)}
      data-office-desk-rpg-inspector-suppressed-search-worker={projection.suppressedCounts.search_worker}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Eye className="h-4 w-4" /> Right inspector posture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-xs text-midground/75">
          <div className="border border-emerald-300/20 bg-emerald-950/10 p-3" data-office-desk-rpg-inspector-targets="true">
            <div className="font-semibold text-emerald-100">Desk RPG inspector migration · aggregate-only</div>
            <div className="mt-1 leading-5">선택 세부 정보는 safe DTO target/count/posture만 사용합니다. 원문 작업명, 프롬프트, 경로, 토큰, provider 세부값은 제외됩니다.</div>
            <div className="mt-2 grid max-h-48 gap-1 overflow-auto">
              {projection.inspectorTargets.map((target) => (
                <div
                  key={target.id}
                  className="grid grid-cols-[7rem_1fr] gap-2 border border-current/10 bg-black/15 px-2 py-1"
                  data-office-desk-rpg-inspector-target={target.id}
                  data-office-desk-rpg-inspector-target-type={target.targetType}
                >
                  <span className="text-midground/50">{target.targetType}</span>
                  <span className="break-words text-midground/85">{target.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="border border-current/15 bg-black/15 p-3" data-office-desk-rpg-inspector-board="true">
              <div className="font-semibold text-foreground">{projection.boardState.label}</div>
              <div className="mt-1">업무 {projection.boardState.workItemCount} · blocked {projection.boardState.blockedCount}</div>
              <div className="mt-1 text-midground/60">{projection.boardState.safeSummary}</div>
            </div>
            <div className="border border-current/15 bg-black/15 p-3" data-office-desk-rpg-inspector-evidence="true">
              <div className="font-semibold text-foreground">{projection.evidenceState.label}</div>
              <div className="mt-1">sources {projection.evidenceState.sourceCount} · warnings {projection.evidenceState.warningCount}</div>
              <div className="mt-1 text-midground/60">raw bodies visible: {String(projection.evidenceState.rawBodiesVisible)}</div>
            </div>
            <div className="border border-current/15 bg-black/15 p-3" data-office-desk-rpg-inspector-vault="true" data-office-desk-rpg-inspector-vault-write-enabled={String(projection.vaultState.writeEnabled)}>
              <div className="font-semibold text-foreground">{projection.vaultState.label}</div>
              <div className="mt-1">승인 전 NAS 저장 차단</div>
              <div className="mt-1 text-midground/60">posture: {projection.vaultState.posture}</div>
            </div>
            <div className="border border-current/15 bg-black/15 p-3" data-office-desk-rpg-inspector-ops="true" data-office-desk-rpg-inspector-service-controls-enabled={String(projection.opsState.serviceControlsEnabled)}>
              <div className="font-semibold text-foreground">{projection.opsState.label}</div>
              <div className="mt-1">service controls disabled</div>
              <div className="mt-1 text-midground/60">right inspector: {rightInspector?.posture ?? "watching"}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
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
  const [safeEvents, setSafeEvents] = useState<OfficeSafeEventsResponse | null>(null);
  const [safeEventsStatus, setSafeEventsStatus] = useState<"idle" | "loading" | "loaded" | "unavailable">("idle");
  const [safeMotionTick, setSafeMotionTick] = useState(0);
  const [safeMotionFailures, setSafeMotionFailures] = useState(0);
  const [focus, setFocus] = useState<FocusOption>("overview");
  const [selection, setSelection] = useState<InspectorSelection | null>(null);
  const [selectedRpgEntityId, setSelectedRpgEntityId] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
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

  const loadSafeEvents = useCallback(async () => {
    try {
      const next = await api.getOfficeEvents();
      setSafeEvents(next);
      setSafeEventsStatus("loaded");
      setSafeMotionTick((current) => current + 1);
      setSafeMotionFailures(0);
      return true;
    } catch {
      setSafeEvents(null);
      setSafeEventsStatus("unavailable");
      setSafeMotionFailures((current) => current + 1);
      return false;
    }
  }, []);

  const load = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const next = await api.getOfficeState();
      applyNextState(next);
      void loadSafeEvents();
      return true;
    } catch (err) {
      setError(String(err));
      return false;
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [applyNextState, loadSafeEvents]);

  useEffect(() => {
    let cancelled = false;
    api
      .getOfficeEvents()
      .then((next) => {
        if (!cancelled) {
          setSafeEvents(next);
          setSafeEventsStatus("loaded");
          setSafeMotionTick((current) => current + 1);
          setSafeMotionFailures(0);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setSafeEvents(null);
          setSafeEventsStatus("unavailable");
          setSafeMotionFailures((current) => current + 1);
        }
      });
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
    if (!tabVisible) return undefined;
    const intervalId = window.setInterval(() => {
      void loadSafeEvents();
    }, 5000);
    return () => window.clearInterval(intervalId);
  }, [loadSafeEvents, tabVisible]);

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
  const rpgScene = useMemo(() => buildOfficeRpgScene(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const unifiedWorkbenchView = useMemo(() => buildOfficeUnifiedWorkbenchView(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const approvalRequestView = useMemo(() => buildOfficeApprovalRequestView(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const approvalAuditTimeline = useMemo(() => buildOfficeApprovalAuditTimeline(approvalRequestView), [approvalRequestView]);
  const approvalExecutionGate = useMemo(() => buildOfficeApprovalExecutionGate(approvalAuditTimeline), [approvalAuditTimeline]);
  const authorityAdapterContract = useMemo(() => buildOfficeAuthorityAdapterContract(approvalExecutionGate), [approvalExecutionGate]);
  const orchestratorMediationQueue = useMemo(() => buildOfficeOrchestratorMediationQueue(authorityAdapterContract), [authorityAdapterContract]);
  const workerIntentRouting = useMemo(() => buildOfficeWorkerIntentRouting(orchestratorMediationQueue), [orchestratorMediationQueue]);
  const workerFacilityReadiness = useMemo(() => buildOfficeWorkerFacilityReadiness(workerIntentRouting), [workerIntentRouting]);
  const workerAssignmentCandidateGate = useMemo(() => buildOfficeWorkerAssignmentCandidateGate(workerFacilityReadiness), [workerFacilityReadiness]);
  const workerRequestDraftPreview = useMemo(() => buildOfficeWorkerRequestDraftPreview(workerAssignmentCandidateGate), [workerAssignmentCandidateGate]);
  const workerHumanConfirmationEnvelope = useMemo(() => buildOfficeWorkerHumanConfirmationEnvelope(workerRequestDraftPreview), [workerRequestDraftPreview]);
  const workerAuthorityHandoffEnvelope = useMemo(() => buildOfficeWorkerAuthorityHandoffEnvelope(workerHumanConfirmationEnvelope), [workerHumanConfirmationEnvelope]);
  const workerDispatchDryRunEnvelope = useMemo(() => buildOfficeWorkerDispatchDryRunEnvelope(workerAuthorityHandoffEnvelope), [workerAuthorityHandoffEnvelope]);
  const workerAuditPreviewEnvelope = useMemo(() => buildOfficeWorkerAuditPreviewEnvelope(workerDispatchDryRunEnvelope), [workerDispatchDryRunEnvelope]);
  const workerRollbackPreviewEnvelope = useMemo(() => buildOfficeWorkerRollbackPreviewEnvelope(workerAuditPreviewEnvelope), [workerAuditPreviewEnvelope]);
  const workerFinalGateChecklist = useMemo(() => buildOfficeWorkerFinalGateChecklist(workerRollbackPreviewEnvelope), [workerRollbackPreviewEnvelope]);
  const controlledMutationProposalContract = useMemo(() => buildOfficeControlledMutationProposalContract(workerFinalGateChecklist), [workerFinalGateChecklist]);
  const controlledMutationDryRunPlan = useMemo(() => buildOfficeControlledMutationDryRunPlan(controlledMutationProposalContract), [controlledMutationProposalContract]);
  const controlledMutationAuditSinkPlan = useMemo(() => buildOfficeControlledMutationAuditSinkPlan(controlledMutationDryRunPlan), [controlledMutationDryRunPlan]);
  const controlledMutationRollbackVerificationPlan = useMemo(() => buildOfficeControlledMutationRollbackVerificationPlan(controlledMutationAuditSinkPlan), [controlledMutationAuditSinkPlan]);
  const controlledMutationHumanApprovalPlan = useMemo(() => buildOfficeControlledMutationHumanApprovalPlan(controlledMutationRollbackVerificationPlan), [controlledMutationRollbackVerificationPlan]);
  const controlledMutationAuthoritySummary = useMemo(() => buildOfficeControlledMutationAuthoritySummary(controlledMutationHumanApprovalPlan), [controlledMutationHumanApprovalPlan]);
  const controlledMutationExecutionReadinessSummary = useMemo(() => buildOfficeControlledMutationExecutionReadinessSummary(controlledMutationAuthoritySummary), [controlledMutationAuthoritySummary]);
  const deskRpgProjection = useMemo(() => buildOfficeDeskRpgProjectionModel(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const deskRpgWorkerRoleVisibility = useMemo(() => buildOfficeDeskRpgWorkerRoleVisibility(deskRpgProjection), [deskRpgProjection]);
  const disabledApprovalDialoguePosture = useMemo(() => buildOfficeDisabledApprovalDialoguePosture(deskRpgProjection), [deskRpgProjection]);
  const reviewerWikiHandoffPosture = useMemo(() => buildOfficeReviewerWikiHandoffPosture(deskRpgProjection), [deskRpgProjection]);
  const approvalDialogueInspectorDetail = useMemo(
    () => buildOfficeApprovalDialogueInspectorDetail(disabledApprovalDialoguePosture, reviewerWikiHandoffPosture),
    [disabledApprovalDialoguePosture, reviewerWikiHandoffPosture],
  );
  const reviewerWikiEvidenceDetailPosture = useMemo(
    () => buildOfficeReviewerWikiEvidenceDetailPosture(deskRpgProjection, reviewerWikiHandoffPosture),
    [deskRpgProjection, reviewerWikiHandoffPosture],
  );
  const boardEvidenceInspectorDrilldown = useMemo(
    () => buildOfficeBoardEvidenceInspectorDrilldown(deskRpgProjection, reviewerWikiEvidenceDetailPosture),
    [deskRpgProjection, reviewerWikiEvidenceDetailPosture],
  );
  const bossOrchestratorRequestPostureDetail = useMemo(
    () => buildOfficeBossOrchestratorRequestPostureDetail(deskRpgProjection, disabledApprovalDialoguePosture),
    [deskRpgProjection, disabledApprovalDialoguePosture],
  );
  const orchestratorRequestEnvelopeDetail = useMemo(
    () => buildOfficeOrchestratorRequestEnvelopeDetail(deskRpgProjection, bossOrchestratorRequestPostureDetail),
    [deskRpgProjection, bossOrchestratorRequestPostureDetail],
  );
  const approvalRequestRouteDetail = useMemo(
    () => buildOfficeApprovalRequestRouteDetail(orchestratorRequestEnvelopeDetail, disabledApprovalDialoguePosture),
    [orchestratorRequestEnvelopeDetail, disabledApprovalDialoguePosture],
  );
  const eventRequestContractProjection = useMemo(
    () => buildOfficeEventRequestContractProjection(approvalRequestRouteDetail),
    [approvalRequestRouteDetail],
  );
  const approvalDialogueRouteInspector = useMemo(
    () => buildOfficeApprovalDialogueRouteInspector(disabledApprovalDialoguePosture, approvalRequestRouteDetail, eventRequestContractProjection),
    [disabledApprovalDialoguePosture, approvalRequestRouteDetail, eventRequestContractProjection],
  );
  const eventTimelineProjection = useMemo(
    () => buildOfficeEventTimelineProjection(eventRequestContractProjection, approvalDialogueRouteInspector),
    [eventRequestContractProjection, approvalDialogueRouteInspector],
  );
  const timelineWorkerHandoffDrilldown = useMemo(
    () => buildOfficeTimelineWorkerHandoffDrilldown(eventTimelineProjection, deskRpgWorkerRoleVisibility, reviewerWikiHandoffPosture),
    [eventTimelineProjection, deskRpgWorkerRoleVisibility, reviewerWikiHandoffPosture],
  );
  const approvalRequestDetailDeepening = useMemo(
    () => buildOfficeApprovalRequestDetailDeepening(approvalRequestRouteDetail, eventTimelineProjection, timelineWorkerHandoffDrilldown),
    [approvalRequestRouteDetail, eventTimelineProjection, timelineWorkerHandoffDrilldown],
  );
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
  const sourceHealthRail = useMemo(() => buildOfficeSourceHealthRail(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const sourceHealthCompactDiagnostics = useMemo(() => buildOfficeSourceHealthCompactDiagnostics(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const projectionCacheSummary = useMemo(() => buildOfficeProjectionCacheSummary(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const projectionOrchestration = useMemo(() => buildOfficeProjectionOrchestration(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const mutationControlReadiness = useMemo(() => buildOfficeMutationControlReadiness(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const selectedCharacter = useMemo(() => officeCharacters.find((character) => character.id === selectedCharacterId) ?? null, [officeCharacters, selectedCharacterId]);
  const selectedCharacterFocus = useMemo(() => buildOfficeSelectedCharacterFocus(selectedCharacter, latestDelta), [latestDelta, selectedCharacter]);
  const layoutPlan = useMemo(
    () => buildOfficeFirstLayoutPlan({
      visibleCharacterCount: densityPlan.visibleCharacters.length,
      diagnosticPanelCount: 11,
      hasSelectedCharacter: selectedCharacter !== null,
    }),
    [densityPlan.visibleCharacters.length, selectedCharacter],
  );
  const localSafeEventSubstrate = useMemo(
    () => buildOfficeSafeEventSubstrate(latestDelta, { visibleCharacterCount: densityPlan.visibleCharacters.length, hasEventStream: false }),
    [densityPlan.visibleCharacters.length, latestDelta],
  );
  const safeStreamPosture = useMemo(
    () => buildOfficeSafeStreamPosture(
      {
        status: safeEventsStatus,
        events: safeEvents?.events as unknown as Array<Record<string, unknown>> | undefined,
        generated_at: safeEvents?.generated_at,
      },
      localSafeEventSubstrate,
    ),
    [localSafeEventSubstrate, safeEvents, safeEventsStatus],
  );
  const safeMotionHeartbeat = useMemo(
    () => buildOfficeSafeMotionHeartbeat(safeStreamPosture, {
      pollStatus: safeEventsStatus === "loaded" ? "active" : safeEventsStatus,
      tick: safeMotionTick,
      failureCount: safeMotionFailures,
      reducedMotion: prefersReducedMotion,
    }),
    [prefersReducedMotion, safeEventsStatus, safeMotionFailures, safeMotionTick, safeStreamPosture],
  );
  const trackingTruth = useMemo(
    () => buildOfficeTrackingTruthPlan(latestDelta, { hasEventStream: safeStreamPosture.mode === "backend-safe-stream", visibleCharacterCount: densityPlan.visibleCharacters.length }),
    [densityPlan.visibleCharacters.length, latestDelta, safeStreamPosture.mode],
  );
  const usabilitySummary = useMemo(
    () => (state ? buildOfficeUsabilitySummary(state, officeCharacters, { reducedMotion: prefersReducedMotion, viewportWidth }) : buildOfficeUsabilitySummary({ ...EMPTY_OFFICE_STATE }, [], { reducedMotion: prefersReducedMotion, viewportWidth })),
    [officeCharacters, prefersReducedMotion, state, viewportWidth],
  );
  const emptyHints = useMemo(() => buildOfficeEmptyStateHints(), []);
  const emptySourceCopy = useMemo(() => buildOfficeEmptySourceCopyPlan(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const paperclipWorkbench = useMemo(() => buildOfficePaperclipWorkbench(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const paperclipManifestVisibility = useMemo(() => buildOfficePaperclipManifestVisibility(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const kanbanProjection = useMemo(() => buildOfficeKanbanProjection(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const sectionPlan = useMemo(() => buildOfficePageSectionPlan(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
  const sectionById = useMemo(() => Object.fromEntries(sectionPlan.map((section) => [section.id, section])) as Record<OfficePageSectionPlan["id"], OfficePageSectionPlan>, [sectionPlan]);
  const paperclipMapProjection = useMemo(() => buildOfficePaperclipMapProjection(paperclipWorkbench.sources), [paperclipWorkbench]);
  const liveOperationsLayer = useMemo(() => buildOfficeLiveOperationsLayer(state ?? { ...EMPTY_OFFICE_STATE }), [state]);
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
  const safeScanIndex = useMemo(
    () => buildOfficeSafeScanIndex(state ?? { ...EMPTY_OFFICE_STATE }, latestDelta, {
      liveTracking,
      isVisible: tabVisible,
      consecutiveFailures: liveFailureCount,
      hasRecentChanges: latestDelta.hasChanges,
    }),
    [latestDelta, liveFailureCount, liveTracking, state, tabVisible],
  );
  const safeHudReadability = useMemo(
    () => buildOfficeSafeHudReadabilityPlan({
      viewportWidth,
      prefersReducedMotion,
      safePanelCount: safeStatusSnapshot.items.length + safeScanIndex.items.length,
      liveTracking,
    }),
    [liveTracking, prefersReducedMotion, safeScanIndex.items.length, safeStatusSnapshot.items.length, viewportWidth],
  );
  const safeHudHierarchy = useMemo(
    () => buildOfficeSafeHudHierarchy({
      statusTone: safeStatusSnapshot.tone,
      scanTone: safeScanIndex.tone,
      readabilityTone: safeHudReadability.tone,
      statusItemCount: safeStatusSnapshot.items.length,
      scanItemCount: safeScanIndex.items.length,
      readabilityItemCount: safeHudReadability.items.length,
    }),
    [
      safeHudReadability.items.length,
      safeHudReadability.tone,
      safeScanIndex.items.length,
      safeScanIndex.tone,
      safeStatusSnapshot.items.length,
      safeStatusSnapshot.tone,
    ],
  );

  const sourceCounts = sourceHealth.counts;
  const timeDisplayPolicy = buildOfficeTimeDisplayPolicy();

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
      <section
        className="border border-emerald-300/25 bg-gradient-to-br from-emerald-950/25 via-black/30 to-sky-950/20 p-5"
        data-office-unified-workbench="true"
        data-office-unified-approval-status={unifiedWorkbenchView.safetyPosture.approvalModel.status}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> 읽기 전용 · AI Office 통합 운영실
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-wide text-foreground md:text-4xl">{unifiedWorkbenchView.title}</h1>
            <p className="mt-3 text-sm leading-6 text-midground/80">{unifiedWorkbenchView.subtitle}</p>
            <div className="mt-3 text-xs text-midground/55">
              표시 순서: {unifiedWorkbenchView.renderOrder.join(" → ")} · 승인 모델 {unifiedWorkbenchView.safetyPosture.approvalModel.status} · 실행 컨트롤 {unifiedWorkbenchView.safetyPosture.approvalModel.enabledControls}개
            </div>
          </div>
          <div className="grid min-w-72 gap-2 text-xs text-midground/70 sm:grid-cols-2 xl:grid-cols-1">
            <div className="border border-current/15 bg-black/20 p-3">생성 시각: {fmt(unifiedWorkbenchView.generatedAt)}</div>
            <div className="border border-current/15 bg-black/20 p-3">raw 제외: {unifiedWorkbenchView.safetyPosture.rawExcluded ? "true" : "false"}</div>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4" data-office-unified-layers="true">
          {unifiedWorkbenchView.layers.map((layer) => (
            <div
              key={layer.id}
              className="border border-current/15 bg-black/25 p-3"
              data-office-unified-layer={layer.id}
              data-office-unified-layer-tone={layer.tone}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{layer.source}</div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-foreground">{layer.label}</div>
                <div className="font-mono text-xs tabular-nums text-emerald-200">{layer.count}</div>
              </div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{layer.summary}</div>
            </div>
          ))}
        </div>
      </section>

      <OfficeDeskRpgRoomShell projection={deskRpgProjection} />

      <OfficeDeskRpgBossCommandConsolePanel projection={deskRpgProjection} />

      <OfficeDeskRpgWorkerRoleVisibilityPanel visibility={deskRpgWorkerRoleVisibility} />

      <DisabledApprovalDialoguePosturePanel dialogue={disabledApprovalDialoguePosture} />

      <ReviewerWikiHandoffPosturePanel handoff={reviewerWikiHandoffPosture} />

      <ApprovalDialogueInspectorDetailPanel inspector={approvalDialogueInspectorDetail} />

      <ReviewerWikiEvidenceDetailPosturePanel detail={reviewerWikiEvidenceDetailPosture} />

      <BoardEvidenceInspectorDrilldownPanel drilldown={boardEvidenceInspectorDrilldown} />

      <BossOrchestratorRequestPostureDetailPanel detail={bossOrchestratorRequestPostureDetail} />

      <OrchestratorRequestEnvelopeDetailPanel envelope={orchestratorRequestEnvelopeDetail} />

      <ApprovalRequestRouteDetailPanel route={approvalRequestRouteDetail} />

      <EventRequestContractProjectionPanel contract={eventRequestContractProjection} />

      <ApprovalDialogueRouteInspectorPanel inspector={approvalDialogueRouteInspector} />

      <EventTimelineProjectionPanel timeline={eventTimelineProjection} />

      <TimelineWorkerHandoffDrilldownPanel drilldown={timelineWorkerHandoffDrilldown} />

      <ApprovalRequestDetailDeepeningPanel detail={approvalRequestDetailDeepening} />

      <OfficeDeskRpgBoardEvidencePanel projection={deskRpgProjection} />

      <section
        className="border border-violet-300/20 bg-violet-950/10 p-4"
        data-office-approval-request-view="true"
        data-office-approval-authority={approvalRequestView.authorityLevel}
        data-office-approval-enabled-controls={approvalRequestView.enabledControls}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/70">{approvalRequestView.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{approvalRequestView.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{approvalRequestView.auditReadiness.safeSummary}</p>
          </div>
          <div className="grid gap-2 text-xs text-midground/70 sm:grid-cols-3 lg:min-w-[24rem]">
            <div className="border border-current/15 bg-black/20 p-2">authority: {approvalRequestView.authorityLevel}</div>
            <div className="border border-current/15 bg-black/20 p-2">dry-run: {approvalRequestView.dryRunEvidence.result}</div>
            <div className="border border-current/15 bg-black/20 p-2">decision: {approvalRequestView.humanDecision.status}</div>
          </div>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-3" data-office-approval-request-list="true">
          {approvalRequestView.requests.map((request) => (
            <div key={request.requestRef} className="border border-current/15 bg-black/20 p-3" data-office-approval-request={request.actionKind}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{request.actionKind}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{request.targetKind}</div>
              <div className="mt-1 font-mono text-xs text-violet-100">{request.targetRef}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{request.reasonSummary}</div>
              <div className="mt-2 text-[10px] text-midground/55">evidence {request.evidenceCount} · orchestrator {request.orchestratorRequired ? "required" : "n/a"} · enabled controls 0</div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-fuchsia-300/20 bg-fuchsia-950/10 p-4"
        data-office-approval-audit-timeline="true"
        data-office-approval-audit-writes={String(approvalAuditTimeline.writesAuditEvents)}
        data-office-approval-audit-enabled-controls={approvalAuditTimeline.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-200/70">{approvalAuditTimeline.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{approvalAuditTimeline.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{approvalAuditTimeline.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">audit writes: {approvalAuditTimeline.writesAuditEvents ? "true" : "false"}</div>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-4" data-office-approval-audit-steps="true">
          {approvalAuditTimeline.steps.map((step) => (
            <div key={step.id} className="border border-current/15 bg-black/20 p-3" data-office-approval-audit-step={step.eventKind} data-office-approval-audit-status={step.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{step.eventKind}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{step.status}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{step.safeSummary}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-rose-300/20 bg-rose-950/10 p-4"
        data-office-approval-execution-gate="true"
        data-office-approval-execution-allowed={String(approvalExecutionGate.executionAllowed)}
        data-office-approval-execution-enabled-controls={approvalExecutionGate.enabledControls}
        data-office-approval-browser-affordance={approvalExecutionGate.browserAffordance}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-200/70">{approvalExecutionGate.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{approvalExecutionGate.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{approvalExecutionGate.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">execution allowed: {approvalExecutionGate.executionAllowed ? "true" : "false"}</div>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-4" data-office-approval-execution-prerequisites="true">
          {approvalExecutionGate.requiredPrerequisites.map((item) => (
            <div key={item.id} className="border border-current/15 bg-black/20 p-3" data-office-approval-execution-prerequisite={item.id} data-office-approval-execution-prerequisite-status={item.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{item.status}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{item.label}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{item.safeSummary}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-amber-300/20 bg-amber-950/10 p-4"
        data-office-authority-adapter-contract="true"
        data-office-authority-dispatch-enabled={String(authorityAdapterContract.dispatchEnabled)}
        data-office-authority-enabled-controls={authorityAdapterContract.enabledControls}
        data-office-authority-adapters-installed={String(authorityAdapterContract.adaptersInstalled)}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/70">{authorityAdapterContract.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{authorityAdapterContract.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{authorityAdapterContract.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">dispatch enabled: {authorityAdapterContract.dispatchEnabled ? "true" : "false"}</div>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-5" data-office-authority-required-fields="true">
          {authorityAdapterContract.requiredFields.map((field) => (
            <div key={field.id} className="border border-current/15 bg-black/20 p-3" data-office-authority-required-field={field.id} data-office-authority-required-field-status={field.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{field.status}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{field.label}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{field.safeSummary}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-sky-300/20 bg-sky-950/10 p-4"
        data-office-orchestrator-mediation-queue="true"
        data-office-orchestrator-enqueue-enabled={String(orchestratorMediationQueue.enqueueEnabled)}
        data-office-orchestrator-candidate-promotion-enabled={String(orchestratorMediationQueue.candidatePromotionEnabled)}
        data-office-orchestrator-enabled-controls={orchestratorMediationQueue.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200/70">{orchestratorMediationQueue.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{orchestratorMediationQueue.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{orchestratorMediationQueue.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">enqueue enabled: {orchestratorMediationQueue.enqueueEnabled ? "true" : "false"}</div>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-3" data-office-orchestrator-mediation-items="true">
          {orchestratorMediationQueue.items.map((item) => (
            <div key={item.id} className="border border-current/15 bg-black/20 p-3" data-office-orchestrator-mediation-item={item.intentKind} data-office-orchestrator-mediation-status={item.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{item.intentKind}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{item.status}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{item.safeSummary}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-cyan-300/20 bg-cyan-950/10 p-4"
        data-office-worker-intent-routing="true"
        data-office-worker-routing-assignment-enabled={String(workerIntentRouting.workAssignmentEnabled)}
        data-office-worker-routing-request-creation-enabled={String(workerIntentRouting.requestCreationEnabled)}
        data-office-worker-routing-dispatch-enabled={String(workerIntentRouting.dispatchEnabled)}
        data-office-worker-routing-enabled-controls={workerIntentRouting.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">{workerIntentRouting.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{workerIntentRouting.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{workerIntentRouting.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">assignment enabled: {workerIntentRouting.workAssignmentEnabled ? "true" : "false"}</div>
        </div>
        <div className="mt-3 grid gap-2 md:grid-cols-3" data-office-worker-intent-routes="true">
          {workerIntentRouting.routes.map((route) => (
            <div key={route.id} className="border border-current/15 bg-black/20 p-3" data-office-worker-intent-route={route.intentKind} data-office-worker-intent-route-status={route.status} data-office-worker-intent-target-facility={route.targetFacility}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{route.intentKind}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{route.targetFacility}</div>
              <div className="mt-1 text-xs text-midground/60">{route.workerRole} · {route.assignmentStatus}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{route.safeSummary}</div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-teal-300/20 bg-teal-950/10 p-4"
        data-office-worker-facility-readiness="true"
        data-office-worker-facility-assignment-enabled={String(workerFacilityReadiness.workAssignmentEnabled)}
        data-office-worker-facility-request-creation-enabled={String(workerFacilityReadiness.requestCreationEnabled)}
        data-office-worker-facility-dispatch-enabled={String(workerFacilityReadiness.dispatchEnabled)}
        data-office-worker-facility-audit-write-enabled={String(workerFacilityReadiness.auditWriteEnabled)}
        data-office-worker-facility-enabled-controls={workerFacilityReadiness.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-200/70">{workerFacilityReadiness.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{workerFacilityReadiness.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{workerFacilityReadiness.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">enabled controls: {workerFacilityReadiness.enabledControls}</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-worker-facilities="true">
          {workerFacilityReadiness.facilities.map((facility) => (
            <div key={facility.id} className="border border-current/15 bg-black/20 p-3" data-office-worker-facility={facility.id} data-office-worker-facility-status={facility.status} data-office-worker-facility-assignment-ready={String(facility.assignmentReady)}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{facility.workerRole}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{facility.id}</div>
              <div className="mt-1 text-xs text-midground/60">routes: {facility.routeCount} · assignment ready: {facility.assignmentReady ? "true" : "false"}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{facility.safeSummary}</div>
              <div className="mt-3 space-y-1" data-office-worker-facility-prerequisites="true">
                {facility.prerequisites.map((item) => (
                  <div key={item.id} className="border border-current/10 bg-black/20 px-2 py-1 text-xs text-midground/70" data-office-worker-facility-prerequisite={item.id} data-office-worker-facility-prerequisite-status={item.status}>
                    <span className="font-semibold text-foreground/80">{item.label}</span> · {item.safeSummary}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-emerald-300/20 bg-emerald-950/10 p-4"
        data-office-worker-assignment-candidate-gate="true"
        data-office-worker-candidate-enabled={String(workerAssignmentCandidateGate.assignmentCandidateEnabled)}
        data-office-worker-candidate-assignment-enabled={String(workerAssignmentCandidateGate.workAssignmentEnabled)}
        data-office-worker-candidate-request-creation-enabled={String(workerAssignmentCandidateGate.requestCreationEnabled)}
        data-office-worker-candidate-dispatch-enabled={String(workerAssignmentCandidateGate.dispatchEnabled)}
        data-office-worker-candidate-audit-write-enabled={String(workerAssignmentCandidateGate.auditWriteEnabled)}
        data-office-worker-candidate-enabled-controls={workerAssignmentCandidateGate.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/70">{workerAssignmentCandidateGate.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{workerAssignmentCandidateGate.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{workerAssignmentCandidateGate.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">candidate enabled: {workerAssignmentCandidateGate.assignmentCandidateEnabled ? "true" : "false"}</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-worker-assignment-candidates="true">
          {workerAssignmentCandidateGate.candidates.map((candidate) => (
            <div key={candidate.id} className="border border-current/15 bg-black/20 p-3" data-office-worker-assignment-candidate={candidate.facilityId} data-office-worker-assignment-candidate-status={candidate.status} data-office-worker-assignment-candidate-ready={String(candidate.assignmentReady)}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{candidate.workerRole}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{candidate.id}</div>
              <div className="mt-1 text-xs text-midground/60">assignment ready: {candidate.assignmentReady ? "true" : "false"}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{candidate.safeSummary}</div>
              <div className="mt-3 space-y-1" data-office-worker-assignment-blockers="true">
                {candidate.blockedBy.map((item) => (
                  <div key={item.id} className="border border-current/10 bg-black/20 px-2 py-1 text-xs text-midground/70" data-office-worker-assignment-blocker={item.id} data-office-worker-assignment-blocker-status={item.status}>
                    <span className="font-semibold text-foreground/80">{item.label}</span> · {item.safeSummary}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-sky-300/20 bg-sky-950/10 p-4"
        data-office-worker-request-draft-preview="true"
        data-office-worker-request-creation-enabled={String(workerRequestDraftPreview.requestCreationEnabled)}
        data-office-worker-request-persistence-enabled={String(workerRequestDraftPreview.requestPersistenceEnabled)}
        data-office-worker-request-assignment-enabled={String(workerRequestDraftPreview.workAssignmentEnabled)}
        data-office-worker-request-dispatch-enabled={String(workerRequestDraftPreview.dispatchEnabled)}
        data-office-worker-request-audit-write-enabled={String(workerRequestDraftPreview.auditWriteEnabled)}
        data-office-worker-request-enabled-controls={workerRequestDraftPreview.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200/70">{workerRequestDraftPreview.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{workerRequestDraftPreview.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{workerRequestDraftPreview.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">created requests: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-worker-request-drafts="true">
          {workerRequestDraftPreview.drafts.map((draft) => (
            <div key={draft.id} className="border border-current/15 bg-black/20 p-3" data-office-worker-request-draft={draft.facilityId} data-office-worker-request-draft-status={draft.status} data-office-worker-request-draft-persistence={draft.persistenceStatus}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{draft.workerRole}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{draft.id}</div>
              <div className="mt-1 text-xs text-midground/60">candidate: {draft.candidateRef} · blockers: {draft.blockedReasonCount}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{draft.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-worker-request-draft-fields="true">
                {draft.safeFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-worker-request-draft-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-violet-300/20 bg-violet-950/10 p-4"
        data-office-worker-human-confirmation-envelope="true"
        data-office-worker-confirmation-decision-recording-enabled={String(workerHumanConfirmationEnvelope.decisionRecordingEnabled)}
        data-office-worker-confirmation-request-creation-enabled={String(workerHumanConfirmationEnvelope.requestCreationEnabled)}
        data-office-worker-confirmation-request-persistence-enabled={String(workerHumanConfirmationEnvelope.requestPersistenceEnabled)}
        data-office-worker-confirmation-assignment-enabled={String(workerHumanConfirmationEnvelope.workAssignmentEnabled)}
        data-office-worker-confirmation-dispatch-enabled={String(workerHumanConfirmationEnvelope.dispatchEnabled)}
        data-office-worker-confirmation-audit-write-enabled={String(workerHumanConfirmationEnvelope.auditWriteEnabled)}
        data-office-worker-confirmation-enabled-controls={workerHumanConfirmationEnvelope.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-200/70">{workerHumanConfirmationEnvelope.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{workerHumanConfirmationEnvelope.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{workerHumanConfirmationEnvelope.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">recorded decisions: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-worker-confirmation-envelopes="true">
          {workerHumanConfirmationEnvelope.envelopes.map((envelope) => (
            <div key={envelope.id} className="border border-current/15 bg-black/20 p-3" data-office-worker-confirmation-envelope={envelope.facilityId} data-office-worker-confirmation-status={envelope.status} data-office-worker-confirmation-decision-state={envelope.decisionState}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{envelope.workerRole}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{envelope.id}</div>
              <div className="mt-1 text-xs text-midground/60">draft: {envelope.draftRef} · decision: {envelope.decisionState}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{envelope.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-worker-confirmation-fields="true">
                {envelope.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-worker-confirmation-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-amber-300/20 bg-amber-950/10 p-4"
        data-office-worker-authority-handoff-envelope="true"
        data-office-worker-handoff-adapter-installation-enabled={String(workerAuthorityHandoffEnvelope.adapterInstallationEnabled)}
        data-office-worker-handoff-dispatch-enabled={String(workerAuthorityHandoffEnvelope.dispatchEnabled)}
        data-office-worker-handoff-request-creation-enabled={String(workerAuthorityHandoffEnvelope.requestCreationEnabled)}
        data-office-worker-handoff-assignment-enabled={String(workerAuthorityHandoffEnvelope.workAssignmentEnabled)}
        data-office-worker-handoff-audit-write-enabled={String(workerAuthorityHandoffEnvelope.auditWriteEnabled)}
        data-office-worker-handoff-enabled-controls={workerAuthorityHandoffEnvelope.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/70">{workerAuthorityHandoffEnvelope.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{workerAuthorityHandoffEnvelope.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{workerAuthorityHandoffEnvelope.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">dispatched actions: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-worker-handoffs="true">
          {workerAuthorityHandoffEnvelope.handoffs.map((handoff) => (
            <div key={handoff.id} className="border border-current/15 bg-black/20 p-3" data-office-worker-handoff={handoff.facilityId} data-office-worker-handoff-status={handoff.status} data-office-worker-handoff-adapter-state={handoff.adapterState}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{handoff.workerRole}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{handoff.id}</div>
              <div className="mt-1 text-xs text-midground/60">confirmation: {handoff.confirmationRef} · adapter: {handoff.adapterState}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{handoff.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-worker-handoff-fields="true">
                {handoff.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-worker-handoff-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-rose-300/20 bg-rose-950/10 p-4"
        data-office-worker-dispatch-dry-run-envelope="true"
        data-office-worker-dry-run-execution-enabled={String(workerDispatchDryRunEnvelope.dryRunExecutionEnabled)}
        data-office-worker-dry-run-dispatch-enabled={String(workerDispatchDryRunEnvelope.dispatchEnabled)}
        data-office-worker-dry-run-adapter-installation-enabled={String(workerDispatchDryRunEnvelope.adapterInstallationEnabled)}
        data-office-worker-dry-run-request-creation-enabled={String(workerDispatchDryRunEnvelope.requestCreationEnabled)}
        data-office-worker-dry-run-assignment-enabled={String(workerDispatchDryRunEnvelope.workAssignmentEnabled)}
        data-office-worker-dry-run-audit-write-enabled={String(workerDispatchDryRunEnvelope.auditWriteEnabled)}
        data-office-worker-dry-run-enabled-controls={workerDispatchDryRunEnvelope.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-200/70">{workerDispatchDryRunEnvelope.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{workerDispatchDryRunEnvelope.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{workerDispatchDryRunEnvelope.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">dry runs executed: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-worker-dry-runs="true">
          {workerDispatchDryRunEnvelope.dryRuns.map((dryRun) => (
            <div key={dryRun.id} className="border border-current/15 bg-black/20 p-3" data-office-worker-dry-run={dryRun.facilityId} data-office-worker-dry-run-status={dryRun.status} data-office-worker-dry-run-execution-state={dryRun.executionState}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{dryRun.workerRole}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{dryRun.id}</div>
              <div className="mt-1 text-xs text-midground/60">handoff: {dryRun.handoffRef} · execution: {dryRun.executionState}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{dryRun.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-worker-dry-run-fields="true">
                {dryRun.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-worker-dry-run-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-cyan-300/20 bg-cyan-950/10 p-4"
        data-office-worker-audit-preview-envelope="true"
        data-office-worker-audit-preview-write-enabled={String(workerAuditPreviewEnvelope.auditWriteEnabled)}
        data-office-worker-audit-preview-execution-enabled={String(workerAuditPreviewEnvelope.executionEnabled)}
        data-office-worker-audit-preview-dispatch-enabled={String(workerAuditPreviewEnvelope.dispatchEnabled)}
        data-office-worker-audit-preview-adapter-installation-enabled={String(workerAuditPreviewEnvelope.adapterInstallationEnabled)}
        data-office-worker-audit-preview-request-creation-enabled={String(workerAuditPreviewEnvelope.requestCreationEnabled)}
        data-office-worker-audit-preview-assignment-enabled={String(workerAuditPreviewEnvelope.workAssignmentEnabled)}
        data-office-worker-audit-preview-enabled-controls={workerAuditPreviewEnvelope.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200/70">{workerAuditPreviewEnvelope.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{workerAuditPreviewEnvelope.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{workerAuditPreviewEnvelope.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">audit events written: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-worker-audit-previews="true">
          {workerAuditPreviewEnvelope.previews.map((preview) => (
            <div key={preview.id} className="border border-current/15 bg-black/20 p-3" data-office-worker-audit-preview={preview.facilityId} data-office-worker-audit-preview-status={preview.status} data-office-worker-audit-preview-sink-state={preview.auditSinkState}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{preview.workerRole}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{preview.id}</div>
              <div className="mt-1 text-xs text-midground/60">dry-run: {preview.dryRunRef} · sink: {preview.auditSinkState}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{preview.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-worker-audit-preview-fields="true">
                {preview.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-worker-audit-preview-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-emerald-300/20 bg-emerald-950/10 p-4"
        data-office-worker-rollback-preview-envelope="true"
        data-office-worker-rollback-preview-execution-enabled={String(workerRollbackPreviewEnvelope.rollbackExecutionEnabled)}
        data-office-worker-rollback-preview-audit-write-enabled={String(workerRollbackPreviewEnvelope.auditWriteEnabled)}
        data-office-worker-rollback-preview-action-execution-enabled={String(workerRollbackPreviewEnvelope.executionEnabled)}
        data-office-worker-rollback-preview-dispatch-enabled={String(workerRollbackPreviewEnvelope.dispatchEnabled)}
        data-office-worker-rollback-preview-adapter-installation-enabled={String(workerRollbackPreviewEnvelope.adapterInstallationEnabled)}
        data-office-worker-rollback-preview-request-creation-enabled={String(workerRollbackPreviewEnvelope.requestCreationEnabled)}
        data-office-worker-rollback-preview-assignment-enabled={String(workerRollbackPreviewEnvelope.workAssignmentEnabled)}
        data-office-worker-rollback-preview-enabled-controls={workerRollbackPreviewEnvelope.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-200/70">{workerRollbackPreviewEnvelope.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{workerRollbackPreviewEnvelope.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{workerRollbackPreviewEnvelope.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">rollback executions: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-worker-rollback-previews="true">
          {workerRollbackPreviewEnvelope.previews.map((preview) => (
            <div key={preview.id} className="border border-current/15 bg-black/20 p-3" data-office-worker-rollback-preview={preview.facilityId} data-office-worker-rollback-preview-status={preview.status} data-office-worker-rollback-preview-state={preview.rollbackState}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{preview.workerRole}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{preview.id}</div>
              <div className="mt-1 text-xs text-midground/60">audit preview: {preview.auditPreviewRef} · rollback: {preview.rollbackState}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{preview.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-worker-rollback-preview-fields="true">
                {preview.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-worker-rollback-preview-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-lime-300/20 bg-lime-950/10 p-4"
        data-office-worker-final-gate-checklist="true"
        data-office-worker-final-gate-control-proposal-enabled={String(workerFinalGateChecklist.controlProposalEnabled)}
        data-office-worker-final-gate-rollback-execution-enabled={String(workerFinalGateChecklist.rollbackExecutionEnabled)}
        data-office-worker-final-gate-audit-write-enabled={String(workerFinalGateChecklist.auditWriteEnabled)}
        data-office-worker-final-gate-action-execution-enabled={String(workerFinalGateChecklist.executionEnabled)}
        data-office-worker-final-gate-dispatch-enabled={String(workerFinalGateChecklist.dispatchEnabled)}
        data-office-worker-final-gate-adapter-installation-enabled={String(workerFinalGateChecklist.adapterInstallationEnabled)}
        data-office-worker-final-gate-request-creation-enabled={String(workerFinalGateChecklist.requestCreationEnabled)}
        data-office-worker-final-gate-assignment-enabled={String(workerFinalGateChecklist.workAssignmentEnabled)}
        data-office-worker-final-gate-enabled-controls={workerFinalGateChecklist.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-lime-200/70">{workerFinalGateChecklist.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{workerFinalGateChecklist.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{workerFinalGateChecklist.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">enabled controls: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-worker-final-gates="true">
          {workerFinalGateChecklist.gates.map((gate) => (
            <div key={gate.id} className="border border-current/15 bg-black/20 p-3" data-office-worker-final-gate={gate.id} data-office-worker-final-gate-status={gate.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{gate.status}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{gate.label}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{gate.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-worker-final-gate-fields="true">
                {gate.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-worker-final-gate-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-sky-300/20 bg-sky-950/10 p-4"
        data-office-controlled-mutation-proposal-contract="true"
        data-office-controlled-mutation-proposal-creation-enabled={String(controlledMutationProposalContract.proposalCreationEnabled)}
        data-office-controlled-mutation-proposal-persistence-enabled={String(controlledMutationProposalContract.proposalPersistenceEnabled)}
        data-office-controlled-mutation-route-enabled={String(controlledMutationProposalContract.mutationRouteEnabled)}
        data-office-controlled-mutation-control-proposal-enabled={String(controlledMutationProposalContract.controlProposalEnabled)}
        data-office-controlled-mutation-rollback-execution-enabled={String(controlledMutationProposalContract.rollbackExecutionEnabled)}
        data-office-controlled-mutation-audit-write-enabled={String(controlledMutationProposalContract.auditWriteEnabled)}
        data-office-controlled-mutation-action-execution-enabled={String(controlledMutationProposalContract.executionEnabled)}
        data-office-controlled-mutation-dispatch-enabled={String(controlledMutationProposalContract.dispatchEnabled)}
        data-office-controlled-mutation-request-creation-enabled={String(controlledMutationProposalContract.requestCreationEnabled)}
        data-office-controlled-mutation-enabled-controls={controlledMutationProposalContract.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200/70">{controlledMutationProposalContract.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{controlledMutationProposalContract.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{controlledMutationProposalContract.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">proposal creations: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-controlled-mutation-contracts="true">
          {controlledMutationProposalContract.contracts.map((contract) => (
            <div key={contract.id} className="border border-current/15 bg-black/20 p-3" data-office-controlled-mutation-contract={contract.id} data-office-controlled-mutation-contract-status={contract.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{contract.status}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{contract.label}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{contract.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-controlled-mutation-contract-fields="true">
                {contract.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-controlled-mutation-contract-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-indigo-300/20 bg-indigo-950/10 p-4"
        data-office-controlled-mutation-dry-run-plan="true"
        data-office-controlled-mutation-dry-run-execution-enabled={String(controlledMutationDryRunPlan.dryRunExecutionEnabled)}
        data-office-controlled-mutation-dry-run-proposal-creation-enabled={String(controlledMutationDryRunPlan.proposalCreationEnabled)}
        data-office-controlled-mutation-dry-run-route-enabled={String(controlledMutationDryRunPlan.mutationRouteEnabled)}
        data-office-controlled-mutation-dry-run-rollback-execution-enabled={String(controlledMutationDryRunPlan.rollbackExecutionEnabled)}
        data-office-controlled-mutation-dry-run-audit-write-enabled={String(controlledMutationDryRunPlan.auditWriteEnabled)}
        data-office-controlled-mutation-dry-run-action-execution-enabled={String(controlledMutationDryRunPlan.executionEnabled)}
        data-office-controlled-mutation-dry-run-dispatch-enabled={String(controlledMutationDryRunPlan.dispatchEnabled)}
        data-office-controlled-mutation-dry-run-enabled-controls={controlledMutationDryRunPlan.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200/70">{controlledMutationDryRunPlan.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{controlledMutationDryRunPlan.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{controlledMutationDryRunPlan.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">dry-run executions: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-controlled-mutation-dry-run-items="true">
          {controlledMutationDryRunPlan.planItems.map((item) => (
            <div key={item.id} className="border border-current/15 bg-black/20 p-3" data-office-controlled-mutation-dry-run-item={item.id} data-office-controlled-mutation-dry-run-item-status={item.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{item.status}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{item.label}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{item.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-controlled-mutation-dry-run-fields="true">
                {item.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-controlled-mutation-dry-run-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-amber-300/20 bg-amber-950/10 p-4"
        data-office-controlled-mutation-audit-sink-plan="true"
        data-office-controlled-mutation-audit-sink-write-enabled={String(controlledMutationAuditSinkPlan.auditWriteEnabled)}
        data-office-controlled-mutation-audit-sink-dry-run-execution-enabled={String(controlledMutationAuditSinkPlan.dryRunExecutionEnabled)}
        data-office-controlled-mutation-audit-sink-proposal-creation-enabled={String(controlledMutationAuditSinkPlan.proposalCreationEnabled)}
        data-office-controlled-mutation-audit-sink-route-enabled={String(controlledMutationAuditSinkPlan.mutationRouteEnabled)}
        data-office-controlled-mutation-audit-sink-rollback-execution-enabled={String(controlledMutationAuditSinkPlan.rollbackExecutionEnabled)}
        data-office-controlled-mutation-audit-sink-action-execution-enabled={String(controlledMutationAuditSinkPlan.executionEnabled)}
        data-office-controlled-mutation-audit-sink-dispatch-enabled={String(controlledMutationAuditSinkPlan.dispatchEnabled)}
        data-office-controlled-mutation-audit-sink-enabled-controls={controlledMutationAuditSinkPlan.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/70">{controlledMutationAuditSinkPlan.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{controlledMutationAuditSinkPlan.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{controlledMutationAuditSinkPlan.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">audit writes: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-controlled-mutation-audit-sink-items="true">
          {controlledMutationAuditSinkPlan.sinkItems.map((item) => (
            <div key={item.id} className="border border-current/15 bg-black/20 p-3" data-office-controlled-mutation-audit-sink-item={item.id} data-office-controlled-mutation-audit-sink-item-status={item.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{item.status}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{item.label}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{item.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-controlled-mutation-audit-sink-fields="true">
                {item.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-controlled-mutation-audit-sink-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-rose-300/20 bg-rose-950/10 p-4"
        data-office-controlled-mutation-rollback-verification-plan="true"
        data-office-controlled-mutation-rollback-verification-execution-enabled={String(controlledMutationRollbackVerificationPlan.rollbackExecutionEnabled)}
        data-office-controlled-mutation-rollback-verification-audit-write-enabled={String(controlledMutationRollbackVerificationPlan.auditWriteEnabled)}
        data-office-controlled-mutation-rollback-verification-dry-run-execution-enabled={String(controlledMutationRollbackVerificationPlan.dryRunExecutionEnabled)}
        data-office-controlled-mutation-rollback-verification-proposal-creation-enabled={String(controlledMutationRollbackVerificationPlan.proposalCreationEnabled)}
        data-office-controlled-mutation-rollback-verification-route-enabled={String(controlledMutationRollbackVerificationPlan.mutationRouteEnabled)}
        data-office-controlled-mutation-rollback-verification-action-execution-enabled={String(controlledMutationRollbackVerificationPlan.executionEnabled)}
        data-office-controlled-mutation-rollback-verification-dispatch-enabled={String(controlledMutationRollbackVerificationPlan.dispatchEnabled)}
        data-office-controlled-mutation-rollback-verification-enabled-controls={controlledMutationRollbackVerificationPlan.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-200/70">{controlledMutationRollbackVerificationPlan.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{controlledMutationRollbackVerificationPlan.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{controlledMutationRollbackVerificationPlan.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">rollback executions: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-controlled-mutation-rollback-verification-items="true">
          {controlledMutationRollbackVerificationPlan.verificationItems.map((item) => (
            <div key={item.id} className="border border-current/15 bg-black/20 p-3" data-office-controlled-mutation-rollback-verification-item={item.id} data-office-controlled-mutation-rollback-verification-item-status={item.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{item.status}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{item.label}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{item.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-controlled-mutation-rollback-verification-fields="true">
                {item.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-controlled-mutation-rollback-verification-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-fuchsia-300/20 bg-fuchsia-950/10 p-4"
        data-office-controlled-mutation-human-approval-plan="true"
        data-office-controlled-mutation-human-approval-recording-enabled={String(controlledMutationHumanApprovalPlan.approvalRecordingEnabled)}
        data-office-controlled-mutation-human-approval-rollback-execution-enabled={String(controlledMutationHumanApprovalPlan.rollbackExecutionEnabled)}
        data-office-controlled-mutation-human-approval-audit-write-enabled={String(controlledMutationHumanApprovalPlan.auditWriteEnabled)}
        data-office-controlled-mutation-human-approval-dry-run-execution-enabled={String(controlledMutationHumanApprovalPlan.dryRunExecutionEnabled)}
        data-office-controlled-mutation-human-approval-proposal-creation-enabled={String(controlledMutationHumanApprovalPlan.proposalCreationEnabled)}
        data-office-controlled-mutation-human-approval-route-enabled={String(controlledMutationHumanApprovalPlan.mutationRouteEnabled)}
        data-office-controlled-mutation-human-approval-action-execution-enabled={String(controlledMutationHumanApprovalPlan.executionEnabled)}
        data-office-controlled-mutation-human-approval-dispatch-enabled={String(controlledMutationHumanApprovalPlan.dispatchEnabled)}
        data-office-controlled-mutation-human-approval-enabled-controls={controlledMutationHumanApprovalPlan.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fuchsia-200/70">{controlledMutationHumanApprovalPlan.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{controlledMutationHumanApprovalPlan.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{controlledMutationHumanApprovalPlan.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">approval records: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-controlled-mutation-human-approval-items="true">
          {controlledMutationHumanApprovalPlan.approvalItems.map((item) => (
            <div key={item.id} className="border border-current/15 bg-black/20 p-3" data-office-controlled-mutation-human-approval-item={item.id} data-office-controlled-mutation-human-approval-item-status={item.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{item.status}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{item.label}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{item.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-controlled-mutation-human-approval-fields="true">
                {item.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-controlled-mutation-human-approval-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-indigo-300/20 bg-indigo-950/10 p-4"
        data-office-controlled-mutation-authority-summary="true"
        data-office-controlled-mutation-authority-summary-grant-enabled={String(controlledMutationAuthoritySummary.authorityGrantEnabled)}
        data-office-controlled-mutation-authority-summary-approval-recording-enabled={String(controlledMutationAuthoritySummary.approvalRecordingEnabled)}
        data-office-controlled-mutation-authority-summary-rollback-execution-enabled={String(controlledMutationAuthoritySummary.rollbackExecutionEnabled)}
        data-office-controlled-mutation-authority-summary-audit-write-enabled={String(controlledMutationAuthoritySummary.auditWriteEnabled)}
        data-office-controlled-mutation-authority-summary-dry-run-execution-enabled={String(controlledMutationAuthoritySummary.dryRunExecutionEnabled)}
        data-office-controlled-mutation-authority-summary-proposal-creation-enabled={String(controlledMutationAuthoritySummary.proposalCreationEnabled)}
        data-office-controlled-mutation-authority-summary-route-enabled={String(controlledMutationAuthoritySummary.mutationRouteEnabled)}
        data-office-controlled-mutation-authority-summary-action-execution-enabled={String(controlledMutationAuthoritySummary.executionEnabled)}
        data-office-controlled-mutation-authority-summary-dispatch-enabled={String(controlledMutationAuthoritySummary.dispatchEnabled)}
        data-office-controlled-mutation-authority-summary-enabled-controls={controlledMutationAuthoritySummary.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-200/70">{controlledMutationAuthoritySummary.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{controlledMutationAuthoritySummary.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{controlledMutationAuthoritySummary.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">authority grants: 0</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-controlled-mutation-authority-summary-items="true">
          {controlledMutationAuthoritySummary.authorityItems.map((item) => (
            <div key={item.id} className="border border-current/15 bg-black/20 p-3" data-office-controlled-mutation-authority-summary-item={item.id} data-office-controlled-mutation-authority-summary-item-status={item.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{item.status}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{item.label}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{item.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-controlled-mutation-authority-summary-fields="true">
                {item.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-controlled-mutation-authority-summary-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="border border-sky-300/20 bg-sky-950/10 p-4"
        data-office-controlled-mutation-execution-readiness-summary="true"
        data-office-controlled-mutation-execution-readiness-summary-enabled={String(controlledMutationExecutionReadinessSummary.executionReadinessEnabled)}
        data-office-controlled-mutation-execution-readiness-summary-authority-grant-enabled={String(controlledMutationExecutionReadinessSummary.authorityGrantEnabled)}
        data-office-controlled-mutation-execution-readiness-summary-approval-recording-enabled={String(controlledMutationExecutionReadinessSummary.approvalRecordingEnabled)}
        data-office-controlled-mutation-execution-readiness-summary-rollback-execution-enabled={String(controlledMutationExecutionReadinessSummary.rollbackExecutionEnabled)}
        data-office-controlled-mutation-execution-readiness-summary-audit-write-enabled={String(controlledMutationExecutionReadinessSummary.auditWriteEnabled)}
        data-office-controlled-mutation-execution-readiness-summary-dry-run-execution-enabled={String(controlledMutationExecutionReadinessSummary.dryRunExecutionEnabled)}
        data-office-controlled-mutation-execution-readiness-summary-proposal-creation-enabled={String(controlledMutationExecutionReadinessSummary.proposalCreationEnabled)}
        data-office-controlled-mutation-execution-readiness-summary-route-enabled={String(controlledMutationExecutionReadinessSummary.mutationRouteEnabled)}
        data-office-controlled-mutation-execution-readiness-summary-action-execution-enabled={String(controlledMutationExecutionReadinessSummary.executionEnabled)}
        data-office-controlled-mutation-execution-readiness-summary-dispatch-enabled={String(controlledMutationExecutionReadinessSummary.dispatchEnabled)}
        data-office-controlled-mutation-execution-readiness-summary-enabled-controls={controlledMutationExecutionReadinessSummary.enabledControls}
      >
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-sky-200/70">{controlledMutationExecutionReadinessSummary.stageLabel}</div>
            <h2 className="mt-1 text-lg font-semibold text-foreground">{controlledMutationExecutionReadinessSummary.title}</h2>
            <p className="mt-2 text-xs leading-5 text-midground/70">{controlledMutationExecutionReadinessSummary.safeBoundary}</p>
          </div>
          <div className="border border-current/15 bg-black/20 p-2 text-xs text-midground/70">execution readiness: blocked</div>
        </div>
        <div className="mt-3 grid gap-2 lg:grid-cols-3" data-office-controlled-mutation-execution-readiness-summary-items="true">
          {controlledMutationExecutionReadinessSummary.readinessItems.map((item) => (
            <div key={item.id} className="border border-current/15 bg-black/20 p-3" data-office-controlled-mutation-execution-readiness-summary-item={item.id} data-office-controlled-mutation-execution-readiness-summary-item-status={item.status}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-midground/55">{item.status}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{item.label}</div>
              <div className="mt-2 text-xs leading-5 text-midground/70">{item.safeSummary}</div>
              <div className="mt-3 flex flex-wrap gap-1" data-office-controlled-mutation-execution-readiness-summary-fields="true">
                {item.requiredFields.map((field) => (
                  <span key={field} className="border border-current/10 bg-black/20 px-2 py-1 text-[10px] text-midground/65" data-office-controlled-mutation-execution-readiness-summary-field={field}>{field}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {showOverview ? (
        <OfficeRpgMap
          scene={rpgScene}
          selectedEntityId={selectedRpgEntityId}
          onInspectEntity={(entity) => {
            setSelectedRpgEntityId(entity.id);
            inspectRecord("RPG 안전 엔티티", entity.label, [
              ["종류", entity.kind],
              ["안전 참조", entity.linkTarget.ref],
              ["방", entity.room],
              ["상태", entity.status],
              ["심각도", entity.severity],
              ["요약", entity.summary],
              ["마지막 이벤트", fmt(entity.lastEventAt)],
              ["출처 범주", entity.linkTarget.type],
            ]);
          }}
        />
      ) : null}

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
          layoutPlan={layoutPlan}
          trackingTruth={trackingTruth}
          selectedCharacterId={selectedCharacterId}
          selectedCharacterFocus={selectedCharacterFocus}
          safeStreamPosture={safeStreamPosture}
          safeMotionHeartbeat={safeMotionHeartbeat}
          onDensityModeChange={setDensityMode}
          onInspect={(node) => inspectRecord("오피스 맵 방", node.label, [
            ["방", node.id],
            ["구역", node.zone],
            ["안전 개수", String(node.count)],
            ["상태", node.health],
            ["설명", node.detail],
          ])}
          onInspectCharacter={(character) => {
            setSelectedCharacterId(character.id);
            const inspector = buildOfficeCharacterInspector(character, latestDelta);
            inspectRecord(inspector.kind, inspector.title, inspector.fields);
          }}
        />
      ) : null}

      <div className="border border-current/20 bg-gradient-to-br from-black/35 to-black/10 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-emerald-300">
              <ShieldCheck className="h-4 w-4" /> 읽기 전용 MVP · 비공개 접근 우선
            </div>
            <h1 className="mt-3 text-3xl font-semibold uppercase tracking-wide text-foreground md:text-4xl">Hermes AI 오피스</h1>
            <p className="mt-3 text-sm leading-6 text-midground/80">
              이 Hermes 인스턴스의 상태를 가려서 보여주는 운영 지도입니다. 원문 세션, 프롬프트, 로그, 비밀값을 노출하지 않고 상태·건강도·출처 공백만 보여줍니다.
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
          <details className="min-w-64 border border-current/15 bg-black/20 p-3 text-xs text-midground/70" data-office-diagnostics-drawer="true">
            <summary className="flex cursor-pointer items-center gap-2 text-foreground">
              <Lock className="h-4 w-4 text-emerald-300" /> 보조 진단 HUD
            </summary>
            <div className="mt-2 grid gap-1">
              <div>생성 시각: {fmt(state.generated_at)}</div>
              <div data-office-time-display-policy="browser-local">{timeDisplayPolicy.label}: {timeDisplayPolicy.value}</div>
              <div className="text-midground/50">{timeDisplayPolicy.detail}</div>
              <div>표시 모드: {state.display_mode}</div>
              <div>원격 모드: {state.capabilities.remote_mode}</div>
              <div>변경 기능: {state.capabilities.mutations_enabled ? "검토 게이트" : "없음"}</div>
            </div>
            <div
              className="mt-3 border border-amber-300/20 bg-amber-950/10 p-3"
              data-office-mutation-control-readiness="true"
              data-office-mutation-control-status={mutationControlReadiness.status}
            >
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-100">{mutationControlReadiness.stageLabel}</div>
              <div className="mt-1 text-[11px] leading-4 text-midground/70" data-office-mutation-control-summary="true">{mutationControlReadiness.summary}</div>
              <div className="mt-2 grid gap-1" data-office-mutation-control-gates="true">
                {mutationControlReadiness.gates.map((gate) => (
                  <div
                    key={gate.id}
                    className="flex items-center justify-between gap-2 border border-amber-200/10 bg-black/10 px-2 py-1 text-[10px] text-midground/60"
                    data-office-mutation-control-gate={gate.id}
                    data-office-mutation-control-gate-satisfied={gate.satisfied ? "true" : "false"}
                    title={gate.detail}
                  >
                    <span>{gate.label}</span>
                    <span className="uppercase tracking-[0.14em]">required</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 grid gap-1">
                {mutationControlReadiness.controls.map((control) => (
                  <button
                    key={control.id}
                    type="button"
                    disabled
                    className="flex cursor-not-allowed items-center justify-between gap-2 border border-current/15 bg-black/15 px-2 py-1 text-left text-[10px] text-midground/60"
                    data-office-mutation-control-item={control.id}
                    data-office-mutation-control-enabled={control.enabled ? "true" : "false"}
                    data-office-mutation-control-risk={control.risk}
                    data-office-mutation-control-dry-run-only={control.dryRunOnly ? "true" : "false"}
                    title={`${control.detail} · ${control.requires.join(" · ")}`}
                  >
                    <span>{control.recommendedOrder}. {control.label}</span>
                    <span className="uppercase tracking-[0.14em]">{control.risk} · {control.posture}</span>
                  </button>
                ))}
              </div>
              <div className="mt-2 text-[10px] leading-4 text-midground/45">{mutationControlReadiness.safetyNote}</div>
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
            <div className={`office-safe-hud-hierarchy mt-3 ${safePulseToneClass(safeHudHierarchy.tone)}`} aria-label="Stage 15-A 안전 HUD hierarchy" data-office-safe-hud-hierarchy="true">
              <div className="office-safe-hud-hierarchy__header">
                <span className="office-safe-hud-hierarchy__title">{safeHudHierarchy.stageLabel}</span>
                <span className="office-safe-hud-hierarchy__headline" data-office-safe-hud-hierarchy-headline="true">{safeHudHierarchy.headline}</span>
              </div>
              <div className="office-safe-hud-hierarchy__summary" data-office-safe-hud-hierarchy-summary="true">{safeHudHierarchy.summary}</div>
              <div className="office-safe-hud-hierarchy__grid" aria-hidden="true">
                {safeHudHierarchy.sections.map((section) => (
                  <span
                    key={`hud-hierarchy-${section.id}`}
                    className={`office-safe-hud-hierarchy__section ${safePulseToneClass(section.tone)}`}
                    title={`${section.detail} · ${safeHudHierarchy.detail}`}
                    aria-hidden={section.ariaHidden}
                    data-office-safe-hud-hierarchy-section={section.id}
                  >
                    <span>{section.label}</span>
                    <span>{section.detail}</span>
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
            <div className={`office-safe-scan-index mt-3 ${safePulseToneClass(safeScanIndex.tone)}`} aria-label="Stage 14-P 안전 scan index" data-office-safe-scan-index="true">
              <div className="office-safe-scan-index__header">
                <span className="office-safe-scan-index__title">{safeScanIndex.stageLabel}</span>
                <span className="office-safe-scan-index__headline" data-office-safe-scan-index-headline="true">{safeScanIndex.headline}</span>
              </div>
              <div className="office-safe-scan-index__grid" aria-hidden="true">
                {safeScanIndex.items.map((item) => (
                  <span
                    key={`scan-index-${item.id}`}
                    className={`office-safe-scan-index__item ${safePulseToneClass(item.tone)}`}
                    title={`${item.detail} · ${safeScanIndex.detail}`}
                    aria-hidden={item.ariaHidden}
                    data-office-safe-scan-index-item={item.id}
                  >
                    <span>{item.label}</span>
                    <span>{item.detail}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className={`office-safe-hud-readability mt-3 ${safePulseToneClass(safeHudReadability.tone)}`} aria-label="Stage 14-Q 안전 HUD readability" data-office-safe-hud-readability="true">
              <div className="office-safe-hud-readability__header">
                <span className="office-safe-hud-readability__title">{safeHudReadability.stageLabel}</span>
                <span className="office-safe-hud-readability__summary" data-office-safe-hud-readability-summary="true">{safeHudReadability.summary}</span>
              </div>
              <div className="office-safe-hud-readability__grid" aria-hidden="true">
                {safeHudReadability.items.map((item) => (
                  <span
                    key={`hud-readability-${item.id}`}
                    className={`office-safe-hud-readability__item ${safePulseToneClass(item.tone)}`}
                    title={`${item.detail} · ${safeHudReadability.detail}`}
                    aria-hidden={item.ariaHidden}
                    data-office-safe-hud-readability-item={item.id}
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
          </details>
        </div>
        <div className="mt-4 border border-emerald-300/20 bg-emerald-950/10 p-3" data-office-live-operations-layer="true">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                <Activity className="h-4 w-4" /> {liveOperationsLayer.stageLabel}
              </div>
              <div className="mt-1 text-sm text-midground/75" data-office-live-operations-summary="true">{liveOperationsLayer.summary}</div>
            </div>
            <div className="text-xs text-midground/55">{liveOperationsLayer.redactionNote}</div>
          </div>
          {liveOperationsLayer.cues.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2" aria-hidden="true">
              {liveOperationsLayer.cues.map((cue) => (
                <span
                  key={cue.id}
                  className={`border px-2 py-1 text-xs ${safePulseToneClass(cue.tone)}`}
                  title={cue.detail}
                  aria-hidden={cue.ariaHidden}
                  data-office-live-operations-cue={cue.id}
                >
                  {cue.label} {cue.count}
                </span>
              ))}
            </div>
          ) : (
            <div className="mt-3 text-xs text-midground/55" data-office-live-operations-empty="true">현재 표시할 운영 cue가 없습니다. 빈 상태도 안전한 read-only 투영입니다.</div>
          )}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <StatCard label="진행 중 작업" value={state.summary.active_work_count ?? 0} detail="승인된 어댑터가 보여준 열린 작업" />
        <StatCard label="확인 필요" value={needsAttention.length} detail="막힌 작업, 소스 경고, 실패한 자동화" tone={needsAttention.length > 0 ? "text-yellow-300" : "text-emerald-300"} />
        <StatCard label="자동화" value={state.summary.automation_count ?? state.automations.length} detail="읽기 전용 기계처럼 표시한 cron 작업" />
        <StatCard label="가림 처리" value={state.redactions.redacted_field_count} detail={`정책 v${state.redactions.policy_version}; 민감 원문 필드 제외`} />
      </div>

      {showWork ? (
        <Card data-office-kanban-projection="true" data-office-readonly-kanban="true">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPinned className="h-4 w-4" /> {kanbanProjection.stageLabel}
            </CardTitle>
            <div className="text-xs leading-5 text-midground/55">{kanbanProjection.redactionNote}</div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="border border-current/15 bg-black/15 p-3">
                <SectionLabel>보드</SectionLabel>
                <div className="mt-2 text-2xl text-foreground">{kanbanProjection.boards.length}</div>
                <div className="mt-1 text-xs text-midground/65">작업 {kanbanProjection.cards.length}개 · 읽기 전용</div>
              </div>
              <div className="border border-current/15 bg-black/15 p-3">
                <SectionLabel>담당자</SectionLabel>
                <div className="mt-2 text-2xl text-foreground">{kanbanProjection.assignees.length}</div>
                <div className="mt-1 text-xs text-midground/65">{kanbanProjection.assignees.slice(0, 3).map((item) => `${item.id} ${item.count}`).join(" · ") || "—"}</div>
              </div>
              <div className="border border-current/15 bg-black/15 p-3" data-office-kanban-graph="true">
                <SectionLabel>의존성 그래프</SectionLabel>
                <div className="mt-2 text-2xl text-foreground">{kanbanProjection.graphEdges.length}</div>
                <div className="mt-1 text-xs text-midground/65">parent → child ref만 표시</div>
              </div>
            </div>
            <div className="border border-sky-300/15 bg-sky-950/10 p-3" data-office-kanban-operating-posture="true">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <SectionLabel>{kanbanProjection.operatingPosture.stageLabel}</SectionLabel>
                <span className="text-xs text-midground/55">source of truth: {kanbanProjection.operatingPosture.sourceOfTruth}</span>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-4">
                <div className="border border-current/15 p-3 text-xs" data-office-kanban-operating-count="open">
                  <div className="uppercase tracking-[0.18em] text-current/60">열린 작업</div>
                  <div className="mt-1 text-xl font-semibold tabular-nums">{kanbanProjection.operatingPosture.openTaskCount}</div>
                </div>
                <div className="border border-current/15 p-3 text-xs" data-office-kanban-operating-count="active">
                  <div className="uppercase tracking-[0.18em] text-current/60">진행/대기</div>
                  <div className="mt-1 text-xl font-semibold tabular-nums">{kanbanProjection.operatingPosture.activeTaskCount}</div>
                </div>
                <div className="border border-current/15 p-3 text-xs" data-office-kanban-operating-count="blocked">
                  <div className="uppercase tracking-[0.18em] text-current/60">막힘</div>
                  <div className="mt-1 text-xl font-semibold tabular-nums">{kanbanProjection.operatingPosture.blockedTaskCount}</div>
                </div>
                <div className="border border-current/15 p-3 text-xs" data-office-kanban-operating-count="done">
                  <div className="uppercase tracking-[0.18em] text-current/60">완료 기록</div>
                  <div className="mt-1 text-xl font-semibold tabular-nums">{kanbanProjection.operatingPosture.doneTaskCount}</div>
                </div>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-2">
                {kanbanProjection.operatingPosture.guidanceCards.map((card) => (
                  <div key={card.id} className={`border p-3 text-xs ${changeToneClass(card.tone)}`} data-office-kanban-operating-card={card.id}>
                    <div className="font-semibold">{card.label}</div>
                    <div className="mt-1 text-current/70">{card.detail}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-amber-300/15 bg-amber-950/10 p-3" data-office-kanban-observability="true">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <SectionLabel>{kanbanProjection.observability.stageLabel}</SectionLabel>
                <span className="text-xs text-midground/55">정체·막힘·작업량 safe summary</span>
              </div>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {kanbanProjection.observability.summaryCards.map((card) => (
                  <div key={card.id} className={`border p-3 ${changeToneClass(card.tone)}`} data-office-kanban-observability-card={card.id}>
                    <div className="text-xs uppercase tracking-[0.18em] text-current/70">{card.label}</div>
                    <div className="mt-1 text-xl font-semibold">{card.value}</div>
                    <div className="mt-1 text-xs text-current/70">{card.detail}</div>
                  </div>
                ))}
              </div>
              {kanbanProjection.observability.workloadByBoard.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2 text-xs" aria-label="Kanban workload by board">
                  {kanbanProjection.observability.workloadByBoard.slice(0, 6).map((board) => (
                    <span key={board.boardId} className="border border-current/15 px-2 py-1" data-office-kanban-workload-board={board.boardId}>
                      {board.boardId}: 전체 {board.total} · 실행 {board.running} · 막힘 {board.blocked} · 정체 {board.stale}
                    </span>
                  ))}
                </div>
              ) : null}
              {kanbanProjection.observability.attentionRefs.length > 0 ? (
                <div className="mt-2 text-xs text-amber-100/75" data-office-kanban-attention-refs="true">
                  확인 ref {kanbanProjection.observability.attentionRefs.slice(0, 6).join(" · ")}
                </div>
              ) : null}
            </div>
            {kanbanProjection.boards.length === 0 ? (
              <div className="border border-dashed border-current/15 bg-black/10 p-4 text-sm text-midground/65">Kanban 보드 DTO가 아직 없습니다. 이 영역은 원문을 추론하지 않고 빈 상태만 표시합니다.</div>
            ) : (
              <div className="grid gap-3 lg:grid-cols-2">
                {kanbanProjection.boards.map((board) => (
                  <div key={board.boardId} className="border border-emerald-300/15 bg-emerald-950/10 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-semibold text-foreground">{board.displayName}</div>
                      <span className="border border-emerald-400/30 px-2 py-0.5 text-xs text-emerald-200">{board.boardId}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-midground/70">
                      {Object.entries(board.counts).slice(0, 7).map(([status, count]) => (
                        <span key={`${board.boardId}-${status}`} className="border border-current/15 px-2 py-1">{status} {count}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {kanbanProjection.graphEdges.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-xs" aria-label="Kanban safe graph refs">
                {kanbanProjection.graphEdges.slice(0, 8).map((edge) => (
                  <span key={`${edge.parent}-${edge.child}`} className="border border-cyan-300/20 bg-cyan-950/10 px-2 py-1 text-cyan-100">
                    {edge.parent} → {edge.child}
                  </span>
                ))}
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <OfficeSectionDrawer plan={sectionById.sources}>
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
            <div className="mb-4 border border-violet-300/20 bg-violet-950/10 p-3" data-office-projection-cache="true" data-office-projection-cache-status={projectionCacheSummary.status}>
              <div className="mb-3 flex flex-col gap-1 text-xs md:flex-row md:items-center md:justify-between">
                <span className="font-semibold uppercase tracking-[0.16em] text-violet-100">{projectionCacheSummary.stageLabel}</span>
                <span className="text-midground/60">{projectionCacheSummary.detail}</span>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                {projectionCacheSummary.cards.map((card) => (
                  <div key={card.id} className={`border px-3 py-2 text-xs ${changeToneClass(card.tone)}`} data-office-projection-cache-card={card.id}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold">{card.title}</span>
                      <span className="font-semibold tabular-nums">{card.value}</span>
                    </div>
                    <div className="mt-1 leading-4 opacity-75">{card.detail}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[11px] leading-4 text-violet-100/60">last-known-good safe projection만 표시합니다. rejected는 값 echo 없이 집계만 표시합니다.</div>
              <div className="mt-4 border border-violet-200/15 bg-black/15 p-3" data-office-projection-orchestration="true" data-office-projection-orchestration-status={projectionOrchestration.status}>
                <div className="mb-3 flex flex-col gap-1 text-xs md:flex-row md:items-center md:justify-between">
                  <span className="font-semibold uppercase tracking-[0.16em] text-violet-100">{projectionOrchestration.stageLabel}</span>
                  <span className="text-violet-100/65">{projectionOrchestration.detail}</span>
                </div>
                <div className="grid gap-2 md:grid-cols-4">
                  {projectionOrchestration.nodes.map((node) => (
                    <div key={node.id} className={`office-projection-orchestration__node border p-2 text-xs ${changeToneClass(node.tone)}`} data-office-projection-node={node.id} data-office-projection-node-motion={node.motion}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{node.label}</span>
                        <span className="tabular-nums">{node.value}</span>
                      </div>
                      <div className="mt-1 text-current/75">{node.detail}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  {projectionOrchestration.flows.map((flow) => (
                    <div key={flow.id} className={`office-projection-orchestration__flow border px-3 py-2 text-xs ${changeToneClass(flow.tone)}`} data-office-projection-flow={flow.id} data-office-projection-flow-active={flow.active ? "true" : "false"}>
                      <span className="office-projection-orchestration__packet" aria-hidden="true" />
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold">{flow.label}</span>
                        <span>{flow.from} → {flow.to}</span>
                      </div>
                      <div className="mt-1 text-current/75">{flow.detail}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 text-[11px] leading-4 text-violet-100/60">{projectionOrchestration.safetyNote}</div>
              </div>
            </div>
            <div className="mb-4 border border-cyan-300/15 bg-cyan-950/10 p-3" data-office-source-health-compact="true">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold uppercase tracking-[0.16em] text-cyan-100">{sourceHealthCompactDiagnostics.stageLabel}</span>
                <span className="text-midground/55">{sourceHealthCompactDiagnostics.detail}</span>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                {sourceHealthCompactDiagnostics.cards.map((card) => (
                  <div key={card.id} className={`border p-2 text-xs ${changeToneClass(card.tone)}`} data-office-source-health-compact-card={card.id} title={sourceHealthCompactDiagnostics.redactionNote}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{card.title}</span>
                      <span className="text-lg font-semibold leading-none">{card.count}</span>
                    </div>
                    <div className="mt-1 text-current/75">{card.detail}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[11px] leading-5 text-cyan-100/65">{sourceHealthCompactDiagnostics.redactionNote}</div>
            </div>
            <div className="mb-4 border border-cyan-300/15 bg-cyan-950/10 p-3" data-office-source-health-rail="true">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="font-semibold uppercase tracking-[0.16em] text-cyan-100">{sourceHealthRail.stageLabel}</span>
                <span className="text-midground/55">{sourceHealthRail.detail}</span>
              </div>
              <div className="grid gap-2 md:grid-cols-3 xl:grid-cols-6">
                {sourceHealthRail.items.map((item) => (
                  <div key={item.id} className={`border p-2 text-xs ${changeToneClass(item.tone)}`} data-office-source-health-rail-item={item.id} title={item.redactionNote}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold">{item.label}</span>
                      <span>{SOURCE_LABEL[item.status]}</span>
                    </div>
                    <div className="mt-1 text-current/75">{item.detail}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[11px] leading-5 text-cyan-100/65">{sourceHealthRail.redactionNote}</div>
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
      </OfficeSectionDrawer>

      {showOverview ? (
        <OfficeSectionDrawer plan={sectionById.paperclip}>
        <Card data-office-paperclip-workbench="true">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Database className="h-4 w-4" /> {paperclipWorkbench.stageLabel}
            </CardTitle>
            <div className="text-xs leading-5 text-midground/55">{paperclipWorkbench.detail} · {paperclipWorkbench.redactionNote}</div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 border border-cyan-300/15 bg-cyan-950/10 p-3" data-office-paperclip-manifest-visibility="true">
              <div className="mb-3 flex flex-col gap-1 text-xs md:flex-row md:items-center md:justify-between">
                <span className="font-semibold uppercase tracking-[0.16em] text-cyan-100">{paperclipManifestVisibility.stageLabel}</span>
                <span className="text-midground/60">{paperclipManifestVisibility.detail}</span>
              </div>
              <div className="grid gap-2 md:grid-cols-3">
                {paperclipManifestVisibility.cards.map((card) => (
                  <div key={card.id} className={`border px-3 py-2 ${changeToneClass(card.tone)}`} data-office-paperclip-manifest-card={card.id}>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-semibold">{card.title}</span>
                      <span className="text-lg font-semibold tabular-nums">{card.count}</span>
                    </div>
                    <div className="mt-1 text-[11px] leading-4 opacity-75">{card.detail}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[11px] leading-4 text-midground/50">{paperclipManifestVisibility.redactionNote}</div>
            </div>
            {paperclipMapProjection.slots.length > 0 ? (
              <div className="mb-4 border border-cyan-300/15 bg-black/20 p-3" aria-label={paperclipMapProjection.ariaLabel} data-office-paperclip-map-projection="true">
                <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                  <span className="font-semibold uppercase tracking-[0.16em] text-cyan-100">{paperclipMapProjection.stageLabel}</span>
                  <span className="text-midground/55">{paperclipMapProjection.detail}</span>
                </div>
                <div className="relative h-32 overflow-hidden border border-cyan-300/10 bg-gradient-to-br from-cyan-950/20 to-black/20" aria-hidden="true">
                  <div className="absolute inset-x-4 top-1/2 border-t border-dashed border-cyan-200/15" />
                  {paperclipMapProjection.slots.map((slot) => (
                    <span
                      key={`paperclip-map-${slot.id}`}
                      className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center border px-2 py-1 text-[10px] ${SOURCE_TONE[slot.health]}`}
                      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
                      title={`${slot.label} · ${slot.sourceType} · 항목 ${slot.itemCount} · 경고 ${slot.warningCount}`}
                      data-office-paperclip-map-slot={slot.id}
                    >
                      <span>▤</span>
                      <span className="max-w-20 truncate">{slot.label}</span>
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {paperclipWorkbench.sources.length === 0 ? (
              <div className="border border-dashed border-cyan-400/25 bg-cyan-950/10 p-4 text-sm text-cyan-100/75" data-office-paperclip-empty="true">
                연결된 Paperclip/source-tag 투영이 없습니다. 이것은 원문 자료 부재가 아니라 안전 manifest가 아직 보고되지 않은 상태입니다.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                {paperclipWorkbench.sources.map((source) => (
                  <PaperclipWorkbenchCard
                    key={source.id}
                    source={source}
                    onInspect={() => {
                      const inspector = buildOfficePaperclipInspector(source);
                      inspectRecord(inspector.kind, inspector.title, inspector.fields);
                    }}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </OfficeSectionDrawer>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-6">
          {showWork ? (
            <OfficeSectionDrawer plan={sectionById.work}>
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
            </OfficeSectionDrawer>
          ) : null}

          {showAutomation ? (
            <OfficeSectionDrawer plan={sectionById.automation}>
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
            </OfficeSectionDrawer>
          ) : null}

          {showRouting ? (
            <OfficeSectionDrawer plan={sectionById.routing}>
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
            </OfficeSectionDrawer>
          ) : null}

          {showOverview ? (
            <OfficeSectionDrawer plan={sectionById.events}>
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
            </OfficeSectionDrawer>
          ) : null}
        </div>

        <div className="xl:sticky xl:top-4 xl:self-start">
          <div className="mb-3 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-midground/55">
            <Filter className="h-3 w-3" /> 보기: {FOCUS_LABEL[focus]}
          </div>
          <OfficeDeskRpgInspectorPanel projection={deskRpgProjection} />
          <div className="mt-3">
            <InspectorPanel selection={selection} />
          </div>
        </div>
      </div>
    </div>
  );
}
