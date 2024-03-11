import { CircleStackIcon } from '@heroicons/react/24/outline'
import { Route, RouteProps, useRoute } from 'wouter'
import { getFirestore } from '@firebase/firestore'
import { useLayoutEffect } from 'react'
import { inject } from 'regexparam'

import { useExtend } from '@fiar/workbench/extensions'
import { App } from '@fiar/workbench'

import { ModelProvider, PathRefProvider, useModel } from './context/model.js'
import { DocumentAdd, DocumentEdit } from './components/document/index.js'
import { CollectionPage } from './components/collection/page/index.js'
import { ContentConfig, useContentConfig } from './context/config.js'
import { ContentList } from './components/content/index.js'
import { DocumentHooksProvider } from './context/hooks.js'
import { FirestoreProvider } from './context/firestore.js'
import { extensions } from './context/extensions.js'

export type { ContentConfig } from './context/config.js'

export const Content = ({ children, ...props }: { children?: React.ReactNode } & ContentConfig) => {
  if (!useContentConfig.getState().firebase) useContentConfig.setState(props)
  useLayoutEffect(() => useContentConfig.setState(props), [props])
  const firebase = useContentConfig((x) => (x.firebase ? getFirestore(x.firebase) : null))
  useExtend(extensions)

  return (
    <FirestoreProvider value={firebase}>
      <DocumentHooksProvider>
        <App title="Content" icon={<CircleStackIcon />} href="/content">
          <div className="h-full min-h-0 w-full min-w-0">
            {[...(props.collections ?? []), ...(props.documents ?? [])].map((model) => (
              <ModelProvider key={model.path} value={model}>
                <ModelRoutes />
              </ModelProvider>
            ))}

            <Route path="/" key="/">
              <ContentList collections={props.collections ?? []} documents={props.documents ?? []} />
            </Route>
            {children}
          </div>
        </App>
      </DocumentHooksProvider>
    </FirestoreProvider>
  )
}

const ModelRoutes = () => {
  const model = useModel()
  if (model.type === 'document') return <ContentRoute path={model.path} component={DocumentEdit} />
  return (
    <>
      <ContentRoute path={`${model.path}`} page="add" component={DocumentAdd} />
      <ContentRoute path={`${model.path}/:docId`} component={DocumentEdit} />
      <ContentRoute path={`${model.path}`} component={CollectionPage} />
    </>
  )
}

export const ContentRoute = (props: RouteProps & { path: string; page?: string }) => {
  const r = useRoute(props.path)
  return (
    <PathRefProvider value={inject(props.path, r[1] ?? {})}>
      <Route {...props} path={props.page ? `/${props.page}${props.path}` : props.path} />
    </PathRefProvider>
  )
}
