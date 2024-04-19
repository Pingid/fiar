import { Input, Textarea, Select, SelectItem, InputProps } from '@nextui-org/react'

import { useFieldForm, useFieldPreview, registerField } from '../../context/field.js'
import { type IFieldString } from '../../schema/index.js'
import { Field } from '../../components/index.js'

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

  const props = {
    id: field.name,
    variant: 'bordered',
    placeholder: field.schema.placeholder ?? ' ',
    isInvalid: !!field.error,
    'aria-label': field.schema.label,
    ...register,
  } satisfies InputProps

  return (
    <Field {...field}>
      {field.schema.select ? (
        <Select {...props}>
          {field.schema.select.map((x) => (
            <SelectItem key={x} value={x}>
              {x}
            </SelectItem>
          ))}
        </Select>
      ) : field.schema.multiline ? (
        <Textarea {...props} />
      ) : (
        <Input type="text" {...props} />
      )}
    </Field>
  )
}

export const PreviewFieldString = () => {
  const field = useFieldPreview<IFieldString>()
  return <p>{field.value}</p>
}

registerField('string', { form: FormFieldString, preview: PreviewFieldString })
