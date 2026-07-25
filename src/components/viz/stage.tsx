import type { ReactNode } from 'react'

/**
 * Primitives for the technical plates.
 *
 * SVG rather than canvas, deliberately: node counts are small, and SVG gives real
 * text a screen reader can read, focusable elements, and CSS-variable theming from
 * the design tokens. A canvas diagram is a picture of words.
 *
 * Every plate is informational, not decorative — unlike the background field — so
 * each carries a title and description, and the surrounding lesson prose states the
 * same facts in sentences. The plate is never the only place a claim appears.
 *
 * Depth here follows design.md: hairlines at 1px, no shadows, nearer things lighter
 * and larger. The signal colour appears only where something changes.
 */

/**
 * Which step of a mechanism an element belongs to.
 *
 * Plates that depict a sequence tag their parts with a beat, and a scroll scene can
 * then advance through them at the reader's own pace. Purely an annotation: it changes
 * nothing about how the plate renders, so a plate with beats is complete and correct
 * as static SVG whether or not anything ever reads them.
 */
type Beat = { beat?: number | undefined }
const beatOf = ({ beat }: Beat) => (beat === undefined ? {} : { 'data-beat': beat })

export function VizStage({
  title,
  description,
  width = 720,
  height = 420,
  children,
}: {
  /** Names the plate. Read first by assistive tech. */
  title: string
  /** What the plate shows, in a sentence. Not a caption — an alternative. */
  description: string
  width?: number
  height?: number
  children: ReactNode
}) {
  // Deterministic ids from the title, so server and client markup agree.
  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-labelledby={`${base}-title ${base}-desc`}
      className="h-auto w-full"
      // Text scales with the plate rather than the root font size, which keeps
      // labels inside their boxes at every width.
      fontFamily="var(--font-mono)"
    >
      <title id={`${base}-title`}>{title}</title>
      <desc id={`${base}-desc`}>{description}</desc>
      {children}
    </svg>
  )
}

/** A bounded object: a file, a store, a process. The plate's nouns. */
export function VizBox({
  x,
  y,
  w,
  h,
  label,
  sublabel,
  tone = 'plain',
  beat,
}: Beat & {
  x: number
  y: number
  w: number
  h: number
  label: string
  sublabel?: string | undefined
  /**
   * `plain` — an ordinary object.
   * `near` — nearer plane; lighter, for the thing under discussion.
   * `ghost` — a superseded or inactive state, drawn but discounted.
   * `signal` — something changing. Never decorative.
   */
  tone?: 'plain' | 'near' | 'ghost' | 'signal'
}) {
  const stroke = {
    plain: 'var(--color-ice-faint)',
    near: 'var(--color-ice-dim)',
    ghost: 'var(--color-ice-faint)',
    signal: 'var(--color-signal)',
  }[tone]

  const fill = tone === 'near' ? 'var(--color-deep)' : 'transparent'
  const text = tone === 'ghost' ? 'var(--color-ice-faint)' : 'var(--color-ice)'

  return (
    <g opacity={tone === 'ghost' ? 0.45 : 1} {...beatOf({ beat })}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={fill}
        stroke={stroke}
        strokeWidth={1}
        strokeDasharray={tone === 'ghost' ? '3 3' : undefined}
      />
      <text x={x + 10} y={y + 20} fill={text} fontSize={12}>
        {label}
      </text>
      {sublabel && (
        <text x={x + 10} y={y + 36} fill="var(--color-ice-dim)" fontSize={10}>
          {sublabel}
        </text>
      )}
    </g>
  )
}

/**
 * A budget drawn as a budget.
 *
 * Where a plate states a cap, it shows the proportion rather than printing the
 * number and asking the reader to imagine it.
 */
export function VizMeter({
  x,
  y,
  w,
  used,
  total,
  label,
  beat,
}: Beat & {
  x: number
  y: number
  w: number
  used: number
  total: number
  label: string
}) {
  const ratio = Math.max(0, Math.min(1, used / total))
  return (
    <g {...beatOf({ beat })}>
      <rect x={x} y={y} width={w} height={6} fill="none" stroke="var(--color-ice-faint)" strokeWidth={1} />
      <rect x={x} y={y} width={w * ratio} height={6} fill="var(--color-ice-dim)" />
      <text x={x} y={y + 20} fill="var(--color-ice-dim)" fontSize={10}>
        {label}
      </text>
    </g>
  )
}

/**
 * A relationship.
 *
 * The four kinds are semantic, not stylistic, and `absent` is the reason this is a
 * closed set: a plate whose payload is *an arrow that does not exist* cannot share a
 * name with an arrow that merely carries a correction. So `change` is the signal
 * colour used for something happening, and `absent` is reserved for a path the
 * software deliberately does not have — drawn, then visibly stopped.
 */
