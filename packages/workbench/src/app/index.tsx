import { Route, Switch } from 'wouter'
import { useEffect } from 'react'
import { create } from 'zustand'

import { DashboardRouter, useIsDashboard, type DashboardRouterProps } from '../router/index.js'
import { ExtensionsProvider } from '../extensions/index.js'
import { StatusProvider } from '../status/index.js'
import { AppLink } from '../nav/index.js'

type App = { title: string; children: React.ReactNode; icon?: React.ReactNode; href: string | undefined }

export const useApps = create<{ pages: App[]; register: (app: App) => () => void }>((set) => ({
  pages: [],
  register: (app) => {
    set((x) => ({ pages: [...x.pages, app] }))
    return () => set((x) => ({ pages: x.pages.filter((x) => x !== app) }))
  },
}))

export const App = ({ title, icon, children, href, ...props }: App & DashboardRouterProps) => {
  const to = href ?? `/${title.toLowerCase().replace(/(\s|\t|\n)+/gim, '-')}`
  const dash = useIsDashboard()
  const registerApp = useApps((x) => x.register)

  useEffect(() => registerApp({ title, icon, children, href }), [title, icon, href, children])

  if (!dash) return <DashboardRouter {...props}>{children}</DashboardRouter>

  return (
    <ExtensionsProvider>
      <StatusProvider>
        <AppLink title={title} icon={icon} to={to} />
        <Switch>
          <Route path={to} nest>
            {children}
          </Route>
          <Route path={`${to}/(.*)`} nest>
            {children}
          </Route>
        </Switch>
      </StatusProvider>
    </ExtensionsProvider>
  )
}
