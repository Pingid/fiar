import { Control, useController } from 'react-hook-form'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import { cn } from 'mcn'

import { Markdown, Sortable, SortableItem } from '@fiar/components'

import { FieldProvider, useFormField } from '../../context/field.js'
import { FieldPreview, FormField } from '../../context/field.js'
import { IFieldList, IFields } from '../../schema/index.js'

export const PreviewFieldList: FieldPreview<IFieldList> = (props) => {
  return JSON.stringify(props.value)
}

export const FormFieldList = () => {
  const field = useFormField<IFieldList>()
  const control = useFieldArray(field)

  return (
    <div className="space-y-2">
      <div className="flex w-full justify-between rounded-t">
        <h2 className="py-1 text-2xl">{field.schema.label}</h2>
      </div>
      <Markdown className="text-front/50 pb-1 text-sm">{field.schema.description}</Markdown>
      <div className={cn('space-y-3')}>
        <Sortable
          items={control.value}
          onSort={(from, to) => {
            return control.move(from, to)
          }}
        >
          {control.value.map((x, i) => (
            <SortableItem
              key={x.id}
              id={x.id}
              label={`${field.schema.label?.replace(/s$/, '') ?? ''} ${i + 1}`}
              onRemove={() => control.remove(i)}
            >
              <FieldProvider value={{ schema: field.schema.of, name: `${field.name}.${i}`, parent: field.schema }}>
                <FormField />
              </FieldProvider>
            </SortableItem>
          ))}
        </Sortable>
        <button
          type="button"
          className="bg-frame hover:border-active hover:text-active flex w-full items-center justify-center rounded border py-1"
          onClick={() => control.add(init(field.schema.of))}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

const useFieldArray = (props: { control: Control; name: string }) => {
  const control = useController({ ...props, defaultValue: [] })
  const value = Array.isArray(control.field.value) ? control.field.value : []
  const [items, setItems] = useState<{ id: number }[]>(value.map((_, i) => ({ id: Date.now() + i })))
  const getValue = () => props.control._getFieldArray(props.name)
  const skip = useRef(false)

  useEffect(() => {
    if (skip.current) {
      skip.current = false
      return
    }
    setItems((x) => {
      const values = getValue()
      if (x.length > values.length) return x
      return values.map((_, i) => ({ id: Date.now() + i }))
    })
  }, [value])

  return {
    ...control,
    value: items,
    add: (value: any) => setItems((x) => [...x, { value, id: Date.now() }]),
    remove: (index: number) => {
      setItems((x) => {
        const next = x.filter((_, i) => i !== index)
        skip.current = true
        control.field.onChange(getValue().filter((_, i) => i !== index))
        return next
      })
    },
    move: (from: number, to: number) => {
      setItems((x) => {
        const next = move(x, from, to)
        skip.current = true
        control.field.onChange(move(getValue(), from, to))
        return next
      })
    },
  }
}

const move = <A extends ReadonlyArray<any>>(array: A, from: number, to: number): A =>
  array.reduce(
    (prev, current, idx, self) => {
      if (from === to) prev.push(current)
      if (idx === from) return prev
      if (from < to) prev.push(current)
      if (idx === to) prev.push(self[from])
      if (from > to) prev.push(current)
      return prev
    },
    [] as any as A,
  )

const init = (field: IFields) => {
  if (field.type === 'map') return {}
  if (field.type === 'list') return []
  if (field.type === 'ref') return {}
  if (field.initialValue) return field.initialValue
  if (field.type === 'string') return ''
  if (field.type === 'number') return 0
  if (field.type === 'bool') return false
  return null
}
