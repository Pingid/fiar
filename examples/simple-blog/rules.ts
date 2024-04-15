import { ruleset } from 'fiar/rules'
import fs from 'node:fs'
import 'dotenv/config'

import { post } from './src/models.js'

const rules = ruleset(({ service }) => {
  service('firebase.storage', ({ match }) => {
    match('/b/{bucket}/o', () => {
      match('/examples/simple-blog/photos/{name}', ({ allow, op, and }) => {
        allow('read', true)
        allow('write', ({ request }) =>
          and(
            op(request.auth.token.email, '==', process.env.ADMIN_USER),
            op(request.resource.size, '<', 5 * 1024 * 1024),
            request.resource.contentType.matches('image/.*'),
          ),
        )
        allow('delete', ({ request }) => op(request.auth.token.email, '==', process.env.ADMIN_USER))
      })
    })
  })

  service('cloud.firestore', ({ match }) => {
    match('/databases/(default)/documents', () => {
      match(post, ({ allow, isValid, and, op }) => {
        allow('read', true)
        allow('write', ({ request }) => and(op(request.auth.token.email, '==', process.env.ADMIN_USER), isValid()))
      })
    })
  })
})

await fs.promises.writeFile('./firebase.rules', await rules.print())
