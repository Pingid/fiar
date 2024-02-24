import React, { createContext, useContext, useEffect, useId, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { createStore, useStore } from 'zustand'
import { createPortal } from 'react-dom'

type SlotStore = {
  items: string[]
  elements: Record<string, HTMLElement | null>
  props: Record<string, any>
  ref: (id: string, pass?: any) => <H extends HTMLElement>(elem: H | null) => void
  register: (id: string) => () => void
}

const createSlotStore = () =>
  createStore<SlotStore>((set) => {
    return {
      items: [],
      elements: {},
      props: {},
      ref: (id, pass) => {
        if (pass) set((x) => ({ props: { ...x.props, [id]: pass } }))
        return (elem) => set((x) => ({ elements: { ...x.elements, [id]: elem } }))
      },
      register: (id) => {
        set((x) => ({ items: [...x.items, id] }))
        return () => set((x) => ({ items: x.items.filter((y) => y !== id) }))
      },
    }
  })

type GlobalSlot<T extends Record<string, any> | void = void> = {
  Locate: <
    K extends keyof JSX.IntrinsicElements,
    P = { use: K } & JSX.IntrinsicElements[K] & (T extends Record<string, any> ? { pass: T } : { pass?: T }),
  >(
    props: P,
  ) => JSX.Element[]
  Place: (props: { children: React.ReactNode | ((props: T) => React.ReactNode) }) => React.ReactNode
  Provider: (props: { children: React.ReactNode }) => React.ReactNode
}

export const createGlobalSlot = <T extends Record<string, any> | void = void>(): GlobalSlot<T> => {
  const Context = createContext(createSlotStore())
  const Provider = (p: { children: React.ReactNode }) => (
    <Context.Provider value={useMemo(() => createSlotStore(), [])}>{p.children}</Context.Provider>
  )
  const Place: GlobalSlot<any>['Place'] = ({ children }) => {
    const id = useId()
    const store = useContext(Context)
    const node = useStore(store, (x) => x.elements[id])
    const config = useStore(store, (x) => x.props[id])
    const register = useStore(store, (x) => x.register)
    useEffect(() => register(id), [id])
    if (!node) return null
    if (typeof children === 'function') return createPortal(children(config ?? {}), node)
    return createPortal(children, node)
  }

  const Locate: GlobalSlot<any>['Locate'] = (props) => {
    const store = useContext(Context)
    const items = useStore(
      store,
      useShallow((x) => x.items),
    )

    return items.map((id) => <LocateItem key={id} id={id} {...props} />)
  }
  const LocateItem = ({ use, id, pass, ...props }: Record<string, any>) => {
    const store = useContext(Context)
    const ref = useStore(store, (x) => x.ref)
    const Element = use as 'div'
    useEffect(() => store.setState((x) => ({ props: { ...x.props, [id]: pass } })), [id, pass])
    return <Element ref={ref(id)} {...props} />
  }

  return { Locate, Place, Provider }
}
