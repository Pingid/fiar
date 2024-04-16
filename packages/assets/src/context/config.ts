import { getStorage, type FirebaseStorage } from '@firebase/storage'
import type { FirebaseApp } from '@firebase/app'
import { create } from 'zustand'

export type AssetFolder = { title: string; path: `/${string}`; accept?: Record<string, string[]> }

export type AssetConfig = {
  rootPath?: string | undefined
  app?: FirebaseApp | undefined
  storage?: FirebaseStorage | undefined
  folders: AssetFolder[]
}

export const useAssetConfig = create<AssetConfig>(() => ({ folders: [] }))

export const useFirebaseStorage = () => {
  const storage = useAssetConfig((x) => x.storage ?? (x.app ? getStorage(x.app) : null))
  if (!storage) throw new Error(`Missing firebase storage instance`)
  return storage
}
