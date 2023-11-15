import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StorageReference } from '@firebase/storage'
import { cn } from 'mcn'

import { useAssetUrl, useRemoveAsset } from '../hooks/index.js'
import { useSelectAsset } from '../../context/select.js'

import { AssetCardAction } from '../../components/assets-browser/AssetCardAction.js'
import { AssetCard } from '../../components/assets-browser/AssetCard.js'
import { Asset } from '../../components/assets-browser/Asset.js'

export const Preview = (p: {
  image: Pick<StorageReference, 'name' | 'fullPath' | 'bucket'>
  menu?: React.ReactNode
}): JSX.Element => {
  const remove = useRemoveAsset(p.image.fullPath)
  const data = useAssetUrl(p.image)
  const select = useSelectAsset()

  return (
    <AssetCard
      name={p.image.name}
      error={data.error}
      loading={data.isLoading}
      link={data.data}
      onClick={select?.select ? () => select.select(p.image) : undefined}
      menu={
        <div className="flex items-center justify-center gap-1">
          <a target="__blank" href={data.data} className={cn(AssetCardAction.className, 'p-0.5')}>
            <ArrowDownTrayIcon className="h-full w-full" strokeWidth="2px" />
          </a>
          <AssetCardAction onClick={() => remove.trigger()}>
            <XMarkIcon className="h-full w-full" strokeWidth="2px" />
          </AssetCardAction>
        </div>
      }
    >
      <Asset url={data.data} />
    </AssetCard>
  )
}
