"""Contract-only AI Office controlled mutation schema.

This module intentionally exposes no executable mutation, persistence, adapter,
or audit behavior. It returns a fixed allowlisted contract shape that the
protected dashboard API can display before any future authority implementation
exists.
"""

from __future__ import annotations

import re
from collections.abc import Mapping, Sequence
from typing import Any

_AUTHORITY_LEVELS = [
    "display_only",
    "request_only",
    "dry_run_only",
    "human_approved_execute",
    "break_glass_admin",
]

_ALLOWED_ACTION_KINDS = [
    "kanban_transition",
    "kanban_comment",
    "projection_promote",
    "projection_reject",
    "nas_save_request",
    "watcher_enable_request",
    "service_restart_request",
]

_EVENT_KINDS = [
    "action_requested",
    "dry_run_completed",
    "human_decision_recorded",
    "execution_started",
    "execution_completed",
    "execution_blocked",
]

_DISABLED_CAPABILITIES = {
    "request_creation_enabled": False,
    "dry_run_execution_enabled": False,
    "human_decision_recording_enabled": False,
    "authority_adapter_enabled": False,
    "target_mutation_enabled": False,
    "audit_write_enabled": False,
    "nas_save_enabled": False,
}

_REDACTION_POSTURE = {
    "raw_excluded": True,
    "allowlisted_fields_only": True,
    "opaque_refs_only": True,
}

_REQUEST_EVENT_FIELDS = {
    "request_id",
    "correlation_id",
    "actor_ref",
    "intent_kind",
    "action_kind",
    "authority_level",
    "risk_class",
    "target_ref",
    "reason_code",
    "safe_summary",
    "evidence_refs",
    "requested_at",
}

_REQUEST_EVENT_ACTION_KINDS = {"kanban_comment"}
_REQUEST_EVENT_AUTHORITY_LEVELS = {"request_only"}
_REQUEST_EVENT_RISK_CLASSES = {"low", "medium", "high"}
_OPAQUE_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.:-]{2,119}$")
_OPAQUE_REF_RE = re.compile(r"^[A-Za-z][A-Za-z0-9_-]{1,40}:[A-Za-z0-9][A-Za-z0-9_.:-]{1,160}$")
_SAFE_TEXT_RE = re.compile(r"^[^<>\\]{1,240}$")
_ISO_UTC_RE = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$")


def _error(field: str, code: str) -> dict[str, str]:
    return {"field": field, "code": code}


def _is_opaque_id(value: object) -> bool:
    return isinstance(value, str) and bool(_OPAQUE_ID_RE.fullmatch(value)) and "/" not in value and ".." not in value


def _is_opaque_ref(value: object) -> bool:
    return isinstance(value, str) and bool(_OPAQUE_REF_RE.fullmatch(value)) and "/" not in value and ".." not in value


def _is_safe_text(value: object) -> bool:
    lowered = value.lower() if isinstance(value, str) else ""
    raw_markers = ("traceback", "/users/", "sk-", "token", "provider", "raw prompt", "raw task")
    return isinstance(value, str) and bool(_SAFE_TEXT_RE.fullmatch(value)) and not any(marker in lowered for marker in raw_markers)


def _validate_evidence_refs(value: object) -> bool:
    if not isinstance(value, Sequence) or isinstance(value, (str, bytes)):
        return False
    if len(value) > 8:
        return False
    return all(_is_opaque_ref(item) for item in value)


