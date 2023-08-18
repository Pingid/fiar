import { component, WorkbenchPageModal } from '@fiar/workbench'
import { Button, Control } from '@fiar/components'
import { doc } from '@firebase/firestore'
import React, { useState } from 'react'

import { DocumentProvider, useDocument } from '../../context/document'
import { CollectionProvider } from '../../context/collection'
import { ContentDocumentActions } from '../document-actions'
import { useConfig } from '../../context/config'
import { DocumentCard } from '../document-card'
import { useField } from '../../context/field'
import { EditIcon, LinkIcon } from '../icons'
import { FieldRef } from '../../schema'

export const ContentFieldRef = component('content:field:ref', () => {
  const field = useField<FieldRef>({ equal: (a, b) => a?.path === b?.path })
  const [open, setopen] = React.useState(false)
  const config = useConfig()
  const value = field.value()
  const to = field.options.to()
  const document = value?.id
    ? {
        ...to.document(value.id),
        actions: { select: () => setopen(true), remove: () => field.update(null) },
      }
    : null

  return (
    <Control ref={field.ref} error={field.error} label={field.options.label}>
      <CollectionProvider value={to}>
        <DocumentProvider value={document}>
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
          <WorkbenchPageModal
            open={open}
            close={() => setopen(false)}
            path={`/content/draft/${to.ref}`}
            onNav={(x) => {
              const [_all, id] = new RegExp(`\/content\/draft\/${to.ref}\/(.*?)\/?$`).exec(x) || []
              if (id) {
                const ref = [config.contentPrefix, 'draft', to.ref, id]
                field.update(doc(config.firestore, ref.join('/')))
                setopen(false)
              }
              return null
            }}
          />
        </DocumentProvider>
      </CollectionProvider>
    </Control>
  )
})

const DocumentPreviewCard = () => {
  const [open, setopen] = useState(false)

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
          <Button onClick={() => setopen(true)} variant="ghost" icon={<EditIcon className="h-4 w-4" />}>
            Edit
          </Button>
        </ContentDocumentActions>
        <WorkbenchPageModal
          open={open}
          close={() => setopen(false)}
          path={`/content/draft/${doc.ref}`}
          // onNav={(x) => {
          //   // const [_all, id] = new RegExp(`\/content\/draft\/${to.ref}\/(.*?)\/?$`).exec(x) || []
          //   // if (id) {
          //   //   const ref = [config.contentPrefix, 'draft', to.ref, id]
          //   //   field.update(doc(config.firestore, ref.join('/')))
          //   //   setopen(false)
          //   // }
          //   return null
          // }}
        />
      </div>
    </div>
  )
}
