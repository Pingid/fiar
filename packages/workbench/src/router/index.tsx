import { createContext, useCallback, useContext, useMemo } from 'react'
import { useBrowserLocation } from 'wouter/use-browser-location'
import { BaseLocationHook, Router, useRouter } from 'wouter'
import { useHashLocation } from 'wouter/use-hash-location'
import { memoryLocation } from 'wouter/memory-location'

import { useInterceptor } from '../interceptor/index.js'

export { useIntercept, useInterceptor } from '../interceptor/index.js'
export * from 'wouter'

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
      <NavigationInterceptor>{props.children}</NavigationInterceptor>
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

const NavigationInterceptor = (props: { children: React.ReactNode }) => {
  const interceptor = useInterceptor()

  const router = useRouter()
  const hook = useCallback<BaseLocationHook>(
    (arg: any) => {
      const [location, navigate] = router.hook(arg)
      const shadowed = (path: string, ...args: any[]) => interceptor.current(() => navigate(path, ...args))
      return [location, shadowed]
    },
    [router.hook],
  )

  return (
    <Router base={router.base} hook={hook}>
      {props.children}
    </Router>
  )
}
