"""External-framework subprocess backends (Hermes Agent, OpenClaw)."""

from nexify.evals.backends.external.hermes_agent import HermesBackend
from nexify.evals.backends.external.openclaw import OpenClawBackend

__all__ = ["HermesBackend", "OpenClawBackend"]

