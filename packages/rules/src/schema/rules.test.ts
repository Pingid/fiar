import { FireSchemaTypes, s } from '@fiar/schema'
import { it, describe, expect } from 'vitest'

import { defaultFormatter, format, rule } from '../rule/index.js'
import { transformRule } from './rules.js'

const match = (schema: FireSchemaTypes) => {
  const base = rule(() => 'data')
  const result = format(transformRule(base, schema), defaultFormatter())
  return expect(result)
}

describe('string', () => {
  it('assert', () => match(s.string()).toBe('data is string'))
  it('match regex', () => match(s.string({ match: /.*/gim })).toBe("data is string && data.matches('.*')"))
  it('match regex string', () => match(s.string({ match: '.*' })).toBe("data is string && data.matches('.*')"))
  it('min length', () => match(s.string({ min: 10 })).toBe('data is string && data.size() >= 10'))
  it('max length', () => match(s.string({ max: 10 })).toBe('data is string && data.size() <= 10'))
  it('match length', () => match(s.string({ size: 10 })).toBe('data is string && data.size() == 10'))
})

describe('number', () => {
  it('assert', () => match(s.number()).toBe('data is number'))
  it('min size', () => match(s.number({ min: 10 })).toBe('data is number && data >= 10'))
  it('max size', () => match(s.number({ max: 10 })).toBe('data is number && data <= 10'))
})

describe('float', () => {
  it('assert', () => match(s.float()).toBe('data is float'))
  it('min size', () => match(s.float({ min: 10 })).toBe('data is float && data >= 10'))
  it('max size', () => match(s.float({ max: 10 })).toBe('data is float && data <= 10'))
})

describe('int', () => {
  it('assert', () => match(s.int()).toBe('data is int'))
  it('min size', () => match(s.int({ min: 10 })).toBe('data is int && data >= 10'))
  it('max size', () => match(s.int({ max: 10 })).toBe('data is int && data <= 10'))
})

describe('bool', () => it('assert', () => match(s.bool()).toBe('data is bool')))

describe('bytes', () => it('assert', () => match(s.bytes()).toBe('data is bytes')))

describe('latlng', () => it('assert', () => match(s.latlng()).toBe('data is latlng')))

describe('timestamp', () => {
  it('assert', () => match(s.timestamp()).toBe('data is timestamp'))
  const date = new Date('2024/01/01')
  it('after date', () =>
    match(s.timestamp({ after: date })).toBe(`data is timestamp && data.toMillis() > ${date.getTime()}`))
  it('before date', () =>
    match(s.timestamp({ before: date })).toBe(`data is timestamp && data.toMillis() < ${date.getTime()}`))
})

describe('map', () => {
  it('assert', () => match(s.map({ fields: {}, loose: true })).toBe('data is map'))
  it('assert strict', () => match(s.map({ fields: {} })).toBe('data is map && data.keys().hasOnly([])'))
  it('assert fields', () =>
    match(s.map({ fields: { foo: s.string(), bar: s.number() } })).toBe(
      "data is map && data.keys().hasOnly(['foo', 'bar']) && data.foo is string && data.bar is number",
    ))
})

describe('list', () => {
  it('assert', () => match(s.list({ of: s.string() })).toBe('data is list'))
  it('min size', () => match(s.list({ of: s.string(), min: 10 })).toBe('data is list && data.size() >= 10'))
  it('max size', () => match(s.list({ of: s.string(), max: 10 })).toBe('data is list && data.size() <= 10'))
  it('size', () => match(s.list({ of: s.string(), size: 10 })).toBe('data is list && data.size() == 10'))
})

describe('path', () => {
  it('assert', () => match(s.path()).toBe('data is path'))
})

// TODO CHECK PATH IS A DOCUMENT PATH allow read, write: if path.matches("^/([^/]+/[^/]+)+$");
describe('ref', () => {
  it('assert', () => match(s.ref({ target: 'document', of: () => ({}) as any })).toBe('data is path'))
})

describe('set', () => {
  it('assert', () =>
    match(s.set({ of: [s.string(), s.bool()] })).toBe('data is list && data[0] is string && data[1] is bool'))
})
