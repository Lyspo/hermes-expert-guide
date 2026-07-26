# Direction calibration — the author reacted to real sites

**Status: this is the input `05-direction-exploration.md` said was missing.** That file's
best suggestion for unblocking the design question was:

> "The author may be judging against an internal reference not yet articulated.
> landonorris.com was the one concrete example given and it was informative. More
> examples — three or four sites they actually admire, with what specifically works —
> would be worth more than any further generation."

On 2026-07-26 that happened. Ten sites were put in front of the author, each one visited
and screenshotted rather than described from a listicle, and each got a specific
reaction. This file records them, because reactions to real work are the most valuable
design input this project has and they must not be lost the way the prototypes nearly
were.

---

## The reactions, verbatim in substance

**Ranked as aesthetic direction:**

| | Site | The author's reaction |
|---|---|---|
| 1= | **activetheory.net** | "What did I even just watch. Incredible design and animations, the effects and 3d are breathtaking." |
| 1= | **igloo.inc** | "Favorite design and creative technology, totally shocked." |
| 3 | **lusion.co** | "Nice 3d effects, could be used once or twice." |
| 4 | **landonorris.com** | "Components and effects are through the roof, totally fan of the variety of animations and integrations. **Not my favorite colors.**" |
| 5 | **basement.studio** | "Very nice flows and effects, could be used once, quite original. The rest of the website is basic." |
| 6 | **bruno-simon.com** | "Impressive technology, not sure how it could fit on our platform." |
| 7 | **press.stripe.com** | "Interesting effects, quite monotone and repetitive." |
| 8 | **by-kin.com** | "Interesting but not really my style." |

**Named as *functional* rather than aesthetic** — features to implement, not looks to copy:

- **linear.app** — "fantastic features that can/should be implemented in the courses."
- **ciechanow.ski** — "great 3d and visualizations, could also be used sporadically."

That distinction is the author's own and it is worth preserving: two of the ten were
filed under what the guide should *do*, not how it should look.

---

## The correction that unblocks this

An earlier note in this session told the author that Active Theory sits in banned cluster
#2. **That was wrong, and the error mattered**, because it labelled their favourite site
as forbidden by their own rules.

`01-reference-sites.md` §"Active Theory (studio site)" had already evaluated it and
approved it, in these words: an ASCII/glyph-density circle, *"dim teal-on-black, no color
gradient, no box-glow… monospace used as literal procedural/generative rendering, not as
a technical-sounding costume."* It is filed there as an example of techniques that
**survive** the slop list.

The banned-cluster label belongs to **prototype `09-the-field.html`**, where this
project's own execution of that idea was near-black + neon + CSS glow. `05` records the
author liked the *idea* and the execution was rejected.

**So the rule was never the blocker.** The distinction the ruleset actually draws:

| Banned | Sanctioned |
|---|---|
| `box-shadow` glow, gradient chrome, neon accents applied as decoration | Luminance that comes out of real geometry, real lighting, or real procedural density |
| A dark surface with effects painted on it | A dark surface with something actually rendered in it |

Active Theory and Igloo are both on the right-hand side. Prototype 09 was on the left.
Thirteen prototypes did not converge partly because that line was being drawn in the
wrong place — the look was refused when only the shortcut should have been.

---

## What this says the direction is

Cold, dark, and genuinely rendered. Specifically, and each point traceable to a reaction
above rather than to taste:

