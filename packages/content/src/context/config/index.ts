import { Firestore } from '@firebase/firestore'
import { AuthUser } from '@fiar/workbench'
import React from 'react'

import { IContentCollection, IContentDocument } from '../../schema'
import { ContentContext } from '../../schema/context'

export type ContentConfig = {
  contentPrefix: string
  firestore: Firestore
  content: ReadonlyArray<IContentCollection<any, any> | IContentDocument<any, any>>
  user?: () => AuthUser | null | undefined
}

const ContentConfigContext = React.createContext<ContentContext | null>(null)
export const ContentConfigProvider = ContentConfigContext.Provider
export const useConfig = () => {
  const config = React.useContext(ContentConfigContext)
  if (!config) throw new Error('Missing Asset config')
  return config
}
