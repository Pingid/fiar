import { useLocation } from 'wouter'
import React from 'react'

import { CollectionActions, createCollectionActions, IContentCollection } from '../../../schema/collection/index.js'
import { useConfig } from '../../config/index.js'

type ContentCollectionContext = Omit<IContentCollection, 'nodeId' | 'infer'> & { actions?: Partial<CollectionActions> }
export const ContentCollectionContext = React.createContext<ContentCollectionContext | null>(null)
export const ContentCollectionProvider = ContentCollectionContext.Provider
export const useGetCollection = () => {
  const schema = useConfig()
  const [_, navigate] = useLocation()
  return (collection: ContentCollectionContext) => {
    const actions = createCollectionActions({ ...schema, ...collection })
    const visit = () => navigate(`/content/${actions.refs.draft.path.split('/').slice(1).join('/')}`)
    return { ...collection, ...actions, ...collection.actions, visit }
  }
}

export const useCollection = <O extends boolean = false>(
  optional?: O,
): O extends true
  ? undefined | ReturnType<ReturnType<typeof useGetCollection>>
  : ReturnType<ReturnType<typeof useGetCollection>> => {
  const get = useGetCollection()
  const collection = React.useContext(ContentCollectionContext)
  if (!collection && optional) return undefined as any
  if (!collection) throw new Error(`Missing ContentCollectionProvider`)
  return get(collection) as any
}
