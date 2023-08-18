import { InfoCard, LoadingDots } from '@fiar/components'
import { Page } from '@fiar/workbench/components/page'
import { component } from '@fiar/workbench'
import useQuery from 'swr'

import { DocumentProvider, useDocument, useDocumentData } from '../../context/document'
import { CollectionProvider, useCollection } from '../../context/collection'
import { CollectionIcon, ContentIcon, DocumentIcon } from '../icons'
import { IContentCollection, IContentDocument } from '../../schema'
import { ContentVersionProvider } from '../../context/version'
import { useConfig } from '../../context/config'

export const ContentList = component('content:list', () => {
  const schema = useConfig()
  const collections = schema.content.filter((x): x is IContentCollection => x.nodeId.description === 'collection')
  const documents = schema.content.filter((x): x is IContentDocument => x.nodeId.description === 'document')
  return (
    <Page breadcrumb={[{ title: 'Content', to: '/content', icon: <ContentIcon className="w-4" /> }]}>
      <div className="mt-3 space-y-3">
        <h4 className="text-front/50 text-sm font-semibold uppercase">Collections</h4>
        <ul className="w-full space-y-3">
          {collections.map((item) => (
            <CollectionProvider key={item.ref} value={item}>
              <ContentCollectionListCard />
            </CollectionProvider>
          ))}
        </ul>
        <h4 className="text-front/50 text-sm font-semibold uppercase">Documents</h4>
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
    </Page>
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
  const title = useDocumentData((x) => x.title)

  return (
    <InfoCard
      title={title}
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
