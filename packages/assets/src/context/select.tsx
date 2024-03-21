import React, { useCallback, useEffect, useRef } from 'react'
import { StorageReference } from '@firebase/storage'

type SelectAssetContext = (x: Pick<StorageReference, 'name' | 'fullPath' | 'bucket'>) => void
const SelectAssetContext = React.createContext<null | SelectAssetContext>(null)
export const SelectAssetProvider = (props: { value: SelectAssetContext; children: React.ReactNode }) => {
  const cb = useRef(props.value)
  useEffect(() => {
    cb.current = props.value
  }, [props.value])
  return (
    <SelectAssetContext.Provider value={useCallback<SelectAssetContext>((x) => cb.current(x), [])}>
      {props.children}
    </SelectAssetContext.Provider>
  )
}
export const useSelectAsset = () => React.useContext(SelectAssetContext)
