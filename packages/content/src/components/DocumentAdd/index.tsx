import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { FormProvider } from 'react-hook-form'
import { useLocation } from 'wouter'

import { Page } from '@fiar/workbench'

import { DocumentFormFields } from '../DocumentFormFields/index.js'
import { DocumentFormTitle } from '../DocumentFormTitle/index.js'
import { DocumentFormSave } from '../DocumentFormSave/index.js'
import { useAddForm } from '../DocumentFormHooks/index.js'
import { IContentModel } from '../../schema/index.js'

export const DocumentAdd = (props: IContentModel) => {
  const [_, nav] = useLocation()
  const [form, onPublish] = useAddForm(props.path, () => nav(props.path, { replace: true }))

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
