import { PlusIcon } from '@heroicons/react/24/outline'
import { useController } from 'react-hook-form'

import { RenderComponent } from '@fiar/workbench/v2'
import { Field, Reorder } from '@fiar/components'

import { fieldError, type FieldComponent } from '../../../field/index.js'
import { IFieldArray, IFields } from '../../../schema/index.js'

export const FieldArray: FieldComponent<IFieldArray<IFields>> = (props) => {
  const control = useController(props)
  const error = fieldError(control.fieldState.error)
  const value = Array.isArray(control.field.value) ? control.field.value : []

  return (
    <Field name={props.name} label={props.field.label} error={error} className="group/array ml-[var(--ml-left)]">
      <Reorder className="space-y-1">
        {value.map((_x, i) => (
          <Reorder.Item
            key={i}
            index={i}
            onReorder={(from, to) => control.field.onChange(move(value, from, to))}
            onRemove={() => control.field.onChange(value.filter((_, i2) => i !== i2))}
          >
            <div className="">
              <RenderComponent
                key={`${props.name}.${i}`}
                component={props.field.of.component}
                props={{ ...props, name: `${props.name}.${i}`, field: props.field.of }}
              >
                <p className="text-front/60 text-sm">
                  Missing component <span className="text-error">{props.field.of.component}</span>
                </p>
              </RenderComponent>
            </div>
          </Reorder.Item>
        ))}
      </Reorder>
      <button
        className="bg-front/5 hover:border-active hover:text-active flex w-full items-center justify-center rounded-sm border py-1"
        onClick={() => control.field.onChange([...value, init(props.field)])}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </Field>
  )
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
  if (field.type === 'struct') return {}
  if (field.type === 'array') return []
  if (field.type === 'ref') return {}
  if (field.initialValue) return field.initialValue
  if (field.type === 'string') return ''
  if (field.type === 'number') return 0
  if (field.type === 'boolean') return false
  return null
}
