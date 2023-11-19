import { ArrowDownTrayIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'
import { cn } from 'mcn'

import { type FieldComponent, FieldController } from '@fiar/content'
import { register, WorkbenchPageModal } from '@fiar/workbench'
import { type StorageReference } from '@firebase/storage'
import { Button, Field } from '@fiar/components'

import { AssetCardAction } from './assets-browser/AssetCardAction.js'
import { AssetCard } from './assets-browser/AssetCard.js'
import { Asset } from './assets-browser/Asset.js'
import { SelectAssetProvider } from '../context/select.js'
import { is_image, useAssetUrl } from '../hooks/index.js'
import { IFieldImage } from '../schema/index.js'

declare module '@fiar/workbench/components' {
  export interface Components {
    'field:assets-image': FieldComponent<IFieldImage>
  }
}

register('field:assets-image', (props) => {
  const [open, setOpen] = useState(false)

  return (
    <Field label={props.field.label}>
      <Field.Control>
        <FieldController
          control={props.control}
          name={props.name}
          rules={{ required: !props.field.optional }}
          render={(form) => {
            return (
              <>
                {!form.field.value && (
                  <div className="flex w-full items-center justify-center p-3">
                    <Button icon={<PhotoIcon />} color="active" onClick={() => setOpen(true)}>
                      Select image
                    </Button>
                  </div>
                )}
                {form.field.value && <Preview image={form.field.value} remove={() => form.field.onChange(undefined)} />}
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
      </Field.Control>
    </Field>
  )
})

export const Preview = (p: {
  image: Pick<StorageReference, 'name' | 'fullPath' | 'bucket'>
  remove: () => void
}): JSX.Element => {
  const data = useAssetUrl(p.image)
  return (
    <AssetCard
      name={p.image.name}
      error={data.error}
      loading={data.isLoading}
      link={data.data}
      embedded
      menu={
        <div className="flex items-center justify-center gap-1">
          <a target="__blank" href={data.data} className={cn(AssetCardAction.className, 'p-0.5')}>
            <ArrowDownTrayIcon className="h-full w-full" strokeWidth="2px" />
          </a>
          <AssetCardAction onClick={() => p.remove()}>
            <XMarkIcon className="h-full w-full" strokeWidth="2px" />
          </AssetCardAction>
        </div>
      }
    >
      <Asset url={data.data} loading={data.isLoading} />
    </AssetCard>
  )
}
