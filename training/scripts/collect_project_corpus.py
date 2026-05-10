#!/usr/bin/env python3
"""Collect a safe project text corpus for Nexify RAG/dataset building."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

INCLUDE_EXTS = {".py", ".ts", ".tsx", ".js", ".jsx", ".md", ".toml", ".json", ".yml", ".yaml", ".css", ".html", ".sh", ".ps1"}
EXCLUDE_DIRS = {".git", ".venv", "node_modules", "dist", "build", "__pycache__", ".next", ".turbo"}
MAX_FILE_BYTES = 200_000
SECRET_MARKERS = ("api_key", "secret", "token", "password", "private_key", "BEGIN RSA", "BEGIN OPENSSH")

def should_skip(path: Path) -> bool:
    parts = set(path.parts)
    if parts & EXCLUDE_DIRS:
        return True
    if path.suffix.lower() not in INCLUDE_EXTS:
        return True
    try:
        if path.stat().st_size > MAX_FILE_BYTES:
            return True
    except OSError:
        return True
    return False

def looks_sensitive(text: str) -> bool:
    lowered = text.lower()
    return any(marker.lower() in lowered for marker in SECRET_MARKERS)

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--output", required=True)
    args = parser.parse_args()
    root = Path(args.root).resolve()
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    skipped_sensitive = 0
    with output.open("w", encoding="utf-8") as out:
        for path in root.rglob("*"):
            if not path.is_file() or should_skip(path):
                continue
            try:
                text = path.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            if looks_sensitive(text):
                skipped_sensitive += 1
                continue
            rel = path.relative_to(root).as_posix()
            out.write(json.dumps({"path": rel, "text": text[:MAX_FILE_BYTES]}, ensure_ascii=False) + "\n")
            count += 1
    print(f"Wrote {count} corpus records to {output}")
    if skipped_sensitive:
        print(f"Skipped {skipped_sensitive} potentially sensitive files")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
