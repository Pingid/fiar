import { createContext, useContext, useEffect, useLayoutEffect, useMemo } from 'react'
import { StoreApi, createStore, useStore } from 'zustand'

export interface Extensions extends Record<string, any> {}

type ExtensionsStoreState = {
  parent: ExtensionsStoreState | undefined
  extensions: Extensions
  extend: (props?: Partial<Extensions>) => void
  use: <K extends keyof Extensions>(key: K) => Extensions[K]
}
const createExtensionStore = (parent?: StoreApi<ExtensionsStoreState>) =>
  createStore<ExtensionsStoreState>((set, get) => {
    if (parent) parent.subscribe((parent) => set({ parent }))
    return {
      parent: parent?.getState(),
      extensions: {},
      extend: (ext) => ext && set((x) => ({ extensions: { ...x.extensions, ...ext } })),
      use: (key) => {
        const state = get()
        if (state?.extensions[key]) return get()?.extensions[key]
        if (state.parent) return state.parent.use(key)
        return undefined
      },
    }
  })

const defaultStore = createExtensionStore()
defaultStore.subscribe((x) => console.log(x.extensions))
const ExtensionsContext = createContext(defaultStore)
export const useExtensionsStore = () => useContext(ExtensionsContext)
export const useExtension = <K extends keyof Extensions>(key: K) => useStore(useExtensionsStore(), (x) => x.use(key))

export const useExtend = (value: Partial<Extensions>) => {
  const store = useExtensionsStore()
  useLayoutEffect(() => store.getState().extend(value), [value])
}

export const ExtensionsProvider = (props: { value?: Partial<Extensions>; children: React.ReactNode }) => {
  const parent = useExtensionsStore()
  const store = useMemo(() => createExtensionStore(parent), [parent])
  useEffect(() => store.getState().extend(props.value), [props.value])
  return <ExtensionsContext.Provider value={store}>{props.children}</ExtensionsContext.Provider>
}

export const UseExtension = <K extends keyof Extensions>({
  extension,
  fallback,
  props,
}: {
  extension: K
  fallback?: React.ReactNode
  props: Parameters<Extensions[K]>[0]
}) => {
  const Component = useExtension(extension)
  if (!Component) return fallback
  return <Component {...(props as any)} />
}
