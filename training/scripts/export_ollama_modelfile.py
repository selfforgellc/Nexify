#!/usr/bin/env python3
"""Create an Ollama Modelfile for a trained adapter directory."""
from __future__ import annotations

import argparse
from pathlib import Path

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", required=True, help="Ollama base model name, e.g. llama3.1:8b")
    parser.add_argument("--adapter", required=True, help="Path to LoRA adapter directory")
    parser.add_argument("--output", default="training/outputs/Modelfile.adapter")
    args = parser.parse_args()
    adapter = Path(args.adapter).resolve()
    output = Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(f"FROM {args.base}\nADAPTER {adapter}\n", encoding="utf-8")
    print(f"Wrote {output}")
    print(f"Create with: ollama create nexify-trained -f {output}")
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
