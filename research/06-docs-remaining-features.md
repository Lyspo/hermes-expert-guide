# Hermes Agent — Remaining Features Documentation Corpus

Compiled July 2026 from https://hermes-agent.nousresearch.com/docs/. Covers pages missed by the prior research pass (memory, skills, MCP, voice, personality/SOUL.md, context files, security, messaging index, Nous Portal, providers, cron, delegation, architecture, CLI reference, FAQ were already covered — not repeated here). All content below was fetched live from the cited URLs; nothing is inferred beyond what each page states. Verbatim quotes are marked with quotation marks and kept under 15 words.

Current version referenced throughout: v0.19.0 "The Quicksilver Release" (2026-07-20).

---

## 1. User Stories & Use Cases

Source: https://hermes-agent.nousresearch.com/docs/user-stories

Page statistics (as stated on page): **262 total stories**, **15 categories**, **11 sources** (X/Twitter, Hacker News, Reddit, GitHub, YouTube, Blog, Podcast, LinkedIn, GitHub Gist, Product Hunt, Discord). This is the single highest-density page in the corpus — a curated wall of real (attributed) community use cases. Full category breakdown and representative stories below; counts are as labeled on the page.

### PERSONAL ASSISTANT (44 stories)
Representative stories (selected for coverage breadth — see notes for full list of themes):
- **"Every weekday at 9am, summarize my inbox and post to Slack"** (Blog, Anthony Maio/Substack) — natural-language cron + markdown skill generation. Quote: "An agent that grows with you — not marketing fluff; it literally writes markdown skill files when it solves hard problems."
- Self-hosted Google Drive replacement with Nextcloud + LibreOffice Writer (Discord); LibreOffice Calc had issues.
- "Told it to Google me and ship a landing page to my VPS" (X, @emmagine79) — search → create → SSH → upload → SMS notify.
- Google Tasks integration for personal productivity (GitHub).
- Bedtime stories for daughter, autonomous generation with memory of prior narratives (GitHub).
- Daily journaling into Obsidian, end-of-day logging (Discord).
- Tasks managed across Obsidian + Apple Calendar + Signal, with Turkish voice support (GitHub).
- "Claude for chat, Hermes 24/7 on a mini PC for real-world stuff" — Claude handles intellectual tasks, Hermes handles automation (Discord).
- Raspberry Pi 5 running Hermes 24/7 with multi-device memory sync Pi↔Mac Studio (GitHub).
- Hermes + Discord with GPT-5.5/DeepSeek v4, weekly recurring tasks (X, @emmagine79).
- Two-tier email pipeline: dumb Python-script tier + smart LLM tier via Hermes, zero LLM calls when inbox idle, uses Spacemail IMAP via himalaya (Discord).
- "Hermes designed an X-to-NotebookLM podcast workflow for me" — Quote: "It's started autonomously suggesting entire workflows I never would have designed" (X, @HeyYanvi).
- Hermes + Qwen3.5:4B on RTX 5060 Ti (16GB VRAM, 64GB DDR5 RAM) via Telegram — "snappy, responsive, alive and chatty" (Reddit, u/Birdinhandandbush).
- "Meal Manager" plugin: weighted scoring 60% availability/40% recency, natural-language inventory (Discord).
- Voice-first fitness coach tracking Training→Nutrition→Recovery→Performance via Telegram (Discord).
- Cron nudges on Discord/Signal for ADHD executive function; 14k tokens per Google Tasks check (Discord).
- "How I use Hermes memory: durable facts, session search, skills" — recommends keeping memory compact/fact-focused (Discord, @tonywhelan).
- Apple Health + Threads analytics + Gmail + Calendar in one CLI. Quote: "Hermes is dramatically better than OpenClaw at browser automation." Comparison: Hermes as CEO, OpenClaw as Senior Engineer (Blog, Keith Rumjahn/Substack).
- Horse-racing Telegram community bot with per-group personalities (GitHub).
- Hermes over iMessage on an always-on Mac Studio, reachable from iPhone/iPad/Mac/Watch (GitHub).
- "One Hermes for the whole family on WhatsApp" — 3 users, $200 one-time vs $200/mo ChatGPT (X, @EXM7777).
- "A semantic knowledge substrate I made for my brain" — Obsidian + vimwiki + Hermes sessions + Cartographer + mapsOS (Discord, @modest.maoist).
- "Monica that writes in my voice" — reads published articles, drafts in author's voice (X, @Saboo_Shubham_).
- Cross-platform memory (MEMORY.md + USER.md), SQLite FTS archive; delivery across Telegram/Discord/Slack/WhatsApp/Signal/terminal (Blog, arshtechpro/dev.to).
- "5 things Hermes does that ChatGPT will never do." Quote: "ChatGPT is a browser tab. Hermes is a server process that's running right now" (Reddit, u/ninjapapi).
- iOS sensor pipeline: health, location, step counting, voice (Discord).
- Autoresearch + LLM-wiki second brain + skill creation + scheduled jobs via Telegram/Discord/CLI (X, @NickSpisak_).
- Qwen3.5 27B rated "VERY good" as personal agent vs 4B "good" / 9B "very decent" (Reddit, u/Suitable_Currency440).
- PM agent running morning + evening standups for ADHD (X, @emmagine79).
- Hermes on VPS talking home over Tailscale with scoped tags (Discord, @sammcf).
- Memory lets user "jump between projects" with week-long context vs OpenClaw (Reddit, u/patbhakta).
- Local Whoop data file exposure via custom tool suite (Discord).
- "I can't type well — voice from the terminal is huge for me" — accessibility (Discord, @timmmie).
- Daily research brief across Discord/Slack/Notion/Obsidian, tracks ignored suggestions, self-improves, suggests content angles (X, @gkisokay).
- Obsidian as long-term memory backbone, structured markdown notes, "durable memory surviving context resets" (Reddit, u/Jonathan_Rivera, 794 upvotes).

### DEV WORKFLOW (65 stories — largest category)
Highlights:
- "Built converse mode so my agent thinks before it acts" — plugin blocking tool execution until chat approval (Discord, @ibrandis).
- "73% of every API call is fixed overhead (I measured it)" — v0.6.0 deployment, Telegram+WhatsApp+Cron gateways, 6 request dumps analyzed (GitHub, @Bichev).
- "Built hermes mcp-server so Claude Desktop can use Hermes tools" — full MCP server exposing 9 Hermes tools (terminal, file read/write, web search, memory, skills, run_agent); clients: Claude Desktop, Cursor, any MCP client (Discord, @buray, Feb 26 2026).
- "12 Hermes instances every day, in parallel" — backend monitoring + post-training RL environments, Top-100 GitHub repos of all time (X, @Teknium, April 25 2026).
- "Spent 200–400 hours writing a memory kernel for Hermes" — 3 failed attempts (149 hrs combined), 3-layer architecture (Hindsight, Graphiti, MemPalace) codenamed "BRAINSTACK" (Discord, @lauratom).
- "Hooks that swap in better tools every time the agent runs" — replace built-in code editor via hooks (Discord, @stefan171).
- "Audited 129 of my own sessions across 23 days" — external RCA script, 112/129 sessions contain approval-gate violations (GitHub, @tcollins024).
- "CCD multi-agent pod on an M2 Ultra with Mem0 + Qdrant" — v1.0.0-alpha "Nanto pod", profiles raoh/juza/rei/ken, requests native MCP integration (GitHub, @autholykos).
- "I built a custom kernel — the LLM never touches the disk" — Python backend → SQLite FTS5 graph DB, structured semantic signals only (Discord, @lauratom, April 4 2026).
- "Built a vectorless RAG workflow with PageIndex and Hermes" — hierarchical document structure + tool reasoning (Discord, @lemoussel).
- "Built my own stack, then converged on Hermes" — background self-improvement, persistent memory, CLAUDE.md, 300 PRs in a week (X, @danfiru, March 24 2026).
- Multi-agent auto-build workflow: Main (GPT-5.4) → Coder (MiniMax M2.7) → QA (Qwen 35B); Plan→Implement→Test→Fail→Repair→Ship (X, @gkisokay, "Day 8 of Building AGI", April 15 2026).
- "Built local kanban so my agents see what's going on" — network-based, minimized token use, web UI for human visibility (Discord, @purkkaviritys) — predates official Kanban feature.
- "Hermes orchestrates Claude Code over SSH to my Mac" — Hermes writes prompts → Claude Code executes → Hermes reviews (Discord, @luminousix, March 30 2026).
- "Built a local Gitea fork + watchtower auto-restarts my Hermes" within 10 minutes (Discord, @malaiwah, April 10 2026).
- "Dogfooding a memory layer that isn't a black box" — "Recall" memory provider prototype for inspectability (Discord, @nour_h).
- "Built a skill-audit skill that improves itself on a cron job" — recursive self-improvement, sandboxed testing (Discord, @.salt555, April 23 2026).
- "Built a Hermes Desktop app that sits next to my terminal" — native SwiftUI (not browser wrapper), SSH to host/files; rationale: "gateway model works for Telegram/Discord, not native apps" (Discord, @itsdodo21) — predates official Electron desktop app.
- "Built a TUI so Hermes feels like OpenCode" — tool "Herm", same TUI framework as OpenCode (Discord, @liftaris).
- "Hermes is OpenClaw with a week of debug + RAG + memory." Quote: "Its like an OC with 1 week of debugging + rag + memory persistence" — Qwen3.5-9B, 16GB VRAM, rated 10/10 (Reddit, u/Suitable_Currency440).
- "I don't know how to write code — Codex built me a VPN service" — Xray/Wireguard config, user mgmt, speed/data limits (Discord, @_atomlib_, May 6 2026).
- "I ported the whole Python weather stack to Rust for my Hermes plugins" — MetPy/Herbie/cfgrib/WRF-Python → 2 high-perf plugins (Discord, @drewsni).
- "Using SKILL.md as my Notion/Outlook/SharePoint tool router" — category-based tool routing pattern, considered MCP centralization as alternative (Discord, @l_acie, April 3 2026).
- "Running Hermes in a NixOS + container setup" — automatic package installation via setup phase (Discord, @glitchglitchglitch, April 18 2026).
- "A compression plugin for sessions that go on forever" — "Hermes Operational Checkpoint Plugin", preserves work thread despite compression softening continuity (Discord, @reyartage) — predates official checkpoints feature.
- "Built Rookery because I was tired of killing llama-server processes" — process management/config simplification (Discord, @lance960).

### BUSINESS OPS (16 stories)
- "24/7 assistant with a Supabase CRM, built in a demo" — cost less than ChatGPT Plus, autonomous skill proposal of Supabase MCP scripts (YouTube, Derek Cheung).
- "Hermes triages and works tickets in my PM software" — Plane.so integration, Triage→Assign→Execute→Document, paired with Claude Code for MS Teams tickets (Discord, @dalekc72).
- "Hermes as my Chief of Staff with sub-agents per project" — cross-project memory, backup routing, nightly GitHub backups, daily WhatsApp updates (Discord, @ogiberstein).
- "Task-centric memory for a printing factory" — domain auto-categorization, completed-task compression into summary cards, solved long-conversation slowness (GitHub, @Xwm1234).
- "Day 297 of my streak: $100K of client work automated" — 900,000+ seconds compute, 5B+ tokens (X, @NathanWilbanks_, April 25 2026).
- "UGC ad studio on Hermes (4 minutes, zero prompt engineering)" — Higgsfield Marketing Studio powered by Hermes; URL→scrape landing page→pull ad hooks from Meta/TikTok→write brief (X, @codewithimanshu, April 24 2026).
- "Auto-transcribe Meet calls, control from Teams, local models" — sensitive data stays local (Blog, Julian Goldie/Substack, April 30 2026).

### INTEGRATIONS (26 stories)
- "jMunch MCP: 52 tools via tree-sitter for code intelligence" (GitHub, @jgravelle).
- "Give Hermes hands inside Feishu (Lark)" — Documents, Sheets, Bitable, Calendar, Tasks, Wiki, Contacts, Drive, Email (GitHub, @haoqimeng1992).
- "Onchain identity and proof-of-work for Hermes agents" — Ethereum Attestation Service on Base mainnet (Discord, @.zmaxx).
- "Fat agent → thin tool provider via hermes mcp serve" — monolithic agent converted to composable capability layer; 15+ messaging platforms, SQLite persistence, 73-skill surface exposed to any MCP client (GitHub Gist, nazt).
- "Run Hermes Agent right inside Home Assistant" — add-on, functional in under 5 minutes (Discord, @wolframravenwolf).
- "Built agentbox.id because no mail service felt right for agents" — inspired by Hermes' email gateway approach (Discord, @phillipd.eth).
- "Desktop computer-use module: noVNC, screenshots, mouse/keyboard" — `computer_use_tool.py`, persistent Chromium (GitHub, @0xMrBlueOps).
- "Connected my M5 Cardputer to Hermes via the API" — OTA firmware, text-to-Hermes, TTS/STT WIP (Discord, @jesus359_).
- "Hermes watches my homelab validators and pings Telegram" — 0G + FortyTwo relay, state-change-only alerts, no spam (Discord, @0xajpanda, March 24 2026).

### CREATIVE (19 stories)
- "Hermes designed an X-to-NotebookLM podcast workflow for me" — X→extract from lists/bookmarks→structure into article→NotebookLM podcast (X, @HeyYanvi, April 19 2026).
- "My agent dreams at night for $0.014" — autonomous dream cycles 23:00–06:00, 9 dream thoughts + recall queries, ~$0.014/night on Haiku (free on local) (Discord, @ajaylakhani).
- "Hermes Inc.: Telegram-native startup sim built at Hermes hackathon" — agent teammates with memory, evolution, weekly decisions (X, @brucexu_eth, April 27 2026).
- "Spare-laptop Hermes 'Iris' builds a RenPy visual novel autonomously" — ComfyUI + LM Studio (local) + RenPy, complete novel w/ 10 images in ~10 minutes (X, @ExileAI_0, April 20 2026).
- "Cron jobs that triage tech news into Discord channels by urgency" — 3x daily, learns from past work/video projects (X, @emmagine79, May 10 2026).
- "Built a browser extension for translation and summarization" — HermesAI Translator (open-source), model Hermes-4-70B (Discord, @misswuhanliang).

