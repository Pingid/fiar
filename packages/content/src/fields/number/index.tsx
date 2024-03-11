import { Field, Input, FieldControl } from '@fiar/components'

import { FieldPreview, useFormField } from '../../context/field.js'
import { type IFieldNumber } from '../../schema/index.js'

export const FieldNumber = () => {
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

export const PreviewFieldNumber: FieldPreview<IFieldNumber> = (props) => {
  return props.value
}
