import { FiarApp, FiarAppStore, FiarComponents } from '@fiar/core'
import { createStore } from 'zustand'

import { fiarWorkbench, WorkbenchConfig } from '@fiar/workbench'
import { fiarContent, ContentConfig } from '@fiar/content'
import { fiarAssets, AssetsConfig } from '@fiar/assets'
import { fiarAuth, AuthConfig } from '@fiar/auth'

export * from './types'

export type FiarConfig = Partial<WorkbenchConfig> &
  Partial<AssetsConfig> &
  Partial<AuthConfig> & { components?: FiarComponents } & Partial<ContentConfig>
export const createFiar = (config: FiarConfig) => {
  const store: FiarAppStore = createStore(
    (): FiarApp => ({
      pages: [],
      providers: [],
      components: config.components || {},
      render: () => null,
    }),
  )
  if (config.storage) {
    fiarAssets({ storage: config.storage, storagePrefix: config.storagePrefix || 'fiar' })(store)
  }
  if (config.auth && config.providers) {
    fiarAuth({ auth: config.auth, providers: config.providers, functions: config.functions, signin: config.signin })(
      store,
    )
  }
  if (config.content) {
    if (!config.firestore) throw new Error(`Requires firestore client to user content`)
    fiarContent({
      content: config.content,
      firestore: config.firestore,
      contentPrefix: config.contentPrefix || 'fiar',
      user:
        config.user ||
        (() => {
          const user = config.auth?.currentUser
          if (!user?.uid || !user.displayName || !user.email) return undefined
          return { uid: user.uid, displayName: user.displayName, email: user.email, photoURL: user.photoURL }
        }),
    })(store)
  }
  fiarWorkbench({ basename: config.basename, routing: config.routing })(store)
  return store.getState()
}
