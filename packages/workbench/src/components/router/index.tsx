import { useLocationProperty, navigate } from 'wouter/use-location'
import { Router, BaseLocationHook, Route, Switch } from 'wouter'
import makeCachedMatcher from 'wouter/matcher'
import { parse } from 'regexparam'
import { useMemo } from 'react'

import { useWorkbenchPage, useWorkbenchPages, useWorkbenchProviders } from '../hooks'
import { useFiarAppStore } from '../../context'
import { MemoryRouter } from './memory'

const hashNavigate = (to: string) => navigate('#/' + to.replace(/^\//, ''))
const hashLocation = () => window.location.hash.replace(/^#/, '') || '/'
const useHashLocation: BaseLocationHook = () => [useLocationProperty(hashLocation), hashNavigate]
const matcher = makeCachedMatcher((path: string) => {
  const { keys, pattern } = parse(path)
  return { keys: keys.map((name) => ({ name })), regexp: pattern }
})

export const WorkbenchRouter = (p: {
  children: React.ReactNode
  routing?: 'hash' | 'memory' | 'browser' | undefined
  basename?: string | undefined
  inital?: string
}) => {
  if (p.routing === 'hash') {
    return (
      <Router hook={useHashLocation} base={p.basename as string} matcher={matcher}>
        {p.children}
      </Router>
    )
  }
  if (p.routing === 'memory') {
    return (
      <MemoryRouter initialPath={p.inital as string} base={p.basename as string} matcher={matcher}>
        {p.children}
      </MemoryRouter>
    )
  }
  return (
    <Router base={p.basename as string} matcher={matcher}>
      {p.children}
    </Router>
  )
}

export const WorkbenchPages = () => {
  const pages = useWorkbenchPages()
  return pages.map((name) => <PageRoute key={name} component={name} />)
}

const PageRoute = (p: { component: `workbench:page:${string}` }) => {
  const page = useWorkbenchPage(p.component)
  if (!page) return undefined
  return (
    <Switch key={page.title}>
      <Route path={`/${page.path}`}>{page.element}</Route>
      <Route path={`/${page.path}/(.*)`}>{page.element}</Route>
    </Switch>
  )
}

export const WorkbenchProviders = (p: { children: JSX.Element }) => {
  const providers = useWorkbenchProviders()
  const store = useFiarAppStore()
  return useMemo(
    () =>
      providers.reduce((a, name) => {
        const Provider = store.getState().components[name]
        if (!Provider) return a
        return <Provider>{a}</Provider>
      }, p.children),
    [providers],
  )
}
