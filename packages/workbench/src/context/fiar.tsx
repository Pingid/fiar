import { FiarApp, FiarAppStore } from '@fiar/core'
import React, { useContext } from 'react'
import { shallow } from 'zustand/shallow'
import { useStore } from 'zustand'

export const FiarAppContext = React.createContext<FiarAppStore | null>(null)
export const useFiarAppStore = () => {
  const store = useContext(FiarAppContext)
  if (!store) throw new Error(`Missing FiarAppContext`)
  return store
}
export const useFiarAppState: {
  (): FiarApp
  <B>(fn: (a: FiarApp) => B, eq?: ((a: B, b: B) => boolean) | 'shallow'): B
} = (fn?: any, eq?: any) => useStore(useFiarAppStore(), fn, typeof eq === 'string' ? shallow : eq) as any
