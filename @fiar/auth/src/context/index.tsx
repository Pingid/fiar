import { Auth, AuthProvider } from '@firebase/auth'
import { Functions } from '@firebase/functions'
import React, { useContext } from 'react'

const AuthConfigContext = React.createContext<AuthConfig | null>(null)
export const AuthConfigProvider = AuthConfigContext.Provider

export type AuthConfig = {
  auth: Auth
  providers: AuthProvider[]
  functions?: Functions | undefined
  signin?: 'redirect' | 'popup' | undefined
}

export const useAuthConfig = () => {
  const config = useContext(AuthConfigContext)
  if (!config) throw new Error('Missing Auth config')
  return config
}
