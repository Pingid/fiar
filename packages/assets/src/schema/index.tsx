import { IFieldString, IFieldStruct, struct, string } from '@fiar/content/schema'

export interface IFieldAsset extends IFieldStruct {
  label?: string
  optional?: boolean
  fields: { fullPath: IFieldString; bucket: IFieldString; name: IFieldString }
}

export const image = <const C extends Omit<IFieldAsset, 'fields' | 'type'>>(config: C) =>
  struct({
    ...config,
    fields: { fullPath: string({}), bucket: string({}), name: string({}) },
    component: 'field:asset',
  })
