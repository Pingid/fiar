import { cn } from 'mcn'

import { Markdown } from '@fiar/components'

import { type FieldPreview, type FieldForm, FormField } from '../lib/index.js'
import type { IFieldMap, IFields } from '../../schema/index.js'

export const FormFieldMap: FieldForm<IFieldMap> = (props) => {
  const isListItem = props.parent?.type === 'list'

  return (
    <div className="">
      <div className="flex w-full justify-between rounded-t">
        <h2 className="py-1 text-2xl">{props.field.label}</h2>
      </div>
      <Markdown className="text-front/50 pb-1 text-sm">{props.field.description}</Markdown>
      <div className={cn('space-y-4', [!isListItem, 'border-l pl-4 pt-3', 'py-3'])}>
        {Object.keys(props.field.fields).map((key) => {
          const field = props.field.fields[key] as IFields
          const name = props.name ? `${props.name}.${key}` : key
          return <FormField {...props} key={key} name={name} field={{ ...field, label: field.label ?? key }} />
        })}
      </div>
    </div>
  )
}

export const PreviewFieldMap: FieldPreview<IFieldMap> = (props) => {
  return JSON.stringify(props.value)
}
