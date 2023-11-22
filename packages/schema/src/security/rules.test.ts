import { expect, test, describe } from 'vitest'

import { RulesMap } from './interfaces'
import { rule, compute, op } from './rules'

describe('security role primitives', () => {
  type TestDataModel = {
    string: string
    bool: boolean
    number: number
    map: { string: string; bool: boolean; number: number }
    listString: string[]
  }
  const data = rule<RulesMap<TestDataModel>>('data')

  test('boolean', () => {
    expect(compute(op.is(data.bool, 'bool'))).toBe(`data.bool is bool`)
    expect(compute(op.eq(data.bool, true))).toBe(`data.bool == true`)
    expect(compute(op.eq(data.bool, data.bool))).toBe(`data.bool == data.bool`)
    expect(compute(op.neq(data.bool, true))).toBe(`data.bool != true`)
    expect(compute(op.neq(data.bool, data.bool))).toBe(`data.bool != data.bool`)
  })

  test('list', () => {
    expect(compute(op.is(data.listString, 'list'))).toBe(`data.listString is list`)
    expect(compute(op.eq(data.listString, ['foo', 'bar']))).toBe(`data.listString == ['foo', 'bar']`)
    expect(compute(op.in(data.listString, 'foo'))).toBe(`'foo' in data.listString`)
    expect(compute(op.eq(data.listString[0], 'foo'))).toBe(`data.listString[0] == 'foo'`)
    expect(compute(op.eq(data.listString['0:1'], ['foo']))).toBe(`data.listString[0:1] == ['foo']`)

    expect(compute(op.eq(data.listString.concat(['bar']), ['foo', 'bar']))).toBe(
      `data.listString.concat(['bar']) == ['foo', 'bar']`,
    )
    expect(compute(data.listString.hasAll(['foo']))).toBe(`data.listString.hasAll(['foo'])`)
    expect(compute(data.listString.hasAny(['foo']))).toBe(`data.listString.hasAny(['foo'])`)
    expect(compute(data.listString.hasOnly(['foo']))).toBe(`data.listString.hasOnly(['foo'])`)
    expect(compute(op.eq(data.listString.join('.'), 'foo.bar'))).toBe(`data.listString.join('.') == 'foo.bar'`)
    expect(compute(op.eq(data.listString.removeAll(['foo']), []))).toBe(`data.listString.removeAll(['foo']) == []`)
    expect(compute(op.eq(data.listString.size(), 1))).toBe(`data.listString.size() == 1`)
    expect(compute(op.eq(data.listString.toSet(), ['foo']))).toBe(`data.listString.toSet() == ['foo']`)
  })

  test('map', () => {
    expect(compute(op.is(data.map, 'map'))).toBe(`data.map is map`)
    expect(compute(op.in(data.map, 'foo'))).toBe(`'foo' in data.map`)
    expect(compute(op.eq(data.map.string, 'foo'))).toBe(`data.map.string == 'foo'`)
    expect(compute(op.eq(data.map['string'], 'foo'))).toBe(`data.map.string == 'foo'`)
    expect(compute(op.eq(data.map.get('string', null), 'bar'))).toBe(`data.map.get('string', null) == 'bar'`)
    expect(compute(op.eq(data.map.keys(), ['foo', 'bar']))).toBe(`data.map.keys() == ['foo', 'bar']`)
    expect(compute(op.eq(data.map.size(), 2))).toBe(`data.map.size() == 2`)
    expect(compute(op.eq(data.map.values(), ['foo']))).toBe(`data.map.values() == ['foo']`)
  })

  test('string', () => {
    expect(compute(op.is(data.string, 'string'))).toBe(`data.string is string`)
    expect(compute(op.eq(data.string, 'foo'))).toBe(`data.string == 'foo'`)
    expect(compute(op.neq(data.string, 'foo'))).toBe(`data.string != 'foo'`)
    expect(compute(op.gt(data.string, 'foo'))).toBe(`data.string > 'foo'`)
    expect(compute(op.lt(data.string, 'foo'))).toBe(`data.string < 'foo'`)
    expect(compute(op.gte(data.string, 'foo'))).toBe(`data.string >= 'foo'`)
    expect(compute(op.lte(data.string, 'foo'))).toBe(`data.string <= 'foo'`)

    expect(compute(op.eq(data.string.lower(), 'foo'))).toBe(`data.string.lower() == 'foo'`)
    expect(compute(op.eq(data.string.matches('*'), 'foo'))).toBe(`data.string.matches('*') == 'foo'`)
    expect(compute(op.eq(data.string.replace('*', 'bar'), 'foo'))).toBe(`data.string.replace('*', 'bar') == 'foo'`)
    expect(compute(op.eq(data.string.size(), 10))).toBe(`data.string.size() == 10`)
    expect(compute(op.eq(data.string.split(''), []))).toBe(`data.string.split('') == []`)
    expect(compute(op.eq(data.string.toUtf8(), 'foo'))).toBe(`data.string.toUtf8() == 'foo'`)
    expect(compute(op.eq(data.string.trim(), 'foo'))).toBe(`data.string.trim() == 'foo'`)
    expect(compute(op.eq(data.string.upper(), 'foo'))).toBe(`data.string.upper() == 'foo'`)
  })

  test('number', () => {
    expect(compute(op.is(data.number, 'float'))).toBe(`data.number is float`)
    expect(compute(op.eq(data.number, 0))).toBe(`data.number == 0`)
    expect(compute(op.neq(data.number, 0))).toBe(`data.number != 0`)
    expect(compute(op.gt(data.number, 0))).toBe(`data.number > 0`)
    expect(compute(op.lt(data.number, 0))).toBe(`data.number < 0`)
    expect(compute(op.gte(data.number, 0))).toBe(`data.number >= 0`)
    expect(compute(op.lte(data.number, 0))).toBe(`data.number <= 0`)

    expect(compute(op.add(data.number, 10))).toBe(`data.number + 10`)
    expect(compute(op.sub(data.number, 10))).toBe(`data.number - 10`)
    expect(compute(op.div(data.number, 10))).toBe(`data.number / 10`)
    expect(compute(op.mult(data.number, 10))).toBe(`data.number * 10`)
    expect(compute(op.mod(data.number, 10))).toBe(`data.number % 10`)
  })
})
