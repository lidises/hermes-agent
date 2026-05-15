"""Contract-only AI Office controlled mutation schema.

This module intentionally exposes no executable mutation, persistence, adapter,
or audit behavior. It returns a fixed allowlisted contract shape that the
protected dashboard API can display before any future authority implementation
exists.
"""

from __future__ import annotations

from collections.abc import Mapping
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
