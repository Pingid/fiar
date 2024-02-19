import { useFormState, get } from 'react-hook-form'
import { Field, Input } from '@fiar/components'

import { type FieldComponent, fieldError } from '../../fields/index.js'
import { type IFieldString } from '../../schema/index.js'

export const FieldString: FieldComponent<IFieldString> = (props) => {
  const state = useFormState(props)
  const error = fieldError(get(state.errors, props.name))

  return (
    <Field name={props.name} label={props.field.label} error={error} description={props.field.description}>
      <Field.Control error={!!error}>
        <Input
          id={props.name}
          type="text"
          {...props.control.register(props.name, {
            validate: (x) => {
              if (!x && !props.field.optional) return `Required value`
              return true
            },
          })}
        />
      </Field.Control>
    </Field>
  )
}
