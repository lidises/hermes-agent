import { describe, expect, it } from "vitest";

import * as officeView from "./officeView";

import {
  buildOfficeAttentionItems,
  buildOfficeCharacterActivity,
  buildOfficeCharacterInspector,
  buildOfficeCharacterRoutes,
  buildOfficeCharacterSceneObjects,
  buildOfficeCharacterTrackingCues,
  buildOfficeCharacterView,
  buildOfficeCharacters,
  buildOfficeMapDensityPlan,
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
  buildOfficeSafeFloorLegend,
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
  buildOfficePaperclipWorkbench,
  buildOfficePaperclipInspector,
  buildOfficePaperclipManifestVisibility,
  buildOfficeKanbanProjection,
  buildOfficePaperclipMapProjection,
  buildOfficePageSectionPlan,
  buildOfficeMapFlows,
  buildOfficeMapNodes,
  buildOfficeSceneMotionTrack,
  buildOfficeSceneObjectView,
  buildOfficeSceneObjects,
  buildOfficeStateDelta,
  buildOfficeAutomationTimingSummary,
  buildOfficeEmptySourceCopyPlan,
  buildOfficeEmptyStateHints,
  buildOfficeSourceHealthSummary,
  buildOfficeSourceHealthRail,
  buildOfficeSourceHealthCompactDiagnostics,
  buildOfficeUsabilitySummary,
  mergeOfficeRecentChanges,
  resolveOfficeLiveTrackingInterval,
  groupByText,
  visibleRows,
  buildOfficeTimeDisplayPolicy,
  buildOfficeProjectionCacheSummary,
  buildOfficeProjectionOrchestration,
  buildOfficeMutationControlReadiness,
  buildOfficeRpgMissionStoryboard,
  buildOfficeRpgOrchestratorDesk,
  buildOfficeRpgKanbanBoardFacility,
  buildOfficeRpgSourceArchiveFacility,
  buildOfficeRpgReviewCornerFacility,
  buildOfficeRpgApprovalConsoleFacility,
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
  buildOfficeControlledMutationContractPostureProjection,
  buildOfficeControlledMutationContractPosturePolish,
  buildOfficeControlledMutationReadinessHandoffRibbon,
  buildOfficeControlledMutationReadinessSummaryPolish,
  buildOfficeControlledMutationRequestStorePosture,
  buildOfficeControlledMutationRequestStoreHardeningPlan,
  buildOfficeControlledMutationNextApprovalBoundary,
  buildOfficeControlledMutationPostDecisionApprovalBoundary,
  buildOfficeControlledMutationPostRegistryApprovalBoundary,
  buildOfficeControlledMutationTargetDispatchForbiddenBoundary,
  buildOfficeControlledMutationSafeContinuationCompletionReview,
  buildOfficeControlledMutationApprovalBoundarySummary,
  buildOfficeRpgScene,
  buildOfficeRpgRuntimeFanoutDrilldown,
  buildOfficeRpgFanoutApprovalEventBridge,
  buildOfficeRpgApprovalEventEnvelopeDetail,
  buildOfficeDeskRpgProjectionModel,
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
  buildOfficeWorkerFacilityLanePolish,
  buildOfficeWorkerRequestHandoffDetail,
  buildOfficeApprovalNasBoundaryPolish,
  buildOfficeApprovalAuthorityReadinessDetail,
  buildOfficeApprovalAuthorityDecisionEnvelopePreview,
  buildOfficeApprovalDecisionAuditNasTracePreview,
  buildOfficeNasKeeperSaveRequestGate,
  buildOfficeNasKeeperRollbackEvidencePreview,
  buildOfficeNasEvidencePackageStoreReadbackStatus,
  buildOfficeNasPathValidationStatusSurface,
  buildOfficeNasPathPreviewStatusSurface,
  buildOfficeNasPathPreviewStoreReadbackStatusSurface,
  buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface,
  buildOfficeNasRuntimeSingleFileWriteApprovalAction,
  buildOfficeNasKeeperQueueManualEvidenceReviewSurface,
  buildOfficeNasKeeperQueueEvidenceConsolidation,
  buildOfficeNasKeeperQueueReviewChecklist,
  buildOfficeDeskRpgReadOnlyChainCompletionReview,
  buildOfficeEventDrivenCharacterStateProjection,
  buildOfficeCharacterStateRoomOverlay,
  buildOfficeCharacterRoomInteractionPosture,
  buildOfficeCharacterInspectorDetailPosture,
  buildOfficeCharacterDetailSafeDialogueCopy,
  buildOfficeCharacterBubbleInspectorAlignment,
  buildOfficeCharacterPanelBoundarySummary,
  buildOfficeCharacterFacilityRoleLegend,
  buildOfficeCharacterFacilityBoundaryStrip,
  buildOfficeCharacterFacilitySourceLedgerStrip,
  buildOfficeCharacterFacilityCompletionReview,
  buildOfficeUnifiedWorkbenchView,
} from "./officeView";
import type { OfficeState } from "@/lib/api";

function officeFixture(overrides: Partial<OfficeState> = {}): OfficeState {
  return {
    schema_version: 1,
    generated_at: "2026-05-08T00:00:00Z",
    mode: "read_only",
    display_mode: "localhost",
    capabilities: {
      read_only: true,
      mutations_enabled: false,
      remote_mode: "unsupported",
    },
    data_sources: [],
    summary: {},
    rooms: [],
    agents: [],
    work_items: [],
    automations: [],
    topics: [],
    events: [],
    provenance: [],
    redactions: {
      policy_version: 1,
      redacted_field_count: 0,
      omitted_sections: [],
      warnings: [],
    },
    projection_cache: {
      schema_version: 1,
      status: "missing",
      redacted: true,
      cache_layout: { incoming: "incoming", active: "active", archive: "archive", rejected: "rejected" },
      active: null,
      rejected: { count: 0, recent: [] },
    },
    ...overrides,
  };
}

describe("OfficePage view helpers", () => {


describe("NAS Keeper Mac Relay Write Execution Action 1", () => {
  it("builds a safe single-action approval model for the protected Mac relay write endpoint", () => {
    const boundary = { detailKind: "nas_runtime_n3_approval_boundary_status_surface" } as ReturnType<typeof buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface>;

    const action = buildOfficeNasRuntimeSingleFileWriteApprovalAction(boundary);

    expect(action.stageLabel).toBe("NAS Keeper Mac Relay Write Execution Action 1");
    expect(action.detailKind).toBe("nas_runtime_single_file_write_approval_action");
    expect(action.endpoint).toBe("/api/office/controlled-mutation/nas-runtime/mac-relay-write-execute");
    expect(action.approvalRequired).toBe(true);
    expect(action.singleActionOnly).toBe(true);
    expect(action.enabledControls).toBe(1);
    expect(action.safeFields).toEqual(["relay_request_ref", "relay_execution_ref", "write_ref", "package_ref", "target_vault_ref", "safe_slug", "safe_title", "markdown_body", "requested_by", "requested_at", "nas_keeper_ref", "relay_node_ref", "relay_authorized_by", "relay_authorized_at"]);
    expect(action.rawPathInputEnabled).toBe(false);
    expect(action.credentialInputEnabled).toBe(false);
    expect(action.mountPathInputEnabled).toBe(false);
    expect(action.rawExcluded).toBe(true);
    expect(JSON.stringify(action)).not.toMatch(/raw write action prompt|raw write action task|Traceback|\/Users\/lidises|token-shaped-write-action|private-write-action-provider/i);
  });
});


describe("NAS Keeper Queue Manual Evidence Review Surface 1", () => {
  it("builds a read-only manual review model for the protected queue-state readback route", () => {
    const action = { detailKind: "nas_runtime_single_file_write_approval_action" } as ReturnType<typeof buildOfficeNasRuntimeSingleFileWriteApprovalAction>;

    const surface = buildOfficeNasKeeperQueueManualEvidenceReviewSurface(action);

    expect(surface.stageLabel).toBe("NAS Keeper Queue Manual Evidence Review Surface 1");
    expect(surface.detailKind).toBe("nas_keeper_queue_manual_evidence_review_surface");
    expect(surface.endpoint).toBe("/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-queue");
    expect(surface.enabledControls).toBe(0);
    expect(surface.queueReadbackEnabled).toBe(true);
    expect(surface.manualEvidenceReviewEnabled).toBe(true);
    expect(surface.browserFetchEnabled).toBe(false);
    expect(surface.queueMutationEnabled).toBe(false);
    expect(surface.macRelayExecutionEnabled).toBe(false);
    expect(surface.nasWriteEnabled).toBe(false);
    expect(surface.markdownBodyProjected).toBe(false);
    expect(surface.reviewCards.map((card) => card.id)).toEqual(["queue_summary", "manual_evidence", "terminal_state", "next_boundary"]);
    expect(JSON.stringify(surface)).not.toMatch(/raw queue prompt|raw markdown body|Traceback|\/Users\/lidises|token-shaped-queue-review|private-queue-provider/i);
  });
});


describe("NAS Keeper Queue Evidence Consolidation 1", () => {
  it("summarizes completed, failed, and manual-review queue evidence without enabling writes", () => {
    const readback = {
      listed: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_handoff_queue_readback",
        listed: true,
        queue_storage_ref: "queue:canonical",
        filters: {},
        effective_limit: 20,
        available_count: 5,
        count: 5,
        skipped_count: 1,
        markdown_body_included: false,
        capabilities: { read: true, write: false },
        next_required_boundary: "operator_review",
        items: [
          { handoff_ref: "handoff-succeeded", queue_ref: "queue-1", queue_status: "mac_relay_execution_succeeded", execution_evidence_refs: ["audit:ok", "readback:ok"], markdown_body_included: false },
          { handoff_ref: "handoff-failed", queue_ref: "queue-2", queue_status: "mac_relay_execution_failed", execution_evidence_refs: ["audit:failed"], markdown_body_included: false },
          { handoff_ref: "handoff-manual", queue_ref: "queue-3", queue_status: "manual_review_required", execution_evidence_refs: [], markdown_body_included: false },
          { handoff_ref: "handoff-authorized", queue_ref: "queue-4", queue_status: "authorized_for_mac_relay_execution", execution_evidence_refs: [], markdown_body_included: false },
          { handoff_ref: "handoff-pending", queue_ref: "queue-5", queue_status: "pending_nas_keeper_authorization", execution_evidence_refs: [], markdown_body_included: false },
        ],
      },
    } as unknown as Parameters<typeof buildOfficeNasKeeperQueueEvidenceConsolidation>[0];

    const consolidation = buildOfficeNasKeeperQueueEvidenceConsolidation(readback);

    expect(consolidation.stageLabel).toBe("NAS Keeper Queue Evidence Consolidation 1");
    expect(consolidation.totalItems).toBe(5);
    expect(consolidation.skippedUnsafeCount).toBe(1);
    expect(consolidation.terminalCount).toBe(2);
    expect(consolidation.succeededCount).toBe(1);
    expect(consolidation.failedCount).toBe(1);
    expect(consolidation.manualReviewCount).toBe(1);
    expect(consolidation.openAuthorizedCount).toBe(1);
    expect(consolidation.evidenceRefCount).toBe(3);
    expect(consolidation.lanes.map((lane) => lane.id)).toEqual(["succeeded", "failed", "manual_review", "authorized", "pending"]);
    expect(consolidation.lanes.find((lane) => lane.id === "succeeded")?.terminal).toBe(true);
    expect(consolidation.queueMutationEnabled).toBe(false);
    expect(consolidation.macRelayExecutionEnabled).toBe(false);
    expect(consolidation.nasWriteEnabled).toBe(false);
    expect(consolidation.markdownBodyProjected).toBe(false);
    expect(JSON.stringify(consolidation)).not.toMatch(/raw markdown body|Traceback|\/Users\/lidises|token-shaped-evidence|private-provider/i);
  });
});


describe("NAS Keeper Queue Review Checklist 1", () => {
  it("turns queue evidence consolidation into an explicit operator review checklist without enabling writes", () => {
    const readback = {
      listed: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_handoff_queue_readback",
        listed: true,
        queue_storage_ref: "queue:canonical",
        filters: {},
        effective_limit: 20,
        available_count: 3,
        count: 3,
        skipped_count: 1,
        markdown_body_included: false,
        capabilities: { read: true, write: false },
        next_required_boundary: "operator_review",
        items: [
          { handoff_ref: "handoff-succeeded", queue_ref: "queue-1", queue_status: "mac_relay_execution_succeeded", execution_evidence_refs: ["audit:ok", "readback:ok"], markdown_body_included: false },
          { handoff_ref: "handoff-failed", queue_ref: "queue-2", queue_status: "mac_relay_execution_failed", execution_evidence_refs: ["audit:failed"], markdown_body_included: false },
          { handoff_ref: "handoff-authorized", queue_ref: "queue-3", queue_status: "authorized_for_mac_relay_execution", execution_evidence_refs: [], markdown_body_included: false },
        ],
      },
    } as unknown as Parameters<typeof buildOfficeNasKeeperQueueEvidenceConsolidation>[0];
    const consolidation = buildOfficeNasKeeperQueueEvidenceConsolidation(readback);

    const checklist = buildOfficeNasKeeperQueueReviewChecklist(consolidation);

    expect(checklist.stageLabel).toBe("NAS Keeper Queue Review Checklist 1");
    expect(checklist.sourceStageLabel).toBe("NAS Keeper Queue Evidence Consolidation 1");
    expect(checklist.checks.map((check) => check.id)).toEqual(["terminal_evidence", "open_authorized", "manual_review", "unsafe_skips", "next_boundary"]);
    expect(checklist.completedCheckCount).toBe(3);
    expect(checklist.blockingCheckCount).toBe(2);
    expect(checklist.readyForReplaceRollbackSmoke).toBe(false);
    expect(checklist.nextRecommendedAction).toBe("close_open_authorized_or_manual_review_items_first");
    expect(checklist.enabledControls).toBe(0);
    expect(checklist.queueMutationEnabled).toBe(false);
    expect(checklist.macRelayExecutionEnabled).toBe(false);
    expect(checklist.nasWriteEnabled).toBe(false);
    expect(checklist.watcherCronDaemonEnabled).toBe(false);
    expect(checklist.authorityAdapterBindingEnabled).toBe(false);
    expect(checklist.markdownBodyProjected).toBe(false);
    expect(checklist.rawExcluded).toBe(true);
    expect(JSON.stringify(checklist)).not.toMatch(/raw markdown body|Traceback|\/Users\/lidises|token-shaped-review-checklist|private-provider/i);
  });
});



describe("Worker Facility Lane Polish 1", () => {
  it("builds safe facility-level worker lane polish without assignment or dispatch controls", () => {
    const secretSentinel = ["token", "shaped", "worker", "lane", "polish"].join("-");
    const state = officeFixture({
      agents: [{ id: "agent-worker-lane", status: "active", prompt: "raw worker lane prompt", provider: "private-worker-lane-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-worker-lane", status: "blocked", title: "raw worker lane task", body: "/Users/lidises/private/worker-lane.md", transcript: "Traceback worker lane transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-15T00:00:00Z", item_count: 7, warning_count: 2, error_summary: "Traceback worker lane source" },
      ],
    });
    const projection = buildOfficeDeskRpgProjectionModel(state);
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
    const timeline = buildOfficeEventTimelineProjection(contract, inspector);
    const workerRoles = buildOfficeDeskRpgWorkerRoleVisibility(projection);
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
    const drilldown = buildOfficeTimelineWorkerHandoffDrilldown(timeline, workerRoles, handoff);
    const approvalView = buildOfficeApprovalRequestView(state);
    const audit = buildOfficeApprovalAuditTimeline(approvalView);
    const gate = buildOfficeApprovalExecutionGate(audit);
    const authority = buildOfficeAuthorityAdapterContract(gate);
    const queue = buildOfficeOrchestratorMediationQueue(authority);
    const routing = buildOfficeWorkerIntentRouting(queue);
    const readiness = buildOfficeWorkerFacilityReadiness(routing);

    const polish = buildOfficeWorkerFacilityLanePolish(drilldown, readiness);

    expect(polish.stageLabel).toBe("Worker Facility Lane Polish 1");
    expect(polish.detailKind).toBe("worker_facility_lane_polish");
    expect(polish.lanes.map((lane) => lane.workerRole)).toEqual(["search_worker", "reviewer", "wiki_writer", "nas_keeper"]);
    expect(polish.lanes.map((lane) => lane.id)).toEqual(["lane_search_worker", "lane_reviewer", "lane_wiki_writer", "lane_nas_keeper"]);
    expect(polish.laneCount).toBe(4);
    expect(polish.readinessFacilityCount).toBe(3);
    expect(polish.prerequisiteCount).toBe(9);
    expect(polish.enabledControls).toBe(0);
    expect(polish.facilityWriteEnabled).toBe(false);
    expect(polish.workAssignmentEnabled).toBe(false);
    expect(polish.requestCreationEnabled).toBe(false);
    expect(polish.dispatchEnabled).toBe(false);
    expect(polish.auditWriteEnabled).toBe(false);
    expect(polish.nasSaveEnabled).toBe(false);
    expect(polish.safeProjectionOnly).toBe(true);
    expect(polish.rawExcluded).toBe(true);
    expect(polish.lanes.every((lane) => lane.assignmentEnabled === false && lane.dispatchEnabled === false && lane.rawExcluded === true)).toBe(true);
    expect(JSON.stringify(polish)).not.toMatch(/raw worker lane prompt|raw worker lane task|Traceback|\/Users\/lidises|token-shaped-worker-lane-polish|private-worker-lane-provider/i);
  });
});


describe("Approval-request Detail Deepening 1", () => {
  it("builds a safe approval-request detail deepening projection without executable controls", () => {
    const secretSentinel = ["token", "shaped", "approval", "detail"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-approval-detail", status: "active", prompt: "raw approval detail prompt", provider: "private-approval-detail-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-approval-detail", status: "blocked", title: "raw approval detail task", body: "/Users/lidises/private/approval-detail.md", transcript: "Traceback approval detail transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-15T00:00:00Z", item_count: 8, warning_count: 2, error_summary: "Traceback approval detail source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
    const timeline = buildOfficeEventTimelineProjection(contract, inspector);
    const workerRoles = buildOfficeDeskRpgWorkerRoleVisibility(projection);
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
    const drilldown = buildOfficeTimelineWorkerHandoffDrilldown(timeline, workerRoles, handoff);

    const detail = buildOfficeApprovalRequestDetailDeepening(route, timeline, drilldown);

    expect(detail.stageLabel).toBe("Approval-request Detail Deepening 1");
    expect(detail.detailKind).toBe("approval_request_detail_deepening");
    expect(detail.requestState).toBe("projection_only");
    expect(detail.sections.map((section) => section.id)).toEqual(["request_snapshot", "timeline_alignment", "worker_handoff", "write_boundary"]);
    expect(detail.routeCardCount).toBe(4);
    expect(detail.timelineEventCount).toBe(4);
    expect(detail.handoffStepCount).toBe(4);
    expect(detail.evidenceCount).toBe(1);
    expect(detail.blockedWorkCount).toBe(1);
    expect(detail.warningCount).toBe(1);
    expect(detail.enabledControls).toBe(0);
    expect(detail.approveEnabled).toBe(false);
    expect(detail.rejectEnabled).toBe(false);
    expect(detail.holdEnabled).toBe(false);
    expect(detail.requestCreationEnabled).toBe(false);
    expect(detail.eventCreationEnabled).toBe(false);
    expect(detail.eventPersistenceEnabled).toBe(false);
    expect(detail.workAssignmentEnabled).toBe(false);
    expect(detail.dispatchEnabled).toBe(false);
    expect(detail.auditWriteEnabled).toBe(false);
    expect(detail.nasSaveEnabled).toBe(false);
    expect(detail.safeProjectionOnly).toBe(true);
    expect(detail.rawExcluded).toBe(true);
    expect(JSON.stringify(detail)).not.toMatch(/raw approval detail prompt|raw approval detail task|Traceback|\/Users\/lidises|token-shaped-approval-detail|private-approval-detail-provider/i);
  });
});
describe("Desk RPG Worker Role Visibility 1", () => {
  it("builds safe worker role visibility without assignment or dispatch authority", () => {
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw worker prompt", provider: "private-worker-provider", api_key: "token-shaped-worker-sentinel" },
        { id: "agent-2", status: "active", prompt: "raw worker prompt 2" },
        { id: "agent-3", status: "active" },
        { id: "agent-4", status: "active" },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw worker task title", body: "/Users/lidises/private/worker.md" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 2, warning_count: 1, error_summary: "Traceback worker source" },
      ],
    }));

    const visibility = buildOfficeDeskRpgWorkerRoleVisibility(projection);

    expect(visibility.stageLabel).toBe("Desk RPG Worker Role Visibility 1");
    expect(visibility.roles.map((role) => role.role)).toEqual(["search_worker", "reviewer", "wiki_writer", "nas_keeper"]);
    expect(visibility.roles.map((role) => role.facilityId)).toEqual(["worker_cluster", "right_inspector", "central_board", "nas_vault"]);
    expect(visibility.roles.find((role) => role.role === "search_worker")?.visibleInstances).toBe(3);
    expect(visibility.suppressedRuntimeInstances).toBe(1);
    expect(visibility.assignmentEnabled).toBe(false);
    expect(visibility.requestCreationEnabled).toBe(false);
    expect(visibility.dispatchEnabled).toBe(false);
    expect(visibility.enabledControls).toBe(0);
    expect(visibility.safeProjectionOnly).toBe(true);
    expect(visibility.rawExcluded).toBe(true);
    expect(JSON.stringify(visibility)).not.toMatch(/raw worker prompt|raw worker task title|Traceback|\/Users\/lidises|token-shaped-worker-sentinel|private-worker-provider/i);
  });
});

describe("Disabled Approval Dialogue Posture 1", () => {
  it("builds a safe disabled approval dialogue posture without request creation or execution", () => {
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw dialogue prompt", provider: "private-dialogue-provider", api_key: "token-shaped-dialogue-sentinel" },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw dialogue task title", body: "/Users/lidises/private/dialogue.md" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 3, warning_count: 1, error_summary: "Traceback dialogue source" },
      ],
    }));

    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);

    expect(dialogue.stageLabel).toBe("Disabled Approval Dialogue Posture 1");
    expect(dialogue.speakerRole).toBe("orchestrator");
    expect(dialogue.targetRole).toBe("user_boss");
    expect(dialogue.dialogueKind).toBe("approval_request_posture");
    expect(dialogue.enabledControls).toBe(0);
    expect(dialogue.approveEnabled).toBe(false);
    expect(dialogue.rejectEnabled).toBe(false);
    expect(dialogue.holdEnabled).toBe(false);
    expect(dialogue.requestCreationEnabled).toBe(false);
    expect(dialogue.dispatchEnabled).toBe(false);
    expect(dialogue.nasSaveEnabled).toBe(false);
    expect(dialogue.safeProjectionOnly).toBe(true);
    expect(dialogue.rawExcluded).toBe(true);
    expect(dialogue.dialogueLines.map((line) => line.id)).toEqual(["report", "approval", "boundary"]);
    expect(JSON.stringify(dialogue)).not.toMatch(/raw dialogue prompt|raw dialogue task title|Traceback|\/Users\/lidises|token-shaped-dialogue-sentinel|private-dialogue-provider/i);
  });
});

describe("Reviewer/Wiki Handoff Posture 1", () => {
  it("builds a safe reviewer to wiki handoff posture without assignment, dispatch, or persistence", () => {
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw handoff prompt", provider: "private-handoff-provider", api_key: "token-shaped-handoff-sentinel" },
        { id: "agent-2", status: "active", transcript: "Traceback handoff transcript" },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw reviewer wiki task title", body: "/Users/lidises/private/handoff.md" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 4, warning_count: 2, error_summary: "Traceback handoff source" },
      ],
    }));

    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);

    expect(handoff.stageLabel).toBe("Reviewer/Wiki Handoff Posture 1");
    expect(handoff.handoffKind).toBe("review_to_wiki_posture");
    expect(handoff.sequence.map((step) => step.id)).toEqual(["search_evidence", "review_gate", "wiki_draft", "nas_boundary"]);
    expect(handoff.sequence.map((step) => step.actorRole)).toEqual(["search_worker", "reviewer", "wiki_writer", "nas_keeper"]);
    expect(handoff.evidenceCount).toBe(1);
    expect(handoff.warningCount).toBe(1);
    expect(handoff.blockedWorkCount).toBe(1);
    expect(handoff.reviewEnabled).toBe(false);
    expect(handoff.wikiDraftEnabled).toBe(false);
    expect(handoff.assignmentEnabled).toBe(false);
    expect(handoff.requestCreationEnabled).toBe(false);
    expect(handoff.dispatchEnabled).toBe(false);
    expect(handoff.nasSaveEnabled).toBe(false);
    expect(handoff.enabledControls).toBe(0);
    expect(handoff.safeProjectionOnly).toBe(true);
    expect(handoff.rawExcluded).toBe(true);
    expect(JSON.stringify(handoff)).not.toMatch(/raw handoff prompt|raw reviewer wiki task title|Traceback|\/Users\/lidises|token-shaped-handoff-sentinel|private-handoff-provider/i);
  });
});

describe("Approval Dialogue Inspector Detail 1", () => {
  it("builds safe inspector detail for the approval dialogue without decisions or persistence", () => {
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw inspector prompt", provider: "private-inspector-provider", api_key: "token-shaped-inspector-sentinel" },
        { id: "agent-2", status: "active", transcript: "Traceback inspector transcript" },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw approval inspector task title", body: "/Users/lidises/private/inspector.md" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 5, warning_count: 2, error_summary: "Traceback inspector source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);

    const inspector = buildOfficeApprovalDialogueInspectorDetail(dialogue, handoff);

    expect(inspector.stageLabel).toBe("Approval Dialogue Inspector Detail 1");
    expect(inspector.inspectorKind).toBe("approval_dialogue_detail_posture");
    expect(inspector.cards.map((card) => card.id)).toEqual(["dialogue_summary", "review_handoff", "decision_boundary", "nas_boundary"]);
    expect(inspector.dialogueLineCount).toBe(3);
    expect(inspector.handoffStepCount).toBe(4);
    expect(inspector.enabledControls).toBe(0);
    expect(inspector.approveEnabled).toBe(false);
    expect(inspector.rejectEnabled).toBe(false);
    expect(inspector.holdEnabled).toBe(false);
    expect(inspector.reviewEnabled).toBe(false);
    expect(inspector.wikiDraftEnabled).toBe(false);
    expect(inspector.assignmentEnabled).toBe(false);
    expect(inspector.requestCreationEnabled).toBe(false);
    expect(inspector.dispatchEnabled).toBe(false);
    expect(inspector.auditWriteEnabled).toBe(false);
    expect(inspector.nasSaveEnabled).toBe(false);
    expect(inspector.safeProjectionOnly).toBe(true);
    expect(inspector.rawExcluded).toBe(true);
    expect(JSON.stringify(inspector)).not.toMatch(/raw inspector prompt|raw approval inspector task title|Traceback|\/Users\/lidises|token-shaped-inspector-sentinel|private-inspector-provider/i);
  });
});

describe("Reviewer/Wiki Evidence Detail Posture 1", () => {
  it("builds safe evidence detail cards for reviewer and wiki without raw sources or writes", () => {
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw evidence prompt", provider: "private-evidence-provider", api_key: "token-shaped-evidence-sentinel" },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw evidence detail task title", body: "/Users/lidises/private/evidence.md", transcript: "Traceback evidence transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 7, warning_count: 3, error_summary: "Traceback evidence source" },
      ],
    }));
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);

    const evidenceDetail = buildOfficeReviewerWikiEvidenceDetailPosture(projection, handoff);

    expect(evidenceDetail.stageLabel).toBe("Reviewer/Wiki Evidence Detail Posture 1");
    expect(evidenceDetail.detailKind).toBe("reviewer_wiki_evidence_detail_posture");
    expect(evidenceDetail.cards.map((card) => card.id)).toEqual(["safe_evidence_count", "review_warning_count", "wiki_material_posture", "nas_save_boundary"]);
    expect(evidenceDetail.evidenceCount).toBe(1);
    expect(evidenceDetail.warningCount).toBe(1);
    expect(evidenceDetail.handoffStepCount).toBe(4);
    expect(evidenceDetail.enabledControls).toBe(0);
    expect(evidenceDetail.rawSourceVisible).toBe(false);
    expect(evidenceDetail.sourceOpenEnabled).toBe(false);
    expect(evidenceDetail.reviewEnabled).toBe(false);
    expect(evidenceDetail.wikiDraftEnabled).toBe(false);
    expect(evidenceDetail.assignmentEnabled).toBe(false);
    expect(evidenceDetail.requestCreationEnabled).toBe(false);
    expect(evidenceDetail.dispatchEnabled).toBe(false);
    expect(evidenceDetail.auditWriteEnabled).toBe(false);
    expect(evidenceDetail.nasSaveEnabled).toBe(false);
    expect(evidenceDetail.safeProjectionOnly).toBe(true);
    expect(evidenceDetail.rawExcluded).toBe(true);
    expect(JSON.stringify(evidenceDetail)).not.toMatch(/raw evidence prompt|raw evidence detail task title|Traceback|\/Users\/lidises|token-shaped-evidence-sentinel|private-evidence-provider/i);
  });
});



describe("Board Evidence-to-Inspector Drill-down 1", () => {
  it("builds a safe board-to-inspector drill-down posture without opening sources or creating requests", () => {
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw drilldown prompt", provider: "private-drilldown-provider", api_key: "token-shaped-drilldown-sentinel" },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw drilldown task title", body: "/Users/lidises/private/drilldown.md", transcript: "Traceback drilldown transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 9, warning_count: 4, error_summary: "Traceback drilldown source" },
      ],
    }));
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
    const evidenceDetail = buildOfficeReviewerWikiEvidenceDetailPosture(projection, handoff);

    const drilldown = buildOfficeBoardEvidenceInspectorDrilldown(projection, evidenceDetail);

    expect(drilldown.stageLabel).toBe("Board Evidence-to-Inspector Drill-down 1");
    expect(drilldown.drilldownKind).toBe("board_evidence_to_inspector_posture");
    expect(drilldown.cards.map((card) => card.id)).toEqual(["central_board", "evidence_tab", "right_inspector", "approval_boundary"]);
    expect(drilldown.boardWorkCount).toBe(1);
    expect(drilldown.boardBlockedCount).toBe(1);
    expect(drilldown.evidenceCount).toBe(1);
    expect(drilldown.warningCount).toBe(1);
    expect(drilldown.inspectorCardCount).toBe(4);
    expect(drilldown.enabledControls).toBe(0);
    expect(drilldown.boardOpenEnabled).toBe(false);
    expect(drilldown.sourceOpenEnabled).toBe(false);
    expect(drilldown.inspectorWriteEnabled).toBe(false);
    expect(drilldown.requestCreationEnabled).toBe(false);
    expect(drilldown.dispatchEnabled).toBe(false);
    expect(drilldown.auditWriteEnabled).toBe(false);
    expect(drilldown.nasSaveEnabled).toBe(false);
    expect(drilldown.safeProjectionOnly).toBe(true);
    expect(drilldown.rawExcluded).toBe(true);
    expect(JSON.stringify(drilldown)).not.toMatch(/raw drilldown prompt|raw drilldown task title|Traceback|\/Users\/lidises|token-shaped-drilldown-sentinel|private-drilldown-provider/i);
  });
});

describe("Desk RPG Fanout Approval Event Bridge 1", () => {
  it("bridges aggregate fan-out lanes toward approval event posture without writes or raw row leakage", () => {
    const secretSentinel = ["token", "shaped", "fanout", "bridge"].join("-");
    const state = officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw fanout bridge prompt", provider: "private-fanout-provider", api_key: secretSentinel },
        { id: "agent-2", status: "active", prompt: "raw fanout bridge prompt", provider: "private-fanout-provider", api_key: secretSentinel },
        { id: "agent-3", status: "active", prompt: "raw fanout bridge prompt", provider: "private-fanout-provider", api_key: secretSentinel },
        { id: "agent-4", status: "active", prompt: "raw fanout bridge prompt", provider: "private-fanout-provider", api_key: secretSentinel },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw fanout bridge task", body: "/Users/lidises/private/fanout-bridge.md", transcript: "Traceback fanout bridge transcript" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [
        { id: "cron-1", status: "paused", name: "raw fanout bridge cron", schedule: "* * * * *" },
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 13, warning_count: 6, error_summary: "Traceback fanout bridge source" },
      ],
    });
    const projection = buildOfficeDeskRpgProjectionModel(state);
    const scene = buildOfficeRpgScene(state);
    const fanout = buildOfficeRpgRuntimeFanoutDrilldown(scene);
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);

    const bridge = buildOfficeRpgFanoutApprovalEventBridge(fanout, route);

    expect(bridge.stageLabel).toBe("Desk RPG Fanout Approval Event Bridge 1");
    expect(bridge.bridgeKind).toBe("desk_rpg_fanout_approval_event_bridge");
    expect(bridge.cards.map((card) => card.id)).toEqual(["aggregate_fanout", "request_envelope", "approval_event_gate", "write_boundary"]);
    expect(bridge.sourceFanoutKind).toBe("runtime_fanout_drilldown");
    expect(bridge.sourceRouteKind).toBe("approval_request_route_detail");
    expect(bridge.aggregateLaneCount).toBe(5);
    expect(bridge.hiddenRuntimeCount).toBeGreaterThanOrEqual(1);
    expect(bridge.approvalRouteCardCount).toBe(4);
    expect(bridge.enabledControls).toBe(0);
    expect(bridge.requestCreationEnabled).toBe(false);
    expect(bridge.approvalEventCreationEnabled).toBe(false);
    expect(bridge.eventPersistenceEnabled).toBe(false);
    expect(bridge.kanbanWriteEnabled).toBe(false);
    expect(bridge.dispatchEnabled).toBe(false);
    expect(bridge.auditWriteEnabled).toBe(false);
    expect(bridge.nasSaveEnabled).toBe(false);
    expect(bridge.safeProjectionOnly).toBe(true);
    expect(bridge.rawExcluded).toBe(true);
    expect(JSON.stringify(bridge)).not.toMatch(/raw fanout bridge prompt|raw fanout bridge task|Traceback|\/Users\/lidises|token-shaped-fanout-bridge|private-fanout-provider/i);
  });
});



describe("Desk RPG Approval Event Envelope Detail 1", () => {
  it("projects a disabled approval-event envelope without creating events, writes, or raw payloads", () => {
    const secretSentinel = ["token", "shaped", "approval", "envelope"].join("-");
    const state = officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw approval envelope prompt", provider: "private-approval-envelope-provider", api_key: secretSentinel },
        { id: "agent-2", status: "active", prompt: "raw approval envelope prompt", provider: "private-approval-envelope-provider", api_key: secretSentinel },
        { id: "agent-3", status: "active", prompt: "raw approval envelope prompt", provider: "private-approval-envelope-provider", api_key: secretSentinel },
        { id: "agent-4", status: "active", prompt: "raw approval envelope prompt", provider: "private-approval-envelope-provider", api_key: secretSentinel },
      ],
      work_items: [
        { id: "task-approval-envelope", status: "blocked", title: "raw approval envelope task", body: "/Users/lidises/private/approval-envelope.md", transcript: "Traceback approval envelope transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-20T00:00:00Z", item_count: 8, warning_count: 3, error_summary: "Traceback approval envelope source" },
      ],
    });
    const projection = buildOfficeDeskRpgProjectionModel(state);
    const scene = buildOfficeRpgScene(state);
    const fanout = buildOfficeRpgRuntimeFanoutDrilldown(scene);
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const requestEnvelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(requestEnvelope, dialogue);
    const bridge = buildOfficeRpgFanoutApprovalEventBridge(fanout, route);

    const envelope = buildOfficeRpgApprovalEventEnvelopeDetail(bridge);

    expect(envelope.stageLabel).toBe("Desk RPG Approval Event Envelope Detail 1");
    expect(envelope.detailKind).toBe("desk_rpg_approval_event_envelope_detail");
    expect(envelope.sourceBridgeKind).toBe("desk_rpg_fanout_approval_event_bridge");
    expect(envelope.envelopeFields.map((field) => field.id)).toEqual(["request_id", "approval_event_id", "idempotency_key", "readback_anchor", "audit_anchor"]);
    expect(envelope.requiredFieldCount).toBe(5);
    expect(envelope.sourceBridgeCardCount).toBe(4);
    expect(envelope.aggregateLaneCount).toBe(5);
    expect(envelope.hiddenRuntimeCount).toBeGreaterThanOrEqual(1);
    expect(envelope.enabledControls).toBe(0);
    expect(envelope.requestRowCreated).toBe(false);
    expect(envelope.approvalEventCreated).toBe(false);
    expect(envelope.eventPersisted).toBe(false);
    expect(envelope.idempotencyKeyReserved).toBe(false);
    expect(envelope.readbackPerformed).toBe(false);
    expect(envelope.auditEventAppended).toBe(false);
    expect(envelope.kanbanWriteEnabled).toBe(false);
    expect(envelope.dispatchEnabled).toBe(false);
    expect(envelope.nasSaveEnabled).toBe(false);
    expect(envelope.safeProjectionOnly).toBe(true);
    expect(envelope.rawExcluded).toBe(true);
    expect(JSON.stringify(envelope)).not.toMatch(/raw approval envelope prompt|raw approval envelope task|Traceback|\/Users\/lidises|token-shaped-approval-envelope|private-approval-envelope-provider/i);
  });
});

describe("Boss/Orchestrator Request Posture Detail 1", () => {
  it("builds safe request posture detail without creating requests or exposing raw instruction material", () => {
    const secretSentinel = ["token", "shaped", "boss", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw boss request prompt", provider: "private-boss-provider", api_key: secretSentinel },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw boss request task title", body: "/Users/lidises/private/boss-request.md", transcript: "Traceback boss request transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 5, warning_count: 2, error_summary: "Traceback boss request source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const detail = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);

    expect(detail.stageLabel).toBe("Boss/Orchestrator Request Posture Detail 1");
    expect(detail.detailKind).toBe("boss_orchestrator_request_posture_detail");
    expect(detail.cards.map((card) => card.id)).toEqual(["boss_instruction_point", "orchestrator_mediation", "request_envelope", "approval_boundary"]);
    expect(detail.speakerRole).toBe("user_boss");
    expect(detail.orchestratorRole).toBe("orchestrator");
    expect(detail.targetFacilityId).toBe("orchestrator_desk");
    expect(detail.evidenceCount).toBe(1);
    expect(detail.blockedWorkCount).toBe(1);
    expect(detail.dialogueLineCount).toBe(3);
    expect(detail.enabledControls).toBe(0);
    expect(detail.inputEnabled).toBe(false);
    expect(detail.requestCreationEnabled).toBe(false);
    expect(detail.orchestratorRequired).toBe(true);
    expect(detail.workAssignmentEnabled).toBe(false);
    expect(detail.dispatchEnabled).toBe(false);
    expect(detail.auditWriteEnabled).toBe(false);
    expect(detail.nasSaveEnabled).toBe(false);
    expect(detail.safeProjectionOnly).toBe(true);
    expect(detail.rawExcluded).toBe(true);
    expect(JSON.stringify(detail)).not.toMatch(/raw boss request prompt|raw boss request task title|Traceback|\/Users\/lidises|token-shaped-boss-sentinel|private-boss-provider/i);
  });
});

