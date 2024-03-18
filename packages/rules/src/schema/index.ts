import type {
  FireModel,
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
  RulesPath,
  RulesMap,
  RulesList,
} from '../firestore/index.js'

import type { Rule } from '../rule/index.js'

export * from './rules.js'

type InferMapOptionalKeys<T> = { [K in keyof T]: T[K] extends { optional: true } ? K : never }[keyof T]
type InferMapRequiredKeys<T> = { [K in keyof T]: T[K] extends { optional: true } ? never : K }[keyof T]
type Evaluate<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
type InferTuple<T> = { [K in keyof T]: T[K] extends FireSchemaTypes ? InferSchemaRules<T[K]> : never }
type InferMap<T extends Record<string, FireSchemaTypes>> = Evaluate<
  { readonly [K in InferMapRequiredKeys<T>]: InferSchemaRules<T[K]> } & {
    readonly [K in InferMapOptionalKeys<T>]?: InferSchemaRules<T[K]>
  }
>

export type InferSchemaModelRules<T extends FireModel> = InferSchemaRules<{ type: 'map'; fields: T['fields'] }>
export type InferSchemaRules<T extends FireSchemaTypes> = T['type'] extends 'bool'
  ? RulesBoolean
  : T['type'] extends 'string'
    ? RulesString
    : T['type'] extends 'number'
      ? RulesNumber
      : T['type'] extends 'float'
        ? RulesFloat
        : T['type'] extends 'int'
          ? RulesInteger
          : T['type'] extends 'timestamp'
            ? RulesTimestamp
            : T['type'] extends 'bytes'
              ? RulesBytes
              : T['type'] extends 'latlng'
                ? RulesLatLng
                : T extends FireSchemaSet
                  ? InferTuple<T['of']>
                  : T extends FireSchemaPath
                    ? RulesPath
                    : T extends FireSchemaList
                      ? InferSchemaRules<T['of']> extends infer R
                        ? R extends Rule<any>
                          ? RulesList<R>
                          : never
                        : never
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
