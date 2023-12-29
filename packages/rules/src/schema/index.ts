import type {
  FireSchemaList,
  FireSchemaLiteral,
  FireSchemaMap,
  FireSchemaPath,
  FireSchemaRef,
  FireSchemaSet,
  FireSchemaTypes,
  FireSchemaUnion,
} from '@fiar/schema'

import type {
  RulesBoolean,
  RulesBytes,
  RulesFloat,
  RulesInteger,
  RulesLatLng,
  RulesNumber,
  RulesString,
  RulesTimestamp,
  RulesList,
  RulesPath,
  RulesMap,
} from '../types'

type TypeofPrims = {
  bool: RulesBoolean
  string: RulesString
  number: RulesNumber
  float: RulesFloat
  int: RulesInteger
  timestamp: RulesTimestamp
  bytes: RulesBytes
  latlng: RulesLatLng
}

type TypeofPrimsKeys = keyof TypeofPrims

type InferMapOptionalKeys<T> = { [K in keyof T]: T[K] extends { optional: true } ? K : never }[keyof T]
type InferMapRequiredKeys<T> = { [K in keyof T]: T[K] extends { optional: true } ? never : K }[keyof T]
type Evaluate<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
type InferTuple<T> = { [K in keyof T]: T[K] extends FireSchemaTypes ? InferSchemaRules<T[K]> : never }
type InferMap<T extends Record<string, FireSchemaTypes>> = Evaluate<
  { readonly [K in InferMapRequiredKeys<T>]: InferSchemaRules<T[K]> } & {
    readonly [K in InferMapOptionalKeys<T>]?: InferSchemaRules<T[K]>
  }
>

export type InferSchemaRules<T extends FireSchemaTypes> = T['type'] extends TypeofPrimsKeys
  ? TypeofPrims[T['type']]
  : T extends FireSchemaSet
  ? InferTuple<T['of']>
  : T extends FireSchemaPath
  ? RulesPath
  : T extends FireSchemaList
  ? RulesList<InferSchemaRules<T['of']>>
  : T extends FireSchemaMap
  ? RulesMap<InferMap<T['fields']>>
  : T extends FireSchemaRef<infer R>
  ? RulesPath<InferMap<R>>
  : T extends FireSchemaUnion
  ? InferSchemaRules<T['of'][number]>
  : T extends FireSchemaLiteral
  ? T['value'] extends string
    ? RulesString
    : RulesNumber
  : never
