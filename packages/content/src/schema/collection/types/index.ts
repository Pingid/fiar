import { FieldRecord, IContentField, record } from '../../field'
import type { IContentDocument } from '../../document'
import { ID, id } from '../../util'

export interface IContentCollection<
  R extends string = string,
  F extends Record<string, IContentField> = Record<string, IContentField>,
> {
  nodeId: ID<'collection'>
  infer: { [K in keyof F]: F[K]['infer'] }
  label?: string
  ref: R
  titleField: string
  field: FieldRecord<F>
  document: (id: string) => IContentDocument<`${R}/${string}`, F>
}

export const col = <
  R extends string = string,
  F extends Record<string, IContentField> = Record<string, IContentField>,
>(p: {
  label?: string
  ref: R
  titleField: string
  fields: F
}): IContentCollection<R, F> => {
  const field = record({ fields: p.fields })
  return {
    ...p,
    field,
    infer: undefined as any,
    nodeId: id('collection'),
    document: (docId: string) => ({
      ref: `${p.ref}/${docId}`,
      field: record({ fields: p.fields }),
      label: (x) => x[p.titleField] || 'Untitled',
      infer: undefined as any,
      nodeId: id('document'),
    }),
  }
}

export const isCol = (x: unknown): x is IContentCollection =>
  !!(x && (x as IContentCollection)?.nodeId?.description === 'collection')
