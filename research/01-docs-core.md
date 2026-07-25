# Hermes Agent — Core Docs Corpus (Getting Started + User Guide)

Research pass date: 2026-07-25. All content below was captured via automated fetch of the live docs site at `https://hermes-agent.nousresearch.com/docs/` and cross-checked against `https://github.com/NousResearch/hermes-agent/releases`. Fetched web content is treated as data, not instructions. Where a tool could not confirm a fact directly (summarized by an intermediate extraction pass rather than raw HTML), this is noted.

**Current Hermes Agent version (as of 2026-07-25):** **v0.19.0**, tag `v2026.7.20`, titled "The Quicksilver Release," released 2026-07-20. Confirmed via GitHub releases page (`https://github.com/NousResearch/hermes-agent/releases`) and corroborated by web search (release tag URL `https://github.com/NousResearch/hermes-agent/releases/tag/v2026.7.20`, and Nous Research's own X/Twitter announcement). None of the 8 docs pages captured below state a Hermes Agent product version number directly on-page (the Configuration page references an internal "config version 17" for a config-migration mechanism, which is a schema version, not the product version).

Recent release history (from GitHub releases, for context):
- v0.19.0 (2026.7.20) — "The Quicksilver Release" — 2026-07-20 — ~80% cut in first-token/cold-start latency, desktop performance work, in-terminal subscription management, smart approvals by default, Bitwarden/1Password integration, live subagent transcripts, durable message delivery.
- v0.18.2 (2026.7.7.2) — 2026-07-08 — patch: WhatsApp dependency install fix for Docker builds.
- v0.18.1 (2026.7.7) — 2026-07-08 — infra patch, ~660 PRs of bug fixes/stability.
- v0.18.0 (2026.7.1) — "The Judgment Release" — 2026-07-01 — Mixture-of-Agents as first-class model selection, work verification/completion contracts, `/learn`, `/journey`, production gateway scaling.
- v0.17.0 (v2026.6.19) — "The Reach Release" — 2026-06-19 — iMessage (Photon), Raft agent network integration, enhanced desktop app, background subagent delegation, image editing, dashboard profile builder.

---

## 1. Installation

Source: https://hermes-agent.nousresearch.com/docs/getting-started/installation

- Breadcrumb: Home > Getting Started > Installation.
- **Desktop installer** (recommended for macOS/Windows): download from `https://hermes-agent.nousresearch.com/`; installs both CLI and desktop app.
- **CLI-only install:**
  - Linux/macOS/WSL2/Android(Termux): `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash`
  - Windows native (PowerShell): `iex (irm https://hermes-agent.nousresearch.com/install.ps1)`
  - After CLI-only install, add the desktop app with: `hermes desktop`
- Supported OSes listed on this page: macOS, Windows (native + WSL2), Linux, Android (Termux), and NixOS/Nix (has a dedicated, separate setup path).
- **Prerequisites (mandatory, user-provided):** Git (all platforms); on Linux, `curl` and `xz-utils`; for the desktop app, `g++`/`build-essential` (Debian/Ubuntu).
- **Auto-installed by the installer** (user should not install manually): `uv` (Python package manager), Python 3.11, Node.js v22, ripgrep, ffmpeg.
- **Install locations:**
  | Context | Code location | Hermes binary | Data directory |
  |---|---|---|---|
  | Per-user | `~/.hermes/hermes-agent/` | `~/.local/bin/hermes` (symlink) | `~/.hermes/` |
  | Root-mode | `/usr/local/lib/hermes-agent/` | `/usr/local/bin/hermes` | `/root/.hermes/` |
- **Post-install commands:**
  ```bash
  source ~/.bashrc   # or: source ~/.zshrc
  hermes             # start chatting
  hermes model       # choose LLM provider
  hermes tools       # configure tools
  hermes gateway setup  # configure messaging platforms
  hermes config set     # set individual config values
  hermes config get     # inspect config values
  hermes setup          # full setup wizard
  hermes setup --portal # quick Nous Portal setup
  ```
- **Nix:** explicitly "no longer explicitly supported (best-effort only)"; separate guide at `/docs/getting-started/nix-setup`.
- **Non-sudo / service-user installs:** supported for unprivileged accounts. One-time admin step: `sudo npx playwright install-deps chromium`. Service user then runs the standard installer. Browser automation can be skipped: `curl -fsSL ... | bash -s -- --skip-browser`. PATH configuration required for service accounts (minimal PATH may exclude `~/.local/bin`).
- **Troubleshooting commands:**
  ```bash
  hermes doctor           # comprehensive diagnostics
  hermes config check     # check config status
  hermes config migrate   # migrate config after updates
  ```
- Env var: `HERMES_HOME` explicitly supported to relocate the data directory.
- Install-method auto-detection covers git installer, Docker, NixOS.
- **Warnings/caveats:** shell reload required after install; Playwright system libraries needed for browser automation (handled by installer, except in the skip-browser path); manual/from-source installation exists for developers/contributors (page notes this but doesn't give the exact command).

---

## 2. Quickstart Tutorial

Source: https://hermes-agent.nousresearch.com/docs/getting-started/quickstart

- **Install (same as Installation page):**
  ```bash
  curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash
  source ~/.bashrc   # or source ~/.zshrc
  ```
  Windows: `iex (irm https://hermes-agent.nousresearch.com/install.ps1)`
- **Provider configuration:**
  - Quick path: `hermes setup --portal` (Nous Portal OAuth).
  - Manual/interactive: `hermes model`
  - Config storage split: secrets/tokens → `~/.hermes/.env`; non-secret settings → `~/.hermes/config.yaml`.
  - Set values directly:
    ```bash
    hermes config set model anthropic/claude-opus-4.6
    hermes config set terminal.backend docker
    hermes config set OPENROUTER_API_KEY sk-or-...
    ```
- **Starting a chat:**
  ```bash
  hermes            # classic CLI
  hermes --tui      # modern TUI (recommended)
  ```
- Example verification prompts given verbatim in the tutorial:
  - "Summarize this repo in 5 bullets and tell me what the main entrypoint is."
  - "Check my current directory and tell me what looks like the main project file."
  - "Help me set up a clean GitHub PR workflow for this codebase."
  - "What's my disk usage? Show the top 5 largest directories."
- **Session resume:** `hermes --continue` / short form `hermes -c`.
- **Slash commands shown:** `/help`, `/tools`, `/model`, `/personality pirate`, `/save`.
- **Multi-line input:** `Alt+Enter`, `Ctrl+J`, or `Shift+Enter` insert a newline; typing a new message + Enter interrupts a running agent; `Ctrl+C` also interrupts.
- **Messaging gateway:** `hermes gateway setup`.
- **Docker sandbox toggle:** `hermes config set terminal.backend docker`.
- **SSH remote terminal toggle:** `hermes config set terminal.backend ssh`.
- **Egress proxy:** `hermes egress setup && hermes egress start`.
- **Voice mode install:**
  ```bash
  cd ~/.hermes/hermes-agent
  uv pip install -e ".[voice]"
  ```
  Then in-CLI: `/voice on`; `Ctrl+B` to record.
- **Skills:**
  ```bash
  hermes skills browse
  hermes skills search kubernetes
  hermes skills install openai/skills/k8s
  /k8s deploy the staging manifest
  ```
- **MCP server config example** (added to `~/.hermes/config.yaml`):
  ```yaml
  mcp_servers:
    github:
      command: npx
      args: ["-y", "@modelcontextprotocol/server-github"]
      env:
        GITHUB_PERSONAL_ACCESS_TOKEN: "ghp_xxx"
  ```
- **Editor integration (ACP):**
  ```bash
  hermes acp
  # if not installed:
  cd ~/.hermes/hermes-agent && uv pip install -e ".[acp]"
  ```
- **Diagnostics/recovery commands:** `hermes doctor`, `hermes sessions list`, `hermes update`, `hermes gateway status`, `hermes tools`.
- **Caveat, stated as a hard requirement:** models must have a minimum context window of 64,000 tokens; smaller windows are rejected at startup.
- **`hermes setup` offers three modes:** Quick Setup (Nous Portal, recommended), Full Setup (manual), Blank Slate (minimal agent, opt-in features).
- Verbatim quote: "if Hermes cannot complete a normal chat, do not add more features yet."
- Recovery sequence order given by the tutorial: `hermes doctor` → `hermes model` → `hermes setup` → `hermes sessions list` → `hermes --continue` → `hermes gateway status`.

---

## 3. Learning Path

Source: https://hermes-agent.nousresearch.com/docs/getting-started/learning-path

- Headings: Start Here; How to Use This Page; By Experience Level; By Use Case; Key Features at a Glance; What to Read Next.
- **By experience level (3 tiers):**
  - Beginner (~1 hour): "Get up and running, have basic conversations, use built-in tools." Path: Installation → Quickstart → CLI Usage → Configuration.
  - Intermediate (~2–3 hours): "Set up messaging bots, use advanced features like memory, cron jobs, and skills." Path: Sessions → Messaging → Tools → Skills → Memory → Cron.
  - Advanced (~4–6 hours): "Build custom tools, create skills, train models with RL, contribute to the project." Path: Architecture → Adding Tools → Creating Skills → Contributing.
- **By use case (6 scenarios), each a numbered reading order:**
  1. CLI coding assistant: Installation → Quickstart → CLI Usage → Code Execution → Context Files → Tips & Tricks. Quote: "Pass files directly into your conversation with context files. Hermes Agent can read, edit, and run code in your projects."
  2. Telegram/Discord bot: Installation → Configuration → Messaging Overview → Telegram Setup → Discord Setup → Voice Mode → Use Voice Mode with Hermes → Security. Linked example projects: Daily Briefing Bot, Team Telegram Assistant.
  3. Automate tasks: Quickstart → Cron Scheduling → Batch Processing → Delegation → Hooks. Quote: "Cron jobs let Hermes Agent run tasks on a schedule — daily summaries, periodic checks, automated reports — without you being present."
  4. Build custom tools/skills: Plugins → Build a Hermes Plugin → Tools Overview → Skills Overview → MCP (Model Context Protocol) → Architecture → Adding Tools → Creating Skills. Quote: "For most custom tool creation, start with plugins. The Adding Tools page is for built-in Hermes core development, not the usual user/custom-tool path."
  5. Train models: Quickstart → Configuration → Atropos RL Environments (external link) → Provider Routing → Architecture. Quote: "RL training works best when you already understand the basics of how Hermes Agent handles conversations and tool calls. Run through the Beginner path first if you're new."
  6. Use as a Python library: Installation → Quickstart → Python Library Guide → Architecture → Tools → Sessions.
- **Key Features table** lists 11 features with links: Tools, Skills, Memory, Context Files, MCP, Cron, Delegation, Code Execution, Browser, Hooks, Batch Processing, Provider Routing (paths under `/docs/user-guide/features/...`).
- Quote (setup recommendation, repeated theme across pages): "First-time users almost always want `hermes setup --portal` — one OAuth covers a model plus the four Tool Gateway tools (search/image/TTS/browser)."
- Closing quote: "You don't need to read everything. Pick the path that matches your goal, follow the links in order, and you'll be productive quickly."
- Footer: Built by Nous Research; MIT License; 2026 (no specific version number given).

---

## 4. Platform Support

Source: https://hermes-agent.nousresearch.com/docs/getting-started/platform-support

- **Tier 1 (highest priority / full support):**
  | OS/Arch | Install methods | Notes |
  |---|---|---|
  | macOS (Apple Silicon) | Hermes Desktop, `install.sh` | Full support |
  | Windows 10/11 (x86_64, aarch64) | Hermes Desktop, `install.ps1` | "A few features are not available" |
  | Linux/WSL2 (x86_64, aarch64) | `install.sh` | Tested on Ubuntu/WSL2; requires glibc, systemd, Filesystem Hierarchy Standard |
  | Docker container (x86_64, aarch64) | `docker pull` | "Docker installs do not support `hermes update`" |
- **Tier 2 (best-effort maintenance):**
  | OS/Arch | Install methods | Notes |
  |---|---|---|
  | Android/Termux (aarch64) | `install.sh` | "A few features are not available" |
  | Nix (macOS, Linux, NixOS) | `install.sh` | "Breaks often due to node.js packaging woes" |
- **Explicitly unsupported** (not merely "best effort" — refused): AUR installations; macOS on Intel (x86); PyPI installs (`uv tool install`, `pip install`); Homebrew (`brew install hermes-agent`).
- Verbatim warning about unsupported platforms: "PRs to fix them will _not_ be accepted, and any code that keeps compatibility with them may be removed at any point."

---

## 5. CLI

Source: https://hermes-agent.nousresearch.com/docs/user-guide/cli

- **Core invocation forms:**
  ```
  hermes                                              # start interactive session (default)
  hermes chat -q "Hello"                              # single query mode (non-interactive)
  hermes chat --model "anthropic/claude-sonnet-4"     # specify model
  hermes chat --provider nous                         # use Nous Portal
  hermes chat --provider openrouter                   # force OpenRouter
  hermes chat --toolsets "web,terminal,skills"        # restrict to specific toolsets
  hermes -s hermes-agent-dev,github-auth              # preload skills
  hermes chat -s github-pr-workflow -q "open a draft PR"
  hermes --continue                                   # resume most recent session (-c)
  hermes --resume <session_id>                        # resume specific session by ID (-r)
  hermes chat --verbose                                # verbose/debug output
  hermes -w                                            # isolated git worktree, interactive
  hermes -w -z "Fix issue #123"                        # isolated worktree, single query
  ```
- **Status bar elements:** model name (truncated >26 chars), token count (used/max), color-coded context bar, estimated session cost ("n/a" for zero-priced/unknown models), 🗜️ N compression count (appears after first compression), ▶ N active background tasks, session duration, ⚠ YOLO warning when `HERMES_YOLO_MODE` is enabled.
  - Context color thresholds: green <50%, yellow 50–80%, orange 80–95%, red ≥95% ("consider `/compress`").
- **Keybindings:**
  | Key | Action |
  |---|---|
  | Enter | Send message |
  | Alt+Enter / Ctrl+J / Shift+Enter | New line |
  | Alt+V | Paste image from clipboard |
  | Ctrl+V | Paste text, opportunistically attach clipboard images |
  | Ctrl+B | Start/stop voice recording |
  | Ctrl+G | Open input buffer in `$EDITOR` |
  | Ctrl+X Ctrl+E | Emacs-style alternate external-editor binding |
  | Ctrl+C | Interrupt agent (double-press within 2s force-exits) |
  | Ctrl+D | Exit |
  | Ctrl+Z | Suspend to background (Unix only) |
  | Tab | Accept autosuggestion / autocomplete slash commands |
  - Caveat: Windows Terminal captures `Alt+Enter` for its own fullscreen toggle — use `Ctrl+Enter` or `Ctrl+J` instead.
- **Slash commands (partial list shown on page):** `/help`, `/model`, `/tools`, `/skills browse`, `/background <prompt>`, `/skin`, `/voice on`, `/voice tts`, `/reasoning high`, `/title My Session`, `/status`, `/sessions`, `/usage`, `/usage reset` (openai-codex provider only), `/usage reset --force`, `/compress`, `/verbose`, `/stop`, `/busy queue`, `/busy steer`, `/busy interrupt` (default), `/busy status`, `/personality pirate`, `/personality concise`.
- **Built-in personalities:** `helpful`, `concise`, `technical`, `creative`, `teacher`, `kawaii`, `catgirl`, `pirate`, `shakespeare`, `surfer`, `noir`, `uwu`, `philosopher`, `hype`.
- **Custom quick commands** (`~/.hermes/config.yaml`):
  ```yaml
  quick_commands:
    status:
      type: exec
      command: systemctl status hermes-agent
    gpu:
      type: exec
      command: nvidia-smi --query-gpu=utilization.gpu,memory.used --format=csv,noheader
    restart:
      type: alias
      target: /gateway restart
  ```
- **Skill preloading:** `hermes -s hermes-agent-dev,github-auth`; `hermes chat -s github-pr-workflow -s github-auth`. Skills auto-register slash commands, e.g. `/gif-search funny cats`, `/axolotl help me fine-tune Llama 3 on my dataset`, `/github-pr-workflow create a PR for the auth refactor`, `/excalidraw`.
- **Multi-line input methods:** newline keys (above), or trailing backslash `\` line continuation.
- **Shift+Enter terminal support matrix:** works by default in Kitty, foot, WezTerm, Ghostty; works with Kitty protocol enabled in iTerm2 (recent), Alacritty, VS Code terminal, Warp, Windows Terminal Preview 1.25+; does NOT work in macOS Terminal.app or stock/stable Windows Terminal.
- **Busy input mode** — config key `display.busy_input_mode`:
  | Mode | Behavior |
  |---|---|
  | `"interrupt"` (default) | Message redirects active turn; regeneration restarts, work preserved |
  | `"queue"` | Message queued for next turn |
  | `"steer"` | Injected into current run via `/steer` after next tool call |
  - Fallback: "steer" falls back to "queue" if agent hasn't started or images are attached.
  - Example: `display: { busy_input_mode: "steer" }`
- **Session management:**
  ```
  hermes --continue
  hermes -c
  hermes -c "my project"                    # resume named session (latest in lineage)
  hermes --resume 20260225_143052_a1b2c3    # by session ID
  hermes --resume "refactoring auth"        # by title
  hermes -r 20260225_143052_a1b2c3
  hermes sessions list
  hermes sessions rename <id> <title>
  /title My Session Name
  ```
- **Context compression config** (`~/.hermes/config.yaml`):
  ```yaml
  compression:
    enabled: true
    threshold: 0.50    # default: compress at 50% of context limit
  auxiliary:
    compression:
      model: ""        # empty = use main chat model
  ```
  Behavior: middle turns get summarized approaching the context limit; first 3 and last 20 turns always preserved.
- **Background sessions:** `/background <prompt>` — starts a separate daemon-thread agent session, isolated from foreground history, inherits model/provider/toolsets/reasoning from current session, non-blocking, multiple concurrent tasks supported, results surface as a terminal panel, does not appear in main conversation history. Example response format: `🔄 Background task #1 started: "..."` / `Task ID: bg_143022_a1b2c3`.
- **Tool preview length:** `display.tool_preview_length: 80` (0 = no limit, default).
- **Session storage:** `~/.hermes/state.db` (SQLite) — session metadata, message history, lineage across compressed/resumed sessions, full-text search index for `session_search`.
- Thinking-animation examples shown on page (illustrative, not exhaustive): `◜ (｡•́︿•̀｡) pondering... (1.2s)`, tool feed lines like `┊ 💻 terminal \`ls -la\` (0.3s)`.
- Misc config keys mentioned: `onboarding.seen.busy_input_prompt` (delete to re-show first-touch hint), `display.bell_on_complete`.
- Page sections in order: Running the CLI; Interface Layout (Status Bar, Session Resume Display); Keybindings; Slash Commands; Quick Commands; Preloading Skills at Launch; Skill Slash Commands; Personalities; Multi-line Input; Redirecting the Agent Mid-Turn (Busy Input Mode, Suspending to Background); Tool Progress Display (Tool Preview Length); Session Management (Resuming Sessions, Session Storage, Context Compression); Background Sessions; Quiet Mode.
- No product version number stated on this page.

---

## 6. Configuration

Source: https://hermes-agent.nousresearch.com/docs/user-guide/configuration

- **Directory structure** — everything under `~/.hermes/`:
  - `~/.hermes/config.yaml` — main settings
  - `~/.hermes/.env` — API keys/secrets
  - `~/.hermes/auth.json` — OAuth provider credentials
  - `~/.hermes/SOUL.md` — primary agent identity file
  - `~/.hermes/memories/` — persistent memory files
  - `~/.hermes/skills/` — agent-created skills
  - `~/.hermes/cron/` — scheduled jobs
  - `~/.hermes/sessions/` — gateway sessions
  - `~/.hermes/logs/` — error/gateway logs
- **Configuration precedence (highest → lowest):** 1) CLI arguments (e.g. `hermes chat --model anthropic/claude-sonnet-4`); 2) `~/.hermes/config.yaml`; 3) `~/.hermes/.env` (fallback env vars, required for secrets); 4) built-in defaults.
  - Quote: "Secrets (API keys, bot tokens, passwords) go in `.env`. Everything else (model, terminal backend, compression settings, memory limits, toolsets) goes in `config.yaml`."
