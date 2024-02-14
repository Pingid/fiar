import { collection, limit, startAfter, type QueryDocumentSnapshot } from '@firebase/firestore'
import { Pagination } from '@fiar/components'
import { create } from 'zustand'

import { useCollectionData, useFirestore } from '../../hooks/index.js'

export const useCollectionListData = (path: string) => {
  const firestore = useFirestore()
  const pages = useCollectionListState((x) => x.pages)
  const size = useCollectionListState((x) => x.size)

  return useCollectionData(collection(firestore, path), {
    constraints: [limit(size), ...(pages.slice(-1)[0] ? [startAfter(pages.slice(-1)[0])] : [])],
    // once: pages.length > 0,
  })
}

export const useCollectionListState = create(() => ({
  size: 3,
  pages: [] as QueryDocumentSnapshot[],
}))

export const CollectionListPagination = (props: { path: string }): JSX.Element => {
  const pages = useCollectionListState((x) => x.pages)
  const size = useCollectionListState((x) => x.size)
  const data = useCollectionListData(props.path)
  const end = !data.data?.docs || data.data?.docs.length < size
  const onPage = (n: number) => {
    const latest = data.data?.docs.slice(-1)[0]
    if (n > pages.length && latest) useCollectionListState.setState((x) => ({ pages: [...x.pages, latest] }))
    else useCollectionListState.setState((x) => ({ pages: x.pages.slice(0, n) }))
  }
  return <Pagination pages={pages.length} onPage={onPage} end={end} />
}
