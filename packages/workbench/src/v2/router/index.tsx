import { useLocationProperty, navigate } from 'wouter/use-location'
import { createContext, useCallback, useContext } from 'react'
import { Router, BaseLocationHook, useRouter } from 'wouter'
import makeCachedMatcher from 'wouter/matcher'
import { parse } from 'regexparam'

import { MemoryRouter } from './memory.js'

const relativePath = (base = '', path = location.hash.replace(/^#/, '') || '/') =>
  !path.toLowerCase().indexOf(base.toLowerCase()) ? path.slice(base.length) || '/' : '~' + path

const hashNavigate = (to: string) => {
  return navigate('#/' + to.replace(/^\//, ''))
}
const hashLocation = () => window.location.hash.replace(/^#/, '') || '/'
const useHashLocation: BaseLocationHook = (opts: any = {}) => [
  relativePath(opts.base, useLocationProperty(hashLocation)),
  useCallback(
    (to: string) => {
      const href = [...(opts.base ?? '').split('/'), ...to.split('/')].filter(Boolean).join('/')
      hashNavigate(href)
    },
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
  const p = { ...useContext(DashboardRouterContext), ...props }

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
