import { CircleStackIcon, DocumentPlusIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { limit, startAfter } from '@firebase/firestore'
import { Link, useParams, useRoute } from 'wouter'
import { memo } from 'react'

import { Page, RenderComponent } from '@fiar/workbench/v2'

import { CreateDocument, UpdateDocument } from '../document/index.js'
import { useCollectionRef, useCollectionData } from '../lib/index.js'
import { DocumentLink } from '../components/document/index.js'
import { CollectionPagination } from './pagination/index.js'
import { IContentCollection, defineDocument } from '../schema/index.js'
import { useCollectionListState } from './store/index.js'
import { abs } from '../util/index.js'

export const Collection = memo((props: { collection: IContentCollection<any, any>; children?: React.ReactNode }) => {
  const [create] = useRoute('/create/*')
  const params = useParams<{ documentId: string }>()

  if (params.documentId) {
    return (
      <Page>
        <Page.Breadcrumb title="Content" href="" icon={<CircleStackIcon />} />
        <Page.Breadcrumb
          title={props.collection.label ?? props.collection.path}
          icon={<DocumentDuplicateIcon />}
          href={abs(props.collection.path)}
        />
        {props.children}
        <UpdateDocument schema={props.collection} path={`${props.collection.path}/${params.documentId}`} />
      </Page>
    )
  }

  if (create) {
    return (
      <Page>
        <Page.Breadcrumb title="Content" href="" icon={<CircleStackIcon />} />
        <Page.Breadcrumb
          title={props.collection.label ?? props.collection.path}
          icon={<DocumentDuplicateIcon />}
          href={abs(props.collection.path)}
        />
        {props.children}
        <CreateDocument schema={props.collection} />
      </Page>
    )
  }

  return (
    <Page>
      <Page.Breadcrumb title="Content" href="" icon={<CircleStackIcon />} />
      <Page.Breadcrumb title={props.collection.label ?? props.collection.path} icon={<DocumentDuplicateIcon />} />
      {props.children}
      <CollectionList collection={props.collection} />
    </Page>
  )
})

const CollectionList = (props: { collection: IContentCollection<any, any> }) => {
  const pages = useCollectionListState((x) => x.pages)
  const size = useCollectionListState((x) => x.size)

  const data = useCollectionData(useCollectionRef(props.collection), {
    constraints: [limit(size), ...(pages.slice(-1)[0] ? [startAfter(pages.slice(-1)[0])] : [])],
    once: pages.length > 0,
  })

  return (
    <>
      <Page.ActionButton
        color="active"
        use={Link as any as 'a'}
        icon={<DocumentPlusIcon />}
        href={`/create${abs(props.collection.path)}`}
      >
        New
      </Page.ActionButton>
      <Page.Head>
        <CollectionPagination
          pages={pages}
          end={!data.data?.docs || data.data?.docs.length < size}
          goTo={(n) => {
            const latest = data.data?.docs.slice(-1)[0]
            if (n > pages.length && latest) useCollectionListState.setState((x) => ({ pages: [...x.pages, latest] }))
            else useCollectionListState.setState((x) => ({ pages: x.pages.slice(0, n) }))
          }}
        />
      </Page.Head>

      <ul className="space-y-2 p-2 py-4">
        {data.data?.docs.map((x) => {
          const document = defineDocument({
            ...props.collection,
            path: `${props.collection.path}/${x.id}`,
            label: 'Untitled',
          })
          return (
            <li key={x.id}>
              <DocumentLink document={document}>
                <RenderComponent
                  component="document:card"
                  props={{ document, titleField: props.collection.titleField as string }}
                />
              </DocumentLink>
            </li>
          )
        })}
      </ul>
    </>
  )
}
