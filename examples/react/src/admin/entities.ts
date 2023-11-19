import * as s from '@fiar/content/schema'
import { image } from '@fiar/assets/schema'

const seoPageMeta = s.struct({
  label: 'SEO page meta',
  fields: {
    title: s.string({ label: 'Page title' }),
    description: s.string({
      label: 'Page description',
      // validate: (value) => ({
      //   value: value ? value.slice(0, 160) : '',
      //   reason: 'Description must not excede 160 characters',
      //   valid: !!value && value.length < 160,
      // }),
    }),
  },
})

export const articles = s.defineCollection({
  path: 'articles',
  label: 'Articles',
  titleField: 'title',
  fields: {
    title: s.string({ label: 'Title' }),
    image: image({ label: 'Main image', optional: true }),
    // body: s.text({ label: 'Content' }),
    width: s.number({ label: 'Width' }),
    meta: seoPageMeta,
    tags: s.array({ label: 'Tags', of: s.string() }),
  },
})

export type Articles = typeof articles.infer

export const landing = s.defineDocument({
  path: 'pages/landing',
  label: 'Landing page',
  fields: {
    meta: seoPageMeta,
    highlight: s.ref({ label: 'Main article', to: () => articles }),
    more: s.array({ label: 'Articles', of: s.ref({ to: () => articles }) }),
  },
})

export type Landing = typeof landing.infer

export const entities = [articles, landing] as const
export type Entities = typeof entities
