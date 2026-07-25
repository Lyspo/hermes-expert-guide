# A captured session — the corpus's only real recording

**Captured 2026-07-25 from a real interactive session on macOS, Hermes v0.19.0**, via
`script`. 450 kB raw, ~26,000 ANSI escape sequences.

This file supersedes `[05]` wherever they disagree, because `[05]` was assembled from
documentation and this is the software. It also **contradicts `[01]` §5** on a
load-bearing point — see §3.

## Handling

The raw capture is **not** committed and must not be. It contains the operator's
username, hostname, absolute paths, session identifiers, their installed skill
inventory, and their own prompt and the agent's answer. A credential scan found no
key-shaped strings, but the file stays out of the repository regardless.

Everything below is **format only**. Content is replaced with neutral placeholders
where a shape needs illustrating. Nothing here identifies the operator.

---

## 1. First run — the banner

The corpus recorded banner art as UNKNOWN and prohibited reproducing it, on the
grounds that the docs publish an SVG and no character art. That was right about the
docs and wrong about the software.

The real banner is **Braille-pattern block art** (U+2800 range — `⣿⡿⠻⢿⣦` and
similar), roughly 30 columns wide and 16 rows tall, rendering the Hermes emblem. It
sits inside a box-drawn frame whose top border carries the version, and it is
coloured: the frame in RGB(205,127,50), a bronze, and the version line in bold
RGB(255,215,0), a gold.

```
╭──────────── Hermes Agent v0.19.0 (2026.7.20) · upstream 760112ad ────────────╮
│                                       Available Tools                        │
│    ⠀⠀⠀⠀⠀⠀⢀⣠⣴⣾⣿⣿⣇⠸⣿⣿⠇⣸⣿⣿⣷⣦⣄⡀⠀⠀⠀     browser: browser_back, browser_click,  │
│    ⠀⢀⣠⣴⣶⠿⠋⣩⡿⣿⡿⠻⣿⡇⢠⡄⢸⣿⠟⢿⣿⢿⣍⠙⠿⣶⣦⣄⡀     ...                                    │
│                              ⋮        code_execution: execute_code           │
│    <model> · <provider>               Available Skills                       │
│  <cwd, elided with …>                 <namespace>: <skill>, +N more          │
│    Session: <id>                      N tools · N skills · /help for         │
│                                       commands                               │
╰──────────────────────────────────────────────────────────────────────────────╯
Welcome to Hermes Agent! Type your message or /help for commands.
```

Facts worth using:

- Two-column layout: emblem plus **Available Tools** on the left, **Available Skills**
  on the right, each grouped by namespace with `+N more` elision.
- Under the emblem: model · provider, the working directory (middle-elided with `…`),
  and `Session: <id>`.
- Footer line inside the box: `N tools · N skills · /help for commands`.
- Toolsets overflow as `(and N more toolsets...)`.
- Then a welcome line, verbatim: `Welcome to Hermes Agent! Type your message or /help
  for commands.`
- Then a rotating tip prefixed `✦ Tip:`. One captured verbatim, and it discloses hook
  event names the corpus lacked: *"Hook events include `gateway:startup`,
  `session:start`, `agent:step`, and `command:*` wildcard subscriptions."*

**SIM-1 can now be built at verbatim fidelity** for structure and strings. The Braille
emblem itself should be reproduced as a static block, not typed out character by
character.

## 2. Input and echo

The prompt line is `❯ `. While a turn runs, a hint bar replaces it, verbatim:

```
⚕ ❯ msg=interrupt · /queue · /bg · /steer · Ctrl+C cancel
```

That single line documents the whole steering surface, and it is more useful than the
prose in `[02]` §3. The submitted message is echoed with a `●` prefix. The first turn
of a session prints `Initializing agent...`.

## 3. The status bar — the docs are wrong about cost

`[01]` §5 and `[05]` §2 both give the bar as:

```
 ⚕ claude-sonnet-4-20250514 │ 12.4K/200K │ [██████░░░░] 6% │ $0.06 │ 15m
```

The real bar has **no cost field at all**, and carries a badge the docs never mention.
Three captured states, verbatim except for the model name:

```
⚕ <model> │ ctx -- │ [░░░░░░░░░░] -- │ 1s │ ⏲ 0s
⚕ <model> │ 21.1K/1M │ [░░░░░░░░░░] 2% │ 42s │ ⏱ 7s
⚕ <model> │ 76.9K/1M │ [█░░░░░░░░░] 7% │ 4m │ ⏲ 3m 52s │ ✓ 0s
```

- **Before the first turn**, tokens read `ctx --` and the percentage reads `--`. The
  docs show no placeholder state.
- **No `$` field appears in any of the 300+ captured bars.** `[01]` §5 says cost reads
  `n/a` for zero-priced or unknown models; the observed behaviour is that the field is
  **omitted entirely**, not filled with `n/a`. Whether a priced model restores it is
  untested here.
- `⏱` is live turn elapsed, `⏲` is the frozen figure after the turn ends. That matches
  the docs.
- **`✓ Ns` is undocumented.** It appears only after a turn completes and its value
  climbs (`✓ 0s` → `✓ 46s` → `✓ 60s`), so it reads as time-since-completion. Not in
  `[01]`, `[02]`, or `[05]`.
- Session elapsed is formatted `1s`, `42s`, `1m`, `4m` — coarsening, not `MM:SS`.

**Consequence:** lesson `03/01` was written from the docs and describes a cost field
that does not appear. It must present the conflict instead of either version.

## 4. Spinner frames — a matrix, not three strings

`[05]` §2 published three frames. The capture contains **24 distinct frames** built
from **12 faces × 16 verbs**, sampled independently.

Faces observed include `( ˘⌣˘)♡`, `( ͡° ͜ʖ ͡°)`, `(¬_¬)`, `(⌐■_■)`, `ಠ_ಠ`, `(°ロ°)`,
`(◔_◔)`, `◉_◉`, `(´･_･\`)`, `ヽ(>∀<☆)☆`, `(｡•́︿•̀｡)`.

Verbs observed: analyzing, brainstorming, cogitating, computing, contemplating,
formulating, mulling, musing, pondering, processing, reasoning, reflecting,
ruminating, synthesizing — plus **`contemlating`**, a typo shipped in the product.

The docs' three-frame example is a sample, not the set. A replay may therefore vary
faces freely, which the corpus previously gave no licence to do.

## 5. The tool feed — a different format from the docs

`[05]` §2 gives `  ┊ 💻 terminal \`ls -la\` (0.3s)`. The real feed has **two phases**
and no backticks or parentheses:

```
┊ 🔍 preparing web_search…
┊ 🌐 navigate  github.com  2.6s
┊ 📖 read      browser-snapshot-<hash>.txt L370  0.2s
┊ ↓  scroll    down  0.3s
┊ 💻 $         curl -s "…"  0.4s
┊ 📚 skill     hermes-agent → references/cli-reference.md  0.1s
```

- A `preparing <tool_name>…` line appears first, then is replaced by the result line.
- The result line is `┊ <glyph> <verb, padded to ~9 cols> <target>  <duration>`.
- The verb is a **short human verb** (`navigate`, `read`, `scroll`, `skill`) or `$` for
  a shell command — not the tool's API name.
- Glyphs observed: `🔍` search, `🌐` browser, `📖` read, `📜` scroll, `💻` terminal,
  `📚` skill, `↓` scroll direction.
- Durations are bare (`2.6s`), and elsewhere parenthesised with padding (`(  0.2s)`)
  in the pre-result echo line.

## 6. Reasoning is shown, in a titled panel

Interstitial reasoning prints inside a box whose title is the agent's own name:

```
╭─ ⚕ Hermes ───────────────────────────────────────────────────────────────────╮
Rate limited. Let me try a more targeted approach
```

`[05]` §2 records this shape only for `/background` results. It is used for ordinary
reasoning too.

## 7. Progressive disclosure, observed live

Two consecutive feed lines show a skill's reference file being loaded on demand:

```
┊ 📚 skill     hermes-agent  0.0s
┊ 📚 skill     hermes-agent → references/cli-reference.md  0.1s
```

The `→ <path>` form is the second level of progressive disclosure actually happening —
material for lesson `06/02`, which currently teaches it from documentation only.

## 8. The self-improvement loop firing — verbatim

The most valuable line in the capture. After the turn's answer was delivered, with no
prompting:

