# Type, Motion & Motif Research — "Bound Laboratory Notebook" Direction

Research pass for the Hermes learning-platform design system. **Revision note**: an earlier pass of this document explored a mythic/Greek visual world; the coordinator has since locked a different world and this document has been re-derived accordingly. Faculty Glyphic (display) and JetBrains Mono (code/data monospace) survive the pivot — both are reconfirmed below with new, world-specific reasoning, not carried over on inertia. Everything else — the body/technical text faces, the motif system, and the texture guidance — has been rebuilt from scratch for the new world.

**The locked world**: the bound laboratory notebook and its protocols. Paginated, dated, stamped, signed. Printed protocols corrected by hand in the margins across successive runs. Results tipped in as pasted specimen slips. Nothing erased — only struck through and re-entered above, so the whole revision history stays visible on the page. Its system diagrams are exploded axonometric technical plates (1px keyline, ghosted prior assembly, one flat signal red on the active part, 1:1 call-out boxes, oversized step numerals, dashed leader arrows). Palette: dense pale cellulose paper with a blue-grey quadrille grid, iron-gall blue-black ink, oxide-red annotation, violet rubber-stamp ink, one muted brass (index tabs, instrument plates). One structural idea to design around: the page is paper, but terminal transcripts are pasted in as dark plates — like a photographic plate tipped into a printed book. That is how this light-ground world earns a dark surface for code and session replays without a theme toggle; the contrast is material, not decorative.

Compiled July 2026. All entries carry `Source:` links; claims about exact numeric values (cubic-bezier coordinates, axis ranges) are flagged where sources disagree.

**Governing ruleset for this pass (Impeccable):** a named list of "training-data default" typefaces is disqualified from consideration unless no other face can satisfy the need — subject association ("a document wants a serif," "code wants a mono") is explicitly not a valid justification. Three "whole-look" convergence clusters are also disqualified: (1) warm cream ground + high-contrast serif display + terracotta/signal-red accent; (2) near-black + one neon accent + glowing edges; (3) broadsheet-editorial hairlines + italic display serif + small tracked mono labels. `feTurbulence`-based grain/rough-edge techniques are separately named and disqualified as an amateur tell, regardless of which world is in play. Tracking floor −0.04em (−0.02 to −0.03em usually reads better). Display type capped at 6rem. Body measure 65–75ch. Monospace must be justified by actual code/data/measurement content it sets — never deployed purely as a "technical" costume. This document's typography, motif, and texture sections were rebuilt under this ruleset for the notebook world specifically; the disqualified-face paper trail from the earlier pass is preserved and extended at the end of the document.

---

## 1. Typography

### 1a. Display — Faculty Glyphic, reconfirmed and strengthened

**Faculty Glyphic** (Google Fonts / GitHub, OFL 1.1, designed by Dylan Young at Koto in 2024 for the applied-AI company Faculty) was the primary display pick under the abandoned Greek-world brief, justified there as a modern tribute to Berthold Wolpe's Albertus. Re-checked against the new world rather than assumed to survive by default: the reasoning gets *stronger*, not weaker.

Albertus was modelled by Wolpe — who trained as a metal engraver — to resemble letters carved into bronze. It's the face he used across roughly 1,500 Faber & Faber book jacket designs, where its "precise strokes, towering ascenders, and gestural serifs gave these jackets a sculptural quality" that became identified with the publisher; it's also the face used today for the City of London's street name signs. That's three real, documented precedents — engraved metal plate, printed institutional jacket, stamped municipal signage — and all three map directly onto physical objects this notebook world actually contains: brass instrument plates, stamped protocol headers, index-tab labels. The earlier justification ("carved stone, ancient authority") was a thematic echo; this one is a materials match. Faculty Glyphic isn't being reused because it survived a list — it's being reconfirmed because the new brief's own object inventory (brass plates, stamped headers) is close to a literal restatement of Albertus's actual use history.

The single-static-weight limitation (no variable axis, Regular only, no italic) reads the same way it did before, and arguably better here: real engraved brass plates and rubber stamps don't have a "bold" version either — a fixed-weight display face is materially honest for a world built entirely from fixed-impression objects (a stamp hits the page the same way every time; a brass plate is engraved once). Hierarchy stays a function of size, tracking (within the −0.04em floor), and placement — never synthetic bolding.

Source: https://fontsinuse.com/typefaces/240354/faculty-glyphic
Source: https://github.com/google/fonts/issues/8006
Source: https://en.wikipedia.org/wiki/Albertus_(typeface)
Source: https://eyeondesign.aiga.org/meet-berthold-wolpe-the-designer-behind-faber-fabers-distinctive-book-covers/
Source: https://www.faber.co.uk/journal/the-albertus-typeface-and-fabers-design-heritage/

### 1b. Monospace — JetBrains Mono, reconfirmed and tied to the world's core structural idea

**JetBrains Mono** (OFL 1.1) also survives, and the same discipline applies: it isn't being kept out of inertia, it's being re-justified against the new brief. The rule established earlier — monospace must be earned by real code/data/measurement content, never worn as a "technical" costume — turns out to map onto this world's single structural idea almost exactly. The brief states the page is paper, but terminal transcripts are pasted in as dark plates, "like a photographic plate tipped into a printed book," and that this is how the light-ground world earns a dark surface without a theme toggle. A monospace face is not decorating that dark plate — it is *definitionally* what a terminal transcript is set in. There's no clearer possible case of "content that actually is code/data" than a literal terminal session rendered as the one dark object on an otherwise pale page. JetBrains Mono's exceptional character-distinction (0/O, 1/l/I stay unambiguous) matters even more here than in the abandoned world, because a pasted-in transcript plate is explicitly meant to be read as a faithful, unedited record — a misread character in a "photographic plate" undermines the entire audit-trail premise the world is built to support.

No change to the earlier resolution: a single monospace family, deployed only where the content is genuinely code, a timestamp, a duration, a version tag, or a measured value — never a decorative label treatment. The previously-researched alternatives (Commit Mono, Geist Mono, Martian Mono, Departure Mono, IBM Plex Mono) remain evaluated-and-set-aside for the same content-justification reasons as before; none of them changes status under the new world, since the deciding rule was never about mood.

Source: https://fontalternatives.com/alternatives/berkeley-mono/
Source: https://fontalternatives.com/compare/commit-mono-vs-geist-mono/
Source: https://fontalternatives.com/compare/geist-mono-vs-jetbrains-mono/
Source: https://commitmono.com/
Source: https://vercel.com/font
Source: https://fonts.google.com/specimen/Martian+Mono
Source: https://www.departuremono.com/
Source: https://github.com/IBM/plex
Source: https://github.com/IBM/plex/issues/262

### 1c. Text faces — re-derived for "institutional record," not "literary"

