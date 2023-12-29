import type { Auth, User, AuthProvider } from '@firebase/auth'
import { type Functions } from '@firebase/functions'
import { createContext, useContext } from 'react'

export type AuthConfig = {
  auth: Auth
  providers: AuthProvider[]
  allowNoAuth?: boolean
  functions?: Functions | undefined
  method?: 'redirect' | 'popup' | undefined
}

const FirebaseAuthContext = createContext<Auth | null>(null)
export const FirebaseAuthProvider = FirebaseAuthContext.Provider
export const useFirebaseAuth = () => {
  const auth = useContext(FirebaseAuthContext)
  if (!auth) throw new Error(`Missing FirebaseAuthProvider`)
  return auth
}

const AuthUserContext = createContext<User | null>(null)
export const AuthUserProvider = AuthUserContext.Provider
export const useAuthUser = () => useContext(AuthUserContext)
