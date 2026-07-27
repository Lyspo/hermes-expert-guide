# Decisions

A running log of the choices that shaped this project, and what each one cost. Newest last.

---

### 001 — Build a learning platform, not documentation

**Decision.** Teach Hermes Agent through a progressive, adaptive curriculum with simulated sessions, rather than mirroring the official docs.

**Why.** Nous Research's own documentation is good reference material and doesn't need a competitor. What doesn't exist is a path: the ordered, opinionated journey from "installed it, now what" to "I run a fleet of agents that improve themselves." Reference answers *what does this flag do*; a curriculum answers *what should I learn next, and why does it matter*.

**Cost.** Every lesson needs sourcing against fast-moving upstream docs. Mitigated by a `hermesVersion` field per lesson, version-provenance chips on every command, and a scheduled CI job that re-checks external links.

---

### 002 — No backend, no accounts

**Decision.** Personalization (knowledge track, progress) lives entirely in `localStorage`. The site is a static export.

**Why.** Three reasons, in order of weight. It's free and permanently maintainable — a portfolio piece that dies when a database bill lapses isn't a portfolio piece. It collects nothing, which is the honest posture for a project whose author works in AI governance. And it forces a more interesting engineering problem: adaptive content that stays fully crawlable and works without JavaScript.

**Cost.** No cross-device progress, no analytics on learning behaviour, no user-generated content. Accepted.

---

### 003 — Track adaptivity via CSS attribute, not conditional rendering

**Decision.** MDX renders every track's variant into the static HTML tagged with `tk-*` classes. An inline script sets `data-track` on `<html>` before first paint; CSS hides the variants that don't apply.

**Why.** The obvious implementation — read the track in a client component and render one branch — produces a flash of wrong content, a hydration mismatch, and a page whose indexed content depends on a default. This approach has none of those failure modes: the server sends one HTML document to everyone, search engines index the union of all tracks, no-JS visitors get the complete content with track labels intact, and switching tracks is a single attribute write with no re-render.

**Cost.** Slightly larger HTML payload (all variants ship), and authors must think in variants rather than branches. Both are cheap; the payload difference is a few kB of compressible text.

---

### 004 — content-collections as a CLI sidecar, not a Next plugin

**Decision.** Content is compiled by the `content-collections` CLI running alongside `next dev` and as a prebuild step, rather than through its Next.js config plugin. Contentlayer, its predecessor, is abandoned.

**Why.** Turbopack is the default builder in Next 16, and bundler-plugin integrations are where that friction shows up. A sidecar produces plain typed modules the bundler doesn't need to know anything about — the pipeline can't be broken by a bundler upgrade. Same reasoning drove generating Open Graph images with a standalone satori script instead of the `opengraph-image.tsx` file convention.

**Cost.** One more process in dev, one more prebuild step. Worth it for a pipeline that can't break under us.

---

### 005 — Motion for components, GSAP for scenes

**Decision.** Motion handles anything coupled to React state; GSAP handles timeline-orchestrated scroll scenes. A lint rule confines GSAP imports to the landing and scroll-scene directories.

**Why.** Both libraries are excellent at different jobs — Motion's declarative model fits component state, GSAP's timelines and ScrollTrigger fit choreographed scenes — and the real risk is shipping both to every page. The lint rule turns a discipline problem into a build error.

**Cost.** Two animation vocabularies to know. Acceptable; the boundary is legible.

---

### 006 — Simulated sessions instead of a live playground

**Decision.** Teach the feel of Hermes through scripted, scrubable replays of real sessions rather than an embedded playground calling a live model.

**Why.** A playground would demand the visitor's API key, which is both a security surface and a barrier at exactly the wrong moment. Replays are deterministic, art-directable, instant, free, and can pause to explain the moment Hermes writes a skill for itself — which live output can't be relied on to do. The trade is honesty, so every recorded session carries its provenance, and the format tracks fidelity explicitly: what's verbatim from a source versus paraphrased.

**Cost.** Not the real thing. Addressed by keeping every real command copy-pasteable inline, so the reader runs Hermes for themselves while reading.

---

### 007 — The laboratory notebook, not the messenger god

**Decision.** The visual world is a bound laboratory notebook and its protocols: paginated, dated, stamped; printed procedures corrected in the margins across successive runs; results tipped in as pasted specimen slips; nothing erased, only struck through and re-entered. System diagrams are exploded axonometric technical plates. Terminal transcripts appear as dark plates pasted into the light page.

