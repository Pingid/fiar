import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useEffect, useMemo, useRef } from 'react'
import { doc } from '@firebase/firestore'

import { useIntercept, useLocation } from '@fiar/workbench/router'
import { Button, LoadingDots } from '@fiar/components'
import { Header } from '@fiar/workbench'

import { parameterize, useModel, usePathRef } from '../../../context/model.js'
import { useDocData, useDocumentMutation } from '../../../context/data.js'
import { fromFirestore, toFirestore } from '../../../util/firebase.js'
import { FormProvider, useForm } from '../../../context/field.js'
import { useFirestore } from '../../../context/firestore.js'
import { DocumentFormFields } from '../fields/index.js'
import { DocumentFormTitle } from '../title/index.js'
import { DocumentPublish } from '../save/index.js'

export const DocumentUpdate = () => {
  const [_, nav] = useLocation()
  const data = useDocData()
  const schema = useModel()
  const path = usePathRef()

  const snapshot = data.data
  const breadcrumbs = [
    { children: 'Content', href: '/' },
    { children: schema.label, href: path },
  ]

  const value = useMemo(() => {
    if (!data.data) return null
    return { data: fromFirestore(data.data.data()) }
  }, [data.data])

  if (data.isLoading) {
    return (
      <Header subtitle={path} breadcrumbs={breadcrumbs}>
        <div className="flex w-full justify-end gap-2 px-3 py-2">
          <div>
            <LoadingDots />
          </div>
        </div>
      </Header>
    )
  }

  if (!snapshot?.exists() || !value) {
    return (
      <Header subtitle={path} breadcrumbs={breadcrumbs}>
        <div className="flex w-full justify-between gap-2 px-3 py-2">
          <div>Missing document</div>
          <Button type="button" onClick={() => nav('/')}>
            Back
          </Button>
        </div>
      </Header>
    )
  }

  return (
    <DocumentUpdateForm defaultValues={value} onBack={() => nav(schema.type === 'collection' ? schema.path : '/')} />
  )
}

export const DocumentUpdateForm = (props: { defaultValues: { data: Record<string, any> }; onBack: () => void }) => {
  const mutate = useDocumentMutation()
  const firestore = useFirestore()
  const submit = useRef(false)
  const schema = useModel()
  const path = usePathRef()

  const ref = doc(firestore, path)
  const form = useForm({ criteriaMode: 'firstError', context: { schema }, ...props })

  const onSubmit = form.handleSubmit((x) => {
    return mutate.trigger({ schema, type: 'update', data: toFirestore(x.data, true), ref })
  })

  const onDelete = () => mutate.trigger({ schema, ref, type: 'delete' }).then(() => props.onBack())

  useEffect(() => {
    if (form.formState.isSubmitting) {
      submit.current = true
    } else if (form.formState.isSubmitSuccessful && submit.current) {
      submit.current = false
      form.reset(form.getValues())
    } else if (props.defaultValues) {
      form.reset(props.defaultValues, { keepDirty: true, keepDirtyValues: true, keepErrors: true })
    }
  }, [props.defaultValues, form.formState.isSubmitSuccessful, form.formState.isSubmitting])

  useIntercept((next) => {
    if (!form.formState.isDirty) return next()
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
              schema.type === 'collection' ? { children: schema.label, href: parameterize(schema.path) } : null,
              { children: <DocumentFormTitle />, href: path },
            ].filter(Boolean) as any[]
          }
        >
          <div className="flex w-full justify-end gap-2 px-3 py-2">
            <Button type="button" color="error" onClick={() => onDelete()}>
              Delete
            </Button>
            <DocumentPublish icon={<ArrowUpTrayIcon />} onClick={onSubmit} title="Publish" />
          </div>
        </Header>
        <DocumentFormFields schema={schema} />
      </form>
    </FormProvider>
  )
}
