import { memo, useEffect, useReducer, useRef } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import { Timestamp } from '@firebase/firestore'
import { cn } from 'mcn'

import { Sortable, SortableItem } from '@fiar/components'

import {
  FieldProvider,
  useFieldPreview,
  useFieldForm,
  UseFieldForm,
  useFormContext,
  registerField,
  get,
} from '../../context/field.js'
import { IFieldList, IFields } from '../../schema/index.js'
import { FormField } from '../../context/field.js'
import { Field } from '../../components/index.js'

export const PreviewFieldList = () => {
  const field = useFieldPreview<IFieldList>()
  return JSON.stringify(field.value)
}

const Item = memo(FormField)

export const FormFieldList = () => {
  const field = useFieldForm<IFieldList>()
  const control = useFieldList({ ...field })

  return (
    <Field {...field}>
      <div className={cn('space-y-3')}>
        <Sortable items={control.fields} onSort={(from, to) => control.move(from, to)}>
          {control.fields.map((x, i) => (
            <SortableItem
              key={x.id}
              id={x.id}
              label={`${field.schema.label?.replace(/s$/, '') ?? ''} ${i + 1}`}
              onRemove={() => control.remove(i)}
            >
              <FieldProvider value={{ schema: field.schema.of, name: `${field.name}.${i}`, parent: field.schema }}>
                <Item />
              </FieldProvider>
            </SortableItem>
          ))}
        </Sortable>
        <button
          type="button"
          className="bg-frame hover:border-active hover:text-active flex w-full items-center justify-center rounded border py-1"
          onClick={() => control.append(init(field.schema.of))}
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>
    </Field>
  )
}

registerField('list', { form: FormFieldList, preview: PreviewFieldList })

const useFieldList = (props: UseFieldForm<IFieldList>) => {
  const [_, rerender] = useReducer(() => ({}), {})
  const form = useFormContext()

  const r = form.register(props.name, {
    ...props.schema,
    validate: (x) => {
      if (!Array.isArray(x) && !props.schema.optional) return 'Required'
      return true
    },
  })

  useEffect(() => {
    if (!props.schema.optional && !Array.isArray(get(form.getValues(), props.name))) {
      form.setValue(props.name, [])
    }
    return () => form.unregister(props.name)
  }, [props.name])

  const read = () => form.control._getFieldArray(props.name)

  const write = (next: any[]) => {
    form.control._updateFieldArray(props.name, next, () => {}, {}, true, false)
    form.control._names.mount = new Set(
      [...form.control._names.mount.values()].filter((x) => !x.startsWith(props.name)),
    )
    rerender()
  }

  const ids = useRef(read().map((_, i) => ({ id: Date.now() + i })))

  return {
    ...r,
    fields: ids.current,
    append: (value: any) => {
      const next = [...read(), value]
      ids.current.push({ id: Date.now() + 1 })
      write(next)
    },
    remove: (index: number) => {
      const next = read().filter((_, i) => i !== index)
      ids.current = ids.current.filter((_, i) => i !== index)
      write(next)
    },
    move: (from: number, to: number) => {
      const next = move(read(), from, to)
      ids.current = move(ids.current, from, to)
      write(next)
    },
  }
}

const move = <A extends ReadonlyArray<any>>(array: A, from: number, to: number): A => {
  if (from < 0 || to < 0 || from > array.length || to > array.length) return array
  return array.reduce(
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
}

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
