import type { IFieldPrimitive } from '@fiar/schema'

import * as rules from '../firestore/interfaces.js'
import * as ast from '../ast/index.js'

import { Rule, isRule, output, rule } from '../rule/index.js'

type Member = ast.MemberExpression | ast.CallExpression

export const expressionBuilderArgument = (x: any, left?: ast.Ast): ast.Value => {
  if (isRule(x)) return output(x, left) as ast.Value
  if (x === null) return ast.ident([`null`])
  if (typeof x === 'string') return ast.literal([`"${x}"`])
  if (typeof x === 'number') return ast.literal([`${x}`])
  if (typeof x === 'boolean') return ast.literal([`${x}`])
  if (Array.isArray(x)) return ast.array([x.map((y) => expressionBuilderArgument(y, left))])
  if (typeof x === 'object') {
    return ast.object([
      Object.entries(x).map(([key, value]) =>
        ast.property([ast.literal([key]), expressionBuilderArgument(value, left)]),
      ),
    ])
  }
  throw new Error(`Unkown argument ${x}`)
}

export const expression = <T extends object>(
  parent?: (x?: Member | ast.Ident) => Member | ast.Ident | ast.Literal,
): T => {
  return new Proxy((() => {}) as any, {
    apply: (_a, _b, c) => {
      return expression((x) => {
        const left = parent ? parent(x) : x
        if (!left) throw new Error(`Hanging call expression`)
        return ast.call([left as any, c.map((a) => expressionBuilderArgument(a, x))])
      })
    },
    get: (_t, k) => {
      if (isRule({ [k]: () => {} })) return (arg: any) => (parent ? parent(arg) : arg)
      if (typeof k !== 'string') throw new Error(`Unknown type accessor`)
      if (/^\d{1,}$/.test(k) || /^\d{1,}:\d{1,}$/.test(k)) {
        return expression((x) => {
          const next = parent ? parent(x) : x
          if (!next) return ast.literal([k])
          return ast.member([next, true, ast.literal([k])])
        })
      }
      return expression((x) => {
        const next = parent ? parent(x) : x
        if (!next) return ast.ident([k])
        return ast.member([next, false, ast.ident([k])])
      })
    },
  })
}

type NonEmpty<T> = [T, ...T[]]

const logical: (operator: string) => (...args: NonEmpty<rules.RulesBoolean>) => Rule<boolean> =
  (operator) =>
  (left, right, ...rest) => {
    if (!right) return left
    return rule((x) => ({
      ...rest.reduce(
        (a, b) => ast.expression([false, a, undefined, operator, output(b, x) as ast.Value]),
        ast.expression([false, output(left, x) as ast.Value, undefined, operator, output(right, x) as ast.Value]),
      ),
      param: true,
    }))
  }

const joined = (div: string) => (a: Rule<any> | any, b: Rule<any> | any) =>
  rule((x) => ast.expression([false, expressionBuilderArgument(a, x), undefined, div, expressionBuilderArgument(b, x)]))

export const and: (...args: NonEmpty<rules.RulesBoolean>) => Rule<boolean> = logical('&&')

export const or: (...args: NonEmpty<rules.RulesBoolean>) => Rule<boolean> = logical('||')

export const is: (a: Rule, type: IFieldPrimitive) => rules.RulesBoolean = (a, type) =>
  rule((left) => ast.expression([false, expressionBuilderArgument(a, left), undefined, 'is', ast.ident([type])]))

export const In: rules.In = (a: any, b: any) => joined('in')(a, b)
// in: rules.In
// eq: rules.Eq
// neq: rules.Neq
// gt: rules.Gt
// lt: rules.Lt
// gte: rules.Gte
// lte: rules.Lte
// add: rules.Add
// sub: rules.Sub
// div: rules.Div
// mult: rules.Mult
// mod: rules.Mod

export const operators = { and, or, is, in: In }
