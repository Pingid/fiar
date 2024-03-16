import { GoogleAuthProvider, GithubAuthProvider, EmailAuthProvider } from '@firebase/auth'
import { createFiar } from 'fiar'

import { articles, landing } from './entities'
import { app } from './firebase'

createFiar({
  app,
  node: document.getElementById('root')!,
  content: [articles, landing],
  assets: [{ path: '/fiar', title: 'Photos' }],
  router: { type: 'hash' },
  auth: {
    providers: [new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()],
    strategy: 'popup',
  },
})