Alegreya was the long-form body pick in the abandoned world, justified there specifically by its calligraphic-literary warmth ("built for literature," a "dynamic and varied rhythm... for sustained literary reading"). On dense pale cellulose paper, that exact quality is now the problem: a warm, humanist, literature-register serif on a pale ground is a close paraphrase of disqualified cluster 1 (warm cream ground + high-contrast serif display + terracotta/red accent) — not because Alegreya itself is terracotta-colored, but because "literary warmth on light paper" is the same underlying emotional register that cluster describes, just with the accent color swapped. The notebook world's text needs to read as *record*, not *prose-for-its-own-sake* — a protocol sheet, not a novel. This is a full re-derivation, not a substitution.

Because dense small technical text (table cells, captions, figure labels, frontmatter) and long-form lesson prose have genuinely different legibility requirements at genuinely different sizes, this world gets two distinct recommendations rather than one face doing both jobs.

**Long-form lesson body — evaluated candidates:**

| Candidate | License | Axes | Register assessment |
|---|---|---|---|
| **Bitter** | OFL, Huerta Tipográfica | Variable weight; designed specifically for screen reading | A Clarendon-style slab — and Clarendon is not a neutral choice of convenience here, it's the genre with the most direct historical claim to "institutional record": Clarendon slabs originated in 19th-century Britain expressly for legal and official documents, before becoming the default genre for dictionaries, wanted posters, and typewritten-adjacent printed forms. Generous x-height and "subtle thick serifs to anchor the eye" per its own design brief, purpose-built for reduced fatigue over long screen reading. The most on-the-nose match for "printed protocol" register of anything evaluated — a slab serif reads as *stamped/printed* in a way a humanist serif reads as *penned*, which is exactly the distinction this world needs. **Primary recommendation.** |
| **Roboto Serif** | OFL, Commercial Type / Google Fonts | 4 axes (weight, width, optical size, grade); 6 named optical sizes (micro→poster) | The most technically sophisticated candidate — engineered from a research-driven "how do we make screen reading more comfortable" brief with no literary origin story at all, which is its own kind of institutional neutrality. Extremely capable variable range. Set aside as primary only because it reads as *contemporary product UI serif* rather than *document*, lacking Bitter's specific Clarendon/legal-document lineage — a legitimate second choice if the platform later needs the wider optical-size range Bitter doesn't offer. |
| **Crimson Pro** | OFL, Jacques Le Bailly, commissioned by Google as a full redesign of Crimson (distinct from the banned "Crimson"/Crimson Text — different metrics, angular vs. rounded serif brackets, broader weight range, its own variable build) | Variable, 16 static styles | A genuine, professionally-commissioned redesign rather than a re-skin of the banned original, so it isn't simply routing around the ban — worth flagging explicitly as a judgment call. Reads closer to a refined book-text serif ("nods to Source Serif") than to a document/record register; competent but doesn't carry Bitter's document-genre argument. |
| **Source Serif 4** | OFL, Adobe | Variable, transitional serif | Reliable, editorial-clean, genuinely safe — and that safety is the problem: it's the reflexive "second choice after the banned first choice" pick, with no specific argument for this world beyond general competence. Fallback-stack entry. |
| **Zilla Slab** | OFL, Mozilla / Typotheque (based on Tesla) | Static weight range, true italics | Another slab, "legible at code-editor sizes... punchy enough for headlines," industrial-friendly character. Genuinely close to Bitter's register; set aside for body specifically because its "industrial/code-editor" personality reads better at the smaller, denser sizes this document routes to the technical-text face below — see that recommendation. |
| **Erode** (Fontshare) | ITF Free Font License (free commercial use) | Static | A "contemporary serif that balances traditional proportions with modern details," versatile across display and text sizes. Found via the same widened-foundry-search discipline used in the earlier pass (checking Fontshare/Uncut.wtf rather than stopping at Google Fonts); competent and undocumented enough to be a safe non-default choice, but has no specific document-register argument the way Bitter's Clarendon lineage does — noted for the record of a genuinely wider search, not adopted. |

**Recommendation**: **Bitter**, set at body size for lesson prose, table of contents, and any running narrative text. Its Clarendon heritage gives the choice an actual historical argument rather than a vibe.
Source: https://en.wikipedia.org/wiki/Zilla_Slab
Source: https://www.beautifulwebtype.com/zilla-slab/
Source: https://fontsource.org/fonts/faculty-glyphic
Source: https://commercialtype.com/news/roboto_serif
Source: https://fonts.withgoogle.com/roboto-serif
Source: https://typedrawers.com/discussion/4762/what-about-crimson-text-and-crimson-pro
Source: https://www.beautifulwebtype.com/crimson-pro/
Source: https://en.wikipedia.org/wiki/Source_Serif_4
Source: https://www.fontshare.com/fonts/erode
Source: https://madegooddesigns.com/fontshare/

**Dense small technical text (table cells, captions, figure labels, frontmatter) — evaluated candidates:**

| Candidate | License | Axes | Register assessment |
|---|---|---|---|
| **Public Sans** | OFL 1.1, USWDS / GSA (U.S. General Services Administration); font-software modifications are public domain (CC0) as U.S. government work | Variable weight | Built, literally, for official government documents by the team that runs the U.S. Web Design System — "a strong, neutral, principles-driven, open source typeface for text or display," commissioned expressly to demonstrate how an accessible open-source institutional typeface should be made. There is no stronger possible "earned, not borrowed" case in this entire document: this is a face whose actual client brief was "government forms and public records." At small sizes it holds distinction and neutrality better than a slab or serif can, which is exactly what table cells, captions, and frontmatter need. **Primary recommendation.** |
| **Libre Franklin** | OFL 1.1 | Variable weight, true italics | Public Sans's own direct ancestor — Public Sans is explicitly adapted from Libre Franklin, itself a faithful (~92% similarity per FontAlternatives) open revival of Morris Fuller Benton's 1912 Franklin Gothic. Using both would be redundant rather than complementary; kept as the fallback-stack entry precisely because it's the same lineage, one step further from the institutional-document brief. |
| **Archivo Narrow** | OFL 1.1, Omnibus-Type (Héctor Gatti) | Variable weight (part of the wider Archivo variable family: weight + width, thin→black, extra-condensed→expanded) | A genuinely useful refinement rather than a competing primary pick: reserved for the *tightest* spaces specifically — index-tab labels, table header row labels, running heads — where Public Sans's proportions are still slightly generous. Designed explicitly for simultaneous print/digital use in space-constrained contexts, which is exactly the index-tab/table-header use case. Recommended as a narrow, secondary role within the technical-text family, not a separate voice. |

