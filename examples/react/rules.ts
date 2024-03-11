import { rulset, validate } from '@fiar/rules'
import fs from 'node:fs'

import { articles, test, landing, tags } from './src/admin/entities'

const rules = rulset(({ service }) => {
  // Storage rules
  service('firebase.storage', ({ match }) => {
    match('/b/{bucket}/o', ({ match }) => {
      match('/photos/{name}', ({ allow }) => {
        allow('read', true)
        allow('write', true)
      })
    })
  })

  // Firestore rules
  service('cloud.firestore', ({ match }) => {
    match('/databases/(default)/documents', ({ match, func, op }) => {
      const isArticle = func('isArticle', [], ({ request }) =>
        validate(request.resource.data, { type: 'map', fields: articles.fields }),
      )

      const isTest = func('isTest', [], ({ request }) =>
        validate(request.resource.data, { type: 'map', fields: test.fields }),
      )

      const isLanding = func('isLanding', [], ({ request }) =>
        validate(request.resource.data, { type: 'map', fields: landing.fields }),
      )

      const isTag = func('isTag', [], (c) => validate(c.request.resource.data, { type: 'map', fields: tags.fields }))

      match(articles.path, ({ allow }) => {
        allow('read', true)
        allow('create', () => isArticle())
        allow('update', () => isArticle())
        allow('delete', (c) => op(c.request.auth, '!=', null))
      })

      match(test.path, ({ allow }) => {
        allow('read', true)
        allow('create', () => isTest())
        allow('update', () => isTest())
        allow('delete', (c) => op(c.request.auth, '!=', null))
      })

      match(landing.path, ({ allow }) => {
        allow('read', true)
        allow('create', () => isLanding())
        allow('update', () => isLanding())
        allow('delete', (c) => op(c.request.auth, '!=', null))
      })

      match(tags.path, ({ allow }) => {
        allow('read', true)
        allow('create', () => isTag())
        allow('update', () => isTag())
        allow('delete', (c) => op(c.request.auth, '!=', null))
      })
    })
  })
})

rules.print().then((str) => fs.writeFileSync(import.meta.resolve('../../firebase/firebase.rules').slice(7), str))
