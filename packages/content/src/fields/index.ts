import { FieldError, UseFormRegister, Control } from 'react-hook-form'
export * from 'react-hook-form'

import { type IFields } from '../schema/index.js'

export type FieldComponent<T extends IFields = IFields> = (props: {
  field: T
  parent?: IFields
  control: Control<Record<string, any>, any>
  register: UseFormRegister<Record<string, any>>
  name: string
}) => React.ReactNode

export const fieldError = (err?: FieldError) => {
  if (!err) return undefined
  if (err.message) return err.message
  if (err.type === 'required') return `Required value`
  return 'Invalid'
}
