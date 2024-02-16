import { FirebaseStorage, StorageReference, UploadTask, ref, uploadBytesResumable } from '@firebase/storage'
import { useEffect } from 'react'
import { create } from 'zustand'

import { useStatus } from '@fiar/workbench'

export type UploadAsset = { file: File; task: UploadTask; folder: string; fullPath: string }
export type UploadState = {
  error: null | Error
  uploads: UploadAsset[]
  add: (storage: FirebaseStorage, folder: string, files: File[], revalidate: () => any) => void
}

export const isUploadAsset = (x: StorageReference | UploadAsset): x is UploadAsset =>
  (x as UploadAsset).file instanceof File

export const useUploads = create<UploadState>((set, get) => ({
  error: null,
  uploads: [],
  add: (storage, folder, files, revalidate) => {
    const current = get().uploads
    const uploads = files
      .filter((y) => !current.some((x) => x.file === y))
      .map((file) => {
        const fullPath = `${folder}/${file.name}`
        const task = uploadBytesResumable(ref(storage, fullPath), file)
        return { file, task, folder, fullPath }
      })

    uploads.forEach((x) => {
      x.task
        .catch((error) => set({ error }))
        .then(() => {
          set({ uploads: get().uploads.filter((y) => y !== x) })
          revalidate()
        })
    })

    set({ uploads: [...current, ...uploads] })
  },
}))

export const useUploadStatus = () => {
  const loading = useUploads((x) => x.uploads.length > 0)
  const error = useUploads((x) => x.error)
  const update = useStatus((x) => x.update)
  useEffect(() => update('asset-uploads', { loading, error }), [loading, error])
}