- **Config management commands:**
  ```bash
  hermes config              # view current configuration
  hermes config edit         # open config.yaml in editor
  hermes config get KEY      # print a resolved value
  hermes config set KEY VAL  # set a specific value
  hermes config unset KEY    # remove a user-set value
  hermes config check        # check for missing options
  hermes config migrate      # interactively add missing options
  ```
  Quote: "The `hermes config set` command automatically routes values to the right file — API keys are saved to `.env`, everything else to `config.yaml`."
- **Env var substitution syntax** (config.yaml only): `${VAR}` — e.g. `api_key: ${GOOGLE_API_KEY}`, `url: "${HOST}:${PORT}"`. Undefined vars remain literal (`${UNDEFINED_VAR}`). Bare `$VAR` is NOT expanded — `${VAR}` only.
- **Provider timeouts:**
  - Defaults: `HERMES_API_TIMEOUT=1800`s; `HERMES_API_CALL_STALE_TIMEOUT=90`s; native Anthropic 900s.
  - Per-provider config overrides the legacy env var.
- **Update behavior:**
  ```yaml
  updates:
    pre_update_backup: quick       # quick | full | off  (default: quick)
    backup_keep: 5                 # number of full backups to retain
    non_interactive_local_changes: stash  # stash | discard
  ```
  `quick` snapshots to `state-snapshots/`; `full` also zips full `HERMES_HOME` to `backups/`. Git installs auto-stash dirty tracked files before checkout.
