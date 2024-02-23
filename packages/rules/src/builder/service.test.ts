import { it, describe } from 'vitest'

import { arg, defineRules, literal, raw } from './service.js'
import { op } from './builder.js'

describe('expression builder', () => {
  const r = defineRules()
    .function('isAdmin', [arg<string, 'email'>('email')], (x) => op.in(x.email, ['james@gmail.com']))
    .service('cloud.firestore', (x) =>
      x.match('/users/{userId}', (x) =>
        x
          .allow('read', () => raw('true'))
          .allow('write', (y) => y.isAdmin(y.request.auth.token.email))
          .match('/cool/{beans}', (x) => x.allow(['read', 'write'], () => literal(true))),
      ),
    )

  it('should', async () => {
    // console.log(JSON.stringify(r.ast(), null, 2))
    console.log(await r.print())
  })
})
