import { GoogleAuthProvider, GithubAuthProvider, EmailAuthProvider } from '@firebase/auth'
import { createFiar } from 'fiar'

import { articles, landing } from './models.js'
import { app } from './firebase'

createFiar({
  app,
  node: document.getElementById('root')!,
  router: { type: 'hash' },
  content: { models: [articles, landing] },
  storage: { folders: [{ path: '/fiar', title: 'Photos' }] },
  auth: {
    providers: [new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()],
    strategy: 'popup',
  },
})
