# Installation

nexify ships a one-line installer for macOS, Linux, and WSL2.

```bash
curl -fsSL https://nexify.ai/install.sh | bash
```

About 3 minutes on a typical broadband connection. Type `jarvis` to start chatting.

## What the installer does

| Phase | Step | Where |
|---|---|---|
| Foreground | Install `uv` (Python package manager) | `~/.cargo/bin/` or `~/.local/bin/` |
| Foreground | Clone nexify repo | `~/.nexify/src/` |
| Foreground | Create Python 3.11 venv | `~/.nexify/.venv/` |
| Foreground | `uv pip install -e .` (editable install) | venv |
| Foreground | Install Ollama | system default |
| Foreground | Start `ollama serve` | systemd-user / launchd / nohup |
| Foreground | Pull `qwen3.5:2b` (~1.5 GB) | Ollama's model store |
| Foreground | Write `config.toml` (auto-detected hardware + engine + model) | `~/.nexify/config.toml` |
| Foreground | Symlink `jarvis` and `jarvis-uninstall` | `~/.local/bin/` |
| Foreground | Add `~/.local/bin` to PATH if missing (with on-screen notice) | `~/.bashrc` or `~/.zshrc` |
| Background | Install Rust toolchain via rustup | `~/.cargo/` |
| Background | Build the maturin extension (memory + security features) | venv |
| Background | Pull hardware-tier and tier+1 models | Ollama's model store |

## What the installer does NOT touch

- Your existing Python installations
- Your `~/.bashrc` / `~/.zshrc` other than appending one PATH line (with on-screen notice)
- Your existing Ollama models
- Any other tool or dotfile

## Idempotent re-runs

Re-running the curl line is safe. The installer reads `~/.nexify/.state/install-state.json` and skips completed steps. If your venv got nuked, re-running heals it.

## Cloud quick-path

If any of these env vars are set when you install or run `jarvis init`, the installer/init proposes cloud as the default and writes the matching provider into `config.toml`:

- `OPENROUTER_API_KEY`
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_API_KEY` (or `GEMINI_API_KEY`)

Local-first remains the default when no key is in env. Precedence is OpenRouter > Anthropic > OpenAI > Google.

## Flags

| Flag | Effect |
|---|---|
| `--minimal` | Skip the foreground model pull. First chat will need to wait for the bg pull to finish. |
| `--no-bg-orchestrator` | Don't detach the background work pipeline. (Mostly for testing.) |
| `--force` | Re-run all steps even if `install-state.json` says they're done. |

## Environment overrides

| Variable | Default | Purpose |
|---|---|---|
| `nexify_HOME` | `$HOME/.nexify` | Install location. |
| `nexify_REPO_URL` | `https://github.com/open-jarvis/nexify.git` | Source repo for the clone step. |

## Uninstall

```bash
jarvis-uninstall
```

Removes `~/.nexify/`, `~/.local/bin/jarvis`, and `~/.local/bin/jarvis-uninstall`. Leaves Ollama, uv, and the Rust toolchain in place (they may be used by other tools); the script prints removal hints.

## Updating

```bash
jarvis update
```

Pulls the latest source, refreshes the editable install, and rebuilds the Rust extension in the background. Models are not touched.

## Troubleshooting

### "command not found: jarvis"

`~/.local/bin` isn't on your PATH. Run `source ~/.bashrc` (or `~/.zshrc`) or open a new terminal.

### "memory features unavailable"

Rust extension hasn't finished building yet (or failed). Check status:

```bash
jarvis doctor
```

Manually retry:

```bash
~/.nexify/.scripts/install-rust.sh && ~/.nexify/.scripts/build-extension.sh
```

### A bigger model failed to download

Check status and retry:

```bash
jarvis doctor
~/.nexify/.scripts/pull-model.sh qwen3.5:9b
```

### Behind a corporate proxy

Set `HTTPS_PROXY` and `CURL_CA_BUNDLE` in your environment before running the installer.

