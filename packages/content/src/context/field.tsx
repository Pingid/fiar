import {
  Control,
  ControllerFieldState,
  FieldValues,
  UseControllerProps,
  UseFormProps,
  UseFormStateReturn,
  FormProviderProps,
  RegisterOptions,
  UseFormRegisterReturn,
  FormProvider as _FormProvider,
  useForm as _useForm,
  useFormContext as _useFormContext,
  useController as _useController,
  useFormState as _useFormState,
  get as _get,
  set as _set,
} from 'react-hook-form'
import { createContext, useContext, useMemo } from 'react'
import { DocumentReference } from '@firebase/firestore'
import { InferSchemaType } from '@fiar/schema'
import { create } from 'zustand'

import { IFieldRef, IFields } from '../schema/index.js'
import { DocumentHook } from './hooks.js'

type FieldContext = { name: string; schema: IFields; parent?: IFields | undefined }
const FieldContext = createContext<{ name: string; schema: IFields; parent?: IFields | undefined } | null>(null)
export const FieldProvider = (props: { value: FieldContext; children: React.ReactNode }) => {
  return (
    <FieldContext.Provider
      value={useMemo(() => props.value, [props.value.schema, props.value.parent, props.value.name])}
    >
      {props.children}
    </FieldContext.Provider>
  )
}

export const useField = <F extends IFields>() => {
  const m = useContext(FieldContext)
  if (!m) throw new Error(`Missing Field Provider`)
  return m as { name: string; schema: F; parent?: IFields }
}

/* ------------------------- React Hook Form Aliases ------------------------ */
export type FormContext = { schema: { fields: Record<string, IFields> } }
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
export const set = _set

/* ---------------------------- Form Custom Hooks --------------------------- */
export type UseFieldForm<F extends IFields> = {
  name: string
  schema: F
  parent?: IFields
  control: Control
  register: (
    options?: RegisterOptions<{ data: InferSchemaType<F> } & FieldValues, 'data'>,
  ) => UseFormRegisterReturn<string>
  error?: string
}
export const useFieldForm = <F extends IFields>(): UseFieldForm<F> => {
  const field = useField()
  const form = useFormContext()
  const error = useFieldError()

  return {
    ...field,
    control: form.control,
    error,
    register: (options: any) => {
      if (typeof field.schema.initialValue !== 'undefined') {
        set(form.control._defaultValues, field.name, field.schema.initialValue)
      }
      return form.control.register(field.name, { ...field.schema, required: !field.schema.optional, ...options })
    },
  } as any
}

type UseFieldControllerReturn<F extends IFields> = {
  field: {
    onChange: (...event: any[]) => void
    onBlur: () => void
    value: F extends IFieldRef ? DocumentReference : InferSchemaType<F>
    disabled?: boolean
    name: string
    ref: (instance: any) => void
  }
  formState: UseFormStateReturn<any>
  fieldState: ControllerFieldState
}

export const useFormFieldControl = <F extends IFields>(
  props?: Omit<UseControllerProps, 'control' | 'name'>,
): UseFieldControllerReturn<F> => {
  const form = useFormContext()
  const field = useField()
  return useController({
    ...field.schema,
    ...(props as {}),
    control: form.control,
    name: field.name as 'name',
    rules: { required: !field.schema.optional, ...(props as any)?.rules },
  }) as any
}

export const useFieldError = () => {
  const state = useFormState()
  const err = get(state.errors, useField().name)
  if (!err) return undefined
  if (err.message) return err.message
  if (err.type === 'required') return `Required`
  return 'Invalid'
}

const FieldValueContext = createContext(null)
export const FieldValueProvider = FieldValueContext.Provider
export const useFieldPreview = <F extends IFields>() => {
  const value = useContext(FieldValueContext)
  const field = useField<F>()
  return { ...field, value } as any as { value: InferSchemaType<F>; name: string; schema: F; parent?: IFields }
}

/* --------------------------- Component Registry --------------------------- */
type FieldState = { hook?: DocumentHook; form?: () => React.ReactNode; preview?: () => React.ReactNode }
type FieldStoreState = Record<string, FieldState>
export const useFieldsStore = create<FieldStoreState>(() => ({}))

export const registerField = (key: string, state: FieldState) => useFieldsStore.setState({ [key]: state })

export const FormField = () => {
  const field = useField()
  const key = field.schema.component || field.schema.type
  const Form = useFieldsStore((x) => (key ? x[key]?.form : undefined))
  if (!Form) return null
  return <Form />
}

export const PreviewField = (props: { schema: IFields; value: any; name: string }) => {
  const key = props.schema.component || props.schema.type
  const Preview = useFieldsStore((x) => (key ? x[key]?.preview : undefined))
  if (!Preview) return null
  return (
    <FieldValueProvider value={props.value}>
      <FieldProvider value={props}>
        <Preview />
      </FieldProvider>
    </FieldValueProvider>
  )
}

export const FormFields = (props: { fields: Record<string, IFields>; name: string; parent?: IFields }) => {
  return Object.keys(props.fields).map((key) => {
    const schema = props.fields[key] as IFields
    return (
      <FieldProvider key={key} value={{ schema, name: `${props.name}.${key}`, parent: props.parent }}>
        <FormField />
      </FieldProvider>
    )
  })
}
