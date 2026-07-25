# Hermes Agent Ecosystem — Beyond the Official Docs Site

Research pass date: 2026-07-25. All figures pulled live (GitHub API + WebFetch/WebSearch) on this date; star/issue/fork counts move daily and should be treated as a snapshot, not a constant.

---

## 1. NousResearch/hermes-agent (core repo)

Source: https://github.com/NousResearch/hermes-agent
Source: https://raw.githubusercontent.com/NousResearch/hermes-agent/main/README.md
Source: https://api.github.com/repos/NousResearch/hermes-agent
Source: https://api.github.com/repos/NousResearch/hermes-agent/releases
Source: https://github.com/NousResearch/hermes-agent/blob/main/AGENTS.md

### Repo stats (live via GitHub API, 2026-07-25)
- Stars: **220,015**
- Forks: **41,819**
- Open issues (GitHub API count, includes open PRs): **25,052**
- Subscribers/watchers (people watching): 838
- License: MIT
- Primary language: Python
- Created: 2025-07-22; last push: 2026-07-25 (actively developed daily)
- Homepage: https://hermes-agent.nousresearch.com
- Repo topics: ai, ai-agent, ai-agents, anthropic, chatgpt, claude, claude-code, clawdbot, codex, hermes, hermes-agent, llm, moltbot, nous-research, openai, openclaw

### README — description and positioning
- Tagline: **"The agent that grows with you"** (repo description); README headline: "The self-improving AI agent built by Nous Research."
- Pitched as "the only agent with a built-in learning loop" — creates skills from experience, improves them during use, nudges itself to persist knowledge, searches its own past conversations, builds a deepening model of the user across sessions.
- Runs on "a $5 VPS, a GPU cluster, or serverless infrastructure that costs nearly nothing when idle"; explicitly not laptop-bound (e.g., talk to it via Telegram while it works on a cloud VM).
- Model-agnostic: Nous Portal, OpenRouter, OpenAI, custom endpoints, "and many others"; switch via `hermes model`, no code changes.
- Feature table in README: real terminal interface (Ink TUI), lives across Telegram/Discord/Slack/WhatsApp/Signal/CLI from one gateway process, closed learning loop (memory + autonomous skill creation/self-improvement + FTS5 session search + Honcho dialectic user modeling + **compatible with the agentskills.io open standard**), built-in cron scheduler, subagent delegation + Python-RPC tool scripting, six terminal backends (local/Docker/SSH/Singularity/Modal/Daytona) with Daytona/Modal offering serverless hibernate-on-idle, and "research-ready" batch trajectory generation/compression for training tool-calling models.
- Install: one-liner curl/PowerShell installers (`hermes-agent.nousresearch.com/install.sh` / `install.ps1`); native Windows support (no WSL required) is called out at length, including an antivirus false-positive troubleshooting section for the bundled `uv.exe`.
- "Skip the API-key collection" pitch for **Nous Portal**: `hermes setup --portal` does OAuth login, sets Nous as provider, turns on the "Tool Gateway" (web search via Firecrawl, image gen via FAL, TTS via OpenAI, cloud browser via Browser Use) — all under one subscription, 300+ models, `/model <name>` to switch.
- Localized READMEs exist: README.es.md, README.zh-CN.md, README.ur-pk.md.

### docs/ folder in the repo (NOT the same as the public docs site)
The in-repo `docs/` folder is internal engineering documentation, not end-user docs (those live in a separate `website/` directory that feeds hermes-agent.nousresearch.com/docs/). In-repo `docs/` contains: `billing-lifecycle.md`, `chronos-managed-cron-contract.md`, `profile-routing.md`, `rca-ssl-cacert-post-git-pull.md`, `relay-connector-contract.md`, `session-lifecycle.md`, `hermes-kanban-v1-spec.pdf`, plus subfolders `design/`, `kanban/`, `middleware/`, `observability/`, `plans/`, `security/`.

### AGENTS.md (contributor/AI-assistant guide) highlights
- States Hermes's identity plainly: "a personal AI agent that runs the same agent core across a CLI, a messaging gateway (~20 platforms), a TUI, and an Electron desktop app," extended primarily via **plugins and skills, not core growth**.
- Two load-bearing design constraints called out explicitly: (1) per-conversation prompt caching is "sacred" — nothing may mutate context or rebuild the system prompt mid-conversation except context compression; (2) "the core is a narrow waist" — every model tool is sent on every API call, so new *core* tools are the expensive, last-resort option (the "Footprint Ladder": extend existing code → CLI command + skill → service-gated tool → plugin → MCP server → new core tool).
- Describes an automated PR-triage "sweeper" bot with three allowed auto-close reasons (`implemented_on_main`, `cannot_reproduce`, `incoherent`) — taste-based "we don't want this" closes stay human-only.
- States the project is deliberately expansive at the edges (new platforms/providers/channels merge routinely, including large ones) and conservative only at the core agent loop + tool schema.

### Release history — full version timeline (from GitHub Releases API)
All 22 tagged releases, oldest to newest. Version scheme is semantic (`v0.X.0`) paired with a date-based tag (`v2026.M.D`).

