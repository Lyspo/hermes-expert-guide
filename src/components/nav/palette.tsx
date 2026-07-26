'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { parseIndex, search, type Entry, type Kind } from '@/lib/palette'

/**
 * The command palette.
 *
 * It exists because the largest thing a learning surface can do is make the next action
 * reachable without a decision. Fifty-one lessons, ten modules, fifty-nine glossary
 * terms and nine sheets are one keystroke and three letters away from anywhere,
 * including from inside a lesson, which is what stops the curriculum feeling like a
 * corridor you can only walk in one direction.
 *
 * Three things it deliberately is not:
 *
 * **Not shipped until asked for.** The index is fetched from `public/palette.json` on
 * first open and cached for the session. A reader who never presses ⌘K downloads
 * nothing, which is the only defensible way to add a global feature to pages already
 * over their JavaScript budget.
 *
 * **Not a replacement for search.** Pagefind full-text search still lives at `/search/`
 * and is what a reader without JavaScript gets from the header link. This matches
 * titles, which is a different and faster job.
 *
 * **Not glass.** `design.md` bans blur and glassmorphism as decoration. This is the
 * nearest depth plane — `--raise` — with a hairline and a plain scrim, which is how
 * every other floating thing on this site declares itself.
 */

/** Session-lived, so reopening the palette never refetches. */
let cache: Entry[] | null = null

const KIND_LABEL: Record<Kind, string> = {
  lesson: 'lesson',
  module: 'module',
  term: 'glossary',
  sheet: 'sheet',
}

export function Palette({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const [entries, setEntries] = useState<Entry[]>(cache ?? [])
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const listId = useId()

  useEffect(() => {
    input.current?.focus()
  }, [])

  useEffect(() => {
    if (cache) return
    let live = true
    fetch('/palette.json')
      .then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
      .then((value: unknown) => {
        cache = parseIndex(value)
        if (live) setEntries(cache)
      })
      // A failed fetch is not an empty index. Saying "nothing matched" when the index
      // never arrived would be a lie the reader cannot diagnose.
      .catch(() => live && setFailed(true))
    return () => {
      live = false
    }
  }, [])

  const results = useMemo(() => search(entries, query), [entries, query])

  // Keeps the highlight inside the list when the query shortens it.
  const active = Math.min(selected, Math.max(0, results.length - 1))

  useEffect(() => {
    list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active, results.length])

  const go = (entry: Entry | undefined) => {
    if (!entry) return
    onClose()
    router.push(entry.u)
  }

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key === 'ArrowDown' || (event.key === 'n' && event.ctrlKey)) {
      event.preventDefault()
      setSelected((current) => (results.length === 0 ? 0 : (current + 1) % results.length))
      return
    }
    if (event.key === 'ArrowUp' || (event.key === 'p' && event.ctrlKey)) {
      event.preventDefault()
      setSelected((current) =>
        results.length === 0 ? 0 : (current - 1 + results.length) % results.length
      )
      return
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      go(results[active])
    }
  }

  /**
   * Portalled to `document.body`, and this is not optional.
   *
   * The trigger lives in `<header class="plane">`, and `.plane` sets `z-index: 1`,
   * which creates a stacking context. A `z-50` descendant of that header is still
   * confined to it, so the main content — a later sibling with the same `z-index: 1` —
   * paints straight over the dialog. The visible symptom was a see-through palette with
   * lesson prose showing through its own result rows.
   *
   * A modal belongs at the top of the document, not wherever the thing that opened it
   * happens to sit.
   */
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      // A plain scrim. No blur: `design.md` refuses glass as decoration, and a blurred
      // backdrop over a field of moving points is expensive as well as banned.
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-void/80" aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Jump to"
        onKeyDown={onKeyDown}
        className="relative w-full max-w-[36rem] border border-ice-faint bg-raise"
      >
        <div className="flex items-center gap-3 border-b border-ice-faint px-4 py-3">
          <span aria-hidden="true" className="font-mono text-[0.8rem] text-ice-dim">
            ❯
          </span>
          <input
            ref={input}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setSelected(0)
            }}
            // The combobox pattern: the input keeps focus and owns the keyboard, and the
            // active option is announced through aria-activedescendant rather than by
            // moving focus into the list.
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            {...(results[active] ? { 'aria-activedescendant': `${listId}-${active}` } : {})}
            aria-label="Search lessons, modules, glossary and cheatsheets"
            placeholder="Jump to a lesson, term or sheet"
            spellCheck={false}
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent text-[0.95rem] text-ice outline-none placeholder:text-ice-dim"
          />
          <kbd className="shrink-0 font-mono text-[0.65rem] text-ice-dim">esc</kbd>
        </div>

        <ul ref={list} id={listId} role="listbox" aria-label="Results" className="max-h-[52vh] overflow-y-auto">
          {results.map((entry, index) => (
            <li
              key={entry.u}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === active}
              data-active={index === active}
              onMouseMove={() => setSelected(index)}
              onClick={() => go(entry)}
              // Selection is a lift in luminance, not a drop. The panel already sits on
              // `--raise`, so highlighting with `--deep` made the active row *recede* —
              // backwards against the one rule the palette shares with everything else
              // here: a thing is nearer because it is lighter. Same mechanism as the
              // search `<mark>` in globals.css, and not the signal colour, because a
              // selection is not a change.
              className={`flex cursor-pointer items-baseline gap-3 border-b border-ice-faint px-4 py-2.5 last:border-b-0 ${
                index === active ? 'bg-[color-mix(in_srgb,var(--color-ice)_9%,transparent)]' : ''
              }`}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[0.9rem] text-ice">{entry.t}</span>
                {entry.s && (
                  <span className="block truncate text-[0.75rem] text-ice-dim">{entry.s}</span>
                )}
              </span>
              <span className="shrink-0 font-mono text-[0.6rem] tracking-[0.06em] text-ice-dim uppercase">
                {KIND_LABEL[entry.k]}
              </span>
            </li>
          ))}
        </ul>

        {/* Absence of evidence is not evidence of absence: a failed fetch says so
            rather than rendering as "nothing matched". */}
        <p role="status" className="border-t border-ice-faint px-4 py-2 text-[0.75rem] text-ice-dim">
          {failed
            ? 'The index could not be loaded. Full-text search is at /search/.'
            : results.length === 0
              ? entries.length === 0
                ? 'Loading…'
                : 'Nothing matched. Try fewer words, or full-text search at /search/.'
              : `${results.length} of ${entries.length} · ↑↓ to move · ↵ to open`}
        </p>
      </div>
    </div>,
    document.body
  )
}
