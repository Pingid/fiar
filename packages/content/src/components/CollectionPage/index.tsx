import { CircleStackIcon, DocumentPlusIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { getCountFromServer, limit, startAfter } from '@firebase/firestore'
import { Link, Route } from 'wouter'
import { memo } from 'react'
import useSWR from 'swr'

import { UseExtension } from '@fiar/workbench/extensions'
import { Button } from '@fiar/components'
import { Page } from '@fiar/workbench'

import { CreateDocument, UpdateDocument } from '../DocumentPage/index.js'
import { IContentCollection, defineDocument } from '../../schema/index.js'
import { useCollectionRef, useCollectionData } from '../../hooks/index.js'
import { CollectionPagePagination } from './CollectionPagePagination/index.js'
import { useCollectionListState } from './store/index.js'
import { DocumentLink } from '../DocumentLink/index.js'
import { LayoutHeader } from '../Layout/index.js'

const parameterize = (path: string) => path.replace(/\{([^\}]+)\}/g, ':$1')

export const CollectionPage = memo(
  (props: { collection: IContentCollection<any, any>; children?: React.ReactNode }) => {
    const path = parameterize(props.collection.path)
    console.log(path)

    return (
      <>
        <Route path={`${path}/:documentId` as `${string}/:documentId`}>
          {(params) => (
            <Page>
              <Page.Breadcrumb title="Content" href="" icon={<CircleStackIcon />} />
              <Page.Breadcrumb
                title={props.collection.label ?? props.collection.path}
                icon={<DocumentDuplicateIcon />}
                href={props.collection.path}
              />
              {props.children}
              <UpdateDocument
                schema={props.collection}
                path={`${props.collection.path}/${(params as any)?.documentId}`}
              />
            </Page>
          )}
        </Route>
        <Route path={`/create${path}`}>
          <Page>
            <Page.Breadcrumb title="Content" href="" icon={<CircleStackIcon />} />
            <Page.Breadcrumb
              title={props.collection.label ?? props.collection.path}
              icon={<DocumentDuplicateIcon />}
              href={props.collection.path}
            />
            {props.children}
            <CreateDocument schema={props.collection} />
          </Page>
        </Route>
        <Route path={path}>
          <Page>
            <Page.Breadcrumb title="Content" href="" icon={<CircleStackIcon />} />
            {/* <Page.Breadcrumb title={props.collection.label ?? props.collection.path} icon={<DocumentDuplicateIcon />} /> */}
            {props.children}
            <CollectionList collection={props.collection} />
          </Page>
        </Route>
      </>
    )
  },
)

const CollectionList = (props: { collection: IContentCollection<any, any> }) => {
  const pages = useCollectionListState((x) => x.pages)
  const size = useCollectionListState((x) => x.size)

  const data = useCollectionData(useCollectionRef(props.collection), {
    constraints: [limit(size), ...(pages.slice(-1)[0] ? [startAfter(pages.slice(-1)[0])] : [])],
    once: pages.length > 0,
  })
  const ref = useCollectionRef(props.collection)
  const count = useSWR(ref.path + 'count', () => getCountFromServer(ref))

  return (
    <>
      <LayoutHeader title={props.collection.label} path={props.collection.path} badge={count.data?.data().count}>
        <div className="flex w-full justify-between">
          <CollectionPagePagination
            pages={pages}
            end={!data.data?.docs || data.data?.docs.length < size}
            goTo={(n) => {
              const latest = data.data?.docs.slice(-1)[0]
              if (n > pages.length && latest) useCollectionListState.setState((x) => ({ pages: [...x.pages, latest] }))
              else useCollectionListState.setState((x) => ({ pages: x.pages.slice(0, n) }))
            }}
          />
        </div>
        <Link href={`/create${props.collection.path}`}>
          <Button icon={<DocumentPlusIcon />} elementType="a" color="active">
            New
          </Button>
        </Link>
      </LayoutHeader>

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
                <UseExtension
                  extension="document:card"
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