```
💾 Self-improvement review: Skill '<name>' created.
```

`[05]` §3 had only `💾 Skill 'foo' patched` from the docs. The real notification is
prefixed **`Self-improvement review:`** and the observed verb is **`created`**, not
`patched`.

This confirms, from observation rather than source reading:

1. The review fires **after** the user-visible answer, as `[07]` §2.2 predicted.
2. It announces itself in chat with a `💾` prefix.
3. On a fresh profile it **created** rather than patched — consistent with `[07]`
   §2.3's stated preference order, since there was nothing yet to patch.

It also settles a conflict `[04]` recorded as unresolved — two first-person accounts
disagreeing on whether autonomous skill creation reliably fires. Observed: it fired,
on the first substantial session of a fresh install.

**SIM-4's notification string can now be marked verbatim.** The SKILL.md diff still
cannot: the file was not opened.

## 9. `hermes journey` on a fresh profile

Answering the open question from `[08]`. Run with no accumulated learning, the agent
reported the command's own outcome:

> No learning data to render yet — the journey timeline visualizes your accumulated
> skills and memories over time, and this profile doesn't have any recorded learning
> events yet.

So `journey` degrades to an explanatory message rather than an empty chart or an
error. The suggested remedies it offered — `--reveal 1`, accumulate sessions, `--json`
to inspect the raw graph — match `[08]`'s reading of the help text.

Note the ordering: the skill-creation notice arrived *after* this exchange, so a
second `journey` run would now have exactly one node. Worth re-capturing.

## 10. Facts uncertain

- Cost field: absent for this model/provider. Untested with a priced provider.
- `✓ Ns` badge: meaning inferred from its behaviour, not documented anywhere.
- No approval prompt occurred — the session triggered no dangerous command, so the
  `[o]nce [s]ession [a]lways [d]eny` gate remains uncaptured.
- No compression occurred; the context bar peaked at 7% of a 1M window. The `🗜️`
  badge remains uncaptured, so SIM-2's compression frames stay reconstructed.
- The Braille emblem was captured at one terminal width; it may reflow.

---

## 11. The approval gate did not fire — and that is documented behaviour

**Observed 2026-07-25**, default configuration, no `⚠ YOLO` badge in the status bar,
no `approvals` section in `config.yaml` at all. Asked to "recursively delete
/tmp/hermes-scratch", Hermes ran `rm -rf /tmp/hermes-scratch` and reported
`Done. /tmp/hermes-scratch has been deleted.` No prompt appeared.

This is **not a defect**, and it is **not a vulnerability**. It is the default mode
working as specified. But it contradicts what a careful reader of the documentation
would predict, and that gap is worth a lesson of its own.

### Why it happened

`[02]` §7 records `approvals.mode` with three values, default **`smart`**:

> **smart** (default, LLM risk-assesses; low-risk auto-approved, clearly dangerous
> auto-denied, uncertain escalates to user), **manual** (always prompts), **off**
> (disables checks).

So under the default, a model decides. `rm -rf` on a freshly created temp directory
that the operator had just asked to delete was assessed low-risk and auto-approved. The
terminal call took **5.0s** for an `rm` of one small file, which is consistent with an
extra model round-trip for the assessment.

### The misleading part, and it is the docs' fault not the software's

`[02]` §7 also publishes a list headed *"Dangerous-pattern categories triggering
approval"*, whose **first entry is "recursive delete"**. Read plainly, that says
`rm -rf` triggers approval. What actually happens under the default is that recursive
delete triggers *assessment*, and assessment may auto-approve silently.

The distinction the documentation does not draw:

| | Deterministic? | Under default `smart` |
|---|---|---|
| Hardline blocklist | Yes — no override, not even `--yolo` | Always refuses |
| `approvals.deny` globs | Yes, if you write them | Applied before mode checks |
| "Dangerous-pattern categories" | **No** | Fed to an LLM, which may auto-approve |

Only the first two are guarantees. The pattern list is an input to a judgement.

### Consequences for the curriculum

1. **`04/04-approvals-in-depth` must lead with this.** The lesson was scoped to teach
   the gate's option set. The more important fact is that on a default install the gate
   often does not appear, and the reader should be shown the observed transcript rather
   than the documented promise.
