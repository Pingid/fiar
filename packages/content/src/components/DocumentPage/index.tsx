import { Control, FormProvider, UseFormRegister, useFormContext } from 'react-hook-form'
import { ArrowUpTrayIcon, CircleStackIcon } from '@heroicons/react/24/outline'
import { Route, useLocation } from 'wouter'

import { UseExtension } from '@fiar/workbench/extensions'
import { Button } from '@fiar/components'
import { Page } from '@fiar/workbench'

import { IContentCollection, IContentDocument, IFields } from '../../schema/index.js'
import { useCreateForm, useUpdateForm } from './hooks/index.js'
import { FieldMissing } from '../FieldMissing/index.js'
import { DocumentTitle } from './DocumentTitle/index.js'
import { LayoutHeader } from '../Layout/index.js'

export const Document = (props: { schema: IContentDocument<any, any> | IContentCollection<any, any> }) => {
  return (
    <>
      <Route path={`/create${props.schema.path}`}>
        <Page>
          <Page.Breadcrumb title="Content" href="" icon={<CircleStackIcon />} />
          <CreateDocument schema={props.schema} />
        </Page>
      </Route>
      <Route path={props.schema.path}>
        <Page>
          <Page.Breadcrumb title="Content" href="" icon={<CircleStackIcon />} />
          <UpdateDocument schema={props.schema} path={props.schema.path} />
        </Page>
      </Route>
    </>
  )
}

export const CreateDocument = (props: { schema: IContentDocument<any, any> | IContentCollection<any, any> }) => {
  const [_, nav] = useLocation()
  const [form, onPublish] = useCreateForm(props.schema, () => nav(props.schema.path, { replace: true }))

  return (
    <FormProvider {...form}>
      <LayoutHeader title={<DocumentTitle schema={props.schema} />} path={`${props.schema.path}/{...}`}>
        <div className="flex w-full justify-end gap-2">
          <SaveButton icon={<ArrowUpTrayIcon />} onClick={onPublish} title="Publish" />
        </div>
      </LayoutHeader>
      <DocumentFields control={form.control} register={form.register} schema={props.schema} />
    </FormProvider>
  )
}

export const UpdateDocument = (props: {
  schema: IContentDocument<any, any> | IContentCollection<any, any>
  path: string
}) => {
  const [form, onSave, onDelete] = useUpdateForm(props.schema, props.path)
  const back = props.schema.nodeId === 'collection' ? props.schema.path : '/'
  const [_, nav] = useLocation()

  return (
    <FormProvider {...form}>
      <LayoutHeader title={<DocumentTitle schema={props.schema} />} path={props.path}>
        <div className="flex w-full justify-end gap-2">
          <Button color="error" onClick={() => onDelete().then(() => nav(back))}>
            Delete
          </Button>
          <SaveButton icon={<ArrowUpTrayIcon />} onClick={onSave} title="Save" />
        </div>
      </LayoutHeader>
      <DocumentFields control={form.control} register={form.register} schema={props.schema} />
    </FormProvider>
  )
}

const SaveButton = (props: { title: string; icon: React.ReactNode; onClick: () => void }) => {
  const form = useFormContext()
  const disabled = !form.formState.isDirty || form.formState.isLoading

  return (
    <>
      <Button color="published" icon={props.icon} onClick={props.onClick} isDisabled={disabled}>
        {props.title}
      </Button>
    </>
  )
}

const DocumentFields = (props: {
  schema: IContentDocument<any, any> | IContentCollection<any, any>
  register: UseFormRegister<Record<string, any>>
  control: Control<Record<string, any>, any>
}) => {
  return (
    <div className="mx-auto mb-32 max-w-5xl space-y-6 p-4 py-6">
      {Object.keys(props.schema.fields).map((key) => {
        const field = props.schema.fields[key] as IFields
        const name = key
        return (
          <UseExtension
            key={name}
            extension={field.component}
            props={{ ...props, name, field: { ...field, label: field.label ?? key } }}
            fallback={<FieldMissing field={field} />}
          />
        )
      })}
    </div>
  )
}
