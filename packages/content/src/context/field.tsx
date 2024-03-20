import {
  Control,
  ControllerFieldState,
  FieldValues,
  UseControllerProps,
  UseFormProps,
  UseFormStateReturn,
  FormProvider as _FormProvider,
  useForm as _useForm,
  useFormContext as _useFormContext,
  useController as _useController,
  useFormState as _useFormState,
  get as _get,
  FormProviderProps,
} from 'react-hook-form'
import { createContext, useContext } from 'react'

import { UseExtension } from '@fiar/workbench/extensions'
import { InferSchemaType } from '@fiar/schema'

import { IField, IFields } from '../schema/index.js'

const FieldContext = createContext<{ name: string; schema: IField; parent?: IField | undefined } | null>(null)
export const FieldProvider = FieldContext.Provider
export const useField = <F extends IField>() => {
  const m = useContext(FieldContext)
  if (!m) throw new Error(`Missing Field Provider`)
  return m as { name: string; schema: F; parent?: IField }
}

export interface FormContext {
  schema: { fields: Record<string, IFields> }
}

export const useForm = <TFieldValues extends FieldValues = FieldValues>(
  props: UseFormProps<TFieldValues, FormContext> & { context: FormContext },
) => _useForm(props)

export const FormProvider: <
  TFieldValues extends FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
>(
  props: FormProviderProps<TFieldValues, TContext, TTransformedValues>,
) => React.JSX.Element = _FormProvider

export const useFormContext = <
  TFieldValues extends FieldValues,
  TransformedValues extends FieldValues = TFieldValues,
>() => _useFormContext<TFieldValues, FormContext, TransformedValues>()

export const useController = _useController
export const useFormState = _useFormState
export const get = _get

export type UserFieldForm<F extends IField> = {
  name: string
  schema: F
  parent?: IField
  control: Control
  error?: string
}
export const useFieldForm = <F extends IField>(): UserFieldForm<F> => {
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
  if (err.type === 'required') return `Required`
  return 'Invalid'
}

export const FormField = () => {
  const { schema: field } = useField()
  const extension = field.components?.form || `field/${field.type}/form`
  return (
    <UseExtension
      extension={extension}
      props={{}}
      fallback={
        <p className="text-front/60 text-sm">
          Missing component <span className="text-error">{field.components?.form}</span>
        </p>
      }
    />
  )
}

const FieldValueContext = createContext(null)
export const FieldValueProvider = FieldValueContext.Provider
export const useFieldPreview = <F extends IField>() => {
  const value = useContext(FieldValueContext)
  const field = useField<F>()
  return { ...field, value } as any as { value: InferSchemaType<F> }
}

export const FieldPreview = (props: { schema: IFields; value: any; name: string }) => {
  const extension = props.schema.components?.preview || `field/${props.schema.type}/preview`
  return (
    <FieldValueProvider value={props.value}>
      <FieldProvider value={props}>
        <UseExtension extension={extension} props={{}} fallback={null} />
      </FieldProvider>
    </FieldValueProvider>
  )
}

export const Fields = (props: { fields: Record<string, IFields>; name: string; parent?: IField }) => {
  return (
    <>
      {Object.keys(props.fields).map((key) => {
        const schema = props.fields[key] as IFields
        return (
          <FieldProvider key={key} value={{ schema, name: `${props.name}.${key}`, parent: props.parent }}>
            <FormField />
          </FieldProvider>
        )
      })}
    </>
  )
}
