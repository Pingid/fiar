import type { CollectionReference, DocumentReference, Timestamp } from '@firebase/firestore'

export type IFieldPrimitive =
  | 'bool'
  | 'string'
  | 'number'
  | 'float'
  | 'int'
  | 'list'
  | 'map'
  | 'path'
  | 'timestamp'
  | 'bytes'
  | 'latlng'

export interface FireSchemaBase {
  type: string
  optional?: boolean
}

export interface FireSchemaBool extends FireSchemaBase {
  type: 'bool'
}

export interface FireSchemaString extends FireSchemaBase {
  type: 'string'

  min?: number
  max?: number
  size?: number
  match?: RegExp | string
  select?: { value: string; label?: string }[]
}

export interface FireSchemaNumber extends FireSchemaBase {
  type: 'number'

  min?: number
  max?: number
}

export interface FireSchemaFloat extends FireSchemaBase {
  type: 'float'

  min?: number
  max?: number
}

export interface FireSchemaInt extends FireSchemaBase {
  type: 'int'

  min?: number
  max?: number
}

export interface FireSchemaTimestamp extends FireSchemaBase {
  type: 'timestamp'

  after?: Date | number | string
  before?: Date | number | string
}

export interface FireSchemaBytes extends FireSchemaBase {
  type: 'bytes'

  min?: number
  max?: number
  size?: number
}

export interface FireSchemaLatlng extends FireSchemaBase {
  type: 'latlng'
}

export interface FireSchemaPath extends FireSchemaBase {
  type: 'path'
  // to: FireModel
}

export interface FireSchemaList extends FireSchemaBase {
  type: 'list'

  size?: number
  min?: number
  max?: number
  of: FireSchemaTypes
}

export interface FireSchemaMap extends FireSchemaBase {
  type: 'map'
  loose?: boolean
  fields: Record<string, FireSchemaTypes>
}

export interface FireSchemaRef<T extends Record<string, FireSchemaTypes> = Record<string, FireSchemaTypes>>
  extends FireSchemaBase {
  target: 'document' | 'collection'
  type: 'ref'
  of: () => FireModel & { fields: T }
}

export interface FireSchemaUnion extends FireSchemaBase {
  type: 'union'
  of: ReadonlyArray<FireSchemaTypes>
}

export interface FireSchemaLiteral extends FireSchemaBase {
  type: 'literal'
  value: string | number
}

export interface FireSchemaSet extends FireSchemaBase {
  type: 'set'
  of: ReadonlyArray<FireSchemaTypes>
}

export type FireSchemaTypes =
  | FireSchemaBool
  | FireSchemaString
  | FireSchemaNumber
  | FireSchemaFloat
  | FireSchemaInt
  | FireSchemaBytes
  | FireSchemaLatlng
  | FireSchemaTimestamp
  | FireSchemaSet
  | FireSchemaPath
  | FireSchemaList
  | FireSchemaMap
  | FireSchemaRef
  | FireSchemaUnion
  | FireSchemaLiteral

export interface FireModel {
  type: 'document' | 'collection'
  fields: Record<string, FireSchemaTypes>
  path: `/${string}`
}

// -------------------------------------------------------------------
// Type inferance
// -------------------------------------------------------------------
type InferMapOptionalKeys<T> = { [K in keyof T]: T[K] extends { optional: true } ? K : never }[keyof T]
type InferMapRequiredKeys<T> = { [K in keyof T]: T[K] extends { optional: true } ? never : K }[keyof T]
type Evaluate<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
type InferTuple<T> = { [K in keyof T]: T[K] extends FireSchemaTypes ? InferSchemaType<T[K]> : never }
type InferMap<T extends Record<string, FireSchemaTypes>> = Evaluate<
  { readonly [K in InferMapRequiredKeys<T>]: InferSchemaType<T[K]> } & {
    readonly [K in InferMapOptionalKeys<T>]?: InferSchemaType<T[K]>
  }
>

type TypeofPrims = {
  bool: boolean
  string: string
  number: number
  float: number
  int: number
  timestamp: Timestamp
  bytes: never
  latlng: never
}
type TypeofPrimsKeys = keyof TypeofPrims

export type InferSchemaType<T extends FireSchemaTypes> = T['type'] extends TypeofPrimsKeys
  ? TypeofPrims[T['type']]
  : T extends FireSchemaSet
    ? InferTuple<T['of']>
    : T extends FireSchemaPath
      ? Record<string, any>
      : T extends FireSchemaList
        ? InferSchemaType<T['of']>[]
        : T extends FireSchemaMap
          ? InferMap<T['fields']>
          : T extends FireSchemaRef<infer R>
            ? T['target'] extends 'document'
              ? DocumentReference<InferMap<R>, InferMap<R>>
              : CollectionReference<InferMap<R>, InferMap<R>>
            : T extends FireSchemaUnion
              ? InferSchemaType<T['of'][number]>
              : T extends FireSchemaLiteral
                ? T['value']
                : never

export type InferModelType<T extends FireModel> = InferSchemaType<{ type: 'map'; fields: T['fields'] }>

// -------------------------------------------------------------------
// Creators
// -------------------------------------------------------------------
type FieldCreators = {
  [K in FireSchemaTypes['type']]: string extends InferMapRequiredKeys<
    Omit<Extract<FireSchemaTypes, { type: K }>, 'type'>
  >
    ? { <const O extends Omit<Extract<FireSchemaTypes, { type: K }>, 'type'>>(props: O): Evaluate<O & { type: K }> }
    : {
        (): { type: K }
        <const O extends Omit<Extract<FireSchemaTypes, { type: K }>, 'type'>>(props: O): Evaluate<O & { type: K }>
      }
}

type S = {
  [K in FireSchemaTypes['type']]: {
    <const O extends Omit<Extract<FireSchemaTypes, { type: K }>, 'type'>>(props: O): Evaluate<O & { type: K }>
  }
}

export const s: S = new Proxy({} as FieldCreators, {
  get: (_t, type) => (props: any) => ({ type, ...props }),
})

export const model = <const C extends FireModel>(x: C) => x
