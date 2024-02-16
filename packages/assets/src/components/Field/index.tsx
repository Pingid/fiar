import { PhotoIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { type FieldComponent, useFormState, fieldError, get, useController } from '@fiar/content/fields'
import { WorkbenchPageModal } from '@fiar/workbench'
import { Button, Field } from '@fiar/components'

import { SelectAssetProvider } from '../../context/select.js'
import { IFieldAsset } from '../../schema/index.js'
import { Card } from '../Card/index.js'

export const FieldAsset: FieldComponent<IFieldAsset> = (props) => {
  const [open, setOpen] = useState(false)
  const state = useFormState(props)
  const error = fieldError(get(state.errors, props.name))

  const form = useController({
    ...props,
    rules: {
      required: !props.field.optional,
      validate: (x) => {
        if (!x && props.field.optional) return true
        if (!x) return 'Required'
        return true
      },
    },
  })

  return (
    <Field label={props.field.label} error={error}>
      {!form.field.value && (
        <div className="flex w-full items-center justify-center">
          <Button
            icon={<PhotoIcon />}
            color={!!error ? 'error' : 'active'}
            className="w-full justify-center py-6"
            onClick={() => setOpen(true)}
          >
            Select image
          </Button>
        </div>
      )}
      {form.field.value && <Card asset={form.field.value} onDelete={() => form.field.onChange(null)} />}
      <SelectAssetProvider
        value={({ fullPath, name, bucket }) => {
          form.field.onChange({ fullPath, name, bucket })
          setOpen(false)
        }}
      >
        <WorkbenchPageModal open={open} close={() => setOpen(false)} path="/assets" />
      </SelectAssetProvider>
    </Field>
  )
}
