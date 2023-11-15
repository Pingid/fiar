import { StoreApi } from 'zustand'
import React from 'react'

import { ContentDocumentProvider, useDocument } from '../content/index.js'
import { createDocumentStore, DocumentStoreState } from './store.js'
import { createHook } from '../../../util/zustand/react.js'
import { useContentVersion } from '../../version/index.js'
import { useConfig } from '../../config/index.js'

const DocumentDataContext = React.createContext<ReturnType<typeof createDocumentStore> | null>(null)
export const useDocumentDataStore = (): StoreApi<DocumentStoreState> | null => React.useContext(DocumentDataContext)
export const useDocumentData = createHook(DocumentDataContext)
export const DocumentDataProvider = (p: { children: React.ReactNode }): JSX.Element => {
  const version = useContentVersion()
  const doc = useDocument(true)
  const config = useConfig()
  if (!doc) return <>{p.children}</>
  const store = createDocumentStore({ version, doc })
  return (
    <DocumentDataContext.Provider value={store}>
      <ContentDocumentProvider
        value={{
          ...doc,
          actions: {
            ...doc?.actions,
            publish: () =>
              Promise.resolve(
                store
                  .getState()
                  .handler({ ...config, ...doc }, { type: 'publish', value: store.getState().data, valid: true }),
              ).then(() => doc.publish()),
          },
        }}
      >
        {p.children}
      </ContentDocumentProvider>
    </DocumentDataContext.Provider>
  )
}
