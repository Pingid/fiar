import { FirebaseStorage, StorageReference, UploadTask, ref, uploadBytesResumable } from '@firebase/storage'
import { create } from 'zustand'

export type UploadAsset = { file: File; name: string; task: UploadTask; fullPath: string }
export type UploadState = {
  error: null | Error
  uploads: UploadAsset[]
  add: (storage: FirebaseStorage, path: string, files: File[]) => void
  refresh: (items: StorageReference[]) => void
  populate: (path: string, items: StorageReference[]) => (StorageReference | UploadAsset)[]
}

export const isUploadAsset = (x: StorageReference | UploadAsset): x is UploadAsset =>
  (x as UploadAsset).file instanceof File

export const useUploads = create<UploadState>((set, get) => ({
  error: null,
  uploads: [],
  add: (storage: FirebaseStorage, path: string, files: File[]) => {
    const uploads = files.map((file) => {
      const fullPath = `${path}/${file.name}`
      const task = uploadBytesResumable(ref(storage, fullPath), file)
      return { file, name: file.name, task, fullPath }
    })
    uploads.forEach((x) => {
      x.task.catch((e) => set((state) => ({ error: e, uploads: state.uploads.filter((y) => y !== x) })))
    })
    return set((state) => {
      const filtered = uploads.filter((x) => !state.uploads.some((y) => y.file === x.file))
      return { uploads: [...state.uploads, ...filtered] }
    })
  },
  refresh: (items) => {
    const existing = items.map((x) => x.fullPath)
    const uploads = get().uploads.filter((x) => !existing.includes(x.fullPath))
    set({ uploads })
  },
  populate: (path, items) => {
    const existing = items.map((x) => x.fullPath)
    const uploads = get().uploads
    const filtered = uploads.filter((x) => !existing.includes(x.fullPath)).filter((x) => x.fullPath.startsWith(path))
    return [...filtered, ...items].sort((a, b) => a.fullPath.toLowerCase().localeCompare(b.fullPath.toLowerCase()))
  },
}))
