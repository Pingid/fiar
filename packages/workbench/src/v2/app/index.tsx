import { Route, Switch, useRouter } from 'wouter'
import { useEffect } from 'react'
import { create } from 'zustand'

import { DashboardRouter, type DashboardRouterProps } from '../router/index.js'
import { ComponentsProvider } from '../components/index.js'
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
  const router = useRouter()
  const registerApp = useApps((x) => x.register)

  useEffect(() => registerApp({ title, icon, children, href }), [title, icon, href, children])

  if (!router.parent) {
    return <DashboardRouter {...props}>{children}</DashboardRouter>
  }

  return (
    <ComponentsProvider>
      <AppLink title={title} icon={icon} to={to} />
      <Switch>
        <Route path={to}>
          <DashboardRouter basename={to}>{children}</DashboardRouter>
        </Route>
        <Route path={`${to}/(.*)`}>
          <DashboardRouter basename={to}>{children}</DashboardRouter>
        </Route>
      </Switch>
    </ComponentsProvider>
  )
}
