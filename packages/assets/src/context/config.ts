import { FirebaseStorage } from '@firebase/storage'
import React, { useContext } from 'react'

declare module '@fiar/core/types' {
  export interface FiarPlugins {
    assets?: {
      storage: FirebaseStorage
      storagePrefix: string
    }
  }
}

const AssetConfigContext = React.createContext<AssetsConfig | null>(null)
export const AssetConfigProvider = AssetConfigContext.Provider

export type AssetsConfig = {
  storage: FirebaseStorage
  storagePrefix: string
}

export const useAssetConfig = () => {
  const config = useContext(AssetConfigContext)
  if (!config) throw new Error('Missing Asset config')
  return config
}
