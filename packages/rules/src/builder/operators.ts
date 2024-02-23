import * as rules from '../firestore/interfaces.js'
import * as ast from '../ast/index.js'

import { rule, isRule, output, Rule } from '../rule/index.js'
import { IFieldPrimitive } from '@fiar/schema'

type NonEmpty<T> = [T, ...T[]]

export interface Operators {
  /** Check that a value is of some primitive type */
  is: (a: Rule, type: IFieldPrimitive) => rules.RulesBoolean
  and: (...args: NonEmpty<rules.RulesBoolean>) => Rule<boolean>
  or: (...args: NonEmpty<rules.RulesBoolean>) => Rule<boolean>
  in: rules.In
  eq: rules.Eq
  neq: rules.Neq
  gt: rules.Gt
  lt: rules.Lt
  gte: rules.Gte
  lte: rules.Lte
  add: rules.Add
  sub: rules.Sub
  div: rules.Div
  mult: rules.Mult
  mod: rules.Mod
}

const handleValue = (x: any): ast.Value => {
  if (x === null) return { kind: 'Ident', name: `null` }
  if (typeof x === 'object' && x['kind']) return x
  if (typeof x === 'string') return { kind: 'Literal', value: `'${x}'` }
  if (typeof x === 'number') return { kind: 'Literal', value: `${x}` }
  if (typeof x === 'boolean') return { kind: 'Literal', value: `${x}` }
  if (typeof x === null) return { kind: 'Literal', value: `null` }
  if (Array.isArray(x)) return { kind: 'ArrayExpression', elements: x.map(handleValue) }
  return {
    kind: 'ObjectExpression',
    properties: Object.entries(x).map(
      ([key, value]): ast.Property => ({
        kind: 'Property',
        key: { kind: 'Literal', value: `"${key}"` },
        value: handleValue(value),
      }),
    ),
  }
}

const handleArg = (x: any) => {
  if (isRule(x)) return x
  return rule(() => handleValue(x))
}

export const compare = (div: string) => (a: Rule<any> | any, b: Rule<any> | any) =>
  rule((x) => ast.expression([false, output(handleArg(a), x) as any, undefined, div, output(handleArg(b), x) as any]))

export const join =
  (sep: string): Operators['and'] | Operators['or'] =>
  (left, right, ...rest) => {
    if (!right) return left
    return rule((x) => ({
      ...rest.reduce(
        (a, b) => ast.expression([false, a, undefined, sep, output(b, x) as ast.Value]),
        ast.expression([false, output(left, x) as ast.Value, undefined, sep, output(right, x) as ast.Value]),
      ),
      param: true,
    }))
  }

export const op: Operators = {
  and: join('&&'),
  or: join('||'),
  in: (a: any, b: any) => compare('in')(b, a),
  is: (a, b) =>
    rule((x) =>
      ast.expression([
        false,
        output(handleArg(a), x) as any,
        undefined,
        'is',
        output(typeof b === 'string' ? rule(() => ast.ident([b])) : handleArg(b), x) as any,
      ]),
    ),
  eq: compare('=='),
  neq: compare('!='),
  gt: compare('>'),
  lt: compare('<'),
  gte: compare('>='),
  lte: compare('<='),
  add: compare('+'),
  sub: compare('-'),
  div: compare('/'),
  mult: compare('*'),
  mod: compare('%'),
}