describe("Orchestrator Request Envelope Detail 1", () => {
  it("builds a safe disabled request envelope detail without writing request records", () => {
    const secretSentinel = ["token", "shaped", "envelope", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw envelope prompt", provider: "private-envelope-provider", api_key: secretSentinel },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw envelope task title", body: "/Users/lidises/private/envelope.md", transcript: "Traceback envelope transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 7, warning_count: 3, error_summary: "Traceback envelope source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);

    expect(envelope.stageLabel).toBe("Orchestrator Request Envelope Detail 1");
    expect(envelope.detailKind).toBe("orchestrator_request_envelope_detail");
    expect(envelope.cards.map((card) => card.id)).toEqual(["instruction_intake", "mediation_guard", "safe_context_envelope", "approval_request_boundary"]);
    expect(envelope.sourcePostureKind).toBe("boss_orchestrator_request_posture_detail");
    expect(envelope.envelopeState).toBe("disabled_preview");
    expect(envelope.targetFacilityId).toBe("orchestrator_desk");
    expect(envelope.evidenceCount).toBe(1);
    expect(envelope.blockedWorkCount).toBe(1);
    expect(envelope.dialogueLineCount).toBe(3);
    expect(envelope.enabledControls).toBe(0);
    expect(envelope.envelopeCreationEnabled).toBe(false);
    expect(envelope.kanbanWriteEnabled).toBe(false);
    expect(envelope.workAssignmentEnabled).toBe(false);
    expect(envelope.dispatchEnabled).toBe(false);
    expect(envelope.auditWriteEnabled).toBe(false);
    expect(envelope.nasSaveEnabled).toBe(false);
    expect(envelope.safeProjectionOnly).toBe(true);
    expect(envelope.rawExcluded).toBe(true);
    expect(JSON.stringify(envelope)).not.toMatch(/raw envelope prompt|raw envelope task title|Traceback|\/Users\/lidises|token-shaped-envelope-sentinel|private-envelope-provider/i);
  });
});


describe("Approval Request Route Detail 1", () => {
  it("builds a safe approval route detail without creating events, approvals, or writes", () => {
    const secretSentinel = ["token", "shaped", "route", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw route prompt", provider: "private-route-provider", api_key: secretSentinel },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw route task title", body: "/Users/lidises/private/route.md", transcript: "Traceback route transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 9, warning_count: 4, error_summary: "Traceback route source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);

    expect(route.stageLabel).toBe("Approval Request Route Detail 1");
    expect(route.detailKind).toBe("approval_request_route_detail");
    expect(route.cards.map((card) => card.id)).toEqual(["intent_event_boundary", "orchestrator_plan_boundary", "approval_request_boundary", "write_audit_boundary"]);
    expect(route.sourceEnvelopeKind).toBe("orchestrator_request_envelope_detail");
    expect(route.routeState).toBe("read_only_preview");
    expect(route.evidenceCount).toBe(1);
    expect(route.blockedWorkCount).toBe(1);
    expect(route.dialogueLineCount).toBe(3);
    expect(route.enabledControls).toBe(0);
    expect(route.intentEventCreationEnabled).toBe(false);
    expect(route.approvalRequestEnabled).toBe(false);
    expect(route.kanbanWriteEnabled).toBe(false);
    expect(route.auditWriteEnabled).toBe(false);
    expect(route.dispatchEnabled).toBe(false);
    expect(route.nasSaveEnabled).toBe(false);
    expect(route.safeProjectionOnly).toBe(true);
    expect(route.rawExcluded).toBe(true);
    expect(JSON.stringify(route)).not.toMatch(/raw route prompt|raw route task title|Traceback|\/Users\/lidises|token-shaped-route-sentinel|private-route-provider/i);
  });
});


describe("Event Request Contract Projection 1", () => {
  it("projects the future request event contract without creating schemas, events, or writes", () => {
    const secretSentinel = ["token", "shaped", "event", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw event prompt", provider: "private-event-provider", api_key: secretSentinel },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw event task title", body: "/Users/lidises/private/event.md", transcript: "Traceback event transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 11, warning_count: 5, error_summary: "Traceback event source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);

    expect(contract.stageLabel).toBe("Event Request Contract Projection 1");
    expect(contract.detailKind).toBe("event_request_contract_projection");
    expect(contract.cards.map((card) => card.id)).toEqual(["user_instruction_submitted", "orchestrator_plan_requested", "approval_requested", "write_audit_projection"]);
    expect(contract.sourceRouteKind).toBe("approval_request_route_detail");
    expect(contract.contractState).toBe("read_only_projection");
    expect(contract.evidenceCount).toBe(1);
    expect(contract.blockedWorkCount).toBe(1);
    expect(contract.dialogueLineCount).toBe(3);
    expect(contract.enabledControls).toBe(0);
    expect(contract.schemaWriteEnabled).toBe(false);
    expect(contract.eventCreationEnabled).toBe(false);
    expect(contract.eventPersistenceEnabled).toBe(false);
    expect(contract.runtimeDispatchEnabled).toBe(false);
    expect(contract.auditWriteEnabled).toBe(false);
    expect(contract.nasSaveEnabled).toBe(false);
    expect(contract.safeProjectionOnly).toBe(true);
    expect(contract.rawExcluded).toBe(true);
    expect(JSON.stringify(contract)).not.toMatch(/raw event prompt|raw event task title|Traceback|\/Users\/lidises|token-shaped-event-sentinel|private-event-provider/i);
  });
});


describe("Approval Dialogue Route Inspector 1", () => {
  it("builds a read-only approval dialogue route inspector without creating requests, events, or writes", () => {
    const secretSentinel = ["token", "shaped", "dialogue", "route", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw dialogue route prompt", provider: "private-dialogue-route-provider", api_key: secretSentinel },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw dialogue route task title", body: "/Users/lidises/private/dialogue-route.md", transcript: "Traceback dialogue route transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 13, warning_count: 6, error_summary: "Traceback dialogue route source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);

    expect(inspector.stageLabel).toBe("Approval Dialogue Route Inspector 1");
    expect(inspector.detailKind).toBe("approval_dialogue_route_inspector");
    expect(inspector.cards.map((card) => card.id)).toEqual(["dialogue_posture", "route_boundaries", "event_contract", "write_lock"]);
    expect(inspector.sourceDialogueKind).toBe("disabled_approval_dialogue_posture");
    expect(inspector.sourceRouteKind).toBe("approval_request_route_detail");
    expect(inspector.sourceContractKind).toBe("event_request_contract_projection");
    expect(inspector.dialogueLineCount).toBe(3);
    expect(inspector.routeCardCount).toBe(4);
    expect(inspector.contractCardCount).toBe(4);
    expect(inspector.evidenceCount).toBe(1);
    expect(inspector.blockedWorkCount).toBe(1);
    expect(inspector.enabledControls).toBe(0);
    expect(inspector.approveEnabled).toBe(false);
    expect(inspector.rejectEnabled).toBe(false);
    expect(inspector.holdEnabled).toBe(false);
    expect(inspector.requestCreationEnabled).toBe(false);
    expect(inspector.eventCreationEnabled).toBe(false);
    expect(inspector.eventPersistenceEnabled).toBe(false);
    expect(inspector.auditWriteEnabled).toBe(false);
    expect(inspector.dispatchEnabled).toBe(false);
    expect(inspector.nasSaveEnabled).toBe(false);
    expect(inspector.safeProjectionOnly).toBe(true);
    expect(inspector.rawExcluded).toBe(true);
    expect(JSON.stringify(inspector)).not.toMatch(/raw dialogue route prompt|raw dialogue route task title|Traceback|\/Users\/lidises|token-shaped-dialogue-route-sentinel|private-dialogue-route-provider/i);
  });
});


describe("Event Timeline Projection 1", () => {
  it("builds a read-only event timeline from the safe contract and inspector without persisting events", () => {
    const secretSentinel = ["token", "shaped", "timeline", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw timeline prompt", provider: "private-timeline-provider", api_key: secretSentinel },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw timeline task title", body: "/Users/lidises/private/event-timeline.md", transcript: "Traceback event timeline transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 21, warning_count: 8, error_summary: "Traceback event timeline source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
    const timeline = buildOfficeEventTimelineProjection(contract, inspector);

    expect(timeline.stageLabel).toBe("Event Timeline Projection 1");
    expect(timeline.detailKind).toBe("event_timeline_projection");
    expect(timeline.events.map((event) => event.id)).toEqual(["user_instruction_submitted", "orchestrator_plan_requested", "approval_requested", "nas_save_approval_pending"]);
    expect(timeline.sourceContractKind).toBe("event_request_contract_projection");
    expect(timeline.sourceInspectorKind).toBe("approval_dialogue_route_inspector");
    expect(timeline.timelineState).toBe("projection_only");
    expect(timeline.eventCount).toBe(4);
    expect(timeline.evidenceCount).toBe(1);
    expect(timeline.blockedWorkCount).toBe(1);
    expect(timeline.dialogueLineCount).toBe(3);
    expect(timeline.enabledControls).toBe(0);
    expect(timeline.runtimeEventWriteEnabled).toBe(false);
    expect(timeline.intentEventCreationEnabled).toBe(false);
    expect(timeline.visualEventCreationEnabled).toBe(false);
    expect(timeline.eventPersistenceEnabled).toBe(false);
    expect(timeline.timelineAppendEnabled).toBe(false);
    expect(timeline.auditWriteEnabled).toBe(false);
    expect(timeline.dispatchEnabled).toBe(false);
    expect(timeline.nasSaveEnabled).toBe(false);
    expect(timeline.safeProjectionOnly).toBe(true);
    expect(timeline.rawExcluded).toBe(true);
    expect(JSON.stringify(timeline)).not.toMatch(/raw timeline prompt|raw timeline task title|Traceback|\/Users\/lidises|token-shaped-timeline-sentinel|private-timeline-provider/i);
  });
});

describe("Timeline/Worker Handoff Drill-down 1", () => {
  it("builds a read-only worker handoff drill-down from the safe timeline without assigning work", () => {
    const secretSentinel = ["token", "shaped", "worker", "handoff"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw worker handoff prompt", provider: "private-worker-handoff-provider", api_key: secretSentinel },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw worker handoff task", body: "/Users/lidises/private/worker-handoff.md", transcript: "Traceback worker handoff transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 13, warning_count: 5, error_summary: "Traceback worker handoff source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
    const timeline = buildOfficeEventTimelineProjection(contract, inspector);
    const workerRoles = buildOfficeDeskRpgWorkerRoleVisibility(projection);
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);

    const drilldown = buildOfficeTimelineWorkerHandoffDrilldown(timeline, workerRoles, handoff);

    expect(drilldown.stageLabel).toBe("Timeline/Worker Handoff Drill-down 1");
    expect(drilldown.detailKind).toBe("timeline_worker_handoff_drilldown");
    expect(drilldown.sourceTimelineKind).toBe("event_timeline_projection");
    expect(drilldown.sourceWorkerVisibilityKind).toBe("desk_rpg_worker_role_visibility");
    expect(drilldown.sourceHandoffKind).toBe("review_to_wiki_posture");
    expect(drilldown.handoffSteps.map((step) => step.id)).toEqual(["search_worker", "reviewer", "wiki_writer", "nas_keeper"]);
    expect(drilldown.timelineEventCount).toBe(4);
    expect(drilldown.visibleWorkerCount).toBeGreaterThanOrEqual(4);
    expect(drilldown.handoffState).toBe("projection_only");
    expect(drilldown.enabledControls).toBe(0);
    expect(drilldown.drilldownWriteEnabled).toBe(false);
    expect(drilldown.workAssignmentEnabled).toBe(false);
    expect(drilldown.requestCreationEnabled).toBe(false);
    expect(drilldown.dispatchEnabled).toBe(false);
    expect(drilldown.auditWriteEnabled).toBe(false);
    expect(drilldown.nasSaveEnabled).toBe(false);
    expect(drilldown.safeProjectionOnly).toBe(true);
    expect(drilldown.rawExcluded).toBe(true);
    expect(JSON.stringify(drilldown)).not.toMatch(/raw worker handoff prompt|raw worker handoff task|Traceback|\/Users\/lidises|token-shaped-worker-handoff|private-worker-handoff-provider/i);
  });
});


describe("Worker Request Handoff Detail 1", () => {
  it("builds a read-only worker/request handoff detail from safe approval and lane projections", () => {
    const state = officeFixture({
      agents: [{ id: "agent-request-handoff", status: "active", prompt: "raw worker request handoff prompt", provider: "private-worker-request-provider", api_key: "token-shaped-worker-request-handoff" }],
      work_items: [
        { id: "task-request-handoff", status: "blocked", title: "raw worker request handoff task", body: "/Users/lidises/private/request-handoff.md", transcript: "Traceback worker request handoff transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-15T00:00:00Z", item_count: 9, warning_count: 3, error_summary: "Traceback worker request handoff source" },
      ],
    });
    const projection = buildOfficeDeskRpgProjectionModel(state);
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
    const timeline = buildOfficeEventTimelineProjection(contract, inspector);
    const workerRoles = buildOfficeDeskRpgWorkerRoleVisibility(projection);
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
    const drilldown = buildOfficeTimelineWorkerHandoffDrilldown(timeline, workerRoles, handoff);
    const approvalDetail = buildOfficeApprovalRequestDetailDeepening(route, timeline, drilldown);
    const approvalView = buildOfficeApprovalRequestView(state);
    const audit = buildOfficeApprovalAuditTimeline(approvalView);
    const gate = buildOfficeApprovalExecutionGate(audit);
    const authority = buildOfficeAuthorityAdapterContract(gate);
    const queue = buildOfficeOrchestratorMediationQueue(authority);
    const routing = buildOfficeWorkerIntentRouting(queue);
    const readiness = buildOfficeWorkerFacilityReadiness(routing);
    const lanePolish = buildOfficeWorkerFacilityLanePolish(drilldown, readiness);

    const detail = buildOfficeWorkerRequestHandoffDetail(approvalDetail, lanePolish);

    expect(detail.stageLabel).toBe("Worker Request Handoff Detail 1");
    expect(detail.detailKind).toBe("worker_request_handoff_detail");
    expect(detail.sections.map((section) => section.id)).toEqual(["request_detail", "worker_lanes", "handoff_boundary", "nas_boundary"]);
    expect(detail.sourceApprovalDetailKind).toBe("approval_request_detail_deepening");
    expect(detail.sourceLanePolishKind).toBe("worker_facility_lane_polish");
    expect(detail.requestSectionCount).toBe(4);
    expect(detail.workerLaneCount).toBe(4);
    expect(detail.enabledControls).toBe(0);
    expect(detail.requestCreationEnabled).toBe(false);
    expect(detail.workAssignmentEnabled).toBe(false);
    expect(detail.dispatchEnabled).toBe(false);
    expect(detail.auditWriteEnabled).toBe(false);
    expect(detail.nasSaveEnabled).toBe(false);
    expect(detail.safeProjectionOnly).toBe(true);
    expect(detail.rawExcluded).toBe(true);
    expect(JSON.stringify(detail)).not.toMatch(/raw worker request handoff prompt|raw worker request handoff task|Traceback|\/Users\/lidises|token-shaped-worker-request-handoff|private-worker-request-provider/i);
  });
});


function buildApprovalNasBoundaryPolishFixture(overrides: Partial<OfficeState> = {}) {
  const state = officeFixture({
    agents: [{ id: "agent-approval-nas", status: "active", prompt: "raw approval nas prompt", provider: "private-approval-nas-provider", api_key: "token-shaped-approval-nas" }],
    work_items: [
      { id: "task-approval-nas", status: "blocked", title: "raw approval nas task", body: "/Users/lidises/private/approval-nas.md", transcript: "Traceback approval nas transcript" } as unknown as OfficeState["work_items"][number],
    ],
    data_sources: [
      { id: "paperclip", status: "partial", checked_at: "2026-05-15T00:00:00Z", item_count: 11, warning_count: 4, error_summary: "Traceback approval nas source" },
    ],
    ...overrides,
  });
  const projection = buildOfficeDeskRpgProjectionModel(state);
  const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
  const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
  const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
  const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
  const contract = buildOfficeEventRequestContractProjection(route);
  const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
  const timeline = buildOfficeEventTimelineProjection(contract, inspector);
  const workerRoles = buildOfficeDeskRpgWorkerRoleVisibility(projection);
  const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
  const drilldown = buildOfficeTimelineWorkerHandoffDrilldown(timeline, workerRoles, handoff);
  const approvalDetail = buildOfficeApprovalRequestDetailDeepening(route, timeline, drilldown);
  const approvalView = buildOfficeApprovalRequestView(state);
  const audit = buildOfficeApprovalAuditTimeline(approvalView);
  const gate = buildOfficeApprovalExecutionGate(audit);
  const authority = buildOfficeAuthorityAdapterContract(gate);
  const queue = buildOfficeOrchestratorMediationQueue(authority);
  const routing = buildOfficeWorkerIntentRouting(queue);
  const readiness = buildOfficeWorkerFacilityReadiness(routing);
  const lanePolish = buildOfficeWorkerFacilityLanePolish(drilldown, readiness);
  const detail = buildOfficeWorkerRequestHandoffDetail(approvalDetail, lanePolish);
  return buildOfficeApprovalNasBoundaryPolish(detail);
}

describe("Approval/NAS Boundary Polish 1", () => {
  it("builds a read-only approval and NAS boundary polish from safe request handoff detail", () => {
    const polish = buildApprovalNasBoundaryPolishFixture();

    expect(polish.stageLabel).toBe("Approval/NAS Boundary Polish 1");
    expect(polish.detailKind).toBe("approval_nas_boundary_polish");
    expect(polish.cards.map((card) => card.id)).toEqual(["approval_gate", "worker_handoff", "audit_boundary", "nas_vault_boundary"]);
    expect(polish.sourceDetailKind).toBe("worker_request_handoff_detail");
    expect(polish.sourceSectionCount).toBe(4);
    expect(polish.boundaryCount).toBe(4);
    expect(polish.enabledControls).toBe(0);
    expect(polish.approveEnabled).toBe(false);
    expect(polish.rejectEnabled).toBe(false);
    expect(polish.holdEnabled).toBe(false);
    expect(polish.requestCreationEnabled).toBe(false);
    expect(polish.workAssignmentEnabled).toBe(false);
    expect(polish.dispatchEnabled).toBe(false);
    expect(polish.auditWriteEnabled).toBe(false);
    expect(polish.nasSaveEnabled).toBe(false);
    expect(polish.safeProjectionOnly).toBe(true);
    expect(polish.rawExcluded).toBe(true);
    expect(JSON.stringify(polish)).not.toMatch(/raw approval nas prompt|raw approval nas task|Traceback|\/Users\/lidises|token-shaped-approval-nas|private-approval-nas-provider/i);
  });
});


describe("Approval Authority Readiness Detail 1", () => {
  it("builds authority readiness cards without granting approval or NAS authority", () => {
    const boundary = buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-authority-readiness", status: "active", prompt: "raw authority readiness prompt", provider: "private-authority-readiness-provider", api_key: "token-shaped-authority-readiness" }],
      work_items: [
        { id: "task-authority-readiness", status: "blocked", title: "raw authority readiness task", body: "/Users/lidises/private/authority-readiness.md", transcript: "Traceback authority readiness transcript" } as unknown as OfficeState["work_items"][number],
      ],
    });

    const readiness = buildOfficeApprovalAuthorityReadinessDetail(boundary);

    expect(readiness.stageLabel).toBe("Approval Authority Readiness Detail 1");
    expect(readiness.detailKind).toBe("approval_authority_readiness_detail");
    expect(readiness.cards.map((card) => card.id)).toEqual(["human_authority", "orchestrator_mediation", "audit_sink", "nas_keeper_authority"]);
    expect(readiness.sourceDetailKind).toBe("approval_nas_boundary_polish");
    expect(readiness.sourceBoundaryCount).toBe(4);
    expect(readiness.authorityPrerequisiteCount).toBe(4);
    expect(readiness.enabledControls).toBe(0);
    expect(readiness.authorityGranted).toBe(false);
    expect(readiness.approveEnabled).toBe(false);
    expect(readiness.rejectEnabled).toBe(false);
    expect(readiness.holdEnabled).toBe(false);
    expect(readiness.requestCreationEnabled).toBe(false);
    expect(readiness.workAssignmentEnabled).toBe(false);
    expect(readiness.dispatchEnabled).toBe(false);
    expect(readiness.auditWriteEnabled).toBe(false);
    expect(readiness.nasSaveEnabled).toBe(false);
    expect(readiness.safeProjectionOnly).toBe(true);
    expect(readiness.rawExcluded).toBe(true);
    expect(JSON.stringify(readiness)).not.toMatch(/raw authority readiness prompt|raw authority readiness task|Traceback|\/Users\/lidises|token-shaped-authority-readiness|private-authority-readiness-provider/i);
  });
});


describe("Approval Authority Decision Envelope Preview 1", () => {
  it("builds a disabled approve reject hold envelope without recording decisions", () => {
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-decision-envelope", status: "active", prompt: "raw decision envelope prompt", provider: "private-decision-envelope-provider", api_key: "token-shaped-decision-envelope" }],
      work_items: [
        { id: "task-decision-envelope", status: "blocked", title: "raw decision envelope task", body: "/Users/lidises/private/decision-envelope.md", transcript: "Traceback decision envelope transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));

    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);

    expect(envelope.stageLabel).toBe("Approval Authority Decision Envelope Preview 1");
    expect(envelope.detailKind).toBe("approval_authority_decision_envelope_preview");
    expect(envelope.options.map((option) => option.id)).toEqual(["approve", "reject", "hold"]);
    expect(envelope.sourceDetailKind).toBe("approval_authority_readiness_detail");
    expect(envelope.sourcePrerequisiteCount).toBe(4);
    expect(envelope.decisionOptionCount).toBe(3);
    expect(envelope.enabledControls).toBe(0);
    expect(envelope.decisionRecordCreated).toBe(false);
    expect(envelope.approveEnabled).toBe(false);
    expect(envelope.rejectEnabled).toBe(false);
    expect(envelope.holdEnabled).toBe(false);
    expect(envelope.requestCreationEnabled).toBe(false);
    expect(envelope.workAssignmentEnabled).toBe(false);
    expect(envelope.dispatchEnabled).toBe(false);
    expect(envelope.auditWriteEnabled).toBe(false);
    expect(envelope.nasSaveEnabled).toBe(false);
    expect(envelope.safeProjectionOnly).toBe(true);
    expect(envelope.rawExcluded).toBe(true);
    expect(JSON.stringify(envelope)).not.toMatch(/raw decision envelope prompt|raw decision envelope task|Traceback|\/Users\/lidises|token-shaped-decision-envelope|private-decision-envelope-provider/i);
  });
});


describe("Approval Decision Audit/NAS Trace Preview 1", () => {
  it("builds a projected post-decision audit and NAS trace without writing records", () => {
    const secretSentinel = ["token", "shaped", "decision", "trace"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-decision-trace", status: "active", prompt: "raw decision trace prompt", provider: "private-decision-trace-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-decision-trace", status: "blocked", title: "raw decision trace task", body: "/Users/lidises/private/decision-trace.md", transcript: "Traceback decision trace transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);

    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);

    expect(trace.stageLabel).toBe("Approval Decision Audit/NAS Trace Preview 1");
    expect(trace.detailKind).toBe("approval_decision_audit_nas_trace_preview");
    expect(trace.traceSteps.map((step) => step.id)).toEqual(["decision_intake", "audit_trace", "nas_save_request", "nas_keeper_boundary"]);
    expect(trace.sourceDetailKind).toBe("approval_authority_decision_envelope_preview");
    expect(trace.sourceDecisionOptionCount).toBe(3);
    expect(trace.traceStepCount).toBe(4);
    expect(trace.enabledControls).toBe(0);
    expect(trace.decisionRecordCreated).toBe(false);
    expect(trace.auditEventAppended).toBe(false);
    expect(trace.nasTracePersisted).toBe(false);
    expect(trace.approveEnabled).toBe(false);
    expect(trace.rejectEnabled).toBe(false);
    expect(trace.holdEnabled).toBe(false);
    expect(trace.dispatchEnabled).toBe(false);
    expect(trace.auditWriteEnabled).toBe(false);
    expect(trace.nasSaveEnabled).toBe(false);
    expect(trace.safeProjectionOnly).toBe(true);
    expect(trace.rawExcluded).toBe(true);
    expect(JSON.stringify(trace)).not.toMatch(/raw decision trace prompt|raw decision trace task|Traceback|\/Users\/lidises|token-shaped-decision-trace|private-decision-trace-provider/i);
  });
});


describe("NAS Keeper Save Request Gate 1", () => {
  it("builds a projected SaveRequested gate without creating save requests or NAS writes", () => {
    const secretSentinel = ["token", "shaped", "nas", "gate"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-nas-gate", status: "active", prompt: "raw nas gate prompt", provider: "private-nas-gate-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-nas-gate", status: "blocked", title: "raw nas gate task", body: "/Users/lidises/private/nas-gate.md", transcript: "Traceback nas gate transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);

    const gate = buildOfficeNasKeeperSaveRequestGate(trace);

    expect(gate.stageLabel).toBe("NAS Keeper Save Request Gate 1");
    expect(gate.detailKind).toBe("nas_keeper_save_request_gate");
    expect(gate.gateSteps.map((step) => step.id)).toEqual(["save_requested_event", "nas_keeper_review", "rollback_point", "final_save_boundary"]);
    expect(gate.sourceDetailKind).toBe("approval_decision_audit_nas_trace_preview");
    expect(gate.sourceTraceStepCount).toBe(4);
    expect(gate.gateStepCount).toBe(4);
    expect(gate.enabledControls).toBe(0);
    expect(gate.saveRequestCreated).toBe(false);
    expect(gate.saveRequestPersisted).toBe(false);
    expect(gate.rollbackPointCreated).toBe(false);
    expect(gate.nasWritePrepared).toBe(false);
    expect(gate.nasSaveEnabled).toBe(false);
    expect(gate.auditWriteEnabled).toBe(false);
    expect(gate.dispatchEnabled).toBe(false);
    expect(gate.requestCreationEnabled).toBe(false);
    expect(gate.workAssignmentEnabled).toBe(false);
    expect(gate.safeProjectionOnly).toBe(true);
    expect(gate.rawExcluded).toBe(true);
    expect(JSON.stringify(gate)).not.toMatch(/raw nas gate prompt|raw nas gate task|Traceback|\/Users\/lidises|token-shaped-nas-gate|private-nas-gate-provider/i);
  });
});


describe("NAS Keeper Rollback Evidence Preview 1", () => {
  it("builds a projected rollback evidence package without creating rollback points or NAS writes", () => {
    const secretSentinel = ["token", "shaped", "rollback", "evidence"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-rollback-evidence", status: "active", prompt: "raw rollback evidence prompt", provider: "private-rollback-evidence-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-rollback-evidence", status: "blocked", title: "raw rollback evidence task", body: "/Users/lidises/private/rollback-evidence.md", transcript: "Traceback rollback evidence transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);

    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);

    expect(rollback.stageLabel).toBe("NAS Keeper Rollback Evidence Preview 1");
    expect(rollback.detailKind).toBe("nas_keeper_rollback_evidence_preview");
    expect(rollback.evidenceCards.map((card) => card.id)).toEqual(["rollback_snapshot", "evidence_manifest", "audit_anchor", "restore_boundary"]);
    expect(rollback.sourceDetailKind).toBe("nas_keeper_save_request_gate");
    expect(rollback.sourceGateStepCount).toBe(4);
    expect(rollback.evidenceCardCount).toBe(4);
    expect(rollback.enabledControls).toBe(0);
    expect(rollback.rollbackPointCreated).toBe(false);
    expect(rollback.rollbackEvidencePersisted).toBe(false);
    expect(rollback.auditEventAppended).toBe(false);
    expect(rollback.nasTracePersisted).toBe(false);
    expect(rollback.nasWritePrepared).toBe(false);
    expect(rollback.nasSaveEnabled).toBe(false);
    expect(rollback.auditWriteEnabled).toBe(false);
    expect(rollback.dispatchEnabled).toBe(false);
    expect(rollback.requestCreationEnabled).toBe(false);
    expect(rollback.workAssignmentEnabled).toBe(false);
    expect(rollback.safeProjectionOnly).toBe(true);
    expect(rollback.rawExcluded).toBe(true);
    expect(JSON.stringify(rollback)).not.toMatch(/raw rollback evidence prompt|raw rollback evidence task|Traceback|\/Users\/lidises|token-shaped-rollback-evidence|private-rollback-evidence-provider/i);
  });
});


describe("NAS Evidence Package Store Readback Status 1", () => {
  it("builds a frontend-only readback status surface without backend/storage mutation controls", () => {
    const secretSentinel = ["token", "shaped", "package", "store"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-package-store", status: "active", prompt: "raw evidence package store prompt", provider: "private-package-store-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-package-store", status: "blocked", title: "raw package store task", body: "/Users/lidises/nas/private/package-store.md", transcript: "Traceback package store transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);

    const status = buildOfficeNasEvidencePackageStoreReadbackStatus(rollback);

    expect(status.stageLabel).toBe("NAS Evidence Package Store Readback Status 1");
    expect(status.detailKind).toBe("nas_evidence_package_store_readback_status");
    expect(status.storeCapabilityCount).toBe(4);
    expect(status.localMetadataStoreEnabled).toBe(true);
    expect(status.localMetadataReadbackEnabled).toBe(true);
    expect(status.enabledControls).toBe(0);
    expect(status.backendApiChanged).toBe(false);
    expect(status.storageChanged).toBe(false);
    expect(status.nasPathResolutionEnabled).toBe(false);
    expect(status.nasMountAccessEnabled).toBe(false);
    expect(status.nasWriteEnabled).toBe(false);
    expect(status.evidenceFilePersistenceEnabled).toBe(false);
    expect(status.rollbackPointCreated).toBe(false);
    expect(status.safeProjectionOnly).toBe(true);
    expect(status.rawExcluded).toBe(true);
    expect(JSON.stringify(status)).not.toMatch(/raw evidence package store prompt|raw package store task|Traceback|\/Users\/lidises|token-shaped-package-store|private-package-store-provider/i);
  });
});


