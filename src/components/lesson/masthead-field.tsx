import { planLessonField } from '@/lib/field/plan'
import type { CurriculumGraph } from '@/lib/graph'

/**
 * The lesson masthead: the curriculum field, composed.
 *
 * A lesson used to open on an eyebrow, a title, a description and a rule — well set, and
 * exactly the editorial restraint `06-direction-calibration.md` records the author
 * rejecting outright when it was shown to them as by-kin.com. This is the answer to the
 * question that file leaves open: whether the lit direction survives next to two thousand
 * words of prose.
 *
 * It survives by doing a job. The band shows what a reader opening a lesson genuinely
 * wants to know — everything they were supposed to understand first, receding by
 * prerequisite depth, with this lesson nearest and lit. The margin already said this in
 * words ("comes after 8 lessons"); saying it as distance is both shorter and truer,
 * because the chain has a shape and the sentence does not.
 *
 * The five things `06` named as missing from the first build are each answered here:
 *
 * - **Typography inside the field** — the depth axis runs up the left edge as real
 *   numbers on the planes they label. A module caption and an axis title were tried
 *   too and cut: both landed on the graticule where it is densest, and one of them
 *   repeated the eyebrow directly beneath. Type in a drawing has to be doing a job.
 * - **A composed frame** — the near depth planes run wider than the band, so the field
 *   is cropped by its frame rather than floating inside it. The caption rule closes it
 *   at the bottom.
 * - **A structural overlay** — the graticule is a second system laid over the field,
 *   with drop lines anchoring the lit chain to the plane each lesson stands on. The
 *   prerequisite lines are no longer doing double duty as content and texture.
 * - **A moment** — the chain draws itself once on arrival, shallowest link first.
 * - **Hierarchy beyond radius** — three materials, and a registration bracket on the
 *   subject. Radius is capped for everything else, because perspective alone made a
 *   near context node larger than the lesson the page is about.
 *
 * Everything is server-rendered SVG. There is no canvas, no WebGL and no client
 * JavaScript: a reader's place in the curriculum does not change while they read, so
 * there is nothing to drive per frame, and a lesson page has about two kilobytes of
 * first-party budget left. The one piece of motion is a CSS stroke reveal whose resting
 * state is the finished drawing, so a stalled clock or `prefers-reduced-motion` lands on
 * the complete figure rather than an empty band.
 */