**Why.** The obvious direction — Hermes, therefore Greek antiquity, therefore dark ground and engraved capitals — is the literal reading of a product's name, which is the least interesting thing about it. Rendered as a comp it also failed on its own terms: inscribed letters on a stoichedon grid are beautiful at hero scale and unreadable at body scale, and carved stone offers no answer to what a dense lesson page or a scrolling transcript should look like.

The notebook was chosen because it is the only candidate that carries all three of the product's hard parts at once. A protocol corrected in its own margins *is* the agent revising its own skill files. A dated record that only grows *is* its memory. Append-only convention — struck through, never erased — *is* the audit trail the governance audience needs before they will permit an autonomous system anything. The classical reading carried the least of it while looking the most like something.

**Cost.** A light, paper-grounded world is unusual for a technical site and carries a real risk of drifting into the cream-and-serif look that AI-generated interfaces converge on. Mitigated deliberately: the paper token is cool rather than warm, the body face is a Clarendon slab with an official-document lineage rather than a literary serif, and the annotation red may only appear where it means correction. The night mode is an archival negative, not a reading lamp — lamplight being precisely the rendition every model reaches for.

---

### 008 — A platform called Protocol, holding guides

**Decision.** The product is a platform, "Protocol," publishing one guide per subject. The Hermes guide is the first. Content lives at `content/guides/<guide>/<module>/<lesson>.mdx` and serves from `/hermes/…`; module grouping and ordering invariants are keyed per guide.

**Why.** The original framing was a single site about one agent. That is too narrow for where this is going — other agents are worth the same treatment, and a platform can eventually be sold where a single guide cannot. The word earns its place twice over: a protocol is the lab document this design world is built on, written down and revised in the margins and followed exactly, and it is also the term this industry already uses for how agents talk to things.

Doing it now cost a directory move and one keying change. Doing it after sixty lessons exist would have cost a migration.

**Cost.** "Protocol" is a common word, so it confers no exclusivity, and the platform's own identity has to stay quiet enough not to compete with each guide's. Commercial plumbing is deliberately absent: gating requires a backend, which would contradict the zero-cost, zero-data posture, so only the seams are in place — guides as independent units, no architecture that would need tearing out.

---

### 009 — Substrate: depth as the medium, type that rewrites itself

**Decision.** The visual world is a dark, dimensional field in which the agent's interior is actually rendered — clustered nodes and edges at real depth, drifting, displaced by the pointer — with content on a plane above it. Its signature motion is borrowed from a second candidate direction: display type that strikes its own line through and re-enters it, characters resolving in sequence. Dark only, one signal colour, no serif.

**Why.** This replaces the paper-notebook world of decision 007, which was wrong twice over. It fought the subject: a platform teaching autonomous software should not look like stationery. And its palette turned out to sit almost exactly on tasteskill's published list of banned defaults, where cream grounds with brass accents and warm near-black ink are recorded as the second-most-recurring signature of machine-generated design. Avoiding one convergence cluster is not the same as avoiding all of them, and a rule against neon does not license a retreat into paper.

The fusion is not a compromise. A skill library, a memory index and a delegation tree genuinely are graphs, so rendering them in depth is description rather than decoration — the field is what the agent *is*. And an agent that rewrites its own instructions is exactly what self-rewriting display type performs — the type is what it *does*. Nine candidate directions were built as live prototypes before this one was chosen; three were authored directly, three derived by following Impeccable's world-derivation process, three by following tasteskill's dial-driven method.

**Cost.** A committed dark world offers no light theme, because inverting a luminous field destroys the medium rather than translating it; that is stated as a choice and paid for with verified contrast against both surface planes and an honoured `prefers-contrast`. The field is canvas, so it must stay decorative and `aria-hidden`, with every structure it depicts also present as real text. And the whole token layer, page shell and component set were rebuilt — roughly a day, which is the price of having discovered the mistake at forty-three pages rather than four hundred.

**What the previous world contributed.** One idea survived intact and is now the centrepiece: revision made visible, superseded content kept on the page beside its replacement and its reason, rendered as real `<del>` and `<ins>`. It was the best thing about the abandoned direction and it was never paper-specific.

