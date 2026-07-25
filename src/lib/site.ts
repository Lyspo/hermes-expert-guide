/**
 * Platform-level constants.
 *
 * "Protocol" is the platform; a guide is one course inside it. The Hermes guide
 * is the first. Per-guide facts (title, subject, verified version) live in each
 * guide's `_guide.yaml`, not here — see content-collections.ts.
 */
export const site = {
  /** The platform. */
  name: 'Protocol',
  tagline: 'Learn the agents worth learning properly.',
  url: 'https://hermes-expert-guide.vercel.app',
  description:
    'Protocol publishes deep, sourced, adaptive courses in the agents worth learning properly. First course: Hermes Agent, the open-source self-improving agent from Nous Research.',
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
} as const

export const TRACKS = ['newcomer', 'operator', 'architect'] as const
export type Track = (typeof TRACKS)[number]

export const TRACK_LABELS: Record<Track, string> = {
  newcomer: 'Newcomer',
  operator: 'Operator',
  architect: 'Architect',
}
