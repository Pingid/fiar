import { FireModel } from '@fiar/schema'
import fs from 'node:fs'

import { Rule, RuleGroup, defaultFormatter, format, rule } from '../rule/index.js'
import { ContextFirestore } from '../firestore/namespaces.js'
import { Operators } from '../firestore/interfaces.js'
import { InferSchemaRules } from '../schema/index.js'
import { transformRule } from '../schema/rules.js'
import { op } from '../firestore/operators.js'

type Allow =
  | 'allow get'
  | 'allow read'
  | 'allow list'
  | 'allow write'
  | 'allow update'
  | 'allow delete'
  | 'allow create'

export interface RuleSet {
  toString: () => string
  writeFile: (path: string) => void
  addSchema: <F extends FireModel>(
    schema: F,
    cb: (
      operators: Operators,
      context: ContextFirestore<
        InferSchemaRules<{ type: 'map'; fields: F['fields'] } extends infer R ? R : never>,
        F['path']
      >,
    ) => Partial<Record<Allow, Rule | boolean | string>> & { strict?: boolean },
  ) => RuleSet
}

export const createRuleSet = () => {
  //   const formatter = defaultFormatter({ indent: 2 })
  const rules: Record<string, Record<string, Rule | RuleGroup>> = {}
  const set: RuleSet = {
    toString: () => JSON.stringify(rules, null, 2),
    writeFile: (path) => {
      const wrap = (x: string) => `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

${x}
  }
}`
      const space = (n: number) => ' '.repeat(n)

      const inner = Object.keys(rules)
        .map((pth) => {
          const inner = Object.keys(rules[pth]!).map(
            (key) =>
              `${space(6)}${key}: if ${format(rules[pth]![key]!, defaultFormatter({ indent: 2, start: 10 }))?.trim()}`,
          )
          return `${space(4)}match ${pth} {\n${inner.join('\n')}\n${space(4)}}`
        })
        .join('\n\n')

      fs.writeFileSync(path, wrap(inner).trim())
    },
    addSchema(schema, cb) {
      const result = cb(
        op,
        rule(() => ''),
      )
      const strict = transformRule(
        rule(() => 'request.resource.data'),
        { type: 'map', fields: schema.fields },
      )

      rules[schema.path] = {
        'allow update': strict,
        'allow create': strict,
      }

      for (const key in result) {
        rules[schema.path]![key] = result[key as Allow] as Rule
      }

      const write = rules[schema.path]?.['allow write']
      const update = rules[schema.path]?.['allow update']

      rules[schema.path]!['allow update'] = write || update ? op.and((write || update) as any, strict) : strict
      rules[schema.path]!['allow create'] = write || update ? op.and((write || update) as any, strict) : strict

      return set
    },
  }
  return set
}
// export const context = {
//     firestore: <T extends Record<string, any>, P extends `/${string}`>() => rule<ContextFirestore<InferRule<T>, P>>(''),
//   }

//   // type CastModel<T> = T extends FireModel ? { [K in keyof T['fields']]: InferSchemaRules<T['fields'][K]> } : never
//   // type CastMap<T> = T extends Record<string, Rule> ? RulesMap<T> : never
//   // type InferModel<F extends FireModel> = {
//   //   0: InferSchemaRules<{ type: 'map'; fields: F['fields'] }>
//   //   1: never
//   // }[F['fields'] extends Record<string, Rule> ? 0 : 1]

//   type ExtractModel<T extends ReadonlyArray<FireModel>, K extends string> = InferSchemaRules<{
//     type: 'map'
//     fields: Extract<T[number], { path: K }>['fields']
//   }>

//   export const createEntityRules = <F extends FireModel>(
//     entity: F,
//     cb: (
//       operators: Operators,
//       context: InferSchemaRules<{ type: 'map'; fields: F['fields'] } extends infer R ? R : never>,
//     ) => Partial<Record<Allow, Rule | boolean | string>> & { strict?: boolean },
//   ) => {
//     return { entity, cb }
//   }
//   export const createFirestoreRuleset = <
//     T extends ReadonlyArray<FireModel>,
//     R extends {
//       [K in T[number]['path']]: (
//         operators: Operators,
//         context: ContextFirestore<ExtractModel<T, K>, K>,
//       ) => Partial<Record<Allow, Rule | boolean | string>> & { strict?: boolean }
//     },
//   >(
//     models: T,
//     ruleset: R,
//   ) => {
//     Object.keys(ruleset).map((key) => {
//       const model = models.find((x) => x.path === key)
//       const creator = ruleset[key as keyof typeof ruleset] as any
//       const result = creator(op, rule<any>(''))
//       const strict = strictSchema(model?.fields as any)

//       if (result['allow write']) {
//         result['allow write'] = op.and(strict, result['allow write'])
//       } else {
//         result['allow write'] = strict
//       }

//       const fixed: any = Object.fromEntries(
//         Object.keys(result)
//           .map((rule) => {
//             if (rule === 'strict') return null as any
//             const computed = (() => {
//               if (typeof result[rule] === 'boolean') return `${result[rule]}`
//               if (typeof result[rule] === 'string') return result[rule]
//               return compute(result[rule])
//             })()
//             return [rule, computed]
//           })
//           .filter(Boolean),
//       )
//       console.log({ model, fixed })
//     })
//     return { models }
//     // return { models, ruleset }
//   }
