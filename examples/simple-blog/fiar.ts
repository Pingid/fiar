import { initializeApp } from '@firebase/app'
import { createFiar } from 'fiar'
import * as s from 'fiar/schema'
import 'fiar/style.css'

import firebaseConfig from './config.json'

const post = s.model({
  type: 'collection',
  label: 'Blog Posts',
  path: '/examples/simple-blog/posts/{postId}',
  layout: {},
  fields: {
    title: s.string(),
    image: s.image({ optional: true }),
    body: s.text(),
    status: s.string({ select: [{ value: 'published' }, { value: 'draft' }] }),
  },
})

export type Post = s.TypeOf<typeof post>

createFiar({
  node: document.getElementById('root')!,
  app: initializeApp(firebaseConfig),
  storage: { folders: [{ title: 'Photos', path: '/examples/simple-blog/photos' }] },
  content: { models: [post] },
  auth: { strategy: 'popup' },
  router: { type: 'hash' },
})
