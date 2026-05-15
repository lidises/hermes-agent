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
