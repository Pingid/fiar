import type { Auth, AuthProvider } from '@firebase/auth'

export type AuthConfig = {
  auth: Auth
  providers: AuthProvider[]
  allowNoAuth?: boolean
  method?: 'redirect' | 'popup' | undefined
}
