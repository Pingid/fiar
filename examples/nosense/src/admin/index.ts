import { GoogleAuthProvider, GithubAuthProvider, EmailAuthProvider } from '@firebase/auth'
import { createFiar } from 'fiar'

import { models } from './models.js'
import { app } from './firebase.js'

createFiar({
  app,
  node: document.getElementById('root')!,
  router: { type: 'hash' },
  content: { models: [...models] },
  storage: { folders: [{ path: '/fiar', title: 'Photos' }] },
  auth: {
    providers: [new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()],
    strategy: 'popup',
  },
})
