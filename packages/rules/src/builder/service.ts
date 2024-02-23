import { format } from 'prettier'

import { ContextFirestore, PathParams } from '../firestore/namespaces.js'
import { expression, expressionBuilderArgument } from './builder.js'
import { Rule, output, rule } from '../rule/index.js'
import * as rules from '../firestore/interfaces.js'
import { parse, value } from '../parser/parsers.js'
import { print } from '../printer/index.js'
import * as ast from '../ast/index.js'

type Arg<T = any> = { name: string; type: T }
export const arg = <T extends any, K extends string = string>(name: K) => ({ name, type: {} as T })
export const literal = (x: any) => rule(() => expressionBuilderArgument(x))
export const raw = (rules: string) => rule(() => parse(value, rules))

type WithParams<T, A extends Record<string, any> = {}> = T extends `${string}{${infer N}}${infer R}`
  ? PathParams<R, { [K in keyof A | N]: rules.RulesString }>
  : A

type WithArgs<A extends Arg[]> = {
  [K in A[number]['name']]: rules.InferRule<Extract<A[number], { name: K }>['type']>
}

type WithFunction<N extends string, A extends Arg[], R extends any> = {
  [_N in N]: (...args: { [K in keyof A]: A[K]['type'] | rules.InferRule<A[K]['type']> }) => R
}

export interface Rules<C> {
  arg: <T extends any, K extends string = string>(name: K) => { name: K; type: T }
  function: <K extends string, const A extends Arg[], R extends any>(
    name: K,
    args: A,
    cb: (x: C & WithArgs<A>) => R,
  ) => Rules<C & WithFunction<K, A, R>>
  ast: () => ast.RulesDeclartion
  print: () => Promise<string>
  service: {
    (type: 'cloud.firestore', cb: (x: Service<C & ContextFirestore<rules.RulesMap<{}>>>) => Service<C>): Rules<C>
    // (type: 'cloud.storage', cb: <T>(x: Rules<C>) => Rules<C & T>): Rules<C>
  }
}

interface Service<C> {
  function: <K extends string, const A extends Arg[], R extends any>(
    name: K,
    args: A,
    cb: (x: C & WithArgs<A>) => R,
  ) => Service<C & WithFunction<K, A, R>>
  match: {
    <P extends string>(path: P, cb: (x: Match<C & WithParams<P>>) => Match<any>): Service<C>
  }
}

type Allow = 'write' | 'update' | 'delete' | 'create' | 'read' | 'list' | 'get'
interface Match<C> {
  function: <K extends string, const A extends Arg[], R extends any>(
    name: K,
    args: A,
    cb: (x: C & WithArgs<A>) => R,
  ) => Service<C & WithFunction<K, A, R>>
  allow: (x: Allow | Allow[], cb: (x: C) => Rule) => Match<C>
  match: <P extends string>(path: P, cb: (x: Match<C & WithParams<P>>) => Match<any>) => Match<C>
}

export const defineRules = (): Rules<{}> => {
  const rules_ast = ast.rules([[ast.version([ast.literal(['"2"'])])]])

  type Handler<T> = (arr: any[], ret: () => any) => T

  const service: Handler<Rules<any>['service']> = (statements, ret) => (type, handle) => {
    const node = ast.service([type, []])

    const block: Service<any> = {
      function: func(node.statements, () => block) as any,
      match: match(node.statements, () => block),
    }

    handle(block)

    statements.push(ast.empty([]), node)

    return ret()
  }

  const match: Handler<Service<any>['match']> = (statements, ret) => (pth, handle) => {
    const segs = pth
      .split('/')
      .filter(Boolean)
      .map((x) => ast.segment([false, ast.ident([x])]))
    const node = ast.match([ast.path([segs]), []])

    const block: Match<any> = {
      function: func(node.statements, () => block) as any,
      allow: allow(node.statements, () => block),
      match: match(node.statements, () => block) as any,
    }

    handle(block)
    statements.push(node)

    return ret()
  }

  const allow: Handler<Match<any>['allow']> = (statements, ret) => (tp, handle) => {
    const type = Array.isArray(tp) ? tp.map((x) => ast.ident([x])) : [ast.ident([tp])]
    const node = ast.allow([type, output(handle(expression())) as ast.Value])
    statements.push(node)
    return ret()
  }

  const func: Handler<Rules<any>['function']> = (statements, ret: () => any) => (name, args, handler) => {
    const node = ast.func([
      ast.ident([name]),
      args.map((y) => ast.ident([y.name])),
      [ast.func_return([output(handler(expression()) as any) as any])],
    ])
    statements.push(ast.empty([]), node)
    return ret()
  }

  const rules: Rules<{}> = {
    arg: (name) => ({ name, type: undefined as any }),
    function: func(rules_ast.statements, () => rules),
    service: service(rules_ast.statements, () => rules),
    ast: () => rules_ast,
    print: () =>
      format(`rules_version = "2"`, {
        filepath: 'test.test',
        printWidth: 900,
        singleQuote: true,
        plugins: [
          {
            languages: [{ name: 'Test', parsers: ['test'], extensions: ['.test'] }],
            parsers: { test: { astFormat: 'test', locStart: () => 0, locEnd: () => 0, parse: () => rules_ast } },
            printers: { test: { print } },
          },
        ],
      }),
  }

  return rules
}
