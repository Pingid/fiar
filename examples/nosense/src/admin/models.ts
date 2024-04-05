import * as s from 'fiar/schema'

const seoPageMeta = s.map({
  label: 'SEO page meta',
  optional: true,
  fields: {
    title: s.string({ label: 'Page title' }),
    description: s.string({
      label: 'Page description',
    }),
  },
})

export const articles = s.defineCollection({
  path: '/articles/{articleId}',
  label: 'Articles',
  titleField: 'title',
  columns: ['title', 'image'],
  sort: ['title', 'asc'],
  fields: {
    title: s.string({ label: 'Title' }),
    image: s.image({ label: 'Main image' }),
    body: s.text({ label: 'Content' }),
    // updatedAt: s.timestamp({ computed: 'on-update' }),
    // createdAt: s.timestamp({ computed: 'on-create' }),
    meta: seoPageMeta,
  },
})

export const landing = s.defineDocument({
  path: '/pages/landing',
  label: 'Landing page',
  fields: {
    meta: seoPageMeta,
    // highlight: s.ref({ label: 'Main article', to: () => articles }),
    more: s.list({ label: 'Articles', of: s.ref({ of: () => articles }) }),
  },
})

export const entities = [articles, landing] as const
export type Entities = typeof entities
