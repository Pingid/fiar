import { createRoot } from 'react-dom/client'

import { Extensions, ExtensionsProvider } from '@fiar/workbench/extensions'
import { Dashboard, DashboardRouterProps } from '@fiar/workbench'
import { Content, ContentConfig } from '@fiar/content'
import { Assets, AssetConfig } from '@fiar/assets'
import { Auth, AuthConfig } from '@fiar/auth'

export const createFiar = (
  config: { components?: Extensions; node: HTMLElement } & DashboardRouterProps &
    ContentConfig &
    AssetConfig &
    AuthConfig,
) => {
  console.log(config)
  createRoot(config.node).render(
    <ExtensionsProvider value={config.components || {}}>
      <Dashboard {...config}>
        {config && <Auth {...config} />}
        {config && <Content {...config} />}
        {config && <Assets {...config} />}
      </Dashboard>
    </ExtensionsProvider>,
  )
}
