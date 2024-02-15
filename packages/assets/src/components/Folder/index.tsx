import { StorageReference, deleteObject, listAll, ref } from '@firebase/storage'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'
import useSWR from 'swr'

import calender from 'dayjs/plugin/calendar.js'
import dayjs from 'dayjs'
dayjs.extend(calender)

import { Page, useSetPageStatus } from '@fiar/workbench'
import { Button } from '@fiar/components'

import { AssetFolder, useConfig } from '../../hooks/index.js'
import { useUploads } from '../../hooks/uploads.js'
import { DropLayer } from './DropLayer/index.js'
import { AssetGrid } from '../Grid/index.js'
import { Upload } from '../Upload/index.js'
import { Card } from '../Card/index.js'

export const Folder = (props: AssetFolder): JSX.Element => {
  const storage = useConfig((x) => x.storage!)

  const assets = useSWR(props.path, () => listAll(ref(storage, props.path)))

  const loading = useUploads((x) => x.uploads.length > 0)
  const uploads = useUploads((x) => x.uploads.filter((x) => x.folder === props.path))
  const addFiles = useUploads((x) => x.add)
  const error = useUploads((x) => x.error)

  useSetPageStatus(`uploads/${props.path}`, { loading, error })

  const onDrop = useCallback(
    (x: File[]) => addFiles(storage, props.path, x, () => assets.mutate((x) => x, { revalidate: true })),
    [],
  )
  const zone = useDropzone({ onDrop, noClick: false, accept: props.accept as any })

  const empty = !assets.isLoading && !assets.error && assets.data?.items.length === 0

  const onDelete = (x: StorageReference) =>
    assets.mutate(
      (y) =>
        deleteObject(x).then(() =>
          y ? { ...y, items: y?.items.filter((z) => z.fullPath !== x.fullPath) } : undefined,
        ),
      { revalidate: true },
    )

  return (
    <Page>
      <Page.Header
        breadcrumbs={[
          { children: 'Assets', href: '/' },
          { children: props.title, href: props.path },
        ]}
      >
        <div className="flex w-full items-center justify-between">
          {/* <Pagination pages={0} onPage={() => {}} end /> */}
          <div />
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

      {uploads.length > 0 && (
        <div className="flex w-full gap-2 overflow-x-auto border-b p-2">
          {uploads.map((x) => (
            <Upload key={x.fullPath} {...x} />
          ))}
        </div>
      )}

      <AssetGrid {...zone.getRootProps()} onClick={() => {}}>
        {assets.data?.items?.map((x) => <Card key={x.fullPath} asset={x} onDelete={() => onDelete(x)} />)}

        {empty && <EmptyState />}
        <DropLayer isDragActive={zone.isDragActive} isDragAccept={zone.isDragAccept} isDragReject={zone.isDragReject} />
      </AssetGrid>
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
