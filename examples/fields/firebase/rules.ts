import { ruleset } from 'fiar/rules'
import fs from 'node:fs'
import 'dotenv/config'

import { models } from '../src/models/index.js'
import config from '../firebase.json'

const IS_TEST = process.env.IS_TEST
const admin = process.env.ADMIN_USER ?? null

const firestore = ruleset(({ service }) => {
  service('cloud.firestore', ({ match }) => {
    match(`/databases/{database}/documents`, () => {
      models.forEach((model) => {
        match(model, ({ allow, op, and, isValid }) => {
          allow('read', true)
          if (IS_TEST) {
            allow('write', true)
          } else {
            allow('write', ({ request }) => and(op(request.auth.token.email, '==', admin), isValid()))
          }
        })
      })
    })
  })
})

const storage = ruleset(({ service }) => {
  service('firebase.storage', ({ match }) => {
    match(`/b/{bucket}/o`, () => {
      match('/{allPaths=**}', ({ allow, and, op }) => {
        allow('read', true)
        if (IS_TEST) {
          allow('write', true)
        } else {
          allow('write', ({ request }) =>
            and(
              op(request.auth.token.email, '==', admin),
              op(request.resource.size, '<', 5 * 1024 * 1024),
              request.resource.contentType.matches('image/.*'),
            ),
          )
          allow('delete', ({ request }) => op(request.auth.token.email, '==', admin))
        }
      })
    })
  })
})

await Promise.all([
  fs.promises.writeFile(config.firestore.rules, await firestore.print()),
  fs.promises.writeFile(config.storage.rules, await storage.print()),
])