**Amended 2026-07-26 — the field is a feature, not the ground.** The ambient canvas
behind every page is removed. The reasoning that put it there still holds in the
abstract: the agent's interior genuinely is a graph, and drawing it is description
rather than decoration. What did not hold is drawing it *everywhere*. Rendered as
wallpaper it carried no information — the ambient field was clustered noise, never the
real curriculum — while looking exactly like the one place a real graph does appear.
The author's report was the proof: shown the curriculum map, the response was "no clue
where that graph is supposed to be; the only node graph I see is the background." A
decoration that makes the genuine article unfindable is worse than no decoration.

So the graph survives where it means something and nowhere else: the curriculum map on
the guide index, drawn from real lessons and real prerequisites, in a titled frame on
the `--deep` plane. Pages otherwise sit on plain `--void`. "Depth as the medium" now
lives in the plane system and the transcript surface rather than in a canvas behind
the text, and `drift` leaves the motion vocabulary with it.

---

### 010 — The console, the mastery layer and the palette. Not a new world.

**Decision.** Three capabilities ship, and the visual direction stays open.

- **A deterministic Hermes console** (`src/lib/term/`). Typeable, offline, pure. Every
  string it can print carries a corpus citation; anything never captured is refused
  rather than invented, and `fidelity.test.ts` enforces that in CI.
- **A mastery layer.** A lesson is mastered by driving a console objective or answering
  one question posed as the software's own numbered approval prompt. The level is the
  agent's version on Hermes's real twenty-two-release ladder, the unit of progress is a
  skill file at the namespaced path the binary uses, the streak is uptime.
- **A ⌘K palette** over all 129 destinations.

**What this decision explicitly does NOT do, and why that correction matters.**

An earlier draft of 010 declared a new world — "the site is an operator's OS" — and
would have superseded 009 outright. That draft was written without knowledge of
`research/design/05-direction-exploration.md`, which landed on another machine seven
minutes before the session that produced it and records thirteen prototypes that did not
converge. **`05-the-shell.html` — "you operate a simulated Hermes; the curriculum is the
filesystem" — is in that table, and it was not chosen.** That file's own instruction is
to not re-propose anything in the table without saying so explicitly. This says so.

So the world claim is withdrawn. What survives is the part that was never a world: a
console, a progression and a search surface are capabilities, and they work inside
Substrate exactly as they would have worked inside a shell. The design question is
unchanged and still open, and `05-direction-exploration.md` remains the place it lives.

**Why the capabilities still stand on their own.** The console is the hardest artefact in
this project for a neighbouring guide to copy and the fastest proof to an engineer that
the research was real — the numbered approval menu, the undocumented 300-second timeout
that fails closed, the shipped `contemlating` typo. That value does not depend on which
world it is drawn in. The same is true of a progression built only from real Hermes
artefacts: it is a claim about honesty rather than about aesthetics.

**Cost.** Two lines of work were done in parallel on two machines against the same
commit, and roughly a day of one of them is discarded here: a WebGL curriculum map, a
second landing scroll narrative, and a lesson template that put the console in the
margin. Every one of those had a better counterpart on the other side —
`lib/graph.ts` computes real prerequisite depth where the discarded map only computed
positions; the corrections scene had already survived a frozen-scene bug and a
runway-length redesign; and the margin turned out to be spoken for by a section index and
a graph-derived position, which a reader mid-lesson wants far more often than a terminal.
The reconciliation kept the better one in each case rather than the more recent one.

**One thing deliberately deferred.** The console now sits after the prose rather than
beside it. Three zones at `xl` — margin, prose, console — is a layout that needs
designing, and settling it during a merge would be deciding it by accident.

### 011 — The strike is removed. Supersession is drawn as distance.

**Decision.** The 2px line-through in `--signal` is gone from every surface. A superseded
claim is now labelled, set at a smaller size, and placed behind a hairline; the checked
claim stands in front of it, larger and lit. `<del>` and `<ins>` are kept unchanged.

**Why.** The author asked whether the strikethrough was an expired early decision. It was
not — it came from 007's laboratory-notebook world ("nothing erased, only struck through
and re-entered"), survived into 009, and `design.md` called it "the one motion the site
owns". It was load-bearing for meaning and it was not wrong.

It was, however, **overused**, and the author's instinct was right. It fired in six
places — the landing hero, the corrections list, the scroll scene, `Revised` in every
lesson, the memory plate, and the about page's prose — including on the largest type on
the site. It was also the only place any colour appeared. A site with exactly one owned
gesture is precisely the *"quite monotone and repetitive"* criticism the author levelled
at press.stripe.com in `research/design/06-direction-calibration.md`, applied to itself.