### CONTENT CREATION (11 stories)
- "shadcn finance dashboard + Manim explainer videos" using `/browse` (Obsidian skill) + Manim skill (YouTube, WorldofAI, April 7 2026).
- "LinkedIn posts that remember my style" (YouTube, Yashica Jain).
- "Tweets in my voice, pulled from past video scripts" — style extraction, retains emoji/tone preferences (YouTube, Better Stack).

### RESEARCH (9 stories)
- "Got tired of paying Perplexity, built my own research stack" — 7 MCPs + SearXNG custom YAML config, replaced $10/research calls (Discord, @dre108).
- "Hermes-lab is the bookkeeper for running experiments autonomously" — inspired by Karpathy's autoresearch, Sakana AI Scientist, AIDE (Discord, @ereid7).
- "Bringing AI-assisted drug discovery to Africa as a pharmacy undergrad" — ChEMBL, AlphaFold, OpenFDA, QSAR workflows (Discord, @bennytimz, Nigerian pharmacy student).
- "A self-improving LLM Wiki second brain" — Hetzner VPS + Hermes + Telegram bot + Karpathy's LLM Wiki pattern; public at wiki.ai-biz.app (Blog, Jsong/Medium, April 16 2026).

### TRADING & MARKETS (5 stories)
- "$100 → $216 in 48h with a self-learning weather bot" — scans every 60 min, compares 3 forecast sources, buys undervalued buckets, self-reviews strategies (X, @DeRonin_, April 17 2026).
- "Polymarket trading, 4 layers in parallel" — order book, on-chain addresses, news lag, position changes; Polymarket module + News skill (X, @adiix_official, April 21 2026).

### MARKETING (2 stories)
- Meta CLI-based ad management skill pack (Discord, @masonjames).
- Higgsfield Marketing Studio UGC ad studio, 4-minute URL→brief (X, @codewithimanshu, April 24 2026).

### META & ECOSYSTEM (21 stories)
- "hermes-for-win: one-click Windows installer" with Task Scheduler auto-start (GitHub, @EdwardWason).
- "Built a TUI dashboard that watches my agent think" — "Hermes HUD", shows memory/skills/sessions/corrections/projects/crons (Discord, @synextco).
- "Show HN: an independent install guide" covering macOS/Linux/WSL2/Termux (Hacker News, ethanjamescolez).
- "awesome-hermes-agent: community-curated skills list" — agentskills.io compliant (GitHub, @0xNyk).
- "One month with Hermes: don't build the whole machine on day one" (Reddit, u/itsdodobitch, May 3 2026).
- "Scraped the entire Hermes ecosystem (hermesatlas.com)" — categorized GitHub projects with ratings (X, @KSimback, April 8 2026).
- "Built H-OPS to make multi-agent work observable" — operator dashboard for Kanban (Discord, @roach_jeong).
- "Every tool call into SQLite, with Grafana dashboards" — 5 ready-to-go dashboards, per-profile DB (Discord, @bert_71849).
- "Hermify: managed hosting for Hermes" — API key + Telegram bot setup (Reddit, r/vibecoding).
- "Running 4 Hermes agents 24/7 on a 32GB Ubuntu laptop" — PM (Feishu), Developer (ACP), Ops (ACP), Content (Cron); 5 MCP servers, 34 tools, self-learning ACP with auto-distillation (Discord, @ones_07389).
- "I'm using Hermes — same applies to all agents, sandbox it" (Hacker News, Flere-Imsaho, April 4 2026).
- "Hermes Agent is the best self-improving agent we've used." Quote: "Gets smarter the longer you run it" (Product Hunt, Clawdi team).

### PRIVACY & SELF-HOSTED (8 stories)
- "Sharing a local SearXNG container across my Hermes agents" — pre-DDG integration (Discord, @flensbo, March 22 2026).
- "Legal-domain work on an edge GPU, 4B Gemma, no cloud APIs" — sensitive legal material constraint (GitHub, @arkka).
- "Independent technical security eval: 5 defensive patterns" — OSV malware checking, credential stripping, gateway spanning 8 platforms via single process (GitHub Gist, michaeloboyle).
- "EU AI Act compliance via Ombre" — tamper-proof audit, prompt-injection blocking, memory encryption at rest, compliance exports (GitHub, @pypl0).
- "Tailscale serve for secure remote access, no exposed ports" — zero-config HTTPS tunneling over private mesh (GitHub, @PaulTisl).

### ENTERPRISE (9 stories)
- "Hermes on my k8s cluster for a daily cybersec + AI briefing" — cluster isolation preferred over laptop (Discord, @m05tr0).
- "Hermes as CLI/gateway-first — 13 platforms under one process" (Blog, Ken Huang/Substack, April 27 2026).
- "Kubernetes pod-hop handoff across restarts" — shared PVC handoff solving context loss on pod restart (GitHub, @samdu).
- "Shadow-to-live migration from OpenClaw" — shadow-mode testing before cutover (GitHub, @flyingcloudliu-hub).
- "Why 95% of AI users see no results" — deep dive by Hype VP of AI on agent swarms, experiment loops, compounding (X, @hypepartners, March 16 2026).

### MESSAGING (8 stories)
- "QQ Bot adapter for China" — 822-line adapter, 95M+ China users (GitHub, @2024fatwolf55).
- "DM-based approval gate for kid-facing Discord bots" — compliance solution for public-channel bot replies (GitHub, @iacker).
- "LINE for 95M+ users in Japan" — requested, not yet integrated (GitHub, @yuga-hashimoto).
- "Built a native Android app for Hermes" — streaming chat, session mgmt, slash commands, tools visualization, "direct, no-middleman experience" (Discord, @codename_11).

### GENERAL (6 stories)
- "Blind since birth, I built an NVDA translator addon with Nous" — Insert+Shift+T (selected text) / Insert+Shift+Y (clipboard), translation via Nous/Hermes. Quote: "Thank you for this opportunity" (Discord, @denis_skorpnik).
- "Teaching a Linux user group to build agents with Hermes" — workshop, example: personalized news briefing (Discord, @_name_name_, April 2 2026).
- "Built a Hermes guide in Spanish using Hermes itself" — GitHub Pages distribution (Discord, @anibal3608).

### COST OPTIMIZATION (13 stories)
- "Under $20/mo total — no Mac Mini, no Opus" — OpenClaw ($80–150/mo) vs Hermes ($20/mo), VPS + Minimax M2.7 (Blog, Alex P./Medium, March 30 2026).
- "90% token spend cut. Runs on a cheap Android via Termux" — $130→$10 per 5 days, SMS/sensors/social posting. Quote: "Output is the skill, not customization" (Podcast, Startup Ideas Podcast — Greg Isenberg & Imran Muthuvappa).
- "My Hermes Journey: smart-routing tiers that save 10 hours and $40" — Tier 1 Gemini 3.1 Flash Lite (mechanical), Tier 2 Sonnet (delicate), Tier 3 Minimax (low-overhead); `minimax-cache-optimization` skill (Reddit, u/hackrepair, April 15 2026).
- "Built ZeroID to fix sub-agent scope delegation and context costs" — RFC 8693 token exchange (Discord, @justin_albrethsen).
- "Cut 60–90% of context tokens with an RTK integration" — terminal command rewriting (Discord, @vgallotti).
- "Hetzner VPS at $10/mo, Claude Opus via OpenRouter" — Terminal/Telegram/Discord/Slack/WhatsApp (YouTube, Théo Vigneres, March 2026).

### Cross-cutting features/stats mentioned across stories
- Memory systems referenced: MEMORY.md, USER.md, session search (SQL FTS), custom 3-layer architectures, Obsidian vault integration, Hindsight+Graphiti+MemPalace, Cartographer, mapsOS, "Recall".
- Deployment environments seen: Hetzner/AWS/DigitalOcean/Hostinger VPS, Kubernetes, Docker, Raspberry Pi 4/5, Mac Mini/Studio, Windows (WSL2/native), home servers, Termux/Android/iOS, GCP, local llama.cpp/Ollama.
- Models mentioned: Claude Opus 4.6/4.7, GPT-5.4/5.5/4.1, Qwen 3.5 (4B/9B/27B), MiniMax M2.7, local Gemma 4B, DeepSeek v4, Hermes-4-70B, Nemotron-3-Ultra, Haiku.
- Notable aggregate numbers stated on the page: 5B+ tokens generated across users; $100K+ client work automated (single streak); 900,000+ seconds compute automated; Day 297 longest documented streak; 129 sessions audited across 23 days; 22k lines of custom memory-kernel code; 3,000+ self-improvement logs; up to 52 tools in a single MCP integration; up to 34 tools in multi-agent setups; up to 8 messaging platforms simultaneously; 73-skill surface in one setup.

---

## 2. Tool Gateway

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/tool-gateway

- Paid Nous Portal subscription feature that **routes agent tool calls through Nous infrastructure**, eliminating need for separate Firecrawl/FAL/OpenAI/Browser Use accounts.
- Included categories: web search & extraction (Firecrawl), image generation (9 models), text-to-speech (OpenAI TTS voices via `text_to_speech`), cloud browser automation (headless Chromium via Browser Use: `browser_navigate`, `browser_click`, `browser_type`, `browser_vision`).
- **9 image models** with IDs: `fal-ai/flux-2/klein/9b` (default, FLUX 2 Klein 9B), `fal-ai/flux-2-pro`, `fal-ai/z-image/turbo`, `fal-ai/nano-banana-pro` (Gemini 3 Pro), `fal-ai/gpt-image-1.5`, `fal-ai/gpt-image-2`, `fal-ai/ideogram/v3`, `fal-ai/recraft/v4/pro/text-to-image`, `fal-ai/qwen-image`.
- Setup: `hermes setup --portal` — "Fresh install: Nous OAuth + set Nous as provider + turn on the Tool Gateway in one go."
- Other commands: `hermes model` (switch inference provider), `hermes tools` (configure per-tool), `hermes portal info` (Portal auth + gateway routing summary), `hermes portal tools` (gateway catalog w/ current routing), `hermes status` (full system status incl. Tool Gateway section).
- Config files: `~/.hermes/.env` (overrides), `config.yaml` (main). Per-tool `use_gateway` flag:
```yaml
web:
  backend: firecrawl
  use_gateway: true
image_gen:
  use_gateway: true
tts:
  provider: openai
  use_gateway: true
browser:
  cloud_provider: browser-use
  use_gateway: true
```
- Precedence: `use_gateway: true` routes through Nous ignoring direct keys; `false`/absent uses direct keys if present, else falls back to gateway.
- Self-hosted gateway (enterprise) env overrides: `TOOL_GATEWAY_DOMAIN`, `TOOL_GATEWAY_SCHEME`, `TOOL_GATEWAY_USER_TOKEN`, `FIRECRAWL_GATEWAY_URL`.
- Billing: pay-as-you-use against Nous subscription across all 4 categories; mixing gateway + personal keys per-tool is supported. Free-tier accounts get inference-only Portal access; some accounts get a "free tool pool" small managed-tool allowance without a paid sub.
- Quotes: "No rate limits to worry about — the gateway handles scaling." "Bring your own keys anytime — per-tool, whenever you want to." "The gateway isn't a lock-in, it's a shortcut." "Tool Gateway operates at the tool-execution layer, not the CLI."
- Works transparently across CLI, Telegram, Discord, Slack, IRC, Teams, API server.
- Subscription expiry: "Tools routed through the gateway stop working until you renew or swap in direct API keys via `hermes tools`. Hermes shows a clear error pointing at the portal."
- Optional add-on: Modal (serverless terminal), not in default bundle; configure via `hermes setup terminal` or `config.yaml`.
- Usage/cost breakdown dashboard: https://portal.nousresearch.com (per-tool visibility).

---

## 3. Web Dashboard

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/web-dashboard