export function MastheadField({
  graph,
  focusIndex,
}: {
  graph: CurriculumGraph
  focusIndex: number
}) {
  const plan = planLessonField(graph, focusIndex)

  // A lesson with nothing behind it has no chain to draw, and a band containing one
  // sphere is a worse opening than no band. Module 1 lesson 1 keeps the plain header.
  if (plan.ancestorCount === 0) return null

  const { width, height } = plan

  return (
    <figure className="masthead-field not-prose" aria-labelledby="masthead-caption">
      {/*
        `h-auto` with the viewBox governing the aspect, deliberately rather than a fixed
        height plus `slice`. Slicing cropped the corridor's sides at prose width, which
        is how the first version ended up as a few dots floating in a wide empty band —
        the composition was there and simply outside the box being shown.
      */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid meet"
        className="block h-auto w-full"
        role="img"
        aria-labelledby="masthead-caption"
      >
        {/* The structural overlay: one ground rule per depth plane, converging because
            the space is real. Igloo's constellation wireframe over terrain is the
            reference — the point is that it is a second system, not the content's own
            edges pressed into service as texture. */}
        {plan.ticks.map((tick, index) => (
          <g key={index}>
            <line
              x1={tick.x}
              y1={tick.y}
              x2={tick.x2}
              y2={tick.y}
              stroke="var(--color-ice-faint)"
              strokeWidth="1"
              opacity={tick.current ? 0.9 : 0.3}
            />
            {/* --ice-faint is a hairline colour and fails AA as text at any size; the
                repo's axe gate caught exactly that once. Depth is carried by opacity
                on a colour that passes instead. */}
            {tick.label !== '' && (
              <text
                x={tick.labelX}
                y={tick.y + 4}
                textAnchor={tick.labelAnchor}
                fill="var(--color-ice-dim)"
                className="font-mono"
                // In viewBox units, so this scales with the figure: about 10px on a
                // desktop lesson column. The caption below states the depth in real
                // selectable text, which is what a reader on a phone actually reads —
                // these numbers are the axis, not the statement.
                fontSize="17"
                letterSpacing="0.06em"
                opacity={tick.current ? 1 : 0.5}
              >
                {tick.label}
              </text>
            )}
          </g>
        ))}

        {/* Prerequisite edges. The reveal runs deepest-first: `length` is the real
            screen length of each segment, so a long span takes longer to draw than a
            short one and the chain arrives at this lesson last. */}
        <g className="masthead-chain">
          {plan.edges.map((edge, index) => (
            /* No dasharray or dashoffset here on purpose. The resting state of this
               line is *drawn*; the reveal is added by CSS only where motion is
               welcome. Encoding "hidden" as the base state is how three separate
               bugs in this repo ended up with a blank page on a throttled clock. */
            <line
              key={index}
              x1={edge.x1}
              y1={edge.y1}
              x2={edge.x2}
              y2={edge.y2}
              stroke="var(--color-ice-dim)"
              strokeWidth="1"
              opacity={edge.opacity}
              style={{
                ['--len' as string]: `${edge.length}`,
                ['--i' as string]: `${edge.order}`,
              }}
            />
          ))}
        </g>

        {/* Drop lines, tying the lit chain to the depth plane each lesson stands on.
            Without them the spheres float over the graticule and the two systems read
            as two drawings sharing a box. */}
        {plan.nodes
          .filter((node) => node.groundY !== null)
          .map((node, index) => (
            <line
              key={`drop-${index}`}
              x1={node.x}
              y1={node.y + node.r * 0.6}
              x2={node.x}
              y2={node.groundY!}
              stroke="var(--color-ice-faint)"
              strokeWidth="1"
              opacity={node.role === 'focus' ? 0.7 : 0.34}
            />
          ))}

        {/* The field. Body then highlight, so the specular lobe sits on the solid
            rather than being blended into it. */}
        {plan.nodes.map((node, index) => (
          <g key={index} opacity={node.opacity}>
            <circle cx={node.x} cy={node.y} r={node.r} fill={node.fill} />
            {node.r > 3 && (
              <circle
                cx={node.highlight.x}
                cy={node.highlight.y}
                r={node.highlight.r}
                fill={node.highlight.fill}
                opacity="0.9"
              />
            )}
          </g>
        ))}

        {/* The subject, bracketed. Four corner marks rather than a ring: this guide's
            whole visual register is technical drawing, and a drawing points at things
            with registration marks. It also survives the sphere being any size. */}
        {plan.focus && (
          <g stroke="var(--color-ice)" strokeWidth="1.25" fill="none" opacity="0.85">
            {[
              [-1, -1],
              [1, -1],
              [-1, 1],
              [1, 1],
            ].map(([sx, sy], index) => {
              const d = plan.focus!.r + 11
              const arm = 7
              const cx = plan.focus!.x + sx! * d
              const cy = plan.focus!.y + sy! * d
              return (
                <path
                  key={index}
                  d={`M ${cx - sx! * arm} ${cy} L ${cx} ${cy} L ${cx} ${cy - sy! * arm}`}
                />
              )
            })}
          </g>
        )}

        {/* The typography inside the field is the depth axis and nothing else.
            A module label and an axis caption were tried here and removed: both
            landed on top of the graticule at the one place it is densest, and the
            module label repeated the eyebrow sitting directly underneath. The
            numbers running up the left edge are type doing a job; the rest was
            type decorating a drawing, which is the thing this project bans. */}
      </svg>

      <figcaption
        id="masthead-caption"
        className="mt-[calc(var(--step)*0.4)] flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-ice-faint pt-[calc(var(--step)*0.35)] font-mono text-[0.68rem] tracking-[0.08em] text-ice-dim"
      >
        {/* No module label here: the eyebrow immediately below this caption already
            names the module, and printing it twice a centimetre apart is the kind of
            duplication that reads as an unfinished template. */}
        <span>
          {plan.ancestorCount} {plan.ancestorCount === 1 ? 'lesson' : 'lessons'} stand
          behind this one
        </span>
        <span>
          depth {plan.depth} of {plan.maxDepth}
        </span>
      </figcaption>
    </figure>
  )
}
