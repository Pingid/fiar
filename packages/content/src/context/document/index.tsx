import { ContentDocumentContext, ContentDocumentProvider } from './content/index.js'
import { DocumentDataProvider } from './data/index.js'

export { useDocument, useGetDocument } from './content/index.js'
export { useDocumentData } from './data/index.js'

export const DocumentProvider = (p: {
  children: React.ReactNode
  value: ContentDocumentContext | null
}): JSX.Element => (
  <ContentDocumentProvider value={p.value}>
    <DocumentDataProvider>{p.children}</DocumentDataProvider>
  </ContentDocumentProvider>
)
