import { cn } from 'mcn'

import { Markdown } from '@fiar/components'

import { FormField, useFieldPreview, FieldProvider, useFormField } from '../../context/field.js'
import type { IFieldMap, IFields } from '../../schema/index.js'

export const FormFieldMap = () => {
  const field = useFormField<IFieldMap>()
  const isListItem = field.parent?.type === 'list'

  return (
    <div className="">
      <div className="flex w-full justify-between rounded-t">
        <h2 className="py-1 text-2xl">{field.schema.label}</h2>
      </div>
      <Markdown className="text-front/50 pb-1 text-sm">{field.schema.description}</Markdown>
      <div className={cn('space-y-4', [!isListItem, 'border-l pl-4 pt-3', 'py-3'])}>
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
    </div>
  )
}

export const PreviewFieldMap = () => {
  const field = useFieldPreview<IFieldMap>()
  return JSON.stringify(field.value)
}
