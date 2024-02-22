import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { startAfter } from '@firebase/firestore'

import { Button, Pagination } from '@fiar/components'
import { Link } from '@fiar/workbench'

import { useCollectionListData, useCollectionQuery } from '../hooks/index.js'
import { IContentCollection } from '../../../schema/index.js'

export const CollectionHeader = (props: IContentCollection) => {
  return (
    <div className="flex w-full items-start justify-between px-3 py-2">
      <div className="py-2">
        <Paginater path={props.path} />
      </div>
      <div className="flex gap-2">
        <Link href={`/add${props.path}`} asChild>
          <Button size="sm" icon={<DocumentPlusIcon />} elementType="a" color="active">
            New
          </Button>
        </Link>
      </div>
    </div>
  )
}

const Paginater = (props: { path: string }) => {
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
