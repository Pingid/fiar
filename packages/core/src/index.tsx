import { createStore } from 'zustand'

import { FiarApp, FiarAppStore } from './types'

export * from './types'

export const createFiar = (
  p: Omit<FiarApp, 'render'> & {
    plugins: ((fiar: FiarAppStore) => FiarAppStore)[]
  },
) => {
  const store = createStore<FiarApp>(() => ({ ...p, render: () => null }))
  p.plugins.forEach((plugin) => plugin(store))
  return store.getState()
}
