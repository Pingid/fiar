import { CloudArrowUpIcon } from '@heroicons/react/24/outline'

import { ref, uploadBytesResumable } from '@firebase/storage'
import { useDropzone } from 'react-dropzone'
import { useCallback, useState } from 'react'
import { Button } from '@fiar/components'
import { Page } from '@fiar/workbench'

import { cn } from 'mcn'

import { isUploadAsset, useUploads } from '../../context/uploads.js'
import { useAssetConfig, useQueryAssets } from '../../context/index.js'
import { useSelectAsset } from '../../context/select.js'
import { CloudIcon } from '../icons/index.js'
import { DropLayer } from './DropLayer.js'
import { Preview } from './Preview.js'
import { Upload } from './Upload.js'

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
      error={error || query?.error?.message}
      loading={loading || query.isLoading}
      breadcrumb={[{ title: 'Assets', icon: <CloudIcon className="w-4" />, disabled: true }]}
      action={
        <>
          <Button
            icon={<CloudArrowUpIcon className="mr-1 h-5 w-5" />}
            use="label"
            htmlFor="upload"
            className="cursor-pointer sm:pr-6"
          >
            Upload
          </Button>
          <input id="upload" {...getInputProps()} className="hover:bg-highlight rounded-md text-lg font-medium" />
        </>
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
