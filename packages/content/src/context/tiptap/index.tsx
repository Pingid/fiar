import type { AnyExtension, Editor } from '@tiptap/react'
import React, { useMemo } from 'react'

type TipTapConfig = {
  extensions: AnyExtension[]
  controls: ((p: { editor: Editor }) => JSX.Element)[]
}
const TipTapContext = React.createContext<TipTapConfig>({ extensions: [], controls: [] })
export const TipTapConfigProvider = (p: { children: React.ReactNode } & Partial<TipTapConfig>): JSX.Element => {
  const parent = React.useContext(TipTapContext)
  const child = useMemo(
    () => ({
      controls: [...parent.controls, ...(p.controls ?? [])],
      extensions: [...parent.extensions, ...(p.extensions ?? [])],
    }),
    [parent, p.controls, p.extensions],
  )
  return <TipTapContext.Provider value={child}>{p.children}</TipTapContext.Provider>
}
export const useTipTapConfig = () => React.useContext(TipTapContext)