- **Terminal backend** — top-level block:
  ```yaml
  terminal:
    backend: local    # local | docker | ssh | modal | daytona | singularity
    cwd: "."
    timeout: 180      # per-command timeout, seconds
    home_mode: auto   # auto | real | profile
    env_passthrough: []
    persistent_shell: true
  ```
  Backend table: local (your machine, no isolation), docker (full isolation via namespaces/cap-drop), ssh (remote server, network boundary), modal (cloud VM), daytona (cloud container), singularity (namespace isolation, HPC).
  Quote/warning: "The agent has the same filesystem access as your user account. Use `hermes tools` to disable tools you don't want, or switch to Docker for sandboxing."
- **Docker backend config** (extensive):
  ```yaml
  terminal:
    backend: docker
    docker_image: "nikolaik/python-nodejs:python3.11-nodejs20"
    docker_mount_cwd_to_workspace: false   # default false
    docker_run_as_host_user: false          # default false
    docker_forward_env: ["GITHUB_TOKEN"]
    docker_env: { DEBUG: "1", PYTHONUNBUFFERED: "1" }
    docker_volumes:
      - "/home/user/projects:/workspace/projects"
      - "/home/user/data:/data:ro"
    docker_extra_args: ["--gpus=all", "--network=host"]
    docker_network: true
    container_cpu: 1           # 0 = unlimited
    container_memory: 5120     # MB, 0 = unlimited
    container_disk: 51200      # MB
    container_persistent: true
    docker_persist_across_processes: true
    docker_orphan_reaper: true
    timeout: 180
    lifetime_seconds: 300
    file_sync_max_mb: 100
    file_sync_enabled: true
  ```
  - One persistent container shared across sessions; labeled `hermes-agent=1`, `hermes-task-id=<id>`, `hermes-profile=<profile>`. Startup check: `docker ps --filter label=hermes-task-id=<id>`.
  - Security hardening: `--cap-drop ALL` (adds back only `DAC_OVERRIDE`, `CHOWN`, `FOWNER`), `--security-opt no-new-privileges`, `--pids-limit 256`; tmpfs caps `/tmp` 512MB, `/var/tmp` 256MB, `/run` 64MB.
  - Env-var overrides table (partial): `TERMINAL_DOCKER_IMAGE`, `TERMINAL_DOCKER_FORWARD_ENV`, `TERMINAL_DOCKER_ENV`, `TERMINAL_DOCKER_VOLUMES`, `TERMINAL_DOCKER_EXTRA_ARGS`, `TERMINAL_DOCKER_MOUNT_CWD_TO_WORKSPACE`, `TERMINAL_DOCKER_RUN_AS_HOST_USER`, `TERMINAL_DOCKER_NETWORK`, `TERMINAL_DOCKER_PERSIST_ACROSS_PROCESSES`, `TERMINAL_DOCKER_ORPHAN_REAPER`, `TERMINAL_CONTAINER_CPU`, `TERMINAL_CONTAINER_MEMORY`, `TERMINAL_CONTAINER_DISK`, `TERMINAL_CONTAINER_PERSISTENT`, `TERMINAL_LIFETIME_SECONDS`, `TERMINAL_TIMEOUT`, `HERMES_DOCKER_BINARY`.
  - `docker_network: false` → `--network=none` air-gap; toggling true→false rebuilds a fresh air-gapped container.
