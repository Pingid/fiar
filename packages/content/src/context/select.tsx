import { DocumentReference } from '@firebase/firestore'
import React, { useCallback, useEffect, useRef } from 'react'

type SelectDocumentContext = (doc: DocumentReference<any, any>) => void
const SelectDocumentContext = React.createContext<null | SelectDocumentContext>(null)
export const SelectDocumentProvider = (props: { value: SelectDocumentContext; children: React.ReactNode }) => {
  const cb = useRef(props.value)
  useEffect(() => {
    cb.current = props.value
  }, [props.value])
  return (
    <SelectDocumentContext.Provider value={useCallback<SelectDocumentContext>((x) => cb.current(x), [])}>
      {props.children}
    </SelectDocumentContext.Provider>
  )
}
export const useSelectDocument = () => React.useContext(SelectDocumentContext)
