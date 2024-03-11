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
        .then((): any => {
          if (p.arg.type === 'set') return setDoc(p.arg.ref, p.arg.data)
          if (p.arg.type === 'add') return addDoc(p.arg.ref, p.arg.data).then(() => revalidate(p.arg.ref.path))
          if (p.arg.type === 'update') {
            const prms = updateDoc(p.arg.ref, p.arg.data)
            return swr.mutate(p.arg.ref, (x: any) => prms.then(() => x), { revalidate: true })
          }
          if (p.arg.type === 'delete') return swr.mutate(p.arg.ref, deleteDoc(p.arg.ref))
        })
        .then(() => {})
    },
    { onError },
  )
}
