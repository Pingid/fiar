import { useModel } from './model.js'

const parameterize = (path: string) => trailing(path).replace(/\{([^\}]+)\}/g, ':$1')
const trailing = (path: string) => path.replace(/\/\{[^\}]+\}$/, '')

export const useCollectionPage = () => {
  const model = useModel()
  const path = parameterize(trailing(model.path))
  return {
    base: path,
    add: model.type === 'collection' ? `/add${path}` : undefined,
    edit: model.type === 'collection' ? `${path}/:docId` : path,
  }
}
