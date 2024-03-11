import { useStore } from 'zustand'

import { startAfter } from '@firebase/firestore'
import { Pagination } from '@fiar/components'

import { useCollectionData } from '../../../context/data.js'
import { useQueryStore } from '../../../context/query.js'

export const Paginater = () => {
  const store = useQueryStore()
  const pages = useStore(store, (x) => x.cursors)
  const update = useStore(store, (x) => x.constrain)
  const limit = useStore(store, (x) => x.constraints.find((x) => x.type === 'limit'))
  const data = useCollectionData()

  const onPage = (n: number) => {
    const latest = data.data?.docs.slice(-1)[0]
    if (n > pages.length && latest) {
      store.setState((x) => ({ cursors: [...x.cursors, latest] }))
      return update('startAfter', startAfter(latest))
    }
    const next = pages.slice(0, n)
    update('startAfter', next[next.length - 1] ? startAfter(next[next.length - 1]) : undefined)
    store.setState({ cursors: next })
  }

  return (
    <Pagination pages={pages.length} onPage={onPage} end={(data.data?.docs.length || 0) < (limit as any)?._limit} />
  )
}
