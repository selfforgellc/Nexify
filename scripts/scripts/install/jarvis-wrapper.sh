#!/usr/bin/env bash
# jarvis-wrapper.sh — symlinked to ~/.local/bin/jarvis.
# Activates the managed venv and execs the real jarvis CLI.

nexify_HOME="${nexify_HOME:-$HOME/.nexify}"
VENV="$nexify_HOME/.venv"

if [[ ! -d "$VENV" ]]; then
    echo "jarvis: venv not found at $VENV" >&2
    echo "Re-run the installer: curl -fsSL https://nexify.ai/install.sh | bash" >&2
    exit 1
fi

exec "$VENV/bin/jarvis" "$@"

