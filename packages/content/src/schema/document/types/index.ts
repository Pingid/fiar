import type { Timestamp } from '@firebase/firestore'
import type { AuthUser } from '@fiar/workbench'

import { FieldRecord, IContentField, record } from '../../field'
import { ID, id } from '../../util'

type DocumentMetaInfo = { at: Timestamp; by?: AuthUser | undefined | null }
export type DocumentMeta = { created: DocumentMetaInfo; updated?: DocumentMetaInfo; published?: DocumentMetaInfo }

export interface DocumentVersions<T extends Record<string, any> = Record<string, any>> {
  draft: Partial<T> & { _meta: DocumentMeta }
  archive: Partial<T> & { _meta: DocumentMeta & { archived?: DocumentMetaInfo } }
  published: T
}

export interface IContentDocument<
  R extends string = string,
  F extends Record<string, IContentField> = Record<string, IContentField>,
> {
  nodeId: ID<'document'>
  infer: { [K in keyof F]: F[K]['infer'] }
  label: (doc: Record<string, any>) => string
  ref: R
  field: FieldRecord<F>
}

export const doc = <R extends string, F extends Record<string, IContentField> = Record<string, IContentField>>(p: {
  label: string | ((doc: { [K in keyof F]: F[K]['infer'] }) => string)
  fields: F
  ref: R
}): IContentDocument<R, F> => ({
  ...p,
  field: record({ fields: p.fields }),
  label: (x) => (typeof p.label === 'string' ? p.label : p.label(x as any)),
  infer: undefined as any,
  nodeId: id('document'),
})
export const isDoc = (x: unknown): x is IContentDocument =>
  !!(x && (x as IContentDocument)?.nodeId?.description === 'document')
