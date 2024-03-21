import { Field, Input, FieldControl } from '@fiar/components'

import { IFieldBoolean, type IFieldNumber } from '../../schema/index.js'
import { useFieldPreview, useFieldForm } from '../../context/field.js'

export const FormFieldNumber = () => {
  const field = useFieldForm<IFieldNumber>()
  const register = field.control.register(field.name, {
    ...field.schema,
    required: !field.schema.optional,
    valueAsNumber: true,
  })

  return (
    <Field name={field.name} label={field.schema.label} error={field.error} description={field.schema.description}>
      <FieldControl error={!!field.error}>
        <Input id={field.name} type="number" step="any" {...register} />
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldNumber = () => {
  const field = useFieldPreview<IFieldBoolean>()
  return field.value
}