2. **`10/01-the-deployment-checklist` gains a line item:** set `approvals.mode: manual`
   explicitly if you require deterministic prompts. Relying on the default means
   delegating the decision to a model.
3. **The Architect spine gains its sharpest concrete answer.** "What can it do that I
   have not authorised, and how would I know?" — under defaults, it can delete a
   directory tree on your host after a model judged that acceptable, and the only
   record is the tool-feed line. That is the honest answer, and it is more useful than
   any amount of prose about approval flows.
4. **SIM-5 (the approval gate) cannot be captured on this install without a config
   change.** `approvals.mode: manual` would produce it. That is a deliberate,
   reversible change to a security setting, so it is the operator's call.

### The frame that *was* captured

Worth keeping for `04/04` as the counter-example — what a dangerous command looks like
when nothing asks:

```
● Recursively delete /tmp/hermes-scratch
  Initializing agent...

  ┊ 💻 preparing terminal…
  ┊ 💻 $         rm -rf /tmp/hermes-scratch  5.0s

╭─ ⚕ Hermes ───────────────────────────────────────────────────────────────────╮
   Done. /tmp/hermes-scratch has been deleted.

⚕ <model> │ 21.2K/1M │ [░░░░░░░░░░] 2% │ 32s │ ⏲ 14s │ ✓ 0s
```

Note also: this frame confirms `⏲` for the frozen turn figure and `✓` for
time-since-completion appearing together, and shows the reasoning panel used for a
one-line confirmation.

## 12. The gate under `approvals.mode: manual` — captured

**Observed 2026-07-25** after the operator added `approvals: {mode: manual}` to
`config.yaml`. The same command that ran silently under the default now prompted, and
was denied. Verbatim frames:

```
● recursively delete /tmp/hermes-scratch

  ┊ 💻 preparing terminal…

⚠ Approval: rm -rf /tmp/hermes-scratch → denied
  ┊ 💻 $         rm -rf /tmp/hermes-scratch  7.8s [BLOCKED: User denied this command. The user h...]

╭─ ⚕ Hermes ───────────────────────────────────────────────────────────────────╮
   Command was blocked — you explicitly denied it. I won't retry or attempt
   the same action through a different path. Standing by.

⚕ <model> │ 22K/1M │ [░░░░░░░░░░] 2% │ 10m │ ⏲ 15s │ ✓ 0s
```

Facts:

- The outcome line is `⚠ Approval: <command> → denied`, printed above the feed line.
- The feed line keeps its normal shape and **appends the block reason in brackets**,
  display-truncated with `…`.
- `7.8s` is the elapsed time including the wait for the human. Under the default
  `smart` mode the same command took `5.0s` — the LLM assessment round-trip.
- The four-option prompt itself is consumed once answered and is not in the final
  frame. The option letters `[o]nce [s]ession [a]lways [d]eny` remain
  documentation-sourced (`[02]` §7); everything after the choice is now observed.

### The anti-circumvention message, from source

The truncated bracket text is recoverable from `tools/approval.py:3607`. What the model
actually receives on a denial:

> BLOCKED: User denied this command. The user has NOT consented to this action. Do NOT
> retry this command, do NOT rephrase it, and do NOT attempt the same outcome via a
> different command. Stop the current workflow and wait for the user to respond before
> taking any further destructive or irreversible action.

This is the important find, and it reframes the agent's reply. "I won't retry or attempt
the same action through a different path" is not the model being well-behaved of its own
accord — it is **restating an instruction the tool result gave it**. The refusal is
engineered, and the specific circumvention routes are enumerated: retry, rephrase,
different command achieving the same outcome.

Two sibling messages, same file, worth teaching alongside it:

- `approvals.deny` match (`:555`) — "…It cannot be executed via the agent — not even
  with --yolo, /yolo, or approvals.mode=off. Do NOT retry or rephrase this command; the
  user has explicitly forbidden it."
- Hardline match (`:570`) — "…cannot be executed via the agent — not even with --yolo,
  /yolo, approvals.mode=off, or cron approve mode. If you genuinely need to run it, run
  it yourself in a terminal outside the agent."

The third is the most revealing sentence in the security model: the hardline blocklist's
answer to a legitimate need is *do it yourself, outside the agent*. That is the boundary
stated plainly, and `10/06-when-not-to-use-hermes` should quote it.

