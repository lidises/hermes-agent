"""ACP test requirements.

The ACP adapter is optional at runtime.  When the optional
agent-client-protocol dependency is absent, ignore ACP test modules during
collection instead of failing the entire repository test suite with import
errors from test modules that import ``acp`` at module scope.
"""

import importlib.util
from pathlib import Path


_ACP_AVAILABLE = importlib.util.find_spec("acp") is not None


def pytest_ignore_collect(collection_path, config):  # noqa: ANN001
    if _ACP_AVAILABLE:
        return False
    path = Path(str(collection_path))
    return path.name.startswith("test_") and path.suffix == ".py"
