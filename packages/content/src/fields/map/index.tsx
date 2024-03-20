import { cn } from 'mcn'

import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button, Field } from '@fiar/components'

import { useFieldPreview, useFieldForm, useFormFieldControl, useController, Fields } from '../../context/field.js'
import type { IFieldMap } from '../../schema/index.js'

export const FormFieldMap = () => {
  const field = useFieldForm<IFieldMap>()
  const isListItem = field.parent?.type === 'list'
  const control = useFormFieldControl<IFieldMap>()
  const optional = field.schema.optional

  return (
    <Field name={field.name} label={field.schema.label} error={field.error} description={field.schema.description}>
      <div className="border">
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
            <UndeclaredFields {...field} />

            <Fields fields={field.schema.fields} name={field.name} parent={field.schema} />
          </div>
        )}
      </div>
    </Field>
  )
}

export const PreviewFieldMap = () => {
  const field = useFieldPreview<IFieldMap>()
  return JSON.stringify(field.value)
}

const getUndeclared = (value: Record<string, any>, fields: Record<string, any>) =>
  Object.keys(value).filter((key) => !(key in fields) && typeof value[key] !== 'undefined')

export const UndeclaredFields = (props: { schema: IFieldMap; name: string }) => {
  const control = useController({
    ...props,
    rules: {
      validate: (x) => {
        if (getUndeclared(x, props.schema.fields).length === 0) return true
        return 'Field not declared in schema'
      },
    },
  })
  const value = control.field.value
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null
  const extra = getUndeclared(value, props.schema.fields)
  const onRemove = () => {
    const next = { ...control.field.value }
    extra.forEach((key) => delete next[key])
    control.field.onChange(next)
  }
  if (extra.length === 0) return null
  return (
    <Field error={control.fieldState.error?.message}>
      <div className="border-error/40 bg-error/5 z-20 border p-3">
        <p className="text-error text-sm">Found undeclared fields in document</p>
        <ul className="pt-2 text-sm">
          {extra.map((key) => (
            <div key={key} className="flex items-center gap-1">
              <span className="text-front/70">{key}:</span>
              {JSON.stringify(value[key] || null)}
            </div>
          ))}
        </ul>
        <div className="flex justify-end">
          <Button size="sm" color="error" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </div>
    </Field>
  )
}
