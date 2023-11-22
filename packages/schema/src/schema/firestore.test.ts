import { test, expect } from 'vitest'

import { setupFirestore } from '../_test_util/index.js'

import { createModelRules } from './rules.js'
import { model } from './model.js'
import { s } from './fields.js'

const users = model({
  path: '/users/{userId}',
  fields: { uid: s.string(), name: s.string(), email: s.string() },
})

test.only('', () => {
  console.log(
    createModelRules(users, {
      write: ({ request, userId }, op) => op.and(op.eq(request.auth.uid, userId)),
    }),
  )
})

// test('should check that authorized user has the same id has the user in the user collection', async () => {
//   const authId = '1'
//   const fs = await setupFirestore(
//     createModelRules(users, { write: ({ request, userId }) => op.eq(request.auth.uid, userId) }),
//     authId,
//   )
//   const fail = await fs
//     .doc('/users/2')
//     .set({ name: 'Foo', email: '1', uid: '1' })
//     .catch((e) => e)
//   expect(fail.code).toBe('permission-denied')
//   await fs.doc(`/users/${authId}`).set({ name: 'Foo', email: '1', uid: '1' })
// })