- Launch: `hermes dashboard` → local server at `http://127.0.0.1:9119`; "runs entirely on the local machine—no data leaves localhost by default."
- Flags: `--port` (default `9119`), `--host` (default `127.0.0.1`), `--no-open`, `--insecure` (allow non-loopback bind, dangerous), `--isolated` (dedicated per-profile server instead of machine-level), `--skip-build`.
- Prerequisites: `cd ~/.hermes/hermes-agent && uv pip install -e ".[web,pty]"` (`web` = FastAPI/Uvicorn, `pty` = ptyprocess/pywinpty, `[all]` = both). Chat tab additionally needs Node.js (TUI bundle built on first launch) and a POSIX kernel (native Windows Python lacks PTY support).
- **Machine-level, multi-profile**: one server manages all profiles via sidebar switcher; selection persists as `?profile=<name>` in URL. Config/API Keys/Skills/MCP/Models/Chat follow the switcher; Gateway processes/session DB/cron schedulers stay per-profile.
- Pages: **Status** (version, gateway state, active sessions, 20 recent, auto-refresh 5s), **Chat** (embeds full TUI via WebSocket `/api/pty` spawning `hermes --tui` in a PTY, xterm.js WebGL renderer, SGR 1006 mouse tracking, `@xterm/addon-fit` resize), **Config** (form editor, 150+ fields from `DEFAULT_CONFIG`, Save/Reset/Export/Import JSON), **API Keys** (`.env` management, redacted previews, provider signup links), **Sessions** (FTS5 full-text search, rename/export/delete, "Prune old sessions" button), **Logs** (agent/gateway/errors, level + component filters, 50/100/200/500 lines, 5s auto-refresh polling), **Analytics** (7/30/90-day periods; tokens, cache-hit %, cost, per-model breakdown), **Cron** (create/pause/resume/trigger/delete/edit jobs), **Profiles** (create/manage isolated instances, clone options), **Skills** (browse/toggle/install from hub), **MCP** (add HTTP/SSE or stdio servers, test/enable/remove, Nous-approved catalog), **Webhooks** (create/enable/disable subscriptions, HMAC secret shown once), **Pairing** (approve/revoke messaging users), **Channels** (configure/enable/test messaging platforms — full parity with `hermes setup gateway`), **System** (host stats via psutil, Nous Portal status, skill curator control, gateway start/stop/restart, memory provider selection, credential pool, ops: doctor/security-audit/backup/restore/update/prompt-size/support-dump/config-migrate, checkpoints view/prune, shell hooks list/create/remove).
- `/reload` slash command: re-reads `~/.hermes/.env` into the running CLI process without restart. Example output: `Reloaded .env (3 var(s) updated)`.
- REST API: profile-scoped endpoints accept `?profile=<name>` or JSON body `"profile"`. Core endpoints span `/api/status`, `/api/sessions*`, `/api/config*`, `/api/env`, `/api/logs`, `/api/analytics/usage`, `/api/cron/jobs*`, `/api/skills*`, `/api/tools/toolsets`; admin endpoints span `/api/mcp/*`, `/api/messaging/platforms*`, `/api/pairing*`, `/api/webhooks*`, `/api/credentials/pool*`, `/api/memory*`, `/api/gateway/{start,stop,restart}`, `/api/ops/*`, `/api/system/stats`, `/api/hermes/update/check`, `/api/curator*`, `/api/portal`.
- **Auth gate**: engages when binding to a non-loopback address AND `--insecure` is not set. Fail-closed: if no `DashboardAuthProvider` is registered, `hermes dashboard` refuses to bind with an explicit error (interactive terminals get a setup prompt; non-interactive/CI hit the error).
  - **Nous OAuth** (default): `hermes dashboard register` (writes `HERMES_DASHBOARD_OAUTH_CLIENT_ID`) or via https://portal.nousresearch.com/local-dashboards. Config: `dashboard.oauth.client_id`. PKCE (S256) authorization-code flow; access token TTL **15 minutes**, no refresh token in v1 (SPA full-page-navigates to `/login` on 401).
  - **Username/password** ("trusted networks only—not public internet"): set `HERMES_DASHBOARD_BASIC_AUTH_USERNAME`, `_PASSWORD_HASH` (scrypt, preferred) or `_PASSWORD` (plaintext, less safe), `_SECRET` (token-signing key, must stay stable across restarts), optional `_TTL_SECONDS` (default 12h = 43200). Rate limit: 10 attempts/min/IP → HTTP 429; generic "401 Invalid credentials" (no username enumeration).
  - **Self-hosted OIDC**: Keycloak/Zitadel/Authelia/Auth0/Okta/Google/GitHub. Config `dashboard.oauth.self_hosted.{issuer,client_id,scopes}` (default scopes `"openid profile email"`). ID token verified against `jwks_uri` (RS256/ES256); `iss`/`aud` pinned; claim map `sub→user_id`, `email→email`, etc.
  - **Public URL override** for reverse proxies: `dashboard.public_url` / `HERMES_DASHBOARD_PUBLIC_URL`; validation rejects malformed/unsafe values.
  - Cookies: `hermes_session_at` (15 min, HttpOnly, SameSite=Lax, Secure-when-HTTPS), `hermes_session_pkce` (10 min, HttpOnly), `hermes_session_rt` (reserved, unused v1).
  - Audit log: `$HERMES_HOME/logs/dashboard-auth.log` (JSON lines; sensitive fields redacted).
  - Custom auth providers: plugin at `~/.hermes/plugins/dashboard-auth-myidp/__init__.py` subclassing `DashboardAuthProvider`.
  - Non-interactive bearer-token auth: providers with `supports_token = True` accept `Authorization: Bearer <token>`; example `plugins/dashboard_auth/drain` uses `HERMES_DASHBOARD_DRAIN_SECRET` (256+ bits, fails closed if weak) for `/api/gateway/drain`.
  - Verify gate: `curl -s http://127.0.0.1:9119/api/status | jq '.auth_required, .auth_providers'`.
- **CORS**: restricted to localhost origins (`:9119`, `:3000`, `:5173`); custom ports auto-added.
- **Development**: backend `hermes dashboard --no-open`; frontend `cd web && npm install && npm run dev` (Vite at `:5173` proxies `/api` to `:9119`). Stack: React 19, TypeScript, Tailwind CSS v4, shadcn/ui-style components. Prod build output: `hermes_cli/web_dist/`. `hermes update` auto-rebuilds frontend if `npm` present.
- **Themes**: palette icon in header; persists to `config.yaml` → `dashboard.theme`. Built-ins: Hermes Teal (`default`), Hermes Teal Large (`default-large`, 18px), Nous Blue (`nous-blue`), Midnight (`midnight`), Ember (`ember`), Mono (`mono`), Cyberpunk (`cyberpunk`), Rosé (`rose`). Font override persists to `dashboard.font`. Plugins can add custom themes/tabs/shell-slots/REST endpoints (layout variants: `standard`, `cockpit`, `tiled`).
- Security quotes: "reads and writes your `.env` file, which contains API keys and secrets... binds to `127.0.0.1` by default." `--insecure` is a "last-resort escape hatch on a fully trusted, firewalled single-host network."
- Remote connection from Hermes Desktop covered under Desktop app section below (same backend, `Settings → Gateway → Remote gateway`).

---

## 4. Memory Providers

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/memory-providers

Hermes supports **9 external memory-provider plugins** (page lists 8 in the comparison table plus a 9th, "Memori", documented separately at the end) — only one active at a time, running *alongside* (not replacing) built-in `MEMORY.md`/`USER.md`. Quick start: `hermes memory setup` (interactive), `hermes memory status`, `hermes memory off`, or manually in `config.yaml`:
```yaml
memory:
  provider: openviking   # honcho, mem0, hindsight, holographic, retaindb, byterover, supermemory, memori
```

| Provider | Storage | Cost | Tools | Key dependency | Distinguishing feature |
|---|---|---|---|---|---|
| Honcho | Cloud | Paid | 5 | `honcho-ai` pip pkg | Dialectic user modeling + session-scoped context |
| OpenViking | Self-hosted | Free (AGPL-3.0) | 5 | openviking + server | Tiered context loading (L0~100tok→L1~2k→L2 full), `viking://` URIs |
| Mem0 | Cloud/Self-hosted/OSS | Free/Paid | 4 | `mem0ai` | Server-side LLM extraction, OSS modes |
| Hindsight | Cloud/Local | Free/Paid | 3 | `hindsight-client` ≥0.4.22 | Knowledge graph + `hindsight_reflect` cross-memory synthesis |
| Holographic | Local SQLite | Free | 2 (9 actions) | none (NumPy optional) | HRR algebra + trust scoring |
| RetainDB | Cloud | $20/mo | 5 | `requests` | Delta compression |
| ByteRover | Local/Cloud | Free/Paid | 3 | `brv` CLI | Automatic pre-compression extraction (saves insights before context compression discards them) |
| Supermemory | Cloud/Self-hosted | Free/Paid | 4 | `supermemory` | Context fencing + full-session graph ingest |
| Memori | Cloud | Paid | 5 | `hermes-memori` pip pkg | Tool-aware memory + structured recall |

Config specifics per provider:
- **Honcho**: config resolution order `$HERMES_HOME/honcho.json` → `~/.hermes/honcho.json` → `~/.honcho/config.json`. Keys: `apiKey`, `baseUrl`, `peerName`, `aiPeer` (default `"hermes"`), `workspace`, `contextTokens` (null=uncapped), `contextCadence` (default 1), `dialecticCadence` (default 2, range 1–5), `dialecticDepth` (clamped 1–3), `dialecticReasoningLevel` (`low`/`minimal`/`medium`/`high`/`max`), `dialecticDynamic` (true), `dialecticMaxChars` (600), `recallMode` (`hybrid`/`context`/`tools`), `writeFrequency` (`async`/`turn`/`session`/int N), `saveMessages` (true), `observationMode` (`directional` default or `unified`), `messageMaxChars` (25000), `dialecticMaxInputChars` (10000), `sessionStrategy` (`per-directory`/`per-repo`/`per-session`/`global`), `pinUserPeer` (false), `userPeerAliases` ({}), `runtimePeerPrefix` (""). Multi-profile: `hermes profile create coder --clone` then `hermes honcho sync`. Tools: `honcho_profile`, `honcho_search`, `honcho_context`, `honcho_reasoning`, `honcho_conclude`.
- **OpenViking**: env vars `OPENVIKING_ENDPOINT` (default `http://127.0.0.1:1933`), `OPENVIKING_API_KEY`, `OPENVIKING_ACCOUNT`, `OPENVIKING_USER`, `OPENVIKING_AGENT`. Server config `ov.conf`, client `ovcli.conf` under `~/.openviking/`. Tools: `viking_search`, `viking_read` (tiered), `viking_browse`, `viking_remember`, `viking_add_resource`. Auto-extraction into 6 categories.
- **Mem0**: `hermes memory setup mem0 --mode oss --oss-llm openai --oss-llm-key sk-... --oss-vector qdrant` or `--mode selfhosted --host ... --api-key ...`. Config `$HERMES_HOME/mem0.json` (`mode`, `host`, `user_id`, `agent_id`, `rerank`). Env: `MEM0_API_KEY`, `MEM0_HOST`. OSS providers — LLM: openai/ollama; Embedder: openai/ollama; Vector store: qdrant (local/server), pgvector. Tools: `mem0_search` (optional reranking, off by default), `mem0_add`, `mem0_update`, `mem0_delete`.
- **Hindsight**: config `$HERMES_HOME/hindsight/config.json` — `mode` (cloud/local), `bank_id` (default `"hermes"`), `recall_budget` (low/mid/high), `memory_mode` (hybrid/context/tools), `auto_retain`/`auto_recall` (true), `retain_async` (true), `retain_context`, `retain_tags`, `retain_source`, `retain_user_prefix`/`retain_assistant_prefix`. Local UI: `hindsight-embed -p hermes ui start`. Tools: `hindsight_retain`, `hindsight_recall`, `hindsight_reflect`.
- **Holographic**: config under `plugins.hermes-memory-store` in `config.yaml`: `db_path` (default `$HERMES_HOME/memory_store.db`), `auto_extract` (false), `default_trust` (0.5). Tools: `fact_store` (9 actions: add/search/probe/related/reason/contradict/update/remove/list), `fact_feedback`.
- **RetainDB**: env `RETAINDB_API_KEY`. Tools: `retaindb_profile`, `retaindb_search`, `retaindb_context`, `retaindb_remember`, `retaindb_forget`.
- **ByteRover**: install `curl -fsSL https://byterover.dev/install.sh | sh` or `npm install -g byterover-cli`. Data location `$HERMES_HOME/byterover/` (profile-scoped). Tools: `brv_query`, `brv_curate`, `brv_status`.
- **Supermemory**: config `$HERMES_HOME/supermemory.json` — `base_url` (default `https://api.supermemory.ai`), `container_tag` (default `"hermes"`), `auto_recall`/`auto_capture` (true), `max_recall_results` (10), `profile_frequency` (50), `capture_mode` (`all`), `search_mode` (`hybrid`), `api_timeout` (5.0). Env: `SUPERMEMORY_API_KEY`, `SUPERMEMORY_BASE_URL`, `SUPERMEMORY_CONTAINER_TAG`. Self-hosted: `npx supermemory local`. Base URL precedence: `supermemory.json` → env → default. Tools: `supermemory_store`, `supermemory_search`, `supermemory_forget`, `supermemory_profile`.
- **Memori**: `pip install hermes-memori && hermes-memori install`, env `MEMORI_API_KEY`. Tools: `memori_recall`, `memori_recall_summary`, `memori_quota`, `memori_signup`, `memori_feedback`.
- Profile isolation: local-storage providers use per-profile `$HERMES_HOME/` paths; config-file providers store config per profile; RetainDB auto-derives profile-scoped project names; OpenViking uses each profile's `.env`.
- Developer extension pointer: "Developer Guide: Memory Provider Plugins" for building custom providers.

---

## 5. Plugins

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/plugins

