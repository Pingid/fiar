import React from 'react'
import { DocumentVersions } from '../../schema/document/index.js'

export const ContentVersionContext = React.createContext<keyof DocumentVersions | undefined>(undefined)
export const ContentVersionProvider = ContentVersionContext.Provider
export const useContentVersion = () => React.useContext(ContentVersionContext)!
