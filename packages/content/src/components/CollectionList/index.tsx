import { DocumentPlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'wouter'

import { Button } from '@fiar/components'
import { Page } from '@fiar/workbench'

import { CollectionListPagination, useCollectionListData } from '../CollectionListPagination/index.js'
import { IContentCollection } from '../../schema/index.js'
import { DocumentCard } from '../DocumentCard/index.js'

export const CollectionList = (props: IContentCollection) => {
  const data = useCollectionListData(props.path)

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
        <Link href={`/add${props.path}`}>
          <Button icon={<DocumentPlusIcon />} elementType="a" color="active">
            New
          </Button>
        </Link>
      </Page.Header>
      <ul className="space-y-2 p-2 py-4">
        {data.data?.docs.map((x) => {
          const path = `${props.path}/${x.id}`
          return (
            <li key={x.id}>
              <Link href={path}>
                <a>
                  <DocumentCard model={{ ...props, path: path as `/${string}` }} titleField={props.titleField} />
                </a>
              </Link>
            </li>
          )
        })}
      </ul>
    </Page>
  )
}
