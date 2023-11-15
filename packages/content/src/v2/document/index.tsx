import { ArrowUpTrayIcon, CircleStackIcon, DocumentIcon, DocumentPlusIcon } from '@heroicons/react/24/outline'
import { FormProvider, useFormContext } from 'react-hook-form'
import { useLocation, useRoute } from 'wouter'
import { memo } from 'react'

import { RenderComponent } from '@fiar/workbench/v2/components'
import { Page } from '@fiar/workbench/v2'

import { IContentCollection, IContentDocument, struct } from '../schema/index.js'
import { useCreateForm, useUpdateForm } from './form/index.js'
import { DocumentFormTitle } from './title/index.js'
import { abs } from '../util/index.js'

export const Document = memo((props: { schema: IContentDocument<any, any> | IContentCollection<any, any> }) => {
  const [create] = useRoute('/create/*')

  return (
    <Page>
      <Page.Breadcrumb title="Content" href="" icon={<CircleStackIcon />} />
      {create ? (
        <CreateDocument schema={props.schema} />
      ) : (
        <UpdateDocument schema={props.schema} path={props.schema.path} />
      )}
    </Page>
  )
})

export const CreateDocument = (props: { schema: IContentDocument<any, any> | IContentCollection<any, any> }) => {
  const [_, nav] = useLocation()
  const [form, onPublish] = useCreateForm(props.schema, () => nav(abs(props.schema.path), { replace: true }))

  return (
    <FormProvider {...form}>
      <Page.Breadcrumb title={<DocumentFormTitle schema={props.schema} />} icon={<DocumentPlusIcon />} />
      <SaveButton icon={<ArrowUpTrayIcon />} onClick={onPublish} title="Publish" />
      <div className="p-4">
        <RenderComponent
          component="field:struct"
          props={{ control: form.control, register: form.register, name: '', field: struct(props.schema) }}
        />
      </div>
    </FormProvider>
  )
}

export const UpdateDocument = (props: {
  schema: IContentDocument<any, any> | IContentCollection<any, any>
  path: string
}) => {
  const [form, onSave, onDelete] = useUpdateForm(props.schema, props.path)
  const back = props.schema.nodeId === 'collection' ? abs(props.schema.path) : '/'
  const [_, nav] = useLocation()

  return (
    <FormProvider {...form}>
      <Page.Breadcrumb title={<DocumentFormTitle schema={props.schema} />} icon={<DocumentIcon />} />
      <SaveButton icon={<ArrowUpTrayIcon />} onClick={onSave} title="Save" />
      <Page.ActionButton color="error" onClick={() => onDelete().then(() => nav(back))}>
        Delete
      </Page.ActionButton>
      <div className="p-4">
        <RenderComponent
          component="field:struct"
          props={{ control: form.control, register: form.register, name: '', field: struct(props.schema) }}
        />
      </div>
    </FormProvider>
  )
}

const SaveButton = (props: { title: string; icon: React.ReactNode; onClick: () => void }) => {
  const form = useFormContext()
  const disabled = !form.formState.isDirty || form.formState.isLoading

  return (
    <Page.ActionButton color="published" icon={props.icon} onClick={props.onClick} disabled={disabled}>
      {props.title}
    </Page.ActionButton>
  )
}
