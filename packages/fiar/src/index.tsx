import { createRoot } from 'react-dom/client'

import { Dashboard, DashboardRouterProps } from '@fiar/workbench'
import { Content, ContentConfig } from '@fiar/content'
import { Assets, AssetConfig } from '@fiar/assets'
import { Auth, AuthConfig } from '@fiar/auth'

export const createFiar = (
  config: { node: HTMLElement } & DashboardRouterProps & ContentConfig & AssetConfig & AuthConfig,
) => {
  createRoot(config.node).render(
    <>
      <Dashboard {...config}>
        <Auth {...config} />
        <Content {...config} />
        <Assets {...config} />
      </Dashboard>
    </>,
  )
}
