#!/usr/bin/env python3
"""Validate Nexify chat/instruction JSONL datasets."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

VALID_ROLES = {"system", "user", "assistant", "tool"}

def validate_record(record: dict, line_no: int) -> list[str]:
    errors: list[str] = []
    messages = record.get("messages")
    if not isinstance(messages, list) or not messages:
        return [f"line {line_no}: missing non-empty messages list"]
    for i, msg in enumerate(messages):
        if not isinstance(msg, dict):
            errors.append(f"line {line_no}: message {i} is not an object")
            continue
        role = msg.get("role")
        content = msg.get("content")
        if role not in VALID_ROLES:
            errors.append(f"line {line_no}: message {i} invalid role {role!r}")
        if not isinstance(content, str) or not content.strip():
            errors.append(f"line {line_no}: message {i} missing content")
    if not any(m.get("role") == "assistant" for m in messages if isinstance(m, dict)):
        errors.append(f"line {line_no}: no assistant message")
    return errors

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True, help="Path to JSONL dataset")
    args = parser.parse_args()
    path = Path(args.input)
    if not path.exists():
        raise SystemExit(f"Dataset not found: {path}")
    errors: list[str] = []
    count = 0
    with path.open("r", encoding="utf-8") as f:
        for line_no, line in enumerate(f, 1):
            if not line.strip():
                continue
            count += 1
            try:
                record = json.loads(line)
            except json.JSONDecodeError as exc:
                errors.append(f"line {line_no}: invalid JSON: {exc}")
                continue
            errors.extend(validate_record(record, line_no))
    if errors:
        print("Dataset validation failed:")
        for error in errors[:100]:
            print(f" - {error}")
        if len(errors) > 100:
            print(f"...and {len(errors) - 100} more")
        return 1
    print(f"Dataset OK: {count} records")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
