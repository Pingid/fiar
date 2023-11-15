import { FirebaseStorage } from '@firebase/storage'
import { Firestore } from '@firebase/firestore'
import { createRoot } from 'react-dom/client'

import { Dashboard, DashboardRouterProps } from '@fiar/workbench/v2'
import { Content, ContentConfig } from '@fiar/content/v2'
import { Assets, AssetConfig } from '@fiar/assets/v2'
import { AuthConfig, Authorize } from '@fiar/auth/v2'

export const createFiar = (config: {
  dashboard?: DashboardRouterProps
  content?: ContentConfig & { firestore: Firestore }
  assets?: AssetConfig & { storage: FirebaseStorage }
  auth?: AuthConfig
  node: HTMLElement
}) => {
  const Auth = (props: { children: React.ReactNode }) =>
    config.auth ? <Authorize {...config.auth}>{props.children}</Authorize> : props.children

  createRoot(config.node).render(
    <Dashboard {...config.dashboard}>
      <Auth>
        {config.content && <Content {...config.content} />}
        {config.assets && <Assets {...config.assets} />}
      </Auth>
    </Dashboard>,
  )
}
