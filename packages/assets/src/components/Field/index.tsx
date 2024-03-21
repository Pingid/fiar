import { ArrowPathIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { useFieldPreview, useFieldForm, useFormFieldControl } from '@fiar/content/fields'
import { Button, Field, FieldControl } from '@fiar/components'
import { WorkbenchPageModal } from '@fiar/workbench'

import { SelectAssetProvider } from '../../context/select.js'
import { useImageMeta } from '../../context/data.js'
import { IFieldAsset } from '../../schema/index.js'
import { Thumbnail } from '../index.js'

export const PreviewFieldAsset = () => {
  const field = useFieldPreview<IFieldAsset>()
  const asset = useImageMeta(field.value?.fullPath)

  return (
    <div className="flex max-h-28 w-full">
      <Thumbnail
        className="object-contain object-left-top"
        url={asset.data?.url}
        contentType={asset.data?.contentType}
      />
    </div>
  )
}

export const FormFieldAsset = () => {
  const field = useFieldForm<IFieldAsset>()
  const [open, setOpen] = useState(false)

  const form = useFormFieldControl<IFieldAsset>({
    rules: {
      validate: (x) => {
        if (!x && field.schema.optional) return true
        if (!x) return 'Required'
        return true
      },
    },
  })

  const asset = useImageMeta(form.field.value?.fullPath)

  return (
    <Field label={field.schema.label} error={field.error}>
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
              size="lg"
              icon={<PhotoIcon />}
              color={!!field.error ? 'error' : 'active'}
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