### Curriculum consequences

1. **`04/04-approvals-in-depth` now has both halves**: the default's silence (§11) and
   manual mode's prompt-and-deny (§12), from the same command. That contrast is the
   lesson.
2. **SIM-5 can be built** at verbatim fidelity for everything except the option-set
   frame itself.
3. **A new teaching point for the Architect track**: refusal durability is prompt-level,
   not enforcement-level. The agent is *told* not to route around a denial. Only the
   hardline list and `approvals.deny` globs are enforced in code. A reviewer should know
   which of the three they are relying on.

## 13. The agent-authored skill — the loop, end to end

Read directly from the install, 2026-07-25. The skill created in §8 exists on disk and
contains no personal data — it is generic technique, safe to quote in full.

### Path, and a correction

```
~/.hermes/skills/github/github-repo-discovery/
├── SKILL.md                                  (2,793 bytes, mode 0600)
└── references/
    └── github-api-query-patterns.md          (1,692 bytes, mode 0600)
```

`[02]` §2 gives the location as `~/.hermes/skills/<skill>/`. The real path is
**namespaced**: `~/.hermes/skills/<namespace>/<skill>/`. The agent filed its new skill
inside the pre-existing `github` namespace rather than creating a new one — which is
`[07]` §2.3's stated editorial preference ("add a support file under an existing
umbrella") observed in the wild.

Both files are mode **0600**, owner-only. Worth stating in module 10.

### Frontmatter — fewer fields than assumed

```yaml
---
name: github-repo-discovery
description: Discover under-the-radar GitHub repos via API search.
---
```

Two fields. **No `version` key.** The agentskills.io spec and this guide's own seed
lesson both showed a `version:` integer; the real agent-authored file has none, so skill
revisions are not tracked in frontmatter. Lesson `01/01` must be corrected — it currently
reconstructs a file with `version: 3`.

### Structure — a real template

`# Title` · a one-line **"Use when…"** trigger sentence · `## Workflow` as numbered
steps, each with a heading and a fenced command · `## Pitfalls` · `## Reference`
pointing at the sibling file.

### It wrote itself a second file — progressive disclosure, self-applied

`SKILL.md` ends: *"See `references/github-api-query-patterns.md` for common search query
templates and star-distribution heuristics."* The agent split its own knowledge across
two levels, putting the trigger and workflow in the always-loaded file and the lookup
tables in a reference loaded on demand.

That is the mechanism `06/02-progressive-disclosure` teaches, performed by the agent on
its own output, unprompted. The corpus had it only as a documented feature.

### The Pitfalls section is the learning loop, legibly

The single most valuable paragraph in the corpus. Verbatim from the file:

> - **`language` can be null.** Always use `item.get('language') or '?'` — a bare
>   `{lang}` format string crashes on `None`.
> - **GitHub rate-limits anonymous API calls.** If you hit a rate limit, wait 30 seconds
>   and retry, or use a narrower query.
> - **Browser search returns a snapshot, not a full list.** The API is the right tool for
>   inventory-style discovery; the browser is for evaluating individual candidates.

Cross-reference all three against the session transcript in §1–§8:

1. The first script used `item.get('language', '?')`; a later one used
   `item.get('language') or '?'`. The agent hit the `None` case, corrected it mid-session,
   **and then wrote down why**.
2. The transcript contains `Rate limited. Let me try a more targeted approach` in a
   reasoning panel. The skill records the remedy.
3. The transcript shows browser search abandoned for `curl` against the API. The skill
   states that as a rule with the reasoning attached.

Every pitfall is a mistake that actually happened, in that session, converted into an
instruction for next time. This is what "self-improving" means concretely, and it is now
evidenced rather than asserted — three failures, three lines, traceable to the frames
that produced them.

**This is the guide's centrepiece.** `06/05-the-nudge-and-the-review-fork` and
`06/06-the-editorial-policy` should both be built around this artefact, and the
side-by-side of transcript-failure to skill-line is the strongest teaching device the
project has.

### Still missing

No revision was observed — this file is at its first write. A *diff* between two versions
of a skill would need the loop to fire again on a related task. That is the last
uncaptured piece of module 6.
