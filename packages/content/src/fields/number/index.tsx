import { Input } from '@nextui-org/react'

import { useFieldPreview, useFieldForm, registerField } from '../../context/field.js'
import { IFieldBoolean, type IFieldNumber } from '../../schema/index.js'
import { Field } from '../../components/index.js'

export const FormFieldNumber = () => {
  const field = useFieldForm<IFieldNumber>()
  const schema = field.schema

  const register = field.register({
    valueAsNumber: true,
    validate: (x) => {
      if (typeof schema.max !== 'undefined' && x > schema.max) return `Excedes maximum value ${schema.max}`
      if (typeof schema.min !== 'undefined' && x < schema.min) return `Requires a minimum value ${schema.min}`
      return true
    },
  })

  return (
    <Field {...field}>
      <Input
        id={field.name}
        variant="bordered"
        isRequired={!field.schema.optional}
        placeholder={field.schema.placeholder ?? ' '}
        isInvalid={!!field.error}
        type="number"
        step="any"
        aria-label={field.schema.label}
        {...register}
      />
    </Field>
  )
}

export const PreviewFieldNumber = () => {
  const field = useFieldPreview<IFieldBoolean>()
  return field.value
}

registerField('number', { form: FormFieldNumber, preview: PreviewFieldNumber })
