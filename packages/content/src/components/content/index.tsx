import { DocumentDuplicateIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { collection, doc, getCountFromServer } from '@firebase/firestore'
import { Link } from 'wouter'
import useSWR from 'swr'
import { cn } from 'mcn'

import { Header } from '@fiar/workbench'
import { Card } from '@fiar/components'

import { type IContentModel, type IContentCollection } from '../../schema/index.js'
import { useDocumentSnapshot, useFirestore } from '../../context/firestore.js'
import { date, parameterize, trailing } from '../../util/index.js'
import { ModelProvider, useModel } from '../../context/model.js'

export const ContentList = (props: { models: IContentModel[] }) => {
  return (
    <>
      <Header breadcrumbs={[{ children: 'Content', href: '/' }]}></Header>
      <ul className="space-y-2 p-2">
        {props.models.map((x) => (
          <li key={x.path}>
            <ModelProvider value={x}>
              <ModelCard />
            </ModelProvider>
          </li>
        ))}
      </ul>
    </>
  )
}

const ModelCard = () => {
  const model = useModel()
  if (model.type === 'collection') return <CollectionCard {...model} />
  return <DocumentCard />
}

const CollectionCard = (props: IContentCollection) => {
  const path = trailing(props.path)
  const parameterized = parameterize(path)
  const ref = collection(useFirestore(), 'articles')
  const draft = useSWR(ref.path + 'count', () => getCountFromServer(ref))
  const count = draft.data?.data().count

  return (
    <Link to={parameterized} asChild>
      <Card icon={<DocumentDuplicateIcon />} head={props.label ?? path} elementType="a" className="block">
        <div className="flex justify-between">
          <p className="pt-1 text-sm opacity-60">{path}</p>
          <div
            className={cn('flex w-full justify-end gap-3 pt-1 text-sm leading-none', [
              draft.isLoading,
              'opacity-30',
              'opacity-60',
            ])}
          >
            {draft.error ? <span className="text-error">Error</span> : <span>{count ?? '0'} Documents</span>}
          </div>
        </div>
      </Card>
    </Link>
  )
}

const DocumentCard = () => {
  const model = useModel()

  const firestore = useFirestore()
  const data = useDocumentSnapshot(doc(firestore, model.path))

  const createTime = (data.data as any)?._document?.createTime?.timestamp?.toDate() as Date | undefined
  const updateTime = (data.data as any)?._document?.version?.timestamp?.toDate() as Date | undefined

  const title = model.label

  return (
    <Link to={model.path} asChild>
      <Card
        icon={<DocumentIcon />}
        elementType="a"
        className="block"
        head={
          <span className="flex w-full items-baseline justify-between">
            <span>{title}</span>
            <span className="text-sm opacity-60">{createTime && date(createTime).format('YY/MM/DD')}</span>
          </span>
        }
      >
        <div className="flex w-full justify-between">
          <p className="pt-1 text-sm opacity-60"></p>
          <div className="flex w-full justify-end gap-3 pt-1 text-sm leading-none opacity-60">
            {data.data?.exists() ? (
              <span>{updateTime && date(updateTime).calendar()}</span>
            ) : (
              <span className="opacity-40">Missing</span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  )
}
