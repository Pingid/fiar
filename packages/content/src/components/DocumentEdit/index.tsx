import { deleteDoc, doc, updateDoc } from '@firebase/firestore'
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation } from 'wouter'
import { useEffect } from 'react'

import { Page, useIntercept, useStatus } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { handleRecieveValues, handleUpdateValues } from '../../util/firebase.js'
import { useDocumentData, useFirestore } from '../../hooks/index.js'
import { DocumentFormFields } from '../DocumentFormFields/index.js'
import { DocumentFormTitle } from '../DocumentFormTitle/index.js'
import { DocumentFormSave } from '../DocumentFormSave/index.js'
import { IContentModel } from '../../schema/index.js'

export const DocumentEdit = (props: IContentModel) => {
  const [_, nav] = useLocation()

  const handle = useStatus((x) => x.promise)
  const firestore = useFirestore()
  const ref = doc(firestore, props.path)

  const data = useDocumentData(ref, { once: true })

  const form = useForm({ criteriaMode: 'firstError', defaultValues: handleRecieveValues(data.data?.data()) })

  const onSave = form.handleSubmit((x) =>
    handle(props.path, updateDoc(ref, handleUpdateValues(firestore, x))).then(() => form.reset(handleRecieveValues(x))),
  )

  const onDelete = () => handle(props.path, deleteDoc(ref))

  useEffect(() => {
    if (!data.data) return
    form.reset(handleRecieveValues(data.data.data()), { keepDirty: true, keepDirtyValues: true })
  }, [data.data])

  const exists = !!data.data?.exists()

  useIntercept((next) => {
    if (!form.formState.isDirty) return next()
    return window.confirm(`You have unsaved changes that you will loose if you continue`) ? next() : null
  })

  return (
    <Page>
      <FormProvider {...form}>
        <Page.Header
          subtitle={props.path}
          breadcrumbs={
            [
              { children: 'Content', href: '/' },
              props.type === 'collection' ? { children: props.label, href: props.path.replace(/\/[^\/]+$/, '') } : null,
              { children: <DocumentFormTitle {...props} />, href: props.path },
            ].filter(Boolean) as any[]
          }
        >
          <div className="flex w-full justify-end gap-2">
            <Button color="error" disabled={!exists} onClick={() => onDelete().then(() => nav('/'))}>
              Delete
            </Button>
            <DocumentFormSave icon={<ArrowUpTrayIcon />} onClick={onSave} title="Save" />
          </div>
        </Page.Header>
        <DocumentFormFields control={form.control} register={form.register} schema={props} />
      </FormProvider>
    </Page>
  )
}
