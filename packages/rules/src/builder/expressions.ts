import type { IFieldPrimitive } from '@fiar/schema'

import * as rules from '../firestore/index.js'
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

export const and: (...args: NonEmpty<rules.RulesBoolean>) => Rule<boolean> = logical('&&')

export const or: (...args: NonEmpty<rules.RulesBoolean>) => Rule<boolean> = logical('||')

export const op: {
  (a: Rule, o: 'is', type: IFieldPrimitive): rules.RulesBoolean
  (a: any, o: '==', b: any): rules.RulesBoolean
  (a: any, o: '!=', b: any): rules.RulesBoolean

  /** True if b is a member of list a */
  <T extends Rule>(b: T | TypeOfRule<T>, o: 'in', a: rules.RulesList<T>): rules.RulesBoolean
  /** True if b is a member of list a */
  <T extends any>(b: T, o: 'in', a: rules.RulesList<rules.InferRule<T>>): rules.RulesBoolean
  /** True if b is a member of set a */
  <T extends Rule>(b: T | TypeOfRule<T>, o: 'in', a: rules.RulesSet<T>): rules.RulesBoolean
  /** True if b is a member of set a */
  <T extends any>(b: T, o: 'in', a: rules.RulesSet<rules.InferRule<T>>): rules.RulesBoolean
  /** True if b is a member of list a */
  <T extends Rule>(b: T, o: 'in', a: TypeOfRule<T>[]): rules.RulesBoolean
  /** True if b is a member of list a */
  <T extends any>(b: T, o: 'in', a: T[]): rules.RulesBoolean
  /** True if key k exists in map x */
  <T extends Record<string, Rule>>(k: string | rules.RulesString, o: 'in', x: rules.RulesMap<T>): rules.RulesBoolean

  /** True if a is greater than b */
  (a: rules.RulesNumber | number, o: '>', b: number | rules.RulesNumber): rules.RulesBoolean
  /** True if a is greater than b */
  (a: rules.RulesString | string, o: '>', b: string | rules.RulesString): rules.RulesBoolean

  /** True if a is greater or equal to than b */
  (a: rules.RulesNumber | number, o: '>=', b: number | rules.RulesNumber): rules.RulesBoolean
  /** True if a is greater or equal to than b */
  (a: rules.RulesString | string, o: '>=', b: string | rules.RulesString): rules.RulesBoolean

  /** True if a is less than b */
  (a: rules.RulesNumber | number, p: '<', b: number | rules.RulesNumber): rules.RulesBoolean
  /** True if a is less than b */
  (a: rules.RulesString | string, p: '<', b: string | rules.RulesString): rules.RulesBoolean

  /** True if a is less than or equal to b */
  (a: rules.RulesNumber | number, o: '<=', b: number | rules.RulesNumber): rules.RulesBoolean
  /** True if a is less than or equal to b */
  (a: rules.RulesString | string, o: '<=', b: string | rules.RulesString): rules.RulesBoolean

  /** Add b to a */
  (a: rules.RulesFloat, o: '+', b: number | rules.RulesNumber): rules.RulesFloat
  /** Add b to a */
  (a: rules.RulesInteger, o: '+', b: rules.RulesInteger): rules.RulesInteger
  /** Add b to a */
  (a: rules.RulesNumber | number, o: '+', b: number | rules.RulesNumber): rules.RulesNumber
  /** True if a is less than or equal to b */
  (a: rules.RulesString | string, o: '+', b: string | rules.RulesString): rules.RulesString

  /** Subtract b from a */
  (a: rules.RulesFloat, o: '-', b: number | rules.RulesNumber): rules.RulesFloat
  /** Subtract b from a */
  (a: rules.RulesInteger, o: '-', b: rules.RulesInteger): rules.RulesInteger
  /** Subtract b from a */
  (a: rules.RulesNumber | number, o: '-', b: number | rules.RulesNumber): rules.RulesNumber

  /** Divide a by b */
  (a: rules.RulesFloat, o: '/', b: number | rules.RulesNumber): rules.RulesFloat
  /** Divide a by b */
  (a: rules.RulesInteger, o: '/', b: rules.RulesInteger): rules.RulesFloat
  /** Divide a by b */
  (a: rules.RulesNumber | number, o: '/', b: number | rules.RulesNumber): rules.RulesNumber

  /** Multiply a by b */
  (a: rules.RulesFloat, o: '*', b: number | rules.RulesNumber): rules.RulesFloat
  /** Multiply a by b */
  (a: rules.RulesInteger, o: '*', b: rules.RulesInteger): rules.RulesInteger
  /** Multiply a by b */
  (a: rules.RulesNumber | number, o: '*', b: number | rules.RulesNumber): rules.RulesNumber

  /** Multiply a by b */
  (a: rules.RulesFloat, o: '%', b: number | rules.RulesNumber): rules.RulesInteger
  /** Multiply a by b */
  (a: rules.RulesInteger, o: '%', b: rules.RulesInteger): rules.RulesInteger
  /** Multiply a by b */
  (a: rules.RulesNumber | number, o: '%', b: number | rules.RulesNumber): rules.RulesInteger
} = (left: any, op: any, right: any): any => {
  return rule((x) =>
    ast.expression([
      false,
      expressionBuilderArgument(left, x),
      undefined,
      op,
      op === 'is' ? ast.ident([right]) : expressionBuilderArgument(right, x),
    ]),
  )
}
