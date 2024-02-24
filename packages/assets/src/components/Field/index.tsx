import { ArrowPathIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { type FieldForm, type FieldPreview, useFormState, fieldError, get, useController } from '@fiar/content/fields'
import { Button, Field, FieldControl } from '@fiar/components'
import { WorkbenchPageModal } from '@fiar/workbench'

import { SelectAssetProvider } from '../../context/select.js'
import { useImageMeta } from '../../context/data.js'
import { IFieldAsset } from '../../schema/index.js'
import { Thumbnail } from '../index.js'

export const PreviewFieldAsset: FieldPreview<IFieldAsset> = (props) => {
  const asset = useImageMeta(props.value?.fullPath)

  return (
    <div className="flex aspect-square h-28 w-28">
      <Thumbnail
        className="object-contain object-left-top"
        url={asset.data?.url}
        contentType={asset.data?.contentType}
      />
    </div>
  )
}

export const FormFieldAsset: FieldForm<IFieldAsset> = (props) => {
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

  const asset = useImageMeta(form.field.value?.fullPath)

  return (
    <Field label={props.field.label} error={error}>
      <FieldControl>
        {form.field.value && (
          <div className="bg-back flex w-full justify-between border-b p-1 px-2">
            <div />
            <div className="flex items-center gap-1.5">
              <button onClick={() => setOpen(true)}>
                <ArrowPathIcon className="h-[.9rem] w-[.9rem]" />
              </button>
              <button onClick={() => form.field.onChange(null)}>
                <XMarkIcon className="h-[1.1rem] w-[1.1rem]" />
              </button>
            </div>
          </div>
        )}
        {form.field.value && (
          <div className="bg-frame aspect-square">
            <Thumbnail
              className="h-full w-full object-contain object-center"
              url={asset.data?.url}
              contentType={asset.data?.contentType}
            />
          </div>
        )}
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
      </FieldControl>

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
