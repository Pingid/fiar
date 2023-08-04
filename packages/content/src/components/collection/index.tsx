import { Avatar, Button, Header, LoadingDots, Pagination } from '@fiar/components'
import { component } from '@fiar/workbench'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

import { ContentCollectionActionsCreate } from '../collection-actions-create'
import { ContentDocumentActionsPublish } from '../document-actions-publish'
import { ContentDocumentActionsDelete } from '../document-actions-delete'
import { ContentDocumentActionsEdit } from '../document-actions-edit'
import { useCollectionData } from '../../context/collection/data'
import { ContentDocumentActions } from '../document-actions'
import { DocumentProvider } from '../../context/document'
import { useCollection } from '../../context/collection'
import { CollectionIcon, ContentIcon } from '../icons'
import { DocumentCard } from '../document-card'
import { DocumentMeta } from '../../schema'

export const ContentCollection = component('content:collection', () => {
  const col = useCollection()!
  return (
    <>
      <Header>
        <Header.BreadCrumb>
          <Button variant="link" size="sm" use={Link} to={'/content'} icon={<ContentIcon className="w-4" />}>
            Content
          </Button>
          <Button
            variant="link"
            size="sm"
            use="button"
            disabled
            onClick={() => col.visit()}
            icon={<CollectionIcon className="w-4" />}
          >
            {col?.label || col?.ref}
          </Button>
        </Header.BreadCrumb>
        <Header.Content>
          <div className="flex gap-1">
            <ContentCollectionActionsCreate />
            <CollectionPagination />
          </div>
        </Header.Content>
      </Header>
      <ContentCollectionList />
    </>
  )
})

export const ContentCollectionList = (): JSX.Element => {
  const data = useCollectionData((x) => x.pages[x.page])
  const col = useCollection()!
  return (
    <ul className="mt-6 space-y-6 pl-3 pr-2">
      {data?.docs.map((x) => {
        const label = x.data()?.[col.titleField] || 'Untitled'
        return (
          <DocumentProvider key={x.id} value={{ ref: `${col.ref}/${x.id}`, field: col.field, label }}>
            <li className="flex">
              <DocumentCard />
              <div className="pt-1">
                <ContentDocumentActions>
                  <ContentDocumentActionsEdit />
                  <ContentDocumentActionsDelete />
                  <ContentDocumentActionsPublish />
                </ContentDocumentActions>
              </div>
            </li>
          </DocumentProvider>
        )
      })}
    </ul>
  )
}

export const CollectionPagination = (): JSX.Element => {
  const r = useCollectionData()
  const page = r.pages[r.page]
  return (
    <Pagination
      page={r.page + 1}
      next={!page?.last ? r.next_page : undefined}
      prev={r.page !== 0 ? r.prev_page : undefined}
    />
  )
}

export const DocumentCardDate = (p: { data?: { _meta: DocumentMeta } | undefined }): JSX.Element => (
  <p className="text-front/70 group-hover:text-active">
    {p?.data?._meta?.created?.at ? (
      dayjs(p?.data?._meta?.created.at.toDate()).format('YY/MM/DD  HH:mm')
    ) : (
      <LoadingDots />
    )}
  </p>
)

export const DocumentCardPerson = (p: { data?: { _meta: DocumentMeta } | undefined }): JSX.Element => (
  <div className="text-front/70 flex w-min items-center justify-end gap-1 whitespace-nowrap">
    <Avatar {...p?.data?._meta?.created?.by} size="sm" className="relative" />{' '}
    {p?.data?._meta?.created?.by?.displayName}
  </div>
)
