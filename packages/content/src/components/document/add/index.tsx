import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { collection } from '@firebase/firestore'
import { useLocation } from 'wouter'
import { useRef } from 'react'

import { useIntercept, Header } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { useForm, FormProvider } from '../../../context/field.js'
import { useDocumentMutation } from '../../../context/data.js'
import { useFirestore } from '../../../context/firestore.js'
import { toFirestore } from '../../../util/firebase.js'
import { DocumentFormFields } from '../fields/index.js'
import { DocumentFormTitle } from '../title/index.js'
import { useModel } from '../../../context/model.js'
import { DocumentPublish } from '../save/index.js'

export const DocumentAdd = () => {
  const schema = useModel()
  const form = useForm({ defaultValues: {}, context: { schema: schema } })
  const firestore = useFirestore()
  const submitted = useRef(false)
  const [_, nav] = useLocation()

  const mutate = useDocumentMutation({
    onSuccess: () => {
      const pth = schema.type === 'collection' ? schema.path : '/content'
      nav(pth)
    },
  })

  const onSubmit = form.handleSubmit((x) => {
    const data = toFirestore(firestore, { ...x }, false)
    return mutate.trigger({ schema, type: 'add', data, ref: collection(firestore, schema.path) })
  })

  useIntercept((next) => {
    const valid = !form.formState.isDirty || submitted.current || Object.keys(form.formState.touchedFields).length === 0
    if (valid) return next()
    return window.confirm(`You have unsaved changes that you will loose if you continue`) ? next() : null
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <Header
          subtitle={schema.path}
          breadcrumbs={[
            { children: 'Content', href: '/' },
            { children: schema.label, href: schema.path },
            { children: <DocumentFormTitle /> },
          ]}
        >
          <div className="flex w-full justify-end gap-2 px-3 py-2">
            <Button size="sm" type="button" onClick={() => nav(schema.path, { replace: true })}>
              Cancel
            </Button>
            <DocumentPublish icon={<ArrowUpTrayIcon />} onClick={onSubmit} title="Publish" />
          </div>
        </Header>
        <DocumentFormFields schema={schema} />
      </form>
    </FormProvider>
  )
}
