import json
from pathlib import Path

import pytest

from nexify.workspace import ProjectNotFoundError, WorkspaceError, WorkspaceRegistry


def write_project(projects_dir: Path, project_id: str = "nexify") -> None:
    projects_dir.mkdir(parents=True, exist_ok=True)

    payload = {
        "id": project_id,
        "name": "Nexify",
        "type": "ai_software_operator",
        "description": "SelfForge AI software operator and builder platform.",
        "localPath": "C:\\dev\\Nexify",
        "repoUrl": "https://github.com/selfforgellc/Nexify",
        "branch": "frontend-rebrand",
        "frontend": {
            "path": "C:\\dev\\Nexify\\frontend",
            "framework": "React + Vite + TypeScript",
            "deployTarget": "Vercel",
        },
        "backend": {
            "path": "C:\\dev\\Nexify",
            "framework": "Python package / Nexify API server",
            "deployTarget": "Render",
        },
        "ai": {
            "provider": "Ollama",
            "defaultModel": "nexify-coder",
            "baseModel": "qwen2.5-coder:7b",
        },
        "rules": {
            "requireApprovalBeforeWrite": True,
            "requireApprovalBeforeShell": True,
            "requireGitCheckpointBeforeMajorChange": True,
            "neverExposeOllamaPublicly": True,
        },
        "status": "active",
    }

    (projects_dir / f"{project_id}.json").write_text(
        json.dumps(payload, indent=2),
        encoding="utf-8",
    )


def test_workspace_registry_lists_projects(tmp_path: Path) -> None:
    workspace_root = tmp_path / "workspace"
    projects_dir = workspace_root / "projects"
    write_project(projects_dir)

    registry = WorkspaceRegistry(root=workspace_root)

    projects = registry.list_projects()

    assert len(projects) == 1
    assert projects[0].id == "nexify"
    assert projects[0].name == "Nexify"


def test_workspace_registry_loads_project(tmp_path: Path) -> None:
    workspace_root = tmp_path / "workspace"
    projects_dir = workspace_root / "projects"
    write_project(projects_dir)

    registry = WorkspaceRegistry(root=workspace_root)

    project = registry.load_project("nexify")

    assert project.id == "nexify"
    assert project.ai["defaultModel"] == "nexify-coder"
    assert project.rules["requireApprovalBeforeWrite"] is True


def test_workspace_registry_missing_project_raises(tmp_path: Path) -> None:
    registry = WorkspaceRegistry(root=tmp_path / "workspace")

    with pytest.raises(ProjectNotFoundError):
        registry.load_project("missing")


def test_workspace_registry_invalid_json_raises(tmp_path: Path) -> None:
    workspace_root = tmp_path / "workspace"
    projects_dir = workspace_root / "projects"
    projects_dir.mkdir(parents=True)

    (projects_dir / "broken.json").write_text("{ not valid json", encoding="utf-8")

    registry = WorkspaceRegistry(root=workspace_root)

    with pytest.raises(WorkspaceError):
        registry.load_project("broken")
