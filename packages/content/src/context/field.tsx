import { Control, ControllerFieldState, UseControllerProps, UseFormStateReturn } from 'react-hook-form'
import { createContext, useContext } from 'react'

import { UseExtension } from '@fiar/workbench/extensions'
import { InferSchemaType } from '@fiar/schema'

import { get, useController, useFormContext, useFormState } from './form.js'
import { IField, IFields } from '../schema/index.js'

const FieldContext = createContext<{ name: string; schema: IField; parent?: IField } | null>(null)
export const FieldProvider = FieldContext.Provider
export const useField = () => {
  const m = useContext(FieldContext)
  if (!m) throw new Error(`Missing Field Provider`)
  return m
}

type UseFormFieldReturn<F extends IField> = {
  name: string
  schema: F
  parent?: IField
  control: Control
  error?: string
}
export const useFormField = <F extends IField>(): UseFormFieldReturn<F> => {
  const field = useField()
  const form = useFormContext()
  const error = useFieldError()

  return { ...field, control: form.control, error } as any
}

type UseFieldControllerReturn<F extends IField> = {
  field: {
    onChange: (...event: any[]) => void
    onBlur: () => void
    value: InferSchemaType<F>
    disabled?: boolean
    name: string
    ref: (instance: any) => void
  }
  formState: UseFormStateReturn<any>
  fieldState: ControllerFieldState
}

export const useFormFieldControl = <F extends IField>(
  props?: Omit<UseControllerProps, 'control' | 'name'>,
): UseFieldControllerReturn<F> => {
  const form = useFormContext()
  return useController({ control: form.control, name: useField().name as 'name', ...(props as {}) }) as any
}

export const useFieldError = () => {
  const state = useFormState()
  const err = get(state.errors, useField().name)
  if (!err) return undefined
  if (err.message) return err.message
  if (err.type === 'required') return `Required value`
  return 'Invalid'
}

export const FormField = () => {
  const { schema: field } = useField()
  const extension = `field:form:${field.component || field.type}`
  return (
    <UseExtension
      extension={extension}
      props={{}}
      fallback={
        <p className="text-front/60 text-sm">
          Missing component <span className="text-error">{field.component}</span>
        </p>
      }
    />
  )
}

export const FieldPreview = (props: { field: IFields; value: any; name: string }) => {
  const extension = `field:preview:${props.field.component || props.field.type}`
  return <UseExtension extension={extension} props={{ ...props, parent: props.field }} fallback={null} />
}

export type FieldPreview<T extends IFields = IFields> = (props: {
  field: T
  value: InferSchemaType<T>
  name: string
}) => React.ReactNode
