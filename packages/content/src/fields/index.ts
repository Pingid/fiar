import { FieldError, UseFormRegister, Control } from 'react-hook-form'
import { useEffect } from 'react'

import { Extensions, useExtensionsStore } from '@fiar/workbench/extensions'
import { type IFields } from '../schema/index.js'

export * from 'react-hook-form'

export type FieldComponent<T extends IFields, D extends Record<string, any> = Record<string, any>> = (props: {
  field: T
  parent?: IFields
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

export const Field = <K extends keyof Extensions>(props: {
  type: K
  children: (props: Extensions[K]) => React.ReactNode
}) => {
  const store = useExtensionsStore()
  useEffect(() => {
    const original = store.getState().extensions[props.type]
    store.setState({ [props.type]: props.children })
    return () => store.setState({ [props.type]: original })
  })
  return null
}
