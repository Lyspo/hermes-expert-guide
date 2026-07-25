import { defineCollection, defineConfig } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import { z } from 'zod'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { parse as parseYaml } from 'yaml'

/**
 * Per-track relevance. A lesson declares what it is *for* each reader rather
 * than a single difficulty level, because the tracks are three perspectives on
 * the same material and not three depths of it.
 *
 *   core — on this track's path; counted in its progress
 *   skim — worth knowing, presented condensed, not required
 *   skip — genuinely not for this reader; reachable but never suggested
 */
const relevance = z.enum(['core', 'skim', 'skip'])

const mdxOptions: Parameters<typeof compileMDX>[2] = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [rehypeAutolinkHeadings, { behavior: 'wrap', properties: { className: 'heading-anchor' } }],
  ],
}

const moduleMetaSchema = z.object({
  title: z.string(),
  order: z.number().int().positive(),
  summary: z.string(),
  arc: z.string().optional(),
})

const lessons = defineCollection({
  name: 'lessons',
  directory: 'content/curriculum',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().positive(),
    /** Honest reading time in minutes; used for the track's total. */
    duration: z.number().int().positive(),
    tracks: z.object({
      newcomer: relevance,
      operator: relevance,
      architect: relevance,
    }),
    /** Lesson ids ("<module>/<lesson>"). Validated across the whole set below. */
    prerequisites: z.array(z.string()).default([]),
    /**
     * The Hermes release this lesson's claims were checked against. Hermes ships
     * every week or two, so this is how staleness stays visible and local
     * instead of invisible and everywhere.
     */
    hermesVersion: z.string(),
    updated: z.string(),
    draft: z.boolean().default(false),
    content: z.string(),
  }),
  transform: async (doc, ctx) => {
    const path = doc._meta.path // "01-first-contact/02-install"
    const [moduleSlug, lessonSlug] = path.split('/')

    if (!moduleSlug || !lessonSlug) {
      throw new Error(
        `Lesson "${path}" must live in a module directory, e.g. content/curriculum/01-first-contact/01-intro.mdx`,
      )
    }

    // Module metadata is shared by every lesson in the directory, so it is
    // cached per module rather than re-read per lesson.
    const meta = await ctx.cache(moduleSlug, async (slug) => {
      const file = join('content/curriculum', slug, '_module.yaml')
      try {
        return moduleMetaSchema.parse(parseYaml(await readFile(file, 'utf8')))
      } catch (error) {
        throw new Error(`Could not read module metadata at ${file}`, { cause: error })
      }
    })

    const mdx = await compileMDX(ctx, doc, mdxOptions)

    return {
      ...doc,
      mdx,
      id: path,
      slug: lessonSlug,
      moduleSlug,
      module: meta,
      /** Strip the "NN-" ordering prefix for display. */
      moduleNumber: Number.parseInt(moduleSlug.slice(0, 2), 10),
      url: `/learn/${moduleSlug}/${lessonSlug}/` as const,
    }
  },

  /**
   * Whole-set invariants, checked once the collection is built. These throw
   * rather than warn: a dangling prerequisite or a duplicated position is a
   * content bug that is obvious here and invisible at runtime.
   *
   * This hook belongs to the collection, not the config — a config-level
   * onSuccess is an unknown key and gets silently ignored.
   */
  onSuccess: (lessons) => {
    const ids = new Set(lessons.map((lesson) => lesson.id))
    const problems: string[] = []

    for (const lesson of lessons) {
      for (const prerequisite of lesson.prerequisites) {
        if (prerequisite === lesson.id) {
          problems.push(`${lesson.id}: lists itself as a prerequisite`)
        } else if (!ids.has(prerequisite)) {
          problems.push(`${lesson.id}: prerequisite "${prerequisite}" does not exist`)
        }
      }
    }

    const positions = new Map<string, string>()
    for (const lesson of lessons) {
      const key = `${lesson.moduleSlug}#${lesson.order}`
      const taken = positions.get(key)
      if (taken) {
        problems.push(
          `${lesson.moduleSlug}: order ${lesson.order} used by both "${taken}" and "${lesson.slug}"`,
        )
      } else {
        positions.set(key, lesson.slug)
      }
    }

    if (problems.length > 0) {
      throw new Error(`Curriculum validation failed:\n  - ${problems.join('\n  - ')}`)
    }
  },
})

const glossary = defineCollection({
  name: 'glossary',
  directory: 'content/glossary',
  include: '**/*.mdx',
  schema: z.object({
    term: z.string(),
    /** Alternate spellings the <Term> component should also match. */
    aliases: z.array(z.string()).default([]),
    /** One sentence. This is what the hover card shows. */
    short: z.string(),
    hermesVersion: z.string().optional(),
    content: z.string(),
  }),
  transform: async (doc, ctx) => ({
    ...doc,
    mdx: await compileMDX(ctx, doc, mdxOptions),
    slug: doc._meta.path,
  }),
})

const cheatsheets = defineCollection({
  name: 'cheatsheets',
  directory: 'content/cheatsheets',
  include: '**/*.mdx',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().int().positive(),
    hermesVersion: z.string(),
    updated: z.string(),
    content: z.string(),
  }),
  transform: async (doc, ctx) => ({
    ...doc,
    mdx: await compileMDX(ctx, doc, mdxOptions),
    slug: doc._meta.path,
    url: `/cheatsheets/${doc._meta.path}/` as const,
  }),
})

export default defineConfig({
  content: [lessons, glossary, cheatsheets],
})
