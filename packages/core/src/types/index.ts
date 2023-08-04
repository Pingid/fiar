import type { StoreApi } from 'zustand'

export interface FiarComponents {}

export interface FiarApp {
  components: FiarComponents
  render: (node: HTMLElement) => void
}

export type FiarAppStore = StoreApi<FiarApp>

export type FiarPlugin = (store: FiarAppStore) => FiarAppStore
