import { useBrowserLocation } from 'wouter/use-browser-location'
import { useHashLocation } from 'wouter/use-hash-location'
import { createContext, useContext, useMemo } from 'react'
import { memoryLocation } from 'wouter/memory-location'
import { Router } from 'wouter'

import { InterceptProvider } from './intercept.js'

export { useIntercept } from './intercept.js'

export type DashboardRouterProps = {
  children?: React.ReactNode
  router?:
    | { type: 'memory'; base?: string; path?: string; static?: boolean }
    | { type: 'browser'; base?: string }
    | { type: 'hash'; base?: string }
    | undefined
}

const DashboardContext = createContext(false)
export const useIsDashboard = () => useContext(DashboardContext)

export const DashboardRouter = (props: DashboardRouterProps) => {
  const router = props.router

  const children = (
    <DashboardContext.Provider value={true}>
      <InterceptProvider>{props.children}</InterceptProvider>
    </DashboardContext.Provider>
  )

  if (router?.type === 'memory') return <MemoryRouter {...router}>{children}</MemoryRouter>
  if (router?.type === 'hash') {
    return (
      <Router hook={useHashLocation} base={router?.base as string}>
        {children}
      </Router>
    )
  }
  return (
    <Router hook={useBrowserLocation} base={router?.base as string}>
      {children}
    </Router>
  )
}

const MemoryRouter = (
  props: Partial<Exclude<Parameters<typeof memoryLocation>[0], undefined>> & {
    base?: string
    children: React.ReactNode
  },
) => (
  <Router
    hook={useMemo(() => memoryLocation(props as any), [props.path, props.static, props.record]).hook}
    base={props.base as string}
  >
    {props.children}
  </Router>
)
