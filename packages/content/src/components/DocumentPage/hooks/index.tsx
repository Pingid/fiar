import {
  DocumentReference,
  Firestore,
  addDoc,
  deleteDoc,
  deleteField,
  doc,
  setDoc,
  updateDoc,
} from '@firebase/firestore'
import { useForm } from 'react-hook-form'
import { useEffect } from 'react'

import { usePageStatusAsyncHandler } from '@fiar/workbench'

import {
  getCollectionRef,
  getDocumentRef,
  useDocumentData,
  useDocumentRef,
  useFirestore,
} from '../../../hooks/index.js'
import { IContentCollection, IContentDocument } from '../../../schema/index.js'

export const useCreateForm = (
  schema: IContentDocument<any, any> | IContentCollection<any, any>,
  onSaved: () => void,
) => {
  const handle = usePageStatusAsyncHandler(`${schema.path}-create-form`)
  const firestore = useFirestore()
  const form = useForm()

  const onPublish = form.handleSubmit((x) => {
    if (schema.nodeId === 'document') {
      return handle(setDoc(getDocumentRef(firestore, schema), handleCreateValues(firestore, x))).then(() => onSaved())
    }
    return handle(addDoc(getCollectionRef(firestore, schema), handleCreateValues(firestore, x))).then(() => onSaved())
  })

  return [form, onPublish] as const
}

export const useUpdateForm = (
  schema: IContentDocument<any, any> | IContentCollection<any, any>,
  path: string,
  onDone?: () => void,
) => {
  const ref = useDocumentRef({ ...schema, path: path })
  const handle = usePageStatusAsyncHandler(`${path}-update-form`)
  const data = useDocumentData(ref, { once: true })
  const firestore = useFirestore()

  const form = useForm({ criteriaMode: 'firstError', defaultValues: handleRecieveValues(data.data?.data()) })

  const onUpdate = form.handleSubmit((x) => {
    return handle(updateDoc(ref, handleUpdateValues(firestore, x)))
      .then(() => form.reset(handleRecieveValues(x)))
      .then(onDone)
  })

  const onDelete = () => handle(deleteDoc(ref))

  useEffect(() => {
    if (!data.data) return
    form.reset(handleRecieveValues(data.data.data()), { keepDirty: true, keepDirtyValues: true })
  }, [data.data])

  return [form, onUpdate, onDelete] as const
}

const handleUpdateValues = (firestore: Firestore, x: any): any => {
  if (x instanceof IntermediateDocumentReference) return x.ref(firestore)
  if (typeof x === 'undefined') return deleteField()
  if (Array.isArray(x)) return x.map((x) => handleUpdateValues(firestore, x))
  if (typeof x === null || typeof x === 'function') return x
  if (typeof x === 'object') {
    return Object.fromEntries(Object.entries(x).map((y) => [y[0], handleUpdateValues(firestore, y[1])]))
  }
  return x
}

const handleCreateValues = (firestore: Firestore, x: any): any => {
  if (x instanceof IntermediateDocumentReference) return x.ref(firestore)
  if (Array.isArray(x)) return x.map((x) => handleCreateValues(firestore, x))
  if (typeof x === null || typeof x === 'function') return x
  if (typeof x === 'object') {
    return Object.fromEntries(
      Object.entries(x)
        .filter((x) => typeof x[1] !== 'undefined')
        .map((y) => [y[0], handleCreateValues(firestore, y[1])]),
    )
  }
  return x
}

const handleRecieveValues = (x: any): any => {
  if (x instanceof DocumentReference) return new IntermediateDocumentReference(x)
  if (Array.isArray(x)) return x.map((x) => handleRecieveValues(x))
  if (typeof x === null || typeof x === 'function') return x
  if (typeof x === 'object') {
    return Object.fromEntries(Object.entries(x).map((y) => [y[0], handleRecieveValues(y[1])]))
  }
  return x
}

export class IntermediateDocumentReference {
  path: string
  id: string
  constructor(ref: DocumentReference) {
    this.path = ref.path
    this.id = ref.id
  }
  ref(firestore: Firestore) {
    return doc(firestore, this.path)
  }
}
