import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { collection, doc } from '@firebase/firestore'
import { useLocation } from 'wouter'
import { useRef } from 'react'

import { Page, useIntercept } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { useForm, FormProvider } from '../../../context/form.js'
import { useDocumentMutation } from '../../../context/data.js'
import { useFirestore } from '../../../context/firestore.js'
import { toFirestore } from '../../../util/firebase.js'
import { DocumentFormFields } from '../fields/index.js'
import { DocumentFormTitle } from '../title/index.js'
import { useModel } from '../../../context/model.js'
import { DocumentPublish } from '../save/index.js'

export const DocumentAdd = () => {
  const model = useModel()
  const form = useForm({ defaultValues: {}, context: { model, type: 'add' } })
  const firestore = useFirestore()
  const submitted = useRef(false)
  const [_, nav] = useLocation()

  const mutate = useDocumentMutation()

  const onSubmit = form.handleSubmit((x) => {
    const data = toFirestore(firestore, { ...x }, false)
    if (model.type === 'document') {
      return mutate.trigger({ model: model, type: 'set', data, ref: doc(firestore, model.path) })
    }
    return mutate.trigger({ model: model, type: 'add', data, ref: collection(firestore, model.path) })
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
            subtitle={model.path}
            breadcrumbs={[
              { children: 'Content', href: '/' },
              { children: model.label, href: model.path },
              { children: <DocumentFormTitle /> },
            ]}
          >
            <div className="flex w-full justify-end gap-2 px-3 py-2">
              <Button size="sm" type="button" onClick={() => nav(model.path, { replace: true })}>
                Cancel
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
