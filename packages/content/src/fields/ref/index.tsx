import { ArrowPathIcon, LinkIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { DocumentReference, doc } from '@firebase/firestore'
import { useController } from 'react-hook-form'
import { useState } from 'react'

import { WorkbenchPageModal } from '@fiar/workbench'
import { Button, Field } from '@fiar/components'

import { fieldError, type FieldForm, FieldPreview, PreviewField } from '../lib/index.js'
import { IContentCollection, IContentModel, type IFieldRef } from '../../schema/index.js'
import { IntermediateDocumentReference } from '../../util/firebase.js'
import { useDocumentData, useFirestore } from '../../hooks/index.js'
import { SelectDocumentProvider } from '../../context/select.js'
import { trailing } from '../../util/index.js'

export const FormFieldRef: FieldForm<IFieldRef> = (props) => {
  const field = useController(props)
  const error = fieldError(field.fieldState.error)
  const [select, setSelect] = useState(false)
  const [edit, setEdit] = useState(false)
  const isSet = field.field.value?.id && field.field.value?.path
  const target = props.field.of() as IContentCollection
  const onSelect = (ref: DocumentReference) => {
    field.field.onChange(new IntermediateDocumentReference(ref))
    setSelect(false)
  }

  return (
    <Field name={props.name} label={props.field.label} error={error} description={props.field.description}>
      <Field.Control>
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
              <button type="button" onClick={() => field.field.onChange(null)}>
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
            model={{ ...target, path: field.field.value.path }}
            titleField={target.titleField}
            columns={target.columns}
          />
        )}
        <SelectDocumentProvider value={onSelect}>
          <WorkbenchPageModal open={select} close={() => setSelect(false)} path={`/content${trailing(target.path)}`} />
        </SelectDocumentProvider>
        {field.field.value && (
          <WorkbenchPageModal
            open={edit}
            close={() => setEdit(false)}
            path={`/content/${trailing(field.field.value.path)}`}
            static
          />
        )}
      </Field.Control>
    </Field>
  )
}

export const PreviewFieldRef: FieldPreview<IFieldRef> = (props) => {
  return JSON.stringify(props.value)
}

const DocCard = (props: {
  model: IContentModel
  titleField?: string | undefined
  columns: string[]
  onDelete?: () => void
}) => {
  const firestore = useFirestore()
  const data = useDocumentData(doc(firestore, props.model.path))

  return (
    <div className="grid p-2">
      {props.columns.map((key: string) => (
        <div key={key} className="mb-2 flex w-full min-w-0 flex-col">
          <p className="text-front/60 pb-0.5 text-xs leading-none">{props.model.fields[key]?.label || key}</p>
          <PreviewField name={key} field={props.model.fields[key] as any} value={data.data?.data()?.[key]} />
        </div>
      ))}
    </div>
  )
}