**Recommendation**: **Public Sans** for table cells, captions, figure labels, and frontmatter generally; **Archivo Narrow** layered in only for the tightest label contexts (index tabs, compact table headers) where Public Sans's proportions don't fit.
Source: https://github.com/uswds/public-sans
Source: https://designsystem.digital.gov/design-tokens/typesetting/font/
Source: https://github.com/uswds/public-sans/blob/develop/LICENSE.md
Source: https://fonts.google.com/specimen/Libre%2BFranklin
Source: https://fontalternatives.com/compare/franklin-gothic-vs-libre-franklin/
Source: https://github.com/impallari/Libre-Franklin
Source: https://www.omnibus-type.com/fonts/archivo-narrow/
Source: https://github.com/Omnibus-Type/ArchivoNarrow

---

## 2. Motion Language

The scroll-narrative, reveal, and easing research below is largely world-agnostic and is retained from the earlier pass; the SVG-draw and texture sections have been re-contextualized and (for texture) substantially rewritten for the new world's specific "no feTurbulence" constraint.

### Scroll-narrative / text-reveal conventions (2025–2026 award-site patterns)

- **SplitText-style reveal** is now the dominant text-entrance convention on Awwwards/Codrops-adjacent sites: text is programmatically split into chars/words/lines (each wrapped in its own span/div), then each unit is animated in with a **stagger** — typically word-by-word or line-by-line rather than character-by-character for body copy (character-by-character is reserved for short hero labels/logotype moments). GSAP's `SplitText` plugin became free (no Club GSAP membership required) as of GSAP 3.13, which has driven its ubiquity as the default implementation tool in 2025–2026 tutorials.
  Source: https://lab.good-fella.com/blog/gsap-text-animation-splittext-guide
  Source: https://freefrontend.com/split-text-js/
- **Scroll-pinned "scrollytelling" scene structure**, the recurring pattern across Awwwards case studies and Codrops tutorials, follows a five-beat shape: **Hook** → **Context** → **Journey** → **Climax** → **Resolution**, built as a single GSAP timeline wired to `ScrollTrigger` with `pin: true` and `scrub: true`, so the timeline's playhead is driven directly by scroll position rather than by time.
  Source: https://annnimate.com/learn/scroll/pinning
  Source: https://fwdtools.com/ui-snippets/scroll-pin-story/
  Source: https://lovable.dev/guides/scrolling-designs-patterns-when-to-use
- **3D/scrubbed and grid-reveal patterns** worth studying directly: *Creating 3D Scroll-Driven Text Animations with CSS and GSAP* (Codrops, Nov 2025) positions text using pure CSS transform math + GSAP ScrollTrigger, no WebGL required. *Sticky Grid Scroll* (Codrops, Mar 2026) documents a four-phase scroll choreography (grid enters 0–45% → grid expands 45–90% → content settles 90–95% → scene stabilizes 95–100%), a clean, reusable percentage-based template directly reusable for this world's exploded-plate assembly sequences (see Motion vocabulary below).
  Source: https://tympanus.net/codrops/2025/11/04/creating-3d-scroll-driven-text-animations-with-css-and-gsap/
  Source: https://tympanus.net/codrops/2026/03/02/sticky-grid-scroll-building-a-scroll-driven-animated-grid/
- **Terminal-typing effects, done tastefully** — directly relevant now that terminal transcripts are a named structural element (the "dark plate"): the 2025–2026 convention is CSS `steps()` width-reveal (or JS char-by-char) for the type-on effect, plus a **separately-animated caret** using an `@keyframes` opacity toggle rather than baking the blink into the same timing function as the typing. Style the caret's blink via `border`/opacity transitions so it composites on the GPU rather than triggering layout, protecting INP.
  Source: https://css-tricks.com/snippets/css/typewriter-effect/
  Source: https://www.sitepoint.com/css-typewriter-effect/

### Easing curves in use

Named easing → cubic-bezier values, canonicalized by easings.net and Robert Penner's original formulas. A handful of older articles cite a slightly different `expo-out` constant (`cubic-bezier(0.19,1,0.22,1)`, an earlier easings.net revision), flagged below.

| Name | cubic-bezier | Typical use |
|---|---|---|
| `easeOutExpo` | `cubic-bezier(0.16, 1, 0.3, 1)` *(older sources: `0.19, 1, 0.22, 1`)* | Confident-arrival ease for entrances — fast start, long soft landing. |
| `easeInOutExpo` | `cubic-bezier(0.87, 0, 0.13, 1)` | Scroll-scrubbed timelines, so both scroll directions feel equally intentional. |
| `easeOutQuart` | `cubic-bezier(0.25, 1, 0.5, 1)` | Softer alternative for secondary/staggered elements. |
| `easeOutCirc` | `cubic-bezier(0, 0.55, 0.45, 1)` | Rounder, more organic deceleration — good for anything meant to feel drawn/inked rather than mechanical. |
| `easeOutBack` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Sparingly, for small UI affordances wanting a tiny overshoot — and, in this world specifically, for a physically-honest stamp impact (see Motion vocabulary). Avoid on display type. |
| GSAP `CustomEase` | SVG-path-defined, registered via `CustomEase.create('name', 'M0,0 ...')` | Recommended: hand-tune one bespoke "house" curve and register it once so every reveal shares one signature deceleration. Accepts CSS-style `cubic-bezier()` strings directly, so the same curve is shareable between CSS and GSAP. |

Source: https://easings.net
Source: https://gsap.com/docs/v3/Eases/CustomEase/
Source: https://gsap.com/community/forums/topic/38174-from-css-cubic-bezier-to-gsap-ease/
Source: https://ics.media/en/entry/18730/

### Ink-drawn SVG animation (stroke-dashoffset)

The canonical technique — `stroke-dasharray` set to the path's total length, `stroke-dashoffset` animated from that length to `0` — is retained from the earlier pass but re-contextualized: in this world it isn't "inscribing a chisel mark," it's *writing*. That reframing matters for which motifs use it: strikethrough lines being drawn, marginal-annotation connector lines being drawn, dashed leader arrows on an exploded plate being drawn, a signature/date stamp's outline — all genuinely "something being marked onto paper," not "something being carved."
- Stagger multiple paths (each dashed leader arrow, each margin connector) with GSAP's `staggerFromTo` so multi-part marks appear sequentially rather than all at once.
- Pair with `easeOutCirc` rather than linear timing for anything meant to feel hand-marked (a strikethrough, an annotation connector) — perfectly linear reads as a progress bar. Reserve strict linear timing for the one place mechanical precision is *correct*: a ruled/drafted line like a call-out box edge or keyline, which should look drafted, not written.
- GSAP's DrawSVG plugin (bundled free in recent GSAP releases) wraps this with animatable start/end percentages — useful for a leader arrow that seems to "grow from the part it points at" rather than from a fixed origin.

