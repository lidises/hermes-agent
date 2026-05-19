// The dashboard can be served either at the root of its host (e.g.
// https://kanban.tilos.com/) or under a URL prefix when reverse-proxied
// (e.g. https://mission-control.tilos.com/hermes/). The Python backend
// injects ``window.__HERMES_BASE_PATH__`` into index.html based on the
// incoming ``X-Forwarded-Prefix`` header so the SPA can address its own
// ``/api/...`` and ``/dashboard-plugins/...`` URLs correctly without a
// rebuild. Empty string means "served at root".
function readBasePath(): string {
  if (typeof window === "undefined") return "";
  const raw = window.__HERMES_BASE_PATH__ ?? "";
  if (!raw) return "";
  // Normalise: ensure leading slash, strip trailing slash.
  const withLead = raw.startsWith("/") ? raw : `/${raw}`;
  return withLead.replace(/\/+$/, "");
}

export const HERMES_BASE_PATH = readBasePath();
const BASE = HERMES_BASE_PATH;

import type { DashboardTheme } from "@/themes/types";

// Ephemeral session token for protected endpoints.
// Injected into index.html by the server — never fetched via API.
declare global {
  interface Window {
    __HERMES_SESSION_TOKEN__?: string;
    __HERMES_BASE_PATH__?: string;
  }
}
let _sessionToken: string | null = null;
const SESSION_HEADER = "X-Hermes-Session-Token";

function setSessionHeader(headers: Headers, token: string): void {
  if (!headers.has(SESSION_HEADER)) {
    headers.set(SESSION_HEADER, token);
  }
}

const UNSAFE_ERROR_BODY_PATTERN = /traceback|\/Users\/|\/home\/|token\s*=|sk-[A-Za-z0-9_-]+|secret|password|private key/i;

function safeErrorDetail(text: string, statusText: string): string {
  const fallback = statusText || "request failed";
  const trimmed = text.trim();
  if (!trimmed) return fallback;
  if (UNSAFE_ERROR_BODY_PATTERN.test(trimmed) || trimmed.includes("\n")) return "request failed";
  return trimmed;
}


export interface OfficeNasSingleFileWritePayload {
  write_ref: string;
  package_ref: string;
  target_vault_ref: string;
  safe_slug: string;
  safe_title: string;
  markdown_body: string;
  requested_by: string;
  requested_at: string;
}

export interface OfficeNasSingleFileWriteResult {
  written: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    mode: string;
    write_ref: string;
    safe_logical_path: string;
    safe_display_path: string;
    bytes_written: number;
    rollback_created: boolean;
    rollback_ref: string | null;
    capabilities: Record<string, boolean>;
  };
}

export interface OfficeNasMacRelayWritePayload extends OfficeNasSingleFileWritePayload {
  relay_request_ref: string;
  relay_execution_ref: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  relay_authorized_by: string;
  relay_authorized_at: string;
}

export interface OfficeNasMacRelayWriteResult {
  executed: boolean;
  written: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    mode: string;
    relay_request_ref: string;
    relay_execution_ref: string;
    write_ref: string;
    safe_logical_path: string;
    safe_display_path: string;
    bytes_written: number;
    readback_verified: boolean;
    readback_sha256: string;
    readback_first_line: string;
    rollback_created: boolean;
    rollback_ref: string | null;
    audit_written: boolean;
    audit_ref: string | null;
    capabilities: Record<string, boolean>;
  };
}

export interface OfficeNasKeeperHandoffQueueItemSummary {
  schema_version: number;
  mode: string;
  handoff_ref: string;
  queue_ref: string;
  queue_status: string;
  relay_request_ref: string;
  write_ref: string;
  package_ref: string;
  target_vault_ref: string;
  safe_slug: string;
  safe_title: string;
  requested_by: string;
  requested_at: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  safe_logical_path: string;
  safe_display_path: string;
  payload_bytes: number;
  markdown_body_included: false;
  next_required_boundary: string;
  queued_by?: string;
  queued_at?: string;
  authorization_ref?: string;
  authorization_decision?: string;
  authorized_by?: string;
  authorized_at?: string;
  relay_execution_ref?: string;
  execution_record_ref?: string;
  execution_status?: string;
  execution_recorded_by?: string;
  execution_recorded_at?: string;
  execution_safe_summary?: string;
  execution_evidence_refs?: string[];
}