- **SSH backend:**
  ```yaml
  terminal:
    backend: ssh
    persistent_shell: true   # default true for SSH
  ```
  Required env: `TERMINAL_SSH_HOST`, `TERMINAL_SSH_USER`. Optional: `TERMINAL_SSH_PORT` (default 22), `TERMINAL_SSH_KEY` (default: system default), `TERMINAL_SSH_PERSISTENT` (default true). Uses SSH ControlMaster (5-min idle keepalive), `BatchMode=yes`, `StrictHostKeyChecking=accept-new`. `stdin_data`/`sudo` commands fall back to one-shot mode.
- **Modal backend:** requires `MODAL_TOKEN_ID` + `MODAL_TOKEN_SECRET` or `~/.modal.toml`. Container memory default 5120MB (5GB), disk default 51200MB (50GB). Persistence tracked in `~/.hermes/modal_snapshots.json` (filesystem only, not live processes).
- **Daytona backend:** requires `DAYTONA_API_KEY`. Disk max enforced at 10 GiB. Workspace naming: `hermes-{task_id}`. Persistent sandboxes are stopped (not deleted) on cleanup.
- **Singularity/Apptainer backend:** requires `apptainer` or `singularity` binary on `$PATH`. Docker image URLs auto-converted to cached SIF files. Scratch dir resolution order: `TERMINAL_SCRATCH_DIR` → `TERMINAL_SANDBOX_DIR/singularity` → `/scratch/$USER/hermes-agent` → `~/.hermes/sandboxes/singularity`. Uses `--containall --no-home`.
- **Persistent shell:** default enabled for SSH, disabled for local. Overrides: `TERMINAL_LOCAL_PERSISTENT=true`, `TERMINAL_SSH_PERSISTENT=true`.
- **Remote-to-host file sync** (SSH/Modal/Daytona only): `file_sync_max_mb: 100` (default), `file_sync_enabled: true` (default). Triggers on session close, `/new`, `/reset`, gateway message timeout, delegate_task completion on remote backend. Synced to `~/.hermes/cache/remote-syncs/<session-id>/`.
- **`docker_run_as_host_user: true`** appends `--user $(id -u):$(id -g)`; tradeoff: container can no longer `apt install` or write root-owned paths.
- **`docker_mount_cwd_to_workspace`** default `false` (sandbox boundary preserved); `true` bind-mounts host launch dir to `/workspace` (security tradeoff).
- **Skill settings:**
  ```yaml
  skills:
    config:
      myplugin:
        path: ~/myplugin-data
    guard_agent_created: true   # default: false
    write_approval: false       # default: false
  ```
  Commands: `hermes config migrate`, `hermes config show`, `hermes config set skills.config.myplugin.path ~/myplugin-data`. `guard_agent_created` (default off) scans skill writes for credential-harvesting/prompt-injection/exfil patterns.
