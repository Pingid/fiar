import { ArrowPathIcon, DocumentDuplicateIcon, LinkIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { DocumentReference, doc } from '@firebase/firestore'
import { useState } from 'react'

import { Button, Field, FieldControl } from '@fiar/components'
import { WorkbenchPageModal } from '@fiar/workbench'

import { PreviewField, useFieldPreview, useFieldForm, useFormFieldControl, registerField } from '../../context/field.js'
import { IContentCollection, IContentModel, type IFieldRef } from '../../schema/index.js'
import { useDocumentSnapshot, useFirestore } from '../../context/firestore.js'
import { EnumerableDocumentReference } from '../../util/firebase.js'
import { SelectDocumentProvider } from '../../context/select.js'
import { useDocumentHook } from '../../context/hooks.js'
import { trailing } from '../../util/index.js'

export const FormFieldRef = () => {
  const field = useFieldForm<IFieldRef>()
  const controller = useFormFieldControl<IFieldRef>({ rules: { required: !field.schema.optional } })

  const [select, setSelect] = useState(false)
  const [edit, setEdit] = useState(false)
  const isSet = controller.field.value?.id && controller.field.value?.path
  const target = field.schema.of() as IContentCollection
  const onSelect = (ref: DocumentReference) => {
    controller.field.onChange(new EnumerableDocumentReference(ref))
    setSelect(false)
  }

  useDocumentHook((x) => {
    console.log(x)
    return x
  })

  return (
    <Field {...field}>
      <FieldControl ref={controller.field.ref}>
        {isSet && (
          <div className="bg-back flex w-full justify-between border-b p-1 px-2">
            <div className="flex items-center gap-1">
              <DocumentDuplicateIcon className="relative -top-[1px] h-4 w-4" />
              {target.label}
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={() => setEdit(true)}>
                <PencilIcon className="h-3 w-3" />
              </button>
              <button type="button" onClick={() => setSelect(true)}>
                <ArrowPathIcon className="h-[.9rem] w-[.9rem]" />
              </button>
              <button type="button" onClick={() => controller.field.onChange(null)}>
                <XMarkIcon className="h-[1.1rem] w-[1.1rem]" />
              </button>
            </div>
          </div>
        )}
        {!isSet && (
          <div className="flex w-full items-center justify-center p-3">
            <Button size="lg" icon={<LinkIcon />} color="active" onClick={() => setSelect(true)}>
              Select {target.label || target.path}
            </Button>
          </div>
        )}

        {isSet && (
          <DocCard
            model={{ ...target, path: controller.field.value.path as `/${string}` }}
            titleField={target?.layout?.titleField}
            columns={target?.layout?.columns || Object.keys(target.fields)}
          />
        )}
        <SelectDocumentProvider value={onSelect}>
          <WorkbenchPageModal open={select} close={() => setSelect(false)} path={`/content${trailing(target.path)}`} />
        </SelectDocumentProvider>
        {controller.field.value && controller.field.value.path && (
          <WorkbenchPageModal
            open={edit}
            close={() => setEdit(false)}
            path={`/content/${trailing(controller.field.value.path)}`}
            static
          />
        )}
      </FieldControl>
    </Field>
  )
}

export const PreviewFieldRef = () => {
  const field = useFieldPreview<IFieldRef>()
  return <>{(field as any).value.path}</>
}

registerField('ref', { form: FormFieldRef, preview: PreviewFieldRef })

const DocCard = (props: {
  model: IContentModel
  titleField?: string | undefined
  columns: string[]
  onDelete?: () => void
}) => {
  const firestore = useFirestore()
  const data = useDocumentSnapshot(doc(firestore, props.model.path))

  return (
    <div className="grid gap-1 p-2 sm:grid-flow-col-dense sm:gap-3">
      {props.columns.map((key: string) => (
        <div key={key} className="mb-2 flex w-full min-w-0 flex-col text-sm">
          <p className="text-front/60 text-xs">{props.model.fields[key]?.label || key}</p>
          <PreviewField name={key} schema={props.model.fields[key] as any} value={data.data?.data()?.[key]} />
        </div>
      ))}
    </div>
  )
}
