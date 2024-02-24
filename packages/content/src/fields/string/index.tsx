import { useFormState, get } from 'react-hook-form'
import { Field, Input, FieldControl } from '@fiar/components'

import { type FieldForm, type FieldPreview, fieldError } from '../lib/index.js'
import { type IFieldString } from '../../schema/index.js'

export const FormFieldString: FieldForm<IFieldString> = (props) => {
  const state = useFormState(props)
  const error = fieldError(get(state.errors, props.name))

  return (
    <Field name={props.name} label={props.field.label} error={error} description={props.field.description}>
      <FieldControl error={!!error}>
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
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldString: FieldPreview<IFieldString> = (props) => {
  return props.value
}
