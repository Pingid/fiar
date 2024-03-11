import { it, describe } from 'vitest'
import { s, model } from '@fiar/schema'

import { validate } from '../schema/rules.js'
import { rulset } from './ruleset.js'

const typ = model({
  type: 'collection',
  path: '/articles/{articleId}',
  fields: {
    title: s.string(),
    author: s.path(),
    body: s.string(),
    tags: s.list({ of: s.string() }),
  },
})

describe('expression builder', () => {
  rulset(({ service, func, arg, op }) => {
    const isAdmin = func('isAdmin', [arg<string, 'email'>('email')], (x) => op(x.email, 'in', ['james@gmail.com']))

    service('cloud.firestore', ({ match }) => {
      match('/users/{userId}', ({ allow, match }) => {
        allow('read', op(true, '==', true))
        allow('write', (c) => isAdmin(c.request.auth.token.email))
        match('/users/{userId}', ({ allow, match }) => {
          allow('read', op(true, '==', true))
          allow('write', (c) => isAdmin(c.request.auth.token.email))
          match('/users/{userId}', ({ allow }) => {
            allow('read', (c) => validate(c.request.resource.data, { type: 'map', fields: typ.fields }))
            allow('write', (c) => isAdmin(c.request.auth.token.email))
            func('scopped', [], () => op(10, '==', 10))
          })
        })
      })
      match('/users/{userId}', ({ allow }) => {
        allow('read', op(true, '==', true))
        allow('write', (c) => isAdmin(c.request.auth.token.email))
      })
      // match('/articles/{articleId}', {
      //   'allow read': true,
      //   'allow write': (c) => isAdmin(c.request.auth.token.email),
      // })
      // match(typ, {
      //   'allow read': true,
      //   'allow write': (c) => isAdmin(c.request.auth.token.email),
      //   _: ({ match }) => {
      //     match('/nested/{nestedId}', {
      //       'allow read': true,
      //     })
      //   },
      // })
    })
  })

  // const r = defineRules()
  //   .function('isAdmin', [arg<string, 'email'>('email')], (x) => op.in(x.email, ['james@gmail.com']))
  //   .service('cloud.firestore', ({ match }) => {
  //     match('/users/{userId}', ({ allow, match }) => {
  //       allow('read', () => raw('true'))
  //       allow('write', (y) => y.isAdmin(y.request.auth.token.email))
  //       match('/cool/{beans}', (x) => x.allow(['read', 'write'], () => literal(true)))
  //     })
  //   })

  // const r2 = defineRules()
  //   .function('isAdmin', [arg<string, 'email'>('email')], (x) => op.in(x.email, ['james@gmail.com']))
  //   .service('cloud.firestore', ({ match }) => {
  //     match('/users/{userId}', {
  //       read: true,
  //       write: (c) => c.isAdmin(c.request.auth.token.email),
  //       _: (c) => c.match('cool/{bean}', { read: (c) => raw('true') }),
  //     })
  //     match(typ, {
  //       read: true,
  //     })
  //   })

  it('should', async () => {
    // console.log(JSON.stringify(r.ast(), null, 2))
    // console.log(await r.print())
  })
})
