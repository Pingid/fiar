import { deleteDoc, doc, updateDoc } from '@firebase/firestore'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useLocation } from 'wouter'
import { useEffect } from 'react'

import { Page, useIntercept, useStatus } from '@fiar/workbench'
import { Button } from '@fiar/components'

import {
  DocumentFormProvider,
  DocumentHooksProvider,
  useDocumentForm,
  useDocumentHooks,
} from '../../context/document.js'
import { fromFirestore, toFirestore } from '../../util/firebase.js'
import { useDocumentData, useFirestore } from '../../hooks/index.js'
import { DocumentFormFields } from '../DocumentFormFields/index.js'
import { DocumentFormTitle } from '../DocumentFormTitle/index.js'
import { DocumentPublish } from '../DocumentFormSave/index.js'
import { IContentModel } from '../../schema/index.js'

export const DocumentEdit = (props: IContentModel) => {
  const [_, nav] = useLocation()

  const handle = useStatus((x) => x.promise)
  const firestore = useFirestore()
  const ref = doc(firestore, props.path)
  const hooks = useDocumentHooks()

  const data = useDocumentData(ref, { once: true })

  const form = useDocumentForm({
    criteriaMode: 'firstError',
    context: { model: props, status: 'update' },
  })

  const onSubmit = form.handleSubmit((value) => {
    const transformed = toFirestore(firestore, value, true)
    return data.mutate(
      (x) =>
        hooks.current
          .reduce((next, hook) => next.then((y) => hook(y, 'update')), Promise.resolve(transformed))
          .then((values) =>
            handle(props.path, updateDoc(ref, values)).then(() => {
              const next = fromFirestore(values)
              form.reset(next)
              return x ? Object.assign(x, { data: () => next }) : undefined
            }),
          ),
      { revalidate: true },
    )
  })

  const onDelete = () => (deleteDoc(ref), nav(props.type === 'collection' ? props.path.replace(/\/[^\/]+$/g, '') : '/'))

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
      <DocumentHooksProvider value={hooks}>
        <DocumentFormProvider {...form}>
          <form onSubmit={onSubmit}>
            <Page.Header
              subtitle={props.path}
              breadcrumbs={
                [
                  { children: 'Content', href: '/' },
                  props.type === 'collection'
                    ? { children: props.label, href: props.path.replace(/\/[^\/]+$/, '') }
                    : null,
                  { children: <DocumentFormTitle {...props} />, href: props.path },
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
            <DocumentFormFields control={form.control} register={form.register} schema={props} />
          </form>
        </DocumentFormProvider>
      </DocumentHooksProvider>
    </Page>
  )
}