export interface OfficeNasKeeperHandoffQueueReadback {
  listed: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: string;
    listed: true;
    queue_storage_ref: string;
    filters: Record<string, string | number>;
    effective_limit: number;
    available_count: number;
    count: number;
    skipped_count: number;
    items: OfficeNasKeeperHandoffQueueItemSummary[];
    markdown_body_included: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperHandoffQueueReadbackParams {
  handoff_ref?: string;
  queue_status?: string;
  relay_node_ref?: string;
  nas_keeper_ref?: string;
  limit?: number;
}

export interface OfficeAuthorityMetadataHandoffStatus {
  schema_version: number;
  mode: "authority_metadata_handoff_status";
  request_id?: string;
  correlation_id?: string;
  checkpoint_complete: boolean;
  chain_counts: Record<string, number>;
  latest_refs: Record<string, string>;
  next_manual_lane: string;
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeAuthorityMetadataHandoffParams {
  request_id?: string;
  correlation_id?: string;
  limit?: number;
}

export interface OfficeDispatcherAuthorityDryRunSurface {
  schema_version: number;
  mode: "dispatcher_authority_dry_run_surface";
  request_id?: string;
  correlation_id?: string;
  authority_ref?: string;
  dry_run_plan: {
    plan_ref: string;
    ready: boolean;
    would_dispatch: false;
    would_bind_authority_adapter: false;
    would_mutate_target: false;
    would_write_nas: false;
    would_start_daemon: false;
    would_record_audit: false;
    next_boundary: string;
    steps: Array<{ step_ref: string; label: string; enabled: boolean }>;
  };
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDispatcherAuthorityDryRunParams {
  request_id?: string;
  correlation_id?: string;
  authority_ref?: string;
}

export interface OfficeDispatcherAuthorityMetadataRecordingDraft {
  schema_version: number;
  mode: "dispatcher_authority_metadata_recording_draft";
  ready: boolean;
  request_id?: string;
  correlation_id?: string;
  authority_ref?: string;
  dry_run_result_payload: null | Record<string, unknown>;
  audit_payload: null | Record<string, unknown>;
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDispatcherAuthorityMetadataRecordingDraftParams {
  request_id?: string;
  correlation_id?: string;
  authority_ref?: string;
  result_id?: string;
  audit_id?: string;
  recorded_at?: string;
}

export interface OfficeDispatcherAuthorityMetadataAppendStatus {
  schema_version: number;
  mode: "dispatcher_authority_metadata_append_status";
  request_id?: string;
  correlation_id?: string;
  append_checkpoint_complete: boolean;
  append_counts: Record<string, number>;
  latest_refs: Record<string, string>;
  next_manual_lane: string;
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDispatcherAuthorityMetadataAppendStatusParams {
  request_id?: string;
  correlation_id?: string;
  limit?: number;
}

export interface OfficeDispatcherExecutionSimulationStatus {
  schema_version: number;
  mode: "dispatcher_execution_simulation_status";
  request_id: string;
  correlation_id: string;
  simulation_checkpoint_complete: boolean;
  simulation_counts: Record<string, number>;
  latest_refs: Record<string, string>;
  checkpoint_status: string;
  next_manual_lane: string;
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDispatcherExecutionSimulationStatusParams {
  limit?: number;
}

export interface OfficeDispatcherCompletionReviewStatus {
  schema_version: number;
  mode: "dispatcher_completion_review_status";
  request_id: string;
  correlation_id: string;
  completion_review_complete: boolean;
  execution_checkpoint_status: string;
  review_counts: Record<string, number>;
  latest_refs: Record<string, string>;
  completed_lanes: string[];
  next_manual_lane: string;
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeTargetDispatchContractStatus {
  schema_version: number;
  mode: "target_dispatch_contract_status";
  target_dispatch_contract_complete: boolean;
  source_completion_review_lane: string;
  next_manual_lane: string;
  dispatch_options: string[];
  required_dispatch_fields: string[];
  allowed_operation_kinds: string[];
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeWatcherCronContractStatus {
  schema_version: number;
  mode: "watcher_cron_contract_status";
  watcher_cron_contract_complete: boolean;
  source_target_dispatch_lane: string;
  next_manual_lane: string;
  scheduler_options: string[];
  required_scheduler_fields: string[];
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeRuntimeActivationReviewStatus {
  schema_version: number;
  mode: "runtime_activation_review_status";
  runtime_activation_review_complete: boolean;
  source_watcher_cron_lane: string;
  next_manual_lane: string;
  reviewed_activation_targets: string[];
  activation_decisions: Record<string, string>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeRuntimePreflightStatus {
  schema_version: number;
  mode: "runtime_preflight_status";
  runtime_preflight_complete: boolean;
  source_runtime_activation_lane: string;
  next_manual_lane: string;
  preflight_decisions: Record<string, string>;
  readiness: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualOneShotRuntimeDryRunStatus {
  schema_version: number;
  mode: "manual_one_shot_runtime_dry_run_status";
  manual_one_shot_runtime_dry_run_complete: boolean;
  source_runtime_preflight_lane: string;
  next_manual_lane: string;
  operator_trigger: Record<string, boolean | string>;
  dry_run_scope: Record<string, boolean>;
  metadata_envelope: Record<string, string>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeAdapterBindingDryRunStatus {
  schema_version: number;
  mode: "adapter_binding_dry_run_status";
  adapter_binding_dry_run_complete: boolean;
  source_manual_one_shot_lane: string;
  next_manual_lane: string;
  adapter_registry: Record<string, boolean | string>;
  binding_scope: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeHumanReviewedSingleDispatchStatus {
  schema_version: number;
  mode: "human_reviewed_single_dispatch_status";
  human_reviewed_single_dispatch_complete: boolean;
  source_adapter_binding_lane: string;
  next_manual_lane: string;
  dispatch_candidate: Record<string, boolean | string>;
  approval_requirements: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeExplicitRuntimeDispatchApprovalStatus {
  schema_version: number;
  mode: "explicit_runtime_dispatch_approval_status";
  explicit_runtime_dispatch_approval_complete: boolean;
  source_human_review_lane: string;
  next_manual_lane: string;
  approval_status: Record<string, boolean>;
  runtime_boundary: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeConcreteRuntimeSingleDispatchSliceDesign {
  schema_version: number;
  mode: "concrete_runtime_single_dispatch_slice_design";
  concrete_runtime_single_dispatch_slice_design_complete: boolean;
  source_approval_lane: string;
  next_manual_lane: string;
  one_shot_envelope: Record<string, boolean>;
  target_allowlist: Record<string, boolean>;
  rollback_plan: Record<string, boolean>;
  dry_run_evidence_requirements: Record<string, boolean>;
  idempotency: Record<string, boolean>;
  disabled_runtime_gate: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDisabledOneShotRuntimeDispatchExecutorSkeleton {
  schema_version: number;
  mode: "disabled_one_shot_runtime_dispatch_executor_skeleton";
  disabled_one_shot_runtime_dispatch_executor_skeleton_complete: boolean;
  source_design_lane: string;
  next_manual_lane: string;
  executor_gate: Record<string, boolean>;
  required_inputs: Record<string, boolean>;
  execution_boundary: Record<string, boolean>;
  contract_hardening: Record<string, boolean>;
  ref_patterns: Record<string, string>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeApprovedRealOneShotDispatchGateDesign {
  schema_version: number;
  mode: "approved_real_one_shot_dispatch_gate_design";
  approved_real_one_shot_dispatch_gate_design_complete: boolean;
  source_design_lane: string;
  next_manual_lane: string;
  approval_gate: Record<string, boolean>;
  runtime_command_envelope: Record<string, boolean>;
  replay_store: Record<string, boolean>;
  rollback_disable: Record<string, boolean>;
  execution_boundary: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualApprovalRecordingPreflightStatus {
  schema_version: number;
  mode: "manual_approval_recording_preflight_status";
  manual_approval_recording_preflight_complete: boolean;
  source_design_lane: string;
  next_manual_lane: string;
  preflight_contract: Record<string, boolean>;
  execution_boundary: Record<string, boolean>;
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualApprovalRecordingPreflightPayload {
  approval_record_ref: string;
  exact_target_allowlist_ref: string;
  idempotency_key: string;
  replay_lookup_ref: string;
  rollback_disable_ref: string;
  dry_run_evidence_ref: string;
  operator_confirmation: string;
}

export interface OfficeManualApprovalRecordingPreflightRefusal {
  schema_version: number;
  mode: "manual_approval_recording_preflight_refusal";
  accepted: false;
  approval_record_written: false;
  dispatch_gate_open: false;
  runtime_command_executed: false;
  target_mutation_created: false;
  refusal_code: string;
  safe_validation: Record<string, boolean>;
  validation_errors: Array<{ field: string; code: string }>;
  missing_requirements: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
}

export interface OfficeManualApprovalRecordingDraftPayload extends OfficeManualApprovalRecordingPreflightPayload {
  requested_by: string;
  requested_at: string;
  safe_summary: string;
  evidence_refs: string[];
}

export interface OfficeManualApprovalRecordingDraft {
  schema_version: number;
  mode: "stored_manual_approval_recording_draft";
  draft_status: "draft_only";
  approval_record_ref: string;
  idempotency_key: string;
  approval_record_written: false;
  dispatch_gate_open: false;
  runtime_command_executed: false;
  target_mutation_created: false;
  idempotency_replay_store_written: false;
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
}

export interface OfficeManualApprovalRecordingDraftAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualApprovalRecordingDraft | null;
}

export interface OfficeManualApprovalRecordingDraftStatus {
  schema_version: number;
  mode: "stored_manual_approval_recording_drafts_readback";
  draft_count: number;
  limit: number;
  skipped_count: number;
  drafts: OfficeManualApprovalRecordingDraft[];
  latest_refs: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualApprovalRecordingDraftReviewStatus {
  schema_version: number;
  mode: "manual_approval_recording_draft_review_status";
  manual_approval_recording_draft_review_complete: boolean;
  source_design_lane?: string;
  next_manual_lane?: string;
  review: Record<string, string | boolean | number | null>;
  readback: Record<string, unknown>;
  execution_boundary: Record<string, boolean>;
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualApprovalRecordPayload {
  approval_record_ref: string;
  operator_confirmation: "confirmed-real-approval-record-write-only";
  approved_by: string;
  approved_at: string;
  approval_evidence_refs: string[];
}

export interface OfficeManualApprovalRecord {
  schema_version: number;
  mode: "stored_manual_approval_record";
  approval_status: "recorded_manual_approval";
  approval_record_ref: string;
  approval_record_written: true;
  dispatch_gate_open: false;
  runtime_command_executed: false;
  target_mutation_created: false;
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
}

export interface OfficeManualApprovalRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualApprovalRecord | null;
}

export interface OfficeManualApprovalRecordStatus {
  schema_version: number;
  mode: "stored_manual_approval_records_readback";
  approval_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualApprovalRecord[];
  latest_refs: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualApprovalDispatchGateReadinessStatus {
  schema_version: number;
  mode: "manual_approval_dispatch_gate_readiness_status";
  manual_approval_dispatch_gate_readiness_complete: boolean;
  source_design_lane?: string;
  next_manual_lane?: string;
  readiness: Record<string, string | boolean | number | null>;
  readback?: Record<string, unknown>;
  execution_boundary: Record<string, boolean>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualDispatchGateOpenRecordPayload {
  approval_record_ref: string;
  dispatch_gate_ref: string;
  operator_confirmation: "confirmed-dispatch-gate-open-metadata-only";
  opened_by: string;
  opened_at: string;
  gate_evidence_refs: string[];
}

export interface OfficeManualDispatchGateOpenRecord {
  schema_version: number;
  mode: "stored_manual_dispatch_gate_open_record";
  gate_status?: "dispatch_gate_open_metadata_only";
  approval_record_ref: string;
  dispatch_gate_ref: string;
  approval_record_written?: boolean;
  dispatch_gate_open: boolean;
  runtime_command_included: boolean;
  runtime_command_executed: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created?: boolean;
  nas_save_created?: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualDispatchGateOpenRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualDispatchGateOpenRecord | null;
}

export interface OfficeManualDispatchGateOpenRecordStatus {
  schema_version: number;
  mode: "stored_manual_dispatch_gate_open_records_readback";
  dispatch_gate_open_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualDispatchGateOpenRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualRuntimeCommandPreviewRecordPayload {
  dispatch_gate_ref: string;
  runtime_command_preview_ref: string;
  command_envelope_ref: string;
  command_intent_ref: string;
  operator_confirmation: "confirmed-runtime-command-preview-only";
  materialized_by: string;
  materialized_at: string;
  preview_evidence_refs: string[];
}

export interface OfficeManualRuntimeCommandPreviewRecord {
  schema_version: number;
  mode: "stored_manual_runtime_command_preview_record";
  preview_status?: "runtime_command_preview_only";
  dispatch_gate_ref: string;
  runtime_command_preview_ref: string;
  command_envelope_ref?: string;
  command_intent_ref?: string;
  approval_record_ref?: string;
  runtime_command_preview_created: boolean;
  runtime_command_preview_checksum_sha256: string;
  runtime_command_included: boolean;
  runtime_command_executed: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created?: boolean;
  nas_save_created?: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualRuntimeCommandPreviewRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualRuntimeCommandPreviewRecord | null;
}

export interface OfficeManualRuntimeCommandPreviewRecordStatus {
  schema_version: number;
  mode: "stored_manual_runtime_command_preview_records_readback";
  runtime_command_preview_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualRuntimeCommandPreviewRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualRuntimeCommandInclusionRecordPayload {
  runtime_command_preview_ref: string;
  runtime_command_ref: string;
  operator_confirmation: "confirmed-runtime-command-inclusion-no-execute";
  included_by: string;
  included_at: string;
  command_kind: "office_controlled_mutation_single_dispatch_noop_probe";
  command_body: {
    target_ref: string;
    dry_run_evidence_ref: string;
    rollback_disable_ref: string;
  };
  inclusion_evidence_refs: string[];
}

export interface OfficeManualRuntimeCommandInclusionRecord {
  schema_version: number;
  mode: "stored_manual_runtime_command_inclusion_record";
  inclusion_status?: "runtime_command_included_no_execute";
  runtime_command_preview_ref: string;
  runtime_command_ref: string;
  dispatch_gate_ref?: string;
  approval_record_ref?: string;
  command_envelope_ref?: string;
  command_intent_ref?: string;
  command_kind: "office_controlled_mutation_single_dispatch_noop_probe";
  command_body: {
    target_ref: string;
    dry_run_evidence_ref: string;
    rollback_disable_ref: string;
  };
  runtime_command_body_checksum_sha256: string;
  runtime_command_preview_created?: boolean;
  runtime_command_included: boolean;
  runtime_command_executed: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created?: boolean;
  nas_save_created?: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualRuntimeCommandInclusionRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualRuntimeCommandInclusionRecord | null;
}

export interface OfficeManualRuntimeCommandInclusionRecordStatus {
  schema_version: number;
  mode: "stored_manual_runtime_command_inclusion_records_readback";
  runtime_command_inclusion_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualRuntimeCommandInclusionRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualRuntimeCommandExecutionRecordPayload {
  runtime_command_ref: string;
  runtime_execution_ref: string;
  idempotency_key: string;
  operator_confirmation: "confirmed-runtime-command-execute-noop-probe-only";
  executed_by: string;
  executed_at: string;
  execution_evidence_refs: string[];
}

export interface OfficeManualRuntimeCommandExecutionRecord {
  schema_version: number;
  mode: "stored_manual_runtime_command_execution_record";
  execution_status?: "noop_probe_executed_no_target_mutation";
  runtime_command_preview_ref?: string;
  runtime_command_ref: string;
  runtime_execution_ref: string;
  idempotency_key: string;
  runtime_execution_result: "noop_probe_succeeded";
  runtime_command_included?: boolean;
  runtime_command_executed: boolean;
  idempotency_replay_store_written: boolean;
  adapter_dispatch_created?: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created?: boolean;
  nas_save_created?: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualRuntimeCommandExecutionRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualRuntimeCommandExecutionRecord | null;
}

export interface OfficeManualRuntimeCommandExecutionRecordStatus {
  schema_version: number;
  mode: "stored_manual_runtime_command_execution_records_readback";
  runtime_command_execution_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualRuntimeCommandExecutionRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualTargetMutationReadinessRecordPayload {
  runtime_execution_ref: string;
  target_mutation_readiness_ref: string;
  exact_target_allowlist_ref: string;
  target_ref: string;
  dry_run_evidence_ref: string;
  rollback_disable_ref: string;
  operator_confirmation: "confirmed-target-mutation-readiness-no-mutate";
  verified_by: string;
  verified_at: string;
  readiness_evidence_refs: string[];
}

export interface OfficeManualTargetMutationReadinessRecord {
  schema_version: number;
  mode: "stored_manual_target_mutation_readiness_record";
  readiness_status?: "exact_target_verified_no_mutation";
  runtime_command_ref?: string;
  runtime_execution_ref: string;
  target_mutation_readiness_ref: string;
  exact_target_allowlist_ref: string;
  target_ref: string;
  dry_run_evidence_ref?: string;
  rollback_disable_ref?: string;
  target_mutation_readiness_verified: boolean;
  exact_target_allowlist_verified: boolean;
  runtime_command_executed: boolean;
  idempotency_replay_store_written?: boolean;
  adapter_dispatch_created?: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created?: boolean;
  nas_save_created?: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualTargetMutationReadinessRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualTargetMutationReadinessRecord | null;
}

export interface OfficeManualTargetMutationReadinessRecordStatus {
  schema_version: number;
  mode: "stored_manual_target_mutation_readiness_records_readback";
  target_mutation_readiness_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualTargetMutationReadinessRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualTargetMutationRecordPayload {
  target_mutation_readiness_ref: string;
  target_mutation_ref: string;
  operator_confirmation: "confirmed-target-mutation-write-only";
  mutated_by: string;
  mutated_at: string;
  mutation_evidence_refs: string[];
}

export interface OfficeManualTargetMutationRecord {
  schema_version: number;
  mode: "stored_manual_target_mutation_record";
  mutation_status?: "exact_target_mutated_no_kanban_or_nas";
  target_mutation_result?: "safe_target_marker_written";
  target_mutation_readiness_ref: string;
  target_mutation_ref: string;
  runtime_execution_ref?: string;
  runtime_command_ref?: string;
  runtime_command_preview_ref?: string;
  idempotency_key?: string;
  dispatch_gate_ref?: string;
  approval_record_ref?: string;
  exact_target_allowlist_ref?: string;
  target_ref?: string;
  dry_run_evidence_ref?: string;
  rollback_disable_ref?: string;
  target_mutation_readiness_verified?: boolean;
  exact_target_allowlist_verified?: boolean;
  runtime_command_executed?: boolean;
  idempotency_replay_store_written?: boolean;
  rollback_executed?: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created: boolean;
  nas_save_created: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualTargetMutationRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualTargetMutationRecord | null;
}

export interface OfficeManualTargetMutationRecordStatus {
  schema_version: number;
  mode: "stored_manual_target_mutation_records_readback";
  target_mutation_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualTargetMutationRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualAdapterDispatchRecordPayload {
  target_mutation_ref: string;
  adapter_dispatch_ref: string;
  adapter_ref: string;
  operator_confirmation: "confirmed-adapter-dispatch-record-only";
  dispatched_by: string;
  dispatched_at: string;
  dispatch_evidence_refs: string[];
}

export interface OfficeManualAdapterDispatchRecord {
  schema_version: number;
  mode: "stored_manual_adapter_dispatch_record";
  dispatch_status?: "adapter_dispatched_no_kanban_or_nas";
  adapter_dispatch_result?: "safe_adapter_dispatch_marker_written";
  target_mutation_ref: string;
  adapter_dispatch_ref: string;
  adapter_ref: string;
  target_mutation_readiness_ref?: string;
  runtime_execution_ref?: string;
  runtime_command_ref?: string;
  runtime_command_preview_ref?: string;
  idempotency_key?: string;
  dispatch_gate_ref?: string;
  approval_record_ref?: string;
  exact_target_allowlist_ref?: string;
  target_ref?: string;
  target_mutation_created: boolean;
  adapter_dispatch_created: boolean;
  kanban_mutation_created: boolean;
  nas_save_created: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualAdapterDispatchRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualAdapterDispatchRecord | null;
}

export interface OfficeManualAdapterDispatchRecordStatus {
  schema_version: number;
  mode: "stored_manual_adapter_dispatch_records_readback";
  adapter_dispatch_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualAdapterDispatchRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualKanbanMutationRecordPayload {
  adapter_dispatch_ref: string;
  kanban_mutation_ref: string;
  kanban_card_ref: string;
  operator_confirmation: "confirmed-kanban-mutation-record-only";
  mutated_by: string;
  mutated_at: string;
  mutation_evidence_refs: string[];
}

export interface OfficeManualKanbanMutationRecord {
  schema_version: number;
  mode: "stored_manual_kanban_mutation_record";
  kanban_status?: "kanban_mutated_no_nas_or_real_dispatch";
  kanban_mutation_result?: "safe_kanban_marker_written";
  adapter_dispatch_ref: string;
  kanban_mutation_ref: string;
  kanban_card_ref: string;
  adapter_ref?: string;
  target_mutation_ref?: string;
  target_ref?: string;
  target_mutation_created: boolean;
  adapter_dispatch_created: boolean;
  kanban_mutation_created: boolean;
  nas_save_created: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualKanbanMutationRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualKanbanMutationRecord | null;
}

export interface OfficeManualKanbanMutationRecordStatus {
  schema_version: number;
  mode: "stored_manual_kanban_mutation_records_readback";
  kanban_mutation_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualKanbanMutationRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualNasSaveRecordPayload {
  kanban_mutation_ref: string;
  nas_save_ref: string;
  nas_note_ref: string;
  operator_confirmation: "confirmed-nas-save-record-only";
  saved_by: string;
  saved_at: string;
  save_evidence_refs: string[];
}

export interface OfficeManualNasSaveRecord {
  schema_version: number;
  mode: "stored_manual_nas_save_record";
  nas_save_status?: "nas_save_marker_written_no_direct_vps_authority";
  nas_save_result?: "safe_nas_save_marker_written";
  kanban_mutation_ref: string;
  nas_save_ref: string;
  nas_note_ref: string;
  kanban_card_ref?: string;
  adapter_dispatch_ref?: string;
  target_mutation_ref?: string;
  target_ref?: string;
  kanban_mutation_created: boolean;
  nas_save_created: boolean;
  vps_direct_nas_authority_enabled: boolean;
  real_nas_execution_enabled: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualNasSaveRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualNasSaveRecord | null;
}

export interface OfficeManualNasSaveRecordStatus {
  schema_version: number;
  mode: "stored_manual_nas_save_records_readback";
  nas_save_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualNasSaveRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualNasKeeperHandoffRecordPayload {
  nas_save_ref: string;
  handoff_ref: string;
  relay_request_ref: string;
  write_ref: string;
  package_ref: string;
  target_vault_ref: string;
  safe_slug: string;
  safe_title: string;
  markdown_body: string;
  requested_by: string;
  requested_at: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  queued_by: string;
  queued_at: string;
  operator_confirmation: "confirmed-nas-keeper-handoff-queue-only";
}

export interface OfficeManualNasKeeperHandoffRecord {
  schema_version: number;
  mode: "manual_nas_keeper_handoff_queued";
  nas_save_ref: string;
  handoff_ref: string;
  queue_status: string;
  relay_request_ref: string;
  write_ref: string;
  package_ref: string;
  target_vault_ref: string;
  safe_slug: string;
  safe_title: string;
  nas_save_created: boolean;
  nas_keeper_handoff_queued: boolean;
  direct_vps_nas_write_enabled: boolean;
  vps_direct_nas_authority_enabled: boolean;
  mac_relay_write_enabled: boolean;
  actual_nas_write_enabled: boolean;
  real_nas_execution_enabled: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualNasKeeperHandoffRecordAppendResult {
  queued: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualNasKeeperHandoffRecord | null;
}

export interface OfficeManualNasKeeperHandoffRecordStatus {
  schema_version: number;
  mode: "manual_nas_keeper_handoff_records_readback";
  nas_keeper_handoff_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualNasKeeperHandoffRecord[];
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeDisabledOneShotRuntimeDispatchPayload {
  exact_target_allowlist_ref: string;
  idempotency_key: string;
  rollback_plan_ref: string;
  dry_run_evidence_ref: string;
  operator_confirmation: boolean;
}

export interface OfficeDisabledOneShotRuntimeDispatchRefusal {
  schema_version: number;
  mode: "disabled_one_shot_runtime_dispatch_executor_refusal";
  accepted: false;
  dispatch_created: false;
  runtime_command_executed: false;
  target_mutation_created: false;
  refusal_code: string;
  safe_validation: Record<string, boolean>;
  validation_errors: Array<{ field: string; code: string }>;
  missing_requirements: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDispatcherCompletionReviewStatusParams {
  limit?: number;
}

export interface OfficeNasKeeperExecutionFromPreviewPayload {
  handoff_ref: string;
  relay_execution_ref: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  relay_authorized_by: string;
  relay_authorized_at: string;
  record_execution_state_after_write?: true;
  execution_record_ref?: string;
  recorded_by?: string;
  recorded_at?: string;
}

export interface OfficeNasKeeperExecutionFromPreviewResult {
  executed: boolean;
  written: boolean;
  recorded?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | (OfficeNasMacRelayWriteResult["dto"] & {
    mode: "nas_keeper_mac_relay_execution_from_preview_completed";
    handoff_ref: string;
    queue_ref: string;
    queue_status: string;
    authorization_ref: string;
    previewed_payload_verified: true;
    markdown_body_ref: string;
    markdown_body_bytes: number;
    markdown_body_sha256: string;
    markdown_body_included: false;
    execution_bridge_path: string[];
    execution_state_recorded?: boolean;
    execution_state?: OfficeNasKeeperExecutionStateResult["dto"];
  });
}

export interface OfficeNasKeeperExecutionStatePayload {
  handoff_ref: string;
  execution_record_ref: string;
  relay_execution_ref: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  recorded_by: string;
  recorded_at: string;
  execution_status: "succeeded" | "failed" | "manual_review_required";
  safe_summary: string;
  evidence_refs: string[];
}

export interface OfficeNasKeeperExecutionStateResult {
  recorded: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_mac_relay_execution_state_recorded";
    recorded: true;
    handoff_ref: string;
    execution_record_ref: string;
    relay_execution_ref: string;
    queue_ref: string;
    queue_status_before: string;
    queue_status_after: string;
    execution_status: string;
    execution_safe_summary: string;
    execution_evidence_refs: string[];
    markdown_body_included: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  // Inject the session token into all /api/ requests.
  const headers = new Headers(init?.headers);
  const token = window.__HERMES_SESSION_TOKEN__;
  if (token) {
    setSessionHeader(headers, token);
  }
  let res: Response;
  try {
    res = await fetch(`${BASE}${url}`, { ...init, headers });
  } catch {
    throw new Error("Network request failed");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${safeErrorDetail(text, res.statusText)}`);
  }
  return res.json();
}

async function getSessionToken(): Promise<string> {
  if (_sessionToken) return _sessionToken;
  const injected = window.__HERMES_SESSION_TOKEN__;
  if (injected) {
    _sessionToken = injected;
    return _sessionToken;
  }
  throw new Error("Session token not available — page must be served by the Hermes dashboard server");
}

export const api = {
  getStatus: () => fetchJSON<StatusResponse>("/api/status"),
  getOfficeState: () => fetchJSON<OfficeState>("/api/office/state"),
  getOfficeEvents: () => fetchJSON<OfficeSafeEventsResponse>("/api/office/events"),
  getOfficeControlledMutationNasKeeperHandoffQueue: (params: OfficeNasKeeperHandoffQueueReadbackParams = {}) => {
    const qs = new URLSearchParams();
    if (params.handoff_ref) qs.set("handoff_ref", params.handoff_ref);
    if (params.queue_status) qs.set("queue_status", params.queue_status);
    if (params.relay_node_ref) qs.set("relay_node_ref", params.relay_node_ref);
    if (params.nas_keeper_ref) qs.set("nas_keeper_ref", params.nas_keeper_ref);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeNasKeeperHandoffQueueReadback>(`/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-queue${suffix}`);
  },
  getOfficeControlledMutationAuthorityMetadataHandoff: (params: OfficeAuthorityMetadataHandoffParams = {}) => {
    const qs = new URLSearchParams();
    if (params.request_id) qs.set("request_id", params.request_id);
    if (params.correlation_id) qs.set("correlation_id", params.correlation_id);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeAuthorityMetadataHandoffStatus>(`/api/office/controlled-mutation/authority-metadata-handoff${suffix}`);
  },
  getOfficeControlledMutationDispatcherAuthorityDryRun: (params: OfficeDispatcherAuthorityDryRunParams = {}) => {
    const qs = new URLSearchParams();
    if (params.request_id) qs.set("request_id", params.request_id);
    if (params.correlation_id) qs.set("correlation_id", params.correlation_id);
    if (params.authority_ref) qs.set("authority_ref", params.authority_ref);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeDispatcherAuthorityDryRunSurface>(`/api/office/controlled-mutation/dispatcher-authority-dry-run${suffix}`);
  },
  getOfficeControlledMutationDispatcherAuthorityMetadataRecordingDraft: (params: OfficeDispatcherAuthorityMetadataRecordingDraftParams = {}) => {
    const qs = new URLSearchParams();
    if (params.request_id) qs.set("request_id", params.request_id);
    if (params.correlation_id) qs.set("correlation_id", params.correlation_id);
    if (params.authority_ref) qs.set("authority_ref", params.authority_ref);
    if (params.result_id) qs.set("result_id", params.result_id);
    if (params.audit_id) qs.set("audit_id", params.audit_id);
    if (params.recorded_at) qs.set("recorded_at", params.recorded_at);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeDispatcherAuthorityMetadataRecordingDraft>(`/api/office/controlled-mutation/dispatcher-authority-metadata-recording-draft${suffix}`);
  },
  getOfficeControlledMutationDispatcherAuthorityMetadataAppendStatus: (params: OfficeDispatcherAuthorityMetadataAppendStatusParams = {}) => {
    const qs = new URLSearchParams();
    if (params.request_id) qs.set("request_id", params.request_id);
    if (params.correlation_id) qs.set("correlation_id", params.correlation_id);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeDispatcherAuthorityMetadataAppendStatus>(`/api/office/controlled-mutation/dispatcher-authority-metadata-append-status${suffix}`);
  },
  getOfficeControlledMutationDispatcherExecutionSimulationStatus: (params: OfficeDispatcherExecutionSimulationStatusParams = {}) => {
    const qs = new URLSearchParams();
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeDispatcherExecutionSimulationStatus>(`/api/office/controlled-mutation/dispatcher-execution-simulation-status${suffix}`);
  },
  getOfficeControlledMutationDispatcherCompletionReviewStatus: (params: OfficeDispatcherCompletionReviewStatusParams = {}) => {
    const qs = new URLSearchParams();
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeDispatcherCompletionReviewStatus>(`/api/office/controlled-mutation/dispatcher-completion-review-status${suffix}`);
  },
  getOfficeControlledMutationTargetDispatchContractStatus: () =>
    fetchJSON<OfficeTargetDispatchContractStatus>("/api/office/controlled-mutation/target-dispatch-contract-status"),
  getOfficeControlledMutationWatcherCronContractStatus: () =>
    fetchJSON<OfficeWatcherCronContractStatus>("/api/office/controlled-mutation/watcher-cron-contract-status"),
  getOfficeControlledMutationRuntimeActivationReviewStatus: () =>
    fetchJSON<OfficeRuntimeActivationReviewStatus>("/api/office/controlled-mutation/runtime-activation-review-status"),
  getOfficeControlledMutationRuntimePreflightStatus: () =>
    fetchJSON<OfficeRuntimePreflightStatus>("/api/office/controlled-mutation/runtime-preflight-status"),
  getOfficeControlledMutationManualOneShotRuntimeDryRunStatus: () =>
    fetchJSON<OfficeManualOneShotRuntimeDryRunStatus>("/api/office/controlled-mutation/manual-one-shot-runtime-dry-run-status"),
  getOfficeControlledMutationAdapterBindingDryRunStatus: () =>
    fetchJSON<OfficeAdapterBindingDryRunStatus>("/api/office/controlled-mutation/adapter-binding-dry-run-status"),
  getOfficeControlledMutationHumanReviewedSingleDispatchStatus: () =>
    fetchJSON<OfficeHumanReviewedSingleDispatchStatus>("/api/office/controlled-mutation/human-reviewed-single-dispatch-status"),
  getOfficeControlledMutationExplicitRuntimeDispatchApprovalStatus: () =>
    fetchJSON<OfficeExplicitRuntimeDispatchApprovalStatus>("/api/office/controlled-mutation/explicit-runtime-dispatch-approval-status"),
  getOfficeControlledMutationConcreteRuntimeSingleDispatchSliceDesign: () =>
    fetchJSON<OfficeConcreteRuntimeSingleDispatchSliceDesign>("/api/office/controlled-mutation/concrete-runtime-single-dispatch-slice-design"),
  getOfficeControlledMutationDisabledOneShotRuntimeDispatchExecutorSkeleton: () =>
    fetchJSON<OfficeDisabledOneShotRuntimeDispatchExecutorSkeleton>("/api/office/controlled-mutation/disabled-one-shot-runtime-dispatch-executor-skeleton"),
  getOfficeControlledMutationApprovedRealOneShotDispatchGateDesign: () =>
    fetchJSON<OfficeApprovedRealOneShotDispatchGateDesign>("/api/office/controlled-mutation/approved-real-one-shot-dispatch-gate-design"),
  getOfficeControlledMutationManualApprovalRecordingPreflightStatus: () =>
    fetchJSON<OfficeManualApprovalRecordingPreflightStatus>("/api/office/controlled-mutation/manual-approval-recording-preflight"),
  executeOfficeControlledMutationManualApprovalRecordingPreflight: (body: OfficeManualApprovalRecordingPreflightPayload) =>
    fetchJSON<OfficeManualApprovalRecordingPreflightRefusal>("/api/office/controlled-mutation/manual-approval-recording-preflight/preflight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  appendOfficeControlledMutationManualApprovalRecordingDraft: (body: OfficeManualApprovalRecordingDraftPayload) =>
    fetchJSON<OfficeManualApprovalRecordingDraftAppendResult>("/api/office/controlled-mutation/manual-approval-recording-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualApprovalRecordingDraftStatus: (params: { approval_record_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.approval_record_ref) qs.set("approval_record_ref", params.approval_record_ref);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualApprovalRecordingDraftStatus>(`/api/office/controlled-mutation/manual-approval-recording-draft-status${suffix}`);
  },
  getOfficeControlledMutationManualApprovalRecordingDraftReviewStatus: (params: { approval_record_ref?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.approval_record_ref) qs.set("approval_record_ref", params.approval_record_ref);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualApprovalRecordingDraftReviewStatus>(`/api/office/controlled-mutation/manual-approval-recording-draft-review-status${suffix}`);
  },
  appendOfficeControlledMutationManualApprovalRecord: (body: OfficeManualApprovalRecordPayload) =>
    fetchJSON<OfficeManualApprovalRecordAppendResult>("/api/office/controlled-mutation/manual-approval-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualApprovalRecordStatus: (params: { approval_record_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.approval_record_ref) qs.set("approval_record_ref", params.approval_record_ref);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualApprovalRecordStatus>(`/api/office/controlled-mutation/manual-approval-record-status${suffix}`);
  },
  getOfficeControlledMutationManualApprovalDispatchGateReadinessStatus: (params: { approval_record_ref?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.approval_record_ref) qs.set("approval_record_ref", params.approval_record_ref);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualApprovalDispatchGateReadinessStatus>(`/api/office/controlled-mutation/manual-approval-dispatch-gate-readiness-status${suffix}`);
  },
  writeOfficeControlledMutationManualDispatchGateOpenRecord: (body: OfficeManualDispatchGateOpenRecordPayload) =>
    fetchJSON<OfficeManualDispatchGateOpenRecordAppendResult>("/api/office/controlled-mutation/manual-dispatch-gate-open-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualDispatchGateOpenRecordStatus: (params: { dispatch_gate_ref?: string; approval_record_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.dispatch_gate_ref) qs.set("dispatch_gate_ref", params.dispatch_gate_ref);
    if (params.approval_record_ref) qs.set("approval_record_ref", params.approval_record_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualDispatchGateOpenRecordStatus>(`/api/office/controlled-mutation/manual-dispatch-gate-open-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualRuntimeCommandPreviewRecord: (body: OfficeManualRuntimeCommandPreviewRecordPayload) =>
    fetchJSON<OfficeManualRuntimeCommandPreviewRecordAppendResult>("/api/office/controlled-mutation/manual-runtime-command-preview-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualRuntimeCommandPreviewRecordStatus: (params: { runtime_command_preview_ref?: string; dispatch_gate_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.runtime_command_preview_ref) qs.set("runtime_command_preview_ref", params.runtime_command_preview_ref);
    if (params.dispatch_gate_ref) qs.set("dispatch_gate_ref", params.dispatch_gate_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualRuntimeCommandPreviewRecordStatus>(`/api/office/controlled-mutation/manual-runtime-command-preview-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualRuntimeCommandInclusionRecord: (body: OfficeManualRuntimeCommandInclusionRecordPayload) =>
    fetchJSON<OfficeManualRuntimeCommandInclusionRecordAppendResult>("/api/office/controlled-mutation/manual-runtime-command-inclusion-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualRuntimeCommandInclusionRecordStatus: (params: { runtime_command_ref?: string; runtime_command_preview_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.runtime_command_ref) qs.set("runtime_command_ref", params.runtime_command_ref);
    if (params.runtime_command_preview_ref) qs.set("runtime_command_preview_ref", params.runtime_command_preview_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualRuntimeCommandInclusionRecordStatus>(`/api/office/controlled-mutation/manual-runtime-command-inclusion-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualRuntimeCommandExecutionRecord: (body: OfficeManualRuntimeCommandExecutionRecordPayload) =>
    fetchJSON<OfficeManualRuntimeCommandExecutionRecordAppendResult>("/api/office/controlled-mutation/manual-runtime-command-execution-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualRuntimeCommandExecutionRecordStatus: (params: { runtime_command_ref?: string; runtime_execution_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.runtime_command_ref) qs.set("runtime_command_ref", params.runtime_command_ref);
    if (params.runtime_execution_ref) qs.set("runtime_execution_ref", params.runtime_execution_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualRuntimeCommandExecutionRecordStatus>(`/api/office/controlled-mutation/manual-runtime-command-execution-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualTargetMutationReadinessRecord: (body: OfficeManualTargetMutationReadinessRecordPayload) =>
    fetchJSON<OfficeManualTargetMutationReadinessRecordAppendResult>("/api/office/controlled-mutation/manual-target-mutation-readiness-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualTargetMutationReadinessRecordStatus: (params: { runtime_execution_ref?: string; target_mutation_readiness_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.runtime_execution_ref) qs.set("runtime_execution_ref", params.runtime_execution_ref);
    if (params.target_mutation_readiness_ref) qs.set("target_mutation_readiness_ref", params.target_mutation_readiness_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualTargetMutationReadinessRecordStatus>(`/api/office/controlled-mutation/manual-target-mutation-readiness-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualTargetMutationRecord: (body: OfficeManualTargetMutationRecordPayload) =>
    fetchJSON<OfficeManualTargetMutationRecordAppendResult>("/api/office/controlled-mutation/manual-target-mutation-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualTargetMutationRecordStatus: (params: { target_mutation_readiness_ref?: string; target_mutation_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.target_mutation_readiness_ref) qs.set("target_mutation_readiness_ref", params.target_mutation_readiness_ref);
    if (params.target_mutation_ref) qs.set("target_mutation_ref", params.target_mutation_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualTargetMutationRecordStatus>(`/api/office/controlled-mutation/manual-target-mutation-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualAdapterDispatchRecord: (body: OfficeManualAdapterDispatchRecordPayload) =>
    fetchJSON<OfficeManualAdapterDispatchRecordAppendResult>("/api/office/controlled-mutation/manual-adapter-dispatch-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualAdapterDispatchRecordStatus: (params: { target_mutation_ref?: string; adapter_dispatch_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.target_mutation_ref) qs.set("target_mutation_ref", params.target_mutation_ref);
    if (params.adapter_dispatch_ref) qs.set("adapter_dispatch_ref", params.adapter_dispatch_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualAdapterDispatchRecordStatus>(`/api/office/controlled-mutation/manual-adapter-dispatch-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualKanbanMutationRecord: (body: OfficeManualKanbanMutationRecordPayload) =>
    fetchJSON<OfficeManualKanbanMutationRecordAppendResult>("/api/office/controlled-mutation/manual-kanban-mutation-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualKanbanMutationRecordStatus: (params: { adapter_dispatch_ref?: string; kanban_mutation_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.adapter_dispatch_ref) qs.set("adapter_dispatch_ref", params.adapter_dispatch_ref);
    if (params.kanban_mutation_ref) qs.set("kanban_mutation_ref", params.kanban_mutation_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualKanbanMutationRecordStatus>(`/api/office/controlled-mutation/manual-kanban-mutation-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualNasSaveRecord: (body: OfficeManualNasSaveRecordPayload) =>
    fetchJSON<OfficeManualNasSaveRecordAppendResult>("/api/office/controlled-mutation/manual-nas-save-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualNasSaveRecordStatus: (params: { kanban_mutation_ref?: string; nas_save_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.kanban_mutation_ref) qs.set("kanban_mutation_ref", params.kanban_mutation_ref);
    if (params.nas_save_ref) qs.set("nas_save_ref", params.nas_save_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualNasSaveRecordStatus>(`/api/office/controlled-mutation/manual-nas-save-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualNasKeeperHandoffRecord: (body: OfficeManualNasKeeperHandoffRecordPayload) =>
    fetchJSON<OfficeManualNasKeeperHandoffRecordAppendResult>("/api/office/controlled-mutation/manual-nas-keeper-handoff-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualNasKeeperHandoffRecordStatus: (params: { nas_save_ref?: string; handoff_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.nas_save_ref) qs.set("nas_save_ref", params.nas_save_ref);
    if (params.handoff_ref) qs.set("handoff_ref", params.handoff_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualNasKeeperHandoffRecordStatus>(`/api/office/controlled-mutation/manual-nas-keeper-handoff-record-status${suffix}`);
  },
  executeOfficeControlledMutationDisabledOneShotRuntimeDispatch: (body: OfficeDisabledOneShotRuntimeDispatchPayload) =>
    fetchJSON<OfficeDisabledOneShotRuntimeDispatchRefusal>("/api/office/controlled-mutation/disabled-one-shot-runtime-dispatch-executor-skeleton/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  executeOfficeControlledMutationNasSingleFileWrite: (body: OfficeNasSingleFileWritePayload) =>
    fetchJSON<OfficeNasSingleFileWriteResult>("/api/office/controlled-mutation/nas-runtime/single-file-write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  executeOfficeControlledMutationNasMacRelayWrite: (body: OfficeNasMacRelayWritePayload) =>
    fetchJSON<OfficeNasMacRelayWriteResult>("/api/office/controlled-mutation/nas-runtime/mac-relay-write-execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  executeOfficeControlledMutationNasKeeperExecutionFromPreview: (body: OfficeNasKeeperExecutionFromPreviewPayload) =>
    fetchJSON<OfficeNasKeeperExecutionFromPreviewResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-from-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  recordOfficeControlledMutationNasKeeperExecutionState: (body: OfficeNasKeeperExecutionStatePayload) =>
    fetchJSON<OfficeNasKeeperExecutionStateResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getSessions: (limit = 20, offset = 0) =>
    fetchJSON<PaginatedSessions>(`/api/sessions?limit=${limit}&offset=${offset}`),
  getSessionMessages: (id: string) =>
    fetchJSON<SessionMessagesResponse>(`/api/sessions/${encodeURIComponent(id)}/messages`),
  getSessionLatestDescendant: (id: string) =>
    fetchJSON<SessionLatestDescendantResponse>(
      `/api/sessions/${encodeURIComponent(id)}/latest-descendant`,
    ),
  deleteSession: (id: string) =>
    fetchJSON<{ ok: boolean }>(`/api/sessions/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  getLogs: (params: { file?: string; lines?: number; level?: string; component?: string }) => {
    const qs = new URLSearchParams();
    if (params.file) qs.set("file", params.file);
    if (params.lines) qs.set("lines", String(params.lines));
    if (params.level && params.level !== "ALL") qs.set("level", params.level);
    if (params.component && params.component !== "all") qs.set("component", params.component);
    return fetchJSON<LogsResponse>(`/api/logs?${qs.toString()}`);
  },
  getAnalytics: (days: number) =>
    fetchJSON<AnalyticsResponse>(`/api/analytics/usage?days=${days}`),
  getModelsAnalytics: (days: number) =>
    fetchJSON<ModelsAnalyticsResponse>(`/api/analytics/models?days=${days}`),
  getConfig: () => fetchJSON<Record<string, unknown>>("/api/config"),
  getDefaults: () => fetchJSON<Record<string, unknown>>("/api/config/defaults"),
  getSchema: () => fetchJSON<{ fields: Record<string, unknown>; category_order: string[] }>("/api/config/schema"),
  getModelInfo: () => fetchJSON<ModelInfoResponse>("/api/model/info"),
  getModelOptions: () => fetchJSON<ModelOptionsResponse>("/api/model/options"),
  getAuxiliaryModels: () => fetchJSON<AuxiliaryModelsResponse>("/api/model/auxiliary"),
  setModelAssignment: (body: ModelAssignmentRequest) =>
    fetchJSON<ModelAssignmentResponse>("/api/model/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  saveConfig: (config: Record<string, unknown>) =>
    fetchJSON<{ ok: boolean }>("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    }),
  getConfigRaw: () => fetchJSON<{ yaml: string }>("/api/config/raw"),
  saveConfigRaw: (yaml_text: string) =>
    fetchJSON<{ ok: boolean }>("/api/config/raw", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yaml_text }),
    }),
  getEnvVars: () => fetchJSON<Record<string, EnvVarInfo>>("/api/env"),
  setEnvVar: (key: string, value: string) =>
    fetchJSON<{ ok: boolean }>("/api/env", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    }),
  deleteEnvVar: (key: string) =>
    fetchJSON<{ ok: boolean }>("/api/env", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    }),
  revealEnvVar: async (key: string) => {
    const token = await getSessionToken();
    return fetchJSON<{ key: string; value: string }>("/api/env/reveal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [SESSION_HEADER]: token,
      },
      body: JSON.stringify({ key }),
    });
  },

  // Cron jobs
  getCronJobs: () => fetchJSON<CronJob[]>("/api/cron/jobs"),
  createCronJob: (job: { prompt: string; schedule: string; name?: string; deliver?: string }) =>
    fetchJSON<CronJob>("/api/cron/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    }),
  pauseCronJob: (id: string) =>
    fetchJSON<{ ok: boolean }>(`/api/cron/jobs/${id}/pause`, { method: "POST" }),
  resumeCronJob: (id: string) =>
    fetchJSON<{ ok: boolean }>(`/api/cron/jobs/${id}/resume`, { method: "POST" }),
  triggerCronJob: (id: string) =>
    fetchJSON<{ ok: boolean }>(`/api/cron/jobs/${id}/trigger`, { method: "POST" }),
  deleteCronJob: (id: string) =>
    fetchJSON<{ ok: boolean }>(`/api/cron/jobs/${id}`, { method: "DELETE" }),

  // Profiles (minimal)
  getProfiles: () =>
    fetchJSON<{ profiles: ProfileInfo[] }>("/api/profiles"),
  createProfile: (body: { name: string; clone_from_default: boolean }) =>
    fetchJSON<{ ok: boolean; name: string; path: string }>("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  renameProfile: (name: string, newName: string) =>
    fetchJSON<{ ok: boolean; name: string; path: string }>(
      `/api/profiles/${encodeURIComponent(name)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_name: newName }),
      },
    ),
  deleteProfile: (name: string) =>
    fetchJSON<{ ok: boolean }>(
      `/api/profiles/${encodeURIComponent(name)}`,
      { method: "DELETE" },
    ),
  getProfileSetupCommand: (name: string) =>
    fetchJSON<{ command: string }>(
      `/api/profiles/${encodeURIComponent(name)}/setup-command`,
    ),
  getProfileSoul: (name: string) =>
    fetchJSON<{ content: string; exists: boolean }>(
      `/api/profiles/${encodeURIComponent(name)}/soul`,
    ),
  updateProfileSoul: (name: string, content: string) =>
    fetchJSON<{ ok: boolean }>(
      `/api/profiles/${encodeURIComponent(name)}/soul`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      },
    ),

  // Skills & Toolsets
  getSkills: () => fetchJSON<SkillInfo[]>("/api/skills"),
  toggleSkill: (name: string, enabled: boolean) =>
    fetchJSON<{ ok: boolean }>("/api/skills/toggle", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, enabled }),
    }),
  getToolsets: () => fetchJSON<ToolsetInfo[]>("/api/tools/toolsets"),

  // Session search (FTS5)
  searchSessions: (q: string) =>
    fetchJSON<SessionSearchResponse>(`/api/sessions/search?q=${encodeURIComponent(q)}`),

  // OAuth provider management
  getOAuthProviders: () =>
    fetchJSON<OAuthProvidersResponse>("/api/providers/oauth"),
  disconnectOAuthProvider: async (providerId: string) => {
    const token = await getSessionToken();
    return fetchJSON<{ ok: boolean; provider: string }>(
      `/api/providers/oauth/${encodeURIComponent(providerId)}`,
      {
        method: "DELETE",
        headers: { [SESSION_HEADER]: token },
      },
    );
  },
  startOAuthLogin: async (providerId: string) => {
    const token = await getSessionToken();
    return fetchJSON<OAuthStartResponse>(
      `/api/providers/oauth/${encodeURIComponent(providerId)}/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [SESSION_HEADER]: token,
        },
        body: "{}",
      },
    );
  },
  submitOAuthCode: async (providerId: string, sessionId: string, code: string) => {
    const token = await getSessionToken();
    return fetchJSON<OAuthSubmitResponse>(
      `/api/providers/oauth/${encodeURIComponent(providerId)}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [SESSION_HEADER]: token,
        },
        body: JSON.stringify({ session_id: sessionId, code }),
      },
    );
  },
  pollOAuthSession: (providerId: string, sessionId: string) =>
    fetchJSON<OAuthPollResponse>(
      `/api/providers/oauth/${encodeURIComponent(providerId)}/poll/${encodeURIComponent(sessionId)}`,
    ),
  cancelOAuthSession: async (sessionId: string) => {
    const token = await getSessionToken();
    return fetchJSON<{ ok: boolean }>(
      `/api/providers/oauth/sessions/${encodeURIComponent(sessionId)}`,
      {
        method: "DELETE",
        headers: { [SESSION_HEADER]: token },
      },
    );
  },

  // Gateway / update actions
  restartGateway: () =>
    fetchJSON<ActionResponse>("/api/gateway/restart", { method: "POST" }),
  updateHermes: () =>
    fetchJSON<ActionResponse>("/api/hermes/update", { method: "POST" }),
  getActionStatus: (name: string, lines = 200) =>
    fetchJSON<ActionStatusResponse>(
      `/api/actions/${encodeURIComponent(name)}/status?lines=${lines}`,
    ),

  // Dashboard plugins
  getPlugins: () =>
    fetchJSON<PluginManifestResponse[]>("/api/dashboard/plugins"),
  rescanPlugins: () =>
    fetchJSON<{ ok: boolean; count: number }>("/api/dashboard/plugins/rescan"),

  getPluginsHub: () => fetchJSON<PluginsHubResponse>("/api/dashboard/plugins/hub"),

  installAgentPlugin: (body: AgentPluginInstallRequest) =>
    fetchJSON<AgentPluginInstallResponse>("/api/dashboard/agent-plugins/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body }),
    }),

  enableAgentPlugin: (name: string) =>
    fetchJSON<{ ok: boolean; name: string; unchanged?: boolean }>(
      `/api/dashboard/agent-plugins/${encodeURIComponent(name)}/enable`,
      { method: "POST" },
    ),

  disableAgentPlugin: (name: string) =>
    fetchJSON<{ ok: boolean; name: string; unchanged?: boolean }>(
      `/api/dashboard/agent-plugins/${encodeURIComponent(name)}/disable`,
      { method: "POST" },
    ),

  updateAgentPlugin: (name: string) =>
    fetchJSON<AgentPluginUpdateResponse>(
      `/api/dashboard/agent-plugins/${encodeURIComponent(name)}/update`,
      { method: "POST" },
    ),

  removeAgentPlugin: (name: string) =>
    fetchJSON<{ ok: boolean; name: string }>(
      `/api/dashboard/agent-plugins/${encodeURIComponent(name)}`,
      { method: "DELETE" },
    ),

  savePluginProviders: (body: PluginProvidersPutRequest) =>
    fetchJSON<{ ok: boolean }>("/api/dashboard/plugin-providers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  setPluginVisibility: (name: string, hidden: boolean) =>
    fetchJSON<{ ok: boolean; name: string; hidden: boolean }>(
      `/api/dashboard/plugins/${encodeURIComponent(name)}/visibility`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden }),
      },
    ),

  // Dashboard themes
  getThemes: () =>
    fetchJSON<DashboardThemesResponse>("/api/dashboard/themes"),
  setTheme: (name: string) =>
    fetchJSON<{ ok: boolean; theme: string }>("/api/dashboard/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),
};

export interface ActionResponse {
  name: string;
  ok: boolean;
  pid: number;
}

export interface ActionStatusResponse {
  exit_code: number | null;
  lines: string[];
  name: string;
  pid: number | null;
  running: boolean;
}

export interface PlatformStatus {
  error_code?: string;
  error_message?: string;
  state: string;
  updated_at: string;
}

export interface StatusResponse {
  active_sessions: number;
  config_path: string;
  config_version: number;
  env_path: string;
  gateway_exit_reason: string | null;
  gateway_health_url: string | null;
  gateway_pid: number | null;
  gateway_platforms: Record<string, PlatformStatus>;
  gateway_running: boolean;
  gateway_state: string | null;
  gateway_updated_at: string | null;
  hermes_home: string;
  latest_config_version: number;
  release_date: string;
  version: string;
}

export type OfficeSourceStatus = "ok" | "partial" | "missing" | "unavailable" | "error";

export interface OfficeDataSource {
  id: string;
  status: OfficeSourceStatus;
  checked_at: string;
  item_count?: number;
  warning_count?: number;
  error_summary?: string | null;
}

export interface OfficeKanbanWorkItem {
  id: string;
  kind: "kanban_task";
  source: "kanban";
  room_id: string;
  board_id: string;
  task_ref: string;
  title: "Kanban task";
  status: string;
  assignee: string | null;
  tenant: string | null;
  priority: number;
  created_at?: number | string | null;
  started_at?: number | string | null;
  completed_at?: number | string | null;
  updated_at?: number | string | null;
  last_heartbeat_at?: number | string | null;
  dependency_counts: { parents: number; children: number };
  parent_task_refs: string[];
  child_task_refs: string[];
  badges: string[];
  provenance?: Record<string, unknown>;
}

export interface OfficeProjectionCacheActive {
  bundle_id: string;
  generated_at: string;
  generated_by: string;
  source_kind: string;
  source_tags: string[];
  freshness: Record<string, string>;
  validator: Record<string, string>;
  redaction: { raw_excluded: boolean; guarantee: string };
  payload_summary: Record<string, number | string | null>;
  display: Record<string, unknown>;
  bundle_path: string;
}

export interface OfficeProjectionCacheRejection {
  bundle_path: string;
  status: "rejected";
  reason_count: number;
  reasons: string[];
  field_paths: string[];
  checked_at: string;
}

export interface OfficeProjectionCache {
  schema_version: number;
  status: "active" | "missing" | "stale" | "rejected" | string;
  redacted: true;
  cache_layout: { incoming: string; active: string; archive: string; rejected: string };
  active: OfficeProjectionCacheActive | null;
  rejected: { count: number; recent: OfficeProjectionCacheRejection[] };
}

export interface OfficeState {
  schema_version: number;
  generated_at: string;
  mode: "read_only";
  display_mode: string;
  capabilities: {
    read_only: boolean;
    mutations_enabled: boolean;
    remote_mode: string;
  };
  data_sources: OfficeDataSource[];
  summary: Record<string, number | null | string>;
  rooms: Array<Record<string, unknown>>;
  agents: Array<Record<string, unknown>>;
  work_items: Array<Record<string, unknown>>;
  automations: Array<Record<string, unknown>>;
  topics: Array<Record<string, unknown>>;
  events: Array<Record<string, unknown>>;
  provenance: Array<Record<string, unknown>>;
  redactions: {
    policy_version: number;
    redacted_field_count: number;
    omitted_sections: string[];
    warnings: string[];
  };
  projection_cache: OfficeProjectionCache;
}

export interface OfficeSafeEventDTO {
  id: string;
  category: "snapshot_static" | "source_health_changed" | "workload_changed" | "attention_changed" | "room_density_changed" | "flow_changed";
  room_id: "sessions" | "work" | "automation" | "routing";
  tone: "neutral" | "positive" | "warning" | "negative";
  count: number;
  generated_at: string;
  redacted: true;
}

export interface OfficeSafeEventsResponse {
  schema_version: number;
  generated_at: string;
  mode: "read_only";
  stream: "safe_snapshot_events";
  redacted: true;
  fallback: "frontend_safe_projection";
  events: OfficeSafeEventDTO[];
}

export interface SessionInfo {
  id: string;
  source: string | null;
  model: string | null;
  title: string | null;
  started_at: number;
  ended_at: number | null;
  last_active: number;
  is_active: boolean;
  message_count: number;
  tool_call_count: number;
  input_tokens: number;
  output_tokens: number;
  preview: string | null;
  parent_session_id?: string | null;
}

export interface SessionLatestDescendantResponse {
  requested_session_id: string;
  session_id: string;
  path: string[];
  changed: boolean;
}

export interface PaginatedSessions {
  sessions: SessionInfo[];
  total: number;
  limit: number;
  offset: number;
}

export interface EnvVarInfo {
  is_set: boolean;
  redacted_value: string | null;
  description: string;
  url: string | null;
  category: string;
  is_password: boolean;
  tools: string[];
  advanced: boolean;
}

export interface SessionMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string | null;
  tool_calls?: Array<{
    id: string;
    function: { name: string; arguments: string };
  }>;
  tool_name?: string;
  tool_call_id?: string;
  timestamp?: number;
}

export interface SessionMessagesResponse {
  session_id: string;
  messages: SessionMessage[];
}

export interface LogsResponse {
  file: string;
  lines: string[];
}

export interface AnalyticsDailyEntry {
  day: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  reasoning_tokens: number;
  estimated_cost: number;
  actual_cost: number;
  sessions: number;
  api_calls: number;
}

export interface AnalyticsModelEntry {
  model: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost: number;
  sessions: number;
  api_calls: number;
}

export interface AnalyticsSkillEntry {
  skill: string;
  view_count: number;
  manage_count: number;
  total_count: number;
  percentage: number;
  last_used_at: number | null;
}

export interface AnalyticsSkillsSummary {
  total_skill_loads: number;
  total_skill_edits: number;
  total_skill_actions: number;
  distinct_skills_used: number;
}

export interface AnalyticsResponse {
  daily: AnalyticsDailyEntry[];
  by_model: AnalyticsModelEntry[];
  totals: {
    total_input: number;
    total_output: number;
    total_cache_read: number;
    total_reasoning: number;
    total_estimated_cost: number;
    total_actual_cost: number;
    total_sessions: number;
    total_api_calls: number;
  };
  skills: {
    summary: AnalyticsSkillsSummary;
    top_skills: AnalyticsSkillEntry[];
  };
}

export interface ProfileInfo {
  name: string;
  path: string;
  is_default: boolean;
  model: string | null;
  provider: string | null;
  has_env: boolean;
  skill_count: number;
}

export interface ModelsAnalyticsModelEntry {
  model: string;
  provider: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  reasoning_tokens: number;
  estimated_cost: number;
  actual_cost: number;
  sessions: number;
  api_calls: number;
  tool_calls: number;
  last_used_at: number;
  avg_tokens_per_session: number;
  capabilities: {
    supports_tools?: boolean;
    supports_vision?: boolean;
    supports_reasoning?: boolean;
    context_window?: number;
    max_output_tokens?: number;
    model_family?: string;
  };
}

export interface ModelsAnalyticsResponse {
  models: ModelsAnalyticsModelEntry[];
  totals: {
    distinct_models: number;
    total_input: number;
    total_output: number;
    total_cache_read: number;
    total_reasoning: number;
    total_estimated_cost: number;
    total_actual_cost: number;
    total_sessions: number;
    total_api_calls: number;
  };
  period_days: number;
}

export interface CronJob {
  id: string;
  name?: string;
  prompt: string;
  schedule: { kind: string; expr: string; display: string };
  schedule_display: string;
  enabled: boolean;
  state: string;
  deliver?: string;
  last_run_at?: string | null;
  next_run_at?: string | null;
  last_error?: string | null;
}

export interface SkillInfo {
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

export interface ToolsetInfo {
  name: string;
  label: string;
  description: string;
  enabled: boolean;
  configured: boolean;
  tools: string[];
}

export interface SessionSearchResult {
  session_id: string;
  snippet: string;
  role: string | null;
  source: string | null;
  model: string | null;
  session_started: number | null;
}

export interface SessionSearchResponse {
  results: SessionSearchResult[];
}

// ── Model info types ──────────────────────────────────────────────────

export interface ModelInfoResponse {
  model: string;
  provider: string;
  auto_context_length: number;
  config_context_length: number;
  effective_context_length: number;
  capabilities: {
    supports_tools?: boolean;
    supports_vision?: boolean;
    supports_reasoning?: boolean;
    context_window?: number;
    max_output_tokens?: number;
    model_family?: string;
  };
}

// ── Model options / assignment types ──────────────────────────────────

export interface ModelOptionProvider {
  name: string;
  slug: string;
  models?: string[];
  total_models?: number;
  is_current?: boolean;
  is_user_defined?: boolean;
  source?: string;
  warning?: string;
}

export interface ModelOptionsResponse {
  model?: string;
  provider?: string;
  providers?: ModelOptionProvider[];
}

export interface AuxiliaryTaskAssignment {
  task: string;
  provider: string;
  model: string;
  base_url: string;
}

export interface AuxiliaryModelsResponse {
  tasks: AuxiliaryTaskAssignment[];
  main: { provider: string; model: string };
}

export interface ModelAssignmentRequest {
  scope: "main" | "auxiliary";
  provider: string;
  model: string;
  /** For auxiliary: task slot name, "" for all, "__reset__" to reset all. */
  task?: string;
}

export interface ModelAssignmentResponse {
  ok: boolean;
  scope?: string;
  provider?: string;
  model?: string;
  tasks?: string[];
  reset?: boolean;
}

// ── OAuth provider types ────────────────────────────────────────────────

export interface OAuthProviderStatus {
  logged_in: boolean;
  source?: string | null;
  source_label?: string | null;
  token_preview?: string | null;
  expires_at?: string | null;
  has_refresh_token?: boolean;
  last_refresh?: string | null;
  error?: string;
}

export interface OAuthProvider {
  id: string;
  name: string;
  /** "pkce" (browser redirect + paste code), "device_code" (show code + URL),
   *  or "external" (delegated to a separate CLI like Claude Code or Qwen). */
  flow: "pkce" | "device_code" | "external";
  cli_command: string;
  docs_url: string;
  status: OAuthProviderStatus;
}

export interface OAuthProvidersResponse {
  providers: OAuthProvider[];
}

/** Discriminated union — the shape of /start depends on the flow. */
export type OAuthStartResponse =
  | {
      session_id: string;
      flow: "pkce";
      auth_url: string;
      expires_in: number;
    }
  | {
      session_id: string;
      flow: "device_code";
      user_code: string;
      verification_url: string;
      expires_in: number;
      poll_interval: number;
    };

export interface OAuthSubmitResponse {
  ok: boolean;
  status: "approved" | "error";
  message?: string;
}

export interface OAuthPollResponse {
  session_id: string;
  status: "pending" | "approved" | "denied" | "expired" | "error";
  error_message?: string | null;
  expires_at?: number | null;
}

// ── Dashboard theme types ──────────────────────────────────────────────

export interface DashboardThemeSummary {
  description: string;
  label: string;
  name: string;
  /** Full theme definition for user themes; undefined for built-ins
   *  (which the frontend already has locally). */
  definition?: DashboardTheme;
}

export interface DashboardThemesResponse {
  active: string;
  themes: DashboardThemeSummary[];
}

// ── Dashboard plugin types ─────────────────────────────────────────────

export interface PluginManifestResponse {
  name: string;
  label: string;
  description: string;
  icon: string;
  version: string;
  tab: {
    path: string;
    position?: string;
    override?: string;
    hidden?: boolean;
  };
  slots?: string[];
  entry: string;
  css?: string | null;
  has_api: boolean;
  source: string;
}

export interface HubAgentPluginRow {
  name: string;
  version: string;
  description: string;
  source: string;
  runtime_status: "disabled" | "enabled" | "inactive";
  has_dashboard_manifest: boolean;
  dashboard_manifest: PluginManifestResponse | null;
  path: string;
  can_remove: boolean;
  can_update_git: boolean;
  auth_required: boolean;
  auth_command: string;
  user_hidden: boolean;
}

export interface PluginsHubProviders {
  memory_provider: string;
  memory_options: Array<{ name: string; description: string }>;
  context_engine: string;
  context_options: Array<{ name: string; description: string }>;
}

export interface PluginsHubResponse {
  plugins: HubAgentPluginRow[];
  orphan_dashboard_plugins: PluginManifestResponse[];
  providers: PluginsHubProviders;
}

export interface AgentPluginInstallRequest {
  identifier: string;
  force?: boolean;
  enable?: boolean;
}

export interface AgentPluginInstallResponse {
  ok: boolean;
  plugin_name?: string;
  warnings?: string[];
  missing_env?: string[];
  after_install_path?: string | null;
  enabled?: boolean;
  error?: string;
}

export interface AgentPluginUpdateResponse {
  ok: boolean;
  name?: string;
  output?: string;
  unchanged?: boolean;
  error?: string;
}

export interface PluginProvidersPutRequest {
  memory_provider?: string;
  context_engine?: string;
}
