import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { addDoc, collection, doc, setDoc } from '@firebase/firestore'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation } from 'wouter'

import { Page, useIntercept, useStatus } from '@fiar/workbench'

import { DocumentFormFields } from '../DocumentFormFields/index.js'

import { DocumentFormTitle } from '../DocumentFormTitle/index.js'
import { DocumentFormSave } from '../DocumentFormSave/index.js'
import { handleCreateValues } from '../../util/firebase.js'
import { IContentModel } from '../../schema/index.js'
import { useFirestore } from '../../hooks/index.js'
import { useEffect, useRef } from 'react'

export const DocumentAdd = (props: IContentModel) => {
  const handle = useStatus((x) => x.promise)
  const firestore = useFirestore()
  const submitted = useRef(false)
  const [_, nav] = useLocation()
  const form = useForm({ defaultValues: {} })

  const onPublish = form.handleSubmit((x) => {
    const value = handleCreateValues(firestore, x)
    const update =
      props.type === 'document'
        ? setDoc(doc(firestore, props.path), value)
        : addDoc(collection(firestore, props.path), value)

    return handle(props.path, update).then(() => {
      submitted.current = true
      return nav(props.path, { replace: true })
    })
  })

  useIntercept((next) => {
    if (!form.formState.isDirty || submitted.current || Object.keys(form.formState.touchedFields).length === 0) {
      return next()
    }
    return window.confirm(`You have unsaved changes that you will loose if you continue`) ? next() : null
  })

  useEffect(() => void (form.formState.isSubmitted && nav(props.path, { replace: true })), [form.formState.isSubmitted])

  return (
    <Page>
      <FormProvider {...form}>
        <Page.Header
          subtitle={props.path}
          breadcrumbs={[
            { children: 'Content', href: '/' },
            { children: props.label, href: props.path },
            { children: <DocumentFormTitle {...props} />, href: props.path },
          ]}
        >
          <div className="flex w-full justify-end gap-2">
            <DocumentFormSave icon={<ArrowUpTrayIcon />} onClick={onPublish} title="Publish" />
          </div>
        </Page.Header>
        <DocumentFormFields control={form.control} register={form.register} schema={props} />
      </FormProvider>
    </Page>
  )
}
