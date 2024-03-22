import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { doc } from '@firebase/firestore'
import { useRef } from 'react'

import { useLocation, useIntercept } from '@fiar/workbench/router'
import { Button } from '@fiar/components'
import { Header } from '@fiar/workbench'

import { FormProvider, useForm } from '../../../context/field.js'
import { useModel, usePathRef } from '../../../context/model.js'
import { useDocumentMutation } from '../../../context/data.js'
import { useFirestore } from '../../../context/firestore.js'
import { toFirestore } from '../../../util/firebase.js'
import { DocumentFormFields } from '../fields/index.js'
import { DocumentFormTitle } from '../title/index.js'
import { DocumentPublish } from '../save/index.js'

export const DocumentSet = () => {
  const [_, nav] = useLocation()
  const submitted = useRef(false)
  const fs = useFirestore()
  const schema = useModel()
  const path = usePathRef()

  const update = useDocumentMutation({
    onSuccess: () => {
      submitted.current = true
      nav('/')
    },
  })

  const form = useForm({ defaultValues: { data: {} }, criteriaMode: 'firstError', context: { schema } })
  const onSubmit = form.handleSubmit((x) =>
    update.trigger({ type: 'set', data: toFirestore(x.data, false), schema, ref: doc(fs, path) }),
  )

  useIntercept((next) => {
    if (!form.formState.isDirty || submitted.current) return next()
    return window.confirm(`You have unsaved changes that you will loose if you continue`) ? next() : null
  })

  return (
    <FormProvider {...form}>
      <form onSubmit={onSubmit}>
        <Header
          subtitle={path}
          breadcrumbs={
            [
              { children: 'Content', href: '/' },
              { children: <DocumentFormTitle />, href: path },
            ].filter(Boolean) as any[]
          }
        >
          <div className="flex w-full justify-end gap-2 px-3 py-2">
            <Button type="button" onClick={() => nav('/')}>
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
