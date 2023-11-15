import React, { createContext, useContext, useEffect, useId, useMemo } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { createStore, useStore } from 'zustand'
import { createPortal } from 'react-dom'

type SlotId<T extends any = any> =
  | { (props: T): any; slot: string }
  | string
  | React.MemoExoticComponent<(props: T) => any>
type Props<T> = T extends string
  ? {}
  : T extends SlotId<infer P>
  ? P
  : T extends React.MemoExoticComponent<(props: infer P) => any>
  ? P
  : never

export const setSlot = <K extends string, T extends (props: any) => any>(slot: K, cmb: T) =>
  Object.assign(cmb, { slot })

export const getSlots = <T extends Record<string, SlotId | readonly [SlotId]>>(
  children: React.ReactNode | undefined,
  slots: T,
): { [K in keyof T]: T[K] extends [any] ? React.ReactElement<Props<T[K][0]>>[] : React.ReactElement<Props<T[K]>> } & {
  children: React.ReactNode[]
} => {
  const keys = Object.keys(slots)

  return React.Children.toArray(children).reduce(
    (a, b) => {
      if (!React.isValidElement(b)) return { ...a, children: [...a.children, b] }
      const match = keys.find((key) => {
        let item = Array.isArray(slots[key]) ? (slots[key] as any)[0] : Array.isArray(slots[key])
        if (typeof item === 'string') return item === (b as any).type.slot
        return (b as any).type.slot === item.slot
      })
      if (!match) return { ...a, children: [...a.children, b] }
      if (Array.isArray(slots[match])) return { ...a, [match]: [...((a as any)[match] ?? []), b] }
      return { ...a, [match]: b }
    },
    { children: [], ...Object.fromEntries(keys.map((key) => [key, Array.isArray(slots[key]) ? [] : null])) } as any,
  )
}

type SlotStore = {
  items: string[]
  elements: Record<string, HTMLElement | null>
  ref: (id: string) => <H extends HTMLElement>(elem: H | null) => void
  register: (id: string) => () => void
}

const createSlotStore = () =>
  createStore<SlotStore>((set) => {
    return {
      items: [],
      elements: {},
      ref: (id: string) => (elem) => set((x) => ({ elements: { ...x.elements, [id]: elem } })),
      register: (id: string) => {
        set((x) => ({ items: [...x.items, id] }))
        return () => set((x) => ({ items: x.items.filter((y) => y !== id) }))
      },
    }
  })

export const createGlobalSlot = () => {
  const Context = createContext(createSlotStore())
  const Provider = (p: { children: React.ReactNode }) => (
    <Context.Provider value={useMemo(() => createSlotStore(), [])}>{p.children}</Context.Provider>
  )
  const Place = ({ children }: { children: React.ReactNode }) => {
    const id = useId()
    const store = useContext(Context)
    const node = useStore(store, (x) => x.elements[id])
    const register = useStore(store, (x) => x.register)
    useEffect(() => register(id), [id])
    if (!node) return null
    return createPortal(children, node)
  }

  const Locate = <K extends keyof JSX.IntrinsicElements>({ use, ...props }: { use: K } & JSX.IntrinsicElements[K]) => {
    const store = useContext(Context)
    const items = useStore(
      store,
      useShallow((x) => x.items),
    )
    const ref = useStore(store, (x) => x.ref)
    const Element = use as string
    return items.map((id) => <Element key={id} ref={ref(id)} {...props} />)
  }

  const placer = <T extends (props: any) => any>(Comp: T) =>
    ((props: any) => (
      <Place>
        <Comp {...props} />
      </Place>
    )) as T

  return { Locate, Place, Provider, placer, Context }
}

const createMountTargetStore = () =>
  createStore<{
    element: HTMLElement | null
    ref: (node: HTMLElement | null) => void
  }>((set) => ({ element: null, ref: (element) => set({ element }) }))

export const createMountTarget = () => {
  const Context = createContext(createMountTargetStore())
  const Provider = (p: { children: React.ReactNode }) => (
    <Context.Provider value={useMemo(() => createMountTargetStore(), [])}>{p.children}</Context.Provider>
  )
  const Locate = <K extends keyof JSX.IntrinsicElements>({ use, ...props }: { use: K } & JSX.IntrinsicElements[K]) => {
    const store = useContext(Context)
    const ref = useStore(store, (x) => x.ref)
    const Element = use as string
    return <Element ref={ref} {...props} />
  }
  const Place = ({ children }: { children: React.ReactNode }) => {
    const store = useContext(Context)
    const node = useStore(store, (x) => x.element)
    if (!node) return null
    return createPortal(children, node)
  }
  return { Provider, Locate, Place }
}
