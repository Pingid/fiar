import UploadIcon from '@heroicons/react/24/outline/CloudArrowUpIcon'

import { ref, uploadBytesResumable } from '@firebase/storage'
import { useDropzone } from 'react-dropzone'
import { useCallback, useState } from 'react'

import { Button, Header } from '@fiar/ui'
import { cn } from 'mcn'

import { isUploadAsset, useUploads } from '../../context/uploads'
import { useAssetConfig, useQueryAssets } from '../../context'
import { useSelectAsset } from '../../context/select'
import { DropLayer } from './DropLayer'
import { Preview } from './Preview'
import { Upload } from './Upload'

export const AssetsBrowser = (): JSX.Element => {
  const [columns, setcolumns] = useState(window.innerWidth < 500 ? 20 : 40)
  const config = useAssetConfig()
  const query = useQueryAssets()
  const select = useSelectAsset()

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
    <>
      <Header>
        <Header.Content loading={query.isLoading}>
          <Button
            icon={<UploadIcon className="mr-1 h-5 w-5" />}
            use="label"
            htmlFor="upload"
            variant="ghost"
            className="cursor-pointer"
          >
            Upload
          </Button>
          <p className="text-error w-full text-sm">
            {query.error?.message}
            {error}
          </p>
          <input
            id="upload"
            {...getInputProps()}
            className="hover:bg-highlight rounded-md px-3 py-2 text-lg font-medium"
          />
          <div className="pb-0.5 pr-1">
            <input
              type="range"
              value={columns}
              max={100}
              min={0}
              onChange={(e) => setcolumns(parseInt(e.target.value))}
              className="[&::-webkit-slider-runnable-track]:bg-front/10 [&::-webkit-slider-thumb]:bg-active appearance-none bg-transparent [&::-webkit-slider-runnable-track]:h-0.5 [&::-webkit-slider-runnable-track]:rounded-full  [&::-webkit-slider-thumb]:-mt-0.5 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border"
            />
          </div>
        </Header.Content>
      </Header>

      <div className="h-full w-full">
        <div
          {...getRootProps()}
          onClick={undefined}
          className={cn('grid h-full gap-4 px-4 pb-24 pt-4')}
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
    </>
  )
}
