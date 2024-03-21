import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { startAfter } from '@firebase/firestore'
import { useStore } from 'zustand'

import { Button, Pagination } from '@fiar/components'
import { Link } from '@fiar/workbench/router'

import { useCollectionData } from '../../../context/data.js'
import { useQueryStore } from '../../../context/query.js'
import { useModel } from '../../../context/model.js'

export const CollectionHeader = () => {
  const model = useModel()
  return (
    <div className="flex w-full items-start justify-between px-3 py-2">
      <div className="py-2">
        <Paginater />
      </div>
      <div className="flex gap-2">
        <Link href={`/add${model.path}`} asChild>
          <Button icon={<DocumentPlusIcon />} elementType="a" color="active">
            New
          </Button>
        </Link>
      </div>
    </div>
  )
}

const Paginater = () => {
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
