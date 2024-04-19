import { collection } from '@firebase/firestore'
import { useRef } from 'react'

import { useIntercept, useLocation } from '@fiar/workbench/router'
import { Header } from '@fiar/workbench'

import { useForm, FormProvider } from '../../../context/field.js'
import { useDocumentMutation } from '../../../context/data.js'
import { useFirestore } from '../../../context/firestore.js'
import { toFirestore } from '../../../util/firebase.js'
import { DocumentFormFields } from '../fields/index.js'
import { DocumentFormTitle } from '../title/index.js'
import { useModel } from '../../../context/model.js'
import { DocumentPublish } from '../save/index.js'
import { Button } from '@nextui-org/react'

export const DocumentAdd = () => {
  const schema = useModel()
  const form = useForm({ defaultValues: { data: {} }, context: { schema: schema } })
  const firestore = useFirestore()
  const submitted = useRef(false)
  const [_, nav] = useLocation()

  const mutate = useDocumentMutation({
    onSuccess: () => {
      const pth = schema.type === 'collection' ? schema.path : '/content'
      submitted.current = true
      nav(pth)
    },
  })

  const ref = collection(firestore, schema.path)
  const onSubmit = form.handleSubmit((x) => {
    return mutate.trigger({ schema, type: 'add', data: toFirestore(x.data, false), ref })
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
            <Button
              type="button"
              color="default"
              variant="bordered"
              onClick={() => nav(schema.path, { replace: true })}
            >
              Cancel
            </Button>
            <DocumentPublish onClick={onSubmit} title="Publish" />
          </div>
        </Header>
        <DocumentFormFields schema={schema} />
      </form>
    </FormProvider>
  )
}
