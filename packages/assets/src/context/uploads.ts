import { UploadTask } from '@firebase/storage'
import { useEffect } from 'react'
import { create } from 'zustand'

import { useStatus } from '@fiar/workbench'

export type UploadAsset = { task: UploadTask; folder: string; fullPath: string; url: string; contentType: string }
export type UploadState = {
  error: null | Error
  uploads: UploadAsset[]
  add: (up: UploadAsset, revalidate: () => any) => void
}

export const useUploads = create<UploadState>((set, get) => ({
  error: null,
  uploads: [],
  add: (up, revalidate) => {
    up.task
      .catch((error) => set({ error }))
      .then(() => {
        set({ uploads: get().uploads.filter((y) => y.task !== up.task) })
        revalidate()
      })

    set({ uploads: [...get().uploads, up] })
  },
}))

export const useUploadStatus = () => {
  const loading = useUploads((x) => x.uploads.length > 0)
  const error = useUploads((x) => x.error)
  const update = useStatus((x) => x.update)
  useEffect(() => update('asset-uploads', { loading, error }), [loading, error])
}
