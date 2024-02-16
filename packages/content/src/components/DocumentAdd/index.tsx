import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { addDoc, collection, doc, setDoc } from '@firebase/firestore'
import { FormProvider, useForm } from 'react-hook-form'
import { useLocation } from 'wouter'
import { useRef } from 'react'

import { Page, useIntercept, useStatus } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { DocumentFormFields } from '../DocumentFormFields/index.js'

import { DocumentFormTitle } from '../DocumentFormTitle/index.js'
import { DocumentPublish } from '../DocumentFormSave/index.js'
import { handleCreateValues } from '../../util/firebase.js'
import { IContentModel } from '../../schema/index.js'
import { useFirestore } from '../../hooks/index.js'

export const DocumentAdd = (props: IContentModel) => {
  const handle = useStatus((x) => x.promise)
  const firestore = useFirestore()
  const submitted = useRef(false)
  const [_, nav] = useLocation()
  const form = useForm({ defaultValues: {} })

  const onSubmit = form.handleSubmit((x) => {
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
    const valid = !form.formState.isDirty || submitted.current || Object.keys(form.formState.touchedFields).length === 0
    if (valid) return next()
    return window.confirm(`You have unsaved changes that you will loose if you continue`) ? next() : null
  })

  return (
    <Page>
      <FormProvider {...form}>
        <form onSubmit={onSubmit}>
          <Page.Header
            subtitle={props.path}
            breadcrumbs={[
              { children: 'Content', href: '/' },
              { children: props.label, href: props.path },
              { children: <DocumentFormTitle {...props} />, href: props.path },
            ]}
          >
            <div className="flex w-full justify-end gap-2">
              <Button type="button" onClick={() => nav(props.path, { replace: true })}>
                Cancel
              </Button>
              <DocumentPublish icon={<ArrowUpTrayIcon />} onClick={onSubmit} title="Publish" />
            </div>
          </Page.Header>

          <DocumentFormFields control={form.control} register={form.register} schema={props} />
        </form>
      </FormProvider>
    </Page>
  )
}
