import type { FirebaseApp } from '@firebase/app'
import { getStorage } from '@firebase/storage'
import { create } from 'zustand'

export type AssetFolder = { title: string; path: `/${string}`; accept?: Record<string, string[]> }

export type AssetConfig = {
  rootPath?: string | null | undefined
  app?: FirebaseApp | null
  folders: AssetFolder[]
}

export const useAssetConfig = create<AssetConfig>(() => ({ rootPath: null, storage: null, folders: [] }))

export const useFirebaseStorage = () => {
  const storage = useAssetConfig((x) => (x.app ? getStorage(x.app) : null))
  if (!storage) throw new Error(`Missing firebase storage instance`)
  return storage
}
