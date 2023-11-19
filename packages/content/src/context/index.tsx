import { DocumentReference } from '@firebase/firestore'

import React from 'react'

type SelectDocumentContext = (doc: DocumentReference<any, any>) => void
const SelectDocumentContext = React.createContext<null | SelectDocumentContext>(null)
export const SelectDocumentProvider = SelectDocumentContext.Provider
export const useSelectDocument = () => React.useContext(SelectDocumentContext)
