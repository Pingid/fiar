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
import { RuleGroup, Rule } from '../rule/index.js'
import { op } from '../firestore/operators.js'

export const transformRule = (rule: Rule, type: FireSchemaTypes): RulesBoolean | RuleGroup => {
  const transformer = defaultTransformers[type.type] as FieldTranformer<Rule, FireSchemaTypes>
  if (type.optional) return op.or(op.eq(rule as any, null), transformer(rule, type as any))
  return transformer(rule, type as any)
}

type FieldTranformer<R extends Rule, T extends FireSchemaTypes> = (rule: R, type: T) => RulesBoolean | RuleGroup

const transformString: FieldTranformer<RulesString, FireSchemaString> = (base, field) => {
  const rules: (RulesBoolean | RuleGroup)[] = [op.is(base, field.type)]
  if (field.match instanceof RegExp) rules.push(base.matches(field.match.source))
  if (typeof field.match === 'string') rules.push(base.matches(field.match))
  if (typeof field.min === 'number') rules.push(op.gte(base.size(), field.min))
  if (typeof field.max === 'number') rules.push(op.lte(base.size(), field.max))
  if (typeof field.size === 'number') rules.push(op.eq(base.size(), field.size))
  return op.and(...rules)
}

const transformNumber: FieldTranformer<RulesNumber, FireSchemaNumber> = (base, field) => {
  const rules: (RulesBoolean | RuleGroup)[] = [op.is(base, field.type)]
  if (typeof field.min === 'number') rules.push(op.gte(base, field.min))
  if (typeof field.max === 'number') rules.push(op.lte(base, field.max))
  return op.and(...rules)
}

const transformTimestamp: FieldTranformer<RulesTimestamp, FireSchemaTimestamp> = (base, field) => {
  const rules: (RulesBoolean | RuleGroup)[] = [op.is(base, field.type)]
  if (field.after) rules.push(op.gt(base.toMillis(), new Date(field.after).getTime()))
  if (field.before) rules.push(op.lt(base.toMillis(), new Date(field.before).getTime()))
  return op.and(...rules)
}

const transformMap: FieldTranformer<RulesMap<Record<string, any>>, FireSchemaMap> = (base, field) => {
  const rules: (RulesBoolean | RuleGroup)[] = [op.is(base, 'map')]
  if (!field.loose) rules.push(base.keys().hasOnly(Object.keys(field.fields)))
  rules.push(...Object.keys(field.fields).map((key) => transformRule((base as any)[key], field.fields[key] as any)))
  return op.and(...rules)
}

const transformList: FieldTranformer<RulesList<any>, FireSchemaList> = (base, field) => {
  const rules: (RulesBoolean | RuleGroup)[] = [op.is(base, field.type)]
  if (typeof field.min === 'number') rules.push(op.gte(base.size(), field.min))
  if (typeof field.max === 'number') rules.push(op.lte(base.size(), field.max))
  if (typeof field.size === 'number') rules.push(op.eq(base.size(), field.size))
  return op.and(...rules)
}

const transformSet: FieldTranformer<RulesList<any>, FireSchemaSet> = (base, field) => {
  const rules: (RulesBoolean | RuleGroup)[] = [
    op.is(base as any, 'list'),
    ...field.of.map((x, i) => transformRule(base[i], x)),
  ]
  return op.and(...rules)
}

const transformUnion: FieldTranformer<Rule, FireSchemaUnion> = (base, field) => {
  return op.or(...field.of.map((x) => transformRule(base, x)))
}

const transformLiteral: FieldTranformer<Rule, FireSchemaLiteral> = (base, field) => op.eq(base as any, field.value)

const assetType =
  <T extends FireSchemaTypes>(type?: string): FieldTranformer<Rule, T> =>
  (base, field) =>
    op.is(base as any, type || (field.type as any))

export const defaultTransformers = {
  string: transformString,
  number: transformNumber,
  float: transformNumber,
  int: transformNumber,
  bool: assetType<FireSchemaBool>(),
  bytes: assetType<FireSchemaBool>(),
  latlng: assetType<FireSchemaBool>(),
  timestamp: transformTimestamp,
  map: transformMap,
  list: transformList,
  path: assetType<FireSchemaPath>(),
  ref: assetType<FireSchemaPath>('path'),
  set: transformSet,
  union: transformUnion,
  literal: transformLiteral,
} satisfies { [L in FireSchemaTypes['type']]: any }