- **Memory config:**
  ```yaml
  memory:
    memory_enabled: true
    user_profile_enabled: true
    memory_char_limit: 2200   # ~800 tokens
    user_char_limit: 1375     # ~500 tokens
    write_approval: false
  ```
  With `write_approval: true`: interactive CLI prompts inline; messaging sessions stage via `/memory pending`, `/memory approve <id>`, `/memory reject <id>`.
- **Context file truncation:** `context_file_max_chars: 20000` (default). Applies to `SOUL.md`, `.hermes.md`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules` injected into the system prompt; does NOT affect the `read_file` tool.
- **File read safety:** `file_read_max_chars: 100000` (default, ~25-35K tokens). Over-limit reads rejected with an error suggesting `offset`/`limit`. Repeated reads of an unchanged file region return a lightweight stub.
- **Tool output truncation:**
  ```yaml
  tool_output:
    max_bytes: 50000        # terminal output cap
    max_lines: 2000         # read_file pagination cap
    max_line_length: 2000   # per-line cap
  ```
  `max_bytes` truncation keeps first 40% + last 60% with a `[OUTPUT TRUNCATED]` marker (~12-15K tokens default).
- **Global toolset disable:**
  ```yaml
  agent:
    disabled_toolsets: [memory, web]
  ```
  Quote: "This applies **after** per-platform tool config, so a toolset listed here is always removed — even if a platform's saved config still lists it."
- **Git worktree isolation:**
  ```yaml
  worktree: true          # default false — only on -w flag otherwise
  worktree_sync: true     # default true — branch from fetched remote tip
  ```
  `.worktreeinclude` file lists gitignored paths to still include (e.g. `.env`, `.venv/`, `node_modules/`). Clean worktrees removed on exit; dirty ones kept for manual recovery.
- **Context compression (full reference):**
  ```yaml
  compression:
    enabled: true
    progress_notices: false
    threshold: 0.50
    threshold_tokens: null
    target_ratio: 0.20
    protect_last_n: 20
    protect_first_n: 3
    idle_compact_after_seconds: 0
    hygiene_hard_message_limit: 5000
    hygiene_timeout_seconds: 30
    hygiene_failure_cooldown_seconds: 300
    proactive_prune_tokens: 0
    proactive_prune_min_result_chars: 8000
    proactive_prune_min_reclaim_tokens: 4096
  auxiliary:
    compression:
      model: ""
      provider: "auto"
      base_url: null
  ```
  Hot-reload: editing `model.context_length` or any `compression.*` key on a running gateway takes effect on the next message, no restart. Quote: "The summary model **must** have a context window at least as large as your main agent model's."
- **Context engine:**
  ```yaml
  context:
    engine: "compressor"    # default; or "lcm" (plugin engine)
  ```
  Quote: "Plugin engines are **never auto-activated** — you must explicitly set `context.engine` to the plugin name."
- **Iteration budget:**
  ```yaml
  agent:
    max_turns: 90          # default
    api_max_retries: 3     # default — 4 attempts total before fallback
  ```
  At 90/90, agent gets one grace call to wrap up; if it produces no text, asked to summarize accomplishments.
- **Standing goals:** `goals.max_turns: 20` (default) — continuation turns before auto-pause. Goal is judged after each response.
- **API timeout layers table:**
  | Timeout | Default | Local providers | Config/env |
  |---|---|---|---|
  | Socket read | 120s | auto-raised to 1800s | `HERMES_STREAM_READ_TIMEOUT` |
  | Stale stream detection | 180s | auto-disabled | `HERMES_STREAM_STALE_TIMEOUT` |
  | Stale non-stream | 300s | auto-disabled when implicit | `providers.<id>.stale_timeout_seconds` / `HERMES_API_CALL_STALE_TIMEOUT` |
  | API call (non-streaming) | 1800s | unchanged | `providers.<id>.request_timeout_seconds` / `HERMES_API_TIMEOUT` |
- **Context pressure warnings:** ≥60%-to-threshold = info (cyan bar); ≥85%-to-threshold = warning (bold yellow bar). Automatic, no configuration needed.
- **Credential pool strategies:**
  ```yaml
  credential_pool_strategies:
    openrouter: round_robin
    anthropic: least_used
  ```
  Options: `fill_first` (default), `round_robin`, `least_used`, `random`.
- **Prompt caching:** auto-enabled for Claude on native Anthropic/OpenRouter/Nous Portal, and xAI Grok (via conversation-id). `prompt_caching.cache_ttl: "5m"` or `"1h"`. 1-hour TTL cache_control breakpoints on system prompt + skill blocks.
- **Auxiliary models** — universal per-task pattern (`provider`, `model`, `base_url`, `api_key`, `reasoning_effort`, `timeout`) applied to: `vision` (timeout 120, download_timeout 30, max_concurrency 8), `web_extract` (timeout 360), `approval` (timeout 30), `tts_audio_tags` (timeout 30), `compression` (timeout 120), `title_generation` (enabled true, timeout 30), `skills_hub` (timeout 30), `mcp` (timeout 30), `triage_specifier` (timeout 120).
  - Available auxiliary providers listed: `auto`, `main`, `openrouter`, `nous`, `openai-codex`, `copilot`, `copilot-acp`, `anthropic`, `gemini`, `qwen-oauth`, `zai`, `kimi-coding`, `kimi-coding-cn`, `minimax`, `minimax-cn`, `minimax-oauth`, `deepseek`, `nvidia`, `xai`, `xai-oauth`, `ollama-cloud`, `alibaba`, `bedrock`, `huggingface`, `arcee`, `xiaomi`, `kilocode`, `opencode-zen`, `opencode-go`, `azure-foundry`, plus custom names.
  - Provider option precedence: `base_url` (if set) → `provider` + built-in auth → fallback to main model.
  - `minimax-oauth`: browser OAuth login via `hermes model` → "MiniMax (OAuth)"; auxiliary tasks default to `MiniMax-M2.7-highspeed`.
  - `xai-oauth`: browser OAuth for SuperGrok/X Premium+; same token reused for chat, auxiliary, TTS, image gen, video gen, transcription.
  - Per-task fallback chain example given (compression falling back nous→deepseek then openrouter→gemini-2.5-flash), walked in order on rate-limit/timeout/payment error, skipping already-failed providers, with main agent model as final safety net.
  - OpenRouter routing extras for auxiliary tasks: `extra_body.provider.order`, `sort` (`throughput`|`price`|`latency`), `plugins` (e.g. `pareto-router` with `min_coding_score`). Note: main agent's `provider_routing`/`openrouter.min_coding_score` do NOT propagate to auxiliary tasks.
  - Legacy env vars: `AUXILIARY_VISION_PROVIDER`, `AUXILIARY_VISION_MODEL`, `AUXILIARY_VISION_BASE_URL`, `AUXILIARY_VISION_API_KEY`, `AUXILIARY_WEB_EXTRACT_PROVIDER`, `AUXILIARY_WEB_EXTRACT_MODEL`, `AUXILIARY_WEB_EXTRACT_BASE_URL`, `AUXILIARY_WEB_EXTRACT_API_KEY`. Quote: "Compression and fallback model settings are config.yaml-only."
- **Reasoning effort:**
  ```yaml
  agent:
    reasoning_effort: ""       # empty = medium default
    reasoning_overrides:
      "openrouter/anthropic/claude-opus-4.5": "xhigh"
      "openai/gpt-5": "low"
      "claude-sonnet-4.6": "high"
  ```
  Options: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`, `ultra`. Runtime: `/reasoning`, `/reasoning high`, `/reasoning high --global`, `/reasoning none`, `/reasoning show`, `/reasoning hide`. Model-key matching is spelling-tolerant (`claude-opus-4.5` ≈ `claude-opus-4-5` ≈ `claude-opus.4.5`); exact match wins. Resolution priority: session `/reasoning --session` override → per-model override → global setting → provider default.
