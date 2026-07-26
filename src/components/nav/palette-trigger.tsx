'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

/**
 * The palette's only permanently-mounted part, and it is deliberately tiny: a link, a
 * keydown listener, and a boolean.
 *
 * Progressive enhancement rather than a replacement. Server-rendered it is exactly the
 * header's search link, so a reader without JavaScript gets the Pagefind full-text page
 * as they always did. Once hydrated the same element gains a click handler and a
 * shortcut hint, and the dialog itself is only imported when it is first opened.
 *
 * The hint is computed after hydration because ⌘ and Ctrl are not the same key and
 * showing a Mac shortcut to a Windows reader is the kind of small wrongness that makes
 * a whole interface feel machine-made. Server and first client render agree on the word
 * "Search", so there is no mismatch and no flash.
 */

const Palette = dynamic(() => import('./palette').then((mod) => mod.Palette), { ssr: false })

export function PaletteTrigger() {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLAnchorElement>(null)

  const hydrated = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => true,
    () => false
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'k' || !(event.metaKey || event.ctrlKey)) return
      event.preventDefault()
      setOpen((current) => !current)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Focus goes back where it came from. A dialog that drops focus to the top of the
  // document strands a keyboard reader in the header every time they close it.
  const close = useCallback(() => {
    setOpen(false)
    trigger.current?.focus()
  }, [])

  const mac =
    hydrated && typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)

  return (
    <>
      <Link
        ref={trigger}
        href="/search/"
        onClick={(event) => {
          // Never swallow a modified click: ⌘-click and middle-click must still open
          // the real search page in a new tab.
          if (!hydrated || event.metaKey || event.ctrlKey || event.shiftKey) return
          event.preventDefault()
          setOpen(true)
        }}
        className="flex items-center gap-1.5 font-mono text-[0.65rem] tracking-[0.08em] text-ice-dim uppercase no-underline transition-colors duration-200 hover:text-ice"
      >
        Search
        {hydrated && (
          <kbd className="rounded-[1px] border border-ice-faint px-1 py-px text-[0.6rem] tracking-normal normal-case">
            {mac ? '⌘' : 'Ctrl '}K
          </kbd>
        )}
      </Link>

      {open && <Palette onClose={close} />}
    </>
  )
}
