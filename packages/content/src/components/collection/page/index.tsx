import { Page } from '@fiar/workbench'

import { IContentCollection } from '../../../schema/index.js'
import { useCollectionListData } from '../hooks/index.js'
import { CollectionHeader } from '../header/index.js'
import { Table } from '../table/index.js'

export const CollectionPage = (props: IContentCollection) => {
  const data = useCollectionListData(props.path)
  const breadcrumbs = [
    { children: 'Content', href: '/' },
    { children: props.label, href: props.path },
  ]
  return (
    <Page>
      <Page.Header subtitle={props.path} breadcrumbs={breadcrumbs}>
        <CollectionHeader {...props} />
      </Page.Header>
      <Table {...props} docs={data.data?.docs ?? []} />
    </Page>
  )
}
