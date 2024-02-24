import { get, useFormState } from 'react-hook-form'
import { Field, Input, FieldControl } from '@fiar/components'

import { type FieldForm, fieldError, FieldPreview } from '../lib/index.js'
import { type IFieldBoolean } from '../../schema/index.js'

export const FormFieldBool: FieldForm<IFieldBoolean> = (props) => {
  const state = useFormState(props)
  const error = fieldError(get(state.errors, props.name))

  return (
    <Field name={props.name} label={props.field.label} error={error} description={props.field.description}>
      <FieldControl>
        <Input
          id={props.name}
          type="checkbox"
          {...props.control.register(props.name, { required: !props.field.optional })}
        />
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldBool: FieldPreview<IFieldBoolean> = (props) => {
  return <Input type="checkbox" checked={props.value} />
}
