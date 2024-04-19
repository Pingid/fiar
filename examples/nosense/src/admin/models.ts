import * as s from 'fiar/schema'

const users = s.defineCollection({
  path: '/users/{userId}',
  label: 'Users',
  layout: {
    sort: ['displayName', 'desc'],
    columns: ['picture', 'displayName', 'email'],
  },
  fields: {
    email: s.string({ label: 'Email' }),
    picture: s.asset({ label: 'Photo' }),
    displayName: s.string({ label: 'Name' }),
    role: s.string({ select: ['admin', 'editor'] }),
  },
})

const invites = s.defineCollection({
  path: '/invites/{userId}',
  label: 'Invites',
  readonly: true,
  fields: { email: s.string({}), role: s.string({ select: ['admin', 'editor'] }) },
})

const posts = s.defineCollection({
  path: '/posts/{postId}',
  label: 'Posts',
  layout: {
    sort: ['updatedAt', 'desc'],
    columns: ['title', 'author', 'status', 'updatedAt'],
  },
  fields: {
    title: s.string({ label: 'Title' }),
    image: s.asset({ label: 'Image', optional: true }),
    description: s.string({ label: 'Description', optional: true }),
    content: s.text({ label: 'Content' }),
    author: s.map({ fields: {} }), // custom
    status: s.string({ select: ['published', 'draft'] }),
    updatedAt: s.timestamp({ auto: 'update' }),
    createdAt: s.timestamp({ auto: 'create' }),
    meta: s.map({
      label: 'SEO page meta',
      optional: true,
      fields: {
        title: s.string({ label: 'Page meta title', optional: true }),
        description: s.string({ label: 'Page meta description', optional: true }),
      },
    }),
  },
})

const landing = s.defineDocument({
  path: '/pages/landing',
  label: 'Landing page',
  fields: {
    leading: s.ref({ label: 'Leading post', of: () => posts }),
    highlights: s.list({ label: 'Highlight posts', of: s.ref({ of: () => posts }) }),
  },
})

export const models = [landing, users, invites, posts] as const
