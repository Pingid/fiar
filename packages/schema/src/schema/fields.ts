import type { DocumentReference, CollectionReference, Timestamp } from 'firebase/firestore'

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
//   | 'latlng'

export type IFieldExtensions = 'union' | 'literal' | 'set'

export type IFieldTypes = IFieldPrimitive | IFieldExtensions

export interface IFieldProps {}

export interface IField<I extends any = any, T extends IFieldTypes = IFieldTypes> extends IFieldProps {
  type: T
  infer?: I
}

export interface IFieldBool extends IField<boolean, 'bool'> {}

export interface IFieldString extends IField<string, 'string'> {
  min?: number
  max?: number
  size?: number
  match?: RegExp | string
}

export interface IFieldNumber extends IField<number, 'number'> {
  min?: number
  max?: number
}

export interface IFieldFloat extends IField<number, 'float'> {
  min?: number
  max?: number
}

export interface IFieldInt extends IField<number, 'int'> {
  min?: number
  max?: number
}

export interface IFieldTimestamp extends IField<Timestamp, 'timestamp'> {
  after?: Timestamp
  before?: Timestamp
}

export interface IFieldBytes extends IField<never, 'bytes'> {
  min?: number
  max?: number
  size?: number
}

export interface IFieldPath<T extends DocumentReference<any, any> | CollectionReference<any, any>>
  extends IField<T, 'path'> {
  to: () => T
}

export interface IFieldList<T extends IField> extends IField<Exclude<T['infer'], undefined>[], 'list'> {
  size?: number
  min?: number
  max?: number
  of: T
}

type InferMapType<R extends Record<string, IField>, O extends Record<string, IField>> = (R extends Record<
  string,
  IField
>
  ? { [K in keyof R]: Exclude<R[K]['infer'], undefined> }
  : {}) &
  (O extends Record<string, IField> ? { [K in keyof O]?: O[K]['infer'] } : {})

export interface IFieldMap<R extends Record<string, IField>, O extends Record<string, IField>>
  extends IField<InferMapType<R, O>, 'map'> {
  loose?: boolean
  required: R
  optional: O
}

export interface IFieldUnion<T extends ReadonlyArray<IField>>
  extends IField<Exclude<T[number]['infer'], undefined>, 'union'> {
  of: T
}

export interface IFieldLiteral<T extends ReadonlyArray<number | string>> extends IField<T[number], 'literal'> {
  of: T
}

export interface IFieldSet<T extends ReadonlyArray<IField>>
  extends IField<{ [K in keyof T]: Exclude<T[K]['infer'], undefined> }, 'set'> {
  of: T
}

export type IFields =
  | IFieldBool
  | IFieldString
  | IFieldNumber
  | IFieldFloat
  | IFieldInt
  | IFieldBytes
  | IFieldTimestamp
  | IFieldSet<ReadonlyArray<IFields>>
  | IFieldPath<DocumentReference<any, any> | CollectionReference<any, any>>
  | IFieldList<IFields>
  | IFieldMap<Record<string, IFields>, Record<string, IFields>>
  | IFieldUnion<ReadonlyArray<IFields>>
  | IFieldLiteral<ReadonlyArray<string | number>>

type Options<T> = Omit<T, 'type' | 'infer'>

export const s = {
  bool: <O extends Options<IFieldBool>>(opts?: O) => ({ type: 'bool', ...opts }) as IFieldBool,
  string: <O extends Options<IFieldString>>(opts?: O) => ({ type: 'string', ...opts }) as IFieldString,
  number: <O extends Options<IFieldNumber>>(opts?: O) => ({ type: 'number', ...opts }) as IFieldNumber,
  float: <O extends Options<IFieldFloat>>(opts?: O) => ({ type: 'float', ...opts }) as IFieldFloat,
  int: <O extends Options<IFieldInt>>(opts?: O) => ({ type: 'int', ...opts }) as IFieldInt,
  bytes: <O extends Options<IFieldBytes>>(opts?: O) => ({ type: 'bytes', ...opts }) as IFieldBytes,
  list: <T extends IFields>(opts: Omit<IFieldList<any>, 'type' | 'infer' | 'of'> & { of: T }) =>
    ({ type: 'list', ...opts }) as IFieldList<T>,
  map: <R extends Record<string, IFields>, O extends Record<string, IFields>>(
    opts: Omit<IFieldMap<any, any>, 'type' | 'infer' | 'of' | 'required' | 'optional'> & {
      required?: R
      optional?: O
    },
  ) => ({ type: 'map', required: {}, optional: {}, ...opts }) as IFieldMap<R, O>,
  path: () => ({ type: 'path' }) as IFieldPath<DocumentReference<any, any> | CollectionReference<any, any>>,
  timestamp: () => ({ type: 'timestamp' }) as IFieldTimestamp,
  union: <T extends ReadonlyArray<IField>>(opts: { of: T }) => ({ type: 'union', ...opts }) as IFieldUnion<T>,
  literal: <const T extends ReadonlyArray<string | number>>(opts: { of: T }) =>
    ({ type: 'literal', ...opts }) as IFieldLiteral<T>,
  set: <const T extends ReadonlyArray<IFields>>(opts: { of: T }) => ({ type: 'set', ...opts }) as IFieldSet<T>,
} satisfies { [K in IFields['type']]: any }
