import { ContentCollectionProvider } from './content'
import { IContentCollection } from '../../schema'
import { CollectionDataProvider } from './data'

export { useCollectionData } from './data'
export { useCollection } from './content'

export const CollectionProvider = (p: { children: React.ReactNode; value: IContentCollection }): JSX.Element => (
  <ContentCollectionProvider value={p.value}>
    <CollectionDataProvider>{p.children}</CollectionDataProvider>
  </ContentCollectionProvider>
)
