import { TipTapConfigProvider } from '@fiar/content/context/tiptap'
import Image from '@tiptap/extension-image'
import React from 'react'

import { TipTapControl } from '../components/tiptap-control/index.js'

export const TipTapImageProvider = (p: { children: React.ReactNode }): JSX.Element => (
  <TipTapConfigProvider controls={controls} extensions={extensions}>
    {p.children}
  </TipTapConfigProvider>
)

const controls = [TipTapControl]
const extensions = [Image]
