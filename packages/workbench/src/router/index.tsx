import { useBrowserLocation } from 'wouter/use-browser-location'
import { useHashLocation } from 'wouter/use-hash-location'
import { createContext, useContext, useMemo } from 'react'
import { memoryLocation } from 'wouter/memory-location'
import { Router } from 'wouter'

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
  if (router?.type === 'memory') return <MemoryRouter {...router}>{props.children}</MemoryRouter>
  if (router?.type === 'hash') {
    return (
      <DashboardContext.Provider value={true}>
        <Router hook={useHashLocation} base={router?.base as string}>
          {props.children}
        </Router>
      </DashboardContext.Provider>
    )
  }
  return (
    <DashboardContext.Provider value={true}>
      <Router hook={useBrowserLocation} base={router?.base as string}>
        {props.children}
      </Router>
    </DashboardContext.Provider>
  )
}

const MemoryRouter = (
  props: Partial<Exclude<Parameters<typeof memoryLocation>[0], undefined>> & {
    base?: string
    children: React.ReactNode
  },
) => {
  const memory = useMemo(() => memoryLocation(props as any), [props.path, props.static, props.record])
  return (
    <Router hook={memory.hook} base={props.base as string}>
      {props.children}
    </Router>
  )
}
