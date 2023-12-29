import { Route } from 'wouter'
import { inject } from 'regexparam'

import { IContentCollection, IContentDocument } from '../../schema/index.js'
import { CollectionList } from '../CollectionList/index.js'
import { DocumentEdit } from '../DocumentEdit/index.js'
import { DocumentAdd } from '../DocumentAdd/index.js'
import { ContentList } from '../ContentList/index.js'

const parameterize = (path: string) => trailing(path).replace(/\{([^\}]+)\}/g, ':$1')
const trailing = (path: string) => path.replace(/\/\{[^\}]+\}$/, '')

export const ContentRouter = (props: { collections: IContentCollection[]; documents: IContentDocument[] }) => {
  const collections = props.collections
    .map((x) => {
      const collection = parameterize(trailing(x.path)) as `/${string}`
      const document = `${collection}/:__docId__` as `/${string}`
      const add = `/add${collection}` as `/${string}`
      return [
        <ContentRoute key={collection} {...x} path={collection} component={CollectionList} />,
        <ContentRoute key={document} {...x} path={document} component={DocumentEdit} />,
        <ContentRoute key={add} link={add} {...x} path={collection} component={DocumentAdd} />,
      ]
    })
    .flat()

  const documents = props.documents.map((x) => {
    const path = parameterize(trailing(x.path)) as `/${string}`
    return <ContentRoute key={x.path} component={DocumentEdit} {...x} path={path} />
  })

  return [
    ...collections,
    ...documents,
    <Route path="/" key="/">
      <ContentList collections={props.collections ?? []} documents={props.documents ?? []} />
    </Route>,
  ]
}

const ContentRoute = <P extends { path: string }>({
  component,
  ...props
}: { component: (props: P) => React.ReactNode } & P & { link?: string }) => {
  const Comp: any = component
  return (
    <Route path={props.link ?? props.path}>
      {(params) => <Comp {...props} path={inject(props.path, (params ?? {}) as any)} />}
    </Route>
  )
}
