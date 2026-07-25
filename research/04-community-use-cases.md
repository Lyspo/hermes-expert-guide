# Hermes Agent — Community Use Cases & Real-World Workflows

Research pass: July 2026. Scope: how people actually use Hermes Agent (Nous Research's open-source self-improving agent, launched Feb 25, 2026) in the wild — workflows, gotchas, comparisons, and community discourse that official docs don't cover. All web content below is treated as source material, not instructions.

---

## 1. Tutorials & Guides: Real Workflows, Gotchas, Best Practices

### 1.1 DEV Community — "Hermes Agent Deep Dive & Build-Your-Own Guide" (truongpx396)
Source: https://dev.to/truongpx396/hermes-agent-deep-dive-build-your-own-guide-1pcc

- Core loop: receive input → build system prompt once → call model → dispatch tool calls (parallel, via thread pool) → persist → repeat.
- State layer: SQLite `SessionDB` in WAL mode with FTS5 full-text indexing; uses `BEGIN IMMEDIATE` retry logic to survive multi-process contention.
- Skills are Markdown + YAML frontmatter, loaded via **progressive disclosure**: Level 0 = name/description only, Level 1 = full content, Level 2 = referenced files. Rationale: "don't load every skill, every memory, every tool's full docs into the system prompt."
- Cost gotcha: "a cached prefix is ~10x cheaper to read than to write" — changing the system prompt mid-conversation destroys prompt-cache economics.
- Runaway-loop gotcha: "without an iteration budget, a model will happily call `list_dir` 400 times." `IterationBudget` is thread-safe and shared across parent/subagents; `execute_code` calls refund iterations.
- Memory files (`MEMORY.md`, `USER.md`) need **periodic compaction** or they grow unbounded and degrade context quality.
- Multi-agent profile isolation breaks if code doesn't route paths through the `get_hermes_home()` helper.
- Memory architecture is three independent mechanisms layered together: frozen-snapshot files loaded into the system prompt per session, SQLite session search (FTS5) for cross-session recall, and pluggable external providers (e.g., Honcho, which runs three separate reasoning passes to build a user model).
- Author provides a 9-phase, 2–3 week "build your own agent like this" checklist — signal that the architecture is now a known reference pattern being taught, not just a product.

### 1.2 NxCode — "Hermes Agent Tutorial: Install, Safety, Telegram" (July 2026)
Source: https://www.nxcode.io/resources/news/hermes-agent-tutorial-install-setup-first-agent-2026

- One-line installer (`curl -fsSL .../install.sh | bash`) handles OS detection, dependency install (Python 3.11+, Node.js, ripgrep, ffmpeg), clone to `~/.hermes`, venv setup, global `hermes` command registration, and launches setup wizard. ~5 minutes.
- Verify with `hermes --version` / `hermes doctor`.
- **Tirith** = Hermes's built-in security module; hard-blocks dangerous commands (e.g., piping curl output straight to shell).
- Explicit warning against copying stale install snippets from older secondary articles — "the official GitHub releases now show multiple later July-era releases," i.e., the ecosystem content is aging fast and going stale within weeks.
- Recommended first task: non-critical automation like "monitor RSS feeds, summarize papers, deliver daily briefings to Telegram."
- Best practice checklist: restrict filesystem to one project directory first; dedicated bot token + `TELEGRAM_ALLOWED_USERS` allowlist; API keys only in env vars/secret storage, never chat; test read-only workflows before granting write; use containers/VMs for experimental automation; review release notes monthly given shipping velocity.
- Troubleshooting table: context-too-small errors (`ollama run <model> --ctx-size 65536`), high token usage (`/compress`), gateway connectivity (`hermes doctor`), blocked commands (review Tirith rules), cron jobs silently not firing (check gateway is actually running).

### 1.3 MindStudio — "Hermes Agent's 5-Pillar Architecture"
Source: https://www.mindstudio.ai/blog/hermes-agent-5-pillar-architecture-memory-skills-soul-crons

Five pillars: **Memory** (`user.md` + `memory.md`, loaded at session start — "stale memory is the number one cause of weird agent behavior"), **Skills** (91 built-in + 520+ community skills, progressive disclosure), **Soul** (`soul.md` — persistent personality/tone; multiple agents can run distinct souls, e.g. customer-facing vs. internal-research), **Crons** (natural-language scheduling, e.g. "Every night at 12am Central time, push changes to this GitHub repo" auto-creates both a skill and a scheduled job; cron sessions run isolated and cannot recursively spawn more cron jobs), and the **Self-Improving Loop** emergent from all four — explicitly: "automatic does not mean magic... passive use generates minimal gains."

Recommended onboarding sequence: connect GitHub with a nightly sync cron on day one → populate `user.md`/`memory.md` in a 10-minute session → observe and refine skill triggers → grant scoped API credentials, not personal access tokens. Gotcha: store secrets via `hermes config set GITHUB_TOKEN [token]`, never paste into chat. Guidance on when to split agents: only when functions need genuinely different permissions/secrets/long-term memory, not by default ("avoid one mega-agent with excessive scope").

### 1.4 Medium — "7 Hermes Agent Pitfalls Nobody Warns You About" (Kelvin Kwong, June 2026)
Source: https://medium.com/@tszhim_tech/7-hermes-agent-pitfalls-nobody-warns-you-about-from-real-setup-experience-694c4f1b09be

1. **Finishing setup without understanding consequences** — connecting WhatsApp gives Hermes your real phone number with no preview/sandbox before it messages real contacts. Use dedicated accounts.
2. **Wrong model choice** — small local models (Ollama Qwen/Llama variants) fail multi-step tool-calling; `delegate_task` needs ≥64K context or it fails silently. Recommends 128K+ context models; author's pick: "GLM-5v-Turbo" for cost/capability balance.
3. **Bot doesn't respond ≠ token issue** — `hermes setup` configures the gateway but doesn't start it; you must run `hermes gateway run` or install as a background service. Discord additionally requires manually enabling "Message Content Intent" in the Developer Portal.
4. **Skills are semi-automatic, not automatic** — left alone, Hermes creates vague generic skills; you must explicitly say "remember this approach" / "create a dedicated skill for this" to get compounding value.
5. **Default memory is just two text files** — out of the box it's `MEMORY.md` + `USER.md` + basic SQLite search, not sophisticated semantic recall. Author recommends installing an external provider immediately (cites "Holographic" as a local-only, no-API-key, no-monthly-fee option via `hermes memory setup`).
6. **No profile separation = context bleed** — a single instance used for both work and personal contexts mixes them (code snippets in response to weather questions, etc.). `hermes profile create work` / `hermes profile create personal` isolates config/memory/skills — but profiles do **not** sandbox the filesystem; use Docker for that.
7. **Token costs surprise people** — real reported figures: "4 million tokens in two hours," "21,000 tokens for simple queries through messaging gateways." Messaging-gateway overhead (Telegram/Discord) runs 2–3x CLI cost because the gateway re-sends platform/user state, history, skills, memory, and system prompt every turn. Advice: start on cheap/free models, be selective about which skills/tools are enabled, consider flat-rate plans (cites a "$18/month" GLM coding-plan example) over pay-per-token for always-on deployments.

### 1.5 Petronella (Cybersecurity News) — architecture & setup guide
Source: https://petronellatech.com/blog/hermes-agent-ai-guide/ (WebFetch blocked 403; content below reconstructed from search snippets only — treat as lower confidence)

- Frames Hermes as solving "memory and compounding capability," a gap the author says most agent frameworks ignore.
- Entry points: CLI, API server, messaging gateway. Parallel tool execution via thread pool. State = local SQLite with full-text search.
- Two memory files: `user.md` (who you are — name, style, preferences) and `memory.md` (environment — active projects, business context, key relationships), both loaded at session start.
- Notes a pattern of using Claude as the primary reasoning layer and routing specific tool calls to a locally-running Hermes instance via MCP, treating Hermes as a specialized subagent rather than the primary driver.

### 1.6 Pioneer AI (Fastino Labs) — Hermes + model-routing guide
Source: https://pioneer.ai/blog/hermes-agent-the-complete-guide-to-the-self-improving-ai-agent-(2026)

- Describes Hermes as MIT-licensed, CLI + desktop app (macOS/Windows/Linux), "the agent that grows with you."
- Differentiator claim: "a closed learning loop: while solving problems with tools, it writes reusable 'skill' documents and curates a persistent memory file so the agent quite literally gets more capable the longer it runs."
- Since Hermes is model-agnostic, the guide positions Pioneer as a model-routing layer sitting behind Hermes's inference calls — four config commands to reach many providers behind one endpoint, pitched as also improving/cheapening inference over time via feedback loop.

### 1.7 Small business / operator guides
Sources: https://aibusinessoptimization.com/blog/using-hermes-agent-as-a-small-business-operations-assistant ; https://allcleardigital.com/blog/hermes-agent-business-use-cases ; https://www.hostinger.com/tutorials/hermes-agent-use-cases

- Framing: "agentic AI" = plan, call tools, check results, continue with supervision; Hermes offered as the reference example because tools + memory + skills + schedules + multi-platform execution are all present.
- Recommended small-business targets: documenting/automating estimate follow-up, missed-call handling, weekly report prep, customer-issue escalation.
- Explicit fit criteria (repeated across sources): task is repetitive but not fully structured; data is safe to expose to a model; output is easy for a human to review; time saved is measurable. Business case is weaker outside these conditions.
- Common use cases cited: customer support triage, sales lead research, content planning, ops assistance, daily briefings ("a morning summary of your metrics, calendar, and inbox"), scheduled research digests, meeting-notes-to-follow-up-draft conversion.

### 1.8 Julian Goldie — "How I Use Hermes Agent Daily: 9 Real Use Cases"
Source: https://juliangoldieaiautomation.com/blog/hermes-agent-use-cases/

Concrete personal-use patterns: (1) persistent-memory personal assistant answering "what have I been working on this week" from logged activity + Obsidian vault; (2) "second brain" auto-logging of conversations; (3) no-code app building by voice (habit tracker, meditation timer, flashcard game — "without writing code"); (4) rapid prototyping of full websites end-to-end via conversation; (5) content/video generation (author notes this is "still maturing"); (6) hands-free computer control via wake word ("Jarvis"/"Hermes") for browser/system operation; (7) multi-agent "mission control" — a "show me my team" view coordinating Claude, OpenClaw, Hermes, and Gemini instances with an agent group chat for inter-model communication; (8) goal-mode where you set an outcome instead of step-by-step prompts, with a dashboard to toggle auto/agent/control-room/goal/chat modes; (9) fully local/free stack via Ollama + Qwen 2.5 Coder for zero API cost.

### 1.9 Home-lab / self-hosted deployment
Sources: https://hermes-agent.nousresearch.com/docs/user-guide/messaging/homeassistant ; https://github.com/WolframRavenwolf/hermes-ha-addon ; https://shop.zimaspace.com/blogs/support-tips/hermes-agent-self-hosted-setup-home-server

- Home Assistant integration: long-lived access token (`HASS_TOKEN`, optional `HASS_URL`, default `http://homeassistant.local:8123`); WebSocket connection with 30s heartbeat + auto-reconnect; subscribes to `state_changed` events and can trigger agent runs on device state changes; outbound agent messages appear as HA persistent notifications titled "Hermes Agent."
- Security-relevant default: HA integration blocks certain service domains (`shell_command`, `command_line`, `python_script`, `pyscript`) to prevent arbitrary code execution through the smart-home bridge.
- Community-built HA add-on (WolframRavenwolf/hermes-ha-addon) packages Hermes as an installable Home Assistant add-on.
- Commonly run on VPS, NAS, or Raspberry Pi for a 24/7 home-lab presence.

### 1.10 VPS deployment walkthrough (MindStudio, ~1 hour, Hostinger-sponsored)
Source: https://www.mindstudio.ai/blog/how-to-deploy-hermes-agent-vps-under-one-hour-step-by-step-docker-setup-guide

- Stack: Hostinger KVM 2 VPS (~$100/yr promo), Ubuntu 24.04 LTS, Docker, Telegram bot via @BotFather, OpenAI Codex/GPT-5.5 as inference provider (ChatGPT subscription, not raw API key, in this particular walkthrough).
- 7-phase flow: provision VPS → launch Docker container + set admin creds → configure inference provider → create Telegram bot and wire it in → verify connectivity (agent self-diagnoses/restarts its own gateway process if unresponsive) → store GitHub token via `hermes config set GITHUB_TOKEN` (not pasted in chat) → request a nightly GitHub-backup cron in plain English, which the agent turns into a private repo + scheduled push with timezone conversion.
- Gotchas: GitHub **fine-grained tokens fail for repo creation** — classic tokens with repo scope required; context auto-compacts around ~136K tokens (expected, not a bug); cron jobs cannot recursively spawn more cron jobs (safety constraint); document VPS credentials/config in a dedicated file when running more than one agent to avoid cross-agent confusion.
- Best practice: start with one agent; only spin up additional containers when workload genuinely needs separate credentials or memory.

### 1.11 Awesome-Hermes-Agent community directory
Source: https://github.com/0xNyk/awesome-hermes-agent

Independent, community-maintained list organized into: Skills & Plugins, Memory Providers, Tools & Utilities, Integrations & Bridges, Detection & Media Forensics, Multi-Agent & Swarms, Domain Applications, Guides & Documentation. Notable entries include skills for autonomous incident response, Spotify control, cross-chain crypto monitoring; a local-first memory provider using local BERT embeddings + pgvector to avoid remote calls on the "hot path"; operator tooling with chat/terminal/memory-browser/skills-manager/inspector dashboards; integrations into Obsidian, Android, Microsoft 365, Feishu, and blockchain oracles; and domain applications spanning robotics, gaming, infra monitoring, and legal contract analysis. This breadth is itself a signal: within ~5 months of launch, Hermes had spawned a full third-party ecosystem comparable in shape to early Claude Code / OpenClaw plugin ecosystems.

### 1.12 Research-pipeline pattern
Sources: https://hermes-agent.ai/use-cases/researcher ; general search synthesis

- Common pipeline: pull recent arXiv papers → extract methodology sections → compare claims across papers → write a synthesis note → deliver a morning brief on what changed, run as a scheduled/parallelized workflow without a separate orchestration framework.
- Built-in arXiv skill uses the free arXiv REST API (no key required).
- One community benchmark claim (unverified, single source): self-created skills reduced repeat research-task time by "roughly 40%" versus a fresh agent with no accumulated skills.

---

## 2. Hermes Agent vs. OpenClaw

Multiple independent comparison pieces converge on the same framing even though they disagree on some numbers — treat exact figures as approximate/contested (see uncertainty list).

### 2.1 Consistent qualitative framing across sources
- **"Agent-first vs. gateway-first."** Quote (screenshotone.com): "Hermes Agent packages a gateway around a learning agent. OpenClaw packages an agent around a messaging gateway." (Source: https://screenshotone.com/blog/hermes-agent-versus-openclaw/)
- OpenClaw's center of gravity is multi-channel messaging orchestration and a persistent "agent team" model; Hermes's center of gravity is a single agent that compounds capability over time via its learning loop.
- Composio's framing: Hermes generates skills from repeated patterns automatically; OpenClaw relies on "static skills" that must be manually created/downloaded. Hermes memory is described as "lean, search-first" (tiered: core → reachable → vector search) vs. OpenClaw's "rich layers" that risk context bloat. Hermes is called "stateless-by-default" and "disk-first," suitable for a "$5 VPS," vs. OpenClaw's "long-running process with rich in-memory state." (Source: https://composio.dev/content/openclaw-vs-hermes-agent)

### 2.2 Learning loop
- Hermes: closed loop — writes reusable Markdown skills while solving tasks, stores outcomes in memory, adjusts approach next time. From v0.12+, an autonomous **"Curator"** process periodically evaluates the skill library, prunes unused skills, and consolidates redundant ones without manual intervention (runs on roughly a 7-day cycle per other sources).
- OpenClaw: "no built-in self-improvement mechanism... relies on manual skill management and updates" (innFactory).

### 2.3 Memory architecture
- OpenClaw: `MEMORY.md` format, semantic search added "in v4.1"; sessions persist as JSONL under `~/.openclaw/agents/<agent-id>/sessions/`.
- Hermes: pluggable memory providers (innFactory names 8 across sources: Honcho, OpenViking, Mem0, Hindsight, Holographic, RetainDB, ByteRover, Supermemory), with Honcho integration "from v0.7.0."

### 2.4 Security posture (most-cited differentiator, and most contested — see below)
- innFactory claims: OpenClaw had "six documented CVEs (CVSS 7.5–9.1)" and two supply-chain incidents ("ClawHavoc," reported as affecting 15,000–25,000 installs in one source and "1,184 malicious packages; 23 compromised accounts" in the same piece — internally inconsistent, flag as uncertain), plus an "MCP proxy campaign." Hermes is described as having a "proactive seven-layer security architecture" (DM-pairing user auth aligned to OWASP/NIST SP 800-63-4, dangerous-command approval modes, container isolation by default, MCP credential filtering with SSRF protection, context-file prompt-injection scanning, cross-session isolation, input sanitization) with "no publicly documented CVEs through May 2026."
- **This claim of zero Hermes CVEs is contradicted by other sources found in this research** (see §3.3): Cloud Security Alliance documents three real Hermes CVEs by May 2026 (CVE-2026-7396, CVE-2026-7397, CVE-2026-6829), plus a separate independent audit finding critical architectural issues. Community comparison pieces appear to repeat marketing claims uncritically — a notable pattern in this content ecosystem.

### 2.5 Deployment weight
- OpenClaw: heavier — hub-and-spoke, mandatory gateway daemon (`ws://127.0.0.1:18789` cited), 15+ native messaging platforms, both self-hosted and commercial SaaS (openclawai.io cited).
- Hermes: lighter/modular — CLI-first with optional gateway; container backends (Docker, Singularity, Modal, Daytona, Vercel Sandbox) are "first-class, not add-ons"; other sources list 5–6 sandbox/terminal backends (local, Docker, SSH, Singularity, Modal — one source adds Daytona) and 20–27+ messaging surfaces depending on source/date (platform count grew over 2026, so different articles report different totals).

### 2.6 When to choose which (synthesized consensus across sources)
- **Choose OpenClaw**: broad multi-platform messaging requirement (iMessage, Signal, Teams, Matrix), need commercial/SaaS support, compliance team can handle hardening multi-layer configs, want the larger ClawHub marketplace.
- **Choose Hermes**: security/self-hosting by design matters, MIT license without commercial ties preferred, fewer messaging integrations acceptable, want autonomous skill curation, containerized deployment is the default operating mode, solo builder/operator wanting a personal runtime that compounds over time rather than a team-communications platform.
- One source (innFactory) suggests a **hybrid**: run Hermes for high-security contexts, OpenClaw where ecosystem breadth justifies the hardening cost.

Sources: https://innfactory.ai/en/blog/openclaw-vs-hermes-agent-comparison/ ; https://composio.dev/content/openclaw-vs-hermes-agent ; https://screenshotone.com/blog/hermes-agent-versus-openclaw/ ; https://petronellatech.com/blog/openclaw-vs-hermes-agent-2026/ (fetch blocked 403, not independently verified) ; https://flowtivity.ai/blog/openclaw-vs-hermes-agent-comparison/ (title only, not fetched)

---

## 3. Reddit, X/Twitter & Security Discourse

### 3.1 Reddit (r/LocalLLaMA and similar)
No direct Reddit thread content could be retrieved via search in this pass — searches for `site:reddit.com` and r/LocalLLaMA-specific queries returned only tangential/unrelated Wikipedia and product pages, not actual thread text. **This is a real gap, not an omission** — flagged in §5. Indirect signal: multiple guide-sites reference local-model compatibility (Ollama, vLLM, SGLang, any OpenAI-compatible endpoint) as a headline feature, which is the kind of detail that typically originates from or is validated by r/LocalLLaMA-style communities, but no specific thread, username, or quote could be sourced directly.

### 3.2 X/Twitter
Source: search results surfacing individual X posts (https://x.com/NousResearch/status/2031083401172652066 ; https://x.com/NousResearch/status/2026758996107898954 ; https://x.com/AlexFinn/status/2039364255699599867 ; https://x.com/boringmarketer/status/2038301480243867947)

- Nous Research's own account promoted community praise, at one point having the agent itself "compile all this praise and make its own hype video."
- Official framing tweet: "Hermes Agent, the open source agent that grows with you. Hermes Agent remembers what it learns and gets more capable over time, with a multi-level memory system and persistent dedicated machine access."
- Alex Finn (creator/influencer account): positioned Hermes as "better than OpenClaw in some key ways" but stopped short of calling it an outright replacement — video framed around "workflows that will explode your productivity."
- "The Boring Marketer" (power-user testimonial, paraphrased quote): Hermes "manages its own memory and it actually works," proactively writes what it learns about the user, searches full conversation history, and "compresses context intelligently when sessions get long."
- A "10 Hermes Agent Hacks That Turned My Chat Agent Into a 24/7 System" viral-article aggregator existed but the source page returned HTTP 410 Gone on fetch — content could not be verified beyond the title.

### 3.3 Security incidents (the most concrete "in the wild" material found)

**Real CVEs (Cloud Security Alliance research note, May 4, 2026)**
Source: https://labs.cloudsecurityalliance.org/research/csa-research-note-hermes-agent-cves-20260504-csa-styled/
- **CVE-2026-7396** (CVSS 4.0): path traversal in the WeChat Work gateway adapter (`gateway/platforms/wecom.py`), v0.8.0, exploitable by unauthenticated remote attackers.
- **CVE-2026-7397** (CVSS 4.8): symlink-following vulnerability in the file-tools module (`tools/file_tools.py`), v0.8.0, fixed in v0.9.0.
- **CVE-2026-6829** (CVSS 5.3): path traversal in the separately-maintained `hermes-webui` package (maintained by "nesquena"), versions before v0.50.34, exploitable by any authenticated user on shared deployments.
- Independent audit by researcher **@Anic888** (published April 11, 2026) found more severe *architectural* issues beyond the formal CVEs: unrestricted shell execution via regex-bypassable command detection, unrestricted read access to sensitive local files (SSH keys, API tokens, git credential caches), container deployments shipping with **all approval checks disabled by default**, and persistent skill-file installation enabling post-session code execution. Plus nine "high severity" findings including a "YOLO mode" that disables all security checks and prompt-injectable auto-approval.
- CSA's top-line lesson: "the more consequential risks in both frameworks are architectural, not implementation bugs" — persistent memory enabling indirect prompt injection, and community skill marketplaces carrying npm-style supply-chain risk.
- Enterprise mitigations recommended: explicitly enable sandboxing, set `HERMES_WRITE_SAFE_ROOT`, disable YOLO mode, rotate credentials after any potentially-compromised deployment, isolate via container/VM for anything touching sensitive corporate resources.

**Nation-state-adjacent real-world exploitation (The Hacker News, July 2026)**
Source: https://thehackernews.com/2026/07/hacker-runs-hermes-ai-agent-unattended.html
- An attacker with pre-existing internal access to Thailand's Ministry of Finance network deployed open-source Hermes on a rented server and enabled **"YOLO mode"** (a real, documented feature intended only for "trusted, sandboxed environments") to remove human-approval requirements.
- Hermes then autonomously ran reconnaissance: kernel vulnerability scanning, privilege-escalation enumeration, filesystem exploration, and accessed personnel records dating back to 2012.
- Primary intrusion vector was unrelated to Hermes itself — a HiveServer2 instance with authentication mode `NONE` plus a malicious Java UDF (`HiveCmd.jar`) for arbitrary OS command execution via SQL queries; Hermes was the *post-exploitation automation layer*, not the initial-access vector.
- Discovered by Hunt.io / researcher Bob Diachenko: 585 files, 470MB of attacker tooling, and ~575 separate Hermes result-folder instances on an exposed staging server (Hong Kong IP 103.97.0.57) with directory listing left open — the same server had previously hosted ShadowPad and VShell malware infrastructure.
- Low-to-medium-confidence Chinese-language attribution based on SSH origin, a Chinese-language password string ("Leishen" / thunder god), and recovered FOFA asset-search credentials. No group formally attributed. National CERT notified July 15, 2026; findings published July 23–24, 2026; no confirmed data exfiltration and no official Thai government statement as of the report.
- Key analytical takeaway from the piece: "nothing in the recovered material shows it finding a new vulnerability" — the significance is that agent automation let a single operator scale routine post-exploitation work, not that Hermes discovered anything novel.

**Self-inflicted data-loss incident (GitHub Issue #30151, May 22, 2026)**
Source: https://github.com/NousResearch/hermes-agent/issues/30151
- A user set a Kanban board's `default_workdir` to their main projects folder during initial setup. A Telegram-created task inherited that path and was auto-tagged `workspace_kind: scratch`. When the agent called `kanban_complete`, the cleanup routine ran `shutil.rmtree()` on the inherited path with **no confirmation prompt and no warning log** — permanently deleting the user's entire projects directory (code, scripts, outputs, configs). The user only discovered it when reopening a project folder and finding it empty.
- Root cause per the report: `_cleanup_workspace()` in `kanban_db.py` never verifies whether `workspace_path` is a temp task-scoped directory or a real user directory before deleting it.
- Filed as **P1/critical**; proposed fixes include protecting well-known directories, restricting cleanup to a dedicated `workspaces/` subtree, and requiring confirmation before deleting any directory containing pre-existing files. The user's own workaround was a local patch adding protected-path guards.
- This is functionally the same failure class as the Home Assistant "blocked dangerous service domains" mitigation in §1.9 and the "no preview, no sandbox" WhatsApp warning in §1.4 pitfall #1 — a recurring community theme is that **default automation can act before a human reviews it**, and several separate teams/users independently rediscovered variants of that problem.

### 3.4 Advanced power-user patterns
- **Fleet management on shared VPS**: "create a Claude Code project specifically for managing your VPS agents" — a folder per Hermes agent, each with its own `.env` (admin credentials, container name, GitHub repo URL, notes on active skills/crons). Each agent gets its own Docker container, own `.env`, own GitHub repo. (Source: MindStudio VPS/cron search synthesis)
- **Cron fleet patterns**: morning briefings pulling from news sources, scheduled external-service health checks, delayed auto-responses to incoming messages — each built by describing the desired outcome in plain language and letting Hermes generate the skill + cron pairing.
- **Profiles for multi-agent isolation**: `hermes profile create <name>` gives a fully separate Hermes home directory (config, API keys, memory, sessions, skills, gateway state) — the sanctioned way to run several independent agents on one machine. (Source: https://hermes-agent.nousresearch.com/docs/user-guide/profiles/, official docs, included here because community guides treat it as the load-bearing mechanism for their own fleet patterns)
- **Scaling framework** ("The 4 Levels of Hermes Agent Scaling," DEV Community, Shilpa Mitra) — see §5 for full breakdown; central warning: "every level multiplies whatever quality you've established at the level before it," i.e., scaling a mediocre single-agent workflow into a multi-agent automated team amplifies its flaws, not just its throughput.
- **"Sensei loop" / champion-challenger prompt evaluation** (0xJeff, Substack): power users borrow an ML-eval pattern — maintain a "champion" prompt/skill, hold out ~6 untouched validation examples, only promote a challenger skill if it beats the champion on the *holdout* set (not the working set) by a defined margin. Explicit principle: "never promote on the working set... holdout promotion is the immune system," to stop the agent's self-improvement loop from overfitting to recent examples. Applied to daily equity reports, headline synthesis, and portfolio triage workflows. Source: https://defi0xjeff.substack.com/p/the-hermes-sensei-loop

---

## 4. YouTube: Most Substantial Videos / Courses

Descriptions only, not transcribed. Ranked by apparent depth/structure rather than view count (which could not be verified).

1. **"Hermes Agent Masterclass" — 10-part course by Tonbi (Tonbi's AI Garage)**, referenced via https://hermesatlas.com/masterclass/. The single most structured resource found: 10 modules, 5h14m total (Setup 28:31, Deployment 30:50, Memory 34:20, Skills 41:19, Models 25:20, Tools & MCP 26:16, Automation 35:55, Subagents 33:27, Profiles & Kanban 31:05, Security 27:38), each with timestamped field notes. Covers the full stack from install through multi-agent orchestration and defense layers (approvals, containment, secret filtering).
2. **"Hermes AI Agent: Build & Automate ANYTHING!" — Julian Goldie SEO**, https://www.youtube.com/watch?v=fuNDHJ6GW8Y. Positioned for marketers/operators rather than developers; covers free local-model usage via Nous's model portal (cites DeepSeek V4 Flash), memory, a "Paperclip Teams" feature, and scheduled tasks; explicitly framed as usable by non-coders.
3. **Alex Finn's Hermes vs. OpenClaw video** (https://x.com/AlexFinn/status/2039364255699599867, cross-posted to YouTube per his account). Comparative review covering what Hermes is, setup, "workflows that will explode your productivity," and an explicit verdict on whether it replaces OpenClaw (concluded: better in some key ways, not a full replacement).
4. **"Full Hermes Agent Tutorial (Desktop) — A Useful Agentic AI Workflow"**, https://www.youtube.com/watch?v=GL67DEf2nyI. Focused specifically on the Hermes Desktop GUI app (released as public preview June 2, 2026) rather than CLI-only workflows.
5. **"Hermes Agent - Full Course & Setup Guide - For COMPLETE Beginners"** (attributed in one secondary source to creator Samin Yasar, unverified independently — see uncertainty list), https://www.youtube.com/watch?v=mTYxpIRK7xA. Billed as the most comprehensive free beginner course on the platform; covers install through first working gateway bot.

**Notable ecosystem pattern**: search turned up a large number of near-duplicate, templated video titles ("100 hours of Hermes Agent lessons in 19/21/23/46 minutes," "FULL Hermes Agent Tutorial For Beginners in 2026! (Become a PRO)," multiple "Beginner to Pro in N Minutes" videos, several sharing the same Hostinger affiliate-discount-code pattern). This suggests a wave of SEO/affiliate-driven, possibly AI-assisted or templated content mills around Hermes, distinct from the more clearly authored deep-dives (Tonbi, Julian Goldie, Alex Finn). Treat single-video claims from the templated cluster with lower confidence — could not independently verify channel identity or content depth for most of them.

Recommended channels per one aggregator (https://hermes-agent.ai/blog/best-youtube-channels-for-hermes-agent, itself unverified as neutral vs. promotional): The Next New Thing AI (business/founder use cases), Matthew Berman (agent ecosystem/open-source model comparisons — could not confirm a dedicated Hermes review from his channel specifically, see uncertainty list), All About AI (automation/coding workflows), Julian Goldie SEO (growth/content ops), Antoine Rousseaux (SaaS/founder context).

---

## 5. Day-in-the-Life / First-Week Progression

### 5.1 "I Let Hermes Agent Run My Workflow for a Week" (DEV Community, prshant01)
Source: https://dev.to/prshant01/i-let-hermes-agent-run-my-workflow-for-a-week-heres-what-actually-happened-3hk5

- **Day 0 (setup)**: install in 4 minutes via one bash command with a `--portal` flag bundling tools without separate API-key hunting. Quote: "No Docker config, no Python environment juggling, no API key hunting."
- **Day 1 (research task)**: a literature review that normally took 45 minutes was done in 6. Hermes auto-created a reusable skill afterward because the task involved "7+ tool calls and a non-trivial workflow" — no explicit "remember this" instruction needed in this case (contrast with Kelvin Kwong's pitfall #4 above, where auto-skill-creation was described as too vague without explicit prompting — the two accounts disagree on how reliably this triggers).
- **Day 2 (mobile)**: Telegram gateway set up in 5 minutes, enabling remote task kickoff and async job completion.
- **Day 3 (parallelism)**: three concurrent tasks via `/delegate`, compressing sequential work into parallel execution.
- **Day 4 (self-maintenance)**: the autonomous Curator ran overnight and consolidated "3 skills into 1."
- **Day 5 (scheduling)**: natural-language cron syntax set up a weekly automated paper-summary delivered via Telegram, unattended.
- **Day 6 (IDE integration)**: exposed an OpenAI-compatible API endpoint at `localhost:8080`, plugged into VS Code Continue with persistent project memory carried over.
- **Day 7 (verdict)**: strengths = smooth setup, portability, skill auto-generation, API-proxy integration, parallelism. Limitations = "cold starts with many skills loaded can feel slow," skill-creation can be over-aggressive and need curation, occasional browser-automation retries needed. Overall conclusion: the week-over-week "compounding effect... exceeded initial expectations."

### 5.2 "I Set Up Hermes Agent in 7 Levels" (Medium, Ethan Cooper)
Source: https://medium.com/@EthanCooperwrtier/i-set-up-hermes-agent-in-7-levels-it-became-more-than-an-ai-chatbot-5d37e4a07f0b

- Only Level 1 fully recoverable from this fetch: VPS install chosen over local specifically for always-on independence from the author's laptop. Quote: "the agent gets its own dedicated environment. It does not depend on my laptop being open, and it can run continuously in the background." Headline promises levels 2–7 progress through Discord integration, scheduled jobs, long-term memory, Kanban coordination, and exposing Hermes as an MCP server for other agents to call — consistent with the general community progression pattern seen elsewhere (see §5.4) but **not independently confirmed level-by-level** for this specific piece; flagged as a gap.

### 5.3 "Journey with Hermes: Day 2" (Medium, Allard Quek)
Source: https://allardqjy.medium.com/journey-with-hermes-day-2-b42b437c9bc4

- Day 2 usage tripled Day 1: 37M input tokens, 120K output tokens, 600 requests in a single day — a concrete illustration of how fast token usage can scale once someone starts actually using Hermes for real tasks (contextualizes the "token costs will surprise you" pitfall from §1.4).
- Built a working `/form-filler` skill for event sign-ups after several refinement iterations.
- Real use: contextual recommendations while exploring a neighborhood ("New Bahru"), valued specifically for being inside Telegram rather than requiring app-switching. Quote: "I see great potential with having an AI assistant natively within your messaging app."
- What broke: Honcho memory integration added noticeable latency (10s registration delay, 12s session-retrieval delay) with limited perceived benefit; local Gemma model responses took ~20 seconds for a simple greeting and couldn't access tools/web search via Telegram's `/model` command; Honcho stayed active in logs even after attempts to disable it via CLI; the default `/findmy` skill required sending screenshots externally (privacy concern flagged by the author); bot protections (Cloudflare Turnstile, Fingerprint, Google) complicated building custom skills that touch the open web; Hermes at one point **hallucinated having completed a task** (claimed to have searched for a newly created skill when it hadn't).

### 5.4 "The 4 Levels of Hermes Agent Scaling Framework" (DEV Community, Shilpa Mitra)
Source: https://dev.to/shilpamitra/the-4-levels-of-hermes-agent-scaling-framework-from-one-hermes-agent-to-a-fully-automated-team-2gdp

This is the clearest cross-source articulation of a "week 1 → month N" progression pattern:
- **Level 1 — The Main Agent** (you ↔ single instance): run real production work daily, actively manage episodic memory, build/install skills, connect one messaging platform. Explicit quality gate: "you do NOT want to automate slop" — errors compound through every later level. Move on only once 2–3 workflows consistently need minimal editing.
- **Level 2 — Specialized Agents**: split into domain-specific instances (keep to 2–3 to avoid routing overhead); separate config profiles, isolated SQLite databases and skill libraries per agent; you still manually route tasks. Move on when routing takes longer than reviewing output.
- **Level 3 — Orchestrated Team**: a dedicated orchestrator agent breaks down complex requests and spawns specialist workers with tailored context (native multi-agent orchestration shipped in v0.6.0). Example: a "competitive research + blog draft" request routes through a Research Agent then a Content Agent, synthesized by the orchestrator. Requires Kanban-style task tracking and explicit handoff protocols; still needs regular human review for quality drift.
- **Level 4 — Automated Team**: cron/event triggers replace human kickoff entirely; the orchestrator and full team run asynchronously. Real examples cited: Monday-morning keyword-ranking pulls + newsletter outlines + metrics reports; competitor-content-analysis triggering an automatic response-piece draft; support-ticket tagging routing straight into an agent response queue. Best practice: launch one automated workflow at a time, add confidence-threshold gates for human review, and monitor closely for the first two weeks.
- Core warning repeated verbatim across the piece: "every level multiplies whatever quality you've established at the level before it."

### 5.5 Synthesized "typical first week" (cross-source pattern, not any single source)
Days 1–2: install (5 min via installer script), pick a real (adequate-context) model, run CLI-only read-only tasks, connect one messaging gateway with a locked-down allowlist. Days 3–5: start explicitly asking Hermes to remember/save successful approaches as skills, set up the first cron job for a low-stakes recurring task (briefing, backup, monitoring), watch token usage carefully. Days 6–7 and beyond: consider a second profile if mixing contexts becomes a problem, evaluate whether an external memory provider is worth the latency cost, review the Curator's automatic skill consolidation, and — per multiple independent guides — look at agent output daily for roughly the first two weeks before tapering to spot checks.

---

## 5.5 Five Most Compelling Real-World Use Cases (curator's picks, for final reply)

1. VPS-hosted, Telegram-native personal assistant with nightly GitHub backup cron, set up end-to-end from a shared-hosting control panel in under an hour with no prior Docker knowledge (§1.10).
2. Home Assistant bridge turning smart-home state changes into agent-triggered actions, with domain-level guardrails blocking arbitrary shell execution through the integration (§1.9).
3. The 4-level solo-to-automated-team scaling path — one person's single CLI agent growing into an orchestrator managing specialist sub-agents on cron triggers for real marketing/ops workflows (§5.4).
4. Research pipeline: scheduled arXiv pull → methodology extraction → cross-paper synthesis → morning brief, entirely inside one agent without a separate orchestration framework (§1.12).
5. The "champion/challenger with holdout" self-improvement discipline power users layer on top of Hermes's own skill-writing loop to stop it from overfitting to recent examples in daily financial-reporting workflows (§3.4).

(Also strongly considered, but security- rather than productivity-flavored: the Thai Finance Ministry post-exploitation abuse via YOLO mode, §3.3 — genuinely the most concrete "in the wild" story found, but it's a misuse case, not a use case.)

---

## Facts Uncertain / Needs Verification

- **No Reddit thread content was directly retrieved.** All r/LocalLLaMA-related claims in this document are inferred from secondary guide-sites, not sourced from actual Reddit posts/comments. Treat "Reddit reaction" as an unverified gap, not a documented finding.
- **CVE/security claim conflict**: innFactory's comparison piece claims "no publicly documented CVEs [for Hermes] through May 2026," while the Cloud Security Alliance research note (dated the same month) documents three real CVEs plus a separate critical-severity independent audit. The marketing-style comparison sites appear to repeat vendor claims without checking primary security sources — flagged as a real discrepancy, not resolved here.
- **ClawHavoc numbers are internally inconsistent** even within a single source (innFactory): "15,000–25,000 installations" affected in one place, "1,184 malicious packages; 23 compromised accounts" in another, without reconciling the two. Numbers should be treated as unverified until checked against a primary OpenClaw security disclosure.
- **GitHub star counts vary significantly by source and date** (22,000 "within weeks" of Feb 2026 launch per one source; 110,000 "in ten weeks" per another; 140,000 "in under three months" per a third). Likely all roughly accurate for their respective snapshot dates given explosive early growth, but no single authoritative timeline was confirmed.
- **Exact messaging-platform count for Hermes varies (7 as of v0.6.0, 20+, 27+)** depending on source and date — the number grew over 2026 and different articles capture different snapshots; not a contradiction so much as a moving target that individual sources didn't date clearly.
- **YouTube channel attribution is weak for several videos** in §4: could not independently confirm the channel/creator behind "Hermes Agent - Full Course & Setup Guide - For COMPLETE Beginners" (attributed to "Samin Yasar" by one secondary source only), or confirm that Matthew Berman's channel has a video specifically reviewing Hermes Agent (search only confirmed his channel is topically relevant, not a specific video title/content breakdown). The "hermes-agent.ai/blog/best-youtube-channels" aggregator page itself reads as promotional and its channel recommendations are not independently corroborated.
- **The "10 Hermes Agent Hacks That Turned My Chat Agent Into a 24/7 System" article returned HTTP 410 Gone** — title only, content unverified.
- **Petronella's architecture guide and OpenClaw-comparison pages both returned HTTP 403 on direct fetch**; content summarized above for the architecture page came only from WebSearch snippets (lower confidence than a full-page fetch), and the OpenClaw-comparison page from Petronella could not be summarized at all beyond its title.
- **Day-7 skill-auto-creation behavior is contradictory across sources**: the DEV Community week-long test (§5.1) reports Hermes auto-creating a useful skill without being asked, while Kelvin Kwong's pitfalls piece (§1.4, pitfall 4) reports the opposite — that skills stay "vague and generic" unless explicitly requested. Both are single first-person accounts; the discrepancy may reflect model choice, task complexity, or version differences (not identified precisely in either source) rather than one account being wrong.
- **"7 Levels" Medium article (§5.2)** — only Level 1 of the promised 7 was recoverable from the fetch; levels 2–7 content is inferred only from the article's own headline/teaser language, not confirmed body text.
- **Research-pipeline "40% time reduction from self-created skills" claim (§1.12)** comes from a single unnamed "community benchmark" reference inside a synthesized search-result summary — no primary source, methodology, or author could be identified. Treat as anecdotal at best.
- **General caveat on this whole corpus**: this is a fast-moving, SEO-saturated content ecosystem (multiple sources explicitly warn that competing tutorials go stale within weeks as Hermes ships new releases). Version numbers, feature availability, and even security posture claims should be treated as time-stamped snapshots (most from Q2–Q3 2026), not durable facts.
