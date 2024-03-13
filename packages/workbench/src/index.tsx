import { ModalProvider } from '@fiar/components'
import { Toaster } from 'sonner'

import { DashboardRouter, DashboardRouterProps } from './router/index.js'
import { InterceptProvider } from './interceptor/index.js'
import { ExtensionsProvider } from './extensions/index.js'
import { Nav } from './nav/index.js'

export { toast, type ExternalToast, type ToastT } from 'sonner'
export * from 'wouter'

export { NavButton, useNavState, NavActionTop } from './nav/index.js'
export { WorkbenchModal, WorkbenchPageModal } from './modal/index.js'
export { useIntercept, useInterceptor } from './interceptor/index.js'
export { type DashboardRouterProps } from './router/index.js'
export { Header } from './header/index.js'
export { useAuth } from './auth/index.js'
export { App } from './app/index.js'

export const Dashboard = ({ children, ...props }: DashboardRouterProps) => {
  return (
    <ExtensionsProvider>
      <InterceptProvider>
        <ModalProvider className="fixed left-0 top-0 z-50">
          <Toaster className="" />
          <DashboardRouter {...props}>
            <div className="min-h-[--container-height] w-full [--asside-height:3rem] [--container-height:100dvh] sm:[--asside-height:0rem]">
              <Nav>{children}</Nav>
            </div>
          </DashboardRouter>
        </ModalProvider>
      </InterceptProvider>
    </ExtensionsProvider>
  )
}
