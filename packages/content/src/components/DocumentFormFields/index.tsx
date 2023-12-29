import { Control, UseFormRegister } from 'react-hook-form'

import { IContentModel, IFields } from '../../schema/index.js'
import { RenderField } from '../FieldComponent/index.js'

export const DocumentFormFields = (props: {
  schema: IContentModel
  register: UseFormRegister<Record<string, any>>
  control: Control<Record<string, any>, any>
}) => {
  return (
    <div className="mx-auto mb-32 max-w-5xl space-y-6 p-4 py-6">
      {Object.keys(props.schema.fields).map((key) => {
        const field = props.schema.fields[key] as IFields
        return <RenderField {...props} key={key} name={key} field={{ ...field, label: field.label ?? key }} />
      })}
    </div>
  )
}
