import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { cn } from 'mcn'

import { Markdown } from '@fiar/components'

import { IFieldStruct, IFields } from '../../schema/index.js'
import { type FieldComponent } from '../../fields/index.js'
import { RenderField } from '../FieldComponent/index.js'

export const FieldStruct: FieldComponent<IFieldStruct> = (props) => {
  const [open, setOpen] = useState(true)
  const isListItem = props.parent?.type === 'list'

  return (
    <div className="">
      <div className="flex w-full justify-between rounded-t">
        <h2 className="py-1 text-2xl">{props.field.label}</h2>
        {!isListItem && (
          <button className="hover:bg-front/5 px-3" onClick={() => setOpen(!open)}>
            <ChevronDownIcon className={cn('h-5 w-5', [open, 'rotate-180'])} />
          </button>
        )}
      </div>
      <Markdown className="text-front/50 pb-1 text-sm">{props.field.description}</Markdown>
      <div
        className={cn(
          'space-y-4',
          [isListItem || open, 'h-auto', 'h-0 overflow-hidden border-t pt-0'],
          [!isListItem, 'border-l pl-4 pt-3', 'py-3'],
        )}
      >
        {Object.keys(props.field.fields).map((key) => {
          const field = props.field.fields[key] as IFields
          const name = props.name ? `${props.name}.${key}` : key
          return <RenderField {...props} key={key} name={name} field={{ ...field, label: field.label ?? key }} />
        })}
      </div>
    </div>
  )
}
