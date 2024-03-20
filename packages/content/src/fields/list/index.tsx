import { PlusIcon } from '@heroicons/react/24/outline'
import { useEffect, useRef, useState } from 'react'
import { Timestamp } from '@firebase/firestore'
import { cn } from 'mcn'

import { Field, Sortable, SortableItem } from '@fiar/components'

import { FieldProvider, useFieldPreview, useFieldForm, UserFieldForm, useController } from '../../context/field.js'
import { IFieldList, IFields } from '../../schema/index.js'
import { FormField } from '../../context/field.js'

export const PreviewFieldList = () => {
  const field = useFieldPreview<IFieldList>()
  return JSON.stringify(field.value)
}

export const FormFieldList = () => {
  const field = useFieldForm<IFieldList>()
  const control = useFieldArray(field)

  return (
    <Field name={field.name} label={field.schema.label} description={field.schema.description}>
      <div className={cn('space-y-3')}>
        <Sortable items={control.value} onSort={(from, to) => control.move(from, to)}>
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
    </Field>
  )
}

const useFieldArray = (props: UserFieldForm<IFieldList>) => {
  const control = useController(props)
  const value = Array.isArray(control.field.value) ? control.field.value : []
  const [items, setItems] = useState<{ id: number }[]>(value.map((_, i) => ({ id: Date.now() + i })))
  const getValue = () => props.control._getFieldArray(props.name)
  const skip = useRef(false)

  useEffect(() => {
    if (!Array.isArray(control.field.value) && !props.schema.optional) {
      control.field.onChange([])
    }
  }, [control.field.value, props.schema.optional])

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
      skip.current = true
      control.field.onChange(getValue().filter((_, i) => i !== index))
      setItems(items.filter((_, i) => i !== index))
    },
    move: (from: number, to: number) => {
      skip.current = true
      control.field.onChange(move(getValue(), from, to))
      setItems(move(items, from, to))
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
  if (field.type === 'timestamp') return Timestamp.now()
  return null
}
