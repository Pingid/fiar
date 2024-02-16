import { FirebaseStorage } from '@firebase/storage'
import { Firestore } from '@firebase/firestore'
import { createRoot } from 'react-dom/client'

import { Extensions, ExtensionsProvider } from '@fiar/workbench/extensions'
import { Dashboard, DashboardRouterProps } from '@fiar/workbench'
import { Content, ContentConfig } from '@fiar/content'
import { Assets, AssetConfig } from '@fiar/assets'
import { Auth, AuthConfig } from '@fiar/auth'

export const createFiar = (config: {
  components?: Extensions
  dashboard?: DashboardRouterProps
  content?: ContentConfig & { firestore: Firestore }
  assets?: AssetConfig & { storage: FirebaseStorage }
  auth?: AuthConfig
  node: HTMLElement
}) => {
  const AuthC = (props: { children: React.ReactNode }) =>
    config.auth ? <Auth {...config.auth}>{props.children}</Auth> : props.children
  const components = { ...config.components }

  createRoot(config.node).render(
    <ExtensionsProvider value={components}>
      <Dashboard {...config.dashboard}>
        <AuthC>
          {config.content && <Content {...config.content} />}
          {config.assets && <Assets {...config.assets} />}
        </AuthC>
      </Dashboard>
    </ExtensionsProvider>,
  )
}
