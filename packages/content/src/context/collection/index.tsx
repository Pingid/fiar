import { ContentCollectionProvider } from './content/index.js'
import { IContentCollection } from '../../schema/index.js'
import { CollectionDataProvider } from './data/index.js'

export { useCollectionData } from './data/index.js'
export { useCollection } from './content/index.js'

export const CollectionProvider = (p: { children: React.ReactNode; value: IContentCollection }): JSX.Element => (
  <ContentCollectionProvider value={p.value}>
    <CollectionDataProvider>{p.children}</CollectionDataProvider>
  </ContentCollectionProvider>
)
