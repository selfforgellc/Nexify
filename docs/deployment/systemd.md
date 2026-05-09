# systemd Service (Linux)

nexify includes a systemd unit file for running the API server as a managed background service on Linux. This provides automatic startup on boot, crash recovery, and integration with standard Linux service management tools.

## Prerequisites

Before installing the service, ensure that:

1. nexify is installed in a virtual environment at `/opt/nexify/.venv` (or adjust paths accordingly).
2. A dedicated `nexify` system user exists (recommended for security).
3. An inference engine (such as Ollama) is running and accessible.

Create the user and installation directory:

```bash
sudo useradd --system --create-home --home-dir /opt/nexify nexify
sudo -u nexify python3 -m venv /opt/nexify/.venv
sudo -u nexify git clone https://github.com/open-jarvis/nexify.git /opt/nexify/nexify
cd /opt/nexify/nexify && sudo -u nexify uv sync --extra server
```

## Installing the Service

Copy the unit file to the systemd directory, reload the daemon, and enable the service:

```bash
sudo cp deploy/systemd/nexify.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable nexify
sudo systemctl start nexify
```

Verify it is running:

```bash
sudo systemctl status nexify
```

## Service File Reference

The provided unit file at `deploy/systemd/nexify.service`:

```ini
[Unit]
Description=nexify API Server
After=network.target

[Service]
Type=simple
User=nexify
WorkingDirectory=/opt/nexify
ExecStart=/opt/nexify/.venv/bin/jarvis serve --host 0.0.0.0 --port 8000
Restart=on-failure
RestartSec=5
Environment=HOME=/opt/nexify

[Install]
WantedBy=multi-user.target
```

### `[Unit]` Section

| Directive     | Value              | Description                                                                 |
|---------------|--------------------|-----------------------------------------------------------------------------|
| `Description` | `nexify API Server` | Human-readable name shown in `systemctl status` and logs.              |
| `After`       | `network.target`   | Delays startup until the network stack is available, since the server binds to a network socket and may need to reach a remote engine. |

### `[Service]` Section

| Directive          | Value                                                              | Description                                                                                     |
|--------------------|--------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| `Type`             | `simple`                                                           | The process started by `ExecStart` is the main service process. systemd considers the service started immediately. |
| `User`             | `nexify`                                                       | Runs the server as the `nexify` user rather than root, limiting the blast radius of any security issue. |
| `WorkingDirectory` | `/opt/nexify`                                                  | Sets the working directory for the process. This is where nexify looks for local files and writes data. |
| `ExecStart`        | `/opt/nexify/.venv/bin/jarvis serve --host 0.0.0.0 --port 8000` | The command to start the server. Uses the full path to the `jarvis` binary inside the virtual environment. |
| `Restart`          | `on-failure`                                                       | Automatically restarts the service if it exits with a non-zero exit code. Does not restart on clean shutdown (`systemctl stop`). |
| `RestartSec`       | `5`                                                                | Waits 5 seconds before attempting a restart, preventing rapid restart loops if the service crashes immediately on startup. |
| `Environment`      | `HOME=/opt/nexify`                                             | Sets the `HOME` environment variable so nexify finds its configuration at `~/.nexify/config.toml` (resolving to `/opt/nexify/.nexify/config.toml`). |

### `[Install]` Section

| Directive    | Value               | Description                                                                                 |
|--------------|---------------------|---------------------------------------------------------------------------------------------|
| `WantedBy`   | `multi-user.target` | The service starts when the system reaches multi-user mode (standard boot target for servers). `systemctl enable` creates a symlink under this target. |

## Configuration Options

### Changing the Bind Address and Port

Edit the `ExecStart` line to change the host or port:

```ini
ExecStart=/opt/nexify/.venv/bin/jarvis serve --host 127.0.0.1 --port 9000
```

!!! tip
    Binding to `127.0.0.1` restricts access to localhost only. Use this when running behind a reverse proxy like Nginx or Caddy.

### Setting the Engine and Model

Pass additional flags to `jarvis serve`:

```ini
ExecStart=/opt/nexify/.venv/bin/jarvis serve --host 0.0.0.0 --port 8000 --engine ollama --model qwen3:8b
```

### Adding Environment Variables

Add multiple `Environment` directives or use `EnvironmentFile` for complex configurations:

```ini
[Service]
Environment=HOME=/opt/nexify
Environment=nexify_ENGINE_DEFAULT=vllm
Environment=nexify_OLLAMA_HOST=http://localhost:11434
```

Or load from a file:

```ini
[Service]
EnvironmentFile=/opt/nexify/.env
```

### Changing the User

If you prefer a different service user, update both the `User` directive and the paths:

```ini
[Service]
User=myuser
WorkingDirectory=/home/myuser/nexify
ExecStart=/home/myuser/nexify/.venv/bin/jarvis serve --host 0.0.0.0 --port 8000
Environment=HOME=/home/myuser/nexify
```

### Using a Configuration File

Ensure the configuration file exists at the path where `HOME` points:

```bash
sudo -u nexify mkdir -p /opt/nexify/.nexify
sudo -u nexify cp config.toml /opt/nexify/.nexify/config.toml
```

The server reads `~/.nexify/config.toml` on startup, where `~` resolves from the `HOME` environment variable.

## Viewing Logs

nexify logs are captured by journald. View them with `journalctl`:

```bash
# View all logs for the service
sudo journalctl -u nexify

# Follow logs in real time
sudo journalctl -u nexify -f

# View logs since the last boot
sudo journalctl -u nexify -b

# View logs from the last hour
sudo journalctl -u nexify --since "1 hour ago"

# View only error-level messages
sudo journalctl -u nexify -p err
```

## Managing the Service

### Start, Stop, and Restart

```bash
# Start the service
sudo systemctl start nexify

# Stop the service
sudo systemctl stop nexify

# Restart the service (stop + start)
sudo systemctl restart nexify

# Reload configuration without full restart (sends SIGHUP)
sudo systemctl reload-or-restart nexify
```

### Check Status

```bash
sudo systemctl status nexify
```

Example output:

```
● nexify.service - nexify API Server
     Loaded: loaded (/etc/systemd/system/nexify.service; enabled; preset: enabled)
     Active: active (running) since Fri 2026-02-21 10:00:00 UTC; 2h ago
   Main PID: 12345 (jarvis)
      Tasks: 4 (limit: 4915)
     Memory: 256.0M
        CPU: 1min 23s
     CGroup: /system.slice/nexify.service
             └─12345 /opt/nexify/.venv/bin/python /opt/nexify/.venv/bin/jarvis serve --host 0.0.0.0 --port 8000
```

### Enable and Disable on Boot

```bash
# Enable automatic start on boot
sudo systemctl enable nexify

# Disable automatic start on boot
sudo systemctl disable nexify
```

### Apply Changes After Editing the Unit File

After modifying `/etc/systemd/system/nexify.service`, reload the systemd daemon and restart the service:

```bash
sudo systemctl daemon-reload
sudo systemctl restart nexify
```

## Running Alongside Ollama

If Ollama is also managed via systemd, you can add an ordering dependency so the nexify service waits for Ollama to start:

```ini
[Unit]
Description=nexify API Server
After=network.target ollama.service
Requires=ollama.service
```

| Directive  | Description                                                              |
|------------|--------------------------------------------------------------------------|
| `After`    | Ensures nexify starts after Ollama.                                  |
| `Requires` | If Ollama fails to start, nexify will not start either.              |

!!! note
    Use `Wants` instead of `Requires` if you want nexify to start even when Ollama is unavailable (for example, if you plan to start Ollama manually later).

