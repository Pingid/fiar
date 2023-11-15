import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import { useCallback, useEffect } from 'react'
import { useMedia } from 'react-use'
import { cn } from 'mcn'

import { Page, useSetPageStatus } from '@fiar/workbench/v2'
import { Button } from '@fiar/components'

import { isUploadAsset, useUploads } from '../hooks/uploads.js'
import { AssetFolder, useConfig } from '../context/index.js'
import { useQueryAssets } from '../hooks/index.js'

import { Preview } from '../preview/index.js'
import { EmptyState } from './empty/index.js'
import { DropLayer } from './drop/index.js'
import { Upload } from '../upload/index.js'

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

  useEffect(() => refresh(assets.data?.items ?? []), [assets.data])

  return (
    <>
      <Page.Action>
        <Button icon={<CloudArrowUpIcon className="mr-1 h-5 w-5" />} use="label" htmlFor="upload" color="active">
          Upload
        </Button>
        <input id="upload" {...getInputProps()} className="hover:bg-highlight rounded-md text-lg font-medium" />
      </Page.Action>
      <div
        {...getRootProps()}
        onClick={undefined}
        className={cn('grid w-full gap-4 px-3 pb-24 pt-3')}
        style={{ gridTemplateColumns: `repeat(${Math.floor(columns / 20) + 1}, minmax(0, 1fr))` }}
      >
        {all.map((x) =>
          isUploadAsset(x) ? (
            <Upload key={x.fullPath} asset={x} onDone={() => assets.mutate()} />
          ) : (
            <Preview key={x.fullPath} image={x} />
          ),
        )}

        {empty && <EmptyState />}
        <DropLayer isDragActive={isDragActive} isDragAccept={isDragAccept} isDragReject={isDragReject} />
      </div>
    </>
  )
}