| Version | Date | Name / theme | Headline |
|---|---|---|---|
| v0.2.0 | 2026-03-12 | — | Earliest release visible in the API; ships "Skills Ecosystem" (70+ bundled/optional skills, 15+ categories, Skills Hub for discovery) |
| v0.3.0 | 2026-03-17 | — | Unified token-by-token streaming (CLI + gateway platforms); native Anthropic provider w/ OAuth + prompt caching; concurrent tool execution |
| v0.4.0 | 2026-03-23 | — | OpenAI-compatible `/v1/chat/completions` API server + cron REST API; `@file`/`@url` context references; `hermes mcp` CLI + OAuth 2.1 PKCE for remote MCP servers |
| v0.5.0 | 2026-03-28 | — | Plugin lifecycle hooks (`pre_llm_call`, `post_llm_call`, `on_session_start`, `on_session_end`); Nix flake support; Hugging Face provider |
| v0.6.0 | 2026-03-30 | "the multi-instance release" | **Profiles** (isolated multi-instance Hermes), **MCP server mode** (`hermes mcp serve`, stdio + Streamable HTTP client-side), official **Docker** container, ordered **fallback provider chain**, Feishu/Lark + WeCom platform adapters, Telegram webhook mode, Slack multi-workspace OAuth, Exa search backend. 95 PRs / 16 issues closed in 2 days. **Note:** despite the name similarity, this release is about running multiple *isolated Hermes instances/profiles*, not multi-agent task orchestration — see correction below. |
| v0.7.0 | 2026-04-03 | — | Pluggable memory-provider plugins (Honcho et al.); credential pools with rotation/fallback; Camofox anti-detection browser backend; API server tool-progress streaming |
| v0.8.0 | 2026-04-08 | — | (Not deep-dived; sits between v0.7 and v0.9 in the provider/tooling expansion arc) |
| v0.9.0 | 2026-04-13 | — | (Not deep-dived) |
| v0.10.0 | 2026-04-16 | — | Nous Tool Gateway (route search/image/TTS/browser through Nous Portal subscription); AWS Bedrock provider |
| v0.11.0 | 2026-04-23 | — | Ink-based TUI (`hermes --tui`); pluggable `ProviderTransport` ABC; NVIDIA NIM, Arcee AI, Vercel ai-gateway, Codex OAuth (GPT-5.5) providers; **subagents gain an explicit `orchestrator` role** that can spawn their own workers with configurable `max_spawn_depth` — earliest core building block toward multi-agent orchestration |
| v0.12.0 | 2026-04-30 | — | Native Spotify integration, Google Meet plugin, Piper local TTS, GMI Cloud / Azure AI Foundry / LM Studio / MiniMax OAuth / Tencent Tokenhub providers; Autonomous Curator (`hermes curator`) |
| v0.13.0 | 2026-05-07 | "The Tenacity Release" | **Multi-agent Kanban ships as a durable board** — "delegate to an AI team that actually finishes": heartbeats, task reclaim, zombie detection, per-task retries, hallucination-recovery gate. `/goal` (Ralph loop) keeps the agent on-target across turns. Checkpoints v2. Gateway auto-resumes sessions after restart. Security wave closes 8 P0s (redaction on by default, Discord guild-scoped role allowlists, WhatsApp stranger-rejection default). Google Chat becomes the 20th messaging platform. |
| v0.14.0 | 2026-05-16 | — | Kanban (Multi-Agent) continues maturing; `kanban_list`/`kanban_unblock` orchestrator board tools; native Windows early beta; subscription proxy (`hermes proxy`) for Claude Pro/ChatGPT Pro/SuperGrok OAuth creds |
| v0.15.0 | 2026-05-28 | "The Velocity Release" | **Kanban "grew into a real multi-agent platform" — 104 PRs**: orchestrator auto-decomposition of one task into a sub-task tree, `hermes kanban swarm` (root/parallel-workers/gated-verifier/gated-synthesizer/shared-blackboard graph in one command), per-task model overrides, worktree-per-task, scheduled starts, retry fingerprinting. Also: `run_agent.py` cut 76% (16,083→3,821 lines) into `agent/*` modules; `session_search` 4,500× faster; TUI multi-session orchestrator; OpenHands delegation skill; Bitwarden Secrets Manager |
| v0.15.1 | 2026-05-29 | "The Patch Release" | Full skills.sh catalog surfaced (858 → 19,932 entries) |
| v0.15.2 | 2026-05-29 | — | Patch |
| v0.16.0 | 2026-06-05 | "The Surface Release" | Native **desktop app** (macOS/Linux/Windows, Electron) built in 100 PRs/159 commits in one week; web dashboard admin panel; "Multi-Agent (Kanban) & Skills" section; NVIDIA/skills becomes a trusted Skills Hub tap; CVE-2026-48710 Starlette pin + SSRF hardening |
| v0.17.0 | 2026-06-19 | "The Reach Release" | iMessage (via Photon) + Raft agent network as new channels; background subagents; "Sessions, state & multi-agent" improvements; Skills Hub browser full rehaul (Featured section, preview + security scan per skill); dashboard profile builder; 300+ issues closed |
| v0.18.0 | 2026-07-01 | "The Judgment Release" | **Mixture-of-Agents as a first-class model**; work verification via "completion contracts"; `/learn` skill creation; `/journey` memory timeline; background task delegation; resolved ~700 P0/P1 issues; Google Vertex AI support |
| v0.18.1 | 2026-07-08 | — | Patch tag, ~660 PRs accumulated since v0.18.0 |
| v0.18.2 | 2026-07-08 | — | Infra patch (WhatsApp Baileys dependency fix) |
| v0.19.0 | 2026-07-20 | "The Quicksilver Release" | First-turn time-to-first-token down ~80% on every platform; live-streaming reasoning by default; ~20 desktop perf PRs; Bitwarden/1Password `SecretSource` plugin interface; smart approvals by default; unified "Capabilities page" (Skills/Tools/MCP/Hub); new frontier models (GPT-5.6, grok-4.5); reasoning-effort tiers; session export. Notably lists a "dynamic-workflow orchestration skill (landed, then reverted) — not shipping." |

