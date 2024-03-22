import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { ModalProvider } from '@fiar/components'
import { Toaster } from 'sonner'

import { DashboardRouter, DashboardRouterProps } from './router/index.js'
import { InterceptProvider } from './interceptor/index.js'
import { Nav } from './nav/index.js'

export { toast, type ExternalToast, type ToastT } from 'sonner'

export { NavButton, useNavState, NavActionTop } from './nav/index.js'
export { WorkbenchModal, WorkbenchPageModal } from './modal/index.js'
export { type DashboardRouterProps } from './router/index.js'
export { Header } from './header/index.js'
export { useAuth } from './auth/index.js'
export { App } from './app/index.js'

export const Dashboard = ({ children, ...props }: DashboardRouterProps) => {
  return (
    <InterceptProvider>
      <ModalProvider className="fixed left-0 top-0 z-50">
        <Toaster
          toastOptions={{
            className: '!rounded-none !items-start p-3 !bg-back/90',
            classNames: { error: '!border-error !text-error' },
          }}
          icons={{ error: <ExclamationTriangleIcon className="relative top-[3px] h-full w-full" /> }}
        />
        <DashboardRouter {...props}>
          <div className="min-h-[--container-height] w-full [--asside-height:3rem] [--container-height:100dvh] sm:[--asside-height:0rem]">
            <Nav>{children}</Nav>
          </div>
        </DashboardRouter>
      </ModalProvider>
    </InterceptProvider>
  )
}
