import { CollectionReference, DocumentReference } from '@firebase/firestore'
import { useRef, createContext, useContext, useEffect } from 'react'
import { IContentModel } from '../schema/index.js'

export type DocumentHookEvent<T extends Record<string, any> = Record<string, any>> =
  | { model: IContentModel; ref: DocumentReference<T, T>; data: T; type: 'update' }
  | { model: IContentModel; ref: CollectionReference<T, T>; data: T; type: 'add' }
  | { model: IContentModel; ref: DocumentReference<T, T>; data: T; type: 'set' }
  | { model: IContentModel; ref: DocumentReference<T, T>; data?: undefined; type: 'delete' }

export type DocumentHook<T extends Record<string, any> = Record<string, any>> = (
  event: DocumentHookEvent<T>,
) => DocumentHookEvent<T>

type DocumentHooksContext = React.MutableRefObject<DocumentHook<Record<string, any>>[]>
const DocumentHooksContext = createContext<DocumentHooksContext>({ current: [] })
export const DocumentHooksProvider = (props: { children: React.ReactNode }) => (
  <DocumentHooksContext.Provider value={useRef([])}>{props.children}</DocumentHooksContext.Provider>
)

export const useDocumentHook = <T extends Record<string, any>>(cb: DocumentHook<T>) => {
  const ctx = useContext(DocumentHooksContext)
  const handler = useRef<DocumentHook<T>>(cb)
  useEffect(() => void (handler.current = cb))
  useEffect(() => {
    const _handler: DocumentHook<any> = (...args) => handler.current(...args)
    ctx.current = [...ctx.current, _handler]
    return () => {
      ctx.current = ctx.current.filter((x) => x !== _handler)
    }
  }, [])
}

export const useHooksHandler = () => {
  const ctx = useContext(DocumentHooksContext)
  return <D extends DocumentHookEvent>(event: D) =>
    ctx.current.reduce((prev, next) => prev.then((data) => next(data) as any), Promise.resolve(event)) as Promise<D>
}
