import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { FormProvider } from 'react-hook-form'
import { useLocation } from 'wouter'

import { Button } from '@fiar/components'
import { Page } from '@fiar/workbench'

import { DocumentFormFields } from '../DocumentFormFields/index.js'
import { DocumentFormTitle } from '../DocumentFormTitle/index.js'
import { DocumentFormSave } from '../DocumentFormSave/index.js'
import { useUpdateForm } from '../DocumentFormHooks/index.js'
import { IContentModel } from '../../schema/index.js'

export const DocumentEdit = (props: IContentModel) => {
  const [form, onSave, onDelete] = useUpdateForm(props.path)
  const [_, nav] = useLocation()

  return (
    <Page>
      <FormProvider {...form}>
        <Page.Header
          subtitle={props.path}
          breadcrumbs={
            [
              { children: 'Content', href: '/' },
              props.type === 'collection' ? { children: props.label, href: props.path.replace(/\/[^\/]+$/, '') } : null,
              { children: <DocumentFormTitle {...props} />, href: props.path },
            ].filter(Boolean) as any[]
          }
        >
          <div className="flex w-full justify-end gap-2">
            <Button color="error" onClick={() => onDelete().then(() => nav('/'))}>
              Delete
            </Button>
            <DocumentFormSave icon={<ArrowUpTrayIcon />} onClick={onSave} title="Save" />
          </div>
        </Page.Header>
        <DocumentFormFields control={form.control} register={form.register} schema={props} />
      </FormProvider>
    </Page>
  )
}
