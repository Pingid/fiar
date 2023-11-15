import { DocumentIcon } from '@heroicons/react/24/outline'
import { DocumentReference } from '@firebase/firestore'
import { useController } from 'react-hook-form'
import { useState } from 'react'

import { RenderComponent, WorkbenchPageModal } from '@fiar/workbench/v2'
import { Button, Field } from '@fiar/components'

import { IContentCollection, defineDocument, type IFieldRef } from '../../../schema/index.js'
import { IntermediateDocumentReference } from '../../../document/form/index.js'
import { fieldError, type FieldComponent } from '../../../field/index.js'
import { SelectDocumentProvider } from '../../../context/index.js'
import { abs } from '../../../util/index.js'

export const FieldRef: FieldComponent<IFieldRef<IContentCollection<any, any>>> = (props) => {
  const field = useController(props)
  const error = fieldError(field.fieldState.error)
  const [open, setOpen] = useState(false)
  const isSet = field.field.value?.id && field.field.value?.path
  const target = props.field.to()
  const onSelect = (ref: DocumentReference) => {
    field.field.onChange(new IntermediateDocumentReference(ref))
    setOpen(false)
  }

  return (
    <Field label={props.field.label} error={error}>
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
              <RenderComponent
                component="document:card"
                props={{
                  document: defineDocument({ ...target, label: '', path: `${target.path}/${field.field.value?.id}` }),
                  titleField: target.titleField as any,
                }}
              />
            </button>
          )}

          <SelectDocumentProvider value={onSelect}>
            <WorkbenchPageModal
              open={open}
              close={() => setOpen(false)}
              app="/content"
              initialPath={abs(target.path)}
            />
          </SelectDocumentProvider>
        </div>
      </Field.Control>
    </Field>
  )
}
