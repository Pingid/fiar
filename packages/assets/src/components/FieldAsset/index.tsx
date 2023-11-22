import { PhotoIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

import { type FieldComponent, Controller, useFormState, fieldError, get } from '@fiar/content/fields'
import { WorkbenchPageModal } from '@fiar/workbench'
import { Button, Field } from '@fiar/components'

import { AssetPreviewCard } from '../AssetPreviewCard/index.js'
import { SelectAssetProvider } from '../../hooks/select.js'
import { IFieldAsset } from '../../schema/index.js'
import { is_image } from '../../hooks/index.js'

export const FieldAsset: FieldComponent<IFieldAsset> = (props) => {
  const [open, setOpen] = useState(false)
  const state = useFormState(props)
  const error = fieldError(get(state.errors, props.name))

  return (
    <Field label={props.field.label} error={error}>
      <Controller
        control={props.control}
        name={props.name}
        rules={{
          required: !props.field.optional,
          validate: (x) => {
            if (!x && props.field.optional) return true
            if (!x) return 'Required'
            return true
          },
        }}
        render={(form) => {
          return (
            <>
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
              {form.field.value && (
                <AssetPreviewCard asset={form.field.value} remove={() => form.field.onChange(null)} />
              )}
              <SelectAssetProvider
                value={{
                  filter: (x) => is_image.test(x),
                  select: ({ fullPath, name, bucket }) => {
                    form.field.onChange({ fullPath, name, bucket })
                    setOpen(false)
                  },
                }}
              >
                <WorkbenchPageModal open={open} close={() => setOpen(false)} app="/assets" />
              </SelectAssetProvider>
            </>
          )
        }}
      />
    </Field>
  )
}
