import {
  Control,
  FieldValues,
  FormProvider,
  UseControllerReturn,
  UseFormProps,
  useController,
  useForm,
  useFormContext,
} from 'react-hook-form'
import { createContext, useContext, useEffect, useRef } from 'react'
import { IContentModel, IFields } from '../schema/index.js'
import { InferSchemaType } from '@fiar/schema'

export interface DocumentFormContext {
  model: IContentModel
  status: 'update' | 'create'
}

export type FieldComponent<T extends IFields = IFields> = (props: {
  field: T
  parent?: IFields
  control: Control<Record<string, any>, DocumentFormContext>
  name: string
}) => React.ReactNode

export const useDocumentForm = <TFieldValues extends FieldValues = FieldValues>(
  props: UseFormProps<TFieldValues, DocumentFormContext> & { context: DocumentFormContext },
) => useForm(props)

export const DocumentFormProvider = FormProvider

export const useDocumentFormContext = <
  TFieldValues extends FieldValues,
  TransformedValues extends FieldValues = TFieldValues,
>() => useFormContext<TFieldValues, DocumentFormContext, TransformedValues>()

// field: IFieldTimestamp;
//     parent?: IFields;
//     control: Control<Record<string, any>, DocumentFormContext>;
//     name: string;

// type K = IFields['']

export const useDocumentController = <
  P extends { field: IFields; name: string; control: Control<Record<string, any>, DocumentFormContext> },
>(
  props: P,
) =>
  useController(props as any) as any as InferSchemaType<P['field']> extends infer T
    ? UseControllerReturn<{ value: T }, any>
    : UseControllerReturn<Record<string, any>, string>

type DocumentFormHook<T extends Record<string, any> = Record<string, any>> = (x: T, type: 'set' | 'update' | 'add') => T
type DocumentHooksContext = React.MutableRefObject<DocumentFormHook<Record<string, any>>[]>
const DocumentHooksContext = createContext<DocumentHooksContext>({ current: [] })
export const useDocumentHooks = () => useRef<DocumentFormHook[]>([])

export const DocumentHooksProvider = (props: { children: React.ReactNode; value: DocumentHooksContext }) => (
  <DocumentHooksContext.Provider value={props.value}>{props.children}</DocumentHooksContext.Provider>
)

export const useDocumentHook = <T extends Record<string, any>>(cb: DocumentFormHook<T>) => {
  const ctx = useContext(DocumentHooksContext)
  const handler = useRef<DocumentFormHook<T>>(cb)
  useEffect(() => void (handler.current = cb))
  useEffect(() => {
    const _handler: DocumentFormHook<any> = (...args) => handler.current(...args)
    ctx.current = [...ctx.current, _handler]
    return () => {
      ctx.current = ctx.current.filter((x) => x !== _handler)
    }
  }, [])
}
