import { useFormState, get } from 'react-hook-form'
import { Field, Input, FieldControl, Select } from '@fiar/components'

import { type FieldForm, type FieldPreview, fieldError } from '../lib/index.js'
import { type IFieldString } from '../../schema/index.js'

export const FormFieldString: FieldForm<IFieldString> = (props) => {
  const state = useFormState(props)
  const error = fieldError(get(state.errors, props.name))

  const register = props.control.register(props.name, {
    validate: (x) => {
      if (!x && !props.field.optional) return `Required value`
      return true
    },
  })

  return (
    <Field name={props.name} label={props.field.label} error={error} description={props.field.description}>
      <FieldControl error={!!error}>
        {props.field.select ? (
          <Select id={props.name} {...register}>
            {props.field.select.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label || x.value}
              </option>
            ))}
          </Select>
        ) : (
          <Input id={props.name} type="text" {...register} />
        )}
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldString: FieldPreview<IFieldString> = (props) => {
  return props.value
}
