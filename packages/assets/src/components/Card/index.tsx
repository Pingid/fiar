import { StorageReference, getDownloadURL, getMetadata, ref } from '@firebase/storage'
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline'
import calender from 'dayjs/plugin/calendar.js'
import dayjs from 'dayjs'
import useSWR from 'swr'
import { cn } from 'mcn'
dayjs.extend(calender)

import { useSelectAsset } from '../../context/select.js'
import { useFirebaseStorage } from '../../context/config.js'
import { Thumbnail } from '../Thumb/index.js'

export const Card = (props: {
  asset: Pick<StorageReference, 'name' | 'bucket' | 'fullPath'>
  onDelete: () => void
}) => {
  const onSelect = useSelectAsset()
  const storage = useFirebaseStorage()
  const meta = useSWR([props.asset.fullPath, 'meta'], () => getMetadata(ref(storage, props.asset.fullPath)))
  const url = useSWR([props.asset.fullPath, 'url'], () => getDownloadURL(ref(storage, props.asset.fullPath)))

  return (
    <div
      role={onSelect ? 'button' : undefined}
      className={cn('flex flex-col justify-between border', [!!onSelect, 'hover:border-active'])}
      onClick={(e) => (e.stopPropagation(), onSelect ? onSelect(props.asset) : undefined)}
    >
      <Thumbnail className="bg-frame aspect-square" url={url.data} contentType={meta.data?.contentType} />
      <div className="p-2">
        <div className="space-y-1 pt-2">
          <div className="grid gap-2" style={{ gridTemplateColumns: 'minmax(0, 1fr) max-content' }}>
            <p
              tabIndex={0}
              className="text-front/60 group relative truncate text-sm hover:z-10 hover:overflow-visible focus:z-10 focus:overflow-visible"
            >
              <span className="group-focus:bg-back group-hover:bg-back group-hover:pr-1 group-focus:pr-1">
                {props.asset.name}
              </span>
            </p>

            <div className="flex-0 flex items-center justify-end gap-1">
              <a
                target="__blank"
                href={url.data}
                className="hover text-active text-front/30 hover:text-active flex h-5 w-5 flex-shrink-0 items-center justify-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4" strokeWidth="2px" />
              </a>
              <button
                className="hover text-active text-front/30 hover:text-active flex h-5 w-5 flex-shrink-0 items-center justify-center"
                onClick={(e) => (e.stopPropagation(), props.onDelete())}
              >
                <XMarkIcon className="h-5 w-5" strokeWidth="2px" />
              </button>
            </div>
          </div>
          <p className="text-front/60 text-xs">{meta.data?.timeCreated && dayjs(meta.data?.timeCreated).calendar()}</p>
          {meta.data?.size && <p className="text-front/60 text-xs">{(meta.data?.size / 1000000).toPrecision(2)} mb</p>}
        </div>
      </div>
    </div>
  )
}
