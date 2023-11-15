import { IFieldString, IFieldStruct, Options, struct, string } from '@fiar/content/v2/schema'

export interface IFieldImage<O extends boolean | undefined = false>
  extends IFieldStruct<{ fullPath: IFieldString; bucket: IFieldString; name: IFieldString }, O> {
  label?: string
  optional?: boolean
}

export const image = <C extends Omit<Options<IFieldImage>, 'fields'>>(config: C): IFieldImage<C['optional']> =>
  struct({
    ...config,
    fields: { fullPath: string({}), bucket: string({}), name: string({}) },
    component: 'field:assets-image',
  })
