import UploadIcon from '@heroicons/react/24/outline/CloudArrowUpIcon'

import { ref, uploadBytesResumable } from '@firebase/storage'
import { useDropzone } from 'react-dropzone'
import { useCallback, useState } from 'react'
import { Button } from '@fiar/components'
import { Page } from '@fiar/workbench'

import { cn } from 'mcn'

import { isUploadAsset, useUploads } from '../../context/uploads'
import { useAssetConfig, useQueryAssets } from '../../context'
import { useSelectAsset } from '../../context/select'
import { DropLayer } from './DropLayer'
import { CloudIcon } from '../icons'
import { Preview } from './Preview'
import { Upload } from './Upload'

export const AssetsBrowser = (): JSX.Element => {
  const [columns] = useState(window.innerWidth < 500 ? 20 : 40)
  const config = useAssetConfig()
  const query = useQueryAssets()
  const select = useSelectAsset()

  const loading = useUploads((x) => x.uploads.length > 0)
  const populate = useUploads((x) => x.populate)
  const addFiles = useUploads((x) => x.add)
  const error = useUploads((x) => x.error)

  const onDrop = useCallback(
    (x: File[]) =>
      addFiles(
        x.map((file) => {
          const task = uploadBytesResumable(ref(config.storage, `${config.storagePrefix}/${file.name}`), file)
          return { file, name: file.name, task }
        }),
      ),
    [addFiles, config],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, noClick: false })

  const all = populate((query.data?.items || []).filter((x) => (select?.filter ? select.filter(x.name) : true)))
  const empty = !query.isLoading && !query.error && all.length === 0

  return (
    <Page
      error={error || query.error}
      loading={loading || query.isLoading}
      breadcrumb={[{ title: 'Assets', icon: <CloudIcon className="w-4" />, disabled: true }]}
      actions={
        <div className="flex w-full justify-end">
          {/* <div className="w-full pb-0.5 pr-1">
            <input
              type="range"
              value={columns}
              max={100}
              min={0}
              onChange={(e) => setcolumns(parseInt(e.target.value))}
              className={cn(
                '[&::-webkit-slider-runnable-track]:bg-front/10 [&::-webkit-slider-thumb]:bg-active [&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:rounded-full  [&::-webkit-slider-thumb]:-mt-0.5 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border',
                'w-full max-w-[20rem] appearance-none bg-transparent',
              )}
            />
          </div> */}
          <Button
            icon={<UploadIcon className="mr-1 h-5 w-5" />}
            use="label"
            htmlFor="upload"
            size="none"
            variant="ghost"
            className="cursor-pointer pr-6"
          >
            Upload
          </Button>
          <input id="upload" {...getInputProps()} className="hover:bg-highlight rounded-md text-lg font-medium" />
        </div>
      }
    >
      <div className="">
        <div
          {...getRootProps()}
          onClick={undefined}
          className={cn('grid h-full w-full gap-4 pb-24 pt-3')}
          style={{ gridTemplateColumns: `repeat(${Math.floor(columns / 20) + 1}, minmax(0, 1fr))` }}
        >
          {empty && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-front/50">Empty</p>
                <p>Drag and drop files to upload</p>
              </div>
            </div>
          )}
          {all.map((x) =>
            isUploadAsset(x) ? (
              <Upload key={x.name} asset={x} onDone={() => query.mutate()} />
            ) : (
              <Preview key={x.fullPath} image={x} />
            ),
          )}
          <DropLayer active={isDragActive} />
        </div>
      </div>
    </Page>
  )
}
