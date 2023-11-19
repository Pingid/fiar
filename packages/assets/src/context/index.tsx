import { FirebaseStorage } from '@firebase/storage'
import { create } from 'zustand'

export type AssetFolder = { title: string; path: string; accept?: Record<string, string[]> }

export type AssetConfig = {
  rootPath?: string | null | undefined
  storage: FirebaseStorage | null
  folders?: AssetFolder[]
}

export const useConfig = create<AssetConfig>(() => ({ rootPath: null, storage: null, folders: [] }))

export const useStorage = () => {
  const storage = useConfig((x) => x.storage)
  if (!storage) throw new Error(`Missing firebase storage instance`)
  return storage
}
