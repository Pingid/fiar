import * as s from '@fiar/content/schema'
import { asset } from '@fiar/assets/schema'

const seoPageMeta = s.map({
  label: 'SEO',
  optional: true,
  fields: {
    title: s.string({
      label: 'Page title',
      description:
        'This should be between 50 and 60 characters. For help in writing quality meta titles, see [best practices](https://developers.google.com/search/docs/appearance/title-link#page-titles)',
    }),
    description: s.string({
      label: 'Page description',
      multiline: true,
      description:
        'This should be between 100 and 150 characters. For help in writing quality meta descriptions, see [best practices](https://developers.google.com/search/docs/appearance/snippet#meta-descriptions)',
    }),
  },
})

export const articles = s.model({
  type: 'collection',
  path: '/articles/{articleId}',
  label: 'Articles',
  layout: {
    titleField: 'title',
    columns: ['title', 'image', 'body'],
    sort: ['title', 'asc'],
  },
  fields: {
    title: s.string({ label: 'Title' }),
    image: asset({ label: 'Main image' }),
    body: s.text({ label: 'Content' }),
    meta: seoPageMeta,
    tags: s.list({ label: 'Tags', of: s.string() }),
  },
})

export const test = s.model({
  type: 'collection',
  path: '/test',
  label: 'Test',
  layout: {
    titleField: 'title',
    columns: ['title', 'count', 'metadata'],
    sort: ['title', 'asc'],
  },
  fields: {
    title: s.string({ label: 'Title', description: 'Document title' }),
    count: s.number({ label: 'Count', description: 'Document count' }),
    metadata: s.map({
      label: 'Metadata',
      description: 'Metadata associated with this post used inside the <meta tag of the generated html page',
      fields: { time: s.string({ label: 'Current time' }), seo: seoPageMeta },
    }),
    links: s.list({
      label: 'Links',
      description: 'Page links including socials',
      of: s.map({
        label: 'Link',
        description:
          'This should be between 50 and 60 characters. For help in writing quality meta titles, see best practices',
        fields: { label: s.string({ label: 'Link label' }), link: s.string({ label: 'URL links eg (https://...)' }) },
      }),
    }),
  },
})

// export type Articles = typeof articles.infer

export const tags = s.model({
  type: 'collection',
  path: '/tags/{tagId}',
  label: 'Tags',
  layout: {
    titleField: 'name',
    sort: ['updatedAt', 'asc'],
    columns: ['name', 'createdAt', 'updatedAt'],
  },
  fields: {
    name: s.string({ label: 'Name' }),
    type: s.string({ label: 'Type', select: ['one', 'two'] }),
    createdAt: s.timestamp({ auto: 'create' }),
    updatedAt: s.timestamp({ auto: 'update' }),
  },
})

export const landing = s.model({
  type: 'document',
  path: '/pages/landing',
  label: 'Landing page',
  fields: {
    highlight: s.ref({ label: 'Main article', of: () => articles }),
    more: s.list({ label: 'Highlight articles', of: s.ref({ of: () => articles }) }),
    meta: seoPageMeta,
  },
})

// export type Landing = typeof landing.infer

export const entities = [tags, articles, test, landing] as const
export type Entities = typeof entities
