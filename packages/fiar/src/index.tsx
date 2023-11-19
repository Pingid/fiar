import { FirebaseStorage } from '@firebase/storage'
import { Firestore } from '@firebase/firestore'
import { createRoot } from 'react-dom/client'

import { Dashboard, DashboardRouterProps, Components, ComponentsProvider } from '@fiar/workbench'
import { Content, ContentConfig } from '@fiar/content'
import { Assets, AssetConfig } from '@fiar/assets'
import { AuthConfig, Authorize } from '@fiar/auth'

export const createFiar = (config: {
  components?: Components
  dashboard?: DashboardRouterProps
  content?: ContentConfig & { firestore: Firestore }
  assets?: AssetConfig & { storage: FirebaseStorage }
  auth?: AuthConfig
  node: HTMLElement
}) => {
  const Auth = (props: { children: React.ReactNode }) =>
    config.auth ? <Authorize {...config.auth}>{props.children}</Authorize> : props.children
  const components = { ...config.components }

  createRoot(config.node).render(
    <ComponentsProvider value={components}>
      <Dashboard {...config.dashboard}>
        <Auth>
          {config.content && <Content {...config.content} />}
          {config.assets && <Assets {...config.assets} />}
        </Auth>
      </Dashboard>
    </ComponentsProvider>,
  )
}
