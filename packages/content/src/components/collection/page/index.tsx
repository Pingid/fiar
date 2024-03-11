import { Page } from '@fiar/workbench'

import { QueryStateProvider } from '../../../context/query.js'
import { CollectionHeader } from '../header/index.js'
import { useModel } from '../../../context/model.js'
import { Table } from '../table/index.js'

export const CollectionPage = () => {
  const model = useModel()
  const breadcrumbs = [
    { children: 'Content', href: '/' },
    { children: model.label, href: model.path },
  ]
  return (
    <QueryStateProvider>
      <Page>
        <Page.Header subtitle={model.path} breadcrumbs={breadcrumbs}>
          <CollectionHeader />
        </Page.Header>
        <Table />
      </Page>
    </QueryStateProvider>
  )
}
