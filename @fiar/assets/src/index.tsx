import CloudIcon from '@heroicons/react/24/outline/CloudIcon'
import { Outlet } from 'react-router-dom'

import { WorkbenchPage, WorkbenchProvider } from '@fiar/workbench/types'
import { FiarAppStore } from '@fiar/core'

import { AssetsBrowser } from './components/assets-browser'
import { TipTapImageProvider } from './context/tiptap'
import { AssetConfigProvider } from './context'
import { components } from './components'
import { AssetsConfig } from './context'

export type { AssetsConfig } from './context'
export * from './components'

export const fiarAssets = (config: AssetsConfig) => (p: FiarAppStore) => {
  const page: WorkbenchPage = {
    icon: <CloudIcon />,
    title: 'Assets',
    path: 'assets',
    element: (
      <div className="relative flex w-full flex-col [--header-pt:20px]">
        <Outlet />
      </div>
    ),
    children: [{ index: true, element: <AssetsBrowser /> }],
  }
  const provider: WorkbenchProvider = (p) => (
    <AssetConfigProvider value={config}>
      <TipTapImageProvider>{p.children}</TipTapImageProvider>
    </AssetConfigProvider>
  )
  p.setState({
    pages: [...(p.getState().pages || []), page],
    providers: [...(p.getState().providers || []), provider],
    components: { ...p.getState().components, ...components },
  })
  return p
}
