import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import { useMedia } from 'react-use'
import { useCallback } from 'react'
import { cn } from 'mcn'

import { Page, useSetPageStatus } from '@fiar/workbench'
import { Button, Pagination } from '@fiar/components'

import { isUploadAsset, useUploads } from '../../hooks/uploads.js'
import { AssetPreviewCard } from '../AssetPreviewCard/index.js'
import { AssetUploadCard } from '../AssetUploadCard/index.js'
import { AssetFolder, useConfig } from '../../hooks/index.js'

import { DropLayer } from './DropLayer/index.js'
import { useAssets } from '../../hooks/assets.js'

export const Folder = (props: AssetFolder): JSX.Element => {
  const storage = useConfig((x) => x.storage!)

  const path = props.path
  const assets = useAssets(props)

  const columns = useMedia('(min-width: 500px)') ? 40 : 20

  const loading = useUploads((x) => x.uploads.length > 0)
  const addFiles = useUploads((x) => x.add)
  const error = useUploads((x) => x.error)

  useSetPageStatus(`uploads/${path}`, { loading, error })

  const onDrop = useCallback((x: File[]) => addFiles(storage, path, x), [])

  const zone = useDropzone({
    onDrop,
    noClick: false,
    accept: props.accept as any,
  })

  const empty = !assets.isLoading && !assets.error && assets.items.length === 0

  return (
    <Page>
      <Page.Header
        breadcrumbs={[
          { children: 'Assets', href: '/' },
          { children: props.title, href: props.path },
        ]}
      >
        <div className="flex w-full items-center justify-between">
          <Pagination pages={0} onPage={() => {}} end />
          <Button
            icon={<CloudArrowUpIcon className="mr-1 h-5 w-5" />}
            elementType="label"
            htmlFor="upload"
            color="active"
            className="flex-0"
          >
            Upload
          </Button>
          <input id="upload" {...zone.getInputProps()} className="hover:bg-highlight rounded text-lg font-medium" />
        </div>
      </Page.Header>

      <div
        {...zone.getRootProps()}
        onClick={undefined}
        className={cn('grid w-full gap-4 px-3 pb-24 pt-3')}
        style={{ gridTemplateColumns: `repeat(${Math.floor(columns / 20) + 1}, minmax(0, 1fr))` }}
      >
        {assets.items.map((x) =>
          isUploadAsset(x) ? (
            <AssetUploadCard key={x.fullPath} asset={x} onDone={() => 'assets.mutate()'} />
          ) : (
            <AssetPreviewCard key={x.fullPath} asset={x} remove={() => assets.onRemove(x.fullPath)} />
          ),
        )}

        {empty && <EmptyState />}
        <DropLayer isDragActive={zone.isDragActive} isDragAccept={zone.isDragAccept} isDragReject={zone.isDragReject} />
      </div>
    </Page>
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
