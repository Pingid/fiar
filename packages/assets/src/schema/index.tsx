import { IFieldString, IFieldStruct, Options, struct, string } from '@fiar/content/schema'

export interface IFieldAsset<O extends boolean | undefined = false>
  extends IFieldStruct<{ fullPath: IFieldString; bucket: IFieldString; name: IFieldString }, O> {
  label?: string
  optional?: boolean
}

export const image = <C extends Omit<Options<IFieldAsset>, 'fields'>>(config: C): IFieldAsset<C['optional']> =>
  struct({
    ...config,
    fields: { fullPath: string({}), bucket: string({}), name: string({}) },
    component: 'field:asset',
  })
