import { IFieldString, IFieldMap, map, string } from '@fiar/content/schema'

export interface IFieldAsset extends IFieldMap {
  label?: string
  optional?: boolean
  fields: { fullPath: IFieldString; bucket: IFieldString; name: IFieldString }
}

export const image = <const C extends Omit<IFieldAsset, 'fields' | 'type'>>(config: C) =>
  map({
    ...config,
    fields: { fullPath: string({}), bucket: string({}), name: string({}) },
    components: { form: 'field/asset/form', preview: 'field/asset/preview' },
  })
