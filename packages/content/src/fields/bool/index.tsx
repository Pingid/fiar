import { Field, Input, FieldControl } from '@fiar/components'

import { useFieldPreview, useFieldForm } from '../../context/field.js'
import { type IFieldBoolean } from '../../schema/index.js'

export const FormFieldBool = () => {
  const field = useFieldForm<IFieldBoolean>()
  return (
    <Field name={field.name} label={field.schema.label} error={field.error} description={field.schema.description}>
      <FieldControl>
        <Input id={field.name} type="checkbox" {...field.register()} />
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldBool = () => {
  const field = useFieldPreview<IFieldBoolean>()
  return <Input type="checkbox" checked={field.value} disabled />
}
