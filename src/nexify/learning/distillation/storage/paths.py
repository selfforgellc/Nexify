"""Filesystem path resolution for the distillation subsystem.

The keystone of artifact isolation (spec §11): the resolved distillation root
must NEVER be inside the nexify source tree. ``resolve_distillation_root``
walks up from this module's ``__file__`` looking for a ``pyproject.toml`` that
identifies the nexify source root, then refuses to operate if the resolved
root is inside it. Defense in depth — if a user accidentally points
``nexify_HOME`` at the repo, the system fails loudly instead of silently
writing artifacts into the working tree.
"""

from __future__ import annotations

import os
from pathlib import Path

from nexify.security.file_utils import secure_mkdir


class ConfigurationError(RuntimeError):
    """Raised when path configuration would violate isolation guarantees."""


def _find_source_root() -> Path | None:
    """Walk upward from this module to find the nexify source root.

    Returns the directory containing the nexify ``pyproject.toml``, or
    ``None`` if no such file is found (e.g. when running from an installed
    wheel rather than a source checkout).
    """
    here = Path(__file__).resolve()
    for candidate in (here, *here.parents):
        py = candidate / "pyproject.toml"
        if py.exists():
            try:
                content = py.read_text(encoding="utf-8")
            except OSError:
                continue
            if 'name = "nexify"' in content.lower():
                return candidate
    return None


def _resolve_nexify_home() -> Path:
    """Resolve the nexify_HOME directory (env var or default)."""
    env = os.environ.get("nexify_HOME")
    if env:
        return Path(env).expanduser().resolve()
    return (Path.home() / ".nexify").resolve()


def resolve_distillation_root() -> Path:
    """Return the absolute path of the distillation root directory.

    The root is ``$nexify_HOME/learning`` (or ``~/.nexify/learning``
    by default). Raises ``ConfigurationError`` if the resolved path lies
    inside the nexify source tree, to prevent dev artifacts from leaking
    into the repo.
    """
    home = _resolve_nexify_home()
    source_root = _find_source_root()
    if source_root is not None:
        try:
            home.relative_to(source_root)
        except ValueError:
            pass  # Good — not inside the source tree.
        else:
            raise ConfigurationError(
                f"nexify_HOME ({home}) is inside the source tree "
                f"({source_root}). Distillation refuses to write runtime "
                "artifacts inside the nexify repo. Set nexify_HOME "
                "to a directory outside the repo (default: ~/.nexify)."
            )
    return home / "learning"


def ensure_distillation_dirs() -> Path:
    """Create the distillation directory layout if missing.

    Returns the distillation root. Creates ``sessions/``, ``benchmarks/``,
    ``benchmarks/reference_outputs/``, and ``pending_review/`` underneath it,
    all with restrictive ``0o700`` permissions via ``secure_mkdir``.
    """
    root = resolve_distillation_root()
    secure_mkdir(root)
    secure_mkdir(root / "sessions")
    secure_mkdir(root / "benchmarks")
    secure_mkdir(root / "benchmarks" / "reference_outputs")
    secure_mkdir(root / "pending_review")
    return root

