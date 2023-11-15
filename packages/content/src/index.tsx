import { WorkbenchPage, WorkbenchProvider } from '@fiar/workbench/types'
import StarterKit from '@tiptap/starter-kit'
import { FiarPlugin } from '@fiar/core'
import { useLocation } from 'wouter'

import { CollectionPageProvider, DocumentPageProvider } from './components/pages/index.js'
import { ContentConfig, ContentConfigProvider } from './context/config/index.js'
import { ContentCollection } from './components/collection/index.js'
import { TipTapConfigProvider } from './context/tiptap/index.js'
import { ContentDocument } from './components/document/index.js'
import { ContentIcon } from './components/icons/index.js'
import { ContentList } from './components/list/index.js'
import { components } from './components/index.js'

export type { ContentConfig } from './context/config/index.js'
export * from './components/index.js'

export const fiarContent =
  (config: ContentConfig): FiarPlugin =>
  (state) => {
    const page: WorkbenchPage = {
      title: 'Content',
      icon: <ContentIcon />,
      path: 'content',
      element: <RouteProvider />,
    }

    const provider: WorkbenchProvider = (p) => (
      <ContentConfigProvider value={config}>
        <TipTapConfigProvider extensions={[StarterKit]}>{p.children}</TipTapConfigProvider>
      </ContentConfigProvider>
    )

    state.addComponents({
      ...components,
      'workbench:page:content': page,
      'workbench:provider:content': provider,
    })
  }

const RouteProvider = () => {
  const [loc] = useLocation()
  const all = loc.split('/').filter(Boolean)
  if (all.length === 1) return <ContentList />
  if (all.length % 2 === 0) {
    return (
      <DocumentPageProvider>
        <ContentDocument />
      </DocumentPageProvider>
    )
  }
  return (
    <CollectionPageProvider>
      <ContentCollection />
    </CollectionPageProvider>
  )
}
