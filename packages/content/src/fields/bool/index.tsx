import { Switch } from '@nextui-org/react'
import { useEffect } from 'react'

import { useFieldPreview, useFieldForm, registerField, useFormFieldControl } from '../../context/field.js'
import { type IFieldBoolean } from '../../schema/index.js'
import { Field } from '../../components/index.js'

export const FormFieldBool = () => {
  const field = useFieldForm<IFieldBoolean>()
  const value = useFormFieldControl({ rules: { required: false } })

  useEffect(() => {
    if (typeof value.field.value === 'undefined' && !field.schema.optional) {
      value.field.onChange(false)
    }
  }, [value.field.value])

  return (
    <Field {...field}>
      <Switch id={field.name} aria-label={field.schema.label} variant="bordered" value={value.field.value} />
    </Field>
  )
}

export const PreviewFieldBool = () => {
  const field = useFieldPreview<IFieldBoolean>()
  return <Switch value={field.value} disabled />
}

registerField('bool', { form: FormFieldBool, preview: PreviewFieldBool })
