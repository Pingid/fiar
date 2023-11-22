import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { StorageReference } from '@firebase/storage'

import { AssetCard, AssetCardAction } from '../AssetCard/index.js'
import { useAssetUrl, useSelectAsset } from '../../hooks/index.js'
import { Asset } from '../Asset/index.js'

export const AssetPreviewCard = (p: {
  asset: Pick<StorageReference, 'name' | 'fullPath' | 'bucket'>
  remove: () => void
}): JSX.Element => {
  const data = useAssetUrl(p.asset)
  const select = useSelectAsset()

  return (
    <AssetCard
      name={p.asset.name}
      error={data.error}
      loading={data.isLoading}
      link={data.data}
      onClick={select?.select ? () => select.select(p.asset) : undefined}
      actions={
        <>
          <AssetCardAction use="a" target="__blank" href={data.data} className={'p-0.5'}>
            <ArrowDownTrayIcon className="h-full w-full" strokeWidth="2px" />
          </AssetCardAction>
          <AssetCardAction onClick={() => p.remove()}>
            <XMarkIcon className="h-full w-full" strokeWidth="2px" />
          </AssetCardAction>
        </>
      }
    >
      <Asset url={data.data} loading={data.isLoading} />
    </AssetCard>
  )
}
