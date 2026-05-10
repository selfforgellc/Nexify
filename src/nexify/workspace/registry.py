from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any


class WorkspaceError(Exception):
    """Base error for workspace registry failures."""


class ProjectNotFoundError(WorkspaceError):
    """Raised when a project profile cannot be found."""


@dataclass(frozen=True)
class ProjectProfile:
    id: str
    name: str
    type: str
    description: str
    local_path: str
    repo_url: str
    branch: str
    frontend: dict[str, Any]
    backend: dict[str, Any]
    ai: dict[str, Any]
    rules: dict[str, Any]
    status: str

    @classmethod
    def from_dict(cls, data: dict[str, Any]) -> "ProjectProfile":
        required = [
            "id",
            "name",
            "type",
            "description",
            "localPath",
            "repoUrl",
            "branch",
            "frontend",
            "backend",
            "ai",
            "rules",
            "status",
        ]

        missing = [key for key in required if key not in data]
        if missing:
            raise WorkspaceError(f"Project profile missing required fields: {', '.join(missing)}")

        return cls(
            id=str(data["id"]),
            name=str(data["name"]),
            type=str(data["type"]),
            description=str(data["description"]),
            local_path=str(data["localPath"]),
            repo_url=str(data["repoUrl"]),
            branch=str(data["branch"]),
            frontend=dict(data["frontend"]),
            backend=dict(data["backend"]),
            ai=dict(data["ai"]),
            rules=dict(data["rules"]),
            status=str(data["status"]),
        )


class WorkspaceRegistry:
    def __init__(self, root: Path | None = None) -> None:
        self.root = root or Path.cwd() / "workspace"
        self.projects_dir = self.root / "projects"

    def list_projects(self) -> list[ProjectProfile]:
        if not self.projects_dir.exists():
            return []

        projects: list[ProjectProfile] = []

        for file_path in sorted(self.projects_dir.glob("*.json")):
            projects.append(self.load_project(file_path.stem))

        return projects

    def load_project(self, project_id: str) -> ProjectProfile:
        file_path = self.projects_dir / f"{project_id}.json"

        if not file_path.exists():
            raise ProjectNotFoundError(f"Project profile not found: {project_id}")

        try:
            data = json.loads(file_path.read_text(encoding="utf-8"))
        except json.JSONDecodeError as exc:
            raise WorkspaceError(f"Invalid project JSON in {file_path}: {exc}") from exc

        return ProjectProfile.from_dict(data)
