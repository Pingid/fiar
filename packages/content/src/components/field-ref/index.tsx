import { DocumentReference } from '@firebase/firestore'
import { component } from '@fiar/workbench'
import { Button, Control } from '@fiar/components'
import React from 'react'

import { CollectionProvider, useCollection, useCollectionData } from '../../context/collection'
import { DocumentProvider, useDocument, useGetDocument } from '../../context/document'
import { ContentDocumentActionsEdit } from '../document-actions-edit'
import { ContentDocumentActions } from '../document-actions'
import { CollectionPagination } from '../collection'
import { DocumentCard } from '../document-card'
import { useField } from '../../context/field'
import { FieldRef } from '../../schema'
import { ContentModal } from '../modal'
import { LinkIcon } from '../icons'

export const ContentFieldRef = component('content:field:ref', () => {
  const field = useField<FieldRef>({ equal: (a, b) => a?.path === b?.path })
  const [open, setopen] = React.useState(false)
  const value = field.value()
  const to = field.options.to()
  const doc = value?.id
    ? {
        field: to.field,
        label: '',
        ref: `${to.ref}/${value.id}`,
        actions: { select: () => setopen(true), remove: () => field.update(null) },
      }
    : null

  return (
    <Control ref={field.ref} error={field.error} label={field.options.label}>
      <CollectionProvider value={to}>
        <DocumentProvider value={doc}>
          {value ? (
            <div className="">
              <DocumentPreviewCard />
            </div>
          ) : (
            <div className="flex items-center justify-center py-2">
              <Button
                variant="link"
                className="flex items-center justify-center gap-1"
                onClick={() => setopen(true)}
                icon={<LinkIcon className="w-4" />}
              >
                Connect {to.label || to.ref}
              </Button>
            </div>
          )}
          <ContentModal open={open} close={() => setopen(false)}>
            <div className="flex justify-start border-b pb-1 pl-2 pr-1">
              <CollectionPagination />
            </div>
            <ContentCollectionList
              select={(ref) => {
                field.update(ref)
                setopen(false)
              }}
            />
          </ContentModal>
        </DocumentProvider>
      </CollectionProvider>
    </Control>
  )
})

export const ContentCollectionList = (p: { select: (ref: DocumentReference<any>) => void }): JSX.Element => {
  const data = useCollectionData((x) => x.pages[x.page])
  const col = useCollection()!
  const get = useGetDocument()
  return (
    <ul className="mt-6 h-full space-y-6 pb-6 pl-3 pr-2">
      {data?.docs.map((x) => {
        const label = x.data()?.[col.titleField] || 'Untitled'
        const doc = {
          ref: `${col.ref}/${x.id}`,
          field: col.field,
          label,
          actions: { select: () => p.select(get(doc).refs.draft) },
        }
        return (
          <DocumentProvider key={x.id} value={doc}>
            <li className="flex">
              <DocumentCard />
              <div className="pt-1">
                <ContentDocumentActions>
                  <ContentDocumentActionsEdit />
                </ContentDocumentActions>
              </div>
            </li>
          </DocumentProvider>
        )
      })}
    </ul>
  )
}

const DocumentPreviewCard = () => {
  const doc = useDocument()!
  return (
    <div className="flex pb-1 pl-1 pt-1">
      <DocumentCard />
      <div className="pt-0.5">
        <ContentDocumentActions
          exclude={[
            'content:document:actions:publish',
            'content:document:actions:delete',
            'content:document:actions:archive',
          ]}
        >
          <Button onClick={() => doc.remove()} variant="ghost" icon={<LinkIcon className="h-4 w-4" />}>
            Unlink
          </Button>
          <ContentDocumentActionsEdit />
        </ContentDocumentActions>
      </div>
    </div>
  )
}
