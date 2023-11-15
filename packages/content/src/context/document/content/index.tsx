import { useLocation } from 'wouter'
import React from 'react'

import { DocumentActions, IContentDocument, createDocumentActions } from '../../../schema/document/index.js'
import { useConfig } from '../../config/index.js'

export type ContentDocumentActions = DocumentActions & { select: () => void; edit: () => void }
export type ContentDocumentContext = Omit<IContentDocument, 'nodeId' | 'infer'> & {
  actions?: Partial<ContentDocumentActions>
}
export const ContentDocumentContext = React.createContext<ContentDocumentContext | null>(null)
export const ContentDocumentProvider = ContentDocumentContext.Provider
export const useGetDocument = () => {
  const [_, navigate] = useLocation()
  const schema = useConfig()
  return (document: ContentDocumentContext) => {
    const actions = createDocumentActions({ ...schema, ...document })
    const select = () => navigate(`/content/${actions.refs.draft.path.split('/').slice(1).join('/')}`)
    const edit = select
    return { ...document, ...actions, select, edit, ...document.actions }
  }
}

export const useDocument = <O extends boolean = false>(
  optional?: O,
): O extends true
  ? undefined | ReturnType<ReturnType<typeof useGetDocument>>
  : ReturnType<ReturnType<typeof useGetDocument>> => {
  const get = useGetDocument()
  const document = React.useContext(ContentDocumentContext)
  if (!document && optional) return undefined as any
  if (!document) throw new Error(`Missing ContentDocumentProvider`)
  return get(document) as any
}
