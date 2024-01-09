import { FireModel } from '@fiar/schema'

import { Rule, RuleGroup, computed } from './base.js'
import { InferSchemaRules } from '../schema/index.js'
import { ContextFirestore } from './namespaces.js'
import { Operators } from './interfaces.js'
import { strictModel } from './model-rules.js'

const isRule = (x: unknown): x is Rule => !!(x && typeof (x as any)[computed] !== 'undefined')

const argToString = (value: unknown): string => {
  if (isRule(value)) return compute(value, 0)
  if (typeof value === 'number') return `${value}`
  if (typeof value === 'string') return `'${value}'`
  if (typeof value === 'boolean') return `${value}`
  if (value === null) return `null`
  if (Array.isArray(value)) return `[${value.map(argToString).join(`, `)}]`
  return JSON.stringify(value)
  throw new Error(`Unknown value ${JSON.stringify({ value })}`)
}

export const rule = <T>(accessor: string = ''): T => {
  return new Proxy((() => accessor) as any, {
    apply: (_a, _b, c) => rule(`${accessor}(${c.map(argToString).join(', ')})`),
    get: (_t, k) => {
      if (k === computed) return ['&&', [accessor]]
      if (typeof k !== 'string') throw new Error(`Unknown type accessor`)
      if (/^\d{1,}:\d{1,}$/.test(k)) return rule(`${accessor}[${k as any}]`)
      if (/^\d{1,}$/.test(k)) return rule(`${accessor}[${k as any}]`)
      return rule(`${accessor}${accessor ? '.' : ''}${k as string}`)
    },
  })
}

export const compute = <R extends Rule>(rule: R | string | RuleGroup, indent = 0) => {
  if (typeof rule === 'string') return rule
  console.log(typeof rule === 'string', isRule(rule), flattenGroup(rule as any))
  if (isRule(rule)) return formatGroups(flattenGroup((rule as any)[computed]), indent)
  return formatGroups(flattenGroup(rule), indent)
}

const flattenGroup = ([join, data]: RuleGroup): RuleGroup => {
  const groups = data.reduce<RuleGroup[1]>((a, b) => {
    if (Array.isArray(b) && b[0] === join) return [...a, ...b[0]]
    if (isRule(b) && Array.isArray(b[computed]) && b[computed][0] === join) return [...a, ...b[computed][1]]
    return [...a, b]
  }, [])
  return [join, groups]
}

export const formatGroups = ([join, data]: RuleGroup, indent = 1): string => {
  console.log({
    join,
    data,
    result: data.reduce<string>((a, b) => {
      const init = a ? `${a} ${join}\n${'\t'.repeat(indent)}` : ''
      if (typeof b === 'string') return `${init}${b}`
      if (isRule(b)) return `${init}${compute(b, indent)}`
      if (b[1].length === 0) return a
      return `${init}(${formatGroups(b, indent + 1)})`
    }, ''),
  })
  return data.reduce<string>((a, b) => {
    const init = a ? `${a} ${join}\n${'\t'.repeat(indent)}` : ''
    if (typeof b === 'string') return `${init}${b}`
    if (isRule(b)) return `${init}${compute(b, indent)}`
    if (b[1].length === 0) return a
    return `${init}(${formatGroups(b, indent + 1)})`
  }, '')
}

const opF = (div: string) => (a: any, b: any) =>
  ({ [computed]: ['&&', [`${argToString(a)} ${div} ${argToString(b)}`]] }) as any

export const op: Operators = {
  is: (a, type) => ({ [computed]: ['&&', [`${argToString(a)} is ${type}`]] }) as any,
  in: (a: any, b: any) => ({ [computed]: ['&&', [`${argToString(b)} in ${argToString(a)}`]] }) as any,
  and: (...args) => ({ [computed]: ['&&', args] }) as any,
  or: (...args) => ({ [computed]: ['||', args] }) as any,
  eq: opF('=='),
  neq: opF('!='),
  gt: opF('>'),
  lt: opF('<'),
  gte: opF('>='),
  lte: opF('<='),
  add: opF('+'),
  sub: opF('-'),
  div: opF('/'),
  mult: opF('*'),
  mod: opF('%'),
}

export const context = {
  firestore: <T extends Record<string, any>, P extends `/${string}`>() => rule<ContextFirestore<T, P>>(''),
}

type Allow =
  | 'allow read'
  | 'allow write'
  | 'allow get'
  | 'allow list'
  | 'allow update'
  | 'allow delete'
  | 'allow create'

type CastModel<T> = T extends FireModel ? InferSchemaRules<{ type: 'map'; fields: T['fields'] }> : never

export const createFirestoreRuleset = <
  T extends ReadonlyArray<FireModel>,
  R extends {
    [K in T[number]['path']]: (
      operators: Operators,
      context: ContextFirestore<CastModel<Extract<T[number], { path: K }>>, K>,
    ) => Partial<Record<Allow, Rule | boolean | string>> & { strict?: boolean }
  },
>(
  models: T,
  ruleset: R,
) => {
  Object.keys(ruleset).map((key) => {
    const model = models.find((x) => x.path === key)
    const creator = ruleset[key as keyof typeof ruleset] as any
    const result = creator(op, rule<any>(''))
    const strict = strictModel(model as any, 'write')

    if (result['allow write']) {
      result['allow write'] = op.and(strict, result['allow write'])
    } else {
      result['allow write'] = strict
    }

    const fixed: any = Object.fromEntries(
      Object.keys(result)
        .map((rule) => {
          if (rule === 'strict') return null as any
          const computed = (() => {
            if (typeof result[rule] === 'boolean') return `${result[rule]}`
            if (typeof result[rule] === 'string') return result[rule]
            return compute(result[rule])
          })()
          return [rule, computed]
        })
        .filter(Boolean),
    )
    console.log({ model, fixed })
  })
  return { models }
  // return { models, ruleset }
}
