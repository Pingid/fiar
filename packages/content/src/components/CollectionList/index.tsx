import { collection, limit, startAfter, type QueryDocumentSnapshot } from '@firebase/firestore'
import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { doc } from '@firebase/firestore'
import { create } from 'zustand'
import { Link } from 'wouter'

import { Button, Pagination } from '@fiar/components'
import { Page } from '@fiar/workbench'

import { useCollectionData, useFirestore } from '../../hooks/index.js'
import { useSelectDocument } from '../../context/select.js'
import { IContentCollection } from '../../schema/index.js'
import { DocumentCard } from '../DocumentCard/index.js'

export const CollectionList = (props: IContentCollection) => {
  const data = useCollectionListData(props.path)
  const select = useSelectDocument()
  const firestore = useFirestore()

  return (
    <Page>
      <Page.Header
        subtitle={props.path}
        breadcrumbs={[
          { children: 'Content', href: '/' },
          { children: props.label, href: props.path },
        ]}
      >
        <div className="flex items-center gap-2">
          <CollectionPagination path={props.path} />
          {/* <CollectionOrder {...props} />
          <CollectionFilter /> */}
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/add${props.path}`} asChild>
            <Button icon={<DocumentPlusIcon />} elementType="a" color="active">
              New
            </Button>
          </Link>
        </div>
      </Page.Header>
      <ul className="space-y-2 px-2 py-2">
        {data.data?.docs.map((x) => {
          const path = `${props.path}/${x.id}`
          const model = { ...props, path: path as `/${string}` }
          return (
            <li key={x.id}>
              <Link href={path} onClick={() => (select ? select(doc(firestore, path)) : undefined)}>
                <DocumentCard model={model} titleField={props.titleField} />
              </Link>
            </li>
          )
        })}
      </ul>
    </Page>
  )
}

const useCollectionListState = create(() => ({
  size: 3,
  pages: [] as QueryDocumentSnapshot[],
  order: { field: null },
}))

export const useCollectionListData = (path: string) => {
  const firestore = useFirestore()
  const pages = useCollectionListState((x) => x.pages)
  const size = useCollectionListState((x) => x.size)

  return useCollectionData(collection(firestore, path), {
    constraints: [limit(size), ...(pages.slice(-1)[0] ? [startAfter(pages.slice(-1)[0])] : [])],
  })
}

export const CollectionPagination = (props: { path: string }): JSX.Element => {
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

// const CollectionOrder = (props: IContentCollection) => {
//   // return <Button icon={<PlusIcon />}>Sort</Button>
//   // return <div>Order by: updatedAt</div>

//   return (
//     <div className="focus-within:border-active flex border px-5 py-2.5 leading-none">
//       <select value={'Sort'} className="appearance-none rounded-none focus:outline-none">
//         <option value="">Sort</option>
//         {Object.entries(props.fields).map(([key, f]) => (
//           <option key={key} value={key}>
//             {f.label}
//           </option>
//         ))}
//       </select>
//       <button className="relative left-2 px-1">
//         <ChevronUpIcon className="h-4 w-4" />
//       </button>
//     </div>
//   )
// }

// const CollectionFilter = () => {
//   return (
//     <div>
//       <Button icon={<PlusIcon />}>Filter</Button>
//     </div>
//   )
// }