- Extensible system distinguishing **general plugins** (tools/hooks/commands, opt-in) from **provider plugins** (memory/context-engine/model-provider, single-select or auto-load).
- Discovery sources (later overrides earlier on name collision): bundled `<repo>/plugins/`, user `~/.hermes/plugins/`, project `.hermes/plugins/` (needs `HERMES_ENABLE_PROJECT_PLUGINS=true`), pip via `hermes_agent.plugins` entry points, NixOS `services.hermes-agent.extraPlugins`.
- Sub-category directories: `plugins/` root (general), `plugins/platforms/<name>/` (gateway channel adapters), `plugins/image_gen/<name>/`, `plugins/memory/<name>/` (single-select), `plugins/context_engine/<name>/` (single-select), `plugins/model-providers/<name>/`.
- Minimal structure:
```
~/.hermes/plugins/my-plugin/
├── plugin.yaml      # manifest
├── __init__.py      # register() function
├── schemas.py       # tool schemas (optional)
└── tools.py         # tool handlers (optional)
```
`plugin.yaml`: `name`, `version`, `description`. `__init__.py` must define `def register(ctx): ...`.
- `PluginContext` (`ctx`) capabilities: `register_tool(name=, toolset=, schema=, handler=)`, `register_hook("post_tool_call", callback)`, `register_command(name, handler, description)` (slash commands), `register_cli_command(name, help, setup_fn, handler_fn)` (`hermes <plugin> <subcommand>`), `inject_message(content, role="user")`, `dispatch_tool(name, args)`, `register_skill(name, path)` (namespaced `plugin:skill`), `register_platform(name, label, adapter_factory, ...)`, `register_image_gen_provider(provider)`, `register_video_gen_provider(provider)`, `register_context_engine(engine)`, `ctx.llm.complete(...)`/`complete_structured(...)`. Memory backends subclass `MemoryProvider`; LLM backends use `register_provider(ProviderProfile(...))`.
- **Opt-in model**: general plugins/user-installed backends are discovered (visible in `hermes plugins`) but code doesn't load until enabled:
```yaml
plugins:
  enabled: [my-tool-plugin, disk-cleanup]
  disabled: [noisy-plugin]
```
- Commands: `hermes plugins` (interactive UI), `list`, `install user/repo` (git clone + prompt), `install user/repo --enable`, `install user/repo --no-enable`, `update my-plugin`, `remove my-plugin`, `enable my-plugin`, `disable my-plugin`.
- Bypasses allow-list (infrastructure-level): bundled platform plugins (`gateway.platforms.<name>.enabled`), bundled backends (`<category>.provider`), memory providers (`memory.provider`), context engines (`context.engine`), bundled model providers (auto-discovered). Pip-installed backend plugins and user-installed platforms still require opt-in.
- States: enabled (loaded next session), disabled (blocked), "not enabled" (discovered, no opt-in yet).
- Hooks available: `pre_tool_call`, `post_tool_call`, `pre_llm_call`, `post_llm_call`, `on_session_start`, `on_session_end`, `on_session_finalize`, `on_session_reset`, `subagent_stop`, `pre_gateway_dispatch`.
- Tool schema/handler contract (Python): schema dict with `name`/`description`/`parameters` (JSON Schema); handler `def handle_tool(params, **kwargs): return json.dumps({...})`.
- Minimal working example given in full (hello-world plugin registering a tool + a `post_tool_call` hook printing `[hello-world] tool called: {tool_name}`).
- Env-var gating: `plugin.yaml` → `requires_env: [API_KEY, SECRET_TOKEN]`; prompted during `hermes plugins install`.
- Pip distribution: `[project.entry-points."hermes_agent.plugins"] my-plugin = "my_plugin:register"`.
- `inject_message(content, role="user") -> bool`: idle agent queues as next input; mid-turn agent gets interrupted like user input; non-"user" roles prefixed `[role]`; **CLI-only** — returns `False` in gateway mode.
- Migration: upgrading to config schema v21+ auto-grandfathers existing `~/.hermes/plugins/` (not already in `plugins.disabled`) into `plugins.enabled`.
- NixOS: `services.hermes-agent.extraPlugins`/`extraPythonPackages`/`settings.plugins.enabled`; declarative plugins symlinked with `nix-managed-` prefix, coexist with manual installs.
- Interactive UI (`hermes plugins`): General Plugins checkboxes (SPACE toggles), Provider Plugins radio pickers (ENTER to drill in), `[bundled]` tags. Saves to `config.yaml` (`memory.provider`, `context.engine`).
- Constraints: project-local plugins disabled by default (`HERMES_ENABLE_PROJECT_PLUGINS=true` to enable); exactly one memory provider and one context engine active at a time; multiple model providers can load, user picks via `--provider`/config; `/plugins` command shows currently loaded plugins in a running session; tool handlers must return JSON-serializable strings.

---

## 6. Browser Automation

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/browser

- Pages represented as **accessibility trees** (text-based snapshots); interactive elements get ref IDs like `@e1`, `@e2`.
- **6 backends**: Browserbase (cloud, anti-bot tooling), Browser Use (cloud, REST API), Firecrawl (cloud, built-in scraping), Camofox (local, self-hosted Node.js server, Firefox fingerprint spoofing), local Chromium via CDP (`/browser connect` attaches to running Chrome/Brave/Chromium/Edge — **CLI-only slash command**, not dispatched through gateways), standalone local Chromium via `agent-browser` CLI.
- Env vars: Browserbase — `BROWSERBASE_API_KEY`, `BROWSERBASE_PROJECT_ID`, `BROWSERBASE_PROXIES` (default true), `BROWSERBASE_ADVANCED_STEALTH` (default false, Scale Plan only), `BROWSERBASE_KEEP_ALIVE` (default true), `BROWSERBASE_SESSION_TIMEOUT` (1800s default, max 21600). Browser Use — `BROWSER_USE_API_KEY`. Firecrawl — `FIRECRAWL_API_KEY`, `FIRECRAWL_API_URL` (default `https://api.firecrawl.dev`), `FIRECRAWL_BROWSER_TTL` (300s default). Camofox — `CAMOFOX_URL` (default `http://localhost:9377`), `CAMOFOX_REWRITE_LOOPBACK_URLS`, `CAMOFOX_LOOPBACK_HOST_ALIAS` (`host.docker.internal`), `CAMOFOX_USER_ID`, `CAMOFOX_SESSION_KEY`, `CAMOFOX_ADOPT_EXISTING_TAB`. General — `BROWSER_INACTIVITY_TIMEOUT` (120s default), `AGENT_BROWSER_HEADED=1`, `AGENT_BROWSER_ARGS`.
- Config YAML (`browser:` block): `cloud_provider`, `auto_local_for_private_urls`, `headed`, `record_sessions`, `inactivity_timeout`, `cdp_url`, `dialog_policy` (`must_respond` default / `auto_dismiss` / `auto_accept`), `dialog_timeout_s` (300), `restrict_evaluate`, nested `camofox: {managed_persistence, rewrite_loopback_urls, loopback_host_alias}`.
- Tools: `browser_navigate(url)`, `browser_snapshot(full=false)`, `browser_click(ref)`, `browser_type(ref, text)`, `browser_scroll(direction)`, `browser_press(key)`, `browser_back()`, `browser_get_images()`, `browser_vision()`, `browser_console(expression=None, clear=False)`, `browser_cdp(method, params, target_id, frame_id)` (raw CDP passthrough), `browser_dialog(action, prompt_text)`.
- **Hybrid routing**: with a cloud provider configured, private/LAN addresses (localhost, 127.0.0.1, 192.168.x.x, 10.x.x.x, 172.16-31.x.x, *.local/.lan/.internal, ::1, 169.254.x.x) auto-spawn a local Chromium sidecar; public URLs use the cloud provider in the same conversation.
- Snapshot size limit: **15,000 characters**; oversized ones are LLM-summarized and cached to `~/.hermes/cache/web/`. `frame_tree` capped at 30 frames, OOPIF depth 2. `pending_dialogs` array shown when JS dialogs block execution.
- Session mgmt: isolated per task; auto-cleanup after inactivity (default 120s), background thread checks every 30s for stale sessions; emergency cleanup on process exit (Browserbase API). Camofox persistent state: `~/.hermes/browser_auth/camofox/`.
- Recording: WebM files to `~/.hermes/browser_recordings/`, auto-cleanup after **72 hours**. Headed mode skips per-turn cleanup to preserve login state. Camofox headed-mode VNC live view: `http://localhost:6080` (noVNC) or native VNC client.
- Stealth/security: random fingerprints, viewport randomization, residential proxy routing (Browserbase), automatic CAPTCHA solving, Advanced Stealth (Browserbase Scale Plan only), SSRF guard blocking private addresses on cloud backends unless `browser.allow_private_urls: true`.
- Camofox managed persistence: sends deterministic profile-scoped `userId`, skips server-side context destruction on cleanup so cookies/logins survive between tasks. Adoption workflow (`adopt_existing_tab: true`): `GET /tabs?userId=<id>` (5s timeout) → adopt matching `listItemId == session_key` → else most recent tab → else create new; adoption only fires until `tab_id` populated.
- Limitations: relies on accessibility tree not pixel coords; >15,000-char snapshots truncated/summarized; cloud session expiry varies by plan; cloud sessions consume provider credits; **no file downloads supported**; `/browser connect` is CLI-only.
- Install: `npm install -g agent-browser`; enable via `toolsets: ["hermes-cli", "browser"]`.
- Nous Portal integration: paid subscribers get browser automation via Tool Gateway with no separate keys — `hermes setup --portal`, or select via `hermes model`/`hermes tools`.

---

## 7. ACP (Agent Client Protocol)

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/acp

- Runs Hermes as a server over stdio talking to ACP-compatible editors; renders chat, tool activity, file diffs, terminal commands, approval prompts, streamed thinking/response chunks. Quote: "ACP is a good fit when you want Hermes to behave like an editor-native coding agent instead of a standalone CLI or messaging bot."
- **`hermes-acp` toolset**: `read_file`, `write_file`, `patch`, `search_files`, `terminal`, `process`, web/browser tools, memory, todo, session search, skills, `execute_code`, `delegate_task`, vision. Intentionally excludes messaging delivery and cronjob management.
- Install: `cd ~/.hermes/hermes-agent && uv pip install -e '.[acp]'` — enables `hermes acp`, `hermes-acp`, and `python -m acp_adapter` (all equivalent). Stderr for logs, stdout reserved for JSON-RPC. Diagnostics: `hermes acp --version`, `hermes acp --check`.
- Browser tools setup: `hermes acp --setup-browser` (interactive) / `--setup-browser --yes` (non-interactive); installs Node.js 22 LTS to `~/.hermes/node/`, global npm packages, Playwright Chromium or detected system Chrome; idempotent.
- Editor configs:
  - **VS Code**: install ACP Client extension, select Hermes Agent, or manual: `{"acp.agents": {"Hermes Agent": {"command": "hermes", "args": ["acp"]}}}`.
  - **Zed**: `{"agent_servers": {"hermes-agent": {"type": "custom", "command": "hermes", "args": ["acp"]}}}`.
  - **JetBrains**: ACP-compatible plugin pointing to `hermes acp`/`hermes-acp`.
- Standard config paths apply: `~/.hermes/.env`, `~/.hermes/config.yaml`, `~/.hermes/skills/`, `~/.hermes/state.db`. Terminal auth flow: `hermes acp --setup`.
- **Host integration variable**: `HERMES_ACP_SKIP_CONFIGURED_MCP=1` skips globally configured MCP servers from `config.yaml` before the ACP JSON-RPC loop starts (any other value = default behavior). Quote: "MCP servers supplied by the ACP session through `session/new` are still registered."
- Session state (in-memory, per adapter): session ID, working directory, selected model, conversation history, cancel event. File/terminal tools execute relative to the editor's workspace, not the server process CWD.
- **Approval tiers** for terminal commands: `allow_once` (single call, not persistent), `allow_session` (matching calls this ACP session, cleared at session end), `allow_always` (all future sessions, written to permanent allowlist), `deny` (single call). Quote on `allow_session`: "the right default for an editor workflow where you trust an agent for the duration of a task but don't want to grant a long-lived allowlist entry."
- Troubleshooting: verify PATH + `.[acp]` extra for missing agents; `hermes acp --version`/`--check`/`hermes doctor`/`hermes status` for startup errors; `hermes model` or `hermes acp --setup` for credential issues.

---

## 8. API Server

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server

