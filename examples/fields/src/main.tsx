import { createFiar } from 'fiar'
import './index.css'

import { app, firestore, storage } from './firebase.js'
import { models } from './models/index.js'

createFiar({
  app: app,
  node: document.getElementById('root')!,
  storage: { storage, folders: [{ title: 'Photos', path: '/examples/simple-blog/photos' }] },
  content: { firestore, models },
  router: { type: 'hash' },
  auth: { allowNoAuth: true },
})

// const className = 'bg-black'
document.body.classList.add('bg-black')