Source: https://tympanus.net/codrops/2017/12/05/creative-svg-strokes-animation/
Source: https://tympanus.net/codrops/2013/12/30/svg-drawing-animation/
Source: https://css-tricks.com/svg-line-animation-works/
Source: https://tympanus.net/codrops/2023/01/31/bringing-letters-to-life-coding-a-kinetic-svg-typography-animation/

### Paper substrate, press impression & stamp-ink texture — revised, no `feTurbulence`

Impeccable explicitly names `feTurbulence`-based grain as an amateur tell, and it's worth stating plainly that this rules out more than the obvious "add noise for grain" recipe: the two most commonly-tutorialized "rough/torn paper edge" techniques found in this research (danieldarrenjones.com's rough-edge filter, and the equivalent approach referenced across several "torn paper CSS" tutorials) both turn out to be `feTurbulence` + `feDisplacementMap` under the hood — meaning the obvious answer to "how do I fake a torn edge" is disqualified by the same rule that disqualified generic grain, not a separate concern. The honest answer requires actually choosing between three different strategies rather than reaching for the nearest tutorial.

**Option A — a real photographed/scanned paper tile, used once, at very low opacity, on the page substrate only.**
A genuine material photograph is categorically different from procedurally-generated noise: it's real, non-repeating-feeling cellulose fiber texture, not an algorithm's guess at one — arguably the *most* honest texture option available precisely because it doesn't fake anything. Practical spec: one small (≤512px) seamless tile, WebP at quality ~75–85, targeting under ~30–40KB; applied at 3–6% opacity via `background-image` on the page container only, never per-component; `background-size` tuned so the grain reads as close-up fiber rather than a visibly repeating tile. Tradeoff: one small, cacheable HTTP request, plus a real decision about sourcing/licensing the source photograph. Benefit: it is actually paper.

**Option B — CSS-only gradient approximation, no image, no filter.**
Layered `repeating-linear-gradient`s (e.g. one at 45°, low-amplitude rgba steps) plus a subtle radial-gradient vignette can suggest surface unevenness with zero assets, infinitely scalable and trivially theme-able. Stated honestly: gradients are geometric by construction, and even layered/rotated they read as "subtle vignette" rather than "paper" specifically — pushed further than very subtle, they start to look like a banding artifact rather than a material. Best treated as the reduced-data/reduced-motion fallback for Option A (same visual family, zero network cost) rather than the primary choice.

**Option C — no surface texture at all; the paper feeling is carried entirely by structure and palette.**
A legitimate answer, not a cop-out. This document's motif system (§3 below) already gives the notebook world most of its material credibility through *structure*: the quadrille grid at true module scale, the stitched-edge gutter shadow, the ink hierarchy (iron-gall black-blue body vs. oxide-red annotation vs. violet stamp), the tipped-in slip's rotation and edge treatment. None of that needs a textured background to read as paper — it needs correct proportion, correct color relationships, and correct *behavior* (things that stay struck-through instead of vanishing; things that get dated and paginated). A flat, correctly-valued paper-color background under a structurally-correct notebook system risks reading as *cleaner* than real paper, not fake — arguably the more disciplined choice for a product that needs to stay legible and fast far more than it needs to look photographed.