def build_office_controlled_mutation_contract_schema(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-executable controlled-mutation contract descriptor.

    ``unsafe_examples`` is accepted only for tests and future callers that need
    to verify the boundary: values are deliberately ignored so raw prompt/task
    body/transcript/path/provider/token material can never be echoed.
    """

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "contract_only",
        "authority_levels": list(_AUTHORITY_LEVELS),
        "allowed_action_kinds": list(_ALLOWED_ACTION_KINDS),
        "event_kinds": list(_EVENT_KINDS),
        "capabilities": dict(_DISABLED_CAPABILITIES),
        "redaction": dict(_REDACTION_POSTURE),
        "contract_notes": [
            "allowed_action_kinds are descriptive contract vocabulary only",
            "all executable capabilities remain disabled until separately approved",
        ],
        "mutation_endpoints": [],
    }


def validate_office_controlled_mutation_request_event(payload: object) -> dict[str, object]:
    """Validate a safe, non-persisted controlled-mutation request DTO.

    The validator is intentionally pure: it creates no request, writes no audit
    event, calls no adapter, and never echoes unsupported/raw fields or values.
    """

    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    if set(payload) - _REQUEST_EVENT_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))

    required_fields = sorted(_REQUEST_EVENT_FIELDS)
    for field in required_fields:
        if field not in payload:
            errors.append(_error(field, "missing_field"))

    if "request_id" in payload and not _is_opaque_id(payload.get("request_id")):
        errors.append(_error("request_id", "invalid_opaque_id"))
    if "correlation_id" in payload and not _is_opaque_id(payload.get("correlation_id")):
        errors.append(_error("correlation_id", "invalid_opaque_id"))
    if "actor_ref" in payload and not _is_opaque_ref(payload.get("actor_ref")):
        errors.append(_error("actor_ref", "invalid_opaque_ref"))
    if "target_ref" in payload and not _is_opaque_ref(payload.get("target_ref")):
        errors.append(_error("target_ref", "invalid_opaque_ref"))
    if "evidence_refs" in payload and not _validate_evidence_refs(payload.get("evidence_refs")):
        errors.append(_error("evidence_refs", "invalid_opaque_ref"))

    if payload.get("intent_kind") != "action_requested":
        errors.append(_error("intent_kind", "unsupported_request_event_intent"))
    if "action_kind" in payload and payload.get("action_kind") not in _REQUEST_EVENT_ACTION_KINDS:
        errors.append(_error("action_kind", "unsupported_request_event_action"))
    if "authority_level" in payload and payload.get("authority_level") not in _REQUEST_EVENT_AUTHORITY_LEVELS:
        errors.append(_error("authority_level", "unsupported_request_event_authority"))
    if "risk_class" in payload and payload.get("risk_class") not in _REQUEST_EVENT_RISK_CLASSES:
        errors.append(_error("risk_class", "unsupported_risk_class"))

    for field in ("reason_code", "safe_summary"):
        if field in payload and not _is_safe_text(payload.get(field)):
            errors.append(_error(field, "invalid_safe_text"))
    if "requested_at" in payload and not (isinstance(payload.get("requested_at"), str) and _ISO_UTC_RE.fullmatch(payload["requested_at"])):
        errors.append(_error("requested_at", "invalid_timestamp"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "validated_request_event",
        "request_id": payload["request_id"],
        "correlation_id": payload["correlation_id"],
        "actor_ref": payload["actor_ref"],
        "intent_kind": payload["intent_kind"],
        "action_kind": payload["action_kind"],
        "authority_level": payload["authority_level"],
        "risk_class": payload["risk_class"],
        "target_ref": payload["target_ref"],
        "reason_code": payload["reason_code"],
        "safe_summary": payload["safe_summary"],
        "evidence_refs": list(payload["evidence_refs"]),
        "requested_at": payload["requested_at"],
        "capabilities": {
            "request_creation_enabled": False,
            "persistence_enabled": False,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": dict(_REDACTION_POSTURE),
    }
    return {"valid": True, "errors": [], "dto": dto}


def build_office_controlled_mutation_event_persistence_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-writing event persistence contract descriptor.

    ``unsafe_examples`` is accepted only to prove boundary behavior. Values are
    deliberately ignored so raw prompt/task body/transcript/path/provider/token
    material can never be echoed.
    """

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "event_persistence_contract_only",
        "event_store": {
            "implementation_enabled": False,
            "append_enabled": False,
            "readback_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "accepted_event_kinds": list(_EVENT_KINDS),
        "required_envelope_fields": [
            "event_id",
            "correlation_id",
            "request_id",
            "event_kind",
            "actor_ref",
            "target_ref",
            "safe_summary",
            "evidence_refs",
            "created_at",
        ],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "request_creation_enabled": False,
            "event_append_enabled": False,
            "audit_write_enabled": False,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future persistence only; no event is appended",
            "storage backend, migration, retention, and audit sink require separate approval",
        ],
    }


