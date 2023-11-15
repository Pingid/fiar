import { useLocation } from 'wouter'

import { ContentVersionProvider } from '../../context/version/index.js'
import { CollectionProvider } from '../../context/collection/index.js'
import { DocumentProvider } from '../../context/document/index.js'
import { useConfig } from '../../context/config/index.js'
import { isCol, isDoc } from '../../schema/index.js'

export const CollectionPageProvider = (p: { children: React.ReactNode }): JSX.Element => {
  const [location] = useLocation()
  const schema = useConfig()
  const path = location.replace(/^\/?content\/?/, '')
  const [version, ...col] = path.split('/')
  const content = schema.content.find((x) => x.ref === col.join('/'))
  if (!isCol(content)) return <>Missing collection {col.join('/')} in content</>
  return (
    <ContentVersionProvider value={version as any}>
      <CollectionProvider value={content}>{p.children}</CollectionProvider>
    </ContentVersionProvider>
  )
}

export const DocumentPageProvider = (p: { children: React.ReactNode }): JSX.Element => {
  const [location] = useLocation()
  const schema = useConfig()
  const path = location.replace(/^\/?content\/?/, '')
  const [version, ...doc] = path.split('/')
  const col = doc.slice(0, -1)
  const collection = schema.content.find((x) => x.ref === col.join('/'))
  const document = schema.content.find((x) => x.ref === doc.join('/'))
  const docId = doc[doc.length - 1]
  if (isCol(collection) && docId) {
    return (
      <ContentVersionProvider value={version as any}>
        <CollectionProvider value={collection}>
          <DocumentProvider value={collection.document(docId)}>{p.children}</DocumentProvider>
        </CollectionProvider>
      </ContentVersionProvider>
    )
  }
  if (!isDoc(document)) return <>Missing document {doc.join('/')} in content</>
  return (
    <ContentVersionProvider value={version as any}>
      <DocumentProvider value={document}>{p.children}</DocumentProvider>
    </ContentVersionProvider>
  )
}
