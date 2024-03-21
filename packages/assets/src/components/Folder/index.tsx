import { ListResult, StorageReference, deleteObject, listAll, ref, uploadBytesResumable } from '@firebase/storage'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import { useDropzone } from 'react-dropzone'
import { useCallback } from 'react'
import useSWR from 'swr'

import calender from 'dayjs/plugin/calendar.js'
import dayjs from 'dayjs'
dayjs.extend(calender)

import { Button, createGlobalSlot } from '@fiar/components'
import { Header } from '@fiar/workbench'

import { AssetFolder, useFirebaseStorage } from '../../context/index.js'
import { useUploads } from '../../context/uploads.js'
import { DropLayer } from './DropLayer/index.js'
import { AssetGrid } from '../Grid/index.js'
import { Upload } from '../Upload/index.js'
import { Card } from '../Card/index.js'

const FolderActionSlot = createGlobalSlot()
export const FolderAction = FolderActionSlot.Place

export const Folder = (props: AssetFolder): JSX.Element => {
  const storage = useFirebaseStorage()

  const assets = useSWR(props.path, () => listAll(ref(storage, props.path)))

  const uploads = useUploads((x) => x.uploads.filter((x) => x.folder === props.path))
  const addFiles = useUploads((x) => x.add)

  const onDrop = useCallback((files: File[]) => {
    for (const file of files) {
      const fullPath = `${props.path}/${file.name}`
      if (useUploads.getState().uploads.some((y) => y.fullPath === fullPath)) continue
      addFiles(
        {
          folder: props.path,
          fullPath,
          task: uploadBytesResumable(ref(storage, fullPath), file),
          url: URL.createObjectURL(file),
          contentType: file.type,
        },
        () => assets.mutate((x) => x, { revalidate: true }),
      )
    }
  }, [])
  const zone = useDropzone({ onDrop, noClick: false, accept: props.accept as any })

  const onDelete = (x: StorageReference) =>
    assets.mutate(deleteObject(x) as Promise<any>, {
      revalidate: true,
      rollbackOnError: true,
      optimisticData: (y): ListResult => ({
        ...y,
        prefixes: [],
        items: (y?.items || []).filter((z) => z.fullPath !== x.fullPath),
      }),
    })

  return (
    <>
      <Header
        breadcrumbs={[
          { children: 'Assets', href: '/' },
          { children: props.title, href: props.path },
        ]}
      >
        <div className="flex w-full items-center justify-between p-2">
          {/* <Pagination pages={0} onPage={() => {}} end /> */}
          <div />
          <div className="flex items-center gap-2">
            <FolderActionSlot.Locate use="div" />
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
        </div>
      </Header>

      {uploads.length > 0 && (
        <div className="relative z-10 flex w-full gap-2 overflow-x-auto border-b p-2">
          {uploads.map((x) => (
            <Upload key={x.fullPath} {...x} />
          ))}
        </div>
      )}

      <AssetGrid {...zone.getRootProps()} onClick={() => {}}>
        {assets.data?.items?.map((x) => <Card key={x.fullPath} asset={x} onDelete={() => onDelete(x)} />)}
        {assets.data?.items.length === 0 && <EmptyState />}
        <DropLayer isDragActive={zone.isDragActive} isDragAccept={zone.isDragAccept} isDragReject={zone.isDragReject} />
      </AssetGrid>
    </>
  )
}

const EmptyState = () => (
  <div className="fixed inset-0 z-0 flex items-center justify-center">
    <div className="text-center">
      <p className="text-front/50">Empty</p>
      <p>Drag and drop files to upload</p>
    </div>
  </div>
)
