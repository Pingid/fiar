import { Field, Input, FieldControl, Select, TextArea } from '@fiar/components'

import { useFieldForm, useFieldPreview } from '../../context/field.js'
import { type IFieldString } from '../../schema/index.js'

export const FormFieldString = () => {
  const field = useFieldForm<IFieldString>()

  const register = field.register({
    validate: (x) => {
      if (!x && !field.schema.optional) return `Required`
      if (typeof x === 'undefined') return true
      if (typeof field.schema.max === 'number' && x.length > field.schema.max)
        return `Failed is limited to ${field.schema.max} charactors`
      return true
    },
  })

  const inner = field.schema.select ? (
    <Select id={field.name} {...register}>
      {field.schema.select.map((x) => (
        <option key={x.value} value={x.value}>
          {x.label || x.value}
        </option>
      ))}
    </Select>
  ) : field.schema.multiline ? (
    <TextArea id={field.name} rows={1} style={{ height: 25 }} {...register} />
  ) : (
    <Input id={field.name} type="text" {...register} />
  )

  return (
    <Field name={field.name} label={field.schema.label} error={field.error} description={field.schema.description}>
      <FieldControl error={!!field.error}>{inner}</FieldControl>
    </Field>
  )
}

export const PreviewFieldString = () => {
  const field = useFieldPreview<IFieldString>()
  return <p>{field.value}</p>
}
