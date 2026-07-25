/** Site-wide constants. The name is provisional — see decisions.md. */
export const site = {
  name: 'The Hermes Guide',
  shortName: 'Hermes Guide',
  url: 'https://hermes-expert-guide.vercel.app',
  description:
    'An interactive, adaptive course in Hermes Agent — the open-source, self-improving AI agent. Unofficial and independent.',
  disclaimer:
    'Unofficial community project. Not affiliated with, endorsed by, or connected to Nous Research.',
  author: {
    name: 'Théo Gandolphe',
    github: 'https://github.com/Lyspo',
    linkedin: 'https://www.linkedin.com/in/theogandolphe/',
    website: 'https://theogandolphe.com/en/',
  },
  upstream: {
    repo: 'https://github.com/NousResearch/hermes-agent',
    docs: 'https://hermes-agent.nousresearch.com/docs',
  },
  /** The Hermes release the curriculum is currently verified against. */
  verifiedAgainst: 'v0.19.0',
} as const

export const TRACKS = ['newcomer', 'operator', 'architect'] as const
export type Track = (typeof TRACKS)[number]

export const TRACK_LABELS: Record<Track, string> = {
  newcomer: 'Newcomer',
  operator: 'Operator',
  architect: 'Architect',
}
