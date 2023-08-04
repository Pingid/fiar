import { StorageReference, UploadTask } from '@firebase/storage'
import { StoreApi, UseBoundStore, create } from 'zustand'

export type UploadAsset = { file: File; name: string; task: UploadTask }
export type UploadState = {
  error: null | string
  uploads: UploadAsset[]
  add: (files: UploadAsset[]) => void
  populate: (items: StorageReference[]) => (StorageReference | UploadAsset)[]
}

export const isUploadAsset = (x: StorageReference | UploadAsset): x is UploadAsset =>
  (x as UploadAsset).file instanceof File

export const useUploads: UseBoundStore<StoreApi<UploadState>> = create<UploadState>((set, get) => ({
  error: null,
  uploads: [],
  add: (files) => {
    files.forEach((x) => {
      x.task.catch((e) => {
        set({ error: e.message })
        set((state) => ({ uploads: state.uploads.filter((y) => y !== x) }))
      })
    })
    return set((state) => {
      const filtered = files.filter((x) => !state.uploads.some((y) => y.file === x.file))
      return {
        uploads: [...state.uploads, ...filtered],
      }
    })
  },
  populate: (items: StorageReference[]) => {
    const names = items.map((x) => x.name)
    const uploads = get().uploads
    const filtered = uploads.filter((x) => !names.includes(x.file.name))
    if (filtered.length !== uploads.length) set({ uploads: filtered })
    const all = [...items, ...filtered].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
    return all
  },
}))
