# Dribbble pass — the bound laboratory notebook

Research pass conducted July 2026 against the locked visual world: dense pale cellulose-paper quadrille ground, printed protocols hand-corrected in the margins across runs, tipped-in specimen slips at slight rotations, nothing erased (struck through and re-entered above), and system diagrams built as exploded axonometric technical plates (1px keyline, ghosted prior assembly, flat signal red on the active part, 1:1 call-out boxes, dashed leader arrows, oversized step numerals). Palette: cellulose paper `#E8E6DE`, iron-gall blue-black `#1E2A32`, oxide-red annotation `#A8321E`, violet stamp ink `#4B3A78`, muted brass `#8A7A4E`. This pass evaluates Dribbble against that world specifically — not against "does it look nice."

**Access note, stated up front per the brief's caveat #4.** The client-supplied URL, `dribbble.com/search/skribbl`, is confirmed a typo/mishearing: it resolves to a real search page titled *"Browse thousands of Skribbl images for design inspiration"* and returns exactly what the string says — fan art and branding for the drawing game Skribbl.io (font called "Skribblugh," a "Gartic Show" logo, T-shirt doodles). Nothing in that result set is usable for this world. Treated as instructed: read as "explore Dribbble," not as a literal query.

Separately: **plain `WebFetch` could not read Dribbble at all** — it returned an empty page every time (Dribbble's shot grids are client-rendered; the static fetch gets a shell with no content, confirmed on two different search URLs). This pass switched to a real rendered browser (Claude Browser tools) instead, which loaded pages normally. So Dribbble was *not* inaccessible in the sense the brief's fallback clause means — it rendered fine once given JS — and no pivot to Behance/Are.na/Fonts in Use/Layers.to was triggered. Worth recording precisely because the brief asked for the access question to be evaluated, not assumed.

Cookie banners were declined ("Reject All") wherever they appeared; no account was created; no login attempted.

**Search terms actually run** (of the brief's suggested list): `skribbl` (as supplied), `lab-notebook`, `exploded-view`, `patent-drawing`, `field-notes`, `specimen`, `annotation`, `risograph`, `archive`, `graph-paper`, `rubber-stamp`, `isometric-technical`, `dossier`, `index-tab`. Fourteen of twenty — stopped once the pattern per term class was clear and repeating (see "What Dribbble is useless for," below), in favor of spending the remaining time actually opening and inspecting the promising shots rather than skimming more search-result grids.

---

## Kept references

### 1. Record Player — Exploded View Schematic Poster
**Source:** https://dribbble.com/shots/26595890-Record-Player-Exploded-View-Schematic-Poster — Phil Lostbeyond

A framed print poster of a Technics SL-1200MK2 turntable in true exploded-axonometric position: platter, sub-platter, tonearm, cartridge assembly and chassis floating along a shared vertical axis, connected by thin dashed drop-lines to their seated position. One part (the cartridge/stylus) is pulled into its own bordered 1:1 detail box, set apart from the main explosion — exactly the "1:1 call-out box" device the brief specifies. Two colorways exist on the same shot: a black ground with signal-green line work, and a genuine engineering-blueprint colorway (deep blue ground, white line work) that is closer to the locked palette's register than the green one. Line weight is a consistent thin keyline throughout — no fills, no gradients, no shading.

**Verdict:** Doesn't need to "survive as a page" — it's a physical print poster, already real by being an object. What's portable is the *device*: dashed drop-lines from a shared vertical axis, one part isolated into a bordered detail box, oversized product/model number set in a slab display face top-left exactly where a protocol's title block would sit. Rebuildable in SVG with real part data. Strongest single find of the pass for the diagram grammar specifically.

### 2. Steam Deck, Exploded Diagram
**Source:** https://dribbble.com/shots/24614480-Steam-Deck-Exploded-Diagram — GyGinfographics

Flat two-tone blue isometric explosion of a Steam Deck, 30 numbered parts, each anchored by a small solid dot at the exact point on the part and connected by a straight (not curved) leader line to a numbered circle sitting outside the silhouette. Zoomed inspection of the lower-right cluster confirms the anchor dots are placed with real precision — on a specific screw boss or connector, not just "near" the part. The shot's own caption states the designer builds these professionally ("Turning technical complexity into clear graphics for anyone... find these diagrams for reference at iFixit.com") and lists paid services: "Exploded & Assembly Graphics Plan," "Instruction Manual Visual Planning."

**Verdict:** The underlying grammar is inherently real-content-compatible — it exists to be paired with an actual numbered parts list (that's iFixit's whole business), which is exactly the discipline the brief wants borrowed. The shot itself is a static vector illustration with no visible legend, so unverified whether Dribbble is showing the full artifact; treat the numbering *system*, not this specific image, as the keeper. Also the closest thing this pass found to the real, functional ancestor of this whole visual world — iFixit's actual repair guides — worth naming directly as a follow-up reference outside Dribbble.

### 3. Technical illustration of an exploded view of a shoe adapter
**Source:** https://dribbble.com/shots/25329371-Technical-illustration-of-an-exploded-view-of-a-shoe-adapter — Vadim Rybakov

A cycling cleat/shoe-adapter assembly, shaded (not flat) but exploded along true parallel axes: every screw and plate sits on its own dotted leader line, and those lines are genuinely parallel and co-axial with the physical fastening direction — not decorative diagonals. This is the most mechanically precise leader-line handling found in the whole pass.

**Verdict:** Static illustration, single image, no interactive component — but the geometric discipline (leader lines run through the true assembly axis, not an arbitrary elbow route) is a concrete, checkable rule a diagram-generation script could enforce. Worth stealing as a *constraint*, not just a look.

### 4. An exploded view for a quick start guide
**Source:** https://dribbble.com/shots/25299480-An-exploded-view-for-a-quick-start-guide — Vadim Rybakov

Same designer, IKEA-instruction register: solid grey/black line art, directional arrows showing assembly *motion* (not just exploded position — arrows indicating "push this way"), numbered blue circles with straight leaders, "Quick start guide" set in a black side-tab running up the left edge like a spine label.

**Verdict:** The side-tab-as-running-header device is genuinely stealable for a real page (a persistent vertical label naming the current section). Flag: the background is a warm terracotta/peach wash — adjacent to the ruleset's banned "warm cream + terracotta accent" cluster. Don't reuse the color; do reuse the arrow-for-motion and spine-tab devices.

### 5. Shopify — Technical Illustrations #1 (Isometric)
**Source:** https://dribbble.com/shots/22209827-Shopify-Technical-Illustrations-1-Isometric — Canopy

A grid of twelve isometric hardware icons (card reader, dock, tablet, cables) for Shopify's point-of-sale device documentation: pure white 1px keyline on black, zero fill, zero shading, one consistent isometric angle across every icon.

**Verdict:** Highest-confidence "survives as a real page" of the entire pass, because this almost certainly *is* production UI iconography already shipping in real Shopify hardware-setup docs, not a marketing illustration. It is the cleanest available spec for the brief's "1px keyline" requirement in its purest form — no ghosting, no color, no ornament, just the line weight and the isometric convention. Directly reusable as the base icon layer under the more elaborate exploded plates.

### 6. Apple Vision Pro | Inside the Vision Pro — 9 layers, 1 machine
**Source:** https://dribbble.com/shots/27364347-Apple-Vision-Pro-Inside-the-Vision-Pro-9-layers-1-machine — Piyush Wavre

Photoreal 3D-rendered exploded stack of nine hardware layers (glass front, dual-micro-OLED displays, M2/R1 chip board, catadioptric lenses, aluminum frame...), each with a dot-leader connecting to a text label in a clean sans.

**Verdict:** Does not survive, and isn't trying to. This is a bespoke marketing hero render built once for one product launch — nobody maintains this as ongoing page content, and the photoreal rendering style is the opposite of the locked world's flat keyline plates. Kept specifically as the contrast case: steal the *label mechanic* (dot anchor + straight leader + right-aligned two-line caption, evenly spaced down the right margin) and discard everything about the rendering style. Good example of "beautiful, not functional" exactly as the brief warned to expect from this source.

### 7. The Wes Anderson Archive by The Criterion Collection
**Source:** https://dribbble.com/shots/26218229-The-Wes-Anderson-Archive-by-The-Criterion-Collection — Beth Mathews

Premium packaging design for a real Criterion Collection box set: cloth-bound outer box in olive jacquard pattern, an inset cream card that reads like a certificate — a printed table of contents, a gold wax-seal-style emblem, and what reads as a hand-signed line at the bottom ("Wes Anderson"-style signature). Inside, two rows of bound volumes with orange cloth spines, gold foil title stamping, and a repeated circular emblem mark on each spine.

**Verdict:** Not a page — physical packaging — but this is the single most convincing "archival object as real content, not illustration" example found. The mechanism (a signed certificate card, a foil/wax emblem functioning as a provenance mark, spine labels as a navigation metaphor) maps directly onto the brief's "tipped-in specimen slips" and "violet stamp ink" requirements. If the design system needs one image to prove the *tactile* register is achievable digitally, this is the reference to hand a illustrator.

### 8. AIGA Mason Field Notes
**Source:** https://dribbble.com/shots/3508315-AIGA-Mason-Field-Notes — Alex Holton

A pocket-notebook cover on olive/kraft card stock: a dashed circular badge (compass-rose style, with small square tick marks at the cardinal points) framing a crossed pencil-and-ruler icon and the words "AIGA Mason Field Notes," with "Tools of the Trade" set below in a bold slab.

**Verdict:** Single print image, no interior visible. Kept narrowly for the badge geometry — a dashed circle with tick-mark ordinates reads convincingly as a technical/drafting mark, which is a more credible "verified" or "witnessed" stamp than a plain circle or a generic rubber-stamp texture (see the rubber-stamp search results below, which were much weaker). Worth adapting for the violet stamp-ink provenance mark, in the locked palette rather than kraft/olive.

### 9. Field Guide
**Source:** https://dribbble.com/shots/5942292-Field-Guide — Zachary Wieland for Helms Workshop

A set of two-color halftone-engraving illustrations (forest green + cream, genuine halftone dot screen, not synthetic grain) for a printed mountain-resort field guide: human anatomy diagrams, plant specimens, animal studies, hand gestures for wilderness signaling — all rendered in a consistent vintage-woodcut/engraving line quality on visibly textured cellulose stock.

**Verdict:** Print collateral, not a page — the illustration *style* is what's portable, not the artifact. Important distinction for the ruleset: this is authentic halftone screening (a real, period-correct print process), which is different in kind from the banned `feTurbulence` synthetic-grain pattern — worth citing precisely so the design team doesn't conflate "real paper texture" with "fake CSS noise filter" when briefing an illustrator. Palette doesn't transfer (green, not the locked blue-black/oxide-red) but the print-grain fidelity and two-flat-ink discipline do.

### 10. Packaging Specs
**Source:** https://dribbble.com/shots/3450018-Packaging-Specs — Todd Durkee for ICON

Shaving-brand packaging built entirely from authentic 1904-dated patent-drawing plates (safety-razor mechanism, "Fig. 1" through "Fig. 4," genuine cross-hatched engraving, hand-set serif patent number "No. 776,184," "PATENTED NOV. 15, 1904" running vertically along the spine edge) with a yellow flat-color block dropped behind the lower half and brand copy set in a tracked engraved-serif face.

**Verdict:** Packaging, not a page — but this is the clearest example in the whole pass of the *patent-plate numbering convention* specifically (small numerals set directly against the line work with a short tick leader, no boxes, no circles) as distinct from the boxed/circled callout convention used in items 1–4. Worth keeping both conventions available: boxed numerals for hero exploded views, patent-style bare numerals for smaller inline diagrams where a box would be too heavy.

### 11. ARCHIVE — Website Concept
**Source:** https://dribbble.com/shots/23189770-ARCHIVE-Website-Concept — Tomasz Mazurczak for Studio Design

An actual page layout (not an object photo): a hero card with a perforated/ticket-edge top border, an oversized "ARCHIVE" wordmark, then a real hairline-ruled metadata table below it — rows for "Visible Scene," "Stories," a director name, a year, colored status dots, and tag pills — sitting above a black-and-white production-still photograph with a caption paragraph.

**Verdict:** Conditionally survives — and this is the one item in the set that is trying to be a page rather than a picture of an object. The metadata table is genuine structured content (name/year/tags), not a decorative card grid, and the perforated top edge is a legitimate "index card" texture cue that could translate into the notebook world's page-edge treatment. Caveat that must travel with this reference: it's a promotional shot for an AI website-builder product ("STUDIO is an AI-augmented design app... projects are automatically implemented, you can see them live preview"). That "automatically implemented" claim is unverified marketing copy from the shot's own caption, not something this pass confirmed by visiting a live build. Steal the grid structure; do not cite the vendor's functionality claims as evidence it works.

---

## Devices worth stealing

Ranked by how much they'd concretely improve the exploded-plate and archival-record layers of the system, most valuable first.

1. **Numbered-callout + leader-line system, built as a real rule, not a one-off illustration** (from #2 and #3). Anchor: a solid dot precisely on the part. Line: straight, running along the true assembly axis — not an arbitrary elbow connector. Terminus: a bordered numeral (box for hero plates, bare patent-style numeral for inline ones, per #10). This is the single highest-leverage steal because it's the literal mechanism the brief specifies ("1:1 call-out boxes, dashed leader arrows, oversized step numerals") and it is provably buildable from real data (iFixit does this at production scale).

2. **Pure 1px keyline as a hard style constraint, not a look** (from #5). No fill, no shadow, one isometric angle, applied consistently. Use the Shopify/Canopy set as the literal line-weight and angle spec for every diagram in the system — it's the cleanest un-decorated example found and is close to already being production UI.

3. **The tipped-in archival object, rendered as real content** (from #7): a foil/wax emblem functioning as a provenance stamp, a signed certificate card, spine labels as navigation. This is the most direct route to making "nothing erased, only struck through and re-entered" feel tactile rather than illustrated — build one real component (a "session record" card with a stamp mark and a monospace signature line) styled off this reference, in the locked violet/brass palette instead of Criterion's olive/orange/gold.

4. **Ghosted-axis leader lines anchored with precision, not approximation** (from #3). Worth writing as a literal constraint for whoever builds the diagram system: leader lines must be co-axial with the real fastening/assembly direction. This single rule is what separates "technical" from "technical-looking."

5. **Real metadata tables instead of card grids for index/archive pages** (from #11). Hairline rules, actual field labels, tag pills that are real taxonomy — not icon-plus-heading-plus-text cards repeated three times. Directly addresses the ruleset's ban on "identical icon-heading-text card grids."

6. **Dashed compass-rose badge geometry for stamp/verification marks** (from #8), redrawn in oxide-red or violet ink rather than kraft/olive — reads more credibly as "witnessed" than a plain circle or a distressed rubber-stamp texture.

7. **Patent-plate bare-numeral convention for small inline diagrams** (from #10), reserved for cases where a boxed callout is too heavy — gives the system two registers of the same idea instead of one at every scale.

8. **Motion arrows distinct from position lines** (from #4): reserve arrowheads specifically for "this part moves this way during assembly," and keep static dashed lines arrow-free for "this is where the part sits" — the shoe-adapter and quick-start-guide shots both make this distinction and it reads more precisely than using arrows for everything.

---

## What Dribbble is useless for here

Stated plainly, as the brief asked, so the design record shows the source was evaluated rather than just cited:

- **Abstract-noun searches return SaaS UI, not artifacts.** "Annotation" returned essentially 100% document/video/image data-labeling product interfaces (AI training-data annotation tools, comment sidebars, review-annotation SaaS) — zero results resembling handwritten marginalia or a corrected protocol. "Dossier," "index tab," and "archive" skewed the same way: mostly generic web-app "index page" patterns, table-of-contents components, and corporate binder photography, with only occasional genuine hits (the WW2-dossier resume, the Criterion box). If a search term names a *content category* rather than a *physical object*, Dribbble's tagging routes it to whatever SaaS product currently uses that word as a feature name.
- **"Rubber stamp" is entirely generic distressed-logo mockups.** Forty results, all variations on "grungy circular logo badge with ink-texture Photoshop overlay" for coffee shops, wedding branding, and t-shirt companies — nothing resembling a functional provenance mark on a real document. The AIGA Mason badge (kept above) beat all forty "rubber stamp"-tagged results on badge-geometry quality alone.
- **"Risograph" is decorative zine/poster illustration, not structure.** Cats, holiday cards, band posters — a real print technique reduced to a texture filter people apply to finished illustrations. Nothing about how the technique could organize a page.
- **The industry's own marketing doesn't use its own visual language.** This is the most telling negative finding of the pass: shots made *for actual lab-notebook and electronic-lab-notebook (ELN) companies* — "Science Data" (Mary Maka, for a company called Kanebo ELN) and "microbiology notebook" (Yakine Hcn) — abandon the paper-lab-notebook aesthetic entirely in favor of generic gradient-orb, grain-textured, flat-illustration SaaS marketing art (glowing DNA helixes, colorful pie charts, hands touching a tablet). If the companies whose actual product *is* a digital lab notebook don't reach for this visual language in their own Dribbble portfolios, that's a signal the aesthetic has to be built from print/archival references (Criterion, Field Notes, patent plates) rather than from anything tagged "lab" or "notebook" on this platform.
- **The literal "aged document" interpretation reads as costume, not craft.** "WW2 Dossier Resume" (Ben Sykes, https://dribbble.com/shots/6101226-WW2-Dossier-Resume-Rev) is a resume mocked up with heavy coffee-stain/scratch/grunge-filter aging, a redaction bar, and a fake postage stamp. It's a useful negative example precisely because it shows what happens when "old annotated document" is executed as surface texture rather than as the brief's actual mechanism (struck-through corrections, re-entry above the line, dated and witnessed entries). Worth naming directly if anyone on the team reaches for a heavy grunge/distress filter as a shortcut to "archival" — this is what it looks like, and it isn't what the brief wants.
- **Structural limit of the source, independent of any search term.** Nearly everything gathered — including several of the kept references — is a single static hero frame optimized to read well as one image. Even the one item that's actually trying to be a page (#11, ARCHIVE) is a promotional shot for a website-builder product, not an audited, running site. Dribbble can supply *devices* (a leader-line convention, a badge geometry, a metadata-table structure) but it cannot supply evidence that a full multi-content page built from those devices holds together — that verification has to happen by building the page, not by finding a better shot.

---

## Summary of source evaluation

Dribbble was reachable and searchable (once rendered in an actual browser rather than fetched statically — plain `WebFetch` returned nothing). No pivot to Behance/Are.na/Fonts in Use/Layers.to was required or performed. The yield was real but narrow: strong on isolated *devices* — leader-line conventions, keyline icon discipline, badge geometry, one genuinely strong packaging reference (Criterion/Wes Anderson) — and weak-to-useless on anything requiring the platform's own content-category tagging ("annotation," "archive," "dossier," "rubber stamp") or requiring proof that a layout survives as a real, content-driven page rather than a single optimized frame.
