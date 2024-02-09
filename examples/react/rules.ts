import { createRuleSet } from '@fiar/rules'

import { articles, test, landing } from './src/admin/entities'

const rules = createRuleSet()
  .addSchema(articles, (op, { request }) => ({
    'allow read': true,
    'allow write': request.auth.token.email.matches('.+@example.com$'),
  }))
  .addSchema(test, (op, { request }) => ({
    'allow read': true,
    'allow write': request.auth.token.email.matches('.+@example.com$'),
  }))
  .addSchema(landing, (op, { request }) => ({
    'allow read': true,
    'allow write': request.auth.token.email.matches('.+@example.com$'),
  }))

rules.writeFile(import.meta.resolve('../../firebase/firestore.rules').slice(7))
