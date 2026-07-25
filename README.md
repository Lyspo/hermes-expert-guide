# Protocol

**Deep, sourced, adaptive courses in the agents worth learning properly.**

**[hermes-expert-guide.vercel.app](https://hermes-expert-guide.vercel.app)**

First course: **The Hermes Guide** — [Hermes Agent](https://github.com/NousResearch/hermes-agent), the open-source self-improving AI agent from Nous Research. From first install to running scheduled, self-revising, multi-agent systems, adapting what it shows you to what you already know.

> **Unofficial community project.** Not affiliated with, endorsed by, or connected to Nous Research. "Hermes Agent" is their work; this is an independent guide to using it.

**Status:** in active development. The curriculum is being written; the design world is specified in `design.md` and partially built. This README will carry a recorded walkthrough and an architecture diagram before launch.

---

## What makes it different from the docs

The [official documentation](https://hermes-agent.nousresearch.com/docs) is reference material and doesn't need a competitor. This is the other thing: an ordered, opinionated path with a point of view about what matters and in what order.

- **Adaptive curriculum.** A short assessment places you on one of three tracks — Newcomer, Operator, Architect — and lessons show the depth that fits, without hiding anything you'd rather read anyway.
- **Simulated sessions.** Scrubable replays of real Hermes sessions, so you can watch the agent write a skill for itself, recall something from three weeks ago, or fan work out to subagents — before you've installed anything.
- **Systems made visible.** The memory system, the skill lifecycle, and multi-agent delegation as animated technical plates rather than prose.
- **Sourced, and willing to correct the record.** Every claim traces to a citation in `research/`. Some of them contradict what's widely repeated: Hermes's memory is two capped markdown files plus a full-text session index, not the "three-layer memory system" you'll read elsewhere, and multi-agent orchestration arrived with the Kanban board in v0.13.0, not in v0.6.0.

## Repo map

| Path | What's in it |
|---|---|
| `content/guides/` | One directory per guide — MDX lessons with per-track relevance, plus glossary, cheatsheets, and simulation scripts |
| `research/` | Sourced research corpus every factual claim traces back to |
| `src/` | The Next.js application |
| `design.md` | The design system: tokens, type, motion language, and the anti-slop rules |
| `decisions.md` | Why the project is built the way it is |
| `CLAUDE.md` | Build conventions for contributors and agents |

## Local development

Requires Node 22+ and pnpm 10+.

```bash
pnpm install && pnpm dev
```

Verify everything the way CI does:

```bash
pnpm verify
```

## Licence

Code is MIT. Written content is CC BY 4.0 — take it, teach with it, credit it.

## Author

Built by Théo Gandolphe — [GitHub](https://github.com/Lyspo) · [LinkedIn](https://www.linkedin.com/in/theogandolphe/) · [theogandolphe.com](https://theogandolphe.com/en/).

The [about page](https://hermes-expert-guide.vercel.app/about/) documents how it was made, including the multi-agent process behind it.