**Correction to the research brief's premise:** the task asked to document "multi-agent orchestration v0.6.0" specifically. Verified against the actual v0.6.0 release notes (tag `v2026.3.30`, fetched directly from the GitHub Releases API): v0.6.0 is about **Profiles** (running multiple isolated Hermes *instances*), MCP server mode, Docker, provider fallback chains, and new messaging platforms — it does **not** mention multi-agent orchestration at all. The real multi-agent orchestration lineage is: v0.11.0 (2026-04-23, subagent `orchestrator` role + spawn depth) → v0.13.0 "The Tenacity Release" (2026-05-07, Kanban ships as a durable multi-agent board) → v0.14.0 (Kanban Multi-Agent matures) → v0.15.0 "The Velocity Release" (2026-05-28, Kanban becomes "a real multi-agent platform," swarm topology, 104 PRs) → v0.16.0 (Multi-Agent Kanban & Skills) → v0.17.0 (Sessions, state & multi-agent) → v0.18.0 (Mixture-of-Agents as first-class model). If the brief's "v0.6.0" reference is a paraphrase of "profiles/multi-instance," that's accurate for v0.6.0; if it means multi-agent task orchestration, the correct anchor version is **v0.13.0**, not v0.6.0.

### Open issue themes
- Total open items via GitHub search API: **7,965** (issues; this count mixes bugs/features/RFCs, GitHub search doesn't cleanly separate issues from PRs in this tally).
- Most-commented open issues (proxy for community priority) cluster around:
  - **Protocol interoperability**: "A2A (Agent-to-Agent) Protocol Support" (#514, 22 comments), "Generalized ACP client for multi-agent CLI orchestration" (#5257, 17 comments)
  - **Token/cost efficiency**: "Lazy Tool Schema Loading — Two-Pass Tool Injection" (#6839, 30 comments — top issue), "Token overhead analysis: 73% of each API call is fixed overhead (~13.9K tokens)" (#4379, 17 comments)
  - **Multi-tenancy / isolation**: "Solving the Multi-Tenant Hermes Problem" (#34352), "Single-Daemon Multi-Agent with Per-Topic Workspace & Memory Isolation" (#9514), "Topic-to-Profile routing" (#10143)
  - **Memory/session infrastructure**: "Persistent Session Memory with Cross-Session Search & Auto-Compression" (#8457), "Configurable Memory Backends — disable memory.md, use honcho/fact_store only" (#47349), "Pluggable SessionDB Provider — PostgreSQL, MySQL, and Beyond" (#23717)
  - **Platform integration bugs**: "Windows desktop app fails to compile during hermes update" (#40187), "Hermes openai-codex fails on same machine/network where official Codex CLI still works" (#13834)
  - **Trust/governance for self-improvement**: "Receipts for self-improving agents: proving which skill version produced which output" (#11692) — directly relevant to the self-evolution repo's guardrail concerns
- Label taxonomy shows the shape of the project: `area/*` (auth, billing, compression, config, docker, i18n, memory, profiles, sessions, streaming, usage-cost), `backend/*` (daytona, docker, modal, singularity, ssh, vercel), `platform/*` (12+ messaging platforms), `provider/*` (16+ model providers: anthropic, arcee, bedrock, copilot, deepseek, gemini, huggingface, kimi, minimax, nous, nvidia, ollama, openai, openrouter, qwen, vercel, xai, xiaomi, zai), `sweeper:*` (automated triage-bot labels: blast-radius tiers, cannot-reproduce, implemented-on-main, incoherent, not-planned, risk-automation/caching/compatibility/message-delivery/platform-windows), and standard `P0`–`P4` priority labels.

---

## 2. 0xNyk/awesome-hermes-agent

Source: https://github.com/0xNyk/awesome-hermes-agent
Source: https://raw.githubusercontent.com/0xNyk/awesome-hermes-agent/main/README.md
Source: https://api.github.com/repos/0xNyk/awesome-hermes-agent

### Repo stats (live)
- Stars: **4,971**
- Forks: 352
- Open issues: 28
- License: "Other" (repo README states CC BY 4.0 for the list itself; individual linked resources keep their own licenses)
- Created 2026-03-23; last pushed 2026-07-17; last README-declared ecosystem review: **2026-07-16**, tracking Hermes core version v0.18.2

Independently maintained by 0xNyk; explicitly **not an official Nous Research project**. Frames itself as a directory of the *optional* layer around core Hermes (skills, plugins, memory providers, surfaces, bridges) — distinct from the core repo itself.

### Maturity tagging system
Every entry is tagged **production** (stable/documented/maintained), **beta** (functional, rough edges), or **experimental** (proof-of-concept). Tags are described as "editorial snapshots" based on docs quality, maintenance signal, and adoption — re-check before depending on anything tagged non-production.

### Explicit "trust boundary" section
Before the catalog, the README inserts a security disclaimer: an ecosystem listing is "a discovery aid, not a security endorsement." Recommends checking who can trigger a community skill/plugin/MCP server/cron job, what tools/credentials it touches, and preferring the smallest toolset + isolated backend for untrusted work.

### Categories and most notable entries

**Official Resources** — Hermes Agent core (215k+ stars per README, 220k+ live), `autonovel` (autonomous 100k+ word novel-writing pipeline built on the agent loop), `hermes-paperclip-adapter` (runs Hermes as a managed employee inside "Paperclip" company/governance system), `hermes-agent-self-evolution`, `tinker-atropos` (standalone Atropos + Thinking Machines Tinker API integration for RL training on real agent trajectories), and the **Skills Hub** listed here as `agentskills.io` — "the open standard for agent skills. Compatible across Hermes, Claude Code, Cursor, Codex, and other agents."

**Skills & Plugins** (largest section by far, ~90 entries across four subsections):
- *Community Skills* (~30 entries): notable ones include `hermes-plugins` (Discord voice bridge w/ Gemini Live, WhatsApp bridge — beta, by a frequent core contributor), `oh-my-hermes` (multi-agent orchestration skill suite: deep-research, deep-interview, `ralplan`, `ralph`, `triage`, `autopilot` — inspired by `oh-my-claudecode`), `hurmoz` (63-skill Arabic-first pack: prayer times, zakat, Quran, dialect-aware NLP), `hermes-skill-factory` (meta-skill that auto-generates skills from repeated workflows), `PolyBrain` (multi-agent, multi-model orchestration with per-role LLM assignment and citation enforcement)
- *agentskills.io Ecosystem* (~30 entries) — the biggest star counts in the whole list live here: **open-design** (78k+ stars — local-first Claude-Design alternative, 31 skills over 129 design systems), **Anthropic-Cybersecurity-Skills** (25k+ stars — 753+ skills mapped to MITRE ATT&CK), **drawio-skill** (5.8k+ stars — natural-language-to-diagram), **TypeUI for Hermes** (1.4k+ stars — design-system skill registry), **youtube-skills** (fixes YouTube transcript-fetch failures on cloud VPS IPs via a third-party transcript API)
- *Plugins* (~35 entries): highlights include `rtk-hermes` (60–90% shell-output token reduction via output compression, "96.6% efficiency across 11M+ tokens processed"), `eagle-eye` (5-layer skill router narrowing 50+ installed skills to top-5 candidates per call), `hermes-curator-evolver` (SQLite-backed companion to the built-in Curator with optional embedding-based skill re-ranking), `hermes-dynamic-workflows` (Claude-Code-style sandboxed workflow scripts orchestrating up to 1,000 subagents)
- *Skill Registries & Discovery* (~5 entries): `skilldock.io`, `Global Chat` (18K+ MCP servers/agents directory), `CreatorSkills` (30+ skills for content creators), `hermeshub`

**Memory Providers** (~17 entries): `hindsight` (Vectorize — retain/recall/reflect), `mem0` (universal multi-level memory, official Hermes integration), `honcho`/`honcho-self-hosted` (Plastic Labs — dialectic user modeling, the same Honcho referenced in core README), `supermemory`, `Mnemosyne` (SQLite + sqlite-vec hybrid search purpose-built for Hermes), `hexus` (Postgres + local BERT embeddings, no LLM calls on the hot path).

**Tools & Utilities**: `hermes-workspace` (production, full web GUI — chat/terminal/memory browser/skills manager, built at Nous Hackathon 2026), `mission-control` (production, 5.7k+ stars — fleet dashboard for multi-agent orchestration/cost tracking), `Hermes Studio` (production, 9.1k+ stars — Vue 3 dashboard with multi-agent group chat and @mention routing), `camofox-browser` (production, 7.7k+ stars — stealth headless browser bypassing Cloudflare/bot-detection, used in production by askjo.ai), `SkillClaw` (auto-evolves/deduplicates skill libraries from real session data — a second, independent take on the same problem `hermes-agent-self-evolution` targets). Deployment subsection covers Docker images and a Kubernetes/Docker control plane (`Nora`).

**Integrations & Bridges** (~30 entries): notable — `screenpipe` (production, local-first screen/audio capture giving Hermes long-term "what you saw/heard" memory via MCP), `Not Human Search` (production — an MCP server indexing 8,600+ agent-friendly sites/MCP servers), `MeiGen-AI-Design-MCP` (1.5k+ stars, 9-model image/video-gen MCP server), `1claw-hermes` (HSM-backed secret vault + TEE proxy that redacts secrets/PII before they reach the model provider).

**Detection & Media Forensics**: single entry, `resemble-ai/detect-skill` — deepfake/AI-media detection, audio source tracing, invisible watermarking.

**Multi-Agent & Swarms** (5 entries, all beta/experimental): `MisakaNet` (Git-based distributed swarm memory — agents share lessons via GitHub Issues, "104+ lessons, 21+ registered nodes, zero infrastructure beyond GitHub"), `opencode-hermes-multiagent` (17 specialized OpenCode agents), `bigiron` (AI-native SDLC).

**Domain Applications** (~15 entries): robotics (`hermes-embodied`), Minecraft companion (`hermescraft`), job hunting (`job-scout-agent`), legal contract analysis (`hermes-legal`), IoT mushroom cultivation (`mycodo-hermes-skill`), 3D printing (`snapmaker-u1-toolkit`).

**Forks & Derivatives** (4 entries, all beta/experimental): `hermes-agent-camel` (adds CaMeL formal trust-boundary verification), `orahermes-agent` (Oracle OCI GenAI harness), `Hermes Alpha` (autonomous bug-bounty research experiment — flagged in the README itself as stalled: "last code push March 16, 2026, no releases").

**Guides & Documentation** (3 entries): `hermes-agent-docs` (mudrii, described here as "covers v0.2.0 in detail, useful supplement... for deployment patterns"), `hermes-wsl-ubuntu`, `HermesWiki`.

**Operational Playbooks / Level-Up Blueprints**: curated, opinionated stack recommendations — e.g. "Self-improvement without self-delusion" pairs `hermes-agent-self-evolution` with scheduled regression checks and a second evaluation pass, explicitly warning "the trick is not 'evolve faster'; it's 'evolve without quietly getting weird.'"

### Contribution rules
Resource must relate to Hermes Agent or agentskills.io; needs a clear README and reasonable maintenance; duplicate-checked. List itself is CC BY 4.0.

---

## 3. mudrii/hermes-agent-docs

Source: https://github.com/mudrii/hermes-agent-docs
Source: https://raw.githubusercontent.com/mudrii/hermes-agent-docs/main/README.md
Source: https://api.github.com/repos/mudrii/hermes-agent-docs

### Repo stats (live)
- Stars: 69 · Forks: 7 · Open issues: 1
- Language: MDX (Mintlify/Docusaurus-style docs source)
- Created 2026-03-16; last pushed 2026-05-18 (i.e., **frozen at Hermes v0.14.0** — hasn't been updated for v0.15.0 through v0.19.0 as of this research date)
- Repo description: "Comprehensive documentation for Hermes Agent by NousResearch — the self-improving AI agent (v0.2.0)" (a stale description string — the actual content inside documents up to v0.14.0)

### What it covers that official docs don't (or don't emphasize)
This is an independent, single-maintainer documentation project that reads like an engineering changelog crossed with a docs site — its distinguishing trait is **tying every feature to the exact version/PR it shipped in**, which the official docs (organized by topic, not history) don't do:
- Names internal implementation details the official docs omit or abstract away, e.g.: the agent core class is `AIAgent` in `run_agent.py`; tool calls execute via `ThreadPoolExecutor` with **up to 8 parallel workers**; the transport layer is a `ProviderTransport` ABC with concrete `AnthropicTransport`/`ChatCompletionsTransport`/`ResponsesApiTransport`/`BedrockTransport` implementations.
- Flags a real operational gotcha not typically surfaced in official docs: **"Python package status — the source release is versioned as `hermes-agent` 0.14.0, but PyPI currently serves 0.13.0 (verified May 18, 2026). Use the git installer for v0.14.0 until PyPI publishes 0.14.0."** — a install-method-vs-version-lag trap.
- Full historical enumeration of every messaging platform ever added, in the order added (useful as an "ecosystem growth" reference the official docs don't present as a timeline).
- Explicitly maps each provider integration to the version it landed in (e.g., "AWS Bedrock (v0.10.0, expanded in v0.11.0)," "NVIDIA NIM (v0.11.0)"), letting a reader reconstruct provider-support history without diffing release notes themselves.
- Per the earlier automated fetch, the README also flags content areas it deliberately leaves under-documented: the **Atropos Runtime** (model-training frameworks live in optional skills rather than a bundled runtime), deep **Skills Hub / agentskills.io / ClawHub / skills.sh** integration mechanics, detailed **research-trajectory** (ShareGPT-format) evaluation methodology, and full **Windows hardening roadmap** (acknowledged as "early beta" with known PTY/embedded-terminal limitations).
- File tree: `developer-guide/`, `getting-started/`, `guides/`, `integrations/`, `reference/`, `user-guide/` (mirrors the structure of the real docs site, i.e., it's a fairly faithful independent mirror/rewrite rather than a wholly different taxonomy), plus a `user-stories.mdx` file of narrative use cases the technical docs don't include.

### 0xNyk's awesome-list characterization
Tagged **beta**, described as "comprehensive community documentation... Covers v0.2.0 in detail, useful supplement to the official docs for deployment patterns."

---

## 4. Self-evolution repo — NousResearch/hermes-agent-self-evolution

Source: https://github.com/NousResearch/hermes-agent-self-evolution
Source: https://raw.githubusercontent.com/NousResearch/hermes-agent-self-evolution/main/README.md
Source: https://api.github.com/repos/NousResearch/hermes-agent-self-evolution

(Note: this lives under the **NousResearch** org, not a third-party account — confirmed via direct repo fetch, correcting any assumption it's community-run.)

### Repo stats (live)
- Stars: 4,804 · Forks: 545 · Open issues: 99
- Created 2026-03-09; last pushed 2026-06-17
- License: MIT

### What it does
- Full name: "Hermes Agent Self-Evolution." Tagline: "Evolutionary self-improvement for Hermes Agent."
- Uses **DSPy + GEPA** (Genetic-Pareto Prompt Evolution) to automatically evolve/optimize Hermes's skills (SKILL.md files), tool descriptions, system-prompt sections, and code — "producing measurably better versions through reflective evolutionary search."
- **No GPU training required** — operates entirely via API calls (mutate text → evaluate → select best variant); estimated cost **~$2–10 per optimization run**.
- GEPA's distinguishing mechanism per the README: it reads execution traces to understand *why* something failed, not just that it failed, then proposes targeted mutations — cites GEPA as an **ICLR 2026 Oral** paper, MIT licensed.
- Secondary engine, used only for code (not prompts/skills): **Darwinian Evolver** (Git-based organism evolution, AGPL v3, invoked as an external CLI, not bundled).

### How it plugs into Hermes Agent
- It is a **separate repository/pipeline, not merged into hermes-agent core**. Workflow: point it at a local Hermes install via `HERMES_AGENT_REPO=~/.hermes/hermes-agent`, run `python -m evolution.skills.evolve_skill --skill <name> --iterations N --eval-source [synthetic|sessiondb]`, and the pipeline reads the current skill/prompt, generates or reuses an eval dataset (synthetic, or real session history pulled from **Claude Code, Copilot, and Hermes** session logs), runs GEPA optimization, and gates candidates through: (1) full test suite must pass 100%, (2) size limits (skills ≤15KB, tool descriptions ≤500 chars), (3) caching-compatibility check (no mid-conversation prompt changes — matches the core repo's "prompt caching is sacred" rule from AGENTS.md), (4) semantic-preservation check, (5) **mandatory human PR review — "never direct commit."** Output is a **pull request against `hermes-agent`**, not an automatic merge.
- Roadmap table shows only **Phase 1 (skill files) is implemented**; Phases 2–5 (tool descriptions, system-prompt sections, tool implementation code via Darwinian Evolver, and a fully automated continuous-improvement loop) are marked "Planned," not built.
- An open issue in the repo (**#18, "Is the hermes-agent-self-evolution project integrated into hermes-agent?"**) suggests even users are unsure of the integration boundary — reinforcing that, as of this research date, it is an **adjacent tool that proposes changes via PR, not a built-in runtime feature** of Hermes Agent.
- Other live open-issue themes: validator bugs where the constraint/skill-structure checker rejects legitimate evolved output (#93, #11), and a reported no-op bug where "Skill evolution is a no-op: optimized_module.skill_text is the unchanged baseline" (#141) — i.e., the pipeline has known rough edges as of July 2026.

---

## 5. Skills Hub + the agentskills.io open standard

Source: https://agentskills.io
Source: Hermes Agent release notes (v0.14.0 through v0.19.0), fetched above

**Important distinction the ecosystem docs draw clearly: "Skills Hub" and "agentskills.io" are two different things that get used together.**

### agentskills.io — the open format/standard
- **What it is**: "Agent Skills are a lightweight, open format for extending AI agent capabilities with specialized knowledge and workflows." A skill is a folder containing a required **`SKILL.md`** file (YAML frontmatter with at minimum `name` and `description`, plus markdown instructions), optionally bundled with `scripts/`, `references/`, `assets/`, and other files.
- **Origin/governance**: "originally developed by Anthropic, released as an open standard," now open to contributions from the broader ecosystem via GitHub (github.com/agentskills/agentskills) and Discord.
- **How loading works — "progressive disclosure," 3 stages**: (1) Discovery — at startup the agent loads only each skill's name+description; (2) Activation — when a task matches, the full SKILL.md loads into context; (3) Execution — the agent follows instructions, optionally running bundled code/loading referenced files. This keeps large skill libraries cheap in context even when only a few are relevant per turn.
- **Adoption breadth (directly observed on the site's client showcase, not summarized)**: at least 42 distinct clients/platforms are listed as supporting the standard, including Hermes-adjacent and competitor agents alike — Claude Code, Claude (claude.ai), OpenAI Codex, Cursor, Gemini CLI, GitHub Copilot, VS Code, OpenHands, OpenCode, Goose, Letta, Roo Code, Kiro, Databricks Genie Code, Snowflake Cortex Code, Mistral AI Vibe, Amp, Junie (JetBrains), Factory, Tabnine, Qodo, and many smaller/independent agent runtimes (ZeroClaw, nanobot, fast-agent, bub, pi, Workshop, TRAE, Ona, Emdash, VT Code, etc). Hermes Agent itself is **not** listed among the showcased client logos on this fetch, despite the core README explicitly claiming compatibility — worth flagging as a gap (see uncertainty list).
- No skill-count or platform-count statistic is published directly on agentskills.io itself (unlike third-party sites, see below).

### Skills Hub — Hermes Agent's in-product feature
Distinct from the standard above: "Skills Hub" is the **name of the browsing/installation UI built into Hermes Agent** (CLI, dashboard, desktop app) for discovering and installing SKILL.md-format skills from various trusted sources ("taps"). Built up incrementally across releases:
- v0.2.0 (2026-03-12): initial "Skills Ecosystem" ships with a Skills Hub for community discovery, 70+ bundled/optional skills across 15+ categories.
- v0.14.0 (2026-05-16): `huggingface/skills` wired in as a trusted default tap; richer info panels added.
- v0.15.1 (2026-05-29): the skills.sh catalog integration is fixed to surface its **full 19,932 entries** (was capped at 858 due to pagination).
- v0.16.0 (2026-06-05): `NVIDIA/skills` added as a trusted tap alongside OpenAI, Anthropic, and HuggingFace, pulling real category labels from a `skills.sh.json` sidecar.
- v0.17.0 (2026-06-19): full ground-up rehaul — connected hubs, a "Featured" section, full skill previews, and a **security scan on each skill** before install.
- v0.19.0 (2026-07-20): folded into a unified "Capabilities page" (Skills/Tools/MCP/Hub in one UI) with CLI/dashboard parity.

### Notable popular skills (from third-party sources, cross-referenced against the awesome-list)
- **open-design** — 78k+ stars, local-first design-generation skill suite (31 skills, 129 design systems).
- **Anthropic-Cybersecurity-Skills** — 25k+ stars, 753+ skills mapped to MITRE ATT&CK.
- **drawio-skill** — 5.8k+ stars, natural-language diagram generation.
- **TypeUI for Hermes** — 1.4k+ stars, design-system component skill registry.
- A WebSearch result (fast.io, third-party marketing site, not independently verified by direct fetch) claims a "Hermes Agent Skills Hub" marketplace listing **672 skills**; a different third-party site (GuildSkills) claims "**124,000+ skills** for Hermes Agent, Cursor, Codex, Gemini CLI, OpenCode, Claude Code, and 30+ more clients." These two numbers (672 vs. 124,000+) are wildly inconsistent with each other and with the 19,932-entry skills.sh figure that Hermes's own release notes cite — **treat all three as unverified marketing claims, not confirmed facts** (see uncertainty list).

---

## 6. Nous Research context — Nous Portal, default models, pricing

Source: https://hermes-agent.nousresearch.com/docs/integrations/nous-portal (fetched)
Source: https://hermes-agent.nousresearch.com/docs/guides/run-nemotron-3-ultra-free (fetched)
Source: https://portal.nousresearch.com/ (WebFetch blocked by repeated HTTP 429 rate-limiting — pricing figures below are from WebSearch snippets only, not a direct page fetch; flagged as needing verification)
Source: https://nousresearch.com/wp-content/uploads/2025/08/Hermes_4_Technical_Report.pdf (existence confirmed via search, not fetched in full)

### What Nous Portal is
A **unified subscription gateway** consolidating model access and tool access under one Nous Research account/bill, so a Hermes Agent user doesn't have to collect separate API keys for the model, web search, image generation, TTS, and a cloud browser. Core components:
- **Model catalog**: "300+ frontier models, one bill" — the docs describe it as proxying through OpenRouter while billing against the Nous subscription, alongside first-party Nous inference (`inference-api.nousresearch.com/v1`, per mudrii's docs, described there as "400+ models via Nous inference").
- **Tool Gateway**: bundled hosted tools — web search/extraction (Firecrawl), image generation (nine models including FLUX 2 and GPT Image, per Portal page), text-to-speech (OpenAI TTS), browser automation (Browser Use), and an optional cloud terminal sandbox (Modal).
- **Setup**: single command `hermes setup --portal` — OAuth login, sets Nous as provider, activates Tool Gateway; `hermes portal info` shows what's wired up. Users can still mix in their own per-tool API keys ("the gateway is per-backend, not all-or-nothing").

### Default / recommended models — explicitly NOT Hermes 4
Per the Nous Portal integration doc (direct fetch): the documentation **does not set one single hard default** — users choose during setup — but it explicitly **recommends** Claude Sonnet 4.6, GPT-5.5 Pro, Gemini 3 Pro Preview, and DeepSeek V4 Pro for agentic/tool-calling work, and states **Hermes 4 is "not recommended for use inside Hermes Agent" because it's tuned for chat rather than rapid tool-calling.** This is a specific and easy-to-miss nuance: Nous Research's own **Hermes 4** model family (the fine-tuned LLM line, confirmed real via the existence of `Hermes_4_Technical_Report.pdf` on nousresearch.com, dated August 2025) is a *different product* from **Hermes Agent** (the software agent this whole corpus is about) — sharing a name but not a default pairing.
- Nemotron 3 Ultra is separately reachable and, per a dedicated docs guide, was offered **free for a limited promotional window (June 4–18, 2026)** through a Nous Research / NVIDIA "Nemotron Coalition" / Nebius infrastructure partnership — select the exact `nvidia/nemotron-3-ultra:free` model tag via Nous Portal (Free plan) to avoid being charged.

### Pricing (WebSearch-sourced only — direct fetch of portal.nousresearch.com returned HTTP 429 twice; treat as unverified pending a successful direct fetch)
- **Free**: $0/month; pay-as-you-go credits available starting at $10 (1:1 conversion mentioned in one snippet); free-tier accounts get inference access but **not** the managed Tool Gateway — that requires a paid plan per one search snippet.
- **Plus**: $20/month → $22/month in usage credit (+$2 bonus on signup/upgrade/renewal, per one snippet).
- **Super**: $100/month → $110/month in usage credit (+$10 bonus).
- **Ultra**: $200/month → $220/month in usage credit (+$20 bonus), highest rate limits.
- All paid tiers bundle the "four core tools" (web search, image generation, TTS, browser automation) plus the 300+ model catalog.
- A Nous Research team member (Teknium, on X) is quoted in search snippets confirming "Nous Portal tiers now give discounts to usage costs" and 300+ models "powers all core tools in Hermes Agent in one subscription" — corroborates the tiering exists, but the exact dollar figures above come from secondary summarization, not a page I fetched directly.

---

## Facts uncertain / needs verification

1. **Nous Portal pricing figures** (Free/$10 PAYG, Plus $20/$22, Super $100/$110, Ultra $200/$220, bonus credits) — sourced only from WebSearch result summaries; `portal.nousresearch.com` and `portal.nousresearch.com/pricing` both returned HTTP 429 on direct WebFetch attempts. Needs a direct-fetch re-check before treating as authoritative.
2. **"Skills Hub" skill-count claims are inconsistent across sources**: Hermes's own release notes say the integrated skills.sh catalog has 19,932 entries (as of v0.15.1); a third-party site (fast.io) claims "672 Skills" for a "Hermes Agent Skills Hub Marketplace"; another third-party site (GuildSkills) claims "124,000+ skills" across Hermes and 30+ other clients. These cannot all be true simultaneously and none were independently cross-checked beyond the search snippet — do not repeat any single number as fact without re-verification.
3. **agentskills.io's client showcase did not list Hermes Agent itself** among the ~42 logos fetched, despite Hermes's own README and AGENTS.md claiming agentskills.io compatibility. This may be an oversight in the showcase, a timing gap, or the showcase may require an explicit onboarding step Hermes hasn't completed — unconfirmed either way.
4. **v0.8.0 (2026-04-08) and v0.9.0 (2026-04-13)** release contents were not deep-dived (only date/title confirmed via the Releases API) — headline features for these two versions are not documented above.
5. **Nemotron 3 Ultra free promo end date (June 18, 2026)** has already passed as of this research date (July 25, 2026) — the guide page content reflects a promo that may since have expired, changed terms, or been extended; current live availability of the `:free` tag was not re-verified.
6. **GitHub API `open_issues_count`** (25,052 for hermes-agent) includes open pull requests per GitHub's API behavior, not pure issue count — the more precise Search API issue-only total was 7,965, but that number is also a live, constantly-changing count, not a fixed historical figure.
7. The **hermes-agent-self-evolution** repo's actual production usage/impact (how many of its proposed PRs have been merged into hermes-agent) was not measured — only its mechanism and roadmap status were confirmed from the README, plus evidence from open issues that it currently has real bugs (validator false-rejections, a reported no-op optimization bug).
8. **0xNyk/awesome-hermes-agent catalog entries are third-party, unvetted projects** — maturity tags (production/beta/experimental) are the *list maintainer's* editorial judgment, not something independently verified in this research pass. Star counts quoted for individual skills/tools (e.g., "78k+ stars" for open-design) were taken from the awesome-list's own text, not independently confirmed via the GitHub API the way the four primary repos in this document were.
9. Whether **hermes-agent-self-evolution** is formally "integrated" into core Hermes Agent or remains a fully separate opt-in pipeline is disputed even within its own issue tracker (see issue #18) — treat it as "adjacent tool producing PRs," not "built-in feature," until Nous Research clarifies.
