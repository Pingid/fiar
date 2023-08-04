import { useLocation } from 'react-router-dom'

import { ContentVersionProvider } from '../../context/version'
import { CollectionProvider } from '../../context/collection'
import { DocumentProvider } from '../../context/document'
import { useConfig } from '../../context/config'
import { isCol, isDoc } from '../../schema'

export const CollectionPageProvider = (p: { children: React.ReactNode }): JSX.Element => {
  const location = useLocation()
  const schema = useConfig()
  const path = location.pathname.replace(/^\/?content\/?/, '')
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
  const location = useLocation()
  const schema = useConfig()
  const path = location.pathname.replace(/^\/?content\/?/, '')
  const [version, ...doc] = path.split('/')
  const col = doc.slice(0, -1)
  const collection = schema.content.find((x) => x.ref === col.join('/'))
  const document = schema.content.find((x) => x.ref === doc.join('/'))
  if (isCol(collection)) {
    return (
      <ContentVersionProvider value={version as any}>
        <CollectionProvider value={collection}>
          <DocumentProvider value={{ ...collection, ref: doc.join('/'), label: '' }}>{p.children}</DocumentProvider>
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
