import type { IFieldPrimitive } from '@fiar/schema'

import * as rules from '../firestore/interfaces.js'
import * as ast from '../ast/index.js'

import { Rule, TypeOfRule, isRule, output, rule } from '../rule/index.js'

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
      if (typeof k !== 'string') throw new Error(`Unknown accessor ${k as any}`)
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

export const eq: {
  (a: any, b: any): rules.RulesBoolean
} = joined('==')

export const neq: {
  (a: any, b: any): rules.RulesBoolean
} = joined('!=')

export const In: {
  /** True if b is a member of list a */
  <T extends Rule>(b: T | TypeOfRule<T>, a: rules.RulesList<T>): rules.RulesBoolean
  /** True if b is a member of list a */
  <T extends any>(b: T, a: rules.RulesList<rules.InferRule<T>>): rules.RulesBoolean

  /** True if b is a member of set a */
  <T extends Rule>(b: T | TypeOfRule<T>, a: rules.RulesSet<T>): rules.RulesBoolean
  /** True if b is a member of set a */
  <T extends any>(b: T, a: rules.RulesSet<rules.InferRule<T>>): rules.RulesBoolean

  /** True if b is a member of list a */
  <T extends Rule>(b: T, a: TypeOfRule<T>[]): rules.RulesBoolean

  /** True if key k exists in map x */
  <T extends Record<string, Rule>>(k: string | rules.RulesString, x: rules.RulesMap<T>): rules.RulesBoolean
} = joined('in')

export const gt: {
  /** True if a is greater than b */
  (a: rules.RulesNumber | number, b: number | rules.RulesNumber): rules.RulesBoolean
  /** True if a is greater than b */
  (a: rules.RulesString | string, b: string | rules.RulesString): rules.RulesBoolean
} = joined('>')

export const gte: {
  /** True if a is greater or equal to than b */
  (a: rules.RulesNumber | number, b: number | rules.RulesNumber): rules.RulesBoolean
  /** True if a is greater or equal to than b */
  (a: rules.RulesString | string, b: string | rules.RulesString): rules.RulesBoolean
} = joined('>=')

export const lt: {
  /** True if a is less than b */
  (a: rules.RulesNumber | number, b: number | rules.RulesNumber): rules.RulesBoolean
  /** True if a is less than b */
  (a: rules.RulesString | string, b: string | rules.RulesString): rules.RulesBoolean
} = joined('<')

export const lte: {
  /** True if a is less than or equal to b */
  (a: rules.RulesNumber | number, b: number | rules.RulesNumber): rules.RulesBoolean
  /** True if a is less than or equal to b */
  (a: rules.RulesString | string, b: string | rules.RulesString): rules.RulesBoolean
} = joined('<=')

export const add: {
  /** Add b to a */
  (a: rules.RulesFloat, b: number | rules.RulesNumber): rules.RulesFloat
  /** Add b to a */
  (a: rules.RulesInteger, b: rules.RulesInteger): rules.RulesInteger
  /** Add b to a */
  (a: rules.RulesNumber | number, b: number | rules.RulesNumber): rules.RulesNumber

  /** True if a is less than or equal to b */
  (a: rules.RulesString | string, b: string | rules.RulesString): rules.RulesString
} = joined('+') as any

export const sub: {
  /** Subtract b from a */
  (a: rules.RulesFloat, b: number | rules.RulesNumber): rules.RulesFloat
  /** Subtract b from a */
  (a: rules.RulesInteger, b: rules.RulesInteger): rules.RulesInteger
  /** Subtract b from a */
  (a: rules.RulesNumber | number, b: number | rules.RulesNumber): rules.RulesNumber
} = joined('-') as any

export const div: {
  /** Divide a by b */
  (a: rules.RulesFloat, b: number | rules.RulesNumber): rules.RulesFloat
  /** Divide a by b */
  (a: rules.RulesInteger, b: rules.RulesInteger): rules.RulesFloat
  /** Divide a by b */
  (a: rules.RulesNumber | number, b: number | rules.RulesNumber): rules.RulesNumber
} = joined('/') as any

export const mult: {
  /** Multiply a by b */
  (a: rules.RulesFloat, b: number | rules.RulesNumber): rules.RulesFloat
  /** Multiply a by b */
  (a: rules.RulesInteger, b: rules.RulesInteger): rules.RulesInteger
  /** Multiply a by b */
  (a: rules.RulesNumber | number, b: number | rules.RulesNumber): rules.RulesNumber
} = joined('*') as any

export const mod: {
  /** Multiply a by b */
  (a: rules.RulesFloat, b: number | rules.RulesNumber): rules.RulesInteger
  /** Multiply a by b */
  (a: rules.RulesInteger, b: rules.RulesInteger): rules.RulesInteger
  /** Multiply a by b */
  (a: rules.RulesNumber | number, b: number | rules.RulesNumber): rules.RulesInteger
} = joined('%') as any

export const op = { and, or, is, eq, neq, in: In, gt, gte, lt, lte, add, sub, div, mult, mod }
