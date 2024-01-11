import { createRuleSet } from '@fiar/rules'
import { articles, test, landing } from './src/admin/entities'
import path from 'node:path'

const rules = createRuleSet()
  .addSchema(articles, (op, { request }) => ({
    'allow read': true,
    'allow write': request.auth.token.email.matches('.+@example.com$'),
  }))
  .addSchema(test, (op, { request }) => ({
    'allow read': true,
    'allow write': request.auth.token.email.matches('.@example.com$'),
  }))
  .addSchema(landing, (op, { request }) => ({
    'allow read': true,
    'allow write': request.auth.token.email.matches('.@example.com$'),
  }))

rules.writeFile(path.resolve('../../firebase/firestore.rules'))
// const rules = createFirestoreRuleset(entities, {
//   '/articles/{articleId}': (_, { request }) => ({
// 'allow read': true,
// 'allow write': request.auth.token.email.matches('.@example.com$'),
//   }),
//   '/pages/landing': (_, { request }) => ({
//     'allow read': true,
//     'allow write': request.auth.token.email.matches('.@example.com$'),
//   }),
//   '/test': (_, { request }) => ({
//     'allow read': true,
//     'allow write': request.auth.token.email.matches('.@example.com$'),
//   }),
// })

console.log(rules)
