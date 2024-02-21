import { AdjustmentsHorizontalIcon, DocumentPlusIcon } from '@heroicons/react/24/outline'
import { Link } from 'wouter'

import { Button } from '@fiar/components'
import { Page } from '@fiar/workbench'

import { Paginater } from '../collection/paginate/index.js'
import { IContentCollection } from '../../schema/index.js'
import { Table } from '../collection/table/index.js'

export const CollectionList = (props: IContentCollection) => {
  return (
    <Page>
      <Page.Header
        subtitle={props.path}
        breadcrumbs={[
          { children: 'Content', href: '/' },
          { children: props.label, href: props.path },
        ]}
      >
        <div className="flex w-full items-start justify-between px-3 py-2">
          <div className="py-2">
            <Paginater path={props.path} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" icon={<AdjustmentsHorizontalIcon />} elementType="a" color="active"></Button>
            <Link href={`/add${props.path}`} asChild>
              <Button size="sm" icon={<DocumentPlusIcon />} elementType="a" color="active">
                New
              </Button>
            </Link>
          </div>
        </div>
      </Page.Header>

      <Table {...props} />
    </Page>
  )
}
