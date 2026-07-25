import type { Metadata } from 'next'
import { Archivo, Familjen_Grotesk, Geist_Mono } from 'next/font/google'
import { PrefaceScript } from '@/components/personalization/preface-script'
import { TrackProvider } from '@/components/personalization/track-provider'
import { SiteFooter } from '@/components/nav/site-footer'
import { SiteHeader } from '@/components/nav/site-header'
import { Field } from '@/components/ui/field'
import { site } from '@/lib/site'
import './globals.css'

// Self-hosted at build time by next/font, so the site makes no external font
// requests. See design.md for why each face is here — and why none is a serif.
const familjen = Familjen_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-familjen',
})
const archivo = Archivo({ subsets: ['latin'], display: 'swap', variable: '--font-archivo' })
const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
})

const fontVariables = [familjen, archivo, geistMono].map((font) => font.variable).join(' ')

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    // Lesson and module pages append their guide's title, so the words a reader
    // would actually search for land in the tab and the search result.
    template: `%s · ${site.name}`,
  },
  description: `${site.description} ${site.disclaimer}`,
  openGraph: {
    type: 'website',
    siteName: site.name,
    locale: 'en',
    images: [{ url: '/og/site.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <PrefaceScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <Field />
        <TrackProvider>
          <SiteHeader />
          <div className="plane flex-1">{children}</div>
          <SiteFooter />
        </TrackProvider>
      </body>
    </html>
  )
}
