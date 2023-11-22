import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { deleteObject, ref } from '@firebase/storage'
import { useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useMedia } from 'react-use'
import { cn } from 'mcn'

import { Page, useSetPageStatus } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { AssetFolder, useConfig, useQueryAssets } from '../../hooks/index.js'
import { isUploadAsset, useUploads } from '../../hooks/uploads.js'
import { AssetPreviewCard } from '../AssetPreviewCard/index.js'
import { AssetUploadCard } from '../AssetUploadCard/index.js'

import { DropLayer } from './DropLayer/index.js'

export const Folder = (props: AssetFolder): JSX.Element => {
  const storage = useConfig((x) => x.storage!)

  const path = props.path
  const assets = useQueryAssets(path)
  const columns = useMedia('(min-width: 500px)') ? 40 : 20

  const loading = useUploads((x) => x.uploads.length > 0)
  const populate = useUploads((x) => x.populate)
  const refresh = useUploads((x) => x.refresh)
  const addFiles = useUploads((x) => x.add)
  const error = useUploads((x) => x.error)

  useSetPageStatus(`uploads/${path}`, { loading, error })

  const onDrop = useCallback((x: File[]) => addFiles(storage, path, x), [])

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    noClick: false,
    accept: props.accept as any,
  })

  const all = populate(props.path, assets.data?.items || [])
  const empty = !assets.isLoading && !assets.error && assets.data?.items.length === 0

  const onRemove = (fullPath: string) =>
    assets.mutate(deleteObject(ref(storage, fullPath)) as Promise<undefined>, {
      optimisticData: {
        ...assets.data,
        items: (assets.data?.items ?? []).filter((y) => y.fullPath !== fullPath),
      } as any,
      rollbackOnError: true,
      populateCache: true,
      revalidate: false,
    })

  useEffect(() => refresh(assets.data?.items ?? []), [assets.data])

  return (
    <>
      <Page.Action>
        <Button
          icon={<CloudArrowUpIcon className="mr-1 h-5 w-5" />}
          elementType="label"
          htmlFor="upload"
          color="active"
        >
          Upload
        </Button>
        <input id="upload" {...getInputProps()} className="hover:bg-highlight rounded text-lg font-medium" />
      </Page.Action>
      <div
        {...getRootProps()}
        onClick={undefined}
        className={cn('grid w-full gap-4 px-3 pb-24 pt-3')}
        style={{ gridTemplateColumns: `repeat(${Math.floor(columns / 20) + 1}, minmax(0, 1fr))` }}
      >
        {all.map((x) =>
          isUploadAsset(x) ? (
            <AssetUploadCard key={x.fullPath} asset={x} onDone={() => assets.mutate()} />
          ) : (
            <AssetPreviewCard key={x.fullPath} asset={x} remove={() => onRemove(x.fullPath)} />
          ),
        )}

        {empty && <EmptyState />}
        <DropLayer isDragActive={isDragActive} isDragAccept={isDragAccept} isDragReject={isDragReject} />
      </div>
    </>
  )
}

const EmptyState = () => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center">
      <p className="text-front/50">Empty</p>
      <p>Drag and drop files to upload</p>
    </div>
  </div>
)