# Primary-source verification against an installed binary

**Captured 2026-07-25 from a real Hermes install on macOS.** This is the only file
in the corpus taken from the software itself rather than from documentation, so where
it disagrees with `[01]`–`[07]`, it wins.

Method: read-only introspection commands (`version`, `--help`, `<command> --help`).
No session was run, nothing was configured, and `hermes dump` was deliberately **not
captured** — it prints a setup summary that can include credential material.

---

## 1. Version — verbatim

```
Hermes Agent v0.19.0 (2026.7.20) · upstream 760112ad
Install directory: /Users/<user>/.hermes/hermes-agent
Install method: git
Python: 3.11.15
OpenAI SDK: 2.24.0
Up to date
```

Confirms `v0.19.0`, tag `2026.7.20`, which the guide already claimed from the GitHub
releases API. **This is a better source than the documentation's own `hermes dump`
block**, which prints `version: 0.8.0 (2026.4.8)` — fifteen releases stale. Lesson
`01/04` should cite this alongside it.

Note the format differs from the docs' `dump` output: a single headline line with a
`·`-separated upstream commit, then five labelled fields. Nothing in `[05]` records
this shape.

## 2. The real CLI surface

`hermes --help` lists **69 subcommands**. Verbatim one-line descriptions captured for
each; the full list, in the binary's own order:

`chat · model · moa · fallback · secrets · egress · migrate · gateway · proxy · lsp ·
setup · whatsapp · whatsapp-cloud · slack · send · login · logout · auth · status ·
cron · webhook · portal · kanban · project · hooks · doctor · security · dump · debug
· backup · checkpoints · import · config · skin · console · pairing · skills ·
bundles · plugins · curator · pets · journey · memory · tools · computer-use · mcp ·
sessions · insights · claw · version · update · uninstall · acp · profile ·
completion · dashboard · serve · desktop · gui · logs · prompt-size`

### 2.1 The drift claim is confirmed

There is **no `daemon` subcommand**. Invoking `hermes daemon` prints the usage block
and fails. The third-party guide publishing `hermes daemon start` (`[05]` §8.5) is
therefore wrong against the shipped binary, not merely undocumented — which upgrades
lesson `01/04`'s `Revised` device from "absent from the docs" to "absent from the
software." The real family is `hermes gateway`.

### 2.2 Aliases the docs do not record

- `journey` is aliased to **`learning`** and **`memory-graph`** — three names, one
  command. `[02]` §14 lists none of them.
- `desktop` is aliased to **`gui`**.

---

## 3. `hermes journey` — a curriculum gap

**Not present anywhere in `research/curriculum-map.md`.** This is the most
consequential finding, because the command is about precisely what the guide is about.

Verbatim description:

> A terminal rendition of the desktop Star Map / Memory Graph: a timeline bar chart of
> learned skills and memories over time (oldest at top, newest at bottom) plus a
> playable constellation scrubber. Mirrors the TUI `/journey` overlay and the desktop
> panel.

Options: `--reveal 0..1` (render the timeline built up to a point), `--play` (animate
the build-up, `--fps` default 12), `--width`, `--height`, `--no-color`, `--json`.
Subcommands: `list`, `delete`, `edit` (edit a learned skill or memory by node id in
`$EDITOR`).

Why this matters to the curriculum, beyond being undocumented:

1. It is a **first-party visualisation of the learning loop over time** — the single
   thing this guide claims is Hermes's differentiator. Module 6 currently teaches the
   loop entirely through file contents and code paths.
2. `--reveal` and `--play` mean Hermes ships its own scrubber over its own history.
   That is a direct precedent for this guide's replay player, and worth citing rather
   than inventing around.
3. `journey delete` and `journey edit` are **write operations on learned skills and
   memories** — a governance-relevant control surface (module 10) that the corpus
   does not mention. A reviewer asking "can a human correct what the agent learned?"
   now has a concrete answer.
4. `--json` makes the timeline machine-readable, which is an audit affordance.

**Action:** module 6 needs a lesson or a substantial section on `journey`, and module
10's auditability lesson should cite `journey --json` and the edit/delete path.

## 4. `hermes curator` — richer than documented

`[07]` describes the curator's behaviour from source. The binary exposes far more
surface than the corpus records: `status · usage · run · pause · resume · pin · unpin
· restore · list-archived · archive · prune · backup · rollback`.

Verbatim description:

> The curator is an auxiliary-model background task that periodically reviews
> agent-created skills, prunes stale ones, consolidates overlaps, and archives
> obsolete skills. Bundled and hub-installed skills are never touched. Archives are
> recoverable; auto-deletion never happens.

Three claims here are load-bearing and were **not** in the corpus in this form:

- **"Bundled and hub-installed skills are never touched."** A scoping guarantee.
- **"Archives are recoverable; auto-deletion never happens."** A safety guarantee, and
  the strongest single reassurance about the self-improvement loop in the whole
  product. Module 6's lesson `08-keeping-it-from-getting-worse` should lead with it.
- `curator usage` reports telemetry for **all** skills "with provenance" — built-in,
  hub, and agent-created distinguished. That is an audit surface.

`backup` and `rollback` also mean the skill library is versioned, which module 6 does
not currently claim.

---

## 5. Facts uncertain / not captured

- `hermes dump` — skipped deliberately; may contain credential material.
- No session was run, so nothing here upgrades SIM-1 (first run) or SIM-4 (skill
  creation). Those still have no captured output and remain reconstructions.
- Per-subcommand help was read for `journey` and `curator` only. The other 67 remain
  documented only from `[01]`–`[07]`.
- `pets` exists as a real subcommand, confirming the map's decision to exclude it as
  cosmetic — but it is a shipped command, so the exclusion is a judgement rather than
  an absence.
