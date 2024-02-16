import { DocumentReference, Firestore, deleteField, doc } from '@firebase/firestore'

export const handleUpdateValues = (firestore: Firestore, x: any): any => {
  if (x instanceof IntermediateDocumentReference) return x.ref(firestore)
  if (typeof x === 'undefined') return deleteField()
  if (Array.isArray(x)) return x.map((x) => handleUpdateValues(firestore, x))
  if (typeof x === null || typeof x === 'function') return x
  if (typeof x === 'object') {
    return Object.fromEntries(Object.entries(x).map((y) => [y[0], handleUpdateValues(firestore, y[1])]))
  }
  return x
}

export const handleCreateValues = (firestore: Firestore, x: any): any => {
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

export const handleRecieveValues = (x: any): any => {
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
