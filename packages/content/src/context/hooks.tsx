import { CollectionReference, DocumentReference } from '@firebase/firestore'
import { useRef, createContext, useContext, useEffect } from 'react'
import { IContentModel } from '../schema/index.js'

// type LifeCycle<T extends Record<string, any> = Record<string, any>> = {
//   'before:update': { ref: DocumentReference<T, T>; data: T }
//   'after:update': { ref: DocumentReference<T, T>; data?: undefined }
//   'before:get': { ref: DocumentReference<T, T>; data?: undefined }
//   'after:get': { ref: DocumentReference<T, T>; data: T }
//   'before:list': { ref: CollectionReference<T, T>; data?: undefined }
//   'after:list': { ref: CollectionReference<T, T>; data: T[] }
//   'before:add': { ref: CollectionReference<T, T>; data: T }
//   'after:add': { ref: CollectionReference<T, T>; data?: undefined }
//   'before:set': { ref: DocumentReference<T, T>; data: T }
//   'after:set': { ref: DocumentReference<T, T>; data?: undefined }
//   'before:delete': { ref: DocumentReference<T, T>; data?: undefined }
//   'after:delete': { ref: DocumentReference<T, T>; data?: undefined }
// }

export type DocumentHookEvent<T extends Record<string, any> = Record<string, any>> =
  | { schema: IContentModel; ref: DocumentReference<T, T>; data: T; type: 'update' }
  | { schema: IContentModel; ref: CollectionReference<T, T>; data: T; type: 'add' }
  | { schema: IContentModel; ref: DocumentReference<T, T>; data: T; type: 'set' }
  | { schema: IContentModel; ref: DocumentReference<T, T>; data?: undefined; type: 'delete' }

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
