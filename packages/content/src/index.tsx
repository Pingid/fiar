import { CircleStackIcon } from '@heroicons/react/24/outline'
import { Firestore } from '@firebase/firestore'

import { useExtend } from '@fiar/workbench/extensions'
import { App } from '@fiar/workbench'

import { IContentCollection, IContentDocument } from './schema/index.js'
import { ContentRouter } from './components/ContentRouter/index.js'
import { FirestoreProvider } from './hooks/index.js'
import { extensions } from './context/extensions.js'

export type ContentConfig = {
  firestore?: Firestore
  collections?: IContentCollection[]
  documents?: IContentDocument[]
}

export const Content = ({
  children,
  ...props
}: { children?: React.ReactNode } & ContentConfig & { firestore: Firestore }) => {
  useExtend(extensions)
  return (
    <FirestoreProvider value={props.firestore}>
      <App title="Content" icon={<CircleStackIcon />} href="/content">
        <div className="h-full min-h-0 w-full min-w-0">
          <ContentRouter collections={props.collections ?? []} documents={props.documents ?? []} />
          {children}
        </div>
      </App>
    </FirestoreProvider>
  )
}
