import { CircleStackIcon } from '@heroicons/react/24/outline'
import { Firestore } from '@firebase/firestore'
import { useLayoutEffect } from 'react'
import { Route } from 'wouter'

import { App, RenderComponent } from '@fiar/workbench'

import { ContentList, useContentItemList } from './components/content/index.js'
import { DocumentLink, Document, Collection } from './components/index.js'
import { IContentCollection, IContentDocument } from './schema/index.js'
import { FirestoreProvider } from './lib/index.js'

import './components/index.js'

export * from './components/index.js'
export * from './lib/index.js'

export type ContentConfig = {
  firestore?: Firestore
  collections?: IContentCollection<any, any>[]
  documents?: IContentDocument<any, any>[]
}

export const Content = ({
  children,
  ...props
}: { children?: React.ReactNode } & ContentConfig & { firestore: Firestore }) => {
  return (
    <FirestoreProvider value={props.firestore}>
      <App title="Content" icon={<CircleStackIcon />} href="/content">
        <Route path="/">
          <ContentList />
        </Route>
        {(props.collections ?? []).map((collection) => (
          <Content.Collection key={collection.path} collection={collection} />
        ))}
        {(props.documents ?? []).map((document) => (
          <Content.Document key={document.path} document={document} />
        ))}
        {children}
      </App>
    </FirestoreProvider>
  )
}

Content.Collection = (props: { collection: IContentCollection<any, any>; children?: React.ReactNode }) => {
  const register = useContentItemList((x) => x.registerItem)
  useLayoutEffect(() => {
    return register({
      label: 'Collections',
      key: props.collection.path,
      children: <RenderComponent component="collection:card" props={props} />,
    })
  }, [props.collection])

  return <Collection collection={props.collection}>{props.children}</Collection>
}

Content.Document = (props: { document: IContentDocument<any, any> }) => {
  const register = useContentItemList((x) => x.registerItem)

  useLayoutEffect(() => {
    return register({
      label: 'Documents',
      key: props.document.path,
      children: (
        <DocumentLink document={props.document}>
          <RenderComponent component="document:card" props={props} />
        </DocumentLink>
      ),
    })
  }, [props.document])

  return <Document schema={props.document} />
}
