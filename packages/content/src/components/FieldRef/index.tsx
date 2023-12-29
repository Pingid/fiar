import { DocumentIcon } from '@heroicons/react/24/outline'
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

export const FieldRef: FieldComponent<IFieldRef> = (props) => {
  const field = useController(props)
  const error = fieldError(field.fieldState.error)
  const [open, setOpen] = useState(false)
  const isSet = field.field.value?.id && field.field.value?.path
  const target = props.field.of() as IContentCollection
  const onSelect = (ref: DocumentReference) => {
    field.field.onChange(new IntermediateDocumentReference(ref))
    setOpen(false)
  }

  return (
    <Field name={props.name} label={props.field.label} error={error} description={props.field.description}>
      <Field.Control className="p-1">
        <div className="p-1">
          {!isSet && (
            <div className="flex w-full items-center justify-center p-3">
              <Button icon={<DocumentIcon />} color="active" onClick={() => setOpen(true)}>
                Select {target.label || target.path}
              </Button>
            </div>
          )}

          {isSet && (
            <button onClick={() => setOpen(true)} className="w-full">
              <DocumentCard model={target} titleField={target.titleField} />
            </button>
          )}

          <SelectDocumentProvider value={onSelect}>
            <WorkbenchPageModal open={open} close={() => setOpen(false)} app="/content" initialPath={target.path} />
          </SelectDocumentProvider>
        </div>
      </Field.Control>
    </Field>
  )
}
