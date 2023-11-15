import { CircleStackIcon } from '@heroicons/react/24/outline'
import { Fragment, useLayoutEffect } from 'react'
import { Firestore } from '@firebase/firestore'
import { Route } from 'wouter'

import { App, RenderComponent, ComponentsProvider } from '@fiar/workbench/v2'

import { IContentCollection, IContentDocument } from './schema/index.js'
import { DocumentLink } from './components/document/index.js'
import { ContentList, useContent } from './content/index.js'
import { Collection } from './collection/index.js'
import { FirestoreProvider } from './lib/index.js'
import { Document } from './document/index.js'
import { abs } from './util/index.js'

import './components/index.js'
import { useContentConfig, ContentConfig } from './context/index.js'

export type { ContentConfig } from './context/index.js'
export * from './field/index.js'

export const Content = ({
  children,
  ...props
}: { children?: React.ReactNode } & ContentConfig & { firestore: Firestore }) => {
  useLayoutEffect(() => useContentConfig.setState({ firestore: props.firestore }), [props.firestore])

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
  const path = abs(props.collection.path)
  const child = <Collection collection={props.collection}>{props.children}</Collection>
  const register = useContent((x) => x.register)
  useLayoutEffect(() => {
    return register({
      label: 'Collections',
      key: props.collection.path,
      children: <RenderComponent component="collection:card" props={props} />,
    })
  }, [props.collection])

  useLayoutEffect(() => {
    useContentConfig.setState((x) => ({ collections: [...(x.collections ?? []), props.collection] }))
    return () => {
      useContentConfig.setState((x) => ({
        collections: [...(x.collections ?? [])].filter((x) => x !== props.collection),
      }))
    }
  }, [props.collection])

  return (
    <ComponentsProvider>
      <Fragment key={path}>
        <Route path={`${path}/:documentId`}>{child}</Route>
        <Route path={`/create${path}`}>{child}</Route>
        <Route path={path}>{child}</Route>
      </Fragment>
    </ComponentsProvider>
  )
}

Content.Document = (props: { document: IContentDocument<any, any> }) => {
  const path = abs(props.document.path)
  const child = <Document schema={props.document} />
  const register = useContent((x) => x.register)

  useLayoutEffect(() => {
    useContentConfig.setState((x) => ({ documents: [...(x.documents ?? []), props.document] }))
    return () => {
      useContentConfig.setState((x) => ({ documents: [...(x.documents ?? [])].filter((x) => x !== props.document) }))
    }
  }, [props.document])

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
  return (
    <ComponentsProvider>
      <Fragment key={path}>
        <Route path={`/create${path}`}>{child}</Route>
        <Route path={path}>{child}</Route>
      </Fragment>
    </ComponentsProvider>
  )
}
