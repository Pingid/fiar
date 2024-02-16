import { getAuth, type AuthProvider } from '@firebase/auth'
import type { FirebaseApp } from '@firebase/app'
import { create } from 'zustand'

export type AuthConfig = {
  providers: AuthProvider[]
  firebase?: FirebaseApp | undefined
  allowNoAuth?: boolean | undefined
  method?: 'redirect' | 'popup' | undefined
}

export const useAuthConfig = create<AuthConfig>(() => ({ providers: [] }))

export const useFirebaseAuth = () => {
  const auth = useAuthConfig((x) => (x.firebase ? getAuth(x.firebase) : null))
  if (!auth) throw new Error(`Missing firebase app instance`)
  return auth
}
