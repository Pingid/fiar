import { Field, Input, FieldControl } from '@fiar/components'

import { IFieldBoolean, type IFieldNumber } from '../../schema/index.js'
import { useFieldPreview, useFormField } from '../../context/field.js'

export const FormFieldNumber = () => {
  const field = useFormField<IFieldNumber>()

  return (
    <Field name={field.name} label={field.schema.label} error={field.error} description={field.schema.description}>
      <FieldControl error={!!field.error}>
        <Input
          id={field.name}
          type="number"
          step="any"
          {...field.control.register(field.name, { required: !field.schema.optional, valueAsNumber: true })}
        />
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldNumber = () => {
  const field = useFieldPreview<IFieldBoolean>()
  return field.value
}
