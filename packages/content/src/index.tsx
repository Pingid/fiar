import { CircleStackIcon } from '@heroicons/react/24/outline'
import { getFirestore } from '@firebase/firestore'
import { useLayoutEffect } from 'react'

import { useExtend } from '@fiar/workbench/extensions'
import { App } from '@fiar/workbench'

import { ContentConfig, useContentConfig } from './context/config.js'
import { ContentRouter } from './components/content/index.js'
import { FirestoreProvider } from './hooks/index.js'
import { extensions } from './context/extensions.js'

export type { ContentConfig } from './context/config.js'

export const Content = ({ children, ...props }: { children?: React.ReactNode } & ContentConfig) => {
  if (!useContentConfig.getState().firebase) useContentConfig.setState(props)
  useLayoutEffect(() => useContentConfig.setState(props), [props])
  const firebase = useContentConfig((x) => (x.firebase ? getFirestore(x.firebase) : null))
  useExtend(extensions)

  return (
    <FirestoreProvider value={firebase}>
      <App title="Content" icon={<CircleStackIcon />} href="/content">
        <div className="h-full min-h-0 w-full min-w-0">
          <ContentRouter />
          {children}
        </div>
      </App>
    </FirestoreProvider>
  )
}