def build_office_controlled_mutation_audit_sink_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-writing audit sink contract descriptor.

    ``unsafe_examples`` is deliberately ignored so private raw audit material,
    prompts, transcripts, paths, providers, tokens, and topic ids are never
    echoed by the contract helper.
    """

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "audit_sink_contract_only",
        "audit_sink": {
            "implementation_enabled": False,
            "write_enabled": False,
            "append_enabled": False,
            "readback_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "accepted_event_kinds": list(_EVENT_KINDS),
        "result_postures": ["info", "warning", "blocked", "success"],
        "required_audit_fields": [
            "audit_ref",
            "event_at",
            "event_kind",
            "result_posture",
            "safe_summary",
        ],
        "optional_safe_refs": ["request_ref", "dry_run_ref", "decision_ref", "action_kind"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "audit_write_enabled": False,
            "audit_append_enabled": False,
            "audit_readback_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "audit_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future audit sink shape only; no audit event is written",
            "audit storage, append route, retention, and readback require separate approval",
        ],
    }


def build_office_controlled_mutation_approval_decision_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-recording human approval decision contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "approval_decision_contract_only",
        "decision_store": {
            "implementation_enabled": False,
            "recording_enabled": False,
            "append_enabled": False,
            "readback_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "allowed_decisions": ["approve", "reject", "defer"],
        "approval_scope": "single_action_only",
        "required_decision_fields": [
            "decision_ref",
            "request_ref",
            "dry_run_ref",
            "decided_at",
            "decision",
            "decided_by",
            "approval_scope",
            "expires_at",
        ],
        "optional_safe_fields": ["comment_summary"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "human_decision_recording_enabled": False,
            "decision_append_enabled": False,
            "decision_readback_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "decision_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future human decision shape only; no decision is recorded",
            "decision route, storage, expiry enforcement, and audit write require separate approval",
        ],
    }


def build_office_controlled_mutation_dry_run_evidence_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-executing dry-run evidence contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "dry_run_evidence_contract_only",
        "dry_run_engine": {
            "implementation_enabled": False,
            "execution_enabled": False,
            "result_recording_enabled": False,
            "readback_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "required_evidence_fields": [
            "dry_run_ref",
            "request_ref",
            "authority_candidate_ref",
            "started_at",
            "completed_at",
            "result",
            "risk_class",
            "simulated_steps",
            "rollback_preview_ref",
            "evidence_refs",
        ],
        "allowed_results": ["would_succeed", "would_fail", "blocked", "unknown"],
        "required_step_fields": [
            "step_ref",
            "operation_kind",
            "target_ref",
            "expected_effect_summary",
            "blocked_reason",
        ],
        "optional_safe_fields": ["summary", "warning_count", "evidence_count"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "dry_run_execution_enabled": False,
            "dry_run_result_recording_enabled": False,
            "dry_run_readback_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "dry_run_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future dry-run evidence shape only; no dry-run is executed",
            "dry-run engine, result recording, readback, and audit write require separate approval",
        ],
    }


def build_office_controlled_mutation_authority_adapter_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-implementing authority adapter contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "authority_adapter_contract_only",
        "adapter": {
            "implementation_enabled": False,
            "dispatch_enabled": False,
            "binding_enabled": False,
            "credential_access_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "required_authority_fields": [
            "authority_candidate_ref",
            "request_ref",
            "dry_run_ref",
            "decision_ref",
            "actor_ref",
            "risk_class",
            "scope",
            "expires_at",
            "required_capabilities",
        ],
        "allowed_authority_scopes": [
            "single_action",
            "bounded_batch",
            "read_only_projection",
        ],
        "required_capability_fields": [
            "capability_ref",
            "operation_kind",
            "target_ref",
            "permission_posture",
            "blocked_reason",
        ],
        "optional_safe_fields": ["summary", "capability_count", "warning_count"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "adapter_implementation_enabled": False,
            "adapter_dispatch_enabled": False,
            "adapter_binding_enabled": False,
            "credential_access_enabled": False,
            "target_mutation_enabled": False,
            "dry_run_execution_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "human_decision_recording_enabled": False,
            "nas_save_enabled": False,
        },
        "adapter_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future authority adapter shape only; no adapter is implemented or bound",
            "adapter implementation, dispatch, credential access, storage, and audit write require separate approval",
        ],
    }


def build_office_controlled_mutation_execution_readiness_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-executing execution readiness contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "execution_readiness_contract_only",
        "execution": {
            "implementation_enabled": False,
            "execution_enabled": False,
            "dispatch_enabled": False,
            "target_mutation_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "required_readiness_fields": [
            "readiness_ref",
            "request_ref",
            "authority_candidate_ref",
            "dry_run_ref",
            "decision_ref",
            "audit_preview_ref",
            "rollback_preview_ref",
            "risk_class",
            "gate_status",
            "blocked_reasons",
            "required_confirmations",
        ],
        "allowed_gate_statuses": ["blocked", "ready_pending_approval", "ready_read_only", "not_evaluated"],
        "required_gate_fields": [
            "gate_ref",
            "gate_kind",
            "status",
            "evidence_ref",
            "blocked_reason",
        ],
        "optional_safe_fields": ["summary", "gate_count", "warning_count"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "execution_implementation_enabled": False,
            "execution_dispatch_enabled": False,
            "target_mutation_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_implementation_enabled": False,
            "authority_adapter_binding_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "human_decision_recording_enabled": False,
            "nas_save_enabled": False,
        },
        "execution_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future execution readiness shape only; no execution is implemented",
            "execution implementation, dispatch, target mutation, storage, and audit write require separate approval",
        ],
    }
