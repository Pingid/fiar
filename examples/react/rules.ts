import { rulset, validate } from '@fiar/rules'
import fs from 'node:fs'

import { articles, test, landing, tags } from './src/admin/entities'

const rules = rulset(({ service }) => {
  service('cloud.firestore', ({ match }) => {
    match('/databases/{database}/documents', ({ match, func, op }) => {
      const isArticle = func('isArticle', [], (c) =>
        validate(c.request.resource.data, { type: 'map', fields: articles.fields }),
      )

      const isTest = func('isTest', [], (c) => validate(c.request.resource.data, { type: 'map', fields: test.fields }))

      const isLanding = func('isLanding', [], (c) =>
        validate(c.request.resource.data, { type: 'map', fields: landing.fields }),
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
        allow('read', (c) => c.debug(c.database))
        allow('create', () => isTag())
        allow('update', () => isTag())
        allow('delete', (c) => op(c.request.auth, '!=', null))
      })
    })
  })
})

rules.print().then((str) => fs.writeFileSync(import.meta.resolve('../../firebase/firestore.rules').slice(7), str))
