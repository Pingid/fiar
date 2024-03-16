import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { Button } from '@fiar/components'

import { Header, useIntercept, useLocation } from '@fiar/workbench'

import { FormProvider, useForm } from '../../../context/field.js'
import { useDocumentMutation } from '../../../context/data.js'
import { useFirestore } from '../../../context/firestore.js'
import { toFirestore } from '../../../util/firebase.js'
import { DocumentFormFields } from '../fields/index.js'
import { DocumentFormTitle } from '../title/index.js'
import { useModel } from '../../../context/model.js'
import { DocumentPublish } from '../save/index.js'
import { doc } from '@firebase/firestore'

export const DocumentSet = () => {
  const update = useDocumentMutation()
  const [_, nav] = useLocation()
  const fs = useFirestore()
  const schema = useModel()

  const form = useForm({ criteriaMode: 'firstError', context: { schema } })
  const onSubmit = form.handleSubmit((data) =>
    update
      .trigger({ type: 'set', data: toFirestore(fs, data, false), schema, ref: doc(fs, schema.path) })
      .then(() => form.reset())
      .then(() => nav('/')),
  )

  console.log('out', { ...form.formState })

  useIntercept((next) => {
    console.log('in', { ...form.formState })
    if (!form.formState.isDirty) return next()
    return window.confirm(`You have unsaved changes that you will loose if you continue`) ? next() : null
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <Header
          subtitle={schema.path}
          breadcrumbs={
            [
              { children: 'Content', href: '/' },
              { children: <DocumentFormTitle />, href: schema.path },
            ].filter(Boolean) as any[]
          }
        >
          <div className="flex w-full justify-end gap-2 px-3 py-2">
            <Button type="button" size="sm" onClick={() => nav('/')}>
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
