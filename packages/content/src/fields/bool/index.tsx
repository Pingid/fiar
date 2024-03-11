import { Field, Input, FieldControl } from '@fiar/components'

import { FieldPreview, useFormField } from '../../context/field.js'
import { type IFieldBoolean } from '../../schema/index.js'

export const FormFieldBool = () => {
  const field = useFormField<IFieldBoolean>()

  return (
    <Field name={field.name} label={field.schema.label} error={field.error} description={field.schema.description}>
      <FieldControl>
        <Input
          id={field.name}
          type="checkbox"
          {...field.control.register(field.name, { required: !field.schema.optional })}
        />
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldBool: FieldPreview<IFieldBoolean> = (props) => {
  return <Input type="checkbox" checked={props.value} />
}
