import {
  CollectionReference,
  DocumentReference,
  Firestore,
  getDoc,
  onSnapshot,
  FirestoreError,
  QueryConstraint,
  getDocs,
  DocumentSnapshot,
  QuerySnapshot,
  query,
  Query,
  FirestoreErrorCode,
} from '@firebase/firestore'
import { createContext, useContext, useEffect } from 'react'
import type { SWRConfiguration } from 'swr/_internal'
import { FirebaseError } from '@firebase/app'

import useSWR, { useSWRConfig } from 'swr'
import { toast } from '@fiar/workbench'

const FirestoreContext = createContext<null | Firestore>(null)
export const FirestoreProvider = FirestoreContext.Provider
export const useFirestore = () => {
  const firestore = useContext(FirestoreContext)
  if (!firestore) throw new Error(`Missing firestore provider`)
  return firestore
}

export const useDocumentData = <T extends Record<string, any>>(
  ref: DocumentReference<T, T>,
  config?: SWRConfiguration<DocumentSnapshot<T, T>, FirestoreError> & { once?: boolean },
) => {
  const data = useSWR<DocumentSnapshot<T, T>, FirestoreError>(ref.path, () => getDoc(ref), config)
  useEffect(() => {
    if (config?.once) return
    return onSnapshot(ref, { next: (snap) => data.mutate(snap, { revalidate: false, populateCache: true }) })
  }, [ref.path, config?.once])

  return data
}

export const useCollectionData = <T extends Record<string, any>>(
  ref: CollectionReference<T, T>,
  config?: SWRConfiguration<QuerySnapshot<T, T>, FirestoreError> & {
    subscribe?: boolean
    constraints?: QueryConstraint[]
  },
) => {
  const qry = query(ref, ...(config?.constraints ?? []))
  const key = queryCacheKey(qry)
  const swr = useSWRConfig()

  const data = useSWR<QuerySnapshot<T, T>, FirestoreError>(
    key,
    () =>
      getDocs(qry).then((x) => {
        x.docs.forEach((y) => swr.mutate(y.ref.path, y, { revalidate: false, populateCache: true }))
        return x
      }),
    config,
  )

  useEffect(() => {
    if (config?.subscribe === false) return
    return onSnapshot(qry, {
      next: (snap) => data.mutate(snap, { revalidate: false, populateCache: true }),
    })
  }, [ref.path, config?.subscribe, key])

  return data
}

const queryCacheKey = (query: Query<any, any>) => {
  if (!query) return undefined
  const colRef = (query as any)['_query']['path']['segments'].join('')
  if (query?.type === 'collection') return `${colRef}`

  const startAt = ((query as any)?.['_query']?.['startAt']?.position || [])?.map((x: any) => x.referenceValue).join('')
  const limit = (query as any)?.['_query']?.['limit']

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
  return `${colRef}${limit || ''}${startAt || ''}${filtesr ? `-${filtesr}` : ''}${orders ? `-${orders}` : ''}`
}

export const toasty = (error: FirebaseError) => {
  const message = errorMessages[error.code as FirestoreErrorCode]
  if (!message) return null
  return toast.error(error.message)
}

const errorMessages: Record<FirestoreErrorCode, string> = {
  cancelled: 'cancelled',
  unknown: 'unknown',
  'invalid-argument': 'invalid-argument',
  'deadline-exceeded': 'deadline-exceeded',
  'not-found': 'not-found',
  'already-exists': 'already-exists',
  'permission-denied': 'Permission denied',
  'resource-exhausted': 'resource-exhausted',
  'failed-precondition': 'failed-precondition',
  aborted: 'aborted',
  'out-of-range': 'out-of-range',
  unimplemented: 'unimplemented',
  internal: 'internal',
  unavailable: 'unavailable',
  'data-loss': 'data-loss',
  unauthenticated: 'unauthenticated',
}
