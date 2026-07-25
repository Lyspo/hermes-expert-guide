# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three audiences, deliberately served as three parallel tracks rather than three depth levels — the same material framed for genuinely different jobs.

**The capable non-engineer** (Newcomer track). Consultants, analysts, product managers, operations people. Comfortable in a terminal when given exact commands; does not write software daily. Arrives having heard that an agent can run their recurring work and wants to know whether that is true and where to start. Reads on a laptop, often in evenings or between meetings.

**The working engineer** (Operator track). Evaluating Hermes as infrastructure they would actually deploy. Wants the mechanical model — what runs where, what persists, what it costs, what breaks — and skips anything that reads as marketing. Will judge the whole guide by whether one command block is wrong.

**The governance and risk professional** (Architect track). Must decide whether an autonomous, self-modifying agent can be permitted inside an organisation, under what controls, with what audit trail. Needs the authorization chain, the isolation backends, the blast radius, and the honest failure cases — including the ones the vendor's documentation does not lead with.

Secondary audience, always present and never addressed directly: hiring managers and technical interviewers evaluating the author. They read the same pages as everyone else; the work has to hold up as a work sample without ever announcing that it is one.

## Product Purpose

Teach a practitioner to use Hermes Agent well — from first install to running scheduled, self-improving, multi-agent systems — through an ordered curriculum that adapts to what they already know.

Success is a reader who finishes able to do three things they could not do before: deploy Hermes for real work of their own; explain its memory, skill, and delegation mechanics accurately to someone else; and make a defensible judgement about where it should and should not be trusted. The secondary success condition is that finishing feels like acquiring a nameable skill worth listing, not like having read a website.

Failure modes worth naming: a reader who leaves with enthusiasm but no working install; a reader who repeats a claim from the guide that turns out to be wrong; a reader who finds the interface impressive and the content thin.

## Positioning

The official documentation is reference material: complete, alphabetical, and silent on sequence. This is the other thing — the path. It has a point of view about what matters, in what order, and what to ignore until later, and it makes the agent's internal systems observable rather than described.

Two mechanisms a neighbouring guide could not truthfully copy:

**Sourced to the mechanism, not the marketing.** Every claim traces to a cited source in `research/`, and the research already contradicts the popular secondary summaries — Hermes's memory is two capped markdown files plus a full-text session index, not the "three-layer memory system" repeated across blog posts; multi-agent orchestration arrived with the Kanban board in v0.13.0, not in v0.6.0 as widely stated. Correcting the record *is* the differentiator, and it only exists because the research pass was real.

**The agent's interior made watchable.** Recorded sessions replay with a scrubber, so the reader can stop on the exact moment the agent writes a skill file for itself, inspect what it wrote, and step forward. Static documentation cannot show a loop closing; a live playground could, but only after the reader has installed something and surrendered an API key.

## Operating Context

Readers arrive from three places: a search for how to learn Hermes, a link shared in a community channel, or the author's portfolio. Most arrive without an install and read before deciding. A meaningful minority read on a phone with no terminal nearby, which means the guide must be worth reading before it is worth following.

The subject matter's own materials — the things the reader will actually touch — are: a terminal running the `hermes` TUI; `~/.hermes/` and its files (`config.yaml`, `SOUL.md`, `MEMORY.md`, `USER.md`, `skills/`, `cron/jobs.json`, `state.db`); `SKILL.md` files following the agentskills.io specification; YAML configuration; a messaging app where the agent answers; a Kanban board where agent work becomes cards; and log files. These are the reader's world, and the design should be legible to someone who lives in it.

Reading happens in sessions of ten to thirty minutes, often interrupted. Progress must be recoverable.

## Capabilities and Constraints

**Is:** a statically-exported website. No accounts, no backend, no database, no telemetry. Personalization (track, progress) lives only in the reader's browser and never leaves it. The full curriculum is server-rendered and readable without JavaScript, and indexed in its entirety by search engines.

