import _React from 'react'

import { provideStore } from '../../../util/zustand/react.js'
import { useGetDocument } from '../../document/content/index.js'
import { createCollectionStore } from '../store/index.js'
import { useCollection } from '../content/index.js'

export const [_CollectionDocumentProvider, _useCollectionDocuments] = provideStore(() => {
  const col = useCollection()!
  const get = useGetDocument()
  return createCollectionStore({
    add: () => col.add(),
    delete: (id) => get(col.document(id)).remove(),
    get: (...constraints) => col.get('draft', constraints),
    on: (constraints, obs) => col.on('draft', constraints, obs),
  })
})

export const CollectionDataProvider = _CollectionDocumentProvider
export const useCollectionData = _useCollectionDocuments
