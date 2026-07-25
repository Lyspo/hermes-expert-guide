'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Search, against the Pagefind index built over the exported site.
 *
 * Written against Pagefind's JS API rather than dropping in its default UI, because
 * the default UI ships its own stylesheet and would arrive as a component from a
 * different design system — the one thing this project's rules do not permit.
 *
 * The import has to be opaque to both TypeScript and the bundler, because
 * `/pagefind/pagefind.js` does not exist at either point: it is produced by
 * `scripts/build-search.mjs` from the very export this page is part of, after the
 * build has finished. An ambient `declare module` does not help — TypeScript reads a
 * leading slash as a rooted path rather than a module name, so the declaration never
 * matches. Holding the specifier in a variable is what actually works: a dynamic
 * import of a non-literal is left alone by both, and resolves at runtime against the
 * static host.
 *
 * Degradation is deliberate and stated rather than hidden. With no JavaScript there
 * is no search — so the page renders a complete route to the curriculum index
 * instead, and says so.
 */

type Result = {
  url: string
  meta?: { title?: string }
  excerpt: string
}

/** Written by `pnpm search` into the exported tree, so it exists only at runtime. */
const INDEX = '/pagefind/pagefind.js'

type Pagefind = {
  init: () => Promise<void>
  search: (query: string) => Promise<{ results: { data: () => Promise<Result> }[] }>
}

export function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [state, setState] = useState<'idle' | 'ready' | 'searching' | 'unavailable'>('idle')
  const engine = useRef<Pagefind | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const pagefind = (await import(/* webpackIgnore: true */ INDEX)) as Pagefind
        await pagefind.init()
        if (cancelled) return
        engine.current = pagefind
        setState('ready')
      } catch {
        // Running `next dev`, or a host that did not build the index. Either way the
        // honest thing is to say search is unavailable rather than to spin forever.
        if (!cancelled) setState('unavailable')
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const term = query.trim()
    if (!engine.current || term.length < 2) {
      setResults([])
      return
    }

    let cancelled = false
    setState('searching')

    // Debounced: Pagefind loads index fragments over the network per query.
    const timer = setTimeout(async () => {
      const found = await engine.current!.search(term)
      const top = await Promise.all(found.results.slice(0, 12).map((result) => result.data()))
      if (cancelled) return
      setResults(top)
      setState('ready')
    }, 160)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query])

  return (
    <div>
      <label htmlFor="q" className="font-mono text-[0.7rem] tracking-[0.09em] text-ice-dim uppercase">
        Search the guide
      </label>
      <input
        id="q"
        type="search"
        autoComplete="off"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={state === 'unavailable' ? 'Search is unavailable here' : 'approvals, memory, cron…'}
        disabled={state === 'unavailable'}
        className="mt-[calc(var(--step)*0.5)] block w-full border-b border-ice-faint bg-transparent pb-[calc(var(--step)*0.4)] text-[1.25rem] outline-none placeholder:text-ice-dim focus-visible:border-ice"
      />

      {state === 'unavailable' && (
        <p className="mt-[calc(var(--step)*0.75)] max-w-[62ch] text-[0.9rem] leading-[1.7] text-ice-dim">
          The index is built from the exported site, so search does not work in local
          development or on a host that skipped the search step. Every lesson is still
          reachable from the curriculum below.
        </p>
      )}

      {query.trim().length >= 2 && state !== 'unavailable' && (
        <p
          aria-live="polite"
          className="mt-[calc(var(--step)*0.75)] font-mono text-[0.7rem] text-ice-dim"
        >
          {state === 'searching'
            ? 'Searching…'
            : `${results.length} result${results.length === 1 ? '' : 's'}`}
        </p>
      )}

      <ul className="mt-[calc(var(--step)*0.75)]">
        {results.map((result) => (
          <li key={result.url} className="border-t border-ice-faint py-[calc(var(--step)*0.8)]">
            <a href={result.url} className="text-[1.05rem] underline decoration-[var(--color-rule)]">
              {result.meta?.title ?? result.url}
            </a>
            {/* Pagefind marks the matched terms with <mark>, which is why this is
                set as HTML. The source is our own index, built from our own pages. */}
            <p
              className="mt-[calc(var(--step)*0.3)] max-w-[68ch] text-[0.9rem] leading-[1.7] text-ice-dim"
              dangerouslySetInnerHTML={{ __html: result.excerpt }}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}
