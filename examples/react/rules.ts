import { createFirestoreRuleset } from '@fiar/rules'
import { entities } from './src/admin/entities'

const rules = createFirestoreRuleset(entities, {
  '/articles/{articleId}': (_, { request }) => ({
    'allow read': true,
    'allow write': request.auth.token.email.matches('.@example.com$'),
  }),
  '/pages/landing': (_, { request }) => ({
    'allow read': true,
    'allow write': request.auth.token.email.matches('.@example.com$'),
  }),
  '/test': (_, { request }) => ({
    'allow read': true,
    'allow write': request.auth.token.email.matches('.@example.com$'),
  }),
})

console.log(rules)
