import { UndeclaredFields } from '../../../fields/index.js'
import { IContentModel } from '../../../schema/index.js'
import { FormFields } from '../../../context/field.js'

export const DocumentFormFields = (props: { schema: IContentModel }) => {
  return (
    <div className="mx-auto mb-32 max-w-5xl space-y-6 p-4 py-6">
      <UndeclaredFields schema={{ ...props.schema, type: 'map' }} name="data" />
      <FormFields fields={props.schema.fields} name="data" />
    </div>
  )
}
