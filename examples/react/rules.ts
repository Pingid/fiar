import { rulset } from '@fiar/rules'
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
      match('/icons/{name}', ({ allow }) => {
        allow('read', true)
        allow('write', true)
      })
    })
  })

  // Firestore rules
  service('cloud.firestore', ({ match }) => {
    match('/databases/(default)/documents', ({ match, op }) => {
      match(articles, ({ allow, isValid }) => {
        allow('read', true)
        allow('create', () => isValid())
        allow('update', () => isValid())
        allow('delete', (c) => op(c.request.auth, '!=', null))
      })

      match(test, ({ allow, isValid }) => {
        allow('read', true)
        allow('create', () => isValid())
        allow('update', () => isValid())
        allow('delete', (c) => op(c.request.auth, '!=', null))
      })

      match(landing, ({ allow, isValid }) => {
        allow('read', true)
        allow('create', () => isValid())
        allow('update', () => isValid())
        allow('delete', (c) => op(c.request.auth, '!=', null))
      })

      match(tags, ({ allow, isValid }) => {
        allow('read', true)
        allow('create', () => isValid())
        allow('update', () => isValid())
        allow('delete', (c) => op(c.request.auth, '!=', null))
      })
    })
  })
})

rules.print().then((str) => fs.writeFileSync(import.meta.resolve('../../firebase/firebase.rules').slice(7), str))
