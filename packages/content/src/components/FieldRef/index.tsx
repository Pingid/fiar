import { ArrowPathIcon, LinkIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { DocumentReference } from '@firebase/firestore'
import { useController } from 'react-hook-form'
import { useState } from 'react'

import { WorkbenchPageModal } from '@fiar/workbench'
import { Button, Field } from '@fiar/components'

import { IntermediateDocumentReference } from '../DocumentFormHooks/index.js'
import { IContentCollection, type IFieldRef } from '../../schema/index.js'
import { fieldError, type FieldComponent } from '../../fields/index.js'
import { SelectDocumentProvider } from '../../context/select.js'
import { DocumentCard } from '../DocumentCard/index.js'
import { trailing } from '../../util/index.js'

export const FieldRef: FieldComponent<IFieldRef> = (props) => {
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
            {/* <LinkIcon className="h-4 w-4" /> */}
            <div />
            <div className="flex items-center gap-1.5">
              <button onClick={() => setEdit(true)}>
                <PencilIcon className="h-3 w-3" />
              </button>
              <button onClick={() => setSelect(true)}>
                <ArrowPathIcon className="h-[.9rem] w-[.9rem]" />
              </button>
              <button onClick={() => field.field.onChange(null)}>
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
          <button className="[&>div]:hover:text-front w-full [&>div]:border-none">
            <DocumentCard model={{ ...target, path: field.field.value.path }} titleField={target.titleField} />
          </button>
        )}
        <SelectDocumentProvider value={onSelect}>
          <WorkbenchPageModal
            open={select}
            close={() => setSelect(false)}
            app="/content"
            initialPath={trailing(target.path)}
            onNav={() => null}
          />
        </SelectDocumentProvider>
        {field.field.value && (
          <WorkbenchPageModal
            open={edit}
            close={() => setEdit(false)}
            app="/content"
            initialPath={`/${trailing(field.field.value.path)}`}
            onNav={() => null}
          />
        )}
        {/* </Field.Control> */}
      </Field.Control>
    </Field>
  )
}
