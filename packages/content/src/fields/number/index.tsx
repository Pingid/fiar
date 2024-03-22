import { Field, Input, FieldControl } from '@fiar/components'

import { useFieldPreview, useFieldForm, registerField } from '../../context/field.js'
import { IFieldBoolean, type IFieldNumber } from '../../schema/index.js'

export const FormFieldNumber = () => {
  const field = useFieldForm<IFieldNumber>()

  return (
    <Field {...field}>
      <FieldControl error={!!field.error}>
        <Input id={field.name} type="number" step="any" {...field.register({ valueAsNumber: true })} />
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldNumber = () => {
  const field = useFieldPreview<IFieldBoolean>()
  return field.value
}

registerField('number', { form: FormFieldNumber, preview: PreviewFieldNumber })
