import { IFieldString, IFieldMap, map, string } from '@fiar/content/schema'

export interface IFieldAsset extends IFieldMap {
  label?: string
  fields: { fullPath: IFieldString; bucket: IFieldString; name: IFieldString }
}

export const asset = <const C extends Omit<IFieldAsset, 'fields' | 'type'>>(config: C) =>
  map({
    ...config,
    fields: { fullPath: string({}), bucket: string({}), name: string({}) },
    component: 'asset',
  })
