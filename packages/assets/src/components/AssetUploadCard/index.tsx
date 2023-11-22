import { XMarkIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'react'

import { AssetCard, AssetCardAction } from '../AssetCard/index.js'
import { UploadAsset } from '../../hooks/uploads.js'
import { Asset } from '../Asset/index.js'

export const AssetUploadCard = (p: { asset: UploadAsset; onDone: () => void }): JSX.Element => {
  const [progress, setprogress] = useState(0)
  const [state, setstate] = useState<'paused' | 'running'>('running')

  const message = `${state === 'paused' ? 'Paused' : 'Uploading'} ${Math.round(progress * 100)}%`
  const url = URL.createObjectURL(p.asset.file)
  useEffect(() => {
    const unsub = p.asset.task.on(
      'state_changed',
      (x) => {
        setprogress(x.bytesTransferred / x.totalBytes)
        setstate(x.state as any)
      },
      () => {},
      () => p.onDone(),
    )
    return () => void unsub()
  }, [p.asset])

  return (
    <AssetCard
      name={message}
      actions={
        <>
          {state === 'running' && (
            <AssetCardAction onClick={() => p.asset.task.pause()}>
              <PauseIcon className="h-full w-full" strokeWidth="2px" />
            </AssetCardAction>
          )}
          {state === 'paused' && (
            <AssetCardAction onClick={() => p.asset.task.resume()}>
              <PlayIcon className="h-full w-full" strokeWidth="2px" />
            </AssetCardAction>
          )}
          <AssetCardAction onClick={() => p.asset.task.cancel && p.asset.task.cancel()}>
            <XMarkIcon className="h-full w-full" strokeWidth="2px" />
          </AssetCardAction>
        </>
      }
    >
      <Asset url={url} name={p.asset.name} />
    </AssetCard>
  )
}
