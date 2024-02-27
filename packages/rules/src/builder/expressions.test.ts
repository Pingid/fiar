import { expect, it, describe } from 'vitest'

import { expression, op } from './expressions.js'
import { formatAst } from '../printer/index.js'
import * as rules from '../firestore/index.js'
import { output } from '../rule/index.js'

const match = (str: string, rule: any) => it(str, () => exp(rule).toBe(str))
const exp = (rule: any) =>
  expect(formatAst(output(rule, { kind: 'Ident', name: 'data' }), { printWidth: 900 })).resolves

describe('expression builder', () => {
  const data = expression<any>()
  match(`data.b.c`, data.b.c)
  match(`data.b[1]`, data.b[1])
  match(`data("foo")`, data('foo'))
  match(`data.a.b("foo")`, data.a.b('foo'))
  match(`data.a.b(data.a.b)`, data.a.b(data.a.b))
  match(`data(null)`, data(null))
  match(`data(10)`, data(10))
  match(`data([])`, data([]))
  match(`data(["foo"])`, data(['foo']))
  match(`data({ one: data.a })`, data({ one: data.a }))
  match(`data(10, [1])`, data(10, [1]))
})

describe('is', () => {
  const data = expression<any>()
  match(`data.bool is bool`, op(data.bool, 'is', 'bool'))
  // @ts-expect-error
  match(`data.bool is boolean`, op(data.bool, 'is', 'boolean'))
})

describe('==', () => {
  const data = expression<{ bool: rules.RulesBoolean; str: rules.RulesString }>()
  match(`data.bool == true`, op(data.bool, '==', true))
  match(`data.bool == data.str`, op(data.bool, '==', data.str))
})

describe('!=', () => {
  const data = expression<{ bool: rules.RulesBoolean; str: rules.RulesString }>()
  match(`data.bool != true`, op(data.bool, '!=', true))
  match(`data.bool != data.str`, op(data.bool, '!=', data.str))
})

describe('in', () => {
  const data = expression<{
    set: rules.RulesSet<rules.RulesString>
    list: rules.RulesList<rules.RulesNumber>
    str: rules.RulesString
    num: rules.RulesNumber
    map: rules.RulesMap<{ one: rules.RulesNumber }>
  }>()
  match(`data.str in data.set`, op(data.str, 'in', data.set))
  match(`"one" in data.set`, op('one', 'in', data.set))
  match(`data.num in data.list`, op(data.num, 'in', data.list))
  match(`10 in data.list`, op(10, 'in', data.list))
  match(`"foo" in data.map`, op('foo', 'in', data.map))
  match(`data.str in data.map`, op(data.str, 'in', data.map))
  match(`data.str in ["foo", "bar"]`, op(data.str, 'in', ['foo', 'bar']))
  match(`data.num in [10, 11]`, op(data.num, 'in', [10, 11]))

  // @ts-expect-error
  op(10, 'in', data.set)
  // @ts-expect-error
  op('one', 'in', data.list)
  // @ts-expect-error
  op(10, 'in', data.map)
  // @ts-expect-error
  op(data.num, 'in', data.map)
})

describe('>', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  match(`data.str > data.str`, op(data.str, '>', data.str))
  match(`data.str > "foo"`, op(data.str, '>', 'foo'))
  match(`"foo" > data.str`, op('foo', '>', data.str))

  match(`data.num > data.num`, op(data.num, '>', data.num))
  match(`10 > data.num`, op(10, '>', data.num))
  match(`data.num > 10`, op(data.num, '>', 10))
})

describe('>=', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  match(`data.str >= data.str`, op(data.str, '>=', data.str))
  match(`data.str >= "foo"`, op(data.str, '>=', 'foo'))
  match(`"foo" >= data.str`, op('foo', '>=', data.str))

  match(`data.num >= data.num`, op(data.num, '>=', data.num))
  match(`10 >= data.num`, op(10, '>=', data.num))
  match(`data.num >= 10`, op(data.num, '>=', 10))
})

describe('<', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  match(`data.str < data.str`, op(data.str, '<', data.str))
  match(`data.str < "foo"`, op(data.str, '<', 'foo'))
  match(`"foo" < data.str`, op('foo', '<', data.str))

  match(`data.num < data.num`, op(data.num, '<', data.num))
  match(`10 < data.num`, op(10, '<', data.num))
  match(`data.num < 10`, op(data.num, '<', 10))
})

describe('<=', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  match(`data.str <= data.str`, op(data.str, '<=', data.str))
  match(`data.str <= "foo"`, op(data.str, '<=', 'foo'))
  match(`"foo" <= data.str`, op('foo', '<=', data.str))

  match(`data.num <= data.num`, op(data.num, '<=', data.num))
  match(`10 <= data.num`, op(10, '<=', data.num))
  match(`data.num <= 10`, op(data.num, '<=', 10))
})

describe('+', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  match(`data.str + data.str`, op(data.str, '+', data.str))
  match(`data.str + "foo"`, op(data.str, '+', 'foo'))
  match(`"foo" + data.str`, op('foo', '+', data.str))

  match(`data.num + data.num`, op(data.num, '+', data.num))
  match(`10 + data.num`, op(10, '+', data.num))
  match(`data.num + 10`, op(data.num, '+', 10))
})

describe('-', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  // @ts-expect-error
  match(`data.str - data.str`, op(data.str, '-', data.str))
  // @ts-expect-error
  match(`data.str - "foo"`, op(data.str, '-', 'foo'))
  // @ts-expect-error
  match(`"foo" - data.str`, op('foo', '-', data.str))

  match(`data.num - data.num`, op(data.num, '-', data.num))
  match(`10 - data.num`, op(10, '-', data.num))
  match(`data.num - 10`, op(data.num, '-', 10))
})

describe('/', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  // @ts-expect-error
  match(`data.str / data.str`, op(data.str, '/', data.str))
  // @ts-expect-error
  match(`data.str / "foo"`, op(data.str, '/', 'foo'))
  // @ts-expect-error
  match(`"foo" / data.str`, op('foo', '/', data.str))

  match(`data.num / data.num`, op(data.num, '/', data.num))
  match(`10 / data.num`, op(10, '/', data.num))
  match(`data.num / 10`, op(data.num, '/', 10))
})

describe('*', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  // @ts-expect-error
  match(`data.str * data.str`, op(data.str, '*', data.str))
  // @ts-expect-error
  match(`data.str * "foo"`, op(data.str, '*', 'foo'))
  // @ts-expect-error
  match(`"foo" * data.str`, op('foo', '*', data.str))

  match(`data.num * data.num`, op(data.num, '*', data.num))
  match(`10 * data.num`, op(10, '*', data.num))
  match(`data.num * 10`, op(data.num, '*', 10))
})

describe('%', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  // @ts-expect-error
  match(`data.str % data.str`, op(data.str, '%', data.str))
  // @ts-expect-error
  match(`data.str % "foo"`, op(data.str, '%', 'foo'))
  // @ts-expect-error
  match(`"foo" % data.str`, op('foo', '%', data.str))

  match(`data.num % data.num`, op(data.num, '%', data.num))
  match(`10 % data.num`, op(10, '%', data.num))
  match(`data.num % 10`, op(data.num, '%', 10))
})
