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
import { DocumentReference, getDoc, onSnapshot } from '@firebase/firestore'
import { useSWRConfig } from 'swr'
import { useEffect } from 'react'

import { fromFirestore } from '../util/firebase.js'
import { IContentModel } from '../schema/index.js'

export interface DocumentFormContext {
  model: IContentModel
  type: 'update' | 'set' | 'add'
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

export const useDocumentForm = <TFieldValues extends FieldValues = FieldValues>(
  props: UseFormProps<TFieldValues, DocumentFormContext> & { context: DocumentFormContext; ref: DocumentReference },
) => {
  const swr = useSWRConfig()
  const form = useForm({
    ...props,
    defaultValues: (): Promise<any> => {
      const cached = swr.cache.get(props.ref.path)
      if (!cached?.data) return getDoc(props.ref).then((x) => fromFirestore(x.data()))
      return fromFirestore(cached.data.data())
    },
  })

  useEffect(() => {
    return onSnapshot(props.ref, {
      next: (x) => form.reset(fromFirestore(fromFirestore(x.data())), { keepDirty: true, keepDirtyValues: true }),
    })
  }, [props.ref.path])

  return form
}

export const FormProvider = _FormProvider

export const useFormContext = <
  TFieldValues extends FieldValues,
  TransformedValues extends FieldValues = TFieldValues,
>() => _useFormContext<TFieldValues, DocumentFormContext, TransformedValues>()

export const useController = _useController
export const useFormState = _useFormState
export const get = _get