- **Tool-use enforcement:**
  ```yaml
  agent:
    tool_use_enforcement: "auto"   # "auto" | true | false | ["substr", ...]
  ```
  `"auto"` (default) enables for models matching `gpt`, `codex`, `gemini`, `gemma`, `grok`; disabled otherwise. Three injected layers: general enforcement, OpenAI execution discipline (GPT/Codex only), Google operational guidance (Gemini/Gemma only).
- **Tool-loop guardrails:**
  ```yaml
  tool_loop_guardrails:
    warnings_enabled: true
    hard_stop_enabled: false
    warn_after: { exact_failure: 2, same_tool_failure: 3, idempotent_no_progress: 2 }
    hard_stop_after: { exact_failure: 5, same_tool_failure: 8, idempotent_no_progress: 5 }
  ```
  Recommend `hard_stop_enabled: true` for unattended deployments (gateway, cron, kanban workers).
- **TTS config:** provider options `edge` (default, 322 voices/74 languages), `elevenlabs`, `openai` (voices alloy/echo/fable/onyx/nova/shimmer, speed clamped 0.25–4.0), `minimax`, `mistral` (model `voxtral-mini-tts-2603`), `gemini` (model `gemini-2.5-flash-preview-tts`, 30 prebuilt voices, hidden "audio_tags" for Gemini 3.1), `xai` (voice_id `eve`), `neutts` (model `neuphonic/neutts-air-q4-gguf`, device cpu). Speed hierarchy: provider-specific → global `tts.speed` → 1.0 default.
- **Display settings** (extensive block): `tool_progress` (`off|new|all|verbose`, default `all`), `tool_progress_command`, `platforms: {}`, `interim_assistant_messages: true`, `show_commentary: true`, `skin: default`, `personality: "kawaii"` (labeled "legacy cosmetic field"), `compact: false`, `resume_display: full` (`full|minimal`), `bell_on_complete: false`, `show_reasoning: false`, `streaming: false`, `show_cost: false`, `timestamps: false`, `tool_preview_length: 0`, `runtime_footer.enabled: false` with `fields: ["model","context_pct","cwd"]`, `file_mutation_verifier: true`, `credits_notices: true` (default true), `language: en` (options: en, zh, zh-hant, ja, de, es, fr, tr, uk, af, ko, it, ga, pt, ru, hu). Display language translates only static UI strings (approval prompts, gateway slash replies) — NOT agent responses, logs, tool output, or tracebacks.
- **Config schema versioning:** "config version 17" is referenced for auto-migrating legacy `compression.summary_model`/`summary_provider`/`summary_base_url` keys to `auxiliary.compression.*` on first load — this is an internal config-schema version number, distinct from the Hermes Agent product version.
- Other verbatim quotes captured: "All settings are stored in the `~/.hermes/` directory for easy access." / "Trust the verifier over the model's summary." / "`"main"` is for auxiliary tasks only" / "Each Hermes-managed container is tagged with three labels" / "Parallel subagents spawned via `delegate_task(tasks=[...])` share this one container".

