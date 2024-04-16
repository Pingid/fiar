import { Field, Checkbox, FieldControl } from '@fiar/components'

import { useFieldPreview, useFieldForm, registerField } from '../../context/field.js'
import { type IFieldBoolean } from '../../schema/index.js'

export const FormFieldBool = () => {
  const field = useFieldForm<IFieldBoolean>()

  return (
    <Field {...field}>
      <FieldControl>
        <Checkbox id={field.name} {...field.register()} />
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldBool = () => {
  const field = useFieldPreview<IFieldBoolean>()
  return <Checkbox checked={field.value} disabled />
}

registerField('bool', { form: FormFieldBool, preview: PreviewFieldBool })
