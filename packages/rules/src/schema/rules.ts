import {
  FireSchemaBool,
  FireSchemaList,
  FireSchemaLiteral,
  FireSchemaMap,
  FireSchemaNumber,
  FireSchemaPath,
  FireSchemaSet,
  FireSchemaString,
  FireSchemaTimestamp,
  FireSchemaTypes,
  FireSchemaUnion,
} from '@fiar/schema'

import { RulesBoolean, RulesList, RulesMap, RulesNumber, RulesString, RulesTimestamp } from '../firestore/interfaces.js'
import { op } from '../builder/index.js'
import { Rule } from '../rule/index.js'

export const transformRule = (left: Rule, type: FireSchemaTypes): RulesBoolean => {
  const transformer = defaultTransformers[type.type] as FieldTranformer<Rule, FireSchemaTypes>
  if (type.optional) return op.or(op.eq(left as any, null), transformer(left, type as any))
  return transformer(left, type as any)
}

type FieldTranformer<R extends Rule, T extends FireSchemaTypes> = (rule: R, type: T) => RulesBoolean

const transformString: FieldTranformer<RulesString, FireSchemaString> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [op.is(left, field.type)]
  if (field.match instanceof RegExp) rules.push(left.matches(field.match.source))
  if (typeof field.match === 'string') rules.push(left.matches(field.match))
  if (typeof field.min === 'number') rules.push(op.gte(left.size(), field.min))
  if (typeof field.max === 'number') rules.push(op.lte(left.size(), field.max))
  if (typeof field.size === 'number') rules.push(op.eq(left.size(), field.size))
  return op.and(...rules)
}

const transformNumber: FieldTranformer<RulesNumber, FireSchemaNumber> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [op.is(left, field.type)]
  if (typeof field.min === 'number') rules.push(op.gte(left, field.min))
  if (typeof field.max === 'number') rules.push(op.lte(left, field.max))
  return op.and(...rules)
}

const transformTimestamp: FieldTranformer<RulesTimestamp, FireSchemaTimestamp> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [op.is(left, field.type)]
  if (field.after) rules.push(op.gt(left.toMillis(), new Date(field.after).getTime()))
  if (field.before) rules.push(op.lt(left.toMillis(), new Date(field.before).getTime()))
  return op.and(...rules)
}

const transformMap: FieldTranformer<RulesMap<Record<string, any>>, FireSchemaMap> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [op.is(left, 'map')]
  if (!field.loose) rules.push(left.keys().hasOnly(Object.keys(field.fields)))
  rules.push(...Object.keys(field.fields).map((key) => transformRule((left as any)[key], field.fields[key] as any)))
  return op.and(...rules)
}

const transformList: FieldTranformer<RulesList<any>, FireSchemaList> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [op.is(left, field.type)]
  if (typeof field.min === 'number') rules.push(op.gte(left.size(), field.min))
  if (typeof field.max === 'number') rules.push(op.lte(left.size(), field.max))
  if (typeof field.size === 'number') rules.push(op.eq(left.size(), field.size))
  return op.and(...rules)
}

const transformSet: FieldTranformer<RulesList<any>, FireSchemaSet> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [
    op.is(left as any, 'list'),
    ...field.of.map((x, i) => transformRule(left[i], x)),
  ]
  return op.and(...rules)
}

const transformUnion: FieldTranformer<Rule, FireSchemaUnion> = (left, field) => {
  return op.or(...(field.of.map((x) => transformRule(left, x)) as [RulesBoolean]))
}

const transformLiteral: FieldTranformer<Rule, FireSchemaLiteral> = (left, field) => op.eq(left as any, field.value)

const assertType =
  <T extends FireSchemaTypes>(type?: string): FieldTranformer<Rule, T> =>
  (left, field) =>
    op.is(left as any, type || (field.type as any))

export const defaultTransformers = {
  string: transformString,
  number: transformNumber,
  float: transformNumber,
  int: transformNumber,
  bool: assertType<FireSchemaBool>(),
  bytes: assertType<FireSchemaBool>(),
  latlng: assertType<FireSchemaBool>(),
  timestamp: transformTimestamp,
  map: transformMap,
  list: transformList,
  path: assertType<FireSchemaPath>(),
  ref: assertType<FireSchemaPath>('path'),
  set: transformSet,
  union: transformUnion,
  literal: transformLiteral,
} satisfies { [L in FireSchemaTypes['type']]: any }
