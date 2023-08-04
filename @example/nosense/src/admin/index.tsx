import { GoogleAuthProvider, GithubAuthProvider, EmailAuthProvider } from '@firebase/auth'
import { createFiar } from 'fiar'

import { storage, auth, functions, firestore } from './firebase'
import { articles, landing } from './entities'

export const fiar = createFiar({
  auth,
  storage,
  functions,
  firestore,
  providers: [new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()],
  routing: 'hash',
  contentPrefix: 'fiar',
  content: [landing, articles],
})

export default fiar.Dashboard
