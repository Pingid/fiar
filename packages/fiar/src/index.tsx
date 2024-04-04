import { createRoot } from 'react-dom/client'

import { Dashboard, DashboardRouterProps } from '@fiar/workbench'
import { Content, ContentConfig } from '@fiar/content'
import { Storage, AssetConfig } from '@fiar/assets'
import { Auth, AuthConfig } from '@fiar/auth'
import { FirebaseApp } from '@firebase/app'

export const createFiar = (
  config: {
    node: HTMLElement
    app: FirebaseApp
    content?: Omit<ContentConfig, 'app'>
    storage?: Omit<AssetConfig, 'app'>
    auth?: Omit<AuthConfig, 'app'>
  } & DashboardRouterProps,
) => {
  createRoot(config.node).render(
    <>
      <Dashboard {...config}>
        {config.auth && <Auth app={config.app} {...config.auth} />}
        {config.content && <Content app={config.app} {...config.content} />}
        {config.storage && <Storage app={config.app} {...config.storage} />}
      </Dashboard>
    </>,
  )
}
