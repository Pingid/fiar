import { applicationDefault } from 'firebase-admin/app'
import * as admin from 'firebase-admin'

import { createAuthHooks, createUserManagementFunctions } from './auth'

export const { fireBeforeCreate, fireBeforeSignIn } = createAuthHooks({
  open: false,
  users: [
    ['dm.beaven@gmail.com', 'admin'],
    [/^.*@example.com$/, 'editor'],
  ],
})

const app = admin.initializeApp({ credential: applicationDefault() })

export const { fireAuthUserList, fireAuthUserPermission } = createUserManagementFunctions(admin.auth(app))
