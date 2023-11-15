import { DocumentReference, Firestore } from '@firebase/firestore'
import { create } from 'zustand'
import React from 'react'

import { IContentCollection, IContentDocument } from '../schema/index.js'

type SelectDocumentContext = (doc: DocumentReference<any, any>) => void
const SelectDocumentContext = React.createContext<null | SelectDocumentContext>(null)
export const SelectDocumentProvider = SelectDocumentContext.Provider
export const useSelectDocument = () => React.useContext(SelectDocumentContext)

export type ContentConfig = {
  firestore?: Firestore
  collections?: IContentCollection<any, any>[]
  documents?: IContentDocument<any, any>[]
}

export const useContentConfig = create<ContentConfig>(() => ({}))
