import {
  FieldError,
  FieldValues,
  FormProvider as _FormProvider,
  UseFormProps,
  useForm as _useForm,
  useFormContext as _useFormContext,
  useController as _useController,
  useFormState as _useFormState,
  get as _get,
} from 'react-hook-form'
import { createContext, useContext, useEffect, useRef } from 'react'

import { IContentModel } from '../schema/index.js'

export interface DocumentFormContext {
  model: IContentModel
  status: 'update' | 'create'
}

export const fieldError = (err?: FieldError) => {
  if (!err) return undefined
  if (err.message) return err.message
  if (err.type === 'required') return `Required value`
  return 'Invalid'
}

export const useForm = <TFieldValues extends FieldValues = FieldValues>(
  props: UseFormProps<TFieldValues, DocumentFormContext> & { context: DocumentFormContext },
) => _useForm(props)

export const FormProvider = _FormProvider

export const useFormContext = <
  TFieldValues extends FieldValues,
  TransformedValues extends FieldValues = TFieldValues,
>() => _useFormContext<TFieldValues, DocumentFormContext, TransformedValues>()

export const useController = _useController
export const useFormState = _useFormState
export const get = _get

type FormHook<T extends Record<string, any> = Record<string, any>> = (x: T, type: 'set' | 'update' | 'add') => T
type FormHooksContext = React.MutableRefObject<FormHook<Record<string, any>>[]>
const FormHooksContext = createContext<FormHooksContext>({ current: [] })
export const useFormHooks = () => useRef<FormHook[]>([])
export const FormHooksProvider = FormHooksContext.Provider

export const useFormHook = <T extends Record<string, any>>(cb: FormHook<T>) => {
  const ctx = useContext(FormHooksContext)
  const handler = useRef<FormHook<T>>(cb)
  useEffect(() => void (handler.current = cb))
  useEffect(() => {
    const _handler: FormHook<any> = (...args) => handler.current(...args)
    ctx.current = [...ctx.current, _handler]
    return () => {
      ctx.current = ctx.current.filter((x) => x !== _handler)
    }
  }, [])
}
