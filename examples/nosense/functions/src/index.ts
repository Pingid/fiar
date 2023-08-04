import { applicationDefault } from 'firebase-admin/app'
import * as admin from 'firebase-admin'

import { createAuthHooks, createUserManagementFunctions } from './auth'

export const { fiarBeforeCreate, fiarBeforeSignIn } = createAuthHooks({
  open: false,
  users: [
    ['dm.beaven@gmail.com', 'admin'],
    [/^.*@example.com$/, 'editor'],
  ],
})

const app = admin.initializeApp({ credential: applicationDefault() })

export const { fiarUserList, fiarUserPermission } = createUserManagementFunctions(admin.auth(app))
