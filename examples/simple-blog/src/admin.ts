import { createFiar } from 'fiar'
import 'fiar/style.css'

import { app } from './firebase.js'
import { post } from './models.js'

createFiar({
  app: app,
  node: document.getElementById('root')!,
  storage: { folders: [{ title: 'Photos', path: '/examples/simple-blog/photos' }] },
  content: { models: [post] },
  router: { type: 'hash' },
  auth: true,
})