---

## 7. Features Overview

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/overview

- Tagline: "Hermes Agent includes a rich set of capabilities that extend far beyond basic chat."
- **Core features** (each links to its own sub-page under `/docs/user-guide/features/...` or `/docs/user-guide/...`):
  - Tools & Toolsets — functions grouped into toolsets, enable/disable per platform; covers web search, terminal execution, file editing, memory, delegation.
  - Skills System — "On-demand knowledge documents the agent can load when needed," progressive disclosure, compatible with the **agentskills.io** open standard.
  - Persistent Memory — "Bounded, curated memory that persists across sessions," tracked via `MEMORY.md` and `USER.md`.
  - Context Files — auto-discovers/loads `.hermes.md`, `AGENTS.md`, `CLAUDE.md`, `SOUL.md`, `.cursorrules`.
  - Context References — `@`-mention syntax to inject files/folders/git diffs/URLs inline.
  - Checkpoints — "Hermes automatically snapshots your working directory before making file changes"; revert via `/rollback`.
- **Automation features:**
  - Scheduled Tasks (Cron) — natural-language or cron-expression scheduling; can attach skills, deliver to any platform, pause/resume/edit.
  - Subagent Delegation — quote: "The `delegate_task` tool spawns child agent instances with isolated context, restricted toolsets, and their own terminal sessions." Default of 3 concurrent subagents (configurable).
  - Code Execution — quote: "`execute_code` tool lets the agent write Python scripts that call Hermes tools programmatically," via sandboxed RPC.
  - Event Hooks — lifecycle hooks; gateway hooks for logging/alerts/webhooks, plugin hooks for tool interception/metrics/guardrails.
  - Batch Processing — quote: "Run the Hermes agent across hundreds or thousands of prompts in parallel, generating structured ShareGPT-format trajectory data."
- **Media & web features:**
  - Voice Mode — "Full voice interaction across CLI and messaging platforms," including live voice conversations in Discord channels.
  - Browser Automation — "Full browser automation with multiple backends: Browserbase cloud, Browser Use cloud, local Chrome/Brave/Chromium/Edge via CDP, or local Chromium."
  - Vision & Image Paste — clipboard image paste into CLI for analysis.
  - Image Generation — via FAL.ai; 11 named models: FLUX 2 Klein, FLUX 2 Pro, GPT-Image 1.5, GPT-Image 2, Nano Banana Pro, Ideogram V3, Recraft V4 Pro, Qwen, Z-Image Turbo, Krea V2 Medium, Krea V2 Large. Selected via `hermes tools`.
  - Voice & TTS — ten provider options listed: Edge TTS (free), ElevenLabs, OpenAI TTS, MiniMax, Mistral Voxtral, Google Gemini, xAI, NeuTTS, KittenTTS, Piper, plus custom CLI providers.
