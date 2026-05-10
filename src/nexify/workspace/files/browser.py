from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


IGNORED_DIRS = {
    ".git",
    ".venv",
    "node_modules",
    "dist",
    "build",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
}

MAX_FILES = 500
MAX_READ_BYTES = 250_000

ALLOWED_TEXT_EXTENSIONS = {
    ".py",
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".json",
    ".toml",
    ".md",
    ".txt",
    ".css",
    ".html",
    ".yml",
    ".yaml",
    ".env.example",
}


@dataclass(frozen=True)
class FileEntry:
    name: str
    path: str
    relative_path: str
    type: str
    size_bytes: int


class WorkspaceFileBrowserError(Exception):
    """Raised when workspace file browsing fails."""


class WorkspaceFileBrowser:
    def __init__(self, project_root: str) -> None:
        self.project_root = Path(project_root).resolve()

        if not self.project_root.exists():
            raise WorkspaceFileBrowserError(
                f"Project root does not exist: {self.project_root}"
            )

        if not self.project_root.is_dir():
            raise WorkspaceFileBrowserError(
                f"Project root is not a directory: {self.project_root}"
            )

    def list_files(self, relative_path: str = ".") -> list[FileEntry]:
        target = (self.project_root / relative_path).resolve()

        if not self._is_inside_project(target):
            raise WorkspaceFileBrowserError("Requested path escapes project root.")

        if not target.exists():
            raise WorkspaceFileBrowserError(f"Path does not exist: {relative_path}")

        if not target.is_dir():
            raise WorkspaceFileBrowserError(f"Path is not a directory: {relative_path}")

        entries: list[FileEntry] = []

        for child in sorted(target.iterdir(), key=lambda item: (not item.is_dir(), item.name.lower())):
            if child.name in IGNORED_DIRS:
                continue

            relative = child.relative_to(self.project_root).as_posix()

            entries.append(
                FileEntry(
                    name=child.name,
                    path=str(child),
                    relative_path=relative,
                    type="directory" if child.is_dir() else "file",
                    size_bytes=child.stat().st_size if child.is_file() else 0,
                )
            )

            if len(entries) >= MAX_FILES:
                break

        return entries

    def read_file(self, relative_path: str) -> dict[str, object]:
        target = (self.project_root / relative_path).resolve()

        if not self._is_inside_project(target):
            raise WorkspaceFileBrowserError("Requested file escapes project root.")

        if not target.exists():
            raise WorkspaceFileBrowserError(f"File does not exist: {relative_path}")

        if not target.is_file():
            raise WorkspaceFileBrowserError(f"Path is not a file: {relative_path}")

        if target.name in IGNORED_DIRS:
            raise WorkspaceFileBrowserError("Requested file is ignored.")

        suffix = target.suffix.lower()
        if suffix not in ALLOWED_TEXT_EXTENSIONS and target.name not in ALLOWED_TEXT_EXTENSIONS:
            raise WorkspaceFileBrowserError(f"File type is not allowed for reading: {suffix or target.name}")

        size_bytes = target.stat().st_size
        if size_bytes > MAX_READ_BYTES:
            raise WorkspaceFileBrowserError(
                f"File is too large to read safely: {size_bytes} bytes"
            )

        return {
            "name": target.name,
            "path": str(target),
            "relativePath": target.relative_to(self.project_root).as_posix(),
            "sizeBytes": size_bytes,
            "content": target.read_text(encoding="utf-8", errors="replace"),
        }

    def _is_inside_project(self, path: Path) -> bool:
        try:
            path.relative_to(self.project_root)
            return True
        except ValueError:
            return False

