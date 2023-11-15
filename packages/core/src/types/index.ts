import type { StoreApi } from 'zustand'

export interface FiarPlugins {}

export interface FiarComponents {}

export interface FiarApp {
  components: FiarComponents
  plugins: FiarPlugins
  addComponents: (components: Partial<FiarComponents>) => void
  Dashboard: () => null
  setDashboard: (dashboard: () => any) => void
  render: (node: HTMLElement) => void
  setRender: (render: (node: HTMLElement) => void) => void
}

export type FiarAppStore = StoreApi<FiarApp>

export type FiarPlugin = (state: FiarApp, store: FiarAppStore) => void
