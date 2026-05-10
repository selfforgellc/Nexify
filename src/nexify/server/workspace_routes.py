from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException

from nexify.workspace import ProjectNotFoundError, WorkspaceError, WorkspaceRegistry

from nexify.workspace.files import WorkspaceFileBrowser, WorkspaceFileBrowserError

workspace_router = APIRouter(prefix="/api/workspace", tags=["workspace"])


def _project_to_response(project) -> dict[str, Any]:
    return {
        "id": project.id,
        "name": project.name,
        "type": project.type,
        "description": project.description,
        "localPath": project.local_path,
        "repoUrl": project.repo_url,
        "branch": project.branch,
        "frontend": project.frontend,
        "backend": project.backend,
        "ai": project.ai,
        "rules": project.rules,
        "status": project.status,
    }


@workspace_router.get("/projects")
def list_projects() -> dict[str, Any]:
    try:
        registry = WorkspaceRegistry()
        projects = [_project_to_response(project) for project in registry.list_projects()]
        return {"projects": projects}
    except WorkspaceError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@workspace_router.get("/projects/{project_id}")
def get_project(project_id: str) -> dict[str, Any]:
    try:
        registry = WorkspaceRegistry()
        return {"project": _project_to_response(registry.load_project(project_id))}
    except ProjectNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except WorkspaceError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@workspace_router.get("/projects/{project_id}/files")
def list_project_files(project_id: str, path: str = ".") -> dict[str, Any]:
    try:
        registry = WorkspaceRegistry()
        project = registry.load_project(project_id)
        browser = WorkspaceFileBrowser(project.local_path)

        files = [
            {
                "name": file.name,
                "path": file.path,
                "relativePath": file.relative_path,
                "type": file.type,
                "sizeBytes": file.size_bytes,
            }
            for file in browser.list_files(path)
        ]

        return {
            "projectId": project.id,
            "path": path,
            "files": files,
        }
    except ProjectNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except WorkspaceFileBrowserError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except WorkspaceError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@workspace_router.get("/projects/{project_id}/files/read")
def read_project_file(project_id: str, path: str) -> dict[str, Any]:
    try:
        registry = WorkspaceRegistry()
        project = registry.load_project(project_id)
        browser = WorkspaceFileBrowser(project.local_path)

        return {
            "projectId": project.id,
            "file": browser.read_file(path),
        }
    except ProjectNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except WorkspaceFileBrowserError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except WorkspaceError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
