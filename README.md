# The Hermes Guide

> **Unofficial community project.** Not affiliated with, endorsed by, or connected to Nous Research. "Hermes Agent" is their work; this is an independent guide to using it.

An interactive learning platform for [Hermes Agent](https://github.com/NousResearch/hermes-agent) — the open-source, self-improving AI agent. It teaches the full surface of the tool, from first install to running self-improving multi-agent systems, and adapts what it shows you to what you already know.

**Status:** in active development. This README is a skeleton and will carry the live URL, a recorded walkthrough, and the architecture diagram before launch.

---

## What makes it different from the docs

The [official documentation](https://hermes-agent.nousresearch.com/docs) is reference material and doesn't need a competitor. This is the other thing: an ordered, opinionated path with a point of view about what matters and in what order.

- **Adaptive curriculum.** A short assessment places you on one of three tracks — Newcomer, Operator, Architect — and lessons show the depth that fits, without hiding anything you'd rather read anyway.
- **Simulated sessions.** Scrubable replays of real Hermes sessions, so you can watch the agent write a skill for itself, recall something from three weeks ago, or fan work out to subagents — before you've installed anything.
- **Systems made visible.** The three memory layers, the skill lifecycle, and multi-agent orchestration as animated diagrams rather than prose.

## Repo map

| Path | What's in it |
|---|---|
| `content/` | The curriculum — MDX lessons, glossary, cheatsheets, and simulation scripts |
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

Built by Théo Gandolphe. The [about page](#) documents how it was made, including the multi-agent process behind it.
