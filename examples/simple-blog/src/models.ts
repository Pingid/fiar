import * as s from 'fiar/schema'

export const post = s.model({
  type: 'collection',
  label: 'Blog Posts',
  path: '/examples/simple-blog/posts/{postId}',
  layout: {},
  fields: {
    title: s.string(),
    image: s.image({ optional: true }),
    body: s.text(),
    status: s.string({ select: [{ value: 'published' }, { value: 'draft' }], initialValue: 'draft' }),
  },
})

export type Post = s.TypeOf<typeof post>
