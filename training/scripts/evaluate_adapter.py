#!/usr/bin/env python3
"""Lightweight text-based evaluation harness for Nexify outputs."""
from __future__ import annotations

import argparse
import json
import subprocess
from pathlib import Path

def run_ollama(model: str, prompt: str) -> str:
    result = subprocess.run(["ollama", "run", model, prompt], capture_output=True, text=True, timeout=180)
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or result.stdout.strip())
    return result.stdout.strip()

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dataset", required=True)
    parser.add_argument("--model", default="nexify-coder")
    args = parser.parse_args()
    total = 0
    passed = 0
    for line in Path(args.dataset).read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        total += 1
        case = json.loads(line)
        output = run_ollama(args.model, case["prompt"])
        missing = [term for term in case.get("must_include", []) if term.lower() not in output.lower()]
        if missing:
            print(f"FAIL {case['id']}: missing {missing}\nOUTPUT:\n{output}\n")
        else:
            print(f"PASS {case['id']}")
            passed += 1
    print(f"Score: {passed}/{total}")
    return 0 if passed == total else 1

if __name__ == "__main__":
    raise SystemExit(main())
