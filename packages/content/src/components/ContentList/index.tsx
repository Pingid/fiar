import { Page } from '@fiar/workbench'
import { Link } from 'wouter'

import { IContentCollection, IContentDocument } from '../../schema/index.js'
import { CollectionCard } from '../CollectionCard/index.js'
import { DocumentCard } from '../DocumentCard/index.js'

export const ContentList = (props: { collections: IContentCollection[]; documents: IContentDocument[] }) => {
  return (
    <Page>
      <Page.Header breadcrumbs={[{ children: 'Content', href: '/' }]}></Page.Header>

      <ul className="space-y-2 p-2">
        {props.collections.map((x) => (
          <li key={x.path}>
            <CollectionCard key={x.path} {...x} />
          </li>
        ))}
        {props.documents.map((x) => (
          <li key={x.path}>
            <Link href={x.path} className="w-full">
              <DocumentCard key={x.path} model={x} />
            </Link>
          </li>
        ))}
      </ul>
    </Page>
  )
}
