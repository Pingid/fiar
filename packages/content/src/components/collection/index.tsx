import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Page } from '@fiar/workbench/components/page'
import { Avatar, LoadingDots } from '@fiar/components'
import { component } from '@fiar/workbench'
import dayjs from 'dayjs'
import { cn } from 'mcn'

import { ContentCollectionActionsCreate } from '../collection-actions-create/index.js'
import { ContentDocumentActionsPublish } from '../document-actions-publish/index.js'
import { ContentDocumentActionsDelete } from '../document-actions-delete/index.js'
import { ContentDocumentActionsEdit } from '../document-actions-edit/index.js'
import { useCollectionData } from '../../context/collection/data/index.js'
import { ContentDocumentActions } from '../document-actions/index.js'
import { DocumentProvider } from '../../context/document/index.js'
import { useCollection } from '../../context/collection/index.js'
import { CollectionIcon, ContentIcon } from '../icons/index.js'
import { DocumentCard } from '../document-card/index.js'
import { DocumentMeta } from '../../schema/index.js'

export const ContentCollection = component('content:collection', () => {
  const col = useCollection()!
  const error = useCollectionData((x) => x.error)
  return (
    <Page
      error={error ?? ''}
      breadcrumb={[
        { title: 'Content', to: '/content', icon: <ContentIcon className="w-4" /> },
        { title: col?.label || col?.ref, onClick: col.visit, icon: <CollectionIcon className="w-4" /> },
      ]}
      action={<ContentCollectionActionsCreate />}
      header={<CollectionPagination />}
    >
      <ContentCollectionList />
    </Page>
  )
})

export const ContentCollectionList = (): JSX.Element => {
  const data = useCollectionData((x) => x.pages[x.page])
  const col = useCollection()!
  return (
    <ul className="mt-6 space-y-6">
      {data?.docs.map((x) => {
        return (
          <DocumentProvider key={x.id} value={col.document(x.id)}>
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
    <div className="flex w-full justify-between border-t px-3 py-0.5 text-sm">
      <button
        disabled={r.page === 0}
        className={cn('flex items-center gap-1', [r.page === 0, 'opacity-20', 'hover:text-active'])}
        onClick={() => r.prev_page()}
      >
        <ArrowLeftIcon className="h-4 w-4" /> previous
      </button>
      <div className="flex gap-1">
        {r.pages
          .slice(0, r.page + 1)
          .map((_, i) => i)
          .slice(-3)
          .map((x) => (
            <button
              disabled={x === r.page}
              className={cn([x !== r.page, 'hover:text-active text-xs opacity-60 hover:opacity-100'])}
              onClick={() => r.set_page(x)}
            >
              {x + 1}
            </button>
          ))}
      </div>
      <button
        disabled={!!page?.last}
        className={cn('flex items-center gap-1', [page?.last, 'opacity-20', 'hover:text-active '])}
        onClick={() => r.next_page()}
      >
        next <ArrowLeftIcon className="h-4 w-4 rotate-180" />
      </button>
    </div>
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