- Exposes hermes-agent as "an OpenAI-compatible HTTP endpoint" for Open WebUI, LobeChat, LibreChat, etc.; streaming shows tool progress inline.
- Enable: `~/.hermes/.env` → `API_SERVER_ENABLED=true`, `API_SERVER_KEY=change-me-local-dev`, optional `API_SERVER_CORS_ORIGINS=http://localhost:3000`. Start: `hermes gateway` → listens `http://127.0.0.1:8642`.
- Env vars: `API_SERVER_ENABLED` (default `false`), `API_SERVER_PORT` (default `8642`), `API_SERVER_HOST` (default `127.0.0.1`), `API_SERVER_KEY` (required, no default), `API_SERVER_CORS_ORIGINS` (none by default), `API_SERVER_MODEL_NAME` (default = profile name). YAML equivalent under `gateway.api_server.*`; env vars take precedence.
- **POST /v1/chat/completions**: standard OpenAI format, stateless (full conversation per request). Inline images via `image_url` (HTTP/HTTPS or `data:image/...` base64); uploaded files return `400 unsupported_content_type`. Streaming (`"stream": true`) emits standard `chat.completion.chunk` plus custom `hermes.tool.progress` events.
- **POST /v1/responses**: OpenAI Responses API format, server-side state via `previous_response_id`; also supports named `conversation` parameter instead of tracking IDs. **Storage limit: max 100 stored responses (LRU eviction)**. `GET`/`DELETE /v1/responses/{id}`.
- **GET /v1/models**: advertises profile name or `hermes-agent` default. **GET /api/model/options**: curated provider/model inventory; `?refresh=1` forces full re-probe.
- **GET /v1/capabilities**: machine-readable feature flags (`chat_completions`, `responses_api`, `run_submission`, `run_status`, `run_events_sse`, `run_stop`, bearer auth type).
- **GET /health** / **/v1/health**: `{"status": "ok"}`. **GET /health/detailed**: authenticated readiness check (profile config, DB, model, disk space, gateway state, active runs, pending processes, delegations) — always returns HTTP 200, inspect `status`/`readiness.checks`.
- **Per-request model override**: `model`, `provider`, `model_options` (e.g. `reasoning_effort`, `service_tier`) in the request body. Precedence: session `/model` override → `gateway.platforms.api_server.model_routes` → request `model`/`provider` → global gateway defaults. Bare `model` on chat/responses endpoints requires `gateway.platforms.api_server.direct_model_requests: true`; explicit `provider` always honored.
- **Runs API** (alternative to chat/completions, for progress subscriptions): `POST /v1/runs` (accepts `input`/`session_id`/`instructions`/`conversation_history`/`previous_response_id`), `GET /v1/runs/{id}` (poll state), `GET /v1/runs/{id}/events` (SSE stream; unconsumed buffers expire after **5 minutes**), `POST /v1/runs/{id}/stop` (returns `{"status":"stopping"}` immediately, settles `cancelled`), `POST /v1/runs/{id}/approval` (resolve gated tool call).
- **Jobs API** (bearer-gated background scheduling, mirrors `hermes cron`): `GET/POST /api/jobs`, `GET/PATCH/DELETE /api/jobs/{id}`, `POST /api/jobs/{id}/{pause,resume,run}`.
- **Sessions API**: `GET/POST /api/sessions`, `GET/PATCH/DELETE /api/sessions/{id}`, `GET /api/sessions/{id}/messages`, `POST /api/sessions/{id}/fork`, `POST /api/sessions/{id}/chat` (sync turn), `POST /api/sessions/{id}/chat/stream` (SSE: `assistant.delta`, `tool.started`, `tool.completed`, `run.completed`). Inline images supported on chat endpoints.
- **GET /v1/skills**, **GET /v1/toolsets**: capability discovery (name/description/category; tools list per toolset with `enabled`/`configured` flags).
- **Long-term memory scoping**: `X-Hermes-Session-Key` header (max 256 chars, no control chars) gives a stable per-channel memory identity independent of the transcript-scoped `X-Hermes-Session-Id`; echoed back on responses. Without it, Honcho's `per-session` strategy scopes differently per `session_id`.
- System prompt layering: frontend `system` message (Chat Completions) or `instructions` (Responses API) layers **on top of** the core system prompt — full toolset/memory/skills retained. Quote: "Your agent keeps all its tools, memory, and skills — the frontend's system prompt adds extra instructions."
- Auth: Bearer token via `Authorization` header, required for **all** deployments including loopback. Security headers on all responses: `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`. CORS disabled by default; when enabled, preflight `Access-Control-Max-Age: 600`, SSE responses get CORS headers, `Idempotency-Key` header allowed (cached 5 minutes).
- Compatible frontends table (with approx. star counts as listed): Open WebUI (126k), LobeChat (73k), LibreChat (34k), AnythingLLM (56k), NextChat (87k), ChatBox (39k), Jan (26k), HF Chat-UI (8k), big-AGI (7k), OpenAI Python SDK, curl.
- Multi-user setup: separate profiles each with own `API_SERVER_PORT`/`API_SERVER_KEY` in `~/.hermes/profiles/<name>/.env`, run via `hermes -p alice gateway &` etc.; `/v1/models` on each port reflects that profile's name.
- Limitations: 100 stored responses max (LRU); no file upload (inline images only — `file`/`input_file`/`file_id` unsupported); `/v1/models` advertises a stable alias only.
- **Proxy mode**: API server can be a backend for gateway proxy mode — another Hermes instance with `GATEWAY_PROXY_URL` pointing here forwards messages instead of running its own agent (example: Docker container relaying Matrix E2EE to a host-side agent).

---

## 9. Platform Support

Source: https://hermes-agent.nousresearch.com/docs/getting-started/platform-support

**Tier 1 (priority bug fixes, "never intentionally break")**:
- macOS (Apple Silicon) — Hermes Desktop or `install.sh`
- Windows 10/11 (x86_64, aarch64) — Hermes Desktop or `install.ps1`; "A few features are not available"
- Linux/WSL2 (x86_64, aarch64) — `install.sh`, tested on latest Ubuntu + WSL2; requires glibc, systemd, FHS compliance
- Docker (x86_64, aarch64) — `docker pull`; **"Docker installs do not support `hermes update`"**

**Tier 2 (best effort, "may break between releases")**:
- Android/Termux (aarch64) — some features unavailable on phones
- Nix (macOS, Linux, NixOS) — "Breaks often due to node.js packaging woes"

**Unsupported (no support, PRs not accepted)**: AUR installs, macOS on Intel (x86), PyPI installations, Homebrew installations. Users on these are directed to switch to a supported install method.

---

## 10. Telegram Setup (Full Walkthrough)

Source: https://hermes-agent.nousresearch.com/docs/user-guide/messaging/telegram

