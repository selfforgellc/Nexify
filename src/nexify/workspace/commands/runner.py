from __future__ import annotations

import subprocess
from dataclasses import dataclass
from pathlib import Path
from typing import Any


class WorkspaceCommandError(Exception):
    """Raised when an approved workspace command cannot be executed."""


@dataclass(frozen=True)
class CommandResult:
    command_key: str
    command: str
    cwd: str
    return_code: int
    stdout: str
    stderr: str
    success: bool


class WorkspaceCommandRunner:
    def __init__(self, project: Any) -> None:
        self.project = project
        self.project_root = Path(project.local_path).resolve()

        if not self.project_root.exists():
            raise WorkspaceCommandError(
                f"Project root does not exist: {self.project_root}"
            )

    def run(self, command_key: str, timeout_seconds: int = 120) -> CommandResult:
        commands = getattr(self.project, "commands", None)

        if not isinstance(commands, dict) or command_key not in commands:
            raise WorkspaceCommandError(
                f"Command is not approved for this project: {command_key}"
            )

        command = str(commands[command_key]).strip()

        if not command:
            raise WorkspaceCommandError("Approved command is empty.")

        try:
            completed = subprocess.run(
                command,
                cwd=self.project_root,
                shell=True,
                text=True,
                capture_output=True,
                timeout=timeout_seconds,
            )
        except subprocess.TimeoutExpired as exc:
            return CommandResult(
                command_key=command_key,
                command=command,
                cwd=str(self.project_root),
                return_code=124,
                stdout=exc.stdout or "",
                stderr=f"Command timed out after {timeout_seconds} seconds.",
                success=False,
            )

        return CommandResult(
            command_key=command_key,
            command=command,
            cwd=str(self.project_root),
            return_code=completed.returncode,
            stdout=completed.stdout,
            stderr=completed.stderr,
            success=completed.returncode == 0,
        )

