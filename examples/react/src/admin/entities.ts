import * as s from '@fiar/content/schema'
import { image } from '@fiar/assets/schema'

const seoPageMeta = s.struct({
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
      description:
        'This should be between 100 and 150 characters. For help in writing quality meta descriptions, see [best practices](https://developers.google.com/search/docs/appearance/snippet#meta-descriptions)',
    }),
  },
})

export const articles = s.defineCollection({
  path: '/articles/{articleId}',
  label: 'Articles',
  titleField: 'title',
  fields: {
    title: s.string({ label: 'Title' }),
    image: image({ label: 'Main image' }),
    body: s.text({ label: 'Content' }),
    width: s.number({ label: 'Width' }),
    meta: seoPageMeta,
    tags: s.list({ label: 'Tags', of: s.string() }),
  },
})

export const test = s.defineCollection({
  path: '/test',
  label: 'Test',
  titleField: 'title',
  fields: {
    title: s.string({ label: 'Title', description: 'Document title' }),
    count: s.number({ label: 'Count', description: 'Document count' }),
    metadata: s.struct({
      label: 'Metadata',
      description: 'Metadata associated with this post used inside the <meta tag of the generated html page',
      fields: { time: s.string({ label: 'Current time' }), seo: seoPageMeta },
    }),
    links: s.list({
      label: 'Links',
      description: 'Page links including socials',
      of: s.struct({
        label: 'Link',
        description:
          'This should be between 50 and 60 characters. For help in writing quality meta titles, see best practices',
        fields: { label: s.string({ label: 'Link label' }), link: s.string({ label: 'URL links eg (https://...)' }) },
      }),
    }),
  },
})

// export type Articles = typeof articles.infer

export const landing = s.defineDocument({
  path: '/pages/landing',
  label: 'Landing page',
  fields: {
    highlight: s.ref({ label: 'Main article', of: () => articles }),
    more: s.list({ label: 'Articles', of: s.ref({ of: () => articles }) }),
    meta: seoPageMeta,
  },
})

// export type Landing = typeof landing.infer

export const entities = [articles, test, landing] as const
export type Entities = typeof entities
