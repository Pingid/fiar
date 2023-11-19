import { ModalProvider } from '@fiar/components'

import { DashboardRouter, DashboardRouterProps } from './router/index.js'
import { ComponentsProvider } from './components/index.js'
import { Nav } from './nav/index.js'

export {
  type Components,
  register,
  RenderComponent,
  ComponentsProvider,
  useComponentsStore,
} from './components/index.js'
export { Page, usePageStatus, useSetPageStatus, usePageStatusAsyncHandler } from './page/index.js'
export { NavButton, useNavOpen, NavActionTop, NavActionBottom } from './nav/index.js'
export { WorkbenchModal, WorkbenchPageModal } from './modal/index.js'
export { type DashboardRouterProps } from './router/index.js'
export { App } from './app/index.js'

export const Dashboard = ({ children, ...props }: DashboardRouterProps) => {
  return (
    <ComponentsProvider>
      <ModalProvider className="fixed left-0 top-0 z-50">
        <DashboardRouter {...props}>
          <div className="flex !min-h-[100dvh] min-h-[100vh] w-full">
            <Nav>{children}</Nav>
          </div>
        </DashboardRouter>
      </ModalProvider>
    </ComponentsProvider>
  )
}
