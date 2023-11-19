import { FieldError, Controller, UseFormRegister, Control } from 'react-hook-form'
import { Components, useComponentsStore } from '@fiar/workbench'
import { useEffect } from 'react'

import { type IFields } from '../../schema/index.js'

export type FieldComponent<T extends IFields, D extends Record<string, any> = Record<string, any>> = (props: {
  field: T
  control: Control<D, any>
  register: UseFormRegister<D>
  name: string
}) => React.ReactNode

export const fieldError = (err?: FieldError) => {
  if (!err) return undefined
  if (err.message) return err.message
  if (err.type === 'required') return `Required value`
  return 'Invalid'
}

export const Field = <K extends keyof Components>(props: {
  type: K
  children: (props: Components[K]) => React.ReactNode
}) => {
  const store = useComponentsStore()
  useEffect(() => {
    const original = store.getState()[props.type]
    ;(props.children as any).displayName = props.type
    store.setState({ [props.type]: props.children })
    return () => store.setState({ [props.type]: original })
  })
  return null
}

export const FieldController = Controller

export const memoField = <T extends FieldComponent<any>>(field: T) => field

// memo(field, (a, b) => {
//   const dirty = a.form.formState.isDirty === b.form.formState.isDirty
//   const error = a.form.formState.errors[a.name] === b.form.formState.errors[a.name]
//   console.log(a.form.formState.errors[a.name], b.form.formState.errors[b.name])
//   return true
// }) as any as T
