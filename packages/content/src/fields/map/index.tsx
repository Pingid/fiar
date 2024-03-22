import { cn } from 'mcn'

import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Button, Field } from '@fiar/components'

import {
  useFieldPreview,
  useFieldForm,
  useFormFieldControl,
  useController,
  FormFields,
  useFormContext,
  get,
  registerField,
} from '../../context/field.js'
import type { IFieldMap } from '../../schema/index.js'
import { useRef } from 'react'

export const FormFieldMap = () => {
  const form = useFormContext()
  const field = useFieldForm<IFieldMap>()
  const isListItem = field.parent?.type === 'list'
  const control = useFormFieldControl<IFieldMap>()
  const optional = field.schema.optional
  const value = get(form.getValues(), field.name)
  const open = value || !optional

  return (
    <Field {...field}>
      <div className={cn('border-x border-t', [!!open, 'border-b'])}>
        {optional && (
          <div className="bg-back flex w-full justify-between border-b">
            <div />
            <div className="flex items-center gap-1.5">
              {value ? (
                <Button icon={<XMarkIcon />} variant="ghost" onClick={() => control.field.onChange(undefined)}>
                  Remove
                </Button>
              ) : (
                <Button icon={<PlusIcon />} variant="ghost" onClick={() => control.field.onChange({})}>
                  Add
                </Button>
              )}
            </div>
          </div>
        )}

        {open && (
          <div className={cn('bg-back space-y-4 p-3', [!isListItem, '', 'py-3'])}>
            <UndeclaredFields {...field} />

            <FormFields fields={field.schema.fields} name={field.name} parent={field.schema} />
          </div>
        )}
      </div>
    </Field>
  )
}

export const PreviewFieldMap = () => {
  const field = useFieldPreview<IFieldMap>()

  return (
    <div className="grid grid-cols-2 text-sm">
      {Object.keys(field.schema.fields)
        .slice(0, 3)
        .map((x) => (
          <p key={x} className="col-span-2 grid-cols-subgrid">
            <span className="text-front/60">{x}:</span>
            <span className="pl-1">{JSON.stringify(field.value[x], null, 2)}</span>
          </p>
        ))}
    </div>
  )
}

registerField('map', { form: FormFieldMap, preview: PreviewFieldMap })

const getUndeclared = (value: Record<string, any>, fields: Record<string, any>) =>
  Object.keys(value).filter((key) => !(key in fields) && typeof value[key] !== 'undefined')

export const UndeclaredFields = (props: { schema: IFieldMap; name: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  const control = useController({
    ...props,
    rules: {
      validate: (x) => {
        if (!x || getUndeclared(x, props.schema.fields).length === 0) return true
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
    <Field {...props} ref={ref}>
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
          <Button color="error" onClick={onRemove}>
            Remove
          </Button>
        </div>
      </div>
    </Field>
  )
}
