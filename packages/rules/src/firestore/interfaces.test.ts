// import { expect, test, describe } from 'vitest'

// import { Rule, rule } from '../rule/index.js'
// import { InferRule } from './interfaces.js'
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

//   test('boolean', () => {
//     match(op.is(data.bool, 'bool')).toBe(`data.bool is bool`)
//     match(op.eq(data.bool, true)).toBe(`data.bool == true`)
//     match(op.eq(data.bool, data.bool)).toBe(`data.bool == data.bool`)
//     match(op.neq(data.bool, true)).toBe(`data.bool != true`)
//     match(op.neq(data.bool, data.bool)).toBe(`data.bool != data.bool`)
//   })

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
