import { type IField } from './index.js'

export interface IModel<
  F extends Record<string, IField> = Record<string, IField>,
  P extends `/${string}` = `/${string}`,
> {
  infer: { [K in keyof F]: F[K]['infer'] }
  path: P
  fields: F
}

export const model = <const M extends Omit<IModel, 'infer'>>(props: M) => props as any as IModel<M['fields'], M['path']>
