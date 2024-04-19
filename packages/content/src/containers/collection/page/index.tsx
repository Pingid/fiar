import { ArrowLeftIcon, DocumentPlusIcon } from '@heroicons/react/24/outline'
import { startAfter } from '@firebase/firestore'
import { Button } from '@nextui-org/react'
import { useStore } from 'zustand'
import { cn } from 'mcn'

import { Link } from '@fiar/workbench/router'
import { Header } from '@fiar/workbench'

import { QueryStateProvider, useQueryStore } from '../../../context/query.js'
import { useCollectionData } from '../../../context/data.js'
import { useModel } from '../../../context/model.js'
import { Table } from '../table/index.js'

export const DocumentList = () => {
  const model = useModel()
  const breadcrumbs = [
    { children: 'Content', href: '/' },
    { children: model.label, href: model.path },
  ]
  return (
    <QueryStateProvider>
      <Header subtitle={model.path} breadcrumbs={breadcrumbs}>
        <CollectionHeader />
      </Header>
      <Table />
    </QueryStateProvider>
  )
}

const CollectionHeader = () => {
  const model = useModel()
  return (
    <div className="flex w-full items-start justify-between px-3 py-2">
      <div className="py-2">
        <Paginater />
      </div>
      <div className="flex gap-2">
        <Link href={`/add${model.path}`} asChild>
          <Button endContent={<DocumentPlusIcon className="h-4 w-4" />} as="a" color="primary" variant="bordered">
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

export const Pagination = (props: { pages: number; end: boolean; onPage: (page: number) => void }) => {
  const size = 3
  const button = (x: number) => (
    <button
      key={x}
      className={cn('hover:text-active text-xs opacity-60 hover:opacity-100')}
      onClick={() => props.onPage(x)}
    >
      {x + 1}
    </button>
  )

  return (
    <div className="flex gap-2 text-sm">
      <button
        disabled={props.pages === 0}
        className={cn('flex items-center gap-1', [props.pages === 0, 'opacity-20', 'hover:text-active'])}
        onClick={() => props.onPage(props.pages - 1)}
      >
        <ArrowLeftIcon className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-1 leading-none">
        {props.pages >= size && button(0)}
        {props.pages > size && <span className="px-0.5">..</span>}
        {Array.from({ length: props.pages })
          .map((_, i) => i)
          .slice(-(size - 1))
          .map((x) => button(x))}
        <button>{props.pages + 1}</button>
      </div>
      <button
        disabled={props.end}
        className={cn('flex items-center gap-1', [props.end, 'opacity-20', 'hover:text-active '])}
        onClick={() => props.onPage(props.pages + 1)}
      >
        <ArrowLeftIcon className="h-4 w-4 rotate-180" />
      </button>
    </div>
  )
}
