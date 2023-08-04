import _React from 'react'

import { provideStore } from '../../../util/zustand/react'
import { useGetDocument } from '../../document/content'
import { createCollectionStore } from '../store'
import { useCollection } from '../content'

export const [_CollectionDocumentProvider, _useCollectionDocuments] = provideStore(() => {
  const col = useCollection()!
  const get = useGetDocument()
  return createCollectionStore({
    add: () => col.add(),
    delete: (id) => get({ ref: `${col.ref}/${id}`, field: col.field, label: '' }).remove(),
    get: (...constraints) => col.get('draft', constraints),
    on: (constraints, obs) => col.on('draft', constraints, obs),
  })
})

export const CollectionDataProvider = _CollectionDocumentProvider
export const useCollectionData = _useCollectionDocuments
