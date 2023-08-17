import { WorkbenchPage, WorkbenchProvider } from '@fiar/workbench/types'
import StarterKit from '@tiptap/starter-kit'
import { FiarPlugin } from '@fiar/core'
import { useLocation } from 'wouter'

import { CollectionPageProvider, DocumentPageProvider } from './components/pages'
import { ContentConfig, ContentConfigProvider } from './context/config'
import { ContentCollection } from './components/collection'
import { TipTapConfigProvider } from './context/tiptap'
import { ContentDocument } from './components/document'
import { ContentIcon } from './components/icons'
import { ContentList } from './components/list'
import { components } from './components'

export type { ContentConfig } from './context/config'
export * from './components'

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
