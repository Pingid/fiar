import type { Options } from 'prettier'

import { expression, expressionBuilderArgument, op, and, or } from './expressions.js'
import { ContextFirestore, ContextStorage } from '../firestore/namespaces.js'
import { Rule, output, rule } from '../rule/index.js'
import { parse, value } from '../parser/parsers.js'
import { formatAst } from '../printer/index.js'

import * as rules from '../firestore/index.js'
import * as ast from '../ast/index.js'
import * as scope from './scope.js'

type Service<C> = {
  <N = C & ContextFirestore<rules.RulesMap<{}>>>(type: 'cloud.firestore', cb: (x: ServiceScope<N>) => void): void
  <N = C & ContextStorage>(type: 'firebase.storage', cb: (x: ServiceScope<N>) => void): void
}
export const service: Service<any> = (name, handler) => {
  const statements = scope.create(() => handler({ arg, func, match, op: op, and, or }))
  const node = ast.service([name, statements])
  scope.push(ast.empty([]), node)
  return node
}

type Arg<T = any, K extends string = string> = { name: K; type: T }
export const arg = <T extends any, K extends string = string>(name: K) => ({ name, type: {} as T })

type Func<C> = <K extends string, const A extends Arg[], R extends any>(
  name: K,
  args: A,
  cb: (
    x: C & {
      [K in A[number]['name']]: rules.InferRule<Extract<A[number], { name: K }>['type']>
    },
  ) => R,
) => (...args: { [K in keyof A]: A[K]['type'] | rules.InferRule<A[K]['type']> }) => R
export const func: Func<any> = (name, args, handler) => {
  const node = ast.func([
    ast.ident([name]),
    args.map((y) => ast.ident([y.name])),
    [ast.func_return([output(handler(expression()) as any) as any])],
  ])
  scope.push(ast.empty([]), node)
  return expression(() => ast.ident([name]))
}

type PathParams<T, A extends Record<string, any> = {}> = T extends `${string}{${infer N}}${infer R}`
  ? PathParams<R, { [K in keyof A | N]: rules.RulesString }>
  : A
type WithPathParams<T, A extends Record<string, any> = {}> = T extends `${string}{${infer N}}${infer R}`
  ? PathParams<R, { [K in keyof A | N]: rules.RulesString }>
  : A
interface Match<C> {
  <P extends string, F extends (x: MatchScope<C & WithPathParams<P>>) => any>(path: P, cb: F): any
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
export const match: Match<any> = (a, handler) => {
  const statements = scope.create(() => handler({ arg, func: func, match, allow, op, and, or }))

  const segments = a
    .split('/')
    .filter(Boolean)
    .map((x) => ast.segment([false, ast.literal([x])]))

  const node = ast.match([ast.path([segments]), statements])

  scope.push(ast.empty([]), node)
  return node
}

type AllowRule = 'write' | 'update' | 'delete' | 'create' | 'read' | 'list' | 'get'
type AllowValue<C> = boolean | Rule | ((x: C) => Rule)
// type AllowMap<C> = Partial<Record<`allow ${AllowRule}`, AllowValue<C>> & { _: (x: MatchScope<C>) => void }>
type Allow<C> = (x: AllowRule | AllowRule[], cb: AllowValue<C>) => any
export const allow: Allow<any> = (a, b) => {
  const types = (Array.isArray(a) ? a : [a]).map((x) => ast.ident([x]))
  const value =
    typeof b === 'boolean' ? ast.literal([`${b}`]) : typeof b === 'function' ? output(b(expression())) : output(b)
  const node = ast.allow([types, value as ast.Value])
  scope.push(node)
  return node
}

export const literal = (x: any) => rule(() => expressionBuilderArgument(x))
export const raw = (rules: string) => rule(() => parse(value, rules))

interface Scope<C> {
  arg: <T extends any, K extends string = string>(name: K) => Arg<T, K>
  func: Func<C>
  op: typeof op
  or: typeof or
  and: typeof and
}

interface RulesetScope<C> extends Scope<C> {
  service: Service<C>
}

interface ServiceScope<C> extends Scope<C> {
  match: Match<C>
}

interface MatchScope<C> extends Scope<C> {
  allow: Allow<C>
  match: Match<C>
}

export const rulset = (
  handler: (x: RulesetScope<{}>) => void,
): { ast: () => ast.RulesDeclartion; print: () => Promise<string> } => {
  const statements = scope.create(() => handler({ arg, func, service, op: op, and, or }))

  const node = ast.rules([[ast.version([ast.literal(['"2"'])]), ...statements]])

  return {
    ast: () => node,
    print: (options?: Options) => formatAst(node, options),
  } as any
}
