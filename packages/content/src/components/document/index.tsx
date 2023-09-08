import { Page } from '@fiar/workbench/components/page'
import { component } from '@fiar/workbench'
import { Button } from '@fiar/components'
import { Link } from 'wouter'
import { tp } from 'typeofit'

import { ArrowRightIcon, CollectionIcon, ContentIcon, DocumentIcon } from '../icons'
import { ContentDocumentActionsPublish } from '../document-actions-publish'
import { ContentDocumentActionsDelete } from '../document-actions-delete'
import { useDocument, useDocumentData } from '../../context/document'
import { ContentDocumentActions } from '../document-actions'
import { ContentFieldProvider } from '../../context/field'
import { useCollection } from '../../context/collection'
import { ContentFieldRecord } from '../field-record'

export const ContentDocument = component('content:document', () => {
  const col = useCollection(true)
  const doc = useDocument()
  const missing = useDocumentData((x) => x.missing)
  const status = useDocumentData((x) => x.status)
  const title = useDocumentData((x) => x.title)

  const breadcrumbs = [
    { title: 'Content', to: '/content', icon: <ContentIcon className="w-4" /> },
    col ? { title: col?.label || col?.ref, onClick: col?.visit, icon: <CollectionIcon className="w-4" /> } : null,
    { title, icon: <DocumentIcon className="w-4" />, disabled: true },
  ].filter(tp.defined)

  const actions = (
    <div className="flex">
      <div className="w-full" />
      <div className="flex items-end gap-2">
        <p className="text-front/50 pb-1 text-sm leading-none">{status}</p>
        <ContentDocumentActions exclude={['content:document:actions:publish']}>
          <ContentDocumentActionsPublish />
          <ContentDocumentActionsDelete />
        </ContentDocumentActions>
      </div>
    </div>
  )

  return (
    <Page breadcrumb={breadcrumbs} actions={actions}>
      {missing ? (
        <ContentDocumentMissing />
      ) : (
        <div className="mx-auto h-full w-full max-w-4xl">
          <ContentFieldProvider value={doc.field}>
            <ContentFieldRecord />
          </ContentFieldProvider>
        </div>
      )}
    </Page>
  )
})

const ContentDocumentMissing = component('content:document:missing', () => {
  const col = useCollection(true)
  return (
    <div className="justify center flex h-full w-full items-center justify-center">
      <div className="">
        <p className="text-front/70 pr-2">It looks like this document no longer exists</p>
        <div>
          {col ? (
            <Button
              use="button"
              variant="link"
              onClick={() => col.visit()}
              icon={<ArrowRightIcon className="w-5 rotate-180" />}
            >
              {col.label || col.ref}
            </Button>
          ) : (
            <Button
              use={Link}
              to="/content"
              variant="link"
              className="w-min"
              icon={<ArrowRightIcon className="w-5 rotate-180" />}
            >
              Content
            </Button>
          )}
        </div>
      </div>
    </div>
  )
})