1. **Real 3D with real lighting, not effects on a flat surface.** Igloo (#1) and Lusion
   (#3) both win on this; Stripe Press was marked down as "monotone and repetitive"
   precisely because its 3D is a repeated static object rather than a place.
2. **Wireframe or glyph structure drawn over rendered form.** Igloo's constellation lines
   over terrain; Active Theory's glyph-density disc. Both are structure made of real
   marks. This is also, exactly, what a curriculum graph over a rendered field would be.
3. **Variety of components and integrations.** Lando Norris was praised for "the variety
   of animations and integrations" while its palette was rejected — so the lesson from it
   is the component range, not the light ground.
4. **A signature moment, used once.** Basement and Lusion were both marked "could be used
   once or twice." Those are set pieces, not a system.
5. **The palette is already right.** `--void` is a cool near-black with a green-blue bias
   and `--ice` is a cool white; Active Theory's dim-teal-on-black is a near neighbour.
   Nothing in the token table needs to change for this direction.

**And what it is not.** by-kin's editorial restraint was rejected outright, and Stripe
Press's repetition was called out. That is a direct verdict on the current Substrate
build, which is closer to by-kin than to anything in the top three.

---

## Where the functional half goes

Linear and Ciechanowski were filed separately by the author, and the separation should
hold in the build:

- **Linear** — density, keyboard-first navigation, real product surfaces shown rather
  than described, and the discipline that keeps a dark page readable at length. It is
  also the only site in the whole set that carries a real reading load, which is the
  constraint every one of the others gets to ignore.
- **Ciechanowski** — operable figures *inside* the prose. Every diagram is a thing you
  drive rather than look at. The guide already has six static plates and a scrubbing
  engine; this is the bar they should be raised to, sporadically rather than everywhere.

---

## The constraint that still binds

Four of the five top-ranked sites carry almost no text. Igloo, Active Theory, Lusion and
Basement are experiences you pass through in ninety seconds; this guide is fifty-one
lessons someone studies. Whatever is taken from them has to survive being placed next to
two thousand words of prose.

That tension is real and it is not a reason to refuse the direction — it is the thing the
first build has to prove. Test it on one surface before committing the whole system to it.

---

## First build against this direction, and the verdict on it

The curriculum map was rebuilt as a lit field — real perspective, spheres shaded from a
reconstructed normal with a specular term, prerequisite depth as the third axis, the
seventy-nine prerequisites drawn as lines through it. Commit `6c6cdcc`.

**The author's verdict, and it is the operative fact for the next session:**

> "Direction is alright, still looks extremely basic / not designed — but if you're only
> working on the functionality aspect for now, all good."

Read that precisely, because it is not a rejection and it is not an approval:

- **The direction survived.** Lit geometry over flat drawing was not the thing objected
  to. Nobody said go back.
- **The execution is not designed yet.** A shaded sphere is a *material*, not a design.
  What the field currently has is physics and no composition: no hierarchy beyond size,
  no typography in or around the drawing, no framing, no rhythm, no moment. Igloo is not
  admired because its spheres are lit — it is admired because a lit igloo sits in a
  composed landscape with a wireframe system laid over it and a considered frame around
  it.
- **The gap is composition, not fidelity.** Turning up the shader will not close it.

### What "designed" would plausibly mean here, unbuilt

Named so the next session starts from a list rather than from a blank:

1. **Typography inside the field.** Module numbers, depth labels, a legend — set in the
   real type stack, positioned in 3D. Active Theory's glyph-density disc is *type as
   rendering*; there is currently no type in this drawing at all.
2. **A composed frame.** Igloo's scene has a horizon, a foreground and a vignette. The
   field is currently a rectangle with points in the middle of it.
3. **A structural overlay.** Igloo's constellation wireframe is a second system drawn
   *over* the terrain, not the terrain's own edges. Here the prerequisite lines are
   doing double duty as both content and texture, and they are neither.
4. **A moment.** Basement and Lusion were both praised as "could be used once." The map
   has no arrival, no transition, no single thing that happens.
5. **Hierarchy beyond radius.** Fifty-one nodes currently differ only in size and
   readiness tint. Modules are not visible as groupings at all.

### The unresolved question, still unresolved

Whether any of this survives next to two thousand words of prose. The map is the easy
case — a map is *meant* to be a field. A lesson page is the real test and has not been
attempted.

---

## Second build against this direction: a lesson page (2026-07-27)

The section above ends by naming the unresolved question — whether any of this survives
next to two thousand words of prose — and calling a lesson page the real test. This is
that test, and it is the first time the direction has been applied to a reading surface.

**What was built.** A masthead band at the top of every lesson that has prerequisites:
the whole curriculum as a corridor receding by prerequisite depth, with this lesson
bracketed and lit, its transitive prerequisite chain drawn as a constellation over the
field, and the remaining lessons as context. `src/lib/field/plan.ts` computes it;
`src/components/lesson/masthead-field.tsx` emits it.

**It is precomputed SVG, not WebGL, and that is a design decision rather than a
shortcut.** A reader's position in the curriculum does not change while they read, so
there is nothing to drive per frame. The lighting is `field-renderer.ts`'s lighting
evaluated once per sphere instead of once per fragment — same direction, same lambert,
same specular exponent, same falloff, same three materials — so the two surfaces are one
system. Cost to a lesson page: **zero client JavaScript**. The lesson budget is unchanged
at +6.0 kB against its 8 kB allowance.

### Against the five named items

| | Answered by |
|---|---|
| Typography inside the field | The depth axis, as real numbers on the planes they label |
| A composed frame | Near depth planes run wider than the band, so the field is cropped rather than floating |
| A structural overlay | The graticule, plus drop lines anchoring the lit chain to its plane |
| A moment | The chain draws itself once on arrival, shallowest link first, in CSS |
| Hierarchy beyond radius | Three materials and a registration bracket; radius capped so perspective cannot make a context node outrank the subject |

### What went wrong on the way, since the same mistakes are available next time

- **The first version drew only this lesson's own chain.** Four dots in an empty band —
  the identical "physics, no composition" verdict, reproduced at a smaller size. Density
  is not decoration: a field needs enough in it to be a place, and the curriculum has
  fifty-one real things to put there.
- **The spread was guessed and wrong.** `layout()` returns x ≈ ±0.39 and y ≈ ±0.28, not
  the unit range it looks like it should. Scaling by eye produced a 187×29 pixel smudge
  in a 1200×420 box with forty-five of the fifty-one nodes at seven percent opacity.
  Measuring took one dump and fixed it; three rounds of eyeballing had not.
- **`preserveAspectRatio="slice"` cropped the composition away.** It was there and simply
  outside the box being shown.
- **Type was added to the field and then removed again.** A module caption and an axis
  title both landed on the graticule where it is densest, and the module caption repeated
  the eyebrow a centimetre below it. Type in a drawing has to be doing a job.
- **The depth numbers overprinted into a smudge** at the vanishing point, and the first
  fix — thin the labels but always force the current depth — put that number hard against
  its neighbour. Both are now geometry in `plan.ts` with a test asserting clearance.

### The honest verdict on it, unprompted

This is better than the editorial column it replaces, and it is defensibly *composed*
rather than merely lit: it has a subject, a ground, an overlay, a crop and a moment. It
is also **not yet at the bar the brief sets**. Specifically, and worth someone's judgement
rather than another round of my own:

- The image is atmospheric but **low in contrast** — it reads as murk before it reads as
  depth, particularly above the fold on a bright screen.
- **The chain reads as a web, not as a path.** Prerequisite edges connect lessons whose
  field positions are unrelated to their depth, so the constellation is tangled where the
  idea ("how far back does this go") wants a line.
- The **shallow lessons are weak**. At depth 1–2 there is very little chain and the band
  is carrying almost no information; the deep ones (module 10, twenty lessons behind) are
  where it earns its space.
- It has had **no reaction from the author**, and everything above is self-assessment.

The open question from the first build is now partly answered: the direction *does*
survive next to prose, because it can be given a job and kept out of the reading column.
Whether this particular execution is wanted is a separate question and is not settled.
