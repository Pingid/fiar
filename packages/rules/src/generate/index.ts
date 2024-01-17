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

export interface RuleSet<Funcs extends Operators = Operators> {
  toString: () => string
  writeFile: (path: string) => void
  addFunction<N extends string>(name: N): RuleSet
  addSchema: <F extends FireModel>(
    schema: F,
    cb: (
      operators: Funcs,
      context: ContextFirestore<
        InferSchemaRules<{ type: 'map'; fields: F['fields'] } extends infer R ? R : never>,
        F['path']
      >,
    ) => Partial<Record<Allow, Rule | boolean | string>> & { strict?: boolean },
  ) => RuleSet
}

export const createRuleSet = () => {
  //   const formatter = defaultFormatter({ indent: 2 })
  const functions: (readonly [string, Rule | RuleGroup])[] = []
  const rules: Record<string, Record<string, Rule | RuleGroup>> = {}
  const set: RuleSet = {
    addFunction: () => set,
    toString: () => JSON.stringify(rules, null, 2),
    writeFile: (path) => {
      const wrap = (x: string) => `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

${x}
  }
}`
      const pad = (n: number) => '\t'.repeat(n)
      const indent1 = pad(1)
      const indent2 = pad(2)

      const funcs = functions
        .map(
          (x) =>
            `${indent1}function ${x[0]}(data) {\n${indent2}return ${format(
              x[1],
              defaultFormatter(),
            ).trim()}\n${indent1}}\n`,
        )
        .join('\n')

      const inner = Object.keys(rules)
        .map((pth) => {
          const inner = Object.keys(rules[pth]!).map(
            (key) => `${indent2}${key}: if ${format(rules[pth]![key]!, defaultFormatter({ start: 3 }))?.trim()}`,
          )
          return `${indent1}match ${pth} {\n${inner.join('\n')}\n${indent1}}`
        })
        .join('\n\n')
      fs.writeFileSync(path, wrap(`${funcs}\n${inner}`).trim())
    },
    addSchema(schema, cb) {
      const name =
        'validate' +
        schema.path
          .replace(/\{[^\}]+\}$/g, '')
          .split('/')
          .filter(Boolean)
          .map((x) => x[0]?.toUpperCase() + x.slice(1))
          .join('')

      const path = getSchemaPathMatch(schema)

      const strict = transformRule(
        rule(() => 'data'),
        { type: 'map', fields: schema.fields },
      )

      functions.push([name, strict])

      const assert = rule(() => `${name}(request.resource.data)`)

      rules[path] = {
        'allow update': assert,
        'allow create': assert,
      }

      const result = cb(op, rule())
      for (const key in result) {
        rules[path]![key] = result[key as Allow] as Rule
      }

      const write = rules[path]?.['allow write']
      const update = rules[path]?.['allow update']

      rules[path]!['allow update'] = write || update ? op.and((write || update) as any, assert) : assert
      rules[path]!['allow create'] = write || update ? op.and((write || update) as any, assert) : assert

      return set
    },
  }
  return set
}

const getSchemaPathMatch = (schema: FireModel) => {
  if (schema.type === 'document') return schema.path
  if (/\{[^\}]+\}$/g.test(schema.path)) return schema.path
  return `${schema.path}/{id}`
}

// const formater = () => {}
// export const context = {

//     firestore: <T extends Record<string, any>, P extends `/${string}`>() => rule<ContextFirestore<InferRule<T>, P>>(''),
//   }
