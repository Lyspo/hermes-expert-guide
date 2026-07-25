import Link from 'next/link'
import { site } from '@/lib/site'

/**
 * On every page. The disclaimer is a standing commitment (see PRODUCT.md), not
 * a legal footnote to bury: a reader who lands mid-curriculum from a search
 * result should learn immediately that this is not Nous Research's own material.
 */
export function SiteFooter() {
  const { author } = site

  const links = [
    { label: 'GitHub', href: author.github },
    { label: 'LinkedIn', href: author.linkedin },
    { label: 'Website', href: author.website },
  ].filter((link) => link.href.length > 0)

  return (
    <footer className="vt-footer border-ice-faint mt-24 border-t">
      <div className="text-ice-dim mx-auto max-w-3xl px-6 py-10 text-sm">
        <p className="max-w-[60ch]">
          {site.disclaimer} Hermes Agent is{' '}
          <a href={site.upstream.repo}>their open-source project</a>; its{' '}
          <a href={site.upstream.docs}>official documentation is here</a>.
        </p>

        <p className="mt-4">
          Written by {author.name}.{' '}
          <Link href="/about/">How this was built</Link>
          {links.length > 0 && ' · '}
          {links.map((link, index) => (
            <span key={link.label}>
              {index > 0 && ' · '}
              <a href={link.href}>{link.label}</a>
            </span>
          ))}
        </p>

        <p className="mt-4 font-mono text-xs">Code MIT, prose CC BY 4.0.</p>
      </div>
    </footer>
  )
}