**Recommendation**: **Option C as the default** (flat, correct-value paper color, zero texture asset, zero filter), with **Option A layered in only where the "paper" claim is doing real work** — a full-bleed cover/landing moment, or the background immediately behind a tipped-in specimen slip, where paper-glued-on-paper is the actual point — never as a global always-on layer. This is the same discipline argued for everywhere else in this document (mono only for real code, red only for real annotation, rotation only hand-picked and rare): texture as a deliberate, occasional device, not a default filter pass. `feTurbulence`-based grain and rough-edge filters are rejected outright, per Impeccable. Where an irregular edge is genuinely needed (the specimen slip's torn variant — see §3), use one **hand-authored** `clip-path: polygon(...)` asset with deliberately chosen, not algorithmically randomized, irregular vertices: a designed imperfection, reused consistently, rather than a simulated one generated fresh each time. That distinction — authored irregularity vs. procedural noise — is the throughline for every "how do I fake material X" question in this document.

Source: https://danieldarrenjones.com/articles/how-to-make-rough-edges-with-css-and-svgs
Source: https://www.tutorialpedia.org/blog/old-paper-background-texture-with-just-css/
Source: https://blog.openreplay.com/modern-css-background-effects/
Source: https://texturize.app/blog/css-background-textures-performance
Source: https://convertminify.com/blog/webp-compression-best-settings

---

## 3. Notebook Motif System

Replaces the earlier pass's Greek motif system entirely. Same rigor, same output shape: for each motif, the real physical structure, concrete SVG/CSS construction rules, and — critically for a world this rich in tactile reference — an explicit line between "structural translation" and "skeuomorphic kitsch," since a lab-notebook aesthetic is far easier to over-decorate than an abstracted Greek key ever was.

### The quadrille grid — a real alignment system, not a background texture

**Structure**: fine blue-grey squared paper, used for actual writing/ruling/sketching, not ornament — with a two-tier line hierarchy (fine lines every square, a heavier "index" line every fifth or tenth square) that real quadrille pads use to help the eye count.

**Translation**: define the grid module as a CSS custom property that drives *both* the visible grid-line background *and* the actual layout spacing scale (CSS Grid tracks, margin/padding units) — the visible lines should be the literal manifestation of the design system's spacing unit, not a decorative pattern layered independently on top of an unrelated layout grid. Build the two-tier hierarchy with two stacked `repeating-linear-gradient` layers: minor lines every base unit (e.g. 8px) at ~8–12% opacity of the ink-blue-grey against the paper ground, major/index lines every 5th unit at ~16–20% opacity — both well below the ink layer's contrast so text always wins.
**Kitsch line**: the grid must recede. If a user notices the grid before the content, it's decoration, not structure — no animated grid parallax, no pulsing, no "cute graph paper" novelty. Keep it geometrically perfect (true right angles, one consistent module) and let content occasionally break it on purpose (a specimen slip rotated off-axis against the rigid grid) — the tension between a rigid grid and one deliberately rotated element is where the "real notebook" feeling actually lives, not the grid by itself.

### Stitched binding edge

**Structure**: a saddle-stitch or bound spine — a vertical seam of thread/staple marks along one edge, often with a slight paper-pucker gutter shadow near the fold.

**Translation**: a thin vertical rule at the page container's bound edge with a repeating dash pattern sized to the grid module (not a literal illustrated stitch), plus a subtle linear-gradient gutter shadow (a few percent darker than the base paper) fading outward 24–40px from the spine. One instance per page container — this marks *the* binding, not a repeating decorative border.
**Kitsch line**: no literal thread/cross-stitch illustration (a wavy X pattern reads as scrapbooking). Dash-plus-gutter-shadow is the disciplined version; anything more illustrative is costume.

### Protruding index tabs

**Structure**: small labeled tabs affixed to a page edge, staggered down the fore-edge for wayfinding — brass-toned per this world's palette.

**Translation**: implement as the platform's actual section navigation, not decoration — literally the site's primary nav rendered as tabs. Each tab: a rectangle extending past the page edge (`position: absolute`, negative right offset equal to tab depth, ~24–32px), brass fill or brass-outlined, labeled in Archivo Narrow (the compact technical-text face — see §1c) set small and horizontal or rotated 90° for narrow tabs. Stagger vertically to match real section order; sticky/fixed-position, with real active/hover/focus states.
**Kitsch line**: a tab that doesn't navigate is the failure mode — it must be a real, clickable, keyboard-focusable wayfinding control. Keep the count small (5–8, matching real primary-nav depth); a page with twenty decorative tabs reads as a school-supply catalog, not a research instrument.

### Rubber-stamp impressions

**Structure**: a hand-applied ink stamp — uneven coverage (heavier at the edges where the stamp rocks on contact, lighter or broken in the center), a slight off-horizontal rotation from being applied by hand, occasionally a faint double-hit ghost from a re-stamp.

**Translation**: this is the one place a designed, non-`feTurbulence` texture is worth the cost. Build one SVG stamp asset from 2–3 overlapping, slightly offset copies of the same glyph/shape at different fixed opacities (e.g. 100% plus a 6%-opacity duplicate offset 1–2px) to fake edge-heavy coverage and a double-hit ghost, with a **fixed** (hand-chosen, not randomized) 2–6° rotation baked into the asset's transform. Render in the specified violet stamp ink. Reserve for genuine stamped states only — approval, completion, date-of-record — never as decorative flourish.
**Kitsch line**: do not procedurally randomize rotation/distortion per instance — that reproduces the exact aesthetic failure `feTurbulence` represents, just at the DOM level instead of the filter level. Hand-tune one stamp asset with a fixed, deliberate imperfection and reuse it consistently; a stamp that looks the same everywhere except where deliberately placed differently is more credible than one faking randomness.

### The tipped-in specimen slip

**Structure**: a separately-printed slip glued onto the page at a slight rotation, with either a clean cut edge (straight, slight shadow) or a torn edge (irregular), plus a faint adhesive-shadow halo where glue seeped through.

**Translation**: a card/panel component (embedded images, data results, quoted content) with: a small **fixed, hand-picked** rotation drawn from a short deliberate set (e.g. −1.5°, 0.75°, −0.5° — never runtime-randomized); a drop-shadow offset and soft only on 2–3 sides, mimicking corner-lift rather than a uniform all-around box-shadow (real glued items lift at the corners, not evenly); an edge-treatment choice — cut edge = simple straight border, torn edge = one hand-authored irregular `clip-path: polygon(...)` per edge type, shared as a single reused asset, not generated per instance.
**Kitsch line**: rotation stays under ~3°; bigger tilts read as washi-tape scrapbook sticker, not carefully-glued specimen. Never stack torn edge + heavy shadow + large rotation simultaneously — combining all three "distressed" cues at once is the amateur tell; real tipped-in items usually carry only one or two.

### Marginal annotation marks

**Structure**: real editorial/proofreading convention — the caret (⁁) for insertion, a marginal vertical rule bracketing a flagged passage, a connector line from a margin note to its referent, "stet" (dotted underline) to reverse a strikethrough, a hash (#) for a missing space. These marks have a documented history back to 12th-century Latin manuscript annotation.

**Translation**: a small closed vocabulary of reusable inline SVG marks (not font glyphs, since a margin-rule needs to span a variable-height text run): a caret component for insertions, a bracket-rule component (vertical rule with rounded terminals) for "this paragraph carries a note," a short connector curve (a drafted quadratic bezier, not literally freehand) from margin note to referent. Render exclusively in the oxide-red annotation color, reserved strictly for this system — red means "system/agent commentary on the content," a real, load-bearing UI convention, not a decorative accent available elsewhere.
**Kitsch line**: do not simulate handwriting with a script font for these marks — the fastest route to twee. Every mark stays geometric and drafted (consistent stroke width, deliberate corner treatment) even though its real-world reference is handwritten — the discipline is "a drafted symbol that represents handwriting," not "a font pretending to be handwriting."

### Strike-through-and-re-entry, as a typographic device

**Structure**: the notebook's core "nothing erased" rule — a struck line stays fully legible under its strike, and the correction is written above or immediately after, so both states coexist permanently on the page.

**Translation**: this is the single most conceptually load-bearing motif in the system — the coordinator's brief names it directly as the visual proof that "a procedure improves through use" and that "nothing quietly rewritten," which is also the product's actual governance/audit story, not just a visual flourish. Build it as a real component on top of already-correct semantic HTML (`<del>`/`<ins>`): the deleted text stays at 70–85% opacity (not the near-invisible dimming of a standard diff view — that would defeat the entire point) with one clean, deliberate strike rule through it; the correction appears immediately adjacent, or as a small superscript-position callout above the struck text — showing edit history inline, permanently, rather than hiding it behind a version-diff toggle. Use anywhere the product surfaces revision history: skill-file edit history, protocol version bumps, corrected lesson content, memory updates.
**Kitsch line**: don't fade the struck text toward invisibility (that's just a diff view wearing a costume, and it contradicts the brief's explicit "nothing erased"). Don't over-decorate the strike itself — no wavy "crossed out in crayon" styling. One clean straight rule: ink-black for an author's own correction, oxide-red if it's a system/agent annotation.

### Page numbering & dating conventions

**Structure**: lab notebooks are paginated (often pre-numbered) and every entry is dated at the moment of writing, sometimes time-stamped, occasionally signed/witnessed for audit purposes.

**Translation**: every "page" in the product (a lesson, a memory entry, a skill-file version) carries a persistent page/entry identifier and date stamp in a fixed header/footer position, set in JetBrains Mono (tying directly back to the confirmed monospace pick — a page number *is* a measured value). This is low-effort and high-authenticity: most of this content already has real timestamps in the underlying data; the notebook world just asks that they be surfaced visibly and consistently instead of tucked into a hover tooltip.
**Kitsch line**: don't fake a "handwritten date" look (no script font, no rotation specifically on the date) — the date/page-number is exactly the one place the design should look like an official register entry: monospace, aligned, unrotated, unadorned.

### The exploded-plate grammar

**Structure**: axonometric/parallel-projection exploded technical illustration — components separated along a consistent axis, uniform thin keylines, prior/inactive assembly states ghosted, one flat spot-color on the active/relevant part, numbered call-out boxes connected by dashed leader lines with arrowheads, oversized step numerals — real technical/patent-illustration convention, not an invented style.

**Translation, with concrete specs**:
- **Keyline weight**: a consistent 1px hairline for all structural/inactive geometry — never a variable-width "sketchy" line.
- **Ghosting**: prior/inactive assembly states rendered at ~15–25% opacity of the same 1px keyline — the *same* geometry at a different opacity, not a separately redrawn illustration, so the explosion reads as one true diagram with states rather than several different pictures.
- **Active-part signal**: exactly one flat, unmodulated signal-red fill or stroke on the single currently-relevant part — never more than one red element on screen at once, which is what keeps red a signal rather than a palette choice (and keeps this motif and the marginal-annotation motif from competing for the same color).
- **Call-out boxes**: fixed-ratio rectangles (not circular "comic balloon" shapes), sized 1:1 to the plate's own unit grid, connected to their referent by a dashed leader line (short dash, ~2:1 dash-to-gap ratio) terminating in one consistent arrowhead or dot style, chosen once and never mixed.
- **Step numerals**: oversized (2–3× body size), set in Faculty Glyphic — its moderate contrast holds up well at large sizes in a way a thin hairline serif wouldn't — positioned fixed relative to their part, never run inline with body text.

This is the system's highest-value, most legitimately load-bearing motif for the product's actual UI surfaces: system/architecture diagrams, skill-file dependency views, memory-graph visualizations. It deserves more implementation investment than anything else in this list.
**Kitsch line**: never let the exploded-plate grammar bleed into ordinary UI chrome — buttons, cards, generic nav. It's a diagram grammar for genuine technical/explanatory content, not a decorative motif to sprinkle for texture. The moment a plain marketing section gets a dashed leader arrow pointing at a stat number "for style," the device has been demoted to decoration and stops meaning anything.

Source: https://en.wikipedia.org/wiki/Caret_(proofreading)
Source: https://proofed.com/knowledge-hub/your-ultimate-guide-to-proofreading-marks/
Source: https://www.contentharmony.com/reference/proofreading-symbols/
Source: https://medium.com/@_preranak/how-to-create-exploded-axonometric-drawings-cbab7594dad6
Source: https://thepatentdrawingscompany.com/how-to-present-exploded-views-in-patent-drawings/
Source: https://adibiip.com/patent-drawing/
Source: https://www.hongkiat.com/blog/css-stitched-effect/
Source: https://css-tricks.com/snippets/css/stitched-look/
Source: https://developer.mozilla.org/en-US/docs/Web/CSS/repeating-linear-gradient()
Source: https://www.stefanjudis.com/blog/a-css-based-background-grid-generator/

### Real precedent: institutional/record-book aesthetics done with real design discipline

Two documented, well-known precedents for taking a genuinely utilitarian "record" object and giving it disciplined modern design — worth knowing not as visual mood-boards to copy but as proof this exact translation (functional record object → considered design system) has real, respected prior art:

1. **Field Notes** (Draplin Design Co. × Coudal Partners, founded 2007): the entire brand is a contemporary take on agricultural memo books — the kind crop inspectors and farmers historically carried — set almost entirely in one typeface (Futura), drawing on "the agricultural and industrial confidence of the postwar Midwest." Every notebook edition's product page documents its own paper stock, printing technique, and design rationale as part of the product itself. The transferable lesson: a record-book aesthetic earns its credibility from *specificity and restraint* (one typeface, documented material choices), not from piling on distressed/vintage cues.
   Source: https://en.wikipedia.org/wiki/Field_Notes
   Source: https://allgoodtales.com/brand-story-hero-field-notes/
2. **NASA Graphics Standards Manual** (Danne & Blackburn, 1975/1976, NHB 1430.2): the design-history-canonical example of an institutional technical-documentation system — covering logotype, reproduction art, stationery, forms, and publications in one disciplined, plate-based reference document, produced for a "get-it-done agency." Directly relevant as prior art for the exploded-plate/technical-documentation register this notebook world's system diagrams are meant to carry — it's proof an institutional, forms-and-plates design language can be genuinely celebrated (it's one of the most referenced artifacts in modern design history) rather than reading as dry bureaucratic paperwork.
   Source: https://peoplesgdarchive.org/item/5477/nasas-1976-graphics-standards-manual
   Source: https://standardsmanual.com/products/nasa-graphics-standards-manual
   Source: https://archive.org/details/NASA_Graphics_Standards_Manual

---

## Recommended type stack

**Display (engraved/stamped/plate authority voice)** — **Faculty Glyphic** (OFL 1.1, Koto/Dylan Young, 2024; static single weight, no italic)
Hero headings, section titles, exploded-plate step numerals, index-tab and stamped-header treatments. Capped at 6rem. Hierarchy via size, tracking (−0.02 to −0.03em for most headline sizes, never below the −0.04em floor), and placement — never synthetic weight, which is also materially honest for a face whose real-world references (engraved brass, rubber stamps, cut street signage) are all fixed-impression objects.
*Fallback stack*: `"Faculty Glyphic", "Zilla Slab", Georgia, serif`

**Long-form lesson body** — **Bitter** (OFL, Huerta Tipográfica; variable weight)
Lesson prose, narrative text, table of contents. Clarendon-genre slab with a direct historical claim to "institutional/legal-document" register — the strongest available argument for reading as *record* rather than *literature*.
*Fallback stack*: `"Bitter", "Roboto Serif", Georgia, serif`

**Dense small technical text (tables, captions, figure labels, frontmatter)** — **Public Sans** (OFL 1.1, USWDS/GSA; variable weight), with **Archivo Narrow** (OFL 1.1, Omnibus-Type; variable weight) reserved for the tightest label contexts (index tabs, compact table headers)
Public Sans is the one recommendation in this document with a literal, not analogical, claim to "institutional record" — it was commissioned to be exactly that, for the U.S. government.
*Fallback stack*: `"Public Sans", "Libre Franklin", -apple-system, sans-serif` / `"Archivo Narrow", "Public Sans", sans-serif`

**Monospace (code / data / measurement / terminal-transcript plates only)** — **JetBrains Mono** (OFL 1.1; variable weight, true italics)
Reserved for content that is genuinely code, a timestamp, a duration, a version tag, a measured value, or — the world's defining case — an actual terminal/session transcript rendered as a dark tipped-in plate. No second "mood" monospace.
*Fallback stack*: `"JetBrains Mono", ui-monospace, "SFMono-Regular", monospace`

All four families are OFL-licensed (Public Sans additionally carries a CC0 public-domain dedication on GSA's own modifications), free for commercial use, and self-hostable.

**Explicit cluster checks for this stack**:
- *Not cluster 1* (warm cream ground + high-contrast serif display + terracotta/red accent): this is the cluster this world sits closest to by construction (pale paper ground, serif-adjacent faces), which is exactly why Alegreya was dropped — its literary warmth was the specific quality that collapsed the distance to cluster 1. Bitter's document-register slab character and Public Sans's institutional sans character are deliberately *cooler and more procedural* than a literary old-style serif; oxide-red is reserved exclusively for marginal annotation (a functional signal, not a decorative accent); there is no terracotta in the palette at all.
- *Not cluster 2* (near-black + one neon accent + glowing edges): not a live risk in a pale-ground world by construction — the one place near-black appears at all is the terminal-transcript plate, which is the brief's own explicitly-justified exception, not a decorative choice, and even there no glow/blur treatment is specified — see the texture section's inset-vs-glow discipline carried over from the prior pass as a general principle.
- *Not cluster 3* (broadsheet-editorial hairlines + italic display serif + small tracked mono labels): Faculty Glyphic is upright, moderate-contrast, never italicized; Public Sans/Archivo Narrow's small-text role is functional (real table/caption/label content) rather than a decorative tracked kicker; JetBrains Mono is restricted to real data. All three of cluster 3's defining moves are structurally unavailable in this stack.

---

## Motion vocabulary (named easings/durations)

Retained from the prior pass — the named easings are style-agnostic — with the notebook world's own native motions added per the coordinator's request.

| Token | Value | Use |
|---|---|---|
| `ease-arrival` | `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) | Default entrance for headings, section reveals, a specimen slip settling into its final placed position. |
| `ease-arrival-soft` | `cubic-bezier(0.25, 1, 0.5, 1)` (quart-out) | Secondary/staggered elements; a margin annotation arriving after its referent; a ghosted prior-assembly state resolving to solid. |
| `ease-ink` | `cubic-bezier(0, 0.55, 0.45, 1)` (circ-out) | SVG stroke-dashoffset draws that should read as *written* — strikethrough lines, margin-connector curves, annotation carets. (Reserve strict linear timing for drafted/ruled lines — a call-out box edge, a keyline — which should look mechanically drafted, not hand-marked.) |
| `ease-scrub` | `cubic-bezier(0.87, 0, 0.13, 1)` (expo-in-out) | Scroll-linked/pinned timelines (`scrub: true`) — an exploded plate assembling as the user scrolls. |
| `ease-affordance` | `cubic-bezier(0.34, 1.56, 0.64, 1)` (back-out) | Small UI affordances, and — earning a slightly bigger role in this world than the last — a stamp's landing impact, where a touch of physical overshoot (a stamp can rock slightly on contact) is the honest reference. Never on display type or large reveals. |
| `hermes-house` *(to design)* | GSAP `CustomEase`, hand-tuned SVG path | One bespoke asymmetric expo-out curve as the platform's signature ease, shareable between CSS `cubic-bezier()` and GSAP. |

**This world's native motions**:
- **Annotation arriving in the margin**: the connector line draws first (stroke-dashoffset, `ease-ink`, ~300–400ms), then the annotation mark/text itself appears at the referent end with a short stagger delay (~100–150ms) using `ease-arrival-soft` — the connector should visibly "arrive at" its point before the note appears, not both animate simultaneously, so the causal read (this note is pointing at this thing) stays legible.
- **A line being struck and re-entered above**: two-part sequence, not simultaneous — the strike rule draws across the existing text first (stroke-dashoffset, `ease-ink`, ~300–400ms), *then* the correction fades/rises in above or adjacent (`ease-arrival-soft`, ~150–200ms stagger after the strike completes) — the sequencing itself is the point: strike happens, correction follows, exactly mirroring the "nothing erased, corrected above" rule this motif represents.
- **A stamp landing**: fast, decisive, slightly overshooting scale+settle using `ease-affordance`, short duration (~150–200ms) so it reads as impact rather than a bouncy toy; the ink itself should appear near-instantly (opacity 0→1 in the first ~50ms) rather than fading in, since a real stamp's ink is a hit, not a gradual reveal.
- **A specimen slip being tipped in**: slide + rotate from slightly further off-axis and offset into its final hand-picked resting rotation, settling with `ease-arrival` (confident placement, not a bounce), ~400–600ms — heavier and more deliberate than the stamp's quick impact.
- **An exploded plate assembling along its leader arrows**: each part's dashed leader line draws first as the "rail" (`ease-ink`), then the part itself translates along that axis into resting position (`ease-scrub` if scroll-linked, `ease-arrival` if a timed/triggered sequence), staggered per part so the assembly reads as sequential construction rather than every part snapping in at once.
- **Ghosted prior state resolving to solid**: opacity/stroke-opacity transition from ~20% to 100%, `ease-arrival-soft`, longer duration (500–800ms) than most other motions here — this is a calm, settling confirmation ("this is now the current state"), not an urgent arrival, and should never use a bouncy or dramatic ease.

**Durations** (typical ranges from the researched patterns, not hard values from a single source): text-entrance stagger, ~40–80ms per word/line; SVG line-draws, ~300–1200ms depending on complexity; scroll-pinned scene total scrub distance, 150–300vh per scene; terminal-transcript type-on effect, ~30–60ms per character with a decoupled caret blink at a fixed ~530ms cycle.

**Reveal conventions carried over**: word/line-level stagger (GSAP `SplitText`) for body text, character-level stagger reserved for short hero labels; scroll-pinned scenes follow the Hook→Context→Journey→Climax→Resolution five-beat structure; terminal-typing moments decouple typing timing from caret blink timing.

---

## Motif system rules

1. **One geometry grammar, applied consistently, with one deliberate exception.** Every drafted/structural element (keylines, call-out boxes, the quadrille grid, the stitched-edge dashes) uses the same 1px hairline weight and sharp, undecorated corners. The one deliberate exception is the ink-drawn family (strikethrough, annotation connectors) which uses `ease-ink`'s rounder motion and may carry slightly organic terminals — the system distinguishes *drafted* geometry from *written* geometry on purpose, and that distinction should never blur.
2. **Reduce structure, discard prop detail.** Keep the load-bearing relationship of each motif (the grid's true module, the stamp's edge-heavy ink coverage, the exploded plate's ghost-then-solid state logic) and discard illustrative prop detail (no rendered paperclip, no illustrated pen, no literal photographed coffee-ring). If a motif needs prop illustration to be recognizable, it's being used at the wrong abstraction level.
3. **No full-bleed decorative texture, ever — this world's single easiest failure mode.** The quadrille grid, stamp ink, and paper substrate are all *structural* (grid = alignment system, stamp = real state, substrate = Option C by default per §2). None of them should appear as an all-over decorative wash. A page that looks "distressed" everywhere is a scrapbook; a page where texture shows up in exactly the two or three places it's earned (a stamp on a completion state, a slip glued behind a result, the substrate on a full-bleed cover) is a research instrument.
4. **No skeuomorphic prop cosplay.** No 3D-rendered spiral binding, no drop-shadowed "peeling tape," no fake coffee stains, no illustrated pen/pencil. Everything in §3 is a *drafted symbol referencing* a physical convention (a caret, a dashed leader, a fixed stamp asset), never a literal rendered simulation of the object itself.
5. **Color stays outside both the "warm document" expectation and the near-black-plus-neon expectation.** No sepia/parchment wash, no terracotta or brown "aged paper" tint (the Hermès luxury-house exclusion zone also rules this out independently), and — on the other side — no flat near-black-plus-single-neon-glow anywhere either. Iron-gall blue-black carries the body text, oxide-red is reserved strictly for annotation, violet is reserved strictly for stamps, brass is reserved strictly for tabs/instrument plates, and the one legitimate dark surface (the terminal-transcript plate) earns its darkness materially, not decoratively — see §2's structural-idea framing.
6. **Reserve full literalism for exactly one motif: the strike-through-and-re-entry device.** Every other motif is abstracted (drafted marks, not rendered objects); the strikethrough/correction pattern is allowed to be genuinely literal — legible struck text plus a visible correction — because it is the system's actual governance mechanism, not decoration wearing the notebook's clothes. Earn literalism only where it buys real functional meaning, exactly as literalism was earned by the laurel-completion-state motif in the previous world's system.
7. **Let the monospace carry the record's "measurement" register; let the exploded-plate grammar carry its "explanation" register; keep the two apart.** JetBrains Mono is for things that are counted, timed, or executed. The exploded-plate system is for things that are assembled or explained. A dashed leader arrow pointing at a monospaced number, or a call-out box wrapping a data table, means the two systems are colliding rather than dividing labor — each should stay legible as its own grammar.

---

## Faces I rejected and why

A documented paper trail for the Impeccable-disqualified list from the original pass, extended with the faces this world change specifically retired. Each entry names the specific temptation the face represented, since "it looked good" is not a sufficient rejection reason on its own — the point of this log is to make the reasoning auditable later, across both the original pass and this revision.

**Carried over from the abandoned Greek-world pass** (Impeccable-named disqualifications, unaffected by the world change since the ruleset, not the world, disqualified them):

| Face | Where it would have been reached for | Why it's out |
|---|---|---|
| **Fraunces** | Original top pick for display in the abandoned world — its optical-size/softness/wonk axes make it extremely easy to dial into "elegant carved serif" without real typographic thinking. | Named on the disqualified list. Faculty Glyphic (a genuinely different, purpose-commissioned face) filled its role instead, and remains the pick in this world too. |
| **Playfair Display** | A near-inevitable reach for any "dramatic high-contrast display serif" brief. | Named on the disqualified list. |
| **Cormorant** | Considered as a thin-stroked "manuscript" alternative in the abandoned world. | Named on the disqualified list. Its thin, high-contrast strokes would also collide with cluster 3. |
| **Lora** | The reflexive "safe Google Fonts text serif" default. | Named on the disqualified list. |
| **Crimson (Text)** | The other reflexive "safe old-style text serif" default. | Named on the disqualified list. **Crimson Pro**, a materially different, independently-commissioned redesign, was evaluated separately in §1c on its own merits and is not covered by this exclusion. |
| **Newsreader** | Recommended in the abandoned world's first draft as both secondary display and long-form body face. | Named on the disqualified list. |
| **Syne** | A plausible "expressive geometric display" reach. | Named on the disqualified list. |
| **Space Grotesk** | The single most obvious "tech" sans reach — name-based subject association. | Named on the disqualified list. |
| **Space Mono** | The most tempting monospace pick by name-resonance alone in the abandoned mythic world. | Named on the disqualified list. JetBrains Mono selected on legibility/character-distinction grounds instead, a case that only gets stronger in this world (see §1b). |
| **IBM Plex (all family members)** | Plex Mono was the "safe institutional workhorse" monospace option in the original 1b comparison. | Named on the disqualified list (whole family). Also the technically weakest candidate in that table regardless (no variable-weight Mono build). |
| **Inter (as display)** | The most common "default UI sans," an easy reach for any secondary text role. | Named on the disqualified list (display use). |
| **DM Sans / DM Serif, Outfit, Plus Jakarta Sans, Instrument Sans** | Not in the original candidate set for either world. | Named on the disqualified list; flagged for completeness across both passes. |
| **Instrument Serif** | Genuinely evaluated in the abandoned world as a high-contrast condensed display option. | Direct sibling of banned Instrument Sans; independently, its proportions sit in the same formal family as luxury/fashion serif wordmarks — a direct collision with the "never evoke the fashion house" constraint, on two independent grounds. |

**Newly retired by the world change itself** (not Impeccable-named — excluded because the visual world they served no longer exists, or because a face that was correct for the old world creates a new problem in this one):

| Face | Why it worked in the abandoned world | Why it's out now |
|---|---|---|
| **Alegreya** | Was the long-form body recommendation in the abandoned world, chosen specifically for its calligraphic-literary warmth ("built for literature," a rhythm designed for sustained literary reading). | That exact quality is now the liability: literary warmth on pale cellulose paper is a close paraphrase of disqualified cluster 1 (warm ground + literary serif), just with the accent color changed. Replaced by **Bitter**, chosen instead for a documented Clarendon/legal-document lineage — an "institutional record" argument, not a "beautiful reading" argument. |
| **Cinzel** | Retained in the abandoned world as a narrow accent/ornamental face for chapter numerals and rune-like labels — directly inscriptional, Roman-inscription-derived. | Dropped entirely, not replaced. It belonged specifically to the Greek/Roman-inscription visual world; this notebook world has no equivalent "single ornamental accent word" need, and forcing one in would be reaching for a prop rather than serving a real content role — exactly the discipline this document argues against elsewhere. Stamped/rubber-stamp headers are handled by the rubber-stamp motif's ink treatment (§3), not by a second display typeface. |
| **Marcellus / Marcellus SC** | Same accent role as Cinzel, slightly quieter. | Same reasoning as Cinzel — retired with the world it was built for, not replaced by an equivalent. |
| **Forum** | Retained as a fallback-stack entry alongside Faculty Glyphic in the abandoned world. | No longer needed in the fallback stack now that Faculty Glyphic's fallback role is filled by Zilla Slab (itself independently evaluated and genuinely considered in §1c), which shares more formal DNA with the new world's document register than a quiet Roman-antique serif does. |

**Newly evaluated and set aside in this pass** (researched specifically for the notebook world, considered seriously, not chosen — full reasoning in §1c tables above, summarized here for the paper trail): Roboto Serif, Crimson Pro, Source Serif 4, Zilla Slab (redirected to fallback-stack role rather than fully rejected), and Erode (Fontshare) for long-form body; Libre Franklin for dense technical text (redundant with its own direct descendant, Public Sans).

**Faces confirmed and kept across both passes**: Faculty Glyphic, JetBrains Mono — both re-justified on new, world-specific grounds rather than carried over by default (see §1a, §1b).
