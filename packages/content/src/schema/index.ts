import {
  FireSchemaBool,
  FireSchemaString,
  FireSchemaNumber,
  FireSchemaList,
  FireSchemaMap,
  FireSchemaRef,
  FireModel,
} from '@fiar/schema'

export interface IFieldBase {
  label?: string
  description?: string
  optional?: boolean
  component?: string
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

export interface IFieldStruct extends IFieldBase, FireSchemaMap {
  fields: Record<string, IFields>
}

export interface IFieldList extends IFieldBase, FireSchemaList {
  of: IFields
}

export interface IFieldRef extends IFieldBase, FireSchemaRef {}

export type IFields = IFieldBoolean | IFieldString | IFieldNumber | IFieldStruct | IFieldList | IFieldRef

export interface IContentDocument extends FireModel {
  type: 'document'
  label: string
}

export interface IContentCollection extends FireModel {
  type: 'collection'
  label?: string
  titleField: keyof this['fields']
}

export type IContentModel = IContentDocument | IContentCollection

export const boolean = <const T extends Omit<IFieldBoolean, 'type'>>(x?: T) =>
  ({ type: 'bool', ...x }) satisfies IFieldBoolean
export const string = <const T extends Omit<IFieldString, 'type'> = {}>(x?: T) =>
  ({ type: 'string' as const, ...x }) as T & { readonly type: 'string' }
export const text = <const T extends Omit<IFieldString, 'type'> = {}>(x?: T) =>
  ({ type: 'string' as const, component: 'field:text', ...x }) as T & { readonly type: 'string' }

export const number = <const T extends Omit<IFieldNumber, 'type'>>(x?: T) =>
  ({ type: 'number', ...x }) satisfies IFieldNumber
export const struct = <const T extends Omit<IFieldStruct, 'type'>>(x: T) =>
  ({ type: 'map', ...x }) satisfies IFieldStruct
export const list = <const T extends Omit<IFieldList, 'type'>>(x: T) => ({ type: 'list', ...x }) satisfies IFieldList
export const ref = <const T extends Omit<IFieldRef, 'type' | 'target'>>(x: T) =>
  ({ type: 'ref', target: 'document', ...x }) as T & { readonly type: 'ref'; readonly target: 'document' }
export const defineDocument = <const T extends Omit<IContentDocument, 'type'>>(x: T) =>
  ({ type: 'document', ...x }) satisfies IContentDocument
export const defineCollection = <const T extends Omit<IContentCollection, 'type'>>(x: T) =>
  ({ type: 'collection', ...x }) satisfies IContentCollection
