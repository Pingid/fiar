import { GoogleAuthProvider, GithubAuthProvider, EmailAuthProvider } from '@firebase/auth'
import { createFiar } from 'fiar'

import { articles, landing } from './entities'
import { firebase } from './firebase'

createFiar({
  node: document.getElementById('root')!,
  firebase,
  router: { type: 'hash' },
  collections: [articles],
  documents: [landing],
  folders: [{ path: '/fiar', title: 'Photos' }],
  providers: [new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()],
  method: 'popup',
})
