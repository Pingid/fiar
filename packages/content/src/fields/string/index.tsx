import { Field, Input, FieldControl, Select, TextArea } from '@fiar/components'

import { useFieldForm, useFieldPreview } from '../../context/field.js'
import { type IFieldString } from '../../schema/index.js'

export const FormFieldString = () => {
  const field = useFieldForm<IFieldString>()

  const register = field.control.register(field.name, {
    validate: (x) => {
      if (!x && !field.schema.optional) return `Required`
      if (typeof x === 'undefined') return true
      if (typeof field.schema.max === 'number' && x > field.schema.max)
        return `Failed is limited to ${field.schema.max} charactors`
      return true
    },
  })

  const inner = field.schema.multiline ? (
    <TextArea id={field.name} rows={1} style={{ height: 25 }} {...register} />
  ) : (
    <Input id={field.name} type="text" {...register} />
  )

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
          inner
        )}
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldString = () => {
  const field = useFieldPreview<IFieldString>()
  return field.value
}
