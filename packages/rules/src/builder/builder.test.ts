import { expect, it, describe } from 'vitest'

import * as rules from '../firestore/interfaces.js'
import { formatAst } from '../_test/index.test.js'
import { expression, op } from './builder.js'
import { output } from '../rule/index.js'

const match = (str: string, rule: any) => it(str, () => exp(rule).toBe(str))
const exp = (rule: any) => expect(formatAst(output(rule, { kind: 'Ident', name: 'data' }))).resolves

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
  match(`data.bool is bool`, op.is(data.bool, 'bool'))
})

describe('eq', () => {
  const data = expression<{ bool: rules.RulesBoolean; str: rules.RulesString }>()
  match(`data.bool == true`, op.eq(data.bool, true))
  match(`data.bool == data.str`, op.eq(data.bool, data.str))
})

describe('neq', () => {
  const data = expression<{ bool: rules.RulesBoolean; str: rules.RulesString }>()
  match(`data.bool != true`, op.neq(data.bool, true))
  match(`data.bool != data.str`, op.neq(data.bool, data.str))
})

describe('in', () => {
  const data = expression<{
    set: rules.RulesSet<rules.RulesString>
    list: rules.RulesList<rules.RulesNumber>
    str: rules.RulesString
    num: rules.RulesNumber
    map: rules.RulesMap<{ one: rules.RulesNumber }>
  }>()
  match(`data.str in data.set`, op.in(data.str, data.set))
  match(`"one" in data.set`, op.in('one', data.set))
  match(`data.num in data.list`, op.in(data.num, data.list))
  match(`10 in data.list`, op.in(10, data.list))
  match(`"foo" in data.map`, op.in('foo', data.map))
  match(`data.str in data.map`, op.in(data.str, data.map))
  match(`data.str in ["foo", "bar"]`, op.in(data.str, ['foo', 'bar']))
  match(`data.num in [10, 11]`, op.in(data.num, [10, 11]))

  // @ts-expect-error
  op.in(10, data.set)
  // @ts-expect-error
  op.in('one', data.list)
  // @ts-expect-error
  op.in(10, data.map)
  // @ts-expect-error
  op.in(data.num, data.map)
})

describe('gt', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  match(`data.str > data.str`, op.gt(data.str, data.str))
  match(`data.str > "foo"`, op.gt(data.str, 'foo'))
  match(`"foo" > data.str`, op.gt('foo', data.str))

  match(`data.num > data.num`, op.gt(data.num, data.num))
  match(`10 > data.num`, op.gt(10, data.num))
  match(`data.num > 10`, op.gt(data.num, 10))
})

describe('gte', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  match(`data.str >= data.str`, op.gte(data.str, data.str))
  match(`data.str >= "foo"`, op.gte(data.str, 'foo'))
  match(`"foo" >= data.str`, op.gte('foo', data.str))

  match(`data.num >= data.num`, op.gte(data.num, data.num))
  match(`10 >= data.num`, op.gte(10, data.num))
  match(`data.num >= 10`, op.gte(data.num, 10))
})

describe('lt', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  match(`data.str < data.str`, op.lt(data.str, data.str))
  match(`data.str < "foo"`, op.lt(data.str, 'foo'))
  match(`"foo" < data.str`, op.lt('foo', data.str))

  match(`data.num < data.num`, op.lt(data.num, data.num))
  match(`10 < data.num`, op.lt(10, data.num))
  match(`data.num < 10`, op.lt(data.num, 10))
})

describe('lte', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  match(`data.str <= data.str`, op.lte(data.str, data.str))
  match(`data.str <= "foo"`, op.lte(data.str, 'foo'))
  match(`"foo" <= data.str`, op.lte('foo', data.str))

  match(`data.num <= data.num`, op.lte(data.num, data.num))
  match(`10 <= data.num`, op.lte(10, data.num))
  match(`data.num <= 10`, op.lte(data.num, 10))
})

describe('add', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  match(`data.str + data.str`, op.add(data.str, data.str))
  match(`data.str + "foo"`, op.add(data.str, 'foo'))
  match(`"foo" + data.str`, op.add('foo', data.str))

  match(`data.num + data.num`, op.add(data.num, data.num))
  match(`10 + data.num`, op.add(10, data.num))
  match(`data.num + 10`, op.add(data.num, 10))
})

