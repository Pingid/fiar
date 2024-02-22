import { get, useFormState } from 'react-hook-form'
import { Field, Input } from '@fiar/components'

import { type FieldForm, fieldError, FieldPreview } from '../lib/index.js'
import { type IFieldNumber } from '../../schema/index.js'

export const FieldNumber: FieldForm<IFieldNumber> = (props) => {
  const state = useFormState(props)
  const error = fieldError(get(state.errors, props.name))

  return (
    <Field name={props.name} label={props.field.label} error={error} description={props.field.description}>
      <Field.Control error={!!error}>
        <Input
          id={props.name}
          type="number"
          step="any"
          {...props.control.register(props.name, { required: !props.field.optional, valueAsNumber: true })}
        />
      </Field.Control>
    </Field>
  )
}

export const PreviewFieldNumber: FieldPreview<IFieldNumber> = (props) => {
  return props.value
}
