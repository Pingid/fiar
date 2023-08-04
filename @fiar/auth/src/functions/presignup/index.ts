import type { BeforeSignInResponse } from 'firebase-functions/lib/common/providers/identity'
import { HttpsError, user } from 'firebase-functions/v1/auth'
import { CLAIM_KEY, UserRole, userRoles } from '../config'

export type UserAuthConfig = { users: [string | RegExp, UserRole][]; open?: boolean }

export const createBeforeSignIn = (config: UserAuthConfig) =>
  user({}).beforeSignIn((user) => {
    if (userRoles.includes(user.customClaims?.[CLAIM_KEY])) return Promise.resolve()
    const match = config.users.find(([email]) =>
      typeof email === 'string' ? email === user.email : email.test(user.email || ''),
    )
    if (match) return { sessionClaims: { [CLAIM_KEY]: match[1] } }
    if (config.open) return Promise.resolve()
    return Promise.reject(new HttpsError('permission-denied', 'Unauthorized email')) as Promise<BeforeSignInResponse>
  })

export const createBeforeCreate = (config: UserAuthConfig) =>
  user({}).beforeCreate((user) => {
    const match = config.users.find(([email]) =>
      typeof email === 'string' ? email === user.email : email.test(user.email || ''),
    )
    if (match) return { customClaims: { [CLAIM_KEY]: match[1] } }
    return
  })

export const createAuthHooks = (config: UserAuthConfig) => ({
  fireBeforeSignIn: createBeforeSignIn(config),
  fireBeforeCreate: createBeforeCreate(config),
})
