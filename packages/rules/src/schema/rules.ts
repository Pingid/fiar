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

import { RulesBoolean, RulesList, RulesMap, RulesNumber, RulesString, RulesTimestamp } from '../firestore/index.js'
import { op, or, and, not } from '../builder/index.js'
import { Rule } from '../rule/index.js'

export const validate = (left: Rule, type: FireSchemaTypes): RulesBoolean => {
  const validateer = defaultValidateers[type.type] as FieldTranformer<Rule, FireSchemaTypes>
  // if (type.optional) return or(op(left as any, '==', null), validateer(left, type as any))
  return validateer(left, type as any)
}

type FieldTranformer<R extends Rule, T extends FireSchemaTypes> = (rule: R, type: T) => RulesBoolean

const validateString: FieldTranformer<RulesString, FireSchemaString> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [op(left, 'is', field.type)]
  if (field.match instanceof RegExp) rules.push(left.matches(field.match.source))
  if (typeof field.match === 'string') rules.push(left.matches(field.match))
  if (typeof field.minLength === 'number') rules.push(op(left.size(), '>=', field.minLength))
  if (typeof field.maxLength === 'number') rules.push(op(left.size(), '<=', field.maxLength))
  if (field.select) rules.push(op(left, 'in', field.select))
  return and(...rules)
}

const validateNumber: FieldTranformer<RulesNumber, FireSchemaNumber> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [op(left, 'is', field.type)]
  if (typeof field.min === 'number') rules.push(op(left, '>=', field.min))
  if (typeof field.max === 'number') rules.push(op(left, '<=', field.max))
  return and(...rules)
}

const validateTimestamp: FieldTranformer<RulesTimestamp, FireSchemaTimestamp> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [op(left, 'is', field.type)]
  if (field.after) rules.push(op(left.toMillis(), '>', new Date(field.after).getTime()))
  if (field.before) rules.push(op(left.toMillis(), '<', new Date(field.before).getTime()))
  return and(...rules)
}

const validateMap: FieldTranformer<RulesMap<Record<string, any>>, FireSchemaMap> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [op(left, 'is', 'map')]
  if (!field.loose) rules.push(left.keys().hasOnly(Object.keys(field.fields)))
  rules.push(
    ...Object.keys(field.fields).map((key) => {
      const value = field.fields[key]
      if (!value?.optional) return validate((left as any)[key], field.fields[key] as any)
      return or(not(op(key, 'in', left)), validate((left as any)[key], field.fields[key] as any))
    }),
  )
  return and(...rules)
}

const validateList: FieldTranformer<RulesList<any>, FireSchemaList> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [op(left, 'is', field.type)]
  if (typeof field.min === 'number') rules.push(op(left.size(), '>=', field.min))
  if (typeof field.max === 'number') rules.push(op(left.size(), '<=', field.max))
  if (typeof field.size === 'number') rules.push(op(left.size(), '==', field.size))
  return and(...rules)
}

const validateSet: FieldTranformer<RulesList<any>, FireSchemaSet> = (left, field) => {
  const rules: [RulesBoolean, ...RulesBoolean[]] = [
    op(left as any, 'is', 'list'),
    ...field.of.map((x, i) => validate(left[i], x)),
  ]
  return and(...rules)
}

const validateUnion: FieldTranformer<Rule, FireSchemaUnion> = (left, field) => {
  return or(...(field.of.map((x) => validate(left, x)) as [RulesBoolean]))
}

const validateLiteral: FieldTranformer<Rule, FireSchemaLiteral> = (left, field) => op(left as any, '==', field.value)

const assertType =
  <T extends FireSchemaTypes>(type?: string): FieldTranformer<Rule, T> =>
  (left, field) =>
    op(left as any, 'is', type || (field.type as any))

export const defaultValidateers = {
  string: validateString,
  number: validateNumber,
  float: validateNumber,
  int: validateNumber,
  bool: assertType<FireSchemaBool>(),
  bytes: assertType<FireSchemaBool>(),
  latlng: assertType<FireSchemaBool>(),
  timestamp: validateTimestamp,
  map: validateMap,
  list: validateList,
  path: assertType<FireSchemaPath>(),
  ref: assertType<FireSchemaPath>('path'),
  set: validateSet,
  union: validateUnion,
  literal: validateLiteral,
} satisfies { [L in FireSchemaTypes['type']]: any }
