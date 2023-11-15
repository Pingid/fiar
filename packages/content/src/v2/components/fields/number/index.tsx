import { get, useFormState } from 'react-hook-form'
import { Field, Input } from '@fiar/components'

import { type FieldComponent, fieldError } from '../../../field/index.js'
import { type IFieldNumber } from '../../../schema/index.js'

export const FieldNumber: FieldComponent<IFieldNumber> = (props) => {
  const state = useFormState(props)
  const error = fieldError(get(state.errors, props.name))

  return (
    <Field name={props.name} label={props.field.label} error={error}>
      <Field.Control>
        <Input
          id={props.name}
          type="number"
          step="any"
          {...props.register(props.name, { required: !props.field.optional, valueAsNumber: true })}
        />
      </Field.Control>
    </Field>
  )
}