describe("NAS Path Validation Status Surface 1", () => {
  it("builds a frontend-only read-only path validation status without backend/storage mutation controls", () => {
    const secretSentinel = ["token", "shaped", "path", "validate"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-path-validate", status: "active", prompt: "raw path validate prompt", provider: "private-path-validate-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-path-validate", status: "blocked", title: "raw path validate task", body: "/Users/lidises/nas/private/path-validate.md", transcript: "Traceback path validate transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const store = buildOfficeNasEvidencePackageStoreReadbackStatus(rollback);

    const status = buildOfficeNasPathValidationStatusSurface(store);

    expect(status.stageLabel).toBe("NAS Path Validation Status Surface 1");
    expect(status.detailKind).toBe("nas_path_validation_status_surface");
    expect(status.sourceDetailKind).toBe("nas_evidence_package_store_readback_status");
    expect(status.validationEnabled).toBe(true);
    expect(status.enabledControls).toBe(0);
    expect(status.frontendOnly).toBe(true);
    expect(status.backendApiChanged).toBe(false);
    expect(status.storageChanged).toBe(false);
    expect(status.pathResolutionRuntimeEnabled).toBe(false);
    expect(status.vaultMappingEnabled).toBe(false);
    expect(status.mountDiscoveryEnabled).toBe(false);
    expect(status.nasMountAccessEnabled).toBe(false);
    expect(status.filesystemReadEnabled).toBe(false);
    expect(status.filesystemWriteEnabled).toBe(false);
    expect(status.nasWriteEnabled).toBe(false);
    expect(status.evidenceFilePersistenceEnabled).toBe(false);
    expect(status.rollbackPointCreated).toBe(false);
    expect(status.credentialAccessEnabled).toBe(false);
    expect(status.auditWriteEnabled).toBe(false);
    expect(status.dispatchEnabled).toBe(false);
    expect(status.requestCreationEnabled).toBe(false);
    expect(status.workAssignmentEnabled).toBe(false);
    expect(status.safeProjectionOnly).toBe(true);
    expect(status.rawExcluded).toBe(true);
    expect(status.capabilityCount).toBe(4);
    expect(JSON.stringify(status)).not.toMatch(/raw path validate prompt|raw path validate task|Traceback|\/Users\/lidises|token-shaped-path-validate|private-path-validate-provider/i);
  });
});


describe("NAS Path Preview Status Surface 1", () => {
  it("builds a frontend-only read-only path preview status without backend/storage mutation controls", () => {
    const secretSentinel = ["token", "shaped", "path", "preview"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-path-preview", status: "active", prompt: "raw path preview prompt", provider: "private-path-preview-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-path-preview", status: "blocked", title: "raw path preview task", body: "/Users/lidises/nas/private/path-preview.md", transcript: "Traceback path preview transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const store = buildOfficeNasEvidencePackageStoreReadbackStatus(rollback);
    const validation = buildOfficeNasPathValidationStatusSurface(store);

    const status = buildOfficeNasPathPreviewStatusSurface(validation);

    expect(status.stageLabel).toBe("NAS Path Preview Status Surface 1");
    expect(status.detailKind).toBe("nas_path_preview_status_surface");
    expect(status.sourceDetailKind).toBe("nas_path_validation_status_surface");
    expect(status.validationEnabled).toBe(true);
    expect(status.previewEnabled).toBe(true);
    expect(status.enabledControls).toBe(0);
    expect(status.frontendOnly).toBe(true);
    expect(status.backendApiChanged).toBe(false);
    expect(status.storageChanged).toBe(false);
    expect(status.pathResolutionRuntimeEnabled).toBe(false);
    expect(status.vaultMappingEnabled).toBe(false);
    expect(status.mountDiscoveryEnabled).toBe(false);
    expect(status.nasMountAccessEnabled).toBe(false);
    expect(status.filesystemReadEnabled).toBe(false);
    expect(status.filesystemWriteEnabled).toBe(false);
    expect(status.nasWriteEnabled).toBe(false);
    expect(status.evidenceFilePersistenceEnabled).toBe(false);
    expect(status.rollbackPointCreated).toBe(false);
    expect(status.credentialAccessEnabled).toBe(false);
    expect(status.auditWriteEnabled).toBe(false);
    expect(status.dispatchEnabled).toBe(false);
    expect(status.requestCreationEnabled).toBe(false);
    expect(status.workAssignmentEnabled).toBe(false);
    expect(status.safeProjectionOnly).toBe(true);
    expect(status.rawExcluded).toBe(true);
    expect(status.capabilityCount).toBe(4);
    expect(JSON.stringify(status)).not.toMatch(/raw path preview prompt|raw path preview task|Traceback|\/Users\/lidises|token-shaped-path-preview|private-path-preview-provider/i);
  });
});


describe("NAS Path Preview Store Readback Status Surface 1", () => {
  it("builds a frontend-only read-only path preview store/readback status without backend/storage mutation controls", () => {
    const secretSentinel = ["token", "shaped", "path", "preview", "store"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-path-preview-store", status: "active", prompt: "raw path preview store prompt", provider: "private-path-preview-store-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-path-preview-store", status: "blocked", title: "raw path preview store task", body: "/Users/lidises/nas/private/path-preview-store.md", transcript: "Traceback path preview store transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const store = buildOfficeNasEvidencePackageStoreReadbackStatus(rollback);
    const validation = buildOfficeNasPathValidationStatusSurface(store);
    const preview = buildOfficeNasPathPreviewStatusSurface(validation);

    const status = buildOfficeNasPathPreviewStoreReadbackStatusSurface(preview);

    expect(status.stageLabel).toBe("NAS Path Preview Store Readback Status Surface 1");
    expect(status.detailKind).toBe("nas_path_preview_store_readback_status_surface");
    expect(status.sourceDetailKind).toBe("nas_path_preview_status_surface");
    expect(status.validationEnabled).toBe(true);
    expect(status.previewEnabled).toBe(true);
    expect(status.localMetadataStoreEnabled).toBe(true);
    expect(status.safeReadbackEnabled).toBe(true);
    expect(status.duplicateGuardEnabled).toBe(true);
    expect(status.limitClampEnabled).toBe(true);
    expect(status.enabledControls).toBe(0);
    expect(status.frontendOnly).toBe(true);
    expect(status.backendApiChanged).toBe(false);
    expect(status.storageChanged).toBe(false);
    expect(status.pathResolutionRuntimeEnabled).toBe(false);
    expect(status.vaultMappingEnabled).toBe(false);
    expect(status.mountDiscoveryEnabled).toBe(false);
    expect(status.nasMountAccessEnabled).toBe(false);
    expect(status.filesystemReadEnabled).toBe(false);
    expect(status.filesystemWriteEnabled).toBe(false);
    expect(status.nasWriteEnabled).toBe(false);
    expect(status.evidenceFilePersistenceEnabled).toBe(false);
    expect(status.rollbackPointCreated).toBe(false);
    expect(status.credentialAccessEnabled).toBe(false);
    expect(status.auditWriteEnabled).toBe(false);
    expect(status.dispatchEnabled).toBe(false);
    expect(status.requestCreationEnabled).toBe(false);
    expect(status.workAssignmentEnabled).toBe(false);
    expect(status.safeProjectionOnly).toBe(true);
    expect(status.rawExcluded).toBe(true);
    expect(status.capabilityCount).toBe(4);
    expect(JSON.stringify(status)).not.toMatch(/raw path preview store prompt|raw path preview store task|Traceback|\/Users\/lidises|token-shaped-path-preview-store|private-path-preview-store-provider/i);
  });
});


describe("NAS Runtime N3 Approval Boundary Status Surface 1", () => {
  it("projects the timed-out N3 approval boundary without enabling runtime capabilities", () => {
    const secretSentinel = ["token", "shaped", "n3", "boundary"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-n3-boundary", status: "active", prompt: "raw n3 boundary prompt", provider: "private-n3-boundary-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-n3-boundary", status: "blocked", title: "raw n3 boundary task", body: "/Users/lidises/private/n3-boundary.md", transcript: "Traceback n3 boundary transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const store = buildOfficeNasEvidencePackageStoreReadbackStatus(rollback);
    const validation = buildOfficeNasPathValidationStatusSurface(store);
    const preview = buildOfficeNasPathPreviewStatusSurface(validation);
    const previewStore = buildOfficeNasPathPreviewStoreReadbackStatusSurface(preview);

    const boundary = buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface(previewStore);

    expect(boundary.stageLabel).toBe("NAS Runtime N3 Approval Boundary Status Surface 1");
    expect(boundary.detailKind).toBe("nas_runtime_n3_approval_boundary_status_surface");
    expect(boundary.sourceDetailKind).toBe("nas_path_preview_store_readback_status_surface");
    expect(boundary.requestedBoundary).toBe("N3 local path mapping validate-only");
    expect(boundary.approvalStatus).toBe("approval_required");
    expect(boundary.fallbackReason).toBe("approval_prompt_timed_out");
    expect(boundary.safeFallbackSelected).toBe(true);
    expect(boundary.enabledControls).toBe(0);
    expect(boundary.frontendOnly).toBe(true);
    expect(boundary.backendApiChanged).toBe(false);
    expect(boundary.schemaRouteAdded).toBe(false);
    expect(boundary.validationRouteAdded).toBe(false);
    expect(boundary.localPathMappingValidationEnabled).toBe(false);
    expect(boundary.pathResolutionRuntimeEnabled).toBe(false);
    expect(boundary.vaultMappingEnabled).toBe(false);
    expect(boundary.mountDiscoveryEnabled).toBe(false);
    expect(boundary.nasMountAccessEnabled).toBe(false);
    expect(boundary.filesystemReadEnabled).toBe(false);
    expect(boundary.filesystemWriteEnabled).toBe(false);
    expect(boundary.nasWriteEnabled).toBe(false);
    expect(boundary.evidenceFilePersistenceEnabled).toBe(false);
    expect(boundary.rollbackPointCreated).toBe(false);
    expect(boundary.credentialAccessEnabled).toBe(false);
    expect(boundary.auditWriteEnabled).toBe(false);
    expect(boundary.dispatchEnabled).toBe(false);
    expect(boundary.requestCreationEnabled).toBe(false);
    expect(boundary.safeProjectionOnly).toBe(true);
    expect(boundary.rawExcluded).toBe(true);
    expect(boundary.nextApprovalOptions.map((option) => option.id)).toEqual(["n3_validate_only", "n3_red_tests_only", "runtime_path_resolution_dry_run", "frontend_fallback_continue"]);
    expect(JSON.stringify(boundary)).not.toMatch(/raw n3 boundary prompt|raw n3 boundary task|Traceback|\/Users\/lidises|token-shaped-n3-boundary|private-n3-boundary-provider/i);
  });
});


describe("Desk RPG Read-only Chain Completion Review 1", () => {
  it("reviews the completed request approval NAS Keeper chain and selects the next projection-only gap", () => {
    const secretSentinel = ["token", "shaped", "completion", "review"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-completion-review", status: "active", prompt: "raw completion review prompt", provider: "private-completion-review-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-completion-review", status: "blocked", title: "raw completion review task", body: "/Users/lidises/private/completion-review.md", transcript: "Traceback completion review transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);

    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);

    expect(review.stageLabel).toBe("Desk RPG Read-only Chain Completion Review 1");
    expect(review.detailKind).toBe("desk_rpg_readonly_chain_completion_review");
    expect(review.sourceDetailKind).toBe("nas_keeper_rollback_evidence_preview");
    expect(review.reviewCards.map((card) => card.id)).toEqual(["request_to_orchestrator", "evidence_to_review", "approval_to_nas_keeper", "next_projection_gap"]);
    expect(review.completedChainStepCount).toBe(16);
    expect(review.masterSpecCheckpointCount).toBe(4);
    expect(review.nextRecommendedSlice).toBe("Event-driven Character State Projection 1");
    expect(review.enabledControls).toBe(0);
    expect(review.mutationControlsAdded).toBe(false);
    expect(review.runtimeWriteEnabled).toBe(false);
    expect(review.requestCreationEnabled).toBe(false);
    expect(review.workAssignmentEnabled).toBe(false);
    expect(review.dispatchEnabled).toBe(false);
    expect(review.auditWriteEnabled).toBe(false);
    expect(review.nasSaveEnabled).toBe(false);
    expect(review.safeProjectionOnly).toBe(true);
    expect(review.rawExcluded).toBe(true);
    expect(JSON.stringify(review)).not.toMatch(/raw completion review prompt|raw completion review task|Traceback|\/Users\/lidises|token-shaped-completion-review|private-completion-review-provider/i);
  });
});


describe("Event-driven Character State Projection 1", () => {
  it("maps allowlisted safe events to display-only Desk RPG character states", () => {
    const secretSentinel = ["token", "shaped", "character", "state"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-character-state", status: "active", prompt: "raw character state prompt", provider: "private-character-state-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-state", status: "blocked", title: "raw character state task", body: "/Users/lidises/private/character-state.md", transcript: "Traceback character state transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const safeEvents = [
      { id: "evt-runtime-workload", category: "workload_changed", roomId: "work", tone: "warning", count: 2, safeLabel: "업무 변화", detail: "safe aggregate only", redacted: true, rawSource: false },
      { id: "evt-runtime-flow", category: "flow_changed", roomId: "work", toRoomId: "routing", tone: "neutral", count: 1, safeLabel: "흐름 변화", detail: "safe route aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-attention", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "승인 주의", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-static", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "정적 snapshot", detail: "safe static posture", redacted: true, rawSource: false },
    ] as const;

    const projection = buildOfficeEventDrivenCharacterStateProjection(review, safeEvents);

    expect(projection.stageLabel).toBe("Event-driven Character State Projection 1");
    expect(projection.detailKind).toBe("event_driven_character_state_projection");
    expect(projection.sourceReviewKind).toBe("desk_rpg_readonly_chain_completion_review");
    expect(projection.eventCategoryCount).toBe(4);
    expect(projection.characterStates.map((state) => state.role)).toEqual(["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]);
    expect(projection.characterStates.map((state) => state.eventClass)).toEqual(["intent", "intent", "runtime", "runtime", "visual", "visual"]);
    expect(projection.characterStates.map((state) => state.state)).toEqual(["attention_requested", "mediating", "working", "reviewing", "drafting", "approval_waiting"]);
    expect(projection.runtimeEventWriteEnabled).toBe(false);
    expect(projection.intentEventCreationEnabled).toBe(false);
    expect(projection.visualEventCreationEnabled).toBe(false);
    expect(projection.eventPersistenceEnabled).toBe(false);
    expect(projection.stateMachinePersistenceEnabled).toBe(false);
    expect(projection.requestCreationEnabled).toBe(false);
    expect(projection.workAssignmentEnabled).toBe(false);
    expect(projection.dispatchEnabled).toBe(false);
    expect(projection.auditWriteEnabled).toBe(false);
    expect(projection.nasSaveEnabled).toBe(false);
    expect(projection.enabledControls).toBe(0);
    expect(projection.safeProjectionOnly).toBe(true);
    expect(projection.rawExcluded).toBe(true);
    expect(projection.characterStates.every((state) => state.rawExcluded === true)).toBe(true);
    expect(JSON.stringify(projection)).not.toMatch(/raw character state prompt|raw character state task|Traceback|\/Users\/lidises|token-shaped-character-state|private-character-state-provider/i);
  });
});


describe("Character State Room Overlay 1", () => {
  it("projects safe character states into non-interactive room presence markers", () => {
    const secretSentinel = ["token", "shaped", "room", "overlay"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-character-overlay", status: "active", prompt: "raw character overlay prompt", provider: "private-character-overlay-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-overlay", status: "blocked", title: "raw character overlay task", body: "/Users/lidises/private/character-overlay.md", transcript: "Traceback character overlay transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-room", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-room", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-room", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);

    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);

    expect(overlay.stageLabel).toBe("Character State Room Overlay 1");
    expect(overlay.detailKind).toBe("character_state_room_overlay");
    expect(overlay.sourceDetailKind).toBe("event_driven_character_state_projection");
    expect(overlay.markerCount).toBe(6);
    expect(overlay.markers.map((marker) => marker.role)).toEqual(["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]);
    expect(overlay.markers.map((marker) => marker.roomSurfaceId)).toEqual(["boss_desk", "orchestrator_desk", "worker_cluster", "right_inspector", "central_board", "nas_vault"]);
    expect(overlay.markers.every((marker) => marker.interactive === false && marker.rawExcluded === true)).toBe(true);
    expect(overlay.enabledControls).toBe(0);
    expect(overlay.eventPersistenceEnabled).toBe(false);
    expect(overlay.backendStreamEnabled).toBe(false);
    expect(overlay.animationStatePersistenceEnabled).toBe(false);
    expect(overlay.requestCreationEnabled).toBe(false);
    expect(overlay.workAssignmentEnabled).toBe(false);
    expect(overlay.dispatchEnabled).toBe(false);
    expect(overlay.auditWriteEnabled).toBe(false);
    expect(overlay.nasSaveEnabled).toBe(false);
    expect(overlay.safeProjectionOnly).toBe(true);
    expect(overlay.rawExcluded).toBe(true);
    expect(JSON.stringify(overlay)).not.toMatch(/raw character overlay prompt|raw character overlay task|Traceback|\/Users\/lidises|token-shaped-room-overlay|private-character-overlay-provider/i);
  });
});


describe("Character Room Interaction Posture 1", () => {
  it("projects click and keyboard inspection posture for safe overlay markers without enabling interaction", () => {
    const secretSentinel = ["token", "shaped", "room", "interaction"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-character-interaction", status: "active", prompt: "raw character interaction prompt", provider: "private-character-interaction-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-interaction", status: "blocked", title: "raw character interaction task", body: "/Users/lidises/private/character-interaction.md", transcript: "Traceback character interaction transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-interaction", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-interaction", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-interaction", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);

    const posture = buildOfficeCharacterRoomInteractionPosture(overlay);

    expect(posture.stageLabel).toBe("Character Room Interaction Posture 1");
    expect(posture.detailKind).toBe("character_room_interaction_posture");
    expect(posture.sourceDetailKind).toBe("character_state_room_overlay");
    expect(posture.postureCount).toBe(6);
    expect(posture.postures.map((item) => item.role)).toEqual(["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]);
    expect(posture.postures.every((item) => item.clickInspectionPosture === "display_only" && item.keyboardInspectionPosture === "display_only")).toBe(true);
    expect(posture.postures.every((item) => item.inspectable === true && item.executable === false && item.rawExcluded === true)).toBe(true);
    expect(posture.enabledControls).toBe(0);
    expect(posture.clickHandlerEnabled).toBe(false);
    expect(posture.keyboardHandlerEnabled).toBe(false);
    expect(posture.eventPersistenceEnabled).toBe(false);
    expect(posture.backendStreamEnabled).toBe(false);
    expect(posture.animationStatePersistenceEnabled).toBe(false);
    expect(posture.requestCreationEnabled).toBe(false);
    expect(posture.workAssignmentEnabled).toBe(false);
    expect(posture.dispatchEnabled).toBe(false);
    expect(posture.auditWriteEnabled).toBe(false);
    expect(posture.nasSaveEnabled).toBe(false);
    expect(posture.safeProjectionOnly).toBe(true);
    expect(posture.rawExcluded).toBe(true);
    expect(JSON.stringify(posture)).not.toMatch(/raw character interaction prompt|raw character interaction task|Traceback|\/Users\/lidises|token-shaped-room-interaction|private-character-interaction-provider/i);
  });
});


describe("Character Inspector Detail Posture 1", () => {
  it("projects selected marker detail cards for the right inspector without enabling interaction or persistence", () => {
    const secretSentinel = ["token", "shaped", "inspector", "detail"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-character-inspector", status: "active", prompt: "raw character inspector prompt", provider: "private-character-inspector-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-inspector", status: "blocked", title: "raw character inspector task", body: "/Users/lidises/private/character-inspector.md", transcript: "Traceback character inspector transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-inspector", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-inspector", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-inspector", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);

    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);

    expect(detail.stageLabel).toBe("Character Inspector Detail Posture 1");
    expect(detail.detailKind).toBe("character_inspector_detail_posture");
    expect(detail.sourceDetailKind).toBe("character_room_interaction_posture");
    expect(detail.detailCardCount).toBe(6);
    expect(detail.cards.map((item) => item.role)).toEqual(["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]);
    expect(detail.cards.every((item) => item.inspectorSurfaceId === "right_inspector" && item.selectionPosture === "static_detail_card")).toBe(true);
    expect(detail.cards.every((item) => item.visibleInRightInspector === true && item.executable === false && item.rawExcluded === true)).toBe(true);
    expect(detail.enabledControls).toBe(0);
    expect(detail.selectedMarkerPersistenceEnabled).toBe(false);
    expect(detail.clickHandlerEnabled).toBe(false);
    expect(detail.keyboardHandlerEnabled).toBe(false);
    expect(detail.inspectorWriteEnabled).toBe(false);
    expect(detail.eventPersistenceEnabled).toBe(false);
    expect(detail.backendStreamEnabled).toBe(false);
    expect(detail.animationStatePersistenceEnabled).toBe(false);
    expect(detail.requestCreationEnabled).toBe(false);
    expect(detail.workAssignmentEnabled).toBe(false);
    expect(detail.dispatchEnabled).toBe(false);
    expect(detail.auditWriteEnabled).toBe(false);
    expect(detail.nasSaveEnabled).toBe(false);
    expect(detail.safeProjectionOnly).toBe(true);
    expect(detail.rawExcluded).toBe(true);
    expect(JSON.stringify(detail)).not.toMatch(/raw character inspector prompt|raw character inspector task|Traceback|\/Users\/lidises|token-shaped-inspector-detail|private-character-inspector-provider/i);
  });
});


describe("Character Detail Safe Dialogue Copy 1", () => {
  it("projects safe generated dialogue copy for character detail cards without raw text or executable controls", () => {
    const secretSentinel = ["token", "shaped", "dialogue", "copy"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-character-dialogue", status: "active", prompt: "raw character dialogue prompt", provider: "private-character-dialogue-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-dialogue", status: "blocked", title: "raw character dialogue task", body: "/Users/lidises/private/character-dialogue.md", transcript: "Traceback character dialogue transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-dialogue", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-dialogue", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-dialogue", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);

    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);

    expect(dialogue.stageLabel).toBe("Character Detail Safe Dialogue Copy 1");
    expect(dialogue.detailKind).toBe("character_detail_safe_dialogue_copy");
    expect(dialogue.sourceDetailKind).toBe("character_inspector_detail_posture");
    expect(dialogue.bubbleCount).toBe(6);
    expect(dialogue.bubbles.map((bubble) => bubble.role)).toEqual(["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]);
    expect(dialogue.bubbles.map((bubble) => bubble.copyKind)).toEqual(["boss_instruction_waiting", "orchestrator_mediation", "search_evidence", "review_waiting", "wiki_draft_waiting", "nas_approval_required"]);
    expect(dialogue.bubbles.every((bubble) => bubble.generatedCopy.length > 0 && bubble.rawTextVisible === false && bubble.executable === false && bubble.rawExcluded === true)).toBe(true);
    expect(dialogue.enabledControls).toBe(0);
    expect(dialogue.clickHandlerEnabled).toBe(false);
    expect(dialogue.keyboardHandlerEnabled).toBe(false);
    expect(dialogue.formControlEnabled).toBe(false);
    expect(dialogue.eventPersistenceEnabled).toBe(false);
    expect(dialogue.backendStreamEnabled).toBe(false);
    expect(dialogue.animationStatePersistenceEnabled).toBe(false);
    expect(dialogue.requestCreationEnabled).toBe(false);
    expect(dialogue.workAssignmentEnabled).toBe(false);
    expect(dialogue.dispatchEnabled).toBe(false);
    expect(dialogue.auditWriteEnabled).toBe(false);
    expect(dialogue.nasSaveEnabled).toBe(false);
    expect(dialogue.safeProjectionOnly).toBe(true);
    expect(dialogue.rawExcluded).toBe(true);
    expect(JSON.stringify(dialogue)).not.toMatch(/raw character dialogue prompt|raw character dialogue task|Traceback|\/Users\/lidises|token-shaped-dialogue-copy|private-character-dialogue-provider/i);
  });
});


describe("Character Facility Completion Review 1", () => {
  it("summarizes the completed read-only character facility chain and stops at the next large boundary", () => {
    const secretSentinel = ["token", "shaped", "facility", "completion"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-character-completion", status: "active", prompt: "raw completion prompt", provider: "private-completion-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-completion", status: "blocked", title: "raw completion title", body: "/Users/lidises/private/completion.md", transcript: "Traceback completion transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-completion", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-completion", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-completion", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);
    const summary = buildOfficeCharacterPanelBoundarySummary(detail, dialogue, alignment);
    const legend = buildOfficeCharacterFacilityRoleLegend(summary, overlay);
    const strip = buildOfficeCharacterFacilityBoundaryStrip(legend, overlay);
    const ledger = buildOfficeCharacterFacilitySourceLedgerStrip(strip, overlay);

    const completion = buildOfficeCharacterFacilityCompletionReview(ledger);

    expect(completion.stageLabel).toBe("Character Facility Completion Review 1");
    expect(completion.detailKind).toBe("character_facility_completion_review");
    expect(completion.sourceLedgerKind).toBe("character_facility_source_ledger_strip");
    expect(completion.readOnlyTargetLevelReached).toBe(true);
    expect(completion.completedSliceCount).toBe(4);
    expect(completion.completedSlices).toEqual(["Character Panel Boundary Summary 1", "Character Facility Role Legend 1", "Character Facility Boundary Strip 1", "Character Facility Source Ledger Strip 1"]);
    expect(completion.nextLargePhaseBoundary).toBe("event schema and controlled mutation approval boundary");
    expect(completion.nextRequiresExplicitApproval).toBe(true);
    expect(completion.enabledControls).toBe(0);
    expect(completion.eventPersistenceEnabled).toBe(false);
    expect(completion.requestCreationEnabled).toBe(false);
    expect(completion.workAssignmentEnabled).toBe(false);
    expect(completion.dispatchEnabled).toBe(false);
    expect(completion.auditWriteEnabled).toBe(false);
    expect(completion.nasSaveEnabled).toBe(false);
    expect(completion.safeProjectionOnly).toBe(true);
    expect(completion.rawExcluded).toBe(true);
    expect(JSON.stringify(completion)).not.toMatch(/raw completion prompt|raw completion title|Traceback|\/Users\/lidises|token-shaped-facility-completion|private-completion-provider/i);
  });
});


describe("Character Facility Source Ledger Strip 1", () => {
  it("ties facility zones to aggregate source provenance without raw source projection", () => {
    const secretSentinel = ["token", "shaped", "facility", "source", "ledger"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-character-source-ledger", status: "active", prompt: "raw source ledger prompt", provider: "private-source-ledger-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-source-ledger", status: "blocked", title: "raw source ledger title", body: "/Users/lidises/private/source-ledger.md", transcript: "Traceback source ledger transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-source-ledger", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-source-ledger", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-source-ledger", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);
    const summary = buildOfficeCharacterPanelBoundarySummary(detail, dialogue, alignment);
    const legend = buildOfficeCharacterFacilityRoleLegend(summary, overlay);
    const strip = buildOfficeCharacterFacilityBoundaryStrip(legend, overlay);

    const ledger = buildOfficeCharacterFacilitySourceLedgerStrip(strip, overlay);

    expect(ledger.stageLabel).toBe("Character Facility Source Ledger Strip 1");
    expect(ledger.detailKind).toBe("character_facility_source_ledger_strip");
    expect(ledger.sourceBoundaryStripKind).toBe("character_facility_boundary_strip");
    expect(ledger.sourceOverlayKind).toBe("character_state_room_overlay");
    expect(ledger.zoneCount).toBe(6);
    expect(ledger.ledgerItems).toHaveLength(6);
    expect(ledger.ledgerItems.map((item) => item.facilityZoneId)).toEqual(["boss_desk", "orchestrator_desk", "worker_cluster", "right_inspector", "central_board", "nas_vault"]);
    expect(ledger.ledgerItems.map((item) => item.provenanceLabel)).toEqual(["safe role legend", "safe room overlay", "safe marker aggregate", "safe inspector aggregate", "safe board aggregate", "safe NAS boundary aggregate"]);
    expect(ledger.ledgerItems.every((item) => item.rawSourceProjected === false && item.sourceTitleProjected === false && item.pathProjected === false && item.providerProjected === false && item.enabledControls === 0)).toBe(true);
    expect(ledger.sourceLedgerPersistenceEnabled).toBe(false);
    expect(ledger.eventPersistenceEnabled).toBe(false);
    expect(ledger.backendStreamEnabled).toBe(false);
    expect(ledger.requestCreationEnabled).toBe(false);
    expect(ledger.workAssignmentEnabled).toBe(false);
    expect(ledger.dispatchEnabled).toBe(false);
    expect(ledger.auditWriteEnabled).toBe(false);
    expect(ledger.nasSaveEnabled).toBe(false);
    expect(ledger.safeProjectionOnly).toBe(true);
    expect(ledger.rawExcluded).toBe(true);
    expect(JSON.stringify(ledger)).not.toMatch(/raw source ledger prompt|raw source ledger title|Traceback|\/Users\/lidises|token-shaped-facility-source-ledger|private-source-ledger-provider/i);
  });
});


describe("Character Facility Boundary Strip 1", () => {
  it("summarizes facility-zone posture and disabled mutation boundaries without raw projection", () => {
    const secretSentinel = ["token", "shaped", "facility", "strip"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-character-strip", status: "active", prompt: "raw character strip prompt", provider: "private-character-strip-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-strip", status: "blocked", title: "raw character strip title", body: "/Users/lidises/private/character-strip.md", transcript: "Traceback character strip transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-strip", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-strip", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-strip", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);
    const summary = buildOfficeCharacterPanelBoundarySummary(detail, dialogue, alignment);
    const legend = buildOfficeCharacterFacilityRoleLegend(summary, overlay);

    const strip = buildOfficeCharacterFacilityBoundaryStrip(legend, overlay);

    expect(strip.stageLabel).toBe("Character Facility Boundary Strip 1");
    expect(strip.detailKind).toBe("character_facility_boundary_strip");
    expect(strip.sourceLegendKind).toBe("character_facility_role_legend");
    expect(strip.sourceOverlayKind).toBe("character_state_room_overlay");
    expect(strip.zoneCount).toBe(6);
    expect(strip.boundaryCount).toBe(6);
    expect(strip.safeZones.map((zone) => zone.facilityZoneId)).toEqual(["boss_desk", "orchestrator_desk", "worker_cluster", "right_inspector", "central_board", "nas_vault"]);
    expect(strip.safeZones.map((zone) => zone.mutationBoundary)).toEqual(["instruction intake disabled", "mediation write disabled", "assignment disabled", "inspector write disabled", "draft creation disabled", "NAS save disabled"]);
    expect(strip.safeZones.every((zone) => zone.roleCount === 1 && zone.enabledControls === 0 && zone.executable === false && zone.rawExcluded === true)).toBe(true);
    expect(strip.enabledControls).toBe(0);
    expect(strip.clickHandlerEnabled).toBe(false);
    expect(strip.keyboardHandlerEnabled).toBe(false);
    expect(strip.formControlEnabled).toBe(false);
    expect(strip.eventPersistenceEnabled).toBe(false);
    expect(strip.backendStreamEnabled).toBe(false);
    expect(strip.animationStatePersistenceEnabled).toBe(false);
    expect(strip.requestCreationEnabled).toBe(false);
    expect(strip.workAssignmentEnabled).toBe(false);
    expect(strip.dispatchEnabled).toBe(false);
    expect(strip.auditWriteEnabled).toBe(false);
    expect(strip.nasSaveEnabled).toBe(false);
    expect(strip.safeProjectionOnly).toBe(true);
    expect(strip.rawExcluded).toBe(true);
    expect(JSON.stringify(strip)).not.toMatch(/raw character strip prompt|raw character strip title|Traceback|\/Users\/lidises|token-shaped-facility-strip|private-character-strip-provider/i);
  });
});


describe("Character Facility Role Legend 1", () => {
  it("maps the six safe character roles to facility zones and disabled boundary posture", () => {
    const secretSentinel = ["token", "shaped", "facility", "legend"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-character-facility", status: "active", prompt: "raw character facility prompt", provider: "private-character-facility-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-facility", status: "blocked", title: "raw character facility title", body: "/Users/lidises/private/character-facility.md", transcript: "Traceback character facility transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-facility", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-facility", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-facility", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);
    const summary = buildOfficeCharacterPanelBoundarySummary(detail, dialogue, alignment);

    const legend = buildOfficeCharacterFacilityRoleLegend(summary, overlay);

    expect(legend.stageLabel).toBe("Character Facility Role Legend 1");
    expect(legend.detailKind).toBe("character_facility_role_legend");
    expect(legend.sourceSummaryKind).toBe("character_panel_boundary_summary");
    expect(legend.sourceOverlayKind).toBe("character_state_room_overlay");
    expect(legend.roleCount).toBe(6);
    expect(legend.facilityCount).toBe(6);
    expect(legend.legendItems.map((item) => item.role)).toEqual(["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]);
    expect(legend.legendItems.map((item) => item.facilityZoneId)).toEqual(["boss_desk", "orchestrator_desk", "worker_cluster", "right_inspector", "central_board", "nas_vault"]);
    expect(legend.legendItems.map((item) => item.boundaryLabel)).toEqual(["instruction display only", "mediation display only", "research posture only", "review posture only", "wiki draft disabled", "NAS save disabled"]);
    expect(legend.legendItems.every((item) => item.enabledControls === 0 && item.executable === false && item.rawExcluded === true)).toBe(true);
    expect(legend.enabledControls).toBe(0);
    expect(legend.clickHandlerEnabled).toBe(false);
    expect(legend.keyboardHandlerEnabled).toBe(false);
    expect(legend.formControlEnabled).toBe(false);
    expect(legend.eventPersistenceEnabled).toBe(false);
    expect(legend.backendStreamEnabled).toBe(false);
    expect(legend.animationStatePersistenceEnabled).toBe(false);
    expect(legend.requestCreationEnabled).toBe(false);
    expect(legend.workAssignmentEnabled).toBe(false);
    expect(legend.dispatchEnabled).toBe(false);
    expect(legend.auditWriteEnabled).toBe(false);
    expect(legend.nasSaveEnabled).toBe(false);
    expect(legend.safeProjectionOnly).toBe(true);
    expect(legend.rawExcluded).toBe(true);
    expect(JSON.stringify(legend)).not.toMatch(/raw character facility prompt|raw character facility title|Traceback|\/Users\/lidises|token-shaped-facility-legend|private-character-facility-provider/i);
  });
});


describe("Character Panel Boundary Summary 1", () => {
  it("summarizes inspector, bubble, and alignment safety boundaries without raw projection", () => {
    const secretSentinel = ["token", "shaped", "boundary", "summary"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-character-boundary", status: "active", prompt: "raw character boundary prompt", provider: "private-character-boundary-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-boundary", status: "blocked", title: "raw character boundary title", body: "/Users/lidises/private/character-boundary.md", transcript: "Traceback character boundary transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-boundary", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-boundary", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-boundary", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);

    const summary = buildOfficeCharacterPanelBoundarySummary(detail, dialogue, alignment);

    expect(summary.stageLabel).toBe("Character Panel Boundary Summary 1");
    expect(summary.detailKind).toBe("character_panel_boundary_summary");
    expect(summary.panelCount).toBe(3);
    expect(summary.totalRoleCount).toBe(6);
    expect(summary.panels.map((panel) => panel.panelKind)).toEqual(["inspector_detail", "safe_dialogue_copy", "bubble_inspector_alignment"]);
    expect(summary.panels.every((panel) => panel.enabledControls === 0 && panel.rawExcluded === true && panel.executable === false)).toBe(true);
    expect(summary.boundaryLabels).toEqual(["right inspector display only", "generated safe copy only", "route and NAS boundary display only"]);
    expect(summary.enabledControls).toBe(0);
    expect(summary.formControlEnabled).toBe(false);
    expect(summary.eventPersistenceEnabled).toBe(false);
    expect(summary.backendStreamEnabled).toBe(false);
    expect(summary.animationStatePersistenceEnabled).toBe(false);
    expect(summary.requestCreationEnabled).toBe(false);
    expect(summary.workAssignmentEnabled).toBe(false);
    expect(summary.dispatchEnabled).toBe(false);
    expect(summary.auditWriteEnabled).toBe(false);
    expect(summary.nasSaveEnabled).toBe(false);
    expect(summary.safeProjectionOnly).toBe(true);
    expect(summary.rawExcluded).toBe(true);
    expect(JSON.stringify(summary)).not.toMatch(/raw character boundary prompt|raw character boundary title|Traceback|\/Users\/lidises|token-shaped-boundary-summary|private-character-boundary-provider/i);
  });
});


describe("Character Bubble-to-Inspector Alignment 1", () => {
  it("aligns generated bubbles with right-inspector metadata and safe route boundaries", () => {
    const secretSentinel = ["token", "shaped", "bubble", "alignment"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishFixture({
      agents: [{ id: "agent-character-alignment", status: "active", prompt: "raw character alignment prompt", provider: "private-character-alignment-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-alignment", status: "blocked", title: "raw character alignment title", body: "/Users/lidises/private/character-alignment.md", transcript: "Traceback character alignment transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-alignment", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-alignment", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-alignment", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);

    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);

    expect(alignment.stageLabel).toBe("Character Bubble-to-Inspector Alignment 1");
    expect(alignment.detailKind).toBe("character_bubble_inspector_alignment");
    expect(alignment.sourceDialogueKind).toBe("character_detail_safe_dialogue_copy");
    expect(alignment.sourceInspectorKind).toBe("character_inspector_detail_posture");
    expect(alignment.alignmentCount).toBe(6);
    expect(alignment.alignments.map((item) => item.role)).toEqual(["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]);
    expect(alignment.alignments.map((item) => item.inspectorSurfaceId).every((surface) => surface === "right_inspector")).toBe(true);
    expect(alignment.alignments.map((item) => item.routeLabel)).toEqual(["boss → orchestrator", "orchestrator → route", "search → evidence", "evidence → review", "review → wiki", "approval → NAS"]);
    expect(alignment.alignments.map((item) => item.boundaryLabel)).toEqual(["instruction only", "mediation only", "source title hidden", "review execution disabled", "draft creation disabled", "NAS save disabled"]);
    expect(alignment.alignments.every((item) => item.generatedCopy.length > 0 && item.inspectorCardLabel.length > 0 && item.rawTextVisible === false && item.executable === false && item.rawExcluded === true)).toBe(true);
    expect(alignment.enabledControls).toBe(0);
    expect(alignment.clickHandlerEnabled).toBe(false);
    expect(alignment.keyboardHandlerEnabled).toBe(false);
    expect(alignment.formControlEnabled).toBe(false);
    expect(alignment.eventPersistenceEnabled).toBe(false);
    expect(alignment.backendStreamEnabled).toBe(false);
    expect(alignment.animationStatePersistenceEnabled).toBe(false);
    expect(alignment.requestCreationEnabled).toBe(false);
    expect(alignment.workAssignmentEnabled).toBe(false);
    expect(alignment.dispatchEnabled).toBe(false);
    expect(alignment.auditWriteEnabled).toBe(false);
    expect(alignment.nasSaveEnabled).toBe(false);
    expect(alignment.safeProjectionOnly).toBe(true);
    expect(alignment.rawExcluded).toBe(true);
    expect(JSON.stringify(alignment)).not.toMatch(/raw character alignment prompt|raw character alignment title|Traceback|\/Users\/lidises|token-shaped-bubble-alignment|private-character-alignment-provider/i);
  });
});


describe("Desk RPG Projection ViewModel Helper 1", () => {
  it("builds a safe RPG operating-room projection without raw task/provider/path material", () => {
    const buildProjection = (officeView as unknown as {
      buildOfficeDeskRpgProjectionModel: (state: OfficeState) => {
        schemaVersion: 1;
        actors: Array<{ role: string }>;
        facilities: Array<{ id: string }>;
        suppressedCounts: Record<string, number>;
        redactionSummary: { rawExcluded: true };
        safeProjectionOnly: true;
        enabledControls: 0;
        rawExcluded: true;
      };
    }).buildOfficeDeskRpgProjectionModel;

    const projection = buildProjection(officeFixture({
      agents: Array.from({ length: 6 }, (_, index) => ({
        id: `agent-${index}`,
        status: "active",
        prompt: "raw prompt: write private note about clinic",
        transcript: "Traceback (most recent call last): private failure",
        provider: "private-provider-hidden-id",
        api_key: "sk-test-1234567890abcdef",
      })),
      work_items: [
        {
          id: "task-1",
          title: "Safe evidence task",
          status: "open",
          body: "source body at /Users/lidises/private/nas/wiki.md must not leak",
        },
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 4 },
      ],
    }));

    expect(projection.actors.map((actor) => actor.role)).toEqual(expect.arrayContaining(["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]));
    expect(projection.facilities.map((facility) => facility.id)).toEqual(expect.arrayContaining(["boss_desk", "orchestrator_desk", "worker_cluster", "central_board", "right_inspector", "nas_vault", "security_ops_corner", "calm_activity_lane"]));
    expect(projection.enabledControls).toBe(0);
    expect(projection.safeProjectionOnly).toBe(true);
    expect(projection.rawExcluded).toBe(true);
    expect(projection.redactionSummary.rawExcluded).toBe(true);
    expect(projection.suppressedCounts.search_worker).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(projection)).not.toContain("raw prompt: write private note about clinic");
    expect(JSON.stringify(projection)).not.toContain("/Users/lidises/private");
    expect(JSON.stringify(projection)).not.toContain("sk-test-1234567890abcdef");
    expect(JSON.stringify(projection)).not.toContain("Traceback (most recent call last)");
    expect(JSON.stringify(projection)).not.toContain("private-provider-hidden-id");
  });
});

  it("builds Phase 1 RPG scene adapter from safe OfficeState without raw projection", () => {
    const scene = buildOfficeRpgScene(officeFixture({
      generated_at: "2026-05-13T10:00:00Z",
      data_sources: [
        { id: "kanban", status: "ok", checked_at: "2026-05-13T09:59:00Z", item_count: 4, warning_count: 0 },
        { id: "cron", status: "partial", checked_at: "2026-05-13T09:58:00Z", item_count: 2, warning_count: 1, error_summary: "raw /Users/lidises/nas token must not leak" },
      ],
      agents: [
        { id: "agent-1", status: "active", model: "private-model", prompt: "raw prompt must not leak" },
        { id: "session-2", status: "idle", provider: "private-provider", transcript: "raw transcript must not leak" },
      ],
      work_items: [
        { id: "task-1", status: "running", title: "raw task title", body: "secret body" } as unknown as OfficeState["work_items"][number],
        { id: "task-2", status: "blocked", title: "raw blocked title", result: "raw result token" } as unknown as OfficeState["work_items"][number],
        { id: "task-3", status: "done", title: "raw done title", transcript: "raw done transcript" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [
        { id: "job-1", state: "scheduled", last_status: "ok", next_run_at: "2026-05-13T11:00:00Z", script: "/Users/lidises/private.py" } as unknown as OfficeState["automations"][number],
        { id: "job-2", state: "error", last_status: "error", script: "secret script" } as unknown as OfficeState["automations"][number],
      ],
      events: [
        { id: "event-1", category: "workload_changed", room_id: "work", tone: "warning", generated_at: "2026-05-13T09:55:00Z", detail: "raw token detail" } as unknown as OfficeState["events"][number],
      ],
      redactions: { policy_version: 1, redacted_field_count: 3, omitted_sections: ["prompt", "transcript"], warnings: ["raw warning"] },
    }));

    expect(scene).toMatchObject({
      schemaVersion: 1,
      generatedAt: "2026-05-13T10:00:00Z",
      mode: "read_only",
      safety: {
        factual: true,
        readOnly: true,
        source: "OfficeState",
        omittedRawSections: ["omitted-1", "omitted-2"],
      },
    });
    expect(scene.rooms.map((room) => room.id)).toEqual(["command", "agent_desks", "task_board", "cron_room", "source_archive", "incident_corner"]);
    expect(scene.rooms.find((room) => room.id === "agent_desks")).toMatchObject({ label: "Agent Desks", counts: { agents: 2 }, severity: "info" });
    expect(scene.rooms.find((room) => room.id === "task_board")).toMatchObject({ counts: { work_items: 3, blocked: 1, completed: 1 }, severity: "danger" });
    expect(scene.rooms.find((room) => room.id === "incident_corner")).toMatchObject({ counts: { incidents: 3 }, severity: "danger" });
    expect(scene.entities).toHaveLength(7);
    expect(scene.entities.map((entity) => entity.kind)).toEqual(expect.arrayContaining(["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]));
    expect(scene.entities.filter((entity) => entity.kind === "search_worker")).toHaveLength(2);
    expect(scene.entities.find((entity) => entity.id === "orchestrator-0")).toMatchObject({ kind: "orchestrator", room: "command", status: "working", severity: "info", linkTarget: { type: "safe_ref", ref: "actor:orchestrator" } });
    expect(scene.entities.find((entity) => entity.id === "reviewer-0")).toMatchObject({ kind: "reviewer", room: "incident_corner", status: "blocked", severity: "danger" });
    expect(scene.entities.find((entity) => entity.id === "nas_keeper-0")).toMatchObject({ kind: "nas_keeper", room: "incident_corner", status: "blocked", severity: "danger" });
    expect(scene.recentEvents).toEqual([{ id: "event-0", label: "최근 안전 이벤트", room: "task_board", severity: "warning", at: "2026-05-13T09:55:00Z" }]);
    expect(scene.entities.every((entity) => entity.positionHint.x >= 8 && entity.positionHint.x <= 92 && entity.positionHint.y >= 10 && entity.positionHint.y <= 88)).toBe(true);
    expect(JSON.stringify(scene)).not.toMatch(/raw prompt|raw transcript|raw task|raw blocked|raw done|raw result|secret body|secret script|raw token|raw warning|\/Users\/lidises|private-model|private-provider/i);
  });

  it("builds a first-implementation mission storyboard for the unified operating room", () => {
    const scene = buildOfficeRpgScene(officeFixture({
      data_sources: [
        { id: "kanban", status: "ok", checked_at: "2026-05-13T09:59:00Z", item_count: 4, warning_count: 0 },
        { id: "paperclip:clinic-evidence", status: "partial", checked_at: "2026-05-13T09:58:00Z", item_count: 2, warning_count: 1, error_summary: "raw prompt token path must not leak" } as unknown as OfficeState["data_sources"][number],
      ],
      agents: [
        { id: "orchestrator", status: "active", model: "private-model", prompt: "raw prompt must not leak" },
      ],
      work_items: [
        { id: "wiki-1", status: "running", title: "raw scientific acupuncture evidence task", body: "secret body" } as unknown as OfficeState["work_items"][number],
        { id: "review-1", status: "blocked", title: "raw review title", result: "raw token" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [
        { id: "validator", state: "scheduled", last_status: "ok", script: "/Users/lidises/private.py" } as unknown as OfficeState["automations"][number],
      ],
    }));

    const storyboard = buildOfficeRpgMissionStoryboard(scene);

    expect(storyboard.stageLabel).toBe("First Implementation Scene");
    expect(storyboard.title).toBe("지식위키 요청 → 통합 운영실 처리 흐름");
    expect(storyboard.steps.map((step) => step.id)).toEqual(["request", "orchestrate", "board", "evidence", "review", "approval"]);
    expect(storyboard.steps.map((step) => step.room)).toEqual(["command", "agent_desks", "task_board", "source_archive", "incident_corner", "command"]);
    expect(storyboard.steps.find((step) => step.id === "board")?.detail).toContain("작업 카드");
    expect(storyboard.steps.find((step) => step.id === "evidence")?.detail).toContain("Paperclip");
    expect(storyboard.approvalBoundary).toBe("최종 저장/NAS 반영은 사용자 승인 전까지 UI에서 실행하지 않습니다");
    expect(storyboard.safeProjectionOnly).toBe(true);
    expect(JSON.stringify(storyboard)).not.toMatch(/raw|prompt|transcript|task_body|body|script|secret|token|private|\/Users\/lidises|model|provider|sk-/i);
  });

  it("builds a safe Orchestrator Desk 1 decomposition preview without executable actions", () => {
    const scene = buildOfficeRpgScene(officeFixture({
      data_sources: [
        { id: "kanban", status: "ok", checked_at: "2026-05-14T09:59:00Z", item_count: 4, warning_count: 0 },
        { id: "paperclip:/Users/lidises/nas/raw", status: "partial", checked_at: "2026-05-14T09:58:00Z", item_count: 2, warning_count: 1, error_summary: "raw prompt token path must not leak" } as unknown as OfficeState["data_sources"][number],
      ],
      agents: [
        { id: "orchestrator", status: "active", model: "private-model", prompt: "raw prompt must not leak" },
        { id: "search-worker", status: "idle", provider: "private-provider", transcript: "raw transcript must not leak" },
      ],
      work_items: [
        { id: "wiki-1", status: "running", title: "침 치료 과학적 근거 위키 글 작성", body: "secret body" } as unknown as OfficeState["work_items"][number],
        { id: "review-1", status: "blocked", title: "raw review title", result: "raw token" } as unknown as OfficeState["work_items"][number],
      ],
    }));

    const desk = buildOfficeRpgOrchestratorDesk(scene);

    expect(desk.stageLabel).toBe("Orchestrator Desk 1");
    expect(desk.title).toBe("오케스트레이터 데스크 · 안전 분해 미리보기");
    expect(desk.intent).toBe("사용자 지시를 실행이 아니라 운영 가능한 요청 흐름으로 정리합니다");
    expect(desk.cards.map((card) => card.id)).toEqual(["intake", "decompose", "assign", "evidence", "review", "authority"]);
    expect(desk.cards.find((card) => card.id === "decompose")).toMatchObject({ label: "작업 분해", value: "작업 2개", tone: "info" });
    expect(desk.cards.find((card) => card.id === "assign")).toMatchObject({ label: "역할 배치", value: "직원 2명", tone: "info" });
    expect(desk.cards.find((card) => card.id === "evidence")).toMatchObject({ label: "근거 요구", value: "소스 2개", tone: "warning" });
    expect(desk.cards.find((card) => card.id === "review")).toMatchObject({ label: "리뷰 게이트", value: "막힘 1개", tone: "warning" });
    expect(desk.actionBoundary).toBe("이 데스크는 UserInstructionSubmitted/ActionRequested 같은 요청 형태만 보여주며 실행 이벤트를 만들지 않습니다");
    expect(desk.safeProjectionOnly).toBe(true);
    expect(JSON.stringify(desk)).not.toMatch(/raw|prompt|transcript|task_body|body|script|secret|token|private|\/Users\/lidises|model|provider|sk-|침 치료/i);
  });

  it("builds a safe Kanban Board 1 facility preview without writing task state", () => {
    const scene = buildOfficeRpgScene(officeFixture({
      work_items: [
        { id: "wiki-1", status: "running", title: "raw clinic wiki task", body: "secret body" } as unknown as OfficeState["work_items"][number],
        { id: "review-1", status: "blocked", title: "raw review title", result: "raw token" } as unknown as OfficeState["work_items"][number],
        { id: "done-1", status: "done", title: "raw done title", transcript: "raw transcript" } as unknown as OfficeState["work_items"][number],
      ],
      agents: [{ id: "board-clerk", status: "active", prompt: "raw prompt" }],
      data_sources: [{ id: "kanban", status: "ok", checked_at: "2026-05-14T10:00:00Z", item_count: 3, warning_count: 0 }],
    }));

    const board = buildOfficeRpgKanbanBoardFacility(scene);

    expect(board.stageLabel).toBe("Kanban Board 1");
    expect(board.title).toBe("운영 보드 · 안전 작업판 미리보기");
    expect(board.sourceOfTruth).toBe("VPS ai-office Kanban");
    expect(board.lanes.map((lane) => lane.id)).toEqual(["intake", "active", "blocked", "done", "clerk", "boundary"]);
    expect(board.lanes.find((lane) => lane.id === "active")).toMatchObject({ label: "진행", value: "1개", tone: "info" });
    expect(board.lanes.find((lane) => lane.id === "blocked")).toMatchObject({ label: "검토 필요", value: "1개", tone: "warning" });
    expect(board.lanes.find((lane) => lane.id === "done")).toMatchObject({ label: "완료", value: "1개", tone: "neutral" });
    expect(board.writeBoundary).toBe("이 보드는 작업 상태를 안전 투영으로만 보여주며 Kanban write/transition을 실행하지 않습니다");
    expect(board.safeProjectionOnly).toBe(true);
    expect(JSON.stringify(board)).not.toMatch(/raw|prompt|transcript|task_body|body|script|secret|token|private|\/Users\/lidises|clinic|model|provider|sk-/i);
  });

  it("builds a safe Paperclip Source Archive 1 facility preview without raw evidence", () => {
    const scene = buildOfficeRpgScene(officeFixture({
      data_sources: [
        { id: "paperclip:/Users/lidises/nas/private", status: "ok", checked_at: "2026-05-14T10:00:00Z", item_count: 4, warning_count: 0, error_summary: "raw safe tag should not leak" } as unknown as OfficeState["data_sources"][number],
        { id: "sourceTags:clinic-growth", status: "partial", checked_at: "2026-05-14T10:01:00Z", item_count: 2, warning_count: 1, error_summary: "secret token path prompt" } as unknown as OfficeState["data_sources"][number],
        { id: "manifest:pcwb-safe-001", status: "ok", checked_at: "2026-05-14T10:02:00Z", item_count: 1, warning_count: 0, error_summary: "raw manifest body" } as unknown as OfficeState["data_sources"][number],
      ],
      work_items: [{ id: "wiki-1", status: "running", title: "raw clinic wiki task", body: "secret body" } as unknown as OfficeState["work_items"][number]],
    }));

    const archive = buildOfficeRpgSourceArchiveFacility(scene);

    expect(archive.stageLabel).toBe("Paperclip Source Archive 1");
    expect(archive.title).toBe("근거 자료실 · 안전 근거 선반 미리보기");
    expect(archive.shelves.map((shelf) => shelf.id)).toEqual(["evidence", "sourceTags", "manifests", "validation", "boundary", "handoff"]);
    expect(archive.shelves.find((shelf) => shelf.id === "evidence")).toMatchObject({ label: "근거 선반", value: "소스 3개", tone: "info" });
    expect(archive.shelves.find((shelf) => shelf.id === "sourceTags")).toMatchObject({ label: "sourceTags", value: "태그 자세", tone: "warning" });
    expect(archive.shelves.find((shelf) => shelf.id === "manifests")).toMatchObject({ label: "안전 manifest", value: "후보 3개", tone: "info" });
    expect(archive.rawBoundary).toBe("이 자료실은 safe sourceTag/manifest posture만 보여주며 원문, 경로, 본문, projection transfer/promote를 실행하지 않습니다");
    expect(archive.safeProjectionOnly).toBe(true);
    expect(JSON.stringify(archive)).not.toMatch(/paperclip:\/Users|\/Users\/lidises|clinic-growth|pcwb-safe-001|secret token path prompt|raw safe tag should not leak|raw manifest body|raw clinic wiki task|secret body|private/i);
  });

  it("builds a safe Review Corner 1 facility preview without executable approval", () => {
    const scene = buildOfficeRpgScene(officeFixture({
      data_sources: [
        { id: "paperclip:/Users/lidises/nas/private", status: "partial", checked_at: "2026-05-14T10:00:00Z", item_count: 2, warning_count: 1, error_summary: "raw prompt token path must not leak" } as unknown as OfficeState["data_sources"][number],
      ],
      agents: [{ id: "reviewer", status: "active", model: "private-model", prompt: "raw prompt" }],
      work_items: [
        { id: "wiki-1", status: "blocked", title: "raw clinic review", body: "secret body" } as unknown as OfficeState["work_items"][number],
        { id: "wiki-2", status: "review", title: "raw review waiting", result: "secret token" } as unknown as OfficeState["work_items"][number],
        { id: "wiki-3", status: "done", title: "raw done", transcript: "raw transcript" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [{ id: "validator", state: "error", last_status: "error", script: "/Users/lidises/private.py" } as unknown as OfficeState["automations"][number]],
      events: [{ id: "event-1", category: "review_needed", room_id: "incident_corner", tone: "warning", generated_at: "2026-05-14T10:02:00Z", detail: "raw token detail" } as unknown as OfficeState["events"][number]],
    }));

    const review = buildOfficeRpgReviewCornerFacility(scene);

    expect(review.stageLabel).toBe("Review Corner 1");
    expect(review.title).toBe("리뷰 코너 · 안전 승인 대기 미리보기");
    expect(review.stations.map((station) => station.id)).toEqual(["queue", "blocked", "source", "automation", "escalation", "boundary"]);
    expect(review.stations.find((station) => station.id === "queue")).toMatchObject({ label: "검토 큐", value: "작업 3개", tone: "info" });
    expect(review.stations.find((station) => station.id === "blocked")).toMatchObject({ label: "막힘", value: "1개", tone: "warning" });
    expect(review.stations.find((station) => station.id === "source")).toMatchObject({ label: "근거 확인", value: "소스 1개", tone: "warning" });
    expect(review.approvalBoundary).toBe("이 리뷰 코너는 승인 필요 posture만 보여주며 approve/reject, Kanban transition, 저장, 전송, 서비스 작업을 실행하지 않습니다");
    expect(review.safeProjectionOnly).toBe(true);
    expect(JSON.stringify(review)).not.toMatch(/paperclip:\/Users|\/Users\/lidises|raw prompt token path|raw clinic review|raw review waiting|secret body|secret token|raw transcript|private-model|private\.py/i);
  });

  it("builds a safe Approval Console 1 facility preview without executable controls", () => {
    const scene = buildOfficeRpgScene(officeFixture({
      data_sources: [
        { id: "paperclip:/Users/lidises/nas/private", status: "partial", checked_at: "2026-05-14T10:00:00Z", item_count: 2, warning_count: 1, error_summary: "raw approval source path token" } as unknown as OfficeState["data_sources"][number],
      ],
      agents: [{ id: "approver", status: "active", model: "private-model", prompt: "raw approval prompt" }],
      work_items: [
        { id: "wiki-1", status: "blocked", title: "raw approval blocked", body: "secret body" } as unknown as OfficeState["work_items"][number],
        { id: "wiki-2", status: "review", title: "raw approval review", result: "secret token" } as unknown as OfficeState["work_items"][number],
        { id: "wiki-3", status: "done", title: "raw approval done", transcript: "raw transcript" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [{ id: "promote", state: "error", last_status: "error", script: "/Users/lidises/promote.py" } as unknown as OfficeState["automations"][number]],
      events: [{ id: "event-1", category: "approval_needed", room_id: "incident_corner", tone: "warning", generated_at: "2026-05-14T10:03:00Z", detail: "raw approval token detail" } as unknown as OfficeState["events"][number]],
    }));

    const approval = buildOfficeRpgApprovalConsoleFacility(scene);

    expect(approval.stageLabel).toBe("Approval Console 1");
    expect(approval.title).toBe("승인 콘솔 · 비실행 승인 자세 미리보기");
    expect(approval.controls.map((control) => control.id)).toEqual(["summary", "human", "dryRun", "audit", "boundary", "disabled"]);
    expect(approval.controls.find((control) => control.id === "summary")).toMatchObject({ label: "승인 필요", value: "신호 2개", tone: "warning", disabled: true });
    expect(approval.controls.find((control) => control.id === "dryRun")).toMatchObject({ label: "dry-run only", value: "비활성", tone: "neutral", disabled: true });
    expect(approval.controls.find((control) => control.id === "disabled")).toMatchObject({ label: "실행 버튼", value: "없음", tone: "neutral", disabled: true });
    expect(approval.decisionBoundary).toBe("이 콘솔은 승인 자세와 감사 handoff만 보여주며 approve/reject, 저장, 전송, Kanban transition, projection promote를 실행하지 않습니다");
    expect(approval.safeProjectionOnly).toBe(true);
    expect(JSON.stringify(approval)).not.toMatch(/paperclip:\/Users|\/Users\/lidises|raw approval|secret body|secret token|raw transcript|private-model|promote\.py/i);
  });

  it("builds a dynamic projection orchestration view from safe cache and source posture", () => {
    const orchestration = buildOfficeProjectionOrchestration(officeFixture({
      data_sources: [
        { id: "kanban", status: "ok", checked_at: "2026-05-12T08:00:00Z", item_count: 15, warning_count: 0 },
        { id: "paperclip:private-source", status: "missing", checked_at: "2026-05-12T08:00:00Z", item_count: 0, warning_count: 1, error_summary: "raw prompt token secret path must not leak" } as unknown as OfficeState["data_sources"][number],
      ],
      projection_cache: {
        schema_version: 1,
        status: "active",
        redacted: true,
        cache_layout: { incoming: "incoming", active: "active", archive: "archive", rejected: "rejected" },
        active: {
          bundle_id: "pcwb-safe-001",
          generated_at: "2026-05-12T07:15:00Z",
          generated_by: "mac",
          source_kind: "paperclip",
          source_tags: ["paperclip", "clinic-growth"],
          freshness: { stale_after: "2026-05-13T07:15:00Z", hard_expire_after: "2026-05-19T07:15:00Z", policy: "show-last-known-good-with-stale-label" },
          validator: { result: "pass", checked_at: "2026-05-12T07:15:05Z", safe_summary: "safe only" },
          redaction: { raw_excluded: true, guarantee: "raw_excluded_and_allowlisted_fields_only" },
          payload_summary: { safe_item_count: 3, attention_count: 0 },
          display: { cards: ["manifests"] },
          bundle_path: "pcwb-safe-001",
        },
        rejected: { count: 0, recent: [] },
      },
    }));

    expect(orchestration.stageLabel).toBe("Projection Orchestration");
    expect(orchestration.nodes.map((node) => node.id)).toEqual(["relay", "validator", "cache", "dashboard"]);
    expect(orchestration.nodes.find((node) => node.id === "relay")).toMatchObject({ value: "mac · paperclip", motion: "active" });
    expect(orchestration.nodes.find((node) => node.id === "validator")).toMatchObject({ value: "pass", tone: "positive" });
    expect(orchestration.flows.map((flow) => [flow.id, flow.active])).toEqual([["relay-validator", true], ["validator-cache", true], ["cache-dashboard", true]]);
    expect(orchestration.safetyNote).toContain("직접 원천 접근이 아니라");
    expect(JSON.stringify(orchestration)).not.toMatch(/\/Users\/|raw prompt|token|secret|clinic-growth/i);
  });

  it("summarizes Office Projection Pipeline cache without leaking rejected raw values", () => {
    const summary = buildOfficeProjectionCacheSummary(officeFixture({
      projection_cache: {
        schema_version: 1,
        status: "active",
        redacted: true,
        cache_layout: { incoming: "incoming", active: "active", archive: "archive", rejected: "rejected" },
        active: {
          bundle_id: "pcwb-safe-001",
          generated_at: "2026-05-12T07:15:00Z",
          generated_by: "mac",
          source_kind: "paperclip",
          source_tags: ["paperclip", "clinic-growth"],
          freshness: { stale_after: "2026-05-13T07:15:00Z", hard_expire_after: "2026-05-19T07:15:00Z", policy: "show-last-known-good-with-stale-label" },
          validator: { result: "pass", checked_at: "2026-05-12T07:15:05Z", safe_summary: "safe summary only" },
          redaction: { raw_excluded: true, guarantee: "raw_excluded_and_allowlisted_fields_only" },
          payload_summary: { safe_item_count: 3, attention_count: 0 },
          display: { cards: ["manifests", "privateDashboard"] },
          bundle_path: "pcwb-safe-001",
        },
        rejected: {
          count: 1,
          recent: [{ bundle_path: "bad-raw", status: "rejected", reason_count: 2, reasons: ["private path pattern", "secret-like value"], field_paths: ["payload.summary.note"], checked_at: "2026-05-12T07:16:00Z" }],
        },
      },
    }));

    expect(summary.stageLabel).toBe("Office Projection Pipeline 1");
    expect(summary.status).toBe("active");
    expect(summary.cards.map((card) => card.id)).toEqual(["active", "freshness", "rejected"]);
    expect(summary.cards.find((card) => card.id === "active")).toMatchObject({ title: "활성 projection", value: "pcwb-safe-001", tone: "positive" });
    expect(summary.cards.find((card) => card.id === "freshness")?.detail).toContain("mac · paperclip");
    expect(summary.cards.find((card) => card.id === "rejected")).toMatchObject({ title: "최근 거부", value: "1개", tone: "warning" });
    expect(JSON.stringify(summary)).not.toMatch(/\/Users\/|token=|secret|raw prompt|raw transcript/i);
  });


  it("builds a gated mutation-control readiness plan without executable browser actions", () => {
    const plan = buildOfficeMutationControlReadiness(officeFixture({
      capabilities: { read_only: false, mutations_enabled: true, remote_mode: "tailscale" },
    }));

    expect(plan.stageLabel).toBe("Mutation Control Readiness 2");
    expect(plan.status).toBe("armed-review-only");
    expect(plan.summary).toContain("가장 낮은 위험 후보는 safe projection dry-run입니다");
    expect(plan.gates.map((gate) => gate.id)).toEqual(["session", "dryRun", "audit", "rollback"]);
    expect(plan.gates.every((gate) => gate.satisfied === false)).toBe(true);
    expect(plan.controls.map((control) => control.id)).toEqual(["projection", "kanban", "automation", "service"]);
    expect(plan.controls.every((control) => control.enabled === false)).toBe(true);
    expect(plan.controls.find((control) => control.id === "projection")).toMatchObject({ risk: "low", recommendedOrder: 1, dryRunOnly: true });
    expect(plan.controls.find((control) => control.id === "service")?.requires).toContain("service-specific approval");
    expect(JSON.stringify(plan)).not.toMatch(/restart|delete|merge|ready|token|secret|\/Users\//i);
  });

  it("groups unknown work safely without reading sensitive body fields", () => {
    const grouped = groupByText([
      { id: "1", status: "blocked", title: "safe title", body: "raw body must not matter" },
      { id: "2", status: "", title: "missing status" },
    ], "status", "unknown");

    expect(Object.keys(grouped)).toEqual(["blocked", "unknown"]);
    expect(grouped.blocked).toHaveLength(1);
    expect(grouped.unknown).toHaveLength(1);
  });

  it("caps dense lists until show-more is requested", () => {
    const rows = Array.from({ length: 8 }, (_, index) => ({ id: index }));

    expect(visibleRows(rows, 6, false)).toHaveLength(6);
    expect(visibleRows(rows, 6, true)).toHaveLength(8);
  });

  it("documents browser-local timezone formatting for office timestamps", () => {
    expect(buildOfficeTimeDisplayPolicy()).toEqual({
      label: "시간 표시",
      value: "브라우저 로컬 시간대",
      detail: "브라우저 locale/timezone 기준으로 표시합니다. KST 고정 변환은 하지 않습니다.",
    });
  });

  it("builds a safe Source Health 1 rail across Kanban, Paperclip, automation, routing, and redaction", () => {
    const rail = buildOfficeSourceHealthRail(officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-11T08:00:00Z", item_count: 3, warning_count: 0 },
        { id: "kanban", status: "partial", checked_at: "2026-05-11T08:00:00Z", item_count: 8, warning_count: 2, error_summary: "raw /Users/lidises/nas path must not appear" },
        { id: "paperclip:/Users/lidises/nas/raw", status: "missing", checked_at: "2026-05-11T08:00:00Z", item_count: 0, warning_count: 1, source_type: "paperclip", tags: ["source:safe", "raw prompt"] } as unknown as OfficeState["data_sources"][number],
        { id: "cron", status: "unavailable", checked_at: "2026-05-11T08:00:00Z", item_count: 1, warning_count: 0, error_summary: "secret script must not appear" },
        { id: "topics", status: "error", checked_at: "2026-05-11T08:00:00Z", item_count: 0, warning_count: 1, error_summary: "token sk-office-redaction-sentinel" },
      ],
      redactions: { policy_version: 1, redacted_field_count: 4, omitted_sections: ["prompt"], warnings: ["raw warning must not appear"] },
    }));

    expect(rail.stageLabel).toBe("Office Source Health 1");
    expect(rail.items.map((item) => item.id)).toEqual(["sessions", "kanban", "paperclip", "automation", "routing", "redaction"]);
    expect(rail.items.find((item) => item.id === "kanban")).toMatchObject({ label: "Kanban", status: "partial", tone: "warning", sourceCount: 1, itemCount: 8, warningCount: 2 });
    expect(rail.items.find((item) => item.id === "paperclip")).toMatchObject({ label: "Paperclip", status: "missing", tone: "warning", sourceCount: 1, itemCount: 0, warningCount: 1 });
    expect(rail.items.find((item) => item.id === "automation")).toMatchObject({ label: "자동화", status: "unavailable", tone: "neutral" });
    expect(rail.items.find((item) => item.id === "routing")).toMatchObject({ label: "라우팅", status: "error", tone: "negative" });
    expect(rail.items.find((item) => item.id === "redaction")).toMatchObject({ label: "가림", status: "partial", tone: "warning", warningCount: 4 });
    expect(JSON.stringify(rail)).not.toMatch(/\/Users\/lidises|raw|prompt|secret|token|script|sk-office-redaction-sentinel/i);
    const warningOnlyRail = buildOfficeSourceHealthRail(officeFixture({
      redactions: { policy_version: 1, redacted_field_count: 0, omitted_sections: [], warnings: ["raw warning body must not appear"] },
    }));
    expect(warningOnlyRail.items.find((item) => item.id === "redaction")).toMatchObject({ status: "partial", tone: "warning", warningCount: 1 });
    expect(JSON.stringify(warningOnlyRail)).not.toMatch(/raw warning body/i);
  });

  it("builds compact Source Health 2 diagnostics without leaking raw source details", () => {
    const diagnostics = buildOfficeSourceHealthCompactDiagnostics(officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-11T08:00:00Z", item_count: 3, warning_count: 0 },
        { id: "kanban", status: "partial", checked_at: "2026-05-11T08:00:00Z", item_count: 8, warning_count: 2, error_summary: "raw /Users/lidises/nas path must not appear" },
        { id: "paperclip:/Users/lidises/nas/raw", status: "missing", checked_at: "2026-05-11T08:00:00Z", item_count: 0, warning_count: 1, source_type: "paperclip", tags: ["source:safe", "raw prompt"] } as unknown as OfficeState["data_sources"][number],
        { id: "cron", status: "unavailable", checked_at: "2026-05-11T08:00:00Z", item_count: 1, warning_count: 0, error_summary: "secret script must not appear" },
        { id: "topics", status: "error", checked_at: "2026-05-11T08:00:00Z", item_count: 0, warning_count: 1, error_summary: "token sk-office-redaction-sentinel" },
      ],
      redactions: { policy_version: 1, redacted_field_count: 4, omitted_sections: ["prompt"], warnings: ["raw warning must not appear"] },
    }));

    expect(diagnostics.stageLabel).toBe("Office Source Health 2");
    expect(diagnostics.cards.map((card) => card.id)).toEqual(["coverage", "attention", "readability"]);
    expect(diagnostics.cards.find((card) => card.id === "coverage")).toMatchObject({ title: "소스 커버리지", count: 6, tone: "warning" });
    expect(diagnostics.cards.find((card) => card.id === "attention")).toMatchObject({ title: "확인 필요", count: 4, tone: "negative" });
    expect(diagnostics.cards.find((card) => card.id === "readability")).toMatchObject({ title: "읽기 밀도", count: 3, tone: "warning" });
    expect(diagnostics.detail).toContain("상단 3장 요약");
    expect(JSON.stringify(diagnostics)).not.toMatch(/\/Users\/lidises|raw|prompt|secret|token|script|sk-office-redaction-sentinel/i);
  });

  it("summarizes lower Office sections so details can stay collapsed by default", () => {
    const plan = buildOfficePageSectionPlan(officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-11T08:00:00Z", item_count: 12, warning_count: 0 },
        { id: "topics", status: "missing", checked_at: "2026-05-11T08:00:00Z", item_count: 0, warning_count: 0 },
        { id: "paperclip:safe", status: "ok", checked_at: "2026-05-11T08:00:00Z", item_count: 1, warning_count: 0, source_type: "paperclip", tags: ["source:safe", "secret tag ignored"] } as unknown as OfficeState["data_sources"][number],
      ],
      agents: [{ id: "session-1", status: "active", source_platform: "cli" }],
      work_items: [{ id: "w1", status: "blocked", title: "raw body should not appear", body: "secret task body" } as unknown as OfficeState["work_items"][number]],
      automations: [{ id: "a1", state: "scheduled", last_status: "ok", script: "secret script" } as unknown as OfficeState["automations"][number]],
      topics: [],
      provenance: [{ source: "paperclip:safe", label: "safe source", detail: "raw path must not appear" } as unknown as OfficeState["provenance"][number]],
      events: [{ id: "e1", kind: "safe_event", source: "office", created_at: "2026-05-11T08:00:00Z" } as unknown as OfficeState["events"][number]],
      redactions: { policy_version: 1, redacted_field_count: 3, omitted_sections: ["prompt"], warnings: [] },
    }));

    expect(plan.map((section) => section.id)).toEqual(["sources", "paperclip", "work", "automation", "routing", "events"]);
    expect(plan.find((section) => section.id === "sources")).toMatchObject({ label: "소스 상태", count: 3, defaultOpen: false });
    expect(plan.find((section) => section.id === "paperclip")?.summary).toContain("출처 1개");
    expect(plan.find((section) => section.id === "work")?.summary).toContain("세션 1개");
    expect(plan.find((section) => section.id === "routing")?.summary).toContain("출처 기록 1개");
    expect(JSON.stringify(plan)).not.toMatch(/raw|secret|body|script|path/i);
  });

  it("builds a read-only Orchestrator Mediation Queue 1 before authority candidates", () => {
    const queue = buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T13:50:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/mediation", status: "partial", checked_at: "2026-05-14T13:45:00Z", item_count: 1, warning_count: 1, error_summary: "raw mediation token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw mediation work", body: "secret mediation body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-private", category: "approval_needed", room_id: "command", tone: "warning", generated_at: "2026-05-14T13:49:00Z", detail: "raw mediation event token" } as unknown as OfficeState["events"][number]],
    }))))));

    expect(queue.stageLabel).toBe("Orchestrator Mediation Queue 1");
    expect(queue.enabledControls).toBe(0);
    expect(queue.enqueueEnabled).toBe(false);
    expect(queue.candidatePromotionEnabled).toBe(false);
    expect(queue.items.map((item) => item.intentKind)).toEqual(["user_instruction", "character_quick_action", "system_attention"]);
    expect(queue.items.every((item) => item.status === "waiting_for_orchestrator" && item.orchestratorRequired && item.rawExcluded)).toBe(true);
    expect(queue.contractSnapshot).toMatchObject({ dispatchEnabled: false, adaptersInstalled: false });
    expect(queue.safeBoundary).toContain("queue posture only");
    expect(JSON.stringify(queue)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw mediation|secret mediation|private|token/i);
  });

  it("builds Worker Intent Routing 1 as read-only routing posture after mediation", () => {
    const routing = buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T14:25:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/routing", status: "partial", checked_at: "2026-05-14T14:20:00Z", item_count: 1, warning_count: 1, error_summary: "raw routing token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw worker route", body: "secret worker routing body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-worker-private", category: "approval_needed", room_id: "command", tone: "warning", generated_at: "2026-05-14T14:24:00Z", detail: "raw worker routing event token" } as unknown as OfficeState["events"][number]],
    })))))));

    expect(routing.stageLabel).toBe("Worker Intent Routing 1");
    expect(routing.enabledControls).toBe(0);
    expect(routing.workAssignmentEnabled).toBe(false);
    expect(routing.requestCreationEnabled).toBe(false);
    expect(routing.dispatchEnabled).toBe(false);
    expect(routing.routes.map((route) => route.intentKind)).toEqual(["user_instruction", "character_quick_action", "system_attention"]);
    expect(routing.routes.map((route) => route.targetFacility)).toEqual(["orchestrator_desk", "agent_desks", "incident_corner"]);
    expect(routing.routes.every((route) => route.status === "routing_posture_only" && route.assignmentStatus === "not_assigned" && route.rawExcluded)).toBe(true);
    expect(routing.queueSnapshot).toMatchObject({ enqueueEnabled: false, candidatePromotionEnabled: false });
    expect(routing.safeBoundary).toContain("routing posture only");
    expect(JSON.stringify(routing)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw worker|secret worker|private|token/i);
  });

  it("builds Worker Facility Readiness 1 as read-only prerequisites for routed facilities", () => {
    const readiness = buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T14:45:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/facility", status: "partial", checked_at: "2026-05-14T14:40:00Z", item_count: 1, warning_count: 1, error_summary: "raw facility token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw facility task", body: "secret facility body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-facility-private", category: "approval_needed", room_id: "command", tone: "warning", generated_at: "2026-05-14T14:44:00Z", detail: "raw facility event token" } as unknown as OfficeState["events"][number]],
    }))))))));

    expect(readiness.stageLabel).toBe("Worker Facility Readiness 1");
    expect(readiness.enabledControls).toBe(0);
    expect(readiness.workAssignmentEnabled).toBe(false);
    expect(readiness.requestCreationEnabled).toBe(false);
    expect(readiness.dispatchEnabled).toBe(false);
    expect(readiness.auditWriteEnabled).toBe(false);
    expect(readiness.facilities.map((facility) => facility.id)).toEqual(["orchestrator_desk", "agent_desks", "incident_corner"]);
    expect(readiness.facilities.map((facility) => facility.workerRole)).toEqual(["orchestrator", "facility_worker", "safety_reviewer"]);
    expect(readiness.facilities.every((facility) => facility.status === "prerequisites_missing" && facility.assignmentReady === false && facility.rawExcluded)).toBe(true);
    expect(readiness.facilities.flatMap((facility) => facility.prerequisites.map((item) => item.id))).toEqual([
      "orchestrator_mediation_locked",
      "human_instruction_scope",
      "assignment_audit_sink",
      "worker_capacity_snapshot",
      "request_creation_gate",
      "dispatch_adapter_disabled",
      "incident_review_policy",
      "safe_attention_context",
      "audit_write_gate",
    ]);
    expect(readiness.routingSnapshot).toMatchObject({ workAssignmentEnabled: false, requestCreationEnabled: false, dispatchEnabled: false });
    expect(readiness.safeBoundary).toContain("facility readiness only");
    expect(JSON.stringify(readiness)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw facility|secret facility|private|token/i);
  });

  it("builds Worker Assignment Candidate Gate 1 as blocked display-only candidates", () => {
    const candidateGate = buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T15:05:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/candidate", status: "partial", checked_at: "2026-05-14T15:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw candidate token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw candidate task", body: "secret candidate body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-candidate-private", category: "approval_needed", room_id: "command", tone: "warning", generated_at: "2026-05-14T15:04:00Z", detail: "raw candidate event token" } as unknown as OfficeState["events"][number]],
    })))))))));

    expect(candidateGate.stageLabel).toBe("Worker Assignment Candidate Gate 1");
    expect(candidateGate.enabledControls).toBe(0);
    expect(candidateGate.assignmentCandidateEnabled).toBe(false);
    expect(candidateGate.workAssignmentEnabled).toBe(false);
    expect(candidateGate.requestCreationEnabled).toBe(false);
    expect(candidateGate.dispatchEnabled).toBe(false);
    expect(candidateGate.auditWriteEnabled).toBe(false);
    expect(candidateGate.candidates.map((candidate) => candidate.id)).toEqual(["candidate_orchestrator_desk", "candidate_agent_desks", "candidate_incident_corner"]);
    expect(candidateGate.candidates.every((candidate) => candidate.status === "blocked" && candidate.assignmentReady === false && candidate.rawExcluded)).toBe(true);
    expect(candidateGate.candidates.flatMap((candidate) => candidate.blockedBy.map((item) => item.id))).toEqual(expect.arrayContaining([
      "facility_prerequisites_missing",
      "approval_execution_blocked",
      "authority_adapter_missing",
      "audit_write_disabled",
      "human_confirmation_missing",
    ]));
    expect(candidateGate.readinessSnapshot).toMatchObject({ workAssignmentEnabled: false, requestCreationEnabled: false, dispatchEnabled: false, auditWriteEnabled: false });
    expect(candidateGate.safeBoundary).toContain("candidate gate only");
    expect(JSON.stringify(candidateGate)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw candidate|secret candidate|private|token/i);
  });

  it("builds Worker Request Draft Preview 1 without creating requests", () => {
    const draftPreview = buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T15:25:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/draft", status: "partial", checked_at: "2026-05-14T15:20:00Z", item_count: 1, warning_count: 1, error_summary: "raw draft token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw draft task", body: "secret draft body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-draft-private", category: "approval_needed", room_id: "command", tone: "warning", generated_at: "2026-05-14T15:24:00Z", detail: "raw draft event token" } as unknown as OfficeState["events"][number]],
    }))))))))));

    expect(draftPreview.stageLabel).toBe("Worker Request Draft Preview 1");
    expect(draftPreview.enabledControls).toBe(0);
    expect(draftPreview.requestCreationEnabled).toBe(false);
    expect(draftPreview.requestPersistenceEnabled).toBe(false);
    expect(draftPreview.workAssignmentEnabled).toBe(false);
    expect(draftPreview.dispatchEnabled).toBe(false);
    expect(draftPreview.auditWriteEnabled).toBe(false);
    expect(draftPreview.drafts.map((draft) => draft.id)).toEqual(["draft_orchestrator_desk", "draft_agent_desks", "draft_incident_corner"]);
    expect(draftPreview.drafts.every((draft) => draft.status === "not_created" && draft.persistenceStatus === "not_persisted" && draft.rawExcluded)).toBe(true);
    expect(draftPreview.drafts.map((draft) => draft.safeFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["candidate_ref", "facility", "worker_role", "blocked_reasons"]),
    ]));
    expect(draftPreview.candidateSnapshot).toMatchObject({ assignmentCandidateEnabled: false, requestCreationEnabled: false, dispatchEnabled: false, auditWriteEnabled: false });
    expect(draftPreview.safeBoundary).toContain("request draft preview only");
    expect(JSON.stringify(draftPreview)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw draft|secret draft|private|token/i);
  });

  it("builds Worker Human Confirmation Envelope 1 without recording decisions", () => {
    const confirmationEnvelope = buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T15:45:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/confirm", status: "partial", checked_at: "2026-05-14T15:40:00Z", item_count: 1, warning_count: 1, error_summary: "raw confirmation token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw confirmation task", body: "secret confirmation body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-confirm-private", category: "approval_needed", room_id: "command", tone: "warning", generated_at: "2026-05-14T15:44:00Z", detail: "raw confirmation event token" } as unknown as OfficeState["events"][number]],
    })))))))))));

    expect(confirmationEnvelope.stageLabel).toBe("Worker Human Confirmation Envelope 1");
    expect(confirmationEnvelope.enabledControls).toBe(0);
    expect(confirmationEnvelope.decisionRecordingEnabled).toBe(false);
    expect(confirmationEnvelope.requestCreationEnabled).toBe(false);
    expect(confirmationEnvelope.requestPersistenceEnabled).toBe(false);
    expect(confirmationEnvelope.workAssignmentEnabled).toBe(false);
    expect(confirmationEnvelope.dispatchEnabled).toBe(false);
    expect(confirmationEnvelope.auditWriteEnabled).toBe(false);
    expect(confirmationEnvelope.envelopes.map((envelope) => envelope.id)).toEqual(["confirm_draft_orchestrator_desk", "confirm_draft_agent_desks", "confirm_draft_incident_corner"]);
    expect(confirmationEnvelope.envelopes.every((envelope) => envelope.status === "not_recorded" && envelope.decisionState === "missing" && envelope.rawExcluded)).toBe(true);
    expect(confirmationEnvelope.envelopes.map((envelope) => envelope.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["draft_ref", "human_actor_ref", "decision", "decision_reason", "rollback_ack"]),
    ]));
    expect(confirmationEnvelope.draftSnapshot).toMatchObject({ requestCreationEnabled: false, requestPersistenceEnabled: false, dispatchEnabled: false, auditWriteEnabled: false });
    expect(confirmationEnvelope.safeBoundary).toContain("confirmation envelope only");
    expect(JSON.stringify(confirmationEnvelope)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw confirmation|secret confirmation|private|token/i);
  });

  it("builds Worker Authority Handoff Envelope 1 without dispatch or adapter installation", () => {
    const authorityHandoff = buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T16:05:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/handoff", status: "partial", checked_at: "2026-05-14T16:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw handoff token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw handoff task", body: "secret handoff body" } as unknown as OfficeState["work_items"][number]],
      automations: [{ id: "cron-handoff-private", state: "error", last_status: "failed", script: "/Users/lidises/handoff.sh" } as unknown as OfficeState["automations"][number]],
    }))))))))))));

    expect(authorityHandoff.stageLabel).toBe("Worker Authority Handoff Envelope 1");
    expect(authorityHandoff.enabledControls).toBe(0);
    expect(authorityHandoff.adapterInstallationEnabled).toBe(false);
    expect(authorityHandoff.dispatchEnabled).toBe(false);
    expect(authorityHandoff.requestCreationEnabled).toBe(false);
    expect(authorityHandoff.workAssignmentEnabled).toBe(false);
    expect(authorityHandoff.auditWriteEnabled).toBe(false);
    expect(authorityHandoff.handoffs.map((handoff) => handoff.id)).toEqual(["handoff_confirm_draft_orchestrator_desk", "handoff_confirm_draft_agent_desks", "handoff_confirm_draft_incident_corner"]);
    expect(authorityHandoff.handoffs.every((handoff) => handoff.status === "not_handed_off" && handoff.adapterState === "missing" && handoff.rawExcluded)).toBe(true);
    expect(authorityHandoff.handoffs.map((handoff) => handoff.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["confirmation_ref", "adapter_contract_ref", "dry_run_result_ref", "audit_sink_ref", "rollback_ref"]),
    ]));
    expect(authorityHandoff.confirmationSnapshot).toMatchObject({ decisionRecordingEnabled: false, dispatchEnabled: false, auditWriteEnabled: false });
    expect(authorityHandoff.safeBoundary).toContain("authority handoff envelope only");
    expect(JSON.stringify(authorityHandoff)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw handoff|secret handoff|private|token/i);
  });

  it("builds Worker Dispatch Dry-Run Envelope 1 without executing or dispatching", () => {
    const dryRunEnvelope = buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T16:25:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/dry-run", status: "partial", checked_at: "2026-05-14T16:20:00Z", item_count: 1, warning_count: 1, error_summary: "raw dry-run token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw dry-run task", body: "secret dry-run body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-dry-run-private", category: "automation_failed", room_id: "automation", tone: "warning", generated_at: "2026-05-14T16:24:00Z", detail: "raw dry-run event token" } as unknown as OfficeState["events"][number]],
    })))))))))))));

    expect(dryRunEnvelope.stageLabel).toBe("Worker Dispatch Dry-Run Envelope 1");
    expect(dryRunEnvelope.enabledControls).toBe(0);
    expect(dryRunEnvelope.dryRunExecutionEnabled).toBe(false);
    expect(dryRunEnvelope.dispatchEnabled).toBe(false);
    expect(dryRunEnvelope.adapterInstallationEnabled).toBe(false);
    expect(dryRunEnvelope.requestCreationEnabled).toBe(false);
    expect(dryRunEnvelope.workAssignmentEnabled).toBe(false);
    expect(dryRunEnvelope.auditWriteEnabled).toBe(false);
    expect(dryRunEnvelope.dryRuns.map((dryRun) => dryRun.id)).toEqual(["dryrun_handoff_confirm_draft_orchestrator_desk", "dryrun_handoff_confirm_draft_agent_desks", "dryrun_handoff_confirm_draft_incident_corner"]);
    expect(dryRunEnvelope.dryRuns.every((dryRun) => dryRun.status === "not_run" && dryRun.executionState === "blocked" && dryRun.rawExcluded)).toBe(true);
    expect(dryRunEnvelope.dryRuns.map((dryRun) => dryRun.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["handoff_ref", "simulation_scope", "expected_effects", "rollback_plan", "audit_preview_ref"]),
    ]));
    expect(dryRunEnvelope.handoffSnapshot).toMatchObject({ adapterInstallationEnabled: false, dispatchEnabled: false, auditWriteEnabled: false });
    expect(dryRunEnvelope.safeBoundary).toContain("dispatch dry-run envelope only");
    expect(JSON.stringify(dryRunEnvelope)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw dry-run|secret dry-run|private|token/i);
  });

  it("builds Worker Audit Preview Envelope 1 without writing audit events", () => {
    const auditPreview = buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T16:45:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/audit-preview", status: "partial", checked_at: "2026-05-14T16:40:00Z", item_count: 1, warning_count: 1, error_summary: "raw audit-preview token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw audit-preview task", body: "secret audit-preview body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-audit-preview-private", category: "approval_needed", room_id: "review", tone: "warning", generated_at: "2026-05-14T16:44:00Z", detail: "raw audit-preview event token" } as unknown as OfficeState["events"][number]],
    }))))))))))))));

    expect(auditPreview.stageLabel).toBe("Worker Audit Preview Envelope 1");
    expect(auditPreview.enabledControls).toBe(0);
    expect(auditPreview.auditWriteEnabled).toBe(false);
    expect(auditPreview.executionEnabled).toBe(false);
    expect(auditPreview.dispatchEnabled).toBe(false);
    expect(auditPreview.adapterInstallationEnabled).toBe(false);
    expect(auditPreview.requestCreationEnabled).toBe(false);
    expect(auditPreview.workAssignmentEnabled).toBe(false);
    expect(auditPreview.previews.map((preview) => preview.id)).toEqual(["audit_dryrun_handoff_confirm_draft_orchestrator_desk", "audit_dryrun_handoff_confirm_draft_agent_desks", "audit_dryrun_handoff_confirm_draft_incident_corner"]);
    expect(auditPreview.previews.every((preview) => preview.status === "not_written" && preview.auditSinkState === "missing" && preview.rawExcluded)).toBe(true);
    expect(auditPreview.previews.map((preview) => preview.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["dry_run_ref", "audit_sink_ref", "event_type", "redaction_policy", "rollback_ref"]),
    ]));
    expect(auditPreview.dryRunSnapshot).toMatchObject({ dryRunExecutionEnabled: false, dispatchEnabled: false, auditWriteEnabled: false });
    expect(auditPreview.safeBoundary).toContain("audit preview envelope only");
    expect(JSON.stringify(auditPreview)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw audit-preview|secret audit-preview|private|token/i);
  });

  it("builds Worker Rollback Preview Envelope 1 without executing rollback", () => {
    const rollbackPreview = buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T17:05:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/rollback-preview", status: "partial", checked_at: "2026-05-14T17:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw rollback-preview token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw rollback-preview task", body: "secret rollback-preview body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-rollback-preview-private", category: "approval_needed", room_id: "review", tone: "warning", generated_at: "2026-05-14T17:04:00Z", detail: "raw rollback-preview event token" } as unknown as OfficeState["events"][number]],
    })))))))))))))));

    expect(rollbackPreview.stageLabel).toBe("Worker Rollback Preview Envelope 1");
    expect(rollbackPreview.enabledControls).toBe(0);
    expect(rollbackPreview.rollbackExecutionEnabled).toBe(false);
    expect(rollbackPreview.auditWriteEnabled).toBe(false);
    expect(rollbackPreview.executionEnabled).toBe(false);
    expect(rollbackPreview.dispatchEnabled).toBe(false);
    expect(rollbackPreview.adapterInstallationEnabled).toBe(false);
    expect(rollbackPreview.requestCreationEnabled).toBe(false);
    expect(rollbackPreview.workAssignmentEnabled).toBe(false);
    expect(rollbackPreview.previews.map((preview) => preview.id)).toEqual(["rollback_audit_dryrun_handoff_confirm_draft_orchestrator_desk", "rollback_audit_dryrun_handoff_confirm_draft_agent_desks", "rollback_audit_dryrun_handoff_confirm_draft_incident_corner"]);
    expect(rollbackPreview.previews.every((preview) => preview.status === "not_prepared" && preview.rollbackState === "missing" && preview.rawExcluded)).toBe(true);
    expect(rollbackPreview.previews.map((preview) => preview.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["audit_preview_ref", "rollback_scope", "restore_point_ref", "verification_plan", "human_reconfirm_ref"]),
    ]));
    expect(rollbackPreview.auditPreviewSnapshot).toMatchObject({ auditWriteEnabled: false, executionEnabled: false, dispatchEnabled: false });
    expect(rollbackPreview.safeBoundary).toContain("rollback preview envelope only");
    expect(JSON.stringify(rollbackPreview)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw rollback-preview|secret rollback-preview|private|token/i);
  });

  it("builds Worker Final Gate Checklist 1 without enabling controls", () => {
    const finalGate = buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T17:25:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/final-gate", status: "partial", checked_at: "2026-05-14T17:20:00Z", item_count: 1, warning_count: 1, error_summary: "raw final-gate token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw final-gate task", body: "secret final-gate body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-final-gate-private", category: "approval_needed", room_id: "review", tone: "warning", generated_at: "2026-05-14T17:24:00Z", detail: "raw final-gate event token" } as unknown as OfficeState["events"][number]],
    }))))))))))))))));

    expect(finalGate.stageLabel).toBe("Worker Final Gate Checklist 1");
    expect(finalGate.enabledControls).toBe(0);
    expect(finalGate.controlProposalEnabled).toBe(false);
    expect(finalGate.rollbackExecutionEnabled).toBe(false);
    expect(finalGate.auditWriteEnabled).toBe(false);
    expect(finalGate.executionEnabled).toBe(false);
    expect(finalGate.dispatchEnabled).toBe(false);
    expect(finalGate.adapterInstallationEnabled).toBe(false);
    expect(finalGate.requestCreationEnabled).toBe(false);
    expect(finalGate.workAssignmentEnabled).toBe(false);
    expect(finalGate.gates.map((gate) => gate.id)).toEqual(["authority_model", "human_confirmation", "audit_sink", "rollback_plan", "adapter_contract", "runtime_boundary"]);
    expect(finalGate.gates.every((gate) => gate.status === "blocked" && gate.rawExcluded)).toBe(true);
    expect(finalGate.gates.map((gate) => gate.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["approved_authority_model", "mutation_route_design", "runtime_scope", "rollback_verified"]),
    ]));
    expect(finalGate.rollbackPreviewSnapshot).toMatchObject({ rollbackExecutionEnabled: false, auditWriteEnabled: false, dispatchEnabled: false });
    expect(finalGate.safeBoundary).toContain("final gate checklist only");
    expect(JSON.stringify(finalGate)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw final-gate|secret final-gate|private|token/i);
  });

  it("builds Controlled Mutation Proposal Contract 1 without creating proposals", () => {
    const proposalContract = buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T17:45:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/proposal-contract", status: "partial", checked_at: "2026-05-14T17:40:00Z", item_count: 1, warning_count: 1, error_summary: "raw proposal-contract token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw proposal-contract task", body: "secret proposal-contract body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-proposal-contract-private", category: "approval_needed", room_id: "review", tone: "warning", generated_at: "2026-05-14T17:44:00Z", detail: "raw proposal-contract event token" } as unknown as OfficeState["events"][number]],
    })))))))))))))))));

    expect(proposalContract.stageLabel).toBe("Controlled Mutation Proposal Contract 1");
    expect(proposalContract.enabledControls).toBe(0);
    expect(proposalContract.proposalCreationEnabled).toBe(false);
    expect(proposalContract.proposalPersistenceEnabled).toBe(false);
    expect(proposalContract.mutationRouteEnabled).toBe(false);
    expect(proposalContract.controlProposalEnabled).toBe(false);
    expect(proposalContract.rollbackExecutionEnabled).toBe(false);
    expect(proposalContract.auditWriteEnabled).toBe(false);
    expect(proposalContract.executionEnabled).toBe(false);
    expect(proposalContract.dispatchEnabled).toBe(false);
    expect(proposalContract.requestCreationEnabled).toBe(false);
    expect(proposalContract.contracts.map((contract) => contract.id)).toEqual(["proposal_identity", "authority_reference", "dry_run_evidence", "audit_plan", "rollback_plan", "human_approval"]);
    expect(proposalContract.contracts.every((contract) => contract.status === "not_available" && contract.rawExcluded)).toBe(true);
    expect(proposalContract.contracts.map((contract) => contract.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["proposal_ref", "authority_ref", "dry_run_ref", "audit_ref", "rollback_ref", "human_approval_ref"]),
    ]));
    expect(proposalContract.finalGateSnapshot).toMatchObject({ controlProposalEnabled: false, executionEnabled: false, dispatchEnabled: false });
    expect(proposalContract.safeBoundary).toContain("proposal contract only");
    expect(JSON.stringify(proposalContract)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw proposal-contract|secret proposal-contract|private|token/i);
  });

  it("builds Controlled Mutation Dry-Run Plan 1 without running dry-runs", () => {
    const dryRunPlan = buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T18:05:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/dry-run-plan", status: "partial", checked_at: "2026-05-14T18:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw dry-run-plan token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw dry-run-plan task", body: "secret dry-run-plan body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-dry-run-plan-private", category: "approval_needed", room_id: "review", tone: "warning", generated_at: "2026-05-14T18:04:00Z", detail: "raw dry-run-plan event token" } as unknown as OfficeState["events"][number]],
    }))))))))))))))))));

    expect(dryRunPlan.stageLabel).toBe("Controlled Mutation Dry-Run Plan 1");
    expect(dryRunPlan.enabledControls).toBe(0);
    expect(dryRunPlan.dryRunExecutionEnabled).toBe(false);
    expect(dryRunPlan.proposalCreationEnabled).toBe(false);
    expect(dryRunPlan.mutationRouteEnabled).toBe(false);
    expect(dryRunPlan.rollbackExecutionEnabled).toBe(false);
    expect(dryRunPlan.auditWriteEnabled).toBe(false);
    expect(dryRunPlan.executionEnabled).toBe(false);
    expect(dryRunPlan.dispatchEnabled).toBe(false);
    expect(dryRunPlan.planItems.map((item) => item.id)).toEqual(["simulation_scope", "expected_effects", "audit_capture", "rollback_verification", "human_review"]);
    expect(dryRunPlan.planItems.every((item) => item.status === "not_runnable" && item.rawExcluded)).toBe(true);
    expect(dryRunPlan.planItems.map((item) => item.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["simulation_scope", "expected_effects", "audit_capture_ref", "rollback_verification_ref", "human_review_ref"]),
    ]));
    expect(dryRunPlan.proposalContractSnapshot).toMatchObject({ proposalCreationEnabled: false, mutationRouteEnabled: false, executionEnabled: false });
    expect(dryRunPlan.safeBoundary).toContain("dry-run plan only");
    expect(JSON.stringify(dryRunPlan)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw dry-run-plan|secret dry-run-plan|private|token/i);
  });

  it("builds Controlled Mutation Audit Sink Plan 1 without writing audit events", () => {
    const auditSinkPlan = buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T18:25:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/audit-sink-plan", status: "partial", checked_at: "2026-05-14T18:20:00Z", item_count: 1, warning_count: 1, error_summary: "raw audit-sink-plan token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw audit-sink-plan task", body: "secret audit-sink-plan body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-audit-sink-plan-private", category: "approval_needed", room_id: "review", tone: "warning", generated_at: "2026-05-14T18:24:00Z", detail: "raw audit-sink-plan event token" } as unknown as OfficeState["events"][number]],
    })))))))))))))))))));

    expect(auditSinkPlan.stageLabel).toBe("Controlled Mutation Audit Sink Plan 1");
    expect(auditSinkPlan.enabledControls).toBe(0);
    expect(auditSinkPlan.auditWriteEnabled).toBe(false);
    expect(auditSinkPlan.dryRunExecutionEnabled).toBe(false);
    expect(auditSinkPlan.proposalCreationEnabled).toBe(false);
    expect(auditSinkPlan.mutationRouteEnabled).toBe(false);
    expect(auditSinkPlan.rollbackExecutionEnabled).toBe(false);
    expect(auditSinkPlan.executionEnabled).toBe(false);
    expect(auditSinkPlan.dispatchEnabled).toBe(false);
    expect(auditSinkPlan.sinkItems.map((item) => item.id)).toEqual(["event_type", "redaction_policy", "sink_reference", "retention_policy", "failure_handling"]);
    expect(auditSinkPlan.sinkItems.every((item) => item.status === "not_writable" && item.rawExcluded)).toBe(true);
    expect(auditSinkPlan.sinkItems.map((item) => item.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["event_type", "redaction_policy", "sink_ref", "retention_policy", "failure_handling_ref"]),
    ]));
    expect(auditSinkPlan.dryRunPlanSnapshot).toMatchObject({ dryRunExecutionEnabled: false, auditWriteEnabled: false, executionEnabled: false });
    expect(auditSinkPlan.safeBoundary).toContain("audit sink plan only");
    expect(JSON.stringify(auditSinkPlan)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw audit-sink-plan|secret audit-sink-plan|private|token/i);
  });

  it("builds Controlled Mutation Rollback Verification Plan 1 without executing rollback", () => {
    const rollbackVerificationPlan = buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T18:45:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/rollback-verification", status: "partial", checked_at: "2026-05-14T18:40:00Z", item_count: 1, warning_count: 1, error_summary: "raw rollback-verification token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw rollback-verification task", body: "secret rollback-verification body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-rollback-verification-private", category: "approval_needed", room_id: "review", tone: "warning", generated_at: "2026-05-14T18:44:00Z", detail: "raw rollback-verification event token" } as unknown as OfficeState["events"][number]],
    }))))))))))))))))))));

    expect(rollbackVerificationPlan.stageLabel).toBe("Controlled Mutation Rollback Verification Plan 1");
    expect(rollbackVerificationPlan.enabledControls).toBe(0);
    expect(rollbackVerificationPlan.rollbackExecutionEnabled).toBe(false);
    expect(rollbackVerificationPlan.auditWriteEnabled).toBe(false);
    expect(rollbackVerificationPlan.dryRunExecutionEnabled).toBe(false);
    expect(rollbackVerificationPlan.proposalCreationEnabled).toBe(false);
    expect(rollbackVerificationPlan.mutationRouteEnabled).toBe(false);
    expect(rollbackVerificationPlan.executionEnabled).toBe(false);
    expect(rollbackVerificationPlan.dispatchEnabled).toBe(false);
    expect(rollbackVerificationPlan.verificationItems.map((item) => item.id)).toEqual(["restore_point", "reversible_scope", "verification_probe", "failure_fallback", "human_recheck"]);
    expect(rollbackVerificationPlan.verificationItems.every((item) => item.status === "not_verified" && item.rawExcluded)).toBe(true);
    expect(rollbackVerificationPlan.verificationItems.map((item) => item.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["restore_point_ref", "reversible_scope", "verification_probe_ref", "failure_fallback_ref", "human_recheck_ref"]),
    ]));
    expect(rollbackVerificationPlan.auditSinkPlanSnapshot).toMatchObject({ auditWriteEnabled: false, rollbackExecutionEnabled: false, executionEnabled: false });
    expect(rollbackVerificationPlan.safeBoundary).toContain("rollback verification plan only");
    expect(JSON.stringify(rollbackVerificationPlan)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw rollback-verification|secret rollback-verification|private|token/i);
  });

  it("builds Controlled Mutation Human Approval Plan 1 without recording approvals", () => {
    const humanApprovalPlan = buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T19:05:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/human-approval", status: "partial", checked_at: "2026-05-14T19:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw human-approval token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw human-approval task", body: "secret human-approval body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-human-approval-private", category: "approval_needed", room_id: "review", tone: "warning", generated_at: "2026-05-14T19:04:00Z", detail: "raw human-approval event token" } as unknown as OfficeState["events"][number]],
    })))))))))))))))))))));

    expect(humanApprovalPlan.stageLabel).toBe("Controlled Mutation Human Approval Plan 1");
    expect(humanApprovalPlan.enabledControls).toBe(0);
    expect(humanApprovalPlan.approvalRecordingEnabled).toBe(false);
    expect(humanApprovalPlan.rollbackExecutionEnabled).toBe(false);
    expect(humanApprovalPlan.auditWriteEnabled).toBe(false);
    expect(humanApprovalPlan.dryRunExecutionEnabled).toBe(false);
    expect(humanApprovalPlan.proposalCreationEnabled).toBe(false);
    expect(humanApprovalPlan.mutationRouteEnabled).toBe(false);
    expect(humanApprovalPlan.executionEnabled).toBe(false);
    expect(humanApprovalPlan.dispatchEnabled).toBe(false);
    expect(humanApprovalPlan.approvalItems.map((item) => item.id)).toEqual(["approver_identity", "decision_envelope", "consent_scope", "timeout_policy", "audit_linkage"]);
    expect(humanApprovalPlan.approvalItems.every((item) => item.status === "not_recorded" && item.rawExcluded)).toBe(true);
    expect(humanApprovalPlan.approvalItems.map((item) => item.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["approver_identity_ref", "decision_envelope_ref", "consent_scope", "timeout_policy", "audit_linkage_ref"]),
    ]));
    expect(humanApprovalPlan.rollbackVerificationPlanSnapshot).toMatchObject({ rollbackExecutionEnabled: false, auditWriteEnabled: false, executionEnabled: false });
    expect(humanApprovalPlan.safeBoundary).toContain("human approval plan only");
    expect(JSON.stringify(humanApprovalPlan)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw human-approval|secret human-approval|private|token/i);
  });

  it("builds Controlled Mutation Authority Summary 1 without granting authority", () => {
    const authoritySummary = buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T19:25:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/authority-summary", status: "partial", checked_at: "2026-05-14T19:20:00Z", item_count: 1, warning_count: 1, error_summary: "raw authority-summary token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw authority-summary task", body: "secret authority-summary body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-authority-summary-private", category: "approval_needed", room_id: "review", tone: "warning", generated_at: "2026-05-14T19:24:00Z", detail: "raw authority-summary event token" } as unknown as OfficeState["events"][number]],
    }))))))))))))))))))))));

    expect(authoritySummary.stageLabel).toBe("Controlled Mutation Authority Summary 1");
    expect(authoritySummary.enabledControls).toBe(0);
    expect(authoritySummary.authorityGrantEnabled).toBe(false);
    expect(authoritySummary.approvalRecordingEnabled).toBe(false);
    expect(authoritySummary.rollbackExecutionEnabled).toBe(false);
    expect(authoritySummary.auditWriteEnabled).toBe(false);
    expect(authoritySummary.dryRunExecutionEnabled).toBe(false);
    expect(authoritySummary.proposalCreationEnabled).toBe(false);
    expect(authoritySummary.mutationRouteEnabled).toBe(false);
    expect(authoritySummary.executionEnabled).toBe(false);
    expect(authoritySummary.dispatchEnabled).toBe(false);
    expect(authoritySummary.authorityItems.map((item) => item.id)).toEqual(["authority_scope", "adapter_readiness", "approval_linkage", "dry_run_evidence", "audit_rollback_linkage"]);
    expect(authoritySummary.authorityItems.every((item) => item.status === "blocked" && item.rawExcluded)).toBe(true);
    expect(authoritySummary.authorityItems.map((item) => item.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["authority_scope_ref", "adapter_readiness_ref", "approval_linkage_ref", "dry_run_evidence_ref", "audit_rollback_linkage_ref"]),
    ]));
    expect(authoritySummary.humanApprovalPlanSnapshot).toMatchObject({ approvalRecordingEnabled: false, rollbackExecutionEnabled: false, executionEnabled: false });
    expect(authoritySummary.safeBoundary).toContain("authority summary only");
    expect(JSON.stringify(authoritySummary)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw authority-summary|secret authority-summary|private|token/i);
  });

  it("builds Controlled Mutation Execution Readiness Summary 1 without enabling execution", () => {
    const readinessSummary = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T19:45:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/execution-readiness", status: "partial", checked_at: "2026-05-14T19:40:00Z", item_count: 1, warning_count: 1, error_summary: "raw execution-readiness token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw execution-readiness task", body: "secret execution-readiness body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-execution-readiness-private", category: "approval_needed", room_id: "review", tone: "warning", generated_at: "2026-05-14T19:44:00Z", detail: "raw execution-readiness event token" } as unknown as OfficeState["events"][number]],
    })))))))))))))))))))))));

    expect(readinessSummary.stageLabel).toBe("Controlled Mutation Execution Readiness Summary 1");
    expect(readinessSummary.enabledControls).toBe(0);
    expect(readinessSummary.executionReadinessEnabled).toBe(false);
    expect(readinessSummary.authorityGrantEnabled).toBe(false);
    expect(readinessSummary.approvalRecordingEnabled).toBe(false);
    expect(readinessSummary.rollbackExecutionEnabled).toBe(false);
    expect(readinessSummary.auditWriteEnabled).toBe(false);
    expect(readinessSummary.dryRunExecutionEnabled).toBe(false);
    expect(readinessSummary.proposalCreationEnabled).toBe(false);
    expect(readinessSummary.mutationRouteEnabled).toBe(false);
    expect(readinessSummary.executionEnabled).toBe(false);
    expect(readinessSummary.dispatchEnabled).toBe(false);
    expect(readinessSummary.readinessItems.map((item) => item.id)).toEqual(["proposal_contract", "dry_run_plan", "audit_sink_plan", "rollback_verification", "human_approval", "authority_summary"]);
    expect(readinessSummary.readinessItems.every((item) => item.status === "blocked" && item.rawExcluded)).toBe(true);
    expect(readinessSummary.readinessItems.map((item) => item.requiredFields)).toEqual(expect.arrayContaining([
      expect.arrayContaining(["proposal_contract_ref", "dry_run_plan_ref", "audit_sink_ref", "rollback_verification_ref", "human_approval_ref", "authority_summary_ref"]),
    ]));
    expect(readinessSummary.authoritySummarySnapshot).toMatchObject({ authorityGrantEnabled: false, approvalRecordingEnabled: false, executionEnabled: false });
    expect(readinessSummary.safeBoundary).toContain("execution readiness summary only");
    expect(JSON.stringify(readinessSummary)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw execution-readiness|secret execution-readiness|private|token/i);
  });

  it("builds Frontend Contract Posture Projection 1 from execution readiness without enabling browser controls", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-15T12:45:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/frontend-posture", status: "partial", checked_at: "2026-05-15T12:40:00Z", item_count: 1, warning_count: 1, error_summary: "raw frontend posture token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw frontend posture task", body: "secret frontend posture body" } as unknown as OfficeState["work_items"][number]],
      events: [{ id: "event-frontend-posture-private", category: "approval_needed", room_id: "review", tone: "warning", generated_at: "2026-05-15T12:44:00Z", detail: "raw frontend posture event token" } as unknown as OfficeState["events"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);

    expect(projection.stageLabel).toBe("Frontend Contract Posture Projection 1");
    expect(projection.sourceStageLabel).toBe("Controlled Mutation Execution Readiness Summary 1");
    expect(projection.detailKind).toBe("controlled_mutation_contract_posture_projection");
    expect(projection.enabledControls).toBe(0);
    expect(projection.formControlEnabled).toBe(false);
    expect(projection.browserExecutableControlsEnabled).toBe(false);
    expect(projection.backendMutationEnabled).toBe(false);
    expect(projection.storageWriteEnabled).toBe(false);
    expect(projection.eventAppendEnabled).toBe(false);
    expect(projection.eventReadbackEnabled).toBe(false);
    expect(projection.auditWriteEnabled).toBe(false);
    expect(projection.executionEnabled).toBe(false);
    expect(projection.dryRunExecutionEnabled).toBe(false);
    expect(projection.dispatchEnabled).toBe(false);
    expect(projection.authorityAdapterBindingEnabled).toBe(false);
    expect(projection.credentialChangeEnabled).toBe(false);
    expect(projection.nasMutationEnabled).toBe(false);
    expect(projection.safeProjectionOnly).toBe(true);
    expect(projection.rawExcluded).toBe(true);
    expect(projection.postureCards.map((card) => card.id)).toEqual(["contract_chain", "browser_surface", "backend_boundary", "authority_boundary", "storage_boundary", "nas_boundary"]);
    expect(projection.postureCards.every((card) => card.status === "blocked" && card.rawExcluded)).toBe(true);
    expect(JSON.stringify(projection)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw frontend posture|secret frontend posture|private|token/i);
  });

  it("builds Frontend Contract Posture Polish 2 as read-only grouped guidance without executable controls", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-15T13:20:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/frontend-polish", status: "partial", checked_at: "2026-05-15T13:10:00Z", item_count: 1, warning_count: 1, error_summary: "raw posture polish token" } as unknown as OfficeState["data_sources"][number]],
      agents: [{ id: "agent-posture-polish", status: "active", prompt: "raw posture polish prompt token-shaped-value", provider: "private-posture-polish-provider" }],
      work_items: [{ id: "w-polish", status: "blocked", title: "raw posture polish task", body: "/Users/lidises/private/posture-polish.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);

    expect(polish.stageLabel).toBe("Frontend Contract Posture Polish 2");
    expect(polish.sourceStageLabel).toBe("Frontend Contract Posture Projection 1");
    expect(polish.detailKind).toBe("controlled_mutation_contract_posture_polish");
    expect(polish.enabledControls).toBe(0);
    expect(polish.formControlEnabled).toBe(false);
    expect(polish.browserExecutableControlsEnabled).toBe(false);
    expect(polish.backendMutationEnabled).toBe(false);
    expect(polish.storageWriteEnabled).toBe(false);
    expect(polish.eventAppendEnabled).toBe(false);
    expect(polish.auditWriteEnabled).toBe(false);
    expect(polish.executionEnabled).toBe(false);
    expect(polish.dispatchEnabled).toBe(false);
    expect(polish.authorityAdapterBindingEnabled).toBe(false);
    expect(polish.nasMutationEnabled).toBe(false);
    expect(polish.safeProjectionOnly).toBe(true);
    expect(polish.polishRows.map((row) => row.id)).toEqual(["browser_surface", "mutation_backplane", "authority_and_credentials", "nas_vps_kanban"]);
    expect(polish.polishRows.every((row) => row.status === "disabled" && row.rawExcluded)).toBe(true);
    expect(polish.disabledSurfaceSummary).toEqual({ cards: 6, blockedCards: 6, enabledControls: 0 });
    expect(polish.safeBoundary).toContain("read-only posture polish only");
    expect(JSON.stringify(polish)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw posture polish|private-posture-polish|token-shaped-value|provider/i);
  });

  it("builds Frontend Readiness Handoff Ribbon 1 as a read-only chain summary without executable controls", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-15T13:45:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/readiness-handoff", status: "partial", checked_at: "2026-05-15T13:40:00Z", item_count: 1, warning_count: 1, error_summary: "raw handoff ribbon token" } as unknown as OfficeState["data_sources"][number]],
      agents: [{ id: "agent-handoff-ribbon", status: "active", prompt: "raw handoff ribbon prompt token-shaped-value", provider: "private-handoff-ribbon-provider" }],
      work_items: [{ id: "w-handoff", status: "blocked", title: "raw handoff ribbon task", body: "/Users/lidises/private/readiness-handoff.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);

    expect(ribbon.stageLabel).toBe("Frontend Readiness Handoff Ribbon 1");
    expect(ribbon.sourceStageLabel).toBe("Frontend Contract Posture Polish 2");
    expect(ribbon.detailKind).toBe("controlled_mutation_readiness_handoff_ribbon");
    expect(ribbon.enabledControls).toBe(0);
    expect(ribbon.formControlEnabled).toBe(false);
    expect(ribbon.browserExecutableControlsEnabled).toBe(false);
    expect(ribbon.backendMutationEnabled).toBe(false);
    expect(ribbon.storageWriteEnabled).toBe(false);
    expect(ribbon.eventAppendEnabled).toBe(false);
    expect(ribbon.eventReadbackEnabled).toBe(false);
    expect(ribbon.auditWriteEnabled).toBe(false);
    expect(ribbon.executionEnabled).toBe(false);
    expect(ribbon.dryRunExecutionEnabled).toBe(false);
    expect(ribbon.dispatchEnabled).toBe(false);
    expect(ribbon.targetMutationEnabled).toBe(false);
    expect(ribbon.authorityAdapterBindingEnabled).toBe(false);
    expect(ribbon.credentialChangeEnabled).toBe(false);
    expect(ribbon.nasMutationEnabled).toBe(false);
    expect(ribbon.safeProjectionOnly).toBe(true);
    expect(ribbon.rawExcluded).toBe(true);
    expect(ribbon.handoffSteps.map((step) => step.id)).toEqual(["request", "approval", "authority", "execution"]);
    expect(ribbon.handoffSteps.every((step) => step.status === "disabled" && step.rawExcluded)).toBe(true);
    expect(ribbon.disabledSurfaceSummary).toEqual({ rows: 4, enabledControls: 0 });
    expect(ribbon.safeBoundary).toContain("read-only handoff ribbon only");
    expect(JSON.stringify(ribbon)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw handoff ribbon|private-handoff-ribbon|token-shaped-value|provider/i);
  });

  it("builds Frontend Readiness Summary Polish 1 as a read-only summary surface without executable controls", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-15T14:05:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/readiness-summary-polish", status: "partial", checked_at: "2026-05-15T14:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw summary polish token" } as unknown as OfficeState["data_sources"][number]],
      agents: [{ id: "agent-summary-polish", status: "active", prompt: "raw readiness summary polish prompt token-shaped-value", provider: "private-summary-polish-provider" }],
      work_items: [{ id: "w-summary-polish", status: "blocked", title: "raw readiness summary polish task", body: "/Users/lidises/private/readiness-summary-polish.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);

    expect(summary.stageLabel).toBe("Frontend Readiness Summary Polish 1");
    expect(summary.sourceStageLabel).toBe("Frontend Readiness Handoff Ribbon 1");
    expect(summary.detailKind).toBe("controlled_mutation_readiness_summary_polish");
    expect(summary.enabledControls).toBe(0);
    expect(summary.formControlEnabled).toBe(false);
    expect(summary.browserExecutableControlsEnabled).toBe(false);
    expect(summary.backendMutationEnabled).toBe(false);
    expect(summary.storageWriteEnabled).toBe(false);
    expect(summary.eventAppendEnabled).toBe(false);
    expect(summary.eventReadbackEnabled).toBe(false);
    expect(summary.auditWriteEnabled).toBe(false);
    expect(summary.executionEnabled).toBe(false);
    expect(summary.dryRunExecutionEnabled).toBe(false);
    expect(summary.dispatchEnabled).toBe(false);
    expect(summary.targetMutationEnabled).toBe(false);
    expect(summary.authorityAdapterBindingEnabled).toBe(false);
    expect(summary.credentialChangeEnabled).toBe(false);
    expect(summary.nasMutationEnabled).toBe(false);
    expect(summary.safeProjectionOnly).toBe(true);
    expect(summary.rawExcluded).toBe(true);
    expect(summary.summaryCards.map((card) => card.id)).toEqual(["chain", "locks", "next_boundary"]);
    expect(summary.summaryCards.every((card) => card.status === "blocked" && card.rawExcluded)).toBe(true);
    expect(summary.disabledSurfaceSummary).toEqual({ steps: 4, summaryCards: 3, enabledControls: 0 });
    expect(summary.safeBoundary).toContain("read-only readiness summary polish only");
    expect(JSON.stringify(summary)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw readiness summary polish|private-summary-polish|token-shaped-value|provider/i);
  });

  it("builds Frontend Request Store Posture 1 as a read-only local-store posture surface without adding writes", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T00:05:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/request-store-posture", status: "partial", checked_at: "2026-05-16T00:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw request store token" } as unknown as OfficeState["data_sources"][number]],
      agents: [{ id: "agent-request-store-posture", status: "active", prompt: "raw request store posture prompt token-shaped-value", provider: "private-request-store-posture-provider" }],
      work_items: [{ id: "w-request-store-posture", status: "blocked", title: "raw request store posture task", body: "/Users/lidises/private/request-store-posture.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);

    expect(posture.stageLabel).toBe("Frontend Request Store Posture 1");
    expect(posture.sourceStageLabel).toBe("Frontend Readiness Summary Polish 1");
    expect(posture.detailKind).toBe("controlled_mutation_request_store_posture");
    expect(posture.enabledControls).toBe(0);
    expect(posture.formControlEnabled).toBe(false);
    expect(posture.browserExecutableControlsEnabled).toBe(false);
    expect(posture.backendMutationEnabled).toBe(false);
    expect(posture.storageWriteEnabled).toBe(false);
    expect(posture.eventAppendEnabled).toBe(false);
    expect(posture.eventReadbackEnabled).toBe(false);
    expect(posture.requestCreationEnabled).toBe(false);
    expect(posture.auditWriteEnabled).toBe(false);
    expect(posture.executionEnabled).toBe(false);
    expect(posture.dryRunExecutionEnabled).toBe(false);
    expect(posture.dispatchEnabled).toBe(false);
    expect(posture.targetMutationEnabled).toBe(false);
    expect(posture.authorityAdapterBindingEnabled).toBe(false);
    expect(posture.credentialChangeEnabled).toBe(false);
    expect(posture.nasMutationEnabled).toBe(false);
    expect(posture.safeProjectionOnly).toBe(true);
    expect(posture.rawExcluded).toBe(true);
    expect(posture.postureCards.map((card) => card.id)).toEqual(["local_store", "validation", "hardening_boundary", "approval_boundary"]);
    expect(posture.postureCards.every((card) => card.status === "display_only" && card.rawExcluded)).toBe(true);
    expect(posture.disabledSurfaceSummary).toEqual({ sourceCards: 3, postureCards: 4, enabledControls: 0 });
    expect(posture.safeBoundary).toContain("frontend read-only request-store posture only");
    expect(JSON.stringify(posture)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw request store posture|private-request-store-posture|token-shaped-value|provider/i);
  });

  it("builds Request Store Hardening Plan 1 as frontend-only read-only hardening posture without implementing storage changes", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T00:45:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/request-store-hardening", status: "partial", checked_at: "2026-05-16T00:40:00Z", item_count: 1, warning_count: 1, error_summary: "raw hardening token" } as unknown as OfficeState["data_sources"][number]],
      agents: [{ id: "agent-request-store-hardening", status: "active", prompt: "raw request store hardening prompt token-shaped-value", provider: "private-request-store-hardening-provider" }],
      work_items: [{ id: "w-request-store-hardening", status: "blocked", title: "raw request store hardening task", body: "/Users/lidises/private/request-store-hardening.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);

    expect(hardening.stageLabel).toBe("Request Store Hardening Plan 1");
    expect(hardening.sourceStageLabel).toBe("Frontend Request Store Posture 1");
    expect(hardening.detailKind).toBe("controlled_mutation_request_store_hardening_plan");
    expect(hardening.enabledControls).toBe(0);
    expect(hardening.backendMutationEnabled).toBe(false);
    expect(hardening.storageWriteEnabled).toBe(false);
    expect(hardening.eventAppendEnabled).toBe(false);
    expect(hardening.eventReadbackEnabled).toBe(false);
    expect(hardening.hardeningImplemented).toBe(false);
    expect(hardening.requestCreationEnabled).toBe(false);
    expect(hardening.auditWriteEnabled).toBe(false);
    expect(hardening.executionEnabled).toBe(false);
    expect(hardening.dispatchEnabled).toBe(false);
    expect(hardening.nasMutationEnabled).toBe(false);
    expect(hardening.safeProjectionOnly).toBe(true);
    expect(hardening.rawExcluded).toBe(true);
    expect(hardening.hardeningItems.map((item) => item.id)).toEqual(["duplicate_detection", "correlation_index", "readback_limit", "malformed_line_resilience"]);
    expect(hardening.hardeningItems.every((item) => item.status === "approval_required" && item.rawExcluded)).toBe(true);
    expect(hardening.disabledSurfaceSummary).toEqual({ sourceCards: 4, hardeningItems: 4, enabledControls: 0 });
    expect(hardening.safeBoundary).toContain("frontend read-only hardening plan only");
    expect(JSON.stringify(hardening)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw request store hardening|private-request-store-hardening|token-shaped-value|provider/i);
  });

  it("builds Controlled Mutation Next Approval Boundary 1 as frontend-only read-only fallback after approval timeout", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T01:10:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/next-approval-boundary", status: "partial", checked_at: "2026-05-16T01:05:00Z", item_count: 1, warning_count: 1, error_summary: "raw next approval token" } as unknown as OfficeState["data_sources"][number]],
      agents: [{ id: "agent-next-approval-boundary", status: "active", prompt: "raw next approval boundary prompt token-shaped-value", provider: "private-next-approval-provider" }],
      work_items: [{ id: "w-next-approval-boundary", status: "blocked", title: "raw next approval boundary task", body: "/Users/lidises/private/next-approval-boundary.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const boundary = buildOfficeControlledMutationNextApprovalBoundary(hardening);

    expect(boundary.stageLabel).toBe("Controlled Mutation Next Approval Boundary 1");
    expect(boundary.sourceStageLabel).toBe("Request Store Hardening Plan 1");
    expect(boundary.detailKind).toBe("controlled_mutation_next_approval_boundary");
    expect(boundary.enabledControls).toBe(0);
    expect(boundary.approvalGranted).toBe(false);
    expect(boundary.backendMutationEnabled).toBe(false);
    expect(boundary.storageWriteEnabled).toBe(false);
    expect(boundary.eventAppendEnabled).toBe(false);
    expect(boundary.eventReadbackEnabled).toBe(false);
    expect(boundary.hardeningImplemented).toBe(false);
    expect(boundary.decisionStoreEnabled).toBe(false);
    expect(boundary.requestCreationEnabled).toBe(false);
    expect(boundary.auditWriteEnabled).toBe(false);
    expect(boundary.executionEnabled).toBe(false);
    expect(boundary.dryRunExecutionEnabled).toBe(false);
    expect(boundary.dispatchEnabled).toBe(false);
    expect(boundary.targetMutationEnabled).toBe(false);
    expect(boundary.authorityAdapterBindingEnabled).toBe(false);
    expect(boundary.credentialChangeEnabled).toBe(false);
    expect(boundary.nasMutationEnabled).toBe(false);
    expect(boundary.safeProjectionOnly).toBe(true);
    expect(boundary.rawExcluded).toBe(true);
    expect(boundary.boundaryOptions.map((item) => item.id)).toEqual(["request_store_hardening", "human_decision_store", "execution_audit_authority", "ops_runtime_mutation"]);
    expect(boundary.boundaryOptions.every((item) => item.status === "approval_required" && item.rawExcluded)).toBe(true);
    expect(boundary.disabledSurfaceSummary).toEqual({ sourceItems: 4, boundaryOptions: 4, enabledControls: 0 });
    expect(boundary.safeBoundary).toContain("frontend read-only next approval boundary only");
    expect(JSON.stringify(boundary)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw next approval|private-next-approval|token-shaped-value|provider/i);
  });

  it("builds Controlled Mutation Post Decision Approval Boundary 1 as read-only fallback after the post-decision approval timeout", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T02:05:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/post-decision-boundary", status: "partial", checked_at: "2026-05-16T02:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw post decision token" } as unknown as OfficeState["data_sources"][number]],
      agents: [{ id: "agent-post-decision-boundary", status: "active", prompt: "raw post decision boundary prompt token-shaped-value", provider: "private-post-decision-provider" }],
      work_items: [{ id: "w-post-decision-boundary", status: "blocked", title: "raw post decision boundary task", body: "/Users/lidises/private/post-decision-boundary.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const nextBoundary = buildOfficeControlledMutationNextApprovalBoundary(hardening);
    const boundary = buildOfficeControlledMutationPostDecisionApprovalBoundary(nextBoundary);

    expect(boundary.stageLabel).toBe("Controlled Mutation Post Decision Approval Boundary 1");
    expect(boundary.sourceStageLabel).toBe("Controlled Mutation Next Approval Boundary 1");
    expect(boundary.detailKind).toBe("controlled_mutation_post_decision_approval_boundary");
    expect(boundary.enabledControls).toBe(0);
    expect(boundary.approvalGranted).toBe(false);
    expect(boundary.requestStoreHardeningCompleted).toBe(true);
    expect(boundary.humanDecisionStoreCompleted).toBe(true);
    expect(boundary.newBackendMutationEnabled).toBe(false);
    expect(boundary.newStorageWriteEnabled).toBe(false);
    expect(boundary.auditWriteEnabled).toBe(false);
    expect(boundary.executionEnabled).toBe(false);
    expect(boundary.dryRunResultStorageEnabled).toBe(false);
    expect(boundary.dispatchEnabled).toBe(false);
    expect(boundary.targetMutationEnabled).toBe(false);
    expect(boundary.authorityAdapterBindingEnabled).toBe(false);
    expect(boundary.credentialChangeEnabled).toBe(false);
    expect(boundary.nasMutationEnabled).toBe(false);
    expect(boundary.safeProjectionOnly).toBe(true);
    expect(boundary.rawExcluded).toBe(true);
    expect(boundary.boundaryOptions.map((item) => item.id)).toEqual(["dry_run_result_storage", "audit_append_sink", "authority_adapter_binding", "target_dispatch_runtime"]);
    expect(boundary.boundaryOptions.every((item) => item.status === "approval_required" && item.rawExcluded)).toBe(true);
    expect(boundary.completedLocalSubsets.map((item) => item.id)).toEqual(["request_store_hardening", "human_decision_store"]);
    expect(boundary.disabledSurfaceSummary).toEqual({ completedSubsets: 2, boundaryOptions: 4, enabledControls: 0 });
    expect(boundary.safeBoundary).toContain("frontend read-only post-decision approval boundary only");
    expect(JSON.stringify(boundary)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw post decision|private-post-decision|token-shaped-value|provider/i);
  });

  it("builds Controlled Mutation Post Registry Approval Boundary 1 as read-only fallback after authority registry approval timeout", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T10:05:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/post-registry-boundary", status: "partial", checked_at: "2026-05-16T10:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw post registry token" } as unknown as OfficeState["data_sources"][number]],
      agents: [{ id: "agent-post-registry-boundary", status: "active", prompt: "raw post registry boundary prompt token-shaped-value", provider: "private-post-registry-provider" }],
      work_items: [{ id: "w-post-registry-boundary", status: "blocked", title: "raw post registry boundary task", body: "/Users/lidises/private/post-registry-boundary.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const nextBoundary = buildOfficeControlledMutationNextApprovalBoundary(hardening);
    const postDecisionBoundary = buildOfficeControlledMutationPostDecisionApprovalBoundary(nextBoundary);
    const boundary = buildOfficeControlledMutationPostRegistryApprovalBoundary(postDecisionBoundary);

    expect(boundary.stageLabel).toBe("Controlled Mutation Post Registry Approval Boundary 1");
    expect(boundary.sourceStageLabel).toBe("Controlled Mutation Post Decision Approval Boundary 1");
    expect(boundary.detailKind).toBe("controlled_mutation_post_registry_approval_boundary");
    expect(boundary.enabledControls).toBe(0);
    expect(boundary.approvalGranted).toBe(false);
    expect(boundary.requestStoreHardeningCompleted).toBe(true);
    expect(boundary.humanDecisionStoreCompleted).toBe(true);
    expect(boundary.dryRunResultStorageCompleted).toBe(true);
    expect(boundary.auditAppendSinkCompleted).toBe(true);
    expect(boundary.authorityBindingContractCompleted).toBe(true);
    expect(boundary.authorityAdapterRegistryCompleted).toBe(true);
    expect(boundary.newBackendMutationEnabled).toBe(false);
    expect(boundary.newStorageWriteEnabled).toBe(false);
    expect(boundary.auditWriteEnabled).toBe(false);
    expect(boundary.executionEnabled).toBe(false);
    expect(boundary.dispatchEnabled).toBe(false);
    expect(boundary.targetMutationEnabled).toBe(false);
    expect(boundary.authorityAdapterBindingEnabled).toBe(false);
    expect(boundary.credentialChangeEnabled).toBe(false);
    expect(boundary.nasMutationEnabled).toBe(false);
    expect(boundary.safeProjectionOnly).toBe(true);
    expect(boundary.rawExcluded).toBe(true);
    expect(boundary.completedLocalSubsets.map((item) => item.id)).toEqual([
      "request_store_hardening",
      "human_decision_store",
      "dry_run_result_storage",
      "audit_append_sink",
      "authority_binding_contract",
      "authority_adapter_registry",
    ]);
    expect(boundary.boundaryOptions.map((item) => item.id)).toEqual([
      "target_dispatch_runtime",
      "nas_save_write_preparation",
      "credential_auth_env_change",
      "real_authority_adapter_binding",
    ]);
    expect(boundary.boundaryOptions.every((item) => item.status === "approval_required" && item.rawExcluded)).toBe(true);
    expect(boundary.disabledSurfaceSummary).toEqual({ completedSubsets: 6, boundaryOptions: 4, enabledControls: 0 });
    expect(boundary.safeBoundary).toContain("frontend read-only post-registry approval boundary only");
    expect(JSON.stringify(boundary)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw post registry|private-post-registry|token-shaped-value|provider/i);
  });


  it("builds Controlled Mutation Target Dispatch Forbidden Boundary 1 as frontend-only read-only continuation", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T10:30:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/target-dispatch-forbidden", status: "partial", checked_at: "2026-05-16T10:30:00Z", item_count: 1, warning_count: 1, error_summary: "raw target dispatch forbidden token" } as unknown as OfficeState["data_sources"][number]],
      agents: [{ id: "agent-target-dispatch-forbidden", status: "active", prompt: "raw target dispatch forbidden prompt token-shaped-value", provider: "private-target-dispatch-provider" }],
      work_items: [{ id: "w-target-dispatch-forbidden", status: "blocked", title: "raw target dispatch forbidden task", body: "/Users/lidises/private/target-dispatch-forbidden.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const nextBoundary = buildOfficeControlledMutationNextApprovalBoundary(hardening);
    const postDecisionBoundary = buildOfficeControlledMutationPostDecisionApprovalBoundary(nextBoundary);
    const postRegistryBoundary = buildOfficeControlledMutationPostRegistryApprovalBoundary(postDecisionBoundary);
    const boundary = buildOfficeControlledMutationTargetDispatchForbiddenBoundary(postRegistryBoundary);

    expect(boundary.stageLabel).toBe("Controlled Mutation Target Dispatch Forbidden Boundary 1");
    expect(boundary.sourceStageLabel).toBe("Controlled Mutation Post Registry Approval Boundary 1");
    expect(boundary.detailKind).toBe("controlled_mutation_target_dispatch_forbidden_boundary");
    expect(boundary.userDecision).toBe("target_dispatch_runtime_forbidden_continue_frontend_readonly");
    expect(boundary.targetDispatchRuntimeApprovalGranted).toBe(false);
    expect(boundary.enabledControls).toBe(0);
    expect(boundary.approvalGranted).toBe(false);
    expect(boundary.dispatchEnabled).toBe(false);
    expect(boundary.targetMutationEnabled).toBe(false);
    expect(boundary.dryRunEnabled).toBe(false);
    expect(boundary.executionEnabled).toBe(false);
    expect(boundary.authorityAdapterBindingEnabled).toBe(false);
    expect(boundary.credentialChangeEnabled).toBe(false);
    expect(boundary.nasMutationEnabled).toBe(false);
    expect(boundary.deployRestartEnabled).toBe(false);
    expect(boundary.pushPrMergeEnabled).toBe(false);
    expect(boundary.safeProjectionOnly).toBe(true);
    expect(boundary.rawExcluded).toBe(true);
    expect(boundary.forbiddenBoundaries.map((item) => item.id)).toEqual(["target_dispatch_runtime"]);
    expect(boundary.boundaryOptions.map((item) => item.id)).toEqual([
      "frontend_readonly_fallback_continue",
      "nas_save_write_preparation",
      "credential_auth_env_change",
      "real_authority_adapter_binding",
    ]);
    expect(boundary.boundaryOptions.every((item) => item.rawExcluded)).toBe(true);
    expect(boundary.disabledSurfaceSummary).toEqual({ completedSubsets: 6, forbiddenBoundaries: 1, boundaryOptions: 4, enabledControls: 0 });
    expect(boundary.safeBoundary).toContain("frontend read-only target-dispatch-forbidden boundary only");
    expect(JSON.stringify(boundary)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw target dispatch|private-target-dispatch|token-shaped-value|provider/i);
  });


  it("builds Controlled Mutation Safe Continuation Completion Review 1 as the frontend-only phase boundary", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T11:00:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/safe-continuation", status: "partial", checked_at: "2026-05-16T11:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw safe continuation token" } as unknown as OfficeState["data_sources"][number]],
      agents: [{ id: "agent-safe-continuation", status: "active", prompt: "raw safe continuation prompt token-shaped-value", provider: "private-safe-continuation-provider" }],
      work_items: [{ id: "w-safe-continuation", status: "blocked", title: "raw safe continuation task", body: "/Users/lidises/private/safe-continuation.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const nextBoundary = buildOfficeControlledMutationNextApprovalBoundary(hardening);
    const postDecisionBoundary = buildOfficeControlledMutationPostDecisionApprovalBoundary(nextBoundary);
    const postRegistryBoundary = buildOfficeControlledMutationPostRegistryApprovalBoundary(postDecisionBoundary);
    const targetForbiddenBoundary = buildOfficeControlledMutationTargetDispatchForbiddenBoundary(postRegistryBoundary);
    const review = buildOfficeControlledMutationSafeContinuationCompletionReview(targetForbiddenBoundary);

    expect(review.stageLabel).toBe("Controlled Mutation Safe Continuation Completion Review 1");
    expect(review.sourceStageLabel).toBe("Controlled Mutation Target Dispatch Forbidden Boundary 1");
    expect(review.detailKind).toBe("controlled_mutation_safe_continuation_completion_review");
    expect(review.readOnlyTargetLevelReached).toBe(true);
    expect(review.nextRequiresExplicitApproval).toBe(true);
    expect(review.enabledControls).toBe(0);
    expect(review.approvalGranted).toBe(false);
    expect(review.dispatchEnabled).toBe(false);
    expect(review.targetMutationEnabled).toBe(false);
    expect(review.executionEnabled).toBe(false);
    expect(review.dryRunEnabled).toBe(false);
    expect(review.auditWriteEnabled).toBe(false);
    expect(review.authorityAdapterBindingEnabled).toBe(false);
    expect(review.credentialChangeEnabled).toBe(false);
    expect(review.nasMutationEnabled).toBe(false);
    expect(review.deployRestartEnabled).toBe(false);
    expect(review.pushPrMergeEnabled).toBe(false);
    expect(review.safeProjectionOnly).toBe(true);
    expect(review.rawExcluded).toBe(true);
    expect(review.completedSlices.map((item) => item.id)).toEqual([
      "request_store_hardening",
      "human_decision_store",
      "dry_run_result_storage",
      "audit_append_sink",
      "authority_binding_contract",
      "authority_adapter_registry",
      "target_dispatch_forbidden_boundary",
    ]);
    expect(review.explicitApprovalBoundaries.map((item) => item.id)).toEqual([
      "nas_save_write_preparation",
      "credential_auth_env_change",
      "real_authority_adapter_binding",
      "target_dispatch_runtime",
    ]);
    expect(review.disabledSurfaceSummary).toEqual({ completedSlices: 7, explicitApprovalBoundaries: 4, enabledControls: 0 });
    expect(JSON.stringify(review)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw safe continuation|private-safe-continuation-provider|token-shaped-value/i);
  });

  it("builds Controlled Mutation Approval Boundary 1 as the approved read-only summary gate", () => {
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-20T08:40:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/approval-boundary", status: "partial", checked_at: "2026-05-20T08:40:00Z", item_count: 1, warning_count: 1, error_summary: "raw approval boundary token" } as unknown as OfficeState["data_sources"][number]],
      agents: [{ id: "agent-approval-boundary", status: "active", prompt: "raw approval boundary prompt token-shaped-value", provider: "private-approval-boundary-provider" }],
      work_items: [{ id: "w-approval-boundary", status: "blocked", title: "raw approval boundary task", body: "/Users/lidises/private/approval-boundary.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const nextBoundary = buildOfficeControlledMutationNextApprovalBoundary(hardening);
    const postDecisionBoundary = buildOfficeControlledMutationPostDecisionApprovalBoundary(nextBoundary);
    const postRegistryBoundary = buildOfficeControlledMutationPostRegistryApprovalBoundary(postDecisionBoundary);
    const targetForbiddenBoundary = buildOfficeControlledMutationTargetDispatchForbiddenBoundary(postRegistryBoundary);
    const review = buildOfficeControlledMutationSafeContinuationCompletionReview(targetForbiddenBoundary);
    const boundary = buildOfficeControlledMutationApprovalBoundarySummary(review);

    expect(boundary.stageLabel).toBe("Controlled Mutation Approval Boundary 1");
    expect(boundary.sourceStageLabel).toBe("Controlled Mutation Safe Continuation Completion Review 1");
    expect(boundary.detailKind).toBe("controlled_mutation_approval_boundary_summary");
    expect(boundary.enabledControls).toBe(0);
    expect(boundary.formControlEnabled).toBe(false);
    expect(boundary.browserExecutableControlsEnabled).toBe(false);
    expect(boundary.localDocumentationWriteApproved).toBe(true);
    expect(boundary.frontendReadOnlySummaryApproved).toBe(true);
    expect(boundary.commitPushApproved).toBe(true);
    expect(boundary.vpsDashboardSyncApproved).toBe(true);
    expect(boundary.dashboardRestartApproved).toBe(true);
    expect(boundary.gatewayRestartApproved).toBe(false);
    expect(boundary.kanbanMutationEnabled).toBe(false);
    expect(boundary.nasWriteEnabled).toBe(false);
    expect(boundary.watcherCronEnabled).toBe(false);
    expect(boundary.dispatcherAuthorityAdapterBindingEnabled).toBe(false);
    expect(boundary.targetMutationEnabled).toBe(false);
    expect(boundary.directVpsNasAuthorityEnabled).toBe(false);
    expect(boundary.publicExposureChangeEnabled).toBe(false);
    expect(boundary.safeProjectionOnly).toBe(true);
    expect(boundary.rawExcluded).toBe(true);
    expect(boundary.approvedScopeItems.map((item) => item.id)).toEqual(["docs_boundary_record", "readonly_office_summary", "local_verification", "dashboard_only_followthrough"]);
    expect(boundary.blockedCapabilityItems.map((item) => item.id)).toEqual(["kanban_mutation", "nas_write", "watcher_cron_activation", "dispatcher_authority_binding", "target_mutation", "direct_vps_nas_authority", "public_exposure_change", "gateway_restart"]);
    expect(boundary.disabledSurfaceSummary).toEqual({ approvedScopeItems: 4, blockedCapabilityItems: 8, enabledControls: 0 });
    expect(JSON.stringify(boundary)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw approval boundary|private-approval-boundary-provider|token-shaped-value/i);
  });


  it("builds a disabled Authority Adapter Contract 1 before any execution adapter exists", () => {
    const contract = buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T13:35:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/authority", status: "partial", checked_at: "2026-05-14T13:30:00Z", item_count: 1, warning_count: 1, error_summary: "raw authority token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw authority work", body: "secret authority body" } as unknown as OfficeState["work_items"][number]],
      automations: [{ id: "cron-authority-private", state: "error", last_status: "failed", script: "/Users/lidises/authority.sh" } as unknown as OfficeState["automations"][number]],
    })))));

    expect(contract.stageLabel).toBe("Authority Adapter Contract 1");
    expect(contract.enabledControls).toBe(0);
    expect(contract.dispatchEnabled).toBe(false);
    expect(contract.adaptersInstalled).toBe(false);
    expect(contract.allowedActionKinds).toEqual(["kanban_transition", "projection_promote", "nas_save_request", "watcher_enable_request", "service_restart_request"]);
    expect(contract.requiredFields.map((field) => field.id)).toEqual(["request_ref", "dry_run_result", "audit_sink", "rollback_ref", "human_confirmation_ref"]);
    expect(contract.requiredFields.every((field) => field.required && field.status === "missing" && field.rawExcluded)).toBe(true);
    expect(contract.gateSnapshot).toMatchObject({ executionAllowed: false, browserAffordance: "none" });
    expect(contract.safeBoundary).toContain("contract only");
    expect(JSON.stringify(contract)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw authority|secret authority|private|token/i);
  });

  it("builds a read-only Approval Execution Gate 1 without executable authority", () => {
    const gate = buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T13:20:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/execution", status: "partial", checked_at: "2026-05-14T13:10:00Z", item_count: 1, warning_count: 1, error_summary: "raw execution token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw execution work", body: "secret execution body" } as unknown as OfficeState["work_items"][number]],
      automations: [{ id: "cron-exec-private", state: "error", last_status: "failed", script: "/Users/lidises/execute.sh" } as unknown as OfficeState["automations"][number]],
    }))));

    expect(gate.stageLabel).toBe("Approval Execution Gate 1");
    expect(gate.enabledControls).toBe(0);
    expect(gate.executionAllowed).toBe(false);
    expect(gate.browserAffordance).toBe("none");
    expect(gate.requiredPrerequisites.map((item) => item.id)).toEqual(["authority_adapter", "audit_writer", "rollback_plan", "human_confirmation"]);
    expect(gate.requiredPrerequisites.every((item) => item.status === "missing" && item.rawExcluded)).toBe(true);
    expect(gate.blockedBy.map((item) => item.eventKind)).toEqual(["execution_blocked"]);
    expect(gate.safeBoundary).toContain("no execution authority");
    expect(JSON.stringify(gate)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw execution|secret execution|private|token/i);
  });

  it("builds a read-only Approval Audit Timeline 1 chain without writing audit events", () => {
    const timeline = buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T13:00:00Z",
      data_sources: [{ id: "paperclip:/Users/lidises/private", status: "partial", checked_at: "2026-05-14T12:55:00Z", item_count: 1, warning_count: 1, error_summary: "raw audit source token" } as unknown as OfficeState["data_sources"][number]],
      work_items: [{ id: "w1", status: "blocked", title: "raw audit work", body: "secret audit body" } as unknown as OfficeState["work_items"][number]],
      automations: [{ id: "cron-private", state: "error", last_status: "failed", script: "/Users/lidises/audit.sh" } as unknown as OfficeState["automations"][number]],
      projection_cache: {
        schema_version: 1,
        status: "active",
        redacted: true,
        cache_layout: { incoming: "incoming", active: "active", archive: "archive", rejected: "rejected" },
        active: { bundle_id: "raw-audit-bundle-token", generated_at: "2026-05-14T12:50:00Z", generated_by: "relay", source_kind: "safe_manifest", source_tags: ["raw audit tag"], freshness: {}, validator: { result: "warning" }, redaction: { raw_excluded: true } } as unknown as OfficeState["projection_cache"]["active"],
        rejected: { count: 1, recent: [{ path: "/Users/lidises/audit.json", error: "raw audit error" }] },
      } as unknown as OfficeState["projection_cache"],
    })));

    expect(timeline.stageLabel).toBe("Approval Audit Timeline 1");
    expect(timeline.enabledControls).toBe(0);
    expect(timeline.writesAuditEvents).toBe(false);
    expect(timeline.steps.map((step) => step.eventKind)).toEqual(["action_requested", "dry_run_completed", "human_decision_recorded", "execution_blocked"]);
    expect(timeline.steps.every((step) => step.safeSummary.length > 0 && step.rawExcluded)).toBe(true);
    expect(timeline.steps.find((step) => step.eventKind === "execution_blocked")).toMatchObject({ resultPosture: "blocked", status: "blocked-preview" });
    expect(timeline.safeBoundary).toContain("timeline posture only");
    expect(JSON.stringify(timeline)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw audit|secret audit|private|token/i);
  });

  it("builds a read-only Approval Request View 1 posture without creating executable requests", () => {
    const view = buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-14T12:45:00Z",
      data_sources: [
        { id: "kanban", status: "ok", checked_at: "2026-05-14T12:00:00Z", item_count: 3, warning_count: 0 },
        { id: "paperclip:/Users/lidises/nas/private", status: "partial", checked_at: "2026-05-14T11:00:00Z", item_count: 1, warning_count: 2, error_summary: "raw source error token" } as unknown as OfficeState["data_sources"][number],
      ],
      work_items: [
        { id: "w1", status: "blocked", title: "raw blocked title", body: "secret request body" } as unknown as OfficeState["work_items"][number],
        { id: "w2", status: "review", title: "raw review title", result: "secret result" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [{ id: "cron-private", state: "error", last_status: "failed", script: "/Users/lidises/private_restart.sh" } as unknown as OfficeState["automations"][number]],
      events: [{ id: "event-private", category: "approval_needed", room_id: "incident_corner", tone: "warning", generated_at: "2026-05-14T12:40:00Z", detail: "raw event token" } as unknown as OfficeState["events"][number]],
      projection_cache: {
        schema_version: 1,
        status: "active",
        redacted: true,
        cache_layout: { incoming: "incoming", active: "active", archive: "archive", rejected: "rejected" },
        active: { bundle_id: "bundle-private-token", generated_at: "2026-05-14T12:00:00Z", generated_by: "relay", source_kind: "safe_manifest", source_tags: ["raw path tag"], freshness: {}, validator: { result: "warning" }, redaction: { raw_excluded: true } } as unknown as OfficeState["projection_cache"]["active"],
        rejected: { count: 4, recent: [{ path: "/Users/lidises/rejected.json", error: "raw validation error" }] },
      } as unknown as OfficeState["projection_cache"],
    }));

    expect(view.stageLabel).toBe("Approval Request View 1");
    expect(view.authorityLevel).toBe("display_only");
    expect(view.enabledControls).toBe(0);
    expect(view.requests.map((request) => request.actionKind)).toEqual(["kanban_transition", "projection_promote", "watcher_enable_request"]);
    expect(view.requests.every((request) => request.hypothetical && request.orchestratorRequired && request.humanApprovalRequired)).toBe(true);
    expect(view.requests.find((request) => request.actionKind === "kanban_transition")).toMatchObject({ targetKind: "kanban_card", targetRef: "kanban-card:blocked-1", evidenceCount: 2 });
    expect(view.dryRunEvidence).toMatchObject({ result: "needs_more_evidence", validatorPosture: "fail", rawExcluded: true });
    expect(view.humanDecision).toMatchObject({ status: "not_requested", scope: "single_action_only", enabled: false });
    expect(view.auditReadiness.safeSummary).toContain("request posture only");
    expect(JSON.stringify(view)).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw source|raw blocked|secret request|secret result|private_restart|raw event|bundle-private-token|raw path tag|raw validation|token/i);
  });

  it("groups the unified operating workbench into four safe layers with disabled approval posture", () => {
    const view = buildOfficeUnifiedWorkbenchView(officeFixture({
      generated_at: "2026-05-14T12:20:00Z",
      data_sources: [
        { id: "kanban", status: "ok", checked_at: "2026-05-14T12:00:00Z", item_count: 7, warning_count: 0 },
        { id: "paperclip:/Users/lidises/nas/raw", status: "partial", checked_at: "2026-05-14T11:00:00Z", item_count: 2, warning_count: 1, source_type: "paperclip", tags: ["source:safe", "raw prompt"] } as unknown as OfficeState["data_sources"][number],
      ],
      agents: [{ id: "agent-1", status: "active", prompt: "raw prompt must not appear" } as unknown as OfficeState["agents"][number]],
      work_items: [
        { id: "w1", status: "blocked", title: "raw title", body: "secret body" } as unknown as OfficeState["work_items"][number],
        { id: "w2", status: "done", result: "raw result" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [{ id: "cron-1", state: "error", last_status: "error", script: "/Users/lidises/private.py" } as unknown as OfficeState["automations"][number]],
      events: [{ id: "event-1", category: "workload_changed", room_id: "work", tone: "warning", generated_at: "2026-05-14T12:05:00Z", detail: "raw event detail" } as unknown as OfficeState["events"][number]],
      provenance: [{ source: "paperclip:safe", label: "safe source", detail: "raw path must not appear" } as unknown as OfficeState["provenance"][number]],
      redactions: { policy_version: 1, redacted_field_count: 5, omitted_sections: ["prompt", "transcript"], warnings: ["raw warning"] },
      projection_cache: {
        schema_version: 1,
        status: "token /Users/lidises/raw projection status",
        redacted: true,
        cache_layout: { incoming: "incoming", active: "active", archive: "archive", rejected: "rejected" },
        active: {
          bundle_id: "safe-bundle-1",
          generated_at: "2026-05-14T12:00:00Z",
          generated_by: "relay",
          source_kind: "safe_manifest",
          source_tags: ["source:safe", "raw prompt ignored"],
          freshness: { stale_after: "2026-05-15T12:00:00Z" },
          validator: { result: "pass" },
          redaction: { raw_excluded: true },
        } as unknown as OfficeState["projection_cache"]["active"],
        rejected: { count: -9, recent: [] },
      } as unknown as OfficeState["projection_cache"],
    }));

    expect(view.title).toBe("AI Office 통합 운영실");
    expect(view.layers.map((layer) => layer.id)).toEqual(["operatingBoard", "evidenceLayer", "projectionCache", "rpgRoom"]);
    expect(view.layers.find((layer) => layer.id === "operatingBoard")).toMatchObject({ label: "운영 보드", source: "VPS canonical ai-office Kanban", count: 9 });
    expect(view.layers.find((layer) => layer.id === "evidenceLayer")?.summary).toContain("Paperclip/sourceTags 1개");
    expect(view.layers.find((layer) => layer.id === "projectionCache")?.summary).toContain("unknown");
    expect(view.layers.find((layer) => layer.id === "projectionCache")?.count).toBe(1);
    expect(view.layers.find((layer) => layer.id === "rpgRoom")?.summary).toContain("RPG 운영실");
    expect(view.safetyPosture.approvalModel).toMatchObject({ status: "display-only", enabledControls: 0 });
    expect(view.renderOrder).toEqual(["operating-room-header", "rpg-room-map", "operating-board", "evidence-layer", "projection-cache", "safety-inspector"]);
    expect(JSON.stringify(view)).not.toMatch(/raw prompt|raw title|secret body|raw result|raw event|raw warning|private\.py|\/Users\/lidises|token/i);
  });

  it("builds a safe Paperclip workbench projection from source tags without raw content", () => {
    const state = officeFixture({
      data_sources: [
        {
          id: "paperclip:clinic-blog",
          status: "partial",
          checked_at: "2026-05-11T08:00:00Z",
          item_count: 12,
          warning_count: 1,
          error_summary: "1 stale manifest",
          source_type: "paperclip",
          relay: "MacBook",
          tags: ["source:koreandeer-shoulder", "raw prompt must not appear"],
          path: "/Users/lidises/nas/secret/raw/path",
          prompt: "raw prompt must not appear",
          transcript: "raw transcript must not appear",
        } as unknown as OfficeState["data_sources"][number],
      ],
      provenance: [
        { source: "paperclip:clinic-blog", label: "Paperclip safe manifest", detail: "raw path must not appear" } as unknown as OfficeState["provenance"][number],
      ],
    });

    const workbench = buildOfficePaperclipWorkbench(state);

    expect(workbench.sources).toHaveLength(1);
    expect(workbench.sources[0]).toMatchObject({
      id: "paperclip:clinic-blog",
      label: "clinic-blog",
      health: "partial",
      sourceType: "paperclip",
      itemCount: 12,
      warningCount: 1,
      relay: "MacBook",
    });
    expect(workbench.sources[0].tags).toEqual(["source:koreandeer-shoulder"]);
    expect(JSON.stringify(workbench)).not.toMatch(/raw|prompt|transcript|secret|\/Users\/lidises\/nas/i);
  });

  it("builds Paperclip Workbench 2 manifest visibility without leaking raw manifest details", () => {
    const visibility = buildOfficePaperclipManifestVisibility(officeFixture({
      data_sources: [
        {
          id: "paperclip:clinic-safe-shelf",
          status: "ok",
          checked_at: "2026-05-11T23:30:00Z",
          item_count: 3,
          warning_count: 0,
          source_type: "relay_projection",
          relay: "VPS",
          tags: ["source:koreandeer-shoulder", "raw prompt must not appear"],
          path: "/home/hermes/.hermes/office/paperclip-manifests/private.yaml",
          body: "raw manifest body must not appear",
          token: "sk-" + "paperclip-visibility-sentinel",
        } as unknown as OfficeState["data_sources"][number],
        {
          id: "paperclip:/Users/lidises/nas/raw-second",
          status: "partial",
          checked_at: "2026-05-08T00:00:00Z",
          item_count: 9,
          warning_count: 2,
          source_type: "nas_manifest",
          relay: "MacBook",
          tags: ["source:clinic-notes"],
          error_summary: "raw /Users/lidises/nas error should not appear",
        } as unknown as OfficeState["data_sources"][number],
      ],
    }));

    expect(visibility.stageLabel).toBe("Paperclip Workbench 2");
    expect(visibility.cards.map((card) => card.id)).toEqual(["manifests", "privateDashboard", "relayPosture"]);
    expect(visibility.cards.find((card) => card.id === "manifests")).toMatchObject({ title: "안전 manifest", count: 2, tone: "warning" });
    expect(visibility.cards.find((card) => card.id === "privateDashboard")).toMatchObject({ title: "VPS 표시", count: 1, tone: "positive" });
    expect(visibility.cards.find((card) => card.id === "relayPosture")).toMatchObject({ title: "릴레이 생산", count: 2, tone: "neutral" });
    expect(visibility.detail).toContain("validator-passing");
    expect(JSON.stringify(visibility)).not.toMatch(/\/home\/hermes|\/Users\/lidises|raw|prompt|body|token|sk-paperclip|private\.yaml/i);
  });

  it("builds a safe Kanban operations projection with graph refs and no raw task content", () => {
    const projection = buildOfficeKanbanProjection(officeFixture({
      rooms: [
        { id: "kanban:ai-office", kind: "kanban_board", source: "kanban", display_name: "AI Office", counts: { done: 1, running: 1, blocked: 0 } },
      ],
      work_items: [
        {
          id: "kanban:ai-office:item:0",
          source: "kanban",
          kind: "kanban_task",
          board_id: "ai-office",
          task_ref: "t_72c99902",
          title: "Kanban task",
          body: "raw body must not appear",
          result: "raw result must not appear",
          prompt: "raw prompt must not appear",
          transcript: "raw transcript must not appear",
          status: "done",
          assignee: "ai-office-orchestrator",
          tenant: "ai-office",
          priority: 7,
          parent_task_refs: [],
          child_task_refs: ["t_86deef15"],
          dependency_counts: { parents: 0, children: 1 },
          badges: ["graph_parent"],
        },
        {
          id: "kanban:ai-office:item:1",
          source: "kanban",
          kind: "kanban_task",
          board_id: "ai-office",
          task_ref: "t_86deef15",
          title: "Kanban task",
          status: "running",
          assignee: "office-reporter",
          tenant: "ai-office",
          priority: 0,
          parent_task_refs: ["t_72c99902"],
          child_task_refs: [],
          dependency_counts: { parents: 1, children: 0 },
          badges: ["active", "graph_child"],
        },
      ],
    }));

    expect(projection.stageLabel).toBe("칸반 운영실");
    expect(projection.readOnly).toBe(true);
    expect(projection.boards[0]).toMatchObject({ boardId: "ai-office", displayName: "AI Office", taskCount: 2 });
    expect(projection.assignees.map((assignee) => assignee.id)).toEqual(["ai-office-orchestrator", "office-reporter"]);
    expect(projection.tenants).toEqual([{ id: "ai-office", count: 2 }]);
    expect(projection.graphEdges).toEqual([{ parent: "t_72c99902", child: "t_86deef15", boardId: "ai-office" }]);
    expect(projection.cards[0]).toMatchObject({ taskRef: "t_72c99902", boardId: "ai-office", childTaskRefs: ["t_86deef15"] });
    expect(projection.operatingPosture).toMatchObject({
      stageLabel: "Kanban-first 운영 v1",
      sourceOfTruth: "VPS ai-office",
      openTaskCount: 1,
      activeTaskCount: 1,
      blockedTaskCount: 0,
      doneTaskCount: 1,
    });
    expect(projection.operatingPosture.guidanceCards.map((card) => card.id)).toEqual(["intake", "orchestrate", "review", "local"]);
    expect(JSON.stringify(projection)).not.toMatch(/raw body|raw result|raw prompt|raw transcript|secret/i);
  });

  it("summarizes Kanban stale, blocked, and workload signals without raw task fields", () => {
    const projection = buildOfficeKanbanProjection(officeFixture({
      generated_at: "2026-05-12T00:00:00Z",
      rooms: [
        { id: "kanban:ai-office", kind: "kanban_board", source: "kanban", display_name: "AI Office", counts: { running: 2, blocked: 1, open: 1 } },
      ],
      work_items: [
        {
          id: "kanban:ai-office:item:0",
          source: "kanban",
          kind: "kanban_task",
          board_id: "ai-office",
          task_ref: "t_running_old",
          title: "Kanban task",
          status: "running",
          assignee: "office-runner",
          tenant: "ai-office",
          priority: 3,
          updated_at: "2026-05-11T22:30:00Z",
          last_heartbeat_at: "2026-05-11T22:30:00Z",
          parent_task_refs: [],
          child_task_refs: [],
          badges: ["active"],
          body: "raw body must not appear",
        },
        {
          id: "kanban:ai-office:item:1",
          source: "kanban",
          kind: "kanban_task",
          board_id: "ai-office",
          task_ref: "t_blocked",
          title: "Kanban task",
          status: "blocked",
          assignee: "office-runner",
          tenant: "ai-office",
          priority: 9,
          updated_at: { path: "/Users/lidises/nas/private" },
          last_heartbeat_at: "raw secret timestamp must not appear",
          parent_task_refs: ["t_running_old"],
          child_task_refs: [],
          badges: ["needs_attention", "graph_child"],
          result: "raw result must not appear",
        },
        {
          id: "kanban:ai-office:item:2",
          source: "kanban",
          kind: "kanban_task",
          board_id: "ai-office",
          task_ref: "t_recent",
          title: "Kanban task",
          status: "running",
          assignee: "reviewer",
          tenant: "ai-office",
          priority: 1,
          updated_at: "2026-05-11T23:58:00Z",
          last_heartbeat_at: "2026-05-11T23:58:00Z",
          parent_task_refs: [],
          child_task_refs: [],
          badges: ["active"],
        },
      ],
    }));

    expect(projection.observability.stageLabel).toBe("Kanban Observability 2");
    expect(projection.observability.summaryCards).toEqual([
      { id: "workload", label: "작업량", value: 3, detail: "보드 1개 · 실행 중 2개", tone: "neutral" },
      { id: "blocked", label: "막힘", value: 1, detail: "확인 필요 task_ref 1개", tone: "negative" },
      { id: "stale", label: "정체", value: 1, detail: "최근 heartbeat/update 60분 초과 1개", tone: "warning" },
    ]);
    expect(projection.observability.workloadByBoard).toEqual([{ boardId: "ai-office", total: 3, running: 2, blocked: 1, stale: 1 }]);
    expect(projection.observability.attentionRefs).toEqual(["t_blocked", "t_running_old"]);
    expect(JSON.stringify(projection.observability)).not.toMatch(/raw|body|result|prompt|transcript|secret|\/Users\/lidises\/nas/i);
    expect(JSON.stringify(projection.cards)).not.toMatch(/raw|secret|timestamp|\/Users\/lidises\/nas/i);
  });

  it("builds a read-only Kanban mutation dry-run readiness review without write capabilities", () => {
    const projection = buildOfficeKanbanProjection(officeFixture({
      generated_at: "2026-05-20T09:20:00Z",
      rooms: [
        { id: "kanban:ai-office", kind: "kanban_board", source: "kanban", display_name: "AI Office", counts: { blocked: 1, running: 1 } },
      ],
      work_items: [
        {
          id: "kanban:ai-office:item:0",
          source: "kanban",
          kind: "kanban_task",
          board_id: "ai-office",
          task_ref: "t_blocked_safe",
          title: "raw title must not appear",
          status: "blocked",
          assignee: "office-runner",
          tenant: "ai-office",
          priority: 9,
          parent_task_refs: [],
          child_task_refs: [],
          badges: ["needs_attention"],
          body: "raw body must not appear",
          result: "raw result must not appear",
          prompt: "raw prompt token must not appear",
        },
      ],
    }));

    expect(projection.mutationDryRunReadiness).toMatchObject({
      stageLabel: "Kanban mutation dry-run readiness 1",
      readOnly: true,
      dryRunOnly: true,
      sourceOfTruth: "VPS ai-office",
      candidateTransitionRef: "t_blocked_safe",
      candidateBoardId: "ai-office",
      candidateStatus: "blocked",
      enabledControls: 0,
      formControlEnabled: false,
      kanbanMutationEnabled: false,
      executionEnabled: false,
      dryRunResultWriteEnabled: false,
      approvalRecordWriteEnabled: false,
      watcherCronEnabled: false,
      nasWriteEnabled: false,
      gatewayRestartEnabled: false,
      rawExcluded: true,
      summary: { evidenceCheckCount: 6, blockedCapabilityCount: 6, enabledControls: 0 },
    });
    expect(projection.mutationDryRunReadiness.evidenceChecks.map((check) => check.id)).toEqual(["safe_ref", "approval_boundary", "operator_intent", "rollback_plan", "audit_plan", "separate_mutation_approval"]);
    expect(projection.mutationDryRunReadiness.blockedCapabilities.map((capability) => capability.id)).toEqual(["kanban_mutation", "dry_run_result_write", "approval_record_write", "nas_write", "watcher_cron", "gateway_restart"]);
    expect(JSON.stringify(projection.mutationDryRunReadiness)).not.toMatch(/raw title|raw body|raw result|raw prompt|token|secret|\/Users\/lidises/i);
  });

  it("caps Kanban observability attention refs before exposing the browser projection", () => {
    const projection = buildOfficeKanbanProjection(officeFixture({
      generated_at: "2026-05-12T00:00:00Z",
      rooms: [{ id: "kanban:ai-office", kind: "kanban_board", source: "kanban", display_name: "AI Office", counts: { blocked: 8 } }],
      work_items: Array.from({ length: 8 }, (_, index) => ({
        id: `kanban:ai-office:item:${index}`,
        source: "kanban",
        kind: "kanban_task",
        board_id: "ai-office",
        task_ref: `t_blocked_${index}`,
        title: "Kanban task",
        status: "blocked",
        assignee: "office-runner",
        tenant: "ai-office",
        priority: index,
        parent_task_refs: [],
        child_task_refs: [],
        badges: ["needs_attention"],
        body: "raw body must not appear",
      })),
    }));

    expect(projection.observability.attentionRefs).toEqual(["t_blocked_0", "t_blocked_1", "t_blocked_2", "t_blocked_3", "t_blocked_4", "t_blocked_5"]);
    expect(JSON.stringify(projection.observability)).not.toMatch(/raw|body|secret/i);
  });

  it("builds safe Paperclip inspector fields and CSS map slots from the sanitized workbench only", () => {
    const state = officeFixture({
      generated_at: "2026-05-11T09:00:00Z",
      data_sources: [
        {
          id: "paperclip:clinic-blog",
          status: "ok",
          checked_at: "2026-05-11T08:00:00Z",
          item_count: 3,
          warning_count: 0,
          source_type: "paperclip",
          relay: "MacBook",
          tags: ["source:koreandeer-shoulder", "token must not appear"],
          path: "/Users/lidises/nas/private/full/path",
          body: "secret body must not appear",
        } as unknown as OfficeState["data_sources"][number],
      ],
    });
    const source = buildOfficePaperclipWorkbench(state).sources[0];
    const inspector = buildOfficePaperclipInspector(source);
    const projection = buildOfficePaperclipMapProjection([source]);

    expect(inspector.kind).toBe("Paperclip 안전 작업대");
    expect(inspector.fields.map(([label]) => label)).toEqual(["id", "종류", "상태", "항목", "경고", "릴레이", "상태 시점", "태그", "가림"]);
    expect(projection.slots[0]).toMatchObject({ id: "paperclip:clinic-blog", label: "clinic-blog", health: "ok", x: 18, y: 50 });
    expect(JSON.stringify({ inspector, projection })).not.toMatch(/raw|prompt|transcript|secret|token|\/Users\/lidises\/nas|body/i);
  });

  it("builds live operations layer from safe aggregate state without raw work details", () => {
    const layer = buildOfficeLiveOperationsLayer(officeFixture({
      generated_at: "2026-05-11T09:00:00Z",
      work_items: [
        { id: "w1", status: "running", title: "raw task body must not appear", body: "secret body" } as unknown as OfficeState["work_items"][number],
        { id: "w2", status: "blocked", title: "blocked private title", result: "raw result" } as unknown as OfficeState["work_items"][number],
        { id: "w3", status: "reviewing", prompt: "raw prompt" } as unknown as OfficeState["work_items"][number],
        { id: "w4", status: "report_ready", transcript: "raw transcript" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [
        { id: "a1", state: "scheduled", last_status: "ok", script: "/Users/lidises/private.py" } as unknown as OfficeState["automations"][number],
        { id: "a2", state: "done", last_status: "ok", script: "/Users/lidises/private-done.py" } as unknown as OfficeState["automations"][number],
      ],
      data_sources: [{ id: "paperclip:rpg-office-runtime-roadmap", status: "ok", checked_at: "2026-05-11T08:00:00Z", item_count: 9, warning_count: 0 }],
    }));

    expect(layer.stageLabel).toBe("Live operations layer");
    expect(layer.summary).toBe("작업 중 1 · 리뷰 1 · 보고 1 · 주의 1 · 자동화 1");
    expect(layer.cues.map((cue) => cue.id)).toEqual(["working", "reviewing", "report-ready", "blocked", "automation-running"]);
    expect(layer.cues.find((cue) => cue.id === "report-ready")).toMatchObject({ label: "보고 대기", count: 1, roomId: "work", tone: "positive" });
    expect(layer.cues.every((cue) => cue.ariaHidden && cue.interactive === false)).toBe(true);
    expect(JSON.stringify(layer)).not.toMatch(/raw|prompt|transcript|secret|body|result|\/Users\/lidises|private/i);
  });

  it("builds attention rail from blocked work, failed automations, and unhealthy sources", () => {
    const attention = buildOfficeAttentionItems(
      officeFixture({
        data_sources: [
          {
            id: "topics",
            status: "missing",
            checked_at: "2026-05-08T00:00:00Z",
            warning_count: 0,
          },
          {
            id: "cron",
            status: "partial",
            checked_at: "2026-05-08T00:00:00Z",
            warning_count: 1,
          },
        ],
        work_items: [{ id: "task-1", title: "Blocked safe task", status: "blocked" }],
        automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "error" }],
      }),
    );

    expect(attention.map((item) => item.id)).toEqual([
      "work:task-1",
      "automation:job-1",
      "source:cron",
    ]);
    expect(attention.map((item) => item.label).join(" ")).not.toContain("prompt");
  });

  it("builds a browser-local office map from safe DTO counts", () => {
    const nodes = buildOfficeMapNodes(
      officeFixture({
        data_sources: [
          { id: "kanban", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 2 },
          { id: "topics", status: "missing", checked_at: "2026-05-08T00:00:00Z", item_count: 0 },
        ],
        agents: [{ id: "session-1", source_platform: "cli", status: "active", preview: "raw prompt must not matter" }],
        work_items: [{ id: "task-1", title: "Safe task", status: "blocked", body: "raw task body must not matter" }],
        automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", script: "raw script must not matter" }],
        topics: [],
      }),
    );

    expect(nodes.map((node) => node.id)).toEqual(["sessions", "work", "automation", "routing"]);
    expect(nodes.find((node) => node.id === "sessions")?.count).toBe(1);
    expect(nodes.find((node) => node.id === "work")?.count).toBe(1);
    expect(nodes.find((node) => node.id === "automation")?.count).toBe(1);
    expect(nodes.find((node) => node.id === "routing")?.health).toBe("missing");
    expect(nodes.map((node) => `${node.label} ${node.detail}`).join(" ")).not.toContain("raw");
  });


  it("builds safe office-map flow hints with degraded endpoint health", () => {
    const nodes = buildOfficeMapNodes(
      officeFixture({
        data_sources: [
          { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
          { id: "kanban", status: "partial", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
          { id: "cron", status: "error", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
          { id: "topics", status: "missing", checked_at: "2026-05-08T00:00:00Z", item_count: 0 },
        ],
        agents: [{ id: "session-1", source_platform: "cli", status: "active", transcript: "raw transcript must not matter" }],
        work_items: [{ id: "task-1", title: "Safe task", status: "blocked", body: "raw task body must not matter" }],
        automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", script: "raw script must not matter" }],
      }),
    );
    const flows = buildOfficeMapFlows(nodes);

    expect(flows.map((flow) => `${flow.from}->${flow.to}`)).toEqual([
      "sessions->work",
      "work->automation",
      "automation->routing",
    ]);
    expect(flows.map((flow) => flow.health)).toEqual(["partial", "error", "error"]);
    expect(flows.map((flow) => flow.label).join(" ")).not.toContain("raw");
    expect(nodes.map((node) => node.zone)).toEqual(["entry", "workbench", "machine", "routing"]);
    expect(nodes.every((node) => node.x >= 12 && node.x <= 88 && node.y >= 16 && node.y <= 84)).toBe(true);
  });

  it("builds safe 2D office scene objects with caps and no raw field projection", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 8 },
        { id: "kanban", status: "partial", checked_at: "2026-05-08T00:00:00Z", item_count: 7 },
        { id: "cron", status: "error", checked_at: "2026-05-08T00:00:00Z", item_count: 2 },
        { id: "topics", status: "missing", checked_at: "2026-05-08T00:00:00Z", item_count: 0 },
      ],
      agents: Array.from({ length: 8 }, (_, index) => ({ id: `session-${index}`, source_platform: "cli", status: "active", transcript: "raw transcript must not matter" })),
      work_items: Array.from({ length: 7 }, (_, index) => ({ id: `task-${index}`, title: "Safe task", status: index === 0 ? "blocked" : "open", body: "raw task body must not matter" })),
      automations: [
        { id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" },
        { id: "job-2", name: "Cron job job-2", state: "error", last_status: "error", secret: "raw secret must not matter" },
      ],
      topics: [],
      provenance: [],
    });
    const nodes = buildOfficeMapNodes(state);
    const objects = buildOfficeSceneObjects(state, nodes);

    expect(objects.map((object) => object.kind)).toContain("avatar");
    expect(objects.map((object) => object.kind)).toContain("desk");
    expect(objects.map((object) => object.kind)).toContain("machine");
    expect(objects.map((object) => object.kind)).toContain("mail");
    expect(objects.filter((object) => object.roomId === "sessions" && object.kind === "avatar")).toHaveLength(6);
    expect(objects.find((object) => object.id === "sessions-overflow")?.label).toBe("+2 세션");
    expect(objects.find((object) => object.id === "work-overflow")?.label).toBe("+1 작업");
    expect(objects.find((object) => object.roomId === "routing")?.label).toBe("미연결 보관함");
    expect(objects.every((object) => object.x >= 10 && object.x <= 90 && object.y >= 12 && object.y <= 88)).toBe(true);
    expect(objects.map((object) => `${object.label} ${object.detail}`).join(" ")).not.toMatch(/raw|transcript|body|script|secret/i);
  });

  it("builds non-interactive accessible marker presentation without raw details", () => {
    const marker = buildOfficeSceneObjectView({
      id: "work-desk-1",
      roomId: "work",
      kind: "desk",
      label: "work desk 1",
      detail: "workbench safe marker",
      health: "partial",
      x: 63,
      y: 21,
    });

    expect(marker.glyph).toBe("▤");
    expect(marker.title).toBe("work desk 1 · workbench safe marker");
    expect(marker.ariaHidden).toBe(true);
    expect(marker.interactive).toBe(false);
    expect(marker.toneClass).toContain("yellow");
    expect(marker.title).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds safe CSS motion tracks so the 2D scene feels alive without a renderer", () => {
    const avatarMotion = buildOfficeSceneMotionTrack({
      id: "sessions-avatar-1",
      roomId: "sessions",
      kind: "avatar",
      label: "세션 표시 1",
      detail: "entry 안전 표시",
      health: "ok",
      x: 17,
      y: 22,
    });
    const machineMotion = buildOfficeSceneMotionTrack({
      id: "automation-machine-1",
      roomId: "automation",
      kind: "machine",
      label: "자동화 기계 1",
      detail: "machine 안전 표시",
      health: "partial",
      x: 17,
      y: 58,
    });

    expect(avatarMotion).toMatchObject({
      className: "office-scene-marker-motion office-scene-marker-walk",
      ariaLabel: "세션 표시 1 이동 표시 · 안전 DTO 기반",
    });
    expect(avatarMotion.style).toMatchObject({
      "--office-motion-x": "3px",
      "--office-motion-y": "-2px",
      "--office-motion-duration": "4.8s",
      "--office-motion-delay": "-0.3s",
    });
    expect(machineMotion.className).toBe("office-scene-marker-motion office-scene-marker-blink");
    expect(machineMotion.ariaLabel).toBe("자동화 기계 1 상태등 표시 · 안전 DTO 기반");
    expect(`${avatarMotion.ariaLabel} ${Object.values(avatarMotion.style).join(" ")} ${machineMotion.ariaLabel}`).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds safe RPG role characters for models and office work without raw projection", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 2 },
        { id: "kanban", status: "partial", checked_at: "2026-05-09T00:00:00Z", item_count: 4 },
        { id: "cron", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 1 },
        { id: "topics", status: "missing", checked_at: "2026-05-09T00:00:00Z", item_count: 0 },
      ],
      agents: [
        { id: "agent-1", model: "safe-model", status: "active", prompt: "raw prompt must not matter" },
        { id: "agent-2", provider: "safe-provider", status: "idle", transcript: "raw transcript must not matter" },
      ],
      work_items: Array.from({ length: 4 }, (_, index) => ({ id: `task-${index}`, title: "Safe task", status: index === 0 ? "blocked" : "open", body: "raw task body must not matter" })),
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", next_run_at: "2026-05-09T01:00:00Z", script: "raw script must not matter" }],
      topics: [],
      provenance: [],
    });
    const characters = buildOfficeCharacters(state, buildOfficeMapNodes(state));

    expect(characters.map((character) => character.role)).toEqual(expect.arrayContaining(["model", "worker", "automation_keeper", "router", "sentinel", "alert"]));
    expect(characters.find((character) => character.role === "model")?.label).toBe("모델 캐릭터 1");
    expect(characters.find((character) => character.role === "worker")?.label).toBe("작업자 1");
    expect(characters.find((character) => character.role === "automation_keeper")?.label).toBe("자동화 관리인 1");
    expect(characters.find((character) => character.role === "router")?.label).toBe("전달자 1");
    expect(characters.find((character) => character.role === "sentinel")?.label).toBe("감시자 1");
    expect(characters.find((character) => character.role === "alert")?.status).toBe("blocked");
    expect(characters.every((character) => character.roomId && character.status && character.redactionNote && character.x >= 10 && character.x <= 90 && character.y >= 12 && character.y <= 88)).toBe(true);
    expect(characters.map((character) => `${character.label} ${character.detail} ${character.redactionNote}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|safe-model|safe-provider/i);
  });

  it("builds original CSS character views for each RPG role without raw labels", () => {
    const roles = ["model", "operator", "worker", "reviewer", "automation_keeper", "router", "sentinel", "alert"] as const;
    const views = roles.map((role, index) =>
      buildOfficeCharacterView({
        id: `${role}-1`,
        role,
        roomId: role === "automation_keeper" ? "automation" : role === "router" || role === "sentinel" ? "routing" : role === "model" || role === "operator" ? "sessions" : "work",
        label: `raw ${role} model prompt ${index}`,
        status: role === "alert" ? "blocked" : role === "reviewer" ? "reviewing" : role === "router" ? "routing" : role === "automation_keeper" ? "scheduled" : "active",
        detail: "raw transcript body script secret must not matter",
        redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
        x: 20,
        y: 20,
      }),
    );

    expect(views.map((view) => view.nameplate)).toEqual(["모델", "조작", "작업", "검토", "자동화", "전달", "감시", "경보"]);
    expect(views.every((view) => view.bodyClassName.startsWith("office-character office-character--"))).toBe(true);
    expect(views.every((view) => view.accessoryClassName.startsWith("office-character__accessory office-character__accessory--"))).toBe(true);
    expect(views.map((view) => view.statusLabel)).toEqual(["활성", "활성", "활성", "검토", "예약", "전달", "활성", "막힘"]);
    expect(views.map((view) => `${view.glyph} ${view.nameplate} ${view.statusLabel} ${view.safeTitle} ${view.bodyClassName} ${view.accessoryClassName}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|model prompt/i);
  });

  it("builds safe action loops for RPG characters from status and room delta only", () => {
    const emptyDelta = buildOfficeStateDelta(null, officeFixture());
    const changedDelta = {
      ...emptyDelta,
      nodeBadges: {
        ...emptyDelta.nodeBadges,
        automation: [{ label: "일정 변경", tone: "warning" as const }],
        routing: [{ label: "상태 변경", tone: "warning" as const }],
      },
    };
    const base = {
      id: "character-1",
      roomId: "sessions" as const,
      label: "raw prompt transcript body script secret must not matter",
      detail: "raw model provider task body must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    };

    const activities = [
      buildOfficeCharacterActivity({ ...base, role: "model", status: "active" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "worker", roomId: "work", status: "working" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "reviewer", roomId: "work", status: "reviewing" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "router", roomId: "routing", status: "routing" }, changedDelta),
      buildOfficeCharacterActivity({ ...base, role: "automation_keeper", roomId: "automation", status: "scheduled" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "automation_keeper", roomId: "automation", status: "scheduled" }, changedDelta),
      buildOfficeCharacterActivity({ ...base, role: "alert", roomId: "work", status: "blocked" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "sentinel", roomId: "routing", status: "warning" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "sentinel", roomId: "routing", status: "unknown" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "operator", status: "idle" }, emptyDelta),
    ];

    expect(activities.map((activity) => activity.id)).toEqual(["thinking", "working", "reviewing", "routing", "scheduled", "soon", "blocked", "warning", "unknown", "idle"]);
    expect(activities.map((activity) => activity.label)).toEqual(["생각 중", "작업 중", "검토 중", "전달 중", "예약 대기", "곧 실행", "막힘", "확인 필요", "확인 불가", "대기"]);
    expect(activities.map((activity) => activity.tone)).toEqual(["normal", "success", "success", "normal", "muted", "warning", "danger", "warning", "muted", "muted"]);
    expect(activities.map((activity) => activity.motion)).toEqual(["idle", "pulse", "idle", "walk", "idle", "blink", "blink", "blink", "none", "none"]);
    expect(activities.map((activity) => `${activity.id} ${activity.label} ${activity.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|model|provider/i);
  });

  it("builds safe room-to-room RPG routes from changed flows only", () => {
    const delta = {
      ...buildOfficeStateDelta(null, officeFixture()),
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "세션에서 작업으로", tone: "positive" as const },
        { from: "work" as const, to: "automation" as const, label: "raw prompt transcript body script secret must not matter", tone: "warning" as const },
        { from: "automation" as const, to: "routing" as const, label: "자동화에서 라우팅으로", tone: "negative" as const },
      ],
    };

    const routes = buildOfficeCharacterRoutes(delta);

    expect(routes.map((route) => route.id)).toEqual([
      "route:sessions->work",
      "route:work->automation",
      "route:automation->routing",
    ]);
    expect(routes.map((route) => route.label)).toEqual(["흐름 변경", "흐름 변경", "흐름 변경"]);
    expect(routes.map((route) => route.detail)).toEqual([
      "세션에서 작업으로 · 방금 변경",
      "작업에서 자동화로 · 방금 변경",
      "자동화에서 라우팅으로 · 방금 변경",
    ]);
    expect(routes.map((route) => route.motion)).toEqual(["route", "alert", "alert"]);
    expect(routes.map((route) => route.tone)).toEqual(["normal", "warning", "danger"]);
    expect(routes.map((route) => `${route.label} ${route.detail} ${route.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds safe character inspector fields for keyboard-accessible RPG character inspection", () => {
    const delta = {
      ...buildOfficeStateDelta(null, officeFixture()),
      nodeBadges: {
        sessions: [{ label: "+2", tone: "positive" as const }],
        work: [],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw prompt transcript body script secret must not matter", tone: "warning" as const }],
    };
    const character = {
      id: "model-1",
      role: "model" as const,
      roomId: "sessions" as const,
      label: "raw model provider prompt must not matter",
      status: "active" as const,
      detail: "raw transcript body script secret must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    };

    const inspector = buildOfficeCharacterInspector(character, delta);

    expect(inspector.kind).toBe("RPG 캐릭터");
    expect(inspector.title).toBe("세션 · 모델 캐릭터");
    expect(inspector.ariaLabel).toBe("모델 캐릭터 살펴보기, 방 세션, 상태 활성, 액션 생각 중");
    expect(inspector.fields).toEqual([
      ["캐릭터", "모델 캐릭터"],
      ["역할", "모델"],
      ["방", "세션"],
      ["상태", "활성"],
      ["액션", "생각 중"],
      ["최근 안전 변화", "+2 · 세션에서 작업으로 · 방금 변경"],
      ["가림", "안전 DTO 역할/상태/개수/흐름만 반영 · 원문 제외"],
    ]);
    expect(`${inspector.title} ${inspector.ariaLabel} ${inspector.fields.flat().join(" ")}`).not.toMatch(/raw|prompt|transcript|body|script|secret|model provider/i);
  });

  it("builds safe Stage 16-A tracking truth and selected-character focus copy", () => {
    const delta = {
      ...buildOfficeStateDelta(null, officeFixture()),
      nodeBadges: {
        sessions: [{ label: "+2", tone: "positive" as const }],
        work: [],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw prompt transcript body script secret must not matter", tone: "warning" as const }],
    };
    const character = {
      id: "model-1",
      role: "model" as const,
      roomId: "sessions" as const,
      label: "raw model provider prompt must not matter",
      status: "active" as const,
      detail: "raw transcript body script secret must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    };

    const truth = buildOfficeTrackingTruthPlan(delta, { hasEventStream: false, visibleCharacterCount: 12 });
    const focus = buildOfficeSelectedCharacterFocus(character, delta);

    expect(truth.stageLabel).toBe("Stage 16-A tracking truth");
    expect(truth.mode).toBe("snapshot-delta");
    expect(truth.label).toBe("스냅샷 변화 기반");
    expect(truth.detail).toBe("캐릭터 12개 · 최근 안전 변화 2개 · 실시간 이벤트 스트림 없음");
    expect(truth.caveats).toEqual(["움직임은 CSS 장식입니다", "실제 작업 추적은 안전 이벤트 스트림 승인 후 분리 구현"]);
    expect(focus).toEqual({
      selectedCharacterId: "model-1",
      title: "모델 캐릭터 선택됨",
      summary: "세션 · 활성 · 생각 중",
      roomLabel: "세션",
      actionLabel: "생각 중",
      highlightSelector: '[data-office-character-id="model-1"]',
      fields: [
        ["역할", "모델"],
        ["방", "세션"],
        ["상태", "활성"],
        ["액션", "생각 중"],
        ["추적", "스냅샷 변화 기반 · 원문 제외"],
      ],
    });
    expect(`${truth.label} ${truth.detail} ${truth.caveats.join(" ")} ${focus.title} ${focus.summary} ${focus.fields.flat().join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|body|script|secret|token|provider|model provider|sk-/i);
  });

  it("builds safe Stage 16-B event substrate and motion commands", () => {
    const delta = {
      ...buildOfficeStateDelta(null, officeFixture()),
      nodeBadges: {
        sessions: [{ label: "raw prompt +3 token must not matter", tone: "positive" as const }],
        work: [{ label: "raw task_body warning secret must not matter", tone: "warning" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw transcript script provider must not matter", tone: "warning" as const }],
    };

    const substrate = buildOfficeSafeEventSubstrate(delta, { visibleCharacterCount: 11, hasEventStream: false });
    const commands = buildOfficeSafeMotionCommands(substrate.events);

    expect(substrate.stageLabel).toBe("Stage 16-B safe event substrate");
    expect(substrate.mode).toBe("projected-events");
    expect(substrate.summary).toBe("안전 이벤트 4개 · snapshot/delta 투영");
    expect(substrate.events.map((event) => event.category)).toEqual(["room_density_changed", "room_density_changed", "flow_changed", "attention_changed"]);
    expect(substrate.events.map((event) => event.roomId)).toEqual(["sessions", "work", "sessions", "work"]);
    expect(substrate.events.every((event) => event.redacted && event.safeLabel.length > 0 && event.rawSource === false)).toBe(true);
    expect(commands.map((command) => command.kind)).toEqual(["pulse-room", "pulse-room", "route-lane", "attention-spark"]);
    expect(commands.find((command) => command.kind === "route-lane")?.lane).toBe("sessions-work");
    expect(`${substrate.summary} ${substrate.events.map((event) => `${event.safeLabel} ${event.detail}`).join(" ")} ${commands.map((command) => `${command.label} ${command.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|body|script|secret|token|provider|model|api_key|password|sk-/i);
  });

  it("keeps Stage 16-B first snapshot static without fabricated movement", () => {
    const substrate = buildOfficeSafeEventSubstrate(buildOfficeStateDelta(null, officeFixture()), { visibleCharacterCount: 11, hasEventStream: false });
    const commands = buildOfficeSafeMotionCommands(substrate.events);

    expect(substrate.mode).toBe("static-posture");
    expect(substrate.events).toEqual([
      expect.objectContaining({
        category: "snapshot_static",
        roomId: "sessions",
        tone: "neutral",
        count: 11,
        safeLabel: "정적 안전 스냅샷",
        redacted: true,
        rawSource: false,
      }),
    ]);
    expect(commands).toEqual([
      expect.objectContaining({
        kind: "idle-glow",
        roomId: "sessions",
        label: "대기 광원",
      }),
    ]);
  });

  it("builds safe Stage 16-C stream posture from backend events with local fallback", () => {
    const local = buildOfficeSafeEventSubstrate(buildOfficeStateDelta(null, officeFixture()), { visibleCharacterCount: 11, hasEventStream: false });
    const loaded = buildOfficeSafeStreamPosture({
      status: "loaded",
      events: [
        {
          id: "backend-1",
          category: "source_health_changed",
          room_id: "routing",
          tone: "warning",
          count: 2,
          generated_at: "2026-05-10T00:00:00Z",
          redacted: true,
          raw_label: "raw prompt provider model token must not leak",
        },
      ],
      generated_at: "2026-05-10T00:00:00Z",
    }, local);
    const unavailable = buildOfficeSafeStreamPosture({ status: "unavailable", events: [], error: "raw transcript secret token" }, local);

    expect(loaded.mode).toBe("backend-safe-stream");
    expect(loaded.label).toBe("백엔드 안전 이벤트 연결");
    expect(loaded.events.map((event) => event.category)).toEqual(["source_health_changed"]);
    expect(loaded.events[0]).toEqual(expect.objectContaining({ roomId: "routing", tone: "warning", count: 2, rawSource: false, redacted: true }));
    expect(unavailable.mode).toBe("local-fallback");
    expect(unavailable.events.map((event) => event.category)).toEqual(["snapshot_static"]);
    expect(`${loaded.summary} ${loaded.events[0].safeLabel} ${loaded.events[0].detail} ${unavailable.summary}`).not.toMatch(/raw|prompt|transcript|secret|token|provider|model|api_key|password|sk-/i);
  });

  it("builds safe Stage 16-D motion heartbeat from safe stream posture", () => {
    const local = buildOfficeSafeEventSubstrate(buildOfficeStateDelta(null, officeFixture()), { visibleCharacterCount: 11, hasEventStream: false });
    const stream = buildOfficeSafeStreamPosture({
      status: "loaded",
      events: [
        { id: "event-1", category: "workload_changed", room_id: "work", tone: "negative", count: 4, generated_at: "2026-05-10T00:00:00Z", redacted: true },
        { id: "event-2", category: "source_health_changed", room_id: "routing", tone: "warning", count: 2, generated_at: "2026-05-10T00:00:00Z", redacted: true },
      ],
      generated_at: "2026-05-10T00:00:00Z",
    }, local);

    const heartbeat = buildOfficeSafeMotionHeartbeat(stream, { pollStatus: "active", tick: 7, failureCount: 0, reducedMotion: false });
    const reduced = buildOfficeSafeMotionHeartbeat(stream, { pollStatus: "active", tick: 8, failureCount: 0, reducedMotion: true });
    const fallback = buildOfficeSafeMotionHeartbeat(local, { pollStatus: "unavailable", tick: 0, failureCount: 2, reducedMotion: false });

    expect(heartbeat.stageLabel).toBe("Stage 16-D 안전 motion heartbeat");
    expect(heartbeat.mode).toBe("safe-polling");
    expect(heartbeat.phase).toBe("pulse");
    expect(heartbeat.intensity).toBe("high");
    expect(heartbeat.items.map((item) => item.id)).toEqual(["stream", "cadence", "motion"]);
    expect(heartbeat.items[0].detail).toContain("백엔드 안전 이벤트");
    expect(reduced.motionEnabled).toBe(false);
    expect(fallback.mode).toBe("local-fallback");
    expect(fallback.intensity).toBe("low");
    expect(`${heartbeat.summary} ${heartbeat.items.map((item) => item.detail).join(" ")} ${fallback.summary}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|api_key|password|sk-/i);
  });

  it("builds safe Stage 16-E spatial choreography from heartbeat events", () => {
    const local = buildOfficeSafeEventSubstrate(buildOfficeStateDelta(null, officeFixture()), { visibleCharacterCount: 11, hasEventStream: false });
    const stream = buildOfficeSafeStreamPosture({
      status: "loaded",
      events: [
        { id: "event-1", category: "workload_changed", room_id: "work", tone: "negative", count: 4, generated_at: "2026-05-10T00:00:00Z", redacted: true },
        { id: "event-2", category: "flow_changed", room_id: "work", to_room_id: "automation", tone: "warning", count: 1, generated_at: "2026-05-10T00:00:00Z", redacted: true },
        { id: "event-3", category: "source_health_changed", room_id: "routing", tone: "warning", count: 2, generated_at: "2026-05-10T00:00:00Z", redacted: true, detail: "raw provider token must not leak" },
      ],
      generated_at: "2026-05-10T00:00:00Z",
    }, local);
    const heartbeat = buildOfficeSafeMotionHeartbeat(stream, { pollStatus: "active", tick: 9, failureCount: 0, reducedMotion: false });

    const choreography = buildOfficeSafeSpatialChoreography(stream.events, heartbeat);

    expect(choreography.stageLabel).toBe("Stage 16-E 안전 spatial choreography");
    expect(choreography.mode).toBe("safe-spatial-motion");
    expect(choreography.items.map((item) => item.kind)).toEqual(["room-pulse", "route-sweep", "room-pulse"]);
    expect(choreography.items[0]).toEqual(expect.objectContaining({ roomId: "work", x: 70, y: 30, intensity: "high", interactive: false, ariaHidden: true }));
    expect(choreography.items[1]).toEqual(expect.objectContaining({ roomId: "work", toRoomId: "automation", x: 70, y: 30, x2: 24, y2: 67 }));
    expect(`${choreography.summary} ${choreography.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|api_key|password|sk-/i);
  });

  it("builds Stage 10-F usability summary for dense, missing-source, reduced-motion, and responsive states", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 8 },
        { id: "kanban", status: "partial", checked_at: "2026-05-09T00:00:00Z", item_count: 8, warning_count: 1, error_summary: "raw stack secret must not matter" },
        { id: "cron", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 5 },
      ],
      agents: Array.from({ length: 8 }, (_, index) => ({ id: `agent-${index}`, status: "active", prompt: "raw prompt must not matter" })),
      work_items: Array.from({ length: 8 }, (_, index) => ({ id: `task-${index}`, title: "Safe task", status: index === 0 ? "blocked" : "open", body: "raw body must not matter" })),
      automations: Array.from({ length: 5 }, (_, index) => ({ id: `job-${index}`, state: "scheduled", script: "raw script must not matter" })),
      topics: [],
      provenance: [],
    });
    const nodes = buildOfficeMapNodes(state);
    const characters = buildOfficeCharacters(state, nodes);

    const summary = buildOfficeUsabilitySummary(state, characters, { reducedMotion: true, viewportWidth: 430 });

    expect(summary.items.map((item) => item.id)).toEqual(["density", "source-fallback", "motion", "responsive", "korean-copy"]);
    expect(summary.items.map((item) => item.label)).toEqual(["밀도 점검", "소스 공백", "동작 모드", "좁은 화면", "한국어 우선"]);
    expect(summary.items.find((item) => item.id === "density")?.detail).toContain("합산 캐릭터");
    expect(summary.items.find((item) => item.id === "source-fallback")?.detail).toContain("미연결/부분 연결");
    expect(summary.items.find((item) => item.id === "motion")?.detail).toContain("정지");
    expect(summary.items.find((item) => item.id === "responsive")?.detail).toContain("세로");
    expect(summary.items.every((item) => item.detail.length > 0 && item.tone)).toBe(true);
    expect(summary.items.map((item) => `${item.label} ${item.detail}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|stack/i);
  });

  it("builds Stage 10-G safe readability density plans without exposing raw character details", () => {
    const characters = Array.from({ length: 14 }, (_, index) => ({
      id: `character-${index}`,
      role: "model" as const,
      roomId: "sessions" as const,
      label: index === 13 ? "raw prompt transcript secret must not matter" : `모델 캐릭터 ${index + 1}`,
      status: "active" as const,
      detail: "raw task body script must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    }));

    const summary = buildOfficeMapDensityPlan("summary", characters);
    const standard = buildOfficeMapDensityPlan("standard", characters);
    const detail = buildOfficeMapDensityPlan("detail", characters);

    expect([summary.label, standard.label, detail.label]).toEqual(["요약", "표준", "상세"]);
    expect(summary.visibleCharacters).toHaveLength(6);
    expect(standard.visibleCharacters).toHaveLength(12);
    expect(detail.visibleCharacters).toHaveLength(14);
    expect(summary.hiddenCharacterCount).toBe(8);
    expect(standard.hiddenCharacterCount).toBe(2);
    expect(detail.hiddenCharacterCount).toBe(0);
    expect(summary.showUsabilityRail).toBe(true);
    expect(summary.showRecentRail).toBe(false);
    expect(standard.showRecentRail).toBe(true);
    expect(detail.showRecentRail).toBe(true);
    expect(`${summary.label} ${summary.detail} ${summary.visibleCharacters.map((character) => character.label).join(" ")}`).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds Stage 11-B CSS/SVG polish plans for crowded labels and lower rails", () => {
    const characters = Array.from({ length: 14 }, (_, index) => ({
      id: `character-${index}`,
      role: "automation_keeper" as const,
      roomId: index < 8 ? ("automation" as const) : ("sessions" as const),
      label: index === 13 ? "raw prompt transcript secret must not matter" : `자동화 관리인 ${index + 1}`,
      status: index % 3 === 0 ? ("scheduled" as const) : ("active" as const),
      detail: "raw task body script must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    }));

    const standardPlan = buildOfficeMapDensityPlan("standard", characters);
    const summaryPlan = buildOfficeMapDensityPlan("summary", characters);
    const standardPolish = buildOfficeMapPolishPlan(standardPlan);
    const summaryPolish = buildOfficeMapPolishPlan(summaryPlan);

    expect(standardPolish).toMatchObject({
      stageLabel: "Stage 11-B 정돈",
      characterLabelMode: "compact",
      lowerRailMode: "detached",
      mapClassName: "office-map--polished office-map--labels-compact office-map--rail-detached",
      legendClassName: "office-map-legend office-map-legend--detached",
    });
    expect(standardPolish.notes).toEqual(expect.arrayContaining(["캐릭터 이름표는 역할 중심으로 압축", "하단 rail은 맵 바닥과 분리"]));
    expect(summaryPolish.characterLabelMode).toBe("minimal");
    expect(summaryPolish.lowerRailMode).toBe("detached");
    expect(`${standardPolish.stageLabel} ${standardPolish.notes.join(" ")} ${standardPolish.mapClassName}`).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds Stage 12-A responsive readability plans from viewport width only", () => {
    const characters = Array.from({ length: 12 }, (_, index) => ({
      id: `character-${index}`,
      role: "model" as const,
      roomId: "sessions" as const,
      label: index === 11 ? "raw prompt transcript secret must not matter" : `모델 캐릭터 ${index + 1}`,
      status: "active" as const,
      detail: "raw task body script must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    }));

    const standardPlan = buildOfficeMapDensityPlan("standard", characters);
    const narrow = buildOfficeResponsiveReadabilityPlan(standardPlan, { viewportWidth: 430 });
    const tablet = buildOfficeResponsiveReadabilityPlan(standardPlan, { viewportWidth: 820 });
    const desktop = buildOfficeResponsiveReadabilityPlan(standardPlan, { viewportWidth: 1280 });

    expect(narrow).toMatchObject({
      stageLabel: "Stage 12-A 반응형",
      viewportMode: "narrow",
      recommendedDensityMode: "summary",
      mapClassName: "office-map--responsive office-map--mobile-readable",
      railClassName: "office-map-rail--mobile-stack",
    });
    expect(narrow.notes).toEqual(expect.arrayContaining(["좁은 화면에서는 요약 모드 권장", "맵 rail은 세로 흐름으로 읽힘"]));
    expect(tablet).toMatchObject({
      viewportMode: "tablet",
      recommendedDensityMode: "standard",
      mapClassName: "office-map--responsive office-map--tablet-readable",
      railClassName: "office-map-rail--tablet-stack",
    });
    expect(tablet.notes).toEqual(expect.arrayContaining(["태블릿 화면에서는 표준 모드 권장", "rail은 접힘 없이 세로 보조 영역으로 읽힘"]));
    expect(desktop.viewportMode).toBe("desktop");
    expect(desktop.recommendedDensityMode).toBe("standard");
    expect(`${narrow.stageLabel} ${narrow.notes.join(" ")} ${narrow.mapClassName}`).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds Stage 10-H keyboard jump targets with density-aware recent rail labels", () => {
    const characters = Array.from({ length: 9 }, (_, index) => ({
      id: `character-${index}`,
      role: "worker" as const,
      roomId: "work" as const,
      label: index === 8 ? "raw prompt transcript secret must not matter" : `작업자 ${index + 1}`,
      status: "working" as const,
      detail: "raw task body script must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    }));

    const standardTargets = buildOfficeMapJumpTargets(buildOfficeMapDensityPlan("standard", characters));
    const summaryTargets = buildOfficeMapJumpTargets(buildOfficeMapDensityPlan("summary", characters));

    expect(standardTargets.map((target) => [target.id, target.label, target.targetId, target.enabled])).toEqual([
      ["map", "지도", "office-map-canvas", true],
      ["usability", "사용성", "office-map-usability", true],
      ["recent", "최근 변화", "office-map-recent", true],
      ["inspector", "안전 정보", "office-safe-inspector", true],
    ]);
    expect(summaryTargets.find((target) => target.id === "recent")).toMatchObject({
      label: "최근 변화 접힘",
      targetId: "office-map-recent-collapsed",
      enabled: true,
    });
    expect(summaryTargets.map((target) => `${target.label} ${target.detail} ${target.targetId}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("adapts safe RPG characters into current scene markers without exposing raw data", () => {
    const characters = buildOfficeCharacters(
      officeFixture({
        data_sources: [
          { id: "sessions", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 1 },
          { id: "cron", status: "partial", checked_at: "2026-05-09T00:00:00Z", item_count: 1 },
        ],
        agents: [{ id: "agent-1", model: "raw-model-name must not matter", status: "active", prompt: "raw prompt must not matter" }],
        automations: [{ id: "job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" }],
      }),
      buildOfficeMapNodes(officeFixture()),
    );

    const sceneObjects = buildOfficeCharacterSceneObjects(characters);

    expect(sceneObjects.map((object) => object.kind)).toEqual(expect.arrayContaining(["avatar", "machine"]));
    expect(sceneObjects.find((object) => object.kind === "avatar")?.label).toBe("모델 캐릭터 1");
    expect(sceneObjects.every((object) => object.id.startsWith("character:"))).toBe(true);
    expect(sceneObjects.map((object) => `${object.label} ${object.detail}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|model-name/i);
  });

  it("builds safe Stage 14-A character tracking cues from visible characters and delta only", () => {
    const characters = [
      {
        id: "model-1",
        role: "model" as const,
        roomId: "sessions" as const,
        label: "raw prompt transcript model-name must not matter",
        status: "active" as const,
        detail: "raw task body script secret must not matter",
        redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
        x: 22,
        y: 24,
      },
      {
        id: "worker-1",
        role: "worker" as const,
        roomId: "work" as const,
        label: "작업자 1",
        status: "working" as const,
        detail: "safe detail",
        redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
        x: 68,
        y: 24,
      },
      {
        id: "automation-1",
        role: "automation_keeper" as const,
        roomId: "automation" as const,
        label: "자동화 관리인 1",
        status: "scheduled" as const,
        detail: "safe detail",
        redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
        x: 24,
        y: 68,
      },
    ];
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [],
        work: [{ label: "상태 변경", tone: "warning" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw prompt transcript must not matter", tone: "warning" as const }],
      recentChanges: [],
    };

    const cues = buildOfficeCharacterTrackingCues(characters, delta);

    expect(cues).toHaveLength(3);
    expect(cues.map((cue) => [cue.characterId, cue.label, cue.tone])).toEqual([
      ["model-1", "변화 감지", "alert"],
      ["worker-1", "변화 감지", "alert"],
      ["automation-1", "자동화 감시", "steady"],
    ]);
    expect(cues[0].style["--office-tracking-x"]).toMatch(/px$/);
    expect(cues[0].style["--office-tracking-delay"]).toMatch(/s$/);
    expect(cues.every((cue) => cue.ariaHidden === true && cue.interactive === false)).toBe(true);
    expect(cues.map((cue) => `${cue.label} ${cue.detail} ${cue.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|model-name/i);
  });

  it("builds safe Stage 14-B room activity meters from room counts, characters, and delta", () => {
    const nodes = buildOfficeMapNodes(
      officeFixture({
        agents: Array.from({ length: 5 }, (_, index) => ({ id: `agent-${index}`, prompt: "raw prompt must not matter" })),
        work_items: [{ id: "task-raw", title: "raw task body must not matter", body: "raw body must not matter" }],
        automations: [],
        topics: [],
        provenance: [],
      }),
    );
    const characters = [
      { id: "model-1", role: "model" as const, roomId: "sessions" as const, label: "raw model", status: "active" as const, detail: "raw prompt", redactionNote: "safe", x: 20, y: 20 },
      { id: "worker-1", role: "worker" as const, roomId: "work" as const, label: "작업자", status: "working" as const, detail: "safe", redactionNote: "safe", x: 60, y: 20 },
      { id: "worker-2", role: "worker" as const, roomId: "work" as const, label: "작업자", status: "working" as const, detail: "safe", redactionNote: "safe", x: 64, y: 20 },
    ];
    const delta = {
      hasChanges: true,
      nodeBadges: { sessions: [], work: [{ label: "+1", tone: "positive" as const }], automation: [], routing: [] },
      changedFlows: [{ from: "work" as const, to: "automation" as const, label: "raw transcript must not matter", tone: "positive" as const }],
      recentChanges: [],
    };

    const meters = buildOfficeRoomActivityMeters(nodes, characters, delta);

    expect(meters.map((meter) => [meter.roomId, meter.label, meter.level])).toEqual([
      ["sessions", "분주함", "busy"],
      ["work", "변화 감지", "changed"],
      ["automation", "변화 감지", "changed"],
      ["routing", "조용함", "quiet"],
    ]);
    expect(meters.every((meter) => meter.ariaHidden === true && meter.interactive === false)).toBe(true);
    expect(meters[0].detail).toContain("안전 항목 5개");
    expect(meters.map((meter) => `${meter.label} ${meter.detail} ${meter.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|model/i);
  });

  it("builds safe Stage 14-C pulse timeline from recent safe deltas", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: { sessions: [{ label: "+2", tone: "positive" as const }], work: [], automation: [], routing: [] },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw prompt transcript body script secret must not matter", tone: "warning" as const }],
      recentChanges: [
        { id: "change-1", label: "세션 +2", detail: "raw transcript must not matter", tone: "positive" as const },
        { id: "change-2", label: "자동화 상태", detail: "raw script secret must not matter", tone: "warning" as const },
      ],
    };

    const timeline = buildOfficeSafePulseTimeline(delta);

    expect(timeline.stageLabel).toBe("Stage 14-C 안전 pulse timeline");
    expect(timeline.items.map((item) => [item.kind, item.label, item.tone])).toEqual([
      ["room", "세션 변화", "positive"],
      ["flow", "세션 → 작업", "warning"],
      ["recent", "최근 안전 변화 1", "positive"],
      ["recent", "최근 안전 변화 2", "warning"],
    ]);
    expect(timeline.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(timeline.items.map((item) => `${item.label} ${item.detail} ${item.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|token|sk-/i);
  });

  it("builds safe Stage 14-D breadcrumb trail from changed flows", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: { sessions: [], work: [], automation: [], routing: [] },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw prompt must not matter", tone: "positive" as const },
        { from: "work" as const, to: "automation" as const, label: "raw task_body script must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-secret", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const trail = buildOfficeSafeBreadcrumbTrail(delta);

    expect(trail.stageLabel).toBe("Stage 14-D 안전 breadcrumb");
    expect(trail.segments.map((segment) => [segment.label, segment.detail, segment.tone])).toEqual([
      ["세션", "출발 방 · 안전 흐름 변화", "positive"],
      ["작업", "경유 방 · 안전 흐름 변화", "warning"],
      ["자동화", "도착 방 · 안전 흐름 변화", "warning"],
    ]);
    expect(trail.segments.every((segment) => segment.ariaHidden === true && segment.interactive === false)).toBe(true);
    expect(trail.segments.map((segment) => `${segment.label} ${segment.detail}`).join(" ")).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|sk-/i);
  });

  it("builds safe Stage 14-E route compass from safe deltas", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: { sessions: [], work: [], automation: [{ label: "raw model provider", tone: "warning" as const }], routing: [] },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw prompt transcript must not matter", tone: "positive" as const },
        { from: "work" as const, to: "automation" as const, label: "raw script secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const compass = buildOfficeSafeRouteCompass(delta);

    expect(compass.stageLabel).toBe("Stage 14-E 안전 route compass");
    expect(compass.heading).toBe("주의 집중");
    expect(compass.points.map((point) => [point.label, point.detail, point.tone])).toEqual([
      ["방향", "세션 → 자동화", "negative"],
      ["신호", "감소 우선", "negative"],
      ["요약", "안전 변화 4개 · 방 3개", "neutral"],
    ]);
    expect(compass.points.every((point) => point.ariaHidden === true && point.interactive === false)).toBe(true);
    expect(`${compass.heading} ${compass.detail} ${compass.points.map((point) => `${point.label} ${point.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-F focus lane from safe delta density", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [{ label: "raw script", tone: "warning" as const }],
        routing: [],
      },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw transcript must not matter", tone: "negative" as const },
        { from: "work" as const, to: "automation" as const, label: "raw secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const lane = buildOfficeSafeFocusLane(delta);

    expect(lane.stageLabel).toBe("Stage 14-F 안전 focus lane");
    expect(lane.items.map((item) => [item.roomId, item.label, item.detail, item.tone, item.weight])).toEqual([
      ["work", "작업", "주의 변화 2개 · 흐름 2개", "negative", 4],
      ["automation", "자동화", "확인 변화 1개 · 흐름 1개", "warning", 2],
      ["sessions", "세션", "정상 변화 1개 · 흐름 1개", "positive", 2],
      ["routing", "라우팅", "대기 변화 0개 · 흐름 0개", "neutral", 0],
    ]);
    expect(lane.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${lane.stageLabel} ${lane.detail} ${lane.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-G attention strip from safe focus density", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [{ label: "raw script", tone: "warning" as const }],
        routing: [],
      },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw transcript must not matter", tone: "negative" as const },
        { from: "work" as const, to: "automation" as const, label: "raw secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const strip = buildOfficeSafeAttentionStrip(delta);

    expect(strip.stageLabel).toBe("Stage 14-G 안전 attention strip");
    expect(strip.heading).toBe("주의 방 우선");
    expect(strip.chips.map((chip) => [chip.id, chip.label, chip.detail, chip.tone])).toEqual([
      ["focus", "초점", "작업 · 밀도 4", "negative"],
      ["signal", "신호", "주의 우선", "negative"],
      ["scope", "범위", "방 3개 · 밀도 8", "neutral"],
    ]);
    expect(strip.chips.every((chip) => chip.ariaHidden === true && chip.interactive === false)).toBe(true);
    expect(`${strip.stageLabel} ${strip.heading} ${strip.detail} ${strip.chips.map((chip) => `${chip.label} ${chip.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-H room beacons from safe focus lane density", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [{ label: "raw script", tone: "warning" as const }],
        routing: [],
      },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw transcript must not matter", tone: "negative" as const },
        { from: "work" as const, to: "automation" as const, label: "raw secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const beacons = buildOfficeSafeRoomBeacons(delta);

    expect(beacons.stageLabel).toBe("Stage 14-H 안전 room beacons");
    expect(beacons.beacons.map((beacon) => [beacon.roomId, beacon.label, beacon.detail, beacon.tone, beacon.intensity, beacon.x, beacon.y])).toEqual([
      ["work", "작업 beacon", "주의 · 밀도 4 · 맵 표시", "negative", "high", 70, 30],
      ["automation", "자동화 beacon", "확인 · 밀도 2 · 맵 표시", "warning", "medium", 24, 67],
      ["sessions", "세션 beacon", "정상 · 밀도 2 · 맵 표시", "positive", "medium", 24, 30],
      ["routing", "라우팅 beacon", "대기 · 밀도 0 · 맵 표시", "neutral", "idle", 70, 67],
    ]);
    expect(beacons.beacons.every((beacon) => beacon.ariaHidden === true && beacon.interactive === false)).toBe(true);
    expect(beacons.beacons.map((beacon) => `${beacon.label} ${beacon.detail} ${beacon.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-I flow pulse bands from changed safe flows", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: { sessions: [], work: [], automation: [], routing: [] },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw prompt transcript", tone: "positive" as const },
        { from: "work" as const, to: "automation" as const, label: "raw script secret", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const bands = buildOfficeSafeFlowPulseBands(delta);

    expect(bands.stageLabel).toBe("Stage 14-I 안전 flow pulse bands");
    expect(bands.bands.map((band) => [band.id, band.label, band.detail, band.tone, band.intensity, band.x1, band.y1, band.x2, band.y2])).toEqual([
      ["sessions-to-work", "세션 → 작업 pulse", "정상 · 안전 흐름 1", "positive", "medium", 24, 30, 70, 30],
      ["work-to-automation", "작업 → 자동화 pulse", "확인 · 안전 흐름 2", "warning", "high", 70, 30, 24, 67],
    ]);
    expect(bands.bands.every((band) => band.ariaHidden === true && band.interactive === false)).toBe(true);
    expect(bands.bands.map((band) => `${band.label} ${band.detail} ${band.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-J tactical minimap from safe beacons and flow bands", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [{ label: "raw script", tone: "warning" as const }],
        routing: [],
      },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw transcript must not matter", tone: "negative" as const },
        { from: "work" as const, to: "automation" as const, label: "raw secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const minimap = buildOfficeSafeTacticalMinimap(delta);

    expect(minimap.stageLabel).toBe("Stage 14-J 안전 tactical minimap");
    expect(minimap.summary).toBe("활성 방 3개 · 흐름 2개");
    expect(minimap.cells.map((cell) => [cell.roomId, cell.label, cell.detail, cell.tone, cell.intensity, cell.active])).toEqual([
      ["sessions", "세션", "정상 · 밀도 2", "positive", "medium", true],
      ["work", "작업", "주의 · 밀도 4", "negative", "high", true],
      ["automation", "자동화", "확인 · 밀도 2", "warning", "medium", true],
      ["routing", "라우팅", "대기 · 밀도 0", "neutral", "idle", false],
    ]);
    expect(minimap.cells.every((cell) => cell.ariaHidden === true && cell.interactive === false)).toBe(true);
    expect(`${minimap.summary} ${minimap.cells.map((cell) => `${cell.label} ${cell.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-K tactical ticker from safe minimap and attention signals", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [{ label: "raw script", tone: "warning" as const }],
        routing: [],
      },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw transcript must not matter", tone: "negative" as const },
        { from: "work" as const, to: "automation" as const, label: "raw secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const ticker = buildOfficeSafeTacticalTicker(delta);

    expect(ticker.stageLabel).toBe("Stage 14-K 안전 tactical ticker");
    expect(ticker.headline).toBe("주의 방 우선 · 활성 방 3개 · 흐름 2개");
    expect(ticker.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["focus", "초점", "작업 · 밀도 4", "negative"],
      ["map", "전술", "활성 방 3개 · 흐름 2개", "neutral"],
      ["cells", "방", "세션 2 · 작업 4 · 자동화 2", "negative"],
    ]);
    expect(ticker.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${ticker.headline} ${ticker.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-L mission clock from browser-local posture only", () => {
    const clock = buildOfficeSafeMissionClock({
      liveTracking: true,
      isVisible: false,
      consecutiveFailures: 2,
      hasRecentChanges: true,
    });

    expect(clock.stageLabel).toBe("Stage 14-L 안전 mission clock");
    expect(clock.headline).toBe("실시간 · 숨김 탭 · 120초");
    expect(clock.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["mode", "모드", "실시간 추적", "positive"],
      ["cadence", "간격", "120초", "warning"],
      ["safety", "안전", "브라우저 로컬 · 읽기 전용", "neutral"],
      ["pulse", "변화", "최근 변화 있음", "positive"],
    ]);
    expect(clock.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${clock.headline} ${clock.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);

    const manual = buildOfficeSafeMissionClock({ liveTracking: false, isVisible: true, consecutiveFailures: 0, hasRecentChanges: false });
    expect(manual.headline).toBe("수동 · 표시 탭 · 대기");
    expect(manual.items.find((item) => item.id === "cadence")?.detail).toBe("수동 새로고침");
  });

  it("builds safe Stage 14-M command deck from mission clock, tactical ticker, and source health", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 2, warning_count: 0, error_summary: "raw provider must not matter" },
        { id: "kanban", status: "partial", checked_at: "2026-05-09T00:00:00Z", item_count: 1, warning_count: 2, error_summary: "raw token must not matter" },
      ],
    });
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw transcript", tone: "negative" as const }],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const deck = buildOfficeSafeCommandDeck(state, delta, { liveTracking: false, isVisible: true, consecutiveFailures: 0, hasRecentChanges: true });

    expect(deck.stageLabel).toBe("Stage 14-M 안전 command deck");
    expect(deck.headline).toBe("수동 · 표시 탭 · 대기 · 주의 필요");
    expect(deck.cards.map((card) => [card.id, card.label, card.detail, card.tone])).toEqual([
      ["mission", "작전 시계", "수동 · 표시 탭 · 대기", "neutral"],
      ["tactical", "전술 HUD", "주의 방 우선 · 활성 방 2개 · 흐름 1개", "negative"],
      ["sources", "소스", "정상 1 · 주의 1 · 공백/미연결 3 · 경고 2", "warning"],
      ["safety", "안전", "읽기 전용 · 로컬 표시 · 원문 제외", "neutral"],
    ]);
    expect(deck.cards.every((card) => card.ariaHidden === true && card.interactive === false)).toBe(true);
    expect(`${deck.headline} ${deck.cards.map((card) => `${card.label} ${card.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-N floor legend from safe minimap cells", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw prompt", tone: "positive" as const }],
        work: [{ label: "raw token", tone: "negative" as const }, { label: "raw transcript", tone: "warning" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw model", tone: "negative" as const }],
      recentChanges: [],
    };

    const legend = buildOfficeSafeFloorLegend(delta);

    expect(legend.stageLabel).toBe("Stage 14-N 안전 floor legend");
    expect(legend.summary).toBe("활성 2 · 대기 2 · 흐름 1");
    expect(legend.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["active", "활성 방", "세션 · 작업", "negative"],
      ["idle", "대기 방", "자동화 · 라우팅", "neutral"],
      ["flow", "흐름", "안전 흐름 1개", "negative"],
      ["safety", "투영", "집계 전용", "neutral"],
    ]);
    expect(legend.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${legend.summary} ${legend.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-O status snapshot from existing safe HUD helpers", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "kanban", status: "unavailable", checked_at: "2026-05-08T00:00:00Z", item_count: 0, warning_count: 1 },
      ],
    });
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw prompt", tone: "positive" as const }],
        work: [{ label: "raw task_body", tone: "negative" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw provider", tone: "negative" as const }],
      recentChanges: [],
    };

    const snapshot = buildOfficeSafeStatusSnapshot(state, delta, {
      liveTracking: false,
      isVisible: true,
      consecutiveFailures: 0,
      hasRecentChanges: true,
    });

    expect(snapshot.stageLabel).toBe("Stage 14-O 안전 status snapshot");
    expect(snapshot.headline).toBe("소스 주의 · 활성 2 · 대기 2 · 흐름 1");
    expect(snapshot.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["deck", "상태판", "수동 · 표시 탭 · 변화 감지", "warning"],
      ["floor", "바닥", "활성 2 · 대기 2 · 흐름 1", "negative"],
      ["source", "소스", "2개 중 1개 사용 가능", "warning"],
      ["guard", "가드", "읽기 전용 · 원문 제외", "neutral"],
    ]);
    expect(snapshot.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${snapshot.headline} ${snapshot.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-P scan index from status snapshot and safe rail count", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "kanban", status: "partial", checked_at: "2026-05-08T00:00:00Z", item_count: 1, warning_count: 1 },
      ],
    });
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw prompt", tone: "positive" as const }],
        work: [{ label: "raw token", tone: "negative" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "work" as const, to: "automation" as const, label: "raw provider", tone: "warning" as const }],
      recentChanges: [],
    };

    const index = buildOfficeSafeScanIndex(state, delta, {
      liveTracking: true,
      isVisible: true,
      consecutiveFailures: 0,
      hasRecentChanges: true,
    });

    expect(index.stageLabel).toBe("Stage 14-P 안전 scan index");
    expect(index.headline).toBe("스캔 4칸 · snapshot 기준");
    expect(index.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["snapshot", "스냅샷", "상태 snapshot 참조", "negative"],
      ["rail", "레일", "4개 안전 칸", "negative"],
      ["mode", "모드", "실시간 · 표시 탭", "positive"],
    ]);
    expect(index.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${index.headline} ${index.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-Q HUD readability plan from browser-local layout signals", () => {
    const plan = buildOfficeSafeHudReadabilityPlan({
      viewportWidth: 1120,
      prefersReducedMotion: true,
      safePanelCount: 6,
      liveTracking: true,
    });

    expect(plan.stageLabel).toBe("Stage 14-Q 안전 HUD readability");
    expect(plan.summary).toBe("넓은 HUD · 정적 모션 · 6개 패널");
    expect(plan.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["layout", "배치", "넓은 HUD", "positive"],
      ["motion", "모션", "정적 모션", "neutral"],
      ["density", "밀도", "6개 패널", "warning"],
      ["tracking", "추적", "실시간", "positive"],
    ]);
    expect(plan.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${plan.summary} ${plan.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 15-A HUD hierarchy from existing safe panels", () => {
    const hierarchy = buildOfficeSafeHudHierarchy({
      statusTone: "warning",
      scanTone: "neutral",
      readabilityTone: "warning",
      statusItemCount: 4,
      scanItemCount: 3,
      readabilityItemCount: 4,
    });

    expect(hierarchy.stageLabel).toBe("Stage 15-A 안전 HUD hierarchy");
    expect(hierarchy.headline).toBe("먼저 볼 순서 정리");
    expect(hierarchy.summary).toBe("핵심 4개 · 보조 3개 · 진단 4개");
    expect(hierarchy.sections.map((section) => [section.id, section.label, section.detail, section.tone])).toEqual([
      ["primary", "핵심", "상태 snapshot 먼저", "warning"],
      ["secondary", "보조", "scan index로 범위 확인", "neutral"],
      ["diagnostic", "진단", "HUD readability로 밀도 확인", "warning"],
    ]);
    expect(hierarchy.sections.every((section) => section.ariaHidden === true && section.interactive === false)).toBe(true);
    expect(`${hierarchy.headline} ${hierarchy.summary} ${hierarchy.sections.map((section) => `${section.label} ${section.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("reduces duplicate Stage 15-B scan copy while preserving safe ownership", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "cron", status: "partial", checked_at: "2026-05-08T00:00:00Z", item_count: 1, warning_count: 1 },
      ],
    });
    const delta = buildOfficeStateDelta(null, state);
    const index = buildOfficeSafeScanIndex(state, delta, {
      liveTracking: true,
      isVisible: true,
      consecutiveFailures: 0,
      hasRecentChanges: true,
    });

    expect(index.headline).toBe("스캔 4칸 · snapshot 기준");
    expect(index.items.find((item) => item.id === "snapshot")?.detail).toBe("상태 snapshot 참조");
    expect(index.items.find((item) => item.id === "rail")?.detail).toBe("4개 안전 칸");
    expect(index.headline).not.toContain("활성");
    expect(index.headline).not.toContain("흐름");
    expect(`${index.headline} ${index.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 16-A AI Office-first layout plan", () => {
    const layout = buildOfficeFirstLayoutPlan({
      visibleCharacterCount: 12,
      diagnosticPanelCount: 11,
      hasSelectedCharacter: false,
    });

    expect(layout.stageLabel).toBe("Stage 16-A AI Office-first reset");
    expect(layout.heading).toBe("AI Office 먼저 보기");
    expect(layout.primarySurface).toBe("scene");
    expect(layout.diagnosticsMode).toBe("secondary-collapsed");
    expect(layout.sections.map((section) => [section.id, section.label, section.priority])).toEqual([
      ["scene", "오피스 현장", 1],
      ["inspector", "선택 정보", 2],
      ["timeline", "최근 변화", 3],
      ["diagnostics", "진단 HUD", 4],
    ]);
    expect(layout.summary).toBe("캐릭터 12개 · 진단 11개는 보조로 정리");
    expect(layout.sections.every((section) => section.detail.length > 0)).toBe(true);
    expect(`${layout.heading} ${layout.summary} ${layout.sections.map((section) => section.detail).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds Korean empty-source copy without exposing raw adapter data", () => {
    const plan = buildOfficeEmptySourceCopyPlan(
      officeFixture({
        data_sources: [],
        agents: [{ id: "agent-raw", prompt: "raw prompt must not matter", token: "sk-test-must-not-matter" }],
        work_items: [{ id: "task-raw", body: "raw task body must not matter" }],
      }),
    );

    expect(plan.title).toBe("아직 연결된 소스가 없습니다");
    expect(plan.detail).toContain("대시보드 오류가 아니라 안전 DTO가 비어 있는 상태");
    expect(plan.items.map((item) => item.label)).toEqual(["연결 상태", "읽기 범위", "다음 확인"]);
    expect(plan.items.map((item) => item.detail).join(" ")).toContain("미보고 소스 5개");
    expect(plan.items.map((item) => item.detail).join(" ")).toContain("읽기 전용");
    expect(`${plan.title} ${plan.detail} ${plan.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|task_body|body|script|secret|token|sk-/i);
  });

  it("summarizes source health and empty fixture hints without leaking raw adapter errors", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 2, warning_count: 0 },
        { id: "kanban", status: "partial", checked_at: "2026-05-09T00:00:00Z", item_count: 1, warning_count: 2, error_summary: "raw stack trace must not matter" },
        { id: "cron", status: "error", checked_at: "2026-05-09T00:00:00Z", item_count: 0, warning_count: 1, error_summary: "raw token must not matter" },
        { id: "topics", status: "unavailable", checked_at: "2026-05-09T00:00:00Z", item_count: 0, warning_count: 0 },
      ],
    });

    const summary = buildOfficeSourceHealthSummary(state);
    const hints = buildOfficeEmptyStateHints();

    expect(summary.counts).toEqual({ ok: 1, partial: 1, missing: 1, unavailable: 1, error: 1 });
    expect(summary.totalWarningCount).toBe(3);
    expect(summary.label).toBe("주의 필요");
    expect(summary.detail).toBe("정상 1 · 주의 2 · 공백/미연결 2 · 경고 3");
    expect(summary.missingSourceIds).toEqual(["provenance"]);
    expect(hints).toMatchObject({
      rooms: "방 투영이 없습니다. 외부 작업이 비었다는 뜻은 아니며, 연결된 안전 DTO만 기준으로 표시합니다.",
      agents: "세션 어댑터가 안전 메타데이터를 제공하지 않았습니다. 제목/미리보기 원문은 계속 숨깁니다.",
      automations: "cron 스타일 작업이 보고되지 않았습니다. 실행/일시정지 제어는 제공하지 않습니다.",
    });
    expect(`${summary.label} ${summary.detail} ${summary.missingSourceIds.join(" ")} ${Object.values(hints).join(" ")}`).not.toMatch(/raw|stack|token|prompt|transcript|body|script|secret/i);
  });

  it("keeps the empty office map resilient and explicit about source gaps", () => {
    const state = officeFixture();
    const nodes = buildOfficeMapNodes(state);
    const flows = buildOfficeMapFlows(nodes);
    const objects = buildOfficeSceneObjects(state, nodes);

    expect(nodes).toHaveLength(4);
    expect(nodes.map((node) => [node.id, node.count, node.health])).toEqual([
      ["sessions", 0, "missing"],
      ["work", 0, "missing"],
      ["automation", 0, "missing"],
      ["routing", 0, "missing"],
    ]);
    expect(flows.map((flow) => flow.health)).toEqual(["missing", "missing", "missing"]);
    expect(objects).toContainEqual(expect.objectContaining({ id: "routing-empty", label: "미연결 보관함", kind: "mail" }));
    expect(objects.map((object) => `${object.label} ${object.detail}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds safe browser-local office state deltas for room counts, health, and attention", () => {
    const previous = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "kanban", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "cron", status: "error", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "topics", status: "missing", checked_at: "2026-05-08T00:00:00Z", item_count: 0 },
      ],
      agents: [{ id: "session-1", source_platform: "cli", status: "active", prompt: "raw prompt must not matter" }],
      work_items: [{ id: "task-1", title: "Safe task", status: "open", body: "raw task body must not matter" }],
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" }],
    });
    const next = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:01:00Z", item_count: 3 },
        { id: "kanban", status: "partial", checked_at: "2026-05-08T00:01:00Z", item_count: 0 },
        { id: "cron", status: "ok", checked_at: "2026-05-08T00:01:00Z", item_count: 2 },
        { id: "topics", status: "missing", checked_at: "2026-05-08T00:01:00Z", item_count: 0 },
      ],
      agents: Array.from({ length: 3 }, (_, index) => ({ id: `session-${index}`, source_platform: "cli", status: "active", prompt: "raw prompt must not matter" })),
      work_items: [{ id: "task-1", title: "Safe task", status: "blocked", body: "raw task body must not matter" }],
      automations: [
        { id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" },
        { id: "job-2", name: "Cron job job-2", state: "scheduled", last_status: "ok", script: "raw script must not matter" },
      ],
    });

    const delta = buildOfficeStateDelta(previous, next);

    expect(delta.nodeBadges).toMatchObject({
      sessions: [{ label: "+2", tone: "positive" }],
      work: [{ label: "상태 변경", tone: "warning" }],
      automation: [{ label: "+1", tone: "positive" }, { label: "상태 변경", tone: "positive" }],
      routing: [],
    });
    expect(delta.recentChanges.map((change) => change.label)).toEqual([
      "세션 +2",
      "작업 상태 정상 → 부분 연결",
      "자동화 +1",
      "자동화 상태 오류 → 정상",
      "흐름 세션에서 작업으로 변경",
      "흐름 작업에서 자동화로 변경",
      "흐름 자동화에서 라우팅으로 변경",
      "확인 필요 1 → 2",
    ]);
    expect(delta.recentChanges.map((change) => change.detail).join(" ")).not.toMatch(/raw|prompt|body|script|secret/i);
  });

  it("builds flow-level change hints from safe endpoint count and health deltas", () => {
    const previous = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "kanban", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "cron", status: "partial", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
      ],
      agents: [{ id: "session-1", source_platform: "cli", status: "active", prompt: "raw prompt must not matter" }],
      work_items: [{ id: "task-1", title: "Safe task", status: "open", body: "raw task body must not matter" }],
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" }],
    });
    const next = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:01:00Z", item_count: 2 },
        { id: "kanban", status: "partial", checked_at: "2026-05-08T00:01:00Z", item_count: 1 },
        { id: "cron", status: "ok", checked_at: "2026-05-08T00:01:00Z", item_count: 1 },
      ],
      agents: [
        { id: "session-1", source_platform: "cli", status: "active", prompt: "raw prompt must not matter" },
        { id: "session-2", source_platform: "telegram", status: "idle", prompt: "raw prompt must not matter" },
      ],
      work_items: [{ id: "task-1", title: "Safe task", status: "open", body: "raw task body must not matter" }],
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" }],
    });

    const delta = buildOfficeStateDelta(previous, next);

    expect(delta.changedFlows).toEqual([
      { from: "sessions", to: "work", label: "세션에서 작업으로", tone: "warning" },
      { from: "work", to: "automation", label: "작업에서 자동화로", tone: "neutral" },
      { from: "automation", to: "routing", label: "자동화에서 라우팅으로", tone: "positive" },
    ]);
    expect(delta.recentChanges.map((change) => change.label)).toContain("흐름 세션에서 작업으로 변경");
    expect(delta.recentChanges.map((change) => change.detail).join(" ")).not.toMatch(/raw|prompt|body|script|secret/i);
  });

  it("builds safe automation next-run timing buckets without exposing cron bodies", () => {
    const summary = buildOfficeAutomationTimingSummary(
      officeFixture({
        automations: [
          { id: "overdue", next_run_at: "2026-05-08T23:55:00Z", prompt: "raw prompt must not matter" },
          { id: "soon", next_run_at: "2026-05-09T00:10:00Z", script: "raw script must not matter" },
          { id: "hour", next_run_at: "2026-05-09T00:45:00Z", body: "raw body must not matter" },
          { id: "today", next_run_at: "2026-05-09T12:00:00Z", secret: "raw secret must not matter" },
          { id: "later", next_run_at: "2026-05-10T00:05:00Z" },
          { id: "unknown", next_run_at: "not-a-date" },
        ],
      }),
      "2026-05-09T00:00:00Z",
    );

    expect(summary.counts).toEqual({ overdue: 1, under15m: 1, under1h: 1, today: 1, later: 1, unknown: 1 });
    expect(summary.primaryBucket).toEqual({ id: "overdue", label: "기한 지남", tone: "warning" });
    expect(`${summary.primaryBucket.label} ${Object.keys(summary.counts).join(" ")}`).not.toMatch(/raw|prompt|body|script|secret/i);
  });

  it("adds safe automation next-run bucket deltas to the recent rail", () => {
    const previous = officeFixture({
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", next_run_at: "2026-05-09T12:00:00Z", script: "raw script must not matter" }],
    });
    const next = officeFixture({
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", next_run_at: "2026-05-09T00:45:00Z", prompt: "raw prompt must not matter" }],
    });

    const delta = buildOfficeStateDelta(previous, next, { now: "2026-05-09T00:00:00Z" });

    expect(delta.nodeBadges.automation).toContainEqual({ label: "일정 변경", tone: "warning" });
    expect(delta.recentChanges).toContainEqual({
      id: "automation:next-run-bucket:today->under1h",
      label: "자동화 다음 실행 오늘 → <1h",
      detail: "next_run_at 시간대만 비교 · 프롬프트/스크립트 제외",
      tone: "warning",
    });
    expect(delta.recentChanges.map((change) => `${change.label} ${change.detail}`).join(" ")).not.toMatch(/raw|prompt|body|script|secret/i);
  });

  it("resolves local live tracking interval from tab visibility and consecutive failures", () => {
    expect(resolveOfficeLiveTrackingInterval({ isVisible: true, consecutiveFailures: 0 })).toBe(30_000);
    expect(resolveOfficeLiveTrackingInterval({ isVisible: false, consecutiveFailures: 0 })).toBe(60_000);
    expect(resolveOfficeLiveTrackingInterval({ isVisible: true, consecutiveFailures: 1 })).toBe(60_000);
    expect(resolveOfficeLiveTrackingInterval({ isVisible: true, consecutiveFailures: 2 })).toBe(120_000);
    expect(resolveOfficeLiveTrackingInterval({ isVisible: false, consecutiveFailures: 2 })).toBe(120_000);
  });

  it("collapses duplicate browser-memory recent changes before applying the ring-buffer limit", () => {
    const current = [
      { id: "sessions:count:1->2", label: "세션 +1", detail: "안전 개수 1 → 2", tone: "positive" as const },
      { id: "work:health:ok->partial", label: "작업 상태 정상 → 부분 연결", detail: "상태만 비교", tone: "warning" as const },
    ];
    const incoming = [
      { id: "sessions:count:1->2", label: "세션 +1", detail: "안전 개수 1 → 2", tone: "positive" as const },
      { id: "automation:count:1->2", label: "자동화 +1", detail: "안전 개수 1 → 2", tone: "positive" as const },
    ];

    expect(mergeOfficeRecentChanges(incoming, current, 2).map((change) => change.id)).toEqual([
      "sessions:count:1->2",
      "automation:count:1->2",
    ]);
  });

  it("returns no dynamic badges or rail entries for the first snapshot", () => {
    const delta = buildOfficeStateDelta(null, officeFixture());

    expect(delta.hasChanges).toBe(false);
    expect(delta.recentChanges).toEqual([]);
    expect(delta.nodeBadges).toEqual({ sessions: [], work: [], automation: [], routing: [] });
    expect(delta.changedFlows).toEqual([]);
  });

});
