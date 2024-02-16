import { ModalProvider } from '@fiar/components'

import { DashboardRouter, DashboardRouterProps } from './router/index.js'
import { ExtensionsProvider } from './extensions/index.js'
import { Nav } from './nav/index.js'

export { NavButton, useNavState, NavActionTop, NavActionBottom } from './nav/index.js'
export { type DashboardRouterProps, useIntercept } from './router/index.js'
export { WorkbenchModal, WorkbenchPageModal } from './modal/index.js'
export { Page, useStatus } from './page/index.js'
export { Header } from './page/header/index.js'
export { App } from './app/index.js'

export const Dashboard = ({ children, ...props }: DashboardRouterProps) => {
  return (
    <ExtensionsProvider>
      <ModalProvider className="fixed left-0 top-0 z-50">
        <DashboardRouter {...props}>
          <div className="min-h-[--container-height] w-full [--asside-height:3rem] [--container-height:100dvh] sm:[--asside-height:0rem]">
            <Nav>{children}</Nav>
          </div>
        </DashboardRouter>
      </ModalProvider>
    </ExtensionsProvider>
  )
}
