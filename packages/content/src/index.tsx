import { CircleStackIcon } from '@heroicons/react/24/outline'
import { getFirestore } from '@firebase/firestore'
import { useLayoutEffect } from 'react'
import { inject } from 'regexparam'

import { Route, RouteProps, useRoute } from '@fiar/workbench/router'
import { useExtend } from '@fiar/workbench/extensions'
import { App } from '@fiar/workbench'

import { ModelProvider, PathRefProvider, useModel } from './context/model.js'
import { DocumentAdd, DocumentUpdate } from './components/document/index.js'
import { DocumentList } from './components/collection/page/index.js'
import { ContentConfig, useContentConfig } from './context/config.js'
import { DocumentSet } from './components/document/set/index.js'
import { ContentList } from './components/content/index.js'
import { DocumentHooksProvider } from './context/hooks.js'
import { FirestoreProvider } from './context/firestore.js'
import { extensions } from './context/extensions.js'

export type { ContentConfig } from './context/config.js'

export const Content = ({ children, ...props }: { children?: React.ReactNode } & ContentConfig) => {
  if (!useContentConfig.getState().app) useContentConfig.setState(props)
  useLayoutEffect(() => useContentConfig.setState(props), [props])
  const firebase = useContentConfig((x) => (x.app ? getFirestore(x.app) : null))
  useExtend(extensions)

  return (
    <FirestoreProvider value={firebase}>
      <DocumentHooksProvider>
        <App title="Content" icon={<CircleStackIcon />} href="/content">
          <div className="h-full min-h-0 w-full min-w-0">
            {props.content.map((model) => (
              <ModelProvider key={model.path} value={model}>
                <ModelRoutes />
              </ModelProvider>
            ))}

            <Route path="/" key="/">
              <ContentList models={props.content} />
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
  if (model.type === 'document') {
    return (
      <>
        <ContentRoute path={model.path} page="set" component={DocumentSet} />
        <ContentRoute path={model.path} component={DocumentUpdate} />
      </>
    )
  }

  return (
    <>
      <ContentRoute path={`${model.path}`} page="add" component={DocumentAdd} />
      <ContentRoute path={`${model.path}/:docId`} component={DocumentUpdate} />
      <ContentRoute path={`${model.path}`} component={DocumentList} />
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
