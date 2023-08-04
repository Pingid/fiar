import { StorageReference } from '@firebase/storage'
import React from 'react'

type SelectAssetContext = {
  filter: (name: string) => boolean
  select: (x: Pick<StorageReference, 'name' | 'fullPath' | 'bucket'>) => void
}
const SelectAssetContext = React.createContext<null | SelectAssetContext>(null)
export const SelectAssetProvider = SelectAssetContext.Provider
export const useSelectAsset = () => React.useContext(SelectAssetContext)
