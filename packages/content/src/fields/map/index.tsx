import { cn } from 'mcn'

import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Field, FieldControl } from '@fiar/components'

import {
  FormField,
  useFieldPreview,
  FieldProvider,
  useFieldForm,
  useFormFieldControl,
  useController,
} from '../../context/field.js'
import type { IFieldMap, IFields } from '../../schema/index.js'

export const FormFieldMap = () => {
  const field = useFieldForm<IFieldMap>()
  const isListItem = field.parent?.type === 'list'
  const control = useFormFieldControl<IFieldMap>()
  const optional = field.schema.optional

  return (
    <Field name={field.name} label={field.schema.label} error={field.error} description={field.schema.description}>
      <FieldControl>
        {optional && (
          <div className="bg-back flex w-full justify-between border-b p-1 px-2">
            <div />
            <div className="flex items-center gap-1.5">
              {control.field.value ? (
                <button type="button" onClick={() => control.field.onChange(undefined)}>
                  <XMarkIcon className="h-[1.1rem] w-[1.1rem]" />
                </button>
              ) : (
                <button type="button" onClick={() => control.field.onChange({})}>
                  <PlusIcon className="h-[1.1rem] w-[1.1rem]" />
                </button>
              )}
            </div>
          </div>
        )}
        {(control.field.value || !optional) && (
          <div className={cn('bg-back space-y-4 p-3', [!isListItem, '', 'py-3'])}>
            {Object.keys(field.schema.fields).map((key) => {
              const inner = field.schema.fields[key] as IFields
              const name = field.name ? `${field.name}.${key}` : key
              return (
                <FieldProvider key={key} value={{ schema: inner, name, parent: field.schema }}>
                  <FormField {...(field as any)} name={name} field={{ ...inner, label: inner.label ?? key }} />
                </FieldProvider>
              )
            })}
          </div>
        )}
        {/* <ExtraFields /> */}
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldMap = () => {
  const field = useFieldPreview<IFieldMap>()
  return JSON.stringify(field.value)
}

export const ExtraFields = () => {
  const field = useFieldForm<IFieldMap>()
  const control = useController(field)

  const extra = Object.keys(control.field.value ?? {}).filter((key) => !(key in field.schema.fields))
  return (
    <ul>
      {extra.map((key) => (
        <p key={key}>
          {key}: {JSON.stringify(control.field.value[key])}
        </p>
      ))}
    </ul>
  )
}
