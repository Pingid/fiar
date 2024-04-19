import {
  FireSchemaTypes,
  FireSchemaBool,
  FireSchemaString,
  FireSchemaNumber,
  FireSchemaList,
  FireSchemaMap,
  FireSchemaRef,
  FireModel,
  FireSchemaTimestamp,
  InferModelType,
  InferSchemaType,
} from '@fiar/schema'
import { Timestamp } from '@firebase/firestore'

export type TypeOf<T> = T extends FireModel ? InferModelType<T> : T extends FireSchemaTypes ? InferSchemaType<T> : never

export interface IFieldBase {
  label?: string
  description?: string
  initialValue?: any
  component?: string
  hide?: boolean
}

export interface IFieldBoolean extends IFieldBase, FireSchemaBool {
  initialValue?: boolean
}

export interface IFieldString extends IFieldBase, FireSchemaString {
  initialValue?: string
  placeholder?: string
  multiline?: boolean
}

export interface IFieldNumber extends IFieldBase, FireSchemaNumber {
  initialValue?: number
  placeholder?: string
}

export interface IFieldTimestamp extends IFieldBase, FireSchemaTimestamp {
  auto?: 'create' | 'update'
  timezone?: string
  placeholder?: string | number | Date
  granularity?: 'day' | 'hour' | 'minute' | 'second'
  initialValue?: Timestamp
}

export interface IFieldMap extends IFieldBase, FireSchemaMap {
  fields: Record<string, IFields>
}

export interface IFieldList extends IFieldBase, FireSchemaList {
  of: IFields
}

export interface IFieldRef<T extends Record<string, FireSchemaTypes> = Record<string, FireSchemaTypes>>
  extends IFieldBase,
    FireSchemaRef<T> {}

export type IFields = IFieldBoolean | IFieldString | IFieldNumber | IFieldMap | IFieldList | IFieldRef | IFieldTimestamp
export type IField = FireSchemaTypes & IFieldBase

export interface IContentDocument extends FireModel {
  type: 'document'
  label: string
  group?: string
  readonly?: boolean
  fields: Record<string, IFields>
}

export interface CollectionLayout<K extends string = string> {
  titleField?: K
  columns?: K[]
  sort?: [K, 'asc' | 'desc']
}

export interface IContentCollection extends FireModel {
  type: 'collection'
  label?: string
  group?: string
  readonly?: boolean
  fields: Record<string, IFields>
  layout?: CollectionLayout<keyof this['fields'] & string>
}

export type IContentModel = IContentDocument | IContentCollection

export const boolean = <const T extends Omit<IFieldBoolean, 'type'>>(x?: T) =>
  ({ type: 'bool', ...x }) satisfies IFieldBoolean
export const string = <const T extends Omit<IFieldString, 'type'> = {}>(x?: T) =>
  ({ type: 'string' as const, ...x }) as T & { readonly type: 'string' }
export const text = <const T extends Omit<IFieldString, 'type'> = {}>(x?: T) =>
  ({ type: 'string' as const, component: 'text', ...x }) as T & {
    readonly type: 'string'
  }

export const timestamp = <const T extends Omit<IFieldTimestamp, 'type'> = {}>(x?: T) =>
  ({ type: 'timestamp' as const, ...x }) as T & { readonly type: 'timestamp' }

export const number = <const T extends Omit<IFieldNumber, 'type'>>(x?: T) =>
  ({ type: 'number', ...x }) satisfies IFieldNumber
export const map = <const T extends Omit<IFieldMap, 'type'>>(x: T) => ({ type: 'map', ...x }) satisfies IFieldMap
export const list = <const T extends Omit<IFieldList, 'type'>>(x: T) => ({ type: 'list', ...x }) satisfies IFieldList
export const ref = <const T extends Omit<IFieldRef, 'type' | 'target'>>(x: T) =>
  ({ type: 'ref', target: 'document', ...x }) as T & { readonly type: 'ref'; readonly target: 'document' }

export const model: {
  <const C extends IContentDocument>(model: C): C
  <
    const F extends Record<string, IFields>,
    const M extends IContentCollection & {
      layout?: CollectionLayout<keyof F & string>
    },
  >(
    model: M,
  ): M
} = (model: any) => model

export const defineDocument = <const T extends Omit<IContentDocument, 'type'>>(x: T) =>
  ({ type: 'document', ...x }) satisfies IContentDocument
export const defineCollection = <const T extends Omit<IContentCollection, 'type'>>(x: T) =>
  ({ type: 'collection', ...x }) satisfies IContentCollection
