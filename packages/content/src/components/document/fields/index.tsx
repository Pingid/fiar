import { FieldProvider, FormField } from '../../../context/field.js'
import { IContentModel, IFields } from '../../../schema/index.js'

export const DocumentFormFields = (props: { schema: IContentModel }) => {
  return (
    <div className="mx-auto mb-32 max-w-5xl space-y-6 p-4 py-6">
      {Object.keys(props.schema.fields).map((name) => {
        const schema = props.schema.fields[name] as IFields
        return (
          <FieldProvider key={name} value={{ schema, name }}>
            <FormField />
          </FieldProvider>
        )
      })}
    </div>
  )
}
