import { StorageReference } from '@firebase/storage'
import cn from 'mcn'

import { useAssetUrl, useRemoveAsset } from '../../context'
import { useSelectAsset } from '../../context/select'
import { AssetCardAction } from './AssetCardAction'
import { DownloadIcon, RemoveIcon } from '../icons'
import { AssetCard } from './AssetCard'
import { Asset } from './Asset'

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
            <DownloadIcon className="h-full w-full" strokeWidth="2px" />
          </a>
          <AssetCardAction onClick={() => remove.trigger()}>
            <RemoveIcon className="h-full w-full" strokeWidth="2px" />
          </AssetCardAction>
        </div>
      }
    >
      <Asset url={data.data} />
    </AssetCard>
  )
}
