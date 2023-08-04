import { FieldRecord, IContentField, record } from '../../field'
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
}

export const col = <
  R extends string = string,
  F extends Record<string, IContentField> = Record<string, IContentField>,
>(p: {
  label?: string
  ref: R
  titleField: string
  fields: F
}): IContentCollection<R, F> => ({
  ...p,
  field: record({ fields: p.fields }),
  infer: undefined as any,
  nodeId: id('collection'),
})

export const isCol = (x: unknown): x is IContentCollection =>
  !!(x && (x as IContentCollection)?.nodeId?.description === 'collection')
