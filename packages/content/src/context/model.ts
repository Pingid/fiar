import { createContext, useContext } from 'react'
import { IContentModel } from '../schema/index.js'

const ModelContext = createContext<IContentModel | null>(null)
export const ModelProvider = ModelContext.Provider
export const useModel = <K extends IContentModel['type'] = 'document' | 'collection'>(): Extract<
  IContentModel,
  { type: K }
> => {
  const m = useContext(ModelContext)
  if (!m) throw new Error(`Missing Model Provider`)
  return { ...m, path: trailing(m.path) } as any
}

const trailing = (path: string) => path.replace(/\/\{[^\}]+\}$/, '')
export const parameterize = (path: string) => trailing(path).replace(/\{([^\}]+)\}/g, ':$1')

const PathRefContext = createContext<string | null>(null)
export const PathRefProvider = PathRefContext.Provider
export const usePathRef = () => useContext(PathRefContext)!
