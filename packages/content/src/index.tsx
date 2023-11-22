import { CircleStackIcon } from '@heroicons/react/24/outline'
import { Firestore } from '@firebase/firestore'
import { useLayoutEffect } from 'react'

import { UseExtension, useExtend } from '@fiar/workbench/extensions'
import { Route } from 'wouter'

import { App } from '@fiar/workbench'

import { ContentPage, useContentItemList } from './components/ContentPage/index.js'
import { DocumentLink, Document, CollectionPage } from './components/index.js'
import { IContentCollection, IContentDocument } from './schema/index.js'
import { ContentMenu } from './components/ContentMenue/index.js'
import { FirestoreProvider } from './hooks/index.js'
import { extensions } from './context/extensions.js'

export type ContentConfig = {
  firestore?: Firestore
  collections?: IContentCollection<any, any>[]
  documents?: IContentDocument<any, any>[]
}

export const Content = ({
  children,
  ...props
}: { children?: React.ReactNode } & ContentConfig & { firestore: Firestore }) => {
  useExtend(extensions)
  return (
    <FirestoreProvider value={props.firestore}>
      <App title="Content" icon={<CircleStackIcon />} href="/content">
        <ContentMenu>
          <div className="h-full w-full">
            <Route path="/">
              <ContentPage />
            </Route>
            {(props.collections ?? []).map((collection) => (
              <Content.Collection key={collection.path} collection={collection} />
            ))}
            {(props.documents ?? []).map((document) => (
              <Content.Document key={document.path} document={document} />
            ))}
            {children}
          </div>
        </ContentMenu>
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
      children: <UseExtension extension="collection:card" props={props} />,
    })
  }, [props.collection])

  return (
    <>
      <CollectionPage collection={props.collection}>{props.children}</CollectionPage>
    </>
  )
}

Content.Document = (props: { document: IContentDocument<any, any> }) => {
  const register = useContentItemList((x) => x.registerItem)

  useLayoutEffect(() => {
    return register({
      label: 'Documents',
      key: props.document.path,
      children: (
        <DocumentLink document={props.document}>
          <UseExtension extension="document:card" props={props} />
        </DocumentLink>
      ),
    })
  }, [props.document])

  return (
    <>
      <Document schema={props.document} />
    </>
  )
}
