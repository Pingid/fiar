import { getAuth, type AuthProvider } from '@firebase/auth'
import type { FirebaseApp } from '@firebase/app'
import { create } from 'zustand'

export type AuthConfig = {
  app?: FirebaseApp | undefined
  allowNoAuth?: boolean | undefined
  providers: (AuthProvider | 'github' | 'google' | 'facebook' | 'twitter' | 'email')[]
  strategy?: 'redirect' | 'popup' | undefined
}

export const useAuthConfig = create<AuthConfig>(() => ({ providers: [] }))

export const useFirebaseAuth = () => {
  const auth = useAuthConfig((x) => (x.app ? getAuth(x.app) : null))
  if (!auth) throw new Error(`Missing firebase app instance`)
  return auth
}
