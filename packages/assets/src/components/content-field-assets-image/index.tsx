import { StorageReference, getDownloadURL, ref } from '@firebase/storage'
import { WorkbenchPageModal, component } from '@fiar/workbench'
import { useField } from '@fiar/content/context/field'
import { Button, Control } from '@fiar/components'
import React from 'react'
import cn from 'mcn'

import { SelectAssetProvider, is_image, useAssetConfig, useAssetUrl } from '../../context'
import { AssetCardAction } from '../assets-browser/AssetCardAction'
import { DownloadIcon, PhotoIcon, RemoveIcon } from '../icons'
import { AssetCard } from '../assets-browser/AssetCard'
// import { AssetsBrowser } from '../assets-browser'
import { Asset } from '../assets-browser/Asset'
import { FieldImage } from '../../fields'

export const ContentFieldAssetsImage = component('content:field:asset-image', (): JSX.Element => {
  const [open, setopen] = React.useState(false)
  const field = useField<FieldImage>()
  const config = useAssetConfig()
  const value = field.value()

  field.handle((_ctx, ev) => {
    if (ev.type !== 'publish') return ev
    const fullPath = ev?.value?.fullPath
    if (field.options.optional && !fullPath) return ev
    if (!fullPath) return { ...ev, valid: false, reason: 'Missing image' }
    return getDownloadURL(ref(config.storage, fullPath))
      .then(() => ev)
      .catch((e) => ({ valid: false, reason: e.message }))
  })

  return (
    <Control ref={field.ref} error={field.error} label={field.options.label}>
      {!value && (
        <div className="flex items-center justify-center py-2">
          <Button
            variant="link"
            className="flex items-center justify-center gap-1"
            onClick={() => setopen(true)}
            icon={<PhotoIcon className="w-4" />}
          >
            Select image
          </Button>
        </div>
      )}
      {value && <Preview image={value} remove={() => field.update(null)} />}

      <SelectAssetProvider
        value={{
          filter: (x) => is_image.test(x),
          select: ({ fullPath, name, bucket }) => {
            field.update({ fullPath, name, bucket })
            setopen(false)
          },
        }}
      >
        <WorkbenchPageModal open={open} close={() => setopen(false)} path="/assets" />
      </SelectAssetProvider>
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
      <Asset url={data.data} />
    </AssetCard>
  )
}
