"""ACP adapter test requirements.

These tests exercise optional ACP adapter behavior and import ``acp`` at module
scope.  If the optional agent-client-protocol dependency is absent, ignore the
test modules during collection so unrelated full-suite runs can continue.
"""

import importlib.util
from pathlib import Path


_ACP_AVAILABLE = importlib.util.find_spec("acp") is not None


def pytest_ignore_collect(collection_path, config):  # noqa: ANN001
    if _ACP_AVAILABLE:
        return False
    path = Path(str(collection_path))
    return path.name.startswith("test_") and path.suffix == ".py"
