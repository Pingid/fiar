import { WorkbenchPage, WorkbenchProvider } from '@fiar/workbench/types'
import StarterKit from '@tiptap/starter-kit'
import { FiarAppStore } from '@fiar/core'
import { Outlet } from 'react-router-dom'

import { TipTapConfigProvider } from './context/tiptap'

import { CollectionPageProvider, DocumentPageProvider } from './components/pages'
import { ContentConfig, ContentConfigProvider } from './context/config'
import { ContentCollection } from './components/collection'
import { ContentDocument } from './components/document'
import { ContentLayout } from './components/layout'
import { ContentIcon } from './components/icons'
import { ContentList } from './components/list'
import { components } from './components'

export type { ContentConfig } from './context/config'
export * from './components'

export const fiarContent = (config: ContentConfig) => (p: FiarAppStore) => {
  const page: WorkbenchPage = {
    title: 'Content',
    icon: <ContentIcon />,
    path: 'content',
    element: (
      <ContentLayout>
        <Outlet />
      </ContentLayout>
    ),
    children: [
      { index: true, element: <ContentList /> },
      {
        path: ':version',
        children: Array.from(new Array(200))
          .map((_, i) => [
            {
              path: `:col${i + 1}`,
              element: (
                <CollectionPageProvider>
                  <ContentCollection />
                </CollectionPageProvider>
              ),
            },
            {
              path: `:col${i + 1}/:doc${i + 1}`,
              element: (
                <DocumentPageProvider>
                  <ContentDocument />
                </DocumentPageProvider>
              ),
            },
          ])
          .flat(),
      },
    ],
  }

  const provider: WorkbenchProvider = (p) => (
    <ContentConfigProvider value={config}>
      <TipTapConfigProvider extensions={[StarterKit]}>{p.children}</TipTapConfigProvider>
    </ContentConfigProvider>
  )

  p.setState((x) => ({
    pages: [...(x.pages || []), page],
    providers: [...(x.providers || []), provider],
    components: { ...components, ...x.components },
  }))

  return p
}
