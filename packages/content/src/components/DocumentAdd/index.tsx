import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { addDoc, collection, doc, setDoc } from '@firebase/firestore'
import { useLocation } from 'wouter'
import { useRef } from 'react'

import { Page, useIntercept } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { DocumentFormFields } from '../DocumentFormFields/index.js'

import {
  useDocumentForm,
  DocumentFormProvider,
  useDocumentHooks,
  DocumentHooksProvider,
} from '../../context/document.js'
import { DocumentFormTitle } from '../DocumentFormTitle/index.js'
import { DocumentPublish } from '../DocumentFormSave/index.js'
import { toFirestore } from '../../util/firebase.js'
import { IContentModel } from '../../schema/index.js'
import { useFirestore } from '../../hooks/index.js'

export const DocumentAdd = (props: IContentModel) => {
  const form = useDocumentForm({ defaultValues: {}, context: { model: props, status: 'create' } })
  const firestore = useFirestore()
  const hooks = useDocumentHooks()
  const submitted = useRef(false)
  const [_, nav] = useLocation()

  const onSubmit = form.handleSubmit((x) => {
    const transformed = toFirestore(firestore, { ...x }, false)
    const type = props.type === 'document' ? 'set' : 'add'

    return hooks.current
      .reduce((next, hook) => next.then((x) => hook(x, type)), Promise.resolve(transformed))
      .then((value) => {
        if (props.type === 'document') return setDoc(doc(firestore, props.path), value)
        return addDoc(collection(firestore, props.path), value).then(() => {})
      })
      .then(() => {
        submitted.current = true
        nav(props.path, { replace: true })
      })
  })

  useIntercept((next) => {
    const valid = !form.formState.isDirty || submitted.current || Object.keys(form.formState.touchedFields).length === 0
    if (valid) return next()
    return window.confirm(`You have unsaved changes that you will loose if you continue`) ? next() : null
  })

  return (
    <Page>
      <DocumentHooksProvider value={hooks}>
        <DocumentFormProvider {...form}>
          <form onSubmit={onSubmit}>
            <Page.Header
              subtitle={props.path}
              breadcrumbs={[
                { children: 'Content', href: '/' },
                { children: props.label, href: props.path },
                { children: <DocumentFormTitle {...props} />, href: props.path },
              ]}
            >
              <div className="flex w-full justify-end gap-2 px-3 py-2">
                <Button size="sm" type="button" onClick={() => nav(props.path, { replace: true })}>
                  Cancel
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