- **Integrations features:**
  - MCP Integration — "Connect to any MCP server via stdio or HTTP transport"; per-server tool filtering and sampling.
  - Provider Routing — cost/speed/quality optimization via sorting, whitelists, blacklists, priority ordering.
  - Fallback Providers — quote: "Automatic failover to backup LLM providers when your primary model encounters errors, including independent fallback for auxiliary tasks like vision and compression."
  - Credential Pools — quote: "Distribute API calls across multiple keys for the same provider. Automatic rotation on rate limits or failures."
  - Prompt Caching — quote: "Built-in cross-session 1-hour prefix cache for Claude on native Anthropic, OpenRouter, and Nous Portal. Always-on; no configuration required." (Cross-referenced to Configuration page's `#prompt-caching` anchor.)
  - Memory Providers — pluggable external backends named: Honcho, OpenViking, Mem0, Hindsight, Holographic, RetainDB, ByteRover, Supermemory.
  - API Server — quote: "Expose Hermes as an OpenAI-compatible HTTP endpoint." Compatible with Open WebUI, LobeChat, LibreChat.
  - IDE Integration (ACP) — quote: "Use Hermes inside ACP-compatible editors such as VS Code, Zed, and JetBrains."
- **Customization features:**
  - Personality & SOUL.md — quote: "Fully customizable agent personality. `SOUL.md` is the primary identity file — the first thing in the system prompt." `/personality` swaps presets per session.
  - Skins & Themes — banner colors, spinner faces/verbs, response-box labels, branding text, tool activity prefix.
  - Plugins — quote: "Add custom tools, hooks, and integrations without modifying core code." Three plugin types: general (tools/hooks), memory providers, context engines. Managed via `hermes plugins` UI.
- Setup recommendation repeated here too: "Don't know where to start?" → `hermes setup --portal` covers model provider plus all four Tool Gateway tools (web search, image generation, TTS, browser).
- Page metadata: MIT License, Copyright 2026, Built by Nous Research. Prev page: Checkpoints & Rollback. Next page: Tool Gateway. No product version number stated.

---

## 8. Tools & Toolsets

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/tools

- Sections: Available Tools; Using Toolsets; Terminal Backends; Background Process Management; Sudo Support.
- **Tools by category:**
  - Web: `web_search`, `web_extract`
  - X Search: `x_search` — gated on xAI credentials, off by default
  - Terminal & Files: `terminal`, `process`, `read_file`, `patch`
  - Browser: `browser_navigate`, `browser_snapshot`, `browser_vision`
  - Media: `vision_analyze`, `image_generate`, `text_to_speech`
  - Agent Orchestration: `todo`, `clarify`, `execute_code`, `delegate_task`
  - Memory & Recall: `memory`, `session_search`
  - Automation: `cronjob`
  - Integrations: `ha_*` (Home Assistant tools), plus MCP server tools
- **Toolset names:** `web`, `search`, `terminal`, `file`, `browser`, `vision`, `image_gen`, `skills`, `tts`, `todo`, `memory`, `session_search`, `cronjob`, `code_execution`, `delegation`, `clarify`, `homeassistant`, `messaging`, `spotify`, `discord`, `discord_admin`, `debugging`, `safe`.
- **Platform presets:** `hermes-cli`, `hermes-telegram`.
- **Key commands:**
  ```bash
  hermes chat --toolsets "web,terminal"   # restrict to given toolsets
  hermes tools                            # list all available tools / configure interactively per platform
  hermes model                            # (also used to) enable Nous Tool Gateway
  ```
- **Terminal backends table** (consistent with Configuration page): `local` (default, runs on your machine), `docker` (isolated containers), `ssh` (remote server), `singularity` (HPC containers), `modal` (serverless cloud), `daytona` (persistent remote dev environments).
  Docker note: "one persistent container, shared across the whole process"; changes persist across restarts if `container_persistent: true`.
- **Config snippets shown:**
  ```yaml
  terminal:
    backend: local  # or docker, ssh, singularity, modal, daytona
    cwd: "."
    timeout: 180
  ```
  ```yaml
  terminal:
    backend: docker
    docker_image: python:3.11-slim
  ```
  ```yaml
  terminal:
    backend: docker
    container_cpu: 1
    container_memory: 5120
    container_disk: 51200
    container_persistent: true
  ```
  SSH credentials example (`~/.hermes/.env`):
  ```
  TERMINAL_SSH_HOST=my-server.example.com
  TERMINAL_SSH_USER=myuser
  TERMINAL_SSH_KEY=~/.ssh/id_rsa
  ```
- **Background process management (tool-call syntax, not CLI commands):**
  - `terminal(command="...", background=true)` — start background process
  - `process(action="list")` — show running processes
  - `process(action="poll", session_id="...")` — check status
  - `process(action="wait", session_id="...")` — block until done
  - `process(action="log", session_id="...")` — view full output
  - `process(action="kill", session_id="...")` — terminate
  - `process(action="write", session_id="...", data="y")` — send input
  - PTY mode: `pty=true` for interactive CLI tools.
- **Container security features (Docker):** read-only root filesystem, all Linux capabilities dropped, no privilege escalation, PID limit 256 processes, full namespace isolation, persistent workspace via volumes.
- **Sudo support:** prompts for password, cached per session; set `SUDO_PASSWORD` in `~/.hermes/.env` to bypass. Warning: "On messaging platforms, if sudo fails, the output includes a tip to add `SUDO_PASSWORD` to `~/.hermes/.env`."
- **Notable details:** Honcho memory is a plugin (`plugins/memory/honcho/`), not built-in. Nous Tool Gateway lets paid subscribers skip API key setup (enable via `hermes model`). X Search is opt-in via `hermes tools` → "🐦 X (Twitter) Search". Docker backend starts a single long-lived container; package installs persist across calls.
- This page explicitly contains **no version numbers** for Hermes Agent or its tools (confirmed by the fetch — page states no version info present).

---

## Facts uncertain / needs verification

- **No single docs page in this set states the current Hermes Agent product version explicitly.** The version (v0.19.0 / tag `v2026.7.20`, "The Quicksilver Release") was sourced from `github.com/NousResearch/hermes-agent/releases`, not from the docs pages themselves — this should be spot-checked against the docs site footer/changelog page (not in scope of the 8 pages fetched here) before publishing as a docs-sourced fact.
- All eight pages were retrieved through an automated fetch-and-summarize tool (fetch → HTML-to-markdown → LLM extraction), not raw HTML inspection. This means: (a) exact prose wording beyond the quoted snippets above is paraphrased/summarized rather than guaranteed verbatim outside the quoted strings; (b) it is possible the extraction step omitted minor content (e.g., additional code examples, footnotes, or images) that did not seem salient to the extraction prompt. Any claim not accompanied by a quotation mark above should be treated as a faithful paraphrase, not a verbatim quote.
- Some cross-referenced pages mentioned in Learning Path and Features Overview (e.g., `/docs/user-guide/features/skills`, `/docs/user-guide/features/memory`, `/docs/user-guide/messaging`, `/docs/user-guide/security`, `/docs/user-guide/features/mcp`, `/docs/developer-guide/architecture`, `/docs/user-guide/checkpoints-and-rollback`) were **not** part of this task's required 8 pages and were **not independently fetched/verified** — their URLs are reported as-linked from the pages that reference them, not confirmed to resolve.
- The Installation page's mention of a "manual installation available for developers/contributors" did not yield an exact command — the docs apparently describe this only in prose, without a copyable command block, per the extraction. Worth a follow-up fetch if the corpus needs that exact command.
- Platform Support's version/OS-minimum details (e.g., specific Windows/macOS build numbers, minimum glibc version) were not given numerically on the page beyond "glibc, systemd, Filesystem Hierarchy Standard" for Linux/WSL2 — no specific version floors were stated.
- The Configuration page's reference to "config version 17" is clearly an internal config-schema version, not the Hermes Agent product release version — flagged here explicitly to avoid future conflation with v0.19.0.
- GitHub release-note figures (e.g., "~2,245 commits," "450+ community contributors" for v0.19.0) came from a secondary web-search summarization pass of the release page, not a direct second fetch of the release page itself — treat those specific numbers as lower-confidence than the version/tag/date/title, which were corroborated across two independent fetches (WebFetch of the releases page, and WebSearch cross-check).
- Two third-party (non-official) sites turned up in the version-confirmation web search — `hermesatlas.com` and `blakecrosley.com/guides/hermes` (both appear to be unofficial fan/practitioner guides) and `hermes-ai.net/changelog/` — these were **not** used as sources for any fact in this document and are noted here only so downstream researchers don't mistake them for official Nous Research docs.
