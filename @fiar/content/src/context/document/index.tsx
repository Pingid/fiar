import { ContentDocumentContext, ContentDocumentProvider } from './content'
import { DocumentDataProvider } from './data'

export { useDocument, useGetDocument } from './content'
export { useDocumentData } from './data'

export const DocumentProvider = (p: {
  children: React.ReactNode
  value: ContentDocumentContext | null
}): JSX.Element => (
  <ContentDocumentProvider value={p.value}>
    <DocumentDataProvider>{p.children}</DocumentDataProvider>
  </ContentDocumentProvider>
)
