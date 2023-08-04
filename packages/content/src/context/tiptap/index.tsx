import type { AnyExtension, Editor } from '@tiptap/react'
import React from 'react'

type TipTapConfig = {
  extensions: AnyExtension[]
  controls: ((p: { editor: Editor }) => JSX.Element)[]
}
const TipTapContext = React.createContext<TipTapConfig>({ extensions: [], controls: [] })
export const TipTapConfigProvider = (p: { children: React.ReactNode } & Partial<TipTapConfig>): JSX.Element => {
  const parent = React.useContext(TipTapContext)
  const controls = [...parent.controls, ...(p.controls || [])]
  const extensions = [...parent.extensions, ...(p.extensions || [])]
  return <TipTapContext.Provider value={{ extensions, controls }}>{p.children}</TipTapContext.Provider>
}
export const useTipTapConfig = () => React.useContext(TipTapContext)