export function VizEdge({
  from,
  to,
  label,
  kind = 'solid',
  arrow = false,
  breakAt,
  beat,
}: Beat & {
  from: [number, number]
  to: [number, number]
  label?: string | undefined
  /**
   * `solid` — always, unconditionally.
   * `ondemand` — conditional: it happens sometimes, on a trigger.
   * `change` — something is written or corrected. Signal.
   * `absent` — the path that does not exist. Signal, and stopped.
   */
  kind?: 'solid' | 'ondemand' | 'change' | 'absent'
  arrow?: boolean
  /** Where an `absent` edge is stopped. Defaults to the midpoint. */
  breakAt?: [number, number] | undefined
}) {
  const [x1, y1] = from
  const [x2, y2] = to
  const signal = kind === 'change' || kind === 'absent'
  const stroke = signal ? 'var(--color-signal)' : 'var(--color-ice-faint)'
  const dashed = kind === 'ondemand' || kind === 'absent'

  // The arrowhead is drawn rather than declared as a marker: markers need document
  // ids, and plates share a page.
  const angle = Math.atan2(y2 - y1, x2 - x1)
  const head = (length: number, spread: number) =>
    [
      `${x2},${y2}`,
      `${x2 - length * Math.cos(angle - spread)},${y2 - length * Math.sin(angle - spread)}`,
      `${x2 - length * Math.cos(angle + spread)},${y2 - length * Math.sin(angle + spread)}`,
    ].join(' ')

  const [bx, by] = breakAt ?? [(x1 + x2) / 2, (y1 + y2) / 2]

  if (kind === 'absent') {
    // Drawn in two halves. Up to the stop it is a real intention, at full weight;
    // past the stop it is only where the arrow *would* have gone, so it drops to a
    // ghost. Without that fall-off the line reads as a path that got through.
    return (
      // The beat belongs on both return paths. It was on the second one only, so a
      // broken edge — which is exactly the kind a sequence wants to reveal late —
      // ignored its beat and was drawn from the first frame.
      <g {...beatOf({ beat })}>
        <line
          x1={x1}
          y1={y1}
          x2={bx}
          y2={by}
          stroke={stroke}
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <g opacity={0.28}>
          <line
            x1={bx}
            y1={by}
            x2={x2}
            y2={y2}
            stroke={stroke}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          {arrow && <polygon points={head(7, 0.42)} fill={stroke} />}
        </g>
        {/* The stop is an ×, not a bar: a bar laid across a line that is being
            stopped *by a wall* is indistinguishable from another wall. */}
        {[Math.PI / 4, -Math.PI / 4].map((offset) => (
          <line
            key={offset}
            x1={bx - 7 * Math.cos(angle + offset)}
            y1={by - 7 * Math.sin(angle + offset)}
            x2={bx + 7 * Math.cos(angle + offset)}
            y2={by + 7 * Math.sin(angle + offset)}
            stroke="var(--color-signal)"
            strokeWidth={2}
          />
        ))}
      </g>
    )
  }

  return (
    <g {...beatOf({ beat })}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={1}
        strokeDasharray={dashed ? '4 4' : undefined}
      />
      {arrow && <polygon points={head(7, 0.42)} fill={stroke} />}
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 6}
          fill="var(--color-ice-dim)"
          fontSize={10}
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  )
}

/**
 * A wall. Something the software will not let across.
 *
 * `door` cuts an opening at an absolute x range, which is how a barrier that permits
 * exactly one thing — a whitelist — is drawn honestly: a wall with one gap in it,
 * rather than a wall the permitted arrow simply ignores.
 */
export function VizBarrier({
  x,
  y,
  w,
  door,
  beat,
}: Beat & {
  x: number
  y: number
  w: number
  door?: [number, number] | undefined
}) {
  const spans: Array<[number, number]> = door
    ? [
        [x, door[0]],
        [door[1], x + w],
      ]
    : [[x, x + w]]

  return (
    <g {...beatOf({ beat })}>
      {spans
        .filter(([start, end]) => end > start)
        .map(([start, end]) => (
          <rect
            key={start}
            x={start}
            y={y}
            width={end - start}
            height={3}
            fill="var(--color-ice-dim)"
          />
        ))}
    </g>
  )
}

/** A note pinned to part of the plate. The plate's own marginalia. */
export function VizNote({
  x,
  y,
  children,
  width = 200,
  beat,
}: Beat & {
  x: number
  y: number
  children: string
  width?: number
}) {
  // SVG has no text flow, so wrapping is computed from the monospace advance
  // width: at font-size 10 a character occupies very close to 6px, and rounding
  // that down was clipping the last word of every right-hand note.
  const words = children.split(' ')
  const lines: string[] = []
  let line = ''
  const perLine = Math.floor(width / 6.1)
  for (const word of words) {
    if (line && (line + ' ' + word).length > perLine) {
      lines.push(line)
      line = word
    } else {
      line = line ? line + ' ' + word : word
    }
  }
  if (line) lines.push(line)

  return (
    <text x={x} y={y} fill="var(--color-ice-dim)" fontSize={10} {...beatOf({ beat })}>
      {lines.map((text, index) => (
        <tspan key={index} x={x} dy={index === 0 ? 0 : 13}>
          {text}
        </tspan>
      ))}
    </text>
  )
}
