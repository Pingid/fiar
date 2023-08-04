import { component } from '@fiar/workbench'
import { Link } from 'react-router-dom'
import { Button, Header } from '@fiar/components'

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
  const title = useDocumentData((x) => (col?.titleField ? x.data?.[col.titleField] || 'Untitled' : doc?.label))

  if (missing) return <ContentDocumentMissing />

  return (
    <>
      <Header>
        <Header.BreadCrumb>
          <Button variant="link" size="sm" use={Link} to={'/content'} icon={<ContentIcon className="w-4" />}>
            Content
          </Button>
          {col && (
            <Button
              variant="link"
              size="sm"
              use="button"
              onClick={() => col.visit()}
              icon={<CollectionIcon className="w-4" />}
            >
              {col?.label || col?.ref}
            </Button>
          )}
          <Button
            variant="link"
            size="sm"
            disabled
            use="button"
            className="max-w-[80%] truncate whitespace-nowrap text-left"
            icon={<DocumentIcon className="w-4" />}
          >
            {title}
          </Button>
        </Header.BreadCrumb>
        <Header.Content>
          <div className="w-full" />
          <div className="flex">
            <div className="flex items-end gap-2">
              <p className="text-front/50 pb-1 text-sm leading-none">{status}</p>
              <ContentDocumentActions exclude={['content:document:actions:publish']}>
                <ContentDocumentActionsPublish />
                <ContentDocumentActionsDelete />
              </ContentDocumentActions>
            </div>
          </div>
        </Header.Content>
      </Header>
      <div className="mx-auto w-full max-w-4xl px-2">
        <ContentFieldProvider value={doc.field}>
          <ContentFieldRecord />
        </ContentFieldProvider>
      </div>
    </>
  )
})

const ContentDocumentMissing = component('content:document:missing', () => {
  const col = useCollection(true)
  return (
    <>
      <ContentDocumentHeader />
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
    </>
  )
})

const ContentDocumentHeader = component('content:document:header', (p: { children?: React.ReactNode }): JSX.Element => {
  const doc = useDocument()!
  const col = useCollection(true)
  const title = useDocumentData((x) => (col?.titleField ? x.data?.[col.titleField] || 'Untitled' : doc.label))
  return (
    <Header>
      <Header.BreadCrumb>
        <Button variant="link" use={Link} to={'/content'} icon={<ContentIcon className="w-4" />}>
          Content
        </Button>
        {col && (
          <Button variant="link" use="button" onClick={() => col.visit()} icon={<CollectionIcon className="w-4" />}>
            {col?.label || col?.ref}
          </Button>
        )}
        <Button variant="link" disabled use="button" icon={<DocumentIcon className="w-4" />}>
          {title}
        </Button>
      </Header.BreadCrumb>
      <div className="border-b px-2 pt-4">{p.children}</div>
    </Header>
  )
})
