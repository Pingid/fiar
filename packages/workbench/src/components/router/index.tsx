import {
  createBrowserRouter,
  createHashRouter,
  createMemoryRouter,
  RouteObject,
  RouterProvider,
} from 'react-router-dom'
import React from 'react'

import { useFiarAppState, useWorkbenchConfig } from '../../context'

export const Router = (p: { children: JSX.Element | null }): JSX.Element | null => {
  const providers = useFiarAppState((x) => x.providers || [])
  const children = useFiarAppState((x) => x.pages || [])
  const config = useWorkbenchConfig()

  const router = React.useMemo(() => {
    if (typeof document === 'undefined') return null

    const page = providers.reduce((a, Provider) => <Provider>{a}</Provider>, p.children)

    const routes: RouteObject[] = [{ path: '/', element: page, children: children }]

    const routerConfig = { basename: config.basename || '/' }

    return config.routing === 'hash'
      ? createHashRouter(routes, routerConfig)
      : config.routing === 'memory'
      ? createMemoryRouter(routes, routerConfig)
      : createBrowserRouter(routes, routerConfig)
  }, [providers, children, config])

  if (!router) return null

  return <RouterProvider router={router} />
}