describe('sub', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  // @ts-expect-error
  match(`data.str - data.str`, op.sub(data.str, data.str))
  // @ts-expect-error
  match(`data.str - "foo"`, op.sub(data.str, 'foo'))
  // @ts-expect-error
  match(`"foo" - data.str`, op.sub('foo', data.str))

  match(`data.num - data.num`, op.sub(data.num, data.num))
  match(`10 - data.num`, op.sub(10, data.num))
  match(`data.num - 10`, op.sub(data.num, 10))
})

describe('div', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  // @ts-expect-error
  match(`data.str / data.str`, op.div(data.str, data.str))
  // @ts-expect-error
  match(`data.str / "foo"`, op.div(data.str, 'foo'))
  // @ts-expect-error
  match(`"foo" / data.str`, op.div('foo', data.str))

  match(`data.num / data.num`, op.div(data.num, data.num))
  match(`10 / data.num`, op.div(10, data.num))
  match(`data.num / 10`, op.div(data.num, 10))
})

describe('mult', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  // @ts-expect-error
  match(`data.str * data.str`, op.mult(data.str, data.str))
  // @ts-expect-error
  match(`data.str * "foo"`, op.mult(data.str, 'foo'))
  // @ts-expect-error
  match(`"foo" * data.str`, op.mult('foo', data.str))

  match(`data.num * data.num`, op.mult(data.num, data.num))
  match(`10 * data.num`, op.mult(10, data.num))
  match(`data.num * 10`, op.mult(data.num, 10))
})

describe('mod', () => {
  const data = expression<{ str: rules.RulesString; num: rules.RulesNumber }>()

  // @ts-expect-error
  match(`data.str % data.str`, op.mod(data.str, data.str))
  // @ts-expect-error
  match(`data.str % "foo"`, op.mod(data.str, 'foo'))
  // @ts-expect-error
  match(`"foo" % data.str`, op.mod('foo', data.str))

  match(`data.num % data.num`, op.mod(data.num, data.num))
  match(`10 % data.num`, op.mod(10, data.num))
  match(`data.num % 10`, op.mod(data.num, 10))
})

// add, sub, div, mult, mod

// test('boolean', () => {
//   match(op.is(data.bool, 'bool')).toBe(`data.bool is bool`)
//   match(op.eq(data.bool, true)).toBe(`data.bool == true`)
//   match(op.eq(data.bool, data.bool)).toBe(`data.bool == data.bool`)
//   match(op.neq(data.bool, true)).toBe(`data.bool != true`)
//   match(op.neq(data.bool, data.bool)).toBe(`data.bool != data.bool`)
// })

// import { op } from './operators.js'

// const match = (x: Rule) => expect(format(x, createFormatter()))

// describe('security role primitives', () => {
//   type TestDataModel = InferRule<{
//     string: string
//     bool: boolean
//     number: number
//     map: { string: string; bool: boolean; number: number }
//     listString: string[]
//   }>
//   const data = rule<TestDataModel>(() => 'data')

// test('boolean', () => {
//   match(op.is(data.bool, 'bool')).toBe(`data.bool is bool`)
//   match(op.eq(data.bool, true)).toBe(`data.bool == true`)
//   match(op.eq(data.bool, data.bool)).toBe(`data.bool == data.bool`)
//   match(op.neq(data.bool, true)).toBe(`data.bool != true`)
//   match(op.neq(data.bool, data.bool)).toBe(`data.bool != data.bool`)
// })

