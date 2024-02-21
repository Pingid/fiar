import { startAfter } from '@firebase/firestore'
import { Pagination } from '@fiar/components'

import { useCollectionListData, useCollectionQuery } from '../hooks/index.js'

export const Paginater = (props: { path: string }) => {
  const pages = useCollectionQuery((x) => x.pages)
  const update = useCollectionQuery((x) => x.update)
  const limit = useCollectionQuery((x) => x.constraints.find((x) => x.type === 'limit'))
  const data = useCollectionListData(props.path)

  const onPage = (n: number) => {
    const latest = data.data?.docs.slice(-1)[0]
    if (n > pages.length && latest) {
      useCollectionQuery.setState((x) => ({ pages: [...x.pages, latest] }))
      return update('startAfter', startAfter(latest))
    }
    const next = pages.slice(0, n)
    update('startAfter', next[next.length - 1] ? startAfter(next[next.length - 1]) : undefined)
    useCollectionQuery.setState({ pages: next })
  }

  return (
    <Pagination pages={pages.length} onPage={onPage} end={(data.data?.docs.length || 0) < (limit as any)?._limit} />
  )
}
