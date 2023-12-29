import { collection, limit, startAfter, type QueryDocumentSnapshot } from '@firebase/firestore'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { create } from 'zustand'
import { cn } from 'mcn'

import { useCollectionData, useFirestore } from '../../hooks/index.js'

export const useCollectionListData = (path: string) => {
  const firestore = useFirestore()
  const pages = useCollectionListState((x) => x.pages)
  const size = useCollectionListState((x) => x.size)
  return useCollectionData(collection(firestore, path), {
    constraints: [limit(size), ...(pages.slice(-1)[0] ? [startAfter(pages.slice(-1)[0])] : [])],
    once: pages.length > 0,
  })
}

export const useCollectionListState = create(() => ({
  size: 10,
  pages: [] as QueryDocumentSnapshot[],
}))

export const CollectionListPagination = (props: { path: string }): JSX.Element => {
  const pages = useCollectionListState((x) => x.pages)
  const size = useCollectionListState((x) => x.size)
  const data = useCollectionListData(props.path)
  const end = !data.data?.docs || data.data?.docs.length < size
  const goTo = (n: number) => {
    const latest = data.data?.docs.slice(-1)[0]
    if (n > pages.length && latest) useCollectionListState.setState((x) => ({ pages: [...x.pages, latest] }))
    else useCollectionListState.setState((x) => ({ pages: x.pages.slice(0, n) }))
  }
  return (
    <div className="flex justify-between px-3 py-0.5 text-sm">
      <div></div>
      <div className="flex gap-3">
        <button
          disabled={pages.length === 0}
          className={cn('flex items-center gap-1', [pages.length === 0, 'opacity-20', 'hover:text-active'])}
          onClick={() => goTo(pages.length - 1)}
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </button>
        <div className="flex gap-1">
          {pages
            .map((_, i) => i)
            .slice(-3)
            .map((x) => (
              <button
                key={x}
                className={cn('hover:text-active text-xs opacity-60 hover:opacity-100')}
                onClick={() => goTo(x)}
              >
                {x + 1}
              </button>
            ))}
          <button>{pages.length + 1}</button>
        </div>
        <button
          disabled={end}
          className={cn('flex items-center gap-1', [end, 'opacity-20', 'hover:text-active '])}
          onClick={() => goTo(pages.length + 1)}
        >
          <ArrowLeftIcon className="h-4 w-4 rotate-180" />
        </button>
      </div>
    </div>
  )
}
