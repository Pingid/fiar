import { DocumentReference } from '@firebase/firestore'

interface SchemaNode<K extends string, T extends any> {
  nodeId: K
  infer: T
}

export interface IField<K extends string, T extends any> extends SchemaNode<'field', T> {
  type: K
  component: string
}

type Optional<T, O extends boolean | undefined = false> = O extends true ? T | undefined : T

export interface IFieldString<O extends boolean | undefined = false> extends IField<'string', Optional<string, O>> {
  label?: string
  initialValue?: string
  optional?: boolean
}

export interface IFieldNumber<O extends boolean | undefined = false> extends IField<'number', Optional<number, O>> {
  label?: string
  initialValue?: number
  optional?: boolean
}

export interface IFieldBoolean<O extends boolean | undefined = false> extends IField<'boolean', Optional<boolean, O>> {
  label?: string
  optional?: boolean
  initialValue?: boolean
}

export interface IFieldStruct<T extends Record<string, IField<any, any>>, O extends boolean | undefined = false>
  extends IField<'struct', Optional<{ [K in keyof T]: T[K]['infer'] }, O>> {
  label?: string
  optional?: boolean
  fields: T
}

export interface IFieldArray<T extends IField<any, any>, O extends boolean | undefined = false>
  extends IField<'array', Optional<ReadonlyArray<T['infer']>, O>> {
  label?: string
  optional?: boolean
  initialValue?: ReadonlyArray<T['infer']>
  of: T
}

export interface IFieldRef<T extends IContentCollection<any, any>, O extends boolean | undefined = false>
  extends IField<'ref', Optional<DocumentReference<T['infer'], T['infer']>, O>> {
  to: () => T
  label?: string
  optional?: boolean
}

export type IFields =
  | IFieldString
  | IFieldNumber
  | IFieldBoolean
  | IFieldStruct<any>
  | IFieldArray<any>
  | IFieldRef<any>

export interface IContentDef {
  fields: Record<string, IField<any, any>>
  path: string
  label?: string
}

export interface IContentDocumentDef extends IContentDef {
  label: string
}

export interface IContentDocument<P extends string, F extends Record<string, IField<any, any>>>
  extends SchemaNode<'document', { [K in keyof F]: F[K]['infer'] }>,
    IContentDocumentDef {
  fields: F
  path: P
}

export interface IContentCollectionDef extends IContentDef {
  titleField: string
}

export interface IContentCollection<P extends string, F extends Record<string, IField<any, any>>>
  extends SchemaNode<'collection', ReadonlyArray<{ [K in keyof F]: F[K]['infer'] }>>,
    IContentCollectionDef {
  fields: F
  path: P
  label?: string
  titleField: keyof F['infer'] & string
}

export type Options<T> = Omit<T, keyof IField<any, any>>

export const string = <C extends Options<IFieldString> = {}>(config?: C): IFieldString<C['optional']> => ({
  nodeId: 'field',
  type: 'string',
  component: 'field:string',
  infer: undefined as any,
  ...config,
})

export const number = <C extends Options<IFieldNumber> = {}>(config?: C): IFieldNumber<C['optional']> => ({
  nodeId: 'field',
  type: 'number',
  component: 'field:number',
  infer: undefined as any,
  ...config,
})

export const boolean = <C extends Options<IFieldBoolean> = {}>(config?: C): IFieldBoolean<C['optional']> => ({
  nodeId: 'field',
  type: 'boolean',
  component: 'field:boolean',
  infer: undefined as any,
  ...config,
})

export const struct = <C extends Options<IFieldStruct<any>>>(config: C): IFieldStruct<C['fields'], C['optional']> => ({
  nodeId: 'field',
  type: 'struct',
  component: 'field:struct',
  infer: undefined as any,
  ...config,
})

export const array = <C extends Options<IFieldArray<any, any>>>(config: C): IFieldArray<C['of'], C['optional']> => ({
  nodeId: 'field',
  type: 'array',
  component: 'field:array',
  infer: undefined as any,
  ...config,
})

export const ref = <T extends IContentCollection<any, any>>(
  config: { to: () => T } & Options<IFieldRef<T>>,
): IFieldRef<T> => ({
  nodeId: 'field',
  type: 'ref',
  component: 'field:ref',
  infer: undefined as any,
  ...config,
})

export const defineDocument = <D extends IContentDocumentDef>(def: D): IContentDocument<D['path'], D['fields']> => ({
  nodeId: 'document',
  infer: undefined as any,
  ...def,
})

export const defineCollection = <D extends IContentCollectionDef>(
  def: D & { titleField: keyof D['fields'] },
): IContentCollection<D['path'], D['fields']> => ({
  nodeId: 'collection',
  infer: undefined as any,
  ...def,
  titleField: def.titleField as any,
})
