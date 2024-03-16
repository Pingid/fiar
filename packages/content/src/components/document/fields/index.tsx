import { Button, Field, FieldControl } from '@fiar/components'

import { FieldProvider, FormField, useController, useFormContext } from '../../../context/field.js'
import { IContentModel, IFields } from '../../../schema/index.js'

export const DocumentFormFields = (props: { schema: IContentModel }) => {
  return (
    <div className="mx-auto mb-32 max-w-5xl space-y-6 p-4 py-6">
      <Extras {...props} />

      {Object.keys(props.schema.fields).map((name) => {
        const schema = props.schema.fields[name] as IFields
        return (
          <FieldProvider key={name} value={{ schema, name }}>
            <FormField />
          </FieldProvider>
        )
      })}
    </div>
  )
}

const Extras = (props: { schema: IContentModel }) => {
  const form = useFormContext()
  const values = form.watch()
  const extra = Object.keys(values).filter((key) => !(key in props.schema.fields) && typeof values[key] !== 'undefined')
  if (extra.length === 0) return null
  return (
    <Field label="Extra fields" description="Found fields in document that don't match the schema">
      <ul>
        {extra.map((key) => (
          <Extra key={key} name={key} />
        ))}
      </ul>
    </Field>
  )
}

const Extra = (props: { name: string }) => {
  const control = useController({ ...props, rules: { validate: () => 'Field not declared in schema' } })

  return (
    <Field key={props.name} error={control.fieldState.error?.message as string}>
      <div className="flex items-center gap-2">
        <FieldControl className="w-max px-2">{props.name}</FieldControl>:
        <FieldControl className="px-2">{JSON.stringify(control.field.value || null)}</FieldControl>
        <Button size="sm" color="error" onClick={() => control.field.onChange(undefined)}>
          Delete
        </Button>
      </div>
    </Field>
  )
}
