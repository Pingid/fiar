import { createContext, useCallback, useContext, useMemo } from 'react'
import { useLocationProperty, navigate } from 'wouter/use-location'
import { Router, BaseLocationHook, useRouter } from 'wouter'
import makeCachedMatcher from 'wouter/matcher'
import { parse } from 'regexparam'

import { MemoryRouter } from './memory.js'

const relativePath = (base = '', path = location.hash.replace(/^#/, '') || '/') =>
  !path.toLowerCase().indexOf(base.toLowerCase()) ? path.slice(base.length) || '/' : '~' + path

const hashNavigate = (to: string) => navigate('#/' + to.replace(/^\//, ''))
const hashLocation = () => window.location.hash.replace(/^#/, '') || '/'
const useHashLocation: BaseLocationHook = (opts: any = {}) => [
  relativePath(opts.base, useLocationProperty(hashLocation)),
  useCallback(
    (to: string) => hashNavigate([...(opts.base ?? '').split('/'), ...to.split('/')].filter(Boolean).join('/')),
    [opts.base],
  ),
]

const matcher = makeCachedMatcher((path: string) => {
  const { keys, pattern } = parse(path)
  return { keys: keys.map((name) => ({ name })), regexp: pattern }
})

export type DashboardRouterProps = {
  children?: React.ReactNode
  routing?: 'hash' | 'memory' | 'browser' | undefined
  basename?: string | undefined
  initialPath?: string
}

const DashboardRouterContext = createContext<DashboardRouterProps>({})

export const DashboardRouter = (props: DashboardRouterProps) => {
  const router = useRouter()
  const parent = useContext(DashboardRouterContext)
  const p = useMemo(() => ({ ...parent, ...props }), [])

  if (p.routing === 'hash') {
    return (
      <DashboardRouterContext.Provider value={p}>
        <Router parent={router} hook={useHashLocation} base={p.basename as string} matcher={matcher}>
          {p.children}
        </Router>
      </DashboardRouterContext.Provider>
    )
  }

  if (p.routing === 'memory') {
    return (
      <DashboardRouterContext.Provider value={p}>
        <MemoryRouter
          parent={router}
          initialPath={p.initialPath as string}
          base={p.basename as string}
          matcher={matcher}
        >
          {p.children}
        </MemoryRouter>
      </DashboardRouterContext.Provider>
    )
  }

  return (
    <DashboardRouterContext.Provider value={p}>
      <Router parent={router} base={p.basename as string} matcher={matcher}>
        {p.children}
      </Router>
    </DashboardRouterContext.Provider>
  )
}
