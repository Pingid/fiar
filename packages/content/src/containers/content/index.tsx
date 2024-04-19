import { ArrowRightIcon, DocumentDuplicateIcon, DocumentIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react/jsx-runtime'
import { doc } from '@firebase/firestore'

import { Header } from '@fiar/workbench'

import { type IContentModel, type IContentCollection } from '../../schema/index.js'
import { useDocumentSnapshot, useFirestore } from '../../context/firestore.js'
import { ModelProvider, useModel } from '../../context/model.js'
import { parameterize, trailing } from '../../util/index.js'
import { LinkCard } from '../../components/index.js'

export const ContentList = (props: { models: IContentModel[] }) => {
  const grouped = [...new Set(props.models.map((x) => x.group)).values()].map((group) => ({
    group,
    models: props.models.filter((y) => y.group === group),
  }))
  return (
    <>
      <Header breadcrumbs={[{ children: 'Content', href: '/' }]}></Header>
      <ul className="grid gap-2 p-2 sm:grid-cols-2">
        {grouped.map((x) => (
          <Fragment key={x.group}>
            {x.group && <p className="text-small relative top-1 sm:col-span-2">{x.group}</p>}
            {x.models.map((x) => (
              <li key={x.path}>
                <ModelProvider value={x}>
                  <ModelCard />
                </ModelProvider>
              </li>
            ))}
          </Fragment>
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

  return (
    <LinkCard href={parameterized} icon={<DocumentDuplicateIcon />} label={props.label ?? ''} subheader={props.path}>
      <div className="transition-padding pr-3 duration-300 group-hover:pr-2">
        <ArrowRightIcon className="text-foreground/70 h-6 w-6" />
      </div>
    </LinkCard>
  )
}

const DocumentCard = () => {
  const model = useModel()

  const firestore = useFirestore()
  const data = useDocumentSnapshot(doc(firestore, model.path))

  // const createTime = (data.data as any)?._document?.createTime?.timestamp?.toDate() as Date | undefined
  // const updateTime = (data.data as any)?._document?.version?.timestamp?.toDate() as Date | undefined

  const exists = data.data?.exists()

  return (
    <LinkCard href={exists ? model.path : `/set${model.path}`} icon={<DocumentIcon />} label={model.label ?? ''}>
      {exists ? (
        <div className="transition-padding pr-3 duration-300 group-hover:pr-2">
          <ArrowRightIcon className="text-foreground/70 h-6 w-6" />
        </div>
      ) : (
        <div className="text-tiny border-default flex h-8 items-center justify-center border px-3 py-1">Create</div>
      )}
    </LinkCard>
  )
}
