import type { Metadata } from 'next'
import { Assessment } from '@/components/personalization/assessment'
import { Page } from '@/components/ui/page'

export const metadata: Metadata = {
  title: 'Find your track',
  description:
    'Five questions that place you on one of three tracks through the Hermes guide. Under a minute, and you can switch afterwards.',
}

export default function BeginPage() {
  return (
    <Page>
      <main>
        <Assessment />
      </main>
    </Page>
  )
}