**What replaces it, and why this one is better than a swap.** Distance already carries
meaning everywhere else in this design — the curriculum field puts prerequisite depth on
the view axis, and the arrival wall recedes. Supersession as recession makes those one
idea instead of three treatments, which is what `06` meant by composition. It also costs
no colour, so `--signal` is freed for the things the palette table actually reserves it
for.

**Cost, and one thing it exposed.** The gesture was genuinely good and some of its charge
is lost: a line drawn through a sentence is more immediately legible as *wrong* than a
size change is. The labels ("Widely repeated" / "Checked") carry that load now, in words
rather than in paint, which is quieter and less distinctive.

The first attempt dimmed the superseded claim to 62% opacity and the axe sweep failed it
on contrast within the minute. That was the right failure: the superseded claim is the
thing the reader is supposed to recognise as *what they already believed*, so it has to
be genuinely readable. **Recession is size, label and position — never opacity.**

**Supersedes.** 009's signature-motion clause and `design.md`'s `rewrite` and `strike`
entries, both amended in place rather than left contradicting the build.

**Amended the same day.** The first version of this decision replaced the strike with a
pair of labels — `Widely repeated` above the superseded claim, `Checked` above the
verified one. The author asked what they meant, which was the right question: they meant
nothing beyond what the component was already doing, and they rendered **twenty-five
times** across the site — twenty `Revised` blocks in seventeen lessons, the landing hero,
and four in the scroll scene.

That is the same mistake as the strike, made worse. A repeated word is more intrusive
than a repeated rule, because a reader reads it. It was also scaffolding: the component
explaining its own device instead of letting the device work.

The labels are gone. What distinguishes the two lines is size and order, and underneath
them the provenance line that already existed — *"Checked against the memory
documentation and a running v0.19.0 … · 2026-07-25"*. That is better than any chip could
be, because it names **what** was checked and **when**, and it differs per correction.
On the landing hero the attribution moved into the sentence, where a writer would put it:
*"Almost everything written about Hermes says it has a three-layer memory system."*

**The general rule this is worth extracting.** A device that needs a label to be
understood is not yet working. Fix the device, not the caption — and be suspicious of any
fixed phrase that appears on every surface of the site, whichever layer it lives in.

The four identical "the lesson that carries the source" links on the landing page went at
the same time, for the same reason; each now names the lesson it goes to, resolved from
the content collection so a rename cannot leave the page lying.

---

### 012 — The landing's corrections carry their receipts, and stop being a slideshow

**2026-07-27.** Second surface of the design pass, after arrival. `06-direction-calibration.md`
named it as what remained: *"the corrections scene further down that page is still the
older GSAP treatment and has not been brought into this register."*

**What it was.** A pinned scroll scene, 210vh of runway, four full-height panels scrubbed
by `ScrollTrigger`. One claim visible at a time with the other three at `opacity: 0`, a
`03 / 04` counter above them, and nothing else in the viewport. Four sentences delivered
across four screens of black.

Three things were wrong with it, and only the first is a matter of taste:

1. **It is the least composed thing on the site**, on the section the page calls the
   product. `06`'s diagnosis of "looks extremely basic / not designed" was *physics and
   no composition* — and the fix for that is density and arrangement, not motion. This
   was maximum motion and minimum arrangement.
2. **`design.md` names `01 / 4` pagination in its refusals**, and the scene shipped it.
3. **It asserted rather than showed.** A section whose entire claim is "we checked"
   offered four sentences and no evidence, in a project that has the captures on disk.

**What it is now.** All four present at once, each paired with the material that settles
it, in the empty space to the right of the reading column. The receipts are four
*different kinds* of proof, and that is the section's second argument: a captured status
bar, a captured transcript, the source that implements the behaviour, and the release
record. A guide that only ever cites one kind of source has only checked one way.

Against the four rules arrival established:

| | |
|---|---|
| Luminance out of the material | Superseded claim small and dim, checked claim large and lit, receipt on the nearer `--deep` plane. No paint. |
| Made of something true | Every line verbatim from `research/`, asserted by `corrections.test.ts` with interior whitespace preserved |
| Reading column never under the rendering | Prose keeps the page's left spine; evidence extends right |
| One moment, and it ends | **None.** Arrival owns the page's moment. This section has no animation and no client JavaScript at all. |

**Three consequences worth keeping.**

- **The landing now ships +0.0 kB of first-party JavaScript**, down from +1.6 kB. GSAP
  is gone from the page and the whole section is server-rendered HTML. It is also
  shorter than what it replaced — 3,807 px against 4,770 — while carrying strictly more.
