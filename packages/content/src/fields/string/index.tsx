import { Field, Input, FieldControl, Select, TextArea } from '@fiar/components'

import { useFieldForm, useFieldPreview, registerField } from '../../context/field.js'
import { type IFieldString } from '../../schema/index.js'

export const FormFieldString = () => {
  const field = useFieldForm<IFieldString>()
  const schema = field.schema

  const register = field.register({
    validate: (x) => {
      if (schema.maxLength && schema.maxLength && x.length > schema.maxLength)
        return `Excedes maximum of ${schema.maxLength} characters`
      if (schema.minLength && schema.minLength && x.length < schema.minLength)
        return `Requires a minimum of ${schema.minLength} characters`
      if (schema.match && !new RegExp(schema.match).test(x)) return `Failed to match ${schema.match}`
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
    <TextArea id={field.name} rows={1} style={{ height: 25 }} placeholder={field.schema.placeholder} {...register} />
  ) : (
    <Input id={field.name} type="text" placeholder={field.schema.placeholder} {...register} />
  )

  return (
    <Field {...field}>
      <FieldControl error={!!field.error}>{inner}</FieldControl>
    </Field>
  )
}

export const PreviewFieldString = () => {
  const field = useFieldPreview<IFieldString>()
  return <p>{field.value}</p>
}

registerField('string', { form: FormFieldString, preview: PreviewFieldString })
