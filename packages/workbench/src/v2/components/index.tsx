import { createContext, useContext, useEffect, useMemo } from 'react'
import { createStore, useStore } from 'zustand'

export interface Components extends Record<string, any> {}

const createComponentsStore = (components?: Components) => createStore<Components>(() => ({ ...components }))

const defaultStore = createComponentsStore()
const ComponentsContext = createContext(defaultStore)
export const useComponentsStore = () => useContext(ComponentsContext)

export const register = <K extends keyof Components = string>(key: K, component: Components[K]) =>
  defaultStore.setState((x) => {
    component.displayName = key
    return { ...x, [key]: component }
  })

export const ComponentsProvider = (props: { value?: Partial<Components>; children: React.ReactNode }) => {
  const parent = useComponentsStore()
  const child = useMemo(() => createComponentsStore({ ...parent.getState(), ...props.value }), [parent, props.value])
  useEffect(() => parent.subscribe((x) => child.setState((y) => ({ ...x, ...y }))), [])
  return <ComponentsContext.Provider value={child}>{props.children}</ComponentsContext.Provider>
}

export const Component = <K extends keyof Components = string>(props: { key: K; children: Components[K] }) => {
  const store = useComponentsStore()
  useEffect(() => store.setState({ [props.key]: props.children }))
  return null
}

export const useComponent = <K extends keyof Components>(key: K) => useStore(useComponentsStore(), (x) => x[key])

export const RenderComponent = <K extends keyof Components>({
  component,
  children,
  props,
}: {
  component: K
  children?: React.ReactNode
  props: Parameters<Components[K]>[0]
}) => {
  const Comp = useComponent(component)
  if (!Comp) return children
  return <Comp key={component} {...(props as any)} />
}
