import { DocumentReference, FieldValue, Firestore, Timestamp, deleteField, doc } from '@firebase/firestore'

export const toFirestore = (firestore: Firestore, x: any, deleteUndefined: boolean, root = true): any => {
  if (x instanceof IntermediateDocumentReference) return x.ref(firestore)
  if (x instanceof Timestamp) return x
  if (x instanceof FieldValue) return x
  if (x === null || typeof x === 'function') return x
  if (Array.isArray(x)) {
    return x
      .filter((value) => typeof value !== 'undefined')
      .map((x) => toFirestore(firestore, x, deleteUndefined, false))
  }
  if (typeof x === 'object') {
    return Object.fromEntries(
      Object.entries(x)
        .map(([key, value]) => {
          if (typeof value === 'undefined' && deleteUndefined && root) return [key, deleteField()]
          if (typeof value === 'undefined') return [key, undefined]
          return [key, toFirestore(firestore, value, deleteUndefined, false)]
        })
        .filter(([_k, value]) => typeof value !== 'undefined'),
    )
  }
  return x
}

export const fromFirestore = (x: any): any => {
  if (x instanceof DocumentReference) return new IntermediateDocumentReference(x)
  if (x instanceof Timestamp) return x
  if (x instanceof FieldValue) return x
  if (Array.isArray(x)) return x.map((x) => fromFirestore(x))
  if (x === null || typeof x === 'function') return x
  if (typeof x === 'object') {
    return Object.fromEntries(Object.entries(x).map((y) => [y[0], fromFirestore(y[1])]))
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
