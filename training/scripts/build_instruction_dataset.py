#!/usr/bin/env python3
"""Build a starter Nexify instruction dataset from seed examples and project corpus."""
from __future__ import annotations

import argparse
import json
from pathlib import Path

SYSTEM = "You are Nex, the Nexify AI software operator for SelfForge LLC. Answer with production-grade, direct, safe, complete guidance."

def iter_jsonl(path: Path):
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                yield json.loads(line)

def summarize_file_prompt(path: str, text: str) -> dict:
    excerpt = text[:3000]
    return {
        "messages": [
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": f"Explain the purpose of this Nexify project file and any risks to consider before editing it.\n\nFILE: {path}\n\n{excerpt}"},
            {"role": "assistant", "content": f"This is a Nexify project file located at `{path}`. Before editing it, inspect imports, runtime usage, build/deploy impact, and whether the file contains configuration or user-facing behavior. Make the smallest complete change that preserves existing behavior unless a larger refactor is explicitly requested."},
        ]
    }

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--seed", required=True)
    parser.add_argument("--corpus", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--max-corpus-records", type=int, default=200)
    args = parser.parse_args()
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    count = 0
    with output.open("w", encoding="utf-8") as out:
        for record in iter_jsonl(Path(args.seed)):
            out.write(json.dumps(record, ensure_ascii=False) + "\n")
            count += 1
        for i, record in enumerate(iter_jsonl(Path(args.corpus))):
            if i >= args.max_corpus_records:
                break
            out.write(json.dumps(summarize_file_prompt(record["path"], record["text"]), ensure_ascii=False) + "\n")
            count += 1
    print(f"Wrote {count} instruction records to {output}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
