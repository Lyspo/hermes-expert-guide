import type { Metadata } from 'next'
import { PrefaceScript } from '@/components/personalization/preface-script'
import { site } from '@/lib/site'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — learn Hermes Agent properly`,
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <PrefaceScript />
      </head>
      <body>{children}</body>
    </html>
  )
}
