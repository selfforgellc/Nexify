#!/usr/bin/env bash
# jarvis-uninstall.sh — clean removal of nexify from $HOME.
#
# Removes:
#   ~/.nexify/
#   ~/.local/bin/jarvis
#   ~/.local/bin/jarvis-uninstall
#
# Does NOT remove: ollama, uv, or the Rust toolchain.

set -euo pipefail

nexify_HOME="${nexify_HOME:-$HOME/.nexify}"

if [[ -f "$nexify_HOME/.state/bg.pid" ]]; then
    pid=$(cat "$nexify_HOME/.state/bg.pid" 2>/dev/null || echo "")
    if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
        echo "Stopping background work (pid=$pid)..."
        kill "$pid" 2>/dev/null || true
    fi
fi

if command -v ollama >/dev/null 2>&1; then
    ollama stop >/dev/null 2>&1 || true
fi

if [[ -d "$nexify_HOME" ]]; then
    rm -rf "$nexify_HOME"
    echo "Removed $nexify_HOME"
fi

for f in "$HOME/.local/bin/jarvis" "$HOME/.local/bin/jarvis-uninstall"; do
    if [[ -L "$f" ]] || [[ -f "$f" ]]; then
        rm -f "$f"
        echo "Removed $f"
    fi
done

cat <<EOF

nexify removed.

Left intact (may be used by other tools):
  - Ollama       (uninstall: brew uninstall ollama  /  rm -f /usr/local/bin/ollama)
  - uv           (uninstall: rm -rf ~/.local/share/uv ~/.cargo/bin/uv)
  - Rust toolchain (uninstall: rustup self uninstall)
EOF

