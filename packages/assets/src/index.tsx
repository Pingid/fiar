import { WorkbenchProvider, WorkbenchPage } from '@fiar/workbench'
import { FiarPlugin } from '@fiar/core'
import '@fiar/workbench'

import { AssetsBrowser } from './components/assets-browser'
import { TipTapImageProvider } from './context/tiptap'
import { AssetConfigProvider } from './context'
import { CloudIcon } from './components/icons'
import { AssetsConfig } from './context'
import { components } from './components'

export type { AssetsConfig } from './context'

export const fiarAssets =
  (config: AssetsConfig): FiarPlugin =>
  (state) => {
    const page: WorkbenchPage = {
      icon: <CloudIcon />,
      title: 'Assets',
      path: 'assets',
      element: <AssetsBrowser />,
    }
    const provider: WorkbenchProvider = (p) => (
      <AssetConfigProvider value={config}>
        <TipTapImageProvider>{p.children}</TipTapImageProvider>
      </AssetConfigProvider>
    )
    state.addComponents({ ...components, 'workbench:page:assets': page, 'workbench:provider:assets': provider })
  }
