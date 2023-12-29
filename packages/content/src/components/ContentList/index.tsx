import { Page } from '@fiar/workbench'
import { Link } from 'wouter'

import { IContentCollection, IContentDocument } from '../../schema/index.js'
import { CollectionCard } from '../CollectionCard/index.js'
import { DocumentCard } from '../DocumentCard/index.js'

export const ContentList = (props: { collections: IContentCollection[]; documents: IContentDocument[] }) => {
  return (
    <Page>
      <Page.Header breadcrumbs={[{ children: 'Content', href: '/' }]} />
      <div className="space-y-3 px-4">
        <h4 className="text-front/50 text-sm font-semibold uppercase">collections</h4>
        <ul className="w-full space-y-3">
          {props.collections.map((x) => (
            <li key={x.path}>
              <CollectionCard key={x.path} {...x} />
            </li>
          ))}
        </ul>
        <h4 className="text-front/50 text-sm font-semibold uppercase">documents</h4>
        <ul className="w-full space-y-3">
          {props.documents.map((x) => (
            <li key={x.path}>
              <Link href={x.path}>
                <a className="w-full">
                  <DocumentCard key={x.path} model={x} />
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Page>
  )
}
