import { GoogleAuthProvider, GithubAuthProvider, EmailAuthProvider } from '@firebase/auth'
import { createFiar } from 'fiar/v2'

import { storage, auth, functions, firestore } from './firebase'
import { articles, landing } from './entities'

createFiar({
  node: document.getElementById('root')!,
  dashboard: { routing: 'hash' },
  content: {
    firestore,
    collections: [articles],
    documents: [landing],
  },
  assets: { storage, folders: [{ path: 'fiar', title: 'Photos' }] },
  auth: {
    auth,
    functions,
    providers: [new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()],
  },
})
