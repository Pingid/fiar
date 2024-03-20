import { UploadTask } from '@firebase/storage'
import { toast } from '@fiar/workbench'
import { create } from 'zustand'

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
      .catch((error) => {
        set({ error })
        toast.error(error.message)
      })
      .then(() => {
        set({ uploads: get().uploads.filter((y) => y.task !== up.task) })
        revalidate()
      })

    set({ uploads: [...get().uploads, up] })
  },
}))
