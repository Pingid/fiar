import { format } from 'prettier'

import { ContextFirestore, PathParams } from '../firestore/namespaces.js'
import { expression, expressionBuilderArgument } from './builder.js'
import { Rule, output, rule } from '../rule/index.js'
import * as rules from '../firestore/interfaces.js'
import { parse, value } from '../parser/parsers.js'
import { print } from '../printer/index.js'
import * as ast from '../ast/index.js'
// import { FireModel } from '@fiar/schema'
// import { InferSchemaModelRules } from '../schema/index.js'

type Arg<T = any, K extends string = string> = { name: K; type: T }
export const arg = <T extends any, K extends string = string>(name: K) => ({ name, type: {} as T })
export const literal = (x: any) => rule(() => expressionBuilderArgument(x))
export const raw = (rules: string) => rule(() => parse(value, rules))

type WithParams<T, A extends Record<string, any> = {}> = T extends `${string}{${infer N}}${infer R}`
  ? PathParams<R, { [K in keyof A | N]: rules.RulesString }>
  : A

type WithArgs<A extends Arg[]> = {
  [K in A[number]['name']]: rules.InferRule<Extract<A[number], { name: K }>['type']>
}

interface Func<C> {
  <K extends string, const A extends Arg[], R extends any>(
    name: K,
    args: A,
    cb: (x: C & WithArgs<A>) => R,
  ): (...args: { [K in keyof A]: A[K]['type'] | rules.InferRule<A[K]['type']> }) => R
}

type AllowRule = 'write' | 'update' | 'delete' | 'create' | 'read' | 'list' | 'get'
type AllowValue<C> = boolean | Rule | ((x: C) => Rule)
// type AllowMap<C> = Partial<Record<`allow ${AllowRule}`, AllowValue<C>> & { _: (x: MatchScope<C>) => void }>

interface Match<C> {
  <P extends string, F extends (x: MatchScope<C & WithParams<P>>) => any>(path: P, cb: F): any
  // <P extends string, A extends AllowMap<C & WithParams<P>>>(path: P, x: A): any
  // <
  //   M extends FireModel,
  //   F extends (x: MatchScope<C & WithParams<M['path']> & ContextFirestore<InferSchemaModelRules<M>>>) => any,
  // >(
  //   model: M,
  //   cb: F,
  // ): any
  // <F extends FireModel, T extends AllowMap<C & WithParams<F['path']> & ContextFirestore<InferSchemaModelRules<F>>>>(
  //   model: F,
  //   x: T,
  // ): any
}

interface Allow<C> {
  (x: AllowRule | AllowRule[], cb: AllowValue<C>): any
  // <T extends Partial<Record<AllowRule, AllowValue<C>>>>(x: T): any
}

interface Service<C> {
  <N = C & ContextFirestore<rules.RulesMap<{}>>>(type: 'cloud.firestore', cb: (x: ServiceScope<N>) => void): void
}

interface Scope<C> {
  arg: <T extends any, K extends string = string>(name: K) => Arg<T, K>
  func: Func<C>
  // raw: (value: string) => any
}

interface RuleScope<C> extends Scope<C> {
  service: Service<C>
}

interface ServiceScope<C> extends Scope<C> {
  match: Match<C>
}

interface MatchScope<C> extends Scope<C> {
  allow: Allow<C>
  match: Match<C>
}

type Stack<T> = (cb: (...args: any[]) => any) => T
type Scoped<T = any> = (cb: (push: (...args: any[]) => void) => void) => T[]
let current: any[] = []
const scope: Scoped = (cb) => {
  let previous = current
  current = []
  cb((...args) => current.push(...args))
  let next = current
  current = previous
  return next
}

const func: Stack<Func<any>> = (push) => (name, args, handler) => {
  const node = ast.func([
    ast.ident([name]),
    args.map((y) => ast.ident([y.name])),
    [ast.func_return([output(handler(expression()) as any) as any])],
  ])
  push(ast.empty([]), node)
  return expression(() => ast.ident([name]))
}

const service: Stack<Service<any>> = (push) => (name, handler) => {
  const statements = scope((push) =>
    handler({
      arg: (name) => ({ name, type: undefined as any }),
      func: func((...args) => push(...args)),
      match: match((...args) => push(...args)),
    }),
  )
  const node = ast.service([name, statements])
  push(ast.empty([]), node)
}

const match: Stack<Match<any>> = (push) => (a, handler) => {
  const statements = scope((push) => {
    handler({
      arg: (name) => ({ name, type: undefined as any }),
      func: func((...args) => push(...args)),
      match: match((...args) => push(...args)),
      allow: allow((...args) => push(...args)),
    })
  })

  const segments = a
    .split('/')
    .filter(Boolean)
    .map((x) => ast.segment([false, ast.literal([x])]))

  const node = ast.match([ast.path([segments]), statements])

  push(ast.empty([]), node)
}

const allow: Stack<Allow<any>> = (push) => (a, b) => {
  const types = (Array.isArray(a) ? a : [a]).map((x) => ast.ident([x]))
  const value =
    typeof b === 'boolean' ? ast.literal([`${b}`]) : typeof b === 'function' ? output(b(expression())) : output(b)
  push(ast.allow([types, value as ast.Value]))
}

export const rulset = (
  handler: (x: RuleScope<{}>) => void,
): {
  ast: () => ast.RulesDeclartion
  print: () => Promise<string>
} => {
  const statements = scope((push) => {
    handler({
      arg: (name) => ({ name, type: undefined as any }),
      func: func((...args) => push(...args)),
      service: service((...args) => push(...args)),
    })
  })

  const node = ast.rules([[ast.version([ast.literal(['"2"'])]), ...statements]])

  return {
    ast: () => node,
    print: () =>
      format(`rules_version = "2"`, {
        filepath: 'test.test',
        plugins: [
          {
            languages: [{ name: 'Test', parsers: ['test'], extensions: ['.test'] }],
            parsers: { test: { astFormat: 'test', locStart: () => 0, locEnd: () => 0, parse: () => node } },
            printers: { test: { print } },
          },
        ],
      }),
  } as any
}
