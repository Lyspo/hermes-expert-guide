import type { Metadata } from 'next'
import { Archivo_Narrow, Bitter, Faculty_Glyphic, JetBrains_Mono, Public_Sans } from 'next/font/google'
import { PrefaceScript } from '@/components/personalization/preface-script'
import { SiteFooter } from '@/components/nav/site-footer'
import { site } from '@/lib/site'
import './globals.css'

// Self-hosted at build time by next/font — no external font requests, which
// matters both for the performance budget and because the site should not phone
// anywhere. See design.md for why each face is here.
const faculty = Faculty_Glyphic({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-faculty',
})
const bitter = Bitter({ subsets: ['latin'], display: 'swap', variable: '--font-bitter' })
const publicSans = Public_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-public-sans',
})
const archivoNarrow = Archivo_Narrow({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo-narrow',
})
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
})

const fontVariables = [faculty, bitter, publicSans, archivoNarrow, jetbrains]
  .map((font) => font.variable)
  .join(' ')

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    // Lesson and module pages append their guide's title, so the words a reader
    // would actually search for ("Hermes Agent") land in the tab and the SERP.
    template: `%s · ${site.name}`,
  },
  description: `${site.description} ${site.disclaimer}`,
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <PrefaceScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  )
}
