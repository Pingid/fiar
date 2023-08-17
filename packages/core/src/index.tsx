import { createStore } from 'zustand'

import { FiarApp, FiarPlugin, FiarComponents } from './types'

export * from './types'

export const createFiar = (p: { plugins: FiarPlugin[]; components: FiarComponents }) => {
  const store = createStore<FiarApp>((set) => ({
    ...p,
    components: { ...p.components },
    addComponents: (comp) => set((x) => ({ components: { ...x.components, ...comp } })),
    Dashboard: () => null,
    setDashboard: (Dashboard) => set({ Dashboard }),
    render: () => null,
    setRender: (render) => set({ render }),
  }))
  p.plugins.forEach((plugin) => plugin(store.getState(), store))
  return store.getState()
}
