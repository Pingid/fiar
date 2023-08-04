import { shallow } from 'zustand/shallow'
import React from 'react'

import { StoreApi, useStore } from 'zustand'

export const provideStore = <P extends Record<string, any>, S extends any>(
  creater: (props: P) => StoreApi<S>,
): [
  ({ children, ...props }: P & { children: React.ReactNode }) => JSX.Element,
  {
    (): S
    <B>(fn: (a: S) => B, eq?: ((a: B, b: B) => boolean) | 'shallow'): B
  },
  React.Context<StoreApi<S> | null>,
] => {
  const Context = React.createContext<null | StoreApi<S>>(null)
  return [
    ({ children, ...props }: P & { children: React.ReactNode }): JSX.Element => (
      <Context.Provider value={creater(props as any as P)}>{children}</Context.Provider>
    ),
    (fn?: any, eq?: any) => useStore(React.useContext(Context)!, fn, eq === 'shallow' ? shallow : eq) as any,
    Context,
  ]
}

export const createHook =
  <S extends any>(
    Context: React.Context<StoreApi<S> | null>,
  ): {
    (): S
    <B>(fn: (a: S) => B, eq?: ((a: B, b: B) => boolean) | 'shallow'): B
  } =>
  (fn?: any, eq?: any) =>
    useStore(React.useContext(Context)!, fn, eq === 'shallow' ? shallow : eq) as any
