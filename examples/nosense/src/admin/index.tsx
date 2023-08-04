import { GoogleAuthProvider, GithubAuthProvider, EmailAuthProvider } from '@firebase/auth'
import { fiarAssets, fiarAuth, fiarContent, fiarWorkbench } from 'fiar/plugins'
import { createFiar } from 'fiar'

import { storage, auth, functions, firestore } from './firebase'
import { articles, landing } from './entities'

export const fiar = createFiar({
  plugins: [
    fiarContent({ firestore, contentPrefix: 'fiar', content: [landing, articles] }),
    fiarAssets({ storage, storagePrefix: 'fiar' }),
    fiarAuth({
      auth,
      functions,
      providers: [new EmailAuthProvider(), new GoogleAuthProvider(), new GithubAuthProvider()],
    }),
    fiarWorkbench({ routing: 'hash' }),
  ],
  components: {},
})

export default fiar.Dashboard