### Bot creation
1. Message [@BotFather](https://t.me/BotFather) → `/newbot`.
2. Choose display name (e.g. "Hermes Agent") and a unique username ending in `bot` (e.g. `my_hermes_bot`).
3. BotFather returns an API token, format: `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`. Quote: "Keep your bot token secret. Anyone with this token can control your bot."

### Optional customization (via @BotFather)
`/setdescription`, `/setabouttext`, `/setuserpic`, `/setcommands`, `/setprivacy`. Recommended starter command list:
```
help - Show help information
new - Start a new conversation
sethome - Set this chat as the home channel
```

### Privacy mode (essential for groups)
Default ON — bot only sees messages starting with `/`, direct replies to bot messages, service messages, and channel messages where it's admin. To disable: @BotFather → `/mybots` → select bot → Bot Settings → Group Privacy → Turn off. **Critical: "You must remove and re-add the bot to any group after changing the privacy setting."**

### Find your Telegram user ID
Message [@userinfobot](https://t.me/userinfobot) or [@get_id_bot](https://t.me/get_id_bot) for instant numeric ID.

### Configuration
Interactive: `hermes gateway setup` (select Telegram, wizard requests token + user IDs). Manual — add to `~/.hermes/.env`:
```
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrSTUvwxYZ
TELEGRAM_ALLOWED_USERS=123456789
```
(comma-separated for multiple users). Start: `hermes gateway`.

### File handling
Docker terminal backend needs host-readable paths:
```yaml
terminal:
  backend: docker
  docker_volumes:
    - "/home/user/.hermes/cache/documents:/output"
```
Emit via `MEDIA:/home/user/.hermes/cache/documents/report.txt`.

**Supported file types**: Images (png, jpg, jpeg, gif, webp, bmp, tiff, svg); Audio (mp3, wav, ogg, m4a, opus, flac, aac); Video (mp4, mov, webm, mkv, avi); Documents (pdf, txt, md, csv, json, xml, html, yaml, yml, log); Office (docx, xlsx, pptx, odt, ods, odp); Archives (zip, rar, 7z, tar, gz, bz2); Books/Packages (epub, apk, ipa).

### Webhook mode (cloud deployments)
```
TELEGRAM_WEBHOOK_URL=https://my-app.fly.dev/telegram
TELEGRAM_WEBHOOK_SECRET="$(openssl rand -hex 32)"
TELEGRAM_WEBHOOK_PORT=8443
```
`TELEGRAM_WEBHOOK_SECRET` mandatory — "The gateway refuses to start without it." Fly.io example: `fly secrets set TELEGRAM_WEBHOOK_URL=...`, `fly secrets set TELEGRAM_WEBHOOK_SECRET=$(openssl rand -hex 32)`, plus `fly.toml` service block with `internal_port = 8443` and TLS handler on port 443.

### Proxy
```yaml
telegram:
  proxy_url: "socks5://127.0.0.1:1080"
```
or `TELEGRAM_PROXY=socks5://127.0.0.1:1080`. Schemes: `http://`, `https://`, `socks5://`.

### Home channel for cron
`/sethome` in any chat, or manually:
```
TELEGRAM_HOME_CHANNEL=-1001234567890
TELEGRAM_HOME_CHANNEL_NAME="My Notes"
```
Note: "Group chat IDs are negative numbers." Topic delivery: `TELEGRAM_CRON_THREAD_ID=<topic_thread_id>`.

### Voice
Incoming (STT) auto-transcribes via `local` (`faster-whisper`, no key), `groq` (`GROQ_API_KEY`), or `openai` (`VOICE_TOOLS_OPENAI_KEY`). Skip STT: `stt: {enabled: false}` → agent receives `[The user sent a voice message: /path/to/audio.ogg]`. Outgoing (TTS): OpenAI/ElevenLabs produce Opus natively; Edge TTS (default) needs `ffmpeg` (`apt install ffmpeg` / `brew install ffmpeg`).

### Large files (>20MB) — full MTProto walkthrough
1. Get `api_id`/`api_hash` from [my.telegram.org/apps](https://my.telegram.org/apps).
2. Run local Bot API server via docker-compose (`aiogram/telegram-bot-api:latest`, `TELEGRAM_API_ID`, `TELEGRAM_API_HASH`, `TELEGRAM_LOCAL=1`, bind `127.0.0.1:8081:8081`). **Security warning: "Never expose port 8081 to the public internet."**
3. Log out of public API: `curl "https://api.telegram.org/bot<TOKEN>/logOut"` → expect `{"ok":true,"result":true}`.
4. Point Hermes to local server:
```yaml
platforms:
  telegram:
    extra:
      base_url: "http://127.0.0.1:8081/bot"
      base_file_url: "http://127.0.0.1:8081/file/bot"
      local_mode: true
```

### Group chat configuration
```yaml
telegram:
  require_mention: true
  exclusive_bot_mentions: true
  mention_patterns: ["^\\s*chompy\\b"]
  ignored_threads: [31, "42"]
```
With `require_mention: true`, bot responds to slash commands, direct replies, `@botusername` mentions, or `mention_patterns` matches.

**Allowlisting**: `allow_from` (global), `group_allow_from` (groups only), `group_allowed_chats` (any member of listed chat authorized). Env equivalents: `TELEGRAM_ALLOWED_USERS`, `TELEGRAM_GROUP_ALLOWED_USERS`, `TELEGRAM_GROUP_ALLOWED_CHATS`.

**Guest mode**: `guest_mode: true` with `group_allowed_chats` set — "Non-allowlisted groups: allow on @mention only."

**Multiple bots in one group**: each profile needs its own bot token (never reuse); launch separately: `hermes gateway start`, `hermes -p research gateway start`, `hermes -p ops gateway start`.

### Private chat topics (Bot API 9.4)
Prereq: user enables Topics toggle in bot DM. Config:
```yaml
platforms:
  telegram:
    extra:
      dm_topics:
      - chat_id: 123456789
        topics:
        - name: General
          icon_color: 7322096
        - name: Website
          skill: arxiv
      ignore_root_dm: true
```
Fields: `name` (required), `icon_color` (optional), `skill` (optional, auto-load on new session), `thread_id` (auto-populated).

### Multi-session DM mode (`/topic`)
Send `/topic` from root DM to check status/enable. Prereq in @BotFather: Bot Settings → Threads Settings → Threaded Mode ON, don't disable user topic creation. Subcommands: `/topic` (root: status/list unlinked), `/topic` (inside topic: show binding), `/topic <session-id>` (restore), `/topic off`, `/topic help`. User flow: open bot DM → tap "All Messages" → send message → Telegram creates topic → Hermes responds there in an isolated session. Auto-renames topic to match generated session title (e.g. "New Topic"→"Database migration plan"); disable with `disable_topic_auto_rename: true`.

### Group forum topic skill binding
```yaml
platforms:
  telegram:
    extra:
      group_topics:
      - chat_id: -1001234567890
        topics:
        - name: Engineering
          thread_id: 5
          skill: software-development
        - name: Research
          thread_id: 12
          skill: arxiv
```
`thread_id` found in URL `https://t.me/c/1234567890/5` (the `5`).

### Streaming & rich messages
```yaml
gateway:
  streaming:
    enabled: true
    transport: auto  # auto | draft | edit | off
```
`auto`: native drafts in DMs, edit-based in groups. Rich messages (Bot API 10.1):
```yaml
gateway:
  platforms:
    telegram:
      extra:
        rich_messages: true
        rich_drafts: false
        pretty_tables: true
        disable_link_previews: false
```
Tables fall back to row-group bullets (small) or fenced code blocks (large).

### Slash command access control
```yaml
gateway:
  platforms:
    telegram:
      extra:
        allow_from: ["123456789", "555555555"]
        allow_admin_from: ["123456789"]
        user_allowed_commands: [status, model, history]
        group_allow_admin_from: ["123456789"]
        group_user_allowed_commands: [status]
```
Non-admins limited to whitelisted commands plus always-allowed `/help` and `/whoami`. Check access: `/whoami`.

### Status indicator
```yaml
telegram:
  extra:
    status_indicator: true
    status_online: "🟢 Online"
    status_offline: "🔴 Offline"
```
Writes to bot's short description (global). Note: "Only a clean gateway shutdown writes 'Offline'. A hard crash leaves the last-known status."

### Command menu priority
```yaml
platforms:
  telegram:
    extra:
      command_menu:
        max_commands: 60
        priority_mode: prepend  # prepend | append | replace
        priority: [my_plugin_command]
```
Telegram allows up to 100 commands; Hermes defaults to **60** for reliability.

### Reactions
```yaml
telegram:
  reactions: true
```
or `TELEGRAM_REACTIONS=true`. Defaults: 👀 processing start, ✅ delivered, ❌ error.

### Per-channel system prompts
```yaml
telegram:
  channel_prompts:
    "-1001234567890": |
      You are a research assistant...
    "42": |
      This topic is for creative writing feedback...
```
Topic-level prompts override group-level.

### Model picker
`/model` (no args) → inline keyboard for provider/model + pagination. `/model <name>` switches directly; `/model <name> --global` persists across sessions.

### DNS-over-HTTPS fallback
Auto-discovery via Google/Cloudflare DNS; manual override `TELEGRAM_FALLBACK_IPS=149.154.167.220,149.154.167.221` or `platforms.telegram.extra.fallback_ips`.

### Notification volume
```yaml
display:
  platforms:
    telegram:
      notifications: important  # or "all"
```
`important`: only final responses + approval prompts ring, tool progress silent. `all`: every message notifies. Env: `HERMES_TELEGRAM_NOTIFICATIONS=all`.

### Exec approval flow
On a dangerous command: `⚠️ This command is potentially dangerous (recursive delete). Reply "yes" to approve.` User replies "yes"/"y" or "no"/"n".

### Interactive clarify prompts
Agent's `clarify` tool renders an inline keyboard, e.g.:
```
❓ Which framework should I use for the dashboard?
[1. Next.js] [2. Remix] [3. Astro] [✏️ Other (type answer)]
```
Timeout: `agent.clarify_timeout` (default **600 seconds**).

### Misc UX behaviors
- Status message editing: recurring updates edit the same bubble instead of appending new ones (`send_or_update_status()`).
- Bot pins the incoming user message at turn start, unpins on completion (visual "processing" indicator).
- Observation mode: `observe_unmentioned_group_messages: true` — bot reads unmentioned group messages as context, replies only when mentioned.

### Troubleshooting matrix
| Problem | Solution |
|---|---|
| No response | Verify `TELEGRAM_BOT_TOKEN`, check gateway logs |
| "Unauthorized" | User not in `TELEGRAM_ALLOWED_USERS` |
| Silent in groups | Disable BotFather privacy mode, remove/re-add bot |
| Voice not transcribed | Install `faster-whisper` or set `GROQ_API_KEY` |
| Voice files not bubbles | Install `ffmpeg` |
| Token revoked | `/revoke` then `/newbot` in BotFather |
| Webhook no updates | Verify public HTTPS reachability, firewall |

### Security
"Always set `TELEGRAM_ALLOWED_USERS` to restrict who can interact with your bot." "Never share your bot token publicly. If compromised, revoke it immediately via BotFather's `/revoke` command."

### Session key isolation
DM topics: `agent:main:telegram:dm:{chat_id}:{thread_id}`. Group topics get the same isolation when forum topics are enabled.

---

## 11. Bundled Skills Catalog (default-on)

Source: https://hermes-agent.nousresearch.com/docs/reference/skills-catalog

Grouped exactly as presented on the page:

**Apple**: apple-notes (Apple Notes via `memo` CLI), apple-reminders (Apple Reminders via `remindctl`), findmy (track Apple devices/AirTags via FindMy.app, macOS), imessage (send/receive iMessage/SMS via `imsg` CLI, macOS).

**Autonomous AI Agents**: claude-code (delegate coding to Claude Code CLI for features/PRs), codex (delegate to OpenAI Codex CLI), computer-use (desktop automation across macOS/Windows/Linux without cursor interference), hermes-agent (configure/theme/orchestrate Hermes itself), opencode (delegate to OpenCode CLI for features/PR review).

**Creative**: architecture-diagram (dark-themed SVG diagrams), ascii-art (pyfiglet/cowsay), ascii-video (video/audio→colored ASCII MP4/GIF), baoyu-infographic (21 layouts × 21 styles), claude-design (HTML artifacts: landing pages/prototypes), comfyui (diffusion workflows for image/video/audio), design-md (Google's DESIGN.md token spec authoring/validation), excalidraw (hand-drawn architecture/flow/sequence diagrams), humanizer (remove AI-isms, add authentic voice), manim-video (3Blue1Brown-style math animations), p5js (generative art/shaders/interactive/3D sketches), popular-web-designs (54 real design systems as HTML/CSS — Stripe, Linear, Vercel), pretext (DOM-free text layout browser demos), sketch (throwaway HTML mockups for design comparison), songwriting-and-ai-music (songwriting techniques + Suno AI prompts), touchdesigner-mcp (control TouchDesigner via twozero MCP).

**Email**: himalaya (IMAP/SMTP from terminal).

**GitHub**: codebase-inspection (LOC + language ratios), github-auth (HTTPS tokens + SSH keys), github-code-review (PR diffs + inline comments), github-issues (create/triage/label/assign), github-pr-workflow (full PR lifecycle branching→merging), github-repo-management (clone/create/fork, remotes/releases).

**Media**: gif-search (Tenor via curl+jq), songsee (audio spectrograms/features: mel, chroma, MFCC), youtube-content (transcripts→summaries/threads/blogs).

**MLOps**: evaluating-llms-harness (lm-eval-harness: MMLU, GSM8K), huggingface-hub (search/download/upload via `hf` CLI), llama-cpp (run GGUF locally), serving-llms-vllm (high-throughput serving + quantization), weights-and-biases (experiments/sweeps/model registries).

**Note-Taking**: obsidian (read/search/create/edit notes in vault).

**Productivity**: airtable (REST API via curl, CRUD/filters/upserts), docx (Word .docx create/read/edit/templates), google-workspace (Gmail/Calendar/Drive/Docs/Sheets via `gws` CLI or Python), maps (geocode/POIs/routes/timezones), nano-pdf (edit PDF text via natural language), notion (Notion API + `ntn` CLI: pages/databases/markdown/Workers), ocr-and-documents (extract text via pymupdf/marker-pdf), pdf (create/merge/split/fill/secure), powerpoint (.pptx create/read/edit/templates), teams-meeting-pipeline (Teams meeting summaries + subscriptions), xlsx (Excel/CSV create/read/edit).

**Research**: arxiv (search by keyword/author/category/ID), blogwatcher (RSS/Atom monitoring via blogwatcher-cli), llm-wiki (interlinked markdown knowledge bases), polymarket (markets/prices/order history), research-paper-writing (NeurIPS/ICML/ICLR papers).

**Smart Home**: openhue (Philips Hue lights/scenes/rooms via OpenHue CLI).

**Social Media**: xurl (X/Twitter via xurl CLI: search/post/DM/media).

**Software Development**: dogfood (exploratory QA of web apps), hermes-agent-skill-authoring (author SKILL.md files), node-inspect-debugger (Node.js debug via Chrome DevTools Protocol), plan (write markdown plans without executing), python-debugpy (pdb REPL + debugpy remote), requesting-code-review (pre-commit review + security scanning + auto-fix), simplify-code (parallel 4-agent cleanup of recent changes), spike (throwaway experiments to validate ideas), systematic-debugging (four-phase root-cause methodology), test-driven-development ("TDD: enforce RED-GREEN-REFACTOR, tests before code").

---

## 12. Optional Skills Catalog (install on demand)

Source: https://hermes-agent.nousresearch.com/docs/reference/optional-skills-catalog

Ship with hermes-agent but inactive by default. Install: `hermes skills install official/<category>/<skill>`.

**autonomous-ai-agents**: antigravity-cli, blackbox (delegate to Blackbox AI multi-model CLI), grok (route to xAI Grok Build CLI), honcho (configure/troubleshoot Honcho memory integration), openhands (delegate to OpenHands CLI, LiteLLM model-agnostic).

**blockchain**: evm (read-only client, wallets/tokens/gas across 8 chains), hyperliquid (market data/account history/trade review), solana (wallets/tokens/transactions/NFTs with USD conversion).

**communication**: one-three-one-rule (structured decision framework for technical proposals/tradeoffs).

**creative**: audiocraft-audio-generation (MusicGen/AudioGen text-to-audio), baoyu-article-illustrator, baoyu-comic (educational comics), blender-mcp (Blender automation via MCP/bpy), concept-diagrams (flat minimal SVG educational visuals), creative-ideation (named creative methodologies), heartmula (Suno-like song generation), hyperframes (render MP4/WebM from HTML compositions), kanban-video-orchestrator (multi-agent video production pipelines), meme-generation (Pillow text-overlay meme PNGs), pixel-art (era palettes: NES, Game Boy, PICO-8), tldraw-offline (script offline tldraw canvases), unreal-mcp (Unreal Engine editor/actors/rendering automation).

**data-science**: jupyter-notebook (iterative Python via live kernel).

**devops**: inference-sh-cli (150+ AI apps for image/video/LLM), docker-management (containers/images/volumes/Compose), hermes-s6-container-supervision (modify/debug s6 services in Hermes Docker image), pinggy-tunnel (zero-install localhost tunnels via SSH), watchers (poll RSS/JSON APIs/GitHub with watermark dedup).

**dogfood**: adversarial-ux-test (roleplay hostile-user UX pain-point discovery).

**email**: agentmail (agent inbox: send/receive).

**finance**: 3-statement-model, comps-analysis, dcf-model, excel-author (headless openpyxl), lbo-model (IRR/MOIC), merger-model (M&A accretion/dilution), pptx-author (headless python-pptx decks), stocks (quotes/history/search/crypto via Yahoo).

**gaming**: minecraft-modpack-server (CurseForge/Modrinth modded servers), pokemon-player (headless emulator + RAM reading).

**health**: fitness-nutrition (690+ exercises, 380,000+ foods), neuroskill-bci (real-time cognitive/emotional state via NeuroSkill).

**mcp**: fastmcp (build/test/deploy Python MCP servers), mcp-oauth-remote-gateway (manual OAuth config for remote MCP servers), mcporter (list/auth/call MCP servers/tools from terminal).

**migration**: openclaw-migration (import OpenClaw memories/skills into Hermes).

**mlops** (largest optional category — 27 skills): huggingface-accelerate, axolotl (LoRA/DPO/GRPO fine-tuning), chroma (embedding DB for RAG), clip (zero-shot classification/search), dspy (declarative LM programs + auto-optimized RAG), faiss (billion-scale vector search), optimizing-attention-flash, guidance (grammar-constrained/valid-JSON output), huggingface-tokenizers, instructor (Pydantic-structured outputs), lambda-labs-gpu-cloud, llava (VQA/captioning/dialogue), modal-serverless-gpu, nemo-curator (dedup/filter/PII redaction), obliteratus (abliterate refusals via diff-in-means), outlines (structured JSON/regex/Pydantic generation), peft-fine-tuning (LoRA on limited GPU), pinecone, pytorch-fsdp, pytorch-lightning, qdrant-vector-search, sparse-autoencoder-training, segment-anything-model, simpo-training (reference-free preference alignment), slime-rl-training (Megatron+SGLang), stable-diffusion-image-generation, tensorrt-llm, distributed-llm-pretraining-torchtitan (4D parallelism), fine-tuning-with-trl (SFT/DPO/GRPO/RLOO), unsloth (2-5x faster LoRA/QLoRA), whisper (99-language transcribe/translate).

**payments**: mpp-agent (pay HTTP 402 APIs via Machine Payments Protocol), stripe-link-cli (agent payments via Stripe Link), stripe-projects (provision SaaS + sync credentials).

**productivity**: canvas (Canvas LMS courses/assignments), here.now (publish sites/store files in Drives), memento-flashcards (spaced repetition, free-text grading, adaptive scheduling), shop (catalog search/checkout/tracking/returns), shopify (Admin/Storefront GraphQL), siyuan (query/edit SiYuan knowledge base), telephony (Twilio numbers, SMS/MMS, AI outbound calls).

**research**: bioinformatics (gateway to 400+ genomics/comp-bio skills), darwinian-evolver (evolve prompts/regex/SQL/code via Imbue's evolution loop), domain-intel (subdomains/SSL/WHOIS/DNS recon), drug-discovery, duckduckgo-search (free keyless search), gitnexus-explorer (interactive codebase knowledge graph web UI), osint-investigation (follow-the-money public records), parallel-cli (agent-native web search/deep research/enrichment), pinecone-research (agent RAG + long-term memory), qmd (hybrid local search over notes/docs/transcripts), scrapling (stealth scraping + Cloudflare bypass), searxng-search (free keyless meta-search, 70+ engines).

**security**: 1password (op CLI setup/sign-in/secret injection), godmode (jailbreak methods: Parseltongue, GODMODE, ULTRAPLINIAN), oss-forensics (supply-chain investigation for GitHub), sherlock (find usernames across 400+ platforms), unbroker (autonomously remove personal info from data-broker sites), web-pentest (authorized pentesting with scope guardrails).

**software-development**: code-wiki (wiki docs + Mermaid diagrams for codebases), rest-graphql-debug (status codes/auth/schemas), subagent-driven-development (execute plans via `delegate_task` subagents with 2-stage review).

**web-development**: cloudflare-temporary-deploy (live Workers deploy, no account setup), page-agent (in-page natural-language GUI copilot).

**yuanbao**: yuanbao (Yuanbao groups: @mention users, info/member queries).

---

## 13. Kanban Boards

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/kanban

- "Hermes Kanban is a durable task board, shared across all your Hermes profiles, that lets multiple named agents collaborate on work without fragile in-process subagent swarms."
- **Kanban vs. `delegate_task`**: Kanban = durable message queue, named profiles keep persistent memory; `delegate_task` = RPC-style call to anonymous subagents. Use Kanban when work crosses agent boundaries, needs restart resilience, involves humans, or needs post-execution discoverability.
- Quick start:
```bash
hermes kanban init
hermes gateway start
hermes kanban create "task" --assignee researcher
hermes kanban watch
```
- Core concepts: **Board** = standalone queue (SQLite DB + workspaces + dispatcher loop). **Task** = row with title/body/assignee/status (`triage|todo|ready|running|blocked|done|archived`). **Dispatcher** = long-lived loop reclaiming stale claims and spawning workers. **Workspace types**: `scratch` (ephemeral temp dir, deleted on completion), `dir:<path>` (persistent shared dir), `worktree` (git worktree under `.worktrees/`).
- Worker tool calls (not CLI): `kanban_show()`, `kanban_complete()`, `kanban_block()`, `kanban_create()` (fan out children), `kanban_heartbeat()`, `kanban_comment()`.
- Dashboard: visual columns per status, live WebSocket updates, drag-drop, create-task dialog with multi-select bulk actions, auto-decomposition of triage tasks into specialist assignments, markdown-rendered descriptions/results. Config under `dashboard.kanban`: `default_tenant`, `lane_by_profile`, `render_markdown`.
- CLI: `hermes kanban list [--assignee P] [--status S]`, `show <id>`, `create "<title>" --assignee <profile>`, `complete <id>... --result "..."`, `block <id> "<reason>"`, `unblock <id>...`, `decompose <id>`.
- Config keys: `max_in_progress` (board-wide cap), `max_in_progress_per_profile` (per-assignee cap), `auto_promote_children` (require manual review if false), `dispatch_in_gateway`, `dispatch_interval_seconds` (default 60), `failure_limit` (default 2).
- Multi-board: `hermes kanban boards create project-name --name "Display Name"`, `hermes kanban --board project-name list`, `hermes kanban boards switch project-name`. Each board's DB: `~/.hermes/kanban/boards/<slug>/kanban.db`.
- Each task attempt creates a `task_runs` row; workers should provide structured evidence, e.g.:
```python
kanban_complete(summary="implemented X; tests pass", metadata={"changed_files": [...], "tests_run": 14})
```
- Gateway integration: `/kanban` slash command works in interactive sessions and messaging platforms; auto-subscription notifies originating chats on task completion. Examples: `/kanban list`, `/kanban create "task" --assignee researcher`, `/kanban unblock t_abcd`.
- Event types — lifecycle: created, promoted, claimed, completed, blocked, archived; edits: assigned, edited, reprioritized; telemetry: spawned, heartbeat, crashed, timed_out, protocol_violation, gave_up. Monitor: `hermes kanban tail <id>`, `hermes kanban watch --kinds completed,blocked`.
- **Limitation**: single-host by design — `~/.hermes/kanban.db` is local SQLite; multi-host requires independent boards per host with bridge mechanisms.

---

## 14. Mixture of Agents (MoA)

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/mixture-of-agents

- MoA is "a virtual model provider": reference models (advisors) run in parallel, an aggregator model synthesizes their outputs into the final response, preserving Hermes' normal agent loop (tool calls, session persistence).
- Selection: `/model <preset> --provider moa` or `/model --provider moa` (default preset); one-shot `/moa <prompt>` (temporarily switches then restores previous model); Dashboard/Desktop/TUI model pickers show presets under "Mixture of Agents".
- Mechanics per model call with `provider: moa`: (1) resolve named preset, (2) run reference models **without tool schemas** (conversation text only, not system prompt/tool transcript), (3) append reference outputs as private context, (4) call aggregator with normal Hermes tool schema, (5) treat aggregator response as the real response, execute its tool calls, (6) repeat on next iteration over updated conversation.
- Config (`config.yaml`):
```yaml
moa:
  default_preset: default
  presets:
    default:
      reference_models:
        - provider: openai-codex
          model: gpt-5.5
        - provider: openrouter
          model: deepseek/deepseek-v4-pro
      aggregator:
        provider: openrouter
        model: anthropic/claude-opus-4.8
      reference_temperature: 0.6
      aggregator_temperature: 0.4
      max_tokens: 4096
      enabled: true
      reference_max_tokens: 600
      fanout: user_turn
      privacy_filter: display
```
- Keys: `reference_models` (list of provider/model), `aggregator` (provider/model), `reference_max_tokens` (caps advisor output, e.g. 600; unset/0 = uncapped, affects advisors only), `fanout` — `user_turn` (default since July 2026, cheapest, advisors run once per user message), `per_iteration` (freshest, costliest), `every_n:3`/`{mode: every_n, n: 3}` (N≥2, middle ground); `reference_temperature`, `aggregator_temperature`, `max_tokens`, `reasoning_effort` (per-slot: `none`/`minimal`/`low`/`medium`/`high`/`xhigh`/`max`/`ultra`), `privacy_filter` (`display` = redacts user-visible surfaces only, aggregator sees raw text; `full` = also redacts text injected into aggregator prompt; masks credentials/emails/phone numbers like "(555) 123-4567"), `enabled: false` (disables fan-out, aggregator acts alone), `default_preset`.
- CLI: `hermes moa list`, `hermes moa configure` (interactive default update), `hermes moa configure <name>` (create/update named preset), `hermes moa delete <name>`.
- **Benchmark (HermesBench)**: Claude Opus 4.8 aggregating GPT-5.5 (MoA) = **0.8202**; Claude Opus 4.8 alone = 0.7607; GPT-5.5 alone = 0.7412 — MoA beats the strongest single component by ~60 basis points.
- Prompt caching preserved: reference outputs append to the tail of the latest user turn, below the stable prefix (system prompt + history) — "the aggregator gets a cache hit on everything above the injection, and only the freshly appended tail is new."
- Constraints: aggregator cannot itself be a MoA preset (no recursive trees); one reference model's credential failure doesn't abort the turn; MoA increases total model-call count; **no longer listed under `hermes tools`** — no toolset to enable, it's a provider selection.
- Default preset ships with references `openai-codex:gpt-5.5` + `openrouter:deepseek/deepseek-v4-pro`, aggregator `openrouter:anthropic/claude-opus-4.8`.

---

## 15. Event Hooks (Shell Hooks)

Source: https://hermes-agent.nousresearch.com/docs/user-guide/features/hooks

- Three hook systems: **Gateway hooks** (fire during gateway/messaging-platform operation), **Plugin hooks** (Python, registered via `ctx.register_hook`, run in CLI + Gateway — see Plugins section above), **Shell hooks** (drop-in scripts declared in config, work everywhere).
- Shell hook config (`~/.hermes/config.yaml`, `hooks:` block):
```yaml
hooks:
  <event_name>:
    - matcher: "<regex>"           # optional; for pre/post_tool_call
      command: "<shell command>"   # required
      timeout: <seconds>           # optional; default 60, max 300
```
- **Consent model**: first use prompts for approval; approvals stored in `~/.hermes/shell-hooks-allowlist.json`. Bypass with `--accept-hooks` flag, `HERMES_ACCEPT_HOOKS=1` env var, or `hooks_auto_accept: true` config.
- Valid events (non-exhaustive per page): `pre_tool_call`, `post_tool_call`, `pre_llm_call`, `post_llm_call`, `pre_verify`, `on_session_start`, `on_session_end`, `subagent_stop`, "and others."
- CLI: `hermes hooks list` (show configured hooks), `hermes hooks test <event>` (fire synthetic payload), `hermes hooks revoke <command>` (remove allowlist entry), `hermes hooks doctor` (validate setup).
- Shell hooks communicate via JSON stdin/stdout and run as isolated subprocesses.
- Cross-reference: prior-pass Plugins/hooks material is superseded/complemented by the "Available Hooks" list in section 5 above (`pre_tool_call`, `post_tool_call`, `pre_llm_call`, `post_llm_call`, `on_session_start`, `on_session_end`, `on_session_finalize`, `on_session_reset`, `subagent_stop`, `pre_gateway_dispatch` — the plugin-hook event set, a superset of the shell-hook event set documented here).

---

## 16. Checkpoints & `/rollback`

Source: https://hermes-agent.nousresearch.com/docs/user-guide/checkpoints-and-rollback

- Automatic snapshots before destructive operations, restorable via `/rollback`. **Opt-in by default as of v2** (`checkpoints.enabled: false` by default).
- Enable per-session: `hermes chat --checkpoints`. Enable globally:
```yaml
checkpoints:
  enabled: true
```
- **Shadow store architecture**: "a single shared shadow git repository under `~/.hermes/checkpoints/store/`" that never touches the real project `.git`; git's content-addressable object DB deduplicates across projects/turns. Directory layout:
```
~/.hermes/checkpoints/
├── store/                 # shared bare git repo
│   ├── HEAD, objects/
│   ├── refs/hermes/<hash> # per-project branch tip
│   ├── indexes/<hash>     # per-project git index
│   ├── projects/<hash>.json
│   └── info/exclude
├── .last_prune
└── legacy-<ts>/            # pre-v2 archived repos
```
Hash values derive from the absolute working-directory path.
- Triggers: file tools `write_file`, `patch`; destructive terminal commands `rm`, `rmdir`, `cp`, `install`, `mv`, `sed -i`, `truncate`, `dd`, `shred`, output redirects (`>`), and `git reset`/`clean`/`checkout`. Max one checkpoint per directory per turn.
- In-session commands: `/rollback` (list all w/ change stats), `/rollback <N>` (restore, undoes last chat turn), `/rollback diff <N>` (preview diff), `/rollback <N> <file>` (restore single file).
- CLI: `hermes checkpoints` (size/project-count/breakdown), `status`/`list` (aliases), `prune` (force sweep: delete orphans, GC, enforce cap — accepts `--retention-days 3 --max-size-mb 200`), `clear` (delete entire base, prompts), `clear-legacy` (delete only legacy-* v1 archives).
- Config defaults:
```yaml
checkpoints:
  enabled: false
  max_snapshots: 20
  max_total_size_mb: 500
  max_file_size_mb: 10
  auto_prune: true
  retention_days: 7
  min_interval_hours: 24
```
- Restore mechanism: verify target commit exists → take pre-rollback snapshot (for undo) → restore tracked files → **undo the last conversation turn** to sync agent context with filesystem.
- Safety guards: transparently disabled if git not on PATH; skips root `/` and `$HOME`; skips directories with >50,000 files; per-file cap `max_file_size_mb` (default 10MB); total-size enforcement drops oldest commits round-robin past `max_total_size_mb` (default 500MB); `max_snapshots` enforced via ref rewrite + `git gc --prune=now`; skips snapshot if no changes since last one; all Checkpoint Manager errors logged at debug level, tools continue regardless.
- v1→v2 migration: pre-v2 per-project shadow repos auto-moved to `~/.hermes/checkpoints/legacy-<timestamp>/` on first v2 run; clear with `hermes checkpoints clear-legacy`; swept by `auto_prune` after `retention_days`.
- Best practices per docs: enable only when needed; use `/rollback diff` before restoring; prefer `/rollback` over `git reset` for agent-driven undos; check `hermes checkpoints status` periodically; combine with git worktrees for max safety.

---

## 17. Webhooks (messaging platform / event-driven gateway)

Source: https://hermes-agent.nousresearch.com/docs/user-guide/messaging/webhooks

- The webhook adapter runs an HTTP server accepting POST requests from external services (GitHub, GitLab, JIRA, Stripe, etc.), validates HMAC signatures, transforms payloads into agent prompts, and routes responses to configured platforms or back to source.
- Setup: `hermes gateway setup` (wizard) or env vars in `~/.hermes/.env`: `WEBHOOK_ENABLED=true`, `WEBHOOK_PORT=8644` (default), `WEBHOOK_SECRET=your-global-secret`. Health check: `curl http://localhost:8644/health` → `{"status": "ok", "platform": "webhook"}`.
- **Static route config** (`config.yaml`, `platforms.webhook.extra.routes`), per-route fields: `events` (filter, e.g. `["pull_request"]`; empty = accept all; read from `X-GitHub-Event`/`X-GitLab-Event`/`event_type` payload field), `secret` (required, HMAC; falls back to global; `"INSECURE_NO_AUTH"` allowed loopback-only), `prompt` (dot-notation template, e.g. `{pull_request.title}`; omitted = full JSON dumped, truncated at 4000 chars), `filters` (declarative; non-match returns HTTP 200 `{"status":"ignored","reason":"filter"}`), `script` (path under `~/.hermes/scripts/`; stdin=JSON payload, stdout replaces/augments it; empty/`[SILENT]`/nonzero exit = ignore), `skills` (list for agent run), `deliver` (target: `github_comment`, `telegram`, `discord`, `slack`, `signal`, `sms`, `whatsapp`, `matrix`, `mattermost`, `homeassistant`, `email`, `dingtalk`, `feishu`, `wecom`, `weixin`, `bluebubbles`, `qqbot`, or `log` default), `deliver_extra` (e.g. `repo`, `pr_number`, `chat_id`, templated), `deliver_only` (skip agent, render `prompt` literally — zero LLM cost, sub-second delivery, needs real `deliver` target).
- Prompt templates: dot-notation e.g. `{pull_request.title}`; special token `{__raw__}` dumps full JSON (4000-char truncation); missing keys stay literal `{key}` (no error); nested dicts/lists JSON-serialized, truncated at 2000 chars. Same syntax in `deliver_extra`.
- Payload filter operators: `exists`, `missing`, `equals`/`not_equals`, `contains`, `in`, `in_file` (JSON array/object or newline text), `regex`, `all`/`any`/`not` groups. Field paths use dot notation; `event`/`event_type` matches resolved event; `headers.<Name>` reads request headers.
- Script filters: `.sh`/`.bash` run via bash, others via current Python interpreter; outcomes — JSON stdout replaces payload, non-JSON text stdout becomes `script_output`, empty/`[SILENT]`/`{"__hermes_ignore__": true}`/timeout/missing/nonzero-exit → HTTP 200 ignored.
- **GitHub PR review walkthrough**: create webhook (repo → Settings → Webhooks → Add webhook; payload URL `http://your-server:8644/webhooks/github-pr`; content type `application/json`; secret matches route; events = Pull requests) → add route config → `gh auth login` → open PR to trigger.
- **GitLab walkthrough**: Project → Settings → Webhooks; URL `http://your-server:8644/webhooks/gitlab-mr`; secret token is a plain string (header match via `X-Gitlab-Token`, not HMAC); events = Merge request events.
- Delivery notes: `github_comment` needs authenticated `gh` CLI + `repo`/`pr_number` in `deliver_extra`; messaging targets use home channel or `chat_id`; `message_thread_id` for Telegram forum topics.
- **Dynamic subscriptions (CLI)**:
```bash
hermes webhook subscribe github-issues \
  --events "issues" \
  --prompt "New issue #{issue.number}: {issue.title}\nBy: {issue.user.login}\n\n{issue.body}" \
  --deliver telegram \
  --deliver-chat-id "-100123456789" \
  --description "Triage new GitHub issues"
hermes webhook list
hermes webhook remove github-issues
hermes webhook test github-issues
hermes webhook test github-issues --payload '{"issue": {"number": 42, "title": "Test"}}'
```
Stored in `~/.hermes/webhook_subscriptions.json`; hot-reloaded per request (mtime-gated); static routes take precedence; no restart required.
- **Security**: HMAC validation — GitHub `X-Hub-Signature-256` (HMAC-SHA256 hex, `sha256=` prefix); GitLab `X-Gitlab-Token` (plain match); Generic V2 (recommended) `X-Webhook-Signature-V2` + `X-Webhook-Timestamp` (±300s window, replay protection); Generic V1 (legacy) `X-Webhook-Signature` (no replay protection, logs deprecation warning). Rate limit: **30 req/min per route** (default, configurable). Idempotency: delivery IDs cached **1 hour**, duplicates silently skipped with 200. Body size limit: **1 MB default** (`max_body_bytes`). Every route requires a secret (startup fails otherwise); `INSECURE_NO_AUTH` only on loopback. Quote: "HMAC validation authenticates the sender, not the content." — harden with sandboxing, scoped toolsets, approval gates, narrow templating.
- Response codes: `200 OK` delivered (body includes `status`/`route`/`target`/`delivery_id`); `200` duplicate (within 1hr TTL, not re-delivered); `401` invalid/missing signature; `400` malformed JSON; `404` unknown route; `413` payload too large; `429` rate limited; `502` target adapter rejected message.
- Env vars: `WEBHOOK_ENABLED` (default `false`), `WEBHOOK_PORT` (default `8644`), `WEBHOOK_SECRET` (none by default).
- Troubleshooting: verify port/firewall/URL path (`http://your-server:8644/webhooks/<route-name>`); check secret + header logs for signature failures; check `events` list for ignored events; `hermes gateway run` for logs; check idempotency cache for duplicates; `gh auth login` for `gh` CLI errors.

---

## 18. Hermes Desktop App

Source: https://hermes-agent.nousresearch.com/docs/user-guide/desktop

- Launch: `hermes desktop` — uses existing config/API keys/sessions/skills; runs on macOS, Windows, Linux.
- Chat interface: streaming responses with live tool activity + structured tool-call summaries, drag-and-drop file attachment, right-hand preview rail (renders web pages/tool outputs), composer history via arrow keys, queue editing with Esc to pause.
- Status bar: per-session **YOLO toggle** (bypasses dangerous-command approval prompts).
- File browser: explore working directory; set initial path via `hermes desktop --cwd <path>` or `HERMES_DESKTOP_CWD`.
- Model selection: sticky UI state (never overwrites profile default); per-model reasoning-effort and fast-mode presets stored locally; mid-chat switch resets prompt cache.
- Voice mode: same implementation as CLI; requests OS mic access on macOS.
- Settings: provider/API key management UI, full provider/model catalog, tool-backend install from GUI, xAI Grok OAuth support, auxiliary-model provider mismatch warnings.
- **Repository discovery** (`config.yaml` → `desktop:`):
```yaml
desktop:
  repo_scan_enabled: true
  repo_scan_roots: []
  repo_scan_exclude_paths: []
```
`repo_scan_enabled: false` disables scanning; empty `repo_scan_roots` = default home-dir scan; `repo_scan_exclude_paths` skips listed folders. Changes trigger a "policy-compliant refresh" of that profile's cache.
- CLI flags for `hermes desktop`: `--skip-build` (launch existing unpacked app), `--force-build`, `--build-only`, `--source` (launch via `electron .` against `apps/desktop/dist`), `--cwd PATH`, `--hermes-root PATH` (sets `HERMES_DESKTOP_HERMES_ROOT`), `--ignore-existing` (ignore `hermes` on PATH), `--fake-boot` (deterministic boot delays for UI testing). Top-level alias: `gui`.
- Architecture: Electron + native React interface; first launch installs Hermes Agent runtime into `HERMES_HOME` (`~/.hermes`, or `%LOCALAPPDATA%\hermes` on Windows) — "the same layout a CLI install uses, which is why the two are interchangeable." Backend resolution order: `HERMES_DESKTOP_HERMES_ROOT` env → managed install in `HERMES_HOME` → `hermes` on PATH (unless `--ignore-existing`) → `HERMES_DESKTOP_HERMES` command override. React renderer talks to a headless `hermes serve` backend via `tui_gateway` JSON-RPC/WebSocket. Quote: "self-contained: it runs its own `hermes serve` backend and never opens or requires the web dashboard."
- **Remote backend connection** (same underlying mechanism as web-dashboard remote auth, section 3): set `HERMES_DASHBOARD_BASIC_AUTH_USERNAME`/`_PASSWORD`/`_SECRET` in remote machine's `~/.hermes/.env` (mode 0600), run `hermes serve --host 0.0.0.0 --port 9119`. App: Settings → Gateway → Remote gateway → Remote URL `http://<backend-host>:9119` → Sign in → Save and reconnect. Env override: `HERMES_DESKTOP_REMOTE_URL`. **Per-profile configuration** — each profile can point at a different backend. Security: "never expose a password-protected backend directly to the open internet; put it behind a VPN" — Tailscale recommended for private-mesh binding; for public internet exposure use Nous OAuth (`hermes dashboard register`) instead.
- Uninstall (Settings → About → Danger zone): `hermes uninstall --gui` (GUI only, agent/config/chats persist), `hermes uninstall` (GUI+agent, config/chats/secrets remain), `hermes uninstall --full` (everything). Source checkouts: `--gui` also removes `node_modules` and `apps/desktop/{dist,release}`.
- Build from source: `npm install` (repo root) → `cd apps/desktop && npm run dev` (Vite renderer + Electron, boots Python backend). Env options: `HERMES_DESKTOP_HERMES_ROOT=/path/to/clone npm run dev`, `HERMES_HOME=/tmp/throwaway npm run dev`, `npm run dev:fake-boot`. Installers: `npm run dist:mac` (DMG+zip), `npm run dist:win` (NSIS+MSI), `npm run dist:linux` (AppImage+deb+rpm), `npm run pack` (unpacked only). Signing env vars: `CSC_LINK`, `CSC_KEY_PASSWORD`, `APPLE_*`, `WIN_CSC_*`.
- Troubleshooting: boot logs `HERMES_HOME/logs/desktop.log`; tail via `hermes logs gui -f`. Resets: `rm "$HOME/.hermes/hermes-agent/.hermes-bootstrap-complete"` (force clean first-launch), `rm -rf "$HOME/.hermes/hermes-agent/venv"` (rebuild broken venv), `tccutil reset Microphone com.nousresearch.hermes` (macOS mic prompt reset). Electron download self-heals (clears corrupt zip, retries via npmmirror.com if no `ELECTRON_MIRROR` set); manual mirror: `ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/ ...`; clear cached zip at `~/Library/Caches/electron/` (macOS) or `~/.cache/electron/` (Linux).
- Plugin system: drop ESM files at `$HERMES_HOME/desktop-plugins/<id>/plugin.js`; hot-reloads on save; managed via Settings → Plugins; SDK covers panes, pages, sidebar nav, status-bar items, palette commands, keybinds, themes.
- Multi-profile/session: concurrent sessions across profiles, cross-profile `@session` links, session search by ID, archiving.
- Keyboard shortcuts: Cmd+K/Ctrl+K command palette, rebindable shortcuts panel, custom zoom half-steps, UI language switcher (incl. Simplified Chinese/zh-Hans).
- Additional panes: Skills, Cron, Profiles, Messaging, Agents, Command Center. Sessions started in desktop resume in CLI/TUI and vice versa (shared conversation history/state).

---

## 19. Profiles

Source: https://hermes-agent.nousresearch.com/docs/user-guide/profiles

- Enables "multiple independent agents on the same machine — each with its own config, API keys, memory, sessions, skills, and gateway state."
- Creation: `hermes profile create mybot` (blank), `hermes profile create work --clone` (clone config), `hermes profile create backup --clone-all` (clone everything).
- Usage: auto-generated command aliases at `~/.local/bin/<name>`; `-p` flag targets a profile per-invocation (`hermes -p coder chat`); sticky default via `hermes profile use coder`.
- Gateway: each profile runs independently with its own bot token and systemd/launchd service; includes "safety: token locks" preventing accidental duplicate token reuse across profiles.
- **Important distinction**: profiles isolate Hermes state (config/memory/sessions) but do **not** sandbox filesystem access — terminal working directories are separate from profile boundaries.
- Shareable distributions: a profile built on one machine "can be packaged as a git repository and installed with one command on another machine."
- Note: `hermes profile` subcommands per CLI reference (not all re-verified against this page): `list`, `use`, `create`, `delete`, `show`, `alias`, `rename`, `export`, `import`, `install`, `update`.

---

## 20. Confirmed non-existent / no dedicated page

Per the CLI reference (`/docs/reference/cli-commands`) cross-check plus direct 404 probing:

- **`hermes project`** (projects/workspaces — named workspaces spanning multiple folders/repos, anchors desktop session grouping) — **no dedicated feature doc page exists.** CLI reference quote: "Projects are human-named workspaces that can span multiple folders / repos. They anchor desktop session grouping." Subcommands per CLI reference: `create`, `list`, `show`, `add-folder`, `remove-folder`, `rename`, `use`, `archive`, `bind-board`.
- **`hermes insights`** (token/cost/activity analytics) — **no dedicated feature doc page exists.** CLI reference quote: "Show token/cost/activity analytics." Options: `--days <n>`, `--source <platform>`. Functionally overlaps with the Web Dashboard's **Analytics** tab (see section 3), which is documented there instead.

Both commands exist and work in the CLI; they simply aren't cross-linked to (or backed by) a standalone `/docs/user-guide/features/*` page the way kanban, hooks, MoA, checkpoints, webhooks, desktop, and profiles are.

---

## Facts uncertain / needs verification

- The user-stories page states "262 total stories" but several stories are visibly duplicated across categories in the extraction (e.g., "Hermes manages my tasks across Obsidian, Apple Calendar and Signal" appears 3+ times, "Hooks that swap in better tools every time the agent runs" appears twice) — unclear whether this is the site's own cross-listing (a story tagged with multiple categories counted once per category) or an artifact of the fetch/summarization pass. Treat exact per-category counts as approximate given this.
- `hermes profile` and `hermes moa` subcommand lists were sourced from the CLI-reference page (already covered by the prior research pass) via a targeted re-query in this pass, not independently re-verified against the live CLI reference page's full text in this session — cross-check against `01-docs-core.md`/`02-docs-systems.md` if inconsistencies surface.
- Sitemap.xml only listed two URLs (`/` and `/docs`), so page discovery relied on the Features Overview page's link list plus targeted guessing/404 probing rather than an authoritative full sitemap. It's possible additional undiscovered pages exist under `/docs/user-guide/features/` or elsewhere that were not guessed correctly (e.g., under a naming pattern not tried).
- Tool Gateway's optional-add-on framing ("Modal (Serverless Terminal), available as optional add-on, not included in default bundle") was captured as summarized by the fetch tool, not verified against exact page wording for the surrounding paragraph.
- MoA's "no longer listed under `hermes tools`" and "fanout default changed to `user_turn` since July 2026" are dated claims from the fetched page; exact prior default (pre-July-2026) was not stated on the page and is not known.
- Optional-skills-catalog's mlops category count (~27 skills) and the bundled-skills total were not independently cross-summed against any stated page total (unlike the user-stories page, neither skills-catalog page stated an explicit total count).

## Pages that do not exist / 404'd

- `https://hermes-agent.nousresearch.com/docs/user-guide/features/desktop` — 404 (correct page: `/docs/user-guide/desktop`)
- `https://hermes-agent.nousresearch.com/docs/getting-started/desktop-app` — 404
- `https://hermes-agent.nousresearch.com/docs/user-guide/features/webhooks` — 404 (correct page: `/docs/user-guide/messaging/webhooks`)
- `https://hermes-agent.nousresearch.com/docs/user-guide/webhooks` — 404
- `https://hermes-agent.nousresearch.com/docs/reference/webhooks` — 404
- `https://hermes-agent.nousresearch.com/docs/user-guide/features/checkpoints` — 404 (correct page: `/docs/user-guide/checkpoints-and-rollback`)
- `https://hermes-agent.nousresearch.com/docs/user-guide/features/rollback` — 404
- `https://hermes-agent.nousresearch.com/docs/user-guide/features/profiles` — 404 (correct page: `/docs/user-guide/profiles`)
- `https://hermes-agent.nousresearch.com/docs/user-guide/features/multi-profile` — 404
- `https://hermes-agent.nousresearch.com/docs/user-guide/features/profile-management` — 404
- `https://hermes-agent.nousresearch.com/docs/user-guide/features/projects` — 404
- `https://hermes-agent.nousresearch.com/docs/user-guide/projects` — 404 (no dedicated page exists anywhere for `hermes project`, per CLI reference cross-check)
- `https://hermes-agent.nousresearch.com/docs/user-guide/features/insights` — 404
- `https://hermes-agent.nousresearch.com/docs/user-guide/features/analytics` — 404 (no dedicated page exists anywhere for `hermes insights`; covered only as the Dashboard's Analytics tab)

Confirmed to exist (for reference, all successfully fetched in this pass): `/docs/user-stories`, `/docs/user-guide/features/tool-gateway`, `/docs/user-guide/features/web-dashboard`, `/docs/user-guide/features/memory-providers`, `/docs/user-guide/features/plugins`, `/docs/user-guide/features/browser`, `/docs/user-guide/features/acp`, `/docs/user-guide/features/api-server`, `/docs/getting-started/platform-support`, `/docs/user-guide/messaging/telegram`, `/docs/reference/skills-catalog`, `/docs/reference/optional-skills-catalog`, `/docs/user-guide/features/kanban`, `/docs/user-guide/features/mixture-of-agents`, `/docs/user-guide/features/hooks`, `/docs/user-guide/checkpoints-and-rollback`, `/docs/user-guide/messaging/webhooks`, `/docs/user-guide/desktop`, `/docs/user-guide/profiles`.
