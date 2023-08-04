import { HttpsError, onCall } from 'firebase-functions/v2/https'
import { Auth } from 'firebase-admin/auth'

import { CLAIM_KEY, userRoles } from '../config'

export const createFiarUserListHandler = (auth: Auth) =>
  onCall({}, async (req) => {
    const role = req.auth?.token[CLAIM_KEY]
    if (!userRoles.includes(role))
      return Promise.reject(new HttpsError('permission-denied', 'You must be an admin to manage users'))
    const limit = 1000
    const list = await (req?.data?.pageToken ? auth.listUsers(limit, req?.data?.pageToken) : auth.listUsers(limit))
    const users = list.users.map((x) => ({
      uid: x.uid,
      email: x.email,
      emailVerified: x.emailVerified,
      displayName: x.displayName,
      photoURL: x.photoURL,
      metadata: x.metadata.toJSON(),
      customClaims: x.customClaims,
    }))
    return { users, pageToken: list.pageToken }
  })

export const createFiarUserPermissionHandler = (auth: Auth) =>
  onCall({}, async (req) => {
    const role = req.auth?.token[CLAIM_KEY]
    if (role !== 'admin') return Promise.reject(new HttpsError('permission-denied', 'You must be an admin'))
    const data = req.data as { uid: string; role?: string }
    if (req.auth?.uid === data.uid) {
      return Promise.reject(new HttpsError('permission-denied', 'You cant change your own permissions'))
    }
    const user = await auth.getUser(data.uid)
    await auth.setCustomUserClaims(data.uid, { ...user.customClaims, fiar: data.role || null })
    return null
  })

export const createUserManagementFunctions = (auth: Auth) => {
  return {
    fiarUserList: createFiarUserListHandler(auth),
    fiarUserPermission: createFiarUserPermissionHandler(auth),
  }
}

export type UserManageFunctions = ReturnType<typeof createUserManagementFunctions>
