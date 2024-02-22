import type { Editor, Extension } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { create } from 'zustand'

import { createGlobalSlot } from '@fiar/components'

export const useTipTapExtensions = create(() => ({ extensions: [StarterKit] as Extension[] }))

const ToolSlot = createGlobalSlot<{ editor: Editor }>()

export const TipTapTool = (props: { children: (props: { editor: Editor }) => React.ReactNode }) => (
  <ToolSlot.Place>{props.children}</ToolSlot.Place>
)
export const TipTipTools = (props: { editor: Editor }) => <ToolSlot.Locate pass={props} use="div" className="flex" />