//   test('list', () => {
//     match(op.is(data.listString, 'list')).toBe(`data.listString is list`)
//     match(op.eq(data.listString, ['foo', 'bar'])).toBe(`data.listString == ['foo', 'bar']`)
//     match(op.in(data.listString, 'foo')).toBe(`'foo' in data.listString`)
//     match(op.eq(data.listString[0], 'foo')).toBe(`data.listString[0] == 'foo'`)
//     match(op.eq(data.listString['0:1'], ['foo'])).toBe(`data.listString[0:1] == ['foo']`)
//     match(op.eq(data.listString.concat(['bar']), ['foo', 'bar'])).toBe(
//       `data.listString.concat(['bar']) == ['foo', 'bar']`,
//     )
//     match(data.listString.hasAll(['foo'])).toBe(`data.listString.hasAll(['foo'])`)
//     match(data.listString.hasAny(['foo'])).toBe(`data.listString.hasAny(['foo'])`)
//     match(data.listString.hasOnly(['foo'])).toBe(`data.listString.hasOnly(['foo'])`)
//     match(op.eq(data.listString.join('.'), 'foo.bar')).toBe(`data.listString.join('.') == 'foo.bar'`)
//     match(op.eq(data.listString.removeAll(['foo']), [])).toBe(`data.listString.removeAll(['foo']) == []`)
//     match(op.eq(data.listString.size(), 1)).toBe(`data.listString.size() == 1`)
//     match(op.eq(data.listString.toSet(), ['foo'])).toBe(`data.listString.toSet() == ['foo']`)
//   })

//   test('map', () => {
//     match(op.is(data.map, 'map')).toBe(`data.map is map`)
//     match(op.in(data.map, 'foo')).toBe(`'foo' in data.map`)
//     match(op.eq(data.map.string, 'foo')).toBe(`data.map.string == 'foo'`)
//     match(op.eq(data.map['string'], 'foo')).toBe(`data.map.string == 'foo'`)
//     match(op.eq(data.map.get('string', null), 'bar')).toBe(`data.map.get('string', null) == 'bar'`)
//     match(op.eq(data.map.keys(), ['foo', 'bar'])).toBe(`data.map.keys() == ['foo', 'bar']`)
//     match(op.eq(data.map.size(), 2)).toBe(`data.map.size() == 2`)
//     match(op.eq(data.map.values(), ['foo'])).toBe(`data.map.values() == ['foo']`)
//   })

//   test('string', () => {
//     match(op.is(data.string, 'string')).toBe(`data.string is string`)
//     match(op.eq(data.string, 'foo')).toBe(`data.string == 'foo'`)
//     match(op.neq(data.string, 'foo')).toBe(`data.string != 'foo'`)
//     match(op.gt(data.string, 'foo')).toBe(`data.string > 'foo'`)
//     match(op.lt(data.string, 'foo')).toBe(`data.string < 'foo'`)
//     match(op.gte(data.string, 'foo')).toBe(`data.string >= 'foo'`)
//     match(op.lte(data.string, 'foo')).toBe(`data.string <= 'foo'`)

//     match(op.eq(data.string.lower(), 'foo')).toBe(`data.string.lower() == 'foo'`)
//     match(op.eq(data.string.matches('*'), true)).toBe(`data.string.matches('*') == true`)
//     match(op.eq(data.string.replace('*', 'bar'), 'foo')).toBe(`data.string.replace('*', 'bar') == 'foo'`)
//     match(op.eq(data.string.size(), 10)).toBe(`data.string.size() == 10`)
//     match(op.eq(data.string.split(''), [])).toBe(`data.string.split('') == []`)
//     match(op.eq(data.string.toUtf8(), 'foo')).toBe(`data.string.toUtf8() == 'foo'`)
//     match(op.eq(data.string.trim(), 'foo')).toBe(`data.string.trim() == 'foo'`)
//     match(op.eq(data.string.upper(), 'foo')).toBe(`data.string.upper() == 'foo'`)
//   })

//   test('number', () => {
//     match(op.is(data.number, 'float')).toBe(`data.number is float`)
//     match(op.eq(data.number, 0)).toBe(`data.number == 0`)
//     match(op.neq(data.number, 0)).toBe(`data.number != 0`)
//     match(op.gt(data.number, 0)).toBe(`data.number > 0`)
//     match(op.lt(data.number, 0)).toBe(`data.number < 0`)
//     match(op.gte(data.number, 0)).toBe(`data.number >= 0`)
//     match(op.lte(data.number, 0)).toBe(`data.number <= 0`)

//     match(op.add(data.number, 10)).toBe(`data.number + 10`)
//     match(op.sub(data.number, 10)).toBe(`data.number - 10`)
//     match(op.div(data.number, 10)).toBe(`data.number / 10`)
//     match(op.mult(data.number, 10)).toBe(`data.number * 10`)
//     match(op.mod(data.number, 10)).toBe(`data.number % 10`)
//   })
// })