**Includes:** an adaptive curriculum across the Hermes surface; an onboarding assessment that assigns a track; scrubable replays of recorded sessions; animated diagrams of the memory, skill, and delegation systems; a glossary; printable cheatsheets; full-text search; and a colophon documenting how the project was built.

**Excludes, deliberately:** any execution of Hermes in the browser; any playground requiring the reader's API key; user accounts, comments, or submitted content; cross-device sync; any claim of official status.

**Undecided at time of writing:** the site's name; whether the flagship recorded sessions are captured from a real install (the author intends to install Hermes later in the build, at which point reconstructed replays get re-recorded) or remain reconstructed from documented output formats. Until re-recorded, every replay states its own fidelity.

**Content constraint that binds everything:** Hermes ships roughly every one to two weeks (22 releases between March and July 2026). Lessons carry the version they were verified against, commands carry provenance, and the guide is expected to be wrong eventually — the architecture's job is to make wrongness visible and localised rather than invisible and diffuse.

## Brand Commitments

- The site is unofficial and unaffiliated with Nous Research; this is stated on every page, not buried in a footer once. "Hermes Agent" is used nominatively only.
- Full author attribution: name, GitHub (`github.com/Lyspo`), LinkedIn, and personal site, plus a colophon documenting the build process including its use of multiple AI agents.
- English only.
- The visual identity must never evoke Hermès, the luxury house. Any classical reference is drawn as geometry and inscription, not as luxury signalling.
- Code MIT; written content CC BY 4.0.

## Evidence on Hand

**Real and cited** (in `research/`, ~2,700 lines across seven documents): the complete official documentation surface, captured page by page with URLs — memory, skills, MCP, voice, personality, context files, security, the messaging gateway and its 20+ platforms, cron, delegation, architecture, the full CLI command surface, FAQ. Repository facts verified through the GitHub API rather than search summaries: 220,015 stars, MIT, 22 tagged releases from v0.2.0 (2026-03-12) to v0.19.0 (2026-07-20). One complete real bundled `SKILL.md`. Verbatim terminal formats: status bar, tool-call feed, memory injection format, the full-memory error payload.

**Real and cautionary:** documented CVEs, a GitHub data-loss issue, and a reported post-exploitation incident inside a government network where an attacker ran Hermes with approvals disabled. This is the most concrete real-world material found and belongs in the security curriculum.

**Explicitly absent, must not be invented:** no asciinema recording or session GIF exists anywhere; the launch banner's ASCII art is unknown (the docs use an image); the live subagent tree view and the rendered appearance of chat bubbles are described but not captured; Nous Portal pricing is search-sourced only and unverified. No user numbers, testimonials, endorsements, or completion statistics exist for this guide — it has no readers yet, and none may be implied.

## Product Principles

1. **Sourced or unwritten.** A sentence without a traceable source does not ship. Where sources conflict, the guide says so and shows both.
2. **Sequence is the product.** Anyone can list features. The value is in the order, and in saying plainly what to skip.
3. **Show the mechanism, then name it.** The reader should watch a loop close before being handed vocabulary for it.
4. **Complete without JavaScript, better with it.** Personalization and motion are enhancements to a document that is already whole.
5. **Honest about the agent, including where it is dangerous.** A guide that only sells the capability is not usable by the audience that has to govern it.

## Accessibility & Inclusion

WCAG 2.1 AA as a build gate, not an audit afterthought: automated checks run per template against the exported site. Specific commitments the content type demands — recorded session replays ship as complete semantic transcripts that a screen reader can read straight through, with playback as an enhancement; every animation has a defined static end state honouring `prefers-reduced-motion` plus an in-site motion preference; diagrams carry real text and accessible descriptions rather than being images of words; and terminal content, being the subject matter, must remain legible at 200% zoom and meet contrast requirements in the dark palette the subject implies.
