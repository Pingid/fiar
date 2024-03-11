import { addDoc, collection, deleteDoc, doc, setDoc, updateDoc } from '@firebase/firestore'
import useSWRMutation from 'swr/mutation'
import { useStore } from 'zustand'
import { useSWRConfig } from 'swr'

import { toast } from '@fiar/workbench'

import { useQuerySnapshot, useDocumentSnapshot, useFirestore } from './firestore.js'
import { DocumentHookEvent, useHooksHandler } from './hooks.js'
import { useQueryStore } from './query.js'
import { usePathRef } from './model.js'

const onError = (e: any) => toast(e instanceof Error ? e.message : JSON.stringify(e))

export const useCollectionData = () => {
  const constraints = useStore(useQueryStore(), (x) => x.constraints)
  const path = usePathRef()
  const fs = useFirestore()
  return useQuerySnapshot(collection(fs, path), { constraints })
}

export const useDocData = () => {
  const fs = useFirestore()
  const path = usePathRef()
  return useDocumentSnapshot(doc(fs, path))
}

export const useDocumentMutation = () => {
  const resolve = useHooksHandler()
  const swr = useSWRConfig()
  const revalidate = (path: string) => swr.mutate(path, (x: any) => x, { revalidate: true })

  return useSWRMutation(
    '_',
    (_, p: { arg: DocumentHookEvent }) => {
      return resolve(p.arg)
        .then((p): any => {
          if (p.type === 'set') return setDoc(p.ref, p.data)
          if (p.type === 'add') return addDoc(p.ref, p.data).then(() => revalidate(p.ref.path))
          if (p.type === 'update') {
            const prms = updateDoc(p.ref, p.data)
            return swr.mutate(p.ref, (x: any) => prms.then(() => x), { revalidate: true })
          }
          if (p.type === 'delete') return swr.mutate(p.ref, deleteDoc(p.ref))
        })
        .then(() => {})
    },
    { onError },
  )
}
