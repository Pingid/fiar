import { InfoCard, LoadingDots } from '@fiar/ui'
import { component } from '@fiar/workbench'
import useQuery from 'swr'

import { DocumentProvider, useDocument, useDocumentData } from '../../context/document'
import { CollectionProvider, useCollection } from '../../context/collection'
import { IContentCollection, IContentDocument } from '../../schema'
import { ContentVersionProvider } from '../../context/version'
import { CollectionIcon, DocumentIcon } from '../icons'
import { useConfig } from '../../context/config'

export const ContentList = component('content:list', () => {
  const schema = useConfig()
  const collections = schema.content.filter((x): x is IContentCollection => x.nodeId.description === 'collection')
  const documents = schema.content.filter((x): x is IContentDocument => x.nodeId.description === 'document')
  return (
    <div className="px-2">
      <h4 className="text-front/50 mb-3 mt-6 text-sm font-semibold uppercase">Collections</h4>
      <ul className="w-full space-y-3">
        {collections.map((item) => (
          <CollectionProvider key={item.ref} value={item}>
            <ContentCollectionListCard />
          </CollectionProvider>
        ))}
      </ul>
      <h4 className="text-front/50 mb-3 mt-6 text-sm font-semibold uppercase">Documents</h4>
      <ul className="w-full space-y-3">
        {documents.map((item) => (
          <ContentVersionProvider key={item.ref} value="draft">
            <DocumentProvider value={item}>
              <ContentDocumentListCard />
            </DocumentProvider>
          </ContentVersionProvider>
        ))}
      </ul>
    </div>
  )
})

const ContentCollectionListCard = component('content:collection:list:card', () => {
  const item = useCollection()!
  const published = useQuery(item.refs.published + 'count', () => item.count('published'))
  const draft = useQuery(item.refs.draft + 'count', () => item.count('draft'))

  return (
    <InfoCard
      title={item.label || item.ref}
      variant={['border']}
      icon={<CollectionIcon className="w-4" />}
      onClick={() => item.visit()}
      asside={<p className="text-sm">Published {published.data?.count}</p>}
    >
      <div className="w-full" />
      <p className="text-sm">Draft {draft.data?.count}</p>
    </InfoCard>
  )
})

const ContentDocumentListCard = component('content:document:list:card', () => {
  const doc = useDocument()!
  const status = useDocumentData((x) => x.status)
  return (
    <InfoCard
      title={doc.label}
      variant={['border']}
      icon={<DocumentIcon className="w-4" />}
      onClick={() => (status === 'Missing' ? doc.create().then(() => doc.select()) : doc.select())}
      asside={<p className="text-sm">Document</p>}
    >
      <div className="w-full" />
      <p className="text-front/70 text-sm">{status || <LoadingDots />}</p>
    </InfoCard>
  )
})
