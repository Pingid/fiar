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
} from '@fiar/schema'
import { Timestamp } from '@firebase/firestore'

export interface IFieldBase {
  label?: string
  description?: string
  optional?: boolean
  components?: { preview?: string; form?: string }
}

export interface IFieldBoolean extends IFieldBase, FireSchemaBool {
  initialValue?: boolean
}

export interface IFieldString extends IFieldBase, FireSchemaString {
  initialValue?: string
}

export interface IFieldNumber extends IFieldBase, FireSchemaNumber {
  initialValue?: number
}

export interface IFieldTimestamp extends IFieldBase, FireSchemaTimestamp {
  computed?: 'on-update' | 'on-create'
  initialValue?: Timestamp
}

export interface IFieldMap extends IFieldBase, FireSchemaMap {
  fields: Record<string, IFields>
}

export interface IFieldList extends IFieldBase, FireSchemaList {
  of: IFields
}

export interface IFieldRef extends IFieldBase, FireSchemaRef {}

export type IFields = IFieldBoolean | IFieldString | IFieldNumber | IFieldMap | IFieldList | IFieldRef | IFieldTimestamp
export type IField = FireSchemaTypes & IFieldBase

export interface IContentDocument extends FireModel {
  type: 'document'
  label: string
  fields: Record<string, IFields>
}

export interface IContentCollection extends FireModel {
  type: 'collection'
  label?: string
  fields: Record<string, IFields>

  titleField?: keyof this['fields']
  columns: (keyof this['fields'])[]
  sort: [keyof this['fields'], 'asc' | 'desc']
}

export type IContentModel = IContentDocument | IContentCollection

export const boolean = <const T extends Omit<IFieldBoolean, 'type'>>(x?: T) =>
  ({ type: 'bool', ...x }) satisfies IFieldBoolean
export const string = <const T extends Omit<IFieldString, 'type'> = {}>(x?: T) =>
  ({ type: 'string' as const, ...x }) as T & { readonly type: 'string' }
export const text = <const T extends Omit<IFieldString, 'type'> = {}>(x?: T) =>
  ({ type: 'string' as const, components: { form: 'field/text/form', preview: 'field/text/preview' }, ...x }) as T & {
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
export const defineDocument = <const T extends Omit<IContentDocument, 'type'>>(x: T) =>
  ({ type: 'document', ...x }) satisfies IContentDocument
export const defineCollection = <const T extends Omit<IContentCollection, 'type'>>(x: T) =>
  ({ type: 'collection', ...x }) satisfies IContentCollection
