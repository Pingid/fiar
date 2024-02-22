import * as rules from '../firestore/interfaces.js'
import * as ast from '../ast/index.js'

import { ContextFirestore, PathParams } from '../firestore/namespaces.js'
import { isRule, Rule } from '../rule/index.js'

export * from './operators.js'

export interface Rules<C> {
  function: <K extends string, const A extends Arg[], R extends any>(
    name: K,
    args: A,
    cb: (x: C & { [K in A[number]['name']]: rules.InferRule<Extract<A[number], { name: K }>['type']> }) => R,
  ) => Rules<C & { [_K in K]: (...args: { [K in keyof A]: A[K]['type'] }) => R }>
  service: {
    (
      type: 'cloud.firestore',
      cb: (x: ServiceFirestore<C & ContextFirestore<rules.RulesMap<{}>>>) => ServiceFirestore<C>,
    ): Rules<C>
    // (type: 'cloud.storage', cb: <T>(x: Rules<C>) => Rules<C & T>): Rules<C>
  }
}

interface ServiceFirestore<C> {
  function: <K extends string, const A extends Arg[], R extends any>(
    name: K,
    args: A,
    cb: (x: C & { [K in A[number]['name']]: rules.InferRule<Extract<A[number], { name: K }>['type']> }) => R,
  ) => ServiceFirestore<C & { [_K in K]: (...args: { [K in keyof A]: A[K]['type'] }) => R }>
  match: <P extends string>(path: P, cb: (x: Match<P, C>) => Match<string, any>) => ServiceFirestore<C>
}

type Allow = 'read' | 'write'
interface Match<P extends string, C> {
  function: <K extends string, const A extends Arg[], R extends any>(
    name: K,
    args: A,
    cb: (x: C & { [K in A[number]['name']]: rules.InferRule<Extract<A[number], { name: K }>['type']> }) => R,
  ) => Match<P, C & { [_K in K]: (...args: { [K in keyof A]: A[K]['type'] }) => R }>
  allow: (x: Allow | Allow[], cb: (x: PathParams<P> & C) => Rule) => Match<P, C>
  match: <P2 extends string>(
    path: P2,
    cb: (x: Match<`${P}${P2}`, C>) => Match<`${P}${P2}`, any>,
  ) => Match<`${P}${P2}`, C>
}

type Arg<T = any> = { name: string; type: T }
// const arg = <T extends any, K extends string = string>(name: K) => ({ name, type: {} as T })

// const r = {} as Rules<{}>
// r.service('cloud.firestore', (x) =>
//   x
//     .function('isAuthed', [arg('data')], (c) => op.eq(c.request.auth.token.email, 'foo@bar.com'))
//     .match('/users/{userId}', (x) => x.allow(['read', 'write'], (y) => y.isAuthed('')))
//     .match('/cool', (x) => x.allow('write', (c) => op.eq(c.request.auth, null))),
// )

type Member = ast.MemberExpression | ast.CallExpression

export const builder = <T extends object>(parent?: (x: Member | ast.Ident) => Member): T => {
  const bolder = (cb: (x: Member | ast.Ident) => Member) => builder((x) => cb(parent ? parent(x) : x))

  return new Proxy((() => {}) as any, {
    apply: (_a, _b, c) => bolder((x) => ast.call([x, c.map((x) => ast.literal([`${x}`]))])),
    get: (_t, k) => {
      if (isRule({ [k]: () => {} })) return (arg: any) => (parent ? parent(arg) : arg)
      if (typeof k !== 'string') throw new Error(`Unknown type accessor`)

      if (/^\d{1,}:\d{1,}$/.test(k)) return bolder((x) => ast.member([x, true, ast.literal([k])]))
      if (/^\d{1,}$/.test(k)) return bolder((x) => ast.member([x, true, ast.literal([k])]))
      return bolder((x) => ast.member([x, false, ast.ident([k])]))
    },
  })
}
