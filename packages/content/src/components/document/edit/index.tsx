import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { doc } from '@firebase/firestore'
import { useLocation } from 'wouter'
import { useEffect } from 'react'

import { Page, useIntercept } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { useDocumentSnapshot, useFirestore } from '../../../context/firestore.js'
import { parameterize, useModel, usePathRef } from '../../../context/model.js'
import { fromFirestore, toFirestore } from '../../../util/firebase.js'
import { FormProvider, useForm } from '../../../context/form.js'
import { useDocumentMutation } from '../../../context/data.js'
import { DocumentFormFields } from '../fields/index.js'
import { DocumentFormTitle } from '../title/index.js'
import { DocumentPublish } from '../save/index.js'

export const DocumentEdit = () => {
  const [_, nav] = useLocation()
  const model = useModel()
  const path = usePathRef()

  const firestore = useFirestore()
  const ref = doc(firestore, path)
  const data = useDocumentSnapshot(ref, { once: true })
  const form = useForm({ criteriaMode: 'firstError', context: { model: model, type: 'update' } })
  const mutate = useDocumentMutation()

  const onSubmit = form.handleSubmit((value) =>
    mutate
      .trigger({ model: model, type: 'update', data: toFirestore(firestore, value, true), ref })
      .then(() => form.reset(value)),
  )

  const onDelete = () => mutate.trigger({ model: model, ref, type: 'delete' }).then(() => nav('/'))

  useEffect(() => {
    if (!data.data) return
    form.reset(fromFirestore(data.data.data()), { keepDirty: true, keepDirtyValues: true })
  }, [data.data])

  const exists = !!data.data?.exists()

  useIntercept((next) => {
    if (!form.formState.isDirty) return next()
    return window.confirm(`You have unsaved changes that you will loose if you continue`) ? next() : null
  })

  return (
    <Page>
      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <Page.Header
            subtitle={path}
            breadcrumbs={
              [
                { children: 'Content', href: '/' },
                model.type === 'collection' ? { children: model.label, href: parameterize(model.path) } : null,
                { children: <DocumentFormTitle />, href: path },
              ].filter(Boolean) as any[]
            }
          >
            <div className="flex w-full justify-end gap-2 px-3 py-2">
              <Button type="button" color="error" size="sm" disabled={!exists} onClick={() => onDelete()}>
                Delete
              </Button>
              <DocumentPublish icon={<ArrowUpTrayIcon />} onClick={onSubmit} title="Publish" />
            </div>
          </Page.Header>
          <DocumentFormFields control={form.control} register={form.register} schema={model} />
        </form>
      </FormProvider>
    </Page>
  )
}
