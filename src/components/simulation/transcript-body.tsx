import type { SimEvent } from '@/lib/sim/script'

/**
 * One event, rendered.
 *
 * Shared by the static transcript and the player, so there is exactly one
 * definition of how a tool call or a skill write looks. The player passes a
 * `reveal` string for typed events; the static transcript passes nothing and gets
 * the finished text.
 */
export function EventRow({
  event,
  reveal,
  active = false,
}: {
  event: SimEvent
  reveal?: string | undefined
  active?: boolean
}) {
  const text = reveal ?? ('text' in event ? event.text : '')

  switch (event.t) {
    case 'marker':
      return (
        <li className="mt-[calc(var(--step)*1.1)] flex items-center gap-3 first:mt-0">
          <span className="font-mono text-[0.62rem] tracking-[0.14em] text-ice-faint uppercase">
            {event.label}
          </span>
          <span className="h-px flex-1 bg-ice-faint/40" aria-hidden="true" />
        </li>
      )

    case 'user':
      return (
        <li className="mt-[calc(var(--step)*0.6)] flex gap-3">
          <span className="shrink-0 font-mono text-[0.8125rem] text-ice-faint" aria-hidden="true">
            ›
          </span>
          <span className="font-mono text-[0.8125rem] leading-[1.7] text-ice">
            {text}
            {active && <Caret />}
          </span>
        </li>
      )

    case 'think':
      return (
        <li className="mt-[calc(var(--step)*0.5)] font-mono text-[0.78rem] leading-[1.7] text-ice-dim">
          {text}
        </li>
      )

    case 'say':
      return (
        <li className="mt-[calc(var(--step)*0.6)] max-w-[64ch] leading-[1.6] text-ice">
          {text}
          {active && <Caret />}
        </li>
      )

    case 'tool':
      return (
        <li className="mt-[calc(var(--step)*0.5)] font-mono text-[0.78rem] leading-[1.7] text-ice-dim">
          <span className="text-ice">{event.name}</span>
          {event.args ? <span className="text-ice-faint"> {event.args}</span> : null}
        </li>
      )

    case 'result':
      return (
        <li className="mt-[calc(var(--step)*0.35)]">
          <pre className="overflow-x-auto font-mono text-[0.78rem] leading-[1.75] whitespace-pre-wrap text-ice-dim">
            {event.output}
          </pre>
          {event.truncated ? (
            <p className="mt-1 font-mono text-[0.65rem] text-ice-faint">
              {event.truncated} lines elided
            </p>
          ) : null}
        </li>
      )

    case 'skill':
      return (
        <li className="mt-[calc(var(--step)*0.7)] border-l-2 border-signal pl-3">
          <p className="font-mono text-[0.78rem] text-ice">
            <span className="text-signal">{event.kind}</span> {event.name}
          </p>
          {event.note ? (
            <p className="mt-1 max-w-[60ch] text-[0.9rem] text-ice-dim">{event.note}</p>
          ) : null}
        </li>
      )

    case 'memory':
      return (
        <li className="mt-[calc(var(--step)*0.7)] border-l border-ice-faint pl-3">
          <p className="font-mono text-[0.65rem] tracking-[0.08em] text-ice-faint uppercase">
            {event.layer}
          </p>
          <p className="mt-1 max-w-[60ch] text-[0.9rem] text-ice-dim">{event.note}</p>
        </li>
      )

    case 'agent':
      return (
        <li className="mt-[calc(var(--step)*0.6)] font-mono text-[0.78rem] text-ice-dim">
          <span className="text-ice">{event.kind === 'spawn' ? '⊢' : '⊣'}</span> {event.label}
          {event.note ? <span className="text-ice-faint"> — {event.note}</span> : null}
        </li>
      )

    case 'note':
      return (
        <li className="mt-[calc(var(--step)*0.7)] max-w-[62ch] border-l border-ice-faint pl-3 text-[0.9rem] leading-[1.6] text-ice-dim italic">
          {event.text}
        </li>
      )

    case 'wait':
      return null

    default:
      return null
  }
}

/** The typing cursor. Pure decoration, so it never reaches assistive tech. */
function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1em] w-[0.5ch] translate-y-[0.12em] bg-ice"
    />
  )
}
