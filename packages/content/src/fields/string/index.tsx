import { Field, Input, FieldControl, Select } from '@fiar/components'

import { useFieldForm, useFieldPreview } from '../../context/field.js'
import { type IFieldString } from '../../schema/index.js'

export const FormFieldString = () => {
  const field = useFieldForm<IFieldString>()

  const register = field.control.register(field.name, {
    validate: (x) => {
      if (!x && !field.schema.optional) return `Required value`
      return true
    },
  })

  return (
    <Field name={field.name} label={field.schema.label} error={field.error} description={field.schema.description}>
      <FieldControl error={!!field.error}>
        {field.schema.select ? (
          <Select id={field.name} {...register}>
            {field.schema.select.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label || x.value}
              </option>
            ))}
          </Select>
        ) : (
          <Input id={field.name} type="text" {...register} />
        )}
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldString = () => {
  const field = useFieldPreview<IFieldString>()
  return field.value
}
