import { ArrowPathIcon, LinkIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { DocumentReference, doc } from '@firebase/firestore'
import { useController } from 'react-hook-form'
import { useState } from 'react'

import { Button, Field, FieldControl } from '@fiar/components'
import { WorkbenchPageModal } from '@fiar/workbench'

import { IContentCollection, IContentModel, type IFieldRef } from '../../schema/index.js'
import { useDocumentSnapshot, useFirestore } from '../../context/firestore.js'
import { IntermediateDocumentReference } from '../../util/firebase.js'
import { FieldPreview, useFormField } from '../../context/field.js'
import { SelectDocumentProvider } from '../../context/select.js'
import { trailing } from '../../util/index.js'

export const FormFieldRef = () => {
  const field = useFormField<IFieldRef>()
  const controller = useController(field)

  const [select, setSelect] = useState(false)
  const [edit, setEdit] = useState(false)
  const isSet = controller.field.value?.id && controller.field.value?.path
  const target = field.schema.of() as IContentCollection
  const onSelect = (ref: DocumentReference) => {
    controller.field.onChange(new IntermediateDocumentReference(ref))
    setSelect(false)
  }

  return (
    <Field name={field.name} label={field.schema.label} error={field.error} description={field.schema.description}>
      <FieldControl>
        {isSet && (
          <div className="bg-back flex w-full justify-between border-b p-1 px-2">
            <div />
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
            <Button icon={<LinkIcon />} color="active" onClick={() => setSelect(true)}>
              Select {target.label || target.path}
            </Button>
          </div>
        )}

        {isSet && (
          <DocCard
            model={{ ...target, path: controller.field.value.path }}
            titleField={target.titleField}
            columns={target.columns}
          />
        )}
        <SelectDocumentProvider value={onSelect}>
          <WorkbenchPageModal open={select} close={() => setSelect(false)} path={`/content${trailing(target.path)}`} />
        </SelectDocumentProvider>
        {controller.field.value && (
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

export const PreviewFieldRef: FieldPreview<IFieldRef> = (props) => {
  return <>{(props as any).value.path}</>
}

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
        <div key={key} className="mb-2 flex w-full min-w-0 flex-col leading-none">
          <p className="text-front/60 pb-2 text-xs leading-none">{props.model.fields[key]?.label || key}</p>
          <FieldPreview name={key} field={props.model.fields[key] as any} value={data.data?.data()?.[key]} />
        </div>
      ))}
    </div>
  )
}