- **`.widen-right` is the reusable form of the hero's move**, and it extends *right only*
  so the reading column keeps the left edge every other section sits on. Its travel
  lands the right edge exactly on the header's, at every viewport. The first version
  overshot by 48 px everywhere because both measures are `max-width`, which includes
  each container's own padding — the header carries `--step * 3` a side and `main`
  carries `1.5rem`. **Measured in the browser; deriving it twice would have been wrong
  twice.**
- **The receipts are sized to their contents, not stretched to the column.** Stretched,
  four of them are four equal rectangles down one side — a card grid, which the refusals
  name, and which reads as chrome. Sized to fit they are four different pieces of
  material, and the evidence is as big as the evidence is.

**What this does not decide.** It is one section on one page, and the sections around it
— the tracks, how it was written, the module list — are still the 52rem column in a void.
Whether this register is *wanted* is the author's call and has had no reaction yet.

**Reversible in one file.** `src/components/landing/corrections.tsx`, plus the
`.widen-right` rule. `use-scene-capable.ts` is deliberately kept though nothing imports
it now: `CLAUDE.md` prescribes it by name as the pattern any future scroll scene must
use, and deleting it would make that instruction wrong.

---

### 013 — The landing's module list becomes a view of the structure

**2026-07-27.** Same design pass, third surface, and the one `design.md` had already
indicted without anyone acting on it:

> **Sequence is spatial.** Module and lesson order maps to depth and position in the
> curriculum map, so it is a view of the structure rather than a table of contents
> drawn to look like one.

The landing's module list was a table of contents drawn to look like one — number,
title, count, ten times, in a 52rem column with half the viewport empty beside it. It
was also the last thing on the page before the footer, which is where a reader decides
whether to go in.

**What it is now.** Every lesson marked at its **prerequisite depth**, on one axis
shared by all ten modules, with each module's rule spanning its own reach. Depth is the
longest prerequisite chain ending at a lesson, computed by `graph.ts` from the lessons'
own frontmatter — the same number `/hermes/` and the lesson masthead are drawn from, so
this is a third view of one structure rather than a third structure.

It answers something a list cannot: **where you can get in.** Module 9 opens at depth 4
and module 8 does not start until depth 8. Reading order and prerequisite order are not
the same thing, and the gap between them is the useful part.

**Deliberately module-level, and deliberately not a graph.** `/hermes/` draws the lesson
graph and lists every lesson with its prose; that is the browsing surface, and repeating
it here would make the landing a worse copy of it. This project has already learned once
what happens when two surfaces draw the same structure — the ambient canvas made the
real curriculum map unfindable. Ten rows of ticks on a labelled numeric axis is a chart,
not a field of nodes, and it is a different question at a different granularity.

**Three things worth keeping.**

- **The rule spans the module's reach, not the axis.** Drawn full width — which is what
  a shared scale wants — every row looks like it covers 0 to 11 and the marks read as
  ticks on a bar rather than as positions. Spanning min to max, the line *is* the reach,
  and the staircase down the page is the curriculum getting deeper with nothing saying so.
- **The marks are translucent so coincident lessons accumulate.** Three lessons at depth
  5 is brighter than one. Luminance out of density, which is rule one, rather than a
  value picked to look right.
- **`curriculum-arc.test.ts` asserts the section's own copy.** It claims reading order
  and prerequisite order differ; if the modules were a clean staircase with no overlap
  the drawing would say nothing the numbering did not, and the sentence would be false.
  Nothing else in the build would notice. It also asserts every module has lessons in
  the graph, since a module missing from it renders as an empty row rather than an error.

**Two mistakes on the way**, both from letting the grid place things:

- Auto-flow put the full-width track on row two and pushed the lesson count onto a third
  row of its own, orphaned under the left edge. A spanning cell makes everything after
  it wrap. Every cell is placed explicitly now.
- The depth range was `hidden` below `lg`. The marks that encode it are `aria-hidden`,
  so on a phone that was not a graceful degradation — it deleted the fact.

**What is left on this page, and why it is being left.** "Three routes" and "How it was
written" are still the reading measure. They are prose with nothing true to put beside
them, and widening a section that has nothing to fill it is how the void got there in
the first place. Between two evidence surfaces they now read as the quiet passages
rather than as the unfinished ones — but that is a claim about rhythm, and the author
has not seen any of it yet.
