import { WorkbenchProvider, WorkbenchPage } from '@fiar/workbench'
import { FiarPlugin } from '@fiar/core'

import { AssetConfigProvider, AssetsConfig } from './context/index.js'
import { AssetsBrowser } from './components/assets-browser/index.js'
import { TipTapImageProvider } from './context/tiptap.js'
import { CloudIcon } from './components/icons/index.js'
import { components } from './components/index.js'

export type { AssetsConfig } from './context/index.js'

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
