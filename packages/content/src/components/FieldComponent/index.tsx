import { Control } from 'react-hook-form'
import { UseExtension } from '@fiar/workbench/extensions'
import { FieldMissing } from '../FieldMissing/index.js'
import { IFields } from '../../schema/index.js'

export const RenderField = (props: { field: IFields; parent?: IFields; control: Control<any, any>; name: string }) => {
  const extension = props.field.component ?? `field:${props.field.type}`
  return (
    <UseExtension
      extension={extension}
      props={{ ...props, parent: props.field }}
      fallback={<FieldMissing field={props.field} />}
    />
  )
}
