import { useState } from 'react'

import { type FieldComponent, FieldController } from '@fiar/content/v2/field'
import { type StorageReference } from '@firebase/storage'
import { register } from '@fiar/workbench/v2/components'
import { WorkbenchPageModal } from '@fiar/workbench/v2'
import { Button, Control } from '@fiar/components'
import { cn } from 'mcn'

import { DownloadIcon, PhotoIcon, RemoveIcon } from '../../components/icons/index.js'
import { AssetCardAction } from '../../components/assets-browser/AssetCardAction.js'
import { AssetCard } from '../../components/assets-browser/AssetCard.js'
import { Asset } from '../../components/assets-browser/Asset.js'
import { SelectAssetProvider } from '../../context/select.js'
import { is_image, useAssetUrl } from '../hooks/index.js'
import { IFieldImage } from '../schema/index.js'

declare module '@fiar/workbench/v2/components' {
  export interface Components {
    'field:assets-image': FieldComponent<IFieldImage>
  }
}

register('field:assets-image', (props) => {
  const [open, setOpen] = useState(false)

  return (
    <Control label={props.field.label}>
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
    </Control>
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
            <DownloadIcon className="h-full w-full" strokeWidth="2px" />
          </a>
          <AssetCardAction onClick={() => p.remove()}>
            <RemoveIcon className="h-full w-full" strokeWidth="2px" />
          </AssetCardAction>
        </div>
      }
    >
      <Asset url={data.data} loading={data.isLoading} />
    </AssetCard>
  )
}
