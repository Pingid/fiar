import {
  CollectionReference,
  DocumentReference,
  Firestore,
  doc,
  collection,
  getDoc,
  onSnapshot,
  FirestoreError,
  QueryConstraint,
  getDocs,
  DocumentSnapshot,
  QuerySnapshot,
  query,
  Query,
} from '@firebase/firestore'
import { createContext, useContext, useEffect } from 'react'
import type { SWRConfiguration } from 'swr/_internal'
import useSWR, { useSWRConfig } from 'swr'

export const getDocumentRef = <D extends { infer: Record<string, any>; path: string }>(
  firestore: Firestore,
  document: D,
) => doc(firestore, document.path) as DocumentReference<D['infer'], D['infer']>

export const getCollectionRef = <D extends { infer: Record<string, any>; path: string }>(
  firestore: Firestore,
  document: D,
) => collection(firestore, document.path) as CollectionReference<D['infer'], D['infer']>

const FirestoreContext = createContext<null | Firestore>(null)
export const FirestoreProvider = FirestoreContext.Provider
export const useFirestore = () => {
  const firestore = useContext(FirestoreContext)
  if (!firestore) throw new Error(`Missing firestore provider`)
  return firestore
}

export const useDocumentRef = <D extends { infer: Record<string, any>; path: string }>(doc: D) =>
  getDocumentRef(useFirestore(), doc)
export const useCollectionRef = <D extends { infer: Record<string, any>; path: string }>(col: D) =>
  getCollectionRef(useFirestore(), col)

export const useDocumentData = <T extends Record<string, any>>(
  ref: DocumentReference<T, T>,
  config?: SWRConfiguration<DocumentSnapshot<T, T>, FirestoreError> & { once?: boolean },
) => {
  const data = useSWR<DocumentSnapshot<T, T>, FirestoreError>(ref.path, () => getDoc(ref), config)
  useEffect(() => {
    if (config?.once) return
    return onSnapshot(ref, {
      next: (snap) => data.mutate(snap, { revalidate: false, populateCache: true }),
    })
  }, [ref.path, config?.once])

  return data
}

export const useCollectionData = <T extends Record<string, any>>(
  ref: CollectionReference<T, T>,
  config?: SWRConfiguration<QuerySnapshot<T, T>, FirestoreError> & {
    once?: boolean
    constraints?: QueryConstraint[]
  },
) => {
  const qry = query(ref, ...(config?.constraints ?? []))
  const swr = useSWRConfig()
  const data = useSWR<QuerySnapshot<T, T>, FirestoreError>(
    queryCacheKey(qry),
    () =>
      getDocs(qry).then((x) => {
        x.docs.map((y) => swr.mutate(y.ref.path, y, { revalidate: false, populateCache: true }))
        return x
      }),
    config,
  )

  useEffect(() => {
    if (config?.once) return
    return onSnapshot(ref, {
      next: (snap) => data.mutate(snap, { revalidate: false, populateCache: true }),
    })
  }, [ref.path, config?.once])

  return data
}

const queryCacheKey = (query: Query<any, any>) => {
  if (!query) return undefined
  const colRef = (query as any)['_query']['path']['segments'].join('')
  if (query?.type === 'collection') return `${colRef}`
  const filtesr = (query as any)['_query']['filters']
    .map((x: any) => {
      return `${x.field.segments.join('.')}${x.op}${x.value.stringValue}`
    })
    .join('&')
  const orders = (query as any)['_query']['explicitOrderBy']
    .map((x: any) => {
      return `${x.field.segments.join('.')}${x.dir}`
    })
    .join('&')
  return `${colRef}${filtesr ? `-${filtesr}` : ''}${orders ? `-${orders}` : ''}`
}
