import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { doc } from '@firebase/firestore'
import { Link } from 'wouter'

import { Button } from '@fiar/components'
import { Page } from '@fiar/workbench'

import { CollectionListPagination, useCollectionListData } from '../CollectionListPagination/index.js'
import { useSelectDocument } from '../../context/select.js'
import { IContentCollection } from '../../schema/index.js'
import { DocumentCard } from '../DocumentCard/index.js'
import { useFirestore } from '../../hooks/index.js'

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
        <div className="flex w-full justify-between">
          <CollectionListPagination path={props.path} />
        </div>
        <Link href={`/add${props.path}`} asChild>
          <Button icon={<DocumentPlusIcon />} elementType="a" color="active">
            New
          </Button>
        </Link>
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
